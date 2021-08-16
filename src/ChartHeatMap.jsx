import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartHeatMap(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-heatmap'
        },
        candlestick: {
          wick: {
            useFillColor: true
          }
        }
      }}
      series={[
        {
          name: 'Series 1',
          data: [
            {
              x: 'W1',
              y: 22
            },
            {
              x: 'W2',
              y: 29
            },
            {
              x: 'W3',
              y: 13
            },
            {
              x: 'W4',
              y: 32
            }
          ]
        },
        {
          name: 'Series 2',
          data: [
            {
              x: 'W1',
              y: 43
            },
            {
              x: 'W2',
              y: 43
            },
            {
              x: 'W3',
              y: 43
            },
            {
              x: 'W4',
              y: 43
            }
          ]
        }
      ]}
      type='heatmap'
      width='50%'
    />
  )
}

export default ChartHeatMap
