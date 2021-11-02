import React from 'react'

import { map, uniqBy, findIndex, isEmpty } from 'lodash'

import './InputTag.module.css'

import ReactTags from 'react-tag-autocomplete'

import { connect } from 'react-redux'

import { slug } from 'tcomponent'

class InputTag extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags: [],
      suggestions: [],
      separator: '|'
    }

    this.reactTags = React.createRef()
  }

  onDelete(i) {
    let tags = this.state.tags.slice(0)

    tags.splice(i, 1)

    this.setState({ tags })

    if (this.props.name) {
      this.props.setInput(
        this.props.name,
        _.map(tags, 'name').join(this.state.separator)
      )
    }
  }

  onAddition(tag) {
    let tags = [].concat(this.state.tags, tag)

    this.setState({ tags: _.uniqBy(tags, 'name') })

    if (this.props.name) {
      this.props.setInput(
        this.props.name,
        _.map(tags, 'name').join(this.state.separator)
      )
    }
  }

  onFocus(tag) {}

  onValidate(tag) {
    return _.findIndex(this.state.tags, ['name', tag.name]) < 0
  }

  componentDidMount() {
    let suggestions = []

    let tags = []

    for (let i = 0; i < this.props.options.length; i++) {
      let isi = this.props.options[i]

      if (!_.isEmpty(isi[this.props.optionValue])) {
        suggestions.push({ name: isi[this.props.optionValue] })
      }
    }

    let value = ''

    try {
      value = this.props.value
        ? this.props.value
        : this.props.input[this.props.name]
        ? this.props.input[this.props.name]
        : ''
    } catch (e) {}

    let v = value ? String(value).split(this.state.separator) : []

    for (let i = 0; i < v.length; i++) {
      let isi = v[i]

      if (!_.isEmpty(isi)) {
        tags.push({ name: isi })
      }
    }

    this.setState({ suggestions, tags })
  }

  render() {
    return (
      <ReactTags
        minQueryLength={1}
        noSuggestionsText={'Tidak ada usulan'}
        ref={this.reactTags}
        tags={this.state.tags}
        id={this.props.name}
        removeButtonText='Klik untuk menghapus'
        delimiters={['Enter', 'Tab']}
        placeholderText={
          this.props.placeholder
            ? this.props.placeholder
            : 'Dipisah dengan spasi / enter'
        }
        allowNew={this.props.isCreateable}
        suggestions={this.state.suggestions}
        onDelete={this.onDelete.bind(this)}
        onValidate={this.onValidate.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onAddition={this.onAddition.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputTag)
