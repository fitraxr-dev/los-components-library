# Comprehensive Shared Components Documentation

This document explains every shared component located in `src/components/shared/`, what it is used for, and its basic properties.


## Form & Inputs

### `Autocomplete`
A dropdown select with search/autocomplete capabilities.

**Props:**
*   `id?: string;`
*   `testId?: string;`
*   `disabled?: boolean;`
*   `isLoading?: boolean;`
*   `dropdownList?: Array<AutocompleteOption>;`
*   `inputSx?: TextFieldProps['sx'];`
*   `label?: string;`
*   `maxLength?: number;`
*   `onChange?: (val: AutocompleteOption) => void;`
*   `onInputChange?: (val: string) => void;`
*   `placeholder?: string;`
*   `value?: AutocompleteOption;`
*   `color?: string;`
*   `children?: React.ReactNode;`
*   `error?: boolean;`
*   `helperText?: string;`
*   `isMandatory?: boolean;`
*   `containerSx?: BoxProps['sx'];`
*   `hasDataMaster?: string;`

### `CheckBox`
Standard boolean checkbox input.

### `CheckboxSelectAll`
A specialized checkbox component to select all items in a list or table.

### `Currency`
An input field that automatically formats numbers as currency.

**Props:**
*   `id?: string;`
*   `testId?: string;`
*   `inputRef?: any;`
*   `label?: string;`
*   `suffix?: string;`
*   `labelProps?: any;`
*   `containerSx?: BoxProps['sx'];`
*   `disabled?: boolean;`
*   `disabledCurrency?: boolean;`
*   `onChange?: (val: any) => void;`
*   `placeholder?: string;`
    value?: {
*   `currency: string;`
*   `value: string | number;`

### `CurrencyForm`
A form-integrated version of the currency input.

**Props:**
    value: number | string; // Currency values are typically numbers
*   `error?: boolean;`
*   `errorMessage?: string;`
*   `onChange?: (val: any) => void;`

### `Input`
Standard text input field.

### `InputButton`
An input field that contains a trailing button (e.g. for search or action).

**Props:**
*   `label?: string;`
*   `placeholder?: string;`
*   `sx?: FormControlProps['sx'];`
*   `labelSx?: TextStyleProps['sx'];`
*   `childPosition?: InputAdornmentProps['position'];`
*   `icon?: string;`
*   `onClick: () => void;`

### `InputList`
A component to render a list of inputs dynamically.

**Props:**
*   `fieldList: Array<InputListPlaceholder>;`
*   `column: number;`

### `MultiSelectAutoComplete`
An autocomplete component that allows multiple selections.

### `Switch`
A toggle switch input for boolean values.

**Props:**
*   `label?: string;`
*   `checked?: boolean;`
*   `onChange?: () => void;`
*   `sx?: BoxProps['sx'];`
*   `disabled?: boolean;`

### `WordEditor`
A rich text or document editor component.

---

## Buttons & Actions

### `ActionButtons`
A standardized group of action buttons (e.g., Save, Cancel, Submit).

**Props:**
*   `actions: Record<string, string>;`
*   `handleSave?: (data?: any) => void;`
    handleOpenSubmitModal?: (params: { action: string

### `BackButton`
A button specifically designed to navigate back to the previous screen.

**Props:**
*   `label?: string;`
*   `handleClick?: () => void;`
*   `iconName?: string;`

### `Button`
The core button component with standardized theming and text variants.

**Props:**
*   `children?: React.ReactNode;`
*   `color?: MuiButtonProps['color'];`
*   `disabled?: boolean;`
*   `endIcon?: string;`
*   `endIconSx?: SvgIconProps['sx'];`
*   `id?: string;`
*   `isFull?: boolean;`
*   `isLoading?: boolean;`
*   `noClick?: boolean;`
*   `onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;`
*   `startIcon?: string;`
*   `startIconSx?: SvgIconProps['sx'];`
*   `sx?: MuiButtonProps['sx'];`
*   `textSx?: TextStyleProps['sx'];`
*   `textVariant?: TextVariant;`
*   `textWeight?: TextWeight;`
*   `size?: MuiButtonProps['size'];`
*   `variant?: 'contained' | 'outlined' | 'text' ;`

### `IconButton`
A button consisting only of an icon.

**Props:**
*   `iconName: string;`
*   `isDisabled?: boolean;`
*   `onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;`
*   `sx?: Record<string, any>;`
*   `sxIcon?: Record<string, any>;`

### `IconTooltip`
An icon that displays a tooltip on hover.

**Props:**
*   `iconName?: string;`
*   `textVariant?: TextVariant;`
*   `sx?: SvgIconProps['sx'];`

---

## Layout & Wrappers

### `BaseContainer`
A standardized wrapper for cards or page sections.

**Props:**
*   `backgroundColor?: string;`
*   `sx?: PaperProps['sx'];`
*   `children?: React.ReactNode;`

### `ColumnWrapper`
Flexbox container with column direction.

### `HStack`
A strictly horizontal stack for consistent spacing.

### `RowItem`
A generic row layout component for key-value pairs.

**Props:**
*   `readonly label: string;`
*   `readonly children: ReactNode;`

### `RowWrapper`
Flexbox container with row direction.

### `VStack`
A strictly vertical stack for consistent spacing.

### `SectionTitle`
A title component with an optional collapsible section or subtitle.

**Props:**
*   `title?: string | JSX.Element;`
*   `subtitle?: string;`
*   `isMandatory?: boolean;`
*   `sx?: BoxProps['sx'];`
*   `tooltipText?: string;`
*   `children?: React.ReactNode;`
*   `isOpen?: boolean;`
*   `hideToggle?: boolean;`
*   `buttons?: Array<SectionTitleButtons>;`
*   `rightComponent?: React.ReactNode;`

### `Title`
A standard page or section title.

**Props:**
*   `title?: string;`
*   `buttons?: Array<TitleButtons>;`
*   `sx?: BoxProps['sx'];`
*   `customRender?: React.ReactNode;`

---

## Data Display

### `Cell`
A standardized table cell that can render text, links, dropdowns, etc.

**Props:**
*   `title?: string;`
*   `titleNode?: ReactNode;`
*   `value?: any;`
*   `type?: 'text' | 'link' | 'dropdown' | 'autocomplete' | 'buttons';`
*   `options?: CellOptions;`
*   `autoCompleteOptions?: AutoCompleteOptions;`
*   `buttons?: Array<ButtonOptions>;`
*   `isMandatory?: boolean;`
*   `wrapText?: boolean;`
*   `maxLines?: number;`
*   `hasDataMaster?: string | null;`

### `Chart`
Component for rendering bar, pie, and stacked charts.

**Props:**
*   `type: 'PIE_BOTTOM' | 'PIE_RIGHT' | 'GROUPED_BAR' | 'STACKED_BAR';`
*   `data: StackedChartData | GroupedBarChartData | PieChartData[];`

### `DndTable`
A table component supporting drag-and-drop rows.

**Props:**
*   `tableId?: string;`
*   `currentPage?: number | null;`
*   `footer?: React.ReactNode;`
*   `handlePageChange?: (page: number) => void;`
*   `isLoading?: boolean;`
*   `isPaper?: boolean;`
*   `isMaintenanceParameterBar?: boolean;`
*   `maxHeight?: string;`
*   `maxWidth?: string;`
*   `minHeight?: string;`
*   `minWidth?: string;`
*   `onPageSizeChange?: (pageSize: number) => void;`
*   `pageSize?: number;`
*   `renderInBetweenRow?: (data: any) => React.ReactNode;`
*   `renderAdditonalRow?: () => React.ReactNode;`
*   `renderFooter?: () => React.ReactNode;`
*   `tableData: Array<any>;`
*   `tableHeader: Array<TableHeader>;`
*   `totalPage?: number | null;`
*   `anomalyRow?: (val: any) => TableRowProps['sx'];`
*   `setTableData?: (data: Array<any>) => void;`
*   `onDragAndDrop?: (onDndProps) => void;`
*   `withConditional?: boolean;`

### `DragItem`
A wrapper for items that can be dragged.

### `EmptyPlaceholder`
A visual placeholder displayed when no data is available.

**Props:**
*   `status?: 'reminder' | 'task' | 'data' | 'notification' | 'coming-soon' | 'compare-empty';`
*   `imageOnly?: boolean;`
*   `customTitle?: string;`

### `Pagination`
Pagination controls for tables and lists.

**Props:**
*   `totalPage?: number;`
*   `currentPage?: number;`
*   `handlePageChange?: (page: number) => void;`
*   `pageSize?: number;`
*   `setPageSize?: (pageSize: number) => void;`
*   `pageSizeOptions?: Array<number>;`

### `RichTextDisplay`
Displays HTML or rich text safely.

**Props:**
*   `html?: string;`
*   `emptyFallback?: React.ReactNode;`
*   `sx?: SxProps<Theme>;`

### `SmiTable`
Domain-specific table wrapper.

### `Table`
Legacy table component.

**Props:**
*   `currentPage?: number | null;`
*   `footer?: React.ReactNode;`
*   `handlePageChange?: (page: number) => void;`
*   `isLoading?: boolean;`
*   `isPaper?: boolean;`
*   `isMaintenanceParameterBar?: boolean;`
*   `maxHeight?: string;`
*   `maxWidth?: string;`
*   `minHeight?: string;`
*   `minWidth?: string;`
*   `onPageSizeChange?: (pageSize: number) => void;`
*   `pageSize?: number;`
*   `renderInBetweenRow?: (data: any) => React.ReactNode;`
*   `renderAdditonalRow?: () => React.ReactNode;`
*   `renderFooter?: () => React.ReactNode;`
*   `tableData: Array<any>;`
*   `tableHeader: Array<TableHeader>;`
*   `totalPage?: number | null;`
*   `anomalyRow?: (val: any) => TableRowProps['sx'];`
*   `setTableData?: (data: Array<any>) => void;`
*   `onDragAndDrop?: (onDndProps) => void;`
*   `withConditional?: boolean;`
*   `emptyMessage?: string;`

### `TableAddFooter`
A footer component for tables, typically used to add new rows.

### `TableFooter`
Standard table footer.

**Props:**
*   `sx?: BoxProps['sx'];`
*   `onClick: () => void;`
*   `title?: string;`
*   `disabled?: boolean;`

### `TableV2`
The modern, highly configurable data table component.

---

## Navigation & Flow

### `GlobalStepper`
A stepper for global application flow.

**Props:**
*   `config: StepperConfig;`
*   `sx?: Record<string, any>;`

### `Stepper`
Standard progress stepper.

**Props:**
*   `steps: StepProcessMipResponseDto[];`
*   `onClick: (path: string, viewOnly?: boolean) => void;`

### `StepperV2`
Enhanced stepper with module and process integration.

**Props:**
*   `module: TypeModule;`
*   `process: TypeProcess;`
*   `bucketProcessId?: string;`
*   `menuCode?: string;`
*   `customProgress?: number;`

### `StepperV3`
Latest iteration of the stepper component with more granular control.

**Props:**
*   `module: TypeModule;`
*   `process: TypeProcess;`
*   `bucketProcessId?: string;`
*   `menuCode?: string;`
*   `customProgress?: number;`

### `Tabs`
Standard tab navigation component.

**Props:**
*   `dataChangesList?: string[];`
*   `activeTab?: Tabs;`
*   `onChange?: (val: Tabs) => void;`
*   `variant?: 'standard' | 'scrollable' | 'fullWidth';`
    items?: Array<{
*   `label: string;`
*   `value?: string;`
*   `disabled?: boolean;`
*   `isButtonShow?: boolean;`
*   `tooltip?: string;`

---

## Feedback & Overlays

### `CallCenter`
A specialized popup or overlay for call center actions.

### `Loader`
A visual loading spinner.

**Props:**
*   `isLoading: boolean;`

### `NotificationPopup`
A popup for displaying system notifications.

### `Overlay`
A generic overlay or backdrop component.

**Props:**
*   `url: string;`

### `Progress`
A linear progress bar.

### `SmiModal`
Domain-specific modal dialog wrapper.

### `Toast`
A lightweight notification toast (snackbar).

**Props:**
*   `severity: ToastSeverity;`

---

## Specialized Domain-Specific

### `SmiComponent`
Domain-specific generic component wrapper.

### `SmiSection`
Domain-specific section wrapper.

### `SortableSection`
A section that supports reordering of its contents.

---

## Typography & Icons

### `Icon`
Core icon renderer.

**Props:**
*   `iconName?: string;`
*   `textVariant?: TextVariant;`
*   `sx?: SvgIconProps['sx'];`

### `TextStyle`
The core typography component for rendering text with theme variants.

---
