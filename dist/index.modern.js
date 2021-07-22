import React, { useState, useEffect, useRef } from 'react';
import Cleave from 'cleave.js/react';
import { isEqual, isEmpty, isUndefined, filter, isArray, isString, debounce, isNull, find, includes, uniqBy, findIndex, isBoolean, uniq, map, isObject } from 'lodash';
import { connect, useSelector, useDispatch } from 'react-redux';
import PhoneInput from 'react-phone-number-input';
import JoditEditor from 'jodit-react';
import Mousetrap from 'mousetrap';
import { slug, findArrayName, secureData, setAuthHeader, numberFormat, useDebounce, fetchErrorDispatch, defaultFilterData } from 'tcomponent';
import parse from 'html-react-parser';
import { Form, ButtonGroup, Button as Button$1, Modal as Modal$1, InputGroup, Table, Row as Row$1, Col as Col$1, DropdownButton, Dropdown, Card } from 'react-bootstrap';
import '@wiris/mathtype-generic';
import ContentEditable from 'react-contenteditable';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';
import { Player } from 'video-react';
import * as moment$1 from 'moment';
import moment__default from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload, faTimes, faAngleDoubleLeft, faAngleLeft, faColumns, faAngleRight, faAngleDoubleRight, faSync } from '@fortawesome/free-solid-svg-icons';
import PuffLoader from 'react-spinners/PuffLoader';
import DatePicker from 'react-datepicker';
import { faCalendar, faFile, faArrowAltCircleDown, faArrowAltCircleUp, faClock } from '@fortawesome/free-regular-svg-icons';
import InputRange from 'react-input-range';
import LoadingOverlay from 'react-loading-overlay';
import styled from 'styled-components';
import { useIsVisible } from 'react-is-visible';
import { useTable, useFilters, useSortBy, useExpanded, usePagination } from 'react-table';
import TimePicker from 'rc-time-picker';
import ReactTags from 'react-tag-autocomplete';
import Select from 'react-select';
import { css } from '@emotion/react';
import { SketchPicker } from 'react-color';
import 'react-phone-number-input/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'dropzone/dist/min/dropzone.min.css';
import 'video-react/dist/video-react.css';
import 'rc-time-picker/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-input-range/lib/css/index.css';

class WirisEquationEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleEquationChange = event => {
      let {
        onEquationInput
      } = this.props;
      let mathFormat = window.WirisPlugin.Parser.endParse(event.target.value);
      let equationImage = event.target.value;
      onEquationInput(equationImage, mathFormat);
    };

    this.equationEditorRef = React.createRef();
    this.toolbarRef = React.createRef();
  }

  componentDidMount() {

    try {
      let genericIntegrationProperties = {};
      genericIntegrationProperties.target = this.equationEditorRef.current;
      genericIntegrationProperties.toolbar = this.toolbarRef.current;
      let genericIntegrationInstance = new window.WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    } catch (e) {}
  }

  render() {
    let {
      value
    } = this.props || {};
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      ref: this.toolbarRef
    }), /*#__PURE__*/React.createElement(ContentEditable, {
      suppressContentEditableWarning: true,
      className: "equationContainer",
      innerRef: this.equationEditorRef,
      onChange: this.handleEquationChange,
      html: value || ''
    }));
  }

}

class InputText extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = event => {
      event.preventDefault();
      let data = event.target.value ? String(event.target.value) : '';

      if (this.state.type == 'nik' || this.state.type == 'kip' || this.state.type == 'npwp' || this.state.type == 'postcode') {
        data = data.replace(/\D/g, '');
      }

      if (this.props.maxlength) {
        data = data.substring(0, this.props.maxlength);
      }

      this.setState({
        value: data
      });
      this.props.setInput(this.state.props_name, data);
    };

    this.onChange = data => {
      this.setState({
        value: data
      });
      this.props.setInput(this.state.props_name, data);
    };

    let default_placeholder = this.props.placeholder;
    let options_cleave = {};
    let type = this.props.type ? String(this.props.type) : '';

    if (type.toLowerCase() == 'nik') {
      options_cleave = {
        delimiter: ' ',
        blocks: [2, 2, 2, 6, 4],
        numericOnly: true
      };
      default_placeholder = this.props.placeholder || 'Nomor Induk Kependudukan';
    } else if (type.toLowerCase() == 'kip') {
      options_cleave = {
        delimiter: ' ',
        blocks: [4, 4, 4, 4]
      };
      default_placeholder = this.props.placeholder || 'Kartu Indonesia Pintar';
    } else if (type.toLowerCase() == 'npwp') {
      options_cleave = {
        delimiters: ['.', '.', '.', '-', '.'],
        blocks: [2, 3, 3, 1, 3, 3],
        numericOnly: true
      };
      default_placeholder = this.props.placeholder || 'Nomor Pokok Wajib Pajak';
    } else if (type.toLowerCase() == 'postcode') {
      options_cleave = {
        blocks: [5],
        delimiter: ' ',
        numericOnly: true
      };
      default_placeholder = this.props.placeholder || 'Kode Pos';
    } else if (type.toLowerCase() == 'phone') {
      default_placeholder = this.props.placeholder || 'Telepon';
    }

    this.state = {
      type,
      placeholder: default_placeholder,
      options_cleave,
      value: this.props.value ? String(this.props.value) : '',
      props_name: this.props.name ? slug(String(this.props.name), '_') : '',
      config: {
        readonly: false,
        toolbarButtonSize: 'small'
      }
    };
    this.toolbarRef = React.createRef();
    this.editorRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      if (!isEqual(findArrayName(this.state.props_name, this.props.input), findArrayName(this.state.props_name, prevProps.input)) && !isEqual(this.state.value, findArrayName(this.state.props_name, this.props.input))) {
        let value = this.props.input[this.state.props_name] || '';
        this.setState({
          value
        });
      }
    } catch (e) {}

    if (this.props.value && prevProps.value != this.props.value) {
      let value = this.props.value || '';
      this.setState({
        value
      });
    }
  }

  componentDidMount() {
    if (this.props.disableCopy || this.props.disablePaste || this.props.disableSelectAll) {
      let comb = [];

      if (this.props.disableCopy) {
        comb.push('command+c');
        comb.push('ctrl+c');
      }

      if (this.props.disablePaste) {
        comb.push('command+v');
        comb.push('ctrl+v');
      }

      if (this.props.disableSelectAll) {
        comb.push('command+a');
        comb.push('ctrl+a');
      }

      if (comb.length > 0) {
        Mousetrap.bind(comb, function () {
          return false;
        });
      }
    }

    let value = '';

    try {
      let input_name = findArrayName(this.state.props_name, this.props.input);
      value = this.props.value ? this.props.value : input_name;
    } catch (e) {}

    this.setState({
      value
    });
  }

  render() {
    if (!this.state.props_name) return 'Name is Required';

    if (this.props.disabled || this.props.isReadonly) {
      return !isEmpty(this.state.value) && parse(String(this.state.value));
    } else if (this.state.type == 'nik' || this.state.type == 'kip' || this.state.type == 'npwp' || this.state.type == 'postcode') {
      return /*#__PURE__*/React.createElement(Cleave, {
        placeholder: this.state.placeholder,
        id: this.props.id,
        name: this.state.props_name,
        value: this.state.value,
        onChange: this.handleInputChange,
        options: this.state.options_cleave,
        className: "form-control"
      });
    } else if (this.state.type == 'textarea') {
      return /*#__PURE__*/React.createElement("textarea", {
        id: this.props.id,
        rows: this.props.rows || 3,
        className: "form-control no-resize mousetrap",
        onChange: this.handleInputChange,
        name: this.state.props_name,
        value: this.state.value,
        placeholder: this.props.placeholder
      });
    } else if (this.state.type == 'phone') {
      return /*#__PURE__*/React.createElement(PhoneInput, {
        international: true,
        defaultCountry: "ID",
        value: this.state.value ? String(this.state.value) : '',
        onChange: this.onChange
      });
    } else if (this.state.type == 'texteditor') {
      return /*#__PURE__*/React.createElement(JoditEditor, {
        key: this.props.name + '_editor',
        id: this.props.id,
        ref: this.editorRef,
        value: !isEmpty(this.state.value) ? String(this.state.value) : '',
        config: this.state.config,
        tabIndex: 1,
        onChange: this.onChange
      });
    } else if (this.state.type == 'equation') {
      return /*#__PURE__*/React.createElement("div", {
        id: this.props.id,
        ref: this.toolbarRef
      }, /*#__PURE__*/React.createElement(WirisEquationEditor, {
        id: this.props.id,
        onEquationInput: this.onChange,
        toolbarRef: this.toolbarRef,
        value: this.state.value
      }));
    }

    let defaultType = this.state.type === 'text' || isUndefined(this.state.type) ? 'search' : this.state.type;
    return /*#__PURE__*/React.createElement(Form.Control, {
      id: this.props.id,
      type: defaultType,
      placeholder: this.state.placeholder,
      value: this.state.value,
      onChange: this.handleInputChange,
      name: this.state.props_name,
      className: "form-control mousetrap"
    });
  }

}

const mapStateToProps = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputText$1 = connect(mapStateToProps, mapDispatchToProps)(InputText);

function Loading() {
  return /*#__PURE__*/React.createElement(PuffLoader, {
    color: '#000',
    size: 25
  });
}

let moment = moment$1;

function Preview(props) {
  try {
    if (isEqual(props.type.type.substring(0, 5), 'image')) {
      return /*#__PURE__*/React.createElement("img", {
        key: props.file,
        className: "img-responsive",
        style: {
          maxWidth: '100%'
        },
        src: process.env.REACT_APP_API_URL + '/file/stream/' + props.file
      });
    } else if (isEqual(props.type.type.substring(0, 5), 'video')) {
      return /*#__PURE__*/React.createElement(Player, {
        key: props.file,
        autoPlay: false,
        src: process.env.REACT_APP_API_URL + '/file/stream/' + props.file
      });
    } else if (isEqual(props.type.type, 'application/pdf')) {
      return /*#__PURE__*/React.createElement("iframe", {
        key: props.file,
        width: "100%",
        height: "480",
        src: process.env.REACT_APP_API_URL + '/file/stream/' + props.file
      });
    }
  } catch (e) {}

  return null;
}

