
import { pipeline, env } from '@xenova/transformers';

// Skip local checks to download from Hugging Face Hub if not cached
// Configure for local model usage
env.allowLocalModels = true;
env.useBrowserCache = false; // Disable browser cache when serving locally to avoid duplication/issues, or keep true if appropriate. 
// Actually for local files, browser cache is less critical if served with correct headers, but `env.useBrowserCache` in transformers.js caches in Cache API.
// If we serve locally, we might not need the Cache API duplication if we rely on HTTP cache. 
// But transformers.js cache API is specific.
// Let's keep it false for local usage to rely on direct fetching or standard browser caching of static assets.
env.useBrowserCache = false;

class PipelineSingleton {
    static task = 'text-generation';
    static model = 'Xenova/Qwen1.5-0.5B-Chat';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
                device: 'webgpu',
                dtype: 'fp32',
                local_files_only: true, // Force local files
            });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const { type, text, max_new_tokens = 128, systemPrompt, knowledgeBase } = event.data;

    if (type === 'generate') {
        try {
            let generator = await PipelineSingleton.getInstance((data) => {
                // Send download progress back to main thread
                self.postMessage({ type: 'progress', data });
            });

            // Construct dynamic system prompt
            let finalSystemContent = systemPrompt || "You are a helpful AI assistant.";
            if (knowledgeBase) {
                finalSystemContent += `\n\nContext/Knowledge Base:\n${knowledgeBase}`;
            }

            // Formatting the prompt for an instruction tuned model
            const messages = [
                { role: "system", content: finalSystemContent },
                { role: "user", content: text }
            ];

            // We can just pass the messages if the pipeline supports chat inputs (newer transformers.js do),
            // or we might need to apply a template. transformers.js v3 supports chat inputs for text-generation.

            // Generate response
            const output = await generator(messages, {
                max_new_tokens: max_new_tokens,
                temperature: 0.7,
                callback_function: (beams) => {
                    // Stream back tokens as they are generated
                    const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, { skip_special_tokens: true });
                    self.postMessage({ type: 'update', text: decodedText });
                }
            });

            // Send final result
            // Note: 'output' format depends on the pipeline result.
            // Usually it returns an array of objects or just the text.
            // For chat inputs, it returns the conversation including the new response.
            const finalText = output[0]?.generated_text?.at(-1)?.content || JSON.stringify(output);

            self.postMessage({ type: 'complete', text: finalText });
        } catch (error) {
            self.postMessage({ type: 'error', error: error.message });
        }
    }
});
