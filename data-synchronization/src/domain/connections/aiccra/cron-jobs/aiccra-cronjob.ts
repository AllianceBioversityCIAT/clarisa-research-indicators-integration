import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../../shared/utils/logger.util';
import { AiccraService } from '../aiccra.service';

@Injectable()
export class AiccraCronJob {
  private readonly logger: LoggerUtil = new LoggerUtil({
    name: AiccraCronJob.name,
  });

  constructor(private readonly starService: AiccraService) {}

  @Cron('0 2,14 * * *')
  handleCron(): void {
    this.starService.bootstrap().catch((error) => this.logger.error(error));
  }
}
