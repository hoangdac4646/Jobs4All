$(document).ready(function () {
    new WOW().init();
    // Preloader
    $('.preloader').fadeOut(500);

    $('.custom-navbar').on('click', function () {
        $('.main-menu ul').slideToggle(500);
    });
    $(window).on('resize', function () {
        if ($(window).width() > 767) {
            $('.main-menu ul').removeAttr('style');
        }
    });

    $('.employee-slider').owlCarousel({
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        nav: false,
        dots: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });

    // Range Slider
    $("#range").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 5000,
        from: 1000,
        to: 4000,
        type: 'double',
        step: 1,
        prefix: "$",
        grid: true
    });

    $('#btn-more').click(function () {
        updateFileterTable();
    });
    $('#btn-search-more').click(function () {

    });
})

function updateFileterTable() {
    var btn = $('#btn-more');
    btn.attr("disabled", true);
    var recent = $('#recent');
    var parttime = $('#part-time');
    var fulltime = $('#full-time');
    var intern = $('#intern');
    if (recent.hasClass("active"))
    {
        sendMore("all",function () {
            btn.attr("disabled", false);
        })
    }
    if (parttime.hasClass("active"))
    {
        sendMore("part time",function () {
            btn.attr("disabled", false);
        })
    }
    if (fulltime.hasClass("active"))
    {
        sendMore("full time",function () {
            btn.attr("disabled", false);
        })
    }
    if (intern.hasClass("active"))
    {
        sendMore("intern",function () {
            btn.attr("disabled", false);
        })
    }

}

function sendMore(type,callback) {
    var dataString = 'click_more=1&type='+ type;
    var parent;
    if (type === "all") {
        parent = $('#recent');
    }
    else if (type === "part time") {
        parent = $('#part-time');
    } else if (type === "full time") {
        parent = $('#full-time');
    }
    else if (type === "intern") {
        parent = $('#intern');
    }
    event.preventDefault();
    $.ajax({
        type: "post",
        url: "/more-jobs",
        data: dataString,
        cache: false,
        success: function f(html) {
            if (html !== undefined && html !== null) {
                parent.append(html);
                callback();
            }
        }
    });
}

function sendSearchMore(JCID,type,level,keyword,callback) {
    var dataString = 'click_more=2&JCID='+ JCID + '&type=' + type + '&level=' + level + '&keyword=' + keyword;
    var parent = $('#search-table');
    event.preventDefault();
    $.ajax({
        type: "post",
        url: "/more-jobs",
        data: dataString,
        cache: false,
        success: function f(html) {
            if (html !== undefined && html !== null) {
                parent.append(html);
            }
        }
    })
}
