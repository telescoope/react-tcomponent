import React, { useState, useEffect } from 'react'

import { map, uniqBy, findIndex, isEmpty, isUndefined, isArray } from 'lodash'

import './InputTag.module.css'

import ReactTags from 'react-tag-autocomplete'

import { useSelector, useDispatch } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

function InputTag(props) {
  const [suggestions, setSuggestions] = useState([])

  const separator = '|'

  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  const parameter = useSelector((state) => state.core?.parameter) || {}

  const value = findArrayName(propsName, input) || ''

  const [tags, setTags] = useState([])

  function onDelete(i) {
    let t = tags.slice(0)

    t.splice(i, 1)

    setTags(t)
  }

  function onAddition(tag) {
    let t = [].concat(tags, tag)

    setTags(_.uniqBy(t, 'name'))

    setInput(propsName, _.map(t, 'name').join(separator))
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

  function onFocus(tag) {}

  function onValidate(tag) {
    return _.findIndex(tags, ['name', tag.name]) < 0
  }

  useEffect(() => {
    let suggestions = []

    let t = []

    try {
      if (isArray(props.options)) {
        for (let i = 0; i < props.options.length; i++) {
          let isi = props.options[i]

          if (!_.isEmpty(isi[props.optionValue])) {
            suggestions.push({ name: isi[props.optionValue] })
          }
        }
      }
    } catch (e) {}

    let v = value ? String(value).split(separator) : []

    try {
      if (isArray(v)) {
        for (let i = 0; i < v.length; i++) {
          let isi = v[i]

          if (!_.isEmpty(isi)) {
            t.push({ name: isi })
          }
        }
      }
    } catch (e) {}

    setSuggestions(suggestions)

    setTags(_.uniqBy(t, 'name'))
  }, [value])

  return (
    <ReactTags
      minQueryLength={1}
      noSuggestionsText={'Tidak ada usulan'}
      tags={tags}
      id={propsName}
      removeButtonText='Klik untuk menghapus'
      delimiters={['Enter', 'Tab']}
      placeholderText={
        props.placeholder ? props.placeholder : 'Dipisah dengan spasi / enter'
      }
      allowNew={props.isCreateable}
      suggestions={suggestions}
      onDelete={(v) => onDelete(v)}
      onValidate={(v) => onValidate(v)}
      onFocus={(v) => onFocus(v)}
      onAddition={(v) => onAddition(v)}
    />
  )
}

export default InputTag
