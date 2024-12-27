const logger = {
    error: (...args) => console.error(...args),
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    debug: (...args) => console.debug(...args)
};

module.exports = logger; 