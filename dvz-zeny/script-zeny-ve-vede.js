// Adding accessibility toggle functionality

document.twStoryAcc = {
    toggle: function() {
        $("body").toggleClass("accessibility-mode");
    },

    init: function() {
        $("#accessibility-toggle").on("click", document.twStoryAcc.toggle)
    }
}

