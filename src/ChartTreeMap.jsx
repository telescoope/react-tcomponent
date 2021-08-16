import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartTreeMap(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-treemap'
        },
        candlestick: {
          wick: {
            useFillColor: true
          }
        }
      }}
      series={[
        {
          data: [
            {
              x: 'New Delhi',
              y: 218
            },
            {
              x: 'Kolkata',
              y: 149
            },
            {
              x: 'Mumbai',
              y: 184
            },
            {
              x: 'Ahmedabad',
              y: 55
            },
            {
              x: 'Bangaluru',
              y: 84
            },
            {
              x: 'Pune',
              y: 31
            },
            {
              x: 'Chennai',
              y: 70
            }
          ]
        }
      ]}
      type='treemap'
      width='50%'
    />
  )
}

export default ChartTreeMap
