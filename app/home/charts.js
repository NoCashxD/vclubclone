// Import necessary libraries
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const MyChart = () => {
  // Define the chart options
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Current month Averages Purchases',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: 'Quantity',
      },
    },
    series: [
      {
        name: 'All Periods',
        data: [0,0,0,0,0,0,0,0,0,0,0,0],
      },
    ],
  };

  // Render the chart using HighchartsReact
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default MyChart;
