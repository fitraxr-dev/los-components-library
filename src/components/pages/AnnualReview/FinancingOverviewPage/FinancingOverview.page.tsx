'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import ModalDetailFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility';
import ModalFormFacility from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

// import ModalDetailFacility from './components/ModalDetailFacility';
// import ModalFormFacility from './components/ModalFormFacility';
import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import ModalTablePaymentFacilityExisting from './components/ModalTablePaymentFacilityExisting';
import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { modal } from './FinancingOverview.constants';
import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = () => {
  const { viewOnly } = useViewOnly();
  const {
    remark,
    isAutoSaveFetching,
    isSaveLoading,
    setRemark,
    handleSave,
    handleSubmit,
    control,
    typeProcess,
    isDepiDivision,
    requestTypeData,
    setSelected,
    isAnalyst,
    container,
    setContainer,
    // isFetchLoading,
    financingOverviewDetail,
    isPreview,
    canUpdateFinancingOverview,
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
      {isDepiDivision && (
        <ConfirmationLatest />
      )}
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <TableDebtorInformation module={TypeModule.ANNUAL_REVIEW} process={typeProcess} isOpen={false} />

      {(isDepiDivision && !isPreview) && (
        <SectionTitle title="Tipe Permohonan" isOpen>
          <ColumnWrapper gap={3} mt={2}>
            <Controller
              name="typePermohonan"
              control={control}
              render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
                <div>
                  <Input
                    {...field}
                    disabled={viewOnly}
                    inputRef={ref}
                    type="radio"
                    placeholder="Pilih Tipe Permohonan"
                    radioList={requestTypeData}
                    value={value}
                    error={invalid}
                    sxOptions={{
                      gap: 40,
                    }}
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
                </div>
              )}
            />

            <Controller
              name="typePermohonanRemark"
              control={control}
              render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={viewOnly}
                  inputRef={ref}
                  label="Keterangan"
                  type="area"
                  minRows={4}
                  value={value}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
          </ColumnWrapper >
        </SectionTitle>
      )}

      <SectionTitle title="Ringkasan Fasilitas Pembiayaan" isOpen>
        <TableFinancingFacilitySubmit onChange={(selected) => { setSelected(selected); }} />
      </SectionTitle>
      <Input
        isMandatory={!viewOnly}
        label="Keterangan"
        type="area"
        minRows={4}
        value={remark}
        onChange={setRemark}
        disabled={viewOnly || !canUpdateFinancingOverview}
      />

      {(isDepiDivision && !isPreview) && (
        <SectionTitle title="Additional Information" isOpen>
          <WordEditor
            isReadOnly={viewOnly}
            container={container}
            setContainer={setContainer}
            // isLoading={isFetchLoading || isSaveLoading}
            initialValue={financingOverviewDetail?.description || ''}
          // onSave={(blob) => {
          //   setShouldGoNext(false);
          //   handleSave(blob);
          // }}
          />
        </SectionTitle>
      )}
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {(!isAnalyst && !isPreview) && (
          <Button
            isLoading={isSaveLoading}
            disabled={viewOnly || isAutoSaveFetching}
            onClick={handleSubmit((data) => handleSave(false, data), onInvalid)}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
        <Button
          isLoading={isSaveLoading}
          onClick={handleSubmit((data) => handleSave(true, data), onInvalid)}
        >
          Next
        </Button>
      </RowWrapper>

      <ModalDef
        id={modal.PAYMENT_FACILITY_FORM}
        component={ModalFormFacility}
      />
      <ModalDef
        id={modal.TABLE_PAYMENT_FACILITY_EXISTING}
        component={ModalTablePaymentFacilityExisting}
      />
      <ModalDef
        id={modal.PAYMENT_FACILITY_DETAIL}
        component={ModalDetailFacility}
      />
    </ColumnWrapper>
  );
};

export default FinancingOverview;
