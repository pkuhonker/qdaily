import * as qs from 'query-string';
import * as config from '../constants/config';

const urlPrefix = config.domain + config.apiPath;
const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

async function filterJSON(res: Response) {
    return res.json();
}

function filterStatus(res: Response) {
    if (res.status >= 200 && res.status < 300) {
        return res;
    } else {
        const error = new Error(res.statusText);
        throw error;
    }
}

export async function get(url: string, params?: { [key: string]: any }) {
    url = urlPrefix + url;
    if (params) {
        url += `?${qs.stringify(params)}`;
    }

    if (isDebuggingInChrome) {
        console.info('GET: ', url);
        console.info('Params: ', params);
    }
    return filterJSON(filterStatus(await fetch(url)));
}

export async function post(url: string, body?: { [key: string]: any }) {
    url = urlPrefix + url;

    if (isDebuggingInChrome) {
        console.info('POST: ', url);
        console.info('Body: ', body);
    }

    return filterJSON(filterStatus(await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })));
}
