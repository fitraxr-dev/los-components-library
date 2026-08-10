'use client';

import { Box, Tooltip } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime, toYearStringNumber } from '@/helpers/date';

import ActionButtons from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../components/TableDebtorInformationLocal';

import useGroupInformation from './GroupInformation.hook';


const GroupInformation = () => {
  const {
    methods,
    tableHeaderList,
    theme,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isLoading,
    page,
    setPage,
    setPageSize,
    data,
    dataAsOfDate,
    actions,
    handleClose,
    isSubmitLoading,
    handleOpenSubmitModal,
    isDebtor,
    debtorData,
  } = useGroupInformation();


  const tableData = data?.data?.contents.map((item: any) => ({
    ...item,
    id: item.groupCode ?? '-',
    isRelatedSmi: item?.isRelatedSmi ? 'Ya' : 'Tidak',
    lastModified: item?.lastModified ? formatDateTime(item?.lastModified) : '-',
    modifiedBy: item?.modifiedBy ?? '-',
    name: item.groupName ?? '-',
    sector: item.sector ?? '-',
    yearFounded: item?.yearFounded ? toYearStringNumber(item?.yearFounded) : '-',
  }));


  return (
    <FormProvider {...methods}>
      <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
        <Title title="Group Information" />
        { isDebtor ?
          <>
            <TableDebtorInformationLocal
              debtorName={debtorData?.name}
              gamName={debtorData?.gamName}
              staffName={debtorData?.staffName}
              isNewClient={debtorData?.isNewDebtor}
              cif={debtorData?.cif}
              division={debtorData?.divisionName}
              debtorId={debtorData?.debtorId}
              createdAt={debtorData?.createdDate}
            />
          </> :
          <>
            <TableDebtorInformation
              isMaintenanceCustomer={true}
              module={TypeModule.MAINTENANCE_DATA}
              process={TypeProcess.MAINTENANCE_CUSTOMER}
            />
          </>
        }
        <SectionTitle title="Group Information" isOpen>
          <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.custom.text}
            >
              Data as of : {dataAsOfDate}
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

          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <BaseContainer
            sx={{
              boxShadow: 2,
              maxWidth: '100%',
              padding: theme.spacing(2),
            }}
          >
            <Table
              tableHeader={tableHeaderList}
              isLoading={isLoading}
              tableData={tableData}
              totalPage={data?.data?.page?.totalPage ?? 0}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>

      <ActionFooterDetail />
    </FormProvider>
  );
};

export default GroupInformation;
