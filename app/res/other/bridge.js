module.exports = `
var handlers = {};
window.bridge = window.bridge || {};

// https://github.com/facebook/react-native/issues/10865
(function() {
    if (!window.native || window.native.platform === 'android' || !window.native.dev) {
        return;
    }
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
    };

    window.postMessage = patchedPostMessage;
})();

function sendToNative(name, options) {
    window.postMessage(JSON.stringify({ name: name, options: options }));
}

window.bridge.callHandler = function (name, options) {
    sendToNative(name, options);
};

window.bridge.registerHandler = function (name, handler) {
    handlers[name] = handlers[name] || [];
    handlers[name].push(handler);
};

window.addEventListener('message', function (ev) {
    var data = JSON.parse(ev.data);
    var name = data.name;
    if (handlers[name]) {
        handlers[name].forEach(function (handle) {
            handle(data.options)
        }, this);
    }
});

var registeLinkPress = function () {
    var list = document.querySelectorAll('a');
    for (var i = 0; i < list.length; i++) {
        var element = list[i];
        element.addEventListener('click', function (e) {
            e.preventDefault();
            sendToNative('_toNative::onLinkPress', e.currentTarget.href);
        });
    }
};

if (document.readyState !== 'complete') {
    window.addEventListener('load', registeLinkPress);
} else {
    registeLinkPress();
}

setTimeout(function(){
    sendToNative('_toNative::user', window.navigator.userAgent)
}, 1000);
`;