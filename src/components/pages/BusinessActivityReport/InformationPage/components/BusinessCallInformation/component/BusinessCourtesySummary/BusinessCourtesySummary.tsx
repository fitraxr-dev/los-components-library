import React from 'react';

import { Checkbox } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useBusinessCourtesySummary from './BusinessCourtesySummary.hook';


const BusinessCourtesySummary = () => {

  const {
    handleCheck,
    businessCourtesyList,
    handleCheckOther,
    watchFields,
    canCreateBAR,
    theme,
    register,
    canEditBAR,
    isBarCreation,
  } = useBusinessCourtesySummary();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Business Courtesy Summary" isOpen>
        <RowWrapper
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {businessCourtesyList.map((dt, index) => (
            <RowWrapper
              key={index}
              sx={{ alignItems: 'center' }}
            >
              <Checkbox
                onChange={() => handleCheck(dt.value)}
                checked={watchFields.checklist?.includes(dt.value)}
                disabled={!isBarCreation || canCreateBAR === false || canEditBAR === false}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
              />
              {dt.value === 'OTHER' ?
                <Input
                  {...register('other')}
                  value={watchFields.other}
                  onChange={(e) => handleCheckOther(e)}
                  type="text"
                  placeholder="Other"
                  disabled={!isBarCreation || canCreateBAR === false || canEditBAR === false || !watchFields.checklist?.includes('OTHER')}
                  containerSx={{ flex: 1 }}
                /> :
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={
                    (canCreateBAR === false || canEditBAR === false || !isBarCreation)
                      ? theme.palette.custom.gray20
                      : theme.palette.primary.main
                  }
                >
                  {dt.label}
                </TextStyle>}
            </RowWrapper>
          )
          )}

        </RowWrapper>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default BusinessCourtesySummary;
