import { useEffect, useState } from 'react';

import { Controller } from 'react-hook-form';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useDescriptionForm from './DescriptionForm.hooks';

import type { DescriptionFormProps } from './DescriptionForm.types';


const DescriptionForm = (props: DescriptionFormProps) => {
  const {
    index,
    fields,
    onDelete,
    isBusinessResponse = false,
    viewOnly = false,
    callback,
    isBusinessResponseMandatory = false,
  } = props;
  const [container, setContainer] = useState(null);

  const {
    moduleListGrade,
    theme,
    watch,
    gradeDescription,
    getValues,
    control,
  } = useDescriptionForm(index);

  useEffect(() => {
    if (container) {
      callback(container);
    }
  }, [container]);

  return (
    <>
      <ColumnWrapper sx={{ gap: '16px' }}>
        <Controller
          control={control}
          name={`descriptionList.${index}.actionDescription`}
          render={({ field: { ref, ...field } }) => (
            <Input
              value={watch(`descriptionList.${index}.actionDescription`)}
              {...field}
              inputRef={ref}
              label="Deskripsi Tindakan Perbaikan"
              type="area"
              placeholder="Input deskripsi tindakan perbaikan"
              InputProps={{
                placeholder: 'Input deskripsi tindakan perbaikan',
              }}
              disabled={viewOnly || isBusinessResponse}
            />
          )}
        />

        <Controller
          control={control}
          name={`descriptionList.${index}.parameter`}
          render={({ field: { ref, ...field } }) => (
            <Input
              value={getValues(`descriptionList.${index}.parameter`)}
              {...field}
              inputRef={ref}
              label="Parameter"
              type="area"
              placeholder="Input Parameter"
              InputProps={{
                placeholder: 'Input Parameter',
              }}
              disabled={viewOnly || isBusinessResponse}
            />
          )}
        />

        <Controller
          control={control}
          name={`descriptionList.${index}.targetFullfillment`}
          render={({ field: { ref, ...field } }) => (
            <Input
              value={getValues(`descriptionList.${index}.targetFullfillment`)}
              {...field}
              inputRef={ref}
              label="Target Waktu Pemenuhan"
              type="text"
              placeholder="Input Target Waktu Pemenuhan"
              InputProps={{
                placeholder: 'Input Target Waktu Pemenuhan',
              }}
              disabled={viewOnly || isBusinessResponse}
            />
          )}
        />

        <ColumnWrapper >
          <RowWrapper sx={{ alignItems: 'center', gap: '16px' }}>
            <Controller
              control={control}
              name={`descriptionList.${index}.grade`}
              render={({ field: { ref, ...field } }) => (
                <Input
                  value={getValues(`descriptionList.${index}.grade`)}
                  {...field}
                  inputRef={ref}
                  label="Grade"
                  type="dropdown"
                  sx={{ flexGrow: 1 }}
                  dropdownList={moduleListGrade}
                  placeholder="Input Grade"
                  InputProps={{
                    placeholder: 'Input Grade',
                    sx: {
                      width: '8vw',
                    },
                  }}
                  disabled={viewOnly || isBusinessResponse}
                />
              )}
            />
            <TextStyle
              sx={{ flexGrow: 1 }}
              variant="body4"
              weight={500}
              color={theme.palette.text.secondary}
            >
              {gradeDescription}
            </TextStyle>
          </RowWrapper>
        </ColumnWrapper>
        <RowWrapper sx={{ justifyContent: 'end' }}>
          {fields.length > 1 ?
            <IconButton onClick={onDelete} iconName="delete" isDisabled={viewOnly} />
            : null}
        </RowWrapper>
      </ColumnWrapper>
      {isBusinessResponse &&
      <ColumnWrapper>
        <Text>
          Tanggapan Bisnis{isBusinessResponseMandatory && <span style={{ color: theme.palette.error.main }}> *</span>}
        </Text>
        <WordEditor
          id={`businessResponse-${index}`}
          container={container}
          setContainer={setContainer}
          initialValue={typeof fields?.[index]?.businessResponse === 'string' ? fields?.[index]?.businessResponse : undefined}
          isReadOnly={viewOnly || !isBusinessResponse}
        />
      </ColumnWrapper>
      }
    </>
  );
};

export default DescriptionForm;
