import React, { useState, useEffect } from 'react'

import { map, uniqBy, findIndex, isEmpty, isUndefined } from 'lodash'

import './InputTag.module.css'

import ReactTags from 'react-tag-autocomplete'

import { useSelector, useDispatch } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

function InputTag(props) {
  const [tags, setTags] = useState([])

  const [suggestions, setSuggestions] = useState([])

  const separator = '|'

  const propsName = !isUndefined(props?.name)
    ? slug(String(props?.name), '_')
    : ''

  const dispatch = useDispatch()

  const input = useSelector((state) => state.core?.input) || {}

  const parameter = useSelector((state) => state.core?.parameter) || {}

  const value = findArrayName(propsName, input) || ''

  function onDelete(i) {
    let t = tags.slice(0)

    t.splice(i, 1)

    setTags(t)
  }

  function onAddition(tag) {
    let t = [].concat(tags, tag)

    setTags(_.uniqBy(t, 'name'))
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

  useEffect(() => {
    setInput(propsName, _.map(tags, 'name').join(separator))
  }, [tags])

  function onFocus(tag) {}

  function onValidate(tag) {
    return _.findIndex(tags, ['name', tag.name]) < 0
  }

  useEffect(() => {
    let suggestions = []

    let t = []

    for (let i = 0; i < props.options.length; i++) {
      let isi = props.options[i]

      if (!_.isEmpty(isi[props.optionValue])) {
        suggestions.push({ name: isi[props.optionValue] })
      }
    }

    let v = value ? String(value).split(separator) : []

    for (let i = 0; i < v.length; i++) {
      let isi = v[i]

      if (!_.isEmpty(isi)) {
        t.push({ name: isi })
      }
    }

    setSuggestions(suggestions)

    setTags(t)
  }, [])

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
