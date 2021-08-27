import React from 'react'

import moment from 'moment'

import { debounce } from 'lodash'

import { findArrayName, slug } from 'tcomponent'

import DatePicker from 'react-datepicker'

import './InputDate.module.css'

import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'

import { InputGroup, Form } from 'react-bootstrap'

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

class InputDate extends React.Component {
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
        start_selected = moment(this.props.start_selected).isValid()
          ? moment(this.props.start_selected).toDate()
          : moment(
              findArrayName('start_' + this.props.name, this.props.input)
            ).isValid()
          ? moment(
              findArrayName('start_' + this.props.name, this.props.input)
            ).toDate()
          : null
      } catch (e) {}

      try {
        end_selected = moment(this.props.end_selected).isValid()
          ? moment(this.props.end_selected).toDate()
          : moment(
              findArrayName('end_' + this.props.name, this.props.input)
            ).isValid()
          ? moment(
              findArrayName('end_' + this.props.name, this.props.input)
            ).toDate()
          : null
      } catch (e) {}

      this.setState({ start_selected, end_selected })
    } else {
      let selected = null

      try {
        selected = moment(this.props.selected).isValid()
          ? moment(this.props.selected).toDate()
          : moment(findArrayName(this.props.name, this.props.input)).isValid()
          ? moment(findArrayName(this.props.name, this.props.input)).toDate()
          : null
      } catch (e) {}

      this.setState({ selected })
    }
  }

  handleInputChange = (data) => {
    data = moment(data).isValid() ? moment(data).format('YYYY-MM-DD') : null

    this.props.setInput(this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeStart = (data) => {
    data = moment(data).isValid() ? moment(data).format('YYYY-MM-DD') : null

    this.props.setInput('start_' + this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeEnd = (data) => {
    data = moment(data).isValid() ? moment(data).format('YYYY-MM-DD') : null

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
    let dateFormat = this.props.dateFormat
      ? this.props.dateFormat
      : this.props.yearOnly
      ? 'yyyy'
      : 'yyyy-MM-dd'

    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return (
          (moment(this.state.start_selected).isValid()
            ? moment(this.state.start_selected).format('DD-MM-YYYY')
            : '') +
          ' - ' +
          (moment(this.state.end_selected).isValid()
            ? moment(this.state.end_selected).format('DD-MM-YYYY')
            : '')
        )
      } else {
        return (
          <div className='input-daterange input-group'>
            <DatePicker
              minDate={
                moment(this.props.minDate).isValid()
                  ? moment(this.props.minDate).toDate()
                  : null
              }
              maxDate={
                moment(this.props.maxDate).isValid()
                  ? moment(this.props.maxDate).toDate()
                  : null
              }
              dateFormat={dateFormat}
              placeholder={
                this.props.placeholder ? this.props.placeholder : 'Tanggal'
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
              selectsStart={!this.props.yearOnly}
              peekNextMonth={!this.props.yearOnly}
              withPortal
              showMonthDropdown={!this.props.yearOnly}
              showYearDropdown={!this.props.yearOnly}
              showYearPicker={this.props.yearOnly}
              name={'start_' + this.props.name}
              todayButton={this.props.yearOnly ? null : 'Hari ini'}
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
                moment(this.state.start_selected).isValid()
                  ? moment(this.state.start_selected).toDate()
                  : moment(this.props.minDate).isValid()
                  ? moment(this.props.minDate).toDate()
                  : null
              }
              maxDate={
                moment(this.props.maxDate).isValid()
                  ? moment(this.props.maxDate).toDate()
                  : null
              }
              dateFormat={dateFormat}
              placeholder={
                this.props.placeholder ? this.props.placeholder : 'Tanggal'
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
              selectsStart={!this.props.yearOnly}
              peekNextMonth={!this.props.yearOnly}
              withPortal
              showMonthDropdown={!this.props.yearOnly}
              showYearDropdown={!this.props.yearOnly}
              showYearPicker={this.props.yearOnly}
              dayClassName={this.checkTglMerah}
              todayButton={this.props.yearOnly ? null : 'Hari ini'}
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

    /*
    if (this.props.yearOnly) {
      if (this.props.disabled || this.props.isReadonly) {
        return moment(this.state.selected).format('YYYY')
      } else {
        return (
          <DatePicker
            dateFormat={dateFormat}
            placeholder={
              this.props.placeholder ? this.props.placeholder : 'Tahun'
            }
            selected={this.state.selected}
            id={this.props.name}
            showYearPicker
            customInput={
              <CustomInput value={this.state.selected} name={this.props.name} />
            }
            disabled={this.props.disabled || this.props.isReadonly}
            readOnly={this.props.disabled || this.props.isReadonly}
            onChange={this.handleInputChange}
            shouldCloseOnSelect={false}
          />
        )
      }
    }
    */

    if (this.props.disabled || this.props.isReadonly) {
      return moment(this.props.input[this.props.name]).isValid()
        ? moment(this.props.input[this.props.name]).format(
            this.props.yearOnly ? 'YYYY' : 'DD-MM-YYYY'
          )
        : ''
    }

    return (
      <DatePicker
        minDate={
          moment(this.props.minDate).isValid()
            ? moment(this.props.minDate).toDate()
            : null
        }
        maxDate={
          moment(this.props.maxDate).isValid()
            ? moment(this.props.maxDate).toDate()
            : null
        }
        dateFormat={dateFormat}
        placeholder={
          this.props.placeholder ? this.props.placeholder : 'Tanggal'
        }
        customInput={
          <CustomInput value={this.state.selected} name={this.props.name} />
        }
        selected={this.state.selected}
        isClearable={!this.props.disabled && !this.props.isReadonly}
        id={this.props.name}
        className='form-control'
        dayClassName={this.checkTglMerah}
        onChange={this.handleInputChange}
        selectsStart={!this.props.yearOnly}
        peekNextMonth={!this.props.yearOnly}
        withPortal
        showMonthDropdown={!this.props.yearOnly}
        showYearDropdown={!this.props.yearOnly}
        showYearPicker={this.props.yearOnly}
        todayButton={this.props.yearOnly ? null : 'Hari ini'}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputDate)