function InputFile(props) {
  let acceptedFiles = props.accept ? props.accept : 'image/*, video/*, audio/*, .docx, .xlsx, .pptx, .csv, .pdf';
  let input = useSelector(state => state.core.input);
  let parameter = useSelector(state => state.core.parameter);
  let [type, setType] = useState({});
  let [value, setValue] = useState([]);
  let [loading, setLoading] = useState(false);
  let auth = useSelector(state => state.auth);
  let dispatch = useDispatch();

  function onDelete(val) {
    let url = process.env.REACT_APP_API_URL + '/file/delete';
    let data = secureData({
      token_file: val,
      token: auth.token
    });
    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    };
    setLoading(true);
    axios(options).then(response => {
      if (!isEmpty(response.data.message)) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: response.data.message
        });
      }

      let isi = filter(value, o => {
        return !isEqual(o, val);
      });
      setValue(isi);
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: props.name,
          value: isi
        }
      });
      setLoading(false);
    }).catch(error => {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Gagal menghapus lampiran'
      });
      let isi = filter(value, o => {
        return !isEqual(o, val);
      });
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: props.name,
          value: isi
        }
      });
      setValue(isi);
      setLoading(false);
    });
  }

  function fetchInfo(token) {
    if (isString(token) && !isEmpty(token) && token != 'null' && isEmpty(type[token])) {
      let url = process.env.REACT_APP_API_URL + '/file/info';
      let data = secureData({
        token_file: token
      });
      let options = {
        method: 'POST',
        headers: setAuthHeader(auth),
        url,
        data
      };
      setLoading(true);
      axios(options).then(response => {
        if (response.data.success) {
          type[token] = response.data.data;
          setType(type);
          open[token] = false;
          setOpen(open);
        }

        setLoading(false);
      }).catch(error => {
        type[token] = '';
        setType(type);
        open[token] = false;
        setOpen(open);
      });
    }
  }

  function reloadType(t) {
    try {
      if (isArray(t) && t.length > 0) {
        for (let i = 0; i < t.length; i++) {
          let kondisi = cekValidFile(t[i]);

          if (kondisi) {
            fetchInfo(t[i]);
          }
        }
      } else {
        let kondisi = cekValidFile(t);

        if (kondisi) {
          fetchInfo(t);
        }
      }
    } catch (e) {}
  }

  function cekValidFile(h) {
    return isString(h) && !isEmpty(h) && h != 'null';
  }

  function setValid(u) {
    return filter(u, cekValidFile) || [];
  }

  function setIsinya(d) {
    let i = String(d).split('|');
    return setValid(i);
  }

  useEffect(() => {
    let x = props.value ? props.value : findArrayName(props.name, input);

    if (x) {
      let cek = setIsinya(x);
      setValue(cek);
    }
  }, []);
  useEffect(() => {
    let cek = setIsinya(findArrayName(props.name, input));

    if (!isEqual(cek, value)) {
      setValue(cek);
    }
  }, [findArrayName(props.name, input)]);
  useEffect(() => {
    reloadType(value);
  }, [value]);
  useEffect(() => {
    openFile(loading);
  }, [loading]);

  function toggle(val) {
    setOpen({ ...open,
      [val]: !open[val]
    });
  }

  function fileUpload(file, base64) {
    let url = props.url || process.env.REACT_APP_API_URL + '/file/upload';

    let _data = new FormData();

    let _name = file.name;
    let _type = file.type;

    _data.append('type', _type);

    _data.append('name', _name);

    _data.append('file', file);

    _data.append('lastModifiedDate', moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'));

    _data.append('size', file.size);

    setLoading(true);
    axios.post(url, _data, {
      headers: setAuthHeader(auth, `multipart/form-data; boundary=${_data._boundary}`)
    }).then(response => {
      if (!isEmpty(response.data.message)) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: response.data.message
        });
      }

      if (response.data.success) {
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: props.name,
            value: response.data.data.token
          }
        });
        setValue([response.data.data.token]);
      } else {
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: props.name,
            value: ''
          }
        });
      }

      setLoading(false);
    }).catch(error => {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: props.name,
          value: ''
        }
      });
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Gagal mengunggah lampiran'
      });
      setLoading(false);
    });
  }

  function createfile(file) {
    let reader = new FileReader();

    reader.onload = e => {
      fileUpload(file);
    };

    reader.readAsDataURL(file);
  }

  function onChangeMultiple(file) {
    let isi = JSON.parse(file.xhr.response);
    let current = value || [];
    current.push(isi.data.token);
    let t = filter(current, function (o) {
      return !isEmpty(o);
    }) || [];
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: props.name,
        value: t.join('|')
      }
    });
    setValue(t);
  }

  function onDeleteMultiple(data) {}

  function onInput(e) {
    openFile(false);
  }

  function openFile(val) {
    if (val != parameter.openFile) {
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: 'openFile',
          value: val
        }
      });
    }
  }

  function onClick(e) {
    openFile(true);
    setTimeout(() => {
      openFile(false);
    }, 60000);
  }

  function onChange(e) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createfile(files[0]);
  }

  function onDrop() {}

  let [open, setOpen] = useState({});
  let terisi = setValid(value);

  if (!process.env.REACT_APP_API_URL) {
    return /*#__PURE__*/React.createElement("span", null, "REACT_APP_API_URL is required for .env");
  }

  return /*#__PURE__*/React.createElement("div", null, !loading && !props.isReadonly && /*#__PURE__*/React.createElement("div", null, !props.isMultiple && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(Form.Control, {
    className: props.className,
    accept: acceptedFiles,
    label: props.name,
    type: "file",
    onChange: onChange,
    onInput: onInput,
    onClick: onClick
  })), !loading && props.isMultiple && /*#__PURE__*/React.createElement(DropzoneComponent, {
    config: {
      showFiletypeIcon: true,
      postUrl: process.env.REACT_APP_API_URL + '/file/upload_multiple',
      uploadMultiple: true,
      maxFiles: 5
    },
    eventHandlers: {
      drop: onDrop,
      complete: onChangeMultiple,
      removedfile: onDeleteMultiple
    },
    djsConfig: {
      acceptedFiles,
      params: {
        token: auth.user.token
      },
      addRemoveLinks: true,
      autoProcessQueue: true,
      maxFiles: 5
    }
  })), !loading && terisi.length > 0 && terisi.map((val, index) => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block'
      },
      key: val
    }, props.preview && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Preview, {
      key: val,
      type: type[val],
      file: val
    }), /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(Button$1, {
      variant: "primary",
      size: "sm",
      onClick: () => toggle(val)
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faSearch
    }), " Lihat"), /*#__PURE__*/React.createElement(Button$1, {
      vendor: "success",
      onClick: () => window.location.href = process.env.REACT_APP_API_URL + '/file/download/' + val,
      size: "sm"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faDownload
    }), " Unduh"), !props.isReadonly && /*#__PURE__*/React.createElement(Button$1, {
      variant: "danger",
      onClick: () => onDelete(val),
      size: "sm"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faTimes
    }), " Hapus")), /*#__PURE__*/React.createElement(Modal$1, {
      size: "lg",
      id: 'modal_' + val,
      show: open[val],
      onHide: () => toggle(val)
    }, /*#__PURE__*/React.createElement(Modal$1.Header, {
      closeButton: true,
      onHide: () => toggle(val)
    }, /*#__PURE__*/React.createElement(Modal$1.Title, null, "Lampiran ", val)), /*#__PURE__*/React.createElement(Modal$1.Body, null, /*#__PURE__*/React.createElement(Preview, {
      key: val,
      type: type[val],
      file: val
    }))));
  }), loading && /*#__PURE__*/React.createElement(Loading, null));
}

class InputChoose extends React.Component {
  constructor(props) {
    super(props);

    this.labelGenerate = option => {
      let label = [];

      if (isArray(this.props.optionLabel)) {

        for (let i = 0; i <= this.props.optionLabel.length - 1; i++) {
          let isi = option[this.props.optionLabel[i]];
          label.push(isi);
        }
      } else {
        label.push(option[this.props.optionLabel]);
      }

      return label;
    };

    this.onChange = selectedOption => {
      if (!this.props.isReadonly && this.props.name) {
        try {
          if (this.props.isMultiple) {
            let current_val = this.state.defaultValue || [];
            let removed = false;
            let new_val = [];

            for (let i = 0; i < current_val.length; i++) {
              let isi = current_val[i];

              if (isi == selectedOption[this.props.optionValue]) {
                removed = true;
              } else {
                new_val.push(isi);
              }
            }

            if (!removed) {
              new_val.push(selectedOption[this.props.optionValue]);
            }

            this.props.setInput(this.props.name, new_val);
          } else {
            let val = findArrayName(this.props.name, this.props.input) || null;

            if (this.props.value) {
              val = this.props.value;
            }

            let new_val = null;

            if (val != selectedOption[this.props.optionValue]) {
              new_val = selectedOption[this.props.optionValue];
            }

            this.props.setInput(this.props.name, new_val);
          }
        } catch (e) {
          this.props.setInput(this.props.name, null);
        }
      }

      this.onRefresh();
    };

    this.state = {
      defaultValue: null,
      type: this.props.type || 'inline'
    };
    this.onRefresh = debounce(this.onRefresh.bind(this), 200);
  }

  onRefresh() {
    let val = null;
    let defaultValue = null;

    if (this.props.value) {
      val = this.props.value;
    } else {
      val = findArrayName(this.props.name, this.props.input) || null;
    }

    if (!isNull(val)) {
      if (this.props.isMultiple) {
        defaultValue = [];

        for (let i = 0; i < this.props.options.length; i++) {
          for (let y = 0; y < val.length; y++) {
            let opt = this.props.options[i];
            let cur = val[y];

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt[this.props.optionValue]);
            }
          }
        }
      } else {
        defaultValue = find(this.props.options, function (o) {
          return String(o[this.props.optionValue]) == String(val);
        }.bind(this));
      }
    }

    defaultValue = !isUndefined(defaultValue) && !isNull(defaultValue) ? defaultValue : null;
    this.setState({
      defaultValue
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(findArrayName(this.props.name, prevProps.input), findArrayName(this.props.name, this.props.input)) && !isEqual(this.state.defaultValue, findArrayName(this.props.name, this.props.input))) {
      this.onRefresh();
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    let options = [];

    try {
      options = this.props.options.length > 0 ? this.props.options : [];
    } catch (e) {}

    return /*#__PURE__*/React.createElement("div", {
      className: "custom-controls-stacked"
    }, options.map(value => {
      let isChecked = false;

      try {
        if (this.props.isMultiple) {
          isChecked = includes(this.state.defaultValue, value[this.props.optionValue]);
        } else {
          isChecked = isEqual(value[this.props.optionValue], this.state.defaultValue[this.props.optionValue]);
        }
      } catch (e) {}

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Check, {
        inline: this.state.type == 'inline',
        disabled: this.props.disabled || this.props.isReadonly,
        type: this.props.isMultiple ? 'checkbox' : 'radio',
        name: this.props.name,
        onChange: this.onChange.bind(this, value),
        value: value,
        checked: isChecked,
        label: this.labelGenerate(value).map((val, i) => {
          if (isEqual(String(val).substring(0, 3), 'AT-')) {
            return /*#__PURE__*/React.createElement(InputFile, {
              value: val,
              isReadonly: true,
              preview: true
            });
          } else {
            return this.props.isHtml ? parse(String(val)) : val;
          }
        })
      }));
    }));
  }

}

let mapStateToProps$1 = state => ({
  input: state.core.input || {}
});

let mapDispatchToProps$1 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key)),
      value: val
    }
  })
});

var InputChoose$1 = connect(mapStateToProps$1, mapDispatchToProps$1)(InputChoose);

const CustomInput = props => {
  return /*#__PURE__*/React.createElement(InputGroup, {
    size: "sm"
  }, /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    size: "sm",
    icon: faCalendar
  })), /*#__PURE__*/React.createElement(Form.Control, {
    style: {
      borderLeft: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    },
    type: "text",
    className: "form-control",
    disabled: props.disabled,
    name: props.name,
    value: props.value || '',
    onClick: props.onClick
  }));
};

