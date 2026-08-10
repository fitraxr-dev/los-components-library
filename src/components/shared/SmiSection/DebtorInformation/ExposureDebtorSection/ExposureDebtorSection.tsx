import React from 'react';

import { Box, useTheme } from '@mui/material';

import { toDateString } from '@/helpers/date';

import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import type { ExposureDebtorSectionProps } from './ExposureDebtorSection.types';


const ExposureDebtorSection = (props: ExposureDebtorSectionProps) => {
  const { isAsOf, valueAsOf, exposuresData } = props;
  const theme = useTheme();

  return (
    <SectionTitle title="Total Eksposure Customer" isOpen>
      <Box mt={2}>
        {isAsOf &&
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              pb: 2,
            }}
          >
            <TextStyle
              variant="body3"
              sx={{
                fontWeight: 'bold',
              }}
              color={theme.palette.custom.gray30}
            >
              As Of:
            </TextStyle>
            <Box

              sx={{
                alignItems: 'center',
                border: '1px solid #bebebe',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                p: '10px',
              }}
            >
              <TextStyle
                variant="body4"
                color={theme.palette.custom.gray30}
              >
                {` ${ valueAsOf?.length ? toDateString(valueAsOf) : 'DD/MM/YYYY'}`}
              </TextStyle>
              <Icon
                textVariant="body2"
                iconName="calendar"
              />
            </Box>
          </Box>}
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridGap: theme.spacing(3),
            gridTemplateRows: 'repeat(2, 1fr)',
          }}
        >
          {exposuresData?.map((item, index) => (
            <Currency
              key={index}
              disabled={item.viewOnly}
              label={item.label}
              placeholder={item.label}
              containerSx={{ flex: 1 }}
              currencyList={[
                { label: item.currency, value: item.currency },
              ]}
              value={{ currency: item.currency, value: item.value }}
            />
          ))}
        </Box>
      </Box>
    </SectionTitle>
  );
};

export default ExposureDebtorSection;
