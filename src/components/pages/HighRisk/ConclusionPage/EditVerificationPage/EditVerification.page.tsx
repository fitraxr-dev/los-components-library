'use client';

import { Box, useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditVerification from './EditVerification.hook';


const EditVerificationPage = () => {
  const theme = useTheme();

  const {
    form: { control, handleSubmit },
    assessmentContainer,
    detailData,
    dkContainer,
    handleCancel,
    handleOnSave,
    isDetailLoading,
    isSaveBeneficialLoading,
    isValid,
    isWordEditorEmpty,
    setAssessmentContainer,
    setDkContainer,
    setIsWordEditorEmpty,
    setVerificationContainer,
    verificationContainer,
  } = useEditVerification();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
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
          weight={600}
          color={theme.palette.primary.main}
        >
          Edit Verification
        </TextStyle>
      </RowWrapper>

      <p style={{ color: '#ABABAB', fontSize: '0.9375vw', fontWeight: '600', margin: 0 }}>
        Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat(Beneficial Owner)
      </p>
      <div contentEditable="false" style={{ border: '1px solid #ABABAB', borderRadius: '5px', margin: 0, padding: '10px' }}>
        <TextStyle variant="body4" sx={{ opacity: '0.7' }}>
          {parse(detailData?.document ? detailData?.document : '')}
        </TextStyle>
      </div>

      <Input
        type="radio"
        disabled
        value={detailData?.assessmentSummary}
        label="Assesment Summary"
        radioList={[
          {
            label: 'Ya',
            value: true,
          },
          {
            label: 'Tidak',
            value: false,
          },
        ]}
        sx={{ flex: 1 }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <TextStyle variant="body4" color={theme.palette.custom.gray30}>
          Hasil Bisnis Assessment
        </TextStyle>
        <WordEditor
          isReadOnly
          isLoading={isDetailLoading}
          container={assessmentContainer}
          setContainer={setAssessmentContainer}
          initialValue={detailData?.assessmentResult}
          // enableTrackChanges={true}
        />
      </Box>

      <Input
        type="radio"
        label="Verification Summary"
        disabled
        value={detailData?.verificationSummary}
        radioList={[
          {
            label: 'Ya',
            value: true,
          },
          {
            label: 'Tidak',
            value: false,
          },
        ]}
        sx={{ flex: 1 }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <TextStyle variant="body4" color={theme.palette.custom.gray30}>
          Hasil Verifikasi DPOP
        </TextStyle>
        <WordEditor
          isReadOnly
          isLoading={isDetailLoading}
          container={verificationContainer}
          setContainer={setVerificationContainer}
          initialValue={detailData?.verificationResult}
          // enableTrackChanges={true}
        />
      </Box>

      <Controller
        name="dkConfirmation"
        control={control}
        rules={{ validate: (value) => value !== null || 'Konfirmasi DK harus dipilih' }}
        render={({ field, fieldState }) => (
          <Input
            type="radio"
            label="Konfirmasi DK"
            radioList={[
              {
                label: 'Ya',
                value: true,
              },
              {
                label: 'Tidak',
                value: false,
              },
            ]}
            sx={{ flex: 1 }}
            isMandatory
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <TextStyle
          variant="body4"
          weight={500}
          sx={{
            '&:after': {
              color: 'red',
              content: '"*"',
            },
          }}
        >
          Keterangan DK
        </TextStyle>
        <WordEditor
          id="dkDescription"
          container={dkContainer}
          setContainer={setDkContainer}
          isLoading={isDetailLoading}
          initialValue={detailData?.confirmationResult}
          // enableTrackChanges={true}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </Box>

      <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', py: theme.spacing(3) }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleOnSave)}
          isLoading={isSaveBeneficialLoading}
          disabled={!isValid}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EditVerificationPage;
