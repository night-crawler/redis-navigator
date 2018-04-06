export const DEFAULT_SEARCH_KEYS_PARAMS = {
    scanCount: 5000,
    pattern: '*',
    sortKeys: true,
    ttlSeconds: 5 * 60,
    perPage: 5,
};


export const REDIS_TYPE_ICON_MAP = {
    list: {
        name: 'list layout',
        color: 'yellow',
    },
    set: {
        name: 'usb',
        color: 'brown',
    },
    zset: {
        name: 'ordered list',
        color: 'orange',
    },
    hash: {
        name: 'sitemap',
        color: 'violet',
    },
    string: {
        name: 'ellipsis horizontal',
        color: 'blue',
    },
    none: {
        name: 'question',
        color: 'pink'
    },
};
