import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerUtil } from '../../../shared/utils/logger.util';
import { StarService } from '../star.service';

@Injectable()
export class StarCronJob {
  private readonly logger: LoggerUtil = new LoggerUtil({
    name: StarCronJob.name,
  });

  constructor(private readonly starService: StarService) {}

  @Cron(CronExpression.EVERY_8_HOURS)
  handleCron(): void {
    this.starService
      .cloneAllClarisaEntities()
      .catch((error) => this.logger.error(error));
  }
}
