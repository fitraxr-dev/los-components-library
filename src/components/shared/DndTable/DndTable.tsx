'use client';
import * as React from 'react';

import {
  DndContext,
  PointerSensor,
  useDndMonitor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import NiceModal from '@ebay/nice-modal-react';
import { Checkbox, CircularProgress, Paper, useTheme } from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import parse from 'html-react-parser';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadFileWatermark from '@/hooks/useDownloadFileWatermark';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import IconTooltip from '@/components/shared/IconTooltip';
import Pagination from '@/components/shared/Pagination';
import { PREVIEW_FORMAT } from '@/components/shared/SmiTable/ViewAllDocument/constants';
import TextStyle from '@/components/shared/TextStyle';

import EmptyPlaceholder from '../EmptyPlaceholder';

import type { DndTableProviderProps, TableProps } from './DndTable.types';


type RowLike = Record<string, any>

const getRowId = (row?: RowLike, fallbackIdx?: number): string => {
  const raw = row?.localId ?? row?.id ?? row?.documentId ?? row?.fileName;
  if (raw !== undefined && raw !== null) {
    return String(raw);
  }

  if (typeof fallbackIdx === 'number') {
    return String(fallbackIdx);
  }

  return `row-${fallbackIdx ?? 'undefined'}`;
};

const DraggableRow = ({
  row,
  rowId,
  anomalySx,
  children,
}: {
  row: RowLike;
  rowId: string;
  anomalySx: any;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    data: { row },
    id: rowId,
  });

  const style: React.CSSProperties = {
    cursor: 'grab',
    opacity: isDragging ? 0.6 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <MuiTableRow ref={setNodeRef} style={style} sx={anomalySx} {...attributes} {...listeners}>
      {children}
    </MuiTableRow>
  );
};

const EmptyDropZone = ({ id, colSpan }: {id: string; colSpan: number}) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <MuiTableRow>
      <MuiTableCell
        align="center"
        colSpan={colSpan}
        ref={setNodeRef}
        sx={{ borderBottom: 'none', height: '15vw' }}
      >
        <EmptyPlaceholder status="data" />
      </MuiTableCell>
    </MuiTableRow>
  );
};

