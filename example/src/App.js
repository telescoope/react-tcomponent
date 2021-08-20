import React, { useState, useEffect } from 'react'

import {
  InputColor,
  InputText,
  InputNumber,
  InputChoose,
  InputFile,
  DataTable,
  InputDate,
  InputDateTime,
  InputSelect,
  InputTag,
  InputTime,
  InputYear,
  InputWorkflow,
  Loading,
  LoadingOverlay,
  InputSelectFetch,
  Field,
  ChartLine,
  ChartBar,
  ChartArea,
  ChartCandleStick,
  ChartHeatMap,
  ChartTreeMap,
  ChartPie,
  ChartDonut,
  ChartRadar,
  ChartRange,
  ChartBubble,
  ChartPolarArea,
  ChartRadial,
  ChartScatter,
  ChartBoxPlot
} from 'react-tcomponent'

import { defaultFilterData, secureData, setAuthHeader } from 'tcomponent'

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import 'react-tcomponent/dist/index.css'

function App() {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [list, setList] = useState([])

  const [dataSatu, setDataSatu] = useState([
    {
      value: 1,
      label: null
    },
    {
      value: 2,
      label: null
    },
    {
      value: 3,
      label: null
    },
    {
      value: 4,
      label: null
    },
    {
      value: 5,
      label: null
    }
  ])

  const filter = useSelector((state) => state.core.filter) || {}

  const auth = useSelector((state) => state.auth) || {}

  function onReload() {
    const { page, load, keyword, sorted, search } = defaultFilterData(
      filter,
      [],
      'slider'
    )

    const url = process.env.REACT_APP_API_URL + '/slider?'

    const options = {
      data: secureData({
        page,
        load,
        keyword,
        sorted,
        search
      }),
      method: 'POST',
      headers: setAuthHeader(auth),
      url
    }

    setLoading(true)

    axios(options)
      .then((response) => {
        setLoading(false)
        setList(response.data.data)
        // console.log(response.data)
      })
      .catch((error) => {
        setLoading(false)
        // console.log(error)
      })
  }

  useEffect(() => {
    /*
    setInterval(() => {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: 'field',
          value: Math.floor(Math.random() * 101)
        }
      })

      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: 'texteditor',
          value: Math.floor(Math.random() * 1001)
        }
      })

      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: 'coba[221]',
          value: Math.floor(Math.random() * 101)
        }
      })
      setDataSatu([
        {
          value: Math.floor(Math.random() * 101),
          label: null
        },
        {
          value: Math.floor(Math.random() * 101),
          label: null
        },
        {
          value: Math.floor(Math.random() * 101),
          label: null
        }
      ])
    }, 5000)
    */
  }, [])

  // console.log(dataSatu)

  function clearData() {
    dispatch({
      type: 'RESET_INPUT',
      payload: null
    })

    dispatch({
      type: 'RESET_PARAMETER',
      payload: null
    })

    dispatch({
      type: 'RESET_FILTER',
      payload: null
    })
  }

  function generateData(count, yrange) {
    var i = 0
    var series = []
    while (i < count) {
      var x = 'w' + (i + 1).toString()
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

      series.push({
        x: x,
        y: y
      })
      i++
    }
    return series
  }

  /*
  // this function will generate output in this format
  // every array in data is of the format [x, y, z] where x (timestamp) and y are the two axes coordinates,
  // z is the third coordinate, which you can interpret as the size of the bubble formed too.
  // data = [
     [timestamp, 23, 10],
     [timestamp, 33, 11],
     [timestamp, 12, 8]
      ...
  ]
  */
  function generateDataBubble(baseval, count, yrange) {
    var i = 0
    var series = []
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

      series.push([x, y, z])
      baseval += 86400000
      i++
    }
    return series
  }

  return (
    <div style={{ padding: '0px 20px' }}>
      <h1>react-tcomponent - telescoope.org</h1>
      <h4>Clear Data</h4>
      <button onClick={clearData}>Hapus data</button>
      <h4>Contoh Color</h4>
      <InputColor className='form-control' name='warna' />
      <InputColor className='form-control' name='warna_multiple[satu]' />
      <h4>Contoh Loading</h4>
      <Loading />
      <h4>Contoh LoadingOverlay</h4>
      <LoadingOverlay isLoading={loading}>
        <div style={{ height: 48 }}>Konten</div>
      </LoadingOverlay>

      <h4>Contoh Workflow</h4>
      <InputWorkflow
        isReadonly={false}
        isLoading={loading}
        doAfterSubmit={() => null}
        doSubmit={() => null}
        doCancel={() => null}
        relation='pendidikan'
        id={1}
      />
      <h4>Contoh Tag</h4>
      <InputTag
        className='form-control'
        name='tag'
        isCreateable
        options={[
          { id: 1, nama: 'A' },
          { id: 2, nama: 'B' },
          { id: 3, nama: 'C' }
        ]}
        optionValue='nama'
      />
      <InputTag
        className='form-control'
        name='tag_multiple[satu]'
        isCreateable
        options={[
          { id: 1, nama: 'A' },
          { id: 2, nama: 'B' },
          { id: 3, nama: 'C' }
        ]}
        optionValue='nama'
      />
      <h4>Contoh Pilihan</h4>
      <InputSelect
        name='choose[122]'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <br />
      <InputSelect
        isMultiple
        name='choose_multiple_multi[aaa]'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <br />
      <InputSelect
        isMultiple
        name='choose_multiple'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <br />
      <InputSelect
        name='choose_single'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <h4>Contoh InputSelectFetch</h4>
      <InputSelectFetch
        className='form-control'
        parameter={{}}
        optionValue={{ id: 'slider_id' }}
        defaultValue={dataSatu[0]}
        primaryKey='kode'
        url='slider'
        separator=' - '
        optionLabel={['kode', 'slider_foto_attachment']}
        name='slider'
      />
      <InputSelectFetch
        className='form-control'
        parameter={{}}
        optionValue={{ id: 'slider_id' }}
        defaultValue={dataSatu[1]}
        primaryKey='id'
        url='slider'
        separator=' - '
        optionLabel={['kode', 'slider_foto_attachment']}
        name='slider_multiple[satu]'
      />
      <InputSelectFetch
        className='form-control'
        parameter={{}}
        optionValue={{ id: 'slider_id' }}
        defaultValue={dataSatu}
        isMultiple
        primaryKey='id'
        url='slider'
        separator=' - '
        optionLabel={['kode', 'slider_foto_attachment']}
        name='slider2'
      />
      <InputSelectFetch
        className='form-control'
        parameter={{}}
        optionValue={{ id: 'slider_id' }}
        defaultValue={dataSatu}
        isMultiple
        primaryKey='id'
        url='slider'
        separator=' - '
        optionLabel={['kode', 'slider_foto_attachment']}
        name='slider2_multiple[satu]'
      />
      <InputSelectFetch
        className='form-control'
        parameter={{}}
        optionValue={{ id: 'slider_id' }}
        defaultValue={dataSatu}
        isMultiple
        isReadonly
        primaryKey='id'
        url='slider'
        separator=' - '
        optionLabel={['kode', 'slider_foto_attachment']}
        name='slider3_multiple[satu]'
      />
      <InputSelectFetch
        className='form-control'
        isMultiple
        // parameter={{}}
        // optionValue={{ id: 'slider_id' }}
        // defaultValue={{
        //   value: null,
        //   label: null
        // }}
        primaryKey='id'
        url='slider'
        separator=' - '
        optionLabel={['kode']}
        name='role'
      />
      <h4>Contoh Waktu</h4>
      <InputTime name='waktu' isRange />
      <InputTime name='waktu_multi[satu]' isRange />
      <h4>Contoh Tahun</h4>
      <InputYear name='tahun' isRange />
      <InputYear name='tahun_multi[satu]' isRange />
      <h4>Contoh Tanggal Waktu</h4>
      <InputDateTime name='tanggalwaktu' isRange />
      <InputDateTime name='tanggalwaktu_multi[satu]' isRange />
      <h4>Contoh Tanggal</h4>
      <InputDate name='tanggal' isRange />
      <InputDate name='tanggal_multi[satu]' isRange />
      <h4>Contoh Tanggal Readonly</h4>
      <InputDate name='tanggal' isReadonly isRange />
      <br />
      <InputDate name='tanggal_multi[satu]' isReadonly isRange />
      <h4>Contoh DataTable</h4>
      <DataTable
        selectable='multiple'
        data={list}
        isLoading={loading}
        name='slider'
        primaryKey='id'
        isSearchable
        isColumnsSearchable
        onReload={onReload}
        action={[
          {
            label: 'Lihat',
            onClick: (data) => console.log('LIHAT', data)
          },
          {
            label: 'Ubah',
            onClick: (data) => console.log('UBAH', data)
          },
          {
            label: 'Hapus',
            onClick: (data) => console.log('HAPUS', data)
          },
          {
            label: 'Lihat',
            onClick: (data) => console.log('LIHAT', data)
          },
          {
            label: 'Ubah',
            onClick: (data) => console.log('UBAH', data)
          },
          {
            label: 'Hapus',
            onClick: (data) => console.log('HAPUS', data)
          }
        ]}
        columns={[
          {
            Header: 'Kode',
            id: 'kode',
            accessor: (d) => d.kode
          },
          /*
          {
            Header: 'Slide',
            id: 'slide',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide2',
            id: 'slide2',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide3',
            id: 'slide3',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide4',
            id: 'slide4',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide5',
            id: 'slide5',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide6',
            id: 'slide6',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          {
            Header: 'Slide7',
            id: 'slide7',
            accessor: (d) =>
              d.kode +
              d.kode +
              d.kode +
              d.kode +
              d.kode +
              d.kode +
              d.kode +
              d.kode +
              d.kode
          },
          {
            Header: 'Slide8',
            id: 'slide8',
            accessor: (d) => d.kode + d.kode + d.kode
          },
          */
          {
            Header: 'Lampiran',
            id: 'slider_foto_attachment',
            accessor: (d) => d.slider_foto_attachment
          },
          {
            Header: 'Status',
            id: 'status',
            accessor: (d) => d.status
          }
        ]}
      />
      <h4>Contoh File</h4>
      <InputFile preview name='file' />
      <InputFile preview name='file_multi[a]' />
      <h4>Contoh File Multiple</h4>
      <InputFile preview name='filemultiple' isMultiple />
      <InputFile preview name='filemultiple_multi[a]' isMultiple />
      <h4>Contoh Choose Single</h4>
      <InputChoose
        name='choose_single[satu]'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <InputChoose
        name='choose_single'
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <h4>Contoh Choose Multiple</h4>
      <InputChoose
        name='choose_multiple'
        isMultiple
        disabled
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <InputChoose
        name='choose_multiple_multi[200]'
        isMultiple
        options={[
          { id: '1', nama: 'Disetujui' },
          { id: '2', nama: 'Ditolak' },
          { id: '3', nama: 'Menunggu Persetujuan' }
        ]}
        separator='-'
        optionLabel={['nama']}
        optionValue='nama'
      />
      <h4>Contoh Text</h4>
      <Field
        labelSize={5}
        inputSize={7}
        label='Nomor Telepon'
        errorMessage='Error disini'
      >
        <InputText name='teks' type='text' className='form-control' />
      </Field>
      <InputText name='teks_multi[satu]' type='text' className='form-control' />
      <h4>Contoh Text Area</h4>
      <InputText name='teksarea' type='textarea' className='form-control' />
      <InputText
        name='teksarea_multi[satu]'
        type='textarea'
        className='form-control'
      />
      <h4>Contoh Text Editor</h4>
      <InputText name='texteditor' type='texteditor' className='form-control' />
      <InputText
        name='texteditor'
        isReadonly
        type='texteditor'
        className='form-control'
      />
      <InputText
        name='texteditor_multi[satu]'
        type='texteditor'
        className='form-control'
      />
      <h4>Contoh Equation</h4>
      <InputText name='equation' type='equation' className='form-control' />
      <InputText
        name='equation_multi[satu]'
        type='equation'
        className='form-control'
      />
      <h4>Contoh Field & Number </h4>

      <Field
        labelSize={5}
        inputSize={7}
        label='Nomor Telepon'
        errorMessage='Error disini'
      >
        <InputText name='phone' type='phone' className='form-control' />
      </Field>
      <InputNumber
        name='field'
        // maxValue={10000}
        isReadonly
        type='text'
        className='form-control'
      />
      <InputNumber
        name='coba[221]'
        // maxValue={10000}
        type='text'
        className='form-control'
      />

      <InputNumber
        name='coba[221]'
        // maxValue={10000}
        isReadonly
        type='text'
        className='form-control'
      />
      <ChartLine
        name='keuntungan_kerugian_line'
        options={[
          {
            warna: '#00ff00',
            nama: 'Revenue',
            jumlah: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          },
          {
            warna: '#ff0000',
            nama: 'Cost',
            jumlah: [10, 20, 60, 3, 62, 14, 11, 20, 60]
          }
        ]}
        title={{
          text: 'Chart Line'
        }}
        subtitle={{
          text: 'Keuntungan dan Kerugian'
        }}
        optionValue={{ nama: 'name', jumlah: 'data' }}
        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
        separator=' - '
        optionColor='warna'
      />
      <ChartBar
        name='keuntungan_kerugian_bar'
        options={[
          {
            warna: '#00ff00',
            nama: 'Revenue',
            jumlah: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          },
          {
            warna: '#ff0000',
            nama: 'Cost',
            jumlah: [10, 20, 60, 3, 62, 14, 11, 20, 60]
          }
        ]}
        title={{
          text: 'Chart Bar'
        }}
        plotOptions={{
          borderRadius: 4,
          horizontal: true
        }}
        subtitle={{
          text: 'Keuntungan dan Kerugian'
        }}
        optionValue={{ nama: 'name', jumlah: 'data' }}
        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
        separator=' - '
        optionColor='warna'
      />
      <ChartArea
        name='keuntungan_kerugian_area'
        options={[
          {
            warna: '#00ff00',
            nama: 'Revenue',
            jumlah: [31, 40, 28, 51, 42, 109, 100]
          },
          {
            warna: '#ff0000',
            nama: 'Cost',
            jumlah: [11, 32, 45, 32, 34, 52, 41]
          }
        ]}
        dataLabels={{
          enabled: false
        }}
        title={{
          text: 'Chart Area'
        }}
        subtitle={{
          text: 'Keuntungan dan Kerugian'
        }}
        optionValue={{ nama: 'name', jumlah: 'data' }}
        stroke={{
          curve: 'smooth'
        }}
        xaxis={{
          type: 'datetime',
          categories: [
            '2018-09-19T00:00:00.000Z',
            '2018-09-19T01:30:00.000Z',
            '2018-09-19T02:30:00.000Z',
            '2018-09-19T03:30:00.000Z',
            '2018-09-19T04:30:00.000Z',
            '2018-09-19T05:30:00.000Z',
            '2018-09-19T06:30:00.000Z'
          ]
        }}
        tooltip={{
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }}
        separator=' - '
        optionColor='warna'
      />
      <ChartCandleStick
        name='saham_candle_stick'
        subtitle={{
          text: 'Pergerakan Saham Telescoope'
        }}
        options={[
          {
            data: [
              {
                x: new Date(1538778600000),
                y: [6629.81, 6650.5, 6623.04, 6633.33]
              },
              {
                x: new Date(1538780400000),
                y: [6632.01, 6643.59, 6620, 6630.11]
              },
              {
                x: new Date(1538782200000),
                y: [6630.71, 6648.95, 6623.34, 6635.65]
              },
              {
                x: new Date(1538784000000),
                y: [6635.65, 6651, 6629.67, 6638.24]
              },
              {
                x: new Date(1538785800000),
                y: [6638.24, 6640, 6620, 6624.47]
              },
              {
                x: new Date(1538787600000),
                y: [6624.53, 6636.03, 6621.68, 6624.31]
              },
              {
                x: new Date(1538789400000),
                y: [6624.61, 6632.2, 6617, 6626.02]
              },
              {
                x: new Date(1538791200000),
                y: [6627, 6627.62, 6584.22, 6603.02]
              },
              {
                x: new Date(1538793000000),
                y: [6605, 6608.03, 6598.95, 6604.01]
              },
              {
                x: new Date(1538794800000),
                y: [6604.5, 6614.4, 6602.26, 6608.02]
              },
              {
                x: new Date(1538796600000),
                y: [6608.02, 6610.68, 6601.99, 6608.91]
              },
              {
                x: new Date(1538798400000),
                y: [6608.91, 6618.99, 6608.01, 6612]
              },
              {
                x: new Date(1538800200000),
                y: [6612, 6615.13, 6605.09, 6612]
              },
              {
                x: new Date(1538802000000),
                y: [6612, 6624.12, 6608.43, 6622.95]
              },
              {
                x: new Date(1538803800000),
                y: [6623.91, 6623.91, 6615, 6615.67]
              },
              {
                x: new Date(1538805600000),
                y: [6618.69, 6618.74, 6610, 6610.4]
              },
              {
                x: new Date(1538807400000),
                y: [6611, 6622.78, 6610.4, 6614.9]
              },
              {
                x: new Date(1538809200000),
                y: [6614.9, 6626.2, 6613.33, 6623.45]
              },
              {
                x: new Date(1538811000000),
                y: [6623.48, 6627, 6618.38, 6620.35]
              },
              {
                x: new Date(1538812800000),
                y: [6619.43, 6620.35, 6610.05, 6615.53]
              },
              {
                x: new Date(1538814600000),
                y: [6615.53, 6617.93, 6610, 6615.19]
              },
              {
                x: new Date(1538816400000),
                y: [6615.19, 6621.6, 6608.2, 6620]
              },
              {
                x: new Date(1538818200000),
                y: [6619.54, 6625.17, 6614.15, 6620]
              },
              {
                x: new Date(1538820000000),
                y: [6620.33, 6634.15, 6617.24, 6624.61]
              },
              {
                x: new Date(1538821800000),
                y: [6625.95, 6626, 6611.66, 6617.58]
              },
              {
                x: new Date(1538823600000),
                y: [6619, 6625.97, 6595.27, 6598.86]
              },
              {
                x: new Date(1538825400000),
                y: [6598.86, 6598.88, 6570, 6587.16]
              },
              {
                x: new Date(1538827200000),
                y: [6588.86, 6600, 6580, 6593.4]
              },
              {
                x: new Date(1538829000000),
                y: [6593.99, 6598.89, 6585, 6587.81]
              },
              {
                x: new Date(1538830800000),
                y: [6587.81, 6592.73, 6567.14, 6578]
              },
              {
                x: new Date(1538832600000),
                y: [6578.35, 6581.72, 6567.39, 6579]
              },
              {
                x: new Date(1538834400000),
                y: [6579.38, 6580.92, 6566.77, 6575.96]
              },
              {
                x: new Date(1538836200000),
                y: [6575.96, 6589, 6571.77, 6588.92]
              },
              {
                x: new Date(1538838000000),
                y: [6588.92, 6594, 6577.55, 6589.22]
              },
              {
                x: new Date(1538839800000),
                y: [6589.3, 6598.89, 6589.1, 6596.08]
              },
              {
                x: new Date(1538841600000),
                y: [6597.5, 6600, 6588.39, 6596.25]
              },
              {
                x: new Date(1538843400000),
                y: [6598.03, 6600, 6588.73, 6595.97]
              },
              {
                x: new Date(1538845200000),
                y: [6595.97, 6602.01, 6588.17, 6602]
              },
              {
                x: new Date(1538847000000),
                y: [6602, 6607, 6596.51, 6599.95]
              },
              {
                x: new Date(1538848800000),
                y: [6600.63, 6601.21, 6590.39, 6591.02]
              },
              {
                x: new Date(1538850600000),
                y: [6591.02, 6603.08, 6591, 6591]
              },
              {
                x: new Date(1538852400000),
                y: [6591, 6601.32, 6585, 6592]
              },
              {
                x: new Date(1538854200000),
                y: [6593.13, 6596.01, 6590, 6593.34]
              },
              {
                x: new Date(1538856000000),
                y: [6593.34, 6604.76, 6582.63, 6593.86]
              },
              {
                x: new Date(1538857800000),
                y: [6593.86, 6604.28, 6586.57, 6600.01]
              },
              {
                x: new Date(1538859600000),
                y: [6601.81, 6603.21, 6592.78, 6596.25]
              },
              {
                x: new Date(1538861400000),
                y: [6596.25, 6604.2, 6590, 6602.99]
              },
              {
                x: new Date(1538863200000),
                y: [6602.99, 6606, 6584.99, 6587.81]
              },
              {
                x: new Date(1538865000000),
                y: [6587.81, 6595, 6583.27, 6591.96]
              },
              {
                x: new Date(1538866800000),
                y: [6591.97, 6596.07, 6585, 6588.39]
              },
              {
                x: new Date(1538868600000),
                y: [6587.6, 6598.21, 6587.6, 6594.27]
              },
              {
                x: new Date(1538870400000),
                y: [6596.44, 6601, 6590, 6596.55]
              },
              {
                x: new Date(1538872200000),
                y: [6598.91, 6605, 6596.61, 6600.02]
              },
              {
                x: new Date(1538874000000),
                y: [6600.55, 6605, 6589.14, 6593.01]
              },
              {
                x: new Date(1538875800000),
                y: [6593.15, 6605, 6592, 6603.06]
              },
              {
                x: new Date(1538877600000),
                y: [6603.07, 6604.5, 6599.09, 6603.89]
              },
              {
                x: new Date(1538879400000),
                y: [6604.44, 6604.44, 6600, 6603.5]
              },
              {
                x: new Date(1538881200000),
                y: [6603.5, 6603.99, 6597.5, 6603.86]
              },
              {
                x: new Date(1538883000000),
                y: [6603.85, 6605, 6600, 6604.07]
              },
              {
                x: new Date(1538884800000),
                y: [6604.98, 6606, 6604.07, 6606]
              }
            ]
          }
        ]}
        title={{
          text: 'Chart Candle Stick',
          align: 'left'
        }}
        xaxis={{
          type: 'datetime'
        }}
        yaxis={{
          tooltip: {
            enabled: true
          }
        }}
        optionValue={{ data: 'data' }}
        separator=' - '
        optionColor='warna'
      />
      <ChartHeatMap
        options={[
          {
            name: 'Metric1',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric2',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric3',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric4',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric5',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric6',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric7',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric8',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          },
          {
            name: 'Metric9',
            data: generateData(18, {
              min: 0,
              max: 90
            })
          }
        ]}
        title={{
          text: 'Chart Heat Map'
        }}
        subtitle={{
          text: 'Peminat kotak kotak'
        }}
        optionValue={{ data: 'data', name: 'name' }}
        separator=' - '
      />
      <ChartTreeMap
        options={[
          {
            data: [
              {
                x: 'New Delhi',
                y: 218
              },
              {
                x: 'Kolkata',
                y: 149
              },
              {
                x: 'Mumbai',
                y: 184
              },
              {
                x: 'Ahmedabad',
                y: 55
              },
              {
                x: 'Bangaluru',
                y: 84
              },
              {
                x: 'Pune',
                y: 31
              },
              {
                x: 'Chennai',
                y: 70
              },
              {
                x: 'Jaipur',
                y: 30
              },
              {
                x: 'Surat',
                y: 44
              },
              {
                x: 'Hyderabad',
                y: 68
              },
              {
                x: 'Lucknow',
                y: 28
              },
              {
                x: 'Indore',
                y: 19
              },
              {
                x: 'Kanpur',
                y: 29
              }
            ]
          }
        ]}
        title={{
          text: 'Chart Tree Map'
        }}
        subtitle={{
          text: 'Kotak kotak lagi'
        }}
        optionValue={{ data: 'data' }}
        separator=' - '
      />
      <ChartPie
        options={[
          { warna: '#7638ff', nama: 'Pizza', jumlah: 60 },
          { warna: '#ff737b', nama: 'Ketoprak', jumlah: 20 },
          { warna: '#fda600', nama: 'Nasi Goreng', jumlah: 30 },
          { warna: '#ccc', nama: 'Batu', jumlah: 10 }
        ]}
        title={{
          text: 'Chart Pie'
        }}
        subtitle={{
          text: 'Peminat berdasarkan makanan'
        }}
        optionValue='jumlah'
        optionLabel='nama'
        separator=' - '
        optionColor='warna'
      />
      <ChartDonut
        options={[
          { warna: '#7638ff', nama: 'Pizza', jumlah: 60 },
          { warna: '#ff737b', nama: 'Ketoprak', jumlah: 20 },
          { warna: '#fda600', nama: 'Nasi Goreng', jumlah: 30 },
          { warna: '#ccc', nama: 'Batu', jumlah: 10 }
        ]}
        title={{
          text: 'Chart Donut'
        }}
        subtitle={{
          text: 'Peminat berdasarkan makanan'
        }}
        optionValue='jumlah'
        optionLabel='nama'
        separator=' - '
        optionColor='warna'
      />
      <ChartRadar
        name='keuntungan_kerugian_radar'
        options={[
          {
            warna: '#00ff00',
            nama: 'Revenue',
            jumlah: [10, 41, 35, 51, 49, 62]
          },
          {
            warna: '#ff0000',
            nama: 'Cost',
            jumlah: [10, 20, 60, 3, 62, 14]
          }
        ]}
        title={{
          text: 'Chart Radar'
        }}
        subtitle={{
          text: 'Keuntungan dan Kerugian'
        }}
        optionValue={{ nama: 'name', jumlah: 'data' }}
        labels={['STR', 'AGI', 'VIT', 'INT', 'DEX', 'LUK']}
        separator=' - '
        optionColor='warna'
      />
      <ChartRange
        name='saham_range'
        subtitle={{
          text: 'Pergerakan Saham Telescoope'
        }}
        options={[
          {
            data: [
              {
                x: 'TEAM A',
                y: [65, 96]
              },
              {
                x: 'TEAM B',
                y: [55, 78]
              },
              {
                x: 'TEAM C',
                y: [95, 186]
              }
            ]
          }
        ]}
        title={{
          text: 'Chart Range'
        }}
        optionValue={{ data: 'data' }}
        separator=' - '
      />
      <ChartBubble
        options={[
          {
            name: 'Bubble1',
            data: generateDataBubble(
              new Date('11 Feb 2017 GMT').getTime(),
              20,
              {
                min: 10,
                max: 60
              }
            )
          },
          {
            name: 'Bubble2',
            data: generateDataBubble(
              new Date('11 Feb 2017 GMT').getTime(),
              20,
              {
                min: 10,
                max: 60
              }
            )
          },
          {
            name: 'Bubble3',
            data: generateDataBubble(
              new Date('11 Feb 2017 GMT').getTime(),
              20,
              {
                min: 10,
                max: 60
              }
            )
          },
          {
            name: 'Bubble4',
            data: generateDataBubble(
              new Date('11 Feb 2017 GMT').getTime(),
              20,
              {
                min: 10,
                max: 60
              }
            )
          }
        ]}
        title={{
          text: 'Chart Bubble'
        }}
        subtitle={{
          text: 'Peminat bulet bulet'
        }}
        optionValue={{ data: 'data', name: 'name' }}
        separator=' - '
        height={350}
        dataLabels={{
          enabled: false
        }}
        fill={{
          opacity: 0.8
        }}
        xaxis={{
          tickAmount: 12,
          type: 'category'
        }}
        yaxis={{
          max: 70
        }}
      />
      <ChartPolarArea
        options={[
          { warna: '#7638ff', nama: 'Pizza', jumlah: 60 },
          { warna: '#ff737b', nama: 'Ketoprak', jumlah: 20 },
          { warna: '#fda600', nama: 'Nasi Goreng', jumlah: 30 },
          { warna: '#ccc', nama: 'Batu', jumlah: 10 }
        ]}
        title={{
          text: 'Chart Polar Area'
        }}
        subtitle={{
          text: 'Peminat berdasarkan makanan'
        }}
        optionValue='jumlah'
        optionLabel='nama'
        separator=' - '
        optionColor='warna'
      />
      <ChartRadial
        options={[
          { warna: '#7638ff', nama: 'Pizza', jumlah: 60 },
          { warna: '#ff737b', nama: 'Ketoprak', jumlah: 20 },
          { warna: '#fda600', nama: 'Nasi Goreng', jumlah: 30 },
          { warna: '#ccc', nama: 'Batu', jumlah: 10 }
        ]}
        title={{
          text: 'Chart Radial'
        }}
        subtitle={{
          text: 'Peminat berdasarkan makanan'
        }}
        optionValue='jumlah'
        optionLabel='nama'
        separator=' - '
        optionColor='warna'
      />
      <ChartScatter
        options={[
          {
            name: 'SAMPLE A',
            data: [
              [16.4, 5.4],
              [21.7, 2],
              [25.4, 3],
              [19, 2],
              [10.9, 1],
              [13.6, 3.2],
              [10.9, 7.4],
              [10.9, 0],
              [10.9, 8.2],
              [16.4, 0],
              [16.4, 1.8],
              [13.6, 0.3],
              [13.6, 0],
              [29.9, 0],
              [27.1, 2.3],
              [16.4, 0],
              [13.6, 3.7],
              [10.9, 5.2],
              [16.4, 6.5],
              [10.9, 0],
              [24.5, 7.1],
              [10.9, 0],
              [8.1, 4.7],
              [19, 0],
              [21.7, 1.8],
              [27.1, 0],
              [24.5, 0],
              [27.1, 0],
              [29.9, 1.5],
              [27.1, 0.8],
              [22.1, 2]
            ]
          },
          {
            name: 'SAMPLE B',
            data: [
              [36.4, 13.4],
              [1.7, 11],
              [5.4, 8],
              [9, 17],
              [1.9, 4],
              [3.6, 12.2],
              [1.9, 14.4],
              [1.9, 9],
              [1.9, 13.2],
              [1.4, 7],
              [6.4, 8.8],
              [3.6, 4.3],
              [1.6, 10],
              [9.9, 2],
              [7.1, 15],
              [1.4, 0],
              [3.6, 13.7],
              [1.9, 15.2],
              [6.4, 16.5],
              [0.9, 10],
              [4.5, 17.1],
              [10.9, 10],
              [0.1, 14.7],
              [9, 10],
              [12.7, 11.8],
              [2.1, 10],
              [2.5, 10],
              [27.1, 10],
              [2.9, 11.5],
              [7.1, 10.8],
              [2.1, 12]
            ]
          },
          {
            name: 'SAMPLE C',
            data: [
              [21.7, 3],
              [23.6, 3.5],
              [24.6, 3],
              [29.9, 3],
              [21.7, 20],
              [23, 2],
              [10.9, 3],
              [28, 4],
              [27.1, 0.3],
              [16.4, 4],
              [13.6, 0],
              [19, 5],
              [22.4, 3],
              [24.5, 3],
              [32.6, 3],
              [27.1, 4],
              [29.6, 6],
              [31.6, 8],
              [21.6, 5],
              [20.9, 4],
              [22.4, 0],
              [32.6, 10.3],
              [29.7, 20.8],
              [24.5, 0.8],
              [21.4, 0],
              [21.7, 6.9],
              [28.6, 7.7],
              [15.4, 0],
              [18.1, 0],
              [33.4, 0],
              [16.4, 0]
            ]
          }
        ]}
        title={{
          text: 'Chart Scatter'
        }}
        subtitle={{
          text: 'Peminat bulet bulet'
        }}
        optionValue={{ data: 'data', name: 'name' }}
        separator=' - '
        dataLabels={{
          enabled: false
        }}
        fill={{
          opacity: 0.8
        }}
        xaxis={{
          tickAmount: 12,
          type: 'category'
        }}
        yaxis={{
          max: 70
        }}
      />
      <ChartBoxPlot
        name='saham_range'
        subtitle={{
          text: 'Pergerakan Saham Telescoope'
        }}
        options={[
          {
            type: 'boxPlot',
            data: [
              {
                x: 'Jan 2015',
                y: [54, 66, 69, 75, 88]
              },
              {
                x: 'Jan 2016',
                y: [43, 65, 69, 76, 81]
              },
              {
                x: 'Jan 2017',
                y: [31, 39, 45, 51, 59]
              },
              {
                x: 'Jan 2018',
                y: [39, 46, 55, 65, 71]
              },
              {
                x: 'Jan 2019',
                y: [29, 31, 35, 39, 44]
              },
              {
                x: 'Jan 2020',
                y: [41, 49, 58, 61, 67]
              },
              {
                x: 'Jan 2021',
                y: [54, 59, 66, 71, 88]
              }
            ]
          }
        ]}
        title={{
          text: 'Chart Box Plot'
        }}
        optionValue={{ data: 'data', type: 'type' }}
        separator=' - '
      />
    </div>
  )
}

export default App
