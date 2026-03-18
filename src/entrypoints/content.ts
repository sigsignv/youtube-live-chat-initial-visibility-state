import { defineContentScript, injectScript } from "#imports";
import { liveChatCollapsed } from "~/utils/storage";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    const { script } = await injectScript("/injected.js", {
      modifyScript: async (script) => {
        const shouldCollapse = await liveChatCollapsed.getValue();
        script.dataset.shouldCollapse = shouldCollapse ? "true" : "false";
      },
    });

    const unwatch = liveChatCollapsed.watch((value) => {
      script.dispatchEvent(
        new CustomEvent("extension:config-updated", {
          detail: { shouldCollapse: value },
        }),
      );
    });
    ctx.onInvalidated(() => unwatch());

    ctx.onInvalidated(() => {
      console.log("[Collapsed by Default] Content script unloaded");
    });
  },
});
