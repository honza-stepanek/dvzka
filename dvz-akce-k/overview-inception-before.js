// If needed to be still Twine compatible add:
// $("head").append('<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>');
{
    $("tw-link").css("display", "none")[0].id = "actual-link";

    $("<tw-link>A to je konec?</tw-link>", {
        id: 'deroute-link'
    }).on("click", async function() {
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
}