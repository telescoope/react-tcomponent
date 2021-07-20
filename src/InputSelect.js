import React from 'react'

import {
  debounce,
  isEmpty,
  isArray,
  isUndefined,
  isNull,
  find,
  isEqual,
  map
} from 'lodash'

import './InputSelect.module.css'

import { slug, findArrayName } from 'tcomponent'

import Select from 'react-select'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { connect } from 'react-redux'

import parse from 'html-react-parser'

class InputSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      defaultValue: null,
      options: [],
      show: false
    }

    this.onRefresh = debounce(this.onRefresh.bind(this), 200)
  }

  labelGenerate = (option) => {
    if (!isEmpty(option)) {
      if (isArray(this.props.optionLabel)) {
        let label = []

        let separator = this.props.separator ? this.props.separator : ' | '

        for (let i = 0; i <= this.props.optionLabel.length - 1; i++) {
          label.push(option[this.props.optionLabel[i]])
        }

        return label.join(separator)
      } else {
        return option[this.props.optionLabel]
      }
    }

    return null
  }

  onRefresh() {
    let val = null

    let defaultValue = null

    if (this.props.value) {
      val = this.props.value
    } else {
      val = findArrayName(this.props.name, this.props.input) || []

      if (this.props.isMultiple) {
        defaultValue = []

        for (let i = 0; i < this.props.options.length; i++) {
          for (let y = 0; y < val.length; y++) {
            let opt = this.props.options[i]

            let cur = val[y]

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt)
            }
          }
        }
      } else {
        defaultValue = find(
          this.props.options,
          function (o) {
            return String(o[this.props.optionValue]) == val
          }.bind(this)
        )
      }
    }

    defaultValue =
      !isUndefined(defaultValue) && !isNull(defaultValue) ? defaultValue : null

    this.setState({
      defaultValue
    })
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

  onChange = (selectedOption) => {
    if (this.props.name) {
      try {
        if (this.props.isMultiple) {
          this.props.setInput(
            this.props.name,
            map(selectedOption, this.props.optionValue)
          )
        } else {
          this.props.setInput(
            this.props.name,
            selectedOption[this.props.optionValue]
          )
        }
      } catch (e) {
        this.props.setInput(this.props.name, null)
      }
    }
    this.onRefresh()
  }

  openModal = () => {
    this.setState({ show: !this.state.show })
  }

  render() {
    let options = []
    try {
      for (let i = 0; i < this.props.options.length; i++) {
        let y = this.props.options[i]

        if (this.props.isHtml) {
          y[this.props.name] = parse(String(y[this.props.name]))
        }
        options.push(y)
      }
    } catch (e) {}

    if (this.props.disabled || this.props.isReadonly) {
      return this.labelGenerate(this.state.defaultValue)
    }

    if (this.props.withModal)
      return (
        <React.Fragment>
          <Row>
            {!this.props.isReadonly && (
              <Col lg='1' md='1' sm='3' xs='1'>
                <Button
                  type='button'
                  className='btn btn-icon btn-primary btn-sm'
                  onClick={this.openModal}
                >
                  <FontAwesomeIcon size='sm' icon={faSearch} /> Pilih
                </Button>
              </Col>
            )}

            <Col lg='11' md='11' sm='9' xs='11'>
              {this.state.defaultValue &&
              !isUndefined(this.state.defaultValue) &&
              !isEmpty(this.state.defaultValue)
                ? this.labelGenerate(this.state.defaultValue)
                : ''}
            </Col>
          </Row>
          <Modal size='lg' show={this.state.show} onHide={this.openModal}>
            <ModalHeader closeButton toggle={this.openModal}>
              <Modal.Title>{this.props.placeholder || 'Pilih'}</Modal.Title>
            </ModalHeader>
            <ModalBody>
              <Select
                isClearable
                id={this.props.id ? this.props.id : this.props.name}
                isSearchable
                isHtml={this.props.isHtml}
                isMulti={this.props.isMultiple}
                placeholder={
                  this.props.placeholder ? this.props.placeholder : 'Pilih'
                }
                getOptionLabel={this.labelGenerate}
                getOptionValue={(option) => option[this.props.optionValue]}
                noOptionsMessage={() => 'Data tidak ditemukan'}
                value={this.state.defaultValue}
                onChange={this.onChange}
                options={options}
                isDisabled={this.props.disabled}
              />
            </ModalBody>
          </Modal>
        </React.Fragment>
      )

    return (
      <Select
        menuPortalTarget={document.body}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            zIndex: 9999
          }),
          menu: (provided) => ({
            ...provided,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            zIndex: '9999 !important'
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#db2828',

            cursor: 'pointer'
          }),
          placeholder: (base) => ({
            ...base,
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }),
          multiValue: (base) => ({
            ...base,
            background: 'none'
          }),
          multiValueLabel: (base) => ({
            ...base,
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }),
          option: (base) => ({
            ...base,
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }),
          clearIndicator: (base, state) => ({
            ...base,
            cursor: 'pointer',
            color: state.isFocused ? '#db2828' : '#db2828'
          })
        }}
        className='tcomponent-select'
        // menuPlacement='top'
        isClearable
        id={this.props.id ? this.props.id : this.props.name}
        isSearchable
        isHtml={this.props.isHtml}
        isMulti={this.props.isMultiple}
        placeholder={this.props.placeholder ? this.props.placeholder : 'Pilih'}
        getOptionLabel={this.labelGenerate}
        getOptionValue={(option) => option[this.props.optionValue]}
        noOptionsMessage={() => 'Data tidak ditemukan'}
        value={this.state.defaultValue}
        onChange={this.onChange}
        options={options}
        isDisabled={this.props.disabled}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputSelect)
