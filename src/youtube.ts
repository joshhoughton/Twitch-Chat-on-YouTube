export function getChatFrame(): HTMLElement | null {
  return document.querySelector('ytd-live-chat-frame');
}

export function getChannelId(): string | null {
  const anchor = document.querySelector<HTMLAnchorElement>(
    'ytd-video-owner-renderer a.yt-simple-endpoint.style-scope.yt-formatted-string'
  );
  if (!anchor) {
    return null;
  }
  return anchor.href.replace('https://www.youtube.com/@', '').toLowerCase();
}

export function prefersDarkMode(): boolean {
  return (
    !!window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}
