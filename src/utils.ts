import { LocalStorage, showToast, Toast } from "@vicinae/api";
import { execSync } from "node:child_process";

const KEY_CLIPBOARD = "hyprshot_clipboard";
const KEY_DELAY = "hyprshot_delay";
const KEY_DIRECTORY = "hyprshot_directory";

export type HyprshotMode = "output" | "window" | "region";


export async function isClipboardOnly(): Promise<boolean> {
  const raw = await LocalStorage.getItem<string>(KEY_CLIPBOARD);
  return raw === "1";
}

export async function setClipboardOnly(v: boolean): Promise<void> {
  await LocalStorage.setItem(KEY_CLIPBOARD, v ? "1" : "0");
}


export async function getDelay(): Promise<number> {
  const raw = await LocalStorage.getItem<string>(KEY_DELAY);
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function setDelay(seconds: number): Promise<void> {
  const safe = Math.max(0, Math.floor(seconds));
  await LocalStorage.setItem(KEY_DELAY, String(safe));
}

export async function getDirectory(): Promise<string> {
  const stored = await LocalStorage.getItem<string>(KEY_DIRECTORY);
  return stored || `${process.env.HOME}/Pictures`;
}

export async function setDirectory(path: string): Promise<void> {
  await LocalStorage.setItem(KEY_DIRECTORY, path);
}


export async function runHyprshot(mode: HyprshotMode): Promise<void> {
  try {
    execSync("hyprshot --help", { stdio: "ignore" });
  } catch {
    await showToast(Toast.Style.Failure, "Hyprshot is not installed");
    return;
  }

  const delay = await getDelay();
  const clipboard = await isClipboardOnly();
  const directory = await getDirectory();

  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay * 1000));
  }

  const args = ["hyprshot", "-m", mode];

  if (clipboard) {
    args.push("--clipboard-only");
  } else {
    args.push("-o", directory);
  }

  try {
    execSync(args.join(" "), { stdio: "pipe" });
  } catch (error: any) {
    const stderr = String(error?.stderr ?? "");

    if (
      stderr.includes("cancelled") ||
      stderr.includes("invalid geometry") ||
      stderr.includes("selection cancelled")
    ) {
      return;
    }

    await showToast(
      Toast.Style.Failure,
      "Hyprshot error",
      stderr || String(error)
    );
  }
}
