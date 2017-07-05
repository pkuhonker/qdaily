// http://www.haorooms.com/post/jquery_scroll_upanddown
module.exports = `
function scroll(fn) {
    var beforeScrollTop = document.body.scrollTop;
    fn = fn || function () { };

    if (window.native && window.native.platform === 'ios') {
        var lastTouchY;
        window.document.addEventListener('touchstart', function(e) {
            lastTouchY = e.touches[0].clientY
        });

        window.document.addEventListener('touchmove', function(e) {
            var currentY = e.touches[0].clientY;
            if (currentY > lastTouchY) {
                fn('down');
            } else if (currentY < lastTouchY) {
                fn('up')
            }
            lastTouchY = currentY;
        });
    }

    window.addEventListener("scroll", function (event) {
        event = event || window.event;

        var afterScrollTop = document.body.scrollTop;
        var delta = afterScrollTop - beforeScrollTop;
        beforeScrollTop = afterScrollTop;

        var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;
        var windowHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        if (scrollTop + windowHeight >= scrollHeight) {
            fn('bottom');
            return;
        } else if (scrollTop === 0) {
            fn('top');
            return;
        }
        if (Math.abs(delta) < 3) {
            return false;
        }
        fn(delta > 0 ? "down" : "up");
    });
}

var last_direction = '';
scroll(function(direction) {
    if (last_direction === 'bottom' && direction === 'down') {
        return;
    }
    if (last_direction === 'top' && direction === 'up') {
        return;
    }
    if (last_direction !== direction) {
        last_direction = direction;
        window.bridge.callHandler('_toNative::onScroll', direction);
    }
});
`;