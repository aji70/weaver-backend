export declare class ProtocolHealthMetric {
    id: string;
    protocolId: string;
    tvl: number;
    dailyTransactionVolume: number;
    weeklyTransactionVolume: number;
    walletGrowthRate: number;
    healthScore: number;
    timestamp: Date;
    metadata: Record<string, any>;
}
