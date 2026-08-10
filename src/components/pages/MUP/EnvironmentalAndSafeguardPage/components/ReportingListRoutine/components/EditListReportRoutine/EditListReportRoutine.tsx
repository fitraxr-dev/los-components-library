'use client';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import Switch from '@/components/shared/Switch';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useEditListReportRoutine from './EditListReportRoutine.hook';


const EditListReportRoutine = () => {
  const {
    watch,
    setValue,
    gradeLevelList,
    getGradeLevel,
    responseContainer,
    businessResponseData,
    isSubmittingBusinessResponse,
    setResponseContainer,
    handleSaveBusinessResponse,
    isAutoSaveFetching,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    theme,
    handleCancel,
    viewOnly,
  } = useEditListReportRoutine();

  return (
    <ColumnWrapper >
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
          p: 1,
        }}
      >
        <TextStyle variant="body1" color={theme.palette.primary.main}>
          {viewOnly ? 'Detail Daftar Pelaporan Rutin' : 'Edit Daftar Pelaporan Rutin'}
        </TextStyle>
      </RowWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input
          type="area"
          label="Laporan"
          onChange={(e) => setValue('report', e)}
          placeholder="Masukan Laporan"
          rows={3}
          value={watch('report')}
          disabled
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
              }}
              disabled
            />
            <Switch
              label="Semester"
              checked={watch('isSemester')}
              onChange={() => {
                setValue('isSemester', !watch('isSemester'));
                setValue('isAnnual', false);
                setValue('isQuarterly', false);
              }}
              disabled
            />
            <Switch
              label="Tahunan"
              checked={watch('isAnnual')}
              onChange={() => {
                setValue('isAnnual', !watch('isAnnual'));
                setValue('isQuarterly', false);
                setValue('isSemester', false);
              }}
              disabled
            />
          </RowWrapper>
        </ColumnWrapper>


        {
          watch('isAnnual') || watch('isQuarterly') || watch('isSemester') ?
            null :
            <Input
              type="area"
              label="Tenggat Waktu"
              placeholder="Masukan Tenggat Waktu Lainnya"
              rows={3}
              onChange={(e) => setValue('deadlineOther', e)}
              value={watch('deadlineOther')}
              disabled
            />
        }

        <Input
          type="area"
          label="Catatan"
          placeholder="Masukan Catatan"
          rows={3}
          onChange={(e) => setValue('remark', e)}
          value={watch('remark')}
          disabled
        />

        <ColumnWrapper>
          <RowWrapper sx={{ alignItems: 'center', gap: '16px' }}>
            <Input
              type="dropdown"
              label="Grade"
              sx={{ flexGrow: 1 }}
              containerSx={{ minWidth: '8vw', width: '8vw' }}
              onChange={(e) => setValue('grade', e)}
              dropdownList={gradeLevelList}
              value={watch('grade')}
              disabled
              InputProps={{
                sx: {
                  width: '8vw',
                },
              }}
            />
            <TextStyle
              sx={{ flexGrow: 1 }}
              variant="body4"
              weight={500}
              color={theme.palette.text.secondary}
            >
              {getGradeLevel()?.text}
            </TextStyle>
          </RowWrapper>
        </ColumnWrapper>

        <ColumnWrapper>
          <Text>
            Tanggapan Bisnis <span style={{ color: theme.palette.error.main }}>*</span>
          </Text>
          <WordEditor
            id="businessResponse"
            container={responseContainer}
            setContainer={setResponseContainer}
            initialValue={businessResponseData}
            isLoading={isSubmittingBusinessResponse}
            isWordEditorEmpty={isWordEditorEmpty}
            setIsWordEditorEmpty={setIsWordEditorEmpty}
            isReadOnly={viewOnly}
          />
        </ColumnWrapper>
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={handleCancel}
        >
          {viewOnly ? 'Close' : 'Cancel'}
        </Button>
        {!viewOnly && (
          <Button
            isLoading={isSubmittingBusinessResponse}
            onClick={handleSaveBusinessResponse}
            disabled={isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EditListReportRoutine;
