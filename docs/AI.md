# AI System & Chat Assistant

The core feature of the website is the intelligent **Studio Concierge**, powered by a client-side Large Language Model (LLM).

## Architecture

### 1. The Model
*   **Model ID**: `Xenova/Qwen1.5-0.5B-Chat`
*   **Source**: Hugging Face Hub.
*   **Size**: ~0.5 Billion parameters (quantized for web).
*   **Why this model?**: It is small enough to run in a browser but capable enough to handle conversational instruction following.

### 2. Web Worker Implementation (`src/lib/ai-worker.js`)
To prevent blocking the main UI thread, the AI model runs in a dedicated Web Worker.
*   **Library**: `@xenova/transformers`
*   **Pipeline**: `text-generation`
*   **Communication**: Uses `postMessage` to receive prompts from the React component and stream back generated tokens.

### 3. Frontend Component (`src/components/AI/ChatAssistant.tsx`)
The `ChatAssistant` component manages the chat interface, state, and logic switching.

#### Modes
1.  **Offline / Static Mode**:
    *   Used when the model is not yet loaded or if the user is offline.
    *   Matches user input against `staticResponses` defined in the content collection (e.g., "hours", "location").
    *   Can trigger the Booking Flow.

2.  **Online / AI Mode**:
    *   Active once the model is downloaded and loaded into memory.
    *   Generates dynamic responses using the LLM.
    *   Injects a `systemPrompt` and `knowledgeBase` (studio info) into the context.

3.  **Booking Mode (Wizard)**:
    *   A deterministic state machine that guides the user through booking steps.
    *   **Steps**: Age Check -> Artist Selection -> Placement -> Size -> Style -> Idea -> Reference Image -> Contact Info -> Verification.
    *   **Validation**: Validates email, phone, and verification codes locally.
    *   **Hybrid**: Can be triggered manually or by the AI detecting intent (e.g., "I want to book an appointment").

## Model Management

### Downloading
The model files are downloaded to `public/models/` using the script:
```bash
npm run download-model
```
This ensures the model assets are served as static files from the same origin, avoiding CORS issues and improving load reliability.

### Caching
The browser will cache the model files after the first visit. Subsequent loads will be significantly faster.

### WebGPU
The system attempts to use WebGPU for acceleration. If unavailable, it falls back to WASM (slower).

## Booking Flow Logic

The booking flow is defined in the `bookingSteps` array (loaded from `src/content/chat` or falling back to defaults).

1.  **Input Types**:
    *   `text`: Standard text input.
    *   `option`: Displays clickable buttons (e.g., Artist names).
    *   `image`: Shows file upload button.
    *   `date`: Shows the Calendar component.

2.  **Dossier**:
    *   Collects all answers into a `bookingData` object.
    *   At the end of the flow, presents a summary ("Dossier") for review.

3.  **Verification**:
    *   Includes a simulated email verification step (sending a 6-digit code).
