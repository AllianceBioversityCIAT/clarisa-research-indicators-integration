import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';

@Entity('clarisa_geo_scope')
export class ClarisaGeoScope extends AuditableEntity {
  @PrimaryColumn('bigint', {
    name: 'code',
    nullable: false,
  })
  code!: number;

  @Column('text', {
    name: 'name',
    nullable: true,
  })
  name!: string;

  @Column('text', {
    name: 'definition',
    nullable: true,
  })
  definition?: string;
}
