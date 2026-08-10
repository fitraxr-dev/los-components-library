import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useTabBmppCalculation from './TabBmppCalculation.hook';

import type { TabBmppCalculationProps } from './TabBmppCalculation.types';


const TabBmppCalculation = (props: TabBmppCalculationProps) => {
  const {
    module,
    process,
    isPemda,
    viewOnly = false,
    withTableDebtorInformation = false,
    dataMasterDebtor,
    standaloneBmppSimulation = false,
    isUseGetMasterDetail = false,
    handleNext } = props;
  const theme = useTheme();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const {
    handleCalculate,
    tableHeader,
    tableData,
    groupOptionsList,
    isBmppGroupsLoading,
    isBmppGroupsMasterLoading,
    ratingData,
    handleRouteMaintenanceDebitor,
    handleRouteMaintenanceGroup,
    dataAsOfDate,
    isHidePlaceholderGroup,
    isHidePlaceholderRating,
    sectionGroupData,
    isLoadingCalculation,
    isLoadingCalculate,
  } = useTabBmppCalculation({ reset, setValue, watch, ...props });

  const isMandatoryEmpty = !watch('debtorRating');
  const isGroupEmpty = groupOptionsList?.length === 0;
  const isRelatedToSmi = dataMasterDebtor?.isRelatedToSmi ?? dataMasterDebtor?.isRelatedSmi;

  return (
    <>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        {withTableDebtorInformation && (
          <TableDebtorInformation module={module} process={process} isUseGetMasterDetail={isUseGetMasterDetail} />
        )}
        <SectionTitle title="Perhitungan BMPP" isOpen>
          <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', marginY: theme.spacing(2) }}>
            <Button
              onClick={handleRouteMaintenanceDebitor}
            >
              Go to Maintenance Customer
            </Button>
            { !isPemda &&
              <Button
                onClick={handleRouteMaintenanceGroup}
              >
                Go to Maintenance Group
              </Button>
            }
          </RowWrapper>
          <Box
            sx={{
              backgroundColor: '#F0F3FB',
              borderRadius: isPemda ? '6px' : '6px 6px 0 0',
              display: 'grid',
              gap: theme.spacing(2),
              gridTemplateColumns: '1fr',
              mt: theme.spacing(2),
              paddingX: theme.spacing(2),
              paddingY: theme.spacing(4),
            }}
          >
            <RowWrapper>
              <Title title="Section Customer" />
            </RowWrapper>

            <Box
              sx={{
                backgroundColor: '#F0F3FB',
                display: 'grid',
                gap: theme.spacing(2),
                gridTemplateColumns: isPemda ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              }}
            >
              {!isPemda &&
              <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                <RowWrapper>
                  <TextStyle
                    color="#727C98"
                    weight={500}
                  >
                    Jenis Customer
                  </TextStyle>
                </RowWrapper>
                {dataMasterDebtor?.debtorTypeLabel ?? dataMasterDebtor?.debtorType ?? '-'}
              </ColumnWrapper>
              }

              <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                <RowWrapper>
                  <TextStyle
                    color="#727C98"
                    weight={500}
                  >
                    Terkait SMI
                  </TextStyle>
                </RowWrapper>
                {isRelatedToSmi === undefined || isRelatedToSmi === null ? '-' : isRelatedToSmi ? 'Ya' : 'Tidak'}
              </ColumnWrapper>

              <RowWrapper alignItems="end" justifyContent="space-between" sx={{ gap: theme.spacing(2) }}>
                <Controller
                  control={control}
                  name="debtorRating"
                  render={({ field: { ref, onChange, ...field }, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      inputRef={ref}
                      isMandatory
                      disabled={viewOnly}
                      containerSx={{ width: theme.spacing(50) }}
                      type="dropdown"
                      label="Rating Customer"
                      placeholder="Pilih Rating Customer"
                      onChange={(val) => {
                        onChange(val);
                      }}
                      dropdownList={ratingData || []}
                      error={invalid}
                      helperText={error ? error.message : ''}
                      hidePlaceholder={isHidePlaceholderRating}
                    />
                  )}
                />

                <Button
                  color="success"
                  onClick={handleSubmit(handleCalculate)}
                  disabled={viewOnly || isMandatoryEmpty}
                  isLoading={false}
                  sx={{ paddingBottom: theme.spacing(2.2), paddingTop: theme.spacing(2.2) }}
                >
                  Calculate
                </Button>
              </RowWrapper>
            </Box>
          </Box>

          { !isPemda &&
          <>
            <Box sx={{ backgroundColor: '#F0F3FB' }}>
              <RowWrapper>
                <hr style={{ color: theme.palette.custom.gray30, opacity: 0.5, width: '97%' }} />
              </RowWrapper>
            </Box>

            <Box
              sx={{
                backgroundColor: '#F0F3FB',
                borderRadius: '0 0 6px 6px',
                paddingX: theme.spacing(2),
                paddingY: theme.spacing(2),
              }}
            >
              <RowWrapper>
                <Title title="Section Group" />
              </RowWrapper>

              <Box
                sx={{
                  backgroundColor: '#F0F3FB',
                  borderRadius: '0 0 6px 6px',
                  display: 'grid',
                  gap: theme.spacing(2),
                  gridTemplateColumns: '3fr 1fr 1fr',
                  mb: theme.spacing(2),
                  paddingY: theme.spacing(2),
                }}
              >

                <Controller
                  control={control}
                  name="group"
                  render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      disabled={isGroupEmpty}
                      containerSx={{ width: theme.spacing(100) }}
                      inputRef={ref}
                      type="dropdown"
                      label="Group"
                      placeholder="Pilih Group"
                      dropdownList={groupOptionsList}
                      error={invalid}
                      helperText={error ? error.message : ''}
                      hidePlaceholder={isHidePlaceholderGroup}
                    />
                  )}
                />

                <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                  <RowWrapper>
                    <TextStyle
                      color="#727C98"
                      weight={500}
                    >
                      Jenis Group
                    </TextStyle>
                  </RowWrapper>
                  {sectionGroupData?.groupTypeLabel ?? '-'}
                </ColumnWrapper>

                <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                  <RowWrapper>
                    <TextStyle
                      color="#727C98"
                      weight={500}
                    >
                      Terkait SMI
                    </TextStyle>
                  </RowWrapper>
                  {sectionGroupData?.isRelatedSmi === undefined ? '-' : sectionGroupData?.isRelatedSmi === null ? '-' : sectionGroupData?.isRelatedSmi ? 'Ya' : 'Tidak'}
                </ColumnWrapper>
              </Box>
            </Box>
          </>
          }

          <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(3) }}>
            <Box
              sx={{
                borderBottom: '0.02vw solid',
                borderColor: theme.palette.custom.gray30,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                py: 2,
              }}
            >
              <ColumnWrapper sx={{ justifyContent: 'center' }}>
                <TextStyle
                  variant="body3"
                  color={theme.palette.custom.gray30}
                >
                  Data as of
                </TextStyle>
              </ColumnWrapper>

              <ColumnWrapper sx={{ justifyContent: 'center' }}>
                <TextStyle
                  variant="body3"
                  color={theme.palette.custom.gray30}
                >
                  : {dataAsOfDate}
                </TextStyle>
              </ColumnWrapper>
            </Box>
            <Table
              tableHeader={tableHeader}
              tableData={tableData}
              isLoading={isBmppGroupsLoading || isBmppGroupsMasterLoading || isLoadingCalculation || isLoadingCalculate}
            />
          </BaseContainer>

          {!standaloneBmppSimulation && (
            <Input
              type="area"
              label="Keterangan"
              placeholder="Input keterangan"
              containerSx={{ flex: 1 }}
              rows={4}
              disabled={viewOnly}
              value={watch('remarks')}
              onChange={(value) => setValue('remarks', value)}
            />
          )}
        </SectionTitle>

        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button onClick={handleNext} color="primary">
            Next
          </Button>
        </RowWrapper>
      </ColumnWrapper >
    </>
  );
};

export default TabBmppCalculation;
