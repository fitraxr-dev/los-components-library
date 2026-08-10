import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate, formatDateTime } from '@/helpers/date';

import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';

import { useFacilityDataDetail, formatToSixDecimal } from './FacilityDataDetail.hook';


const FacilityDataDetail = ({ facilityInformation }: { facilityInformation: any }) => {
  const theme = useTheme();
  const {
    control,
    isViewOnly,
    handleSaveFacilityDataDetail,
    penaltyRateType,
    APby,
    principalGPby,
    facStartdate,
    interestPayinter,
    principalPayinter,
    interestReviewPeriode,
    interestRateType,
    interestType,
    instalmentType,
    holidayType,
    projectSourceofFund,
    daysPerYear,
    interestTypeRefference,
    isValid,
    watch,
    latePaymentPenaltyMethod,
    partialPrepaymentMeth,
    apPeriodestartdate,
    commitmentFeeMethod,
    financingTypeRevolving,
    findDataMaster,
    setValue,
    initialStartPenaltyDate,
    initialEndPenaltyDate,
  } = useFacilityDataDetail();


  const installmentTypeList = [{
    id: 'BT',
    label: 'Bullet Payment',
    value: 'BT',
  }];

  return (
    <>
      <Title title="Facility Data Detail" sx={{ mb: theme.spacing(3) }} />
      <SectionTitle isOpen title="Facility Data Detail" subtitle={`Facility No: ${facilityInformation?.facilityNo ? facilityInformation?.facilityNo : '-'} | RM: ${facilityInformation?.relationshipManager ? facilityInformation?.relationshipManager : '-'} | Divisi: ${facilityInformation?.division ? facilityInformation?.division : '-'}`} sx={{ mb: theme.spacing(3) }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: 2,
          }}
        >

          <Controller
            name="decimalRounded"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Decimal Rounded"
                placeholder="Decimal Rounded"
                disabled
                isMandatory
                type="text"
                hasDataMaster={findDataMaster('decimalRounded')}
              />
            )}
          />

          <Controller
            name="sourceOfFund"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Source Of Fund"
                placeholder="Source Of Fund"
                disabled={isViewOnly}
                type="dropdown"
                dropdownList={projectSourceofFund ?? []}
                isMandatory
                hasDataMaster={findDataMaster('sourceOfFund', projectSourceofFund)}
              />
            )}
          />

          <Controller
            name="billingHoliday"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Billing Holiday Type"
                placeholder="Billing Holiday Type"
                disabled={isViewOnly}
                isMandatory
                type="dropdown"
                dropdownList={holidayType ?? []}
                hasDataMaster={findDataMaster('billingHoliday', holidayType)}
              />
            )}
          />

          <Controller
            control={control}
            name="dayPerYear"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Days Per Year"
                  placeholder="Days Per Year"
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  isMandatory
                  type="dropdown"
                  dropdownList={daysPerYear ?? []}
                  hasDataMaster={findDataMaster('dayPerYear', daysPerYear)}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="financingType"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Financing Type"
                  placeholder="Financing Type"
                  type="dropdown"
                  dropdownList={financingTypeRevolving ?? []}
                  containerSx={{ flex: 1 }}
                  disabled
                  hasDataMaster={findDataMaster('financingType', financingTypeRevolving)}
                />
              );
            }}
          />

          <Controller
            name="installmentType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Installment Type"
                placeholder="Installment Type"
                type="dropdown"
                dropdownList={watch('product') && (watch('product').includes('KMK_REVOLVING') || watch('product').includes('KMK_TRANSACTIONAL')) ? installmentTypeList : instalmentType ?? []}
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('installmentType', instalmentType)}
              />
            }
          />

          <Controller
            name="tenor"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tenor"
                placeholder="Tenor"
                type="number"
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('tenor')}
              />
            }
          />

          <Controller
            name="interestType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Interest Type"
                placeholder="Interest Type"
                type="dropdown"
                isMandatory
                dropdownList={interestType ?? []}
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('interestType', interestType)}
              />
            }
          />
          <Controller
            name="interestRateType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Interest Rate Type"
                placeholder="Interest Rate Type"
                isMandatory
                disabled={isViewOnly}
                type="dropdown"
                dropdownList={interestRateType ?? []}
                hasDataMaster={findDataMaster('interestRateType', interestRateType)}
              />
            }
          />

          <Controller
            name="interestRateReference"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Interest Rate Reference"
                placeholder="Interest Rate Reference"
                disabled={isViewOnly || watch('interestType') === 'FIXED'}
                isMandatory
                type="dropdown"
                dropdownList={interestTypeRefference ?? []}
                hasDataMaster={findDataMaster('interestRateReference', interestTypeRefference)}
              />
            }
          />

          <Controller
            name="baseRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Base Rate (%)"
                placeholder="Base Rate (%)"
                type="number"
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('baseRate')}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const formatted = formatToSixDecimal(e.target.value);
                  field.onChange(formatted);
                  field.onBlur();
                }}
              />
            )}
          />

          <Controller
            name="marginRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Margin Rate (%)"
                placeholder="Margin Rate (%)"
                type="number"
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('marginRate')}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const formatted = formatToSixDecimal(e.target.value);
                  field.onChange(formatted);
                  field.onBlur();
                }}
              />
            )}
          />

          <Controller
            name="effectiveRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Effective Rate (%)"
                placeholder="Effective Rate (%)"
                isMandatory
                disabled
                hasDataMaster={findDataMaster('effectiveRate')}
              />
            )}
          />

          {/* <Controller
            control={control}
            name="interestReviewPeriod"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Interest Review Period"
                  placeholder="Interest Review Period"
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  type="dropdown"
                  dropdownList={interestReviewPeriode ?? []}
                />
              );
            }}
          /> */}
          <Controller
            control={control}
            name="principalPaymentInterval"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Principal Payment Interval"
                  placeholder="Principal Payment Interval"
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  type="dropdown"
                  dropdownList={principalPayinter ?? []}
                  isMandatory
                  hasDataMaster={findDataMaster('principalPaymentInterval', principalPayinter)}
                />
              );
            }}
          />

          <Controller
            name="interestPaymentInterval"
            control={control}
            render={({ field, fieldState: { error } }) =>
              <Input
                {...field}
                label="Interest Payment Interval"
                placeholder="Interest Payment Interval"
                type="dropdown"
                dropdownList={interestPayinter ?? []}
                disabled={isViewOnly}
                isMandatory
                hasDataMaster={findDataMaster('interestPaymentInterval', interestPayinter)}
                error={!!error}
                helperText={error?.message}
              />
            }
          />

          <Controller
            name="facilityStartDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Facility Start Date"
                placeholder="Facility Start Date"
                type="date"
                // dropdownList={facStartdate ?? []}
                disabled={isViewOnly}
                isMandatory
                hasDataMaster={findDataMaster('facilityStartDate')}
              />
            }
          />

          <Controller
            name="startDateType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Start Date Type"
                placeholder="Start Date Type"
                type="dropdown"
                dropdownList={apPeriodestartdate ?? []}
                disabled={isViewOnly}
                onChange={(e) => {
                  field.onChange(e);
                  setValue('availabilityPeriodStartDate', e);
                  if (e === 'DB') {
                    setValue('principalGraceperiodBy', 'MONTH');
                    setValue('availabilityPeriodBy', 'MONTH');
                  }
                  if (e === 'PK') {
                    // Reset dates first; useEffect will recalculate once dataDetailPk is fetched

                    setValue('principalGraceperiodBy', 'DATE');
                    setValue('availabilityPeriodBy', 'DATE');

                    setValue('principalGraceperiodEndDate', null);
                    setValue('availabilityPeriodEndDate', null);
                  }
                }}
                isMandatory
                hasDataMaster={findDataMaster('startDateType', apPeriodestartdate)}
              />
            }
          />

        </Box>
      </SectionTitle>

      <SectionTitle isOpen title="Period" sx={{ mb: theme.spacing(3) }} >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: 2,
          }}
        >
          <Controller
            name="principalGraceperiodBy"
            control={control}
            render={({ field }) =>
              (<Input
                {...field}
                label="Principal Grace Period By"
                placeholder="Principal Grace Period By"
                type="dropdown"
                dropdownList={principalGPby ?? []}
                disabled={isViewOnly || watch('startDateType') === 'DB'}
                onChange={(e) => {
                  field.onChange(e);
                  setValue('principalGraceperiod', null);
                  setValue('principalGraceperiodEndDate', null);
                }}
                isMandatory
                hasDataMaster={findDataMaster('principalGraceperiodBy', principalGPby)}
              />)
            }
          />
          {watch('principalGraceperiodBy') === 'DATE' && (
            <>

              <Controller
                name="principalGraceperiodEndDate"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Principal Grace Period End Date"
                    placeholder="Principal Grace Period End Date"
                    type="date"
                    disabled
                    isMandatory
                    hasDataMaster={findDataMaster('principalGraceperiodEndDate')}
                    error={false}
                  />
                }
              />

              <Controller
                name="principalGraceperiod"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Principal Grace Period"
                    placeholder="Principal Grace Period"
                    type="number"
                    maxLength={6}
                    disabled={isViewOnly}
                    isMandatory
                    hasDataMaster={findDataMaster('principalGraceperiod')}
                    error={Number(watch('principalGraceperiod')) > Number(watch('tenor'))}
                    helperText={Number(watch('principalGraceperiod')) > Number(watch('tenor')) ? 'Nilai yang diinput lebih besar dari Tenor' : ''}
                  />
                }
              />
            </>
          )}

          <Controller
            name="interestGraceperiod"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Interest Grace Period"
                placeholder="Interest Grace Period"
                type="number"
                isMandatory
                disabled={isViewOnly || watch('product') && (watch('product').includes('KMK_REVOLVING') || watch('product').includes('KMK_TRANSACTIONAL'))}
                hasDataMaster={findDataMaster('interestGraceperiod')}
                onKeyDown={(e: any) => {
                  if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />

          <Controller
            name="availabilityPeriodBy"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Availability Period By"
                placeholder="Availability Period By"
                type="dropdown"
                dropdownList={APby ?? []}
                disabled={isViewOnly || watch('startDateType') === 'DB'}
                onChange={(e) => {
                  field.onChange(e);
                  setValue('availabilityPeriod', null);
                  setValue('availabilityPeriodEndDate', null);
                }}
                isMandatory
                hasDataMaster={findDataMaster('availabilityPeriodBy', APby)}
              />
            )}
          />

        </Box>
      </SectionTitle>
      <SectionTitle isOpen title="Penalty" sx={{ mb: theme.spacing(3) }} >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: 2,
          }}
        >
          {watch('availabilityPeriodBy') === 'DATE' && (
            <>

              <Controller
                name="availabilityPeriodEndDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Availability Period End Date"
                    placeholder="Availability Period End Date"
                    type="date"
                    isMandatory
                    disabled
                    hasDataMaster={findDataMaster('availabilityPeriodEndDate')}
                    error={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="availabilityPeriod"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      label="Availability Period"
                      placeholder="Availability Period"
                      containerSx={{ flex: 1 }}
                      disabled={isViewOnly}
                      type="number"
                      // isAllowed={(values) => {
                      //   const { floatValue } = values;
                      //   return (
                      //     (floatValue <= Number(watch('tenor')) &&
                      // floatValue >= 0) || floatValue === null || floatValue === undefined
                      //   );
                      // }}
                      helperText={Number(watch('availabilityPeriod')) > Number(watch('tenor')) ? 'Nilai yang diinput lebih besar dari Tenor' : ''}
                      error={Number(watch('availabilityPeriod')) > Number(watch('tenor'))}
                      isMandatory
                      hasDataMaster={findDataMaster('availabilityPeriod')}
                      maxLength={6}
                    />
                  );
                }}
              />
            </>
          )}

          <Controller
            control={control}
            name="penaltyRateType"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Penalty Rate Type"
                  placeholder="Penalty Rate Type"
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  type="dropdown"
                  isMandatory
                  dropdownList={penaltyRateType ?? []}
                  hasDataMaster={findDataMaster('penaltyRateType', penaltyRateType)}
                />
              );
            }}
          />

          {/* <Controller
            name="marginPenalty"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Margin Penalty(Per Year)"
                placeholder="Margin Penalty(Per Year)"
                type="text"
                disabled={isViewOnly}
              />
            }
          /> */}

          <Controller
            name="latePaymentPenalty"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Late Payment Penalty(Per Year)"
                placeholder="Late Payment Penalty(Per Year)"
                type="number"
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('latePaymentPenalty')}
              />
            }
          />

          <Controller
            name="latePaymentPenaltyMethod"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Late Payment Penalty Method"
                placeholder="Late Payment Penalty Method"
                type="dropdown"
                dropdownList={latePaymentPenaltyMethod ?? []}
                disabled={isViewOnly}
                isMandatory
                hasDataMaster={findDataMaster('latePaymentPenaltyMethod', latePaymentPenaltyMethod)}
              />
            }
          />
          <Controller
            name="partialPrepaymentMethod"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Partial Prepayment Method"
                placeholder="Partial Prepayment Method"
                type="dropdown"
                dropdownList={partialPrepaymentMeth ?? []}
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('partialPrepaymentMethod', partialPrepaymentMeth)}
              />
            }
          />

          <Controller
            name="penaltyET"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Penalty ET"
                placeholder="Penalty ET"
                disabled={isViewOnly}
                type="number"
                isMandatory
                hasDataMaster={findDataMaster('penaltyET')}
                onChange={(e) => {
                  field.onChange(e);
                  if (Number(e.target.value) === 0) {
                    setValue('startDatePenaltyET', initialStartPenaltyDate);
                    setValue('endDatePenaltyET', initialEndPenaltyDate);
                  }
                }}
              />
            }
          />

          <Controller
            name="startDatePenaltyET"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Start Date Penalty ET"
                placeholder="Start Date Penalty ET"
                type="date"
                isMandatory={Number(watch('penaltyET')) > 0}
                disabled={isViewOnly || Number(watch('penaltyET')) === 0}
                hasDataMaster={findDataMaster('startDatePenaltyET')}
              />
            )}
          />

          <Controller
            name="endDatePenaltyET"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="End Date Penalty ET"
                placeholder="End Date Penalty ET"
                type="date"
                isMandatory={Number(watch('penaltyET')) > 0}
                disabled={isViewOnly || Number(watch('penaltyET')) === 0}
                hasDataMaster={findDataMaster('endDatePenaltyET')}
              />
            )}
          />

          <Controller
            name="paymentDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Payment Date"
                placeholder="Payment Date"
                type="dropdown"
                isMandatory
                dropdownList={(() => {
                  let list = [];
                  for (let i = 1; i <= 31; i++) {
                    list.push({ label: i, value: i });
                  }
                  return list;
                })()}
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('paymentDate')}
              />
            )}
          />

          <Controller
            control={control}
            name="availabilityPeriodStartDate"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Availability Period Start Date"
                  placeholder="Availability Period Start Date"
                  type="dropdown"
                  dropdownList={apPeriodestartdate ?? []}
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('availabilityPeriodStartDate', apPeriodestartdate)}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="facilityMaturityDate"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Facility Maturity Date"
                  placeholder="Facility Maturity Date"
                  type="date"
                  isMandatory
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('facilityMaturityDate')}
                />
              );
            }}
          />

          <Controller
            name="commitmentFeeMethod"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Commitment Fee Method"
                placeholder="Commitment Fee Method"
                type="dropdown"
                dropdownList={commitmentFeeMethod ?? []}
                isMandatory
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('commitmentFeeMethod', commitmentFeeMethod)}
              />
            }
          />
        </Box>
      </SectionTitle>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          py: 2,
        }}
      >
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
              value={field?.value ? formatDateTime(field?.value) : ''}
              type="text"
              disabled
            />
          }
        />
      </Box>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2 }}>
        <ButtonClose handleSave={handleSaveFacilityDataDetail} isViewOnly={isViewOnly} />
      </RowWrapper>
    </>
  );
};
export default FacilityDataDetail;
