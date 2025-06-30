"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const protocol_event_entity_1 = require("../entities/protocol-event.entity");
exports.default = (0, config_1.registerAs)('protocols', () => ({
    retryAttempts: 3,
    retryDelay: 5000,
    blockConfirmation: 12,
    defaultProtocols: [
        {
            id: 'example-protocol',
            rpcUrl: process.env.EXAMPLE_PROTOCOL_RPC_URL,
            contractAddress: process.env.EXAMPLE_PROTOCOL_CONTRACT_ADDRESS,
            abi: [],
            eventTypes: [
                protocol_event_entity_1.ProtocolEventType.REWARD_CLAIM,
                protocol_event_entity_1.ProtocolEventType.TOKEN_TRANSFER,
            ],
            startBlock: 0,
        },
    ],
}));
//# sourceMappingURL=protocol.config.js.map