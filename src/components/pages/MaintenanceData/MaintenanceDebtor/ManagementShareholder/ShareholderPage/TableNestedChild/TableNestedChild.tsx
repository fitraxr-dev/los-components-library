'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import {
  Checkbox,
  CircularProgress,
  Paper,
  TableCell,
  useTheme,
} from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import parse from 'html-react-parser';

import { MODAL as modalGlobal } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconTooltip from '@/components/shared/IconTooltip';
import Pagination from '@/components/shared/Pagination';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';


import useDeleteLevel from '../hooks/useDeleteLevel';
import ModalAddStructure from '../Structure/component/ModalAddStructure/ModalAddStructure';
import { GetAccessEdit, modal as MODAL } from '../Structure/Structure.constants';

import type { TableNestedChildProps } from './TableNestedChild.types';


const TableNestedChild = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  ...tableProps
}: TableNestedChildProps) => {
  const theme = useTheme();
  const [_pageSize, setPageSize] = useState(pageSize);
  const { processId } = useIdentity();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const isDebtor = processId?.includes('DEBT');
  const [{ stepper }] = useApp();
  const isEdit = GetAccessEdit(stepper);

  const listNumber = (index: number) => {
    let number = index;

    if (Number.isInteger(tableProps.currentPage)) {
      const currentPage = tableProps.currentPage || 0;
      number = _pageSize * (currentPage - 1) + index;
    }

    return number + 1;
  };

  const styPaper = {
    ...(tableProps.isPaper
      ? {
        borderRadius: theme.radius(2),
        boxShadow: 2,
      }
      : {
        borderRadius: 0,
        boxShadow: 0,
      }),
    overflow: 'hidden',
    width: '100%',
  };

  const styTableContainer = {
    pb: 1,
    ...(tableProps.isPaper && {
      pb: 2,
      px: 2,
    }),
    ...(tableProps.maxHeight && { maxHeight: tableProps.maxHeight }),
    ...(tableProps.maxWidth && { maxWidth: tableProps.maxWidth }),
    ...(tableProps.minHeight && { minHeight: tableProps.minHeight }),
    ...(tableProps.minWidth && { minWidth: tableProps.minWidth }),
    '::-webkit-scrollbar-thumb:horizontal': {
      display: 'none',
    },
    '::-webkit-scrollbar:horizontal': {
      display: 'none',
      height: 0,
      width: 0,
    },
  };

  const styTableHead = {
    '.MuiTableCell-head': {
      pb: theme.spacing(1),
      pt: theme.spacing(3),
      px: theme.spacing(1),
    },
  };

  const renderTableHeader = () => (
    <>
      {tableHeader?.map((header, idx) => {
        if (header.type === 'checkbox' && header.label === null) {

          return <MuiTableCell key="checkbox" sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}} />;
        }

        return (
          <MuiTableCell key={`${header.label}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.primary.main}
            >
              {header.label}
            </TextStyle>
          </MuiTableCell>
        );
      })}
    </>
  );

  const renderTableCell = (data, index, header) => {
    // Handle checkbox
    if (header.type === 'checkbox') {
      return (
        <MuiTableCell
          key={`checkbox${index}`}
          padding="checkbox"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <Checkbox
            color="primary"
            disabled={header.isDisabled(data)}
            checked={header.isSelected(data)}
            onChange={() => header.onSelectChange(data)}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
            }}
          />
        </MuiTableCell>
      );
    }

    // Prioritize custom render
    if (header.render) {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          {header.render(data, index)}
        </MuiTableCell>
      );
    }

    if (header.type === 'status') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, px: 1, py: 0.5 }}
            textVariant="body4"
            color={data?.[header.key]?.match(/REJECT|CANCELED/i) ? 'error' : 'primary'}
            noClick
          >
            {data?.[header.key] ?? '-'}
          </Button>
        </MuiTableCell>
      );
    }

    if (header.type === 'date') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {data?.[header.key] ? toDateString(data?.[header.key]) : '-'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    // Type: index
    if (header.type === 'index') {
      return (
        <MuiTableCell
          key={`index${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">{listNumber(index)}</TextStyle>
        </MuiTableCell>
      );
    }

    // Type: action
    if (header.type === 'action') {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          {options.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;

            const isLoading = typeof (option.isLoading) === 'function'
              ? option.isLoading(data)
              : option.isLoading;

            return (
              <Button
                disabled={isDisabled}
                variant="text"
                key={`action${option.iconName}`}
                sx={{
                  minWidth: 0,
                  padding: theme.spacing(1),
                }}
                onClick={() => option.onClick(data, index)}
                isLoading={isLoading}
              >
                <IconTooltip
                  iconName={option.iconName}
                  sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                />
              </Button>
            );
          })}
        </MuiTableCell>
      );
    }

    // text html
    if (header.type === 'textHtml') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {parse(data?.[header.key])} {/* use html-react-parser */}
          </TextStyle>
        </MuiTableCell>
      );
    }

    return (
      <MuiTableCell
        key={`${header.label}${data[header.key]}${index}`}
        sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
      >
        <TextStyle variant="body4">{data?.[header.key]}</TextStyle>
      </MuiTableCell>
    );
  };

  const renderTableBody = (list) => (
    <MuiTableBody
      sx={{
        '& .MuiTableCell-body': {
          padding: theme.spacing(1),
        },
      }}
    >
      {(!isLoading && tableData?.length === 0) && (
        <MuiTableRow>
          <MuiTableCell
            align="center"
            colSpan={tableHeader?.length}
            sx={{
              borderBottom: 'none',
              height: '15vw',
            }}
          >
            <EmptyPlaceholder status="data" />
          </MuiTableCell>
        </MuiTableRow>
      )}
      <>
        {list?.map((item, index) => (
          <>

            {
              item?.childList.map((chld, idx) => (
                <>
                  <MuiTableRow
                    key={item?.id ?? index}
                    sx={anomalyRow(item)}
                  >
                    {tableHeader?.map((header) =>
                      renderTableCell(chld, index, header),
                    )}
                  </MuiTableRow>
                </>
              ))
            }
            <MuiTableRow
              key={list.length + 1}
            >
              <TableCell colSpan={1} />
              <TableCell colSpan={2}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  Total
                </TextStyle>
              </TableCell>
              <TableCell colSpan={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  {item?.totalShares}
                </TextStyle>
              </TableCell>
              <TableCell colSpan={3} >
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  {item?.totalPercentage ?? 0}%
                </TextStyle>
              </TableCell>
            </MuiTableRow>
          </>
        ))}
      </>
    </MuiTableBody>
  );


  const renderLoading = () => (
    <MuiTableBody >
      <MuiTableRow>
        <MuiTableCell
          align="center"
          colSpan={tableHeader?.length}
          sx={{
            borderBottom: 'none',
            height: '15vw',
          }}
        >
          <CircularProgress />
        </MuiTableCell>
      </MuiTableRow>
    </MuiTableBody>
  );


  // Propagate on PageSizeChange
  useEffect(() => {
    if (tableProps.onPageSizeChange) {
      tableProps.onPageSizeChange(_pageSize);
    }

    // Reset page to 1
    if (tableProps.handlePageChange) {
      tableProps.handlePageChange(1);
    }
  }, [tableProps.onPageSizeChange, _pageSize]);

  useEffect(() => {
    if (tableData?.length === 0 && tableProps.handlePageChange) {
      tableProps?.handlePageChange(1);
    }
  }, [tableData]);

  const { mutate: deleteLevel, isPending: isDeleteLoading } = useDeleteLevel({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleAddNewLevel = (level: any) => {
    const parentList = tableProps.parentLevel.filter((item: any) => item.level === level);
    NiceModal.show(MODAL.STRUCTURE_ADD_MODAL, {
      action: 'add-level',
      level: level + 1,
      parentLevel: parentList,
    });
  };

  const handleDeleteLevel = (level: any) => {
    NiceModal.show(modalGlobal.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => {
        const payloadDelete = {
          bucketProcessId: processId.includes('MAI') ? processId : '',
          level: level,
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
        };
        deleteLevel(payloadDelete);
      },
      title: `Apakah anda yakin ingin menghapus Layer ${level}?`,
    });
  };

  const handleAddNewRow = (level: any) => {
    const parentList = tableProps.parentLevel.filter((item: any) => item.level === level - 1);
    NiceModal.show(MODAL.STRUCTURE_ADD_MODAL, {
      action: 'add-row',
      level: level,
      parentLevel: parentList,
    });
  };

  NiceModal.register(MODAL.STRUCTURE_ADD_MODAL, ModalAddStructure);
  // NiceModal.register(MODAL.STRUCTURE_DELETE_MODAL, ModalDeleteStructure);

  return (
    <>
      {tableData?.length > 0 && tableData.map((res, idx) => (
        <SectionTitle isOpen title={`Tingkat ${res?.level}`} key={idx} >
          <Paper sx={{ ...styPaper, borderRadius: 3, boxShadow: 7, display: 'flex', flexDirection: 'column', px: 3 }}>
            <MuiTableContainer sx={styTableContainer}>
              <MuiTable stickyHeader>
                <MuiTableHead sx={styTableHead}>
                  <MuiTableRow>
                    {renderTableHeader()}
                  </MuiTableRow>
                </MuiTableHead>
                {isLoading ? renderLoading() : renderTableBody(res?.shareholders)}
              </MuiTable>
            </MuiTableContainer>
            {/* --- Render Pagination --- */}
            {!isLoading && Number.isInteger(tableProps.totalPage) && Number.isInteger(tableProps.currentPage) && (
              <Pagination
                currentPage={tableProps.currentPage}
                totalPage={tableProps.totalPage}
                handlePageChange={tableProps.handlePageChange}
                pageSize={_pageSize}
                setPageSize={setPageSize}
              />
            )}
            {/* --- Render Footer --- */}
            {roleCanEdit && !isDebtor && isEdit && tableProps.canEditShareholder && (
              <RowWrapper sx={{ justifyContent: 'end', mb: 2 }}>
                {res?.level !== 10 &&
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3) }}
                  sx={{ float: 'right', height: theme.spacing(6), mr: theme.spacing(2), mt: theme.spacing(2), padding: theme.spacing(1) }}
                  onClick={handleAddNewLevel.bind(null, res?.level)}
                >
                  Add New Level
                </Button>
                }
                <Button
                  variant="outlined"
                  startIcon="delete"
                  startIconSx={{ fontSize: theme.spacing(3), path: { stroke: 'red' } }}
                  sx={{ float: 'right', height: theme.spacing(6), mr: theme.spacing(2), mt: theme.spacing(2), padding: theme.spacing(1) }}
                  onClick={handleDeleteLevel.bind(null, res?.level)}
                >
                  Delete This Level
                </Button>
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3), path: { stroke: theme.palette.primary.main } }}
                  sx={{
                    height: theme.spacing(6),
                    mr: theme.spacing(2),
                    mt: theme.spacing(2),
                    padding: theme.spacing(1),
                  }}
                  onClick={handleAddNewRow.bind(null, res?.level)}
                >
                  Add New Row
                </Button>
              </RowWrapper>
            )}
          </Paper>
        </SectionTitle>
      ))}
    </>
  );
};

export default TableNestedChild;
