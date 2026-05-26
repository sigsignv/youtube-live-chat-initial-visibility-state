import { createSignal, onMount } from "solid-js";
import { liveChatBehaviorStorage } from "~/utils/storage";
import type { LiveChatBehavior } from "~/utils/types";

export default function App() {
  const [liveChatBehavior, setLiveChatBehavior] =
    createSignal<LiveChatBehavior>("followDefault");

  onMount(async () => {
    liveChatBehaviorStorage.watch((newValue) => {
      setLiveChatBehavior(newValue);
    });

    const behavior = await liveChatBehaviorStorage.getValue();
    setLiveChatBehavior(behavior);
  });

  return (
    <div>
      <label>
        Live Chat:
        <select
          value={liveChatBehavior()}
          onChange={(e) =>
            liveChatBehaviorStorage.setValue(
              e.currentTarget.value as LiveChatBehavior,
            )
          }
        >
          <option value="followDefault">Follow default</option>
          <option value="forceExpanded">Always expanded</option>
          <option value="forceCollapsed">Always collapsed</option>
        </select>
      </label>
    </div>
  );
}
