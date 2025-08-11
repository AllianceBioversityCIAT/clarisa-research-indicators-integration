import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClarisaInstitution } from '../clarisa-institution.entity';
import { ClarisaPathEnum } from '../../../complements/enum/path.enum';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ClarisaInstitutionsRepository extends Repository<ClarisaInstitution> {
  constructor(@InjectDataSource('STAR') dataSource: DataSource) {
    super(ClarisaInstitution, dataSource.createEntityManager());
  }

  async lastInsertDate(): Promise<string> {
    const createdAt = await this.findOne({
      select: ['updated_at'],
      where: { is_active: true },
      order: { created_at: 'DESC' },
    }).then((result) => result?.created_at);

    const updatedAt = await this.findOne({
      select: ['updated_at'],
      where: { is_active: true },
      order: { updated_at: 'DESC' },
    }).then((result) => result?.updated_at);

    const latestDate: Date = updatedAt ?? createdAt ?? new Date(0);
    const baseMilliseconds: number = 1000;
    const dateNumber: number = Math.round(
      new Date(latestDate).getTime() / baseMilliseconds,
    );

    const date = latestDate ? dateNumber : 0;
    let path: string = `${ClarisaPathEnum.INSTITUTIONS}?show=all`;
    if (date) path += `&from=${date}`;
    return path;
  }
}
