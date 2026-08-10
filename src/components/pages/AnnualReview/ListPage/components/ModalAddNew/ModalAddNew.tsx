import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useModalAddNew from './ModalAddNew.hook';


const ModalAddNew = create(({ typeProcess }: { typeProcess: string }) => {
  const {
    tableHeader,
    tableData,
    tablePage,
    setFilter,
    noPage,
    setItemPerPage,
    setNoPage,
    filterContentList,
    filterDropdownList,
    handleOnCreate,
    handleViewData,
    isNoSelected,
    isLoading,
    isCreateLoading,
    filter,
    theme,
    isShowBtnAddnew,
    visible,
    modalId,
    dataValidateCheckDk,
    dkStatus,
  } = useModalAddNew({ typeProcess });

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '85vw' }}
    >
      <ColumnWrapper sx={{ gap: theme.spacing(1) }}>
        <Box>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
          <BaseContainer sx={{ boxShadow: theme.shadows[10] }}>
            <DKWarningToast
              status={dkStatus}
              title={dataValidateCheckDk?.errorMessage}
              handleViewData={handleViewData}
            />
            <Table
              isLoading={isLoading}
              tableHeader={tableHeader}
              tableData={tableData}
              totalPage={tablePage}
              currentPage={noPage}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
            />
          </BaseContainer>
        </Box>

        {isShowBtnAddnew &&
          <RowWrapper justifyContent="end" gap={theme.spacing(1)}>
            <Button
              disabled={isNoSelected || isCreateLoading || dkStatus === 'isDuplicated'}
              onClick={handleOnCreate}
            >
              Add New
            </Button>
          </RowWrapper>
        }
      </ColumnWrapper>
    </SectionModal>
  );
});
export default ModalAddNew;

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
