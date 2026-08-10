import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateToUtc } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { parsePhoneFields } from '@/hooks/useParsePhoneNumber';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import TextStyle from '@/components/shared/TextStyle';

import useGetBmpk from '../../../MaintenanceGroup/hooks/useGetBmpk';
import useGetGroupById from '../../../MaintenanceGroup/hooks/useGetGroupById';
import useGetAllMemberById from '../../../MaintenanceGroup/hooks/useGetMemberById';
import useGetDebtorGroupMember from '../../../MaintenanceGroup/hooks/useGetMemberDebtorGroup';
import useGetIndividualDetail from '../../DebtorInformation/BmpkAndOther/hooks/useGetIndividualDetail';

import { groupInformationSchema, TableHeaderList } from './GroupInformationDetail.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useGroupInformationDetail = () => {

  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId } = useIdentity();
  const { groupId } = useParams();
  const [bucketProcessId, setBucketProcessId] = useState<string>('');
  const [pageMember, setPageMember] = useState(1);
  const [pageSizeMember, setPageSizeMember] = useState(10);
  const [filterMember, setFilterMember] = useState<SearchValue>({});

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer group information detail page',
    });
  }, []);

  const editPage = pathname.includes('MAI');


  // BMPK
  const [pageBMPK, setPageBMPK] = useState(1);
  const [pageSizeBMPK, setPageSizeBMPK] = useState(10);
  const [filterBMPK, setFilterBMPK] = useSessionStorage('filter-detail-bmppmonitoring-individual', null);

  const searchByOptionsBMPK = useGetParameterList('searchByIndividualMonitoring2', { label: 'value1', value: 'value2' });
  const sortByOptionsBMPK = useGetParameterList('sortByIndividualMonitoring2', { label: 'value1', value: 'value2' });

  const { data: bmpkList, isLoading: isLoadingBmpk } = useGetBmpk({
    filter: {
      ...filterBMPK?.filter,
      groupId: groupId as string,
    },
    page: {
      itemPerPage: pageSizeBMPK,
      noPage: pageBMPK,
    },
    searchDetail: filterBMPK?.searchDetail,
    sortList: filterBMPK?.sortList,
  }, { enabled: !!groupId }
  );

  const tableDataBmpk = bmpkList?.data?.contents;
  const lastUpdateDateBMPK = bmpkList?.data?.additionalData?.lastUpdate;
  const totalDataBMPK = bmpkList?.data?.page;

  const dataAsOfDateBMPK = useMemo(() => {
    return lastUpdateDateBMPK ? `${formatDateToUtc(new Date(lastUpdateDateBMPK), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [lastUpdateDateBMPK]);

  const handleViewDetailBMPP = (data) => {
    console.log('data', data);
    router.push(
      replacePath(
        maintenanceDebtor.DETAIL_GROUP_INFORMATION_BMPK_PAGE,
        {
          calculationId: data?.calculationId,
          debtorId: processId,
          groupId: groupId,
          module: processId ? 'master' : 'maintenance',
        }
      )
    );
  };


  const { control, handleSubmit, watch, setValue, reset } = useForm({
    context: 'groupInformation',
    mode: 'onChange',
    resolver: yupResolver(groupInformationSchema),
  });

  const { data: groupData } = useGetGroupById(
    {
      id: groupId as string,
    },
  );

  // Get Member Customer Group

  const { data: searchByOptions } = useGetParameterList('searchByGroupMember', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByGroupMember', { label: 'value1', value: 'value2' });
  const { data: institutionDropdownList } = useGetParameterList('institutionType');

  const filterDropdownListMember = searchByOptions;

  const filterContentListMember = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'institutionTypesKey',
      label: 'Institution Type',
      options: institutionDropdownList,
      type: 'multiple-autocomplete',
    }
  ];

  useEffect(() => {
    setPageMember(1);
  }, [filterMember]);

  const { data: groupMemberData, isLoading: isLoadingGroupMember } = useGetDebtorGroupMember(
    {
      filter: {
        ...filterMember?.filter,
        id: groupId as string,
        // debtorId: processId as string,
      },
      page: {
        itemPerPage: pageSizeMember,
        noPage: pageMember,
      },
      searchDetail: filterMember?.searchDetail ?? {},
      sortList: filterMember?.sortList ?? {},
    },
  );

  const gotoDetailPage = (id: string, isEdit: boolean = false, bucketProcessId: string = '') => {
    const url = replacePath(`${pathname}/${id}`, { processId });
    const finalUrl = isEdit ? `${url}?isEdit=true&bucketProcessId=${bucketProcessId}` : url;
    router.push(finalUrl);
  };

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Group Information', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/group-information` },
      { label: 'Detail Group', url: '' },
    ]);
  }, []);

  useEffect(() => {
    if (groupData?.data?.content) {
      try {
        let body = {};
        const fields = groupInformationSchema.fields;

        for (const key in fields.groupInformation.fields) {
          if (groupData?.data?.content[key] !== undefined) {
            if (key === 'lastModified') {
              body[key] = formatDateToUtc(new Date(groupData?.data?.content[key]), 'DD MMM YYYY, [Pukul] HH:mm:ss');
            } else {
              body[key] = groupData?.data?.content[key];
            }
          } else {
            body[key] = null;
          }
        }

        setBucketProcessId(groupData?.data?.content?.bucketProcessId);

        reset({
          groupInformation: body,
        });
      } catch (error) {
        console.error('Error setting form data:', error);
      }
    }

  }, [reset, groupData]);

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            console.log('data', data);
            gotoDetailPage(data?.debtorId);
          },
        },
        {
          iconName: 'edit',
          isHidden: !editPage,
          onClick: (data) => {
            console.log('data', data);
            gotoDetailPage(data?.debtorId, true, bucketProcessId);
          },
        }
      ],
      sx: {
        // minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  const tableHeaderBmpk: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
    },
    {
      key: 'percentage',
      label: 'Persentase',
      render(row) {
        return (
          <TextStyle variant="body4">
            {`${row?.percentage}% of ${row?.percentageThreshold}%`}
          </TextStyle>
        );
      },
    },
    {
      key: 'lastModified',
      label: 'Data as of',
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {handleViewDetailBMPP(row);},
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  const filterDropdownListBMPK = searchByOptionsBMPK.data;

  const filterContentListBMPK = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptionsBMPK.data,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Data as of',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'lastResult',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
      options: [
        { label: 'Ya', value: 'yes' },
        { label: 'Tidak', value: 'no' }
      ],
      type: 'dropdown',
    },
  ];

  return {
    control,
    dataAsOfDateBMPK,
    filterBMPK,
    filterContentListBMPK,
    filterContentListMember,
    filterDropdownListBMPK,
    filterDropdownListMember,
    filterMember,
    groupMemberData,
    isLoadingBmpk,
    isLoadingGroupMember,
    pageBMPK,
    pageMember,
    pageSizeMember,
    setFilterBMPK,
    setFilterMember,
    setPageBMPK,
    setPageMember,
    setPageSizeBMPK,
    setPageSizeMember,
    tableDataBmpk,
    tableHeaderBmpk,
    tableHeaderList,
    totalDataBMPK,
  };
};

export default useGroupInformationDetail;
