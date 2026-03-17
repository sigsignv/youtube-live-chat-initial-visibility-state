import { defineCustomEventMessaging } from "@webext-core/messaging/page";

interface ChannelSchema {
  sync(value: boolean): void;
}

export const channel = defineCustomEventMessaging<ChannelSchema>({
  namespace: "youtube-live-chat-collapsed-by-default",
});
