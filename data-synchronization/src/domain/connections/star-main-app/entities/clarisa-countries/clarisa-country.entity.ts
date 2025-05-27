import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';
import { ClarisaInstitutionLocation } from '../clarisa-institution-locations/clarisa-institution-location.entity';
import { ClarisaSubNational } from '../clarisa-sub-nationals/clarisa-sub-national.entity';

@Entity('clarisa_countries')
export class ClarisaCountry extends AuditableEntity {
  @PrimaryColumn('varchar', {
    length: 3,
    name: 'isoAlpha2',
  })
  isoAlpha2!: string;

  @Column('bigint', {
    name: 'code',
    nullable: true,
  })
  code!: number;

  @Column('varchar', {
    length: 4,
    name: 'isoAlpha3',
    nullable: true,
  })
  isoAlpha3!: string;

  @Column('text', {
    name: 'name',
    nullable: true,
  })
  name!: string;

  @Column('decimal', {
    name: 'longitude',
    nullable: true,
    precision: 8,
    scale: 4,
  })
  longitude!: number;

  @Column('decimal', {
    name: 'latitude',
    nullable: true,
    precision: 8,
    scale: 4,
  })
  latitude!: number;

  @OneToMany(
    () => ClarisaInstitutionLocation,
    (clarisaInstitution) => clarisaInstitution.country,
  )
  institution_locations!: ClarisaInstitutionLocation[];

  @OneToMany(
    () => ClarisaSubNational,
    (clarisaSubNational) => clarisaSubNational.clarisa_country,
  )
  clarisa_sub_nationals!: ClarisaSubNational[];
}
