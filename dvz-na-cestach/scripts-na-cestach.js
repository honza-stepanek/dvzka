// insert libraries
// $("body").prepend(
//     '<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></'+'script>\
//     ')

const WP_RESOURCES_URL = 'http://digikult.phil.muni.cz/wp-content/DVZ/cesi-na-cestach/resources/'

document.initAAP = function () {
    if (document.ambientAudioPlayer) { return; }

    $('body').prepend('<audio id="ambient-audio" src="" loop></audio>');
    $('#ambient-audio')[0].volume = 0.15;

    const pauseButton = document.createElement('tw-icon');
    pauseButton.setAttribute('tabindex', 0);
    pauseButton.setAttribute('alt', 'Pause/Play');
    pauseButton.setAttribute('title', 'Pause/Play');
    pauseButton.innerHTML = `<img src="${WP_RESOURCES_URL}/pause-icon.svg">`;

    const volumeButton = document.createElement('tw-icon');
    volumeButton.setAttribute('tabindex', 0);
    volumeButton.setAttribute('alt', 'Adjust volume');
    volumeButton.setAttribute('title', 'Adjust volume');
    volumeButton.innerHTML = `<img src="${WP_RESOURCES_URL}/loud2-icon.svg">`;

    const disableToggleButton = document.createElement('tw-icon');
    disableToggleButton.setAttribute('tabindex', 0);
    disableToggleButton.setAttribute('alt', 'Enable/disable background audio');
    disableToggleButton.setAttribute('title', 'Enable/disable background audio');
    disableToggleButton.innerHTML = `<img src="${WP_RESOURCES_URL}/disable-sound-icon.svg">`;

    let audioObject = {
        audio: $('#ambient-audio')[0],
        pauseButton,
        pausePlayIcons: {
            true: `<img src="${WP_RESOURCES_URL}/play-icon.svg">`, // paused
            false: `<img src="${WP_RESOURCES_URL}/pause-icon.svg">`, // playing
        },
        volumeButton,
        volumeIcons: {
            1: `<img src="${WP_RESOURCES_URL}/loud1-icon.svg">`,
            2: `<img src="${WP_RESOURCES_URL}/loud2-icon.svg">`,
            3: `<img src="${WP_RESOURCES_URL}/loud3-icon.svg">`
        },
        disableToggleButton,
        disableToggleIcons: {
            true: `<img src="${WP_RESOURCES_URL}/enable-sound-icon.svg">`, // disabled
            false: `<img src="${WP_RESOURCES_URL}/disable-sound-icon.svg">`, // enabled
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
            if (!this.disabled) { // is not yet but will be disabled
                this.pauseButtonPress(true);
            }
            this.disabled = !this.disabled;
            if (!this.disabled) { // it just got enabled
                this.pauseButtonPress(false);
            }
            this.disableToggleButton.innerHTML = this.disableToggleIcons[this.disabled];
            $('tw-sidebar').toggleClass('aap-disabled', this.disabled); // TODO  set the class whenever setting up
        },

        volumeButtonPress() {
            if (this.disabled) { return; }
            this.audio.volume = (this.audio.volume + 0.1) % 0.3;
            this.volumeButton.innerHTML =
                this.mapVolumeToIcon(this.audio.volume);
        },

        mapVolumeToIcon(fl) {
            return this.volumeIcons[Math.round(fl * 10 + 0.25)];
        },

        fadeOutPlayback() {
            const origVolume = this.audio.volume;
            for (let i = 0; i < 10; i += 1) {
                setTimeout(() => {
                    this.audio.volume = (origVolume / 9) * (9 - i);
                }, i * 100); // fade out over 900 ms
            }
            setTimeout(() => {
                this.pauseButtonPress(true);
                this.audio.volume = origVolume;
            }, 1000);
        },
    }

    document.ambientAudioPlayer = audioObject;

    audioObject.pauseButton.addEventListener('click', function() {
        document.ambientAudioPlayer.pauseButtonPress();
    });
    audioObject.volumeButton.addEventListener('click', function() {
        document.ambientAudioPlayer.volumeButtonPress();
    });
    audioObject.disableToggleButton.addEventListener('click', function() {
        document.ambientAudioPlayer.disableToggleButtonPress();
    });
}

// Setup AAP for the current tw-passage
// if the source is being set to a different one, the audio autoplays
// if the source is the same the audio remains paused/playing
// if true is passed as second argument the audio will always autoplay 
document.setupAAP = function (source, alwaysAutoplay=false) {
    if (!document.ambientAudioPlayer) {
        document.initAAP();
    }
    const aap = document.ambientAudioPlayer;
    
    // append the controls to the sidebar and set audio source
    if (source && aap.audio.getAttribute('src') != source) {
        aap.audio.setAttribute('src', source);
        if (!aap.disabled && aap.audio.paused) {
            aap.pauseButtonPress(false);
        }
    }

    if (!aap.disabled && alwaysAutoplay && aap.audio.paused) {
        aap.pauseButtonPress(false);
    }

    $('tw-sidebar')[0].appendChild(aap.pauseButton);
    $('tw-sidebar')[0].appendChild(aap.volumeButton);
    $('tw-sidebar')[0].appendChild(aap.disableToggleButton);
    $('tw-sidebar').toggleClass('aap-disabled', aap.disabled);
}

// stop the playback unless current tw-passage has the setup script in it
document.maybeStopAAP = function () {
    const aap = document.ambientAudioPlayer;
    if (!aap || aap.audio.paused) { return; }

    if (!$('script#aap-setup').length) {
        aap.fadeOutPlayback();
    }
}

