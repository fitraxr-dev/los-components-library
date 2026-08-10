import React from 'react';

import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import useBmppCalculationGroup
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/group/BmppCalculationGroup.hook';
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


const BmppCalculationGroup = (props: TabBmppCalculationProps) => {

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
    dataAsOfDate,
    theme,
    anchorEl,
    setAnchorEl,
    detailGroup,
    isCustomerEmpty,
    customerList,
    isHidePlaceholderGroup,
    sectionCustomerData,
    tableData, tableHeader, isBmppGroupsMasterLoading,
  } = useBmppCalculationGroup({ reset, setValue, watch, ...props });
  return (
    <>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <SectionTitle title="Perhitungan BMPP" isOpen>
          <Box
            sx={{
              backgroundColor: '#F0F3FB',
              borderRadius: '6px 6px 0 0',
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
                gridTemplateColumns: 'repeat(4, 0.25fr)',
              }}
            >
              <Controller
                control={control}
                name="customer"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    containerSx={{ width: theme.spacing(60) }}
                    disabled={isCustomerEmpty}
                    inputRef={ref}
                    type="dropdown"
                    label="Nama Customer"
                    placeholder="Pilih Nama Customer"
                    dropdownList={customerList}
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
                    Jenis Customer
                  </TextStyle>
                </RowWrapper>
                { sectionCustomerData?.typeDebtor ?? '-'}
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
                { (sectionCustomerData?.isRelatedSmi === true) ? 'Ya' : sectionCustomerData?.isRelatedSmi === false ? 'Tidak' : '-' }
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
                          <TextStyle variant="body5" color={theme.palette.white.main}>
                            Hasil Rating DEPI pada tanggal 20 Februari 2025 14:25:57
                          </TextStyle>
                        </ul>
                      </Box>
                    }
                  />
                </RowWrapper>
                { sectionCustomerData?.rating ?? '-' }
              </ColumnWrapper>
            </Box>
          </Box>

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
                gridTemplateColumns: 'repeat(3, 1fr)',
                mb: theme.spacing(2),
                paddingY: theme.spacing(2),
              }}
            >
              <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                <RowWrapper>
                  <TextStyle
                    color="#727C98"
                    weight={500}
                  >
                    Group
                  </TextStyle>
                </RowWrapper>
                { detailGroup?.content?.groupName ?? '-'}
              </ColumnWrapper>

              <ColumnWrapper sx={{ fontSize: '1.0417vw', fontWeight: 600, gap: theme.spacing(1) }}>
                <RowWrapper>
                  <TextStyle
                    color="#727C98"
                    weight={500}
                  >
                    Jenis Group
                  </TextStyle>
                </RowWrapper>
                { detailGroup?.content?.group?.label ?? '-'}
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
                { (detailGroup?.content?.isRelatedSmi === undefined || detailGroup?.content?.isRelatedSmi === null) ? '-' : detailGroup?.content?.isRelatedSmi ? 'Ya' : 'Tidak'}
              </ColumnWrapper>
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
    </>
  );
};

export default BmppCalculationGroup;
