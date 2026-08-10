import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Box from '@mui/material/Box';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalBankInformation.constants';
import useModalBankInformation from './ModalBankInformation.hook';

import type { ModalBankInformationProps } from './ModalBankInformation.types';


const ModalBankInformation = NiceModal.create((props: ModalBankInformationProps) => {
  const {
    addData,
    fieldData,
    initialAmount,
    initialBankName,
    initialBankType,
    title,
  } = props;
  const modalId = modal.MODAL_BANK_INFORMATION;
  const { visible } = useModal(modalId);

  const {
    amount,
    bankName,
    bankOptions,
    bankType,
    bankTypeOptions,
    byValue,
    filteredBanks,
    setAmount,
    setBankName,
    setBankType,
  } = useModalBankInformation({
    addData,
    fieldData,
    initialAmount,
    initialBankName,
    initialBankType,
  });

  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      // containerSx={{
      //   minWidth: '',
      // }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper gap={3} sx={{ width: '100%' }} justifyContent="space-between">
          <Box sx={{ width: '-webkit-fill-available' }}>
            <Autocomplete
              inputSx={{ width: '-webkit-fill-available' }}
              placeholder="Pilih Tipe Bank"
              label="Tipe Bank"
              dropdownList={bankTypeOptions}
              onChange={(val) => setBankType(String(val?.id))}
              value={byValue(bankType, bankTypeOptions)}
            />
          </Box>

          <Box sx={{ width: '-webkit-fill-available' }}>
            <Autocomplete
              label="Bank / Lembaga Keuangan"
              placeholder="Pilih Bank"
              dropdownList={filteredBanks}
              disabled={!bankType}
              onChange={(val) => setBankName(String(val?.id))}
              value={byValue(bankName, bankOptions)}
            />
          </Box>

          <Box sx={{ width: '-webkit-fill-available' }}>
            <Input
              type="number"
              label="Amount (Porsi Sindikasi)"
              placeholder="Input Amount (Porsi Sindikasi)"
              onValueChange={(value) => setAmount(value?.floatValue)}
              value={amount}
              decimalScale={2}
              thousandSeparator=","
              suffix=".00"
            />
          </Box>
        </RowWrapper>

        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
          <Button
            disabled={!bankName || !amount}
            onClick={() => {
              addData(bankName, bankType, amount);
              closeNiceModal(modalId);
            }}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});
export default ModalBankInformation;
