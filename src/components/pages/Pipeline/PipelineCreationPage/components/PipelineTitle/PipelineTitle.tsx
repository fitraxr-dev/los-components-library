import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import parse from 'html-react-parser';
import { useSearchParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor, maintenanceGroup, pipeline } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import useGetFinancingFacilityByPipelineId from '@/components/shared/SmiSection/FinancingFacilitySummary/hooks/useGetFinancingFacilityByPipelineId';
import TextStyle from '@/components/shared/TextStyle';

import useGetDetailBucketDebtor from '../../hooks/useGetDetailDebtor';
import useSyncRefina from '../../hooks/useSyncRefina';

import type { PipelineTitleProps } from './PipelineTitle.type';
import type { TitleButtons } from '@/components/shared/Title/types';


const PipelineTitle = ({
  isViewOnly,
  debtorId,
  groupId,
  isPemda = false,
  isExisting = false,
  isNew = false,
  result,
  isInvalid = false,
}: PipelineTitleProps) => {
  const theme = useTheme();

  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const { processId } = useIdentity();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const stringParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    return params?.toString()?.length ? `?${params}` : '';
  }, [searchParams]);

  const titleButtons: TitleButtons[] = [];

  const { data: facilityListData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeModule.PIPELINE,
    },
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
  });

  const { data } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeModule.PIPELINE,
  });

  const { mutate: syncRefina } = useSyncRefina({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const [openCircularLoading, setOpenCircularLoading] = useState(false);

  if (isPemda && !isViewOnly) {
    titleButtons.push(
      {
        color: 'blueRefina',
        disabled: isViewOnly,
        iconName: 'sync',
        label: 'Sync with Refina',
        onClick: () => {
          setOpenCircularLoading(true);
          setTimeout(() => {
            NiceModal.show(MODAL.SYNC_WITH_REFINA);
            setOpenCircularLoading(false);
          }, 3000);
        },
      },
    );
  }

  titleButtons.push(...[
    {
      disabled: debtorId === null || debtorId === undefined,
      label: data?.isExisting ? 'Go to Maintenance Customer' : isViewOnly ? 'Manajemen & Shareholder' : 'Add New Manajemen & Shareholder',
      onClick: () => {
        const path = data?.status === 'DRAFT'
          ? maintenanceDebtor.MANAGEMENT_SHAREHOLDER_FROM_OTHER_PAGE
          : maintenanceDebtor.MANAGEMENT_SHAREHOLDER_PAGE;

        data?.isExisting ? router.push(
          replacePath(path, {
            debtorId,
            from: 'pipeline',
            id: processId,
            module: 'maintenance',
          })
        ) : router.push(
          replacePath(pipeline.MANAGEMENT_SHAREHOLDER_PAGE, {
            processId,
          })
        );
      },
    },
    {
      disabled: debtorId === null || debtorId === undefined,
      label: data?.isExisting ? 'Go to Maintenance Proyek' : isViewOnly ? 'Proyek' : 'Add New Proyek',
      onClick: () => {
        const path = data?.status === 'DRAFT'
          ? maintenanceDebtor.PROJECT_FROM_OTHER_PAGE
          : maintenanceDebtor.PROJECT_PAGE;

        data?.isExisting ? router.push(
          replacePath(path, {
            debtorId: data.debtorId,
            from: 'pipeline',
            id: processId,
            module: 'maintenance',
          })
        ) : router.push(
          replacePath(
            pipeline.PROJECT_PAGE,
            {
              debtorId,
              processId,
            },
          ) + stringParams
        );
      },
    }
  ]);

  if (!isPemda) {
    titleButtons.push(
      {
        disabled: debtorId === null || debtorId === undefined,
        label: data?.isExisting ? 'Go to Maintenance Group' : isViewOnly ? 'Group' : 'Add New Group',
        onClick: () => handleNewGroup(),
      },
    );
  }

  const handleNewGroup = () => {

    const path = data?.status === 'DRAFT'
      ? maintenanceDebtor.GROUP_FROM_OTHER_PAGE
      : maintenanceDebtor.GROUP_PAGE;

    data?.isExisting ?
      isViewOnly ?
        router.push(
          replacePath(path, {
            debtorId: data.debtorId,
            from: 'pipeline',
            id: data.bucketProcessId,
            module: 'maintenance',
          })
        ) : router.push(
          replacePath(maintenanceDebtor.DETAIL_GROUP_INFORMATION_PAGE, {
            debtorId: data.debtorId,
            groupId: groupId,
            module: 'maintenance',
          })
        ) : router.push(
        replacePath(pipeline.GROUP_PAGE, {
          debtorId: data?.debtorId,
          processId: data?.bucketProcessId,
        })
      );
  };


  const renderButtons = () => (
    <RowWrapper>
      {titleButtons.map((el) => (
        <Button
          key={el.label}
          sx={{ ml: 2, px: 4, py: 1.5 }}
          startIcon={el.iconName}
          onClick={el.onClick ?? null}
          isLoading={el.isLoading}
          {...(el.disabled && { disabled: true })}
          color={el.color}
        >
          {el.label}
        </Button>
      ))}
    </RowWrapper>
  );

  return (
    <RowWrapper
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ColumnWrapper sx={{ alignItems: 'start' }}>
        <RowWrapper sx={{ alignItems: 'center', gap: '4px', position: 'relative' }}>

          <TextStyle
            variant="title1"
            weight={700}
            color={theme.palette.primary.main}
            py={1}
          >
            {isViewOnly ? 'Data Pipeline' : 'Create Pipeline'}
          </TextStyle>

          {isExisting && isInvalid ?
            <Tooltip
              title={
                <Box
                  sx={{
                    fontSize: '12px',
                    lineHeight: '1.5',
                    p: '8px',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '1.5',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: result?.replace(/<ul>/g, '<ul style="margin: 0; padding-left: 16px;">')
                        ?.replace(/<li>/g, '<li style="margin-bottom: 4px;">'),
                    }}
                  />
                </Box>
              }
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    maxWidth: '400px',
                  },
                },
              }}
            >
              <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                <Icon iconName="new-info" />
              </Box>
            </Tooltip>
            : null}
        </RowWrapper>
        {isExisting && isNew ?
          <RowWrapper sx={{ alignItems: 'center', gap: '10px' }}>
            <Icon iconName="information-shape" />
            <TextStyle
              fontSize="0.625vw"
              weight={600}
              color={theme.palette.primary.main}
              py={1}
            >
              Untuk mengubah Data Customer / Group / Project silakan ke Maintenance Data
            </TextStyle>
          </RowWrapper> : null}
      </ColumnWrapper>

      {debtorId === null ? null : titleButtons.length < 1 ? null : renderButtons()}

      {openCircularLoading &&
        <Backdrop
          sx={(theme) => ({ color: '#fff', display: 'flex', flexDirection: 'column', gap: theme.spacing(5), zIndex: theme.zIndex.drawer + 1 })}
          open={openCircularLoading}
        >
          <CircularProgress
            color="warning"
            size="5rem"
          />
          <Typography sx={{ fontWeight: 200 }}>Mohon tunggu, sinkronisasi data sedang dalam proses...</Typography>
        </Backdrop>
      }
    </RowWrapper>
  );
};

export default PipelineTitle;
