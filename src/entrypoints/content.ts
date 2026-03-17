import { defineContentScript, injectScript } from "#imports";
import { channel } from "@/utils/messaging";
import { liveChatCollapsed, liveChatReplayCollapsed } from "@/utils/storage";
import type { WatchPageResponse } from "@/utils/types";

declare global {
  interface DocumentEventMap {
    "yt-navigate-finish": CustomEvent<{
      response?: { response?: WatchPageResponse };
    }>;
  }
}

type NavigationFinishEvent = DocumentEventMap["yt-navigate-finish"];

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    await injectScript("/injected.js", {
      modifyScript: async (script) => {
        const shouldCollapse = await liveChatCollapsed.getValue();
        script.dataset.shouldCollapse = shouldCollapse ? "true" : "false";
      },
    });

    const unwatch = liveChatCollapsed.watch((value) =>
      channel.sendMessage("sync", value),
    );
    ctx.onInvalidated(() => unwatch());

    ctx.addEventListener(document, "yt-navigate-finish", async (ev) => {
      try {
        const shouldCollapse = await liveChatReplayCollapsed.getValue();
        if (shouldCollapse) {
          return;
        }
      } catch {
        console.log("[Collapsed by Default] Unable to access storage");
        return;
      }

      if (!hasLiveChatReplay(ev)) {
        return;
      }

      const id = ctx.setInterval(() => {
        const button = findOpenChatButton();
        if (button) {
          button.click();
          console.debug("[Collapsed by Default] live chat replay expanded");
          clearInterval(id);
        }
      }, 100);

      const timeout = AbortSignal.timeout(10000);
      timeout.addEventListener("abort", () => clearInterval(id), {
        once: true,
      });
    });

    ctx.onInvalidated(() => {
      console.log("[Collapsed by Default] Content script unloaded");
    });
  },
});

function hasLiveChatReplay(ev: NavigationFinishEvent) {
  return (
    ev.detail.response?.response?.contents?.twoColumnWatchNextResults
      ?.conversationBar?.liveChatRenderer?.isReplay === true
  );
}

function findOpenChatButton(root: Document | HTMLElement = document) {
  return root.querySelector<HTMLElement>(
    "#show-hide-button:not([hidden]) > ytd-button-renderer.ytd-live-chat-frame",
  );
}
