import { DeepPartial } from 'typeorm';
import { ClarisaCountry } from '../../entities/clarisa-countries/clarisa-country.entity';
import { CreateClarisaCountryDto } from '../../entities/clarisa-countries/dto/create-clarisa-country.dto';

export const countryMapper = (
  data: CreateClarisaCountryDto,
): DeepPartial<ClarisaCountry> => ({
  isoAlpha2: data?.isoAlpha2,
  isoAlpha3: data?.isoAlpha3,
  name: data?.name,
  latitude: data?.locationDTO?.latitude,
  longitude: data?.locationDTO?.longitude,
  code: data?.code,
});