class InputDate extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD') : null;
      this.props.setInput(this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeStart = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD') : null;
      this.props.setInput('start_' + this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeEnd = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD') : null;
      this.props.setInput('end_' + this.props.name, data);
      this.onRefresh();
    };

    this.checkTglMerah = date => {
      let x = moment__default(date).format('d');
      return x == 0 || x == 6 ? 'tglmerah' : undefined;
    };

    this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    this.onRefresh = debounce(this.onRefresh.bind(this), 200);
  }

  onRefresh() {
    if (this.props.isRange) {
      let start_selected = null;
      let end_selected = null;

      try {
        start_selected = this.props.start_selected ? moment__default(this.props.start_selected).toDate() : findArrayName('start_' + this.props.name, this.props.input) ? moment__default(findArrayName('start_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment__default(this.props.end_selected).toDate() : findArrayName('end_' + this.props.name, this.props.input) ? moment__default(findArrayName('end_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        start_selected,
        end_selected
      });
    } else {
      let selected = null;

      try {
        selected = this.props.selected ? moment__default(this.props.selected).toDate() : findArrayName(this.props.name, this.props.input) ? moment__default(findArrayName(this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        selected
      });
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && findArrayName(this.props.name, prevProps.input) != findArrayName(this.props.name, this.props.input) && findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('start_' + this.props.name, prevProps.input) != findArrayName('start_' + this.props.name, this.props.input) && findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('end_' + this.props.name, prevProps.input) != findArrayName('end_' + this.props.name, this.props.input) && findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  }

  render() {
    let dateFormat = this.props.dateFormat ? this.props.dateFormat : this.props.yearOnly ? 'yyyy' : 'yyyy-MM-dd';

    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return (moment__default(this.state.start_selected).isValid() ? moment__default(this.state.start_selected).format('DD-MM-YYYY') : '') + ' - ' + (moment__default(this.state.end_selected).isValid() ? moment__default(this.state.end_selected).format('DD-MM-YYYY') : '');
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "input-daterange input-group"
        }, /*#__PURE__*/React.createElement(DatePicker, {
          minDate: this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
          maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
          dateFormat: dateFormat,
          placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
          selected: this.state.start_selected,
          isClearable: !this.props.disabled && !this.props.isReadonly,
          customInput: /*#__PURE__*/React.createElement(CustomInput, {
            value: this.state.start_selected,
            name: 'start_' + this.props.name
          }),
          onChange: this.handleInputChangeStart,
          selectsStart: !this.props.yearOnly,
          peekNextMonth: !this.props.yearOnly,
          withPortal: true,
          showMonthDropdown: !this.props.yearOnly,
          showYearDropdown: !this.props.yearOnly,
          showYearPicker: this.props.yearOnly,
          name: 'start_' + this.props.name,
          todayButton: this.props.yearOnly ? null : 'Hari ini',
          dayClassName: this.checkTglMerah,
          dropdownMode: "select",
          disabled: this.props.disabled || this.props.isReadonly,
          readOnly: this.props.disabled || this.props.isReadonly,
          startDate: this.state.start_selected,
          endDate: this.state.end_selected,
          shouldCloseOnSelect: false
        }), /*#__PURE__*/React.createElement("span", {
          className: "input-group-addon",
          style: {
            background: 'none'
          }
        }, "\xA0 - \xA0"), /*#__PURE__*/React.createElement(DatePicker, {
          minDate: this.state.start_selected ? this.state.start_selected : this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
          maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
          dateFormat: dateFormat,
          placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
          selected: this.state.end_selected,
          isClearable: !this.props.disabled && !this.props.isReadonly,
          name: 'end_' + this.props.name,
          selectsEnd: true,
          customInput: /*#__PURE__*/React.createElement(CustomInput, {
            value: this.state.end_selected,
            name: 'end_' + this.props.name
          }),
          onChange: this.handleInputChangeEnd,
          selectsStart: !this.props.yearOnly,
          peekNextMonth: !this.props.yearOnly,
          withPortal: true,
          showMonthDropdown: !this.props.yearOnly,
          showYearDropdown: !this.props.yearOnly,
          showYearPicker: this.props.yearOnly,
          dayClassName: this.checkTglMerah,
          todayButton: this.props.yearOnly ? null : 'Hari ini',
          dropdownMode: "select",
          startDate: this.state.start_selected,
          endDate: this.state.end_selected,
          disabled: this.props.disabled || this.props.isReadonly,
          readOnly: this.props.disabled || this.props.isReadonly,
          shouldCloseOnSelect: false
        }));
      }
    }

    if (this.props.disabled || this.props.isReadonly) {
      return moment__default(this.props.input[this.props.name]).isValid() ? moment__default(this.props.input[this.props.name]).format(this.props.yearOnly ? 'YYYY' : 'DD-MM-YYYY') : '';
    }

    return /*#__PURE__*/React.createElement(DatePicker, {
      minDate: this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
      maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
      dateFormat: dateFormat,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
      customInput: /*#__PURE__*/React.createElement(CustomInput, {
        value: this.state.selected,
        name: this.props.name
      }),
      selected: this.state.selected,
      isClearable: !this.props.disabled && !this.props.isReadonly,
      id: this.props.name,
      className: "form-control",
      dayClassName: this.checkTglMerah,
      onChange: this.handleInputChange,
      selectsStart: !this.props.yearOnly,
      peekNextMonth: !this.props.yearOnly,
      withPortal: true,
      showMonthDropdown: !this.props.yearOnly,
      showYearDropdown: !this.props.yearOnly,
      showYearPicker: this.props.yearOnly,
      todayButton: this.props.yearOnly ? null : 'Hari ini',
      dropdownMode: "select",
      disabled: this.props.disabled || this.props.isReadonly,
      readOnly: this.props.disabled || this.props.isReadonly,
      shouldCloseOnSelect: false
    });
  }

}

const mapStateToProps$2 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$2 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputDate$1 = connect(mapStateToProps$2, mapDispatchToProps$2)(InputDate);

class InputNumber extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = event => {
      let val = null;

      if (this.props.type == 'decimal') {
        val = Number(event.target.value.replace(/[^0-9.-]+/g, ''));
      } else if (this.props.type == 'percent') {
        val = this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 0, 100);
      } else if (this.props.type == 'range_three') {
        val = this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 1, 3);
      } else if (this.props.type == 'range_hundred') {
        val = this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 1, 100);
      } else if (this.props.type == 'range_depend') {
        val = this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 0, 100);
      } else {
        val = event.target.value.replace(/[^0-9.-]+/g, '');
      }

      let min = this.props.minValue ? Number(this.props.minValue) : null;
      let max = this.props.maxValue ? Number(this.props.maxValue) : null;

      if (max && min) {
        val = this.validate_min_max(val, min, max);
      } else if (!max && min) {
        val = this.validate_min_max(val, min, 999999999999);
      } else if (max && !min) {
        val = this.validate_min_max(val, 0, max);
      }

      val = val ? val : 0;

      if (this.state.props_name) {
        this.props.setInput(this.state.props_name, val);
      }

      let rawValue = event.target.rawValue || null;

      if (!isNaN(parseFloat(rawValue)) && !isNaN(parseFloat(val)) && parseFloat(rawValue) !== parseFloat(val)) {
        this.state.event.setRawValue(val);
      }
    };

    this.onChange = val => {
      this.setState({
        value: val
      });

      if (this.state.props_name) {
        this.props.setInput(this.state.props_name, val);
      }
    };

    this.onRefresh = () => {
      let val = '';

      try {
        let input_name = findArrayName(this.state.props_name, this.props.input);
        val = this.props.value ? this.props.value : input_name;
      } catch (e) {}

      let min = this.props.minValue ? Number(this.props.minValue) : null;
      let max = this.props.maxValue ? Number(this.props.maxValue) : null;
      let value = val ? parseInt(val) : min;

      if (this.props.type == 'decimal') {
        value = val ? parseFloat(val) : min;
      } else if (this.props.type == 'percent' || this.props.type == 'range_three' || max || min) {
        value = val ? parseFloat(val) : min;
      }

      if (isNaN(value)) {
        value = min;
      }

      this.setState({
        value
      });

      try {
        let rawValue = this.state.event.lastInputValue || null;

        if (parseFloat(rawValue) !== parseFloat(value)) {
          this.state.event.setRawValue(value);
        }
      } catch (e) {}
    };
    this.state = {
      defaultValue: null,
      options: {
        numeral: true
      },
      event: null,
      value: null,
      props_name: slug(this.props.name, '_')
    };
    this.onRefresh = debounce(this.onRefresh.bind(this), 200);
  }

  validate_min_max(val, min = 0, max = 100) {
    if (this.props.enableNegative && val < 0) {
      min = -max;
    }

    if (isNaN(val)) {
      val = min;
    }

    val = parseFloat(val);

    if (val >= max) {
      val = max;
    } else if (val <= min) {
      val = min;
    }

    return val ? Number(val) : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(findArrayName(this.state.props_name, prevProps.input), findArrayName(this.state.props_name, this.props.input)) && !isEqual(this.state.value, findArrayName(this.state.props_name, this.props.input))) {
      this.setState({
        rawValue: findArrayName(this.state.props_name, this.props.input) || null,
        value: findArrayName(this.state.props_name, this.props.input) || null
      });
      this.onRefresh();
    }

    if (this.props.value && prevProps.value != this.props.value && this.props.value != this.state.value) {
      let value = this.props.value || null;
      this.setState({
        rawValue: value,
        value: value
      });
      this.onRefresh();
    }
  }

  componentDidMount() {
    let options = {
      numeral: true,
      numeralPositiveOnly: true
    };

    if (this.props.type == 'decimal' || this.props.type == 'percent' || this.props.type == 'range_three') ; else {
      options.numeralThousandsGroupStyle = 'thousand';
    }

    this.setState({
      options,
      rawValue: findArrayName(this.state.props_name, this.props.input),
      value: findArrayName(this.state.props_name, this.props.input)
    });
    this.onRefresh();
  }

  onInit(cleave) {
    this.setState({
      event: cleave
    });
  }

  render() {
    if (this.props.disabled || this.props.isReadonly) {
      return !isNull(this.state.value) && !isUndefined(this.state.value) ? numberFormat(this.state.value, '') : null;
    }

    if (this.props.type == 'range') {
      return /*#__PURE__*/React.createElement(InputRange, {
        maxValue: this.props.maxValue,
        minValue: this.props.minValue,
        value: this.state.value,
        onChange: this.onChange
      });
    }

    return /*#__PURE__*/React.createElement(Cleave, {
      placeholder: this.props.placeholder ? this.props.placeholder : '',
      id: this.state.props_name,
      name: this.state.props_name,
      onInit: this.onInit.bind(this),
      value: this.state.value,
      onChange: this.handleInputChange,
      options: this.state.options,
      className: "form-control"
    });
  }

}

const mapStateToProps$3 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$3 = dispatch => ({
  setInput: (key, val) => {
    dispatch({
      type: 'SET_INPUT',
      payload: {
        key: slug(String(key), '_'),
        value: val
      }
    });
  }
});

var InputNumber$1 = connect(mapStateToProps$3, mapDispatchToProps$3)(InputNumber);

let _$1 = t => t,
    _t;
const StyledLoader = styled(LoadingOverlay)(_t || (_t = _$1`
  overflow: hidden;

  ._loading_overlay_overlay {
    background: rgba(255, 255, 255, 0.5);
  }
  &._loading_overlay_wrapper--active {
    overflow: hidden;
  }
`));

function MyLoadingOvelay(props) {
  return /*#__PURE__*/React.createElement(StyledLoader, {
    fadeSpeed: 250,
    active: props.isLoading,
    spinner: /*#__PURE__*/React.createElement(Loading, null)
  }, props.children);
}

const Filter = ({
  column
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '4px 0'
    }
  }, column.canFilter && column.render('Filter'));
};
const DefaultColumnFilter = props => {
  let filterValue = props.column.filterValue;
  let id = props.column.id;
  let name = props.name;
  let dispatch = useDispatch();
  let [data, setData] = React.useState(filterValue);
  let key = slug('search_' + name + '_' + id, '_');
  let filter = useSelector(state => state.core.filter);
  useEffect(() => {
    setData(filter[key]);
  }, []);

  function onChange(e) {
    e.preventDefault();
    setData(e.target.value);
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: {
        [key]: e.target.value,
        [slug('loaded_' + name, '_')]: false
      }
    });
  }

  return /*#__PURE__*/React.createElement(Form.Control, {
    key: key,
    id: key,
    name: key,
    value: data,
    onChange: onChange,
    placeholder: `Pencarian`
  });
};

