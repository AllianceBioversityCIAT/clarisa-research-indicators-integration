import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AuditableEntity } from '../../complements/dtos/auditable.entity';
import { ClarisaCountry } from '../clarisa-countries/clarisa-country.entity';

@Entity('clarisa_sub_nationals')
export class ClarisaSubNational extends AuditableEntity {
  @PrimaryColumn('bigint', {
    name: 'id',
    nullable: false,
  })
  id!: number;

  @Column('text', {
    name: 'code',
    nullable: true,
  })
  code!: string;

  @Column('text', {
    name: 'name',
    nullable: true,
  })
  name!: string;

  @Column('json', {
    name: 'other_names',
    nullable: true,
  })
  other_names: JSON;

  @Column('varchar', {
    length: 3,
    name: 'country_iso_alpha_2',
    nullable: true,
  })
  country_iso_alpha_2?: string;

  @Column('varchar', {
    length: 3,
    name: 'language_iso_2',
    nullable: true,
  })
  language_iso_2?: string;

  @ManyToOne(
    () => ClarisaCountry,
    (clarisaCountry) => clarisaCountry.clarisa_sub_nationals,
  )
  @JoinColumn({ name: 'country_iso_alpha_2' })
  clarisa_country!: ClarisaCountry;
}
