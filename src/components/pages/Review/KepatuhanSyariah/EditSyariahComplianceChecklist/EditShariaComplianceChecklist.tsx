'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useEditShariaComplianceChecklist from './EditShariaComplianceChecklist.hooks';


const EditShariaComplianceChecklist = () => {
  const theme = useTheme();

  const {
    data,
    viewOnly,
    isAutoSaveFetching,
    isSub,
    setValue,
    container,
    setContainer,
    watch,
    handleSave,
    handleSubmit,
    handleBack,
    isDetail,
    isSaveLoading,
  } = useEditShariaComplianceChecklist();


  return (
    <>
      <BaseContainer>
        <ColumnWrapper sx={{ gap: 4 }}>
          <Title
            title="Edit Checklist Kepatuhan Syariah"
            sx={{
              borderBottom: 1,
              borderBottomColor: theme.palette.disabled.main,
              borderBottomStyle: 'solid',
              justifyContent: 'center',
            }}
          />

          <Input
            label="Aspek Syariah"
            placeholder="Masukan Aspek Syariah"
            sx={{
              justifyContent: 'center',
              textAlign: 'center',
            }}
            value={watch('aspect')}
            onChange={(value) => setValue('aspect', value)}
            disabled
          />
          {isSub && (
            <TextStyle variant="body4" weight={500} color={theme.palette.primary.main}>
              {isSub.toUpperCase()}.&nbsp;
              {data?.subAspect}
            </TextStyle>
          )}

          <Input
            type="radio"
            label="Check DK"
            radioList={[
              { label: 'Ya', value: 'yes' },
              { label: 'Tidak', value: 'no' }
            ]}
            disabled={viewOnly || isDetail}
            value={watch('isCheckDK')}
            onChange={(e) => setValue('isCheckDK', e.target.value)}
          />

          <ColumnWrapper sx={{ gap: 3 }}>
            <TextStyle variant="body4" weight={500}>
              Keterangan
            </TextStyle>

            <WordEditor
              isReadOnly={viewOnly || isDetail}
              container={container}
              setContainer={setContainer}
              initialValue={data?.description}
            />
          </ColumnWrapper>
        </ColumnWrapper>
      </BaseContainer>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        <Button variant="outlined" onClick={handleBack}>{isDetail ? 'Close' : 'Cancel'}</Button>
        {!isDetail &&
          <Button
            disabled={
              viewOnly ||
              !watch('aspect') ||
              !watch('isCheckDK') ||
              isSaveLoading ||
              isAutoSaveFetching
            }
            onClick={handleSubmit(handleSave)}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        }
      </RowWrapper>
    </>
  );
};

export default EditShariaComplianceChecklist;
