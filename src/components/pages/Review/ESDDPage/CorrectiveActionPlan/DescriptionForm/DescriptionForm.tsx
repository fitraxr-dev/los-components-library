'use client';

import { useEffect, useState } from 'react';

import { Controller } from 'react-hook-form';

import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useDescriptionForm from './DescriptionForm.hooks';

import type { DescriptionFormProps } from './DescriptionForm.types';


interface Comment {
  id?: number;
  commentText: string;
  commentedBy: string;
  createdBy?: number;
  commentType: string;
}

interface SectionComments {
  actionDescription: Comment[];
  parameter: Comment[];
  targetFullfillment: Comment[];
}

const DescriptionForm = (props: DescriptionFormProps) => {
  const { index, fields, onDelete, isBusinessResponse = false, viewOnly = false, callback } = props;
  const [container, setContainer] = useState(null);
  const { userData } = useIdentity();
  const [sectionComments, setSectionComments] = useState<SectionComments>({
    actionDescription: [],
    parameter: [],
    targetFullfillment: [],
  });

  const [newComments, setNewComments] = useState({
    actionDescription: '',
    parameter: '',
    targetFullfillment: '',
  });

  const { moduleListGrade, theme, watch, gradeDescription, getValues, control, setValue } = useDescriptionForm(index);

  useEffect(() => {
    const descriptionData = getValues(`descriptionList.${index}`);
    if (descriptionData) {
      setSectionComments({
        actionDescription: descriptionData.commentsActionDescription || [],
        parameter: descriptionData.commentsParameter || [],
        targetFullfillment: descriptionData.commentsTargetFullfillment || [],
      });
    }
  }, [index, getValues]);


  useEffect(() => {
    setValue(`descriptionList.${index}.commentsActionDescription`, sectionComments.actionDescription);
    setValue(`descriptionList.${index}.commentsParameter`, sectionComments.parameter);
    setValue(`descriptionList.${index}.commentsTargetFullfillment`, sectionComments.targetFullfillment);
  }, [sectionComments, index, setValue]);

  useEffect(() => {
    if (container) {
      callback(container);
    }
  }, [container]);

  const handleAddComment = (section: keyof SectionComments) => {
    const commentText = newComments[section].trim();
    if (commentText) {
      const newComment: Comment = {
        commentText,
        commentType: section,
        commentedBy: userData?.user?.fullName,
      };
      setSectionComments((prev) => ({
        ...prev,
        [section]: [...prev[section], newComment],
      }));
      setNewComments((prev) => ({ ...prev, [section]: '' }));
    }
  };

  const handleDeleteComment = (section: keyof SectionComments, commentIndex: number) => {
    setSectionComments((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== commentIndex),
    }));
  };

  const handleNewCommentChange = (section: keyof SectionComments, value: string) => {
    setNewComments((prev) => ({ ...prev, [section]: value }));
  };

  const renderSectionWithComments = (
    section: keyof SectionComments,
    controllerName: string,
    label: string,
    placeholder: string,
  ) => (
    <RowWrapper
      sx={{
        alignItems: 'flex-start',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        gap: '16px',
        p: 3,
        width: '100%',
      }}
    >
      <ColumnWrapper
        sx={{
          flex: '1 1 50%',
          maxWidth: '50%',
          minWidth: '300px',
        }}
      >
        <Controller
          control={control}
          name={controllerName}
          render={({ field: { ref, ...field } }) => (
            <Input
              value={getValues(controllerName as any)}
              {...field}
              inputRef={ref}
              label={label}
              type="area"
              placeholder={placeholder}
              InputProps={{
                placeholder,
                sx: {
                  height: '250px',
                  minHeight: '250px',
                  resize: 'vertical',
                },
              }}
              disabled={viewOnly || isBusinessResponse}
              minRows={2}
              sx={{ width: '100%' }}
              containerSx={{ width: '100%' }}
            />
          )}
        />
      </ColumnWrapper>

      <ColumnWrapper
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          flex: '1 1 50%',
          gap: '12px',
          maxWidth: '50%',
          minWidth: '300px',
          mt: 1,
          padding: '16px',
        }}
      >
        <ColumnWrapper
          sx={{
            '& .MuiTypography-root': {
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
            },
            gap: '8px',
            height: '255px',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          {sectionComments[section].length > 0 ? (
            sectionComments[section].map((comment, commentIndex) => (
              <RowWrapper
                key={commentIndex}
                sx={{
                  '& .MuiBox-root': {
                    width: '100%',
                  },
                  alignItems: 'flex-start',
                  backgroundColor: '#E8F4F8',
                  border: '1px solid #B3D9E8',
                  borderRadius: '8px',
                  gap: '8px',
                  padding: '12px',
                  width: '100%',
                }}
              >
                <ColumnWrapper
                  sx={{
                    flex: 1,
                    gap: '4px',
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  <TextStyle variant="body3" weight={600}>
                    {comment.commentedBy}
                  </TextStyle>
                  <TextStyle
                    variant="body4"
                    sx={{

                      overflowWrap: 'break-word',

                      whiteSpace: 'pre-wrap',
                      width: '100%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {comment.commentText}
                  </TextStyle>
                </ColumnWrapper>

                {!viewOnly && (
                  <IconButton
                    onClick={() => handleDeleteComment(section, commentIndex)}
                    iconName="delete"
                    isDisabled={viewOnly}
                    sx={{
                      flexShrink: 0,
                      mt: '0px',
                    }}
                  />
                )}
              </RowWrapper>
            ))
          ) : (
            <RowWrapper
              sx={{
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                border: '1px dashed #ddd',
                borderRadius: '8px',
                height: '100%',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <TextStyle variant="body4" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Tidak ada komentar
              </TextStyle>
            </RowWrapper>
          )}
        </ColumnWrapper>

        <RowWrapper
          sx={{
            borderBottom: '2px solid #C9C5C6',
            margin: '8px 0',
            width: '100%',
          }}
        />

        <ColumnWrapper sx={{ gap: '8px', marginTop: '8px', width: '100%' }}>
          <TextStyle variant="body3" weight={500}>
            Komentar
          </TextStyle>
          <RowWrapper
            sx={{
              alignItems: 'flex-end',
              flexWrap: 'nowrap',
              gap: '8px',
              width: '100%',
            }}
          >
            <Input
              value={newComments[section]}
              onChange={(e: any) => {
                const value = e?.target?.value ?? e;
                handleNewCommentChange(section, typeof value === 'string' ? value : '');
              }}
              placeholder="Input Komentar"
              type="area"
              InputProps={{
                placeholder: 'Input Komentar',
                sx: {
                  width: '100%',
                },
              }}
              disabled={viewOnly || isBusinessResponse}
              rows={2}
              sx={{
                flex: 1,
                minWidth: '200px',
                width: '100%',
              }}
              containerSx={{
                flex: 1,
                width: '100%',
              }}
            />
            <Button
              onClick={() => handleAddComment(section)}
              startIcon="add"
              disabled={viewOnly || isBusinessResponse || !newComments[section].trim()}
              sx={{
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Send
            </Button>
          </RowWrapper>
        </ColumnWrapper>
      </ColumnWrapper>
    </RowWrapper>
  );

  return (
    <>
      <ColumnWrapper sx={{ gap: '16px', width: '100%' }}>
        {renderSectionWithComments(
          'actionDescription',
          `descriptionList.${index}.actionDescription`,
          'Deskripsi Tindakan Perbaikan',
          'Input deskripsi tindakan perbaikan',
        )}

        {renderSectionWithComments('parameter', `descriptionList.${index}.parameter`, 'Parameter', 'Input Parameter')}

        {renderSectionWithComments(
          'targetFullfillment',
          `descriptionList.${index}.targetFullfillment`,
          'Target Waktu Pemenuhan',
          'Input Target Waktu Pemenuhan',
        )}

        <ColumnWrapper sx={{ width: '100%' }}>
          <TextStyle variant="body4" weight={500} sx={{ mb: 2 }}>
            Grade
          </TextStyle>
          <RowWrapper sx={{ alignItems: 'center', gap: '16px', width: '100%' }}>
            <Controller
              control={control}
              name={`descriptionList.${index}.grade`}
              render={({ field: { ref, ...field } }) => (
                <Input
                  value={getValues(`descriptionList.${index}.grade`)}
                  {...field}
                  inputRef={ref}
                  type="dropdown"
                  sx={{ flexGrow: 1 }}
                  dropdownList={moduleListGrade}
                  placeholder="Input Grade"
                  InputProps={{
                    placeholder: 'Input Grade',
                    sx: { width: '8vw' },
                  }}
                  disabled={viewOnly || isBusinessResponse}
                  rows={5}
                />
              )}
            />
            <TextStyle sx={{ flexGrow: 1 }} variant="body4" weight={500} color={theme.palette.text.secondary}>
              {gradeDescription}
            </TextStyle>
          </RowWrapper>
        </ColumnWrapper>
      </ColumnWrapper>

      {isBusinessResponse && (
        <ColumnWrapper sx={{ width: '100%' }}>
          <Text>Tanggapan Bisnis</Text>
          <WordEditor
            id={`businessResponse-${index}`}
            container={container}
            setContainer={setContainer}
            initialValue={fields?.[index]?.businessResponse}
            isReadOnly={viewOnly || !isBusinessResponse}
          />
        </ColumnWrapper>
      )}
    </>
  );
};

export default DescriptionForm;
