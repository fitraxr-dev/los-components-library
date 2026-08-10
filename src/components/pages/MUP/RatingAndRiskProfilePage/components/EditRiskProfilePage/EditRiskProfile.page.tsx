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

import { useEditRiskProfile } from './EditRiskProfile.hook';


const EditRiskProfilePage = () => {
  const theme = useTheme();

  const {
    descriptionContainer,
    mitigationContainer,
    responseContainer,
    setDescriptionContainer,
    setMitigationContainer,
    setResponseContainer,
    handleClickCancel,
    riskDetailData,
    handleSave,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
  } = useEditRiskProfile();

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
          Edit Profil Risiko
        </TextStyle>
      </RowWrapper>

      <Box
        sx={{ display: 'grid', gap: 2, gridTemplateRows: 'repeat(1, 1fr)', pb: 3 }}
      >
        <Input
          type="text"
          label="Jenis Risiko"
          disabled
          value={riskDetailData?.riskTypeLabel}
        />
        {
          riskDetailData?.riskType?.includes('OTHER') && (
            <Input
              placeholder="Input Jenis Resiko"
              type="text"
              value={riskDetailData?.otherRiskType}
              disabled
            />
          )}
      </Box>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(3)}>
        <Text>
          Deskripsi Risiko
        </Text>

        <WordEditor
          isReadOnly={true}
          container={descriptionContainer}
          setContainer={setDescriptionContainer}
          isLoading={false}
          initialValue={riskDetailData?.description}
        />
      </ColumnWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <Text>
          Mitigasi Risiko
        </Text>
        <WordEditor
          isReadOnly={true}
          container={mitigationContainer}
          setContainer={setMitigationContainer}
          isLoading={false}
          initialValue={riskDetailData?.mitigation}
        />
      </ColumnWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <Text isMandatory>
          Tanggapan Bisnis
        </Text>
        <WordEditor
          id="response"
          isReadOnly={false}
          container={responseContainer}
          setContainer={setResponseContainer}
          isLoading={false}
          initialValue={riskDetailData?.businessResponse}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </ColumnWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        <Button variant="outlined" onClick={handleClickCancel}>
          Cancel
        </Button>
        <Button disabled={isWordEditorEmpty.response} onClick={handleSave}>
          Save
        </Button>
      </RowWrapper>
    </>
  );
};

export default EditRiskProfilePage;
