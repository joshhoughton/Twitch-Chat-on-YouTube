function storageGet(keys: string[]): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => resolve(result));
  });
}

function storageSet(values: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => resolve());
  });
}

export function saveTwitchUsername(
  twitchUsername: string,
  youtubeChannelId: string
): void {
  void storageSet({ [youtubeChannelId]: twitchUsername });
}

export async function loadTwitchUsername(
  youtubeChannelId: string
): Promise<string | undefined> {
  const result = await storageGet([youtubeChannelId]);
  const value = result[youtubeChannelId];
  return typeof value === 'string' ? value : undefined;
}
