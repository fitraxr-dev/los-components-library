'use client';

import * as React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { capitalize, Grid } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Title from '@/components/shared/Title';

import { SUMMARY_MODAL_IDS } from '../../TabSummary.constant';


type SummaryType = 'group' | 'item' | 'subitem';

const keyMap = {
  group: { descriptionKey: 'itemGroup', numberKey: 'noItemGroup' },
  item: { descriptionKey: 'item', numberKey: 'noItem' },
  subitem: { descriptionKey: 'subItem', numberKey: 'noSubItem' },
};

const normalizeData = (data: any, type: SummaryType) => {
  const { numberKey, descriptionKey } = keyMap[type];
  const numberVal = data?.[numberKey];
  const isActiveVal = data?.isActive;
  const descVal = data?.[descriptionKey];

  return {
    description: String(descVal),
    isActive: Boolean(isActiveVal),
    number: Number(numberVal),
  };
};

interface SummaryDetailModalProps {
  summaryData: any;
  type: SummaryType;
  mode: 'create' | 'update';
}

const SummaryDetailModal = NiceModal.create(({ summaryData, type, mode }: SummaryDetailModalProps) => {
  const modalId = SUMMARY_MODAL_IDS.SUMMARY_DETAIL_MODAL;
  const modal = useModal(modalId);

  const detailData = React.useMemo(() => {
    if (mode === 'update') {
      const src = summaryData._raw;

      return {
        lastModified: normalizeData(src?.lastModified, type),
        previous: normalizeData(src?.previous, type),
      };
    }

    return normalizeData(summaryData, type);
  }, [summaryData, mode, type]);

  return (
    <SectionModal
      title={`Detail Parameter Customer Due Diligence - ${capitalize(type)}`}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
    >
      {mode === 'update' ? (
        <UpdateDataForm data={detailData} />
      ) : (
        <NewDataForm data={detailData} />
      )}
    </SectionModal>
  );
});

const NewDataForm = ({ data }: { data: any }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Input
          label="Nomor Item"
          type="number"
          value={data.number ?? ''}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <Input
          label="Active"
          type="radio"
          radioList={[
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false }
          ]}
          value={data.isActive ?? ''}
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          label="Description"
          type="richtext"
          editorHeight="100px"
          renderControls={null}
          value={data.description}
          disabled
        />
      </Grid>
    </Grid>
  );
};

const UpdateDataForm = ({ data }: { data: any }) => {
  const { previous, lastModified } = data;

  return (
    <ColumnWrapper gap={2}>
      <Title title="Previous" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input
            label="Nomor Item"
            type="number"
            value={previous.number ?? ''}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Active"
            type="radio"
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false },
            ]}
            value={previous.isActive}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Description"
            type="richtext"
            value={previous.description}
            editorHeight="100px"
            renderControls={null}
            disabled
          />
        </Grid>
      </Grid>

      <Title title="Last Modified" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input
            label="Nomor Item"
            type="number"
            value={lastModified.number ?? ''}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Active"
            type="radio"
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false },
            ]}
            value={lastModified.isActive}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Description"
            type="richtext"
            value={lastModified.description}
            editorHeight="100px"
            renderControls={null}
            disabled
          />
        </Grid>
      </Grid>
    </ColumnWrapper>
  );
};

export default SummaryDetailModal;
