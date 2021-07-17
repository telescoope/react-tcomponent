import React from 'react'
import { Badge } from 'reactstrap'
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
    <div className='form-group row'>
      <label
        className={
          'col-md-' +
          (props.labelSize ? props.labelSize : 3) +
          ' col-form-label'
        }
      >
        {props.label ? props.label : 'Label'}
        {props.isRequired && <span className='text-danger'>&nbsp;*</span>}
        {props.hint && (
          <small className='form-text text-muted'>{props.hint}</small>
        )}
      </label>
      <div className={'col-md-' + (props.inputSize ? props.inputSize : 9)}>
        {props.children}

        {message.length > 0 &&
          message.map((value, index) => (
            <Badge color='danger' style={{ marginRight: 10 }}>
              {value}
            </Badge>
          ))}
      </div>
    </div>
  )
}

export default Field
