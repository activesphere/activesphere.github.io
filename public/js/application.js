(function() {
  function setActiveClass(klass) {
    // Active Path
    var nav = document.querySelector(
      'nav a.link[href="' + window.location.pathname + '"]'
    );

    nav.className += ' ' + klass;
    // if (nav.classList) nav.classList.add(klass);
    // else ;
  }

  domReady(function() {
    setActiveClass('dn dib-ns as-bt4');
  });
})();

false &&
  $(function() {
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
    var usWithRant = $('.j_bio').children().filter(function() {
      return $(this).hasClass('above');
    });

    var rest = $('.j_bio').children().filter(function() {
      return !$(this).hasClass('above');
    });

    if (usWithRant.length) {
      reorder(usWithRant);
      $(usWithRant).remove();
      $('.j_bio').append($(usWithRant));
    }

    rest.remove();
    $('.j_bio').append(rest);

    // GA
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-10221263-10']);
    _gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = ('https:' == document.location.protocol
        ? 'https://ssl'
        : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
    })();
  });

(function() {
  // Header and Content
  function setContentMargin() {
    var $header = $('#header'), $content = $('#content');
    var contentPlacement = $header.position().top + $header.height();
    $content.css('margin-top', contentPlacement);
  }
  $(document).ready(function() {
    setContentMargin();
  });
  $(window).resize(function() {
    setContentMargin();
  });
})();

