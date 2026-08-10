import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { formatCurrency } from '@/helpers/formatCurrency';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';


import { modal } from '../../AccountInformation.constants';

import { useModalDetailAccountInformation } from './ModalDetailAccountInformation.hooks';

import type { ModalDetailAccountInformationProps } from './ModalDetailAccountInformation.types';


const ModalDetailAccountInformationOtherBank = NiceModal.create(({
  id,
}: ModalDetailAccountInformationProps) => {
  const theme = useTheme();
  const modalId = modal.DETAIL_ACCOUNT_INFORMATION;
  const { visible } = useModal(modalId);

  const { data, tableHeader, tableData } = useModalDetailAccountInformation({ id });

  return (
    <SectionModal
      title="Detail Fasilitas Pembiayaan Bank Lain"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginBottom: theme.spacing(3),
        }}
      >
        <Cell title="Nama Customer" value={data?.debtorName} /><br />
        <Cell title="Jenis Bank" value={data?.bankTypeLabel} />
        <Cell title="Bank" value={data?.bankLabel} />
        <Cell title="Produk" value={data?.product} />
        <Cell title="Rate" value={data?.product} />
        <Cell title="Nominal" value={`${data?.currencyPlafond} ${formatCurrency(data?.plafond, { maxDecimal: 2 })}`} />
        <Cell title="Exchange Rate" value={`${data?.currencyPlafond}  ${formatCurrency(data?.outstanding, { maxDecimal: 2 })}`} />
        <Cell title="Nominal (Dalam IDR)" value={data?.callType?.toString()} /><br />
        <Cell title="Reference" value={data?.collectability?.toString()} /><br />
        <Cell title="Kieterangan" value={data?.collectability?.toString()} />
      </Box>
    </SectionModal>
  );
});

export default ModalDetailAccountInformationOtherBank;