function DataTableContainer({
  columns,
  data,
  renderRowSubComponent,
  customPageIndex,
  customPageSize,
  customPageCount,
  loading,
  isColumnsSearchable,
  primaryKey,
  name,
  customPageTotal
}) {
  let filter = useSelector(state => state.core.filter) || {};
  let sortBy = [];

  for (let i = 0; i < columns.length; i++) {
    try {
      let k = slug('sort_' + name + '_' + columns[i][primaryKey], '_');
      let urut = filter[k];

      if (!isEmpty(urut) && !isNull(urut) && !isUndefined(urut)) {
        sortBy.push({
          id: columns[i][primaryKey],
          desc: urut == 'desc'
        });
      }
    } catch (e) {}
  }

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize
    }
  } = useTable({
    columns,
    data,
    defaultColumn: {
      Filter: props => /*#__PURE__*/React.createElement(DefaultColumnFilter, Object.assign({}, props, {
        name: name
      }))
    },
    initialState: {
      pageIndex: customPageIndex,
      pageSize: customPageSize,
      sortBy
    },
    manualPagination: true,
    pageCount: customPageCount,
    manualSortBy: true,
    defaultCanSort: true,
    isMultiSortEvent: () => {}
  }, useFilters, useSortBy, useExpanded, usePagination);
  let headers = headerGroups[0].headers || [];
  useDebounce(() => {
    let sort = {};

    for (let i = 0; i < headers.length; i++) {
      let x = headers[i];

      if (x) {
        let mykey = slug('sort_' + name + '_' + x[primaryKey], '_');
        let mysort = x.isSorted ? x.isSortedDesc ? 'desc' : 'asc' : null;

        if (mysort != filter[mykey]) {
          sort[mykey] = mysort;
        }
      }
    }

    if (!isEmpty(sort)) {
      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: { ...sort,
          [slug('loaded_' + name, '_')]: false
        }
      });
    }
  }, 1000, [headers]);
  let [localLoading, setLocalLoading] = useState(loading);
  let [curpage, setCurPage] = useState(pageIndex);
  let dispatch = useDispatch();

  let generateSortingIndicator = column => {
    return column.isSorted ? column.isSortedDesc ? ' ↓' : ' ↑' : '';
  };

  let onChangeInSelect = event => {
    setPageSize(Number(event.target.value));
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: {
        [slug('load_' + name, '_')]: Number(event.target.value),
        [slug('page_' + name, '_')]: curpage
      }
    });
  };

  let onChangeInInput = event => {
    let page = event.target.value ? Number(event.target.value) : 0;
    customgotoPage(page);
  };

  let customcanNextPage = pageIndex < customPageCount;
  let customcanPreviousPage = pageIndex >= 2;

  let customnextPage = () => {
    customgotoPage(curpage + 1);
  };

  let custompreviousPage = () => {
    customgotoPage(curpage - 1);
  };

  let customgotoPage = isi => {
    setCurPage(isi);
  };

  useDebounce(() => {
    gotoPage(curpage);
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: {
        [slug('load_' + name, '_')]: pageSize,
        [slug('page_' + name, '_')]: curpage
      }
    });
  }, 1000, [curpage]);
  useEffect(() => {
    if (setLocalLoading && !loading) {
      setTimeout(() => setLocalLoading(loading), 1000);
    } else {
      setLocalLoading(loading);
    }
  }, [loading]);

  if (isEmpty(name)) {
    return /*#__PURE__*/React.createElement("p", null, "Props name is Required");
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "custom-scroll",
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(InputGroup, null, /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: () => customgotoPage(1),
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleDoubleLeft
  })), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: custompreviousPage,
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleLeft
  })), /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faFile
  }), " \xA0 Hal :", ' '), /*#__PURE__*/React.createElement(Form.Control, {
    style: {
      borderLeft: 'none',
      borderRight: 'none',
      minWidth: 72
    },
    type: "number",
    min: 1,
    max: customPageCount,
    value: curpage,
    onChange: onChangeInInput
  }), /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faColumns
  }), " \xA0 Lihat :", ' '), /*#__PURE__*/React.createElement(Form.Control, {
    type: "number",
    min: 1,
    style: {
      borderLeft: 'none',
      borderRight: 'none',
      minWidth: 72
    },
    max: 50,
    value: pageSize,
    onChange: onChangeInSelect
  }), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: customnextPage,
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleRight
  })), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: () => customgotoPage(customPageCount),
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleDoubleRight
  })))), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-2 mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, numberFormat(pageIndex, '')), " dari", ' ', /*#__PURE__*/React.createElement("strong", null, numberFormat(customPageCount, '')), " hal. Total", ' : ', /*#__PURE__*/React.createElement("strong", null, numberFormat(customPageTotal, '')), " hal"), /*#__PURE__*/React.createElement(Table, Object.assign({
    style: {
      margin: 0,
      zIndex: 0
    },
    responsive: true,
    bordered: true,
    hover: true,
    striped: true,
    vcenter: true
  }, getTableProps()), /*#__PURE__*/React.createElement("thead", null, headerGroups.map(headerGroup => /*#__PURE__*/React.createElement("tr", headerGroup.getHeaderGroupProps(), headerGroup.headers.map(column => /*#__PURE__*/React.createElement("th", Object.assign({
    style: {
      padding: '4px 8px',
      borderTop: '1px solid #dee2e6'
    }
  }, column.getHeaderProps()), /*#__PURE__*/React.createElement("div", column.getSortByToggleProps(), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block'
    }
  }, column.render('Header')), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      fontWeight: 'bold'
    }
  }, generateSortingIndicator(column))), isColumnsSearchable && /*#__PURE__*/React.createElement(Filter, {
    column: column
  })))))), /*#__PURE__*/React.createElement("tbody", getTableBodyProps(), page.length > 0 && !localLoading ? page.map(row => {
    prepareRow(row);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: row.getRowProps().key
    }, /*#__PURE__*/React.createElement("tr", null, row.cells.map((cell, index) => {
      return /*#__PURE__*/React.createElement("td", Object.assign({
        style: {
          padding: '4px 8px',
          width: index == 0 ? '10px' : 'auto'
        }
      }, cell.getCellProps()), cell.render('Cell'));
    })), row.isExpanded && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '4px 8px'
      },
      colSpan: visibleColumns.length
    }, renderRowSubComponent(row))));
  }) : headerGroups.map(headerGroup => /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 0',
      textAlign: 'center'
    },
    colSpan: headerGroup.headers.length
  }, localLoading ? 'Memproses...' : 'Tidak ada data'))))), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-2 mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, numberFormat(pageIndex, '')), " dari", ' ', /*#__PURE__*/React.createElement("strong", null, numberFormat(customPageCount, '')), " hal. Total", ' : ', /*#__PURE__*/React.createElement("strong", null, numberFormat(customPageTotal, '')), " hal"), /*#__PURE__*/React.createElement("div", {
    className: "custom-scroll",
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(InputGroup, null, /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: () => customgotoPage(1),
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleDoubleLeft
  })), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: custompreviousPage,
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleLeft
  })), /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faFile
  }), " \xA0 Hal :", ' '), /*#__PURE__*/React.createElement(Form.Control, {
    style: {
      borderLeft: 'none',
      borderRight: 'none',
      minWidth: 72
    },
    type: "number",
    min: 1,
    max: customPageCount,
    value: curpage,
    onChange: onChangeInInput
  }), /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faColumns
  }), " \xA0 Lihat :", ' '), /*#__PURE__*/React.createElement(Form.Control, {
    type: "number",
    min: 1,
    style: {
      borderLeft: 'none',
      borderRight: 'none',
      minWidth: 72
    },
    max: 50,
    value: pageSize,
    onChange: onChangeInSelect
  }), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: customnextPage,
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleRight
  })), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: () => customgotoPage(customPageCount),
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faAngleDoubleRight
  })))));
}

function DataTable(props) {
  let [visible, setVisible] = useState(false);
  let [data, setData] = useState([]);
  let [temp, setTemp] = useState([]);
  let [meta, setMeta] = useState({});
  let [tooltipOpenEx, setTooltipOpenEx] = useState(false);
  let [tooltipOpenIm, setTooltipOpenIm] = useState(false);

  let toggleImport = () => setTooltipOpenIm(!tooltipOpenIm);

  let toggleExport = () => setTooltipOpenEx(!tooltipOpenEx);

  let dispatch = useDispatch();
  let parameter = useSelector(state => state.core.parameter) || {};
  let input = useSelector(state => state.core.input) || {};
  let user = useSelector(state => state.auth.user) || {};
  let filter$1 = useSelector(state => state.core.filter) || {};
  let key_select = slug('selected_' + props.name, '_');
  let primaryKey = props.primaryKey ? props.primaryKey : 'id';

  function onChecked(rowInfo, input, exist = false) {
    let value = rowInfo.row.original || {};

    if (props.selectable == 'single') {
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value
        }
      });
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: value[primaryKey]
        }
      });
    } else {
      let new_input = [];

      if (exist) {
        new_input = filter(findArrayName(key_select, input), o => {
          return o && value && parseInt(o) != parseInt(value[primaryKey]);
        }) || [];
      } else {
        new_input = findArrayName(key_select, input) || [];

        if (!isArray(new_input)) {
          new_input = [];
        }

        new_input.push(value[primaryKey]);
      }

      new_input = uniq(new_input);
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: new_input
        }
      });
    }
  }

  let checkComponent = {
    Header: '#',
    id: 'select',
    width: '10px',
    Cell: row => {
      let local_input = useSelector(state => state.core.input);
      let checked = false;

      try {
        if (props.selectable == 'single') {
          checked = findArrayName(key_select, local_input) == row.row.original[primaryKey];
        } else {
          checked = findIndex(findArrayName(key_select, local_input), function (o) {
            return o == row.row.original[primaryKey];
          }) > -1;
        }
      } catch (e) {}

      return /*#__PURE__*/React.createElement(Form.Check, {
        id: slug(props.name + '_check_' + row.row.original[primaryKey], '_'),
        name: slug(props.name + '_check_' + row.row.original[primaryKey], '_'),
        type: props.selectable == 'single' ? 'radio' : 'checkbox',
        value: 1,
        checked: checked,
        disabled: props.isReadonly,
        onChange: () => onChecked(row, local_input, checked)
      });
    }
  };
  let nodeRef = useRef();
  let isVisible = useIsVisible(nodeRef);
  let col = !isEmpty(props.selectable) ? [checkComponent, ...props.columns] : [...props.columns];

  if (props.action) {
    let actionComponent = {
      Header: 'Aksi',
      id: 'aksi_' + props.name,
      sortable: false,
      Cell: row => {
        let param = useSelector(state => state.core.parameter);
        let isi = row.row.original[primaryKey];

        function openToggle(data) {
          let current = isEqual(param.dropdown, data) ? null : data;
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: 'dropdown',
              value: current
            }
          });
        }

        return /*#__PURE__*/React.createElement(DropdownButton, {
          key: 'end',
          size: "sm",
          id: 'dropdown_' + props.name + '_' + isi,
          className: "custom-scroll",
          isOpen: isEqual(param.dropdown, isi),
          toggle: () => openToggle(isi),
          drop: 'end',
          variant: "primary",
          title: ''
        }, filter(props.action, function (o) {
          return isUndefined(o.show) || o.show;
        }).map((value, index) => {
          let disabled = isBoolean(value.disabled) ? value.disabled : false;
          return /*#__PURE__*/React.createElement(Dropdown.Item, {
            key: 'dropdownitem_' + props.name + '_' + isi + '_' + index,
            onClick: () => value.onClick(row.row.original),
            disabled: disabled
          }, value.label);
        }));
      }
    };
    col = !isEmpty(props.selectable) ? [actionComponent, checkComponent, ...props.columns] : [actionComponent, ...props.columns];
  }

  useEffect(() => {
    if (isVisible != visible) {
      setVisible(isVisible);
    }
  });
  useEffect(() => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        key: slug('loaded_' + props.name, '_'),
        value: false
      }
    });
  }, []);

  function onReload() {
    if (visible) {
      props.onReload();

      if (!findArrayName(slug('loaded_' + props.name, '_'), filter$1)) {
        dispatch({
          type: 'SET_FILTER',
          payload: {
            key: slug('loaded_' + props.name, '_'),
            value: true
          }
        });
      }
    }
  }

  useDebounce(() => {
    if (visible) {
      onReload();
    }
  }, 1000, [visible]);
  useDebounce(onReload, 1000, [findArrayName(slug('keyword_' + props.name, '_'), filter$1), findArrayName(slug('page_' + props.name, '_'), filter$1), findArrayName(slug('load_' + props.name, '_'), filter$1), findArrayName(slug('loaded_' + props.name, '_'), filter$1)]);

  function syncParameter() {
    let new_parameter = null;
    let new_input = null;

    if (props.selectable == 'single') {
      new_parameter = new_parameter = find(temp, o => {
        return o && parseInt(o[primaryKey]) == new_input;
      }) || {};
      new_input = findArrayName(key_select, input) || null;
    } else {
      new_parameter = [];
      new_input = findArrayName(key_select, input) || [];

      for (let i = 0; i < new_input.length; i++) {
        let find_data = find(temp, o => {
          return o && parseInt(o[primaryKey]) == new_input[i];
        }) || {};

        if (!isEmpty(find_data)) {
          new_parameter.push(find_data);
        }
      }
    }

    dispatch({
      type: 'SET_PARAMETER',
      payload: {
        key: key_select,
        value: new_parameter
      }
    });
  }

  useDebounce(() => {
    setTemp(val => uniqBy([...val, ...data], primaryKey));

    if (findArrayName(key_select, input)) {
      syncParameter();
    }
  }, 1000, [findArrayName(key_select, input), filter$1]);
  useDebounce(() => {
    try {
      setData(props.data.data || []);
    } catch (e) {}

    setTemp(val => uniqBy([...val, ...data], primaryKey));

    try {
      setMeta(props.data.meta || {});
    } catch (e) {}
  }, 1000, [props.data]);
  let columns = React.useMemo(() => col, []);
  let hapus = false;

  try {
    hapus = user.role == 'admin';
  } catch (e) {}

  return /*#__PURE__*/React.createElement(MyLoadingOvelay, {
    isLoading: props.isLoading
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px'
    },
    ref: nodeRef
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement(Row$1, null, /*#__PURE__*/React.createElement(Col$1, {
    xs: "12",
    sm: "12",
    md: "8",
    lg: "8"
  }, /*#__PURE__*/React.createElement("div", null, props.renderFilter ? props.renderFilter : null))), /*#__PURE__*/React.createElement(Row$1, {
    style: {
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Col$1, {
    xs: "12",
    sm: "12",
    md: "4",
    lg: "4"
  }, /*#__PURE__*/React.createElement("div", null, props.isSearchable && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputGroup, null, /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSearch
  })), /*#__PURE__*/React.createElement(Form.Control, {
    id: slug('keyword_' + props.name, '_'),
    key: slug('keyword_' + props.name, '_'),
    style: {
      borderLeft: 'none'
    },
    className: "form-control",
    value: findArrayName(slug('keyword_' + props.name, '_'), filter$1),
    onChange: e => {
      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: {
          [slug('keyword_' + props.name, '_')]: e.target.value,
          [slug('page_' + props.name, '_')]: 1,
          loaded: false
        }
      });
    },
    type: "text",
    id: slug('keyword_' + key_select),
    name: "keyword",
    placeholder: "Pencarian"
  }), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      zIndex: 0
    },
    variant: "primary",
    onClick: onReload,
    type: "button",
    disabled: props.isLoading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSync,
    spin: props.isLoading
  })), (props.export || props.import) && /*#__PURE__*/React.createElement(React.Fragment, null, props.export && /*#__PURE__*/React.createElement(Button$1, {
    id: "exportFile",
    style: {
      zIndex: 0
    },
    variant: "primary",
    className: "mr-1",
    onClick: props.exportReload,
    type: "button",
    disabled: props.disabledButton
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faArrowAltCircleDown
  }), /*#__PURE__*/React.createElement(Tooltip, {
    placement: "top",
    isOpen: tooltipOpenEx,
    autohide: false,
    target: "exportFile",
    toggle: toggleExport
  }, "Export")), props.import && /*#__PURE__*/React.createElement(Button$1, {
    id: "importFile",
    style: {
      zIndex: 0
    },
    variant: "primary",
    className: "mr-1",
    onClick: props.importReload,
    type: "button",
    disabled: props.disabledButton
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faArrowAltCircleUp
  }), /*#__PURE__*/React.createElement(Tooltip, {
    placement: "top",
    isOpen: tooltipOpenIm,
    autohide: false,
    target: "importFile",
    toggle: toggleImport
  }, "Import"))))))))), /*#__PURE__*/React.createElement(DataTableContainer, {
    name: slug(props.name, '_'),
    columns: columns,
    data: data,
    primaryKey: primaryKey,
    isColumnsSearchable: props.isColumnsSearchable,
    fetchData: onReload,
    loading: props.isLoading,
    customPageTotal: meta && !isEmpty(meta) ? meta.total : 0,
    customPageCount: meta && !isEmpty(meta) ? meta.last_page : 1,
    customPageSize: meta && !isEmpty(meta) ? meta.per_page : findArrayName(slug('load_' + props.name, '_'), filter$1) ? findArrayName(slug('load_' + props.name, '_'), filter$1) : 10,
    customPageIndex: meta && !isEmpty(meta) ? meta.current_page : findArrayName(slug('page_' + props.name, '_'), filter$1) ? findArrayName(slug('page_' + props.name, '_'), filter$1) : 1
  })));
}

