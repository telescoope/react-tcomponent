import React, { useState, useEffect } from 'react'

import axios from 'axios'

import DropzoneComponent from 'react-dropzone-component'

import { Player } from 'video-react'

import * as momentImported from 'moment'

import { useSelector, useDispatch } from 'react-redux'

import { findArrayName, slug, setAuthHeader, secureData } from 'tcomponent'

import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

import {
  isNull,
  isUndefined,
  isEqual,
  isEmpty,
  filter,
  isArray,
  isString
} from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faTimes,
  faSearch,
  faDownload
} from '@fortawesome/free-solid-svg-icons'

import Loading from './Loading'

import { Form, Button, Modal, ButtonGroup } from 'react-bootstrap'

let moment = momentImported

function Preview(props) {
  const files = [
    { uri: process.env.REACT_APP_API_URL + '/file/stream/' + props.file }
  ]

  try {
    // if (isEqual(props.type.type.substring(0, 5), 'image')) {
    //   return (
    //     <img
    //       key={props.file}
    //       className='img-responsive'
    //       style={{ maxWidth: '100%' }}
    //       src={process.env.REACT_APP_API_URL + '/file/stream/' + props.file}
    //     />
    //   )
    // } else
    if (isEqual(props.type.type.substring(0, 5), 'video')) {
      return (
        <Player
          key={props.file}
          autoPlay={false}
          src={process.env.REACT_APP_API_URL + '/file/stream/' + props.file}
        />
      )
    }
    //  else if (isEqual(props.type.type, 'application/pdf')) {
    //   return (
    //     <iframe
    //       key={props.file}
    //       width='100%'
    //       height='480'
    //       src={process.env.REACT_APP_API_URL + '/file/stream/' + props.file}
    //     ></iframe>
    //   )
    // }
  } catch (e) {}

  return (
    <DocViewer
      style={{ width: '100%', height: 480 }}
      pluginRenderers={DocViewerRenderers}
      documents={files}
    />
  )
}

function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

