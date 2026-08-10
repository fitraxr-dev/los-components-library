import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DTI_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { engagementSubmission, legalSigning } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import { toDateStringNumber } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import useDeleteProcessingType from '../../hooks/useDeleteProcessingType';
import useGetListProcessingType from '../../hooks/useGetListProcessingType';
import { MODALPK } from '../../PK.constants';

import type { PkProcessingProps } from '../../PK.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { SubmitRequestDto } from '@/services/openapi/processor-service';


interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  status: number;
  permissions?: Array<{ id: string; label: string; status: number }>;
  subMenu?: MenuItem[];
}

/**
 * Collect all accessible paths from nested menu structure
 * Only collect paths where status === 1 (user has access)
 */
const collectPathsFromMenu = (menu: MenuItem[]): string[] => {
  const result: string[] = [];

  const traverse = (items: MenuItem[]) => {
    for (const item of items) {
      if (item.path && item.status === 1) {
        result.push(item.path);
      }
      if (item.subMenu) {
        traverse(item.subMenu);
      }
    }
  };

  traverse(menu);
  return result;
};

/**
 * Check if user has access to the given path
 * @returns true if user has access, false otherwise
 */
const checkHasAccess = (path: string): boolean => {
  try {
    const accessMenuData = localStorage.getItem('accessMenu');

    if (!accessMenuData) {
      return false;
    }

    const menuData: MenuItem[] = JSON.parse(accessMenuData);

    if (!Array.isArray(menuData)) {
      return false;
    }

    const allPaths = collectPathsFromMenu(menuData);

    return allPaths.some((accessPath) => {
      if (accessPath === '/') {
        return path === accessPath;
      }
      return path.startsWith(accessPath);
    });
  } catch (error) {
    console.error('Error checking access page:', error);
    return false;
  }
};

