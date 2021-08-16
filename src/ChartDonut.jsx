import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartDonut(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-donut'
        },
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
      }}
      series={[44, 55, 13, 33]}
      type='donut'
      width='50%'
    />
  )
}

export default ChartDonut
