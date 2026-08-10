import React from 'react';

import { useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import useTableOtherBank from './TableOtherBank.hook';


const TableOtherBank = () => {
  const formMethods = useFormContext();
  const theme = useTheme();

  const {
    bankNameDropdownList,
    bankTypeDropdownList,
    fieldArray,
    handleChangeTypeOtherBank,
    setBankNameKeyword,
    handleSelectedBankValue,
    handleChangeBank,
  } = useTableOtherBank();

  return (
    <ColumnWrapper>
      <TextStyle variant="body2" weight={700} color={theme.palette.primary.main}>
        Bank Lainnya
      </TextStyle>
      <Table
        tableHeader={[
          {
            key: 'bankType',
            label: 'Jenis Kreditur',
            render: (_, idx) => (
              <Controller
                control={formMethods.control}
                name={`otherBank.${idx}.bankType`}
                render={({ field: { value, onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    label=""
                    placeholder="Choose Jenis Kreditur"
                    dropdownList={bankTypeDropdownList.map((item) => ({
                      ...item,
                      id: item.value,
                      label: item.label,
                    }))}
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      fieldArray.update(idx, {
                        bank: formMethods.watch(`otherBank.${idx}.bank`),
                        bankType: {
                          id: val.id,
                          label: val.label,
                        },
                      });
                      handleChangeTypeOtherBank(val);
                      formMethods.setValue(`otherBank.${idx}.bank`, null);
                    }}
                  />
                )}
              />
            ),
            sx: {
              minWidth: '20vw',
            },
          },
          {
            key: 'bank',
            label: 'Bank',
            render: (_, idx) => (
              <Controller
                control={formMethods.control}
                name={`otherBank.${idx}.bank`}
                render={({ field: { value, onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    label=""
                    placeholder="Choose Bank"
                    disabled={!formMethods.watch(`otherBank.${idx}.bankType`)}
                    value={value}
                    onChange={(val) => {
                      console.log('masuk');
                      onChange(val);
                      fieldArray.update(idx, {
                        bank: {
                          id: val.id,
                          label: val.label,
                        },
                        bankType: formMethods.watch(`otherBank.${idx}.bankType`),
                      });
                      handleSelectedBankValue(value?.id, String(val.id));
                      handleChangeBank(formMethods.watch(`otherBank.${idx}.bankType`));
                    }}
                    onInputChange={(val) => setBankNameKeyword(val)}
                    dropdownList={bankNameDropdownList.map((item) => ({
                      ...item,
                      id: item.value,
                      label: item.label,
                    }))}
                  />
                )}
              />
            ),
            sx: {
              minWidth: '20vw',
            },
          },
          {
            key: 'action',
            options: [
              {
                iconName: 'delete',
                onClick: (_, idx) => fieldArray.remove(idx),
              }
            ],
            sx: {
              width: '3vw',
            },
            type: 'action',
          }
        ]}
        tableData={fieldArray.fields || []}
        footer={
          <TableFooter
            title="Add Row"
            onClick={() => fieldArray.append({ bank: null, bankType: null })}
          />
        }
      />
    </ColumnWrapper>
  );
};

export default TableOtherBank;
