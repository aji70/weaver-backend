import { Document, Schema as MongooseSchema } from 'mongoose';
import { Nft } from '../../nfts/entities/nft.entity';
export type OrganizationDocument = Organization & Document;
declare class SocialLinks {
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
}
export declare enum OrganizationTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM"
}
export declare class Organization {
    name: string;
    description: string;
    tier: OrganizationTier;
    socialLinks: SocialLinks;
    nftRewards: Nft[];
}
export declare const OrganizationSchema: MongooseSchema<Organization, import("mongoose").Model<Organization, any, any, any, Document<unknown, any, Organization> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, Document<unknown, {}, import("mongoose").FlatRecord<Organization>> & import("mongoose").FlatRecord<Organization> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
