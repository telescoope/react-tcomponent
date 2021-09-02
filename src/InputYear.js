import React from 'react'

import moment from 'moment'

import { debounce } from 'lodash'

import { findArrayName, slug } from 'tcomponent'

import DatePicker from 'react-datepicker'

import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'

import { InputGroup, Form } from 'react-bootstrap'

let formatDefault = 'YYYY'

const CustomInput = (props) => {
  return (
    <InputGroup size='sm'>
      <InputGroup.Text style={{ background: 'none' }}>
        <FontAwesomeIcon size='sm' icon={faCalendar} />
      </InputGroup.Text>
      <Form.Control
        style={{
          borderLeft: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }}
        type='text'
        className='form-control'
        disabled={props.disabled}
        name={props.name}
        value={props.value || ''}
        onClick={props.onClick}
      />
    </InputGroup>
  )
}

class InputYear extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    }

    this.onRefresh = debounce(this.onRefresh.bind(this), 200)
  }

  onRefresh() {
    if (this.props.isRange) {
      let start_selected = null

      let end_selected = null

      try {
        start_selected = moment(
          this.props.start_selected,
          formatDefault
        ).isValid()
          ? moment(this.props.start_selected, formatDefault).toDate()
          : moment(
              findArrayName('start_' + this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName('start_' + this.props.name, this.props.input),
              formatDefault
            ).toDate()
          : null
      } catch (e) {}

      try {
        end_selected = moment(this.props.end_selected, formatDefault).isValid()
          ? moment(this.props.end_selected, formatDefault).toDate()
          : moment(
              findArrayName('end_' + this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName('end_' + this.props.name, this.props.input),
              formatDefault
            ).toDate()
          : null
      } catch (e) {}

      this.setState({ start_selected, end_selected })
    } else {
      let selected = null

      try {
        selected = moment(this.props.selected, formatDefault).isValid()
          ? moment(this.props.selected, formatDefault).toDate()
          : moment(
              findArrayName(this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName(this.props.name, this.props.input),
              formatDefault
            ).toDate()
          : null
      } catch (e) {}

      this.setState({ selected })
    }
  }

  handleInputChange = (data) => {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    this.props.setInput(this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeStart = (data) => {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    this.props.setInput('start_' + this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeEnd = (data) => {
    data = moment(data, formatDefault).isValid()
      ? moment(data, formatDefault).format(formatDefault)
      : null

    this.props.setInput('end_' + this.props.name, data)

    this.onRefresh()
  }

  componentDidMount() {
    this.onRefresh()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.isRange &&
      findArrayName(this.props.name, prevProps.input) !=
        findArrayName(this.props.name, this.props.input) &&
      findArrayName(this.props.name, this.props.input) != this.state.selected
    ) {
      this.onRefresh()
    }

    if (
      this.props.isRange &&
      findArrayName('start_' + this.props.name, prevProps.input) !=
        findArrayName('start_' + this.props.name, this.props.input) &&
      findArrayName('start_' + this.props.name, this.props.input) !=
        this.state.start_selected
    ) {
      this.onRefresh()
    }

    if (
      this.props.isRange &&
      findArrayName('end_' + this.props.name, prevProps.input) !=
        findArrayName('end_' + this.props.name, this.props.input) &&
      findArrayName('end_' + this.props.name, this.props.input) !=
        this.state.end_selected
    ) {
      this.onRefresh()
    }
  }

  checkTglMerah = (date) => {
    let x = moment(date).format('d')

    return x == 0 || x == 6 ? 'tglmerah' : undefined
  }

  render() {
    let dateFormat = this.props.dateFormat ? this.props.dateFormat : 'yyyy'

    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return (
          (moment(this.state.start_selected, formatDefault).isValid()
            ? moment(this.state.start_selected, formatDefault).format('YYYY')
            : '') +
          ' - ' +
          (moment(this.state.end_selected, formatDefault).isValid()
            ? moment(this.state.end_selected, formatDefault).format('YYYY')
            : '')
        )
      } else {
        return (
          <div className='input-daterange input-group'>
            <DatePicker
              minDate={
                moment(this.props.minDate, formatDefault).isValid()
                  ? moment(this.props.minDate, formatDefault).toDate()
                  : null
              }
              maxDate={
                moment(this.props.maxDate, formatDefault).isValid()
                  ? moment(this.props.maxDate, formatDefault).toDate()
                  : null
              }
              dateFormat={dateFormat}
              placeholder={
                this.props.placeholder ? this.props.placeholder : 'Tahun'
              }
              selected={this.state.start_selected}
              isClearable={!this.props.disabled && !this.props.isReadonly}
              customInput={
                <CustomInput
                  value={this.state.start_selected}
                  name={'start_' + this.props.name}
                />
              }
              onChange={this.handleInputChangeStart}
              withPortal
              showYearPicker={true}
              name={'start_' + this.props.name}
              todayButton={null}
              dayClassName={this.checkTglMerah}
              dropdownMode='select'
              disabled={this.props.disabled || this.props.isReadonly}
              readOnly={this.props.disabled || this.props.isReadonly}
              startDate={this.state.start_selected}
              endDate={this.state.end_selected}
              shouldCloseOnSelect={false}
            />
            <span className='input-group-addon' style={{ background: 'none' }}>
              &nbsp; - &nbsp;
            </span>
            <DatePicker
              minDate={
                moment(this.state.start_selected, formatDefault).isValid()
                  ? moment(this.state.start_selected, formatDefault).toDate()
                  : moment(this.props.minDate, formatDefault).isValid()
                  ? moment(this.props.minDate, formatDefault).toDate()
                  : null
              }
              maxDate={
                moment(this.props.maxDate, formatDefault).isValid()
                  ? moment(this.props.maxDate, formatDefault).toDate()
                  : null
              }
              dateFormat={dateFormat}
              placeholder={
                this.props.placeholder ? this.props.placeholder : 'Tahun'
              }
              selected={this.state.end_selected}
              isClearable={!this.props.disabled && !this.props.isReadonly}
              name={'end_' + this.props.name}
              selectsEnd
              customInput={
                <CustomInput
                  value={this.state.end_selected}
                  name={'end_' + this.props.name}
                />
              }
              onChange={this.handleInputChangeEnd}
              withPortal
              showYearPicker={true}
              dayClassName={this.checkTglMerah}
              todayButton={null}
              dropdownMode='select'
              startDate={this.state.start_selected}
              endDate={this.state.end_selected}
              disabled={this.props.disabled || this.props.isReadonly}
              readOnly={this.props.disabled || this.props.isReadonly}
              shouldCloseOnSelect={false}
            />
          </div>
        )
      }
    }

    if (this.props.disabled || this.props.isReadonly) {
      return moment(this.props.input[this.props.name], formatDefault).isValid()
        ? moment(this.props.input[this.props.name], formatDefault).format(
            'YYYY'
          )
        : ''
    }

    return (
      <DatePicker
        minDate={
          moment(this.props.minDate, formatDefault).isValid()
            ? moment(this.props.minDate, formatDefault).toDate()
            : null
        }
        maxDate={
          moment(this.props.maxDate, formatDefault).isValid()
            ? moment(this.props.maxDate, formatDefault).toDate()
            : null
        }
        dateFormat={dateFormat}
        placeholder={this.props.placeholder ? this.props.placeholder : 'Tahun'}
        customInput={
          <CustomInput value={this.state.selected} name={this.props.name} />
        }
        selected={this.state.selected}
        isClearable={!this.props.disabled && !this.props.isReadonly}
        id={this.props.name}
        className='form-control'
        dayClassName={this.checkTglMerah}
        onChange={this.handleInputChange}
        withPortal
        showYearPicker={true}
        todayButton={null}
        dropdownMode='select'
        disabled={this.props.disabled || this.props.isReadonly}
        readOnly={this.props.disabled || this.props.isReadonly}
        shouldCloseOnSelect={false}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  input: state.core.input || {}
})

const mapDispatchToProps = (dispatch) => ({
  setInput: (key, val) =>
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })
})

export default connect(mapStateToProps, mapDispatchToProps)(InputYear)
