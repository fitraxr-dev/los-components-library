'use client';

import { Box, Tooltip } from '@mui/material';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SearchV2 from '@/components/shared/Input/components/Search/SearchV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/TableV2';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useInquiryAccountList from './InquiryAccountList.hook';


const InquiryAccountList = () => {
  const {
    filter,
    filterList,
    itemPerPage,
    mockTableData,
    noPage,
    router,
    processId,
    searchByList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
  } = useInquiryAccountList();

  return (
    <ColumnWrapper marginY={3} gap={theme.spacing(3)}>
      <Title title="List Inquiry Account" />

      <SectionTitle title = "List Inquiry Account" isOpen>
        <Box sx={{ width: '45vw' }}>
          <SearchV2 value={filter} contentList={searchByList} dropdownList={filterList} placeholder="Pencarian" onChange={setFilter} />
        </Box>
        <RowWrapper alignItems="center" gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : 25 Oktober 2024 15:24:48
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableData={mockTableData}
            tableHeader={tableHeader}
            pageSize={itemPerPage}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            totalPage={1}
          />
        </BaseContainer>
      </SectionTitle>

      <RowWrapper sx={{ justifyContent: 'end', pb: 2, pt: 3 }}>
        <Button
          onClick={() => router.push(replacePath(maintenanceDebtor.SYARIAH_FACILITY_PAGE, { processId }))}
          variant="outlined"
        >
          Close
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};
export default InquiryAccountList;