function Field(props) {
  let message = [];

  if (isArray(props.errorMessage)) {
    for (let i = 0; i < props.errorMessage.length; i++) {
      let isi = props.errorMessage[i];

      if (isArray(isi)) {
        for (let y = 0; y < isi.length; y++) {
          message.push(isi[y]);
        }
      } else {
        message.push(isi);
      }
    }
  } else {
    message.push(props.errorMessage);
  }

  return /*#__PURE__*/React.createElement(Form.Group, {
    as: Row$1
  }, /*#__PURE__*/React.createElement(Form.Label, {
    column: true,
    md: props.labelSize ? props.labelSize : 3
  }, props.label ? props.label : 'Label', props.isRequired && /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "\xA0*"), props.hint && /*#__PURE__*/React.createElement("small", {
    className: "form-text text-muted"
  }, props.hint)), /*#__PURE__*/React.createElement(Col$1, {
    md: props.inputSize ? props.inputSize : 9
  }, props.children, /*#__PURE__*/React.createElement(Form.Text, {
    className: "text-danger"
  }, message.length > 0 && message.join(', '))));
}

const CustomInput$1 = props => {
  return /*#__PURE__*/React.createElement(InputGroup, {
    size: "sm"
  }, /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    size: "sm",
    icon: faCalendar
  })), /*#__PURE__*/React.createElement(Form.Control, {
    style: {
      borderLeft: 'none',
      borderRight: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    },
    type: "text",
    className: "form-control",
    disabled: props.disabled,
    name: props.name,
    value: props.value || '',
    onClick: props.onClick
  }), /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    size: "sm",
    icon: faClock
  })));
};

class InputDateTime extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD HH:mm:ss') : null;
      this.props.setInput(this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeStart = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD HH:mm:ss') : null;
      this.props.setInput('start_' + this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeEnd = data => {
      data = moment__default(data).isValid() ? moment__default(data).format('YYYY-MM-DD HH:mm:ss:ss') : null;
      this.props.setInput('end_' + this.props.name, data);
      this.onRefresh();
    };

    this.checkTglMerah = date => {
      const x = moment__default(date).format('d');
      return x == 5 || x == 6 ? 'tglmerah' : undefined;
    };

    this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    this.onRefresh = _.debounce(this.onRefresh.bind(this), 200);
  }

  onRefresh() {
    if (this.props.isRange) {
      let start_selected = null;
      let end_selected = null;

      try {
        start_selected = this.props.start_selected ? moment__default(this.props.start_selected).toDate() : findArrayName('start_' + this.props.name, this.props.input) ? moment__default(findArrayName('start_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment__default(this.props.end_selected).toDate() : findArrayName('end_' + this.props.name, this.props.input) ? moment__default(findArrayName('end_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        start_selected,
        end_selected
      });
    } else {
      let selected = null;

      try {
        selected = this.props.selected ? moment__default(this.props.selected).toDate() : findArrayName(this.props.name, this.props.input) ? moment__default(findArrayName(this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        selected
      });
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && findArrayName(this.props.name, prevProps.input) != findArrayName(this.props.name, this.props.input) && findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('start_' + this.props.name, prevProps.input) != findArrayName('start_' + this.props.name, this.props.input) && findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('end_' + this.props.name, prevProps.input) != findArrayName('end_' + this.props.name, this.props.input) && findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  }

  render() {
    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return /*#__PURE__*/React.createElement("div", {
          className: "input-daterange input-group"
        }, moment__default(this.state.start_selected).isValid() ? moment__default(this.state.start_selected).format('DD-MM-YYYY HH:mm:ss') : null, /*#__PURE__*/React.createElement("span", {
          style: {
            background: 'none'
          }
        }, "\xA0 s/d \xA0"), moment__default(this.state.end_selected).isValid() ? moment__default(this.state.end_selected).format('DD-MM-YYYY HH:mm:ss') : null);
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "input-daterange input-group",
        style: {
          background: 'none'
        }
      }, /*#__PURE__*/React.createElement(DatePicker, {
        minDate: this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
        maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
        dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
        placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
        selected: this.state.start_selected,
        isClearable: true,
        customInput: /*#__PURE__*/React.createElement(CustomInput$1, {
          value: this.state.start_selected,
          name: 'start_' + this.props.name
        }),
        onChange: this.handleInputChangeStart,
        timeInputLabel: "Waktu : ",
        showTimeInput: true,
        selectsStart: true,
        peekNextMonth: true,
        withPortal: true,
        showMonthDropdown: true,
        showYearDropdown: true,
        name: 'start_' + this.props.name,
        todayButton: 'Hari ini',
        dayClassName: this.checkTglMerah,
        dropdownMode: "select",
        startDate: this.state.start_selected,
        endDate: this.state.end_selected,
        shouldCloseOnSelect: false
      }), /*#__PURE__*/React.createElement("span", {
        className: "input-group-addon",
        style: {
          background: 'none'
        }
      }, "\xA0 - \xA0"), /*#__PURE__*/React.createElement(DatePicker, {
        minDate: this.state.start_selected ? this.state.start_selected : this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
        maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
        dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
        placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
        selected: this.state.end_selected,
        isClearable: true,
        name: 'end_' + this.props.name,
        selectsEnd: true,
        timeInputLabel: "Waktu : ",
        showTimeInput: true,
        customInput: /*#__PURE__*/React.createElement(CustomInput$1, {
          value: this.state.end_selected,
          name: 'end_' + this.props.name
        }),
        onChange: this.handleInputChangeEnd,
        peekNextMonth: true,
        withPortal: true,
        showMonthDropdown: true,
        showYearDropdown: true,
        dayClassName: this.checkTglMerah,
        todayButton: 'Hari ini',
        dropdownMode: "select",
        startDate: this.state.start_selected,
        endDate: this.state.end_selected,
        shouldCloseOnSelect: false
      }));
    }

    if (this.props.disabled || this.props.isReadonly) {
      return /*#__PURE__*/React.createElement("div", {
        className: "input-daterange input-group"
      }, moment__default(this.state.selected).isValid() ? moment__default(this.state.selected).format('DD-MM-YYYY HH:mm:ss') : null);
    }

    return /*#__PURE__*/React.createElement(DatePicker, {
      minDate: this.props.minDate ? moment__default(this.props.minDate).toDate() : null,
      maxDate: this.props.maxDate ? moment__default(this.props.maxDate).toDate() : null,
      dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
      placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
      selected: this.state.selected,
      isClearable: true,
      id: this.props.name,
      className: "form-control",
      customInput: /*#__PURE__*/React.createElement(CustomInput$1, {
        value: this.state.selected,
        name: this.props.name
      }),
      dayClassName: this.checkTglMerah,
      onChange: this.handleInputChange,
      peekNextMonth: true,
      timeInputLabel: "Waktu : ",
      showTimeInput: true,
      withPortal: true,
      showMonthDropdown: true,
      showYearDropdown: true,
      todayButton: 'Hari ini',
      dropdownMode: "select",
      shouldCloseOnSelect: false
    });
  }

}

const mapStateToProps$4 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$4 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputDateTime$1 = connect(mapStateToProps$4, mapDispatchToProps$4)(InputDateTime);

let formattime = 'HH:mm:ss';
let now = moment__default();

function IconClock() {
  return /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    style: {
      position: 'absolute',
      left: 6,
      top: 6
    },
    icon: faClock,
    size: "sm"
  });
}

class InputTime extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = data => {
      data = data ? moment__default(data).format(formattime) : null;
      this.props.setInput(this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeStart = data => {
      data = data ? moment__default(data).format(formattime) : null;
      this.props.setInput('start_' + this.props.name, data);
      this.onRefresh();
    };

    this.handleInputChangeEnd = data => {
      data = data ? moment__default(data).format(formattime) : null;
      this.props.setInput('end_' + this.props.name, data);
      this.onRefresh();
    };

    this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    this.onRefresh = debounce(this.onRefresh.bind(this), 200);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && findArrayName(this.props.name, prevProps.input) != findArrayName(this.props.name, this.props.input) && findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('start_' + this.props.name, prevProps.input) != findArrayName('start_' + this.props.name, this.props.input) && findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && findArrayName('end_' + this.props.name, prevProps.input) != findArrayName('end_' + this.props.name, this.props.input) && findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  }

