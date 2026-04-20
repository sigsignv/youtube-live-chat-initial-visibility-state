import { defineUnlistedScript } from "#imports";
import { onLiveChatRendererReady } from "~/utils/events";
import { isLiveChatBehavior, type LiveChatBehavior } from "~/utils/storage";

export default defineUnlistedScript(async () => {
  const script = document.currentScript;
  if (!script) {
    throw new Error("script element not found");
  }

  let liveChatBehavior: LiveChatBehavior = "followDefault";

  const handler = (event: Event) => {
    if (event instanceof CustomEvent) {
      const maybeLiveChatBehavior = event.detail;
      if (isLiveChatBehavior(maybeLiveChatBehavior)) {
        liveChatBehavior = maybeLiveChatBehavior;
      }
    }
  };
  script.addEventListener("extension:liveChatBehavior", handler);

  const dispose = onLiveChatRendererReady((r) => {
    switch (liveChatBehavior) {
      case "followDefault":
        // Do nothing
        break;
      case "forceCollapsed":
        if (r.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED") {
          r.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
          console.debug("Collapsed live chat automatically");
        }
        break;
      case "forceExpanded":
        if (r.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_COLLAPSED") {
          r.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
          console.debug("Expanded live chat automatically");
        }
        break;
      default: {
        const _unreachableCheck: never = liveChatBehavior;
        break;
      }
    }
  });

  const shutdown = () => {
    dispose();
    script.removeEventListener("extension:liveChatBehavior", handler);
  };

  script.addEventListener("extension:shutdown", shutdown, { once: true });
});
