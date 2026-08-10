'use client';
import { useContext, useState } from 'react';

import { convertToDocx } from '@/helpers/synfusion';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import TablePaymentFacility from '../../SmiTable/TablePaymentFacility';

import { useFinancingOverview } from './FinancingOverview.hook';


const FinancingOverview = (props: SmiComponentProps) => {
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  const [container, setContainer] = useState(null);
  const { module, process } = props;

  const {
    remark,
    financingOverviewDetail,
    isFetchLoading,
    isSaveLoading,
    handleSave,
    setRemark,
    setShouldGoNext,
  } = useFinancingOverview(props);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <TableDebtorInformation module={module} process={process} />

      <TablePaymentFacility
        module={module}
        process={process}
      />

      <Input
        isMandatory
        label="Keterangan"
        type="area"
        rows={4}
        value={remark}
        onChange={setRemark}
        disabled={viewOnly}
      />

      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={financingOverviewDetail?.description}
        onSave={(blob) => {
          setShouldGoNext(false);
          handleSave(blob);
        }}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          onClick={() => {
            if (viewOnly) {
              goToNextStep();
            } else {
              setShouldGoNext(true);
              convertToDocx(container).then(handleSave);
            }
          }}
        >
          {
            viewOnly ? 'Next' : 'Save & Next'
          }
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FinancingOverview;
