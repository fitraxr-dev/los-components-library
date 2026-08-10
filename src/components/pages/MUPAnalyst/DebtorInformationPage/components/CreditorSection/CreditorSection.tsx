import { useMemo } from 'react';

import { Box } from '@mui/material';

import Autocomplete from '@/components/shared/Autocomplete';
import Input from '@/components/shared/Input';

import useCreditorSection from './CreditorSection.hook';


const CreditorSection = (props) => {
  const { index, disabled = false } = props;
  const {
    state,
    setState,
    creditorListByModule,
    dataType,
    primaryCreditorType,
  } = useCreditorSection(props);

  const selectedCreditor = useMemo(() => {
    const creditorName = state?.creditorName || '';
    const creditorNameLabel = state?.creditorNameLabel || '';

    if (!creditorName) return null;

    return creditorListByModule?.find((val) => val.id === creditorName) || {
      id: creditorName,
      label: creditorNameLabel,
    };
  }, [state?.creditorName, state?.creditorNameLabel, creditorListByModule]);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: 'repeat(2,1fr)',
      }}
    >
      <Input
        type="dropdown"
        dropdownList={dataType}
        placeholder="Choose Jenis Kreditur"
        onChange={(e) => {
          setState({
            creditorName: '',
            creditorNameLabel: '',
            creditorType: e,
          });
        }}
        containerSx={{ flex: 1 }}
        value={primaryCreditorType}
        id={`dropdwon-type-${index}`}
        disabled={disabled}
      />

      <Autocomplete
        id={`autocomplete-row-${index}`}
        testId="autocomplete"
        dropdownList={creditorListByModule}
        placeholder="Input Nama Kreditur"
        label=""
        onChange={(e) => {
          const option = e ?? { id: '', label: '' };
          setState({
            creditorName: option.id,
            creditorNameLabel: option.label,
          });
        }}
        value={selectedCreditor}
        disabled={disabled}
      />
    </Box>
  );
};

export default CreditorSection;
