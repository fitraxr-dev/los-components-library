import React, { useMemo } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalFormMember from './components/ModalFormMember';
import ModalProjectPhase from './components/ModalProjectPhase/ModalProjectPhase';
import { modal } from './ProjectInformation.constant';
import useProjectInformation from './ProjectInformation.hooks';


const ProjectInformation = () => {
  const theme = useTheme();
  const {
    control,
    watch,
    setValue,
    tableHeaderProjectPhase,
    tableHeaderListMember,
    filter,
    setFilter,
    dateAsOfAddressProject,
    projectMemberData,
    projectMemberPageSize,
    projectMemberPage,
    setProjectMemberFilter,
    setProjectMemberPageSize,
    setProjectMemberPage,
    isLoadingProjectMember,
    projectPhaseData,
    isLoadingProjectPhase,
    projectPhasePage,
    projectPhasePageSize,
    projectPhaseFilter,
    setProjectPhaseFilter,
    setProjectPhasePageSize,
    setProjectPhasePage,
    projectPhaseSearchByOptions,
    projectPhaseFilterContentList,
    projectMemberSearchByOptions,
    projectMemberFilterContentList,
    sektorYangDibiayaiOptions,
    institutionTypeOptions,
  } = useProjectInformation();

  const projectValue = watch('projectInformation.value.value.value');
  const projectValueCurrency = watch('projectInformation.value.value.currency');
  const projectExchangeRate = watch('projectInformation.exchangeRate.value.value');
  const projectExchangeRateCurrency = watch('projectInformation.exchangeRate.value.currency');
  const projectValueIdr = watch('projectInformation.valueInIdr.value.value');
  const projectValueIdrCurrency = watch('projectInformation.valueInIdr.value.currency');

  const projectPhaseDataMapped = projectPhaseData?.data.contents.map((item) => {
    return {
      ...item,
      // projectPhase: item.projectPhase ?? '-',
      // statusasof: item.statusasof ?? '-',
    };
  });

  const projectMemberDataMapped = useMemo(() => {
    const temp: any[] = [];
    if (projectMemberData?.data?.contents) {
      for (const item of projectMemberData.data.contents) {
        temp.push({
          cif: item.cif ?? '-',
          customerId: item.customerId ?? '-',
          customerName: item.customerName ?? '-',
          institutionType: institutionTypeOptions.find((type) => type.value === item.institutionType)?.label ?? '-',
        });
      }
      return temp;
    }
  }, [projectMemberData]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Project Information" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >

          <Controller
            name="projectInformation.name.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Proyek"
                placeholder="Nama Proyek"
                type="text"
              />
            }
          />

          <Controller
            name="projectInformation.sector"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Sektor Yang Dibiayai"
                placeholder="Sektor Yang Dibiayai"
                type="text"
              />
            }
          />

          <Controller
            name="projectInformation.endDate"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                error={null}
                label="Project End Date"
                placeholder="Project End Date"
                type="date"
              />
            }
          />

          <Controller
            name="projectInformation.startDate"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                error={null}
                label="Project Start Date"
                placeholder="Project Start Date"
                type="date"
              />
            }
          />

          <Currency
            isMandatory
            disabledCurrency
            label="Nilai Proyek"
            placeholder="Input Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={{ currency: projectValueCurrency, value: projectValue }}
            onChange={(val) => {
              setValue('projectValueCurrency', val.currency);
              setValue('projectValue', val.value);
            }}
            disabled
          />


          {
            projectValueCurrency !== 'IDR' ? (
              <>
                <Currency
                  isMandatory
                  disabledCurrency
                  label="Exchange Rate"
                  placeholder="Exchange Rate"
                  value={{ currency: projectExchangeRateCurrency, value: projectExchangeRate }}
                  onChange={(val) => {setValue('projectValueExchangeRate', val.value);}}
                  disabled
                />

                <Currency
                  disabledCurrency
                  label="Nilai Proyek (dalam Rp)"
                  placeholder="Nilai Proyek"
                  containerSx={{ flex: 1 }}
                  value={{ currency: projectValueIdrCurrency, value: projectValueIdr }}
                  onChange={(val) => {setValue('projectValueIdr', val.value);}}
                  disabled
                />
              </>
            ) : null
          }
        </Box>

        <Controller
          name="projectInformation.description.value"
          control={control}
          disabled
          render={({ field }) =>
            <Input
              {...field}
              label="Project Description"
              placeholder="Project Description"
              type="area"
              rows={4}
            />
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="projectInformation.modifiedBy.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Modified By"
                type="text"
              />
            }
          />
          <Controller
            name="projectInformation.lastModified"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Alamat Proyek" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {dateAsOfAddressProject}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <Controller
          name="projectAddress.address.value"
          control={control}
          disabled
          render={({ field }) =>
            <Input
              {...field}
              label="Project Location - Address"
              placeholder="Project Location - Address"
              type="area"
              rows={4}
            />
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="projectAddress.province.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi Proyek (Provinsi)"
                placeholder="Lokasi Proyek (Provinsi)"
                type="text"
              />
            }
          />
          <Controller
            name="projectAddress.city.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi Proyek (Kota-kabupaten)"
                placeholder="Lokasi Proyek (Kota-kabupaten)"
                type="text"
              />
            }
          />

          <Controller
            name="projectAddress.district.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi Proyek (Kecamatan)"
                placeholder="Lokasi Proyek (Kecamatan)"
                type="text"
              />
            }
          />

          <Controller
            name="projectAddress.village.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi Proyek (Kelurahan)"
                placeholder="Lokasi Proyek (Kelurahan)"
                type="text"
              />
            }
          />

          <Controller
            name="projectAddress.postalCode.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Postal Code"
                placeholder="Postal Code"
                type="text"
              />
            }
          />

          <Controller
            name="projectAddress.projectPhase.value"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Project Phase"
                placeholder="Project Phase"
                type="text"
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Project Phase" isOpen isMandatory>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {projectPhaseData?.data.additionalData.lastUpdate ? formatDateTime(projectPhaseData?.data.additionalData.lastUpdate) : '-'}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <RowWrapper justifyContent="space-between">
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={projectPhaseSearchByOptions}
              contentList={projectPhaseFilterContentList}
            />
          </Box>
          {/* <Button onClick={handleOpenAssignModal}>
            Add Project Phase
          </Button> */}
        </RowWrapper>


        <BaseContainer>
          <Table
            tableHeader={tableHeaderProjectPhase}
            tableData={projectPhaseDataMapped}
            isLoading={isLoadingProjectPhase}
            pageSize={projectPhasePageSize}
            totalPage={projectPhaseData?.data.page.totalPage}
            currentPage={projectPhasePage}
            handlePageChange={(page) => setProjectPhasePage(page)}
            onPageSizeChange={(size) => setProjectPhasePageSize(size)}
          />
        </BaseContainer>

      </SectionTitle>

      <SectionTitle title="List Member Project" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {projectMemberData?.data.additionalData.lastUpdate ? formatDateTime(projectMemberData?.data.additionalData.lastUpdate) : '-'}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <RowWrapper justifyContent="space-between">
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={projectMemberSearchByOptions}
              contentList={projectMemberFilterContentList}
            />
          </Box>
          {/* <Button onClick={popupGroupMemberHandler}>
            Add Project Member
          </Button> */}
        </RowWrapper>

        <BaseContainer>
          <Table
            tableHeader={tableHeaderListMember}
            tableData={projectMemberDataMapped}
            isLoading={isLoadingProjectMember}
            totalPage={projectMemberData?.data.page.totalPage ?? 0}
            pageSize={projectMemberPageSize}
            currentPage={projectMemberPage}
            handlePageChange={(page) => setProjectMemberPage(page)}
            onPageSizeChange={(size) => setProjectMemberPageSize(size)}
          />
        </BaseContainer>
      </SectionTitle>
      {/*
      <ModalDef
        id={modal.PROJECT_PHASE}
        component={ModalProjectPhase}
      />
      <ModalDef
        id={modal.FORM_MEMBER_PROJECT}
        component={ModalFormMember}
      /> */}
    </ColumnWrapper>
  );
};

export default ProjectInformation;
