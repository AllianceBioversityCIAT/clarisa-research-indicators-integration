import { ClarisaInstitutionType } from '../../entities/clarisa-institution-types/clarisa-institution-type.entity';
import { CreateClarisaInstitutionTypeDto } from '../../entities/clarisa-institution-types/dto/create-clarisa-institution-type.dto';

export const institutionTypeMapper = (
  data: CreateClarisaInstitutionTypeDto,
): Partial<ClarisaInstitutionType> => ({
  code: data.code,
  name: data?.name,
  description: data?.description,
  parent_code: data?.id_parent,
});
