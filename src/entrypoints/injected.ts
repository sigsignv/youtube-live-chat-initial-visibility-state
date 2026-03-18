import { defineUnlistedScript } from "#imports";
import { onPageDataFetched } from "~/utils/events";
import type { LiveChatRenderer } from "~/utils/types";

export default defineUnlistedScript(async () => {
  const script = document.currentScript;

  onPageDataFetched((liveChat) => {
    if (!liveChat) {
      return;
    }

    if (isInitiallyExpanded(liveChat)) {
      liveChat.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
      console.debug("[Collapsed by Default] live chat collapsed");
    }
  });
});

function isInitiallyExpanded(liveChat: LiveChatRenderer) {
  return liveChat.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
}
