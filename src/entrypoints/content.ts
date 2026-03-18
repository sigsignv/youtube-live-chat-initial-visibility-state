import { defineContentScript, injectScript } from "#imports";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    const { script } = await injectScript("/injected.js");

    ctx.addEventListener(document, "yt-navigate-finish", () => {
      if (ctx.isInvalid) {
        script.dispatchEvent(new Event("extension:shutdown"));
      }
    });
  },
});
