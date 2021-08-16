import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartBar(props) {
  return (
    <ApexCharts
      options={{
        colors: ['#7638ff', '#fda600'],
        chart: {
          type: 'bar',
          fontFamily: 'Poppins, sans-serif',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct'
          ]
        },
        yaxis: {
          title: {
            text: 'IDR (juta)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return 'IDR ' + val + ' '
            }
          }
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
      series={[
        {
          name: 'Received',
          type: 'column',
          data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50]
        },
        {
          name: 'Pending',
          type: 'column',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 80]
        }
      ]}
      type='bar'
      width='50%'
    />
  )
}

export default ChartBar
