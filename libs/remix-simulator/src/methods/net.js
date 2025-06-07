export function methods() {
    return {
        net_version: net_version,
        net_listening: net_listening,
        net_peerCount: net_peerCount
    };
}
export function net_version(payload, cb) {
    // should be configured networkId
    cb(null, 1337);
}
export function net_listening(payload, cb) {
    cb(null, true);
}
export function net_peerCount(payload, cb) {
    cb(null, 0);
}
//# sourceMappingURL=net.js.map