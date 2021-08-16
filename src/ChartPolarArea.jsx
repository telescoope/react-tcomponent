import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartPolarArea(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          type: 'polarArea'
        },
        stroke: {
          colors: ['#fff']
        },
        fill: {
          opacity: 0.8
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      }}
      series={[14, 23, 21, 17, 15, 10, 12, 17, 21]}
      type='polarArea'
      width='50%'
    />
  )
}

export default ChartPolarArea
