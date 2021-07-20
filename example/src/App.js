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
  Field
} from 'react-tcomponent'

import { defaultFilterData, secureData, setAuthHeader } from 'tcomponent'

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import 'tcomponent/dist/index.css'

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

  return (
    <div style={{ padding: '0px 20px' }}>
      <h1>tcomponent - telescoope.org</h1>
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
        primaryKey='id'
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
      <InputText name='teks' type='text' className='form-control' />
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
      </Field>
    </div>
  )
}

export default App
