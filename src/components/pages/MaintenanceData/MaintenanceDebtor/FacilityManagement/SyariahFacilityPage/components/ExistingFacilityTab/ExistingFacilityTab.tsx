import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SearchV2 from '@/components/shared/Input/components/Search/SearchV2';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../SyariahFacility.constants';
import ModalInqury from '../ModalInquiry';

import useExistingFacilityTab from './ExistingFacilityTab.hook';


const ExistingFacilityTab = () => {
  const theme = useTheme();

  const {
    dataAsOf,
    existingFacilitySyariahListContents,
    existingFacilitySyariahListPage,
    filterDropdownList,
    isLoadingExistingFacilitySyariahList,
    itemPerPage,
    noPage,
    searchByList,
    setItemPerPage,
    setNoPage,
    tableHeader,
    filter,
    setFilter,
    handleSyncTemenos,
    anomalyRowStyle,
  } = useExistingFacilityTab();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <SearchV2 value={filter} sx={{ width: '50%' }} contentList={searchByList} dropdownList={filterDropdownList} placeholder="Pencarian" onChange={setFilter} />
        <Box
          display="flex"
          gap={3}
        >
          <Button
            startIcon="sync"
            onClick={handleSyncTemenos}
            variant="outlined"
          >
            Sync with Temenos
          </Button>
          <Button onClick={() => NiceModal.show(modal.INQUIRY)}>Inquiry</Button>
        </Box>
      </RowWrapper>
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
          tableData={existingFacilitySyariahListContents}
          tableHeader={tableHeader}
          pageSize={itemPerPage}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={existingFacilitySyariahListPage?.totalPage}
          isLoading={isLoadingExistingFacilitySyariahList}
          anomalyRow={anomalyRowStyle}
        />
      </BaseContainer>

      <ModalDef
        id={modal.INQUIRY}
        component={ModalInqury}
      />
    </ColumnWrapper>
  );
};

export default ExistingFacilityTab;
