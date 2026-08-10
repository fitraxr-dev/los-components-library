import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import useGetDetailFinancingFacility from '@/hooks/services/bucket/financing-facility/useGetDetailFinancingFacility';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../FinancingFacility.constants';
import useGetFinancingFacilityExistingById from '../../hooks/useGetFinancingFacilityExistingById';

import type { ModalDetailFinancingFacilityExistingProps } from './ModalDetailFinaningFacilityExisting.types';


const ModalDetailFinancingFacilityExisting = NiceModal.create(({
  id,
}: ModalDetailFinancingFacilityExistingProps) => {
  const modalId = modal.DETAIL_FACILITY_EXISTING;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  // const { data } = useGetFinancingFacilityExistingById({ id });
  const { data } = useGetDetailFinancingFacility({
    facilityId: id,
  });

  return (
    <SectionModal
      title="Detail Ringkasan Pembiayaan Eksisting"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <ColumnWrapper sx={{ gap: 3 }}>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Fasilitas:
          </TextStyle>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Cell title="Order Type" value={data?.orderType} />
            <Cell title="Segmen Pembiayaan" value={data?.financingSegmentLabel} />
            <Cell title="Produk" value={data?.productLabel} />
            <Cell title="Jangka Waktu" value={data?.timePeriod} />
            <Cell title="Nominal Pembiayaan" value={data?.orderValue} />
            <Cell title="Masa Penarikan" value={data?.withdrawalPeriod} />
            <Cell title="Exchange Rate" value={data?.exchangeRate} />
            <Cell title="Masa Tenggang" value={data?.gracePeriod} />
            <Cell title="Nominal Pembiayaan (dalam Rp)" value={data?.orderValueAfterExchangeRate} />
            <Cell title="Rates" value={data?.rates?.toString()} />
            <Cell title="Tujuan Pembiayaan" value={data?.financingObjectives} />
            <Cell title="Jaminan/Penugasan Pemerintah" value={data?.governmentMandateLabel} />
            <Cell title="Kolektibilitas" value="" />
            <Cell title="O/S" value="" />
            <Cell title="Keterangan" value={data?.remark} />
          </Box>
        </ColumnWrapper>

        <ColumnWrapper sx={{ gap: 3 }}>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Proyek:
          </TextStyle>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Cell title="Nama Proyek" value={data?.project?.name} />
            <Cell title="Lokasi Proyek (Kecamatan)" value={data?.project?.districtLabel} />
            <Cell title="Nilai Proyek" value={`${data?.project?.curExchangeRate ?? ''} ${data?.project?.value}`} />
            <Cell title="Lokasi Proyek (Kota - Kabupaten)" value={data?.project?.cityLabel} />
            <Cell title="Sektor yang dibiayai" value={data?.project?.sectorLabel} />
            <Cell title="Lokasi Proyek (Provinsi)" value={data?.project?.provinceLabel} />
          </Box>
        </ColumnWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDetailFinancingFacilityExisting;
