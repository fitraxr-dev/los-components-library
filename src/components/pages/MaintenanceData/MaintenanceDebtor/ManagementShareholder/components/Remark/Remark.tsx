import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import type { FieldArrayCoBorrowerProps } from './Remark.types';


const Remark = ({ control, viewOnly }: FieldArrayCoBorrowerProps) => {

  return (
    <RowWrapper sx={{ py: 4 }}>
      <Controller
        control={control}
        name="remark"
        render={({ field: { ref, ...field }, fieldState: { invalid, isTouched, error } }) => (
          <Input
            {...field}
            inputRef={ref}
            type="area"
            label="Keterangan"
            placeholder="Input keterangan"
            disabled={viewOnly}
            containerSx={{ flex: 1 }}
            error={isTouched && invalid}
            helperText={
              isTouched && error ? error.message : ''
            }
          />
        )}
      />
    </RowWrapper>
  );
};

export default Remark;
