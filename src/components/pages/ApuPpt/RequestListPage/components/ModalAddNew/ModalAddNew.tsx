import { create, useModal } from '@ebay/nice-modal-react';
import { Box, Checkbox, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../RequestList.constants';

import useModalAddNew from './ModalAddNew.hook';


const ModalAddNew = create(() => {
  const modalId = modal.ADD_NEW_MODAL;
  const { visible } = useModal(modalId);

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
    isNoSelected,
    isLoading,
    isCreateLoading,
    filter,
    isValidateLoading,
    isSuccess,
    dataValidate,
    checked,
    setChecked,
    handleOnRegisDynamicStep,
    selected,
    openModalDk,
    labelCheckDk,
    colorCheckDk,
    isValidateCheckDkSucces,
    dataValidateCheckDk,
    theme,
    colorCheckDkIcon,
    isValidateCheckDkLoading,
    isShowBtnAddnew,
    isShowBtnReguler,
  } = useModalAddNew();


  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '85vw' }}

    >
      <Loader isLoading={isValidateLoading || isValidateCheckDkLoading} />

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
          {isValidateCheckDkSucces && selected?.length > 0 &&
          <RowWrapper
            gap={1}
            justifyContent="space-between"
            sx={{
              backgroundColor: colorCheckDk,
              borderRadius: theme.spacing(1),
              px: theme.spacing(2),
              py: theme.spacing(1),
            }}
          >
            <RowWrapper alignItems="center">
              <Icon
                iconName="warning-2"
                textVariant="title1"
                sx={{
                  marginRight: theme.spacing(2),
                  path: {
                    fill: colorCheckDkIcon,
                  },
                }}
              />
              <TextStyle
                variant="body4"
                fontWeight={400}
              >
                {labelCheckDk}
              </TextStyle>
            </RowWrapper>
            {dataValidateCheckDk?.hasSimilar &&
            <RowWrapper>
              <Button variant="outlined" size="small" onClick={openModalDk}>
                View Data Details
              </Button>
            </RowWrapper>}
          </RowWrapper>}
          <BaseContainer sx={{ boxShadow: theme.shadows[10] }}>
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


        {isShowBtnReguler &&
        <RowWrapper justifyContent="end" gap={theme.spacing(1)}>
          <ColumnWrapper>
            <RowWrapper alignItems="center" py={theme.spacing(1)}>
              <Checkbox
                checked={true}
                disabled
                onChange={() => setChecked(!checked)}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
              />
              <TextStyle variant="body4" color={theme.palette.primary.light} weight={600}>Retrieved dari APU PPT / Pengkinian Data Terakhir?</TextStyle>
            </RowWrapper>
            <RowWrapper justifyContent="end" gap={theme.spacing(3)} pr={theme.spacing(4)}>
              <Button
                variant="contained"
                onClick={() => handleOnRegisDynamicStep('REGULAR_FORM')}
              >
                Regular Form
              </Button>
              <Button
                disabled={isNoSelected || isCreateLoading}
                onClick={() => handleOnRegisDynamicStep('SIMPLE_FORM')}
              >
                Simple Form
              </Button>

            </RowWrapper>
          </ColumnWrapper>
        </RowWrapper>
        }

        {isShowBtnAddnew &&
        <RowWrapper justifyContent="end" gap={theme.spacing(1)}>
          <Button
            disabled={isNoSelected || isCreateLoading}
            onClick={handleOnCreate}
          >
            Add New
          </Button>
        </RowWrapper>}
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalAddNew;
