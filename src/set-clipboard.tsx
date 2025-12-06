import {
  List,
  ActionPanel,
  Action,
  closeMainWindow,
  showToast,
  Toast
} from "@vicinae/api";

import { isClipboardOnly, setClipboardOnly } from "./utils";
import { useEffect, useState } from "react";

export default function Command() {
  const [state, setState] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setState(await isClipboardOnly());
    })();
  }, []);

  if (state === null) return null;

  const title = state ? "Disable clipboard-only" : "Enable clipboard-only";

  return (
    <List>
      <List.Item
        title={title}
        subtitle={`Current: ${state ? "Enabled" : "Disabled"}`}
        actions={
          <ActionPanel>
            <Action
              title={title}
              onAction={async () => {
                const next = !state;
                await setClipboardOnly(next);

                await showToast(
                  Toast.Style.Success,
                  `Clipboard mode ${next ? "enabled" : "disabled"}`
                );

                closeMainWindow();
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
