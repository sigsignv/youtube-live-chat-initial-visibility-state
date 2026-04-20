import { defineContentScript, injectScript } from "#imports";
import { liveChatBehaviorStorage } from "~/utils/storage";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    const { script } = await injectScript("/injected.js", {
      modifyScript: (script) => {
        const unwatch = liveChatBehaviorStorage.watch((newValue) => {
          script.dispatchEvent(
            new CustomEvent("extension:liveChatBehavior", {
              detail: newValue,
            }),
          );
        });
        ctx.onInvalidated(unwatch);
      },
    });

    const liveChatBehavior = await liveChatBehaviorStorage.getValue();
    script.dispatchEvent(
      new CustomEvent("extension:liveChatBehavior", {
        detail: liveChatBehavior,
      }),
    );

    ctx.addEventListener(document, "yt-navigate-finish", () => {
      if (ctx.isInvalid) {
        script.dispatchEvent(new Event("extension:shutdown"));
      }
    });
  },
});
