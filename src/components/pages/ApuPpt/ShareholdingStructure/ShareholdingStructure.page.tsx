'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import ModalAddNewShareholder from './components/ModalAddNewShareholder';
import TableNestedChild from './components/TableNestedChild';
import TableParent from './components/TableParent/TableParent';
import { modal } from './ShareholdingStructure.constant';
import { ShareholdingStructureProvider } from './ShareholdingStructure.context';
import { useShareholdingStructure } from './ShareholdingStructure.hook';


const ShareholdingStructurePage = () => {
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const { stepper } = useApuPptContext();
  const isFromHR = stepper.from === 'HR_ASK_FOR_INFO';

  const {
    getRemarksAndAdditionalInfo,
    tableHeaderParent,
    initialSectionFormat,
    isAutoSaveFetching,
    isLoadingGrouped,
    isRemarksAndAdditionalInfoLoading,
    isLoadingSave,
    container,
    setContainer,
    onSaveRemark,
    process,
    splitGropuedData,
    handleModalAction,
    processId,
    tableHeaderNestedChild,
    onDeleteLevelTable,
    listButtons,
    control,
  } = useShareholdingStructure();

  const { groupedDataDataChild, groupedDataDataParent, lastLevel } = splitGropuedData();

  return (
    <ShareholdingStructureProvider value={{}}>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Struktur Kepemilikan Saham" buttons={listButtons} />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />
        <TableParent
          tableData={groupedDataDataParent}
          isLoading={isLoadingGrouped}
          tableHeader={tableHeaderParent}
          onAddNewLevel={(level) =>
            handleModalAction({
              action: 'add',
              isParentLevel: false,
              level,
              shareHolderLevel: level <= 1 ? 1 : level - 1,
            })
          }
          lastLevel={lastLevel}
        />
        <TableNestedChild
          tableData={groupedDataDataChild}
          tableHeader={tableHeaderNestedChild}
          process={process}
          isLoading={isLoadingGrouped}
          module={TypeModule.APU_PPT}
          bucketProcessId={processId}
          addNewLevel={(level) => {
            handleModalAction({
              action: 'add',
              isParentLevel: false,
              level: level + 1,
              shareHolderLevel: level,
            });
          }

          }
          addNewRow={(level) =>
            handleModalAction({
              action: 'add',
              isParentLevel: false,
              level,
              shareHolderLevel: level <= 1 ? 1 : level - 1,
            })
          }
          deleteLevel={(lvl) => onDeleteLevelTable(lvl)}
          lastLevel={lastLevel}
        />
        <Controller
          control={control}
          name="remark"
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              label="Keterangan"
              placeholder="Input Keterangan"
              rows={3}
              disabled={viewOnly}
            />
          )}
        />
        <SectionTitle title="Additional Information" />
        <WordEditor
          isReadOnly={!isFromHR && viewOnly}
          isLoading={isRemarksAndAdditionalInfoLoading}
          container={container}
          setContainer={setContainer}
          initialValue={getRemarksAndAdditionalInfo?.content?.description}
          initialSectionFormat={initialSectionFormat}
        />

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {!isFromHR && viewOnly ? (
            <Button
              onClick={goToNextStep}
              isLoading={isLoadingSave}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onSaveRemark({ goToNext: false })}
                isLoading={isLoadingSave}
                disabled={isAutoSaveFetching}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                onClick={() => onSaveRemark({ goToNext: true })}
                isLoading={isLoadingSave}
              >
                Next
              </Button>
            </>
          )}
        </RowWrapper>
        <ModalDef
          id={modal?.SHAREHOLDER_MODAL}
          component={ModalAddNewShareholder}
        />
      </ColumnWrapper>
    </ShareholdingStructureProvider>
  );
};

export default ShareholdingStructurePage;
