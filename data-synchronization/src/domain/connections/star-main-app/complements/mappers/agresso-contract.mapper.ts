import { AgressoContractRawDto } from '../../entities/agresso-contract/dto/agresso-contract-raw.dto';
import { AgressoContract } from '../../entities/agresso-contract/entities/agresso-contract.entity';
import { ClarisaSdg } from '../../entities/clarisa-sdgs/clarisa-sdg.entity';

export const AgressoContractMapper = (
  data: AgressoContractRawDto,
  sdgsData: ClarisaSdg[],
): AgressoContract => {
  const tempData = data;
  /**
   * This is a temporary solution to remove the countryId and country
   * const tempCountries: string = tempData.countryId;
   */
  delete tempData.countryId;
  delete tempData.country;
  const sdgList = tempData?.sustainableDevelopmentGoals
    ?.split(';')
    ?.map((goal) => goal?.split(':')?.[0]);
  const sdgObjectList = sdgsData.filter((obj) =>
    sdgList?.some((frag) =>
      obj.short_name.toLowerCase().includes(frag.toLowerCase()),
    ),
  );
  delete tempData.sustainableDevelopmentGoals;

  const mapperData: AgressoContract = { ...tempData, sdgs: sdgObjectList };
  return mapperData;
};