function InputFile(props) {
  let acceptedFiles = props.accept
    ? props.accept
    : 'image/*, video/*, audio/*, .docx, .xlsx, .pptx, .csv, .pdf'

  let input = useSelector((state) => state.core.input)

  let parameter = useSelector((state) => state.core.parameter)

  let [type, setType] = useState({})

  let [value, setValue] = useState([])

  let [loading, setLoading] = useState(false)

  let auth = useSelector((state) => state.auth)

  let dispatch = useDispatch()

  function onDelete(val) {
    let url = process.env.REACT_APP_API_URL + '/file/delete'

    let data = secureData({
      token_file: val,
      token: auth.token
    })

    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    }

    setLoading(true)

    axios(options)
      .then((response) => {
        if (!isEmpty(response.data.message)) {
          dispatch({
            type: 'SET_MESSAGE',
            payload: response.data.message
          })
        }

        let isi = filter(value, (o) => {
          return !isEqual(o, val)
        })

        setValue(isi)

        dispatch({
          type: 'SET_INPUT',
          payload: { key: props.name, value: isi }
        })

        setLoading(false)
      })
      .catch((error) => {
        dispatch({
          type: 'SET_MESSAGE',
          payload: 'Gagal menghapus lampiran'
        })

        let isi = filter(value, (o) => {
          return !isEqual(o, val)
        })

        dispatch({
          type: 'SET_INPUT',
          payload: { key: props.name, value: isi }
        })

        setValue(isi)

        setLoading(false)
      })
  }

  function fetchInfo(token) {
    console.log('fetchInfo', token)
    if (
      isString(token) &&
      !isEmpty(token) &&
      token != 'null' &&
      !isValidHttpUrl(token) &&
      isEmpty(type[token])
    ) {
      console.log('GO')
      let url = process.env.REACT_APP_API_URL + '/file/info'

      let data = secureData({
        token_file: token
      })

      let options = {
        method: 'POST',
        headers: setAuthHeader(auth),
        url,
        data
      }

      setLoading(true)
      try {
        axios(options)
          .then((response) => {
            if (response.data.success) {
              type[token] = response.data.data
              setType(type)

              open[token] = false
              setOpen(open)
            }

            setLoading(false)
          })
          .catch((error) => {
            type[token] = ''
            setType(type)

            open[token] = false
            setOpen(open)
          })
      } catch (e) {}
    }
  }

  function reloadType(t) {
    try {
      if (isArray(t) && t.length > 0) {
        for (let i = 0; i < t.length; i++) {
          let kondisi = cekValidFile(t[i])

          if (kondisi) {
            fetchInfo(t[i])
          }
        }
      } else {
        let kondisi = cekValidFile(t)

        if (kondisi) {
          fetchInfo(t)
        }
      }
    } catch (e) {}
  }

  function cekValidFile(h) {
    return (
      isString(h) && !isEmpty(h) && h != 'null'
      //!isNull(h) && !isUndefined(h) && !isEmpty(h)
      //&& isEqual(String(h).substring(0, 3), 'AT-')
    )
  }

  function setValid(u) {
    return filter(u, cekValidFile) || []
  }

  function setIsinya(d) {
    let i = String(d).split('|')

    return setValid(i)
  }

  useEffect(() => {
    let x = props.value ? props.value : findArrayName(props.name, input)

    if (x) {
      let cek = setIsinya(x)

      setValue(cek)
    }
  }, [])

  useEffect(() => {
    let cek = setIsinya(findArrayName(props.name, input))
    if (!isEqual(cek, value)) {
      setValue(cek)
    }
  }, [findArrayName(props.name, input)])

  useEffect(() => {
    reloadType(value)
  }, [value])

  useEffect(() => {
    openFile(loading)
  }, [loading])

  function toggle(val) {
    setOpen({ ...open, [val]: !open[val] })
  }

  function fileUpload(file, base64) {
    let url = props.url || process.env.REACT_APP_API_URL + '/file/upload'

    let _data = new FormData()

    let _name = file.name

    let _type = file.type

    _data.append('type', _type)
    _data.append('name', _name)
    _data.append('file', file)
    _data.append(
      'lastModifiedDate',
      moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
    )
    _data.append('size', file.size)

    setLoading(true)

    axios
      .post(url, _data, {
        headers: setAuthHeader(
          auth,
          `multipart/form-data; boundary=${_data._boundary}`
        )
      })
      .then((response) => {
        if (!isEmpty(response.data.message)) {
          dispatch({
            type: 'SET_MESSAGE',
            payload: response.data.message
          })
        }

        if (response.data.success) {
          dispatch({
            type: 'SET_INPUT',
            payload: { key: props.name, value: response.data.data.token }
          })

          setValue([response.data.data.token])
        } else {
          dispatch({
            type: 'SET_INPUT',
            payload: { key: props.name, value: '' }
          })
        }

        setLoading(false)
      })
      .catch((error) => {
        dispatch({
          type: 'SET_INPUT',
          payload: { key: props.name, value: '' }
        })

        dispatch({
          type: 'SET_MESSAGE',
          payload: 'Gagal mengunggah lampiran'
        })

        setLoading(false)
      })
  }

  function createfile(file) {
    let reader = new FileReader()

    reader.onload = (e) => {
      fileUpload(file, e.target.result)
    }

    reader.readAsDataURL(file)
  }

  function onChangeMultiple(file) {
    let isi = JSON.parse(file.xhr.response)

    let current = value || []

    current.push(isi.data.token)

    let t =
      filter(current, function (o) {
        return !isEmpty(o)
      }) || []

    dispatch({
      type: 'SET_INPUT',
      payload: { key: props.name, value: t.join('|') }
    })

    setValue(t)
  }

  function onDeleteMultiple(data) {}

  function onInput(e) {
    openFile(false)
  }

  function openFile(val) {
    if (val != parameter.openFile) {
      dispatch({
        type: 'SET_PARAMETER',
        payload: { key: 'openFile', value: val }
      })
    }
  }

  function onClick(e) {
    openFile(true)

    setTimeout(() => {
      openFile(false)
    }, 60000)
  }

  function onChange(e) {
    let files = e.target.files || e.dataTransfer.files

    if (!files.length) return

    createfile(files[0])
  }

  function onDrop() {}

  let [open, setOpen] = useState({})

  let terisi = setValid(value)

  if (!process.env.REACT_APP_API_URL) {
    return <span>REACT_APP_API_URL is required for .env</span>
  }

  return (
    <div>
      {!loading && !props.isReadonly && (
        <div>
          {!props.isMultiple && (
            <div style={{ display: 'inline-block' }}>
              <Form.Control
                className={props.className}
                accept={acceptedFiles}
                label={props.name}
                type='file'
                onChange={onChange}
                onInput={onInput}
                onClick={onClick}
              />
            </div>
          )}

          {!loading && props.isMultiple && (
            <DropzoneComponent
              config={{
                showFiletypeIcon: true,
                postUrl:
                  process.env.REACT_APP_API_URL + '/file/upload_multiple',
                uploadMultiple: true,
                maxFiles: 5
              }}
              eventHandlers={{
                drop: onDrop,
                complete: onChangeMultiple,
                removedfile: onDeleteMultiple
              }}
              djsConfig={{
                acceptedFiles,
                params: {
                  token: auth.user.token
                },
                addRemoveLinks: true,
                autoProcessQueue: true,
                maxFiles: 5
              }}
            />
          )}
        </div>
      )}

      {!loading &&
        terisi.length > 0 &&
        terisi.map((val, index) => {
          return (
            <div style={{ display: 'inline-block' }} key={val}>
              {props.preview && (
                <React.Fragment>
                  <Preview key={val} type={type[val]} file={val} />
                  <br />
                </React.Fragment>
              )}
              <ButtonGroup>
                <Button variant='primary' onClick={() => toggle(val)}>
                  <FontAwesomeIcon icon={faSearch} /> Lihat
                </Button>
                <Button
                  vendor='success'
                  onClick={() =>
                    (window.location.href =
                      process.env.REACT_APP_API_URL + '/file/download/' + val)
                  }
                >
                  <FontAwesomeIcon icon={faDownload} /> Unduh
                </Button>

                {!props.isReadonly && (
                  <Button variant='danger' onClick={() => onDelete(val)}>
                    <FontAwesomeIcon icon={faTimes} /> Hapus
                  </Button>
                )}
              </ButtonGroup>
              <Modal
                backdrop={'static'}
                autoFocus={true}
                restoreFocus={true}
                centered
                size='xl'
                id={'modal_' + val}
                show={open[val]}
                onHide={() => toggle(val)}
              >
                <Modal.Body>
                  <Preview key={val} type={type[val]} file={val} />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='primary' onClick={() => toggle(val)}>
                    <FontAwesomeIcon icon={faTimes} /> Tutup
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )
        })}

      {loading && <Loading />}
    </div>
  )
}

export default InputFile
