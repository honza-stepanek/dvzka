/**
 * script setting up event listeners for clicks on modal images
 * requires anim.js and jQuery
 */
$('.modal-image-container').click(function (event) {
    if ($(this).toggleClass('modal-expanded').hasClass('modal-expanded')) {
        // expanding

        $(this).css('transition', '');
        // clearing transition from potential previous run of the else branch 

        const maxWidth = parseInt($('tw-story').css('width'));
        const curW = $(this).width();
        
        const scl = Math.min(maxWidth / (curW + 20), 2);
        const transX = $('tw-passage').width() / 2 - curW / 2;
        
        const pHeight = $(this).children('p').css({'width': curW, 'height': 'auto'}).height();
        const divHeight = $(this).height();
        const topOverflow = ($(this)[0].getBoundingClientRect().top + 
                          window.scrollY -
                          divHeight * (scl - 1) / 2 -
                          20) * -1;
        const transY = Math.max(0, topOverflow);
        const bottomOverflow = ($('tw-passage')[0].getBoundingClientRect().bottom -
                              $(this)[0].getBoundingClientRect().bottom - 
                              divHeight * (scl - 1) / 2 -
                              pHeight * scl) * -1 +
                              transY + 40;

        console.log('p height:', pHeight * scl, 'upper overflow:', topOverflow, 'bottom overflow:', bottomOverflow, 'scaling:', scl);
        
        $(this).prop('modal-animation', anime({
            targets: $(this)[0],
            translateX: transX,
            translateY: transY,
            scale: scl,
            duration: 400,
            easing: 'cubicBezier(0.660, 0.010, 0.485, 0.995)'
        }));

        if (bottomOverflow > 0) {
            $('tw-passage').css('padding-bottom', "+=" + bottomOverflow);
        }
        $(this).css('z-index', 20);
        $(this).prop('modal-animation').play();
    } else {
        // collapsing

        let modAnim = $(this).prop('modal-animation');
        modAnim.direction = "reverse";
        modAnim.complete = () => {
            $(this)[0].style = "transition: transform 300ms";
            // if the div hasn't come back to its original place
            // it will smoothly-ish transition back to it
        };
        modAnim.play();
    }
});