'use client';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useOthersHooks from './Other.hook';


const OtherPage = () => {
  const {
    data,
    handleSaveOthers,
    isPending,
    viewOnly,
    container,
    setContainer,
    module,
    process,
    setShouldGoNext, isLoading } = useOthersHooks();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableDebtorInformation module={module} process={process} />
      <Title title="Lain-lain" />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        initialValue={data?.content?.description}
        isLoading={isLoading}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button
            isLoading={isPending}
            onClick={() => {
              setShouldGoNext(true);
              handleSaveOthers(container);
            }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isPending}
              onClick={() => {
                setShouldGoNext(false);
                handleSaveOthers(container);
              }}
            >
              Save
            </Button>
            <Button
              isLoading={isPending}
              onClick={() => {
                setShouldGoNext(true);
                handleSaveOthers(container);
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

export default OtherPage;
