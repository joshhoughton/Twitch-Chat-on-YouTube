import { getChatFrame, prefersDarkMode } from '../youtube';

function buildTwitchEmbedUrl(username: string): string {
  const darkParam = prefersDarkMode() ? 'darkpopout' : '';
  return `https://www.twitch.tv/embed/${username}/chat?${darkParam}&parent=www.youtube.com`;
}

function createTwitchIframe(username: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.id = 'twitch_iframe';
  iframe.src = buildTwitchEmbedUrl(username);
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  return iframe;
}

export function displayTwitchChat(username: string): void {
  const chatFrame = getChatFrame();
  if (!chatFrame) {
    return;
  }

  chatFrame.replaceChildren(createTwitchIframe(username));
}
