import React, { useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import useBmppCalculationIndividual
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/individual/BmppCalculationIndividual.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import type {
  TabBmppCalculationProps,
} from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/TabBmppCalculation.types';


const BmppCalculationIndividual = (props: TabBmppCalculationProps) => {
  const {
    isPemda,
    dataMasterDebtor } = props;
  const theme = useTheme();

  const {
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      debtorName: null,
      debtorRating: '',
      debtorType: '',
      group: null,
      isRelation: null,
      remarks: '',
    },
    mode: 'onChange',
  });

  const {
    tableHeader,
    tableData,
    groupOptionsList,
    isBmppGroupsMasterLoading,
    dataAsOfDate,
    isHidePlaceholderGroup,
    sectionGroupData,
    debtorNameList,
  } = useBmppCalculationIndividual({ reset, setValue, watch, ...props });

  const isGroupEmpty = groupOptionsList?.length === 0;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
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
            <RowWrapper>
              <Title title="Section Customer" />
            </RowWrapper>

            <Box
              sx={{
                backgroundColor: '#F0F3FB',
                display: 'grid',
                gap: theme.spacing(3),
                gridTemplateColumns: isPemda ? 'repeat(2, 1fr)' : 'repeat(3, 0.7fr)',
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
                    Terkait SMI
                  </TextStyle>
                </RowWrapper>
                {dataMasterDebtor?.generalInformation?.isRelatedSmi === true ? 'Ya' :
                  dataMasterDebtor?.generalInformation?.isRelatedSmi === false ? 'Tidak' : '-'}
              </ColumnWrapper>

              <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                <RowWrapper>
                  <TextStyle
                    color="#727C98"
                    weight={500}
                  >
                    Rating Customer
                  </TextStyle>

                  <PopupInfoInput
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
                          {/* <TextStyle variant="body5" color={theme.palette.white.main}>
                            Hasil Rating DEPI pada tanggal 20 Februari 2025 14:25:57
                          </TextStyle> */}
                        </ul>
                      </Box>
                    }
                  />
                </RowWrapper>
                {dataMasterDebtor?.generalInformation?.debtorRating ?? '-'}
              </ColumnWrapper>
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
                    {sectionGroupData?.groupType ?? '-'}
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
                    {sectionGroupData?.isRelatedSmi === true ? 'Ya' : sectionGroupData?.isRelatedSmi === false ? 'Tidak' : '-'}
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
              isLoading={isBmppGroupsMasterLoading}
            />
          </BaseContainer>
        </SectionTitle>

      </ColumnWrapper >
    </>
  );
};

export default BmppCalculationIndividual;
