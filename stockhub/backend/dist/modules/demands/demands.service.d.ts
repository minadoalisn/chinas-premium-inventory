import { Repository } from 'typeorm';
import { Demand } from './entities/demand.entity';
export declare class DemandsService {
    private demandsRepository;
    constructor(demandsRepository: Repository<Demand>);
    create(userId: string, createData: Partial<Demand>): Promise<Demand>;
    findAll(params: {
        page?: number;
        limit?: number;
        userId?: string;
    }): unknown;
    findOne(id: string): Promise<Demand>;
    update(id: string, userId: string, updateData: Partial<Demand>): Promise<Demand>;
    remove(id: string, userId: string): Promise<void>;
    getMyDemands(userId: string): unknown;
}
