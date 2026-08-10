import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import Remark from '../Remark';

import ModalManagementDetail from './components/ModalManagementDetail';
import { modal } from './Management.constants';
import { useManagement } from './Management.hook';


const Management = () => {
  const theme = useTheme();

  const {
    isSaveLoading,
    viewOnly,
    control,
    isAutoSaveFetching,
    handleSubmit,
    handleSubmitForm,
    tableHeader,
    setShouldGoNext,
    isManagementListLoading,
    tableData,
  } = useManagement();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle title="Management" sx={{ marginBottom: theme.spacing(3) }} isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={ isManagementListLoading}
            tableHeader={tableHeader}
            tableData={tableData}
          />
        </BaseContainer>
      </SectionTitle>
      <Remark control={control} />
      <RowWrapper justifyContent="end" gap={theme.spacing(2)}>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly || isAutoSaveFetching}
          onClick={() => {
            setShouldGoNext(false);
            handleSubmitForm(handleSubmit)();
          }}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly}
          onClick={() => {
            setShouldGoNext(true);
            handleSubmitForm(handleSubmit)();
          }}
        >
          Next
        </Button>
      </RowWrapper>

      <ModalDef
        id={modal.MODAL_MANAGEMENT_DETAIL}
        component={ModalManagementDetail}
      />
    </ColumnWrapper>
  );
};

export default Management;
