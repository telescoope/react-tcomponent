import React, { useState, useRef, createRef, useEffect } from 'react'

import Cleave from 'cleave.js/react'

import { isEmpty, isUndefined, isNull, isEqual } from 'lodash'

import PhoneInput from 'react-phone-number-input'

import JoditEditor from 'jodit-react'

import Mousetrap from 'mousetrap'

import './InputText.module.css'

import { findArrayName, slug } from 'tcomponent'

import parse from 'html-react-parser'

import { Form, Modal } from 'react-bootstrap'

import * as MathType from '@wiris/mathtype-generic'

import ContentEditable from 'react-contenteditable'

import { useDispatch, useSelector } from 'react-redux'

class WirisEquationEditor extends React.Component {
  constructor(props) {
    super(props)
    // this.toolbarRef = props.toolbarRef;
    this.equationEditorRef = React.createRef()
    this.toolbarRef = React.createRef()
  }

  componentDidMount() {
    let { toolbarRef } = this.props

    try {
      let genericIntegrationProperties = {}

      genericIntegrationProperties.target = this.equationEditorRef.current

      genericIntegrationProperties.toolbar = this.toolbarRef.current

      let genericIntegrationInstance =
        new window.WirisPlugin.GenericIntegration(genericIntegrationProperties)

      genericIntegrationInstance.init()

      genericIntegrationInstance.listeners.fire('onTargetReady', {})
    } catch (e) {}
  }

  handleEquationChange = (event) => {
    let { onEquationInput } = this.props
    let mathFormat = window.WirisPlugin.Parser.endParse(event.target.value)
    let equationImage = event.target.value
    onEquationInput(equationImage, mathFormat)
  }

  render() {
    let { value } = this.props || {}
    return (
      <div>
        <div ref={this.toolbarRef} />
        <ContentEditable
          suppressContentEditableWarning={true}
          className='form-control'
          innerRef={this.equationEditorRef}
          onChange={this.handleEquationChange}
          html={value || ''}
        />
      </div>
    )
  }
}

function InputText(props) {
  const dispatch = useDispatch()

  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const [placeholder, setPlaceholder] = useState(props?.placeholder || '')

  const type = !isUndefined(props?.type) ? String(props?.type) : ''

  const [open, setOpen] = useState(false)

  const [optionsCleave, setOptionsCleave] = useState({})

  const [config, setConfig] = useState({
    readonly: false,
    placeholder: ' ',
    toolbarButtonSize: 'small'
  })

  const input = useSelector((state) => state.core?.input) || {}

  const toolbarRef = useRef()

  const editorRef = useRef()

  // const toolbarRef = React.createRef()

  // const editorRef = React.createRef()

  let defaultType = type === 'text' || isUndefined(type) ? 'search' : type

  let value = findArrayName(propsName, input) || ''

  useEffect(() => {
    let default_placeholder = props?.placeholder || ''

    let options_cleave = {}

    if (type.toLowerCase() == 'nik') {
      options_cleave = {
        delimiter: ' ',
        blocks: [2, 2, 2, 6, 4],
        numericOnly: true
      }
      default_placeholder = props?.placeholder || 'Nomor Induk Kependudukan'
    } else if (type.toLowerCase() == 'kip') {
      options_cleave = {
        delimiter: ' ',
        blocks: [4, 4, 4, 4]
      }
      default_placeholder = props?.placeholder || 'Kartu Indonesia Pintar'
    } else if (type.toLowerCase() == 'npwp') {
      options_cleave = {
        delimiters: ['.', '.', '.', '-', '.'],
        blocks: [2, 3, 3, 1, 3, 3],
        numericOnly: true
      }
      default_placeholder = props?.placeholder || 'Nomor Pokok Wajib Pajak'
    } else if (type.toLowerCase() == 'postcode') {
      options_cleave = {
        blocks: [5],
        delimiter: ' ',
        numericOnly: true
      }
      default_placeholder = props?.placeholder || 'Kode Pos'
    } else if (type.toLowerCase() == 'phone') {
      default_placeholder = props?.placeholder || 'Telepon'
    }
    setPlaceholder(default_placeholder)
    setOptionsCleave(options_cleave)
  }, [type])

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
  }, [])

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
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function onChange(data) {
    setInput(propsName, data)
  }

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
        <Modal size='lg' show={open} onHide={closeModal}>
          <Modal.Header onHide={closeModal} closeButton>
            <Modal.Title>{placeholder || 'Text Editor'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JoditEditor
              key={props?.name + '_editor'}
              id={props?.id}
              ref={editorRef}
              value={!isEmpty(value) ? String(value) : ''}
              config={config}
              tabIndex={1}
              onChange={onChange}
            />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
  } else if (type == 'equation') {
    return (
      <React.Fragment>
        <div
          className='form-control'
          style={{ minHeight: 32 }}
          onClick={openModal}
        >
          {!isEmpty(value) ? parse(String(value)) : ''}
        </div>
        <Modal size='lg' show={open} onHide={closeModal}>
          <Modal.Header onHide={closeModal} closeButton>
            <Modal.Title>{placeholder || 'Equation Editor'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id={props?.id}>
              <WirisEquationEditor
                id={props?.id}
                onEquationInput={onChange}
                toolbarRef={toolbarRef}
                value={value}
              />
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
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
