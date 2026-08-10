import Input from '@mui/material/Input';

// component ini buat apa ya?

const InputType = (props: {type: 'text' | 'dropdown' | 'password';
  label: string;
  onChange: (val: any) => void;
  value: string;
  dropdown?: Array<{label: string;value: string}>;
  disabled?: boolean;
}) => {
  const { type, label, onChange, value, dropdown, disabled } = props;
  return (
    <>
      <Input
        type={type}
        label={label}
        placeholder={label === 'Last Login Date' ? '' : (type === 'dropdown' ? 'Pilih Salah Satu ' : 'Masukkan ' + label)}
        containerSx={{ 'svg': { 'color': '#333333' }, width: '100%' }}
        onChange={(e) => onChange(e)}
        value={value}
        dropdownList={dropdown}
        disabled={disabled}
      />
    </>
  );
};

export default InputType;
