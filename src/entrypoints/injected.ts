import { defineUnlistedScript } from "#imports";
import { onPageDataFetched } from "~/utils/events";

export default defineUnlistedScript(async () => {
  const script = document.currentScript;

  const remove = onPageDataFetched((liveChat) => {
    if (liveChat.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED") {
      liveChat.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
      console.debug("Collapsed live chat automatically");
    }
  });

  const shutdown = () => {
    console.debug("Shutting down injected script");
    remove();
  };

  script?.addEventListener("extension:shutdown", shutdown, { once: true });
});
