import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


const BankInformationTable = ({ methods, index, isDisabled, formKey, handleDeleteItem }: any) => {
  const { control, watch, formState: { errors } } = methods;

  return (
    <RowWrapper
      key={formKey}
      sx={{
        alignItems: 'center',
        alignsmiRepresentative: 'start',
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
      }}
    >
      <TextStyle
        variant="body4"
        weight={500}
        color="text.secondary"
        marginRight={2}
      >
        {index + 1}.
      </TextStyle>

      {/* Bank / Lembaga Keuangan Field */}
      <Controller
        name={`bankInformationList.${index}.bankName`}
        control={control}
        render={({ field: { ref, onChange, value, ...field } }) => (
          <Input
            {...field}
            inputRef={ref}
            containerSx={{ flex: 1 }}
            type="text"
            label="Bank / Lembaga Keuangan"
            placeholder="Input Bank / Lembaga Keuangan"
            //isMandatory={!isDisabled}
            disabled={isDisabled}
            value={value}
            onChange={(e) => onChange(e)}
            //error={!!errors.bankInformationList?.[index]?.bankName}
            //helperText={errors.bankInformationList?.[index]?.bankName?.message || null}
          />
        )}
      />

      {/* Amount (Porsi Sindikasi) Field */}
      <Controller
        name={`bankInformationList.${index}.amount`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            containerSx={{ flex: 1 }}
            type="number"
            label="Amount (Porsi Sindikasi)"
            placeholder="Input Amount (Porsi Sindikasi)"
            disabled={isDisabled}
            //isMandatory={!isDisabled}
            onValueChange={(value) => {
              if (typeof value === 'string' && /^\d*$/.test(value)) {
                field.onChange(value);
              }
            }}
            //error={!!errors.bankInformationList?.[index]?.amount}
            //helperText={errors.bankInformationList?.[index]?.amount?.message || null}
          />
        )}
      />

      {!isDisabled && (
        <ColumnWrapper sx={{ height: '100%', justifyContent: 'end' }}>
          {watch('bankInformationList').length > 1 ?
            <IconButton
              sx={{ height: '64.4%' }}
              iconName="delete"
              isDisabled={isDisabled}
              onClick={() => handleDeleteItem(index)}
            /> : null}
          {!!errors.bankInformationList?.[index]?.bankName
              || !!errors.bankInformationList?.[index]?.amount ? <Box sx={{ height: '18%' }} /> : null}
        </ColumnWrapper>
      )}
    </RowWrapper>
  );
};
export default BankInformationTable;
