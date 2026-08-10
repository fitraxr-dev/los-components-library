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

import { modal } from '../../FinancingFacility.constants';

import { useModalDetailFinancingFacilityOtherBank } from './ModalDetailFinaningFacilityOtherBank.hooks';

import type { ModalDetailFinancingFacilityOtherBankProps } from './ModalDetailFinancingFacilityOtherBank.types';


const ModalDetailFinancingFacilityOtherBank = NiceModal.create(({
  id,
}: ModalDetailFinancingFacilityOtherBankProps) => {
  const theme = useTheme();
  const modalId = modal.DETAIL_FACILITY_OTHER_BANK;
  const { visible } = useModal(modalId);

  const { data, tableHeader, tableData } = useModalDetailFinancingFacilityOtherBank({ id });

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
        <Cell title="Jenis Kreditur" value={data?.bankTypeLabel} />
        <Cell title="Bank" value={data?.bankLabel} />
        <Cell title="Produk" value={data?.product} />
        <Cell title="Rate" value={data?.rates} />
        <Cell title="Plafond" value={`${data?.currencyPlafond} ${formatCurrency(data?.plafond, { maxDecimal: 2 })}`} />
        <Cell title="O/S" value={`${data?.currencyPlafond}  ${formatCurrency(data?.outstanding, { maxDecimal: 2 })}`} />
        {(data?.currencyPlafond !== 'IDR' || data?.currencyOutstanding !== 'IDR') && (
          <>
            <Cell title="Exchange Rate" value={formatCurrency(data?.exchangeRate, { maxDecimal: 2 })} /><br />
            <Cell title="Plafond (dalam Rp)" value={formatCurrency(data?.plafondIdr, { maxDecimal: 2 })} />
            <Cell title="O/S (dalam Rp)" value={formatCurrency(data?.outstandingIdr, { maxDecimal: 2 })} />
          </>
        )}
        <Cell title="CL/NCL" value={data?.callType?.toString()} />
        <Cell title="Kolektibilitas" value={data?.collectability?.toString()} />
        <Cell title="Sindikasi" value={data?.isSyndication ? 'Ya' : 'Tidak'} /><br />
      </Box>
      <Box>
        {data?.isSyndication &&
        <ColumnWrapper sx={{ marginBottom: theme.spacing(3) }}>
          <TextStyle variant="body2" weight={700} color={theme.palette.primary.main} marginBottom={theme.spacing(3)}>
            Bank Lainnya
          </TextStyle>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={tableHeader}
              tableData={tableData}
            />
          </BaseContainer>
        </ColumnWrapper>
        }
        <Cell title="Keterangan" value={data?.remark?.toString()} />
      </Box>
    </SectionModal>
  );
});

export default ModalDetailFinancingFacilityOtherBank;
