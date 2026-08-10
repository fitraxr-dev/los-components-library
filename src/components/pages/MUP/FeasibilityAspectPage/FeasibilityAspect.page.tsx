'use client';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useProfile } from './FeasibilityAspect.hook';


const FeasibilityAspectPage = () => {
  const { viewOnly } = useViewOnly();

  const {
    feasibilityAspectDetail,
    isFetchLoading,
    isSaveLoading,
    handleSave,
    container,
    setContainer,
  } = useProfile();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Aspek Kelayakan" />
      <WordEditor
        id="mup-feasibility-aspect"
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={feasibilityAspectDetail?.description}
        onSave={handleSave}
      />
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          onClick={handleSave}
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FeasibilityAspectPage;
