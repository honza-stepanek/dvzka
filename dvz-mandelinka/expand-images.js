
$('.modal-image-container').click(function () {
    if ($(this).toggleClass('modal-expanded').hasClass('modal-expanded')) {
        let maxWidth = parseInt($('tw-story').css('width'));
        let maxHeight = parseInt($('tw-story').css('height'));

        let curW = $(this).width();

        let imgW = $('.modal-image-container.modal-expanded img').css('width');
        let pHeight = $('.modal-image-container.modal-expanded p').css('width', imgW).height();
        let curH = $(this).height() + pHeight;

        console.log(maxWidth, curW, maxHeight, curH);

        let scl = Math.min(maxWidth / (curW + 30), maxHeight / (curH + 50), 2);
        
        let transX = $('tw-passage').width() / 2 - curW / 2;
        let transY = maxHeight / 2 - (($(this).offset().top + $('tw-passage').offset().top) + curH / 2);
        // TODO make better Y translate descision based on height of the image and current position of viewport, etc.
        console.log('translating x:', transX, 'translating y:', transY, 'scaling:', scl);
        
        $(this).prop('modal-animation', anime({
            targets: document.querySelectorAll('.modal-expanded'),
            translateX: transX,
            translateY: transY,
            scale: scl,
            duration: 400,
            easing: 'cubicBezier(0.660, 0.010, 0.485, 0.995)'
        }));
        $(this).css('z-index', 20);
        $(this).prop('modal-animation').play();
    } else {
        let modAnim = $(this).prop('modal-animation');
        modAnim.direction = "reverse";
        modAnim.complete = () => {
            $(this)[0].style = "";
        };
        modAnim.play();
    }
});