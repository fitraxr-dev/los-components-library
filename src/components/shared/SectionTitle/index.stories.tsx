import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';

import SectionTitle from './index';


export default {
  component: SectionTitle,
  decorators: [
    (Story) => (
      <div style={{ borderStyle: 'dotted', width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/SectionTitle',
};


export const Default = {
  args: {
    title: 'Shareholder',
  },
};

export const WithSubtitle = {
  args: {
    subtitle: 'PT. Dwi | CIF: 00024 | RM: Putri ABC | Proposal ID: 1234123',
    title: 'Shareholder',
  },
};

export const WithChildren = {
  args: {
    children: (
      <BaseContainer
        sx= {{
          borderRadius: 2,
          boxShadow: 2,
          maxWidth: '100%',
          padding: 2,
        }}
      >
        <ColumnWrapper>
          <RowWrapper gap={4}>
            <Cell title="CIF" value="1111123123" />
            <Cell title="Nama RM" value="Dwi Kusbiantoro" />
          </RowWrapper>
          <RowWrapper gap={4}>
            <Cell title="Nama Customer" value="Afdilla Rahmaniar" />
            <Cell title="Divisi" value="Bisnis" />
          </RowWrapper>
          <RowWrapper gap={4}>
            <Cell title="Nama Group" value="Mayora" />
            <Cell title="Group Koordinator" value="Bisnis 1" />
          </RowWrapper>
          <RowWrapper gap={4}>
            <Cell title="NPWP" value="12345678213100000" />
            <Cell title="NIK" value="NIK" />
          </RowWrapper>
        </ColumnWrapper>
      </BaseContainer>
    ),
    subtitle: 'PT. Dwi | CIF: 00024 | RM: Putri ABC | Proposal ID: 1234123',
    title: 'Shareholder',
  },
};