  onRefresh() {
    if (this.props.isRange) {
      let start_selected = moment__default();
      let end_selected = moment__default();

      try {
        start_selected = this.props.start_selected ? moment__default(this.props.start_selected, formattime) : findArrayName('start_' + this.props.name, this.props.input) ? moment__default(findArrayName('start_' + this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment__default(this.props.end_selected, formattime) : findArrayName('end_' + this.props.name, this.props.input) ? moment__default(findArrayName('end_' + this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      this.setState({
        start_selected,
        end_selected
      });
    } else {
      let selected = moment__default();

      try {
        selected = this.props.selected ? moment__default(this.props.selected, formattime) : findArrayName(this.props.name, this.props.input) ? moment__default(findArrayName(this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      this.setState({
        selected
      });
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return /*#__PURE__*/React.createElement("div", {
          className: "input-daterange input-group"
        }, moment__default(this.state.start_selected).isValid() ? moment__default(this.state.start_selected).format(formattime) : '', /*#__PURE__*/React.createElement("span", {
          style: {
            background: 'none'
          }
        }, "\xA0 s/d \xA0"), moment__default(this.state.end_selected).isValid() ? moment__default(this.state.end_selected).format(formattime) : '');
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "input-daterange input-group"
      }, /*#__PURE__*/React.createElement(TimePicker, {
        value: this.state.start_selected,
        disabled: this.props.disabled || this.props.isReadonly,
        inputIcon: /*#__PURE__*/React.createElement(IconClock, null),
        format: formattime,
        onChange: this.handleInputChangeStart
      }), /*#__PURE__*/React.createElement("span", {
        className: "input-group-addon",
        style: {
          background: 'none'
        }
      }, "\xA0 - \xA0"), /*#__PURE__*/React.createElement(TimePicker, {
        value: this.state.end_selected,
        disabled: this.props.disabled || this.props.isReadonly,
        inputIcon: /*#__PURE__*/React.createElement(IconClock, null),
        format: formattime,
        onChange: this.handleInputChangeEnd
      }));
    }

    if (this.props.disabled || this.props.isReadonly) {
      return /*#__PURE__*/React.createElement("div", {
        className: "input-daterange input-group"
      }, moment__default(this.state.selected).isValid() ? moment__default(this.state.selected).format(formattime) : '');
    }

    return /*#__PURE__*/React.createElement(TimePicker, {
      value: this.state.selected,
      disabled: this.props.disabled || this.props.isReadonly,
      inputIcon: /*#__PURE__*/React.createElement(IconClock, null),
      format: formattime,
      onChange: this.handleInputChange
    });
  }

}

const mapStateToProps$5 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$5 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputTime$1 = connect(mapStateToProps$5, mapDispatchToProps$5)(InputTime);

class InputTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
      separator: '|'
    };
    this.reactTags = React.createRef();
  }

  onDelete(i) {
    let tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({
      tags
    });

    if (this.props.name) {
      this.props.setInput(this.props.name, _.map(tags, 'name').join(this.state.separator));
    }
  }

  onAddition(tag) {
    let tags = [].concat(this.state.tags, tag);
    this.setState({
      tags: _.uniqBy(tags, 'name')
    });

    if (this.props.name) {
      this.props.setInput(this.props.name, _.map(tags, 'name').join(this.state.separator));
    }
  }

  onFocus(tag) {}

  onValidate(tag) {
    return _.findIndex(this.state.tags, ['name', tag.name]) < 0;
  }

  componentDidMount() {
    let suggestions = [];
    let tags = [];

    for (let i = 0; i < this.props.options.length; i++) {
      let isi = this.props.options[i];

      if (!_.isEmpty(isi[this.props.optionValue])) {
        suggestions.push({
          name: isi[this.props.optionValue]
        });
      }
    }

    let value = '';

    try {
      value = this.props.value ? this.props.value : this.props.input[this.props.name] ? this.props.input[this.props.name] : '';
    } catch (e) {}

    let v = value ? String(value).split(this.state.separator) : [];

    for (let i = 0; i < v.length; i++) {
      let isi = v[i];

      if (!_.isEmpty(isi)) {
        tags.push({
          name: isi
        });
      }
    }

    this.setState({
      suggestions,
      tags
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(ReactTags, {
      minQueryLength: 1,
      noSuggestionsText: 'Tidak ada usulan',
      ref: this.reactTags,
      tags: this.state.tags,
      id: this.props.name,
      removeButtonText: "Klik untuk menghapus",
      delimiters: ['Enter', 'Tab'],
      placeholderText: this.props.placeholder ? this.props.placeholder : 'Dipisah dengan spasi / enter',
      allowNew: this.props.isCreateable,
      suggestions: this.state.suggestions,
      onDelete: this.onDelete.bind(this),
      onValidate: this.onValidate.bind(this),
      onFocus: this.onFocus.bind(this),
      onAddition: this.onAddition.bind(this)
    });
  }

}

const mapStateToProps$6 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$6 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputTag$1 = connect(mapStateToProps$6, mapDispatchToProps$6)(InputTag);

class InputSelect extends React.Component {
  constructor(props) {
    super(props);

    this.labelGenerate = option => {
      if (!isEmpty(option)) {
        if (isArray(this.props.optionLabel)) {
          let label = [];
          let separator = this.props.separator ? this.props.separator : ' | ';

          for (let i = 0; i <= this.props.optionLabel.length - 1; i++) {
            label.push(option[this.props.optionLabel[i]]);
          }

          return label.join(separator);
        } else {
          return option[this.props.optionLabel];
        }
      }

      return null;
    };

    this.onChange = selectedOption => {
      if (this.props.name) {
        try {
          if (this.props.isMultiple) {
            this.props.setInput(this.props.name, map(selectedOption, this.props.optionValue));
          } else {
            this.props.setInput(this.props.name, selectedOption[this.props.optionValue]);
          }
        } catch (e) {
          this.props.setInput(this.props.name, null);
        }
      }

      this.onRefresh();
    };

    this.openModal = () => {
      this.setState({
        show: !this.state.show
      });
    };

    this.state = {
      defaultValue: null,
      options: [],
      show: false
    };
    this.onRefresh = debounce(this.onRefresh.bind(this), 200);
  }

  onRefresh() {
    let val = null;
    let defaultValue = null;

    if (this.props.value) {
      val = this.props.value;
    } else {
      val = findArrayName(this.props.name, this.props.input) || [];

      if (this.props.isMultiple) {
        defaultValue = [];

        for (let i = 0; i < this.props.options.length; i++) {
          for (let y = 0; y < val.length; y++) {
            let opt = this.props.options[i];
            let cur = val[y];

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt);
            }
          }
        }
      } else {
        defaultValue = find(this.props.options, function (o) {
          return String(o[this.props.optionValue]) == val;
        }.bind(this));
      }
    }

    defaultValue = !isUndefined(defaultValue) && !isNull(defaultValue) ? defaultValue : null;
    this.setState({
      defaultValue
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(findArrayName(this.props.name, prevProps.input), findArrayName(this.props.name, this.props.input)) && !isEqual(this.state.defaultValue, findArrayName(this.props.name, this.props.input))) {
      this.onRefresh();
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    let options = [];

    try {
      for (let i = 0; i < this.props.options.length; i++) {
        let y = this.props.options[i];

        if (this.props.isHtml) {
          y[this.props.name] = parse(String(y[this.props.name]));
        }

        options.push(y);
      }
    } catch (e) {}

    if (this.props.disabled || this.props.isReadonly) {
      return this.labelGenerate(this.state.defaultValue);
    }

    if (this.props.withModal) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Row, null, !this.props.isReadonly && /*#__PURE__*/React.createElement(Col, {
      lg: "1",
      md: "1",
      sm: "3",
      xs: "1"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      className: "btn btn-icon btn-primary btn-sm",
      onClick: this.openModal
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      size: "sm",
      icon: faSearch
    }), " Pilih")), /*#__PURE__*/React.createElement(Col, {
      lg: "11",
      md: "11",
      sm: "9",
      xs: "11"
    }, this.state.defaultValue && !isUndefined(this.state.defaultValue) && !isEmpty(this.state.defaultValue) ? this.labelGenerate(this.state.defaultValue) : '')), /*#__PURE__*/React.createElement(Modal, {
      size: "lg",
      show: this.state.show,
      onHide: this.openModal
    }, /*#__PURE__*/React.createElement(ModalHeader, {
      closeButton: true,
      toggle: this.openModal
    }, /*#__PURE__*/React.createElement(Modal.Title, null, this.props.placeholder || 'Pilih')), /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement(Select, {
      isClearable: true,
      id: this.props.id ? this.props.id : this.props.name,
      isSearchable: true,
      isHtml: this.props.isHtml,
      isMulti: this.props.isMultiple,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Pilih',
      getOptionLabel: this.labelGenerate,
      getOptionValue: option => option[this.props.optionValue],
      noOptionsMessage: () => 'Data tidak ditemukan',
      value: this.state.defaultValue,
      onChange: this.onChange,
      options: options,
      isDisabled: this.props.disabled
    }))));
    return /*#__PURE__*/React.createElement(Select, {
      menuPortalTarget: document.body,
      menuPosition: "fixed",
      styles: {
        menuPortal: base => ({ ...base,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          zIndex: 9999
        }),
        menu: provided => ({ ...provided,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          zIndex: '9999 !important'
        }),
        multiValueRemove: base => ({ ...base,
          color: '#db2828',
          cursor: 'pointer'
        }),
        placeholder: base => ({ ...base,
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }),
        multiValue: base => ({ ...base,
          background: 'none'
        }),
        multiValueLabel: base => ({ ...base,
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }),
        option: base => ({ ...base,
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }),
        clearIndicator: (base, state) => ({ ...base,
          cursor: 'pointer',
          color: state.isFocused ? '#db2828' : '#db2828'
        })
      },
      className: "tcomponent-select",
      isClearable: true,
      id: this.props.id ? this.props.id : this.props.name,
      isSearchable: true,
      isHtml: this.props.isHtml,
      isMulti: this.props.isMultiple,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Pilih',
      getOptionLabel: this.labelGenerate,
      getOptionValue: option => option[this.props.optionValue],
      noOptionsMessage: () => 'Data tidak ditemukan',
      value: this.state.defaultValue,
      onChange: this.onChange,
      options: options,
      isDisabled: this.props.disabled
    });
  }

}

const mapStateToProps$7 = state => ({
  input: state.core.input || {}
});

const mapDispatchToProps$7 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputSelect$1 = connect(mapStateToProps$7, mapDispatchToProps$7)(InputSelect);

