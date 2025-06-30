import { Repository } from 'typeorm';
import { ReputationFactor } from '../entities/reputation-factor.entity';
export declare class ReputationFactorService {
    private readonly factorRepository;
    private readonly logger;
    constructor(factorRepository: Repository<ReputationFactor>);
    getActiveFactors(): Promise<ReputationFactor[]>;
    createFactor(factor: Partial<ReputationFactor>): Promise<ReputationFactor>;
    updateFactor(id: string, factor: Partial<ReputationFactor>): Promise<ReputationFactor>;
    deleteFactor(id: string): Promise<void>;
    getFactorByName(name: string): Promise<ReputationFactor>;
    initializeDefaultFactors(): Promise<void>;
}
