import { CreateReputationDto } from './dto/create-reputation.dto';
import { UpdateReputationDto } from './dto/update-reputation.dto';
export declare class ReputationService {
    create(createReputationDto: CreateReputationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReputationDto: UpdateReputationDto): string;
    remove(id: number): string;
}