const DndTable = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  withConditional = false,
  tableId,
  ...tableProps
}: TableProps) => {
  const theme = useTheme();
  const pathname = usePathname();
  const [localPageSize, setLocalPageSize] = React.useState(pageSize);

  const { recordActivity } = useRecordLog();

  const { mutate: setWatermark } = usePreviewWatermark({
    onError: (e) => {
      showNiceModalV2({ title: e?.message || 'Data gagal disimpan', type: 'error' });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: downloadWatermark } = useDownloadWatermark({
    onError: (e) => {
      showNiceModalV2({ title: e?.message || 'Data gagal disimpan', type: 'error' });
    },
    onSuccess: (data) => {
      window.open(data?.data?.content, '_self');
    },
  });

  const { mutate: downloadFileWatermark } = useDownloadFileWatermark({
    onError: (e) => {
      showNiceModalV2({ title: e?.message || 'Data gagal disimpan', type: 'error' });
    },
    onSuccess: (response, variable) => {
      try {
        const blob = response.data;
        const contentType =
          response.headers['content-type'] || response.headers['Content-Type'] || 'application/octet-stream';
        let filename = response.filename || (variable?.fileName ?? 'document');
        const cd = response.headers['content-disposition'] || response.headers['Content-Disposition'];
        if (!response.filename && cd) {
          const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (m?.[1]) filename = m[1].replace(/['"]/g, '');
        }
        const url = window.URL.createObjectURL(new Blob([blob], { type: contentType }));
        const isViewable = variable?.isPreview && (contentType.includes('pdf') || contentType.includes('image/') || contentType.includes('text/') || contentType.includes('application/json'));
        if (isViewable) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        recordActivity({
          activity: variable?.isPreview ? ActivityType.PREVIEW : ActivityType.DOWNLOAD,
          changeAfter: JSON.stringify(variable),
        });
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err: any) {
        console.error('Error creating download link:', err);
        showNiceModalV2({ title: err?.message, type: 'error' });
      }
    },
  });

  const styPaper = React.useMemo(
    () => ({
      ...(tableProps.isPaper
        ? { borderRadius: theme.radius(2), boxShadow: 2 }
        : { borderRadius: 0, boxShadow: 0 }),
      overflow: 'hidden',
      width: '100%',
    }),
    [tableProps.isPaper, theme]
  );

  const styTableContainer = React.useMemo(
    () => ({
      pb: 1,
      ...(tableProps.isPaper && { pb: 2, px: 2 }),
      ...(tableProps.maxHeight && { maxHeight: tableProps.maxHeight }),
      ...(tableProps.maxWidth && { maxWidth: tableProps.maxWidth }),
      ...(tableProps.minHeight && { minHeight: tableProps.minHeight }),
      ...(tableProps.minWidth && { minWidth: tableProps.minWidth }),
      '::-webkit-scrollbar-thumb:horizontal': { display: 'none' },
      '::-webkit-scrollbar:horizontal': { display: 'none', height: 0, width: 0 },
    }),
    [tableProps]
  );

  const styTableHead = React.useMemo(() => ({
    '.MuiTableCell-head': {
      backgroundColor: theme.palette.white.main,
      pb: theme.spacing(1),
      pt: theme.spacing(3),
      px: theme.spacing(1),
    },
  }), [theme]);

  const listNumber = React.useCallback((index: number) => {
    let number = index;
    if (Number.isInteger(tableProps.currentPage)) {
      const currentPage = tableProps.currentPage || 0;
      number = localPageSize * (currentPage - 1) + index;
    }
    return number + 1;
  }, [localPageSize, tableProps.currentPage]);

  const renderTableHeader = React.useCallback(() => (
    <>
      {tableHeader?.map((header, idx) => {
        if (header.type === 'checkbox' && header.label === null) {
          return (
            <MuiTableCell key={`checkbox-${idx}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}} />
          );
        }
        return (
          <MuiTableCell key={`${header.label}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
            <TextStyle variant="body4" weight={600} color={theme.palette.primary.main}>
              {header.label}
            </TextStyle>
          </MuiTableCell>
        );
      })}
    </>
  ), [tableHeader, tableData, theme]);

  const checkPathName = React.useCallback((p: string, whitelist: string[] = []) => {
    if (!p) return false;
    const segments = p.split('/').filter(Boolean);
    return segments.some((s) => whitelist.includes(s));
  }, []);

  const onclickAction = React.useCallback(
    (data: any, index: number, header: any) => {
      const blacklist: string[] = [];
      const isExclude = checkPathName(pathname, blacklist);

      if (header.iconName.includes('download')) {
        if (isExclude || header.isUseOnclick) {
          header.onClick(data, index);
        } else {
          NiceModal.show(MODAL.GLOBAL.WATERMARK, {
            initialWatermark: decodeURI(data?.watermark ?? ''),
            onSave: ({ watermark }: any) => {
              watermark = encodeURI(watermark);
              closeNiceModal(MODAL.GLOBAL.WATERMARK);
              if (header.apiDownload) {
                downloadFileWatermark({ api: header.apiDownload, ...data, watermark });
              } else {
                downloadWatermark({ ...data, watermark });
              }
            },
          });
        }
      } else if (header.iconName.includes('preview')) {
        if (isExclude || header.isUseOnclick) {
          header.onClick(data, index);
        } else {
          NiceModal.show(MODAL.GLOBAL.WATERMARK, {
            initialWatermark: decodeURI(data?.watermark ?? ''),
            onSave: ({ watermark }: any) => {
              watermark = encodeURI(watermark);
              closeNiceModal(MODAL.GLOBAL.WATERMARK);
              if (header.apiDownload) {
                downloadFileWatermark({ api: header.apiDownload, ...data, isPreview: true, watermark });
              } else {
                setWatermark({ ...data, watermark });
              }
            },
          });
        }
      } else {
        header.onClick(data, index);
      }
    },
    [checkPathName, pathname, downloadFileWatermark, downloadWatermark, setWatermark]
  );

  const renderTableCell = React.useCallback(
    (data: any, index: number, header: any) => {
      // checkbox
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
              sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
            />
          </MuiTableCell>
        );
      }

      // custom render
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
            <Button variant="outlined" sx={{ borderRadius: 2, px: 1, py: 0.5 }} textVariant="body4" color={/REJECT|CANCELED/i.test(String(data?.[header.key])) ? 'error' : 'primary'} noClick>
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
            <TextStyle variant="body4">{data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY, HH:mm:ss') : '-'}</TextStyle>
          </MuiTableCell>
        );
      }

      if (header.type === 'date-only') {
        return (
          <MuiTableCell
            key={`${header.label}${data[header.key]}${index}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
          >
            <TextStyle variant="body4">{data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY') : '-'}</TextStyle>
          </MuiTableCell>
        );
      }

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

      if (header.type === 'boolean') {
        return (
          <MuiTableCell
            key={`${header.label}${data[header.key]}${index}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
          >
            <TextStyle variant="body4" weight={400}>{data?.[header.key] === null ? ' ' : data?.[header.key] ? 'Covenant' : 'Non Covenant'}</TextStyle>
          </MuiTableCell>
        );
      }

      if (header.type === 'action') {
        const options = typeof header.options === 'function' ? header.options(data) : header.options;
        const headerSxFromProps = typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {};
        const headerSx = { minWidth: '8vw', ...headerSxFromProps };

        // regular action cell
        return (
          <MuiTableCell
            key={`action${index}`}
            padding="none"
            sx={headerSx}
          >
            {options.map((option: any) => {
              const isDisabled = typeof option.isDisabled === 'function' ? option.isDisabled(data) : option.isDisabled;
              let isLoading = false;
              if (option.iconName.includes('download')) {
                if (data.isSuccessUpload === false) isLoading = true;
              }
              if (option.isLoading) {
                isLoading = typeof option.isLoading === 'function' ? option.isLoading(data) : option.isLoading;
              }
              const isHidden = typeof option.isHidden === 'function' ? option.isHidden(data) : option.isHidden;
              if (isHidden) return null;

              // preview file type guard (same logic as original)
              let fileType: string | undefined;
              switch (true) {
                case !!data.fileType:
                  fileType = data.fileType; break;
                case !!data.documentExtension:
                  fileType = data.documentExtension; break;
                case !!data.fileExtension:
                  fileType = data.fileExtension; break;
                case !!data.npwpFile:
                  fileType = data.npwpFile.split('/').pop()?.split('.').pop(); break;
                case !!data.ktpFile:
                  fileType = data.ktpFile.split('/').pop()?.split('.').pop(); break;
                default:
                  fileType = undefined;
              }

              if (option.iconName.includes('preview')) {
                if (fileType && !PREVIEW_FORMAT.includes(String(fileType).toLowerCase())) {
                  return null;
                } else if (Array.isArray(data.listDocuments) && data.listDocuments.length > 0) {
                  if (data.listDocuments.length === 1) {
                    for (let i = 0; i < data.listDocuments.length; i++) {
                      if (!PREVIEW_FORMAT.includes(String(data.listDocuments[i].documentExtension || '').toLowerCase())) {
                        return null;
                      }
                    }
                  } else {
                    return null;
                  }
                }
              }

              return (
                <Button
                  disabled={isDisabled}
                  variant="text"
                  key={`action${option.iconName}`}
                  sx={{ minWidth: 0, padding: theme.spacing(1) }}
                  onClick={() => onclickAction(data, index, option)}
                  isLoading={isLoading}
                >
                  <IconTooltip
                    iconName={option.iconName}
                    sx={{ ...(isDisabled && { path: { stroke: theme.palette.text.disabled } }) }}
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
            <TextStyle variant="body4">{parse(String(data?.[header.key] ?? ''))}</TextStyle>
          </MuiTableCell>
        );
      }

      // default cell
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">{data?.[header.key] ?? '-'}</TextStyle>
        </MuiTableCell>
      );
    },
    [tableData, tableHeader, listNumber, onclickAction]
  );

  const itemIds = React.useMemo(() => tableData.map((r, i) => getRowId(r, i)), [tableData]);
  useDndMonitor({
    onDragEnd: (event) => {
      const overId = String(event.over?.id ?? '');
      const activeId = String(event.active?.id ?? '');
      if (!overId || !activeId) return;

      const isDestinationThisTable = itemIds.includes(overId) || overId === tableId;
      if (!isDestinationThisTable) return; // only destination table emits the callback

      const sourceRow = (event.active?.data?.current as any)?.row as RowLike | undefined;
      if (!tableProps.onDragAndDrop || !sourceRow) return;

      // Build new ordered array for this table
      const next = [...tableData];

      const movedId = getRowId(sourceRow);
      // Remove existing occurrence (if any) to dedupe
      const existingIdx = next.findIndex((r, i) => getRowId(r, i) === movedId);
      const moved = existingIdx >= 0 ? next.splice(existingIdx, 1)[0] : sourceRow;

      // Compute destination index
      const destIdx = overId === tableId ? 0 : Math.max(0, next.findIndex((r, i) => getRowId(r, i) === overId));
      const safeIdx = Math.min(Math.max(0, destIdx), next.length);
      next.splice(safeIdx, 0, moved);

      const previousItem = safeIdx > 0 ? next[safeIdx - 1] : null;
      const nextItem = safeIdx < next.length - 1 ? next[safeIdx + 1] : null;

      tableProps.onDragAndDrop({
        currentIndex: safeIdx,
        currentItem: moved,
        newTableData: next,
        nextItem,
        previousItem,
      });
    },
  });

  const onPageSizeChangeRef = React.useRef(tableProps.onPageSizeChange);
  const handlePageChangeRef = React.useRef(tableProps.handlePageChange);

  React.useEffect(() => {
    onPageSizeChangeRef.current = tableProps.onPageSizeChange;
  }, [tableProps.onPageSizeChange]);

  React.useEffect(() => {
    handlePageChangeRef.current = tableProps.handlePageChange;
  }, [tableProps.handlePageChange]);

  React.useEffect(() => {
    onPageSizeChangeRef.current?.(localPageSize);
    if (!withConditional && typeof tableProps.currentPage === 'number' && tableProps.currentPage !== 1) {
      handlePageChangeRef.current?.(1);
    }
  }, [localPageSize, withConditional, tableProps.currentPage]);

  React.useEffect(() => {
    const len = tableData?.length ?? 0;
    if (!withConditional && len === 0 && typeof tableProps.currentPage === 'number' && tableProps.currentPage !== 1) {
      handlePageChangeRef.current?.(1);
    }
  }, [withConditional, tableProps.currentPage, tableData?.length]);

  const renderTableBody = () => (
    <MuiTableBody sx={{ '& .MuiTableCell-body': { padding: theme.spacing(1) } }}>
      {!isLoading && tableData?.length === 0 && <EmptyDropZone id={tableId} colSpan={tableHeader?.length || 1} />}
      {tableData?.map((data, index) => {
        const rowId = getRowId(data, index);
        return (
          <React.Fragment key={rowId}>
            <DraggableRow row={data} rowId={rowId} anomalySx={anomalyRow(data)}>
              {tableHeader?.map((header) => renderTableCell(data, index, header))}
            </DraggableRow>
            {tableProps.renderInBetweenRow ? tableProps.renderInBetweenRow(data) : null}
          </React.Fragment>
        );
      })}
      {tableProps.renderAdditonalRow && (
        <MuiTableRow key={(tableData?.length || 0) + 1} sx={{ '.MuiTableCell-root': { borderBottom: 'none' } }}>
          {tableProps.renderAdditonalRow()}
        </MuiTableRow>
      )}
    </MuiTableBody>
  );

  const renderLoading = () => (
    <MuiTableBody>
      <MuiTableRow>
        <MuiTableCell align="center" colSpan={tableHeader?.length} sx={{ borderBottom: 'none', height: '15vw' }}>
          <CircularProgress />
        </MuiTableCell>
      </MuiTableRow>
    </MuiTableBody>
  );

  return (
    <Paper sx={{ ...styPaper, display: 'flex', flexDirection: 'column' }}>
      <MuiTableContainer sx={styTableContainer}>
        <MuiTable stickyHeader>
          <MuiTableHead sx={styTableHead}>
            <MuiTableRow>{renderTableHeader()}</MuiTableRow>
          </MuiTableHead>

          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {isLoading ? renderLoading() : renderTableBody()}
          </SortableContext>
        </MuiTable>
      </MuiTableContainer>

      {/* Pagination */}
      {!isLoading && Number.isInteger(tableProps.totalPage) && Number.isInteger(tableProps.currentPage) && (
        <Pagination
          currentPage={tableProps.currentPage as number}
          totalPage={tableProps.totalPage as number}
          handlePageChange={(p: number) => handlePageChangeRef.current?.(p)}
          pageSize={localPageSize}
          setPageSize={setLocalPageSize}
        />
      )}

      {/* Footer */}
      {!isLoading && tableProps.footer}
      {!isLoading && tableProps.renderFooter && tableProps.renderFooter()}
    </Paper>
  );
};

export default DndTable;

export const DndTableProvider = ({ children, ...props }: DndTableProviderProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  return (
    <DndContext
      sensors={sensors}
      {...props}
    >
      {children}
    </DndContext>
  );
};
