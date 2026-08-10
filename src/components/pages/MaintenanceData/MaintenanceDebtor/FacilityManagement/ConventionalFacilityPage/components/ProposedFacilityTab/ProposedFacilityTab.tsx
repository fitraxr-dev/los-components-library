import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import ConfirmationInfo from '@/components/pages/LPS/components/ConfirmationInfo';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useProposedFacilityTab from './ProposedFacilityTab.hook';


const showComingSoon = false;

const ProposedFacilityTab = () => {
  const theme = useTheme();

  const {
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    konvenList,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    anomalyRowStyle,
  } = useProposedFacilityTab();

  const data = (konvenList as any)?.data?.contents ?? [];
  const totalPage = (konvenList as any)?.data?.page?.totalPage ?? 1;

  let dataOtherModule = [];
  data.forEach((item: any) => {
    if (!item?.editable) {
      if (!dataOtherModule.includes(item?.masterId)) {
        dataOtherModule.push(item?.masterId);
      }
    }
  });

  if (showComingSoon) {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        <EmptyPlaceholder status="coming-soon" />
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      {dataOtherModule.length > 0 && <ConfirmationInfo notice={'Fasilitas tidak dapat diedit karena sedang dalam tahap pengajuan fasilitas pada ' + dataOtherModule.join(', ')} />}
      <Box sx={{ width: '45vw' }}>
        <Input
          type="search"
          value={filter}
          hasFilter
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
      </Box>
      <RowWrapper alignItems="center" gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : {konvenList?.data?.additionalData?.lastUpdate ? formatDateTime(konvenList?.data?.additionalData?.lastUpdate) : '-'}
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
          tableData={data ?? []}
          tableHeader={tableHeader}
          pageSize={itemPerPage}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={totalPage}
          anomalyRow={anomalyRowStyle}
        />

      </BaseContainer>
    </ColumnWrapper>
  );
};

export default ProposedFacilityTab;
