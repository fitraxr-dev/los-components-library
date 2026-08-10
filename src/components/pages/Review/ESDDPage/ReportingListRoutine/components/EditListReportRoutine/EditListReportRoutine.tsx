'use client';

import NiceModal from '@ebay/nice-modal-react';

import { TypeModule } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RichText from '@/components/shared/Input/components/RichText';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Switch from '@/components/shared/Switch';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditListReportRoutine from './EditListReportRoutine.hooks';

import type { EditListReportRoutineProps } from './EditListReportRoutine.types';


const EditListReportRoutine = NiceModal.create((props: EditListReportRoutineProps) => {
  const { isBusinessResponse, title } = props;
  const {
    watch,
    setValue,
    isSaveLoadingRoutine,
    handleSubmit,
    handleOnSaveRoutineReport,
    gradeLevelList,
    modal,
    modalId,
    getGradeLevel,
    responseContainer,
    businessResponseData,
    isSubmittingBusinessResponse,
    setResponseContainer,
    handleSaveBusinessResponse,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    subReports,
    page,
    setPage,
    setPageSize,
    handleAddSubReport,
    handleSubReportChange,
    handleDeleteSubReport,
    processList,
    processPage,
    tableHeader,
    selectedTask,
    hasEmptySubReports,
    isMainReportEmpty,
    hasDeadlineSelected,
    isOtherDeadlineEmpty,
  } = useEditListReportRoutine(props);

  const isSaveDisabled = () => {
    if (title === 'Edit') {
      if (isBusinessResponse) {
        return isWordEditorEmpty.businessResponse;
      }
      const hasInvalidDeadlineOther = watch('isOther') && isOtherDeadlineEmpty;

      return hasInvalidDeadlineOther;
    }
    return selectedTask.length === 0 ||
      (isBusinessResponse ? isWordEditorEmpty.businessResponse : false) ||
      !hasDeadlineSelected ||
      isOtherDeadlineEmpty ||
      hasEmptySubReports ||
      isMainReportEmpty;
  };

  return (
    <SectionModal
      title={title === 'Edit' ? 'Edit Daftar Pelaporan Rutin' : 'Add Daftar Pelaporan Rutin'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={props.module === TypeModule.MUP ? { minWidth: '80vw' } : { minWidth: '52vw' }}
    >
      {title !== 'Edit' && (
        <ColumnWrapper sx={{ gap: 3, mb: 3 }}>
          <Table
            isPaper
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            maxHeight="25vh"
          />
        </ColumnWrapper>
      )}

      {(title === 'Edit' || selectedTask.length > 0) && (
        <ColumnWrapper sx={{ gap: 3 }}>
          <Input
            type="area"
            label="Laporan"
            onChange={(e) => setValue('report', e)}
            placeholder="Masukan Laporan"
            rows={3}
            value={watch('report')}
            disabled={isBusinessResponse}
          />

          <ColumnWrapper>
            <Text>Tenggat Waktu</Text>
            <RowWrapper sx={{ gap: 3 }}>
              <Switch
                label="Triwulan"
                checked={watch('isQuarterly')}
                onChange={() => {
                  setValue('isQuarterly', !watch('isQuarterly'));
                  setValue('isAnnual', false);
                  setValue('isSemester', false);
                  setValue('isOther', false);
                }}
                disabled={isBusinessResponse}
              />
              <Switch
                label="Semester"
                checked={watch('isSemester')}
                onChange={() => {
                  setValue('isSemester', !watch('isSemester'));
                  setValue('isAnnual', false);
                  setValue('isQuarterly', false);
                  setValue('isOther', false);
                }}
                disabled={isBusinessResponse}
              />
              <Switch
                label="Tahunan"
                checked={watch('isAnnual')}
                onChange={() => {
                  setValue('isAnnual', !watch('isAnnual'));
                  setValue('isQuarterly', false);
                  setValue('isSemester', false);
                  setValue('isOther', false);
                }}
                disabled={isBusinessResponse}
              />
              <Switch
                label="Other"
                checked={watch('isOther')}
                onChange={() => {
                  setValue('isOther', !watch('isOther'));
                  setValue('isAnnual', false);
                  setValue('isQuarterly', false);
                  setValue('isSemester', false);
                }}
                disabled={isBusinessResponse}
              />
            </RowWrapper>
          </ColumnWrapper>

          {watch('isOther') && (
            <Input
              type="area"
              label="Catatan(Tenggat Waktu Other)"
              placeholder="Masukan Tenggat Waktu Lainnya"
              rows={3}
              onChange={(e) => setValue('deadlineOther', e)}
              value={watch('deadlineOther')}
              disabled={isBusinessResponse}
              isMandatory
            />
          )}

          <ColumnWrapper>
            <Text>Catatan</Text>
            <RichText
              value={watch('remark') || ''}
              onChange={(value) => setValue('remark', value)}
              disabled={isBusinessResponse}
            />
          </ColumnWrapper>

          <ColumnWrapper>
            <Text>Grade</Text>
            <RowWrapper sx={{ alignItems: 'center', gap: 3 }}>
              <Input
                type="dropdown"
                containerSx={{ flex: 1, minWidth: '10rem' }}
                onChange={(e) => setValue('grade', e)}
                dropdownList={gradeLevelList}
                value={watch('grade')}
                disabled={isBusinessResponse}
              />
              <TextStyle variant="body4">{getGradeLevel()?.text}</TextStyle>
            </RowWrapper>
          </ColumnWrapper>

          {isBusinessResponse && (
            <ColumnWrapper>
              <Text isMandatory={props.module === TypeModule.MUP ? false : true}>Tanggapan Bisnis</Text>
              <WordEditor
                id="businessResponse"
                container={responseContainer}
                setContainer={setResponseContainer}
                initialValue={businessResponseData}
                isLoading={isSubmittingBusinessResponse}
                isReadOnly={!isBusinessResponse}
                isWordEditorEmpty={isWordEditorEmpty}
                setIsWordEditorEmpty={setIsWordEditorEmpty}
              />
            </ColumnWrapper>
          )}

          <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
            {subReports.map((subReport, index) => (
              <ColumnWrapper key={index} sx={{ gap: '8px', width: '100%' }}>
                <RowWrapper sx={{ alignItems: 'flex-end', gap: '8px', width: '100%' }}>
                  <Input
                    value={subReport}
                    onChange={(value) => handleSubReportChange(index, value)}
                    label={`Sub Laporan ${index + 1}`}
                    type="area"
                    placeholder="Masukan Sub Laporan"
                    disabled={isBusinessResponse}
                    rows={3}
                    sx={{ flex: 1 }}
                    containerSx={{ width: '100%' }}
                  />

                  {subReports.length > 1 && (
                    <IconButton
                      onClick={() => handleDeleteSubReport(index)}
                      iconName="delete"
                      isDisabled={isBusinessResponse}
                      sx={{ mb: 1 }}
                    />
                  )}
                </RowWrapper>
              </ColumnWrapper>
            ))}

            <RowWrapper sx={{ justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={handleAddSubReport} startIcon="add-2" variant="outlined" disabled={isBusinessResponse}>
                Add Sub Laporan
              </Button>
            </RowWrapper>
          </ColumnWrapper>
        </ColumnWrapper>
      )}

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button variant="outlined" sx={{ mr: 3 }} onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          disabled={isSaveDisabled() || hasEmptySubReports || isMainReportEmpty}
          isLoading={isSaveLoadingRoutine}
          onClick={isBusinessResponse ? () => handleSaveBusinessResponse() : handleSubmit(handleOnSaveRoutineReport)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default EditListReportRoutine;
