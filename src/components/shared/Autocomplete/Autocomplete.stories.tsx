import React, { useEffect, useState } from 'react';

import useDebounce from '@/hooks/useDebounce';

import type { Meta, StoryObj } from '@storybook/react';

import Autocomplete from './index';


const meta: Meta<typeof Autocomplete> = {
  argTypes: {
    value: {
      control: {
        disable: true,
      },
    },
  },
  component: Autocomplete,
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  title: 'components/shared/Autocomplete',
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const Template = ({ ...rest }) => {
  const [val, setVal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownList, setDropdownList] = useState(null);

  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedValue) {
      const url = `https://swapi.dev/api/people/?search=${debouncedValue}`;

      setIsLoading(true);
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const list = data?.results?.map((item) => (
            {
              id: item.name,
              label: item.name,
            }
          ));

          setDropdownList(list);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setDropdownList([]);
    }

  }, [debouncedValue]);

  return (
    <>
      <Autocomplete
        {...rest}
        isLoading={isLoading}
        dropdownList={dropdownList}
        onChange={(val) => {
          setVal(val);
        }}
        onInputChange={(val) => {
          setSearchValue(val);
        }}
        value={val}
        placeholder="Search StarWars character"
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};

export const Default: Story = Template.bind({});

export const Mandatory: Story = Template.bind({});
Mandatory.args = {
  isMandatory: true,
};
