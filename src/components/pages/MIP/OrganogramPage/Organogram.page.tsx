'use client';
import { useContext, useState } from 'react';

import { TypeProcess, TypeModule } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useOrganogram } from './Organogram.hook';


const OrganogramPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();

  const [container, setContainer] = useState(null);

  const {
    organogramDetail,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
    handleManagementShareholder,
    handleSave,
    isAutoSaveFetching,
  } = useOrganogram(container);


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title title="Organogram, Manajemen dan Pemegang Saham" />
        <Button onClick={handleManagementShareholder}>
          Detail Management & Shareholder
        </Button>
      </RowWrapper>

      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

      <ColumnWrapper sx={{ gap: 1 }}>
        <SectionTitle title="Keterangan" />
        <WordEditor
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isFetchLoading || isSaveLoading}
          initialValue={organogramDetail?.description}
          onSave={(blob) => {
            setShouldGoNext(false);
            handleSave(blob);
          }}
        />
      </ColumnWrapper>

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
              disabled={isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => {
                setShouldGoNext(false);
                convertToDocx(container).then(handleSave);
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
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

export default OrganogramPage;
