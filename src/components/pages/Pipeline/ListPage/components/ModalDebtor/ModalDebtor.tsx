'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
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

import type { PipelineContextType } from '@/components/layouts/PipelineLayout/Pipeline.context';


const ModalDebtor = NiceModal.create(({
  state,
  setState,
}: PipelineContextType
) => {
  const modalId = modal.DEBTOR;
  const { visible } = useModal(modalId);

  const router = useCustomRouter();

  const {
    filter,
    filterContentList,
    filterDropdownList,
    hasSearched,
    isLoading,
    page,
    selected,
    dataValidateCheckDk,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    listMasterDebtor,
    totalPage,
    handleViewData,
    dkStatus,
  } = useModalDebtor();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      {hasSearched ? (
        <Button
          disabled={isLoading || !!selected.length || dkStatus === 'isDuplicated'}
          sx={{ mr: 1 }}
          onClick={() => {

            if (listMasterDebtor.length !== 0) {
              NiceModal.show(MODAL.GLOBAL.CONFIRM, {
                agreeText: 'Ya',
                cancelText: 'Tidak',
                onSubmit: () => {
                  setState({
                    ...state,
                    existingDebtorId: null,
                    isExistingDebtor: false,
                  });
                  router.push(pipeline.NEW_PAGE);
                  closeNiceModal(modalId);
                },
                title: 'Customer sudah ada dalam pengajuan. Apakah Anda yakin ingin menambahkan customer baru?',
              });
            } else {
              setState({
                ...state,
                existingDebtorId: null,
                isExistingDebtor: false,
              });
              router.push(pipeline.NEW_PAGE);
              closeNiceModal(modalId);
            }
          }}
        >
          Create New Customer & Pipeline
        </Button>
      ) : null}
      <Button
        disabled={isLoading || !selected.length || dkStatus === 'isDuplicated'}
        onClick={() => {
          setState({
            ...state,
            existingDebtorId: selected[0]?.debtorId,
            isExistingDebtor: true,
          });
          router.push(pipeline.NEW_PAGE);
          closeNiceModal(modalId);
        }}
      >
        Add New Pipeline
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        gap: '12px',
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
        tableData={listMasterDebtor}
        totalPage={totalPage}
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
