(function ($) {
    "use strict"
    jQuery(document).ready(function () {
        // // Navigation for Mobile Device
        $('.custom-navbar').on('click', function () {
            $('.main-menu ul').slideToggle(500);
        });
        $(window).on('resize', function () {
            if ($(window).width() > 767) {
                $('.main-menu ul').removeAttr('style');
            }
        });

        // Employee Slider
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

        // Nice Select
        $('select').niceSelect();

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

        // Google Map
        if ($('#mapBox').length) {
            var $lat = $('#mapBox').data('lat');
            var $lon = $('#mapBox').data('lon');
            var $zoom = $('#mapBox').data('zoom');
            var $marker = $('#mapBox').data('marker');
            var $info = $('#mapBox').data('info');
            var $markerLat = $('#mapBox').data('mlat');
            var $markerLon = $('#mapBox').data('mlon');
            var map = new GMaps({
                el: '#mapBox',
                lat: $lat,
                lng: $lon,
                scrollwheel: false,
                scaleControl: true,
                streetViewControl: false,
                panControl: true,
                disableDoubleClickZoom: true,
                mapTypeControl: false,
                zoom: $zoom,
                styles: [
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#dcdfe6"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [
                            {
                                "color": "#808080"
                            },
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#dcdfe6"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#ffffff"
                            },
                            {
                                "weight": 1.8
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#d7d7d7"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#ebebeb"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#a7a7a7"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#efefef"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#696969"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#737373"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#d6d6d6"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {},
                    {
                        "featureType": "poi",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#dadada"
                            }
                        ]
                    }
                ]
            });
        }

    });

    jQuery(window).on('load', function () {
        // WOW JS
        new WOW().init();
        // Preloader
        $('.preloader').fadeOut(500);
    });

})(jQuery);

$(document).ready(function () {
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
        url: "/more",
        data: dataString,
        cache: false,
        success: function f(html) {
            if (html !== undefined && html !== null) {
                parent.append(html);
            }
        }
    }).done(callback());
}

function sendSearchMore(JCID,type,level,keyword,callback) {
    var dataString = 'click_more=2&JCID='+ JCID + '&type=' + type + '&level=' + level + '&keyword=' + keyword;
    var parent = $('#search-table');
    event.preventDefault();
    $.ajax({
        type: "post",
        url: "/more",
        data: dataString,
        cache: false,
        success: function f(html) {
            if (html !== undefined && html !== null) {
                parent.append(html);
            }
        }
    }).done(callback());
}
