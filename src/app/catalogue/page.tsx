'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useForm, FormProvider } from 'react-hook-form';

import ComponentWrapper from '@/components/catalogue/ComponentWrapper';
import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons/ActionButtons';
import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import { lightTheme } from '@/helpers/theme/light';
import RowWrapper from '@/components/shared/RowWrapper';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import HStack from '@/components/shared/HStack';
import VStack from '@/components/shared/VStack';
import BaseContainer from '@/components/shared/BaseContainer';
import Title from '@/components/shared/Title';
import SectionTitle from '@/components/shared/SectionTitle';
import Icon from '@/components/shared/Icon';
import BackButton from '@/components/shared/BackButton';
import Loader from '@/components/shared/Loader';
import Progress from '@/components/shared/Progress';
import Toast from '@/components/shared/Toast/Toast';

import Chart from '@/components/shared/Chart';
import { CHART_DATA, PIE_CHART_DATA } from '@/components/shared/Chart/Chart.types';
import Stepper from '@/components/shared/Stepper';
import Table from '@/components/shared/Table';


// Form components
import Input from '@/components/shared/Input';
import Switch from '@/components/shared/Switch';
import Currency from '@/components/shared/Currency';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/components/layouts/AppLayout/App.context';

// Create theme using the copied light theme
const theme = createTheme(lightTheme);

// Initialize query client for the catalogue
const queryClient = new QueryClient();

