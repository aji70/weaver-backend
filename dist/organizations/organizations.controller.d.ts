import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createOrganizationDto: CreateOrganizationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): string;
    remove(id: string): string;
}
