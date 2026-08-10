import { useTheme } from '@mui/material';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';

import TextStyle from '@/components/shared/TextStyle';


type Tabs = string | number

type TabsProps = {
  activeTab?: Tabs;
  onChange?: (val: Tabs) => void;
  items?: Array<{
    label: string;
    value?: string;
    isMandatory?: boolean;
  }>;
}
export const CustomTabs = ({
  activeTab,
  onChange = () => {},
  items = [],
}: TabsProps) => {
  const theme = useTheme();

  const MandatoryIcon = () => {
    return (
      <TextStyle
        variant="body4"
        weight={600}
        color={theme.palette.error.main}
      >
        *
      </TextStyle>
    );
  };
  return (
    <MuiTabs
      value={activeTab}
      onChange={(_, val) => onChange(val)}
      aria-label="Tabs"
      textColor="primary"
      indicatorColor="primary"
      variant="fullWidth"
      sx={{
        borderBottom: `1px solid ${theme.palette.custom.gray40}`,
      }}
    >
      {items.map((el, index) => (
        <MuiTab
          key={el.label}
          label={el.label}
          value={el.value || index}
          sx={{
            color: theme.palette.custom.gray40,
          }}
          icon={el.isMandatory && <MandatoryIcon />}
          iconPosition="end"
        />
      ))}
    </MuiTabs>
  );

};
