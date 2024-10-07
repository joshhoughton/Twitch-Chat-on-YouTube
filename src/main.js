async function onlineFetchStreamerChats() {
  const response = await fetch(
    'https://raw.githubusercontent.com/joshhoughton/Twitch-Chat-on-YouTube/refs/heads/master/channels/stream_chat.json'
  );
  if (!response.ok) {
    throw new Error('Error fetching data:');
  }
  return response.json();
}

async function fetchTwitchUsernameFromGithub(youtubeChannelName) {
  try {
    const data = await fetchStreamerChatsFromGithub();
    return data[youtubeChannelName.toLowerCase()];
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

function saveTwitchChatForYoutubeUser(twitchUsername, youtubeUserName) {
  chrome.storage.local.set({ [youtubeUserName]: twitchUsername });
}

function fetchYoutubeVideoHeight() {
  let youtubeVideo = document.querySelector('video');
  return youtubeVideo.clientHeight;
}

function fetchYoutubeChannelId() {
  let anchorElement = '';
  anchorElement = document.querySelector(
    'ytd-video-owner-renderer a.yt-simple-endpoint.style-scope.yt-formatted-string'
  );

  if (anchorElement) {
    return anchorElement.href
      .replace('https://www.youtube.com/@', '')
      .toLowerCase();
  } else {
    return null;
  }
}

function checkIfDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function fetchYoutubeChatFrame() {
  return $('ytd-live-chat-frame');
}

function displayTwitchChat(username) {
  let youtubeChatFrame = fetchYoutubeChatFrame();

  youtubeChatFrame.empty();

  youtubeChatFrame.css({
    'flex-direction': 'row',
    '-webkit-flex-direction': 'row',
    height: `${fetchYoutubeVideoHeight()}px`,
  });

  url = `https://www.twitch.tv/embed/${username}/chat?${checkIfDarkMode() ? 'darkpopout' : ''}&parent=www.youtube.com"`;

  youtubeChatFrame.prepend(
    `<iframe id="twitch_iframe" style="flex: auto;" src="${url}">
            </iframe>`
  );
}

async function fetchUsernameFromLocalStorage(youtubeChannelName) {
  return new Promise((resolve) => {
    chrome.storage.local.get([youtubeChannelName], function (result) {
      resolve(result[youtubeChannelName]);
    });
  });
}

function promptForTwitchUsername() {
  return prompt('Enter the streamer Twitch username:');
}

async function main() {
  let storedTimestamp = localStorage.getItem('storedTimestamp');
  let currentTimestamp = Date.now();

  if (currentTimestamp - storedTimestamp < 2000) {
    let username = promptForTwitchUsername();
    if (username) {
      saveTwitchChatForYoutubeUser(username, fetchYoutubeChannelId());
      displayTwitchChat(username);
      localStorage.setItem('storedTimestamp', currentTimestamp);
      return;
    }
  } else {
    localStorage.setItem('storedTimestamp', currentTimestamp);
  }

  let youtubeUserName = fetchYoutubeChannelId();

  let twitchUsername = await fetchUsernameFromLocalStorage(youtubeUserName);

  if (!twitchUsername) {
    twitchUsername = await fetchTwitchUsernameFromGithub(youtubeUserName);
  }

  if (!twitchUsername) {
    let username = promptForTwitchUsername();
    if (username) {
      saveTwitchChatForYoutubeUser(username, fetchYoutubeChannelId());
      displayTwitchChat(username);
    }
  } else {
    displayTwitchChat(twitchUsername);
  }
}

main();
