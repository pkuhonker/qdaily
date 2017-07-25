import { Middleware } from "redux";
import * as Toast from '../components/base/Toast';

let lastToast = {
    time: Date.now(),
    message: ''
};

function showToast(message: string) {
    if (Date.now() - lastToast.time < 3000 && lastToast.message === message) {
        return;
    }
    Toast.show(message);
    lastToast.time = Date.now();
    lastToast.message = message;
}

const fetchErrorMiddleware: Middleware = store => next => action => {
    const { meta = Object.create(null), error, payload } = action;
    const { sequence = Object.create(null) } = meta;
    if (sequence.type !== 'next') {
        return next(action);
    }

    // do callback
    if (error) {
        if (payload instanceof Error &&
            payload.message.indexOf('Network request failed') >= 0) {
            showToast('网络请求失败');
        } else {
            showToast('未知错误: ' + payload);
        }
    }
    next(action);
};

export default fetchErrorMiddleware;