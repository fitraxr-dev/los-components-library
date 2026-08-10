'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ConfirmationLatest from '@/components/pages/Review/components/ConfirmationLatest/ConfirmationLatest';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ModalDetailFacility from '../../_legacy/FinancingOverview-KepatuhanSyariah/components/ModalDetailFacility';

import ModalFormFacility from './components/ModalFormFacility';
import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { modal } from './FinancingOverview.constants';
import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = () => {
  const { processId } = useIdentity();
  const {
    viewOnly,
    financingOverviewDetail,
    isAutoSaveFetching,
    isSaveLoading,
    handleSaveOnly,
    handleSaveAndNext,
    setRemark,
    typeSubmissionData,
    control,
    handleSubmit,
    goToNextStep,
    container,
    canUpdateFinancingOverview,
    setContainer,
    syncfusionFinancingOverviewDetail,
    isSyncfusionFetchLoading,
    changeBgInput,
    findDataMaster,
    findLabelTypeSubmission,
    needCheckMaster,
  } = useFinancingOverview();

  const onInvalid = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <TableDebtorInformation module={TypeModule.MIP_REVIEW} process={TypeProcess.REVIEWER_DEPI} />
      <SectionTitle title="Tipe Permohonan" isOpen>
        <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
          <Controller
            name="typePermohonan"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <div>
                <Input
                  {...field}
                  disabled={viewOnly || !canUpdateFinancingOverview}
                  sx={{
                    backgroundColor: changeBgInput('typePermohonan'),
                  }}
                  inputRef={ref}
                  type="radio"
                  placeholder="Pilih Tipe Permohonan"
                  radioList={typeSubmissionData}
                  value={value}
                  error={invalid}
                />
                <FormHelperText
                  error={true}
                  sx={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.03333em',
                    lineHeight: 1.66,
                    mt: 0.5,
                    mx: 0,
                  }}
                >
                  {error?.message}
                </FormHelperText>
                {needCheckMaster && (
                  <TextStyle weight={500}>
                    Data Sebelumnya :{' '}
                    {findDataMaster('typePermohonan')
                      ? findLabelTypeSubmission(findDataMaster('typePermohonan'))
                      : '-'
                    }
                  </TextStyle>
                )}
              </div>
            )}
          />

          <Controller
            name="typePermohonanRemark"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <div>
                <Input
                  {...field}
                  disabled={viewOnly || !canUpdateFinancingOverview}
                  inputSx={{
                    backgroundColor: changeBgInput('typePermohonanRemark'),
                  }}
                  label="Keterangan"
                  type="area"
                  rows={4}
                  value={value}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
                {needCheckMaster && (
                  <TextStyle weight={500} >
                    Data Sebelumnya : {findDataMaster('typePermohonanRemark') || '-'}
                  </TextStyle>
                )}
              </div>
            )}
          />
        </ColumnWrapper>
      </SectionTitle>
      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen>
        <TableFinancingFacilitySubmit />
        <Input
          label="Keterangan"
          type="area"
          rows={4}
          value={financingOverviewDetail?.remark}
          onChange={setRemark}
          disabled
          placeholder=""
        />
      </SectionTitle>

      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly || !canUpdateFinancingOverview}
        container={container}
        setContainer={setContainer}
        isLoading={isSyncfusionFetchLoading || isSaveLoading}
        initialValue={syncfusionFinancingOverviewDetail?.description}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly || !canUpdateFinancingOverview ? (
          <Button
            isLoading={isSaveLoading}
            onClick={() => goToNextStep()}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isSaveLoading}
              disabled={isSaveLoading || isAutoSaveFetching}
              onClick={handleSubmit(handleSaveOnly, onInvalid)}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
              disabled={isSaveLoading}
              onClick={handleSubmit(handleSaveAndNext, onInvalid)}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>

      <ModalDef
        id={modal.FORM_FACILITY}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={modal.DETAIL_FACILITY}
        component={ModalDetailFacility}
      />
    </ColumnWrapper>
  );
};

export default FinancingOverview;
