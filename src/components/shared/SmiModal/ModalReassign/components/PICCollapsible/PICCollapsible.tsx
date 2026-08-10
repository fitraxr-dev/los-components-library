import { Box, Checkbox, InputAdornment, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Switch from '@/components/shared/Switch';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ReassignToForm from '../ReassignToForm';

import usePICCollapsible from './PICCollapsible.hook';

import type { PICCollapsibleProps } from './PICCollapsible.types';


const PICCollapsible = (props: PICCollapsibleProps) => {
  const {
    picData,
    picList,
    useFormValues,
    selectedTaskReassign,
    setSelectedTaskReassign,
    divisionId,
    position,
    isRiviewAssign = false,
    isMonitoring = false,
  } = props;

  const theme = useTheme();
  const { isReAssignTo, setIsReAssignTo, getSectionTitle } = usePICCollapsible(props);

  return (
    <SectionTitle
      title={getSectionTitle()}
      isOpen={true}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          <Input
            label="Nama"
            placeholder="Choose Nama"
            value={picData.name}
            isMandatory
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                </InputAdornment>
              ),
            }}
          />
          <Input
            label="Jabatan"
            placeholder="Jabatan"
            value={picData.jobPositionLabel}
            disabled
          />
          <Input
            label="Direktorat"
            placeholder="Choose Direktorat"
            value={picData.directorateLabel}
            disabled
          />
          <Input
            label="Divisi"
            placeholder="Choose Divisi"
            value={picData.divisionLabel}
            disabled
          />
        </Box>
        {!isMonitoring &&
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: theme.spacing(1),
            }}
          >
            <Checkbox
              color="primary"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
                padding: 0,
              }}
              disabled
              checked={picData.isLeader}
            />

            <TextStyle
              variant="body2"
              weight={600}
              color={theme.palette.disabled.main}
            >
              Leader PIC
            </TextStyle>
          </Box>
        }
        <ColumnWrapper gap={theme.spacing(3)}>
          <RowWrapper gap={theme.spacing(1)} alignItems="center">
            <Title title="Re-assign to" />
            <Switch
              checked={isReAssignTo}
              onChange={() => setIsReAssignTo(!isReAssignTo)}
            />
          </RowWrapper>
          {isReAssignTo && (
            <ReassignToForm
              divisionId={divisionId}
              picData={picData}
              picList={picList}
              useFormValues={useFormValues}
              selectedTaskReassign={selectedTaskReassign}
              setSelectedTaskReassign={setSelectedTaskReassign}
              position={position}
              isRiviewAssign={isRiviewAssign}
              isMonitoring={isMonitoring}
            />
          )}
        </ColumnWrapper>
      </ColumnWrapper>
    </SectionTitle>
  );
};

export default PICCollapsible;
