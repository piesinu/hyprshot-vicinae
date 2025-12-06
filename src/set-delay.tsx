import {
  List,
  ActionPanel,
  Action,
  closeMainWindow,
  showToast,
  Toast,
} from "@vicinae/api";

import { getDelay, setDelay } from "./utils";
import { useState, useEffect } from "react";

export default function Command() {
  const [input, setInput] = useState("");
  const [currentDelay, setCurrentDelay] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getDelay();
      setCurrentDelay(d);
    })();
  }, []);

  if (currentDelay === null) return null;

  return (
    <List
      searchText={input}
      onSearchTextChange={setInput}
      searchBarPlaceholder="Enter delay in seconds"
    >
    <List.Item
    title={`Set new delay: ${input || "?"}s`}
    subtitle="Press Enter to confirm"
    actions={
        <ActionPanel>
        <Action
            title="Save"
            onAction={async () => {
            const num = Number(input);

            if (!input || isNaN(num) || num < 0) {
                await showToast(Toast.Style.Failure, "Invalid number");
                return;
            }

            await setDelay(num);
            await showToast(Toast.Style.Success, `Delay set to ${num}s`);
            closeMainWindow();
            }}
        />
        </ActionPanel>
    }
    />

      <List.Item
        title={`Current delay: ${currentDelay}s`}
        subtitle="Change delay using the field above"
      />

    </List>
  );
}
