import $ from 'jquery';

type StreamChatMap = Record<string, string>;

async function fetchStreamerChatsFromGithub(): Promise<StreamChatMap> {
  const response = await fetch(
    'https://raw.githubusercontent.com/joshhoughton/Twitch-Chat-on-YouTube/refs/heads/master/channels/stream_chat.json'
  );
  if (!response.ok) {
    throw new Error('Error fetching data:');
  }
  return response.json() as Promise<StreamChatMap>;
}

async function fetchTwitchUsernameFromGithub(
  youtubeChannelName: string
): Promise<string | null> {
  try {
    const data = await fetchStreamerChatsFromGithub();
    return data[youtubeChannelName.toLowerCase()] ?? null;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

function saveTwitchChatForYoutubeUser(
  twitchUsername: string,
  youtubeUserName: string
): void {
  chrome.storage.local.set({ [youtubeUserName]: twitchUsername });
}

function fetchYoutubeVideoHeight(): number {
  const youtubeVideo = document.querySelector('video');
  if (!youtubeVideo) {
    return 0;
  }
  return youtubeVideo.clientHeight;
}

function fetchYoutubeChannelId(): string | null {
  const anchorElement = document.querySelector<HTMLAnchorElement>(
    'ytd-video-owner-renderer a.yt-simple-endpoint.style-scope.yt-formatted-string'
  );

  if (anchorElement) {
    return anchorElement.href
      .replace('https://www.youtube.com/@', '')
      .toLowerCase();
  }

  return null;
}

function checkIfDarkMode(): boolean {
  return (
    !!window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function fetchYoutubeChatFrame(): JQuery<HTMLElement> {
  return $('ytd-live-chat-frame');
}

function displayTwitchChat(username: string): void {
  const youtubeChatFrame = fetchYoutubeChatFrame();

  youtubeChatFrame.empty();

  youtubeChatFrame.css({
    'flex-direction': 'row',
    '-webkit-flex-direction': 'row',
    height: `${fetchYoutubeVideoHeight()}px`,
  });

  const url = `https://www.twitch.tv/embed/${username}/chat?${checkIfDarkMode() ? 'darkpopout' : ''}&parent=www.youtube.com"`;

  youtubeChatFrame.prepend(
    `<iframe id="twitch_iframe" style="flex: auto;" src="${url}">
            </iframe>`
  );
}

async function fetchUsernameFromLocalStorage(
  youtubeChannelName: string
): Promise<string | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get([youtubeChannelName], (result) => {
      resolve(result[youtubeChannelName] as string | undefined);
    });
  });
}

function promptForTwitchUsername(): string | null {
  return prompt('Enter the streamer Twitch username:');
}

async function main(): Promise<void> {
  const storedTimestamp = Number(localStorage.getItem('storedTimestamp'));
  const currentTimestamp = Date.now();

  if (currentTimestamp - storedTimestamp < 2000) {
    const username = promptForTwitchUsername();
    if (username) {
      const youtubeChannelId = fetchYoutubeChannelId();
      if (youtubeChannelId) {
        saveTwitchChatForYoutubeUser(username, youtubeChannelId);
      }
      displayTwitchChat(username);
      localStorage.setItem('storedTimestamp', String(currentTimestamp));
      return;
    }
  } else {
    localStorage.setItem('storedTimestamp', String(currentTimestamp));
  }

  const youtubeUserName = fetchYoutubeChannelId();
  if (!youtubeUserName) {
    return;
  }

  let twitchUsername =
    (await fetchUsernameFromLocalStorage(youtubeUserName)) ?? null;

  if (!twitchUsername) {
    twitchUsername = await fetchTwitchUsernameFromGithub(youtubeUserName);
  }

  if (!twitchUsername) {
    const username = promptForTwitchUsername();
    if (username) {
      saveTwitchChatForYoutubeUser(username, youtubeUserName);
      displayTwitchChat(username);
    }
  } else {
    displayTwitchChat(twitchUsername);
  }
}

void main();
