import React, { useEffect } from 'react'

import {
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

import { useSelector, useDispatch } from 'react-redux'

import parse from 'html-react-parser'

function InputChoose(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  const parameter = useSelector((state) => state.core?.parameter) || {}

  let value = findArrayName(propsName, input) || null

  let valueParam =
    findArrayName('selected_' + propsName, parameter) ||
    (props.isMultiple ? [] : {})

  const type = props.type || 'inline'

  let options = []

  try {
    options = props.options.length > 0 ? props.options : []
  } catch (e) {}

  function labelGenerate(option) {
    let label = []
    if (isArray(props.optionLabel)) {
      let separator = props.separator ? props.separator : ' | '

      for (let i = 0; i <= props.optionLabel.length - 1; i++) {
        let isi = option[props.optionLabel[i]]

        label.push(isi)
      }
    } else {
      label.push(option[props.optionLabel])
    }

    return label
  }

  function setInput(key, val) {
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })

    let defaultValue = null

    if (props.isMultiple) {
      defaultValue = []

      try {
        if (isArray(options) && isArray(val)) {
          for (let i = 0; i < options.length; i++) {
            for (let y = 0; y < val.length; y++) {
              let opt = options[i]

              let cur = val[y]

              if (String(opt[props.optionValue]) == String(cur)) {
                defaultValue.push(opt)
              }
            }
          }
        }
      } catch (e) {}

      if (defaultValue.length == 0) {
        defaultValue = null
      }
    } else {
      defaultValue =
        find(
          options,
          function (o) {
            return String(o[props.optionValue]) == String(val)
          }.bind(this)
        ) || {}

      if (isEmpty(defaultValue)) {
        defaultValue = null
      }
    }

    if (!isUndefined(defaultValue)) {
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: 'selected_' + propsName,
          value: defaultValue
        }
      })
    }
  }

  function onChange(selectedOption) {
    if (!props.isReadonly && propsName) {
      try {
        if (props.isMultiple) {
          let current_val = value || []

          let removed = false

          let new_val = []

          for (let i = 0; i < current_val.length; i++) {
            let isi = current_val[i]

            if (isi == selectedOption[props.optionValue]) {
              removed = true
            } else {
              new_val.push(isi)
            }
          }

          if (!removed) {
            new_val.push(selectedOption[props.optionValue])
          }

          setInput(propsName, new_val)
        } else {
          let val = value

          if (props.value) {
            val = props.value
          }

          let new_val = null

          if (val != selectedOption[props.optionValue]) {
            new_val = selectedOption[props.optionValue]
          }

          setInput(propsName, new_val)
        }
      } catch (e) {
        setInput(propsName, null)
      }
    }
  }

  return (
    <div className='custom-controls-stacked'>
      {options.map((v) => {
        let isChecked = false

        try {
          if (props.isMultiple) {
            isChecked = includes(value, v[props.optionValue])
          } else {
            isChecked = isEqual(value, v[props.optionValue])
          }
        } catch (e) {}

        return (
          <React.Fragment>
            <Form.Check
              inline={type === 'inline'}
              disabled={props.disabled || props.isReadonly}
              type={props.isMultiple ? 'checkbox' : 'radio'}
              name={propsName}
              onChange={(value) => onChange(v)}
              value={v}
              checked={isChecked}
              label={labelGenerate(v).map((val, i) => {
                if (isEqual(String(val).substring(0, 3), 'AT-')) {
                  return (
                    <InputFile value={val} isReadonly={true} preview={true} />
                  )
                } else {
                  return props.isHtml ? parse(String(val)) : val
                }
              })}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default InputChoose
