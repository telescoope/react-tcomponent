import React from 'react'

import { SketchPicker } from 'react-color'

import { Button } from 'react-bootstrap'

import { connect } from 'react-redux'

import { slug, findArrayName } from 'tcomponent'

import { debounce } from 'lodash'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleInputChange = (data) => {
    this.props.setInput(this.props.name, data.hex)

    this.props.setParameter('selected_' + this.props.name, data)
  }

  componentDidMount() {
    try {
      this.props.setInput(
        this.props.name,
        this.props.parameter['selected_' + this.props.name].hex
      )
    } catch (e) {}
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    let val = ''

    try {
      val = findArrayName(this.props.name, this.props.input) || ''
    } catch (e) {}

    const isReadonly = this.props.disabled || this.props.isReadonly

    return (
      <React.Fragment>
        {this.state.open ? (
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
              zIndex:999
            }}
          >
            <SketchPicker
              color={val}
              onChangeComplete={this.handleInputChange}
            />
            <Button
              style={{ marginTop:10, backgroundColor: val, border: 0 }}
              className='btn btn-primary'
              onClick={this.toggle}
              type='button'
            >
              Pilih
            </Button>
          </div>
        ) : (
          <Button
            style={{ zIndex: 0, backgroundColor: val, border: 0 }}
            className='btn btn-primary'
            onClick={this.toggle}
            type='button'
          >
            Pilih
          </Button>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  input: state.core.input || {},
  parameter: state.core.parameter || {}
})

const mapDispatchToProps = (dispatch) => ({
  setInput: (key, val) =>
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    }),
  setParameter: (key, val) =>
    dispatch({
      type: 'SET_PARAMETER',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    })
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
