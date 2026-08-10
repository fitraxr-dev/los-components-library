'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditConcern from './EditConcern.hook';


const EditConcernPage = (props) => {
  const theme = useTheme();

  const {
    businessResponseContainer,
    setBusinessResponseContainer,
    descriptionContainer,
    setDescriptionContainer,
    handleClickCancel,
    isInternalPage,
    detailConcern,
    handleOnSave,
    businessResponse,
    setBusinessResponse,
    isSaveConcernLoading,
    isDirty,
    viewOnly,
  } = useEditConcern();

  const renderTitle = () => {
    if (isInternalPage) {
      return 'Internal Concern';
    } else {
      return 'External Concern';
    }
  };

  const renderPageTitle = () => {
    if (viewOnly) {
      return `Detail ${renderTitle()}`;
    } else {
      return `Edit ${renderTitle()}`;
    }
  };


  return (
    <>
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
          p: 1,
        }}
      >
        <TextStyle
          variant="body1"
          color={theme.palette.primary.main}
          weight={600}
        >
          {renderPageTitle()}
        </TextStyle>
      </RowWrapper>

      <Box marginBottom={theme.spacing(3)}>
        <Input
          label={renderTitle()}
          value={detailConcern?.shariaCompliance}
          disabled
          placeholder={`Choose ${renderTitle()}`}
        />
      </Box>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(3)}>
        <TextStyle variant="body4" color={theme.palette.disabled.main} weight={500} >
          DK
        </TextStyle>
        <WordEditor
          isReadOnly={true}
          container={descriptionContainer}
          setContainer={setDescriptionContainer}
          isLoading={false}
          initialValue={detailConcern?.description}
        />
      </ColumnWrapper>

      <RowWrapper marginBottom={theme.spacing(3)}>
        <Input
          type="radio"
          label="Tanggapan Bisnis"
          value={businessResponse}
          onChange={(e) => setBusinessResponse(e.target.value)}
          disabled={viewOnly}
          radioList={[
            {
              label: 'Setuju',
              value: 'agree',
            },
            {
              label: 'Tidak Setuju',
              value: 'disagree',
            }
          ]}
          sx={{ flex: 1 }}
        />
      </RowWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <Text>
          Keterangan
        </Text>
        <WordEditor
          isReadOnly={viewOnly}
          container={businessResponseContainer}
          setContainer={setBusinessResponseContainer}
          isLoading={false}
          initialValue={detailConcern?.businessResponseDescription}
        />
      </ColumnWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        {viewOnly ? (
          <Button variant="outlined" onClick={handleClickCancel}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleClickCancel}>
              Cancel
            </Button>
            <Button
              disabled={isSaveConcernLoading}
              onClick={handleOnSave}
            >
              Save
            </Button>
          </>
        )}
      </RowWrapper>
    </>
  );
};

export default EditConcernPage;
