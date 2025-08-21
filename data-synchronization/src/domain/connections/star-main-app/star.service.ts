import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial } from 'typeorm';
import { BaseApi } from '../../core/base-api';
import { HttpService } from '@nestjs/axios';
import { env } from 'process';
import { ClarisaPathEnum } from './complements/enum/path.enum';
import { ClarisaRegion } from './entities/clarisa-regions/clarisa-region.entity';
import { CreateClarisaCountryDto } from './entities/clarisa-countries/dto/create-clarisa-country.dto';
import { ClarisaCountry } from './entities/clarisa-countries/clarisa-country.entity';
import { countryMapper } from './complements/mappers/countries.mapper';
import { CreateClarisaInstitutionTypeDto } from './entities/clarisa-institution-types/dto/create-clarisa-institution-type.dto';
import { institutionTypeMapper } from './complements/mappers/institutio-type.mapper';
import { ClarisaInstitutionType } from './entities/clarisa-institution-types/clarisa-institution-type.entity';
import { ClarisaGeoScope } from './entities/clarisa-geo-scope/clarisa-geo-scope.entity';
import { subNationalMapper } from './complements/mappers/sub-national.mapper';
import { ClarisaSubNational } from './entities/clarisa-sub-nationals/clarisa-sub-national.entity';
import { ClarisaSubNationalRawDto } from './entities/clarisa-sub-nationals/dto/clarisa-sub-national-raw.dto';
import { leversMappers } from './complements/mappers/levers.mappers';
import { ClarisaLeversRawDto } from './entities/clarisa-levers/dto/clarisa-levers-raw.dto';
import { ClarisaLever } from './entities/clarisa-levers/clarisa-lever.entity';
import { ClarisaInstitutionLocation } from './entities/clarisa-institution-locations/clarisa-institution-location.entity';
import { institutionMapper } from './complements/mappers/institution.mapper';
import { ClarisaInstitution } from './entities/clarisa-institutions/clarisa-institution.entity';
import { CreateClarisaInstitutionDto } from './entities/clarisa-institutions/dto/create-clarisa-institution.dto';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ClarisaInstitutionsRepository } from './entities/clarisa-institutions/repositories/clarisa-institution.repository';
import { isEmpty } from '../../shared/utils/object.utils';
import { ClarisaInnovationCharacteristic } from './entities/clarisa-innovation-characteristics/clarisa-innovation-characteristic.entity';
import { ClarisaInnovationReadinessLevel } from './entities/clarisa-innovation-readiness-levels/clarisa-innovation-readiness-level.entity';
import { ClarisaInnovationType } from './entities/clarisa-innovation-types/clarisa-innovation-type.entity';
import { ClarisaSdg } from './entities/clarisa-sdgs/clarisa-sdg.entity';
import { AgressoToolsService } from './entities/agresso-contract/agresso-tools.service';
import { AgressoToolsDevService } from './entities/agresso-contract/agresso-tools-dev.service';
import { ClarisaInitiative } from './entities/clarisa-initiatives/clarisa-initiative.entity';

@Injectable()
export class StarService extends BaseApi {
  constructor(
    @InjectDataSource('STAR') private dataSource: DataSource,
    httpService: HttpService,
    private readonly ciRepo: ClarisaInstitutionsRepository,
    private readonly agressoService: AgressoToolsService,
    private readonly agressoToolsDevService: AgressoToolsDevService,
  ) {
    super(
      httpService,
      String(env.DS_CLARISA_HOST),
      StarService.name,
      env.DS_CLARISA_USER,
      env.DS_CLARISA_PASSWORD,
    );
  }

