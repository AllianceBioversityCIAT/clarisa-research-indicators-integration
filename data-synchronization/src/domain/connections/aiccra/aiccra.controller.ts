import { Controller, HttpStatus, Patch } from '@nestjs/common';
import { AiccraService } from './aiccra.service';
import { ResponseUtils } from '../../shared/utils/response.utils';

@Controller()
export class AiccraController {
  constructor(private readonly aiccraService: AiccraService) {}

  @Patch('sync/clarisa-entities')
  executeSync() {
    this.aiccraService.bootstrap();
    return ResponseUtils.format({
      description: 'Clarisa entities synchronization',
      status: HttpStatus.OK,
    });
  }
}
