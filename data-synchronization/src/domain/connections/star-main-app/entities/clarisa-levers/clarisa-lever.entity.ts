import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';
@Entity('clarisa_levers')
export class ClarisaLever extends AuditableEntity {
  @PrimaryColumn('bigint', {
    name: 'id',
    nullable: false,
  })
  id!: number;

  @Column('text', {
    name: 'short_name',
    nullable: false,
  })
  short_name!: string;

  @Column('text', {
    name: 'full_name',
    nullable: true,
  })
  full_name?: string;

  @Column('text', {
    name: 'other_names',
    nullable: true,
  })
  other_names?: string;
}
