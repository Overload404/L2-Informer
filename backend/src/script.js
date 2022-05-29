var openPhotoSwipe = function () {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = [
        {
            src: './imgs/map/map_marker.jpg',
            w: 3276,
            h: 2620
        },
    ];

    var options = {
        history: false,
        focus: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
};

