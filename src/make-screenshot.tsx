import { List, ActionPanel, Action, closeMainWindow } from "@vicinae/api";
import { runHyprshot } from "./utils";

export default function Command() {
  return (
    <List searchBarPlaceholder="Choose screenshot mode">
      <List.Item
        title="Workspace"
        subtitle="Capture entire output"
        actions={
          <ActionPanel>
            <Action
              title="Capture Workspace"
              onAction={async () => {
                closeMainWindow(); 
                await runHyprshot("output");
              }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Window"
        subtitle="Capture active window"
        actions={
          <ActionPanel>
            <Action
              title="Capture Window"
              onAction={async () => {
                closeMainWindow();
                await runHyprshot("window");
              }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Selection"
        subtitle="Capture region"
        actions={
          <ActionPanel>
            <Action
              title="Capture Selection"
              onAction={async () => {
                closeMainWindow();
                await runHyprshot("region");
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
