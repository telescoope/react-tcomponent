import React from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { isArray } from 'lodash'

function Field(props) {
  let message = []

  if (isArray(props.errorMessage)) {
    for (let i = 0; i < props.errorMessage.length; i++) {
      let isi = props.errorMessage[i]

      if (isArray(isi)) {
        for (let y = 0; y < isi.length; y++) {
          message.push(isi[y])
        }
      } else {
        message.push(isi)
      }
    }
  } else {
    message.push(props.errorMessage)
  }

  return (
    <Form.Group as={Row}>
      <Form.Label column md={props.labelSize ? props.labelSize : 3}>
        {props.label ? props.label : 'Label'}
        {props.isRequired && <span className='text-danger'>&nbsp;*</span>}
        {props.hint && (
          <small className='form-text text-muted'>{props.hint}</small>
        )}
      </Form.Label>
      <Col md={props.inputSize ? props.inputSize : 9}>
        {props.children}
        <Form.Text className='text-danger'>
          {message.length > 0 && message.join(', ')}
        </Form.Text>
      </Col>
    </Form.Group>
  )
}

export default Field
