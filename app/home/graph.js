import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import FloatingLoader from "../credit-cards/floating";

const Graph = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/api/data`)
      .then(response => {
        const fetchedData = response.data;
        console.log('Fetched Data:', fetchedData); // Log fetched data

        // Prepare data for Chart.js
        const labels = fetchedData.map((_, index) => `Point ${index + 1}`);
        const cvvData = fetchedData.map(item => item.cvv);
        const ssnData = fetchedData.map(item => item.ssn);
        const checkerData = fetchedData.map(item => item.checker);

        const chartData = {
          labels,
          datasets: [
            {
              label: 'CVV',
              data: cvvData,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
            {
              label: 'bins',
              data: ssnData,
              borderColor: 'rgba(153,102,255,1)',
              fill: false,
            },
            {
              label: 'Proxies',
              data: checkerData,
              borderColor: 'rgba(255,159,64,1)',
              fill: false,
            }
          ]
        };

        console.log('Chart Data:', chartData); // Log prepared chart data
        setData(chartData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (!data) {
    return <FloatingLoader visible={true} message="Loading chart data..." />;
  }

  return (
    <div className=''>
      <Line data={data} />
    </div>
  );
};

export default Graph;
