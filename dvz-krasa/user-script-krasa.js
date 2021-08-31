window.smoothScroller = {
    container: document.getElementsByTagName("body")[0],
    scrollStack: 0,
    scroll: function (deltaY) {
        this.scrollStack += deltaY;
    },
    update: function () {
        if (Math.abs(this.scrollStack) >= 1) {
            const diff = this.scrollStack * 0.25;
            this.container.scrollLeft += diff;
            this.scrollStack -= diff;
        }
    }
};

window.addEventListener("wheel", function (e) {
    if (!e.target.classList.contains("block-horizontal-scroll")) {
        window.smoothScroller.scroll(e.deltaY);
    }
});

window.smoothScroller.intervalID = window.setInterval(() => {
    window.smoothScroller.update();
}, 15);

// global flag array for audio elements that have been autoplayed
// document.galleryPlayCurator = function () {
//     let curator = document.getElementsByClassName("curator")[0];
//     if (curator) {
//         curator.play();
//     }
// };

document.galleryInitCuratorControls = function () {
    $("audio.curator").on("ended", function () {
        $("#playback-button").attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/play.svg");
    });
    $("#playback-button").on("click", async function () {
        let curator = $("audio.curator")[0];
        if (curator.paused) {
            try {
                await curator.play();
            } catch {
                return;
            }
            $(this).attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/pause.svg");
        } else {
            $(this).attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/play.svg");
            curator.pause();
        }
    });

    $("#volume-button").attr("value", 2);
    $("#volume-button").on("click", function () {
        $(this).attr("value", (_, v) => {return (parseInt(v) + 1) % 4})
        $("audio.curator")[0].volume = (parseInt($(this).attr("value")) + 1) / 4;
        $(this).attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/loud"
            + $(this).attr("value") + ".svg");
    });
}

document.galleryInitCuratorTranscriptButton = function () {
    $("#curator-transcript-button").on("click", function () {
        let changed = $(".curator-wrapper").toggleClass("active");
        if (changed.hasClass("active")) {
            $(this).attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/transcript-close.svg");
        } else {
            $(this).attr("src", "https://digikult.phil.muni.cz/wp-content/DVZ/krasa/resources/transcript.svg");
        }
    });
}

document.galleryResizer = function () {
    $("div.gallery-wall-space").each(function (i) {
        const img = $(this).find("img")[0];
        if (img) {
            const ratio = img.naturalWidth / img.naturalHeight;
            const width = ratio * Math.min($(this).height(), img.naturalHeight);
            if (width < 150) {
                return;
            }
            $(this).width(width);
            // console.log(i, img.naturalWidth, img.naturalHeight, width);
        }
    });
}
window.addEventListener("resize", document.galleryResizer);


// openable Map for orientation
document.galleryInitMapButton = function () {
    $("#map-button").on("click", function () {
        $("#map-button-wrapper").toggleClass("map-pulled-out");
    });
}


// On fragment change, stop all audio elements
document.galleryAddHashChangeHandler = function () {
    window.addEventListener('hashchange', document.galleryHandleHashChange);
};

document.galleryHandleHashChange = function () {
    $("audio").each(function(){
        this.pause();
        this.currentTime = 0;
    });
};

