import { displayTwitchChat } from './chat/display';
import { fetchTwitchUsernameFromGithub } from './github';
import {
  loadTwitchUsername,
  saveTwitchUsername,
} from './storage';
import { getChannelId } from './youtube';

function promptForTwitchUsername(): string | null {
  return prompt('Enter the streamer Twitch username:');
}

async function resolveTwitchUsername(
  youtubeChannelId: string
): Promise<string | null> {
  const stored = await loadTwitchUsername(youtubeChannelId);
  if (stored) {
    return stored;
  }

  const fromGithub = await fetchTwitchUsernameFromGithub(youtubeChannelId);
  if (fromGithub) {
    return fromGithub;
  }

  const typed = promptForTwitchUsername();
  if (typed) {
    saveTwitchUsername(typed, youtubeChannelId);
    return typed;
  }

  return null;
}

async function main(): Promise<void> {
  const storedTimestamp = Number(localStorage.getItem('storedTimestamp'));
  const currentTimestamp = Date.now();

  // Double-click (two activations within 2s) prompts for a new username.
  if (currentTimestamp - storedTimestamp < 2000) {
    const username = promptForTwitchUsername();
    if (username) {
      const youtubeChannelId = getChannelId();
      if (youtubeChannelId) {
        saveTwitchUsername(username, youtubeChannelId);
      }
      displayTwitchChat(username);
      localStorage.setItem('storedTimestamp', String(currentTimestamp));
    }
    return;
  }

  localStorage.setItem('storedTimestamp', String(currentTimestamp));

  const youtubeChannelId = getChannelId();
  if (!youtubeChannelId) {
    return;
  }

  const twitchUsername = await resolveTwitchUsername(youtubeChannelId);
  if (twitchUsername) {
    displayTwitchChat(twitchUsername);
  }
}

void main();
