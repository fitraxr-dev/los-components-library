import { useMemo } from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Checkbox,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';


type DivisionRoleSelectorProps = {
  data: {
    divisionCode: string;
    divisionName: string;
    roles: { positionCode: string; positionName: string; selected: boolean }[];
  }[];
  onToggleDivision: (division: string, selected: boolean) => void;
  onToggleRole: (division: string, role: string, selected: boolean) => void;
  onDeleteDivision: (division: string) => void;
  isDisabled?: boolean;
  divisionOptions?: { label: string; value: string }[];
};

export const DivisionRoleSelector = ({
  data,
  onToggleDivision,
  onToggleRole,
  onDeleteDivision,
  isDisabled = false,
  divisionOptions = [],
}: DivisionRoleSelectorProps) => {

  const theme = useTheme();

  const divisionMap = useMemo(() => {
    return divisionOptions.reduce((acc, cur) => {
      acc[cur.value] = cur.label;
      return acc;
    }, {} as Record<string, string>);
  }, [divisionOptions]);

  return (
    <Box sx={{ mx: 'auto', width: '80%' }}>
      {data.map((div) => {
        const totalRoles = div.roles.length;
        const selectedCount = div.roles.filter((r) => r.selected).length;

        const isSelected = selectedCount === totalRoles;
        const isIndeterminate = selectedCount > 0 && selectedCount < totalRoles;

        return (
          <Box key={div.divisionCode} sx={{ mb: 4 }}>
            {/* Row Divisi */}
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: theme.palette.custom.blueGray,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                display: 'flex',
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Checkbox
                  checked={isSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onToggleDivision(div.divisionCode, e.target.checked)}
                  disabled={isDisabled}
                />
                <Typography variant="subtitle2" color="#284A63">{divisionMap[div.divisionCode] || div.divisionCode}</Typography>
              </Box>
              <IconButton
                color="error"
                size="small"
                onClick={() => onDeleteDivision(div.divisionCode)}
                disabled={isDisabled}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            {/* Roles */}
            {div.roles.map((role) => (
              <Box key={role.positionCode}>
                <Divider />
                <Box sx={{ alignItems: 'center', display: 'flex', pl: 4, py: 1 }}>
                  <Checkbox
                    checked={role.selected}
                    onChange={(e) =>
                      onToggleRole(div.divisionCode, role.positionCode, e.target.checked)
                    }
                    disabled={isDisabled}
                  />
                  <Typography variant="subtitle2">{role.positionName}</Typography>
                </Box>
              </Box>
            ))}
            <Divider />
          </Box>
        );
      })}
    </Box>
  );
};
