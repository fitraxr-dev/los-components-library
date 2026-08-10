import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useOtherProjectInformation from './OtherProjectInformation.hooks';


const OtherProjectInformation = () => {
  const theme = useTheme();
  const {
    control,
    watch,
  } = useOtherProjectInformation();

  console.log('watch other Information', watch('otherInformation'));

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Informasi Project Lainnya" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {watch('otherInformation.dataAsOf') ? formatDateTime(watch('otherInformation.dataAsOf')) : '-'}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingBottom: theme.spacing(3),
          }}
        >
          <Controller
            name="otherInformation.programSourceOfFund.value"
            control={control}
            disabled
            render={({ field }) => {
              console.log('field', field);
              return (
                <Input
                  {...field}
                  label="Program dari Source of Fund"
                  placeholder="Program dari Source of Fund"
                  type="text"
                />
              );
            }
            }
          />
          <Controller
            name="otherInformation.projectSourceOfFund.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Source of Fund Project"
                placeholder="Source of Fund Project"
                type="text"
              />
            }
          />

        </Box>
        <Box
          sx={{ paddingBottom: theme.spacing(3) }}
        >
          <Controller
            name="otherInformation.remarkSourceOfFund.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Remark Source of Fund"
                placeholder="Remark Source of Fund"
                type="area"
                rows={4}
              />
            }
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingBottom: theme.spacing(3),
          }}
        >
          <Box display="flex" flexDirection="column" gap={theme.spacing(3)}>
            <Currency
              label="Nilai (Isian Nilai dari Source Of Fund)"
              placeholder="Input Nilai (Isian Nilai dari Source Of Fund)"
              containerSx={{ flex: 1 }}
              value={{ currency: watch('otherInformation.valueSourceOfFund.value.currency'), value: watch('otherInformation.valueSourceOfFund.value.value') }}
              // onChange={(val) => {
              //   setValue('sofCurrency', val.currency);
              //   setValue('sofValue', val.value);
              // }}
              disabled
            />

            {
              watch('otherInformation.valueSourceOfFund.value.currency') === 'USD' ? (
                <>
                  <Currency
                    label="Exchange Rate"
                    placeholder="Exchange Rate"
                    value={{ currency: watch('otherInformation.exchangeRateSourceOfFund.value.value'), value: watch('otherInformation.exchangeRateSourceOfFund.value.value') }}
                    // onChange={(val) => {setValue('sofExchangeRate', val.value);}}
                    disabled
                  />

                  <Currency
                    label="Nilai (Isian Nilai dari Source Of Fund) (dalam Rp)"
                    placeholder="Nilai (Isian Nilai dari Source Of Fund)"
                    containerSx={{ flex: 1 }}
                    value={{ currency: watch('otherInformation.valueInIdr.value.currency'), value: watch('otherInformation.valueSourceOfFund.value.value') }}
                    // onChange={(val) => {setValue('projectValueIdr', val.value);}}
                    disabled
                  />
                </>
              ) : null
            }
          </Box>

          <Controller
            name="otherInformation.physicalRealization.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Realisasi Fisik"
                placeholder="Input Realisasi Fisik"
                type="text"
              // rows={4}
              />
            }
          />

        </Box>


        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="otherInformation.modifiedBy"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Modified By"
                type="text"
              />
            }
          />
          <Controller
            name="otherInformation.modifiedDate"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
              />
            }
          />
        </Box>
      </SectionTitle>
    </ColumnWrapper >
  );
};

export default OtherProjectInformation;
