import React from 'react';

import BaseContainer from './index';


export default {
  component: BaseContainer,
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/BaseContainer',
};


export const Default = {
  args: {
    children: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non
        aliquam justo. Cras consequat, sem in scelerisque dignissim, magna sem
        tincidunt eros, eu placerat libero purus eu nisi. Nullam pellentesque,
        lectus et convallis congue, eros magna ornare ante, sit amet ornare
        lorem augue et nisi. Aenean vitae accumsan massa. Pellentesque fringilla
        sapien vel leo elementum, eu auctor libero elementum. Vestibulum purus
        sapien, laoreet vitae elit nec, scelerisque malesuada leo. Donec quis
        leo egestas, consectetur nisi accumsan, porttitor sapien. Morbi cursus
        tempor leo at tincidunt. Vivamus lorem metus, luctus sed ipsum sed,
        ultrices dictum tellus. Quisque non orci fermentum mauris tincidunt
        volutpat. Proin dapibus suscipit pharetra. Maecenas mollis dui dui, non
        tempus neque tincidunt ac. Donec quis porttitor risus. Maecenas mollis
        dignissim felis et faucibus.
      </p>
    ),
  },
};
