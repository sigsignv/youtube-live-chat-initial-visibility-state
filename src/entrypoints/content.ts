import { defineContentScript, injectScript } from "#imports";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    await injectScript("/injected.js");

    ctx.onInvalidated(() => {
      console.log("[Collapsed by Default] Content script unloaded");
    });
  },
});
