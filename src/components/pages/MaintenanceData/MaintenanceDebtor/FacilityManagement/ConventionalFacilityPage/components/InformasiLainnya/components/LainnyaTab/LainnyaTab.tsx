import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate, formatDateTime } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';
import TableFacilityInformation from '../InformasiSindikasiTab/components/TableFacilityInformation/TableFacilityInformationLocal';

import useLainnyaTab from './LainnyaTab.hooks';


const LainnyaTab = () => {
  const {
    control,
    handleSaveLainnyaInformation,
    savingLainnyaInformation,
    theme,
    isDisabled,
    facilityInformation,
    watch,
    sourceOfFundOptions,
    programSourceOfFundOptions,
    governmentMandateOptions,
    byValue,
    errors,
    findDataMaster,
    isOrderType,
  } = useLainnyaTab();

  return (
    <>
      <Title title="Lainnya" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <TableFacilityInformation
          facilityID= { !!isOrderType ? facilityInformation?.data?.content?.facilityId :
            facilityInformation?.data?.content?.facilityCore}
          facilityNo= { facilityInformation?.data?.content?.facilityNo}
          divisi= {facilityInformation?.data?.content?.division}
          rm= {facilityInformation?.data?.content?.relationshipManager}
          lastModified= {facilityInformation?.data?.content?.modifiedDate}
          modifiedBy= {facilityInformation?.data?.content?.modifiedBy}
        />
        <SectionTitle isOpen title="Lainnya">
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="providingFinancing"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Pemberian Pembiayaan"
                  placeholder={isDisabled ? 'Pemberian Pembiayaan' : 'Input Pemberian Pembiayaan'}
                  type="text"
                  disabled={isDisabled}
                  hasDataMaster={findDataMaster('providingFinancing')}
                />
              }
            />

            <Controller
              name="guarantee"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  label="Penjaminan/Penugasan"
                  placeholder={isDisabled ? 'N/A' : 'Pilih Penjaminan/Penugasan'}
                  dropdownList={governmentMandateOptions}
                  onChange={(val) => onChange(String(val?.value))}
                  value={value ? governmentMandateOptions?.find((o) => o?.value === value) : null}
                  disabled={isDisabled}
                  hasDataMaster={findDataMaster('guarantee', governmentMandateOptions)}
                />
              )}
            />

            <Controller
              name="programSourceOfFund"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  label="Program dari Source of Fund"
                  placeholder={isDisabled ? 'N/A' : 'Pilih Program dari Source of Fund'}
                  dropdownList={programSourceOfFundOptions}
                  onChange={(val) => onChange(String(val?.id))}
                  value={byValue(value, programSourceOfFundOptions)}
                  disabled={isDisabled}
                  hasDataMaster={findDataMaster('programSourceOfFund', programSourceOfFundOptions)}
                />
              )}
            />

            {watch('programSourceOfFund') === 'Others' ?
              <Controller
                name="otherSourceOfFund"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isDisabled}
                    disabled={isDisabled}
                    type="text"
                    label="Other Program Source of Fund"
                    placeholder="Input Other Program Source of Fund"
                    containerSx={{ flex: 1 }}
                    error={!!errors.otherSourceOfFund}
                    helperText={errors.otherSourceOfFund?.message || null}
                    hasDataMaster={findDataMaster('otherSourceOfFund')}
                  />
                )}
              />
              : null}

            <Controller
              name="sourceOfFund"
              control={control}
              render={({ field: { onChange, value } }) =>
                <Autocomplete
                  label="Source of Fund"
                  placeholder={isDisabled ? 'N/A' : 'Pilih Source of Fund'}
                  dropdownList={sourceOfFundOptions}
                  onChange={(val) => onChange(String(val?.id))}
                  value={byValue(value, sourceOfFundOptions)}
                  disabled={isDisabled}
                  hasDataMaster={findDataMaster('sourceOfFund', sourceOfFundOptions)}
                />
              }
            />

            <Controller
              name="remarkSourceOfFund"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Remarks Source of Fund"
                  placeholder="Input Remarks Source of Fund"
                  type="text"
                  disabled={isDisabled}
                  hasDataMaster={findDataMaster('remarkSourceOfFund')}
                />
              }
            />

            <Controller
              name="initialContractNumber"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nomor Akad Awal"
                  placeholder="Input Nomor Akad Awal"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('initialContractNumber')}
                />
              }
            />

            <Controller
              name="initialContractDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tanggal Akad Awal"
                  placeholder="Choose Tanggal Akad Awal"
                  type="date"
                  disabled
                  hasDataMaster={findDataMaster('initialContractDate')}
                />
              )}
            />

            <Controller
              name="finalContractNumber"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nomor Akad Akhir"
                  placeholder="Input Nomor Akad Akhir"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('finalContractNumber')}
                />
              }
            />

            <Controller
              name="finalContractDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tanggal Akad Akhir"
                  placeholder="Pilih Tanggal Akad Akhir"
                  type="date"
                  disabled
                  hasDataMaster={findDataMaster('finalContractDate')}
                />
              )}
            />

            <Controller
              name="effectiveDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Effective Date"
                  placeholder="Pilih Effective Date"
                  type="text"
                  value={field.value ? formatDate(new Date(field.value)) : ''}
                  disabled
                  hasDataMaster={findDataMaster('effectiveDate')}
                />
              )}
            />

            <Controller
              name="accountOfficer"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Account Officer"
                  placeholder="Input Account Officer"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('accountOfficer')}
                />
              }
            />

            <Controller
              name="accountOfficerDivision"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Account Officer Division"
                  placeholder="Input Account Officer Division"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('accountOfficerDivision')}
                />
              }
            />

            <Controller
              name="branchCode"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Kode Cabang"
                  placeholder="Input Kode Cabang"
                  type="text"
                  // disabled={isDisabled}
                  disabled
                  hasDataMaster={findDataMaster('branchCode')}
                />
              }
            />

            <Box sx={{ gridColumn: 'span 2' }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Keterangan"
                    placeholder="Input Keterangan"
                    type="area"
                    rows={3}
                    disabled={isDisabled}
                    hasDataMaster={findDataMaster('description')}
                  />
                }
              />
            </Box>

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Input Modified By"
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
                  placeholder="Input Last Modified"
                  type="text"
                  disabled

                  value={field.value ? formatDateTime(field.value) : ''}
                />
              }
            />
          </Box>
        </SectionTitle>

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
          <ButtonClose />
          { !isDisabled && (
            <Button
              isLoading={savingLainnyaInformation}
              onClick={() => handleSaveLainnyaInformation()}
            >
              Save
            </Button>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};
export default LainnyaTab;
