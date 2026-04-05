import { InquiriesService } from './inquiries.service';
export declare class InquiriesController {
    private readonly inquiriesService;
    constructor(inquiriesService: InquiriesService);
    findAll(): Promise<{
        data: any[];
        total: number;
    }>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
}
