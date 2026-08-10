import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';


import { CurrencyLOV } from '@/configs/constants/lov';
import { formatDate, formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';

import { useInterestDuringContructions, formatToSixDecimal } from './InterestDuringContructions.hooks';


const InterestDuringContructions = ({ facilityInformation }: { facilityInformation: any }) => {
  const {
    control,
    theme,
    isViewOnly,
    handleSaveInterestDuringContructions,
    interestTypeOptions,
    startDateOptions,
    paymentByOptions,
    findDataMaster,
    watch,
    setValue,
  } = useInterestDuringContructions(facilityInformation as any);

  const savedDecimalRef = useRef<string>('');
  const isIDR = watch('currencyIDC') === 'IDR';

  const handleCurrencyChange = (val: string, fieldOnChange: any) => {
    const currentValue = watch('plafondIDC') ?? '';
    const switchingToIDR = val === 'IDR';
    const switchingFromIDR = isIDR && val !== 'IDR';

    let newValue = String(currentValue);

    if (switchingToIDR) {
      const dotIndex = newValue.indexOf('.');
      if (dotIndex !== -1) {
        savedDecimalRef.current = newValue.slice(dotIndex);
        newValue = newValue.slice(0, dotIndex);
      } else {
        savedDecimalRef.current = '';
      }
    } else if (switchingFromIDR) {
      if (savedDecimalRef.current) {
        newValue = newValue + savedDecimalRef.current;
        savedDecimalRef.current = '';
      }
    }

    fieldOnChange(val);
    setValue('plafondIDC', newValue, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <>
      <Title title="Interest During Contructions" sx={{ mb: theme.spacing(3) }} />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle
          isOpen
          title="Interest During Contructions"
          subtitle={`Facility No: ${facilityInformation?.facilityNo ? facilityInformation?.facilityNo : '-'} | RM: ${facilityInformation?.relationshipManager ? facilityInformation?.relationshipManager : '-'} | Divisi: ${facilityInformation?.division ? facilityInformation?.division : '-'}`}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="currencyIDC"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(val: any) => handleCurrencyChange(val, field.onChange)}
                  label="IDC Currency"
                  placeholder="IDC Currency"
                  type="dropdown"
                  dropdownList={CurrencyLOV()}
                  disabled
                  hasDataMaster={findDataMaster('currencyIDC', CurrencyLOV())}
                />
              )}
            />

            <Controller
              name="plafondIDC"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: any) => {
                    const val = e?.target ? e.target.value : e;
                    let normalized = (val ?? '').toString().replace(/^0(?=\d)/, '');
                    if (isIDR) {
                      normalized = normalized.split('.')[0];
                    }
                    field.onChange(normalized);
                  }}
                  label="IDC Plafond"
                  placeholder="IDC Plafond"
                  type="number"
                  decimalScale={isIDR ? 0 : 2}
                  thousandSeparator=","
                  suffix={isIDR ? '.00' : undefined}
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('plafondIDC')}
                />
              )}
            />

            <Controller
              name="availabilityPeriodIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Availability Period"
                  placeholder="IDC Availability Period"
                  type="number"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('availabilityPeriodIDC')}
                />
              }
            />

            <Controller
              name="interestTypeIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Interest Type"
                  placeholder="IDC Interest Type"
                  type="dropdown"
                  dropdownList={interestTypeOptions}
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('interestTypeIDC')}
                />
              }
            />

            <Controller
              name="baseRateIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Base Rate (%)"
                  placeholder="IDC Base Rate (%)"
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('baseRateIDC')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const formatted = formatToSixDecimal(e.target.value);
                    field.onChange(formatted);
                    field.onBlur();
                  }}
                />
              }
            />

            <Controller
              name="marginRateIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Margin Rate (%)"
                  placeholder="IDC Margin Rate (%)"
                  type="number"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('marginRateIDC')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const formatted = formatToSixDecimal(e.target.value);
                    field.onChange(formatted);
                    field.onBlur();
                  }}
                />
              }
            />

            <Controller
              name="effectiveRateIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Effective Rate (%)"
                  placeholder="IDC Effective Rate (%)"
                  type="number"
                  disabled
                  hasDataMaster={findDataMaster('effectiveRateIDC')}
                />
              }
            />

            <Controller
              name="paymentPortionIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Payment Portion %"
                  placeholder="IDC Payment Portion %"
                  type="number"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('paymentPortionIDC')}
                />
              }
            />

            <Controller
              name="startDateIDC"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="IDC Start Date"
                  placeholder="IDC Start Date"
                  type="date"
                  disabled
                  hasDataMaster={findDataMaster('startDateIDC')}
                />
              }
            />

            <Controller
              name="interestIDCPaymentBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Interest IDC Payment By"
                  placeholder="Interest IDC Payment By"
                  type="dropdown"
                  dropdownList={paymentByOptions}
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('interestIDCPaymentBy')}
                />
              }
            />

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="modifiedDate"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                  value={field?.value ? formatDateTime(field?.value) : ''}
                  disabled
                />
              }
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
        <ButtonClose isViewOnly={isViewOnly} handleSave={handleSaveInterestDuringContructions} />
      </RowWrapper>
    </>
  );
};
export default InterestDuringContructions;
