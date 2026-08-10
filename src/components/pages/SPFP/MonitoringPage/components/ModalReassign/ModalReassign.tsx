import { useContext } from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import { CreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL } from '../../Monitoring.constants';
import PICCollapsible from '../PICCollapsible';
import tableHeader from '../TableHeader';

import useModalReassign from './ModalReassign.hook';

import type { ReassignToModalProps } from './ModalReassign.types';
import type { PIC } from '../PICCollapsible/PICCollapsible.types';


const ModalReassign = create((props: ReassignToModalProps) => {
  const { selectedTask, setSelectedTask } = props;
  const modalId = MODAL.REASSIGN_TO;
  const modal = useModal(modalId);
  const theme = useTheme();
  const [state] = useContext(CreditCheckingContext) || [];

  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'picList',
  });

  const useFormValues = {
    control,
    setValue,
    watch,
  };

  const useModalReassignProps = {
    append,
    selectedTask,
    setSelectedTask,
    useFormValues,
  };

  const { picList, handleOnSave, saveReassignLoading } = useModalReassign(useModalReassignProps);

  return (
    <SectionModal
      title="Re-assign"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '54vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
          }}
        >
          <SectionTitle title="Selected Task" />
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={false}
              tableHeader={tableHeader}
              tableData={state.selectedTask}
            />
          </BaseContainer>
        </Box>

        {fields.map((picData: PIC, index) => (
          <PICCollapsible
            key={index}
            picData={{ ...picData, index }}
            picList={picList}
            useFormValues={useFormValues}
          />
        ))}

        <RowWrapper
          justifyContent="end"
          gap={theme.spacing(3)}
          color={theme.palette.custom.gray30}
          paddingTop={theme.spacing(3)}
          borderTop="0.1vw solid"
        >
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isLoading={saveReassignLoading}
            onClick={(handleSubmit(handleOnSave))}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalReassign;
