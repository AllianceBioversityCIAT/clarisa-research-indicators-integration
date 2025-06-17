import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../../shared/utils/logger.util';
import { StarService } from '../star.service';

@Injectable()
export class StarCronJob {
  private readonly logger: LoggerUtil = new LoggerUtil({
    name: StarCronJob.name,
  });

  constructor(private readonly starService: StarService) {}

  @Cron('0 1,13 * * *')
  handleCron(): void {
    this.starService
      .cloneAllClarisaEntities()
      .catch((error) => this.logger.error(error));
  }
}
