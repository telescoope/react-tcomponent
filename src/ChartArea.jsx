import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartArea(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-area'
        },
        labels: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }}
      series={[
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]}
      type='area'
      width='50%'
    />
  )
}

export default ChartArea