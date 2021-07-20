import React from 'react'

import {
  debounce,
  isEmpty,
  find,
  isUndefined,
  isNull,
  isArray,
  isEqual,
  includes
} from 'lodash'

import { Form } from 'react-bootstrap'

import { findArrayName, slug } from 'tcomponent'

import InputFile from './InputFile'

import { connect } from 'react-redux'

import parse from 'html-react-parser'

class InputChoose extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      defaultValue: null,
      type: this.props.type || 'inline'
    }

    this.onRefresh = debounce(this.onRefresh.bind(this), 200)
  }

  onRefresh() {
    // console.log('onRefresh')

    let val = null

    let defaultValue = null

    if (this.props.value) {
      val = this.props.value
    } else {
      val = findArrayName(this.props.name, this.props.input) || null
    }

    if (!isNull(val)) {
      if (this.props.isMultiple) {
        defaultValue = []

        for (let i = 0; i < this.props.options.length; i++) {
          for (let y = 0; y < val.length; y++) {
            let opt = this.props.options[i]

            let cur = val[y]

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt[this.props.optionValue])
            }
          }
        }
      } else {
        defaultValue = find(
          this.props.options,
          function (o) {
            return String(o[this.props.optionValue]) == String(val)
          }.bind(this)
        )
        // console.log(this.props.options, val, defaultValue)
      }
    }

    defaultValue =
      !isUndefined(defaultValue) && !isNull(defaultValue) ? defaultValue : null

    this.setState({
      defaultValue
    })
  }

  labelGenerate = (option) => {
    let label = []
    if (isArray(this.props.optionLabel)) {
      let separator = this.props.separator ? this.props.separator : ' | '

      for (let i = 0; i <= this.props.optionLabel.length - 1; i++) {
        let isi = option[this.props.optionLabel[i]]

        label.push(isi)
      }
    } else {
      label.push(option[this.props.optionLabel])
    }

    return label
  }

  onChange = (selectedOption) => {
    // console.log('onChange', selectedOption)

    if (!this.props.isReadonly && this.props.name) {
      try {
        if (this.props.isMultiple) {
          let current_val = this.state.defaultValue || []

          let removed = false

          let new_val = []

          for (let i = 0; i < current_val.length; i++) {
            let isi = current_val[i]

            if (isi == selectedOption[this.props.optionValue]) {
              removed = true
            } else {
              new_val.push(isi)
            }
          }

          if (!removed) {
            new_val.push(selectedOption[this.props.optionValue])
          }

          this.props.setInput(this.props.name, new_val)
        } else {
          let val = findArrayName(this.props.name, this.props.input) || null

          if (this.props.value) {
            val = this.props.value
          }

          let new_val = null

          if (val != selectedOption[this.props.optionValue]) {
            new_val = selectedOption[this.props.optionValue]
          }
          this.props.setInput(this.props.name, new_val)
          // console.log('NEW_VAL_SINGLE', new_val)
        }
      } catch (e) {
        // console.log(e)
        this.props.setInput(this.props.name, null)
      }
    }

    this.onRefresh()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(
        findArrayName(this.props.name, prevProps.input),
        findArrayName(this.props.name, this.props.input)
      ) &&
      !isEqual(
        this.state.defaultValue,
        findArrayName(this.props.name, this.props.input)
      )
    ) {
      this.onRefresh()
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  render() {
    let options = []

    try {
      options = this.props.options.length > 0 ? this.props.options : []
    } catch (e) {}

    return (
      <div className='custom-controls-stacked'>
        {options.map((value) => {
          let isChecked = false

          // console.log(value, this.state.defaultValue, this.props.optionValue)

          try {
            if (this.props.isMultiple) {
              isChecked = includes(
                this.state.defaultValue,
                value[this.props.optionValue]
              )
            } else {
              isChecked = isEqual(
                value[this.props.optionValue],
                this.state.defaultValue[this.props.optionValue]
              )
            }
          } catch (e) {
            // console.log(e)
          }
          // console.log(this.props.name, isChecked)
          /*
          if (this.props.disabled || this.props.isReadonly) {
            if (isChecked) {
              return this.labelGenerate(value).map((val, i) => {
                if (isEqual(String(val).substring(0, 3), 'AT-')) {
                  return (
                    <InputFile value={val} isReadonly={true} preview={true} />
                  )
                } else {
                  return this.props.isHtml ? parse(String(val)) : val
                }
              })
            } else {
              return null
            }
          } else {
            */

          return (
            <React.Fragment>
              <Form.Check
                inline={this.state.type == 'inline'}
                disabled={this.props.disabled || this.props.isReadonly}
                type={this.props.isMultiple ? 'checkbox' : 'radio'}
                // className='custom-control-input'
                name={this.props.name}
                onChange={this.onChange.bind(this, value)}
                value={value}
                checked={isChecked}
                label={this.labelGenerate(value).map((val, i) => {
                  if (isEqual(String(val).substring(0, 3), 'AT-')) {
                    return (
                      <InputFile value={val} isReadonly={true} preview={true} />
                    )
                  } else {
                    return this.props.isHtml ? parse(String(val)) : val
                  }
                })}
              />
            </React.Fragment>
          )
        })}
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  input: state.core.input || {}
})

let mapDispatchToProps = (dispatch) => ({
  setInput: (key, val) =>
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key)),
        value: val
      }
    })
})

export default connect(mapStateToProps, mapDispatchToProps)(InputChoose)
