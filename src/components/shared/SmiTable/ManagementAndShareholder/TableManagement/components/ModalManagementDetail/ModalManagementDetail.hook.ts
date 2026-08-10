import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetManagement from '../../hooks/useGetManagement';

import { DETAIL_MANAGEMENT_CREDIT_CHECKING_DATA, INITIAL_VALUES } from './ModalManagementDetail.constants';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const usePopupManagementDetail = (id: number, module: string) => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  let payload;
  if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      managementId: id,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
    };
  } else {
    payload = { id };
  }

  const { data: {
    listDocuments, managementList,
  }, isSuccess: isGetDetailSuccess } = useGetManagement(payload, module);
  const [managementDetail, setManagementDetail] = useState(INITIAL_VALUES);

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.MANAGEMENTDOCRESULT,
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;

  let filteredCreditCheckingManagementData = DETAIL_MANAGEMENT_CREDIT_CHECKING_DATA;

  useEffect(() => {
    if (isGetDetailSuccess && managementList) {
      const npwp = listDocuments?.find((item) => item.documentType.includes('NPWP'));
      const nik = listDocuments?.find((item) => item.documentType.includes('KTP'));
      setManagementDetail({
        dob: managementList?.dob ?? null,
        jobPosition: managementList?.jobPosition,
        name: managementList?.name,
        nik: managementList?.nik,
        nikFile: {
          extension: nik?.documentExtension,
          url: nik?.document,
          value: nik?.document ? npwp?.fileName : '-',
        },
        npwp: managementList?.npwp,
        npwpFile: {
          extension: npwp?.documentExtension,
          url: npwp?.document,
          value: nik?.document ? npwp?.fileName : '-',
        },
      });
    }
  }, [managementList, isGetDetailSuccess]);

  const cellData = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'jobPositionLabel',
      label: 'Jabatan',
    },
    {
      key: 'nik',
      label: 'NIK',
    },
    {
      key: 'npwpFile',
      label: 'Document NPWP',
    },
    {
      key: 'npwp',
      label: 'NPWP',
    },
    {
      key: 'nikFile',
      label: 'Document NIK',
    },
    {
      key: 'dob',
      label: 'DOB',
    }];

  const cellDataWithDetail = cellData.map((item) => {
    let url = '';
    let value = managementList?.[item.key] ?? '-';
    let data;
    let documentExtension;
    let extension;
    let fileName;
    let id;
    if (item.key === 'npwpFile') {
      const document = listDocuments.find((el) => el.documentType.includes('NPWP'));

      data = document,
      documentExtension = document?.documentExtension,
      extension = ' ',
      fileName = document?.documentName,
      id = document?.id,
      value = document?.document ? document?.fileName : '-';
      url = document?.document;

    }

    if (item.key === 'nikFile') {
      const document = listDocuments.find((el) => el.documentType.includes('KTP'));

      data = document,
      documentExtension = document?.documentExtension,
      extension = ' ',
      fileName = document?.documentName,
      id = document?.id,
      value = document?.document ? document?.fileName : '-';
      url = document?.document;

    }

    if (item.key === 'dob') {

      // Parse the string using dayjs
      const parsedDate = dayjs(managementList?.dob);

      // Format the date as needed
      const formattedDate = parsedDate.format('DD-MM-YYYY');
      value = managementList?.dob ? formattedDate : '-',
      url = '';
    }

    return {
      ...item,
      data,
      documentExtension,
      extension,
      fileName,
      id,
      url,
      value,
    };
  });


  const detailManagementCreditChecking = filteredCreditCheckingManagementData.map((item) => {
    if (managementList) {
      const { key } = item;
      let label = item.label;
      let value = managementList[item.key];
      let sx = item.sx;
      return {
        key,
        label,
        sx,
        value,
      };

    } else {
      return item;
    }
  });

  const { mutate: setWatermark, isPending: isSetWatermarkLoading } = usePreviewWatermark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: downloadWatermark, isPending: isDownloadWatermarkLoading } = useDownloadWatermark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    }, onSuccess: (data) => {
      window.open(data?.data?.content, '_self');
    },
  });

  const handleOpenWatermarkModal = (data, action) => {
    const email = JSON.parse(localStorage.getItem('app-context-persist')).userData.user.email;
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: ({ watermark }) => {
        if (watermark) {
          watermark = encodeURI(watermark);
        }
        if (action === 'download') {
          downloadWatermark({
            ...data,
            watermark: watermark,
          });
        } else {
          setWatermark({
            ...data,
            watermark: watermark,
          });
        }
      },
    });
  };

  return {
    cellDataWithDetail,
    detailManagementCreditChecking,
    documentContents,
    documentPage,
    handleOpenWatermarkModal,
    managementList,
    setItemPerPage,
    setNoPage,
  };
};
