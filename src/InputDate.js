import React from 'react'

import moment from 'moment'

import { isUndefined } from 'lodash'

import { findArrayName, slug } from 'tcomponent'

import DatePicker from 'react-datepicker'

import './InputDate.module.css'

import { useSelector, useDispatch } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'

import { InputGroup, Form } from 'react-bootstrap'

let formatDefault = 'YYYY-MM-DD'

const CustomInput = (props) => {
  return (
    <InputGroup>
      <InputGroup.Text style={{ background: 'none' }}>
        <FontAwesomeIcon icon={faCalendar} />
      </InputGroup.Text>
      <Form.Control
        style={{
          borderLeft: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }}
        type='text'
        className='form-control'
        disabled={props?.disabled}
        name={props?.name}
        value={props?.value || ''}
        onClick={props?.onClick}
      />
    </InputGroup>
  )
}

function InputDate(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  let value = findArrayName(propsName, input) || null

  let valueStart = findArrayName('start_' + propsName, input) || null

  let valueEnd = findArrayName('end_' + propsName, input) || null

  if (props?.isRange) {
    try {
      valueStart = moment(valueStart, formatDefault).isValid()
        ? moment(valueStart, formatDefault).toDate()
        : null
    } catch (e) {}

    try {
      valueEnd = moment(valueEnd, formatDefault).isValid()
        ? moment(valueEnd, formatDefault).toDate()
        : null
    } catch (e) {}
  } else {
    try {
      value = moment(value, formatDefault).isValid()
        ? moment(value, formatDefault).toDate()
        : null
    } catch (e) {}
  }

  function handleInputChange(data) {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    setInput(propsName, data)
  }

  function handleInputChangeStart(data) {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    setInput('start_' + propsName, data)
  }

  function handleInputChangeEnd(data) {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    setInput('end_' + propsName, data)
  }

  function setInput(key, val) {
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: moment(val, formatDefault).isValid()
          ? moment(val, formatDefault).format(formatDefault)
          : ''
      }
    })
  }

  const dateFormat = props?.dateFormat ? props?.dateFormat : 'yyyy-MM-dd'

  function checkTglMerah(date) {
    const x = moment(date).format('d')

    return x == 5 || x == 6 ? 'weekend' : undefined
  }

  if (props?.isRange) {
    if (props?.disabled || props?.isReadonly) {
      return (
        (moment(valueStart, formatDefault).isValid()
          ? moment(valueStart, formatDefault).format('DD-MM-YYYY')
          : '') +
        ' - ' +
        (moment(valueEnd, formatDefault).isValid()
          ? moment(valueEnd, formatDefault).format('DD-MM-YYYY')
          : '')
      )
    } else {
      return (
        <div className='input-daterange input-group'>
          <DatePicker
            minDate={
              moment(props?.minDate, formatDefault).isValid()
                ? moment(props?.minDate, formatDefault).toDate()
                : null
            }
            maxDate={
              moment(props?.maxDate, formatDefault).isValid()
                ? moment(props?.maxDate, formatDefault).toDate()
                : null
            }
            dateFormat={dateFormat}
            placeholder={props?.placeholder ? props?.placeholder : 'Tanggal'}
            selected={valueStart}
            isClearable={!props?.disabled && !props?.isReadonly}
            customInput={
              <CustomInput value={valueStart} name={'start_' + propsName} />
            }
            onChange={handleInputChangeStart}
            selectsStart={true}
            peekNextMonth={true}
            showMonthDropdown={true}
            showYearDropdown={true}
            showYearPicker={false}
            name={'start_' + propsName}
            todayButton={'Hari ini'}
            dayClassName={checkTglMerah}
            dropdownMode='select'
            disabled={props?.disabled || props?.isReadonly}
            readOnly={props?.disabled || props?.isReadonly}
            startDate={valueStart}
            endDate={valueEnd}
            shouldCloseOnSelect={true}
          />
          <span className='input-group-addon' style={{ background: 'none' }}>
            &nbsp; - &nbsp;
          </span>
          <DatePicker
            minDate={
              moment(valueStart, formatDefault).isValid()
                ? moment(valueStart, formatDefault).toDate()
                : moment(props?.minDate, formatDefault).isValid()
                ? moment(props?.minDate, formatDefault).toDate()
                : null
            }
            maxDate={
              moment(props?.maxDate, formatDefault).isValid()
                ? moment(props?.maxDate, formatDefault).toDate()
                : null
            }
            dateFormat={dateFormat}
            placeholder={props?.placeholder ? props?.placeholder : 'Tanggal'}
            selected={valueEnd}
            isClearable={!props?.disabled && !props?.isReadonly}
            name={'end_' + propsName}
            selectsEnd
            customInput={
              <CustomInput value={valueEnd} name={'end_' + propsName} />
            }
            onChange={handleInputChangeEnd}
            selectsStart={true}
            peekNextMonth={true}
            showMonthDropdown={true}
            showYearDropdown={true}
            showYearPicker={false}
            dayClassName={checkTglMerah}
            todayButton={'Hari ini'}
            dropdownMode='select'
            startDate={valueStart}
            endDate={valueEnd}
            disabled={props?.disabled || props?.isReadonly}
            readOnly={props?.disabled || props?.isReadonly}
            shouldCloseOnSelect={true}
          />
        </div>
      )
    }
  }

  if (props?.disabled || props?.isReadonly) {
    return moment(props?.input[propsName], formatDefault).isValid()
      ? moment(props?.input[propsName], formatDefault).format('DD-MM-YYYY')
      : ''
  }

  return (
    <DatePicker
      minDate={
        moment(props?.minDate, formatDefault).isValid()
          ? moment(props?.minDate, formatDefault).toDate()
          : null
      }
      maxDate={
        moment(props?.maxDate, formatDefault).isValid()
          ? moment(props?.maxDate, formatDefault).toDate()
          : null
      }
      dateFormat={dateFormat}
      placeholder={props?.placeholder ? props?.placeholder : 'Tanggal'}
      customInput={<CustomInput value={value} name={propsName} />}
      selected={value}
      isClearable={!props?.disabled && !props?.isReadonly}
      id={propsName}
      className='form-control'
      dayClassName={checkTglMerah}
      onChange={handleInputChange}
      selectsStart={true}
      peekNextMonth={true}
      showMonthDropdown={true}
      showYearDropdown={true}
      showYearPicker={false}
      todayButton={'Hari ini'}
      dropdownMode='select'
      disabled={props?.disabled || props?.isReadonly}
      readOnly={props?.disabled || props?.isReadonly}
      shouldCloseOnSelect={true}
    />
  )
}

export default InputDate
