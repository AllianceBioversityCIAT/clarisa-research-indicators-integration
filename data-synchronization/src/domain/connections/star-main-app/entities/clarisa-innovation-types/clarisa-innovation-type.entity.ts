import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';

@Entity('clarisa_innovation_types')
export class ClarisaInnovationType extends AuditableEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'bigint',
  })
  code: number;

  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  name?: string;

  @Column({
    name: 'definition',
    type: 'text',
    nullable: true,
  })
  definition?: string;
}
