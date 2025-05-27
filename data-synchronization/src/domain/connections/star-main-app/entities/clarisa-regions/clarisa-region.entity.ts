import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';
@Entity('clarisa_regions')
export class ClarisaRegion extends AuditableEntity {
  @PrimaryColumn('bigint', {
    name: 'um49Code',
    nullable: false,
  })
  um49Code!: number;

  @Column('text', {
    name: 'name',
    nullable: true,
  })
  name!: string;
}
