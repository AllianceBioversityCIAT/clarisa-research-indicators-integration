import { env } from 'process';
import { Institution } from '../../entities/intitutions/institutions.entity';
import { InstitutionClarisaDto } from '../dtos/intitution-clarisa.dto';

export const InstitutionsMapper = (
  data: InstitutionClarisaDto,
): Partial<Institution> => {
  const userAiccra = Number(env.DS_AICCRA_USER_ID);
  return {
    id: data?.code,
    name: data?.name,
    acronym: data?.acronym,
    website_link: data?.websiteLink,
    created_at: new Date(data?.added),
    institution_type_id: data?.institutionType?.code,
    created_by: userAiccra,
    updated_at: new Date(data?.added),
    updated_by: userAiccra,
    is_active: true,
  };
};
