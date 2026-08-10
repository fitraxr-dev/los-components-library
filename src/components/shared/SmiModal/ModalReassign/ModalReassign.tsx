import { useState, useMemo } from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import PICCollapsible from './components/PICCollapsible';
import useModalReassign from './ModalReassign.hook';

import type { PIC } from './components/PICCollapsible/PICCollapsible.types';
import type { ModalReassignProps } from './ModalReassign.types';


const ModalReassign = create((props: ModalReassignProps) => {
  const {
    selectedTask,
    setSelectedTask,
    module,
    process,
    divisionId,
    position,
    isRiviewAssign = false,
    isMonitoring = false,
  } = props;
  const modalId = MODAL.REASSIGN_TO;
  const modal = useModal(modalId);
  const theme = useTheme();
  const [selectedTaskReassign, setSelectedTaskReassign] = useState([]);

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

  const watchedPicList = useWatch({ control, name: 'picList' }) || [];

  const useModalReassignProps = {
    append,
    divisionId,
    isMonitoring,
    module,
    process,
    selectedTask,
    selectedTaskReassign,
    setSelectedTask,
    setSelectedTaskReassign,
    useFormValues,
    watchedPicList,
  };

  const {
    picList,
    handleOnSave,
    saveReassignLoading,
    tableHeader,
  } = useModalReassign(useModalReassignProps);


  const isSaveDisabled = useMemo(() => {
    // If no fields (PICs) exist, disable save
    if (!fields || fields.length === 0) {
      return true;
    }

    const activePics = (watchedPicList as any[]).filter((pic) => pic?.reAssignTo?.isActive);

    if (activePics.length === 0) {
      return true;
    }

    // Check for duplicate PIC selections
    const selectedUserIds = activePics
      .map((pic: any) => pic?.selectedUser?.value)
      .filter(Boolean);
    const hasDuplicatePics = selectedUserIds.length !== new Set(selectedUserIds).size;

    const allActiveValid = activePics.every((pic: any) => {
      const hasSelectedUser = Boolean(pic?.selectedUser?.value);
      const isPermanent = Boolean(pic?.reAssignTo?.isPermanent);
      const hasStart = Boolean(pic?.reAssignTo?.startDate);
      const hasEnd = Boolean(pic?.reAssignTo?.endDate);

      if (!hasSelectedUser) return false;
      if (isPermanent) return true;
      return hasStart && hasEnd;
    });

    return !allActiveValid || hasDuplicatePics;
  }, [fields, watchedPicList]);

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
              tableData={selectedTaskReassign}
            />
          </BaseContainer>
        </Box>

        {fields.map((picData: PIC, index) => (
          <PICCollapsible
            divisionId={divisionId}
            key={index}
            picData={{ ...picData, index }}
            picList={picList}
            useFormValues={useFormValues}
            selectedTaskReassign={selectedTaskReassign}
            setSelectedTaskReassign={setSelectedTaskReassign}
            position={position}
            isRiviewAssign={isRiviewAssign}
            isMonitoring={isMonitoring}
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
            disabled={isSaveDisabled || saveReassignLoading}
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
