import { ReputationService } from './reputation.service';
import { CreateReputationDto } from './dto/create-reputation.dto';
import { UpdateReputationDto } from './dto/update-reputation.dto';
export declare class ReputationController {
    private readonly reputationService;
    constructor(reputationService: ReputationService);
    create(createReputationDto: CreateReputationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReputationDto: UpdateReputationDto): string;
    remove(id: string): string;
}
