import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
export declare class NftsService {
    create(createNftDto: CreateNftDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateNftDto: UpdateNftDto): string;
    remove(id: number): string;
}
