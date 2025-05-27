import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ClarisaInstitutionLocation } from '../clarisa-institution-locations/clarisa-institution-location.entity';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';
import { ClarisaInstitutionType } from '../clarisa-institution-types/clarisa-institution-type.entity';

@Entity('clarisa_institutions')
export class ClarisaInstitution extends AuditableEntity {
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
    name: 'acronym',
    nullable: true,
  })
  acronym!: string;

  @Column('text', {
    name: 'websiteLink',
    nullable: true,
  })
  websiteLink!: string;

  @Column('timestamp', {
    name: 'added',
    nullable: true,
  })
  added!: Date;

  @Column('bigint', {
    name: 'institution_type_id',
    nullable: true,
  })
  institution_type_id!: number;

  @ManyToOne(
    () => ClarisaInstitutionType,
    (clarisaInstitutionType) => clarisaInstitutionType.institutions,
  )
  @JoinColumn({ name: 'institution_type_id' })
  institution_type!: ClarisaInstitutionType;

  @OneToMany(
    () => ClarisaInstitutionLocation,
    (clarisaCountry) => clarisaCountry.institution,
    { cascade: true },
  )
  institution_locations!: ClarisaInstitutionLocation[];
}
