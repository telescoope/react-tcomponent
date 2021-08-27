import React from 'react'

import moment from 'moment'

import { debounce } from 'lodash'

import TimePicker from 'rc-time-picker'

import { connect } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

import './InputTime.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faClock } from '@fortawesome/free-regular-svg-icons'

let formattime = 'HH:mm:ss'

let now = moment()

function IconClock() {
  return (
    <FontAwesomeIcon
      style={{ position: 'absolute', left: 6, top: 6 }}
      icon={faClock}
      size='sm'
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
        start_selected = moment(this.props.start_selected).isValid()
          ? moment(this.props.start_selected, formattime)
          : moment(
              findArrayName('start_' + this.props.name, this.props.input)
            ).isValid()
          ? moment(
              findArrayName('start_' + this.props.name, this.props.input),
              formattime
            )
          : null
      } catch (e) {}

      try {
        end_selected = moment(this.props.end_selected).isValid()
          ? moment(this.props.end_selected, formattime)
          : moment(
              findArrayName('end_' + this.props.name, this.props.input)
            ).isValid()
          ? moment(
              findArrayName('end_' + this.props.name, this.props.input),
              formattime
            )
          : null
      } catch (e) {}

      this.setState({ start_selected, end_selected })
    } else {
      let selected = moment()

      try {
        selected = moment(this.props.selected).isValid()
          ? moment(this.props.selected, formattime)
          : moment(findArrayName(this.props.name, this.props.input)).isValid()
          ? moment(findArrayName(this.props.name, this.props.input), formattime)
          : null
      } catch (e) {}

      this.setState({ selected })
    }
  }

  handleInputChange = (data) => {
    data = data ? moment(data).format(formattime) : null

    this.props.setInput(this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeStart = (data) => {
    data = data ? moment(data).format(formattime) : null

    this.props.setInput('start_' + this.props.name, data)

    this.onRefresh()
  }

  handleInputChangeEnd = (data) => {
    data = data ? moment(data).format(formattime) : null

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
            {moment(this.state.start_selected).isValid()
              ? moment(this.state.start_selected).format(formattime)
              : ''}

            <span style={{ background: 'none' }}>&nbsp; s/d &nbsp;</span>
            {moment(this.state.end_selected).isValid()
              ? moment(this.state.end_selected).format(formattime)
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
            format={formattime}
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
            format={formattime}
            onChange={this.handleInputChangeEnd}
          />
        </div>
      )
    }

    if (this.props.disabled || this.props.isReadonly) {
      return (
        <div className='input-daterange input-group'>
          {moment(this.state.selected).isValid()
            ? moment(this.state.selected).format(formattime)
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
        format={formattime}
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
