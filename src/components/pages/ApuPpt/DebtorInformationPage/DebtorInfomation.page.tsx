'use client';
import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData/AlertDifferentData';
import DebtorDetailSectionV2 from '@/components/shared/SmiSection/DebtorDetailSectionV2/DebtorDetailSectionV2';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();

  const {
    process,
    debtorInfoData,
    jobPositionData,
    goToNextStep,
    isPemda,
    institutionTypeDropdownList,
    isValidateSuccess,
    validateResult,
    checkBtn,
    similiarProcessData,
    businessGroupTableData,
    businessGroupListLoading,
    processId,
  } = useDebtorInformation();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <RowWrapper justifyContent="space-between">
        <RowWrapper gap={2}>
          <Title title="Informasi Customer" />
          {isValidateSuccess && validateResult?.content.invalid &&
            <Tooltip
              title={
                <Box
                  sx={{
                    margin: '-10px 0 -10px -10px',
                  }}
                >
                  <TextStyle
                    variant="body6"
                  >
                    {parse(validateResult?.content?.result)}
                  </TextStyle>
                </Box>
              }
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                  },
                },
              }}
            >
              <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                <Icon iconName="new-info" />
              </Box>
            </Tooltip>}
        </RowWrapper>


        <RowWrapper>

          {checkBtn(similiarProcessData)?.length > 0 && checkBtn(similiarProcessData).map((el) => (
            <Button
              key={el.label}
              sx={{ ml: 2, px: 4, py: 1.5 }}
              startIcon={el?.iconName}
              onClick={el.onClick ?? null}
              isLoading={el.isLoading}
              {...(el.disabled && { disabled: true })}
              color={el.color}
            >
              {el.label}
            </Button>
          ))}

        </RowWrapper>

      </RowWrapper>

      {isValidateSuccess && validateResult?.content.invalid && (
        <RowWrapper alignItems="center" gap={1}>
          <Icon iconName="information-shape" />
          <TextStyle variant="body7" color={theme.palette.primary.main}>
            Untuk mengubah Data Customer silahkan ke Maintenance Data
          </TextStyle>
        </RowWrapper>
      )}
      <TableDebtorInformation module={TypeModule.APU_PPT} process={process} />
      {/* <SectionTitle title="Detail Customer" isOpen>
        <BaseContainer sx={{ boxShadow: 2, padding: 2 }}>
          <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
            <RowWrapper width="50%" gap={1}>
              <Input
                disabled
                containerSx={{
                  flex: 1,
                }}
                type="dropdown"
                label="Institution Type"
                placeholder="Institution Type"
                value={debtorInfoData.institutionType}
                dropdownList={institutionTypeDropdownList}
              />
              <Input
                id="input-request-name"
                data-testid="input-request-name"
                isMandatory={false}
                containerSx={{
                  flex: 1,
                }}
                type="text"
                label="Nama Customer"
                placeholder="Hubungan dengan SMI Sejak Tahun"
                value={debtorInfoData?.debtorName}
                disabled
              />
            </RowWrapper>
            <Box width="50%">
              <Input
                id="input-request-year-with-smi"
                data-testid="input-request-year-with-smi"
                isMandatory={false}
                type="text"
                label="Hubungan dengan SMI Sejak Tahun"
                placeholder="Hubungan dengan SMI Sejak Tahun"
                value={debtorInfoData?.relationshipSince}
                disabled
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
            <Box width="50%">
              <Input
                id="input-request-year"
                data-testid="input-request-year"
                isMandatory={false}
                type="text"
                label="Tahun didirikan"
                placeholder="Tahun didirikan"
                value={debtorInfoData?.yearFounded}
                disabled
              />
            </Box>
            <Box width="50%">
              <Input
                id="input-request-year"
                data-testid="input-request-year"
                isMandatory={false}
                type="radio"
                label="Terafiliasi dengan SMI"
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                sx={{ flex: 1, marginY: 1 }}
                disabled
                value={debtorInfoData?.isAffiliate ? true : false}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
            <Box width="50%">
              <Input
                disabled
                type="radio"
                label="Customer Memiliki Group"
                value={debtorInfoData.isGroup}
                radioList={[
                  {
                    label: 'Ya',
                    value: true,
                  },
                  {
                    label: 'Tidak',
                    value: false,
                  },
                ]}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box width="50%">
              <Input
                disabled
                type="radio"
                label="Terkait dengan SMI"
                value={debtorInfoData.isRelatedToSmi}
                radioList={[
                  {
                    label: 'Ya',
                    value: true,
                  },
                  {
                    label: 'Tidak',
                    value: false,
                  },
                ]}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>


          <Box sx={{ display: 'flex', gap: 1, padding: 0 }} mb={2}>
            <Box width="50%">
              <Input
                isMandatory={false}
                type="text"
                label="Jenis Customer"
                placeholder="Jenis Customer"
                value={debtorInfoData?.debtorOwnershipsLabel}
                disabled
              />
            </Box>
            <Box width="25%" pl={1}>
              <Input
                isMandatory={false}
                type="text"
                label="Contact Person"
                placeholder="Contact Person"
                value={debtorInfoData?.contactPerson}
                disabled
              />
            </Box>
            <Box width="25%" pl={1}>
              <Input
                isMandatory={false}
                type="dropdown"
                label="Jabatan"
                dropdownList={jobPositionData}
                value={debtorInfoData?.positionId}
                disabled
              />
            </Box>
          </Box>
          <Box width="50%" py={1}>
            <Input
              isMandatory={false}
              type="text"
              label="Jenis Sektor Usaha"
              placeholder="Jenis Sektor Usaha"
              value={debtorInfoData?.sectorName ?? '-'}
              disabled
            />
          </Box>
        </BaseContainer>
      </SectionTitle> */}
      <DebtorDetailSectionV2 debtorInfoData={debtorInfoData} />

      {debtorInfoData?.isGroup ? <TableBusinessGroup module={TypeModule.APU_PPT} process={process} /> : null
        // <SectionTitle title="Group Usaha" sx={{ mb: 3 }} isOpen>
        //   <BaseContainer
        //     sx={{
        //       boxShadow: 2,
        //     }}
        //   >
        //     <Table
        //       tableHeader={[
        //         {
        //           key: 'index',
        //           label: 'No',
        //           type: 'index',
        //         },
        //         {
        //           key: 'groupName',
        //           label: 'Nama Group Usaha',
        //         },
        //         {
        //           key: 'groupTypeLabel',
        //           label: 'Jenis Group Usaha',
        //         },
        //       ]}
        //       tableData={businessGroupTableData || []}
        //       isLoading={businessGroupListLoading}
        //       currentPage={1}
        //       totalPage={null}
        //       handlePageChange={() => { }}
        //     />
        //   </BaseContainer>
        // </SectionTitle> : null
      }

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          py: theme.spacing(4),
        }}
      >
        <Button
          onClick={goToNextStep}
        >
          Next
        </Button>
      </Box>
    </ColumnWrapper>
  );
};

export default DebtorInformationPage;
