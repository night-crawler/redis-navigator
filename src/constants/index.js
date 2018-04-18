export const MAX_CONTENT_AUTOLOAD_SIZE = 10 * 1024;


export const DEFAULT_SEARCH_KEYS_PARAMS = {
    scanCount: 5000,
    pattern: '*',
    sortKeys: true,
    ttlSeconds: 5 * 60,
    perPage: 500,
};


export const REDIS_KEY_TYPE_ICON_MAP = {
    list: {
        name: 'list layout',
        color: 'green',
    },
    set: {
        name: 'align left',
        color: 'brown',
    },
    zset: {
        name: 'sort content ascending',
        color: 'orange',
    },
    hash: {
        name: 'hashtag', // 'sitemap',
        color: 'violet',
    },
    string: {
        name: 'quote right',
        color: 'blue',
    },
    none: {
        name: 'question',
        color: 'pink'
    },
};


export const KEY_VIEWER_SEARCH_TIMEOUT = 300;

export const NAVBAR_HEIGHT = 45;

export const KEY_VIEWER_KEYS_MIN_WIDTH = 300;
