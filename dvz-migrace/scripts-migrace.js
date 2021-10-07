// insert libraries
// $("body").prepend(
//     '<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></'+'script>\
//     ')


document.initAAP = function () {
    if (document.ambientAudioPlayer) { return; }

    $("body").prepend('<audio id="ambient-audio" src="" loop></audio>');
    $("#ambient-audio")[0].volume = 0.15;

    const pauseButton = document.createElement("tw-icon");
    pauseButton.setAttribute("tabindex", 0);
    pauseButton.setAttribute("alt", "Pause/Play");
    pauseButton.setAttribute("title", "Pause/Play");
    pauseButton.innerHTML = '<img src="resources/pause-icon.svg">';

    const volumeButton = document.createElement("tw-icon");
    volumeButton.setAttribute("tabindex", 0);
    volumeButton.setAttribute("alt", "Adjust volume");
    volumeButton.setAttribute("title", "Adjust volume");
    volumeButton.innerHTML = '<img src="resources/loud2-icon.svg">';

    let audioObject = {
        audio: $("#ambient-audio")[0],
        pauseButton: pauseButton,
        playIcon: '<img src="resources/play-icon.svg">',
        pauseIcon: '<img src="resources/pause-icon.svg">',
        volumeButton: volumeButton,
        volumeIcons: {
            1: '<img src="resources/loud1-icon.svg">',
            2: '<img src="resources/loud2-icon.svg">',
            3: '<img src="resources/loud3-icon.svg">'
        },

        pauseButtonPress() {
            if (this.audio.paused) {
                this.audio.play();
                this.pauseButton.innerHTML = this.pauseIcon;
                return;
            }
            this.audio.pause();
            this.pauseButton.innerHTML = this.playIcon;
        },

        volumeButtonPress() {
            this.audio.volume = (this.audio.volume + 0.1) % 0.3;
            this.volumeButton.innerHTML =
                this.mapVolumeToIcon(this.audio.volume);
        },

        mapVolumeToIcon(fl) {
            return this.volumeIcons[Math.round(fl * 10 + 0.25)];
        }
    }

    document.ambientAudioPlayer = audioObject;

    audioObject.pauseButton.addEventListener("click", function() {
        document.ambientAudioPlayer.pauseButtonPress();
    });
    audioObject.volumeButton.addEventListener("click", function() {
        document.ambientAudioPlayer.volumeButtonPress();
    });
}

// Setup AAP for the current tw-passage
// if the source is being set to a different one, the audio autoplays
// if the source is the same the audio remains paused/playing
// if true is passed as second argument the audio will always autoplay 
document.setupAAP = function (source, always_autoplay=false) {
    if (!document.ambientAudioPlayer) {
        document.initAAP();
    }
    
    // append the controls to the sidebar and set audio source
    if (document.ambientAudioPlayer.audio.getAttribute("src") != source) {
        document.ambientAudioPlayer.audio.setAttribute("src", source);
        if (document.ambientAudioPlayer.audio.paused) {
            document.ambientAudioPlayer.pauseButtonPress();
        }
    }

    if (always_autoplay && document.ambientAudioPlayer.audio.paused) {
        document.ambientAudioPlayer.pauseButtonPress();
    }

    $("tw-sidebar")[0].appendChild(document.ambientAudioPlayer.pauseButton);
    $("tw-sidebar")[0].appendChild(document.ambientAudioPlayer.volumeButton);
}

// Stop AAP playback after the previous tw-passage
document.stopAAP = function () {
    if (!document.ambientAudioPlayer || document.ambientAudioPlayer.audio.paused) {
        return;
    }

    const orig_volume = document.ambientAudioPlayer.audio.volume;
    for (let i = 0; i < 10; i += 1) {
        setTimeout(function () {
            document.ambientAudioPlayer.audio.volume = (orig_volume / 9) * (9 - i);
        }, i * 100); // fade out over 900 ms
    }
    setTimeout(function () {
        document.ambientAudioPlayer.pauseButtonPress();
        document.ambientAudioPlayer.audio.volume = orig_volume;
    }, 1000);
}