const useTableSubmission = ({ module, isLegalSigning }: PkProcessingProps) => {
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const currentPath = usePathname();
  const router = useCustomRouter();
  const [appState] = useApp();
  const divisionUser = appState?.userData?.user?.accessManagementActive?.userDivision?.divisionCode;
  const isMaker = appState?.currentRole.includes('MAKER');
  const isChecker = appState?.currentRole.includes('CHECKER');
  const isSuperAdmin = isMaker || isChecker;

  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
    DTI_DIVISION
  ];


  const isDivisiBisnis = divisiBisnisArray.includes(divisionUser);
  const {
    parentId,
    processId,
    setChildId,
  } = useIdentity();

  const { data, isFetching: isLoading } = useGetListProcessingType(
    {
      bucketProcessId: isLegalSigning ? parentId : processId,
      module,
      process: TypeProcess.PROCESSING_TYPE_PK,
    }
  );

  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
      queryClient.invalidateQueries({ queryKey: ['pk-processing-type-list']});
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const formatDesc = (list: string[]) => {
    const mainItems = new Set([
      'BUNGA',
      'AVAILABILITY_PERIOD',
      'JANGKA_WAKTU',
      'GRACE_PERIOD',
      'PLAFOND',
      'FEE'
    ]);

    if (!list?.length) {
      return '-';
    }

    const formattedOutput = [];
    let hasOther = false;
    let otherText = '';

    for (let i = 0; i < list.length; i++) {
      const rawItem = list[i];
      const formattedItem = rawItem
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

      if (mainItems.has(rawItem)) {
        formattedOutput.push(formattedItem);
      }
      else if (rawItem === 'OTHER') {
        hasOther = true;
      }
      else {
        otherText = rawItem;
      }
    }

    if (hasOther) {
      if (otherText) {
        formattedOutput.push(`Other - ${otherText}`);
      } else {
        formattedOutput.push('Other');
      }
    }

    return formattedOutput.length > 0 ? formattedOutput.join(', ') : '-';
  };

  const getTableActionPkProcessingType = (row: any) => {
    if (row?.status === 'ASK_FOR_INFO' || row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_TL' || row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_KADIV') {
      const isPK = processId.includes('PK');
      if (
        // divisionUser.includes('BUSINESS') ||
        ((appState?.currentRole?.includes('KADIV')) && row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_KADIV') ||
        ((appState?.currentRole?.includes('TL')) && row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_TL') ||
        ((appState?.currentRole?.includes('STAFF')) && row?.status === 'ASK_FOR_INFO' && isDivisiBisnis)) {
        return [
          { iconName: 'edit', onClick: (data) => handleEdit(data?.id, data?.bucketProcessId) },
          { iconName: 'close-circle', onClick: (data) => handleDeclineRow(data?.bucketProcessId, data?.pkName) },
        ];
      } else if (
        // superAdmin ||
        (isSuperAdmin && (
          row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_KADIV' ||
          row?.status === 'PK_WAITING_ASK_FOR_INFO_APPROVAL_TL' ||
          row?.status === 'ASK_FOR_INFO')
          && isDivisiBisnis && isPK)) {
        return [
          { iconName: 'edit', onClick: (data) => handleEdit(data?.id, data?.bucketProcessId) },
          { iconName: 'close-circle', onClick: (data) => handleDeclineRow(data?.bucketProcessId, data?.pkName) },
        ];
      } else {
        return [
          { iconName: 'edit', onClick: (data) => handleEdit(data?.id, data?.bucketProcessId) },
        ];
      }
    }

    if (viewOnly || row?.status === 'PKPT_COMPLETED' || row?.status === 'CANCELED' || row?.status === 'REJECTED') {
      return [
        { iconName: 'detail', onClick: (data) => handleDetail(data?.id, data?.bucketProcessId) },
      ];
    }

    if (isLegalSigning) {
      return [
        { iconName: 'edit', onClick: (data) => handleEdit(data?.id, data?.bucketProcessId) },
      ];
    }

    return [
      { iconName: 'edit', onClick: (data) => handleEdit(data?.id, data?.bucketProcessId) },
      { iconName: 'delete', onClick: (data) => handleDelete(data) },
    ];
  };

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'pkName',
      label: 'Nama PK',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'signingConditions',
      label: 'Syarat Penandatanganan',
      render: (row) => (
        <TextStyle>
          {
            row.signingConditions === '-' || row.signingConditions === null
              ? '-'
              : row.signingConditions
                ? 'Ya'
                : 'Tidak'
          }
        </TextStyle>
      ),
      sx: { minWidth: '15vw' },
    },
    {
      key: 'effectiveConditions',
      label: 'Syarat Efektif',
      render: (row) => (
        <TextStyle>
          {
            row.effectiveConditions === '-' || row.effectiveConditions === null
              ? '-'
              : row.effectiveConditions
                ? 'Ya'
                : 'Tidak'
          }
        </TextStyle>
      ),
      sx: { minWidth: '15vw' },
    },
    {
      key: 'pkNumber',
      label: 'No PK/No Adendum',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'pkDate',
      label: 'Tanggal PK/Adendum',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'effectiveDate',
      label: 'Tanggal Efektif',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'description',
      label: 'Deskripsi',
      render: (row) => (
        <TextStyle>
          {row.description ? row?.description.replace(/_/g, ' ') : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '14vw' },
    },
    {
      key: 'nonCommercialDescription',
      label: 'Keterangan Deskripsi',
      render: (row) => {
        const isCommercial = row.description === 'KOMERSIAL';
        const displayValue = isCommercial
          ? formatDesc(row?.commercialDescription)
          : row?.nonCommercialDescription || '-';

        return (
          <TextStyle variant="body4">
            {displayValue}
          </TextStyle>
        );
      },
      sx: { minWidth: '14vw' },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ borderRadius: '12px', px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row.statusLabel ?? '-'}
        </Button>
      ),
      sx: { minWidth: '14vw' },
    },
    {
      key: 'descriptionInformation',
      label: 'Keterangan',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: getTableActionPkProcessingType,
      sx: { minWidth: '7.5vw' },
      type: 'action',
    },
  ];

  const contentDataList = data?.contents?.map((process) => ({
    ...process,
    effectiveConditions: process.effectiveConditions ?? '-',
    effectiveDate: process.effectiveDate ? toDateStringNumber(process.effectiveDate) : '-',
    pkDate: process.pkDate ? toDateStringNumber(process.pkDate) : '-',
    pkName: process.pkName.split('-')[0] ?? '-',
    pkNumber: process.pkNumber ?? '-',
    signingConditions: process.signingConditions ?? '-',
  }));

  const { mutate: deletePk } = useDeleteProcessingType({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const handleEdit = (dataId: number, idPKChild: string) => {
    if (dataId) {
      setChildId(idPKChild);
      const pkPath = engagementSubmission.PK_PROCESSING_DETIAL_PAGE;
      const legalSigningPath = legalSigning.PK_PROCESSING_DETAIL_PAGE;
      const lastPathName = getLastPath(isLegalSigning ? legalSigningPath : pkPath);
      const destinationUrl = `${currentPath}/${dataId}/${lastPathName}`;
      router.push(destinationUrl);
    }
  };

  const handleDeclineRow = (bucketProcessId: string, pkName: string) => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: radioValue,
            bucketProcessId: bucketProcessId,
            comment,
            module: module,
            process: TypeProcess.PROCESSING_TYPE_PK,
          };

          submitBucket({ submitRequestDto: payload });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCELED' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
        title: `Decline ${pkName}`,
      },
    );
  };

  const handleDetail = (dataId: number, idPKChild: string) => {
    if (dataId) {
      setChildId(idPKChild);
      const pkPath = engagementSubmission.PK_PROCESSING_DETIAL_PAGE;
      const legalSigningPath = legalSigning.PK_PROCESSING_DETAIL_PAGE;
      const lastPathName = getLastPath(isLegalSigning ? legalSigningPath : pkPath);
      const destinationUrl = `${currentPath}/${dataId}/${lastPathName}`;

      const hasAccess = checkHasAccess(destinationUrl);
      const finalUrl = hasAccess ? destinationUrl : setPreviewPage(destinationUrl);

      router.push(finalUrl);
    }
  };

  const handleDelete = async (rowData: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deletePk({
        bucketParentId: rowData.bucketParentId,
        bucketProcessId: rowData.bucketProcessId,
        id: rowData.id,
      }),
      submitText: 'Ya',
      title: `Apakah anda yakin untuk menghapus data PK/Addendum ${rowData.pkName} ?`,
      type: 'warning',
    });
  };

  const handleOpenAddModal = () => {
    NiceModal.show(MODALPK.NEW_PROCESSING_TYPE);
  };

  const anomalyRow = (val: any) => {
    if (val?.isNotCompleted === true)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };

  return {
    anomalyRow,
    contentDataList,
    handleOpenAddModal,
    isLegalSigning,
    isLoading,
    tableHeader,
    viewOnly,
  };
};

export default useTableSubmission;
