'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditConcern from './EditConcern.hook';


const EditConcernPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

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
    canUpdate,
  } = useEditConcern();

  const renderTitle = () => {
    if (isInternalPage) {
      return 'Internal Concern';
    } else {
      return 'External Concern';
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
          {viewOnly ? 'Detail' : 'Edit'} {renderTitle()}
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

      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(3)}>
        <Text>
          Tanggapan Bisnis <span style={{ color: theme.palette.error.main }}>*</span>
        </Text>
        <Input
          type="radio"
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
        />
      </ColumnWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <Text>
          Keterangan <span style={{ color: theme.palette.error.main }}>*</span>
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
              disabled={isSaveConcernLoading || !canUpdate}
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
