import { Controller, HttpStatus, Patch } from '@nestjs/common';
import { StarService } from './star.service';
import { ResponseUtils } from '../../shared/utils/response.utils';

@Controller()
export class StarController {
  constructor(private readonly starService: StarService) {}

  @Patch('sync/clarisa-entities')
  executeSync() {
    this.starService.cloneAllClarisaEntities();
    return ResponseUtils.format({
      description: 'Clarisa entities synchronization',
      status: HttpStatus.OK,
    });
  }
}
