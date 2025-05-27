import { Module } from '@nestjs/common';
import { StarController } from './star.controller';
import { HttpModule } from '@nestjs/axios';
import { ClarisaInstitutionsRepository } from './entities/clarisa-institutions/repositories/clarisa-institution.repository';
import { StarService } from './star.service';

@Module({
  imports: [HttpModule],
  controllers: [StarController],
  providers: [ClarisaInstitutionsRepository, StarService],
})
export class StarModule {}
