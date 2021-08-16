import React from 'react'
import ApexCharts from 'react-apexcharts'

function ChartRadar(props) {
  return (
    <ApexCharts
      options={{
        chart: {
          id: 'basic-radar'
        },
        labels: ['April', 'May', 'June', 'July', 'August', 'September']
      }}
      series={[
        {
          name: 'Radar Series 1',
          data: [45, 52, 38, 24, 33, 10]
        },
        {
          name: 'Radar Series 2',
          data: [26, 21, 20, 6, 8, 15]
        }
      ]}
      type='radar'
      width='50%'
    />
  )
}

export default ChartRadar
