'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import usePreviewAcknowledgementSheet from './PreviewAcknowledgementSheet.hook';


const PreviewAcknowledgementSheet = () => {
  const {
    handleClose,
    isAssignedUserLoading,
    tableSections,
  } = usePreviewAcknowledgementSheet();

  return (
    <>
      <Loader isLoading={isAssignedUserLoading} />

      <ColumnWrapper sx={{ gap: 3, mb: 3 }}>
        <Title title="Preview Lembar Persetujuan" />

        <ColumnWrapper sx={{ gap: 3 }}>
          {tableSections.map(({ data, header, key }, index) => (
            <BaseContainer key={key ?? index} sx={{ boxShadow: 7, pb: 2, pt: 0, px: 2 }}>
              <Table
                key={key ?? index}
                tableHeader={header}
                tableData={data}
                isLoading={isAssignedUserLoading}
              />
            </BaseContainer>
          ))}
        </ColumnWrapper>

        <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default PreviewAcknowledgementSheet;
