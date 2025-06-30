"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderType = exports.StarkNetNetwork = void 0;
var StarkNetNetwork;
(function (StarkNetNetwork) {
    StarkNetNetwork["MAINNET"] = "mainnet";
    StarkNetNetwork["TESTNET"] = "testnet";
    StarkNetNetwork["TESTNET2"] = "testnet2";
    StarkNetNetwork["DEVNET"] = "devnet";
})(StarkNetNetwork || (exports.StarkNetNetwork = StarkNetNetwork = {}));
var ProviderType;
(function (ProviderType) {
    ProviderType["RPC"] = "rpc";
    ProviderType["INFURA"] = "infura";
    ProviderType["ALCHEMY"] = "alchemy";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
//# sourceMappingURL=provider-options.interface.js.map