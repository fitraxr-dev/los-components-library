import { Box, Tooltip } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import TableFacilityInformationSlik from '@/components/pages/MaintenanceData/MaintenanceDebtor/RegulatorDataPage/Slik/Component/FinancingFacility/Component/DetailFinancingFacility/Component/TableFacilityInformation';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import ButtonClose from '../../../ButtonClose/ButtonClose';
import TableFacilityInformation from '../InformasiSindikasiTab/components/TableFacilityInformation/TableFacilityInformationLocal';

import { useProjectTab } from './ProjectTab.hooks';


const ProjectTab = ({ fromSlik }: { fromSlik?: boolean }) => {
  const {
    theme,
    filter,
    setFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeaderProjectInformation,
    projectInformation,
    facilityInformation,
    isOrderType,
  } = useProjectTab(fromSlik);
  return (
    <>
      {!fromSlik && (
        <Title title="Project" />
      )}
      <ColumnWrapper sx={{ gap: 3 }}>
        {!fromSlik ? (
          <TableFacilityInformation
            facilityID={!!isOrderType ? facilityInformation?.data?.content?.facilityId :
              facilityInformation?.data?.content?.facilityCore}
            facilityNo={facilityInformation?.data?.content?.facilityNo}
            divisi={facilityInformation?.data?.content?.division}
            rm={facilityInformation?.data?.content?.relationshipManager}
            lastModified={facilityInformation?.data?.content?.modifiedDate}
            modifiedBy={facilityInformation?.data?.content?.modifiedBy}
          />
        ) : (
          <TableFacilityInformationSlik />
        )}
        <SectionTitle isOpen title="Project Information" >

          <BaseContainer sx={{ boxShadow: 7 }}>
            <Box width="45vw">
              <RowWrapper>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.custom.text}
                >
                  Data as of : {projectInformation?.data?.additionalData?.lastUpdate ? formatDateTime(projectInformation?.data?.additionalData?.lastUpdate) : '-'}
                </TextStyle>
                <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </RowWrapper>
            </Box>
            <Box width="45vw">
              <Input
                type="search"
                value={filter}
                onChange={setFilter}
                placeholder="Pencarian..."
                dropdownList={filterDropdownList}
                contentList={filterContentList}
              />
            </Box>
            <Table
              pageSize={pageSize}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
              tableData={projectInformation?.data?.contents as any}
              tableHeader={tableHeaderProjectInformation}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
        <ButtonClose />
      </RowWrapper>
    </>
  );
};
export default ProjectTab;
