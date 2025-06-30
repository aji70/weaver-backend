import { Repository } from 'typeorm';
import { ProtocolHealthMetric } from './entities/protocol-health-metric.entity';
import { ProtocolAdapterFactory } from './adapters/protocol-adapter.factory';
export declare class ProtocolHealthService {
    private readonly metricsRepository;
    private readonly adapterFactory;
    private readonly logger;
    constructor(metricsRepository: Repository<ProtocolHealthMetric>, adapterFactory: ProtocolAdapterFactory);
    collectMetrics(): Promise<void>;
    private saveMetrics;
    private calculateHealthScore;
    getProtocolHealth(protocolId: string): Promise<ProtocolHealthMetric>;
    getProtocolHealthHistory(protocolId: string, days?: number): Promise<ProtocolHealthMetric[]>;
}
