import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import WordEditor from '@/components/shared/WordEditor';

import DeclineModal from './components/DeclineModal/DeclineModal';
import useAdditionalInformation from './TabAdditionalInformation.hook';


const AdditionalInformation = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    container,
    setContainer,
    isDetailLoading,
    dataDetail,
    renderActionButtons,
  } = useAdditionalInformation();

  return (
    <>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <WordEditor
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isDetailLoading}
          initialValue={dataDetail?.description}
          // enableTrackChanges={true}
        />

        <TableUploadDocument
          title="Upload Document"
          module={TypeModule.HIGH_RISK}
          process={TypeProcess.HIGH_RISK_DK}
          showModalSelector
        />

        <RowWrapper
          sx={{
            gap: theme.spacing(3),
            justifyContent: 'end',
            paddingY: theme.spacing(3),
          }}
        >
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.DECLINE}
        component={DeclineModal}
      />
    </>
  );

};

export default AdditionalInformation;
