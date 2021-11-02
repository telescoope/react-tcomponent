import React from 'react'

import Cleave from 'cleave.js/react'

import { isEmpty, debounce, isEqual, isUndefined, isNull } from 'lodash'

import InputRange from 'react-input-range'

import { findArrayName, slug, numberFormat } from 'tcomponent'

import { connect } from 'react-redux'

class InputNumber extends React.Component {
  constructor(props) {
    super(props)

    let options = this.props.enableNegative
      ? {
          numeral: true
        }
      : {
          numeral: true,
          numeralPositiveOnly: true
        }

    this.state = {
      defaultValue: null,
      options: {
        numeral: true
      },
      event: null,
      value: null,
      props_name: slug(this.props.name, '_')
    }

    this.onRefresh = debounce(this.onRefresh.bind(this), 200)
  }

  validate_min_max(val, min = 0, max = 100) {
    if (this.props.enableNegative && val < 0) {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(this.props.type, prevProps.type)) {
      this.checkType()
    }
    if (
      !isEqual(
        findArrayName(this.state.props_name, prevProps.input),
        findArrayName(this.state.props_name, this.props.input)
      ) &&
      !isEqual(
        this.state.value,
        findArrayName(this.state.props_name, this.props.input)
      )
    ) {
      this.setState({
        rawValue:
          findArrayName(this.state.props_name, this.props.input) || null,
        value: findArrayName(this.state.props_name, this.props.input) || null
      })
      this.onRefresh()
    }

    if (
      this.props.value &&
      prevProps.value != this.props.value &&
      this.props.value != this.state.value
    ) {
      let value = this.props.value || null

      this.setState({
        rawValue: value,
        value: value
      })

      this.onRefresh()
    }
  }

  handleInputChange = (event) => {
    let val = null

    if (this.props.type == 'decimal') {
      val = Number(event.target.value.replace(/[^0-9.-]+/g, ''))
    } else if (this.props.type == 'percent') {
      val = this.validate_min_max(
        event.target.value.replace(/[^0-9.-]+/g, ''),
        0,
        100
      )
    } else if (this.props.type == 'range_three') {
      val = this.validate_min_max(
        event.target.value.replace(/[^0-9.-]+/g, ''),
        1,
        3
      )
    } else if (this.props.type == 'range_hundred') {
      val = this.validate_min_max(
        event.target.value.replace(/[^0-9.-]+/g, ''),
        1,
        100
      )
    } else if (this.props.type == 'range_depend') {
      val = this.validate_min_max(
        event.target.value.replace(/[^0-9.-]+/g, ''),
        0,
        100
      )
    } else {
      val = event.target.value.replace(/[^0-9.-]+/g, '')
    }

    let min = this.props.minValue ? Number(this.props.minValue) : null

    let max = this.props.maxValue ? Number(this.props.maxValue) : null

    if (max && min) {
      val = this.validate_min_max(val, min, max)
    } else if (!max && min) {
      val = this.validate_min_max(val, min, 999999999999)
    } else if (max && !min) {
      val = this.validate_min_max(val, 0, max)
    }

    val = val ? val : 0

    if (this.state.props_name) {
      this.props.setInput(this.state.props_name, val)
    }

    let rawValue = event.target.rawValue || null

    if (
      !isNaN(parseFloat(rawValue)) &&
      !isNaN(parseFloat(val)) &&
      parseFloat(rawValue) !== parseFloat(val)
    ) {
      this.state.event.setRawValue(val)
    }
  }

  onChange = (val) => {
    this.setState({
      value: val
    })

    if (this.state.props_name) {
      this.props.setInput(this.state.props_name, val)
    }
  }

  onRefresh = () => {
    let val = ''

    try {
      let input_name = findArrayName(this.state.props_name, this.props.input)
      val = this.props.value ? this.props.value : input_name
    } catch (e) {}

    let min = this.props.minValue ? Number(this.props.minValue) : null

    let max = this.props.maxValue ? Number(this.props.maxValue) : null

    let value = val ? parseInt(val) : min

    if (this.props.type == 'decimal') {
      value = val ? parseFloat(val) : min
    } else if (
      this.props.type == 'percent' ||
      this.props.type == 'range_three' ||
      max ||
      min
    ) {
      value = val ? parseFloat(val) : min
    }

    if (isNaN(value)) {
      value = min
    }

    this.setState({ value })

    try {
      let rawValue = this.state.event.lastInputValue || null

      if (parseFloat(rawValue) !== parseFloat(value)) {
        this.state.event.setRawValue(value)
      }
    } catch (e) {}
  }

  componentDidMount() {
    this.checkType()
  }

  checkType = () => {
    let options = {
      numeral: true,
      numeralPositiveOnly: true
    }

    if (
      this.props.type == 'decimal' ||
      this.props.type == 'percent' ||
      this.props.type == 'range_three'
    ) {
    } else {
      options.numeralThousandsGroupStyle = 'thousand'
    }

    this.setState({
      options,
      rawValue: findArrayName(this.state.props_name, this.props.input),
      value: findArrayName(this.state.props_name, this.props.input)
    })

    this.onRefresh()
  }

  onInit(cleave) {
    this.setState({ event: cleave })
  }

  render() {
    if (this.props.disabled || this.props.isReadonly) {
      return !isNull(this.state.value) && !isUndefined(this.state.value)
        ? numberFormat(this.state.value, '')
        : null
    }

    if (this.props.type == 'range') {
      return (
        <InputRange
          maxValue={this.props.maxValue}
          minValue={this.props.minValue}
          value={this.state.value}
          onChange={this.onChange}
        />
      )
    }
    return (
      <Cleave
        placeholder={this.props.placeholder ? this.props.placeholder : ''}
        id={this.state.props_name}
        name={this.state.props_name}
        onInit={this.onInit.bind(this)}
        value={this.state.value}
        onChange={this.handleInputChange}
        options={this.state.options}
        className='form-control'
      />
    )
  }
}

const mapStateToProps = (state) => ({
  input: state.core.input || {}
})

const mapDispatchToProps = (dispatch) => ({
  setInput: (key, val) => {
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(InputNumber)
