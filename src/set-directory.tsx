import {
  List,
  ActionPanel,
  Action,
  closeMainWindow,
  showToast,
  Toast,
} from "@vicinae/api";

import { useState, useEffect } from "react";
import { getDirectory, setDirectory } from "./utils";
import fs from "node:fs";

export default function Command() {
  const [path, setPath] = useState("");
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const dir = await getDirectory();
      setCurrent(dir);
    })();
  }, []);

  if (current === null) return null;

  return (
    <List
      searchText={path}
      onSearchTextChange={setPath}
      searchBarPlaceholder="Paste folder path"
    >
      <List.Item
        title={`Set Directory To: ${path || "?"}`}
        subtitle="Press Enter to save"
        actions={
          <ActionPanel>
            <Action
              title="Save Directory"
              onAction={async () => {
                const trimmed = path.trim();

                if (!trimmed) {
                  await showToast(Toast.Style.Failure, "Path cannot be empty");
                  return;
                }

                if (!fs.existsSync(trimmed)) {
                  await showToast(
                    Toast.Style.Failure,
                    "Directory does not exist",
                    `Path:\n${trimmed}`
                  );
                  return;
                }

                await setDirectory(trimmed);

                await showToast(
                  Toast.Style.Success,
                  `Directory set:\n${trimmed}`
                );

                closeMainWindow();
              }}
            />
          </ActionPanel>
        }
      />
      
      <List.Item
        title="Current Directory"
        subtitle={current}
        accessories={[{ text: current }]}
      />
    </List>
  );
}
