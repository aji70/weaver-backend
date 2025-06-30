export interface ProtocolMetrics {
    tvl: number;
    dailyTransactionVolume: number;
    weeklyTransactionVolume: number;
    walletGrowthRate: number;
}
export interface ProtocolAdapter {
    getProtocolMetrics(): Promise<ProtocolMetrics>;
    getProtocolId(): string;
}
