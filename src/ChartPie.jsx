import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartPie(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-pie'
        },
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
      }}
      series={[44, 55, 13, 33]}
      type='pie'
      width='50%'
    />
  )
}

export default ChartPie
