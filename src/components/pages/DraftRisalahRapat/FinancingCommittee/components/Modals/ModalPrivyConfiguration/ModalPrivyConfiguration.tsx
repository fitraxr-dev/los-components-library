import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import SortableSection from '@/components/shared/SortableSection';
import TextStyle from '@/components/shared/TextStyle';

import TablePrivySigners from './components/Tables/TablePrivySigners';
import useModalPrivyConfiguration from './ModalPrivyConfiguration.hook';

import type { TypeModule, TypeProcess } from '@/enums/Module';


interface ModalPrivyConfigurationProps {
  bucketProcessId: string;
  documentId: number;
  module: TypeModule;
  process: TypeProcess;
}

const ModalPrivyConfiguration = NiceModal.create((props: ModalPrivyConfigurationProps) => {
  const theme = useTheme();

  const modalId = MODAL.RISALAH_RAPAT.PRIVY_CONFIGURATION;
  const { visible } = useModal(modalId);

  const {
    handleOnDragEnd,
    handleSendToPrivy,
    isLoading,
    selectedMethod,
    setSelectedMethod,
    signerIds,
    signers,
  } = useModalPrivyConfiguration(props);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const isSendDisabled = !selectedMethod || isLoading;

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: selectedMethod === 'Serial' ? '75vw' : '40vw',
          padding: 4,
        },
      }}
      maxWidth={false}
    >
      <RowWrapper
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.custom.gray30,
          borderWidth: '0.02vw',
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.primary.main}
          sx={{
            py: 2,
          }}
        >
          Privy Configuration
        </TextStyle>
      </RowWrapper>

      {/* Radio Button */}
      <ColumnWrapper gap={1}>
        <TextStyle variant="body3" weight={600}>
          Pilih Metode Penandatanganan
        </TextStyle>

        <Input
          type="radio"
          value={selectedMethod}
          onChange={(e) => {
            setSelectedMethod(e.target.value as 'Paralel' | 'Serial' | '');
          }}
          radioList={
            [
              {
                label: 'Paralel',
                value: 'Paralel',
              },
              {
                label: 'Serial',
                value: 'Serial',
              },
            ]
          }
          defaultValue={selectedMethod}
          sx={{ flex: 1, mb: 4 }}
        />
      </ColumnWrapper>

      {/* Serial Signers Table */}
      {selectedMethod === 'Serial' && (
        <ColumnWrapper gap={1}>
          <TextStyle variant="body3" weight={600}>
            Atur Urutan Penerima
          </TextStyle>

          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleOnDragEnd}
          >
            <SortableContext
              items={signerIds}
              strategy={verticalListSortingStrategy}
            >
              <BaseContainer sx={{ boxShadow: 7 }}>
                <TablePrivySigners
                  tableData={signers}
                  isLoading={isLoading}
                />
              </BaseContainer>
            </SortableContext>
          </DndContext>
        </ColumnWrapper>
      )}

      {/* Footer Buttons */}
      <RowWrapper gap={2} justifyContent="end" mt={4}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSendToPrivy}
          disabled={isSendDisabled}
          isLoading={isLoading}
        >
          Send to Privy
        </Button>
      </RowWrapper>
    </Dialog>
  );
});

export default ModalPrivyConfiguration;
