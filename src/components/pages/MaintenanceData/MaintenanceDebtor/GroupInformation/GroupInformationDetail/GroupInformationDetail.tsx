'use client';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useGroupInformationDetail from './GroupInformationDetail.hook';


const GroupInformationDetail = () => {
  const theme = useTheme();
  const {
    control,
    tableHeaderList,
    groupMemberData,
    isLoadingGroupMember,
    pageMember,
    setPageMember,
    pageSizeMember,
    setPageSizeMember,
    tableHeaderBmpk,
    tableDataBmpk,
    dataAsOfDateBMPK,
    totalDataBMPK,
    pageBMPK,
    setPageBMPK,
    setPageSizeBMPK,
    filterDropdownListBMPK,
    filterContentListBMPK,
    filterBMPK,
    setFilterBMPK,
    isLoadingBmpk,
    filterDropdownListMember,
    filterContentListMember,
    filterMember,
    setFilterMember,
  } = useGroupInformationDetail();

  const groupMember = groupMemberData?.contents?.map((item: any) => {
    return {
      ...item,
      bucketProcessId: item.bucketProcessId,
      cif: item.cif || '-',
      debtorId: item.debtorId || '-',
      debtorName: item.debtorName || '-',
      description: item.description || '-',
      gam: item.gam || '-',
      groupId: item.groupId || '-',
      id: item.id || '-',
      sector: Array.isArray(item.sector) ? item.sector.join(', ') : item.sector || '-',
    };
  });
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Detail Group" />
      <SectionTitle title="Group" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: theme.spacing(3),

          }}
        >
          <Controller
            name="groupInformation.groupCode"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="ID Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />
          <Controller
            name="groupInformation.groupName"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="groupInformation.groupType"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Jenis Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="groupInformation.isRelatedSmi"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Pihak Terkait/Tidak"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="groupInformation.sector.label"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Sektor Industri"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',

          }}
        >
          <Controller
            name="groupInformation.modifiedBy"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="groupInformation.lastModified"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="BMPK/BMPD/BMPP Individual" isOpen>
        <Box width="50%" py={2}>
          <Input
            type="search"
            value={filterBMPK}
            onChange={setFilterBMPK}
            placeholder="Pencarian..."
            dropdownList={filterDropdownListBMPK}
            contentList={filterContentListBMPK}
          />
        </Box>

        <Box display="flex" alignItems="center" pb={3} gap={1}>
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.custom.text}
          >
            Data as of : { dataAsOfDateBMPK }
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
              title="Tanggal dan jam update data terakhir"
              placement="right"
            >
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </Box>

        <BaseContainer>
          <Table
            isLoading={isLoadingBmpk}
            tableHeader={tableHeaderBmpk}
            tableData={tableDataBmpk}
            currentPage={pageBMPK}
            totalPage={totalDataBMPK?.totalPage ?? 1}
            handlePageChange={setPageBMPK}
            onPageSizeChange={setPageSizeBMPK}
          />
        </BaseContainer>
      </SectionTitle>

      <SectionTitle title="Group Member" isOpen>

        <Box width="50%" py={2}>
          <Input
            type="search"
            value={filterMember}
            onChange={setFilterMember}
            placeholder="Pencarian..."
            dropdownList={filterDropdownListMember}
            contentList={filterContentListMember}
          />
        </Box>

        {/* <Box display="flex" alignItems="center" pb={3} gap={1}>
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.custom.text}
          >
            Data as of : 27-07-2025 10:00:00
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
              title="Tanggal dan jam update data terakhir"
              placement="right"
            >
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </Box> */}

        <BaseContainer
          sx={{
            boxShadow: 2,
            maxWidth: '100%',
            mt: theme.spacing(3),
            padding: theme.spacing(2),
          }}
        >
          <Table
            tableHeader={tableHeaderList}
            tableData={groupMember}
            isLoading={isLoadingGroupMember}
            totalPage={groupMemberData?.page?.totalPage ?? 1}
            pageSize={pageSizeMember}
            currentPage={pageMember}
            handlePageChange={setPageMember}
            onPageSizeChange={setPageSizeMember}
          />
        </BaseContainer>
      </SectionTitle>

    </ColumnWrapper>
  );
};
export default GroupInformationDetail;
