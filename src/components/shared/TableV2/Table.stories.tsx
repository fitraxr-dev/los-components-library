import React, { useState } from 'react';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from './Table.types';

import Table from './index';


const tableData = [
  {
    groupName: 'Group1',
    id: '042023/000125',
    name: 'Ahmad Waluyo',
    pic: 'Group1',
    source: 'Bappenas',
    startDate: '25/May/2020',
    status: 'Approval TL',
  },
  {
    groupName: 'Group1',
    id: '042024/000126',
    name: 'Putri Wahyudi',
    pic: 'Group1',
    source: 'Walk in Customer',
    startDate: '25/May/2020',
    status: 'Monitoring',
  },
  {
    groupName: 'Group1',
    id: '042030/000999',
    name: 'Putri Ayu',
    pic: 'Group1',
    source: 'Walk in Customer',
    startDate: '25/May/2020',
    status: 'Monitoring',
  },
];

const tableHeader: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'id',
    label: 'Legal Checking ID',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'startDate',
    label: 'Start Date',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Button
        noClick
        sx={{ px: 1, py: 0.5 }}
        textVariant="button"
        color={row.status === 'Approval TL' ? 'success' : 'warning'}
      >
        {row.status}
      </Button>
    ),
  },
  {
    key: 'action',
    label: 'Action',
    options: [
      { iconName: 'detail', onClick: () => {} },
      { iconName: 'delete', onClick: () => {} },
    ],
    type: 'action',
  },
];


export default {
  component: Table,
  decorators: [
    (Story) => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Table',
};

const PageSizeTemplate = ({ ...rest }) => {
  const [selectedPageSize, setSelectedPageSize] = useState(5);

  return (
    <>
      <Table
        {...rest}
        tableHeader={tableHeader}
        tableData={rest.tableData}
        onPageSizeChange={setSelectedPageSize}
      />

      <pre style={{ marginTop: 10 }}>
        {JSON.stringify({ selectedPageSize: selectedPageSize }, null, 2)}
      </pre>
    </>
  );
};

const MultiSelectTemplate = ({ ...rest }) => {
  const [selectedVal, setSelectedVal] = useState([]);

  const selectTableHeader: Array<TableHeader> = [
    {
      isDisabled: (data) => data.id === '042023/000125',
      isSelected: (data) => selectedVal.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selectedVal.some((el) => el.id === data.id)) {
          setSelectedVal(selectedVal.filter((el) => el.id !== data.id));
        } else {
          setSelectedVal([data, ...selectedVal]);
        }
      },
      type: 'checkbox',
    },
    ...tableHeader,
  ];

  return (
    <>
      <Table {...rest} tableHeader={selectTableHeader} tableData={rest.tableData} />

      <pre style={{ marginTop: 10 }}>
        {JSON.stringify({ selectedVal }, null, 2)}
      </pre>
    </>
  );
};

const SingleSelectTemplate = ({ ...rest }) => {
  const [selectedVal, setSelectedVal] = useState([]);

  const selectTableHeader: Array<TableHeader> = [
    {
      isDisabled: (data) => data.id === '042023/000125',
      isSelected: (data) => selectedVal.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        setSelectedVal([data]);
      },
      type: 'checkbox',
    },
    ...tableHeader,
  ];

  return (
    <>
      <Table {...rest} tableHeader={selectTableHeader} tableData={rest.tableData} />

      <pre style={{ marginTop: 10 }}>
        {JSON.stringify({ selectedVal }, null, 2)}
      </pre>
    </>
  );
};


export const Default = {
  args: {
    tableData: [],
    tableHeader,
  },
};

export const Loading = {
  args: {
    isLoading: true,
    tableData,
    tableHeader,
  },
};

export const WithPagination = PageSizeTemplate.bind({});
WithPagination.args = {
  currentPage: 1,
  handlePageChange: () => {},
  tableData,
  tableHeader,
  totalPage: 10,
};

export const WithFooter = {
  args: {
    currentPage: 1,
    footer: () => (
      <ColumnWrapper sx={{ p: 2 }}>
        <TextStyle variant="body4">Assign To</TextStyle>
        <RowWrapper sx={{ justifyContent: 'end', m: 4 }}>
          <Button variant="contained" color="success">
            Submit
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    ),
    tableData,
    tableHeader,
    totalPage: 10,
  },
};

export const MultipleSelect = MultiSelectTemplate.bind({});
MultipleSelect.args = {
  currentPage: 1,
  tableData,
  totalPage: 10,
};

export const SingleSelect = SingleSelectTemplate.bind({});
SingleSelect.args = {
  currentPage: 1,
  tableData,
  totalPage: 10,
};
