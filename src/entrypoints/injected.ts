import { defineUnlistedScript } from "#imports";
import { onLiveChatRendererReady } from "~/utils/events";

export default defineUnlistedScript(async () => {
  const script = document.currentScript;

  const remove = onLiveChatRendererReady((liveChat) => {
    if (liveChat.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED") {
      liveChat.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
      console.debug("Collapsed live chat automatically");
    }
  });

  const shutdown = () => {
    remove();
    console.debug("Shutting down injected script");
  };

  script?.addEventListener("extension:shutdown", shutdown, { once: true });
});
