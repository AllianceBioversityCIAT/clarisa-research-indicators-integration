import { Controller, Patch } from '@nestjs/common';
import { StarService } from './star.service';

@Controller()
export class StarController {
  constructor(private readonly starService: StarService) {}

  @Patch('sync/clarisa-entities')
  async executeSync() {
    this.starService.cloneAllClarisaEntities();
    return {};
  }
}
