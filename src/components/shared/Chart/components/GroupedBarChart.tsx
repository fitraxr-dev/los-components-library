import React, { useEffect } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import * as d3 from 'd3';

import ColumnWrapper from '../../ColumnWrapper';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import type { GroupedBarChartProps } from '../Chart.types';


const GroupedBarChart = ({ chart_data }: GroupedBarChartProps) => {

  const colors = chart_data?.barLabel?.map((label) => { return { color: label.color, label: label.label }; });


  //initiate the function to render
  useEffect(() => {
    draw(chart_data);
  }, [chart_data]);


  const draw = (paramData) => {

    const mergeData = paramData?.barData?.flatMap(({ name, value }) =>
      value.map((val, i) => ({
        label: chart_data.barLabel[i].label,
        name: name,
        value: val,
      }))
    );

    //Change the data format into csv
    const objectToCsv = function (data) {

      const csvRows = [];

      /* Get headers as every csv data format
                has header (head means column name)
                so objects key is nothing but column name
                for csv data using Object.key() function.
                We fetch key of object as column name for
                csv */
      const headers = Object.keys(data[0]);

      /* Using push() method we push fetched
                   data into csvRows[] array */
      csvRows.push(headers.join(','));

      // Loop to get value of each objects key
      for (const row of data) {
        const values = headers.map((header) => {
          const val = row[header];
          return `"${val}"`;
        });

        // To add, separator between each value
        csvRows.push(values.join(','));
      }

      /* To add new line for each objects values
                   and this return statement array csvRows
                   to this function.*/
      return csvRows.join('\n');
    };

    //Parse the csv data
    const data = d3.csvParse(objectToCsv(mergeData));
    console.log('data merge', d3.group(data, (d) => d.name));

    // Specify the chart’s dimensions.
    const width = 960 ;
    const height = 480;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 20;
    const marginLeft = 40;

    // Prepare the scales for positional and color encodings.
    // Fx encodes the state.
    const fx = d3.scaleBand()
      .domain(new Set(data.map((d) => d.name)))
      .rangeRound([marginLeft, width - marginRight])
      .paddingInner(0.3);

    // Both x and color encode the age class.
    const ages = new Set(data.map((d) => d.label));

    const x = d3.scaleBand()
      .domain(ages)
      .rangeRound([0, fx.bandwidth()])
      .padding(0.05);

    const color = d3.scaleOrdinal()
      .domain(ages)
      .range(colors.map((d) => d.color))
      .unknown('#ccc');

    // Y encodes the height of the bar.
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)]).nice()
      .rangeRound([height - marginBottom, marginTop]);

    // A function to format the value in the tooltip.
    const formatValue = (x) => isNaN(x) ? 'N/A' : x.toLocaleString('en');

    d3.select('.chartElement')
      .selectAll('*')
      .remove();

    // Create the SVG container.
    const svg = d3.select('.chartElement')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500')
      .attr('style', 'max-width: 100%; height: auto;');

    // Append a group for each series
    console.log('data svg', svg);
    svg.append('g')
      .selectAll()
      .data(d3.group(data, (d) => d.name))
      .join('g')
      .attr('transform', ([name]) => `translate(${fx(name)},0)`)
      .selectAll()
      .data(([, d]) => d)
      .join('rect')
      .attr('x', (d) => x(d.label))
      .attr('width', x.bandwidth())
      .attr('y', y(0) - 4)
      .attr('height', 4)
      .attr('fill', (d) => color(d.label));

    svg.append('g')
      .selectAll()
      .data(d3.group(data, (d) => d.name))
      .join('g')
      .attr('transform', ([name]) => `translate(${fx(name)},0)`)
      .selectAll()
      .data(([, d]) => d)
      .join('rect')
      .attr('x', (d) => x(d.label))
      .attr('width', x.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', (d) => color(d.label))
      .attr('class', 'bar');


    svg.selectAll('.bar')
      .transition()
      .duration(800)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => y(0) - y(d.value));

    // Append the horizontal axis.
    svg.append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .attr('style', 'font-size: 0.8rem')
      .call(d3.axisBottom(fx).tickSizeOuter(0))
      .call((g) => g.selectAll('.domain').remove());

    // Append the vertical axis.
    svg.append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'))
      .call((g) => g.selectAll('.domain').remove());
  };


  return (
    <>
      <div className="chartElement" />
      <RowWrapper sx={{ justifyContent: 'start' }}>
        <ColumnWrapper>
          <RowWrapper sx={{ alignItems: 'center' }} overflow="auto" flexWrap="wrap">
            {colors.map((value, i) => {
              return (
                <ColumnWrapper margin={3} key={i} alignItems="center" sx={{ flexDirection: 'row' }}>
                  <FiberManualRecordIcon sx={{ color: value.color, fontSize: '1rem' }} />
                  <TextStyle weight={700} color="primary.text" marginLeft={1} sx={{ fontSize: '0.875rem' }}>
                    {value.label}
                  </TextStyle>
                </ColumnWrapper>
              );
            })}

          </RowWrapper>
        </ColumnWrapper>
      </RowWrapper>
    </>
  );
};


export default GroupedBarChart;