function InputWorkflow(props) {
  let [isDelay, setIsDelay] = useState(false);
  let [listLoading, setListLoading] = useState(false);
  let [submitLoading, setSubmitLoading] = useState(false);
  let [responseLoading, setResponseLoading] = useState(false);
  let auth = useSelector(state => state.auth) || {};
  let input = useSelector(state => state.core.input) || {};
  let validation = useSelector(state => state.core.validation) || [];
  let parameter = useSelector(state => state.core.parameter) || {};
  let filter$1 = useSelector(state => state.core.filter) || {};
  let dispatch = useDispatch();
  let [list, setList] = useState({});
  let [activity, setActivity] = useState({
    activity: {},
    role: '',
    response: []
  });
  let {
    doAfterSubmit,
    isLoading,
    doSubmit,
    doCancel,
    isReadonly,
    relation,
    id,
    isDelete
  } = props;
  let [readonly, setReadonly] = useState(isReadonly);
  useEffect(() => {
    setReadonly(isReadonly);
  }, [isReadonly]);

  function submit(event) {
    if (!input.response_activity || isEmpty(input.response_activity)) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Respon wajib diisi'
      });
    } else {
        setSubmitLoading(true);
        setIsDelay(true);
        setTimeout(() => setIsDelay(false), 1000);
        doSubmit && doSubmit();
      }
  }

  useEffect(() => {
    reload_response();
  }, []);
  useEffect(() => {
    let allowed_role = [];

    try {
      allowed_role = activity.role.split(',');
    } catch (e) {}

    let user_role = [];

    try {
      user_role = auth.user.role.split(',');
    } catch (e) {}

    let is_allowed = false;
    let is_admin = false;

    for (let i = 0; i < user_role.length; i++) {
      if (!is_admin && user_role[i] && isEqual(String(user_role[i]).trim().toLowerCase(), 'admin')) {
        is_admin = true;
        is_allowed = true;
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: 'response_role',
            value: String(user_role[i]).trim().toLowerCase()
          }
        });
      }
    }

    if (!is_admin) {
      for (let i = 0; i < allowed_role.length; i++) {
        for (let y = 0; y < user_role.length; y++) {
          if (allowed_role[i] && user_role[y] && String(allowed_role[i]).trim().toLowerCase() == String(user_role[y]).trim().toLowerCase() && !is_allowed) {
            is_allowed = true;
            dispatch({
              type: 'SET_INPUT',
              payload: {
                key: 'response_role',
                value: String(user_role[y]).trim().toLowerCase()
              }
            });
          }
        }
      }
    }

    let allowed = !isEmpty(activity.activity) && activity.response.length > 0 && is_allowed;

    if (allowed && readonly && !isReadonly) {
      setReadonly(false);
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: 'activity',
          value: activity.activity.code
        }
      });
    } else {
      setReadonly(true);
    }
  }, [activity]);
  useEffect(() => {
    if (submitLoading && !isEmpty(validation)) {
      setSubmitLoading(false);
    }
  }, [validation]);
  useEffect(() => {
    if (submitLoading && !isLoading && !isDelay) {
      setSubmitLoading(false);

      if (isEmpty(validation)) {
        doAfterSubmit && doAfterSubmit();
      }
    }
  }, [isDelay, validation, isLoading]);

  function cancel(event) {
    doCancel && doCancel();
  }

  function reload_response() {
    let url = process.env.REACT_APP_API_URL + '/komentar_respon?';
    let options = {
      data: secureData({
        relation,
        id
      }),
      method: 'POST',
      headers: setAuthHeader(auth),
      url
    };
    setResponseLoading(true);
    axios(options).then(response => {
      let newactivity = response.data.data || {};

      if (isDelete) {
        newactivity.response = filter(newactivity.response, function (o) {
          return o.code == 'HAPUS';
        });
      }

      setActivity(newactivity);
      setResponseLoading(false);
    }).catch(error => {
      fetchErrorDispatch(error, dispatch);
      setResponseLoading(false);
    });
  }

  function reload() {
    let url = process.env.REACT_APP_API_URL + '/komentar?';
    let columns = ['user', 'role', 'activity', 'comment', 'due_datetime', 'start_datetime', 'end_datetime'];
    let f = {};

    try {
      f = defaultFilterData(filter$1, columns, slug(props.relation, '_'));
    } catch (e) {}

    let isi = {
      relation,
      id,
      ...f
    };
    let options = {
      data: secureData(isi),
      method: 'POST',
      headers: setAuthHeader(auth),
      url
    };
    setListLoading(true);
    axios(options).then(response => {
      setList(response.data.data);
      setListLoading(false);
    }).catch(error => {
      fetchErrorDispatch(error, dispatch);
      setListLoading(false);
    });
  }

  if (responseLoading) return /*#__PURE__*/React.createElement(Loading, null);
  return /*#__PURE__*/React.createElement(MyLoadingOvelay, {
    isLoading: isLoading || submitLoading
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement(Card.Title, {
    tag: "h5"
  }, activity.activity.name || 'Alur tidak ditemukan'), /*#__PURE__*/React.createElement(Card.Text, null, !readonly && /*#__PURE__*/React.createElement(Row$1, null, /*#__PURE__*/React.createElement(Col$1, {
    lg: "6"
  }, /*#__PURE__*/React.createElement(Form.Group, {
    as: Row$1
  }, /*#__PURE__*/React.createElement(Col$1, {
    lg: "3"
  }, /*#__PURE__*/React.createElement(Form.Label, null, "Respon ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*"))), /*#__PURE__*/React.createElement(Col$1, {
    lg: "9"
  }, /*#__PURE__*/React.createElement(InputSelect$1, {
    name: "response_activity",
    options: activity.response,
    separator: " | ",
    optionLabel: ['name'],
    optionValue: "code"
  }))), /*#__PURE__*/React.createElement(Form.Group, {
    as: Row$1
  }, /*#__PURE__*/React.createElement(Col$1, {
    lg: "3"
  }, /*#__PURE__*/React.createElement(Form.Label, null, "Lampiran")), /*#__PURE__*/React.createElement(Col$1, {
    lg: "5"
  }, /*#__PURE__*/React.createElement(InputFile, {
    value: input.attachment,
    name: "response_attachment",
    id: "response_attachment"
  })))), /*#__PURE__*/React.createElement(Col$1, {
    lg: "6"
  }, /*#__PURE__*/React.createElement(Form.Group, {
    as: Row$1
  }, /*#__PURE__*/React.createElement(Col$1, {
    lg: "3",
    style: {
      marginBottom: 35
    }
  }, /*#__PURE__*/React.createElement(Form.Label, null, "Komentar")), /*#__PURE__*/React.createElement(Col$1, {
    lg: "9"
  }, /*#__PURE__*/React.createElement(InputText$1, {
    type: "textarea",
    required: true,
    name: "response_comment",
    id: "response_comment",
    rows: "3"
  }))))), /*#__PURE__*/React.createElement(DataTable, {
    data: list,
    isLoading: listLoading,
    name: slug(props.relation, '_'),
    primaryKey: "id",
    isSearchable: true,
    isColumnsSearchable: true,
    onReload: reload,
    columns: [{
      Header: 'Nama',
      id: 'user',
      accessor: d => d.user
    }, {
      Header: 'Jabatan',
      id: 'role',
      accessor: d => d.role
    }, {
      Header: 'Aktifitas',
      id: 'activity',
      accessor: d => d.activity
    }, {
      Header: 'Respon',
      id: 'response',
      accessor: d => d.response
    }, {
      Header: 'Komentar',
      id: 'comment',
      accessor: d => d.comment
    }, {
      Header: 'Tenggat',
      id: 'due_datetime',
      accessor: d => d.due_datetime && moment__default(d.due_datetime).format('DD-MM-YYYY HH:mm')
    }, {
      Header: 'Mulai',
      id: 'start_datetime',
      accessor: d => d.start_datetime && moment__default(d.start_datetime).format('DD-MM-YYYY HH:mm')
    }, {
      Header: 'Selesai',
      id: 'end_datetime',
      accessor: d => d.end_datetime && moment__default(d.end_datetime).format('DD-MM-YYYY HH:mm')
    }, {
      Header: 'Lampiran',
      id: 'attachment',
      accessor: d => /*#__PURE__*/React.createElement(InputFile, {
        value: d.attachment,
        isReadonly: true
      })
    }]
  })), /*#__PURE__*/React.createElement(Row$1, {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(Col$1, null, /*#__PURE__*/React.createElement(Button$1, {
    type: "button",
    className: "btn btn-icon btn-primary btn-sm float-left",
    onClick: cancel
  }, "Kembali"), !readonly && /*#__PURE__*/React.createElement(Button$1, {
    type: "button",
    className: "btn btn-icon btn-primary btn-sm float-right",
    onClick: submit
  }, "Proses"))))));
}

function InputYear(props) {
  return /*#__PURE__*/React.createElement(InputDate$1, Object.assign({}, props, {
    yearOnly: true
  }));
}

let _$2 = t => t,
    _t$1;
const override = css(_t$1 || (_t$1 = _$2`
   position: absolute;
   top: 50%;
   left: 50%;
   margin-top: -25px;
   margin-left: -50px;
`));

function Loading$1() {
  return /*#__PURE__*/React.createElement(PuffLoader, {
    color: "#000",
    css: override,
    size: 50
  });
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = data => {
      this.props.setInput(this.props.name, data.hex);
      this.props.setParameter('selected_' + this.props.name, data);
    };

    this.toggle = () => {
      this.setState({
        open: !this.state.open
      });
    };

    this.state = {
      open: false
    };
  }

  componentDidMount() {
    try {
      this.props.setInput(this.props.name, this.props.parameter['selected_' + this.props.name].hex);
    } catch (e) {}
  }

  render() {
    let val = '';

    try {
      val = findArrayName(this.props.name, this.props.input) || '';
    } catch (e) {}
    return /*#__PURE__*/React.createElement(React.Fragment, null, this.state.open ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        zIndex: 999
      }
    }, /*#__PURE__*/React.createElement(SketchPicker, {
      color: val,
      onChangeComplete: this.handleInputChange
    }), /*#__PURE__*/React.createElement(Button$1, {
      style: {
        marginTop: 10,
        backgroundColor: val,
        border: 0
      },
      className: "btn btn-primary",
      onClick: this.toggle,
      type: "button"
    }, "Pilih")) : /*#__PURE__*/React.createElement(Button$1, {
      style: {
        zIndex: 0,
        backgroundColor: val,
        border: 0
      },
      className: "btn btn-primary",
      onClick: this.toggle,
      type: "button"
    }, "Pilih"));
  }

}

const mapStateToProps$8 = state => ({
  input: state.core.input || {},
  parameter: state.core.parameter || {}
});

const mapDispatchToProps$8 = dispatch => ({
  setInput: (key, val) => dispatch({
    type: 'SET_INPUT',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  }),
  setParameter: (key, val) => dispatch({
    type: 'SET_PARAMETER',
    payload: {
      key: slug(String(key), '_'),
      value: val
    }
  })
});

var InputColor = connect(mapStateToProps$8, mapDispatchToProps$8)(Main);

function ShowData(props) {
  let [val, setVal] = useState({});
  let [loading, setLoading] = useState(false);
  let {
    isMultiple,
    defaultValue,
    optionLabel,
    separator,
    primaryKey,
    id,
    param
  } = props;
  let props_name = slug(props.name, '_');
  let key_select = slug('selected_' + props_name, '_');
  let dispatch = useDispatch();
  let auth = useSelector(state => state.auth) || {};
  let input = useSelector(state => state.core.input) || {};
  let filter$1 = useSelector(state => state.core.filter) || {};
  let parameter = useSelector(state => state.core.parameter) || {};

  function labelGenerate(option) {
    if (isArray(optionLabel)) {
      let label = [];
      separator = separator || ' | ';

      for (let i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]]);
        }
      }

      return label.join(separator);
    } else {
      return option[optionLabel] ? option[optionLabel] : '';
    }
  }

  useEffect(() => {
    let url = process.env.REACT_APP_API_URL + '/' + props.url;
    let {
      keyword
    } = defaultFilterData(filter$1, [], props_name);
    let data = secureData({
      selected: [id],
      keyword,
      load: 1,
      page: 1,
      ...param
    });
    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    };
    setLoading(true);
    axios(options).then(resp => {
      setVal(resp.data.data.data[0]);
      setLoading(false);
    }).catch(error => {
      setLoading(false);
    });
  }, [id]);

  function deleteData(d) {
    setVal(null);

    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let val = props.optionValue[key];
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: val,
            value: null
          }
        });
      });
    }

    if (isMultiple) {
      let new_input = filter(findArrayName(props_name, input), function (o) {
        return o != d;
      });

      let new_input_key = filter(findArrayName(key_select, input), function (o) {
        return o != d;
      });

      let new_parameter = filter(findArrayName(key_select, parameter), function (o) {
        return o[primaryKey] != d;
      });

      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: props_name,
          value: new_input
        }
      });
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: new_input_key
        }
      });
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value: new_parameter
        }
      });
    } else {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: props_name,
          value: null
        }
      });
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: null
        }
      });
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value: {}
        }
      });
    }
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, val && !isUndefined(val) && !isEmpty(val) ? [labelGenerate(val), !props.isReadonly && /*#__PURE__*/React.createElement(Button$1, {
    variant: "link",
    size: "sm",
    onClick: deleteData.bind(null, val[primaryKey]),
    style: {
      borderRadius: 100
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    size: "sm",
    color: "#db2828",
    icon: faTimes
  }))] : loading ? /*#__PURE__*/React.createElement(Loading, null) : '');
}

