import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartCandleStick(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-candlestick'
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
            [1538856000000, [6593.34, 6600, 6582.63, 6600]],
            [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]]
          ]
        }
      ]}
      type='candlestick'
      width='50%'
    />
  )
}

export default ChartCandleStick
