import LRU from 'lru-cache';

const cache = new LRU({
    max: 100,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});

export default cache;
