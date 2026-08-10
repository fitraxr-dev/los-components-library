import { useMemo, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { DocumentTypeRequest } from '@/enums/DocumentTypeRequest';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoOwnershipEnum } from '@/services/openapi/bucket-document-service';


import { PREVIEW_FORMAT } from '@/components/shared/SmiTable/ViewAllDocument/constants';


import useGetListNameDocExisting from './hooks/useGetListNameDocExisting';
import useSaveExistingBulk from './hooks/useSaveExistingBulk';
import {
  modal,
  pathDocumentParentListApuppt,
  TABLE_HEADER_MODAL_UPLOAD_DOCUMENT_EXISTING,
} from './ModalUploadDocumentExisting.constants';

import type { ModalUploadDocumentExistingProps } from './ModalUploadDocumentExisting.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalUploadDocumentExisting = (props: ModalUploadDocumentExistingProps) => {
  const { module, process, blacklist, documentCategory } = props;
  const modalId = modal.MODAL_UPLOAD_DOCUMENT_EXISTING;
  const { processId, debtorId } = useIdentity();
  const pathName = usePathname();
  const params = useSearchParams();
  const [namaDocument, setNamaDocument] = useState([]);
  const [kategoriDocument, setKategoriDocument] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [blckList, setBlckList] = useState(blacklist || []);

  const categoryDocList = useGetParameterList('documentGroup', { id: 'key', label: 'value1' });
  const { data: namaDocumentList } = useGetListNameDocExisting({
    filter: {
      bucketProcessId: processId,
      debtorId,
      documentParent: props.documentParent,
      // module: props.module,
      multiDocsCategories: kategoriDocument?.length >= 1 && kategoriDocument?.map((res) => res?.id).join('|'),
      ownership: props.ownership,
      // process: props.process,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  }, { enabled: !!kategoriDocument?.length });

  useMemo(() => {
    if (categoryDocList.isSuccess && categoryDocList.data?.length > 0) {
      const selectedDocumentCategory = categoryDocList.data?.filter((item) => {
        return props.documentCategory?.some((res) => res === item?.id);
      });
      setKategoriDocument(selectedDocumentCategory);
    }
  }, [categoryDocList.data]);

  const { isPending: isSaveLoading, mutate: saveBulkDoc } = useSaveExistingBulk({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);
          setKategoriDocument([]);
          setNamaDocument([]);
          setTableData([]);
          setBlckList([]);
        },
        title: 'Data berhasil disimpan', type: 'success',
      });
    },
  });


  const checkOwnerIdAndDocParent = () => {
    let ownerId;
    let documentParent;
    let ownership;
    const pathDocumentParent = pathDocumentParentListApuppt.find((item) => item?.path === pathName?.split('/')[5])?.documentParent;

    switch (process) {
      case TypeProcess.APU_PPT:
        ownerId = params.get('ownerId');
        documentParent = 'DOCUMENT_APU_PPT';
        if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE && !!ownerId) {
          ownership = DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE;
        } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER) {
          ownership = DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER;
        } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR) {
          ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR;
        } else {
          ownership = DocumentTypeRequestDtoOwnershipEnum.ADDITIONALDOCUMENT;
        }
        break;
      case TypeProcess.APU_PPT_DPOP:
        ownership = pathDocumentParent;
        ownerId = params.get('ownerId');
        documentParent = 'DOCUMENT_APU_PPT';
        break;
      case TypeProcess.TECHNICAL_REVIEW:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEW;
        break;
      case TypeProcess.TECHNICAL_REVIEW_DELST:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEWDELST;
        break;
      case TypeProcess.LPA:
        ownership = DocumentTypeRequestDtoOwnershipEnum.LPA;
        break;
      case TypeProcess.LPA_REVIEW:
        ownership = DocumentTypeRequestDtoOwnershipEnum.LPAREVIEW;
        break;
      case TypeProcess.MIP:
        ownership = DocumentTypeRequestDtoOwnershipEnum.MIP;
        break;
      case TypeProcess.MIP_REVIEW:
        ownership = DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW;
        break;
      case TypeProcess.MIP_ANALYST:
        ownership = DocumentTypeRequestDtoOwnershipEnum.MIPANALYST;
        break;
      case TypeProcess.MUP:
        ownership = DocumentTypeRequestDtoOwnershipEnum.MUP;
        break;
      case TypeProcess.MUP_ANALYST:
        ownership = DocumentTypeRequestDtoOwnershipEnum.MUPANALYST;
        break;
      case TypeProcess.BAR:
        ownership = DocumentTypeRequestDtoOwnershipEnum.BAR;
        break;
      case TypeProcess.RISALAH_RAPAT:
        ownership = DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT;
        break;
      case TypeProcess.REVIEWER_DK:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDK;
        break;
      case TypeProcess.REVIEWER_DH:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDH;
        break;
      case TypeProcess.REVIEWER_DEPI:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDEPI;
        break;
      case TypeProcess.REVIEWER_DELST:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDELST;
        break;
      case TypeProcess.LEGAL_SIGNING:
        ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
        break;
      case TypeProcess.HIGH_RISK_DK:
        ownership = DocumentTypeRequest.HIGH_RISK_CONCLUSION;
        break;
      case TypeProcess.CREDIT_CHECKING:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
        break;
      case TypeProcess.CREDIT_CHECKING_DPOP:
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
        break;
      case TypeProcess.SPFP:
        documentParent = DocumentTypeRequestDtoOwnershipEnum.OFFERINGLETTER;
        ownership = DocumentTypeRequestDtoOwnershipEnum.SPFP;
        break;
      case TypeProcess.SPDP:
      case TypeProcess.SPFP_FINAL:
        ownership = DocumentTypeRequestDtoOwnershipEnum.SPFP;
        break;
      default:
        ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
        break;
    }

    return {
      documentParent,
      ownerId,
      ownership,
    };
  };


  const handleOnSave = () => {
    const { documentParent, ownerId, ownership } = checkOwnerIdAndDocParent();
    const ids = tableData?.map((res) => res?.id);
    const payload = {
      bucketProcessId: processId,
      debtorId,
      documentIds: ids,
      documentParent: props?.documentParent ? props?.documentParent : documentParent,
      module,
      ownerId,
      ownership,
      process,
    };
    saveBulkDoc(payload);
  };


  const handleOnAdd = () => {
    const listIds = namaDocument?.map((res) => res?.id);
    setTableData((prevState) => ([
      ...prevState,
      ...namaDocument
    ]));
    setBlckList((prevState) => ([
      ...prevState,
      ...listIds
    ]));
    setNamaDocument([]);
    if (props.documentCategory?.length > 0) {
      const selectedDocumentCategory = categoryDocList.data?.filter((item) => {
        return props.documentCategory?.some((res) => res === item?.id);
      });
      setKategoriDocument(selectedDocumentCategory);
    } else {
      setKategoriDocument([]);
    }
  };


  const getDropdownListFiltered = () => {
    const documentListBlacklistFiltered = namaDocumentList?.filter(
      (obj) =>
        !blckList?.some(
          (id) => id === obj.id
        )
    );
    if (!!namaDocumentList) {
      const documentTypeDropdownListFiltered = documentListBlacklistFiltered.filter(
        (obj) => {
          const newId = namaDocument?.find((res) => res?.id === obj?.id)?.id;
          return obj?.id !== newId;
        });

      return documentTypeDropdownListFiltered;
    }
    return [];
  };

  const handleDelete = (id) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const filteredVal = tableData.filter((item) => item?.id !== id);
        const filteredBlacklist = blckList?.filter((item) => item !== id);
        setBlckList(filteredBlacklist);
        setTableData(filteredVal);
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data??',
      type: 'warning',
    });

  };


  const tableHeaderModalUploadExisting: Array<TableHeader> = [
    ...TABLE_HEADER_MODAL_UPLOAD_DOCUMENT_EXISTING,
    {
      key: 'action',
      label: 'Action',
      options: (row) => {
        let list = [
          {
            iconName: 'delete',
            onClick: (row) => handleDelete(row?.id),
          },
        ];
        if (PREVIEW_FORMAT.includes(row?.documentExtension?.toLowerCase())) {
          list.push(
            {
              iconName: 'preview-document',
              onClick: (data) =>
                window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
            }
          );
        }
        return list;
      },
      sx: { width: '10%' },
      type: 'action',
    },
  ];


  const handleCloseModal = () => {
    closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT_EXISTING);

  };

  return {
    categoryDocList,
    getDropdownListFiltered,
    handleCloseModal,
    handleOnAdd,
    handleOnSave,
    isSaveLoading,
    kategoriDocument,
    namaDocument,
    setKategoriDocument,
    setNamaDocument,
    tableData,
    tableHeaderModalUploadExisting,
  };
};

export default useModalUploadDocumentExisting;
