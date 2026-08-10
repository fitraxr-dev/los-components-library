'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

import { roles } from '@/configs/constants';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

// import { useDetailPage } from '../../DetailPage/DetailPage.hooks';
import useGetDetailMaintenanceReminder from '../../DetailPage/hooks/useGetDetailMaintenanceReminder';
import useGetDetailMaintenanceReminderBucket from '../../DetailPage/hooks/useGetDetailMaintenanceReminderBucket';

import type { Dispatch, SetStateAction } from 'react';


// cek is null pada saat initial value wordeditor
function sfdtHasText(sfdtString?: string): boolean {
  if (!sfdtString) return false;
  try {
    const parsed = JSON.parse(sfdtString);
    return parsed?.sections?.some((section) =>
      section.blocks?.some((block) =>
        block.inlines?.some((inline) => inline.text && inline.text.trim() !== '')
      )
    ) ?? false;
  } catch {
    return false;
  }
}

interface TableTemplateReminderProps {
  disabledForm: boolean;
  isReminderActive: boolean;
  onReminderActiveChange: (active: boolean) => void;
  onFooterEmptyChange?: (isEmpty: boolean) => void;
  followUpContainer: any;
  setFollowUpContainer: Dispatch<SetStateAction<any>>;
  action: string;
}

const TableTemplateReminder = ({
  disabledForm,
  isReminderActive,
  onReminderActiveChange,
  onFooterEmptyChange,
  followUpContainer,
  setFollowUpContainer,
  action,
}: TableTemplateReminderProps) => {

  const theme = useTheme();
  const isDisabled = disabledForm;

  const { control, setValue, watch, trigger, clearErrors, register } = useFormContext();

  // Word Editor cek null
  // State peta “kosong per editor id” (WordEditor akan mengisi ini)
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState<Record<string, boolean>>({});
  // Propagasikan nilai kosong untuk editor dengan id "footerForm" ke parent
  useEffect(() => {
    const empty = isWordEditorEmpty['footerForm'] ?? true;
    onFooterEmptyChange?.(empty);
  }, [isWordEditorEmpty, onFooterEmptyChange]);
  // Optional: set nilai awal segera setelah container siap (sebelum user mengetik)
  useEffect(() => {
    if (followUpContainer?.documentEditor) {
      const empty = followUpContainer.documentEditor.isDocumentEmpty ?? true;
      onFooterEmptyChange?.(empty);
    }
  }, [followUpContainer, onFooterEmptyChange]);

  const params = useParams();
  const searchParams = useSearchParams();
  const idFromUrl = params.id as string;
  const payload = {
    id: idFromUrl,
  };

  // const { data: followUpData, isLoading, isError } = useGetDetailMaintenanceReminder(payload);
  const bucketResult = useGetDetailMaintenanceReminderBucket(payload);
  const normalResult = useGetDetailMaintenanceReminder(payload);

  const { data: followUpData } = action === 'detail-from-approval' || action === 'edit' ? bucketResult : normalResult;

  useEffect(() => {
    console.log('onFooterEmptyChange: ', onFooterEmptyChange);
  }, [onFooterEmptyChange]);

  // Cek initial data api
  function isValidSfdtString(str) {
    if (typeof str !== 'string') return false;
    try {
      const parsed = JSON.parse(str);
      return parsed && typeof parsed === 'object' && 'sfdt' in parsed;
    } catch {
      return false;
    }
  }

  // cek apakah sfdt
  // function handleValue(value: string) {
  // // cek apakah value diawali dengan {"sfdt":" dan diakhiri dengan "}
  //   const startsWithSfdt = value.startsWith('{"sfdt":"');
  //   const endsWithQuote = value.endsWith('"}');

  //   if (startsWithSfdt && endsWithQuote) {
  //     return value; // langsung return value
  //   } else {
  //     return safeInitialValue(value); // panggil fungsi safeInitialValue
  //   }
  // }
  function handleValue(value?: string) {
    if (typeof value !== 'string') return safeInitialValue(value);

    if (value.startsWith('{"sfdt":"') && value.endsWith('"}')) {
      return value;
    }
    return safeInitialValue(value);
  }


  // bisa menampilkan value string tapi gabisa dihapus
  function safeInitialValue(value) {
    try {
      let sfdt;

      // Cek apakah ini sudah SFDT
      if (typeof value === 'string' && value.trim().startsWith('{')) {
        try {
          sfdt = JSON.parse(value);
        } catch {
          sfdt = null;
        }
      }

      // Kalau bukan SFDT → buat SFDT polos
      if (!sfdt || !sfdt.sections) {
        return JSON.stringify({
          characterFormat: {},
          lists: [],
          paragraphFormat: {},
          sections: [{
            blocks: [{
              characterFormat: {},
              inlines: value ? [{ text: String(value) }] : [],
              paragraphFormat: {},
            }],
          }],
          styles: [],
        });
      }

      // Kalau sudah SFDT → hapus revision metadata & track changes
      if (sfdt.revisions) delete sfdt.revisions;
      if (sfdt.comments) delete sfdt.comments;
      sfdt.isTrackChangesEnabled = false;

      // Bersihkan revisionIds di seluruh inlines
      sfdt.sections.forEach((section) => {
        section.blocks?.forEach((block) => {
          block.inlines?.forEach((inline) => {
            delete inline.revisionIds;
          });
        });
      });

      return JSON.stringify(sfdt);
    } catch (err) {
      console.error('safeInitialValue error:', err);
      return JSON.stringify({
        characterFormat: {},
        lists: [],
        paragraphFormat: {},
        sections: [{
          blocks: [{
            characterFormat: {},
            inlines: value ? [{ text: String(value) }] : [],
            paragraphFormat: {},
          }],
        }],
        styles: [],
      });
    }
  }

  // cek is null pada saat initial value wordeditor
  useEffect(() => {
    const hasText = sfdtHasText(followUpData?.content?.reminderFooter);
    onFooterEmptyChange?.(!hasText);
  }, [followUpData?.content?.reminderFooter, onFooterEmptyChange]);


  // validasi day berdasarkan reminder type
  const scheduleType = watch('tableGroup.scheduleType');
  const prevScheduleTypeRef = useRef(scheduleType);

  useEffect(() => {
    // Cek perubahan tipe
    if (scheduleType !== prevScheduleTypeRef.current) {
      if (scheduleType === 'daily') {
        setValue('tableGroup.day', null);
        setValue('tableGroup.date', null);
        clearErrors('tableGroup.day');
      } else if (scheduleType === 'weekly') {
        setValue('tableGroup.date', null);
      } else if (scheduleType === 'monthly') {
        setValue('tableGroup.day', null);
      }
    }

    // Update tipe sebelumnya
    prevScheduleTypeRef.current = scheduleType;
  }, [scheduleType, setValue, clearErrors]);


  // Trigger ulang validasi untuk field yang tergantung isReminderActive
  useEffect(() => {
    onReminderActiveChange(isReminderActive);
  }, [isReminderActive, onReminderActiveChange]);

  return (
    <>
      <ColumnWrapper
        sx={{
          boxShadow: 0,
          gap: theme.spacing(3),
          maxWidth: '100%',
          my: theme.spacing(3),
        }}
        px={3}
      >

        {/* Row 1: 3 Columns */}
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.scheduleType"
            rules={!isDisabled ? { required: 'Schedule Type wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Schedule Type"
                type="dropdown"
                label="Schedule Type"
                isMandatory={!isDisabled}
                dropdownList={[
                  { label: 'Harian', value: 'daily' },
                  { label: 'Mingguan', value: 'weekly' },
                  { label: 'Bulanan', value: 'monthly' },
                ]}
              />
            )}
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.time"
            rules={!isDisabled ? { required: 'Waktu wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Input Waktu"
                type="time"
                label="Pilih Waktu"
                isMandatory={!isDisabled}
              />
            )}
          />

          {scheduleType === 'weekly' && (
            <Controller
              control={control}
              disabled={isDisabled}
              name="tableGroup.day"
              rules={!isDisabled && scheduleType === 'weekly' ? { required: 'Hari wajib diisi' } : {}}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Input Hari"
                  type="dropdown"
                  label="Pilih Hari"
                  isMandatory={!isDisabled}
                  dropdownList={[
                    { label: 'Senin', value: 'Monday' },
                    { label: 'Selasa', value: 'Tuesday' },
                    { label: 'Rabu', value: 'Wednesday' },
                    { label: 'Kamis', value: 'Thursday' },
                    { label: 'Jumat', value: 'Friday' },
                    { label: 'Sabtu', value: 'Saturday' },
                    { label: 'Minggu', value: 'Sunday' },
                  ]}
                />
              )}
            />
          )}

          {scheduleType === 'monthly' && (
            <Controller
              control={control}
              disabled={isDisabled}
              name="tableGroup.date"
              rules={!isDisabled && scheduleType === 'monthly' ? { required: 'Tanggal wajib diisi' } : {}}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Pilih Tanggal"
                  type="date"
                  label="Pilih Tanggal"
                  isMandatory={!isDisabled}
                />
              )}
            />
          )}


        </Box>

        {/* Row 2: 2 Columns */}
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            // disabled={isDisabled}
            name="tableGroup.startDate"
            rules={!isDisabled && isReminderActive ? { required: 'Tanggal Pengiriman wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                placeholder="Input tanggal mulai"
                label="Pilih tanggal mulai kapan pengiriman Reminder dilakukan"
                isMandatory={!isDisabled && isReminderActive}
                disabled={!isReminderActive || isDisabled}
              />
            )}
          />

          <Controller
            control={control}
            // disabled={isDisabled}
            name="tableGroup.startTime"
            rules={!isDisabled && isReminderActive ? { required: 'Waktu Pengiriman wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                type="time"
                placeholder="Input waktu mulai"
                label="Pilih waktu mulai kapan pengiriman Reminder dilakukan"
                isMandatory={!isDisabled && isReminderActive}
                disabled={!isReminderActive || isDisabled}
              />
            )}
          />
        </Box>

        {/* Row 3: Full width */}
        <Controller
          control={control}
          disabled={isDisabled}
          name="tableGroup.reminderSubject"
          rules={!isDisabled ? { required: 'Subject Email wajib diisi' } : {}}
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              placeholder="Input Subject Email"
              label="Subject Email"
              isMandatory={!isDisabled}
            />
          )}
        />

        {/* Row 4: Full width */}
        <Controller
          control={control}
          disabled={isDisabled}
          name="tableGroup.reminderHeader"
          rules={!isDisabled ? { required: 'Header Email wajib diisi' } : {}}
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              placeholder="Input Header Email"
              label="Header Email"
              isMandatory={!isDisabled}
            />
          )}
        />

        {/* Row 5: Full width WordEditor */}
        <TextStyle
          variant="body4"
          weight={600}
          color={isDisabled ? 'gray' : 'black'}
        >
          Footer Email
          {!isDisabled && (
            <span style={{ color: 'red', marginLeft: 4 }}>*</span>
          )}
        </TextStyle>

        {/* <h3>footer: {followUpData?.content.reminderFooter}</h3> */}
        {/* <WordEditor
          id="footerForm"
          container={followUpContainer}
          setContainer={setFollowUpContainer}
          isReadOnly={isDisabled}
          // pake ini jika data masih menggunakan string bukan sfdt atau base64
          // initialValue = { safeInitialValue(followUpData?.content?.reminderFooter) }

          // pake ini jika data menggunakan sfdt atau base64
          // initialValue={followUpData?.content?.reminderFooter}

          // sementara fix
          initialValue={ handleValue (followUpData?.content?.reminderFooter)}
          enableTrackChanges={false}
          setIsWordEditorEmpty={setIsWordEditorEmpty}

        /> */}

        <WordEditor
          id="footerForm"
          container={followUpContainer}
          setContainer={setFollowUpContainer}
          isReadOnly={isDisabled}
          initialValue={handleValue(followUpData?.content?.reminderFooter)}
          enableTrackChanges={false}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
          onContentChange={(e) => {
            const sfdt = e.source.documentEditor.serialize();
            setValue('tableGroup.footer', sfdt, { shouldDirty: true });
          }}
        />


      </ColumnWrapper>
    </>

  );
};

export default TableTemplateReminder;
