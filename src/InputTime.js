import React from 'react'

import moment from 'moment'

import { isUndefined } from 'lodash'

import TimePicker from 'rc-time-picker'

import { useSelector, useDispatch } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

import './InputTime.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faClock } from '@fortawesome/free-regular-svg-icons'

let now = moment()

function IconClock() {
  return (
    <FontAwesomeIcon
      style={{ position: 'absolute', left: 8, top: 11 }}
      icon={faClock}
    />
  )
}

function InputTime(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  let value = findArrayName(propsName, input) || null

  let valueStart = findArrayName('start_' + propsName, input) || null

  let valueEnd = findArrayName('end_' + propsName, input) || null

  const formatDefault = props.format ? props.format : 'HH:mm:ss'

  if (props.isRange) {
    try {
      valueStart = moment(valueStart, formatDefault).isValid()
        ? moment(valueStart, formatDefault)
        : null
    } catch (e) {}

    try {
      valueEnd = moment(valueEnd, formatDefault).isValid()
        ? moment(valueEnd, formatDefault)
        : null
    } catch (e) {}
  } else {
    try {
      value = moment(value, formatDefault).isValid()
        ? moment(value, formatDefault)
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

  if (props.isRange) {
    if (props.disabled || props.isReadonly) {
      return (
        <div className='input-daterange input-group'>
          {moment(valueStart, formatDefault).isValid()
            ? moment(valueStart, formatDefault).format(formatDefault)
            : ''}

          <span style={{ background: 'none' }}>&nbsp; s/d &nbsp;</span>
          {moment(valueEnd, formatDefault).isValid()
            ? moment(valueEnd, formatDefault).format(formatDefault)
            : ''}
        </div>
      )
    }

    return (
      <div className='input-daterange input-group'>
        <TimePicker
          value={valueStart}
          disabled={props.disabled || props.isReadonly}
          // showSecond={false}
          inputIcon={<IconClock />}
          format={formatDefault}
          onChange={handleInputChangeStart}
        />
        <span className='input-group-addon' style={{ background: 'none' }}>
          &nbsp; - &nbsp;
        </span>
        <TimePicker
          value={valueEnd}
          disabled={props.disabled || props.isReadonly}
          inputIcon={<IconClock />}
          // showSecond={false}
          format={formatDefault}
          onChange={handleInputChangeEnd}
        />
      </div>
    )
  }

  if (props.disabled || props.isReadonly) {
    return (
      <div className='input-daterange input-group'>
        {moment(value, formatDefault).isValid()
          ? moment(value, formatDefault).format(formatDefault)
          : ''}
      </div>
    )
  }

  return (
    <TimePicker
      value={value}
      disabled={props.disabled || props.isReadonly}
      // showSecond={false}
      inputIcon={<IconClock />}
      format={formatDefault}
      onChange={handleInputChange}
    />
  )
}

export default InputTime
