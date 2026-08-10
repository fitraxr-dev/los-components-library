'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { businessActivityReport } from '@/configs/constants/pathname';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../List.constants';

import { useModalDebtor } from './ModalDebtor.hook';

import type { BARContextType } from '@/components/layouts/BusinessActivityReportLayout/BusinessActivityReport.context';


const ModalDebtor = NiceModal.create(({
  state,
  setState,
}: BARContextType) => {
  const modalId = modal.DEBTOR;
  const { visible } = useModal(modalId);

  const router = useCustomRouter();

  const {
    handleCreateBarWithExisting,
    filter,
    filterContentList,
    filterDropdownList,
    hasSearched,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    listMasterDebtor,
    totalPage,
    handleViewData,
    dkStatus,
    dataValidateCheckDk,
  } = useModalDebtor();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      {hasSearched ? (
        <Button
          disabled={isLoading || selected !== null || dkStatus === 'isDuplicated'}
          sx={{ mr: 1 }}
          onClick={() => {
            setState({
              ...state,
              existingDebtorId: null,
              isExistingDebtor: false,
            });
            router.push(businessActivityReport.NEW);
            closeNiceModal(modalId);
          }}
        >
          Create New Customer & BAR
        </Button>
      ) : null}
      <Button
        disabled={isLoading || selected === null || dkStatus === 'isDuplicated'}
        onClick={() => {
          setState({
            ...state,
            existingDebtorId: selected[0]?.debtorId,
            isExistingDebtor: true,
          });
          handleCreateBarWithExisting();
          closeNiceModal(modalId);
        }}
      >
        Create BAR
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      <DKWarningToast
        status={dkStatus}
        title={dataValidateCheckDk?.errorMessage}
        handleViewData={handleViewData}
      />
      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={filter && filter?.searchDetail?.value?.length >= 3 ? listMasterDebtor : []}
        totalPage={filter && filter?.searchDetail?.value && totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalDebtor;

const DKWarningToast = (props: {
  status: 'isDuplicated' | 'isSimilar' | undefined;
  title: string;
  handleViewData: (res) => void;
}) => {
  const { status, handleViewData, title } = props;

  if (status === undefined) return <></>;

  let content = null;

  switch (status) {
    case 'isDuplicated':
      content = {
        icon: 'warning-1',
        statusColor: {
          bgcolor: '#FCE8E8',
          border: '1px solid #EB5757',
        },
      };
      break;
    case 'isSimilar':
      content = {
        icon: 'warning-2',
        statusColor: {
          bgcolor: '#FFF9E5',
          border: '1px solid #F6C000',
        },

      };
      break;
  }


  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#FCE8E8',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '16px',
        ...content?.statusColor,
      }}
    >
      <RowWrapper gap="16px">
        <Icon
          sx={{
            height: '1.25vw',
            width: '1.25vw',
          }}
          iconName={content?.icon}
        />
        <TextStyle
          variant="body4"
          weight={500}
          color="text.secondary"
        >
          {title}
        </TextStyle>
      </RowWrapper>
      {status === 'isSimilar' &&
        <Button variant="outlined" onClick={handleViewData}>
          View Data Details
        </Button>
      }
    </Box>
  );
};