  protected async base<T, Y = T>(
    path: string,
    entity: new () => Y,
    mapper?: (data: T) => DeepPartial<Y>,
    iterator?: (data: T[]) => DeepPartial<Y>[],
    rawData?: Record<string, any>[],
  ): Promise<Y[]> {
    let data: T[] = [];
    if (isEmpty(rawData)) {
      this.logger.log(`Fetching data from ${entity.name}`);
      data = await firstValueFrom(this.getRequest<T[]>(path))
        .catch((err) => {
          this.logger.error(
            `Error fetching data from ${entity.name} path: ${path}`,
          );
          this.logger.error(err);
          return [];
        })
        .then((data) => (data as AxiosResponse<T[]>).data);
    } else {
      this.logger.log(`Using provided raw data for ${entity.name}`);
      data = rawData as T[];
    }
    let modifyData: DeepPartial<Y>[];
    if (iterator) {
      modifyData = iterator(data);
    } else if (mapper) {
      modifyData = data.map((item) => mapper(item));
    } else {
      modifyData = data as unknown as Y[];
    }
    const saveData: Y[] = await this.dataSource
      .getRepository(entity)
      .save(modifyData)
      .then((data) => {
        this.logger.log(`Data saved for ${entity.name}`);
        return data as Y[];
      });

    return saveData;
  }

  /**
   * Clone all entities from Clarisa API
   * @returns void
   * @description This method clones all entities from Clarisa API
   * @public
   */
  async cloneAllClarisaEntities(): Promise<void> {
    this.logger.debug('Cloning all entities from Clarisa API');

    await this.base<ClarisaSdg>(ClarisaPathEnum.SDG, ClarisaSdg);

    await this.base<ClarisaInnovationCharacteristic>(
      ClarisaPathEnum.INNOVATION_CHARACTERISTICS,
      ClarisaInnovationCharacteristic,
    );

    await this.base<ClarisaInnovationReadinessLevel>(
      ClarisaPathEnum.INNOVATION_READINESS_LEVELS,
      ClarisaInnovationReadinessLevel,
    );

    await this.base<ClarisaInnovationType>(
      ClarisaPathEnum.INNOVATION_TYPES,
      ClarisaInnovationType,
    );

    await this.base<ClarisaRegion>(ClarisaPathEnum.REGIONS, ClarisaRegion);

    await this.base<CreateClarisaCountryDto, ClarisaCountry>(
      ClarisaPathEnum.COUNTRIES,
      ClarisaCountry,
      (data) => countryMapper(data),
    );

    await this.base<CreateClarisaInstitutionTypeDto, ClarisaInstitutionType>(
      ClarisaPathEnum.INSTITUTIONS_TYPES,
      ClarisaInstitutionType,
      (data) => institutionTypeMapper(data),
    );

    const institutionsPath = await this.ciRepo.lastInsertDate();
    const institutionLocation: Partial<ClarisaInstitutionLocation>[] = [];
    await this.base<CreateClarisaInstitutionDto, ClarisaInstitution>(
      institutionsPath,
      ClarisaInstitution,
      (data) => institutionMapper(data, institutionLocation),
    );

    await this.base<Partial<ClarisaInstitutionLocation>>(
      ClarisaPathEnum.NONE,
      ClarisaInstitutionLocation,
      undefined,
      undefined,
      institutionLocation,
    );

    await this.base<ClarisaLeversRawDto, ClarisaLever>(
      ClarisaPathEnum.LEVERS,
      ClarisaLever,
      (data) => leversMappers(data),
    );

    await this.base<ClarisaSubNationalRawDto, ClarisaSubNational>(
      ClarisaPathEnum.SUB_NATIONAL,
      ClarisaSubNational,
      (data) => subNationalMapper(data),
    );

    await this.base<ClarisaGeoScope>(
      ClarisaPathEnum.GEO_SCOPES,
      ClarisaGeoScope,
    );

    await this.base<ClarisaInitiative>(
      ClarisaPathEnum.INITIATIVE,
      ClarisaInitiative,
    );

    this.logger.debug('Started cloning Agresso entities from STAR Prod');
    await this.agressoService.cloneAllAgressoEntities();
    this.logger.debug('Started cloning Agresso entities from STAR Dev');
    await this.agressoToolsDevService.cloneAllAgressoEntities();

    this.logger.debug('All entities cloned');
  }
}
