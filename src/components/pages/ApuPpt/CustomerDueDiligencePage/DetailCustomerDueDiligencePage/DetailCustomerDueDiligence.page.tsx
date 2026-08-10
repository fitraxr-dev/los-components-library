'use client';
import React from 'react';

import { useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useDetailCustomerDueDiligence from './DetailCustomerDueDiligence.hook';


const DetailCustomerDueDiligencePage = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    customerDetail,
    isLoading,
    assessmentContainer,
    setAssessmentContainer,
    isApdb,
    verificationContainer,
    setVerificationContainer,
    radioButtonValue,
    setRadioButtonValue,
    ownerId,
    getActionButton,
    initialSectionFormat,
  } = useDetailCustomerDueDiligence();

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
          disabled
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
            isReadOnly
            initialValue={customerDetail?.verificationResult}
          />
        </ColumnWrapper>
      </ColumnWrapper>
    );
  };


  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(1),
          p: 1,
        }}
      >
        <TextStyle variant="body1" color={theme.palette.primary.main}>
          Detail Customer Due Diligence
        </TextStyle>
      </RowWrapper>

      <p style={{ color: '#ABABAB', fontSize: '0.9375vw', fontWeight: '600', margin: 0 }}>
        Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat(Beneficial Owner)
      </p>
      <div contentEditable="false" style={{ border: '1px solid #ABABAB', borderRadius: '5px', margin: 0, padding: '10px' }}>
        <TextStyle variant="body4" style={{ opacity: '0.7' }}>
          {parse(customerDetail?.document ? customerDetail?.document : '')}
        </TextStyle>
      </div>

      <Input
        type="radio"
        label="Assessment Summary "
        position="horizontal"
        radioList={[
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          }
        ]}
        value={customerDetail?.assessmentSummary}
        disabled
      />
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <TextStyle
          variant="body4"
          color={theme.palette.disabled.main}
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
          isLoading={isLoading}
          container={assessmentContainer}
          setContainer={setAssessmentContainer}
          isReadOnly={true}
          initialSectionFormat={initialSectionFormat}
          initialValue={customerDetail?.assessmentResult}
        />
      </ColumnWrapper>
      {isApdb && renderComponent()}
      <TableUploadDocument
        ownerId={ownerId}
        module={TypeModule.APU_PPT}
        actions={getActionButton}
        process={isApdb ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT}
      />
      <RowWrapper
        sx={{
          gap: theme.spacing(3),
          justifyContent: 'end',
          py: theme.spacing(3),
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.back()}
        >
          Close
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DetailCustomerDueDiligencePage;
