'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditCustomerDueDiligence from './EditCustomerDueDiligence.hook';


const EditCustomerDueDiligencePage = () => {
  const theme = useTheme();

  const {
    assessmentContainer,
    setAssessmentContainer,
    handleOnSave,
    handleCloseEdit,
    data,
    isAutoSaveFetching,
    isSaveCustomerLoading,
    radioButtonValue,
    setRadioButtonValue,
    verificationContainer,
    setVerificationContainer,
    initialSectionFormat,
    isLoading,
    isDpop,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    isMandatoryEmpty,
    getActionButton,
    ownerId,
    viewOnly,
  } = useEditCustomerDueDiligence();

  const renderComponent = () => {
    return (
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Input
          type="radio"
          label="Verification Summary"
          value={radioButtonValue.isVerification}
          onChange={(e) => {
            setRadioButtonValue((prev) => ({
              ...prev,
              isVerification: e.target.value,
            }));
          }}
          radioList={[{
            label: 'Ya',
            value: true,
          },
          {
            label: 'Tidak',
            value: false,
          }]}
          sx={{ flex: 1, marginY: 1 }}
          isMandatory
          disabled={viewOnly}
        />

        <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
          <TextStyle
            variant="body4"
            weight={500}
            sx={{
              ':after': {
                color: 'red',
                content: '"*"',
              },
            }}
          >
            Hasil Verifikasi DPOP
          </TextStyle>
          <WordEditor
            id="verificationResult"
            container={verificationContainer}
            setContainer={setVerificationContainer}
            isLoading={isLoading}
            isReadOnly={viewOnly}
            initialValue={data?.verificationResult}
            isWordEditorEmpty={isWordEditorEmpty}
            setIsWordEditorEmpty={setIsWordEditorEmpty}
            initialSectionFormat={initialSectionFormat}
          />
        </ColumnWrapper>
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
          p: 1,
        }}
      >

        <TextStyle variant="body1" color={theme.palette.primary.main}>
          Edit Customer Due Diligence
        </TextStyle>
      </RowWrapper>

      <p style={{ color: '#ABABAB', fontSize: '0.9375vw', fontWeight: '600', margin: 0 }}>
        Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat(Beneficial Owner)
      </p>

      <div contentEditable="false" style={{ border: '1px solid #ABABAB', borderRadius: '5px', margin: 0, maxWidth: '100%', padding: '10px' }}>
        <Box sx={{ pr: theme.spacing(3) }}>
          <TextStyle
            variant="body5"
            sx={{

              opacity: '0.7',
            }}
          >
            {parse(data?.document ? data?.document : '')}
          </TextStyle>
        </Box>

      </div>

      <Input
        type="radio"
        label="Assessment Summary "
        position="horizontal"
        radioList={[
          {
            label: 'Ya',
            value: true,
          },
          {
            label: 'Tidak',
            value: false,
          }
        ]}
        disabled={isDpop || viewOnly}
        value={radioButtonValue.isAssessment}
        onChange={(e) => {
          setRadioButtonValue((prev) => ({
            ...prev,
            isAssessment: e.target.value,
          }));
        }}
        isMandatory
      />
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <TextStyle
          variant="body4"
          weight={500}
          sx={{
            ':after': {
              color: 'red',
              content: '"*"',
            },
          }}
        >
          Hasil Bisnis Assessment
        </TextStyle>
        <WordEditor
          id="assessmentResult"
          isLoading={isLoading}
          isReadOnly={isDpop || viewOnly}
          container={assessmentContainer}
          setContainer={setAssessmentContainer}
          initialSectionFormat={initialSectionFormat}
          initialValue={data?.assessmentResult}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </ColumnWrapper>

      {isDpop && (
        <>
          {renderComponent()}
        </>
      )}
      <TableUploadDocument
        actions={getActionButton}
        showModalSelector
        module={TypeModule.APU_PPT}
        process={isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT}
        ownerId={ownerId}
      />

      <RowWrapper
        sx={{
          gap: theme.spacing(3),
          justifyContent: 'end',
          py: theme.spacing(3),
        }}
      >
        { viewOnly ?
          <Button
            variant="outlined"
            onClick={handleCloseEdit}
          >
            Cancel
          </Button>
          :
          <>
            <Button
              variant="outlined"
              onClick={handleCloseEdit}
            >
              Cancel
            </Button>
            <Button
              isLoading={isSaveCustomerLoading}
              disabled={isSaveCustomerLoading || isMandatoryEmpty || isAutoSaveFetching}
              onClick={handleOnSave}
            >
              {isAutoSaveFetching ? 'Auto Save...' : 'Save'}
            </Button>
          </>}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EditCustomerDueDiligencePage;
