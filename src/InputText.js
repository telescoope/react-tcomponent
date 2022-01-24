import React, { useState, useRef, useEffect } from 'react'

import Cleave from 'cleave.js/react'

import { isEmpty, isUndefined, isNull, isEqual } from 'lodash'

import PhoneInput from 'react-phone-number-input'

import JoditEditor from 'jodit-react'

import Mousetrap from 'mousetrap'

import './InputText.module.css'

import { findArrayName, slug } from 'tcomponent'

import parse from 'html-react-parser'

import { Form, Modal, InputGroup, Button, Input } from 'react-bootstrap'

import * as MathType from '@wiris/mathtype-generic'

import ContentEditable from 'react-contenteditable'

import { useDispatch, useSelector } from 'react-redux'

function InputText(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const input = useSelector((state) => state.core?.input) || {}

  const value = findArrayName(propsName, input) || ''

  const dispatch = useDispatch()

  const type = !isUndefined(props?.type) ? String(props?.type) : ''

  const defaultType = type === 'text' || isUndefined(type) ? 'search' : type

  const [open, setOpen] = useState(false)

  const [temp, setTemp] = useState('')

  let placeholder = props?.placeholder || ''

  let optionsCleave = {}

  if (defaultType.toLowerCase() == 'nik') {
    optionsCleave = {
      delimiter: ' ',
      blocks: [2, 2, 2, 6, 4],
      numericOnly: true
    }
    placeholder = props?.placeholder || 'Nomor Induk Kependudukan'
  } else if (defaultType.toLowerCase() == 'kip') {
    optionsCleave = {
      delimiter: ' ',
      blocks: [4, 4, 4, 4]
    }
    placeholder = props?.placeholder || 'Kartu Indonesia Pintar'
  } else if (defaultType.toLowerCase() == 'npwp') {
    optionsCleave = {
      delimiters: ['.', '.', '.', '-', '.'],
      blocks: [2, 3, 3, 1, 3, 3],
      numericOnly: true
    }
    placeholder = props?.placeholder || 'Nomor Pokok Wajib Pajak'
  } else if (defaultType.toLowerCase() == 'postcode') {
    optionsCleave = {
      blocks: [5],
      delimiter: ' ',
      numericOnly: true
    }
    placeholder = props?.placeholder || 'Kode Pos'
  } else if (defaultType.toLowerCase() == 'phone') {
    placeholder = props?.placeholder || 'Telepon'
  }

  const config = useState({
    readonly: false,
    placeholder: ' ',
    toolbarButtonSize: 'small'
  })

  const toolbarRef = useRef()

  const editorRef = useRef()

  const equationEditorRef = useRef()

  useEffect(() => {
    if (!isUndefined(props?.value)) {
      onChange(props?.value)
    }
  }, [props?.value])

  useEffect(() => {
    if (props?.disableCopy || props?.disablePaste || props?.disableSelectAll) {
      let comb = []

      if (props?.disableCopy) {
        comb.push('command+c')
        comb.push('ctrl+c')
      }

      if (props?.disablePaste) {
        comb.push('command+v')
        comb.push('ctrl+v')
      }

      if (props?.disableSelectAll) {
        comb.push('command+a')
        comb.push('ctrl+a')
      }

      if (comb.length > 0) {
        Mousetrap.bind(comb, function () {
          return false
        })
      }
    }

    if (type == 'equation') {
      try {
        let genericIntegrationProperties = {}

        genericIntegrationProperties.target = equationEditorRef.current

        genericIntegrationProperties.toolbar = toolbarRef.current

        let genericIntegrationInstance =
          new window.WirisPlugin.GenericIntegration(
            genericIntegrationProperties
          )

        genericIntegrationInstance.init()

        genericIntegrationInstance.listeners.fire('onTargetReady', {})

        WirisPlugin.currentInstance = genericIntegrationInstance
      } catch (e) {}
    }
  }, [])

  function handleEquationChange(event) {
    let mathFormat = window.WirisPlugin.Parser.endParse(event.target.value)
    let equationImage = event.target.value
    onChange(equationImage, mathFormat)
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

  function handleInputChange(event) {
    event.preventDefault()

    // console.log(propsName, event.target.value, event.target.rawValue)

    let data = event.target.value ? String(event.target.value) : ''

    if (
      type == 'nik' ||
      type == 'kip' ||
      type == 'npwp' ||
      type == 'postcode'
    ) {
      data = data.replace(/\D/g, '')
    }

    if (props?.maxlength) {
      data = data.substring(0, props?.maxlength)
    }

    onChange(data)
  }

  function openModal() {
    setTemp('')
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function onChange(data) {
    setInput(propsName, data)
  }

  function moveTemp() {
    onChange(temp)
    closeModal()
  }

  // console.log('optionsCleave', propsName, value, optionsCleave)

  if (!propsName) return 'Name is Required'

  if (props?.disabled || props?.isReadonly) {
    return !isEmpty(value) && parse(String(value))
  } else if (
    type == 'nik' ||
    type == 'kip' ||
    type == 'npwp' ||
    type == 'postcode'
  ) {
    return (
      <Cleave
        placeholder={placeholder}
        id={props?.id}
        name={propsName}
        value={value}
        onChange={handleInputChange}
        options={optionsCleave}
        className='form-control'
      />
    )
  } else if (type == 'textarea') {
    return (
      <textarea
        id={props?.id}
        rows={props?.rows || 3}
        className='form-control no-resize mousetrap'
        onChange={handleInputChange}
        name={propsName}
        value={value}
        placeholder={placeholder}
      ></textarea>
    )
  } else if (type == 'phone') {
    return (
      <PhoneInput
        international
        defaultCountry='ID'
        // inputComponent={React.memo(() => (
        //   <Input
        //     type='tel'
        //     autocomplete='tel'
        //     class='PhoneInputInput form-control'
        //     onChange={onChange}
        //     value={value ? String(value) : ''}
        //   />
        // ))}
        numberInputProps={{ className: 'form-control' }}
        value={value ? String(value) : ''}
        onChange={onChange}
      />
    )
  } else if (type == 'texteditor') {
    return (
      <React.Fragment>
        <div
          className='form-control'
          style={{ minHeight: 32 }}
          onClick={openModal}
        >
          {!isEmpty(value) ? parse(String(value)) : ''}
        </div>
        <Modal
          backdrop={'static'}
          autoFocus={true}
          restoreFocus={true}
          centered
          size='xl'
          show={open}
          onHide={closeModal}
        >
          <Modal.Body>
            <JoditEditor
              key={props?.name + '_editor'}
              id={props?.id}
              ref={editorRef}
              value={!isEmpty(value) ? String(value) : ''}
              config={config}
              tabIndex={1}
              onChange={(data) => setTemp(data)}
            />
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: 'space-between' }}>
            <Button onClick={closeModal} variant='secondary'>
              Kembali
            </Button>
            <Button onClick={moveTemp} variant='primary'>
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  } else if (type == 'equation') {
    return (
      <InputGroup>
        <InputGroup.Text>
          <div ref={toolbarRef} />
        </InputGroup.Text>

        <ContentEditable
          suppressContentEditableWarning={true}
          className='form-control'
          innerRef={equationEditorRef}
          onChange={handleEquationChange}
          html={value || ''}
        />
      </InputGroup>
    )
  }

  return (
    <Form.Control
      id={props?.id}
      type={defaultType}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      name={propsName}
      className='form-control mousetrap'
    />
  )
}

export default InputText
