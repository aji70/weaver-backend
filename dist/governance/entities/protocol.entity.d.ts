import { Proposal } from './proposal.entity';
export declare class Protocol {
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    isActive: boolean;
    proposals: Proposal[];
    createdAt: Date;
    updatedAt: Date;
}
