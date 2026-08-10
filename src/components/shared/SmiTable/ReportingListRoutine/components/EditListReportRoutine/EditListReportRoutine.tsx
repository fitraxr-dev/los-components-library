import NiceModal from '@ebay/nice-modal-react';

import { TypeModule } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Switch from '@/components/shared/Switch';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditListReportRoutine from './EditListReportRoutine.hook';

import type { EditListReportRoutineProps } from './EditListReportRoutine.types';


const EditListReportRoutine = NiceModal.create((props: EditListReportRoutineProps) => {
  const { isBusinessResponse } = props;
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
  } = useEditListReportRoutine(props);

  return (
    <SectionModal
      title="Edit Daftar Pelaporan Rutin"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={props.module === TypeModule.MUP ? { minWidth: '80vw' } : { minWidth: '52vw' }}
    >
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
          />
        )}

        <Input
          type="area"
          label="Catatan"
          placeholder="Masukan Catatan"
          rows={3}
          onChange={(e) => setValue('remark', e)}
          value={watch('remark')}
          disabled={isBusinessResponse}
        />

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

        {isBusinessResponse &&
          <ColumnWrapper>
            <Text isMandatory={props.module === TypeModule.MUP ? false : true}>
              Tanggapan Bisnis
            </Text>
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
        }
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
        <Input label="Sub Laporan" placeholder="Masukan Sub Laporan" value={watch('report')} onChange={(e) => setValue('report', e)} />
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          disabled={(props.module === TypeModule.MUP) ? false :
            (isBusinessResponse ? isWordEditorEmpty.businessResponse : false)}
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
