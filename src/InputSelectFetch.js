import React, { useEffect, useState, useRef } from 'react'

import {
  findIndex,
  filter as _filter,
  isNull,
  isUndefined,
  isEqual,
  map,
  isObject,
  uniq,
  isArray,
  isEmpty
} from 'lodash'

import {
  slug,
  findArrayName,
  secureData,
  setAuthHeader,
  useDebounce,
  defaultFilterData
} from 'tcomponent'

import Loading from './Loading'

import axios from 'axios'

import LoadingOverlay from './LoadingOverlay'

import { useIsVisible } from 'react-is-visible'

import { Button, Col, Row, Modal, Form, InputGroup } from 'react-bootstrap'

import { connect, useSelector, useDispatch } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTimes, faSync, faSearch } from '@fortawesome/free-solid-svg-icons'

import DataTableContainer from './DataTableContainer'

function ShowData(props) {
  let [val, setVal] = useState({})

  let [loading, setLoading] = useState(false)

  let {
    isMultiple,
    defaultValue,
    optionLabel,
    separator,
    primaryKey,
    id,
    param
  } = props

  let props_name = slug(props.name, '_')

  let key_select = slug('selected_' + props_name, '_')

  let dispatch = useDispatch()

  let auth = useSelector((state) => state.auth) || {}

  let input = useSelector((state) => state.core.input) || {}

  let filter = useSelector((state) => state.core.filter) || {}

  let parameter = useSelector((state) => state.core.parameter) || {}

  function labelGenerate(option) {
    if (isArray(optionLabel)) {
      let label = []

      separator = separator || ' | '

      for (let i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]])
        }
      }

      return label.join(separator)
    } else {
      return option[optionLabel] ? option[optionLabel] : ''
    }
  }

  useEffect(() => {
    let url = process.env.REACT_APP_API_URL + '/' + props.url

    let { keyword } = defaultFilterData(filter, [], props_name)

    let data = secureData({
      pkey: primaryKey,
      selected: [id],
      keyword,
      load: 1,
      page: 1,
      ...param
    })

    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    }
    setLoading(true)

    axios(options)
      .then((resp) => {
        setVal(resp.data.data.data[0])
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      })
  }, [id])

  function deleteData(d) {
    setVal(null)

    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let val = props.optionValue[key]

        dispatch({
          type: 'SET_INPUT',
          payload: { key: val, value: null }
        })
      })
    }

    if (isMultiple) {
      let new_input = _filter(findArrayName(props_name, input), function (o) {
        return o != d
      })

      let new_input_key = _filter(
        findArrayName(key_select, input),
        function (o) {
          return o != d
        }
      )

      let new_parameter = _filter(
        findArrayName(key_select, parameter),
        function (o) {
          return o[primaryKey] != d
        }
      )

      dispatch({
        type: 'SET_INPUT',
        payload: { key: props_name, value: new_input }
      })

      dispatch({
        type: 'SET_INPUT',
        payload: { key: key_select, value: new_input_key }
      })

      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value: new_parameter
        }
      })
    } else {
      dispatch({
        type: 'SET_INPUT',
        payload: { key: props_name, value: null }
      })

      dispatch({
        type: 'SET_INPUT',
        payload: { key: key_select, value: null }
      })

      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value: {}
        }
      })
    }
  }

  return (
    <React.Fragment>
      {val && !isUndefined(val) && !isEmpty(val) ? (
        [
          labelGenerate(val),
          !props.isReadonly && (
            <Button
              variant='link'
              size='sm'
              onClick={deleteData.bind(null, val[primaryKey])}
              style={{ borderRadius: 100, zIndex: 0 }}
            >
              <FontAwesomeIcon size='sm' color='#db2828' icon={faTimes} />
            </Button>
          )
        ]
      ) : loading ? (
        <Loading />
      ) : (
        ''
      )}
    </React.Fragment>
  )
}

