import { IsNotEmpty, IsString } from 'class-validator';

export class CareHomeDto {
    @IsNotEmpty()
    @IsString()
    name: string
    email: string
    phone: string
    logo?: string
    short_desc?: string
    desc?: string
    street?: string
    post_code?: string
    city?: string
    state?: string
    lat?: string
    lon?: string
    address?: string
    price_start?: string
    price_end?: string
    website?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    slug?: string
    city_id?: number
}
