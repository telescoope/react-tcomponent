import React, { useState, useRef } from 'react'

import Cleave from 'cleave.js/react'

import { isEmpty, isUndefined, isNull, isEqual } from 'lodash'

import { connect } from 'react-redux'

import PhoneInput from 'react-phone-number-input'

import JoditEditor from 'jodit-react'

import Mousetrap from 'mousetrap'

// import SunEditor from 'suneditor-react'

import './InputText.module.css'

import { findArrayName, slug } from 'tcomponent'

import parse from 'html-react-parser'

import { Form, Modal } from 'react-bootstrap'

import * as MathType from '@wiris/mathtype-generic'

import ContentEditable from 'react-contenteditable'

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

class InputText extends React.Component {
  constructor(props) {
    super(props)

    let default_placeholder = this.props.placeholder || 'Isi disini'

    let option_summer = {}

    let options_cleave = {}

    let type = this.props.type ? String(this.props.type) : ''

    if (type.toLowerCase() == 'nik') {
      options_cleave = {
        delimiter: ' ',
        blocks: [2, 2, 2, 6, 4],
        numericOnly: true
      }
      default_placeholder = this.props.placeholder || 'Nomor Induk Kependudukan'
    } else if (type.toLowerCase() == 'kip') {
      options_cleave = {
        delimiter: ' ',
        blocks: [4, 4, 4, 4]
      }
      default_placeholder = this.props.placeholder || 'Kartu Indonesia Pintar'
    } else if (type.toLowerCase() == 'npwp') {
      options_cleave = {
        delimiters: ['.', '.', '.', '-', '.'],
        blocks: [2, 3, 3, 1, 3, 3],
        numericOnly: true
      }
      default_placeholder = this.props.placeholder || 'Nomor Pokok Wajib Pajak'
    } else if (type.toLowerCase() == 'postcode') {
      options_cleave = {
        blocks: [5],
        delimiter: ' ',
        numericOnly: true
      }
      default_placeholder = this.props.placeholder || 'Kode Pos'
    } else if (type.toLowerCase() == 'phone') {
      default_placeholder = this.props.placeholder || 'Telepon'
    }

    this.state = {
      type,
      open: false,
      placeholder: default_placeholder,
      options_cleave,
      value: this.props.value ? String(this.props.value) : '',
      props_name: this.props.name ? slug(String(this.props.name), '_') : '',
      config: {
        readonly: false,
        placeholder: ' ',
        toolbarButtonSize: 'small'
      }
    }

    this.toolbarRef = React.createRef()

    this.editorRef = React.createRef()
  }

  componentDidUpdate(prevProps, prevState) {
    //// console.log('componentDidUpdate InputText')
    if (!isEqual(this.props.type, prevProps.type)) {
      this.setState({ type: this.props.type })
    }
    try {
      if (
        !isEqual(
          findArrayName(this.state.props_name, this.props.input),
          findArrayName(this.state.props_name, prevProps.input)
        ) &&
        !isEqual(
          this.state.value,
          findArrayName(this.state.props_name, this.props.input)
        )
      ) {
        let value = this.props.input[this.state.props_name] || ''

        this.setState({ value })
      }
    } catch (e) {}

    if (this.props.value && prevProps.value != this.props.value) {
      let value = this.props.value || ''

      this.setState({ value })
    }
  }

  componentDidMount() {
    if (
      this.props.disableCopy ||
      this.props.disablePaste ||
      this.props.disableSelectAll
    ) {
      let comb = []

      if (this.props.disableCopy) {
        comb.push('command+c')
        comb.push('ctrl+c')
      }

      if (this.props.disablePaste) {
        comb.push('command+v')
        comb.push('ctrl+v')
      }

      if (this.props.disableSelectAll) {
        comb.push('command+a')
        comb.push('ctrl+a')
      }

      if (comb.length > 0) {
        Mousetrap.bind(comb, function () {
          return false
        })
      }
    }

    let value = ''

    try {
      let input_name = findArrayName(this.state.props_name, this.props.input)
      value = this.props.value ? this.props.value : input_name
    } catch (e) {}

    this.setState({ value })
  }

