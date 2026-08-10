'use client';
import React from 'react';

import { useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useEditBeneficialOwner from './EditBeneficialOwner.hook';


const EditBeneficialOwnerPage = () => {
  const theme = useTheme();

  const {
    isAutoSaveFetching,
    isBusinessCheck,
    setIsBusinessCheck,
    assessmentContainer,
    setAssessmentContainer,
    verificationContainer,
    setVerificationContainer,
    isDpop,
    data,
    handleOnSave,
    handleCloseEdit,
    isSaveBeneficialLoading,
    debtorDocumentStatus,
    dpopRadioButton,
    setDpopRadioButton,
    isLoading,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    getActionButton,
    ownerId,
    viewOnly,
    isRequiredInputEmpty,
    initialSectionFormat,
  } = useEditBeneficialOwner();

  const renderComponent = () => {
    return (
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Input
          type="radio"
          label="Check DPOP"
          value={dpopRadioButton.isDpopCheck}
          onChange={(e) => {
            setDpopRadioButton((prev) => ({
              ...prev,
              isDpopCheck: e.target.value,
            }));
          }}
          radioList={[
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false }
          ]}
          sx={{ flex: 1, marginY: 1 }}
          isMandatory
          disabled={viewOnly}
        />
        <RowWrapper alignItems="end" gap={theme.spacing(2)}>
          <Input
            type="radio"
            label="Copy / Asli"
            value={dpopRadioButton.isCopy}
            onChange={(e) => {
              setDpopRadioButton((prev) => ({
                ...prev,
                isCopy: e.target.value,
              }));
            }}
            radioList={[
              { label: 'Copy', value: true },
              { label: 'Asli', value: false }
            ]}
            sx={{ flex: 1, marginY: 1 }}
            disabled={viewOnly}
          />
          {dpopRadioButton.isCopy !== null &&
            <TextStyle
              component="button"
              sx={{
                bottom: '18%',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => {
                setDpopRadioButton((prev) => ({
                  ...prev,
                  isCopy: null,
                }));
              }}
            >
              Clear
            </TextStyle>
          }
        </RowWrapper>
        <Input
          type="radio"
          label="Status"
          value={dpopRadioButton.status}
          onChange={(e) => {
            setDpopRadioButton((prev) => ({
              ...prev,
              status: e.target.value,
            }));
          }}
          radioList={debtorDocumentStatus}
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
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title
        title="Edit Beneficial Owner"
        sx={{
          borderBottom: 1,
          borderBottomColor: theme.palette.disabled.main,
          borderBottomStyle: 'solid',
          justifyContent: 'center',
          marginBottom: theme.spacing(2),
        }}
      />
      <p style={{ color: '#ABABAB', fontSize: '0.9375vw', fontWeight: '600', margin: 0 }}>
        Informasi / Dokumen yang Diverifikasi
      </p>
      <div contentEditable="false" style={{ border: '1px solid #ABABAB', borderRadius: '5px', margin: 0, padding: '10px' }}>
        <TextStyle variant="body4" style={{ opacity: '0.7' }}>
          {parse(data?.document ? data?.document : '')}
        </TextStyle>
      </div>

      <Input
        type="radio"
        label="Check Bisnis"
        value={isBusinessCheck}
        radioList={[
          { label: 'Ya', value: true },
          { label: 'Tidak', value: false }
        ]}
        onChange={(e) => {
          setIsBusinessCheck(e.target.value);
        }}
        sx={{ flex: 1, marginY: 1 }}
        disabled={isDpop || viewOnly}
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
          isReadOnly={isDpop || viewOnly}
          container={assessmentContainer}
          setContainer={setAssessmentContainer}
          isLoading={isLoading}
          initialValue={data?.assessmentResult}
          initialSectionFormat={initialSectionFormat}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </ColumnWrapper>

      {isDpop ? (
        <>
          {renderComponent()}
        </>
      ) : null}


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
        {viewOnly ?
          <Button
            variant="outlined"
            onClick={handleCloseEdit}
          >
            Close
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
              isLoading={isSaveBeneficialLoading}
              disabled={isRequiredInputEmpty || isAutoSaveFetching}
              onClick={handleOnSave}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          </>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EditBeneficialOwnerPage;
