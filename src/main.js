
async function onlineFetchStreamerChats() {
    const response = await fetch('https://raw.githubusercontent.com/koobzaar/Twitch-Chat-on-YouTube/refs/heads/master/channels/stream_chat.json');
    if (!response.ok) {
        throw new Error('Error fetching data:');
    }
    return response.json();
}

async function getTwitchUsernameFromGithubDatabase(youtubeChannelName) {
    try {
        const data = await onlineFetchStreamerChats();
        return data[youtubeChannelName.toLowerCase()];
    } catch (error) {
        console.error('Error fetching data: ', error);
        return null;
    }
}

function storeTwitchChatForThatYoutuber(twitchUsername, youtubeUserName){
    chrome.storage.local.set({[youtubeUserName]: twitchUsername});
}

function getYoutubeVideoHeight(){
    let youtubeVideo = document.querySelector('video');
    return youtubeVideo.clientHeight;
}

function getChannelId() { 
    let anchorElement = "";
    anchorElement = document.querySelector('ytd-video-owner-renderer a.yt-simple-endpoint.style-scope.yt-formatted-string');
    
    if (anchorElement) {
        
        return anchorElement.href.replace('https://www.youtube.com/@', '').toLowerCase();
    } else {
        return null;
    }
}


function getYoutubeChatFrame(){
    return $("ytd-live-chat-frame")
}


function showTwitchChat(username) {
    let youtubeChatFrame = getYoutubeChatFrame()

    youtubeChatFrame.empty()

    youtubeChatFrame.css({
        "flex-direction": "row",
        "-webkit-flex-direction": "row",
        "height": `${getYoutubeVideoHeight()}px`
    })
    
    url = `https://www.twitch.tv/embed/${username}/chat?darkpopout&parent=www.youtube.com"`

    youtubeChatFrame.prepend(
        `<iframe id="twitch_iframe" style="flex: auto;" src="${url}">
        </iframe>`
    )
    
}

async function getUsernameFromLocalStorage(youtubeChannelName) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([youtubeChannelName], function(result) {
            resolve(result[youtubeChannelName]);
        });
    });
}

function askUserFromTwitchUsername(){
    return prompt("Enter the streamer Twitch username:");
}

async function main() {

    let storedTimestamp = localStorage.getItem('storedTimestamp');
    let currentTimestamp = Date.now();
    
    if (currentTimestamp - storedTimestamp < 2000) {
        let username = askUserFromTwitchUsername();
        if (username) {
            storeTwitchChatForThatYoutuber(username, getChannelId());
            showTwitchChat(username);
            localStorage.setItem('storedTimestamp', currentTimestamp);
            return;
        }
    } 
    else{
        localStorage.setItem('storedTimestamp', currentTimestamp);
    }

    let youtubeUserName = getChannelId();

    let twitchUsername = await getUsernameFromLocalStorage(youtubeUserName);

    if (!twitchUsername) {
        twitchUsername = await getTwitchUsernameFromGithubDatabase(youtubeUserName);
    }

    if (!twitchUsername) {
        let username = askUserFromTwitchUsername();
        if (username) {
            storeTwitchChatForThatYoutuber(username, getChannelId());
            showTwitchChat(username);
        }
    } else {
        showTwitchChat(twitchUsername);
    }
}

main();