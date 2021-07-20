import React, { useState, useEffect } from 'react'

import { isEmpty, isEqual, filter as _filter } from 'lodash'

import { connect, useDispatch, useSelector } from 'react-redux'

import LoadingOverlay from './LoadingOverlay'

import axios from 'axios'

import moment from 'moment'

import { Card, Row, Col, Form, Button } from 'react-bootstrap'

import InputSelect from './InputSelect'

import InputText from './InputText'

import Loading from './Loading'

import {
  slug,
  setAuthHeader,
  defaultFilterData,
  secureData,
  fetchErrorDispatch
} from 'tcomponent'

import DataTable from './DataTable'

import InputFile from './InputFile'

function InputWorkflow(props) {
  let [isDelay, setIsDelay] = useState(false)

  let [listLoading, setListLoading] = useState(false)

  let [submitLoading, setSubmitLoading] = useState(false)

  let [responseLoading, setResponseLoading] = useState(false)

  let auth = useSelector((state) => state.auth) || {}

  let input = useSelector((state) => state.core.input) || {}

  let validation = useSelector((state) => state.core.validation) || []

  let parameter = useSelector((state) => state.core.parameter) || {}

  let filter = useSelector((state) => state.core.filter) || {}

  let dispatch = useDispatch()

  let [list, setList] = useState({})

  let [activity, setActivity] = useState({
    activity: {},
    role: '',
    response: []
  })

  let {
    doAfterSubmit,
    isLoading,
    doSubmit,
    doCancel,
    isReadonly,
    relation,
    id,
    isDelete
  } = props

  let [readonly, setReadonly] = useState(isReadonly)

  useEffect(() => {
    setReadonly(isReadonly)
  }, [isReadonly])

  function submit(event) {
    if (!input.response_activity || isEmpty(input.response_activity)) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Respon wajib diisi'
      })
    } /* else if(!input.response_comment || isEmpty(input.response_comment)){

      dispatch({
      type: 'SET_MESSAGE',
      payload: 'Komentar wajib diisi'
    });

  } */ else {
      setSubmitLoading(true)

      setIsDelay(true)

      setTimeout(() => setIsDelay(false), 1000)

      doSubmit && doSubmit()
    }
  }

  useEffect(() => {
    reload_response()
  }, [])

  useEffect(() => {
    let allowed_role = []

    try {
      allowed_role = activity.role.split(',')
    } catch (e) {}

    let user_role = []

    try {
      user_role = auth.user.role.split(',')
    } catch (e) {}

    let is_allowed = false

    let is_admin = false

    for (let i = 0; i < user_role.length; i++) {
      if (
        !is_admin &&
        user_role[i] &&
        isEqual(String(user_role[i]).trim().toLowerCase(), 'admin')
      ) {
        is_admin = true

        is_allowed = true

        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: 'response_role',
            value: String(user_role[i]).trim().toLowerCase()
          }
        })
      }
    }

    if (!is_admin) {
      for (let i = 0; i < allowed_role.length; i++) {
        for (let y = 0; y < user_role.length; y++) {
          if (
            allowed_role[i] &&
            user_role[y] &&
            String(allowed_role[i]).trim().toLowerCase() ==
              String(user_role[y]).trim().toLowerCase() &&
            !is_allowed
          ) {
            is_allowed = true

            dispatch({
              type: 'SET_INPUT',
              payload: {
                key: 'response_role',
                value: String(user_role[y]).trim().toLowerCase()
              }
            })
          }
        }
      }
    }

    let allowed =
      !isEmpty(activity.activity) && activity.response.length > 0 && is_allowed

    if (allowed && readonly && !isReadonly) {
      setReadonly(false)

      dispatch({
        type: 'SET_INPUT',
        payload: { key: 'activity', value: activity.activity.code }
      })
    } else {
      setReadonly(true)
    }
  }, [activity])

  useEffect(() => {
    if (submitLoading && !isEmpty(validation)) {
      setSubmitLoading(false)
    }
  }, [validation])

  useEffect(() => {
    if (submitLoading && !isLoading && !isDelay) {
      setSubmitLoading(false)

      if (isEmpty(validation)) {
        doAfterSubmit && doAfterSubmit()
      }
    }
  }, [isDelay, validation, isLoading])

  function cancel(event) {
    doCancel && doCancel()
  }

  function reload_response() {
    let url = process.env.REACT_APP_API_URL + '/komentar_respon?'

    let options = {
      data: secureData({
        relation,
        id
      }),
      method: 'POST',
      headers: setAuthHeader(auth),
      url
    }

    setResponseLoading(true)

    axios(options)
      .then((response) => {
        let newactivity = response.data.data || {}

        if (isDelete) {
          newactivity.response = _filter(newactivity.response, function (o) {
            return o.code == 'HAPUS'
          })
        }

        setActivity(newactivity)

        setResponseLoading(false)
      })
      .catch((error) => {
        fetchErrorDispatch(error, dispatch)

        setResponseLoading(false)
      })
  }

  function reload() {
    let url = process.env.REACT_APP_API_URL + '/komentar?'

    let columns = [
      'user',
      'role',
      'activity',
      'comment',
      'due_datetime',
      'start_datetime',
      'end_datetime'
    ]

    let f = {}

    try {
      f = defaultFilterData(filter, columns, slug(props.relation, '_'))
    } catch (e) {}

    let isi = {
      relation,
      id,
      ...f
    }

    let options = {
      data: secureData(isi),
      method: 'POST',
      headers: setAuthHeader(auth),
      url
    }

    setListLoading(true)

    axios(options)
      .then((response) => {
        setList(response.data.data)

        setListLoading(false)
      })
      .catch((error) => {
        fetchErrorDispatch(error, dispatch)

        setListLoading(false)
      })
  }

  if (responseLoading) return <Loading />

  return (
    <LoadingOverlay isLoading={isLoading || submitLoading}>
      <Card>
        <Card.Body>
          <Card.Title tag='h5'>
            {activity.activity.name || 'Alur tidak ditemukan'}
          </Card.Title>
          <Card.Text>
            {!readonly && (
              <Row>
                <Col lg='6'>
                  <Form.Group as={Row}>
                    <Col lg='3'>
                      <Form.Label>
                        Respon <span className='text-danger'>*</span>
                      </Form.Label>
                    </Col>
                    <Col lg='9'>
                      <InputSelect
                        name='response_activity'
                        options={activity.response}
                        separator=' | '
                        optionLabel={['name']}
                        optionValue='code'
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Col lg='3'>
                      <Form.Label>Lampiran</Form.Label>
                    </Col>

                    <Col lg='5'>
                      <InputFile
                        value={input.attachment}
                        name='response_attachment'
                        id='response_attachment'
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg='6'>
                  <Form.Group as={Row}>
                    <Col lg='3' style={{ marginBottom: 35 }}>
                      <Form.Label>Komentar</Form.Label>
                    </Col>

                    <Col lg='9'>
                      <InputText
                        type='textarea'
                        required
                        name='response_comment'
                        id='response_comment'
                        rows='3'
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <DataTable
              data={list}
              isLoading={listLoading}
              name={slug(props.relation, '_')}
              primaryKey='id'
              isSearchable={true}
              isColumnsSearchable={true}
              onReload={reload}
              columns={[
                {
                  Header: 'Nama',
                  id: 'user',
                  accessor: (d) => d.user
                },
                {
                  Header: 'Jabatan',
                  id: 'role',
                  accessor: (d) => d.role
                },
                {
                  Header: 'Aktifitas',
                  id: 'activity',
                  accessor: (d) => d.activity
                },
                {
                  Header: 'Respon',
                  id: 'response',
                  accessor: (d) => d.response
                },
                {
                  Header: 'Komentar',
                  id: 'comment',
                  accessor: (d) => d.comment
                },
                {
                  Header: 'Tenggat',
                  id: 'due_datetime',
                  accessor: (d) =>
                    d.due_datetime &&
                    moment(d.due_datetime).format('DD-MM-YYYY HH:mm')
                },
                {
                  Header: 'Mulai',
                  id: 'start_datetime',
                  accessor: (d) =>
                    d.start_datetime &&
                    moment(d.start_datetime).format('DD-MM-YYYY HH:mm')
                },

                {
                  Header: 'Selesai',
                  id: 'end_datetime',
                  accessor: (d) =>
                    d.end_datetime &&
                    moment(d.end_datetime).format('DD-MM-YYYY HH:mm')
                },
                {
                  Header: 'Lampiran',
                  id: 'attachment',
                  accessor: (d) => <InputFile value={d.attachment} isReadonly />
                }
              ]}
            />
          </Card.Text>
          <Row className='mt-2'>
            <Col>
              <Button
                type='button'
                className='btn btn-icon btn-primary btn-sm float-left'
                onClick={cancel}
              >
                Kembali
              </Button>
              {!readonly && (
                <Button
                  type='button'
                  className='btn btn-icon btn-primary btn-sm float-right'
                  onClick={submit}
                >
                  Proses
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </LoadingOverlay>
  )
}

export default InputWorkflow
