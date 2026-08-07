type StreamChatMap = Record<string, string>;

const STREAM_CHAT_URL =
  'https://raw.githubusercontent.com/joshhoughton/Twitch-Chat-on-YouTube/refs/heads/master/channels/stream_chat.json';

async function fetchStreamChatMap(): Promise<StreamChatMap> {
  const response = await fetch(STREAM_CHAT_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch stream chat map');
  }
  return response.json() as Promise<StreamChatMap>;
}

export async function fetchTwitchUsernameFromGithub(
  youtubeChannelName: string
): Promise<string | null> {
  try {
    const data = await fetchStreamChatMap();
    return data[youtubeChannelName.toLowerCase()] ?? null;
  } catch (error) {
    console.error('Error fetching preset Twitch usernames: ', error);
    return null;
  }
}
