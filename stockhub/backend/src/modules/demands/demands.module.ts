import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from './entities/demand.entity';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Demand])],
  controllers: [DemandsController],
  providers: [DemandsService],
  exports: [DemandsService],
})
export class DemandsModule {}
