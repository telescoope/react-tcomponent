import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector, connect } from 'react-redux'

import { findArrayName, slug, useDebounce } from 'tcomponent'

import './DataTable.module.css'

import LoadingOverlay from './LoadingOverlay'

import DataTableContainer from './DataTableContainer'

import { useIsVisible } from 'react-is-visible'

import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination
} from 'react-table'

import {
  filter as _filter,
  isArray,
  uniq,
  findIndex,
  find,
  isEmpty,
  uniqBy,
  isEqual,
  isUndefined,
  isBoolean
} from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSync, faSearch } from '@fortawesome/free-solid-svg-icons'

import {
  faArrowAltCircleDown,
  faArrowAltCircleUp
} from '@fortawesome/free-regular-svg-icons'

import './DataTable.module.css'

import {
  Row,
  InputGroup,
  Col,
  Form,
  Button,
  DropdownButton,
  ButtonGroup,
  Dropdown
} from 'react-bootstrap'

function DataTable(props) {
  let [visible, setVisible] = useState(false)

  let [data, setData] = useState([])

  let [temp, setTemp] = useState([])

  let [meta, setMeta] = useState({})

  let [tooltipOpenEx, setTooltipOpenEx] = useState(false)

  let [tooltipOpenIm, setTooltipOpenIm] = useState(false)

  let toggleImport = () => setTooltipOpenIm(!tooltipOpenIm)

  let toggleExport = () => setTooltipOpenEx(!tooltipOpenEx)

  let dispatch = useDispatch()

  let parameter = useSelector((state) => state.core.parameter) || {}

  let input = useSelector((state) => state.core.input) || {}

  let user = useSelector((state) => state.auth.user) || {}

  let filter = useSelector((state) => state.core.filter) || {}

  let key_select = slug('selected_' + props.name, '_')

  let primaryKey = props.primaryKey ? props.primaryKey : 'id'

  function onChecked(rowInfo, input, exist = false) {
    let value = rowInfo.row.original || {}

    if (props.selectable == 'single') {
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value
        }
      })

      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: value[primaryKey]
        }
      })
    } else {
      let new_input = []

      if (exist) {
        new_input =
          _filter(findArrayName(key_select, input), (o) => {
            return o && value && parseInt(o) != parseInt(value[primaryKey])
          }) || []
      } else {
        new_input = findArrayName(key_select, input) || []

        if (!isArray(new_input)) {
          new_input = []
        }

        new_input.push(value[primaryKey])
      }

      new_input = uniq(new_input)

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
    id: 'select',
    width: '10px',
    Cell: (row) => {
      let local_input = useSelector((state) => state.core.input)

      let checked = false

      try {
        if (props.selectable == 'single') {
          checked =
            findArrayName(key_select, local_input) ==
            row.row.original[primaryKey]
        } else {
          checked =
            findIndex(findArrayName(key_select, local_input), function (o) {
              return o == row.row.original[primaryKey]
            }) > -1
        }
      } catch (e) {}

      return (
        <Form.Check
          inline
          id={slug(props.name + '_check_' + row.row.original[primaryKey], '_')}
          name={slug(
            props.name + '_check_' + row.row.original[primaryKey],
            '_'
          )}
          type={props.selectable == 'single' ? 'radio' : 'checkbox'}
          value={1}
          checked={checked}
          disabled={props.isReadonly}
          onChange={() => onChecked(row, local_input, checked)}
        />
      )
    }
  }

  let nodeRef = useRef()

  let isVisible = useIsVisible(nodeRef)

  let col = !isEmpty(props.selectable)
    ? [checkComponent, ...props.columns]
    : [...props.columns]

  if (props.action) {
    let actionComponent = {
      Header: 'Aksi',
      id: 'aksi_' + props.name,
      sortable: false,
      Cell: (row) => {
        let param = useSelector((state) => state.core.parameter)

        let isi = row.row.original[primaryKey]

        function openToggle(data) {
          let current = isEqual(param.dropdown, data) ? null : data

          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: 'dropdown',
              value: current
            }
          })
        }

        return (
          <DropdownButton
            key={'dropdown_' + props.name + '_' + isi}
            size='sm'
            id={'dropdown_' + props.name + '_' + isi}
            // className='custom-scroll'
            isOpen={isEqual(param.dropdown, isi)}
            toggle={() => openToggle(isi)}
            drop={'end'}
            variant='primary'
            title={''}
          >
            {_filter(props.action, function (o) {
              return isUndefined(o.show) || o.show
            }).map((value, index) => {
              let disabled = isBoolean(value.disabled) ? value.disabled : false

              return (
                <Dropdown.Item
                  key={'dropdownitem_' + props.name + '_' + isi + '_' + index}
                  onClick={() => value.onClick(row.row.original)}
                  disabled={disabled}
                >
                  {value.label}
                </Dropdown.Item>
              )
            })}
          </DropdownButton>
        )
      }
    }

    col = !isEmpty(props.selectable)
      ? [actionComponent, checkComponent, ...props.columns]
      : [actionComponent, ...props.columns]
  }

  useEffect(() => {
    if (isVisible != visible) {
      setVisible(isVisible)
    }
  })

  useEffect(() => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        key: slug('loaded_' + props.name, '_'),
        value: false
      }
    })
  }, [])

  function onReload() {
    if (visible) {
      props.onReload()
      if (!findArrayName(slug('loaded_' + props.name, '_'), filter)) {
        dispatch({
          type: 'SET_FILTER',
          payload: {
            key: slug('loaded_' + props.name, '_'),
            value: true
          }
        })
      }
    }
  }

  useDebounce(
    () => {
      if (visible) {
        onReload()
      }
    },
    1000,
    [visible]
  )

  useDebounce(onReload, 1000, [
    findArrayName(slug('keyword_' + props.name, '_'), filter),
    findArrayName(slug('page_' + props.name, '_'), filter),
    findArrayName(slug('load_' + props.name, '_'), filter),
    findArrayName(slug('loaded_' + props.name, '_'), filter)
  ])

  function syncParameter() {
    let new_parameter = null

    let new_input = null

    if (props.selectable == 'single') {
      new_parameter = new_parameter =
        find(temp, (o) => {
          return o && parseInt(o[primaryKey]) == new_input
        }) || {}

      new_input = findArrayName(key_select, input) || null
    } else {
      new_parameter = []

      new_input = findArrayName(key_select, input) || []

      for (let i = 0; i < new_input.length; i++) {
        let find_data =
          find(temp, (o) => {
            return o && parseInt(o[primaryKey]) == new_input[i]
          }) || {}

        if (!isEmpty(find_data)) {
          new_parameter.push(find_data)
        }
      }
    }

    dispatch({
      type: 'SET_PARAMETER',
      payload: {
        key: key_select,
        value: new_parameter
      }
    })
  }

  useDebounce(
    () => {
      setTemp((val) => uniqBy([...val, ...data], primaryKey))
      if (findArrayName(key_select, input)) {
        syncParameter()
      }
    },
    1000,
    [findArrayName(key_select, input), filter]
  )

  useDebounce(
    () => {
      try {
        setData(props.data.data || [])
      } catch (e) {}

      setTemp((val) => uniqBy([...val, ...data], primaryKey))

      try {
        setMeta(props.data.meta || {})
      } catch (e) {}
    },
    1000,
    [props.data]
  )

  let columns = React.useMemo(() => col, [])

  let hapus = false

  try {
    hapus = user.role == 'admin'
  } catch (e) {}

  return (
    <LoadingOverlay isLoading={props.isLoading}>
      <div style={{ padding: '8px 12px' }} ref={nodeRef}>
        <div
          style={{ marginBottom: '12px' }}
          //  className="card-header"
        >
          <Row>
            <Col xs='12' sm='12' md='8' lg='8'>
              <div
              // className={props.export || props.import ? "col-7" : "col-9"}
              >
                {props.renderFilter ? props.renderFilter : null}
              </div>
            </Col>
          </Row>

          <Row style={{ justifyContent: 'flex-end' }}>
            {/* <Col xs="12" sm="12" md="8" lg="8">
  <div >
  {(props.export || props.import) && (
  <div className="col-2">
  <InputGroup>
  {props.export && (
  <InputGroupAddon>
  <Button
  style={{ zIndex: 0 }}
  className="mr-1 btn btn-primary"
  onClick={props.exportReload}
  type="button"
  disabled={props.disabledButton}
  >
  Export
  </Button>
  </InputGroupAddon>
)}
{props.import && (
<InputGroupAddon>
<Button
style={{ zIndex: 0 }}
className="mr-1 btn btn-primary"
onClick={props.importReload}
type="button"
disabled={props.disabledButton}
>
Import
</Button>
</InputGroupAddon>
)}
</InputGroup>
</div>
)}
</div>
</Col> */}

            <Col xs='12' sm='12' md='4' lg='4'>
              <div>
                {props.isSearchable && (
                  <div>
                    <InputGroup>
                      <InputGroup.Text style={{ background: 'none' }}>
                        <FontAwesomeIcon icon={faSearch} />
                      </InputGroup.Text>

                      <Form.Control
                        id={slug('keyword_' + props.name, '_')}
                        key={slug('keyword_' + props.name, '_')}
                        style={{ borderLeft: 'none' }}
                        className='form-control'
                        value={findArrayName(
                          slug('keyword_' + props.name, '_'),
                          filter
                        )}
                        onChange={(e) => {
                          dispatch({
                            type: 'SET_MULTI_FILTER',
                            payload: {
                              [slug('keyword_' + props.name, '_')]:
                                e.target.value,
                              [slug('page_' + props.name, '_')]: 1,
                              loaded: false
                            }
                          })
                        }}
                        type='text'
                        id={slug('keyword_' + key_select)}
                        name='keyword'
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

                      {(props.export || props.import) && (
                        <React.Fragment>
                          {props.export && (
                            <Button
                              id='exportFile'
                              style={{ zIndex: 0 }}
                              variant='primary'
                              className='mr-1'
                              onClick={props.exportReload}
                              type='button'
                              disabled={props.disabledButton}
                            >
                              <FontAwesomeIcon icon={faArrowAltCircleDown} />

                              <Tooltip
                                placement='top'
                                isOpen={tooltipOpenEx}
                                autohide={false}
                                target='exportFile'
                                toggle={toggleExport}
                              >
                                Export
                              </Tooltip>
                            </Button>
                          )}
                          {props.import && (
                            <Button
                              id='importFile'
                              style={{ zIndex: 0 }}
                              variant='primary'
                              className='mr-1'
                              onClick={props.importReload}
                              type='button'
                              disabled={props.disabledButton}
                            >
                              <FontAwesomeIcon icon={faArrowAltCircleUp} />
                              <Tooltip
                                placement='top'
                                isOpen={tooltipOpenIm}
                                autohide={false}
                                target='importFile'
                                toggle={toggleImport}
                              >
                                Import
                              </Tooltip>
                            </Button>
                          )}
                        </React.Fragment>
                      )}
                    </InputGroup>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>

        <DataTableContainer
          name={slug(props.name, '_')}
          columns={columns}
          data={data}
          primaryKey={primaryKey}
          isColumnsSearchable={props.isColumnsSearchable}
          fetchData={onReload}
          loading={props.isLoading}
          customPageTotal={meta && !isEmpty(meta) ? meta.total : 0}
          customPageCount={meta && !isEmpty(meta) ? meta.last_page : 1}
          customPageSize={
            meta && !isEmpty(meta)
              ? meta.per_page
              : findArrayName(slug('load_' + props.name, '_'), filter)
              ? findArrayName(slug('load_' + props.name, '_'), filter)
              : 10
          }
          customPageIndex={
            meta && !isEmpty(meta)
              ? meta.current_page
              : findArrayName(slug('page_' + props.name, '_'), filter)
              ? findArrayName(slug('page_' + props.name, '_'), filter)
              : 1
          }
        />
      </div>
    </LoadingOverlay>
  )
}

export default DataTable
