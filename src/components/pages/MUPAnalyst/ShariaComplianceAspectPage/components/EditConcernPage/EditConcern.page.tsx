'use client';
import React, { useContext } from 'react';

import { Box, useTheme } from '@mui/material';

import { DirtyContext } from '@/contexts/DirtyContext';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditConcern from './EditConcern.hook';


const EditConcernPage = () => {
  const { activeTab } = useMUPAnalystContext();
  const theme = useTheme();

  const {
    businessResponseContainer,
    setBusinessResponseContainer,
    descriptionContainer,
    setDescriptionContainer,
    handleClickCancel,
    detailConcern,
    handleOnSave,
    businessResponse,
    setBusinessResponse,
    isSaveConcernLoading,
    isDirty,
  } = useEditConcern();

  const renderTitle = () => {
    switch (activeTab) {
      case 0:
        return 'Internal Concern';
      case 1:
        return 'External Concern';
      default:
        return '';
    }
  };

  const isMandatoryEmpty = !businessResponse;

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
          Edit {renderTitle()}
        </TextStyle>
      </RowWrapper>

      <Box marginBottom={theme.spacing(3)}>
        <Input
          label={renderTitle()}
          value={detailConcern?.shariaCompliance}
          disabled
          placeholder="Choose Internal Concern"
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
          isMandatory
          value={businessResponse}
          onChange={(e) => setBusinessResponse(e.target.value)}
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
          isReadOnly={false}
          container={businessResponseContainer}
          setContainer={setBusinessResponseContainer}
          isLoading={false}
          initialValue={detailConcern?.businessResponseDescription}
        />
      </ColumnWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        <Button variant="outlined" onClick={handleClickCancel}>
          Cancel
        </Button>
        <Button
          disabled={isMandatoryEmpty || isSaveConcernLoading || !isDirty }
          onClick={handleOnSave}
        >
          Save
        </Button>
      </RowWrapper>
    </>
  );
};

export default EditConcernPage;