function InputSelectFetch(props) {
  let { isMultiple, defaultValue, optionLabel, separator } = props

  let dispatch = useDispatch()

  let auth = useSelector((state) => state.auth) || {}

  let input = useSelector((state) => state.core.input) || {}

  let filter = useSelector((state) => state.core.filter) || {}

  let parameter = useSelector((state) => state.core.parameter) || {}

  let [visible, setVisible] = useState(false)

  let [show, setShow] = useState(false)

  let [loading, setLoading] = useState(false)

  let [listLoading, setListLoading] = useState(false)

  // let [localValue, setLocalValue] = useState(null)

  let [localParameter, setLocalParameter] = useState({})

  let [value, setValue] = useState(isMultiple ? [] : {})

  let [last, setLast] = useState(0)

  let [open, setOpen] = useState(false)

  let [currentPage, setCurrentPage] = useState(1)

  let props_name = slug(props.name, '_')

  let key_select = slug('selected_' + props_name, '_')

  let [label, setLabel] = useState(
    props.label ? props.label : findArrayName(props_name, input)
  )

  let nodeRef = useRef()

  let isVisible = useIsVisible(nodeRef)

  let [data, setData] = useState([])

  let [meta, setMeta] = useState({})

  let primaryKey = props.primaryKey ? props.primaryKey : 'id'

  function labelGenerate(option) {
    let label = []

    separator = separator || ' | '

    if (isArray(optionLabel)) {
      for (let i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]])
        }
      }

      return label.join(separator)
    } else {
      return option[optionLabel] ? option[optionLabel] : ''
    }
  }

  function onChecked(rowInfo, local_input, exist = false) {
    let _value = rowInfo.row.original || {}

    if (!isMultiple) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: _value[primaryKey]
        }
      })
    } else {
      let new_input = []

      let _local_input = findArrayName(key_select, local_input)

      if (exist) {
        new_input =
          _filter(_local_input, (o) => {
            return o && _value && String(o) != String(_value[primaryKey])
          }) || []
      } else {
        new_input = _local_input || []

        if (!isArray(new_input)) {
          new_input = []
        }

        if (_value[primaryKey]) {
          new_input.push(_value[primaryKey])
        }
      }

      new_input = uniq(new_input)

      new_input =
        _filter(new_input, (o) => {
          return !isNull(o) && !isUndefined(o)
        }) || []

      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: new_input
        }
      })
    }
  }

  let checkComponent = {
    Header: '#',
    id: props_name + '_check',
    Cell: (row) => {
      let local_input = useSelector((state) => state.core.input)

      let checked = false

      let val = findArrayName(key_select, local_input)

      try {
        if (!isMultiple) {
          checked = val === row.row.original[primaryKey]
        } else {
          checked =
            findIndex(val, function (o) {
              return o === row.row.original[primaryKey]
            }) > -1
        }
      } catch (e) {}

      if (!row.row.original[primaryKey]) {
        return null
      }

      return (
        <Form.Check
          inline
          id={slug(props_name + '_check_' + row.row.original[primaryKey], '_')}
          name={slug(
            props_name + '_check_' + row.row.original[primaryKey],
            '_'
          )}
          style={{ zIndex: 100 }}
          type={!isMultiple ? 'radio' : 'checkbox'}
          value={1}
          checked={checked}
          disabled={props.isReadonly}
          onChange={() => onChecked(row, local_input, checked)}
        />
      )
    }
  }

  let _columns = [
    {
      Header: 'Keterangan',
      id: 'label',
      accessor: (d) => labelGenerate(d)
    }
  ]

  let col = [checkComponent, ..._columns]

  function onReload() {
    if (open) {
      loadOptions()
    }
  }

  useDebounce(syncParameter, 500, [findArrayName(key_select, input)])

  useDebounce(onReload, 500, [
    findArrayName('keyword_' + props_name, filter),
    findArrayName('page_' + props_name, filter),
    findArrayName('load_' + props_name, filter)
  ])

  function syncParameter() {
    if (!isMultiple) {
      let new_input = findArrayName(key_select, input) || null

      if (new_input) {
        let url = process.env.REACT_APP_API_URL + '/' + props.url

        let { page, load, keyword } = defaultFilterData(filter, [], props_name)

        let data = secureData({
          pkey: primaryKey,
          selected: [new_input],
          keyword,
          load: 1,
          page: 1,
          ...props.parameter
        })

        let options = {
          method: 'POST',
          headers: setAuthHeader(auth),
          url,
          data
        }

        setLoading(true)

        axios(options)
          .then((resp) => {
            let new_parameter = resp.data.data.data[0] || {}

            dispatch({
              type: 'SET_PARAMETER',
              payload: {
                key: key_select,
                value: new_parameter
              }
            })

            handleInputChange(new_parameter)

            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
          })
      } else {
        dispatch({
          type: 'SET_PARAMETER',
          payload: {
            key: key_select,
            value: null
          }
        })
      }
    } else {
      let new_input =
        _filter(findArrayName(key_select, input), function (o) {
          return !isNull(o) && !isUndefined(o)
        }) || []

      if (new_input.length > 0) {
        let url = process.env.REACT_APP_API_URL + '/' + props.url

        let { keyword } = defaultFilterData(filter, [], props_name)

        let data = secureData({
          pkey: primaryKey,
          selected: new_input,
          keyword,
          load: new_input.length,
          page: 1,
          ...props.parameter
        })

        let options = {
          method: 'POST',
          headers: setAuthHeader(auth),
          url,
          data
        }

        setLoading(true)

        axios(options)
          .then((resp) => {
            dispatch({
              type: 'SET_PARAMETER',
              payload: {
                key: key_select,
                value: resp.data.data.data
              }
            })

            handleInputChange(resp.data.data.data)

            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
          })
      } else {
        dispatch({
          type: 'SET_PARAMETER',
          payload: {
            key: key_select,
            value: null
          }
        })
      }
    }
  }

  let columns = React.useMemo(() => col, [])

  useEffect(() => {
    if (!isEqual(props.parameter, localParameter)) {
      setLocalParameter(props.parameter)

      onReload()
    }

    if (isVisible != visible) {
      setVisible(isVisible)
    }
  })

  function openModal() {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        key: slug('page_' + props_name, '_'),
        value: 1
      }
    })

    setOpen((data) => !data)

    loadOptions()
  }

  function closeModal() {
    setOpen(false)
  }

  function reloader() {
    if (visible) {
      // setLocalValue(defaultValue)

      let val = null

      try {
        if (isMultiple) {
          val = map(defaultValue, 'value')

          val =
            _filter(val, (o) => {
              return o
            }) || []
        } else {
          val = defaultValue.value || null
        }
      } catch (e) {}

      let _input = findArrayName(key_select, input) || null

      // console.log('reloader',defaultValue,props_name, val, _input)

      if (!isEqual(val, _input)) {
        if (isNull(val) && !isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: _input
            }
          })
          // console.log(props_name,'COND 1')
        } else if (!isNull(val) && isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: val
            }
          })
          // console.log(props_name,'COND 2')
        } else if (!isNull(val) && !isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: val
            }
          })
          // console.log(props_name,'COND 3')
        } else {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: null
            }
          })
          // console.log(props_name,'COND 4')
        }
      }
    }
  }

  useEffect(reloader, [visible])

  useEffect(() => {
    let val = null

    try {
      if (isMultiple) {
        val =
          _filter(map(defaultValue, 'value'), (o) => {
            return o
          }) || null
      } else {
        val = defaultValue.value || null
      }
    } catch (e) {}

    if (val) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: val
        }
      })
    }
  }, [])

  function loadOptions() {
    let url = process.env.REACT_APP_API_URL + '/' + props.url

    let { page, load, keyword, sorted, search } = defaultFilterData(
      filter,
      [],
      props_name
    )

    let data = secureData({
      pkey: primaryKey,
      page,
      load,
      keyword,
      sorted,
      search,
      ...props.parameter
    })

    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    }

    setListLoading(true)

    return axios(options)
      .then((resp) => {
        let responseJSON = resp.data || {}

        if (typeof responseJSON.data.data !== 'undefined') {
          setLast(responseJSON.data.meta.last_page)

          try {
            setData(responseJSON.data.data || [])
          } catch (e) {}

          try {
            setMeta(responseJSON.data.meta || {})
          } catch (e) {}
        } else if (typeof responseJSON.data !== 'undefined') {
          setLast(responseJSON.meta.last_page)

          try {
            setData(responseJSON.data || [])
          } catch (e) {}

          try {
            setMeta(responseJSON.meta || {})
          } catch (e) {}
        }

        setListLoading(false)
      })
      .catch((error) => {
        setListLoading(false)
      })
  }

  function generateInputMultiple(event) {
    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let k = props.optionValue[key]

        let v = null

        if (event) {
          try {
            v = uniq(map(event, key))
          } catch (e) {}
        }

        if (!isEqual(findArrayName(k, input), v)) {
          dispatch({
            type: 'SET_INPUT',
            payload: { key: k, value: v }
          })
        }
      })
    } else {
      let k = props_name

      let v = null

      if (event) {
        v = uniq(map(event, primaryKey))
      }

      if (!isEqual(findArrayName(k, input), v)) {
        dispatch({
          type: 'SET_INPUT',
          payload: { key: k, value: v }
        })
      }
    }
  }

  function generateInput(event) {
    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let k = props.optionValue[key]

        let v = null

        if (event) {
          try {
            v = event[key]
          } catch (e) {}
        }

        if (!isEqual(findArrayName(k, input), v)) {
          dispatch({
            type: 'SET_INPUT',
            payload: { key: k, value: v }
          })
        }
      })
    } else {
      let k = props_name

      let v = null

      if (event) {
        v = event[primaryKey]
      }

      if (!isEqual(findArrayName(k, input), v)) {
        dispatch({
          type: 'SET_INPUT',
          payload: { key: k, value: v }
        })
      }
    }
  }

  function handleInputChange(event) {
    if (isMultiple) {
      generateInputMultiple(event)
    } else {
      generateInput(event)
    }
  }

  let isi = []

  let _input = findArrayName(key_select, input)

  try {
    if (isMultiple) {
      isi = isArray(_input) ? _input : []
    } else {
      isi = _input ? [_input] : []
    }
  } catch (e) {}

  let _parameter = findArrayName(key_select, parameter)

  let isi_param = null

  try {
    if (isMultiple) {
      isi_param = isArray(_parameter) ? _parameter : []
    } else {
      isi_param = isObject(_parameter) ? _parameter : {}
    }
  } catch (e) {}

  return (
    <div ref={nodeRef}>
      <Row>
        {!props.isReadonly && (
          <Col lg='2' md='2' sm='4' xs='12'>
            <Button
              style={{ zIndex: 0 }}
              size='sm'
              variant='primary'
              type='button'
              className='btn-icon'
              onClick={openModal}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Col>
        )}

        <Col lg='10' md='10' sm='8' xs='12'>
          {loading ? (
            <Loading />
          ) : (
            isi.map((val, index) => {
              return (
                <React.Fragment>
                  <ShowData
                    isReadonly={props.isReadonly}
                    name={props_name}
                    optionLabel={optionLabel}
                    separator={separator}
                    param={props.parameter}
                    url={props.url}
                    primaryKey={primaryKey}
                    isMultiple={isMultiple}
                    id={val}
                  />
                  {props.isReadonly
                    ? isi.length - 1 == index
                      ? null
                      : ', '
                    : null}
                </React.Fragment>
              )
            })
          )}
        </Col>
      </Row>
      <Modal size='lg' show={open} onHide={closeModal}>
        <Modal.Header onHide={closeModal} closeButton>
          <Modal.Title>{props.placeholder || 'Pilih'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadingOverlay isLoading={listLoading}>
            <div>
              <InputGroup style={{ marginBottom: 12 }}>
                <InputGroup.Text style={{ background: 'none' }}>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  style={{ borderLeft: 'none', zIndex: 0 }}
                  className='form-control'
                  value={findArrayName('keyword_' + props_name, filter)}
                  onChange={(e) => {
                    dispatch({
                      type: 'SET_MULTI_FILTER',
                      payload: {
                        ['keyword_' + props_name]: e.target.value,
                        ['page_' + props_name]: 1
                      }
                    })
                  }}
                  type='text'
                  id={'search_' + key_select}
                  name={'search_' + props_name}
                  placeholder='Pencarian'
                />

                <Button
                  style={{ zIndex: 0 }}
                  variant='primary'
                  onClick={onReload}
                  type='button'
                  disabled={props.isLoading}
                >
                  <FontAwesomeIcon icon={faSync} spin={props.isLoading} />
                </Button>
              </InputGroup>

              <DataTableContainer
                name={props_name}
                columns={columns}
                data={data}
                primaryKey={primaryKey}
                isColumnsSearchable={true}
                fetchData={onReload}
                loading={listLoading}
                customPageTotal={meta && !isEmpty(meta) ? meta.total : 0}
                customPageCount={meta && !isEmpty(meta) ? meta.last_page : 1}
                customPageSize={
                  meta && !isEmpty(meta)
                    ? meta.per_page
                    : filter['load_' + props_name]
                    ? filter['load_' + props_name]
                    : 5
                }
                customPageIndex={
                  meta && !isEmpty(meta)
                    ? meta.current_page
                    : filter['page_' + props_name]
                    ? filter['page_' + props_name]
                    : 1
                }
              />
            </div>
          </LoadingOverlay>

          {!listLoading && (
            <div style={{ marginTop: 12 }}>
              <p>Dipilih : </p>
              {loading && <Loading />}
              <ul>
                {isMultiple
                  ? isi_param &&
                    isi_param.map((val, index) => {
                      return (
                        <li>
                          {!isUndefined(val) && !isEmpty(val)
                            ? labelGenerate(val)
                            : ''}
                        </li>
                      )
                    })
                  : isi_param && (
                      <li>
                        {!isUndefined(isi_param) && !isEmpty(isi_param)
                          ? labelGenerate(isi_param)
                          : ''}
                      </li>
                    )}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default InputSelectFetch
