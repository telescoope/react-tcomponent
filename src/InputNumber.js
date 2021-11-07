import React from 'react'

import Cleave from 'cleave.js/react'

import { isEmpty, isEqual, isUndefined, isNull, isNumber } from 'lodash'

import InputRange from 'react-input-range'

import { findArrayName, slug, numberFormat } from 'tcomponent'

import { useSelector, useDispatch } from 'react-redux'

function InputNumber(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  let value = findArrayName(propsName, input) || null

  let options = props.enableNegative
    ? {
        numeral: true
      }
    : {
        numeral: true,
        numeralPositiveOnly: true
      }

  if (
    props.type == 'decimal' ||
    props.type == 'percent' ||
    props.type == 'range_three'
  ) {
  } else {
    options.numeralThousandsGroupStyle = 'thousand'
  }

  function validate_min_max(val, min = 0, max = 100) {
    if (props.enableNegative && val < 0) {
      min = -max
    }

    if (isNaN(val)) {
      val = min
    }

    val = parseFloat(val)

    if (val >= max) {
      val = max
    } else if (val <= min) {
      val = min
    }

    return val ? Number(val) : null
  }

  function handleInputChange(event) {
    let val = isNumber(val)
      ? Number(val)
      : Number(event.target.value.replace(/[^0-9.-]+/g, ''))

    console.log(val)

    if (props.type == 'decimal') {
      val = Number(val)
      console.log('COND A')
    } else if (props.type == 'percent') {
      val = validate_min_max(val, 0, 100)
      console.log('COND B')
    } else if (props.type == 'range_three') {
      val = validate_min_max(val, 1, 3)
    } else if (props.type == 'range_hundred') {
      val = validate_min_max(val, 1, 100)
      console.log('COND C')
    } else if (props.type == 'range_depend') {
      val = validate_min_max(val, 0, 100)
      console.log('COND D')
    }

    let min = props.minValue ? Number(props.minValue) : null

    let max = props.maxValue ? Number(props.maxValue) : null

    if (max && min) {
      val = validate_min_max(val, min, max)
      console.log('COND F')
    } else if (!max && min) {
      val = validate_min_max(val, min, 999999999999)
      console.log('COND G')
    } else if (max && !min) {
      val = validate_min_max(val, 0, max)
      console.log('COND H')
    }

    val = onChange(val)
  }

  function setInput(key, val) {
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })
  }

  function onChange(val) {
    setInput(propsName, val)
  }

  function onInit(cleave) {}

  if (props.disabled || props.isReadonly) {
    return !isNull(value) && !isUndefined(value)
      ? numberFormat(value, '')
      : null
  }

  if (props.type == 'range') {
    return (
      <InputRange
        maxValue={props.maxValue}
        minValue={props.minValue}
        value={value}
        onChange={this.onChange}
      />
    )
  }
  return (
    <Cleave
      placeholder={props.placeholder ? props.placeholder : ''}
      id={propsName}
      name={propsName}
      onInit={(v) => onInit(v)}
      value={value}
      onChange={handleInputChange}
      options={options}
      className='form-control'
    />
  )
}

export default InputNumber
