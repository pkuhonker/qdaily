// http://www.haorooms.com/post/jquery_scroll_upanddown
module.exports = `
function scroll(fn) {
    var beforeScrollTop = document.body.scrollTop;
    fn = fn || function () { };

    window.addEventListener("scroll", function (event) {
        event = event || window.event;

        var afterScrollTop = document.body.scrollTop;
        var delta = afterScrollTop - beforeScrollTop;
        beforeScrollTop = afterScrollTop;

        var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;
        var windowHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        if (scrollTop + windowHeight >= scrollHeight) {
            fn('bottom', scrollTop);
            return;
        } else if (scrollTop <= 0) {
            fn('top', scrollTop);
            return;
        }
        if (Math.abs(delta) < 3) {
            return false;
        }
        fn(delta > 0 ? "down" : "up", scrollTop);
    });
}

var last_direction = '';
var last_position = 0;
scroll(function(direction, position) {
    if (last_direction !== direction || direction === 'bottom' || direction === 'top' ||
        (last_position < 200 && position > 200) || (last_position > 200 && position < 200)) {
        last_direction = direction;
        window.bridge.callHandler('_toNative::onScroll', { direction: direction, position: position });
    }
    last_position = position;
});
`;