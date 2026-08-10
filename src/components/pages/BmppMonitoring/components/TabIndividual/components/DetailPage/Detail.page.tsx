'use client';

import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDate } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TableDebtorInformation from '../../../TableDebtorInformation';

import { useDetailPage } from './Detail.hook';


const DetailPage = () => {
  const {
    theme,
    dataAsOfDate,
    debtorData,
    tableData,
    tableHeader,
    page,
    setPage,
    setPageSize,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isLoading,
    totalData,
  } = useDetailPage();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="BMPP Monitoring Individual" />
      <TableDebtorInformation
        debtorName={debtorData?.name}
        gamName={debtorData?.gamName}
        staffName={debtorData?.staffName}
        isNewClient={debtorData?.isNewDebtor}
        cif={debtorData?.cif}
        division={debtorData?.divisionName}
        debtorId={debtorData?.debtorId}
        createdAt={debtorData?.createdDate}
      />

      <SectionTitle title="BMPK/BMPD/BMPP Individual" sx={{ my: 1 }} isOpen>
        <Box width="45vw" mt={1}>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>

        <Box display="flex" alignItems="center" py={3} gap={1}>
          <TextStyle variant="body4">
            Data as of : { dataAsOfDate }
          </TextStyle>
          <Tooltip
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
            title="Tanggal dan jam update data terakhir"
            placement="right"
          >
            <Box display="flex" alignItems="center">
              <Icon iconName="information-shape" />
            </Box>
          </Tooltip>
        </Box>
        <BaseContainer>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            currentPage={page}
            totalPage={totalData?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>

      </SectionTitle>
    </ColumnWrapper>
  );
};

export default DetailPage;
