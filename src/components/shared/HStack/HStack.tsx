'use client';
import styled from '@emotion/styled';

import type { HStackProps } from './types';

/**
 * Horizontal Stack component.
 * @example
 * <HStack>
 *   <div>Hello</div>
 *   <div>wWrld</div>
 * </HStack>
 */
const HStack = ({
  children,
  top,
  right,
  bottom,
  left,
  align,
  height,
  justify,
  padding,
  style,
  width,
  ...props
}: HStackProps) => {

  const styHStack = {
    alignItems: align,
    height,
    justifyContent: justify,
    marginBottom: bottom,
    marginLeft: left,
    marginRight: right,
    marginTop: top,
    padding,
    width,
    ...style,
  };

  return (
    <StyledDiv
      style={styHStack}
      {...props}
    >{children}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export default HStack;
