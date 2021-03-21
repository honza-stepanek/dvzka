// requires anime.js
{
    const divWidth = $("tw-passage").width();
    let divHeight = divWidth * 9/16;
    console.log(divWidth, divHeight);
    let inceptionDiv = $("<div/>", {id: "inception-image"}).css({
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
        begin: () => {$("canvas").remove()},
        endDelay: 300,
        direction: "reverse",
        targets: "#inception-image",
        translateY: transY,
        height: changedHeight,
        scale: scl,
        duration: 1500,
        easing: 'cubicBezier(0.660, 0.010, 0.485, 0.995)'
    })
}