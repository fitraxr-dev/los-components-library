import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import InternalAssessment from '../../ShareHolderDetailForm/InternalAssessment/InternalAssessment';

import { tab, tabItems } from './ModalDetailShareholder.constants';
import useModalDetailShareholder from './ModalDetailShareholder.hook';


const ModalDetailShareholder = NiceModal.create(() => {
  const {
    modal,
    modalId,
    activeTab,
    handleChangeTab,
    theme,
    shareholderData,
  } = useModalDetailShareholder();
  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '60vw' }}
      onConfirm={() => {
        closeNiceModal(modalId);
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper sx={{ justifyContent: 'center' }}>
          <Title title="Detail Shareholder" />
        </RowWrapper>
        <Tabs
          activeTab={activeTab}
          onChange={(val: string) => handleChangeTab(val)}
          items={tabItems}
        />
        <TabItem activeValue={activeTab} value={tab.GENERAL_INFORMATION}>
          <ColumnWrapper sx={{ gap: 3 }}>
            <TextStyle variant="body4" weight={500}>Data</TextStyle>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                py: 2,
              }}
            >
              <Cell
                title="ID Ref. Shareholder"
                value={shareholderData?.refId || '-'}
              />
              <Cell
                title="Tipe Shareholder"
                value={shareholderData?.institutionTypeLabel || '-'}
              />
              <Cell
                title="Nama"
                value={shareholderData?.name || '-'}
              />
              <Cell
                title="Sumber Informasi Data"
                value={shareholderData?.informationSource || '-'}
              />
              <Cell
                title="Level/Tingkat"
                value={shareholderData?.level || '-'}
              />
              <Cell
                title="Beneficial Owner"
                value={shareholderData?.beneficialOwner || '-'}
              />
            </Box>
            <TextStyle variant="body4" weight={500}>Dokumen Shareholder</TextStyle>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                py: 2,
              }}
            >
              <Cell
                title="ID Type"
                value={shareholderData?.idType || '-'}
              />
              <Cell
                title="Identity Expiry"
                value={shareholderData?.identityExpiry || '-'}
              />
              <Cell
                title="ID no"
                value={shareholderData?.idNo || '-'}
              />
              <Cell
                title="ID"
                value={shareholderData?.idDocUrl || '-'}
              />
              <Cell
                title="NPWP"
                value={shareholderData?.npwp || '-'}
              />
              <Cell
                title="NPWP"
                value={shareholderData?.npwpDocUrl || '-'}
              />
            </Box>
            <TextStyle variant="body4" weight={500}>Kepemilikan Saham</TextStyle>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                py: 2,
              }}
            >
              <Cell
                title="Nilai Perlembar"
                value={shareholderData?.stockSheet || '-'}
              />
              <Cell
                title="Lembar Saham"
                value={shareholderData?.value || '-'}
              />
              <Cell
                title="Persentase"
                value={shareholderData?.percentage || '-'}
              />
              <Cell
                title="Nominal"
                value={shareholderData?.nominal || '-'}
              />
              <Cell
                title="Modified By"
                value={shareholderData?.modifiedBy || '-'}
              />
              <Cell
                title="Last Modified"
                value={shareholderData?.createdBy || '-'}
              />
            </Box>
          </ColumnWrapper>
          <RowWrapper sx={{ justifyContent: 'end' }}>
            <Button onClick={() => closeNiceModal(modalId)} variant="outlined">Close</Button>
          </RowWrapper>
          {/* <GeneralInformation /> */}
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.INTERNAL_ASSESSMENT}>
          <InternalAssessment component="SHAREHOLDER" componentIdentifier="SHARE-00001" />
        </TabItem>
      </ColumnWrapper>
    </SectionModal>
  );
},
);

export default ModalDetailShareholder;
