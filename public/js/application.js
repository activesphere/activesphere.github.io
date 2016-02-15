/* global $ */
(function () {
    var footerPosTimeout;
    function positionFooter() {
        if (footerPosTimeout) {
            clearTimeout(footerPosTimeout);
        }
        footerPosTimeout = setTimeout(function () {
            var winH = $(window).height();
            var footer = $('footer');
            footer.css({
                position: 'inherit'
            });
            var footerH = footer.height();
            var footerTop = footer.offset().top;
            if (winH > footerTop + footerH - 2) {
                footer.css({
                    'position': 'absolute',
                    top: winH - footerH,
                    width: '100%'
                });
            }
        }, 200);
    }

    positionFooter();
    $(window).resize(positionFooter);
})();

$(function () {
    function reorder(grp) {
        var cnt = grp.length;

        var temp, x;
        for (var i = 0; i < cnt; i++) {
            temp = grp[i];
            x = Math.floor(Math.random() * cnt);
            grp[i] = grp[x];
            grp[x] = temp;
        }
        return grp;
    }

    // Shuffle profile
    var usWithRant = $('.j_bio').children().filter(function () {
      return $(this).hasClass('above');
    });

    var rest = $('.j_bio').children().filter(function () {
      return !$(this).hasClass('above');
    });

    if (usWithRant.length) {
        reorder(usWithRant);
        $(usWithRant).remove();
        $('.j_bio').append($(usWithRant));
    }

    rest.remove();
    $('.j_bio').append(rest);

    // Active Path
    $('.nav a[href="' + window.location.pathname + '"]')
        .addClass('active');

    // GA
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-10221263-10']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
});
