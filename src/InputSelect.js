import React, { useEffect, useState } from 'react'

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

import { useSelector, useDispatch } from 'react-redux'

import parse from 'html-react-parser'

function InputSelect(props) {
  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const [show, setShow] = useState([])

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  const parameter = useSelector((state) => state.core?.parameter) || {}

  let value = findArrayName(propsName, input) || null

  let valueParam =
    findArrayName('selected_' + propsName, parameter) ||
    (props.isMultiple ? [] : {})

  let options = []
  try {
    for (let i = 0; i < props.options.length; i++) {
      let y = props.options[i]

      if (props.isHtml) {
        y[props.name] = parse(String(y[props.name]))
      }
      options.push(y)
    }
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

      for (let i = 0; i < options.length; i++) {
        for (let y = 0; y < val.length; y++) {
          let opt = options[i]

          let cur = val[y]

          if (String(opt[props.optionValue]) == String(cur)) {
            defaultValue.push(opt)
          }
        }
      }
    } else {
      defaultValue =
        find(
          options,
          function (o) {
            return String(o[props.optionValue]) == String(val)
          }.bind(this)
        ) || {}
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
    if (propsName) {
      try {
        if (props.isMultiple) {
          setInput(propsName, map(selectedOption, props.optionValue))
        } else {
          setInput(propsName, selectedOption[props.optionValue])
        }
      } catch (e) {
        setInput(propsName, null)
      }
    }
  }

  function openModal() {
    setshow(!show)
  }

  if (props.disabled || props.isReadonly) {
    return labelGenerate(valueParam)
  }

  if (props.withModal)
    return (
      <React.Fragment>
        <Row>
          {!props.isReadonly && (
            <Col lg='1' md='1' sm='3' xs='1'>
              <Button
                type='button'
                className='btn btn-icon btn-primary'
                onClick={openModal}
              >
                <FontAwesomeIcon icon={faSearch} /> Pilih
              </Button>
            </Col>
          )}

          <Col lg='11' md='11' sm='9' xs='11'>
            {valueParam && !isUndefined(valueParam) && !isEmpty(valueParam)
              ? labelGenerate(valueParam)
              : ''}
          </Col>
        </Row>
        <Modal
          backdrop={'static'}
          autoFocus={true}
          restoreFocus={true}
          centered
          size='xl'
          show={show}
          onHide={openModal}
        >
          <ModalHeader closeButton toggle={openModal}>
            <Modal.Title>{props.placeholder || 'Pilih'}</Modal.Title>
          </ModalHeader>
          <ModalBody>
            <Select
              isClearable
              id={propsName}
              isSearchable
              isHtml={props.isHtml}
              isMulti={props.isMultiple}
              placeholder={props.placeholder ? props.placeholder : 'Pilih'}
              getOptionLabel={labelGenerate}
              getOptionValue={(option) => option[props.optionValue]}
              noOptionsMessage={() => 'Data tidak ditemukan'}
              value={valueParam}
              onChange={onChange}
              options={options}
              isDisabled={props.disabled}
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
      id={propsName}
      isSearchable
      isHtml={props.isHtml}
      isMulti={props.isMultiple}
      placeholder={props.placeholder ? props.placeholder : 'Pilih'}
      getOptionLabel={labelGenerate}
      getOptionValue={(option) => option[props.optionValue]}
      noOptionsMessage={() => 'Data tidak ditemukan'}
      value={valueParam}
      onChange={onChange}
      options={options}
      isDisabled={props.disabled}
    />
  )
}

export default InputSelect
