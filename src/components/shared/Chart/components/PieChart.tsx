'use client';
import React, { useEffect, useRef, useState } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, useTheme } from '@mui/material';
import * as d3 from 'd3';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { PieChartData, PieChartProps } from '../Chart.types';


const PieChart = ({ chart_data, direction }: PieChartProps) => {
  const theme = useTheme();
  const svgRef = useRef(null);
  const svgContainer = useRef(null); // The PARENT of the SVG
  const minDiameter = 186;
  const maxDiameter = 196;

  // State to track width of SVG Container
  const [diameter, setDiameter] = useState(minDiameter);

  // This function calculates width and height of the container
  const getSvgContainerSize = () => {
    const newWidth = svgContainer?.current?.clientWidth;
    const newHeight = svgContainer?.current?.clientHeight;
    const min = Math.min(newHeight, newWidth);
    setDiameter(Math.max(minDiameter, Math.min(maxDiameter, min)));
  };

  useEffect(() => {
    // detect 'width' and 'height' on render
    getSvgContainerSize();
    // listen for resize changes, and detect dimensions again when they change
    window.addEventListener('resize', getSvgContainerSize);
    // cleanup event listener
    return () => window.removeEventListener('resize', getSvgContainerSize);
  }, []);

  //initiate the function to render
  useEffect(() => {
    draw(chart_data);
  }, [chart_data, diameter]);


  const draw = (data: PieChartData[]) => {

    // Dimensions
    let dimensions = {
      containerHeight: null,
      containerWidth: null,
      diameter: diameter,
      margins: 20,
    };

    dimensions.containerWidth = dimensions.diameter - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.diameter - dimensions.margins * 2;

    console.log('width', dimensions.containerWidth);
    console.log('height', dimensions.containerHeight);
    const color = d3.scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(data.map((d) => d.color))
      .unknown('#ccc');


    const pie = d3.pie()
      .sort(null)
      .value((d) => d.value);

    const radii = (direction === 'right') ? dimensions.containerWidth / 2 : dimensions.containerHeight / 2;
    console.log('radii', direction, radii);


    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radii);

    const arcs = pie(data);

    // Create the SVG container.
    const svg = d3.select(svgRef.current)
      .attr('width', radii * 2)
      .attr('height', radii * 2);

    //   clear all previous content on refresh
    const everything = svg.selectAll('*');
    everything.remove();

    //   Append a group for each series
    console.log('data svg', svg);
    svg.append('g')
      .attr('transform', `translate(${radii}, ${radii})`)
      .selectAll()
      .data(arcs)
      .join('path')
      .attr('fill', (d) => color(d.data.label))
      .attr('d', arc);
  };


  return (
    // <BaseContainer
    //   sx={{
    //     boxShadow: 2,
    //     mt: theme.spacing(3),
    //     paddingBottom: theme.spacing(4),
    //     paddingLeft: theme.spacing(8),
    //     paddingRight: theme.spacing(8),
    //     paddingTop: theme.spacing(2),
    //   }}
    // >
    //   <Title title="Informasi Customer" sx={{ marginBottom: theme.spacing(8) }} />
    <>
      {direction === 'bottom' ?
        <>
          <Box
            ref={svgContainer}
            sx={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingBottom: theme.spacing(2),
                paddingTop: theme.spacing(2),
              }
            }
          >
            <svg ref={svgRef} />
          </Box>
          <ColumnWrapper sx={{ marginTop: theme.spacing(3), rowGap: 3 }}>
            {chart_data.map((data, i) => {
              return (
                <RowWrapper key={i} sx={{ '*:last-child': { marginLeft: 'auto' }, alignItems: 'center' }} overflow="auto" flexWrap="wrap">
                  <FiberManualRecordIcon sx={{ color: data.color, fontSize: '0.9vw' }} />
                  <TextStyle variant="body3" weight={700} color="primary.text" marginLeft={1}>
                    {data.label}
                  </TextStyle>
                  <TextStyle variant="body3" weight={700} color="custom.gray10" marginLeft={1}>
                    {data.value}
                  </TextStyle>
                </RowWrapper>
              );
            })}
          </ColumnWrapper>
        </>
        :
        <>
          <RowWrapper sx={{ columnGap: 12, paddingTop: theme.spacing(2) }}>

            <Box
              ref={svgContainer}
              sx={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBottom: theme.spacing(2),
                  paddingTop: theme.spacing(2),
                }
              }
            >
              <svg ref={svgRef} />
            </Box>
            {/* eslint-disable-next-line max-len */}
            {/* <ColumnWrapper sx={{ flex: 1, justifyContent: 'space-between', rowGap: 3 }} className="pieChartElement"> */}
            <Box sx={{ columnGap: theme.spacing(2), display: 'grid', flex: 1, gridAutoColumns: '1fr', gridAutoFlow: 'column dense', gridTemplateRows: 'repeat(6, 1fr)' }}>
              {chart_data.map((data, i) => {
                return (
                  <RowWrapper sx={{ '*:last-child': { marginLeft: 'auto' }, alignItems: 'center' }} key={i} overflow="auto" flexWrap="wrap">
                    <FiberManualRecordIcon sx={{ color: data.color, fontSize: '0.9vw' }} />
                    <TextStyle variant="body3" weight={700} color="primary.text" marginLeft={1}>
                      {data.label}
                    </TextStyle>
                    <TextStyle variant="body3" weight={700} color="custom.gray10" marginLeft={1}>
                      {data.value}
                    </TextStyle>
                  </RowWrapper>
                );
              })}
            </Box>
            {/* </ColumnWrapper> */}
          </RowWrapper>
        </>
      }
      {/* </BaseContainer> */}
    </>
  );
};


export default PieChart;
