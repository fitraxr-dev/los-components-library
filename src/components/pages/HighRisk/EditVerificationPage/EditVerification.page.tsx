'use client';
import { useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { highRisk } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';


const EditVerificationPage = () => {
  const theme = useTheme();
  const { processId } = useParams();
  const router = useCustomRouter();

  const [assessmentContainer, setAssessmentContainer] = useState(null);
  const [verificationContainer, setVerificationContainer] = useState(null);
  const [dkContainer, setDkContainer] = useState(null);

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
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.primary.main}
        >
          Edit Verification
        </TextStyle>
      </RowWrapper>

      <Input
        disabled
        type="area"
        label="Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat (Beneficial Owner)"
        placeholder="Salinan	dari	akta pendirian calon Nasabah /
        Nasabah, termasuk dokumen pengesahan Menteri Hukum dan Hak Asasi Manusia (atau nama sebelumnya yang mengacu kepada definisi dari Menteri Hukum dan Hak Asasi Manusia Republik Indonesia dari waktu ke waktu) atas akta pendirian Nasabah"
        rows={3}
      />

      <Input
        type="radio"
        disabled
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
      <TextStyle variant="body4" color={theme.palette.custom.gray30}>Hasil Bisnis Assessment</TextStyle>
      <WordEditor
        // isReadOnly={viewOnly} // TODO: change later
        container={assessmentContainer}
        setContainer={setAssessmentContainer}
      // isLoading={isFetchLoading || isSaveLoading}
      // initialValue={specialApprovalDetail?.description}
      />

      <Input
        type="radio"
        disabled
        label="Verification Summary"
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

      <TextStyle variant="body4" color={theme.palette.custom.gray30}>Hasil Verifikasi DPOP</TextStyle>
      <WordEditor
        // isReadOnly={viewOnly} // TODO: change later
        container={verificationContainer}
        setContainer={setVerificationContainer}
      // isLoading={isFetchLoading || isSaveLoading}
      // initialValue={specialApprovalDetail?.description}
      />

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
      />
      <TextStyle variant="body4" color={theme.palette.custom.gray30}>Keterangan DK</TextStyle>
      <WordEditor
        // isReadOnly={viewOnly} // TODO: change later
        container={dkContainer}
        setContainer={setDkContainer}
      // isLoading={isFetchLoading || isSaveLoading}
      // initialValue={specialApprovalDetail?.description}
      />

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            router.push(
              replacePath(
                highRisk.SUMMARY_PAGE,
                {
                  processId,
                }
              )
            );
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => { }}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};


export default EditVerificationPage;
