'use client';

import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SearchV2 from '@/components/shared/Input/components/Search/SearchV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TopMenu from '../TopMenu';

import useLimitAnakList from './LimitAnakList.hook';


const LimitAnakList = () => {
  const theme = useTheme();

  const {
    dataAsOf,
    itemPerPage,
    noPage,
    searchByList,
    setItemPerPage,
    setNoPage,
    tableHeader,
    filter,
    filterDropdownList,
    setFilter,
    childLimitListData,
    childLimitListPage,
    isLoadingchildLimitListList,
  } = useLimitAnakList();

  return (
    <ColumnWrapper marginY={3} gap={theme.spacing(3)}>
      <TopMenu type="limit-induk" />
      <Title title="List Limit Anak" />

      <SectionTitle title="List Limit Anak" isOpen>
        <Box sx={{ width: '45vw' }}>
          <SearchV2 value={filter} contentList={searchByList} dropdownList={filterDropdownList} placeholder="Pencarian" onChange={setFilter} />
        </Box>
        <RowWrapper alignItems="center" gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as Of: {dataAsOf?.lastModifiedDate ? formatDateTime(dataAsOf?.lastModifiedDate) : '-'}
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
            tableData={childLimitListData}
            tableHeader={tableHeader}
            pageSize={itemPerPage}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            totalPage={childLimitListPage?.totalPage}
            isLoading={isLoadingchildLimitListList}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};
export default LimitAnakList;
