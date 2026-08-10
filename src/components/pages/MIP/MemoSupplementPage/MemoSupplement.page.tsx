'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableMemoSupplementDocument from '@/components/shared/SmiTable/ViewAllDocument/TableMemoSupplmentDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useMemoSupplement } from './MemoSupplement.hook';


const MemoSupplementPage = (props) => {
  const {
    memoSupplementDetail,
    isFetchLoading,
    isSaveLoading,
    container,
    setContainer,
    renderActionButtons,
    handleSave,
    viewOnly,
  } = useMemoSupplement(props);


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title title="Memo Supplement" />
      </RowWrapper>

      <ColumnWrapper sx={{ gap: 1 }}>
        <WordEditor
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isFetchLoading || isSaveLoading}
          initialValue={memoSupplementDetail?.description}
          onSave={(blob) => {
            handleSave(blob);
          }}
        />
      </ColumnWrapper>

      <TableMemoSupplementDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.MIP_REVIEW}
        showModalSelector={true}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default MemoSupplementPage;
