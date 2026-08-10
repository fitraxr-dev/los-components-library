'use client';


import { Box, Tooltip } from '@mui/material';
import parse from 'html-react-parser';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TableSubmission from '../components/TableSubmission';
import TableSubmissionFacility from '../components/TableSubmissionFacility';
import TableSubmissionHistory from '../components/TableSubmissionHistory';

import usePkProcessingMonitoring from './PkProcessingTypeMonitoring.hook';

import type { PkProcessingProps } from '../PK.types';


const PkProcessingTypeMonitoring = ({ isLegalSigning = false, ...props }: PkProcessingProps) => {
  const {
    handleButton,
    actionButtons,
    warningBoxMassage,
    isSubmitedDisabled,
    theme,
  } = usePkProcessingMonitoring({ isLegalSigning, ...props });


  const renderActionButtons = () => {
    if (!actionButtons) {
      return null;
    }
    // const buttonOrder = ['NEXT'];
    const buttonOrder = isLegalSigning ? ['NEXT'] : ['DECLINE', 'CANCELED', 'RETURN_TO_TL', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER', 'NEXT', 'APPROVE', 'SUBMIT'];
    const entries = Object.entries(actionButtons);

    const reorderEntries = (entries, order) => {
      return order
        .map((orderItem) => entries.find((entry) => entry[0] === orderItem))
        .filter((entry) => entry !== undefined);
    };

    const reorderedEntries = reorderEntries(entries, buttonOrder);

    return reorderedEntries.map(([key, value]) => {
      return handleButton(key, value);
    });
  };

  return (
    <ColumnWrapper>
      <RowWrapper
        gap={2}
      >
        <Title title="Pengajuan Perikatan" />
        {
          isSubmitedDisabled &&
          <Tooltip
            title={
              <Box
                sx={{
                  margin: '-10px 0 -10px -10px',
                }}
              >
                <TextStyle
                  variant="body6"
                >
                  {parse(warningBoxMassage)}
                </TextStyle>
              </Box>
            }
            placement="right"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                },
              },
            }}
          >
            <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
              <Icon iconName="new-info" />
            </Box>
          </Tooltip>
        }
      </RowWrapper>
      <TableSubmission
        {...props}
        isLegalSigning={isLegalSigning}
      />
      <TableSubmissionFacility />
      <TableSubmissionHistory />
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default PkProcessingTypeMonitoring;
