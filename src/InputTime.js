import React from 'react'

import moment from 'moment'

import { debounce } from 'lodash'

import TimePicker from 'rc-time-picker'

import { connect } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

import './InputTime.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faClock } from '@fortawesome/free-regular-svg-icons'

let formatDefault = 'HH:mm:ss'

let now = moment()

function IconClock() {
  return (
    <FontAwesomeIcon
      style={{ position: 'absolute', left: 8, top: 11 }}
      icon={faClock}
    />
  )
}

class InputTime extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    }

    this.onRefresh = debounce(this.onRefresh.bind(this), 200)
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

  onRefresh() {
    if (this.props.isRange) {
      let start_selected = moment()

      let end_selected = moment()

      try {
        start_selected = moment(
          this.props.start_selected,
          formatDefault
        ).isValid()
          ? moment(this.props.start_selected, formatDefault)
          : moment(
              findArrayName('start_' + this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName('start_' + this.props.name, this.props.input),
              formatDefault
            )
          : null
      } catch (e) {}

      try {
        end_selected = moment(this.props.end_selected, formatDefault).isValid()
          ? moment(this.props.end_selected, formatDefault)
          : moment(
              findArrayName('end_' + this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName('end_' + this.props.name, this.props.input),
              formatDefault
            )
          : null
      } catch (e) {}

      this.setState({ start_selected, end_selected })
    } else {
      let selected = moment()

      try {
        selected = moment(this.props.selected, formatDefault).isValid()
          ? moment(this.props.selected, formatDefault)
          : moment(
              findArrayName(this.props.name, this.props.input),
              formatDefault
            ).isValid()
          ? moment(
              findArrayName(this.props.name, this.props.input),
              formatDefault
            )
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

  render() {
    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return (
          <div className='input-daterange input-group'>
            {moment(this.state.start_selected, formatDefault).isValid()
              ? moment(this.state.start_selected, formatDefault).format(
                  formatDefault
                )
              : ''}

            <span style={{ background: 'none' }}>&nbsp; s/d &nbsp;</span>
            {moment(this.state.end_selected, formatDefault).isValid()
              ? moment(this.state.end_selected, formatDefault).format(
                  formatDefault
                )
              : ''}
          </div>
        )
      }

      return (
        <div className='input-daterange input-group'>
          <TimePicker
            value={this.state.start_selected}
            disabled={this.props.disabled || this.props.isReadonly}
            // showSecond={false}
            inputIcon={<IconClock />}
            format={formatDefault}
            onChange={this.handleInputChangeStart}
          />
          <span className='input-group-addon' style={{ background: 'none' }}>
            &nbsp; - &nbsp;
          </span>
          <TimePicker
            value={this.state.end_selected}
            disabled={this.props.disabled || this.props.isReadonly}
            inputIcon={<IconClock />}
            // showSecond={false}
            format={formatDefault}
            onChange={this.handleInputChangeEnd}
          />
        </div>
      )
    }

    if (this.props.disabled || this.props.isReadonly) {
      return (
        <div className='input-daterange input-group'>
          {moment(this.state.selected, formatDefault).isValid()
            ? moment(this.state.selected, formatDefault).format(formatDefault)
            : ''}
        </div>
      )
    }

    return (
      <TimePicker
        value={this.state.selected}
        disabled={this.props.disabled || this.props.isReadonly}
        // showSecond={false}
        inputIcon={<IconClock />}
        format={formatDefault}
        onChange={this.handleInputChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputTime)
