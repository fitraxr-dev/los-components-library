'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { useModalRecommendedGroup } from './ModalRecommendedGroup.hook';

import type { ModalRecommendedGroupProps } from './ModalRecommendedGroup.types';


const ModalRecommendedGroup = NiceModal.create(({
  groupName,
  onSelectGroup,
  onCreateNew,
  hasDuplicate,
  payload,
  similarGroupList,
}: ModalRecommendedGroupProps) => {
  const {
    filter,
    filterContentList,
    filterDropdownList,
    groupStatus,
    handleAddGroupMember,
    handleCreateNewGroup,
    isLoading,
    isSaveLoading,
    listMasterGroup,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
    visible,
    modalId,
  } = useModalRecommendedGroup({
    groupName,
    hasDuplicate,
    onCreateNew,
    onSelectGroup,
    payload,
    similarGroupList,
  });

  const footer = (
    <RowWrapper sx={{ gap: '24px', justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={groupStatus === 'isDuplicated'}
        onClick={handleCreateNewGroup}
      >
        Create New Group
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Recommended Groups"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      {groupStatus === 'isSimilar' && (
        <GroupWarningToast
          status={groupStatus}
          groupName={groupName}
        />
      )}

      {/* <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Search groups..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      /> */}

      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={listMasterGroup}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        withConditional={true}
      />
    </SectionModal>
  );
});

export default ModalRecommendedGroup;

const GroupWarningToast = (props: {
  status: 'isDuplicated' | 'isSimilar' | undefined;
  groupName: string;
}) => {
  const { status, groupName } = props;

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
        textStatus: 'Nama Group sudah terdaftar dalam database.',
      };
      break;
    case 'isSimilar':
      content = {
        icon: 'warning-2',
        statusColor: {
          bgcolor: '#FFF9E5',
          border: '1px solid #F6C000',
        },
        textStatus: 'Silakan periksa terlebih dahulu nama Group yang sudah ada sebelum melakukan pembuatan Group baru.',
      };
      break;
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '16px',
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
          {content?.textStatus}
        </TextStyle>
      </RowWrapper>
    </Box>
  );
};
