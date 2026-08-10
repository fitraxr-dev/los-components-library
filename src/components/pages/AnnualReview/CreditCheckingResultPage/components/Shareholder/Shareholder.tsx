import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import Remark from '../Remark';

import ModalShareholderDetail from './components/ModalShareholderDetail';
import { modal } from './Shareholder.constants';
import { useShareholder } from './Shareholder.hook';


const Shareholder = () => {
  const { viewOnly } = useViewOnly();
  const theme = useTheme();

  const {
    isSaveLoading,
    control,
    isAutoSaveFetching,
    handleSubmitForm,
    handleSubmit,
    tableHeader,
    setShouldGoNext,
    tableData,
    isShareholderListLoading,
  } = useShareholder();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle title="Shareholder" sx={{ marginBottom: theme.spacing(3) }} isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isShareholderListLoading}
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
            handleSubmitForm(handleSubmit)();
            setShouldGoNext(false);
          }}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly}
          onClick={() => {
            handleSubmitForm(handleSubmit)();
            setShouldGoNext(true);
          }}
        >
          Next
        </Button>
      </RowWrapper>
      <ModalDef
        id={modal.MODAL_SHAREHOLDER_DETAIL}
        component={ModalShareholderDetail}
      />
    </ColumnWrapper>
  );
};

export default Shareholder;
