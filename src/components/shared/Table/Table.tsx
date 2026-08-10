'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import {
  Checkbox,
  CircularProgress,
  Paper,
  Radio,
  useTheme,
} from '@mui/material';
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
import {
  formatDate,
  formatDateTime,
  toDateString,
  toHourMinuteSecond,
  toLocalTime,
} from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadFileWatermark from '@/hooks/useDownloadFileWatermark';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Pagination from '@/components/shared/Pagination';
import TextStyle from '@/components/shared/TextStyle';

import IconTooltip from '../IconTooltip';
import { PREVIEW_FORMAT } from '../SmiTable/ViewAllDocument/constants';

import type { TableProps } from './Table.types';


function getFileType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'csv';

  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'csv';
}

const Table = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  withConditional = false,
  ...tableProps
}: TableProps) => {
  // record log activity
  const { recordActivity } = useRecordLog();

  const theme = useTheme();
  const pathname = usePathname();
  const [_pageSize, setPageSize] = useState(pageSize);
  const [fileName, setFileName] = useState('download');

  const handleDragStart = (event, rowIndex) => {
    event.dataTransfer.setData('text/plain', rowIndex);
    event.target.style.opacity = 0.5;
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));

    if (draggedIndex !== targetIndex) {
      const newData = [...tableData];

      const element = newData[draggedIndex];
      newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, element);
      if (tableProps.onDragAndDrop) {
        tableProps.onDragAndDrop({
          currentIndex: targetIndex,
          currentItem: element,
          newTableData: newData,
          nextItem: targetIndex === newData.length - 1 ? null : newData[targetIndex + 1],
          previousItem: targetIndex > 0 ? newData[targetIndex - 1] : null,
        });
      }

      // if (tableProps.setTableData) {
      //   tableProps.setTableData(newData);
      // }

    }
    event.target.style.opacity = 1;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
      backgroundColor: theme.palette.white.main,
      pb: theme.spacing(1),
      pt: theme.spacing(3),
      px: theme.spacing(1),
    },
  };

  const renderTableHeader = () => (
    <>
      {tableHeader?.map((header, idx) => {
        if ((header.type === 'checkbox' || header.type === 'radio') && header.label === null) {
          return (
            <MuiTableCell
              key="checkbox"
              sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : (header.sx ?? {})}
            />
          );
        }

        return (
          <MuiTableCell
            key={`${header.label}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : (header.sx ?? {})}
          >
            <TextStyle variant="body4" weight={600} color={theme.palette.primary.main}>
              {header.label}
            </TextStyle>
          </MuiTableCell>
        );
      })}
    </>
  );

  const { mutate: setWatermark, isPending: isSetWatermarkLoading } = usePreviewWatermark({
    onError: (e) => {
      showNiceModalV2({
        title: e?.message || 'Data gagal disimpan',
        type: 'error',
      });
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

  const { mutate: downloadWatermark, isPending: isDownloadWatermarkLoading } = useDownloadWatermark({
    onError: (e) => {
      showNiceModalV2({
        title: e?.message || 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      window.open(data?.data?.content, '_self');
    },
  });

  const { mutate: downloadFileWatermark, isPending: isDownloadFileWatermarkLoading } = useDownloadFileWatermark({
    onError: (e) => {
      showNiceModalV2({
        title: e?.message || 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (response, variable) => {

      // Handle blob download
      try {
        const blob = response.data;

        // Get content type dari response headers
        let contentType = response.headers['content-type'] ||
          response.headers['Content-Type'] ||
          'application/octet-stream';

        // Gunakan filename dari data yang dikirim, bukan dari response headers
        let filename = response.filename || fileName || 'document';

        // Fallback: coba ambil dari Content-Disposition header jika filename dari data tidak ada
        if (!response.filename) {
          const contentDisposition = response.headers['content-disposition'] ||
            response.headers['Content-Disposition'];

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }
        }

        // Create blob dengan content type yang tepat
        const finalBlob = new Blob([blob], { type: contentType });

        // Create object URL dan buka di new window
        const url = window.URL.createObjectURL(finalBlob);

        // Untuk file yang bisa dibuka di browser (PDF, images, text), buka di tab baru
        // Untuk file lain, trigger download
        const isViewableInBrowser = variable.isPreview && (contentType.includes('pdf') ||
          contentType.includes('image/') ||
          contentType.includes('text/') ||
          contentType.includes('application/json'));

        if (isViewableInBrowser) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // Trigger download untuk file yang tidak bisa dibuka di browser
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // record log activity
        recordActivity({
          activity: variable.isPreview ? ActivityType.PREVIEW : ActivityType.DOWNLOAD,
          changeAfter: JSON.stringify(variable),
        });

        // Clean up URL setelah delay untuk mencegah memory leaks
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (error) {
        console.error('Error creating download link:', error);
        showNiceModalV2({
          title: error?.message,
          type: 'error',
        });
      }
    },
  });

  const checkPathName = (pathname: string, whitelist: string[] = []): boolean => {
    if (!pathname) return false;

    const segments = pathname.split('/').filter(Boolean);

    return segments.some((segment) => whitelist.includes(segment));
  };

  const onclickAction = (data, index, header) => {
    const blacklist = [];
    const isExclude = checkPathName(pathname, blacklist);
    const fileName = data?.fileName || data?.reportName;
    setFileName(fileName);

    const email = JSON.parse(localStorage.getItem('app-context-persist')).userData.user.email;
    const isDownload = header.iconName.includes('download');
    const isPreview = header.iconName.includes('preview');

    // Helper untuk handle watermark
    const handleWatermarkAction = (watermark) => {
      watermark = encodeURI(watermark);

      const baseParams = {
        watermark,
        ...(isPreview && { isPreview: true }),
      };

      const executeAction = (document) => {
        const params = { ...document, ...baseParams };

        if (header.apiDownload) {
          downloadFileWatermark({
            api: header.apiDownload,
            ...params,
          });
        } else {
          if (isDownload) {
            downloadWatermark(params);
          } else if (isPreview) {
            setWatermark(params);
          }
        }
      };

      if (header.isMultiDocument) {
        if (!data?.listDocuments || !Array.isArray(data.listDocuments) || data.listDocuments.length === 0) {
          showNiceModalV2({
            title: 'Gagal list document tidak ditemukan',
            type: 'error',
          });
          return;
        }
        data.listDocuments.forEach(executeAction);
      } else {
        executeAction(data);
      }
    };

    // Jika aksi download/preview
    if (isDownload || isPreview) {
      if (isExclude || header.isUseOnclick) {
        header.onClick(data, index);
        return;
      }

      NiceModal.show(MODAL.GLOBAL.WATERMARK, {
        initialWatermark: decodeURI(data?.watermark ?? ''),
        onSave: ({ watermark }) => {
          closeNiceModal(MODAL.GLOBAL.WATERMARK);
          handleWatermarkAction(watermark);
        },
      });
    } else {
      // Aksi lain
      header.onClick(data, index);
    }
  };


  const renderTableCell = (data, index, header) => {
    if (header.skipRender && typeof header.skipRender === 'function' && header.skipRender(data)) {
      return null;
    }

    if (header.type === 'checkbox' || header.type === 'radio') {
      const isDisabled = typeof (header.isDisabled) === 'function'
        ? header.isDisabled(data)
        : header.isDisabled;

      return (
        <MuiTableCell
          key={`checkbox${index}`}
          padding="checkbox"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : (header.sx ?? {})}
        >
          {header.type === 'radio' ? (
            <Radio
              color="primary"
              disabled={isDisabled}
              checked={header.isSelected(data)}
              onChange={() => header.onSelectChange(data)}
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
              }}
            />
          ) : (
            <Checkbox
              color="primary"
              disabled={isDisabled}
              checked={header.isSelected(data)}
              onChange={() => header.onSelectChange(data)}
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 'clamp(22px, 1.6vw, 36px)',
                },
              }}
            />
          )}
        </MuiTableCell>
      );
    }

    // Prioritize custom render
    if (header.render) {
      const colSpanValue = typeof header.colSpan === 'function' ? header.colSpan(data) : (header.colSpan ?? 1);

      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          colSpan={colSpanValue}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : (header.sx ?? {})}
        >
          {header.render(data, index)}
        </MuiTableCell>
      );
    }

    // Special handling for MaintenanceParameterBar index column with rowSpan
    if (header.type === 'index' && tableProps.isMaintenanceParameterBar && data.index && typeof data.index === 'object' && data.index.rowSpan) {
      return (
        <MuiTableCell
          key={`index${index}`}
          rowSpan={data.index.rowSpan}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">{data.index.value}</TextStyle>
        </MuiTableCell>
      );
    }

    // Skip rendering cell if it's a hidden cell due to rowSpan
    if (header.type === 'index' && tableProps.isMaintenanceParameterBar && data.index && typeof data.index === 'object' && data.index.rowSpan === 0) {
      return null;
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
            color={data?.[header.key]?.match(/REJECT|CANCELED|FAILED/i) ? 'error' : 'primary'}
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
            {data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY, HH:mm:ss') : '-'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    if (header.type === 'date-only') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY') : '-'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    if (header.type === 'time-only') {
      return (
        <MuiTableCell>
          <TextStyle variant="body4">
            {data?.[header.key] ? toHourMinuteSecond(data?.[header.key]) : '-'}
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

    // Type: boolean
    if (header.type === 'boolean') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4" weight={400}>
            {data?.[header.key] === null ? ' ' : data?.[header.key] ? 'Covenant' : 'Non Covenant'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    // Type: action
    if (header.type === 'action') {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      const headerSxFromProps = typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {};

      const headerSx = {
        minWidth: '8vw',
        ...headerSxFromProps,
      };

      // Special handling for action column with rowSpan (similar to index)
      if (tableProps.isMaintenanceParameterBar && data.action && typeof data.action === 'object' && data.action.rowSpan) {
        return (
          <MuiTableCell
            key={`action${index}`}
            rowSpan={data.action.rowSpan}
            padding="none"
            sx={headerSx}
          >
            {options.map((option) => {
              const isDisabled = typeof (option.isDisabled) === 'function'
                ? option.isDisabled(data)
                : option.isDisabled;

              let isLoading = false;

              if (option.iconName.includes('download')) {
                if (data.isSuccessUpload === false) {
                  isLoading = true;
                }
              }

              if (option.isLoading) {
                isLoading = typeof (option.isLoading) === 'function'
                  ? option.isLoading(data)
                  : option.isLoading;
              }

              const isHidden = typeof (option.isHidden) === 'function'
                ? option.isHidden(data)
                : option.isHidden;

              if (isHidden) {
                return null;
              };

              return (
                <Button
                  disabled={isDisabled || isLoading}
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

      // Skip rendering cell if it's a hidden cell due to rowSpan
      if (tableProps.isMaintenanceParameterBar && data.action && typeof data.action === 'object' && data.action.rowSpan === 0) {
        return null;
      }

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={headerSx}
        >
          {options.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;

            //TODO: hapus di proyek baru
            let isLoading = false;

            if (option.iconName.includes('download')) {
              if (data.isSuccessUpload === false) {
                isLoading = true;
              }
            }

            if (option.isLoading) {
              isLoading = typeof (option.isLoading) === 'function'
                ? option.isLoading(data)
                : option.isLoading;
            }

            const isHidden = typeof (option.isHidden) === 'function'
              ? option.isHidden(data)
              : option.isHidden;

            if (isHidden) {
              return null;
            };

            let fileType = undefined;

            switch (true) {
              case !!data.fileType:
                fileType = data.fileType;
                break;
              case !!data.documentExtension:
                fileType = data.documentExtension;
                break;
              case !!data.fileExtension:
                fileType = data.fileExtension;
                break;
              case !!data.npwpFile:
                fileType = data.npwpFile.split('/').pop()?.split('.').pop();
                break;
              case !!data.ktpFile:
                fileType = data.ktpFile.split('/').pop()?.split('.').pop();
                break;
              default:
                fileType = undefined;
            }

            if (option.iconName.includes('preview')) {
              if (fileType && !PREVIEW_FORMAT.includes(fileType?.toLowerCase())) {
                return null;
              } else if (data.listDocuments?.length > 0) {
                if (data.listDocuments.length === 1) {
                  for (let i = 0; i < data.listDocuments.length; i++) {
                    if (!PREVIEW_FORMAT.includes(data.listDocuments[i].documentExtension?.toLowerCase())) {
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
                disabled={isDisabled || isLoading}
                variant="text"
                key={`action${option.iconName}`}
                sx={{
                  minWidth: 0,
                  padding: theme.spacing(1),
                }}
                onClick={() => onclickAction(data, index, option)}
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

    const rawValue = data?.[header.key];
    let displayValue: any;

    if (rawValue === 0 && header.preserveZero) {
      displayValue = '0';
    } else if (rawValue === null || rawValue === undefined || rawValue === '') {
      displayValue = '-';
    } else {
      displayValue = rawValue;
    }

    return (
      <MuiTableCell
        key={`${header.label}${data[header.key]}${index}`}
        sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
      >
        <TextStyle variant="body4">
          {typeof displayValue === 'string' ? parse(displayValue) : displayValue}
        </TextStyle>
      </MuiTableCell>
    );
  };

  const renderTableBody = () => (
    <MuiTableBody
      sx={{
        '& .MuiTableCell-body': {
          padding: theme.spacing(1),
        },
      }}
    >
      {(!isLoading && tableData?.length) === 0 && (
        <MuiTableRow>
          <MuiTableCell
            align="center"
            colSpan={tableHeader?.length}
            sx={{
              borderBottom: 'none',
              height: '15vw',
            }}
          >
            {tableProps.emptyMessage ? (
              <EmptyPlaceholder status="data" customTitle={tableProps.emptyMessage} />
            ) : (
              <EmptyPlaceholder status="data" />
            )}
          </MuiTableCell>
        </MuiTableRow>
      )}
      {tableData?.map((data, index) => (
        <>
          <MuiTableRow
            key={data?.id ?? index}
            sx={anomalyRow ? anomalyRow(data) : {}}
            draggable={tableProps.onDragAndDrop !== undefined}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {tableHeader?.map((header) =>
              renderTableCell(data, index, header),
            )}
          </MuiTableRow>
          {tableProps.renderInBetweenRow ? tableProps?.renderInBetweenRow(data) : null}
        </>
      ))}
      {tableProps.renderAdditonalRow && (
        <MuiTableRow
          key={tableData.length + 1}
          sx={{
            '.MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          {tableProps.renderAdditonalRow()}
        </MuiTableRow>
      )}
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
    if (tableProps.handlePageChange && !withConditional) {
      tableProps.handlePageChange(1);
    }
  }, [tableProps.onPageSizeChange, _pageSize]);

  useEffect(() => {
    if (tableData?.length === 0 && tableProps.handlePageChange && !withConditional) {
      tableProps?.handlePageChange(1);
    }
  }, [tableData]);

  return (
    <Paper sx={{ ...styPaper, display: 'flex', flexDirection: 'column' }}>
      <MuiTableContainer sx={styTableContainer}>
        <MuiTable stickyHeader>
          <MuiTableHead sx={styTableHead}>
            <MuiTableRow>
              {renderTableHeader()}
            </MuiTableRow>
          </MuiTableHead>
          {isLoading ? renderLoading() : renderTableBody()}
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
      {!isLoading && tableProps.footer}
      {(!isLoading && tableProps.renderFooter) && tableProps.renderFooter()}
    </Paper>
  );
};

export default Table;
