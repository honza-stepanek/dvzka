const audioButton = document.createElement("tw-icon");
audioButton.setAttribute("tabindex", 0);
audioButton.setAttribute("alt", "Mute/Unmute");
audioButton.setAttribute("title", "Mute/Unmute");
// the button icons:
// https://commons.wikimedia.org/wiki/File:Speaker_Icon.svg
const audioButtonUnmutedIcon = '<img src="Speaker_Icon.svg">';
// https://commons.wikimedia.org/wiki/File:Mute_Icon.svg
const audioButtonMutedIcon = '<img src="Mute_Icon.svg">';
const audioButtonIcons = {
    0: audioButtonMutedIcon,
    0.5: audioButtonUnmutedIcon
}
audioButton.innerHTML = audioButtonUnmutedIcon;

const twPass = document.getElementsByTagName('tw-passage')[0];
const passageAudio = twPass.getElementsByTagName('audio')[0];
if (passageAudio) { passageAudio.volume = 0.5; }
audioButton.addEventListener ("click", function() {
    if (!passageAudio) {
        console.log("Whoops can't find the <audio> element!");
        return;
    }
    passageAudio.volume = (passageAudio. volume + 0.5) % 1;
    audioButton.innerHTML = audioButtonIcons[passageAudio.volume];
  });

const sidebar = twPass.getElementsByTagName("tw-sidebar")[0];
sidebar.style.visibility = "visible";
sidebar.appendChild(audioButton);
