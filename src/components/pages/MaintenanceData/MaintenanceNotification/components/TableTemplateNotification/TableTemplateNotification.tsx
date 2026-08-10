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
import useGetDetailMaintenanceNotification from '../../DetailPage/hooks/useGetDetailMaintenanceNotification';
import useGetDetailMaintenanceNotificationBucket from '../../DetailPage/hooks/useGetDetailMaintenanceNotificationBucket';

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

interface TableTemplateNotificationProps {
  disabledForm: boolean;
  isNotificationActive: boolean;
  onNotificationActiveChange: (active: boolean) => void;
  onFooterEmptyChange?: (isEmpty: boolean) => void;
  followUpContainer: any;
  setFollowUpContainer: Dispatch<SetStateAction<any>>;
  action: string;
}

const TableTemplateNotification = ({
  disabledForm,
  isNotificationActive,
  onNotificationActiveChange,
  onFooterEmptyChange,
  followUpContainer,
  setFollowUpContainer,
  action,
}: TableTemplateNotificationProps) => {

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

  // const { data: followUpData, isLoading, isError } = useGetDetailMaintenanceNotification(payload);
  const bucketResult = useGetDetailMaintenanceNotificationBucket(payload);
  const normalResult = useGetDetailMaintenanceNotification(payload);

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
  // cek is null pada saat initial value wordeditor
  useEffect(() => {
    const hasText = sfdtHasText(followUpData?.content?.messageContent);
    onFooterEmptyChange?.(!hasText);
  }, [followUpData?.content?.messageContent, onFooterEmptyChange]);


  // Trigger ulang validasi untuk field yang tergantung isNotificationActive
  useEffect(() => {
    onNotificationActiveChange(isNotificationActive);
  }, [isNotificationActive, onNotificationActiveChange]);

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
            rules={!isDisabled && isNotificationActive ? { required: 'Tanggal Pengiriman wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                placeholder="Input tanggal mulai"
                label="Pilih tanggal mulai kapan pengiriman Notification dilakukan"
                isMandatory={!isDisabled && isNotificationActive}
                disabled={!isNotificationActive || isDisabled}
              />
            )}
          />

          <Controller
            control={control}
            // disabled={isDisabled}
            name="tableGroup.startTime"
            rules={!isDisabled && isNotificationActive ? { required: 'Waktu Pengiriman wajib diisi' } : {}}
            render={({ field }) => (
              <Input
                {...field}
                type="time"
                placeholder="Input waktu mulai"
                label="Pilih waktu mulai kapan pengiriman Notification dilakukan"
                isMandatory={!isDisabled && isNotificationActive}
                disabled={!isNotificationActive || isDisabled}
              />
            )}
          />
        </Box>

        {/* Row 3: Full width */}
        <Controller
          control={control}
          disabled={isDisabled}
          name="tableGroup.templateLosTitle"
          rules={!isDisabled ? { required: 'Title Email wajib diisi' } : {}}
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              placeholder="Input Title Email"
              label="Notification Title"
              isMandatory={!isDisabled}
            />
          )}
        />
        <Controller
          control={control}
          disabled={isDisabled}
          name="tableGroup.templateLosMessage"
          rules={!isDisabled ? { required: 'Message Email wajib diisi' } : {}}
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              placeholder="Input Message Email"
              label="Notification Message"
              isMandatory={!isDisabled}
            />
          )}
        />
        <Controller
          control={control}
          disabled={isDisabled}
          name="tableGroup.messageSubject"
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

        {/* Row 5: Full width WordEditor */}
        <TextStyle
          variant="body4"
          weight={600}
          color={isDisabled ? 'gray' : 'black'}
        >
          Body Email
          {!isDisabled && (
            <span style={{ color: 'red', marginLeft: 4 }}>*</span>
          )}
        </TextStyle>

        {/* <h3>footer: {followUpData?.content.notificationFooter}</h3> */}
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
          initialValue={ handleValue (followUpData?.content?.messageContent)}
          enableTrackChanges={false}
          setIsWordEditorEmpty={setIsWordEditorEmpty}

        /> */}

        <WordEditor
          id="footerForm"
          container={followUpContainer}
          setContainer={setFollowUpContainer}
          isReadOnly={isDisabled}
          initialValue={handleValue(followUpData?.content?.messageContent)}
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

export default TableTemplateNotification;
