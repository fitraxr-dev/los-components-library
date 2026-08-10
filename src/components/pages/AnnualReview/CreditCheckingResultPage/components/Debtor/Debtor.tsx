import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';

import Remark from '../Remark';

import TableDebtor from './components/TableDebtor';
import useDebtorHook from './Debtor.hook';


const Debtor = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    handleSubmitForm,
    isAutoSaveFetching,
    isSaveLoading,
    setShouldGoNext,
    viewOnly,
  } = useDebtorHook();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <TableDebtor />
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
    </ColumnWrapper>
  );
};

export default Debtor;
