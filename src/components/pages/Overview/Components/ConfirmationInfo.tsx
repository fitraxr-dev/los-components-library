import React, { useMemo } from 'react';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DP_2_DIVISION,
  BoD_GROUP,
  DAA_DIVISION,
  DAI_DIVISION,
  DELST_DIVISION,
  DEPI_DIVISION,
  DH_DIVISION,
  DJK_DIVISION,
  DK_DIVISION,
  DKHI_DIVISION,
  DMRT_DIVISION,
  DPKMI_DIVISION,
  DPM_DIVISION,
  DPOP_DIVISION,
  DPPU_2_DIVISION,
  DPPIK_DIVISION,
  DTI_DIVISION,
  EXTERNAL_GROUP,
  GENERAL_DIVISION,
  PROJECT_DIVISION,
  RND_ECONOMIC_DIVISION,
  SCR_DIVISION,
  SDM_DIVISION,
  SUPER_DIVISION,
} from '@/configs/constants';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


const businessDivisionArray = [
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DP_2_DIVISION,
];

const nonBusinessDivisionArray = [
  BoD_GROUP,
  DAA_DIVISION,
  DAI_DIVISION,
  DELST_DIVISION,
  DEPI_DIVISION,
  DH_DIVISION,
  DJK_DIVISION,
  DK_DIVISION,
  DKHI_DIVISION,
  DMRT_DIVISION,
  DPKMI_DIVISION,
  DPM_DIVISION,
  DPOP_DIVISION,
  DPPU_2_DIVISION,
  DPPIK_DIVISION,
  DTI_DIVISION,
  EXTERNAL_GROUP,
  GENERAL_DIVISION,
  PROJECT_DIVISION,
  RND_ECONOMIC_DIVISION,
  SCR_DIVISION,
  SDM_DIVISION,
  SUPER_DIVISION,
];

interface ConfirmationInfoProps {
  divisionId?: string | string[];
}

const ConfirmationInfo = ({ divisionId }: ConfirmationInfoProps) => {
  const showConfirmationInfo = useMemo(() => {
    const divisionIds = Array.isArray(divisionId)
      ? divisionId
      : divisionId
        ? [divisionId]
        : [];

    if (divisionIds.length === 0) return false;

    const hasBusinessDivision = divisionIds.some((id: string) =>
      businessDivisionArray.includes(id)
    );
    const hasNonBusinessDivision = divisionIds.some((id: string) =>
      nonBusinessDivisionArray.includes(id)
    );

    return hasBusinessDivision && hasNonBusinessDivision;
  }, [divisionId]);

  if (!showConfirmationInfo) return null;

  const warningMessage = 'Data tidak dapat ditampilkan, silahkan lakukan penyesuaian filter data';

  return (
    <RowWrapper
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      mb={2}
      sx={{ backgroundColor: '#fffce4', border: 'solid 1px #f2c009', borderRadius: 1, padding: 2 }}
    >
      <RowWrapper gap={1}>
        <Icon
          textVariant="body1"
          iconName="warning-2"
        />
        <TextStyle>
          {warningMessage}
        </TextStyle>
      </RowWrapper>
    </RowWrapper>
  );
};

export default ConfirmationInfo;
