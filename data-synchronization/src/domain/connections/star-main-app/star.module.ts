import { Module } from '@nestjs/common';
import { StarController } from './star.controller';
import { HttpModule } from '@nestjs/axios';
import { ClarisaInstitutionsRepository } from './entities/clarisa-institutions/repositories/clarisa-institution.repository';
import { StarService } from './star.service';
import { StarCronJob } from './cron-jobs/star-cronjob';

@Module({
  imports: [HttpModule],
  controllers: [StarController],
  providers: [ClarisaInstitutionsRepository, StarService, StarCronJob],
  exports: [StarService, ClarisaInstitutionsRepository, StarCronJob],
})
export class StarModule {}
