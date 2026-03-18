import { defineUnlistedScript } from "#imports";
import { onPageDataFetched } from "~/utils/events";
import type { LiveChatRenderer } from "~/utils/types";

export default defineUnlistedScript(async () => {
  const script = document.currentScript;

  const remove = onPageDataFetched((liveChat) => {
    if (!liveChat) {
      return;
    }

    if (isInitiallyExpanded(liveChat)) {
      liveChat.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
      console.debug("[Collapsed by Default] live chat collapsed");
    }
  });

  const shutdown = () => {
    console.debug("Shutting down injected script");
    remove();
  };

  script?.addEventListener("extension:shutdown", shutdown, { once: true });
});

function isInitiallyExpanded(liveChat: LiveChatRenderer) {
  return liveChat.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
}
