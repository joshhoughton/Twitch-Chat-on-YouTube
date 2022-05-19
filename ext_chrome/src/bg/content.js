suggestions = {
    "esl": "esl_csgo",
    "blast": "blastpremier",
    "pgl": "pgl"
}

function getSuggestion(){
    title = document.getElementsByTagName('title')[0].text.toLowerCase()
    
    suggestion = ""
    
    for (const s in suggestions){
        if (title.includes(s)){
            suggestion = suggestions[s]
        }
    }

    return suggestion
}

function showTwitchChat(username) {
    ytChat = $("ytd-live-chat-frame")

    ytChat.empty()
    
    ytChat.css({
        "flex-direction": "row",
        "-webkit-flex-direction": "row",
        "height": "90vh" 
    })
    
    url = `https://www.twitch.tv/embed/${username}/chat?${document.documentElement.getAttribute("dark") ? "darkpopout&" : ""}parent=www.youtube.com"`

    ytChat.prepend(
        `<iframe style="flex: auto;" src="${url}">
        </iframe>`
    )
    
}

username = prompt("Enter a Twitch username:", getSuggestion());

if (username) {
    showTwitchChat(username)
}
