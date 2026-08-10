'use client';
import styled from '@emotion/styled';

import type { VStackProps } from './types';

/**
 * Vertical Stack component.
 * @example
 * <VStack>
 *   <div>Hello</div>
 *   <div>World</div>
 * </VStack>
 */
const VStack = ({
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
}: VStackProps) => {

  const styVStack = {
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
      style={styVStack}
      {...props}
    >{children}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default VStack;