  handleInputChange = (event) => {
    event.preventDefault()

    let data = event.target.value ? String(event.target.value) : ''

    if (
      this.state.type == 'nik' ||
      this.state.type == 'kip' ||
      this.state.type == 'npwp' ||
      this.state.type == 'postcode'
    ) {
      data = data.replace(/\D/g, '')
    }

    if (this.props.maxlength) {
      data = data.substring(0, this.props.maxlength)
    }

    this.setState({ value: data })

    this.props.setInput(this.state.props_name, data)
  }

  openModal = () => {
    this.setState({ open: true })
  }

  closeModal = () => {
    this.setState({ open: false })
  }

  onChange = (data) => {
    this.setState({ value: data })

    this.props.setInput(this.state.props_name, data)
  }

  render() {
    // console.log(this.editorRef)

    if (!this.state.props_name) return 'Name is Required'

    if (this.props.disabled || this.props.isReadonly) {
      return !isEmpty(this.state.value) && parse(String(this.state.value))
    } else if (
      this.state.type == 'nik' ||
      this.state.type == 'kip' ||
      this.state.type == 'npwp' ||
      this.state.type == 'postcode'
    ) {
      return (
        <Cleave
          placeholder={this.state.placeholder}
          id={this.props.id}
          name={this.state.props_name}
          value={this.state.value}
          onChange={this.handleInputChange}
          options={this.state.options_cleave}
          className='form-control'
        />
      )
    } else if (this.state.type == 'textarea') {
      return (
        <textarea
          id={this.props.id}
          rows={this.props.rows || 3}
          className='form-control no-resize mousetrap'
          onChange={this.handleInputChange}
          name={this.state.props_name}
          value={this.state.value}
          placeholder={this.props.placeholder}
        ></textarea>
      )
    } else if (this.state.type == 'phone') {
      return (
        <PhoneInput
          international
          defaultCountry='ID'
          value={this.state.value ? String(this.state.value) : ''}
          onChange={this.onChange}
        />
      )
    } else if (this.state.type == 'texteditor') {
      return (
        <React.Fragment>
          <div
            className='form-control'
            style={{ minHeight: 32 }}
            onClick={this.openModal}
          >
            {!isEmpty(this.state.value) ? parse(String(this.state.value)) : ''}
          </div>
          <Modal size='lg' show={this.state.open} onHide={this.closeModal}>
            <Modal.Header onHide={this.closeModal} closeButton>
              <Modal.Title>
                {this.state.placeholder || 'Isi disini'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <JoditEditor
                key={this.props.name + '_editor'}
                id={this.props.id}
                ref={this.editorRef}
                value={
                  !isEmpty(this.state.value) ? String(this.state.value) : ''
                }
                config={this.state.config}
                tabIndex={1}
                onChange={this.onChange}
              />
            </Modal.Body>
          </Modal>
        </React.Fragment>
      )
    } else if (this.state.type == 'equation') {
      return (
        <React.Fragment>
          <div
            className='form-control'
            style={{ minHeight: 32 }}
            onClick={this.openModal}
          >
            {!isEmpty(this.state.value) ? parse(String(this.state.value)) : ''}
          </div>
          <Modal size='lg' show={this.state.open} onHide={this.closeModal}>
            <Modal.Header onHide={this.closeModal} closeButton>
              <Modal.Title>{this.state.placeholder || 'Isi'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div id={this.props.id} ref={this.toolbarRef}>
                <WirisEquationEditor
                  id={this.props.id}
                  onEquationInput={this.onChange}
                  toolbarRef={this.toolbarRef}
                  value={this.state.value}
                />
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>
      )
    }

    let defaultType =
      this.state.type === 'text' || isUndefined(this.state.type)
        ? 'search'
        : this.state.type

    return (
      <Form.Control
        id={this.props.id}
        type={defaultType}
        placeholder={this.state.placeholder}
        value={this.state.value}
        onChange={this.handleInputChange}
        name={this.state.props_name}
        className='form-control mousetrap'
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

export default connect(mapStateToProps, mapDispatchToProps)(InputText)
