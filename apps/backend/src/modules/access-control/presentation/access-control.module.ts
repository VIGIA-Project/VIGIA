import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessEventOrmEntity } from '../infrastructure/entities/access-event.orm-entity';
import { AccessControlService } from '../application/access-control.service';
import { AccessControlController } from './access-control.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccessEventOrmEntity])],
  controllers: [AccessControlController],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
