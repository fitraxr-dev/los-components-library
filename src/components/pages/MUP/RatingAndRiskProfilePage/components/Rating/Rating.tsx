'use client';
import React from 'react';

import { Box, CircularProgress, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';


import { ratingTypeOptions } from './Rating.constants';
import { useRating } from './Rating.hook';


const Rating = () => {
  const theme = useTheme();

  const {
    constrainContainer,
    detailRatingData,
    isRatingLoading,
    othersContainer,
    setConstrainContainer,
    setOthersContainer,
    setSupportingContainer,
    supportingContainer,
    categoryValue,
    ratingTypeValue,
    othersRatingTypeDesc,
  } = useRating();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <Title title="Rating" />
      </RowWrapper>
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Rating Management" isOpen>
          {isRatingLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <BaseContainer
              sx={{
                boxShadow: 2,
                gridGap: theme.spacing(2),
                maxWidth: '100%',
                mt: theme.spacing(3),
                padding: theme.spacing(2),
              }}
            >
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
                  value={ratingTypeValue}
                />
                <Input
                  disabled
                  label="Rating Period"
                  type="date"
                  format="YYYY"
                  openTo="year"
                  views={['year']}
                  view="year"
                  value={detailRatingData?.ratingPeriod}
                />

                {ratingTypeValue === 'others' && (
                  <Input
                    label="Others"
                    placeholder="Input Rating Type"
                    type="text"
                    value={othersRatingTypeDesc}
                    disabled
                  />
                )}
              </Box>

              <Input
                disabled
                label="Keterangan Rating"
                type="area"
                value={detailRatingData?.description || '-'}
                rows={4}
              />
            </BaseContainer>
          )}
        </SectionTitle>
      </ColumnWrapper>


      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Supporting Factors" />
        {isRatingLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <WordEditor
            id="SupportingFactorsContainer"
            isReadOnly={true}
            initialValue={detailRatingData?.supportingFactor}
            container={supportingContainer}
            setContainer={setSupportingContainer}
          />
        )}
      </ColumnWrapper>


      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Constraining Factors" />
        {isRatingLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <WordEditor
            id="ConstrainingFactorsContainer"
            isReadOnly={true}
            initialValue={detailRatingData?.constrainingFactor}
            container={constrainContainer}
            setContainer={setConstrainContainer}
          />
        )}
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Hal - Hal yang perlu diperhatikan" />
        {isRatingLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <WordEditor
            id="ThingsToPayAttentionTo"
            isReadOnly={true}
            initialValue={detailRatingData?.note}
            container={othersContainer}
            setContainer={setOthersContainer}
          />
        )}
      </ColumnWrapper>
    </ColumnWrapper >
  );
};

export default Rating;
