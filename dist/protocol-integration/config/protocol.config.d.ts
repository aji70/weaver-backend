import { ProtocolEventType } from '../entities/protocol-event.entity';
declare const _default: (() => {
    retryAttempts: number;
    retryDelay: number;
    blockConfirmation: number;
    defaultProtocols: {
        id: string;
        rpcUrl: string | undefined;
        contractAddress: string | undefined;
        abi: never[];
        eventTypes: ProtocolEventType[];
        startBlock: number;
    }[];
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    retryAttempts: number;
    retryDelay: number;
    blockConfirmation: number;
    defaultProtocols: {
        id: string;
        rpcUrl: string | undefined;
        contractAddress: string | undefined;
        abi: never[];
        eventTypes: ProtocolEventType[];
        startBlock: number;
    }[];
}>;
export default _default;
