import React, { useMemo } from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

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
import { tableHeaderSelectedTask } from './ModalAssign.constants';
import useModalAssignTo from './ModalAssign.hook';

import type { ModalAssignProps } from './ModalAssign.types';


const ModalAssign = create((props: ModalAssignProps) => {
  const { selectedTask, position = null, isRiviewAssign = false } = props;
  const modalId = MODAL.ASSIGN_TO;
  const modal = useModal(modalId);
  const theme = useTheme();


  const methods = useForm({
    defaultValues: {
      pic: [
        {
          directorate: '',
          division: '',
          isLeaderPIC: false,
          jobPosition: '',
          label: '',
          picId: 0,
        }
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'pic',
  });

  const { tableDataSelectedTask, handleOnSave, isLoading } = useModalAssignTo(props);

  console.log('tableDataSelectedTask', tableDataSelectedTask);

  const watchedPicList = useWatch({ control: methods.control, name: 'pic' }) || [];
  const isSaveDisabled = useMemo(() => {
    // Check if any PIC has invalid or missing picId
    const hasInvalidPicId = watchedPicList.some((pic) => !pic?.picId || pic?.picId === 0);

    // Check if multiple PICs exist but none is marked as leader
    const hasMultiplePicsWithoutLeader = watchedPicList.length > 1 &&
      watchedPicList.every((pic) => pic?.isLeaderPIC === false);

    const picIds = watchedPicList.map((pic) => pic?.picId).filter(Boolean);
    const hasDuplicatePics = picIds.length !== new Set(picIds).size;

    return hasInvalidPicId || hasMultiplePicsWithoutLeader || hasDuplicatePics;
  }, [watchedPicList]);

  const divisionId = selectedTask[0].divisionId;
  return (
    <SectionModal
      title="Assign To"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        minWidth: '72vw',
        scrollbarWidth: 'none',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <FormProvider {...methods}>
          <ColumnWrapper gap={theme.spacing(3)}>
            <SectionTitle title="Selected Task" />
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                isLoading={false}
                tableHeader={tableHeaderSelectedTask}
                tableData={tableDataSelectedTask}
              />
            </BaseContainer>
          </ColumnWrapper>

          {fields.map((field, index) => (
            <PICCollapsible
              divisionId={divisionId}
              key={field.id}
              index={index}
              onDelete={remove}
              totalPIC={fields.length}
              position={position}
              isRiviewAssign={isRiviewAssign}
            />
          ))}

          <RowWrapper justifyContent="end">
            <Button
              disabled={fields.length >= 3}
              onClick={() => {
                append({
                  directorate: '',
                  division: '',
                  isLeaderPIC: false,
                  jobPosition: '',
                  label: '',
                  picId: 0,
                });
              }}
            >
              Add PIC
            </Button>
          </RowWrapper>

          <RowWrapper
            gap={theme.spacing(3)}
            paddingTop={theme.spacing(3)}
            justifyContent="end"
            sx={{
              borderColor: theme.palette.custom.gray30,
              borderTop: '0.1vw solid',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSaveDisabled || isLoading}
              isLoading={isLoading}
              onClick={(methods.handleSubmit(handleOnSave))}
            >
              Save
            </Button>
          </RowWrapper>
        </FormProvider>
      </ColumnWrapper>
    </SectionModal>
  );
});


export default ModalAssign;
