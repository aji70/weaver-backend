export declare enum ProtocolEventType {
    REWARD_CLAIM = "REWARD_CLAIM",
    TOKEN_TRANSFER = "TOKEN_TRANSFER",
    NFT_MINT = "NFT_MINT"
}
export declare class ProtocolEvent {
    id: string;
    protocolId: string;
    eventType: ProtocolEventType;
    payload: Record<string, any>;
    blockNumber: number;
    transactionHash: string;
    timestamp: Date;
    processed: boolean;
    error?: string;
}
