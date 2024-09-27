
async function fetchStreamChatData() {
    const response = await fetch('https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/stream_chat.json');
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
    const youtubeVideo = document.querySelector('video'); // Supondo que o vídeo do YouTube seja um elemento <video>
    return youtubeVideo.clientHeight;
}
function getChannelId() {
    const anchorElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
    if (anchorElement) {
        return anchorElement.href.replace('https://www.youtube.com/@', '').toLowerCase();
    } else {
        console.error('Elemento não encontrado');
        return null;
    }
}


function getYoutubeChatFrame(){
    return $("ytd-live-chat-frame")
}

function showTwitchChat(username) {
    const youtubeChatFrame = getYoutubeChatFrame()

    youtubeChatFrame.empty()

    youtubeChatFrame.css({
        "flex-direction": "row",
        "-webkit-flex-direction": "row",
        "height": `${getYoutubeVideoHeight()}px`
    })
    
    url = `https://www.twitch.tv/embed/${username}/chat?darkpopout&parent=www.youtube.com"`

    youtubeChatFrame.prepend(
        `<iframe style="flex: auto;" src="${url}">
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

/*

    TODO: If user declare the twitch username wrong, there's no way to change it.
    Fix: Add a html support for the extension that returns a list of all users and a button to change it.
*/
async function main() {
    const youtubeUserName = getChannelId();
    console.log("username:", youtubeUserName);

    // Primeiro, tente obter o nome de usuário do JSON
    let twitchUsername = await getUsernameFromJson(youtubeUserName);
    console.log("Returned from JSON: ", twitchUsername);

    // Se não estiver no JSON, tente obter do armazenamento local
    if (!twitchUsername) {
        twitchUsername = await getUsernameFromLocalStorage(youtubeUserName);
        console.log("Returned from local storage: ", twitchUsername);
    }

    if (!twitchUsername) {
        console.log('User not stored yet. Returned: ', twitchUsername);
        const username = askUserFromTwitchUsername();
        if (username) {
            storeTwitchChatForThatYoutuber(username, getChannelId());
            showTwitchChat(username);
        }
    } else {
        showTwitchChat(twitchUsername);
    }
}

main();