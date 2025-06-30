import { ProtocolHealthService } from './protocol-health.service';
export declare class ProtocolHealthController {
    private readonly protocolHealthService;
    constructor(protocolHealthService: ProtocolHealthService);
    getProtocolHealth(protocolId: string): Promise<import("./entities/protocol-health-metric.entity").ProtocolHealthMetric>;
    getProtocolHealthHistory(protocolId: string, days?: number): Promise<import("./entities/protocol-health-metric.entity").ProtocolHealthMetric[]>;
}