function InputSelectFetch(props) {
  let {
    isMultiple,
    defaultValue,
    optionLabel,
    separator
  } = props;
  let dispatch = useDispatch();
  let auth = useSelector(state => state.auth) || {};
  let input = useSelector(state => state.core.input) || {};
  let filter$1 = useSelector(state => state.core.filter) || {};
  let parameter = useSelector(state => state.core.parameter) || {};
  let [visible, setVisible] = useState(false);
  let [show, setShow] = useState(false);
  let [loading, setLoading] = useState(false);
  let [listLoading, setListLoading] = useState(false);
  let [localParameter, setLocalParameter] = useState({});
  let [value, setValue] = useState(isMultiple ? [] : {});
  let [last, setLast] = useState(0);
  let [open, setOpen] = useState(false);
  let [currentPage, setCurrentPage] = useState(1);
  let props_name = slug(props.name, '_');
  let key_select = slug('selected_' + props_name, '_');
  let [label, setLabel] = useState(props.label ? props.label : findArrayName(props_name, input));
  let nodeRef = useRef();
  let isVisible = useIsVisible(nodeRef);
  let [data, setData] = useState([]);
  let [meta, setMeta] = useState({});
  let primaryKey = props.primaryKey ? props.primaryKey : 'id';

  function labelGenerate(option) {
    let label = [];
    separator = separator || ' | ';

    if (isArray(optionLabel)) {
      for (let i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]]);
        }
      }

      return label.join(separator);
    } else {
      return option[optionLabel] ? option[optionLabel] : '';
    }
  }

  function onChecked(rowInfo, local_input, exist = false) {
    let _value = rowInfo.row.original || {};

    if (!isMultiple) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: _value[primaryKey]
        }
      });
    } else {
      let new_input = [];

      let _local_input = findArrayName(key_select, local_input);

      if (exist) {
        new_input = filter(_local_input, o => {
          return o && _value && String(o) != String(_value[primaryKey]);
        }) || [];
      } else {
        new_input = _local_input || [];

        if (!isArray(new_input)) {
          new_input = [];
        }

        if (_value[primaryKey]) {
          new_input.push(_value[primaryKey]);
        }
      }

      new_input = uniq(new_input);
      new_input = filter(new_input, o => {
        return !isNull(o) && !isUndefined(o);
      }) || [];
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: new_input
        }
      });
    }
  }

  let checkComponent = {
    Header: '#',
    id: props_name + '_check',
    Cell: row => {
      let local_input = useSelector(state => state.core.input);
      let checked = false;
      let val = findArrayName(key_select, local_input);

      try {
        if (!isMultiple) {
          checked = val === row.row.original[primaryKey];
        } else {
          checked = findIndex(val, function (o) {
            return o === row.row.original[primaryKey];
          }) > -1;
        }
      } catch (e) {}

      if (!row.row.original[primaryKey]) {
        return null;
      }

      return /*#__PURE__*/React.createElement(Form.Group, null, /*#__PURE__*/React.createElement(Form.Label, null, /*#__PURE__*/React.createElement(Form.Check, {
        id: slug(props_name + '_check_' + row.row.original[primaryKey], '_'),
        name: slug(props_name + '_check_' + row.row.original[primaryKey], '_'),
        style: {
          zIndex: 100
        },
        type: !isMultiple ? 'radio' : 'checkbox',
        value: 1,
        checked: checked,
        disabled: props.isReadonly,
        onChange: () => onChecked(row, local_input, checked)
      })));
    }
  };
  let _columns = [{
    Header: 'Keterangan',
    id: 'label',
    accessor: d => labelGenerate(d)
  }];
  let col = [checkComponent, ..._columns];

  function onReload() {
    if (open) {
      loadOptions();
    }
  }

  useDebounce(syncParameter, 500, [findArrayName(key_select, input)]);
  useDebounce(onReload, 500, [findArrayName('keyword_' + props_name, filter$1), findArrayName('page_' + props_name, filter$1), findArrayName('load_' + props_name, filter$1)]);

  function syncParameter() {
    if (!isMultiple) {
      let new_input = findArrayName(key_select, input) || null;

      if (new_input) {
        let url = process.env.REACT_APP_API_URL + '/' + props.url;
        let {
          page,
          load,
          keyword
        } = defaultFilterData(filter$1, [], props_name);
        let data = secureData({
          selected: [new_input],
          keyword,
          load: 1,
          page: 1,
          ...props.parameter
        });
        let options = {
          method: 'POST',
          headers: setAuthHeader(auth),
          url,
          data
        };
        setLoading(true);
        axios(options).then(resp => {
          let new_parameter = resp.data.data.data[0] || {};
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: key_select,
              value: new_parameter
            }
          });
          handleInputChange(new_parameter);
          setLoading(false);
        }).catch(error => {
          setLoading(false);
        });
      } else {
        dispatch({
          type: 'SET_PARAMETER',
          payload: {
            key: key_select,
            value: null
          }
        });
      }
    } else {
      let new_input = filter(findArrayName(key_select, input), function (o) {
        return !isNull(o) && !isUndefined(o);
      }) || [];

      if (new_input.length > 0) {
        let url = process.env.REACT_APP_API_URL + '/' + props.url;
        let {
          keyword
        } = defaultFilterData(filter$1, [], props_name);
        let data = secureData({
          selected: new_input,
          keyword,
          load: new_input.length,
          page: 1,
          ...props.parameter
        });
        let options = {
          method: 'POST',
          headers: setAuthHeader(auth),
          url,
          data
        };
        setLoading(true);
        axios(options).then(resp => {
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: key_select,
              value: resp.data.data.data
            }
          });
          handleInputChange(resp.data.data.data);
          setLoading(false);
        }).catch(error => {
          setLoading(false);
        });
      } else {
        dispatch({
          type: 'SET_PARAMETER',
          payload: {
            key: key_select,
            value: null
          }
        });
      }
    }
  }

  let columns = React.useMemo(() => col, []);
  useEffect(() => {
    if (!isEqual(props.parameter, localParameter)) {
      setLocalParameter(props.parameter);
      onReload();
    }

    if (isVisible != visible) {
      setVisible(isVisible);
    }
  });

  function openModal() {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        key: slug('page_' + props_name, '_'),
        value: 1
      }
    });
    setOpen(data => !data);
    loadOptions();
  }

  function closeModal() {
    setOpen(false);
  }

  function reloader() {
    if (visible) {
      let val = null;

      try {
        if (isMultiple) {
          val = map(defaultValue, 'value');
          val = filter(val, o => {
            return o;
          }) || [];
        } else {
          val = defaultValue.value || null;
        }
      } catch (e) {}

      let _input = findArrayName(key_select, input) || null;

      if (!isEqual(val, _input)) {
        if (isNull(val) && !isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: _input
            }
          });
        } else if (!isNull(val) && isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: val
            }
          });
        } else if (!isNull(val) && !isNull(_input)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: val
            }
          });
        } else {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: null
            }
          });
        }
      }
    }
  }

  useEffect(reloader, [visible]);
  useEffect(() => {
    let val = null;

    try {
      if (isMultiple) {
        val = filter(map(defaultValue, 'value'), o => {
          return o;
        }) || null;
      } else {
        val = defaultValue.value || null;
      }
    } catch (e) {}

    if (val) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: val
        }
      });
    }
  }, []);

  function loadOptions() {
    let url = process.env.REACT_APP_API_URL + '/' + props.url;
    let {
      page,
      load,
      keyword,
      sorted,
      search
    } = defaultFilterData(filter$1, [], props_name);
    let data = secureData({
      page,
      load,
      keyword,
      sorted,
      search,
      ...props.parameter
    });
    let options = {
      method: 'POST',
      headers: setAuthHeader(auth),
      url,
      data
    };
    setListLoading(true);
    return axios(options).then(resp => {
      let responseJSON = resp.data || {};

      if (typeof responseJSON.data.data !== 'undefined') {
        setLast(responseJSON.data.meta.last_page);

        try {
          setData(responseJSON.data.data || []);
        } catch (e) {}

        try {
          setMeta(responseJSON.data.meta || {});
        } catch (e) {}
      } else if (typeof responseJSON.data !== 'undefined') {
        setLast(responseJSON.meta.last_page);

        try {
          setData(responseJSON.data || []);
        } catch (e) {}

        try {
          setMeta(responseJSON.meta || {});
        } catch (e) {}
      }

      setListLoading(false);
    }).catch(error => {
      setListLoading(false);
    });
  }

  function generateInputMultiple(event) {
    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let k = props.optionValue[key];
        let v = null;

        if (event) {
          try {
            v = uniq(map(event, key));
          } catch (e) {}
        }

        if (!isEqual(findArrayName(k, input), v)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: k,
              value: v
            }
          });
        }
      });
    } else {
      let k = props_name;
      let v = null;

      if (event) {
        v = uniq(map(event, primaryKey));
      }

      if (!isEqual(findArrayName(k, input), v)) {
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: k,
            value: v
          }
        });
      }
    }
  }

  function generateInput(event) {
    if (isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        let k = props.optionValue[key];
        let v = null;

        if (event) {
          try {
            v = event[key];
          } catch (e) {}
        }

        if (!isEqual(findArrayName(k, input), v)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: k,
              value: v
            }
          });
        }
      });
    } else {
      let k = props_name;
      let v = null;

      if (event) {
        v = event[primaryKey];
      }

      if (!isEqual(findArrayName(k, input), v)) {
        dispatch({
          type: 'SET_INPUT',
          payload: {
            key: k,
            value: v
          }
        });
      }
    }
  }

  function handleInputChange(event) {
    if (isMultiple) {
      generateInputMultiple(event);
    } else {
      generateInput(event);
    }
  }

  let isi = [];

  let _input = findArrayName(key_select, input);

  try {
    if (isMultiple) {
      isi = isArray(_input) ? _input : [];
    } else {
      isi = _input ? [_input] : [];
    }
  } catch (e) {}

  let _parameter = findArrayName(key_select, parameter);

  let isi_param = null;

  try {
    if (isMultiple) {
      isi_param = isArray(_parameter) ? _parameter : [];
    } else {
      isi_param = isObject(_parameter) ? _parameter : {};
    }
  } catch (e) {}

  return /*#__PURE__*/React.createElement("div", {
    ref: nodeRef
  }, /*#__PURE__*/React.createElement(Row$1, null, !props.isReadonly && /*#__PURE__*/React.createElement(Col$1, {
    lg: "1",
    md: "1",
    sm: "4",
    xs: "12"
  }, /*#__PURE__*/React.createElement(Button$1, {
    size: "sm",
    variant: "primary",
    type: "button",
    className: "btn-icon",
    onClick: openModal
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSearch
  }))), /*#__PURE__*/React.createElement(Col$1, {
    lg: "11",
    md: "11",
    sm: "8",
    xs: "12"
  }, loading ? /*#__PURE__*/React.createElement(Loading, null) : isi.map((val, index) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ShowData, {
      isReadonly: props.isReadonly,
      name: props_name,
      optionLabel: optionLabel,
      separator: separator,
      param: props.parameter,
      url: props.url,
      primaryKey: primaryKey,
      isMultiple: isMultiple,
      id: val
    }), props.isReadonly ? isi.length - 1 == index ? null : ', ' : null);
  }))), /*#__PURE__*/React.createElement(Modal$1, {
    size: "lg",
    show: open,
    onHide: closeModal
  }, /*#__PURE__*/React.createElement(Modal$1.Header, {
    onHide: closeModal,
    closeButton: true
  }, /*#__PURE__*/React.createElement(Modal$1.Title, null, props.placeholder || 'Pilih')), /*#__PURE__*/React.createElement(Modal$1.Body, null, /*#__PURE__*/React.createElement(MyLoadingOvelay, {
    isLoading: listLoading
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputGroup, {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSearch
  })), /*#__PURE__*/React.createElement(Form.Control, {
    style: {
      borderLeft: 'none'
    },
    className: "form-control",
    value: findArrayName('keyword_' + props_name, filter$1),
    onChange: e => {
      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: {
          ['keyword_' + props_name]: e.target.value,
          ['page_' + props_name]: 1
        }
      });
    },
    type: "text",
    id: 'search_' + key_select,
    name: "search",
    placeholder: "Pencarian"
  }), /*#__PURE__*/React.createElement(Button$1, {
    style: {
      zIndex: 0
    },
    variant: "primary",
    onClick: onReload,
    type: "button",
    disabled: props.isLoading
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSync,
    spin: props.isLoading
  }))), !listLoading && /*#__PURE__*/React.createElement(DataTableContainer, {
    name: props_name,
    columns: columns,
    data: data,
    primaryKey: primaryKey,
    isColumnsSearchable: true,
    fetchData: onReload,
    loading: listLoading,
    customPageTotal: meta && !isEmpty(meta) ? meta.total : 0,
    customPageCount: meta && !isEmpty(meta) ? meta.last_page : 1,
    customPageSize: meta && !isEmpty(meta) ? meta.per_page : filter$1['load_' + props_name] ? filter$1['load_' + props_name] : 5,
    customPageIndex: meta && !isEmpty(meta) ? meta.current_page : filter$1['page_' + props_name] ? filter$1['page_' + props_name] : 1
  }))), !listLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("p", null, "Dipilih : "), loading && /*#__PURE__*/React.createElement(Loading, null), /*#__PURE__*/React.createElement("ul", null, isMultiple ? isi_param && isi_param.map((val, index) => {
    return /*#__PURE__*/React.createElement("li", null, !isUndefined(val) && !isEmpty(val) ? labelGenerate(val) : '');
  }) : isi_param && /*#__PURE__*/React.createElement("li", null, !isUndefined(isi_param) && !isEmpty(isi_param) ? labelGenerate(isi_param) : ''))))));
}

export { DataTable, DataTableContainer, Field, InputChoose$1 as InputChoose, InputColor, InputDate$1 as InputDate, InputDateTime$1 as InputDateTime, InputFile, InputNumber$1 as InputNumber, InputSelect$1 as InputSelect, InputSelectFetch, InputTag$1 as InputTag, InputText$1 as InputText, InputTime$1 as InputTime, InputWorkflow, InputYear, Loading, MyLoadingOvelay as LoadingOverlay, Loading$1 as LoadingPage };
//# sourceMappingURL=index.modern.js.map
