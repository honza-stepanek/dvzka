
$.getScript("https://code.jquery.com/jquery-3.6.0.min.js", () => {
    // callback - jQuery is loaded

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js", () => {
        // nested callback - jQuery and anime.js are loaded

        $.getScript("https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js", () => {
            // tripple nested callback - jQuery, anime.js and html2canvas are loaded

            document.inceptionAnimationScript = {
                before: () => {

                    $("tw-link").css("display", "none")[0].id = "actual-link";

                    $("<tw-link>A to je konec?</tw-link>", {
                        id: 'deroute-link'
                    }).on("click", async function () {
                        let canvas = await html2canvas(
                            document.body,
                            {
                                height: window.innerHeight,
                                y: window.scrollY,
                                scale: devicePixelRatio * 0.5
                            }
                        );
                        canvas.style.position = "fixed";
                        canvas.style.top = "0";
                        canvas.style["z-index"] = "10";
                        await document.body.appendChild(canvas);
                        document.inceptionImage = await canvas.toDataURL();

                        $("#actual-link").click();

                    }).appendTo("tw-passage");

                },

                after: () => {

                    const divWidth = $("tw-passage").width();
                    let divHeight = divWidth * 9 / 16;
                    console.log(divWidth, divHeight);
                    let inceptionDiv = $("<div/>", { id: "inception-image" }).css({
                        backgroundColor: "black",
                        backgroundImage: "url(" + document.inceptionImage + ")",
                        backgroundPosition: "center top",
                        backgroundSize: "cover",
                        width: "100%",
                        height: divHeight,
                        margin: "0 auto",
                        zIndex: "420"
                    });
                    $("tw-passage").prepend(inceptionDiv);

                    const scl = window.innerWidth / $("#inception-image").width();
                    const changedHeight = window.innerHeight / scl;
                    let transY = window.innerHeight / 2
                        - $("#inception-image")[0].getBoundingClientRect().top
                        - window.scrollY - changedHeight / 2;

                    document.animation = anime({
                        begin: () => { $("canvas").remove() },
                        endDelay: 300,
                        direction: "reverse",
                        targets: "#inception-image",
                        translateY: transY,
                        height: changedHeight,
                        scale: scl,
                        duration: 1500,
                        easing: 'cubicBezier(0.660, 0.010, 0.485, 0.995)'
                    });
                }
            }

        });
    });
});
