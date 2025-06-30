import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
export declare class NftsController {
    private readonly nftsService;
    constructor(nftsService: NftsService);
    create(createNftDto: CreateNftDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateNftDto: UpdateNftDto): string;
    remove(id: string): string;
}
