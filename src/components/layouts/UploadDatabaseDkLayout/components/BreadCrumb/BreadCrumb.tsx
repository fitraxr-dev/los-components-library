import { Fragment } from 'react';

import {
  Box,
  Collapse,
  List,
  ListItemButton,
  Tooltip,
} from '@mui/material';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useBreadCrumb from './BreadCrumb.hook';


const BreadCrumb = (props: {renderDropdownMenu?: boolean; renderBreadCrumb?: boolean}) => {
  const { renderDropdownMenu = true, renderBreadCrumb = true } = props;
  const {
    theme,
    handleNavigation,
    breadCrumb,
  } = useBreadCrumb();
  return (
    <RowWrapper mb={theme.spacing(2)} py={theme.spacing(2)}>
      {breadCrumb?.map((val, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 &&
            <TextStyle variant="body5" key={val} weight={500} color={theme.palette.custom.gray20}>
                  &nbsp;&gt;&nbsp;
            </TextStyle>
            }
            <Button
              variant="text"
              onClick={() => {handleNavigation(val?.url);}}
              disabled={val.url ? false : true}
              sx={{ justifyContent: 'start', minWidth: 0, padding: 0 }}
            >
              <TextStyle
                variant="body5"
                key={val}
                weight={500}
                color={
                  index + 1 === breadCrumb?.length ? theme.palette.primary.main : theme.palette.custom.gray20}
              >
                {val.label}
              </TextStyle>
            </Button>

          </Fragment>
        );
      })}
    </RowWrapper>
  );
};

export default BreadCrumb;
