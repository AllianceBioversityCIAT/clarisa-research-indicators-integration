import { Module } from '@nestjs/common';
import { AiccraService } from './aiccra.service';
import { AiccraController } from './aiccra.controller';
import { HttpModule } from '@nestjs/axios';
import { AiccraCronJob } from './cron-jobs/aiccra-cronjob';

@Module({
  imports: [HttpModule],
  controllers: [AiccraController],
  providers: [AiccraService, AiccraCronJob],
  exports: [AiccraService],
})
export class AiccraModule {}
