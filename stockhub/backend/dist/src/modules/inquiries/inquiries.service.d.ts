export declare class InquiriesService {
    constructor();
    findAll(params: any): Promise<{
        data: any[];
        total: number;
    }>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
}
