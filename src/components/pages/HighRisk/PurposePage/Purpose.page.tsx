'use client';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import usePurpose from './Purpose.hook';


const PurposePage = () => {
  const theme = useTheme();
  const {
    applicationTypeList,
    container,
    control,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isFetchingDetail,
    isSaveLoading,
    isWordEditorEmpty,
    purposeDetail,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  } = usePurpose();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Tujuan" />
      <TableDebtorInformation
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />
      <SectionTitle title="Tipe Permohonan" isOpen>
        <ColumnWrapper gap={2} mt={2}>
          <Controller
            control={control}
            name="applicationType"
            render={({
              field: { ref, ...field },
            }) => (
              <Input
                {...field}
                type="radio"
                radioList={applicationTypeList}
                disabled={viewOnly}
              />
            )}
          />

          <Controller
            control={control}
            name="remark"
            render={({
              field: { ref, ...field },
            }) => (
              <Input
                {...field}
                type="area"
                rows={3}
                label="Keterangan"
                placeholder="Input Keterangan"
                disabled={viewOnly}
              />
            )}
          />
        </ColumnWrapper>
      </SectionTitle>

      <SectionTitle title="Tujuan" isMandatory isOpen>
        <WordEditor
          id="description"
          container={container}
          setContainer={setContainer}
          isLoading={isFetchingDetail}
          initialValue={purposeDetail?.description}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
          isReadOnly={viewOnly}
          paperProps={{ sx: { mt: theme.spacing(3) } }}
        />
      </SectionTitle>

      <RowWrapper justifyContent="end" py={theme.spacing(3)} gap={theme.spacing(2)}>
        {viewOnly ? (
          <Button
            onClick={goToNextStep}
            isLoading={isSaveLoading}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleSave({ goToNext: false })}
              disabled={isWordEditorEmpty?.description || isAutoSaveFetching}
              isLoading={isSaveLoading}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              onClick={() => handleSave({ goToNext: true })}
              disabled={isWordEditorEmpty?.description}
              isLoading={isSaveLoading}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};


export default PurposePage;
