import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../../complements/dtos/auditable.entity';
@Entity('alliance_user_staff')
export class AllianceUserStaff extends AuditableEntity {
  @PrimaryColumn({
    name: 'carnet',
    type: 'varchar',
    length: 10,
  })
  carnet!: string;

  @Column('text', {
    name: 'first_name',
    nullable: false,
  })
  first_name!: string;

  @Column('text', {
    name: 'last_name',
    nullable: false,
  })
  last_name!: string;

  @Column('text', {
    name: 'email',
    nullable: true,
  })
  email!: string;

  @Column('text', {
    name: 'status',
    nullable: true,
  })
  status?: string;

  @Column('text', {
    name: 'center',
    nullable: true,
  })
  center?: string;

  @Column('text', {
    name: 'position',
    nullable: true,
  })
  position?: string;
}
