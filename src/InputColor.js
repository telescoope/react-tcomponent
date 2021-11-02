import React, { useState } from 'react'

import { SketchPicker } from 'react-color'

import { Button } from 'react-bootstrap'

import { useSelector, useDispatch } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

import { isUndefined } from 'lodash'

function InputColor(props) {
  let [open, setOpen] = useState(false)

  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  const parameter = useSelector((state) => state.core?.parameter) || {}

  const value = findArrayName(propsName, input) || ''

  function handleInputChange(data) {
    setInput(propsName, data.hex)

    setParameter('selected_' + propsName, data)
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

  function setParameter(key, val) {
    dispatch({
      type: 'SET_PARAMETER',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })
  }

  function toggle() {
    setOpen(!open)
  }

  const isReadonly = props.disabled || props.isReadonly

  return (
    <React.Fragment>
      {open ? (
        <div
          style={{
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
            zIndex: 999
          }}
        >
          <SketchPicker color={value} onChangeComplete={handleInputChange} />
          <Button
            style={{ marginTop: 10, backgroundColor: value, border: 0 }}
            className='btn btn-primary'
            onClick={toggle}
            type='button'
          >
            Pilih
          </Button>
        </div>
      ) : (
        <Button
          style={{ zIndex: 0, backgroundColor: value, border: 0 }}
          className='btn btn-primary'
          onClick={toggle}
          type='button'
        >
          Pilih
        </Button>
      )}
    </React.Fragment>
  )
}

export default InputColor
