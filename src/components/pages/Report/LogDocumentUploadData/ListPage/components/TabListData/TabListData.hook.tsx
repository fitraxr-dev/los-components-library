'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLogDocumentUploadData from '@/hooks/services/report/log-document-upload-data/useGenerateReportExcelLogDocumentUploadData';
import useGenerateReportPDFLogDocumentUploadData from '@/hooks/services/report/log-document-upload-data/useGenerateReportPDFLogDocumentUploadData';
import useGetDataReportLogDocumentUploadData from '@/hooks/services/report/log-document-upload-data/useGetDataReportLogDocumentUploadData';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type {
  MultipleAutocompleteOption,
} from '@/components/shared/Input/components/Search/components/MultipleAutoComplete/MultipleAutoComplete.types';
import type { TableHeader } from '@/components/shared/TableV2/Table.types';
import type { DocumentGroupParamRequestDtoDocumentCategoryEnum } from '@/services/openapi/bucket-document-service';


type SortState = {
  sort: string;
  order: 'asc' | 'desc';
};

const makeSortableColumn = (
  key: string,
  label: string,
  minWidth: string,
  { sort, order }: SortState,
  handleSort: (field: string) => void,
  type?: TableHeader['type'],
): TableHeader => ({
  isSortable: true,
  key,
  label,
  onSort: () => handleSort(key),
  sortDirection: sort === key ? order : false,
  sx: { minWidth },
  type,
});

const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [sort, setSort] = useState('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { recordActivity } = useRecordLog();
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [kategoriDokumen, setKategoriDokumen] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [groupDokumen, setGroupDokumen] = useState<any>(null);
  const [keywordDocumentGroup, setKeywordDocumentGroup] = useState('');
  const [keywordDocumentType, setKeywordDocumentType] = useState('');
  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.REPORT_LOG_DOCUMENT_UPLOAD_DOWNLOAD);

  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c: any) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));
  const { data: kategoriDokumenOptions } = useGetParameterList('documentGroup');
  const { data: documentStatusOptions } = useGetParameterList('docStatusUpload');
  // const kategoriDokumenOptions = [
  //   { id: 'FINANCING_DOCUMENT', label: 'Dokumen Pembiayaan', value: 'FINANCING_DOCUMENT' },
  //   { id: 'SUPPORTING_DOCUMENT', label: 'Supporting Document', value: 'SUPPORTING_DOCUMENT' },
  // ];

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: documentCategory as DocumentGroupParamRequestDtoDocumentCategoryEnum,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: keywordDocumentGroup,
      },
    },
    { enabled: !!documentCategory }
  );
  const documentGroupOptions: AutocompleteOption[] = documentGroupData ?? [];

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: groupDokumen?.id,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: keywordDocumentType,
      },
    },
    { enabled: !!groupDokumen?.id }
  );
  const documentTypeOptions: MultipleAutocompleteOption[] = (documentTypeData ?? []).map((d) => ({
    label: d.label,
    value: d.id?.toString() || '',
  }));

  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLogDocumentUploadData(
    searchParams !== null ? {
      filter: {
        ...searchParams,
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      sortList: {
        columnName: sort,
        sortType: order,
      },
    } : null
  );

  const isLoading = isFetching;

  useEffect(() => {
    if (data?.page) {
      setTotalPage(data.page.totalPage > 0 ? data.page.totalPage : 1);
    }
  }, [data, searchParams]);

  useEffect(() => {
    if (isReset) {
      setTotalPage(1);
      setIsReset(false);
    }
  }, [isReset]);

  const handleSort = (key: string) => {
    if (key === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setOrder('asc');
    }
    setPage(1);
  };

  const { mutate: generateExcel } = useGenerateReportExcelLogDocumentUploadData({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report log document upload data',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLogDocumentUploadData({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download pdf report log document upload data',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application No', '10vw', sortState, handleSort),
    makeSortableColumn('idProcess', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('kategori', 'Kategori', '10vw', sortState, handleSort),
    makeSortableColumn('groupDokumen', 'Group Dokumen', '10vw', sortState, handleSort),
    makeSortableColumn('jenisDokumen', 'Jenis Dokumen', '10vw', sortState, handleSort),
    makeSortableColumn('namaDokumen', 'Nama Dokumen', '10vw', sortState, handleSort),
    makeSortableColumn('nomorDokumen', 'Nomor Dokumen', '10vw', sortState, handleSort),
    makeSortableColumn('versioning', 'Versioning', '10vw', sortState, handleSort),
    makeSortableColumn('tanggalDokumen', 'Tanggal Dokumen', '10vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('uploadedBy', 'Uploaded By', '10vw', sortState, handleSort),
    makeSortableColumn('uploadedDate', 'Uploaded Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('divisi', 'Divisi', '10vw', sortState, handleSort),
    makeSortableColumn('documentStatus', 'Document Status', '10vw', sortState, handleSort),
    makeSortableColumn('documentStorage', 'Document Storage', '10vw', sortState, handleSort),
  ];

  const handleKategoriDokumenChange = (value: string) => {
    setKategoriDokumen(value);
    setDocumentCategory(value);
    setGroupDokumen(null);
    setKeywordDocumentGroup('');
    setKeywordDocumentType('');
  };

  const handleGroupDokumenChange = (value: any) => {
    setGroupDokumen(value);
    setKeywordDocumentType('');
  };

  const handleClear = () => {
    setKategoriDokumen('');
    setDocumentCategory('');
    setGroupDokumen(null);
    setKeywordDocumentGroup('');
    setKeywordDocumentType('');
    setSearchParams(null);
    setPage(1);
    setTotalPage(1);
    setIsReset(true);
  };

  const handleSearch = (params: any) => {

    const { groupDokumen, jenisDokumen, documentStatus, ...restParams } = params;

    const jenisDokumenLabels = Array.isArray(jenisDokumen)
      ? jenisDokumen.map((id: string) => documentTypeOptions.find((opt) => opt.value === id)?.label || id)
      : jenisDokumen;

    const documentStatusLabels = Array.isArray(documentStatus)
      ? documentStatus.map((id: string) => documentStatusOptions?.find((opt: any) => opt.value === id)?.label || id)
      : documentStatus;

    setSearchParams({
      ...restParams,
      documentStatus: documentStatusLabels,
      groupDokumen: groupDokumen?.id || '',
      jenisDokumen: jenisDokumenLabels,
      uploadDate: params?.uploadDate ? formatDate(params?.uploadDate, 'YYYY-MM-DD') : '',
    });
    setPage(1);
    setIsReset(false);
  };

  const handleDownloadExcel = () => generateExcel(searchParams || {});
  const handleDownloadPDF = () => generatePDF(searchParams || {});

  const handleDivisionSearch = (value: string) => {
    if (value.length >= 3) {
      setDivisionSearchValue(value);
    } else {
      setDivisionSearchValue('');
    }
  };

  return {
    canDownloadFile,
    customerOptions,
    data,
    divisionOptions,
    documentGroupOptions,
    documentStatusOptions,
    documentTypeOptions,
    groupDokumen,
    handleClear,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleGroupDokumenChange,
    handleKategoriDokumenChange,
    handleSearch,
    isFetchDocumentGroupLoading,
    isLoading,
    isLoadingCustomerNames,
    isLoadingDivisions,
    isLoadingDocumentType: isFetchDocumentTypeLoading,
    kategoriDokumen,
    kategoriDokumenOptions,
    keywordDocumentGroup,
    keywordDocumentType,
    page,
    searchParams,
    setGroupDokumen,
    setKategoriDokumen,
    setKeywordDocumentGroup,
    setKeywordDocumentType,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
