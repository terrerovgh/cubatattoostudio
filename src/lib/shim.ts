// Polyfill for MessageChannel in Cloudflare Workers if missing
// Required for React 19
if (typeof globalThis.MessageChannel === 'undefined') {
    const { MessageChannel, MessagePort } = await import('node:worker_threads');
    // @ts-expect-error - Polyfilling global
    globalThis.MessageChannel = MessageChannel;
    // @ts-expect-error - Polyfilling global
    globalThis.MessagePort = MessagePort;
}
