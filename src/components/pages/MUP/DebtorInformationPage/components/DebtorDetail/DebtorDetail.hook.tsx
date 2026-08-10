import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDebtorDetail from '@/hooks/services/bucket/debtor/useGetDebtorDetail';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAccess } from '../../../hooks/useMUPAccess';
import useGetCreditor from '../../hooks/useGetCreditor';
import CreditorSection from '../CreditorSection/CreditorSection';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDebtorDetail = () => {

  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { isAnalyst } = useMUPAccess();
  const { viewOnly } = useViewOnly();
  const initialValue = [
    { creditorName: '', creditorType: '', module: '' }
  ];
  const [tableData, setTableData] = useState(undefined);

  const { data, pending: isDebtorDetailLoading } = useGetDebtorDetail({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { data: creditorData, isLoading: isCreditorLoading } = useGetCreditor({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  useEffect(() => {
    if (creditorData?.creditorType && creditorData?.creditorName) {
      const tempCreditorType = creditorData?.creditorType?.split('|');
      const tempCreditorName = creditorData?.creditorName?.split('|');
      const combinedArray = tempCreditorType?.map((value1, index) => {
        return {
          creditorName: tempCreditorName[index],
          creditorType: value1,
        };
      });
      const newValue = combinedArray?.map((val) => {
        return (
          {
            creditorName: val.creditorName,
            creditorType: val.creditorType,
          }
        );
      });
      setTableData(newValue);
    } else {
      setTableData(initialValue);
    }
  }, [creditorData]);

  const { reset, setValue } = useFormContext();
  const debtorDetail = data?.debtor;
  const isMunicipal = debtorDetail?.typeFinancing === 'MUNICIPAL_FINANCING';

  const performanceFinancialDate = data?.performanceFinancial?.performanceFinancialDate ?? '';

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  useEffect(() => {
    if (data)
      reset({
        controllingParty: bucketData?.controllingParty ?? '',
        eirr: bucketData?.eirr ?? '',
        performanceFinancial: {
          performanceFinancialDate,
        },
        technicalMeetingDate: bucketData?.technicalMeetingDate ?? '',
      });
  }, [data, bucketData, performanceFinancialDate]);


  useEffect(() => {
    const tempCreditorType = tableData?.map((val) => {
      return val.creditorType;
    });
    const tempCreditorName = tableData?.map((val) => {
      return val.creditorName;
    });
    setValue('creditorName', tempCreditorName?.join('|'));
    setValue('creditorType', tempCreditorType?.join('|'));
  }, [tableData]);

  const handleRemove = (removeIndex) => {
    recordActivity({
      activity: ActivityType.DELETE,
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `Delete creditor at index ${removeIndex}`,
    });
    setTableData((oldArray) => {
      return oldArray.filter((value, i) => i !== removeIndex);
    });
  };

  const handleChange = (rowIndex, param) => {
    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `Edit creditor at index ${rowIndex}`,
    });
    const updatedData = tableData?.map((item, index) =>
      index === rowIndex ? { ...item, ...param } : item
    );
    setTableData(updatedData);
  };

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '2vw',
      },
      type: 'index',
    },
    {
      key: '',
      label: 'Kreditur',
      render: (row, index) => {
        return (
          row ?
            <CreditorSection
              callback={handleChange}
              index={index}
              data={row}
              disabled={isAnalyst || viewOnly}
            /> : ''
        );
      },
      sx: {
        minWidth: '40vw',
      },
    },
    ...(isAnalyst || viewOnly ? [] : [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          onClick: (row, index) => {
            handleRemove(index);
          },
        }
      ],
      type: 'action' as const,
    }])
  ];

  return {
    debtorDetail,
    isAnalyst,
    isCreditorLoading,
    isDebtorDetailLoading,
    isMunicipal,
    setTableData,
    tableData,
    tableHeader,
  };
};

export default useDebtorDetail;
