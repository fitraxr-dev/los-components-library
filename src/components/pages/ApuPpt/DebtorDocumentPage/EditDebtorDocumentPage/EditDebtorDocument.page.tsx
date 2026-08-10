'use client';
import React from 'react';

import { useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { useSearchParams } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useEditDebtorDocument from './EditDebtorDocument.hook';


const EditDebtorDocumentPage = () => {
  const theme = useTheme();
  const { currentUserDivision } = useApuPptContext();

  const {
    assessmentContainer,
    setAssessmentContainer,
    verificationContainer,
    setVerificationContainer,
    data,
    isAutoSaveFetching,
    isLoading,
    initialSectionFormat,
    handleOnSave,
    handleCloseEdit,
    isBusinessCheck,
    setIsBusinessCheck,
    dpopRadioButton,
    debtorDocumentStatus,
    setDpopRadioButton,
    isRequiredInputEmpty,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    getActionButton,
    ownerId,
    type,
    viewOnly,
    isDpop,
  } = useEditDebtorDocument();


  const newOwnerId = useSearchParams().get('ownerId');

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
            initialSectionFormat={initialSectionFormat}
            isWordEditorEmpty={isWordEditorEmpty}
            setIsWordEditorEmpty={setIsWordEditorEmpty}
          />
        </ColumnWrapper>
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title
        title={`Edit Dokumen Customer ${type}`}
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
      <div contentEditable="false" style={{ border: '1px solid #ABABAB', borderRadius: '5px', height: '200px', margin: 0, overflowX: 'hidden', overflowY: 'auto', padding: '10px' }}>
        <TextStyle variant="body4" style={{ opacity: '0.7' }}>
          {parse(data?.document ? data?.document : '')}
        </TextStyle>
      </div>
      <Input
        type="radio"
        label="Check Bisnis"
        value={isBusinessCheck}
        onChange={(e) => {
          setIsBusinessCheck(e.target.value);
        }}
        radioList={[
          { label: 'Ya', value: true },
          { label: 'Tidak', value: false }
        ]}
        sx={{ flex: 1, marginY: 1 }}
        isMandatory
        disabled={isDpop || viewOnly}
      />
      <ColumnWrapper sx={{ gap: 3 }}>
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
      {/* {renderComponent()} */}

      <TableUploadDocument
        ownerId={newOwnerId}
        actions={getActionButton}
        showModalSelector
        module={TypeModule.APU_PPT}
        process={isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT}
      />


      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
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

export default EditDebtorDocumentPage;
