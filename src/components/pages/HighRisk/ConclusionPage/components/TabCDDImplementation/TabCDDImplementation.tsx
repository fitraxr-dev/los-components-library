'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import WordEditor from '@/components/shared/WordEditor';

import { tab } from '../../Conclusion.constants';

import ModalSpecialApproval from './components/ModalAddSpecialApproval';
import ModalDetailSpecialApproval from './components/ModalDetailSpecialApproval';
import { modal } from './TabCDDImplementation.constants';
import useTabCDDImplementation from './TabCDDImplementation.hook';


const TabCDDImplementation = ({ handleNextTab }: { handleNextTab: (tab: string) => void }) => {
  const { viewOnly } = useViewOnly();
  const theme = useTheme();

  const {
    descriptionContainer,
    handleOpenAddModal,
    handleSave,
    isAutoSaveFetching,
    isDetailLoading,
    isSaveLoading,
    isSpecialApprovalLoading,
    noPage,
    setDescriptionContainer,
    setItemPerPage,
    setNoPage,
    specialApprovalDetail,
    tableData,
    tableHeader,
    tablePage,
  } = useTabCDDImplementation({ handleNextTab });

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={isSpecialApprovalLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={tablePage?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={!viewOnly && <TableFooter onClick={handleOpenAddModal} />}
        />
      </BaseContainer>

      <SectionTitle title="Keterangan" isOpen>
        <WordEditor
          isReadOnly={viewOnly}
          isLoading={isDetailLoading}
          container={descriptionContainer}
          initialValue={specialApprovalDetail?.description}
          setContainer={setDescriptionContainer}
          paperProps={{ sx: { mt: theme.spacing(3) } }}
        />
      </SectionTitle>

      <RowWrapper justifyContent="end" paddingY={theme.spacing(3)} gap={theme.spacing(2)}>
        {viewOnly ? (
          <Button
            onClick={() => handleNextTab(tab.ADDITIONAL_INFORMATION)}
            isLoading={isSaveLoading}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleSave({ goToNext: false })}
              isLoading={isSaveLoading}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={() => handleSave({ goToNext: true })}
              isLoading={isSaveLoading}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>

      <ModalDef
        id={modal.ADD_SPECIAL_APPROVAL}
        component={ModalSpecialApproval}
      />
      <ModalDef
        id={modal.DETAIL_SPECIAL_APPROVAL}
        component={ModalDetailSpecialApproval}
      />
    </ColumnWrapper>
  );
};

export default TabCDDImplementation;
