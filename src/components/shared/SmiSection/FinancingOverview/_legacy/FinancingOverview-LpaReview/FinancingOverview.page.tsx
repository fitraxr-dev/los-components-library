'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import useGetCurrentModule from '@/components/pages/Review/LpaReview/hooks/useGetCurrentModule';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';


import FinancingFacilityAlert from './components/FinancingFacilityAlert';
import ModalDetailFacility from './components/ModalDetailFacility';
import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import { modal } from './FinancingOverview.constants';
import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = () => {
  const { module, process } = useGetCurrentModule();
  const {
    isLoading,
    financingOverviewDetail,
    viewOnly,
    isAutoSaveFetching,
    isSaveLoading,
    handleSave,
    control,
    handleSubmit,
    goToNextStep,
    container,
    setContainer,
    processId,
  } = useFinancingOverview();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <FinancingFacilityAlert />
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <TableDebtorInformation module={module} process={process} />

      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen sx={{ mb: 2 }}>
        <ColumnWrapper gap={2}>
          <TableFinancingFacilitySubmit parentBucketId={processId} />
          <Controller
            name="typePermohonanRemark"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                disabled={viewOnly}
                label="Keterangan"
                type="area"
                rows={4}
                value={value}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </ColumnWrapper>
      </SectionTitle>

      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isSaveLoading || isSaveLoading}
        initialValue={financingOverviewDetail?.description}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        {viewOnly ?
          <Button
            isLoading={isSaveLoading}
            onClick={() => goToNextStep()}
          >
            Next
          </Button> :
          <RowWrapper sx={{ gap: 2 }}>
            <Button
              isLoading={isSaveLoading}
              onClick={handleSubmit((data) => handleSave(data, false))}
              disabled={isSaveLoading || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
              onClick={handleSubmit((data) => handleSave(data, true))}
              disabled={isSaveLoading}
            >
              Next
            </Button>
          </RowWrapper>}
      </RowWrapper>

      <ModalDef
        id={modal.DETAIL_FACILITY}
        component={ModalDetailFacility}
      />
    </ColumnWrapper>
  );
};

export default FinancingOverview;
