'use client';
import { useContext, useState } from 'react';

import page from '@/app/page';
import { TypeProcess, TypeModule } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useFeasibilityAspect } from './FeasibilityAspect.hook';


const FeasibilityAspectPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();

  const [container, setContainer] = useState(null);

  const {
    feasibilityAspectDetail,
    isFetchLoading,
    isSaveLoading,
    isAutoSaveFetching,
    setShouldGoNext,
    handleSave,
  } = useFeasibilityAspect(container);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Aspek Kelayakan" />

      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={feasibilityAspectDetail?.description}
        onSave={(blob) => {
          setShouldGoNext(false);
          handleSave(blob);
        }}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button
            isLoading={isSaveLoading}
            onClick={() => {
              setShouldGoNext(true);
            }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isSaveLoading}
              disabled={viewOnly || isAutoSaveFetching}
              onClick={() => {
                setShouldGoNext(false);
                convertToDocx(container).then(handleSave);
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
              disabled={viewOnly}
              onClick={() => {
                setShouldGoNext(true);
                convertToDocx(container).then(handleSave);
              }}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FeasibilityAspectPage;
