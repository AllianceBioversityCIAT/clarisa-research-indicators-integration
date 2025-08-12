import { Module } from '@nestjs/common';
import { StarController } from './star.controller';
import { HttpModule } from '@nestjs/axios';
import { ClarisaInstitutionsRepository } from './entities/clarisa-institutions/repositories/clarisa-institution.repository';
import { StarService } from './star.service';
import { StarCronJob } from './cron-jobs/star-cronjob';
import { AgressoToolsService } from './entities/agresso-contract/agresso-tools.service';
import { AgressoToolsDevService } from './entities/agresso-contract/agresso-tools-dev.service';

@Module({
  imports: [HttpModule],
  controllers: [StarController],
  providers: [
    ClarisaInstitutionsRepository,
    StarService,
    StarCronJob,
    AgressoToolsService,
    AgressoToolsDevService,
  ],
  exports: [
    StarService,
    ClarisaInstitutionsRepository,
    StarCronJob,
    AgressoToolsService,
    AgressoToolsDevService,
  ],
})
export class StarModule {}
