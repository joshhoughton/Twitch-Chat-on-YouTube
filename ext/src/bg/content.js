username = prompt("Enter a Twitch username:", "esl_csgo");

ytChat = $("ytd-live-chat-frame")

ytChat.empty()

ytChat.css({
    "flex-direction": "row",
    "-webkit-flex-direction": "row"
})


ytChat.prepend(
    `<iframe style="flex: auto;" src="https://www.twitch.tv/embed/${username}/chat?parent=www.youtube.com">
    </iframe>`
)
