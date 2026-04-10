import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { BaseControlListSave } from '../../complements/dtos/base-control-list-save';
import { AgressoToolsHttp } from './agresso-tools.connection.http';
import { AgressoStaffRawDto } from '../../complements/dtos/agresso-staff-raw.dto';
import { AllianceUserStaff } from './entities/alliance-user-staff.entity';
import { allianceStaffMapper } from '../../complements/mappers/alliance-staff.mapper';
import { ResponseAgressoStaffDto } from '../../complements/dtos/response-agresso-staff.dto';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AgressoStaffToolsDevService extends BaseControlListSave<AgressoToolsHttp> {
  constructor(
    @InjectDataSource('STAR') dataSource: DataSource,
    http: HttpService,
  ) {
    super(
      dataSource,
      new AgressoToolsHttp(http, false),
      new Logger(AgressoStaffToolsDevService.name),
    );
  }

  private query(pages: number, size: number) {
    return `erp-employment-api/api/ext/v1/employees?status=active&page=${pages}&size=${size}`;
  }

  private async findNumberOfPages(size: number) {
    const totalPages = await this.connection
      .getRaw<ResponseAgressoStaffDto<unknown>>(this.query(1, size))
      .then(({ totalPages }) => totalPages);
    return totalPages;
  }

  async cloneAllAgressoStaff() {
    const size = 1000;
    const pages = await this.findNumberOfPages(size);
    this._logger.log(`Total pages: ${pages}`);
    for (let i = 1; i <= pages; i++) {
      this._logger.log(`Processing page: ${i} of ${pages}`);
      await this.base<AgressoStaffRawDto, AllianceUserStaff>(
        this.query(i, size),
        AllianceUserStaff,
        (data) => allianceStaffMapper(data),
      );
    }
  }
}
