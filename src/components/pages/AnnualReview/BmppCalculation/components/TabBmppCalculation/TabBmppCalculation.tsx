import React from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
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
    isPemda,
    dataMasterDebtor,
    viewOnly,
    module,
    process,
  } = props;

  const {
    tableHeader,
    tableData,
    groupOptionsList,
    isBmppGroupsMasterLoading,
    dataAsOfDate,
    isHidePlaceholderGroup,
    sectionGroupData,
    control,
    theme,
    handleCalculate,
    handleSubmit,
    watch,
  } = useTabBmppCalculation(props);

  const isMandatoryEmpty = !watch('debtorRating');
  const isGroupEmpty = groupOptionsList?.length === 0;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <TableDebtorInformation module={module} process={process} />
      <SectionTitle title="Perhitungan BMPP" isOpen>
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
          <Box
            sx={{
              backgroundColor: '#F0F3FB',
              display: 'grid',
              gap: theme.spacing(3),
              gridTemplateColumns: isPemda ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
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
              {dataMasterDebtor?.generalInformation?.debtorType?.label ?? '-'}
            </ColumnWrapper>
            }

            <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
              <RowWrapper>
                <TextStyle
                  color="#727C98"
                  weight={500}
                >
                  Rating Customer
                </TextStyle>

                {/* <PopupInfoInput
                  iconName="information-shape"
                  status={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  sx={{ alignItems: 'center', mx: 1, top: 0 }}
                  content={
                    <Box sx={{ bgcolor: '#284A63', height: '100%', width: '100%' }}>
                      <ul
                        style={{
                          color: '#FFF',
                          margin: '0px',
                          paddingBlock: '6px',
                          paddingInline: '10px',
                        }}
                      >
                        <TextStyle variant="body5" color={theme.palette.white.main}>
                          Hasil Rating DEPI pada tanggal 20 Februari 2025 14:25:57
                        </TextStyle>
                      </ul>
                    </Box>
                  }
                /> */}
              </RowWrapper>
              {dataMasterDebtor?.generalInformation?.debtorRating ?? '-'}
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
              {dataMasterDebtor?.generalInformation?.isRelatedSmi === true ? 'Ya' :
                dataMasterDebtor?.generalInformation?.isRelatedSmi === false ? 'Tidak' : '-'}
            </ColumnWrapper>

            <RowWrapper alignItems="end" justifyContent="space-between" sx={{ gap: theme.spacing(2) }}>
              <Controller
                control={control}
                name="group"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={isGroupEmpty}
                    containerSx={{ width: theme.spacing(50) }}
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
            isLoading={isBmppGroupsMasterLoading}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TabBmppCalculation;
