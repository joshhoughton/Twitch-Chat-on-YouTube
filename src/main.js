
async function fetchStreamChatData() {
    const response = await fetch('https://raw.githubusercontent.com/koobzaar/Twitch-Chat-on-YouTube/refs/heads/master/channels/stream_chat.json');
    if (!response.ok) {
        throw new Error('Erro ao buscar dados do JSON');
    }
    return response.json();
}

async function getUsernameFromJson(youtubeChannelName) {
    try {
        const data = await fetchStreamChatData();
        return data[youtubeChannelName];
    } catch (error) {
        console.error('Erro ao buscar dados do JSON:', error);
        return null;
    }
}

function storeTwitchChatForThatYoutuber(twitchUsername, youtubeUserName){
    chrome.storage.local.set({[youtubeUserName]: twitchUsername});
}

function getYoutubeVideoHeight(){
    let youtubeVideo = document.querySelector('video'); // Supondo que o vídeo do YouTube seja um elemento <video>
    return youtubeVideo.clientHeight;
}

function getChannelId() { 
    let anchorElement = "";
    anchorElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
    
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
    return prompt("Enter a Twitch username:");
}

async function main() {

    let storedTimestamp = localStorage.getItem('storedTimestamp');
    let currentTimestamp = Date.now();
    
    if (currentTimestamp - storedTimestamp < 2000) {
        let username = prompt("Enter the new Twitch Channel Chat for this current YouTube Channel:");
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
    console.log("username:", youtubeUserName);

    let twitchUsername = await getUsernameFromJson(youtubeUserName);
    console.log("Returned from JSON: ", twitchUsername);

    if (!twitchUsername) {
        twitchUsername = await getUsernameFromLocalStorage(youtubeUserName);
        console.log("Returned from local storage: ", twitchUsername);
    }

    if (!twitchUsername) {
        console.log('User not stored yet. Returned: ', twitchUsername);
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