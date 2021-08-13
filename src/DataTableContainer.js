import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector, connect } from 'react-redux'

import { findArrayName, slug, useDebounce, numberFormat } from 'tcomponent'

import LoadingOverlay from './LoadingOverlay'

import { useIsVisible } from 'react-is-visible'

import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination
} from 'react-table'

import { isEmpty, isNull, isUndefined } from 'lodash'

import { Form, InputGroup, Button, Table } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faBars,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleRight,
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons'

import { faFile } from '@fortawesome/free-regular-svg-icons'

export const Filter = ({ column }) => {
  return (
    <div style={{ margin: '4px 0' }}>
      {column.canFilter && column.render('Filter')}
    </div>
  )
}

export const DefaultColumnFilter = (props) => {
  let filterValue = props.column.filterValue

  let id = props.column.id

  let name = props.name

  let dispatch = useDispatch()

  let [data, setData] = React.useState(filterValue)

  let key = slug('search_' + name + '_' + id, '_')

  let filter = useSelector((state) => state.core.filter)

  useEffect(() => {
    setData(filter[key])
  }, [])

  function onChange(e) {
    e.preventDefault()

    setData(e.target.value)

    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: {
        [key]: e.target.value,
        [slug('loaded_' + name, '_')]: false
      }
    })
  }

  return (
    <Form.Control
      key={key}
      id={key}
      name={key}
      value={data}
      onChange={onChange}
      placeholder={`Pencarian`}
    />
  )
}

/*
export let SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id }
}) => {
  let options = React.useMemo(() => {
    let options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <CustomInput
      id='custom-select'
      type='select'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value=''>All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </CustomInput>
  )
}
*/

