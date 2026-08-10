import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { CurrencyLOV } from '@/configs/constants/lov';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';

import Autocomplete from '@/components/shared/Autocomplete';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';


import { schema } from './InformasiSindikasiTab.schema';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const BankNameCell = ({ index, control }: { index: number; control: any }) => {
  const bankType = useWatch({
    control,
    name: `agentList.${index}.bankType`,
  });

  const { data: bankList } = useGetParameterList(bankType || '', {
    id: 'value2',
    label: 'value1',
  });

  return (
    <Controller
      name={`agentList.${index}.bankName`}
      control={control}
      render={({ field }) => (
        <Autocomplete
          placeholder="Choose Bank Name"
          dropdownList={bankList}
          value={field.value}
          onChange={(val) => { field.onChange(val); }}
        />
      )}
    />
  );
};

const KrediturNameCell = ({ index, control }: { index: number; control: any }) => {
  const jenisKreditur = useWatch({
    control,
    name: `krediturList.${index}.jenisKreditur`,
  });

  const { data: bankList } = useGetParameterList(jenisKreditur || '', {
    id: 'value2',
    label: 'value1',
  });

  return (
    <Box sx={{ flex: 2 }}>
      <Controller
        name={`krediturList.${index}.namaKreditur`}
        control={control}
        render={({ field }) => (
          <Autocomplete
            placeholder="Choose Nama Kreditur"
            dropdownList={bankList}
            value={field.value}
            onChange={(val) => { field.onChange(val); }}
          />
        )}
      />
    </Box>
  );
};

const useInformasiSindikasi = () => {
  const { recordActivity } = useRecordLog();
  const searchParams = useSearchParams();
  const params = useParams();
  const { id, processId } = params;

  const initialSectionFormat = {
    bottomMargin: 5.00,
    footerDistance: 0,
    headerDistance: 0,
    leftMargin: 5.00,
    pageHeight: 792,
    pageWidth: 447.30,
    rightMargin: 5.00,
    topMargin: 0.00,
  };

  const canEdit = searchParams.get('isEdit') === 'true';
  const isOrderType = searchParams.get('orderType');

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail manajemen fasilitas conventional informasi sindikasi',
    });
  }, []);

  const { data: typeOfFeeList } = useGetParameterList('typeOfFee');
  const { data: agentTypeList } = useGetParameterList('agentType');
  const { data: bankTypeList } = useGetParameterList('bankType', {
    label: 'value1',
    value: 'value2',
  });

  const methods = useFormContext();

  const watchFields = methods.watch();

  const { fields: krediturFields, append: appendKreditur, remove: removeKreditur } = useFieldArray({
    control: methods.control,
    name: 'krediturList',
  });

  const handleAddKrediturItem = () => {
    appendKreditur({ amount: null, jenisKreditur: '', namaKreditur: '' });
  };

  const handleDeleteKrediturItem = (index: number) => {
    removeKreditur(index);
  };

  const tableHeaderKreditur: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'creditur',
      label: 'Kreditur',
      render: (_: any, index: number) => (
        <Box display="flex" gap={2}>
          <Controller
            name={`krediturList.${index}.jenisKreditur`}
            control={methods.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Choose Jenis Kreditur"
                type="dropdown"
                dropdownList={bankTypeList}
                containerSx={{ flex: 1 }}
                onChange={(e) => {
                  field.onChange(e);
                  methods.setValue(`krediturList.${index}.namaKreditur`, null);
                }}
              />
            )}
          />
          <KrediturNameCell index={index} control={methods.control} />
        </Box>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (_: any, index: number) => (
        <Controller
          name={`krediturList.${index}.amount`}
          control={methods.control}
          render={({ field }) => (
            <Currency
              {...field}
              placeholder="Input Amount"
              onChange={(val) => {
                field.onChange(val);
              }}
              value={{
                currency: field.value?.currency || 'IDR',
                value: field.value?.value?.toString() || 0,
              }}
              currencyList={CurrencyLOV()}
            />
          )}
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteKrediturItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  const { fields: agentFields, append: appendAgent, remove: removeAgent } = useFieldArray({
    control: methods.control,
    name: 'agentList',
  });

  const handleAddAgentItem = () => {
    appendAgent({ agentType: '', bankName: null, bankType: '' });
  };

  const handleDeleteAgentItem = (index: number) => {
    removeAgent(index);
  };

  const tableHeaderAgent: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'agentType',
      label: 'Agent Type',
      render: (_: any, index: number) => (
        <Controller
          name={`agentList.${index}.agentType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Agent Type"
              type="dropdown"
              dropdownList={agentTypeList}
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'bankType',
      label: 'Bank Type',
      render: (_: any, index: number) => (
        <Controller
          name={`agentList.${index}.bankType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Bank Type"
              type="dropdown"
              dropdownList={bankTypeList}
              containerSx={{ flex: 1 }}
              onChange={(e) => {
                field.onChange(e);
                methods.setValue(`agentList.${index}.bankName`, null);
              }}
            />
          )}
        />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'bankName',
      label: 'Bank Name',
      render: (_: any, index: number) => (
        <BankNameCell index={index} control={methods.control} />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteAgentItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({
    control: methods.control,
    name: 'feeList',
  });

  const handleAddFeeItem = () => {
    appendFee({ feeType: '', nominal: null, remarks: '' });
  };

  const handleDeleteFeeItem = (index: number) => {
    removeFee(index);
  };

  const tableHeaderFee: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'feeType',
      label: 'Type of Fee',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.feeType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Type of Fee"
              type="dropdown"
              dropdownList={typeOfFeeList}
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
    },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.nominal`}
          control={methods.control}
          render={({ field }) => (
            <Currency
              {...field}
              placeholder="Input Nominal"
              onChange={(val) => {
                field.onChange(val);
              }}
              value={{
                currency: field.value?.currency || 'IDR',
                value: field.value?.value?.toString() || 0,
              }}
              currencyList={CurrencyLOV()}
            />
          )}
        />
      ),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.remarks`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Input Remarks"
              type="text"
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteFeeItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  return {
    agentFields,
    canEdit,
    feeFields,
    handleAddAgentItem,
    handleAddFeeItem,
    handleAddKrediturItem,
    initialSectionFormat,
    isOrderType,
    krediturFields,
    methods,
    tableHeaderAgent,
    tableHeaderFee,
    tableHeaderKreditur,
    watchFields,
  };
};
export default useInformasiSindikasi;
