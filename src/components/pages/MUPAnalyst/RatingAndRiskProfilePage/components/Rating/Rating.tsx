'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ModalHistoryRating from '../ModalHistoryRating';

import { ratingTypeOptions, modal } from './Rating.constants';
import { useRating } from './Rating.hook';


const Rating = () => {
  const theme = useTheme();

  const {
    constrainContainer,
    detailRatingData,
    othersContainer,
    setConstrainContainer,
    setOthersContainer,
    setSupportingContainer,
    supportingContainer,
    handleOpenHistoryModal,
  } = useRating();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <Title title="Rating" />
        <Button startIcon="monitor" onClick={handleOpenHistoryModal}>
          View History
        </Button>
      </RowWrapper>
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          label="Rating"
          disabled
          value={detailRatingData?.ratingLabel || '-'}
        />
        <Input
          label="Kategori"
          disabled
          value={detailRatingData?.categoryLabel || '-'}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          disabled
          label="Rating Type"
          type="radio"
          radioList={ratingTypeOptions}
          value={detailRatingData?.ratingType}
        />
        <Input
          disabled
          label="Rating Period"
          type="date"
          value={detailRatingData?.ratingPeriod}
        />
      </Box>

      <Input
        disabled
        label="Keterangan Rating"
        type="area"
        value={detailRatingData?.description || '-'}
        rows={4}
      />


      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Supporting Factors" />
        <WordEditor
          isReadOnly={true}
          initialValue={detailRatingData?.supportingFactor}
          container={supportingContainer}
          setContainer={setSupportingContainer}
        />
      </ColumnWrapper>


      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Constraining Factors" />
        <WordEditor
          isReadOnly={true}
          initialValue={detailRatingData?.constrainingFactor}
          container={constrainContainer}
          setContainer={setConstrainContainer}
        />
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Hal - Hal yang perlu diperhatikan" />
        <WordEditor
          isReadOnly={true}
          initialValue={detailRatingData?.note}
          container={othersContainer}
          setContainer={setOthersContainer}
        />
      </ColumnWrapper>

      <ModalDef
        id={modal.HISTORY_RATING}
        component={ModalHistoryRating}
      />
    </ColumnWrapper >
  );
};

export default Rating;
