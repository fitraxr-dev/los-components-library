'use client';
import { useState } from 'react';

import { convertToDocx } from '@/helpers/synfusion';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { usePurposeAndBackground } from './PurposeAndBackground.hook';


const PurposeAndBackgroundPage = () => {


  const [purpose, setPurpose] = useState(null);
  const [background, setBackground] = useState(null);

  const {
    viewOnly,
    purposeAndBackgroundDetail,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
    handleSave,
    module,
    process,
  } = usePurposeAndBackground();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="Tujuan dan Latar Belakang" />
      <TableDebtorInformation module={module} process={process} />
      {/* <DebtorInformation /> */}

      <SectionTitle title="Tujuan" />
      <WordEditor
        id="tujuan"
        isReadOnly={viewOnly}
        container={purpose}
        setContainer={setPurpose}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={purposeAndBackgroundDetail?.purpose}
      />

      <SectionTitle title="Latar Belakang" />
      <WordEditor
        id="latarBelakang"
        isReadOnly={viewOnly}
        container={background}
        setContainer={setBackground}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={purposeAndBackgroundDetail?.background}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button
            isLoading={isSaveLoading}
            onClick={() => {
              setShouldGoNext(true);
              handleSave(background, purpose);
            }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isSaveLoading}
              onClick={() => {
                setShouldGoNext(false);
                handleSave(background, purpose);
              }}
            >
              Save
            </Button>
            <Button
              isLoading={isSaveLoading}
              onClick={() => {
                setShouldGoNext(true);
                handleSave(background, purpose);
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

export default PurposeAndBackgroundPage;
