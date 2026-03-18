import { createSignal, onMount } from "solid-js";
import { liveChatCollapsed } from "~/utils/storage";

import "./App.css";

function App() {
  const [isLiveCollapsed, setIsLiveCollapsed] = createSignal(true);

  onMount(async () => {
    const fetchLiveCollapsed = liveChatCollapsed
      .getValue()
      .then((value) => setIsLiveCollapsed(value));
    liveChatCollapsed.watch((value) => setIsLiveCollapsed(value));

    await Promise.allSettled([fetchLiveCollapsed]);
  });

  return (
    <form>
      <fieldset>
        <legend>Live Chat</legend>
        <label>
          Auto expanded:
          <input
            type="checkbox"
            checked={!isLiveCollapsed()}
            onChange={async (e) => {
              await liveChatCollapsed.setValue(!e.target.checked);
            }}
          />
        </label>
      </fieldset>
    </form>
  );
}

export default App;
