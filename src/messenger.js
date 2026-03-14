const logConfig = {
    hit: {
        className: "msgHit",
        prefix: "◈",
        label: "DIRECT HIT"
    },
    miss: {
        className: "msgMiss",
        prefix: "○",
        label: "SPLASH"
    },
    sunk: {
        className: "msgSunk",
        prefix: "✖",
        label: "VESSEL SUNK"
    },
    enemyHit: {
        className: "msgEnemyHit",
        prefix: "⚠",
        label: "WARNING"
    },
    info: {
        className: "msgInfo",
        prefix: "▸",
        label: "SYSTEM"
    },
};

const msgHistory = [];

export function recordAndGetHistory(type, message) {
    const config = logConfig[type] || logConfig.info;

    msgHistory.push({
        className: config.className,
        label: config.label,
        prefix: config.prefix,
        message: message.toUpperCase()
    });

    if (msgHistory.length > 3) msgHistory.shift();
    return msgHistory;
}