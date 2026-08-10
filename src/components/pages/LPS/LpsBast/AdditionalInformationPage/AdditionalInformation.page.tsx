'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useAdditionalInformation from './AdditionalInformation.hook';


const AdditionalInformationPage = () => {
  const {
    container,
    setContainer,
    viewOnly,
    containerDpop,
    setContainerDpop,
    isDivisiBisnis,
    isSaveLoading,
    additionalInformationBusiness,
    additionalInformationDpop,
    sortedObject,
    handleButton,
    isEdit,
    isRm,
    handleEdit,
    isAddInfoDpopFetching,
    isAddInfoDpopLoading,
    showSynfusionDpop,
    isDivisiDpop,
    isSuperAdmin,
    isProcessDpop,
    isDetailLoading,
  } = useAdditionalInformation();

  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDivisiDpop && (
        <ConfirmationLatest />
      )}
      <RowWrapper >
        <Title title="Additional Information" />
        {((isRm && isDivisiBisnis) || isSuperAdmin) && isEdit && <IconButton iconName="edit-2" onClick={handleEdit} />}
      </RowWrapper>
      <TableDebtorInformation
        module={TypeModule.LPS}
        process={(isProcessDpop || !(isDivisiBisnis || isSuperAdmin)) ?
          TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST}
      />
      {(isSuperAdmin || !isDivisiBisnis) && <SectionTitle title="Additional Information - Requester" />}
      <WordEditor
        id="lpsBastBisnis"
        isReadOnly={viewOnly || (!isDivisiBisnis && !isSuperAdmin)}
        container={container}
        setContainer={setContainer}
        isLoading={isDetailLoading || isSaveLoading}
        initialValue={additionalInformationBusiness?.description}
      />
      {(showSynfusionDpop || isDivisiDpop) && <SectionTitle title="Additional Information - Divisi Pengelolaan Operasional Pembiayaan" />}
      {(showSynfusionDpop || isDivisiDpop) &&
        <WordEditor
          id="lpsBastDpop"
          isReadOnly={viewOnly}
          container={containerDpop}
          setContainer={setContainerDpop}
          isLoading={isAddInfoDpopFetching || isAddInfoDpopLoading}
          initialValue={additionalInformationDpop?.description}
        />}

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', py: 3 }}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};
export default AdditionalInformationPage;
