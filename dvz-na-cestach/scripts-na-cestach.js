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

    const disableToggleButton = document.createElement("tw-icon");
    disableToggleButton.setAttribute("tabindex", 0);
    disableToggleButton.setAttribute("alt", "Enable/disable background audio");
    disableToggleButton.setAttribute("title", "Enable/disable background audio");
    disableToggleButton.innerHTML = '<img src="resources/pause-icon.svg" style="border: solid 2px red;">';
    // TODO  get icons for this

    let audioObject = {
        audio: $("#ambient-audio")[0],
        pauseButton,
        // playIcon: '<img src="resources/play-icon.svg">',
        // pauseIcon: '<img src="resources/pause-icon.svg">',
        pausePlayIcons: {
            true: '<img src="resources/play-icon.svg">', // paused
            flase: '<img src="resources/pause-icon.svg">', // playing
        },
        volumeButton,
        volumeIcons: {
            1: '<img src="resources/loud1-icon.svg">',
            2: '<img src="resources/loud2-icon.svg">',
            3: '<img src="resources/loud3-icon.svg">'
        },
        disableToggleButton,
        disableToggleIcons: {
            true: '<img src="resources/play-icon.svg" style="border: solid 2px red;">', // disabled
            false: '<img src="resources/pause-icon.svg" style="border: solid 2px red;">', // enabled
        },
        disabled: false,

        pauseButtonPress(value) {
            if (this.disabled) { return; }
            const newValue = value ?? !this.audio.paused
            if (newValue) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.pauseButton.innerHTML = this.pausePlayIcons[this.audio.paused];
        },
        
        disableToggleButtonPress() {
            this.disabled = !this.disabled;
            this.disabled && this.pauseButtonPress(true);
            this.disableToggleButton.innerHTML = this.disableToggleIcons[this.disabled];
            $('tw-sidebar').toggleClass('aap-disabled', this.disabled);
        },

        volumeButtonPress() {
            if (this.disabled) { return; }
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
    audioObject.disableToggleButton.addEventListener("click", function() {
        document.ambientAudioPlayer.disableToggleButtonPress();
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
    const aap = document.ambientAudioPlayer;
    
    // append the controls to the sidebar and set audio source
    if (aap.audio.getAttribute("src") != source) {
        aap.audio.setAttribute("src", source);
        if (!aap.disabled && aap.audio.paused) {
            aap.pauseButtonPress();
        }
    }

    if (!aap.disabled && always_autoplay && aap.audio.paused) {
        aap.pauseButtonPress();
    }

    $("tw-sidebar")[0].appendChild(aap.pauseButton);
    $("tw-sidebar")[0].appendChild(aap.volumeButton);
    $("tw-sidebar")[0].appendChild(aap.disableToggleButton);
}

// Stop AAP playback after the previous tw-passage
document.stopAAP = function () {
    if (!document.ambientAudioPlayerp || document.ambientAudioPlayer.audio.paused) {
        return;
    }
    const aap = document.ambientAudioPlayer;

    const orig_volume = aap.audio.volume;
    for (let i = 0; i < 10; i += 1) {
        setTimeout(function () {
            aap.audio.volume = (orig_volume / 9) * (9 - i);
        }, i * 100); // fade out over 900 ms
    }
    setTimeout(function () {
        aap.pauseButtonPress();
        aap.audio.volume = orig_volume;
    }, 1000);
}

