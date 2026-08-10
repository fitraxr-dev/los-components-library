import { Controller } from 'react-hook-form';

import useViewOnly from '@/hooks/useViewOnly';

import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import type { Control } from 'react-hook-form';


type FieldArrayCoBorrowerProps = {
  control: Control<{ remark: string }, any>;
};

const Remark = ({ control }: FieldArrayCoBorrowerProps) => {
  const { viewOnly } = useViewOnly();

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
            rows={4}
          />
        )}
      />
    </RowWrapper>
  );
};

export default Remark;
