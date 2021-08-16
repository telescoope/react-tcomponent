import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartLine(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-line'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      }}
      series={[
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]}
      type='line'
      width='50%'
    />
  )
}

export default ChartLine