function DataTableContainer({
  columns,
  data,
  renderRowSubComponent,
  customPageIndex,
  customPageSize,
  customPageCount,
  loading,
  isColumnsSearchable,
  primaryKey,
  name,
  customPageTotal
}) {
  // console.log(customPageIndex)

  let filter = useSelector((state) => state.core.filter) || {}

  let sortBy = []

  for (let i = 0; i < columns.length; i++) {
    try {
      let k = slug('sort_' + name + '_' + columns[i][primaryKey], '_')

      let urut = filter[k]

      if (!isEmpty(urut) && !isNull(urut) && !isUndefined(urut)) {
        sortBy.push({
          id: columns[i][primaryKey],
          desc: urut == 'desc'
        })
      }
    } catch (e) {}
  }

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn: {
        Filter: (props) => <DefaultColumnFilter {...props} name={name} />
      },
      initialState: {
        pageIndex: customPageIndex,
        pageSize: customPageSize,
        sortBy
      },
      manualPagination: true,
      pageCount: customPageCount,
      manualSortBy: true,
      defaultCanSort: true,
      isMultiSortEvent: () => {}
    },

    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  let headers = headerGroups[0].headers || []

  useDebounce(
    () => {
      let sort = {}

      for (let i = 0; i < headers.length; i++) {
        let x = headers[i]

        if (x) {
          let mykey = slug('sort_' + name + '_' + x[primaryKey], '_')

          let mysort = x.isSorted ? (x.isSortedDesc ? 'desc' : 'asc') : null

          if (mysort != filter[mykey]) {
            sort[mykey] = mysort
          }
        }
      }

      if (!isEmpty(sort)) {
        dispatch({
          type: 'SET_MULTI_FILTER',
          payload: { ...sort, [slug('loaded_' + name, '_')]: false }
        })
      }
    },
    1000,
    [headers]
  )

  let [localLoading, setLocalLoading] = useState(loading)

  let [curpage, setCurPage] = useState(pageIndex)

  let dispatch = useDispatch()

  let generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''
  }

  let onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value))

    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: {
        [slug('load_' + name, '_')]: Number(event.target.value),
        [slug('page_' + name, '_')]: curpage
      }
    })
  }

  let onChangeInInput = (event) => {
    let page = event.target.value ? Number(event.target.value) : 0

    customgotoPage(page)
  }

  let customcanNextPage = customPageIndex < customPageCount

  let customcanPreviousPage = customPageIndex >= 2

  let customnextPage = () => {
    customgotoPage(curpage + 1)
  }

  let custompreviousPage = () => {
    customgotoPage(curpage - 1)
  }

  let customgotoPage = (isi) => {
    setCurPage(isi)
  }

  useDebounce(
    () => {
      gotoPage(curpage)
      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: {
          [slug('load_' + name, '_')]: pageSize,
          [slug('page_' + name, '_')]: curpage
        }
      })
    },
    1000,
    [curpage]
  )

  useEffect(() => {
    if (setLocalLoading && !loading) {
      setTimeout(() => setLocalLoading(loading), 1000)
    } else {
      setLocalLoading(loading)
    }
  }, [loading])

  if (isEmpty(name)) {
    return <p>Props name is Required</p>
  }

  return (
    <div>
      <div className='custom-scroll' style={{ overflow: 'auto' }}>
        <InputGroup>

          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={() => customgotoPage(1)}
            disabled={!customcanPreviousPage || loading}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Button>

          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={custompreviousPage}
            disabled={!customcanPreviousPage || loading}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>

          <InputGroup.Text style={{ background: 'none' }}>
            <FontAwesomeIcon icon={faFile} /> &nbsp; Hal :{' '}
          </InputGroup.Text>

          <Form.Control
            style={{ borderLeft: 'none', borderRight: 'none', minWidth: 72 }}
            type='number'
            min={1}
            max={customPageCount}
            value={curpage}
            onChange={onChangeInInput}
          />

          <InputGroup.Text style={{ background: 'none' }}>
            <FontAwesomeIcon icon={faBars} /> &nbsp; Lihat :{' '}
          </InputGroup.Text>

          <Form.Control
            type='number'
            min={1}
            style={{ borderLeft: 'none', borderRight: 'none', minWidth: 72 }}
            max={50}
            value={pageSize}
            onChange={onChangeInSelect}
          />

          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={customnextPage}
            disabled={!customcanNextPage || loading}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={() => customgotoPage(customPageCount)}
            disabled={!customcanNextPage || loading}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </InputGroup>
      </div>

      <div className='text-center mt-2 mb-2'>
        <strong>{numberFormat(customPageIndex, '')}</strong> dari{' '}
        <strong>{numberFormat(customPageCount, '')}</strong> hal. Total{' : '}
        <strong>{numberFormat(customPageTotal, '')}</strong> hal
      </div>

      <Table
        style={{ margin: 0, zIndex: 0 }}
        responsive
        bordered
        hover
        striped
        vcenter
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{
                    padding: '4px 8px',
                    borderTop: '1px solid #dee2e6'
                  }}
                  {...column.getHeaderProps()}
                >
                  <div {...column.getSortByToggleProps()}>
                    <span
                      style={{
                        display: 'inline-block'
                      }}
                    >
                      {column.render('Header')}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        fontWeight: 'bold'
                      }}
                    >
                      {generateSortingIndicator(column)}
                    </span>
                  </div>
                  {isColumnsSearchable && <Filter column={column} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.length > 0 && !localLoading
            ? page.map((row) => {
                prepareRow(row)
                return (
                  <React.Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell, index) => {
                        return (
                          <td
                            style={{
                              padding: '4px 8px',
                              width: index == 0 ? '10px' : 'auto'
                            }}
                            {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                    {row.isExpanded && (
                      <tr>
                        <td
                          style={{
                            padding: '4px 8px'
                          }}
                          colSpan={visibleColumns.length}
                        >
                          {renderRowSubComponent(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })
            : headerGroups.map((headerGroup) => (
                <tr>
                  <td
                    style={{
                      padding: '12px 0',
                      textAlign: 'center'
                    }}
                    colSpan={headerGroup.headers.length}
                  >
                    {localLoading ? 'Memproses...' : 'Tidak ada data'}
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>

      <div className='text-center mt-2 mb-2'>
        <strong>{numberFormat(customPageIndex, '')}</strong> dari{' '}
        <strong>{numberFormat(customPageCount, '')}</strong> hal. Total{' : '}
        <strong>{numberFormat(customPageTotal, '')}</strong> hal
      </div>
      <div className='custom-scroll' style={{ overflow: 'auto' }}>
        <InputGroup>
          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={() => customgotoPage(1)}
            disabled={!customcanPreviousPage || loading}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Button>

          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={custompreviousPage}
            disabled={!customcanPreviousPage || loading}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>

          <InputGroup.Text style={{ background: 'none' }}>
            <FontAwesomeIcon icon={faFile} /> &nbsp; Hal :{' '}
          </InputGroup.Text>

          <Form.Control
            style={{ borderLeft: 'none', borderRight: 'none', minWidth: 72 }}
            type='number'
            min={1}
            max={customPageCount}
            value={curpage}
            onChange={onChangeInInput}
          />

          <InputGroup.Text style={{ background: 'none' }}>
            <FontAwesomeIcon icon={faBars} /> &nbsp; Lihat :{' '}
          </InputGroup.Text>

          <Form.Control
            type='number'
            min={1}
            style={{ borderLeft: 'none', borderRight: 'none', minWidth: 72 }}
            max={50}
            value={pageSize}
            onChange={onChangeInSelect}
          />

          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={customnextPage}
            disabled={!customcanNextPage || loading}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button
            style={{ border: 'none' }}
            variant='primary'
            onClick={() => customgotoPage(customPageCount)}
            disabled={!customcanNextPage || loading}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </InputGroup>
      </div>
    </div>
  )
}

export default DataTableContainer
