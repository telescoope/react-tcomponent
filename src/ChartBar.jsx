import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartBar(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-bar'
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
      type='bar'
      width='50%'
    />
  )
}

export default ChartBar
