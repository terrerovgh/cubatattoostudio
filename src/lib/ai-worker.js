
import { pipeline, env } from '@xenova/transformers';

// Skip local checks to download from Hugging Face Hub if not cached
env.allowLocalModels = false;

// We'll use a singleton pattern for the pipeline
class PipelineSingleton {
    static task = 'text-generation';
    static model = 'HuggingFaceTB/SmolLM2-135M-Instruct';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
                device: 'webgpu', // Use WebGPU if available
                dtype: 'fp32', // Use fp32 for broader compatibility, or q4/q8 if model supports it
            });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const { type, text, max_new_tokens = 128 } = event.data;

    if (type === 'generate') {
        let generator = await PipelineSingleton.getInstance((data) => {
            // Send download progress back to main thread
            self.postMessage({ type: 'progress', data });
        });

        // Formatting the prompt for an instruction tuned model
        // SmolLM2-Instruct uses a specific chat template format hopefully handled by the tokenizer,
        // but for safety in raw text generation:
        const messages = [
            { role: "system", content: "You are a helpful AI assistant for Cuba Tattoo Studio. Answer succinctly." },
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
    }
});
