suggestions = {
    "esl": "esl_csgo",
    "blast": "blastpremier"
}

function getSuggestion(){
    title = document.getElementsByTagName('title')[0].text.toLowerCase()
    
    suggestion = undefined
    
    for (const s in suggestions){
        if (title.includes(s)){
            suggestion = suggestions[s]
        }
    }

    return suggestion
}

function showTwitchChat() {
    ytChat = $("ytd-live-chat-frame")

    ytChat.empty()
    
    ytChat.css({
        "flex-direction": "row",
        "-webkit-flex-direction": "row"
    })
    
    url = `https://www.twitch.tv/embed/${username}/chat?${document.documentElement.getAttribute("dark") ? "darkpopout&" : ""}parent=www.youtube.com"`

    ytChat.prepend(
        `<iframe style="flex: auto;" src="${url}">
        </iframe>`
    )
    
}


username = prompt("Enter a Twitch username:", getSuggestion());

if (username) {
    showTwitchChat()
}
