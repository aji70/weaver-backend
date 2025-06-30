export declare class ReputationFactor {
    id: string;
    name: string;
    description: string;
    weight: number;
    isActive: boolean;
    configuration: {
        minValue: number;
        maxValue: number;
        calculationMethod: string;
        [key: string]: any;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