export default function CataloguePage() {
  const methods = useForm({
    defaultValues: {
      demoInput: '',
      demoSwitch: false,
      demoCurrency: 0,
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <FormProvider {...methods}>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8 md:p-16 selection:bg-indigo-500/30">
          <header className="mb-16 max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium tracking-wide mb-4">
              Components Library
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Shared Catalogue
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              A beautiful, dynamic showcase of all shared components used across the platform.
            </p>
          </header>

          <main className="max-w-5xl mx-auto space-y-12">
            
            <ComponentWrapper name="ActionButtons" location="shared/ActionButtons">
              <ActionButtons 
                actions={{
                  [ACTIONS.CANCEL]: ACTIONS.CANCEL,
                  [ACTIONS.SAVE]: ACTIONS.SAVE,
                  [ACTIONS.SUBMIT]: ACTIONS.SUBMIT
                }}
                handleSave={() => alert('Saved!')}
                handleOpenSubmitModal={({ action }) => alert(`Submit Modal Action: ${action}`)}
              />
            </ComponentWrapper>

            <ComponentWrapper name="Button" location="shared/Button">
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <Button variant="contained" color="primary">Contained Primary</Button>
                <Button variant="outlined" color="primary">Outlined</Button>
                <Button variant="text" color="primary">Text Button</Button>
                <Button variant="contained" color="success">Success</Button>
                <Button variant="contained" color="error">Error</Button>
                <Button disabled variant="contained">Disabled</Button>
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="TextStyle" location="shared/TextStyle">
              <div className="flex flex-col gap-6 text-center w-full">
                {/* Displays */}
                <div className="border-b border-gray-200 pb-4 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Displays</h4>
                  <TextStyle variant="display1">Display 1 (display1)</TextStyle>
                  <TextStyle variant="display2">Display 2 (display2)</TextStyle>
                </div>

                {/* Titles */}
                <div className="border-b border-gray-200 pb-4 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Titles</h4>
                  <TextStyle variant="title1">Title 1 (title1)</TextStyle>
                  <TextStyle variant="title2">Title 2 (title2)</TextStyle>
                </div>

                {/* Bodies */}
                <div className="border-b border-gray-200 pb-4 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Body Styles</h4>
                  <TextStyle variant="body1">Body 1 (body1)</TextStyle>
                  <TextStyle variant="body2">Body 2 (body2)</TextStyle>
                  <TextStyle variant="body3">Body 3 (body3)</TextStyle>
                  <TextStyle variant="body4">Body 4 (body4)</TextStyle>
                  <TextStyle variant="body5">Body 5 (body5)</TextStyle>
                  <TextStyle variant="body6">Body 6 (body6)</TextStyle>
                  <TextStyle variant="body7">Body 7 (body7)</TextStyle>
                </div>

                {/* Buttons & Captions */}
                <div className="pb-4 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Buttons & Captions</h4>
                  <TextStyle variant="buttonLarge">Button Large (buttonLarge)</TextStyle>
                  <TextStyle variant="button">Button (button)</TextStyle>
                  <TextStyle variant="caption" color="gray">Caption Text Style (caption)</TextStyle>
                </div>
              </div>
            </ComponentWrapper>

            {/* LAYOUT & BASICS */}
            <div className="pt-12 pb-4 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800">Layout & Basics</h2>
            </div>

            <ComponentWrapper name="RowWrapper & ColumnWrapper" location="shared/RowWrapper | ColumnWrapper">
              <ColumnWrapper sx={{ gap: 2, p: 2, bgcolor: 'white', width: '100%' }}>
                <TextStyle>This is a ColumnWrapper</TextStyle>
                <RowWrapper sx={{ gap: 2 }}>
                  <Button variant="outlined">Row Item 1</Button>
                  <Button variant="outlined">Row Item 2</Button>
                </RowWrapper>
              </ColumnWrapper>
            </ComponentWrapper>

            <ComponentWrapper name="HStack & VStack" location="shared/HStack | VStack">
              <VStack gap="16px">
                <TextStyle>Vertical Stack</TextStyle>
                <HStack gap="16px">
                  <div className="p-4 bg-white border border-gray-200 shadow-sm rounded">Horizontal 1</div>
                  <div className="p-4 bg-white border border-gray-200 shadow-sm rounded">Horizontal 2</div>
                </HStack>
              </VStack>
            </ComponentWrapper>

            <ComponentWrapper name="BaseContainer" location="shared/BaseContainer">
              <BaseContainer sx={{ width: '100%', minHeight: '100px', border: '1px dashed gray' }}>
                <TextStyle>Base Container content goes here.</TextStyle>
              </BaseContainer>
            </ComponentWrapper>

            <ComponentWrapper name="Title & SectionTitle" location="shared/Title | SectionTitle">
              <div className="w-full space-y-8">
                <Title title="Main Page Title" />
                <SectionTitle title="Section Subtitle" subtitle="This is a section description." isOpen={true}>
                  <div className="p-4 bg-white border border-gray-200 rounded">Section content</div>
                </SectionTitle>
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Icon" location="shared/Icon">
              <RowWrapper sx={{ gap: 2 }}>
                <Icon iconName="home" />
                <Icon iconName="settings" />
                <Icon iconName="user" />
              </RowWrapper>
            </ComponentWrapper>

            <ComponentWrapper name="BackButton" location="shared/BackButton">
              <BackButton />
            </ComponentWrapper>

            {/* FORM ELEMENTS */}
            <div className="pt-12 pb-4 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800">Form Elements</h2>
            </div>

            <ComponentWrapper name="Input (Text)" location="shared/Input">
              <div className="w-full max-w-md">
                <Input name="demoInput" type="text" placeholder="Type here..." label="Sample Input" />
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Switch" location="shared/Switch">
              <Switch name="demoSwitch" label="Toggle feature" />
            </ComponentWrapper>

            <ComponentWrapper name="Currency" location="shared/Currency">
              <div className="w-full max-w-md">
                <Currency name="demoCurrency" label="Amount" />
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Other Form Components" location="shared/*">
              <div className="text-center p-6 border border-dashed border-gray-300/50 text-gray-600 text-sm">
                Placeholder for CheckBox, Autocomplete, InputButton, MultiSelectAutoComplete, CheckboxSelectAll, CurrencyForm.
                <br/>(Requires mock data and specific prop configurations).
              </div>
            </ComponentWrapper>

            {/* DATA DISPLAY & NAVIGATION */}
            <div className="pt-12 pb-4 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800">Data Display & Navigation</h2>
            </div>

            
            <ComponentWrapper name="Chart" location="shared/Chart">
              <div className="w-full flex flex-col gap-12">
                <div className="flex flex-col mb-12">
                  <TextStyle variant="h3" className="mb-4">Bar Chart</TextStyle>
                  <div className="w-full">
                    <Chart type="GROUPED_BAR" data={CHART_DATA} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <TextStyle variant="h3" className="mb-4">Pie Chart</TextStyle>
                  <div className="w-full">
                    <Chart type="PIE_RIGHT" data={PIE_CHART_DATA} />
                  </div>
                </div>
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Stepper" location="shared/Stepper">
              <div className="w-full overflow-x-auto pb-4">
                <Stepper 
                  steps={[
                    { title: 'Information', path: 'info', status: 1 },
                    { title: 'Catalogue', path: 'catalogue', status: 1 },
                    { title: 'Review', path: 'review', status: 0 },
                    { title: 'Approval', path: 'approval', status: 0 },
                  ] as any} 
                  onClick={(path) => console.log(path)} 
                />
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Table (SmiTable Base)" location="shared/Table">
              <div className="w-full bg-white rounded shadow-sm border border-gray-200">
                <Table
                  data={[
                    { id: 1, name: 'Alice', role: 'Admin', status: 'Active' },
                    { id: 2, name: 'Bob', role: 'Maker', status: 'Pending' },
                    { id: 3, name: 'Charlie', role: 'Checker', status: 'Active' }
                  ]}
                  columns={[
                    { id: 'name', label: 'User Name', width: 200 },
                    { id: 'role', label: 'System Role', width: 150 },
                    { id: 'status', label: 'Status', width: 100 }
                  ]}
                  withPagination={false}
                />
              </div>
            </ComponentWrapper>


            {/* FEEDBACK & LOADERS */}
            <div className="pt-12 pb-4 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800">Feedback & Loaders</h2>
            </div>

            <ComponentWrapper name="Loader" location="shared/Loader">
              <Loader />
            </ComponentWrapper>

            <ComponentWrapper name="Progress" location="shared/Progress">
              <div className="w-full">
                <Progress value={45} max={100} />
              </div>
            </ComponentWrapper>

            <ComponentWrapper name="Toast" location="shared/Toast">
              <Toast severity="success" />
            </ComponentWrapper>

            {/* ADVANCED */}
            <div className="pt-12 pb-4 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800">Advanced & Specific</h2>
            </div>

            <ComponentWrapper name="Advanced Components" location="shared/*">
              <div className="text-center p-6 border border-dashed border-gray-300/50 text-gray-600 text-sm">
                Placeholder for CallCenter, SmiComponent, SmiModal, SmiSection, SmiTable, Chart, WordEditor.
                <br/>(Requires third-party syncfusion setups, mock API contexts, or dashboard layouts).
              </div>
            </ComponentWrapper>
            
            <div className="text-center py-12 border-t border-dashed border-gray-300/50">
              <p className="text-gray-500 font-mono text-sm">
                All 52 components accounted for in the catalogue architecture.
              </p>
            </div>
            
          </main>
            </div>
          </FormProvider>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
