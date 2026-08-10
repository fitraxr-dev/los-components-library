import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL_ASSIGN_CC } from '../Assignment.constants';

import PICCollapsible from './components/PICCollapsible';
import { tableHeaderSelectedTask } from './ModalAssignment.constants';
import useModalAssignTo from './ModalAssignment.hook';

import type { ModalAssignProps } from './ModalAssignment.types';


const ModalAssign = create((props: ModalAssignProps) => {
  const { selectedTask, position = null } = props;
  const modalId = MODAL_ASSIGN_CC.ASSIGN_TO;
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

  const saveBtnDisabled = methods.watch('pic').filter((val) => !val?.picId || val?.picId === 0).length > 0 || methods.watch('pic').length > 1 && methods.watch('pic').every((item) => item?.isLeaderPIC === false);

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

          {fields.map((field, index) => (
            <PICCollapsible
              divisionId={divisionId}
              key={field.id}
              index={index}
              onDelete={remove}
              totalPIC={fields.length}
              position={position}
            />
          ))}

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
              disabled={saveBtnDisabled || isLoading}
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
