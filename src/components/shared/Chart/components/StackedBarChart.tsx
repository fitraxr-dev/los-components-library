import React, { useEffect } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import * as d3 from 'd3';

import ColumnWrapper from '../../ColumnWrapper';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import type { StackedBarChartProps } from '../Chart.types';


const StackedBarChart = ({ chart_data }: StackedBarChartProps) => {

  const colors = chart_data?.barLabel?.map((label) => { return { color: label.color, label: label.label }; });


  //initiate the function to render
  useEffect(() => {
    draw(chart_data);
  }, [chart_data]);

  const draw = (paramData) => {
    const width = 960;
    const height = 480;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 20;
    const marginLeft = 40;


    /////Merge the provided data to fullfill the structure requirement
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

    // Determine the series that need to be stacked.
    const series = d3.stack()
      .keys(d3.union(data.map((d) => d.label))) // distinct series keys, in input order
      .value(([, D], key) => D.get(key).value) // get value for each series key and stack
      (d3.index(data, (d) => d.name, (d) => d.label)); // group by stack then series key

    // Prepare the scales for positional and color encodings.
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedData = data.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

    const x = d3.scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([marginLeft, width - marginRight])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(colors.map((d) => d.color))
      .unknown('#ccc');

    // A function to format the value in the tooltip.
    const formatValue = (x) => isNaN(x) ? 'N/A' : x.toLocaleString('en');

    // remove old child/chart element when data updated
    d3.select('.chartElement')
      .selectAll('*')
      .remove();

    // Create the SVG container.
    const svg = d3.select('.chartElement')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500')
      .attr('style', 'max-width: 100%; height: auto;');

    // Append a group for each series, and a rect for each element in the series.
    svg.append('g')
      .selectAll()
      .data(series)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((D) => D.map((d) => (d.key = D.key, d)))
      .join('rect')
      .attr('x', (d) => x(d.data[0]))
      //y and height is set to zero for transition need
      .attr('height', 0)
      .attr('y', height - 20)
      .attr('width', x.bandwidth())
      .append('title')
      .text((d) => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).value)}`);

    //Transition Animation
    svg.selectAll('rect')
      .transition()
      .duration(800)
      //actual height of bar
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]));

    // Define the positions for vertical lines (aligned with labels on x-axis)
    const verticalLinePositions = d3.union(data.map((d) => x(d.name) + ((x.bandwidth() + x.bandwidth() / 4) - 75)));
    const maxVerticalLinePosition = Math.max(...verticalLinePositions);
    const offset = 73.98373983739839; // Adjust the offset as needed
    const extraVerticalLinePosition = maxVerticalLinePosition + offset;

    // Append vertical lines to the SVG container
    svg.selectAll('.vertical-line')
      .data(verticalLinePositions)
      .enter()
      .append('line')
      .attr('class', 'vertical-line')
      .attr('x1', (d) => d)
      .attr('y1', 0)
      .attr('x2', (d) => d)
      .attr('y2', height - 20)
      .attr('stroke', '#F0F3FB')
      .attr('stroke-width', 1);

    // Append the extra vertical line to the SVG container
    svg.append('line')
      .attr('class', 'extra-vertical-line')
      .attr('x1', extraVerticalLinePosition)
      .attr('y1', 0)
      .attr('x2', extraVerticalLinePosition)
      .attr('y2', height - 20)
      .attr('stroke', '#F0F3FB')
      .attr('stroke-width', 1);

    // Append a rectangle for the top border & bottom
    svg.append('rect')
      .attr('x', 52)
      .attr('y', 0)
      .attr('width', width - 72)
      .attr('height', 1)
      .attr('fill', '#F0F3FB');

    svg.append('rect')
      .attr('x', 52)
      .attr('y', height - 20)
      .attr('width', width - 72)
      .attr('height', 1)
      .attr('fill', '#F0F3FB');


    // Append the horizontal axis.
    svg.append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .attr('style', 'font-size: 1.20vw')
      .call(d3.axisBottom(x).tickSizeOuter(0))
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
                <ColumnWrapper margin={3} marginTop={0} key={i} alignItems="center" sx={{ flexDirection: 'row' }}>
                  <FiberManualRecordIcon sx={{ color: value.color, fontSize: '0.9vw' }} />
                  <TextStyle weight={700} color="primary.text" marginLeft={1} sx={{ fontSize: '1.20vw' }}>
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


export default StackedBarChart;
