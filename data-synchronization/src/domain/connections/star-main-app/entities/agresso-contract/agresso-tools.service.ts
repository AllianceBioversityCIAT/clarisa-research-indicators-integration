import { Injectable, Logger } from '@nestjs/common';
import { Agresso } from './agresso-tools.connection';
import { AgressoContract } from '../../entities/agresso-contract/entities/agresso-contract.entity';
import { AgressoContractRawDto } from '../../entities/agresso-contract/dto/agresso-contract-raw.dto';
import { DataSource, DeepPartial } from 'typeorm';
import { ClarisaSdg } from '../clarisa-sdgs/clarisa-sdg.entity';
import { BaseControlListSave } from '../../complements/dtos/base-control-list-save';
import { AgressoContractMapper } from '../../complements/mappers/agresso-contract.mapper';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AgressoToolsService extends BaseControlListSave<Agresso> {
  constructor(@InjectDataSource('STAR_PROD') dataSource: DataSource) {
    super(dataSource, new Agresso(true), new Logger(AgressoToolsService.name));
  }

  async cloneAllAgressoEntities() {
    const clarisaSdg = await this.dataSource.getRepository(ClarisaSdg).find();
    await this.base<AgressoContractRawDto, AgressoContract>(
      'getAgreementsRM',
      AgressoContract,
      undefined,
      (data) => this.cleanDuplicates(data, clarisaSdg),
    );
  }

  private cleanDuplicates(
    data: AgressoContractRawDto[],
    clarisaSdg: ClarisaSdg[],
  ): DeepPartial<AgressoContract>[] {
    const idCount = new Map<string, number>();
    const cleanData: AgressoContractRawDto[] = [];
    data.forEach((item) => {
      const id = item.agreement_id;
      if (idCount.has(id)) {
        idCount.set(id, (idCount.get(id) ?? 0) + 1);
      } else {
        idCount.set(id, 1);
        cleanData.push(item);
      }
    });
    return cleanData.map((data) => AgressoContractMapper(data, clarisaSdg));
  }
}
