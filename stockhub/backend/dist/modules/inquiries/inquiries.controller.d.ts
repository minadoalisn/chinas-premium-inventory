import { InquiriesService } from './inquiries.service';
export declare class InquiriesController {
    private readonly inquiriesService;
    constructor(inquiriesService: InquiriesService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(data: any): unknown;
}
