'use client';
import React, { useContext } from 'react';

import { Box, useTheme } from '@mui/material';

import { DirtyContext } from '@/contexts/DirtyContext';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditRiskIdentification from './EditRiskIdentification.hook';


const EditRiskIdentificationPage = () => {
  const { dirtyMsg } = useContext(DirtyContext);
  const theme = useTheme();

  const {
    riskDescriptionContainer,
    setRiskDescriptionContainer,
    riskMitigationContainer,
    setRiskMitigationContainer,
    businessResponseContainer,
    setBusinessResponseContainer,
    handleClickCancel,
    handleOnSave,
    detailRiskIdentification,
    isDetailRiskIdentificationLoading,
    isSaveLoading,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
  } = useEditRiskIdentification();

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
          Edit Identifikasi Risiko
        </TextStyle>
      </RowWrapper>

      <Box width="35vw" marginBottom={theme.spacing(3)}>
        <Input
          type="dropdown"
          label="Jenis Risiko"
          dropdownList={[{
            label: detailRiskIdentification?.legalRiskTypeLabel,
            value: detailRiskIdentification?.legalRiskType,
          }]}
          value={detailRiskIdentification?.legalRiskType}
          disabled
          isMandatory
          placeholder="Choose Jenis Risiko"
        />
      </Box>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(3)}>
        <TextStyle variant="body4" weight={500} color={theme.palette.disabled.main}>
          Deskripsi Risiko
        </TextStyle>
        <WordEditor
          isReadOnly={true}
          container={riskDescriptionContainer}
          setContainer={setRiskDescriptionContainer}
          isLoading={isDetailRiskIdentificationLoading}
          initialValue={detailRiskIdentification.riskDescription}
        />
      </ColumnWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <TextStyle variant="body4" weight={500} color={theme.palette.disabled.main}>
          Mitigasi Risiko
        </TextStyle>
        <WordEditor
          isReadOnly={true}
          container={riskMitigationContainer}
          setContainer={setRiskMitigationContainer}
          isLoading={isDetailRiskIdentificationLoading}
          initialValue={detailRiskIdentification.riskMitigation}
        />
      </ColumnWrapper>

      <ColumnWrapper gap={theme.spacing(2)} marginBottom={theme.spacing(5)}>
        <Text isMandatory>
          Tanggapan Bisnis
        </Text>
        <WordEditor
          id="businessResponse"
          isReadOnly={false}
          container={businessResponseContainer}
          setContainer={setBusinessResponseContainer}
          isLoading={isDetailRiskIdentificationLoading}
          initialValue={detailRiskIdentification.businessResponse}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </ColumnWrapper>

      <RowWrapper justifyContent="end" columnGap={theme.spacing(3)}>
        <Button variant="outlined" onClick={handleClickCancel}>
          Cancel
        </Button>
        <Button
          disabled={isSaveLoading || isDetailRiskIdentificationLoading || isWordEditorEmpty.businessResponse}
          onClick={handleOnSave}
        >
          Save
        </Button>
      </RowWrapper>
    </>
  );
};

export default EditRiskIdentificationPage;
