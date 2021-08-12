function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Cleave = _interopDefault(require('cleave.js/react'));
var lodash = require('lodash');
var reactRedux = require('react-redux');
var PhoneInput = _interopDefault(require('react-phone-number-input'));
var JoditEditor = _interopDefault(require('jodit-react'));
var Mousetrap = _interopDefault(require('mousetrap'));
var tcomponent = require('tcomponent');
var parse = _interopDefault(require('html-react-parser'));
var reactBootstrap = require('react-bootstrap');
require('@wiris/mathtype-generic');
var ContentEditable = _interopDefault(require('react-contenteditable'));
var axios = _interopDefault(require('axios'));
var DropzoneComponent = _interopDefault(require('react-dropzone-component'));
var videoReact = require('video-react');
var moment$1 = require('moment');
var moment$1__default = _interopDefault(moment$1);
var reactFontawesome = require('@fortawesome/react-fontawesome');
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var PuffLoader = _interopDefault(require('react-spinners/PuffLoader'));
var DatePicker = _interopDefault(require('react-datepicker'));
var freeRegularSvgIcons = require('@fortawesome/free-regular-svg-icons');
var InputRange = _interopDefault(require('react-input-range'));
var LoadingOverlay = _interopDefault(require('react-loading-overlay'));
var styled = _interopDefault(require('styled-components'));
var reactIsVisible = require('react-is-visible');
var reactTable = require('react-table');
var TimePicker = _interopDefault(require('rc-time-picker'));
var ReactTags = _interopDefault(require('react-tag-autocomplete'));
var Select = _interopDefault(require('react-select'));
var react = require('@emotion/react');
var reactColor = require('react-color');
require('react-phone-number-input/style.css');
require('bootstrap/dist/css/bootstrap.min.css');
require('dropzone/dist/min/dropzone.min.css');
require('video-react/dist/video-react.css');
require('rc-time-picker/assets/index.css');
require('react-datepicker/dist/react-datepicker.css');
require('react-input-range/lib/css/index.css');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var WirisEquationEditor = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(WirisEquationEditor, _React$Component);

  function WirisEquationEditor(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleEquationChange = function (event) {
      var onEquationInput = _this.props.onEquationInput;
      var mathFormat = window.WirisPlugin.Parser.endParse(event.target.value);
      var equationImage = event.target.value;
      onEquationInput(equationImage, mathFormat);
    };

    _this.equationEditorRef = React__default.createRef();
    _this.toolbarRef = React__default.createRef();
    return _this;
  }

  var _proto = WirisEquationEditor.prototype;

  _proto.componentDidMount = function componentDidMount() {

    try {
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = this.equationEditorRef.current;
      genericIntegrationProperties.toolbar = this.toolbarRef.current;
      var genericIntegrationInstance = new window.WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    } catch (e) {}
  };

  _proto.render = function render() {
    var _ref = this.props || {},
        value = _ref.value;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      ref: this.toolbarRef
    }), /*#__PURE__*/React__default.createElement(ContentEditable, {
      suppressContentEditableWarning: true,
      className: "equationContainer",
      innerRef: this.equationEditorRef,
      onChange: this.handleEquationChange,
      html: value || ''
    }));
  };

  return WirisEquationEditor;
}(React__default.Component);

var InputText = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(InputText, _React$Component2);

  function InputText(props) {
    var _this2;

    _this2 = _React$Component2.call(this, props) || this;

    _this2.handleInputChange = function (event) {
      event.preventDefault();
      var data = event.target.value ? String(event.target.value) : '';

      if (_this2.state.type == 'nik' || _this2.state.type == 'kip' || _this2.state.type == 'npwp' || _this2.state.type == 'postcode') {
        data = data.replace(/\D/g, '');
      }

      if (_this2.props.maxlength) {
        data = data.substring(0, _this2.props.maxlength);
      }

      _this2.setState({
        value: data
      });

      _this2.props.setInput(_this2.state.props_name, data);
    };

    _this2.onChange = function (data) {
      _this2.setState({
        value: data
      });

      _this2.props.setInput(_this2.state.props_name, data);
    };

    var default_placeholder = _this2.props.placeholder;
    var options_cleave = {};
    var type = _this2.props.type ? String(_this2.props.type) : '';

    if (type.toLowerCase() == 'nik') {
      options_cleave = {
        delimiter: ' ',
        blocks: [2, 2, 2, 6, 4],
        numericOnly: true
      };
      default_placeholder = _this2.props.placeholder || 'Nomor Induk Kependudukan';
    } else if (type.toLowerCase() == 'kip') {
      options_cleave = {
        delimiter: ' ',
        blocks: [4, 4, 4, 4]
      };
      default_placeholder = _this2.props.placeholder || 'Kartu Indonesia Pintar';
    } else if (type.toLowerCase() == 'npwp') {
      options_cleave = {
        delimiters: ['.', '.', '.', '-', '.'],
        blocks: [2, 3, 3, 1, 3, 3],
        numericOnly: true
      };
      default_placeholder = _this2.props.placeholder || 'Nomor Pokok Wajib Pajak';
    } else if (type.toLowerCase() == 'postcode') {
      options_cleave = {
        blocks: [5],
        delimiter: ' ',
        numericOnly: true
      };
      default_placeholder = _this2.props.placeholder || 'Kode Pos';
    } else if (type.toLowerCase() == 'phone') {
      default_placeholder = _this2.props.placeholder || 'Telepon';
    }

    _this2.state = {
      type: type,
      placeholder: default_placeholder,
      options_cleave: options_cleave,
      value: _this2.props.value ? String(_this2.props.value) : '',
      props_name: _this2.props.name ? tcomponent.slug(String(_this2.props.name), '_') : '',
      config: {
        readonly: false,
        toolbarButtonSize: 'small'
      }
    };
    _this2.toolbarRef = React__default.createRef();
    _this2.editorRef = React__default.createRef();
    return _this2;
  }

  var _proto2 = InputText.prototype;

  _proto2.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    try {
      if (!lodash.isEqual(tcomponent.findArrayName(this.state.props_name, this.props.input), tcomponent.findArrayName(this.state.props_name, prevProps.input)) && !lodash.isEqual(this.state.value, tcomponent.findArrayName(this.state.props_name, this.props.input))) {
        var value = this.props.input[this.state.props_name] || '';
        this.setState({
          value: value
        });
      }
    } catch (e) {}

    if (this.props.value && prevProps.value != this.props.value) {
      var _value = this.props.value || '';

      this.setState({
        value: _value
      });
    }
  };

  _proto2.componentDidMount = function componentDidMount() {
    if (this.props.disableCopy || this.props.disablePaste || this.props.disableSelectAll) {
      var comb = [];

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

    var value = '';

    try {
      var input_name = tcomponent.findArrayName(this.state.props_name, this.props.input);
      value = this.props.value ? this.props.value : input_name;
    } catch (e) {}

    this.setState({
      value: value
    });
  };

  _proto2.render = function render() {
    if (!this.state.props_name) return 'Name is Required';

    if (this.props.disabled || this.props.isReadonly) {
      return !lodash.isEmpty(this.state.value) && parse(String(this.state.value));
    } else if (this.state.type == 'nik' || this.state.type == 'kip' || this.state.type == 'npwp' || this.state.type == 'postcode') {
      return /*#__PURE__*/React__default.createElement(Cleave, {
        placeholder: this.state.placeholder,
        id: this.props.id,
        name: this.state.props_name,
        value: this.state.value,
        onChange: this.handleInputChange,
        options: this.state.options_cleave,
        className: "form-control"
      });
    } else if (this.state.type == 'textarea') {
      return /*#__PURE__*/React__default.createElement("textarea", {
        id: this.props.id,
        rows: this.props.rows || 3,
        className: "form-control no-resize mousetrap",
        onChange: this.handleInputChange,
        name: this.state.props_name,
        value: this.state.value,
        placeholder: this.props.placeholder
      });
    } else if (this.state.type == 'phone') {
      return /*#__PURE__*/React__default.createElement(PhoneInput, {
        international: true,
        defaultCountry: "ID",
        value: this.state.value ? String(this.state.value) : '',
        onChange: this.onChange
      });
    } else if (this.state.type == 'texteditor') {
      return /*#__PURE__*/React__default.createElement(JoditEditor, {
        key: this.props.name + '_editor',
        id: this.props.id,
        ref: this.editorRef,
        value: !lodash.isEmpty(this.state.value) ? String(this.state.value) : '',
        config: this.state.config,
        tabIndex: 1,
        onChange: this.onChange
      });
    } else if (this.state.type == 'equation') {
      return /*#__PURE__*/React__default.createElement("div", {
        id: this.props.id,
        ref: this.toolbarRef
      }, /*#__PURE__*/React__default.createElement(WirisEquationEditor, {
        id: this.props.id,
        onEquationInput: this.onChange,
        toolbarRef: this.toolbarRef,
        value: this.state.value
      }));
    }

    var defaultType = this.state.type === 'text' || lodash.isUndefined(this.state.type) ? 'search' : this.state.type;
    return /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
      id: this.props.id,
      type: defaultType,
      placeholder: this.state.placeholder,
      value: this.state.value,
      onChange: this.handleInputChange,
      name: this.state.props_name,
      className: "form-control mousetrap"
    });
  };

  return InputText;
}(React__default.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputText$1 = reactRedux.connect(mapStateToProps, mapDispatchToProps)(InputText);

function Loading() {
  return /*#__PURE__*/React__default.createElement(PuffLoader, {
    color: '#000',
    size: 25
  });
}

var moment = moment$1;

function Preview(props) {
  try {
    if (lodash.isEqual(props.type.type.substring(0, 5), 'image')) {
      return /*#__PURE__*/React__default.createElement("img", {
        key: props.file,
        className: "img-responsive",
        style: {
          maxWidth: '100%'
        },
        src: process.env.REACT_APP_API_URL + '/file/stream/' + props.file
      });
    } else if (lodash.isEqual(props.type.type.substring(0, 5), 'video')) {
      return /*#__PURE__*/React__default.createElement(videoReact.Player, {
        key: props.file,
        autoPlay: false,
        src: process.env.REACT_APP_API_URL + '/file/stream/' + props.file
      });
    } else if (lodash.isEqual(props.type.type, 'application/pdf')) {
      return /*#__PURE__*/React__default.createElement("iframe", {
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
  var acceptedFiles = props.accept ? props.accept : 'image/*, video/*, audio/*, .docx, .xlsx, .pptx, .csv, .pdf';
  var input = reactRedux.useSelector(function (state) {
    return state.core.input;
  });
  var parameter = reactRedux.useSelector(function (state) {
    return state.core.parameter;
  });

  var _useState = React.useState({}),
      type = _useState[0],
      setType = _useState[1];

  var _useState2 = React.useState([]),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = React.useState(false),
      loading = _useState3[0],
      setLoading = _useState3[1];

  var auth = reactRedux.useSelector(function (state) {
    return state.auth;
  });
  var dispatch = reactRedux.useDispatch();

  function onDelete(val) {
    var url = process.env.REACT_APP_API_URL + '/file/delete';
    var data = tcomponent.secureData({
      token_file: val,
      token: auth.token
    });
    var options = {
      method: 'POST',
      headers: tcomponent.setAuthHeader(auth),
      url: url,
      data: data
    };
    setLoading(true);
    axios(options).then(function (response) {
      if (!lodash.isEmpty(response.data.message)) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: response.data.message
        });
      }

      var isi = lodash.filter(value, function (o) {
        return !lodash.isEqual(o, val);
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
    })["catch"](function (error) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Gagal menghapus lampiran'
      });
      var isi = lodash.filter(value, function (o) {
        return !lodash.isEqual(o, val);
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
    if (lodash.isString(token) && !lodash.isEmpty(token) && token != 'null' && lodash.isEmpty(type[token])) {
      var url = process.env.REACT_APP_API_URL + '/file/info';
      var data = tcomponent.secureData({
        token_file: token
      });
      var options = {
        method: 'POST',
        headers: tcomponent.setAuthHeader(auth),
        url: url,
        data: data
      };
      setLoading(true);
      axios(options).then(function (response) {
        if (response.data.success) {
          type[token] = response.data.data;
          setType(type);
          open[token] = false;
          setOpen(open);
        }

        setLoading(false);
      })["catch"](function (error) {
        type[token] = '';
        setType(type);
        open[token] = false;
        setOpen(open);
      });
    }
  }

  function reloadType(t) {
    try {
      if (lodash.isArray(t) && t.length > 0) {
        for (var i = 0; i < t.length; i++) {
          var kondisi = cekValidFile(t[i]);

          if (kondisi) {
            fetchInfo(t[i]);
          }
        }
      } else {
        var _kondisi = cekValidFile(t);

        if (_kondisi) {
          fetchInfo(t);
        }
      }
    } catch (e) {}
  }

  function cekValidFile(h) {
    return lodash.isString(h) && !lodash.isEmpty(h) && h != 'null';
  }

  function setValid(u) {
    return lodash.filter(u, cekValidFile) || [];
  }

  function setIsinya(d) {
    var i = String(d).split('|');
    return setValid(i);
  }

  React.useEffect(function () {
    var x = props.value ? props.value : tcomponent.findArrayName(props.name, input);

    if (x) {
      var cek = setIsinya(x);
      setValue(cek);
    }
  }, []);
  React.useEffect(function () {
    var cek = setIsinya(tcomponent.findArrayName(props.name, input));

    if (!lodash.isEqual(cek, value)) {
      setValue(cek);
    }
  }, [tcomponent.findArrayName(props.name, input)]);
  React.useEffect(function () {
    reloadType(value);
  }, [value]);
  React.useEffect(function () {
    openFile(loading);
  }, [loading]);

  function toggle(val) {
    var _extends2;

    setOpen(_extends({}, open, (_extends2 = {}, _extends2[val] = !open[val], _extends2)));
  }

  function fileUpload(file, base64) {
    var url = props.url || process.env.REACT_APP_API_URL + '/file/upload';

    var _data = new FormData();

    var _name = file.name;
    var _type = file.type;

    _data.append('type', _type);

    _data.append('name', _name);

    _data.append('file', file);

    _data.append('lastModifiedDate', moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'));

    _data.append('size', file.size);

    setLoading(true);
    axios.post(url, _data, {
      headers: tcomponent.setAuthHeader(auth, "multipart/form-data; boundary=" + _data._boundary)
    }).then(function (response) {
      if (!lodash.isEmpty(response.data.message)) {
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
    })["catch"](function (error) {
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
    var reader = new FileReader();

    reader.onload = function (e) {
      fileUpload(file);
    };

    reader.readAsDataURL(file);
  }

  function onChangeMultiple(file) {
    var isi = JSON.parse(file.xhr.response);
    var current = value || [];
    current.push(isi.data.token);
    var t = lodash.filter(current, function (o) {
      return !lodash.isEmpty(o);
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
    setTimeout(function () {
      openFile(false);
    }, 60000);
  }

  function onChange(e) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createfile(files[0]);
  }

  function onDrop() {}

  var _useState4 = React.useState({}),
      open = _useState4[0],
      setOpen = _useState4[1];

  var terisi = setValid(value);

  if (!process.env.REACT_APP_API_URL) {
    return /*#__PURE__*/React__default.createElement("span", null, "REACT_APP_API_URL is required for .env");
  }

  return /*#__PURE__*/React__default.createElement("div", null, !loading && !props.isReadonly && /*#__PURE__*/React__default.createElement("div", null, !props.isMultiple && /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
    className: props.className,
    accept: acceptedFiles,
    label: props.name,
    type: "file",
    onChange: onChange,
    onInput: onInput,
    onClick: onClick
  })), !loading && props.isMultiple && /*#__PURE__*/React__default.createElement(DropzoneComponent, {
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
      acceptedFiles: acceptedFiles,
      params: {
        token: auth.user.token
      },
      addRemoveLinks: true,
      autoProcessQueue: true,
      maxFiles: 5
    }
  })), !loading && terisi.length > 0 && terisi.map(function (val, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      style: {
        display: 'inline-block'
      },
      key: val
    }, props.preview && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Preview, {
      key: val,
      type: type[val],
      file: val
    }), /*#__PURE__*/React__default.createElement("br", null)), /*#__PURE__*/React__default.createElement(reactBootstrap.ButtonGroup, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
      variant: "primary",
      size: "sm",
      onClick: function onClick() {
        return toggle(val);
      }
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faSearch
    }), " Lihat"), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
      vendor: "success",
      onClick: function onClick() {
        return window.location.href = process.env.REACT_APP_API_URL + '/file/download/' + val;
      },
      size: "sm"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faDownload
    }), " Unduh"), !props.isReadonly && /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
      variant: "danger",
      onClick: function onClick() {
        return onDelete(val);
      },
      size: "sm"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faTimes
    }), " Hapus")), /*#__PURE__*/React__default.createElement(reactBootstrap.Modal, {
      size: "lg",
      id: 'modal_' + val,
      show: open[val],
      onHide: function onHide() {
        return toggle(val);
      }
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Header, {
      closeButton: true,
      onHide: function onHide() {
        return toggle(val);
      }
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Title, null, "Lampiran ", val)), /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Body, null, /*#__PURE__*/React__default.createElement(Preview, {
      key: val,
      type: type[val],
      file: val
    }))));
  }), loading && /*#__PURE__*/React__default.createElement(Loading, null));
}

var InputChoose = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputChoose, _React$Component);

  function InputChoose(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.labelGenerate = function (option) {
      var label = [];

      if (lodash.isArray(_this.props.optionLabel)) {

        for (var i = 0; i <= _this.props.optionLabel.length - 1; i++) {
          var isi = option[_this.props.optionLabel[i]];
          label.push(isi);
        }
      } else {
        label.push(option[_this.props.optionLabel]);
      }

      return label;
    };

    _this.onChange = function (selectedOption) {
      if (!_this.props.isReadonly && _this.props.name) {
        try {
          if (_this.props.isMultiple) {
            var current_val = _this.state.defaultValue || [];
            var removed = false;
            var new_val = [];

            for (var i = 0; i < current_val.length; i++) {
              var isi = current_val[i];

              if (isi == selectedOption[_this.props.optionValue]) {
                removed = true;
              } else {
                new_val.push(isi);
              }
            }

            if (!removed) {
              new_val.push(selectedOption[_this.props.optionValue]);
            }

            _this.props.setInput(_this.props.name, new_val);
          } else {
            var val = tcomponent.findArrayName(_this.props.name, _this.props.input) || null;

            if (_this.props.value) {
              val = _this.props.value;
            }

            var _new_val = null;

            if (val != selectedOption[_this.props.optionValue]) {
              _new_val = selectedOption[_this.props.optionValue];
            }

            _this.props.setInput(_this.props.name, _new_val);
          }
        } catch (e) {
          _this.props.setInput(_this.props.name, null);
        }
      }

      _this.onRefresh();
    };

    _this.state = {
      defaultValue: null,
      type: _this.props.type || 'inline'
    };
    _this.onRefresh = lodash.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputChoose.prototype;

  _proto.onRefresh = function onRefresh() {
    var val = null;
    var defaultValue = null;

    if (this.props.value) {
      val = this.props.value;
    } else {
      val = tcomponent.findArrayName(this.props.name, this.props.input) || null;
    }

    if (!lodash.isNull(val)) {
      if (this.props.isMultiple) {
        defaultValue = [];

        for (var i = 0; i < this.props.options.length; i++) {
          for (var y = 0; y < val.length; y++) {
            var opt = this.props.options[i];
            var cur = val[y];

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt[this.props.optionValue]);
            }
          }
        }
      } else {
        defaultValue = lodash.find(this.props.options, function (o) {
          return String(o[this.props.optionValue]) == String(val);
        }.bind(this));
      }
    }

    defaultValue = !lodash.isUndefined(defaultValue) && !lodash.isNull(defaultValue) ? defaultValue : null;
    this.setState({
      defaultValue: defaultValue
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!lodash.isEqual(tcomponent.findArrayName(this.props.name, prevProps.input), tcomponent.findArrayName(this.props.name, this.props.input)) && !lodash.isEqual(this.state.defaultValue, tcomponent.findArrayName(this.props.name, this.props.input))) {
      this.onRefresh();
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.onRefresh();
  };

  _proto.render = function render() {
    var _this2 = this;

    var options = [];

    try {
      options = this.props.options.length > 0 ? this.props.options : [];
    } catch (e) {}

    return /*#__PURE__*/React__default.createElement("div", {
      className: "custom-controls-stacked"
    }, options.map(function (value) {
      var isChecked = false;

      try {
        if (_this2.props.isMultiple) {
          isChecked = lodash.includes(_this2.state.defaultValue, value[_this2.props.optionValue]);
        } else {
          isChecked = lodash.isEqual(value[_this2.props.optionValue], _this2.state.defaultValue[_this2.props.optionValue]);
        }
      } catch (e) {}

      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
        inline: _this2.state.type == 'inline',
        disabled: _this2.props.disabled || _this2.props.isReadonly,
        type: _this2.props.isMultiple ? 'checkbox' : 'radio',
        name: _this2.props.name,
        onChange: _this2.onChange.bind(_this2, value),
        value: value,
        checked: isChecked,
        label: _this2.labelGenerate(value).map(function (val, i) {
          if (lodash.isEqual(String(val).substring(0, 3), 'AT-')) {
            return /*#__PURE__*/React__default.createElement(InputFile, {
              value: val,
              isReadonly: true,
              preview: true
            });
          } else {
            return _this2.props.isHtml ? parse(String(val)) : val;
          }
        })
      }));
    }));
  };

  return InputChoose;
}(React__default.Component);

var mapStateToProps$1 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$1 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key)),
          value: val
        }
      });
    }
  };
};

var InputChoose$1 = reactRedux.connect(mapStateToProps$1, mapDispatchToProps$1)(InputChoose);

var CustomInput = function CustomInput(props) {
  return /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, {
    size: "sm"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    size: "sm",
    icon: freeRegularSvgIcons.faCalendar
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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

var InputDate = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputDate, _React$Component);

  function InputDate(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleInputChange = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD') : null;

      _this.props.setInput(_this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeStart = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD') : null;

      _this.props.setInput('start_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeEnd = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD') : null;

      _this.props.setInput('end_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.checkTglMerah = function (date) {
      var x = moment$1__default(date).format('d');
      return x == 0 || x == 6 ? 'tglmerah' : undefined;
    };

    _this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    _this.onRefresh = lodash.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputDate.prototype;

  _proto.onRefresh = function onRefresh() {
    if (this.props.isRange) {
      var start_selected = null;
      var end_selected = null;

      try {
        start_selected = this.props.start_selected ? moment$1__default(this.props.start_selected).toDate() : tcomponent.findArrayName('start_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('start_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment$1__default(this.props.end_selected).toDate() : tcomponent.findArrayName('end_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('end_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        start_selected: start_selected,
        end_selected: end_selected
      });
    } else {
      var selected = null;

      try {
        selected = this.props.selected ? moment$1__default(this.props.selected).toDate() : tcomponent.findArrayName(this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName(this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        selected: selected
      });
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.onRefresh();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && tcomponent.findArrayName(this.props.name, prevProps.input) != tcomponent.findArrayName(this.props.name, this.props.input) && tcomponent.findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('start_' + this.props.name, prevProps.input) != tcomponent.findArrayName('start_' + this.props.name, this.props.input) && tcomponent.findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('end_' + this.props.name, prevProps.input) != tcomponent.findArrayName('end_' + this.props.name, this.props.input) && tcomponent.findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  };

  _proto.render = function render() {
    var dateFormat = this.props.dateFormat ? this.props.dateFormat : this.props.yearOnly ? 'yyyy' : 'yyyy-MM-dd';

    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return (moment$1__default(this.state.start_selected).isValid() ? moment$1__default(this.state.start_selected).format('DD-MM-YYYY') : '') + ' - ' + (moment$1__default(this.state.end_selected).isValid() ? moment$1__default(this.state.end_selected).format('DD-MM-YYYY') : '');
      } else {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "input-daterange input-group"
        }, /*#__PURE__*/React__default.createElement(DatePicker, {
          minDate: this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
          maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
          dateFormat: dateFormat,
          placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
          selected: this.state.start_selected,
          isClearable: !this.props.disabled && !this.props.isReadonly,
          customInput: /*#__PURE__*/React__default.createElement(CustomInput, {
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
        }), /*#__PURE__*/React__default.createElement("span", {
          className: "input-group-addon",
          style: {
            background: 'none'
          }
        }, "\xA0 - \xA0"), /*#__PURE__*/React__default.createElement(DatePicker, {
          minDate: this.state.start_selected ? this.state.start_selected : this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
          maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
          dateFormat: dateFormat,
          placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
          selected: this.state.end_selected,
          isClearable: !this.props.disabled && !this.props.isReadonly,
          name: 'end_' + this.props.name,
          selectsEnd: true,
          customInput: /*#__PURE__*/React__default.createElement(CustomInput, {
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
      return moment$1__default(this.props.input[this.props.name]).isValid() ? moment$1__default(this.props.input[this.props.name]).format(this.props.yearOnly ? 'YYYY' : 'DD-MM-YYYY') : '';
    }

    return /*#__PURE__*/React__default.createElement(DatePicker, {
      minDate: this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
      maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
      dateFormat: dateFormat,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal',
      customInput: /*#__PURE__*/React__default.createElement(CustomInput, {
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
  };

  return InputDate;
}(React__default.Component);

var mapStateToProps$2 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$2 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputDate$1 = reactRedux.connect(mapStateToProps$2, mapDispatchToProps$2)(InputDate);

var InputNumber = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputNumber, _React$Component);

  function InputNumber(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleInputChange = function (event) {
      var val = null;

      if (_this.props.type == 'decimal') {
        val = Number(event.target.value.replace(/[^0-9.-]+/g, ''));
      } else if (_this.props.type == 'percent') {
        val = _this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 0, 100);
      } else if (_this.props.type == 'range_three') {
        val = _this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 1, 3);
      } else if (_this.props.type == 'range_hundred') {
        val = _this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 1, 100);
      } else if (_this.props.type == 'range_depend') {
        val = _this.validate_min_max(event.target.value.replace(/[^0-9.-]+/g, ''), 0, 100);
      } else {
        val = event.target.value.replace(/[^0-9.-]+/g, '');
      }

      var min = _this.props.minValue ? Number(_this.props.minValue) : null;
      var max = _this.props.maxValue ? Number(_this.props.maxValue) : null;

      if (max && min) {
        val = _this.validate_min_max(val, min, max);
      } else if (!max && min) {
        val = _this.validate_min_max(val, min, 999999999999);
      } else if (max && !min) {
        val = _this.validate_min_max(val, 0, max);
      }

      val = val ? val : 0;

      if (_this.state.props_name) {
        _this.props.setInput(_this.state.props_name, val);
      }

      var rawValue = event.target.rawValue || null;

      if (!isNaN(parseFloat(rawValue)) && !isNaN(parseFloat(val)) && parseFloat(rawValue) !== parseFloat(val)) {
        _this.state.event.setRawValue(val);
      }
    };

    _this.onChange = function (val) {
      _this.setState({
        value: val
      });

      if (_this.state.props_name) {
        _this.props.setInput(_this.state.props_name, val);
      }
    };

    _this.onRefresh = function () {
      var val = '';

      try {
        var input_name = tcomponent.findArrayName(_this.state.props_name, _this.props.input);
        val = _this.props.value ? _this.props.value : input_name;
      } catch (e) {}

      var min = _this.props.minValue ? Number(_this.props.minValue) : null;
      var max = _this.props.maxValue ? Number(_this.props.maxValue) : null;
      var value = val ? parseInt(val) : min;

      if (_this.props.type == 'decimal') {
        value = val ? parseFloat(val) : min;
      } else if (_this.props.type == 'percent' || _this.props.type == 'range_three' || max || min) {
        value = val ? parseFloat(val) : min;
      }

      if (isNaN(value)) {
        value = min;
      }

      _this.setState({
        value: value
      });

      try {
        var rawValue = _this.state.event.lastInputValue || null;

        if (parseFloat(rawValue) !== parseFloat(value)) {
          _this.state.event.setRawValue(value);
        }
      } catch (e) {}
    };
    _this.state = {
      defaultValue: null,
      options: {
        numeral: true
      },
      event: null,
      value: null,
      props_name: tcomponent.slug(_this.props.name, '_')
    };
    _this.onRefresh = lodash.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputNumber.prototype;

  _proto.validate_min_max = function validate_min_max(val, min, max) {
    if (min === void 0) {
      min = 0;
    }

    if (max === void 0) {
      max = 100;
    }

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
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
    if (!lodash.isEqual(tcomponent.findArrayName(this.state.props_name, prevProps.input), tcomponent.findArrayName(this.state.props_name, this.props.input)) && !lodash.isEqual(this.state.value, tcomponent.findArrayName(this.state.props_name, this.props.input))) {
      this.setState({
        rawValue: tcomponent.findArrayName(this.state.props_name, this.props.input) || null,
        value: tcomponent.findArrayName(this.state.props_name, this.props.input) || null
      });
      this.onRefresh();
    }

    if (this.props.value && prevProps.value != this.props.value && this.props.value != this.state.value) {
      var value = this.props.value || null;
      this.setState({
        rawValue: value,
        value: value
      });
      this.onRefresh();
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    var options = {
      numeral: true,
      numeralPositiveOnly: true
    };

    if (this.props.type == 'decimal' || this.props.type == 'percent' || this.props.type == 'range_three') ; else {
      options.numeralThousandsGroupStyle = 'thousand';
    }

    this.setState({
      options: options,
      rawValue: tcomponent.findArrayName(this.state.props_name, this.props.input),
      value: tcomponent.findArrayName(this.state.props_name, this.props.input)
    });
    this.onRefresh();
  };

  _proto.onInit = function onInit(cleave) {
    this.setState({
      event: cleave
    });
  };

  _proto.render = function render() {
    if (this.props.disabled || this.props.isReadonly) {
      return !lodash.isNull(this.state.value) && !lodash.isUndefined(this.state.value) ? tcomponent.numberFormat(this.state.value, '') : null;
    }

    if (this.props.type == 'range') {
      return /*#__PURE__*/React__default.createElement(InputRange, {
        maxValue: this.props.maxValue,
        minValue: this.props.minValue,
        value: this.state.value,
        onChange: this.onChange
      });
    }

    return /*#__PURE__*/React__default.createElement(Cleave, {
      placeholder: this.props.placeholder ? this.props.placeholder : '',
      id: this.state.props_name,
      name: this.state.props_name,
      onInit: this.onInit.bind(this),
      value: this.state.value,
      onChange: this.handleInputChange,
      options: this.state.options,
      className: "form-control"
    });
  };

  return InputNumber;
}(React__default.Component);

var mapStateToProps$3 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$3 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputNumber$1 = reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3)(InputNumber);

var _templateObject;
var StyledLoader = styled(LoadingOverlay)(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  overflow: hidden;\n\n  ._loading_overlay_overlay {\n    background: rgba(255, 255, 255, 0.5);\n  }\n  &._loading_overlay_wrapper--active {\n    overflow: hidden;\n  }\n"])));

function MyLoadingOvelay(props) {
  return /*#__PURE__*/React__default.createElement(StyledLoader, {
    fadeSpeed: 250,
    active: props.isLoading,
    spinner: /*#__PURE__*/React__default.createElement(Loading, null)
  }, props.children);
}

var Filter = function Filter(_ref) {
  var column = _ref.column;
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      margin: '4px 0'
    }
  }, column.canFilter && column.render('Filter'));
};
var DefaultColumnFilter = function DefaultColumnFilter(props) {
  var filterValue = props.column.filterValue;
  var id = props.column.id;
  var name = props.name;
  var dispatch = reactRedux.useDispatch();

  var _React$useState = React__default.useState(filterValue),
      data = _React$useState[0],
      setData = _React$useState[1];

  var key = tcomponent.slug('search_' + name + '_' + id, '_');
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  });
  React.useEffect(function () {
    setData(filter[key]);
  }, []);

  function onChange(e) {
    var _payload;

    e.preventDefault();
    setData(e.target.value);
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: (_payload = {}, _payload[key] = e.target.value, _payload[tcomponent.slug('loaded_' + name, '_')] = false, _payload)
    });
  }

  return /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
    key: key,
    id: key,
    name: key,
    value: data,
    onChange: onChange,
    placeholder: "Pencarian"
  });
};

function DataTableContainer(_ref2) {
  var columns = _ref2.columns,
      data = _ref2.data,
      renderRowSubComponent = _ref2.renderRowSubComponent,
      customPageIndex = _ref2.customPageIndex,
      customPageSize = _ref2.customPageSize,
      customPageCount = _ref2.customPageCount,
      loading = _ref2.loading,
      isColumnsSearchable = _ref2.isColumnsSearchable,
      primaryKey = _ref2.primaryKey,
      name = _ref2.name,
      customPageTotal = _ref2.customPageTotal;
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  }) || {};
  var sortBy = [];

  for (var i = 0; i < columns.length; i++) {
    try {
      var k = tcomponent.slug('sort_' + name + '_' + columns[i][primaryKey], '_');
      var urut = filter[k];

      if (!lodash.isEmpty(urut) && !lodash.isNull(urut) && !lodash.isUndefined(urut)) {
        sortBy.push({
          id: columns[i][primaryKey],
          desc: urut == 'desc'
        });
      }
    } catch (e) {}
  }

  var _useTable = reactTable.useTable({
    columns: columns,
    data: data,
    defaultColumn: {
      Filter: function Filter(props) {
        return /*#__PURE__*/React__default.createElement(DefaultColumnFilter, _extends({}, props, {
          name: name
        }));
      }
    },
    initialState: {
      pageIndex: customPageIndex,
      pageSize: customPageSize,
      sortBy: sortBy
    },
    manualPagination: true,
    pageCount: customPageCount,
    manualSortBy: true,
    defaultCanSort: true,
    isMultiSortEvent: function isMultiSortEvent() {}
  }, reactTable.useFilters, reactTable.useSortBy, reactTable.useExpanded, reactTable.usePagination),
      getTableProps = _useTable.getTableProps,
      getTableBodyProps = _useTable.getTableBodyProps,
      headerGroups = _useTable.headerGroups,
      page = _useTable.page,
      prepareRow = _useTable.prepareRow,
      visibleColumns = _useTable.visibleColumns,
      gotoPage = _useTable.gotoPage,
      setPageSize = _useTable.setPageSize,
      _useTable$state = _useTable.state,
      pageIndex = _useTable$state.pageIndex,
      pageSize = _useTable$state.pageSize;

  var headers = headerGroups[0].headers || [];
  tcomponent.useDebounce(function () {
    var sort = {};

    for (var _i = 0; _i < headers.length; _i++) {
      var x = headers[_i];

      if (x) {
        var mykey = tcomponent.slug('sort_' + name + '_' + x[primaryKey], '_');
        var mysort = x.isSorted ? x.isSortedDesc ? 'desc' : 'asc' : null;

        if (mysort != filter[mykey]) {
          sort[mykey] = mysort;
        }
      }
    }

    if (!lodash.isEmpty(sort)) {
      var _extends2;

      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: _extends({}, sort, (_extends2 = {}, _extends2[tcomponent.slug('loaded_' + name, '_')] = false, _extends2))
      });
    }
  }, 1000, [headers]);

  var _useState = React.useState(loading),
      localLoading = _useState[0],
      setLocalLoading = _useState[1];

  var _useState2 = React.useState(pageIndex),
      curpage = _useState2[0],
      setCurPage = _useState2[1];

  var dispatch = reactRedux.useDispatch();

  var generateSortingIndicator = function generateSortingIndicator(column) {
    return column.isSorted ? column.isSortedDesc ? ' ↓' : ' ↑' : '';
  };

  var onChangeInSelect = function onChangeInSelect(event) {
    var _payload2;

    setPageSize(Number(event.target.value));
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: (_payload2 = {}, _payload2[tcomponent.slug('load_' + name, '_')] = Number(event.target.value), _payload2[tcomponent.slug('page_' + name, '_')] = curpage, _payload2)
    });
  };

  var onChangeInInput = function onChangeInInput(event) {
    var page = event.target.value ? Number(event.target.value) : 0;
    customgotoPage(page);
  };

  var customcanNextPage = customPageIndex < customPageCount;
  var customcanPreviousPage = customPageIndex >= 2;

  var customnextPage = function customnextPage() {
    customgotoPage(curpage + 1);
  };

  var custompreviousPage = function custompreviousPage() {
    customgotoPage(curpage - 1);
  };

  var customgotoPage = function customgotoPage(isi) {
    setCurPage(isi);
  };

  tcomponent.useDebounce(function () {
    var _payload3;

    gotoPage(curpage);
    dispatch({
      type: 'SET_MULTI_FILTER',
      payload: (_payload3 = {}, _payload3[tcomponent.slug('load_' + name, '_')] = pageSize, _payload3[tcomponent.slug('page_' + name, '_')] = curpage, _payload3)
    });
  }, 1000, [curpage]);
  React.useEffect(function () {
    if (setLocalLoading && !loading) {
      setTimeout(function () {
        return setLocalLoading(loading);
      }, 1000);
    } else {
      setLocalLoading(loading);
    }
  }, [loading]);

  if (lodash.isEmpty(name)) {
    return /*#__PURE__*/React__default.createElement("p", null, "Props name is Required");
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "custom-scroll",
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: function onClick() {
      return customgotoPage(1);
    },
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleDoubleLeft
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: custompreviousPage,
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleLeft
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeRegularSvgIcons.faFile
  }), " \xA0 Hal :", ' '), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faColumns
  }), " \xA0 Lihat :", ' '), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: customnextPage,
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleRight
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: function onClick() {
      return customgotoPage(customPageCount);
    },
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleDoubleRight
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "text-center mt-2 mb-2"
  }, /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageIndex, '')), " dari", ' ', /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageCount, '')), " hal. Total", ' : ', /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageTotal, '')), " hal"), /*#__PURE__*/React__default.createElement(reactBootstrap.Table, _extends({
    style: {
      margin: 0,
      zIndex: 0
    },
    responsive: true,
    bordered: true,
    hover: true,
    striped: true,
    vcenter: true
  }, getTableProps()), /*#__PURE__*/React__default.createElement("thead", null, headerGroups.map(function (headerGroup) {
    return /*#__PURE__*/React__default.createElement("tr", headerGroup.getHeaderGroupProps(), headerGroup.headers.map(function (column) {
      return /*#__PURE__*/React__default.createElement("th", _extends({
        style: {
          padding: '4px 8px',
          borderTop: '1px solid #dee2e6'
        }
      }, column.getHeaderProps()), /*#__PURE__*/React__default.createElement("div", column.getSortByToggleProps(), /*#__PURE__*/React__default.createElement("span", {
        style: {
          display: 'inline-block'
        }
      }, column.render('Header')), /*#__PURE__*/React__default.createElement("span", {
        style: {
          display: 'inline-block',
          fontWeight: 'bold'
        }
      }, generateSortingIndicator(column))), isColumnsSearchable && /*#__PURE__*/React__default.createElement(Filter, {
        column: column
      }));
    }));
  })), /*#__PURE__*/React__default.createElement("tbody", getTableBodyProps(), page.length > 0 && !localLoading ? page.map(function (row) {
    prepareRow(row);
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: row.getRowProps().key
    }, /*#__PURE__*/React__default.createElement("tr", null, row.cells.map(function (cell, index) {
      return /*#__PURE__*/React__default.createElement("td", _extends({
        style: {
          padding: '4px 8px',
          width: index == 0 ? '10px' : 'auto'
        }
      }, cell.getCellProps()), cell.render('Cell'));
    })), row.isExpanded && /*#__PURE__*/React__default.createElement("tr", null, /*#__PURE__*/React__default.createElement("td", {
      style: {
        padding: '4px 8px'
      },
      colSpan: visibleColumns.length
    }, renderRowSubComponent(row))));
  }) : headerGroups.map(function (headerGroup) {
    return /*#__PURE__*/React__default.createElement("tr", null, /*#__PURE__*/React__default.createElement("td", {
      style: {
        padding: '12px 0',
        textAlign: 'center'
      },
      colSpan: headerGroup.headers.length
    }, localLoading ? 'Memproses...' : 'Tidak ada data'));
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "text-center mt-2 mb-2"
  }, /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageIndex, '')), " dari", ' ', /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageCount, '')), " hal. Total", ' : ', /*#__PURE__*/React__default.createElement("strong", null, tcomponent.numberFormat(customPageTotal, '')), " hal"), /*#__PURE__*/React__default.createElement("div", {
    className: "custom-scroll",
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: function onClick() {
      return customgotoPage(1);
    },
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleDoubleLeft
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: custompreviousPage,
    disabled: !customcanPreviousPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleLeft
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeRegularSvgIcons.faFile
  }), " \xA0 Hal :", ' '), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faColumns
  }), " \xA0 Lihat :", ' '), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "info",
    onClick: customnextPage,
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleRight
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      border: 'none'
    },
    variant: "primary",
    onClick: function onClick() {
      return customgotoPage(customPageCount);
    },
    disabled: !customcanNextPage || loading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAngleDoubleRight
  })))));
}

function DataTable(props) {
  var _React$createElement;

  var _useState = React.useState(false),
      visible = _useState[0],
      setVisible = _useState[1];

  var _useState2 = React.useState([]),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = React.useState([]),
      temp = _useState3[0],
      setTemp = _useState3[1];

  var _useState4 = React.useState({}),
      meta = _useState4[0],
      setMeta = _useState4[1];

  var _useState5 = React.useState(false),
      tooltipOpenEx = _useState5[0],
      setTooltipOpenEx = _useState5[1];

  var _useState6 = React.useState(false),
      tooltipOpenIm = _useState6[0],
      setTooltipOpenIm = _useState6[1];

  var toggleImport = function toggleImport() {
    return setTooltipOpenIm(!tooltipOpenIm);
  };

  var toggleExport = function toggleExport() {
    return setTooltipOpenEx(!tooltipOpenEx);
  };

  var dispatch = reactRedux.useDispatch();
  var parameter = reactRedux.useSelector(function (state) {
    return state.core.parameter;
  }) || {};
  var input = reactRedux.useSelector(function (state) {
    return state.core.input;
  }) || {};
  var user = reactRedux.useSelector(function (state) {
    return state.auth.user;
  }) || {};
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  }) || {};
  var key_select = tcomponent.slug('selected_' + props.name, '_');
  var primaryKey = props.primaryKey ? props.primaryKey : 'id';

  function onChecked(rowInfo, input, exist) {
    if (exist === void 0) {
      exist = false;
    }

    var value = rowInfo.row.original || {};

    if (props.selectable == 'single') {
      dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: key_select,
          value: value
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
      var new_input = [];

      if (exist) {
        new_input = lodash.filter(tcomponent.findArrayName(key_select, input), function (o) {
          return o && value && parseInt(o) != parseInt(value[primaryKey]);
        }) || [];
      } else {
        new_input = tcomponent.findArrayName(key_select, input) || [];

        if (!lodash.isArray(new_input)) {
          new_input = [];
        }

        new_input.push(value[primaryKey]);
      }

      new_input = lodash.uniq(new_input);
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: new_input
        }
      });
    }
  }

  var checkComponent = {
    Header: '#',
    id: 'select',
    width: '10px',
    Cell: function Cell(row) {
      var local_input = reactRedux.useSelector(function (state) {
        return state.core.input;
      });
      var checked = false;

      try {
        if (props.selectable == 'single') {
          checked = tcomponent.findArrayName(key_select, local_input) == row.row.original[primaryKey];
        } else {
          checked = lodash.findIndex(tcomponent.findArrayName(key_select, local_input), function (o) {
            return o == row.row.original[primaryKey];
          }) > -1;
        }
      } catch (e) {}

      return /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
        id: tcomponent.slug(props.name + '_check_' + row.row.original[primaryKey], '_'),
        name: tcomponent.slug(props.name + '_check_' + row.row.original[primaryKey], '_'),
        type: props.selectable == 'single' ? 'radio' : 'checkbox',
        value: 1,
        checked: checked,
        disabled: props.isReadonly,
        onChange: function onChange() {
          return onChecked(row, local_input, checked);
        }
      });
    }
  };
  var nodeRef = React.useRef();
  var isVisible = reactIsVisible.useIsVisible(nodeRef);
  var col = !lodash.isEmpty(props.selectable) ? [checkComponent].concat(props.columns) : [].concat(props.columns);

  if (props.action) {
    var actionComponent = {
      Header: 'Aksi',
      id: 'aksi_' + props.name,
      sortable: false,
      Cell: function Cell(row) {
        var param = reactRedux.useSelector(function (state) {
          return state.core.parameter;
        });
        var isi = row.row.original[primaryKey];

        function openToggle(data) {
          var current = lodash.isEqual(param.dropdown, data) ? null : data;
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: 'dropdown',
              value: current
            }
          });
        }

        return /*#__PURE__*/React__default.createElement(reactBootstrap.DropdownButton, {
          key: 'end',
          size: "sm",
          id: 'dropdown_' + props.name + '_' + isi,
          className: "custom-scroll",
          isOpen: lodash.isEqual(param.dropdown, isi),
          toggle: function toggle() {
            return openToggle(isi);
          },
          drop: 'end',
          variant: "primary",
          title: ''
        }, lodash.filter(props.action, function (o) {
          return lodash.isUndefined(o.show) || o.show;
        }).map(function (value, index) {
          var disabled = lodash.isBoolean(value.disabled) ? value.disabled : false;
          return /*#__PURE__*/React__default.createElement(reactBootstrap.Dropdown.Item, {
            key: 'dropdownitem_' + props.name + '_' + isi + '_' + index,
            onClick: function onClick() {
              return value.onClick(row.row.original);
            },
            disabled: disabled
          }, value.label);
        }));
      }
    };
    col = !lodash.isEmpty(props.selectable) ? [actionComponent, checkComponent].concat(props.columns) : [actionComponent].concat(props.columns);
  }

  React.useEffect(function () {
    if (isVisible != visible) {
      setVisible(isVisible);
    }
  });
  React.useEffect(function () {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        key: tcomponent.slug('loaded_' + props.name, '_'),
        value: false
      }
    });
  }, []);

  function onReload() {
    if (visible) {
      props.onReload();

      if (!tcomponent.findArrayName(tcomponent.slug('loaded_' + props.name, '_'), filter)) {
        dispatch({
          type: 'SET_FILTER',
          payload: {
            key: tcomponent.slug('loaded_' + props.name, '_'),
            value: true
          }
        });
      }
    }
  }

  tcomponent.useDebounce(function () {
    if (visible) {
      onReload();
    }
  }, 1000, [visible]);
  tcomponent.useDebounce(onReload, 1000, [tcomponent.findArrayName(tcomponent.slug('keyword_' + props.name, '_'), filter), tcomponent.findArrayName(tcomponent.slug('page_' + props.name, '_'), filter), tcomponent.findArrayName(tcomponent.slug('load_' + props.name, '_'), filter), tcomponent.findArrayName(tcomponent.slug('loaded_' + props.name, '_'), filter)]);

  function syncParameter() {
    var new_parameter = null;
    var new_input = null;

    if (props.selectable == 'single') {
      new_parameter = new_parameter = lodash.find(temp, function (o) {
        return o && parseInt(o[primaryKey]) == new_input;
      }) || {};
      new_input = tcomponent.findArrayName(key_select, input) || null;
    } else {
      new_parameter = [];
      new_input = tcomponent.findArrayName(key_select, input) || [];

      var _loop = function _loop(i) {
        var find_data = lodash.find(temp, function (o) {
          return o && parseInt(o[primaryKey]) == new_input[i];
        }) || {};

        if (!lodash.isEmpty(find_data)) {
          new_parameter.push(find_data);
        }
      };

      for (var i = 0; i < new_input.length; i++) {
        _loop(i);
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

  tcomponent.useDebounce(function () {
    setTemp(function (val) {
      return lodash.uniqBy([].concat(val, data), primaryKey);
    });

    if (tcomponent.findArrayName(key_select, input)) {
      syncParameter();
    }
  }, 1000, [tcomponent.findArrayName(key_select, input), filter]);
  tcomponent.useDebounce(function () {
    try {
      setData(props.data.data || []);
    } catch (e) {}

    setTemp(function (val) {
      return lodash.uniqBy([].concat(val, data), primaryKey);
    });

    try {
      setMeta(props.data.meta || {});
    } catch (e) {}
  }, 1000, [props.data]);
  var columns = React__default.useMemo(function () {
    return col;
  }, []);
  var hapus = false;

  try {
    hapus = user.role == 'admin';
  } catch (e) {}

  return /*#__PURE__*/React__default.createElement(MyLoadingOvelay, {
    isLoading: props.isLoading
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      padding: '8px 12px'
    },
    ref: nodeRef
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Row, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    xs: "12",
    sm: "12",
    md: "8",
    lg: "8"
  }, /*#__PURE__*/React__default.createElement("div", null, props.renderFilter ? props.renderFilter : null))), /*#__PURE__*/React__default.createElement(reactBootstrap.Row, {
    style: {
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    xs: "12",
    sm: "12",
    md: "4",
    lg: "4"
  }, /*#__PURE__*/React__default.createElement("div", null, props.isSearchable && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, null, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSearch
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, (_React$createElement = {
    id: tcomponent.slug('keyword_' + props.name, '_'),
    key: tcomponent.slug('keyword_' + props.name, '_'),
    style: {
      borderLeft: 'none'
    },
    className: "form-control",
    value: tcomponent.findArrayName(tcomponent.slug('keyword_' + props.name, '_'), filter),
    onChange: function onChange(e) {
      var _payload;

      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: (_payload = {}, _payload[tcomponent.slug('keyword_' + props.name, '_')] = e.target.value, _payload[tcomponent.slug('page_' + props.name, '_')] = 1, _payload.loaded = false, _payload)
      });
    },
    type: "text"
  }, _React$createElement["id"] = tcomponent.slug('keyword_' + key_select), _React$createElement.name = "keyword", _React$createElement.placeholder = "Pencarian", _React$createElement)), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      zIndex: 0
    },
    variant: "primary",
    onClick: onReload,
    type: "button",
    disabled: props.isLoading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSync,
    spin: props.isLoading
  })), (props["export"] || props["import"]) && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props["export"] && /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    id: "exportFile",
    style: {
      zIndex: 0
    },
    variant: "primary",
    className: "mr-1",
    onClick: props.exportReload,
    type: "button",
    disabled: props.disabledButton
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeRegularSvgIcons.faArrowAltCircleDown
  }), /*#__PURE__*/React__default.createElement(Tooltip, {
    placement: "top",
    isOpen: tooltipOpenEx,
    autohide: false,
    target: "exportFile",
    toggle: toggleExport
  }, "Export")), props["import"] && /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    id: "importFile",
    style: {
      zIndex: 0
    },
    variant: "primary",
    className: "mr-1",
    onClick: props.importReload,
    type: "button",
    disabled: props.disabledButton
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeRegularSvgIcons.faArrowAltCircleUp
  }), /*#__PURE__*/React__default.createElement(Tooltip, {
    placement: "top",
    isOpen: tooltipOpenIm,
    autohide: false,
    target: "importFile",
    toggle: toggleImport
  }, "Import"))))))))), /*#__PURE__*/React__default.createElement(DataTableContainer, {
    name: tcomponent.slug(props.name, '_'),
    columns: columns,
    data: data,
    primaryKey: primaryKey,
    isColumnsSearchable: props.isColumnsSearchable,
    fetchData: onReload,
    loading: props.isLoading,
    customPageTotal: meta && !lodash.isEmpty(meta) ? meta.total : 0,
    customPageCount: meta && !lodash.isEmpty(meta) ? meta.last_page : 1,
    customPageSize: meta && !lodash.isEmpty(meta) ? meta.per_page : tcomponent.findArrayName(tcomponent.slug('load_' + props.name, '_'), filter) ? tcomponent.findArrayName(tcomponent.slug('load_' + props.name, '_'), filter) : 10,
    customPageIndex: meta && !lodash.isEmpty(meta) ? meta.current_page : tcomponent.findArrayName(tcomponent.slug('page_' + props.name, '_'), filter) ? tcomponent.findArrayName(tcomponent.slug('page_' + props.name, '_'), filter) : 1
  })));
}

function Field(props) {
  var message = [];

  if (lodash.isArray(props.errorMessage)) {
    for (var i = 0; i < props.errorMessage.length; i++) {
      var isi = props.errorMessage[i];

      if (lodash.isArray(isi)) {
        for (var y = 0; y < isi.length; y++) {
          message.push(isi[y]);
        }
      } else {
        message.push(isi);
      }
    }
  } else {
    message.push(props.errorMessage);
  }

  return /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, {
    as: reactBootstrap.Row
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, {
    column: true,
    md: props.labelSize ? props.labelSize : 3
  }, props.label ? props.label : 'Label', props.isRequired && /*#__PURE__*/React__default.createElement("span", {
    className: "text-danger"
  }, "\xA0*"), props.hint && /*#__PURE__*/React__default.createElement("small", {
    className: "form-text text-muted"
  }, props.hint)), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    md: props.inputSize ? props.inputSize : 9
  }, props.children, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Text, {
    className: "text-danger"
  }, message.length > 0 && message.join(', '))));
}

var CustomInput$1 = function CustomInput(props) {
  return /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, {
    size: "sm"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    size: "sm",
    icon: freeRegularSvgIcons.faCalendar
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
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
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    size: "sm",
    icon: freeRegularSvgIcons.faClock
  })));
};

var InputDateTime = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputDateTime, _React$Component);

  function InputDateTime(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleInputChange = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD HH:mm:ss') : null;

      _this.props.setInput(_this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeStart = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD HH:mm:ss') : null;

      _this.props.setInput('start_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeEnd = function (data) {
      data = moment$1__default(data).isValid() ? moment$1__default(data).format('YYYY-MM-DD HH:mm:ss:ss') : null;

      _this.props.setInput('end_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.checkTglMerah = function (date) {
      var x = moment$1__default(date).format('d');
      return x == 5 || x == 6 ? 'tglmerah' : undefined;
    };

    _this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    _this.onRefresh = _.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputDateTime.prototype;

  _proto.onRefresh = function onRefresh() {
    if (this.props.isRange) {
      var start_selected = null;
      var end_selected = null;

      try {
        start_selected = this.props.start_selected ? moment$1__default(this.props.start_selected).toDate() : tcomponent.findArrayName('start_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('start_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment$1__default(this.props.end_selected).toDate() : tcomponent.findArrayName('end_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('end_' + this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        start_selected: start_selected,
        end_selected: end_selected
      });
    } else {
      var selected = null;

      try {
        selected = this.props.selected ? moment$1__default(this.props.selected).toDate() : tcomponent.findArrayName(this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName(this.props.name, this.props.input)).toDate() : null;
      } catch (e) {}

      this.setState({
        selected: selected
      });
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.onRefresh();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && tcomponent.findArrayName(this.props.name, prevProps.input) != tcomponent.findArrayName(this.props.name, this.props.input) && tcomponent.findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('start_' + this.props.name, prevProps.input) != tcomponent.findArrayName('start_' + this.props.name, this.props.input) && tcomponent.findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('end_' + this.props.name, prevProps.input) != tcomponent.findArrayName('end_' + this.props.name, this.props.input) && tcomponent.findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  };

  _proto.render = function render() {
    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "input-daterange input-group"
        }, moment$1__default(this.state.start_selected).isValid() ? moment$1__default(this.state.start_selected).format('DD-MM-YYYY HH:mm:ss') : null, /*#__PURE__*/React__default.createElement("span", {
          style: {
            background: 'none'
          }
        }, "\xA0 s/d \xA0"), moment$1__default(this.state.end_selected).isValid() ? moment$1__default(this.state.end_selected).format('DD-MM-YYYY HH:mm:ss') : null);
      }

      return /*#__PURE__*/React__default.createElement("div", {
        className: "input-daterange input-group",
        style: {
          background: 'none'
        }
      }, /*#__PURE__*/React__default.createElement(DatePicker, {
        minDate: this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
        maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
        dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
        placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
        selected: this.state.start_selected,
        isClearable: true,
        customInput: /*#__PURE__*/React__default.createElement(CustomInput$1, {
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
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "input-group-addon",
        style: {
          background: 'none'
        }
      }, "\xA0 - \xA0"), /*#__PURE__*/React__default.createElement(DatePicker, {
        minDate: this.state.start_selected ? this.state.start_selected : this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
        maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
        dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
        placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
        selected: this.state.end_selected,
        isClearable: true,
        name: 'end_' + this.props.name,
        selectsEnd: true,
        timeInputLabel: "Waktu : ",
        showTimeInput: true,
        customInput: /*#__PURE__*/React__default.createElement(CustomInput$1, {
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
      return /*#__PURE__*/React__default.createElement("div", {
        className: "input-daterange input-group"
      }, moment$1__default(this.state.selected).isValid() ? moment$1__default(this.state.selected).format('DD-MM-YYYY HH:mm:ss') : null);
    }

    return /*#__PURE__*/React__default.createElement(DatePicker, {
      minDate: this.props.minDate ? moment$1__default(this.props.minDate).toDate() : null,
      maxDate: this.props.maxDate ? moment$1__default(this.props.maxDate).toDate() : null,
      dateFormat: this.props.dateFormat ? this.props.dateFormat : 'yyyy-MM-dd HH:mm:ss',
      placeholder: this.props.placeholder ? this.props.placeholder : 'Tanggal & Waktu',
      selected: this.state.selected,
      isClearable: true,
      id: this.props.name,
      className: "form-control",
      customInput: /*#__PURE__*/React__default.createElement(CustomInput$1, {
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
  };

  return InputDateTime;
}(React__default.Component);

var mapStateToProps$4 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$4 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputDateTime$1 = reactRedux.connect(mapStateToProps$4, mapDispatchToProps$4)(InputDateTime);

var formattime = 'HH:mm:ss';
var now = moment$1__default();

function IconClock() {
  return /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    style: {
      position: 'absolute',
      left: 6,
      top: 6
    },
    icon: freeRegularSvgIcons.faClock,
    size: "sm"
  });
}

var InputTime = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputTime, _React$Component);

  function InputTime(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleInputChange = function (data) {
      data = data ? moment$1__default(data).format(formattime) : null;

      _this.props.setInput(_this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeStart = function (data) {
      data = data ? moment$1__default(data).format(formattime) : null;

      _this.props.setInput('start_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.handleInputChangeEnd = function (data) {
      data = data ? moment$1__default(data).format(formattime) : null;

      _this.props.setInput('end_' + _this.props.name, data);

      _this.onRefresh();
    };

    _this.state = {
      selected: null,
      start_selected: null,
      end_selected: null
    };
    _this.onRefresh = lodash.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputTime.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!this.props.isRange && tcomponent.findArrayName(this.props.name, prevProps.input) != tcomponent.findArrayName(this.props.name, this.props.input) && tcomponent.findArrayName(this.props.name, this.props.input) != this.state.selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('start_' + this.props.name, prevProps.input) != tcomponent.findArrayName('start_' + this.props.name, this.props.input) && tcomponent.findArrayName('start_' + this.props.name, this.props.input) != this.state.start_selected) {
      this.onRefresh();
    }

    if (this.props.isRange && tcomponent.findArrayName('end_' + this.props.name, prevProps.input) != tcomponent.findArrayName('end_' + this.props.name, this.props.input) && tcomponent.findArrayName('end_' + this.props.name, this.props.input) != this.state.end_selected) {
      this.onRefresh();
    }
  };

  _proto.onRefresh = function onRefresh() {
    if (this.props.isRange) {
      var start_selected = moment$1__default();
      var end_selected = moment$1__default();

      try {
        start_selected = this.props.start_selected ? moment$1__default(this.props.start_selected, formattime) : tcomponent.findArrayName('start_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('start_' + this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      try {
        end_selected = this.props.end_selected ? moment$1__default(this.props.end_selected, formattime) : tcomponent.findArrayName('end_' + this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName('end_' + this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      this.setState({
        start_selected: start_selected,
        end_selected: end_selected
      });
    } else {
      var selected = moment$1__default();

      try {
        selected = this.props.selected ? moment$1__default(this.props.selected, formattime) : tcomponent.findArrayName(this.props.name, this.props.input) ? moment$1__default(tcomponent.findArrayName(this.props.name, this.props.input), formattime) : null;
      } catch (e) {}

      this.setState({
        selected: selected
      });
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.onRefresh();
  };

  _proto.render = function render() {
    if (this.props.isRange) {
      if (this.props.disabled || this.props.isReadonly) {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "input-daterange input-group"
        }, moment$1__default(this.state.start_selected).isValid() ? moment$1__default(this.state.start_selected).format(formattime) : '', /*#__PURE__*/React__default.createElement("span", {
          style: {
            background: 'none'
          }
        }, "\xA0 s/d \xA0"), moment$1__default(this.state.end_selected).isValid() ? moment$1__default(this.state.end_selected).format(formattime) : '');
      }

      return /*#__PURE__*/React__default.createElement("div", {
        className: "input-daterange input-group"
      }, /*#__PURE__*/React__default.createElement(TimePicker, {
        value: this.state.start_selected,
        disabled: this.props.disabled || this.props.isReadonly,
        inputIcon: /*#__PURE__*/React__default.createElement(IconClock, null),
        format: formattime,
        onChange: this.handleInputChangeStart
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "input-group-addon",
        style: {
          background: 'none'
        }
      }, "\xA0 - \xA0"), /*#__PURE__*/React__default.createElement(TimePicker, {
        value: this.state.end_selected,
        disabled: this.props.disabled || this.props.isReadonly,
        inputIcon: /*#__PURE__*/React__default.createElement(IconClock, null),
        format: formattime,
        onChange: this.handleInputChangeEnd
      }));
    }

    if (this.props.disabled || this.props.isReadonly) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "input-daterange input-group"
      }, moment$1__default(this.state.selected).isValid() ? moment$1__default(this.state.selected).format(formattime) : '');
    }

    return /*#__PURE__*/React__default.createElement(TimePicker, {
      value: this.state.selected,
      disabled: this.props.disabled || this.props.isReadonly,
      inputIcon: /*#__PURE__*/React__default.createElement(IconClock, null),
      format: formattime,
      onChange: this.handleInputChange
    });
  };

  return InputTime;
}(React__default.Component);

var mapStateToProps$5 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$5 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputTime$1 = reactRedux.connect(mapStateToProps$5, mapDispatchToProps$5)(InputTime);

var InputTag = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputTag, _React$Component);

  function InputTag(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      tags: [],
      suggestions: [],
      separator: '|'
    };
    _this.reactTags = React__default.createRef();
    return _this;
  }

  var _proto = InputTag.prototype;

  _proto.onDelete = function onDelete(i) {
    var tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({
      tags: tags
    });

    if (this.props.name) {
      this.props.setInput(this.props.name, _.map(tags, 'name').join(this.state.separator));
    }
  };

  _proto.onAddition = function onAddition(tag) {
    var tags = [].concat(this.state.tags, tag);
    this.setState({
      tags: _.uniqBy(tags, 'name')
    });

    if (this.props.name) {
      this.props.setInput(this.props.name, _.map(tags, 'name').join(this.state.separator));
    }
  };

  _proto.onFocus = function onFocus(tag) {};

  _proto.onValidate = function onValidate(tag) {
    return _.findIndex(this.state.tags, ['name', tag.name]) < 0;
  };

  _proto.componentDidMount = function componentDidMount() {
    var suggestions = [];
    var tags = [];

    for (var i = 0; i < this.props.options.length; i++) {
      var isi = this.props.options[i];

      if (!_.isEmpty(isi[this.props.optionValue])) {
        suggestions.push({
          name: isi[this.props.optionValue]
        });
      }
    }

    var value = '';

    try {
      value = this.props.value ? this.props.value : this.props.input[this.props.name] ? this.props.input[this.props.name] : '';
    } catch (e) {}

    var v = value ? String(value).split(this.state.separator) : [];

    for (var _i = 0; _i < v.length; _i++) {
      var _isi = v[_i];

      if (!_.isEmpty(_isi)) {
        tags.push({
          name: _isi
        });
      }
    }

    this.setState({
      suggestions: suggestions,
      tags: tags
    });
  };

  _proto.render = function render() {
    return /*#__PURE__*/React__default.createElement(ReactTags, {
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
  };

  return InputTag;
}(React__default.Component);

var mapStateToProps$6 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$6 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputTag$1 = reactRedux.connect(mapStateToProps$6, mapDispatchToProps$6)(InputTag);

var InputSelect = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputSelect, _React$Component);

  function InputSelect(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.labelGenerate = function (option) {
      if (!lodash.isEmpty(option)) {
        if (lodash.isArray(_this.props.optionLabel)) {
          var label = [];
          var separator = _this.props.separator ? _this.props.separator : ' | ';

          for (var i = 0; i <= _this.props.optionLabel.length - 1; i++) {
            label.push(option[_this.props.optionLabel[i]]);
          }

          return label.join(separator);
        } else {
          return option[_this.props.optionLabel];
        }
      }

      return null;
    };

    _this.onChange = function (selectedOption) {
      if (_this.props.name) {
        try {
          if (_this.props.isMultiple) {
            _this.props.setInput(_this.props.name, lodash.map(selectedOption, _this.props.optionValue));
          } else {
            _this.props.setInput(_this.props.name, selectedOption[_this.props.optionValue]);
          }
        } catch (e) {
          _this.props.setInput(_this.props.name, null);
        }
      }

      _this.onRefresh();
    };

    _this.openModal = function () {
      _this.setState({
        show: !_this.state.show
      });
    };

    _this.state = {
      defaultValue: null,
      options: [],
      show: false
    };
    _this.onRefresh = lodash.debounce(_this.onRefresh.bind(_assertThisInitialized(_this)), 200);
    return _this;
  }

  var _proto = InputSelect.prototype;

  _proto.onRefresh = function onRefresh() {
    var val = null;
    var defaultValue = null;

    if (this.props.value) {
      val = this.props.value;
    } else {
      val = tcomponent.findArrayName(this.props.name, this.props.input) || [];

      if (this.props.isMultiple) {
        defaultValue = [];

        for (var i = 0; i < this.props.options.length; i++) {
          for (var y = 0; y < val.length; y++) {
            var opt = this.props.options[i];
            var cur = val[y];

            if (String(opt[this.props.optionValue]) == String(cur)) {
              defaultValue.push(opt);
            }
          }
        }
      } else {
        defaultValue = lodash.find(this.props.options, function (o) {
          return String(o[this.props.optionValue]) == val;
        }.bind(this));
      }
    }

    defaultValue = !lodash.isUndefined(defaultValue) && !lodash.isNull(defaultValue) ? defaultValue : null;
    this.setState({
      defaultValue: defaultValue
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!lodash.isEqual(tcomponent.findArrayName(this.props.name, prevProps.input), tcomponent.findArrayName(this.props.name, this.props.input)) && !lodash.isEqual(this.state.defaultValue, tcomponent.findArrayName(this.props.name, this.props.input))) {
      this.onRefresh();
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.onRefresh();
  };

  _proto.render = function render() {
    var _this2 = this;

    var options = [];

    try {
      for (var i = 0; i < this.props.options.length; i++) {
        var y = this.props.options[i];

        if (this.props.isHtml) {
          y[this.props.name] = parse(String(y[this.props.name]));
        }

        options.push(y);
      }
    } catch (e) {}

    if (this.props.disabled || this.props.isReadonly) {
      return this.labelGenerate(this.state.defaultValue);
    }

    if (this.props.withModal) return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Row, null, !this.props.isReadonly && /*#__PURE__*/React__default.createElement(Col, {
      lg: "1",
      md: "1",
      sm: "3",
      xs: "1"
    }, /*#__PURE__*/React__default.createElement(Button, {
      type: "button",
      className: "btn btn-icon btn-primary btn-sm",
      onClick: this.openModal
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      size: "sm",
      icon: freeSolidSvgIcons.faSearch
    }), " Pilih")), /*#__PURE__*/React__default.createElement(Col, {
      lg: "11",
      md: "11",
      sm: "9",
      xs: "11"
    }, this.state.defaultValue && !lodash.isUndefined(this.state.defaultValue) && !lodash.isEmpty(this.state.defaultValue) ? this.labelGenerate(this.state.defaultValue) : '')), /*#__PURE__*/React__default.createElement(Modal, {
      size: "lg",
      show: this.state.show,
      onHide: this.openModal
    }, /*#__PURE__*/React__default.createElement(ModalHeader, {
      closeButton: true,
      toggle: this.openModal
    }, /*#__PURE__*/React__default.createElement(Modal.Title, null, this.props.placeholder || 'Pilih')), /*#__PURE__*/React__default.createElement(ModalBody, null, /*#__PURE__*/React__default.createElement(Select, {
      isClearable: true,
      id: this.props.id ? this.props.id : this.props.name,
      isSearchable: true,
      isHtml: this.props.isHtml,
      isMulti: this.props.isMultiple,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Pilih',
      getOptionLabel: this.labelGenerate,
      getOptionValue: function getOptionValue(option) {
        return option[_this2.props.optionValue];
      },
      noOptionsMessage: function noOptionsMessage() {
        return 'Data tidak ditemukan';
      },
      value: this.state.defaultValue,
      onChange: this.onChange,
      options: options,
      isDisabled: this.props.disabled
    }))));
    return /*#__PURE__*/React__default.createElement(Select, {
      menuPortalTarget: document.body,
      menuPosition: "fixed",
      styles: {
        menuPortal: function menuPortal(base) {
          return _extends({}, base, {
            fontFamily: 'inherit',
            fontSize: 'inherit',
            zIndex: 9999
          });
        },
        menu: function menu(provided) {
          return _extends({}, provided, {
            fontFamily: 'inherit',
            fontSize: 'inherit',
            zIndex: '9999 !important'
          });
        },
        multiValueRemove: function multiValueRemove(base) {
          return _extends({}, base, {
            color: '#db2828',
            cursor: 'pointer'
          });
        },
        placeholder: function placeholder(base) {
          return _extends({}, base, {
            fontFamily: 'inherit',
            fontSize: 'inherit'
          });
        },
        multiValue: function multiValue(base) {
          return _extends({}, base, {
            background: 'none'
          });
        },
        multiValueLabel: function multiValueLabel(base) {
          return _extends({}, base, {
            fontFamily: 'inherit',
            fontSize: 'inherit'
          });
        },
        option: function option(base) {
          return _extends({}, base, {
            fontFamily: 'inherit',
            fontSize: 'inherit'
          });
        },
        clearIndicator: function clearIndicator(base, state) {
          return _extends({}, base, {
            cursor: 'pointer',
            color: state.isFocused ? '#db2828' : '#db2828'
          });
        }
      },
      className: "tcomponent-select",
      isClearable: true,
      id: this.props.id ? this.props.id : this.props.name,
      isSearchable: true,
      isHtml: this.props.isHtml,
      isMulti: this.props.isMultiple,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Pilih',
      getOptionLabel: this.labelGenerate,
      getOptionValue: function getOptionValue(option) {
        return option[_this2.props.optionValue];
      },
      noOptionsMessage: function noOptionsMessage() {
        return 'Data tidak ditemukan';
      },
      value: this.state.defaultValue,
      onChange: this.onChange,
      options: options,
      isDisabled: this.props.disabled
    });
  };

  return InputSelect;
}(React__default.Component);

var mapStateToProps$7 = function mapStateToProps(state) {
  return {
    input: state.core.input || {}
  };
};

var mapDispatchToProps$7 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputSelect$1 = reactRedux.connect(mapStateToProps$7, mapDispatchToProps$7)(InputSelect);

function InputWorkflow(props) {
  var _useState = React.useState(false),
      isDelay = _useState[0],
      setIsDelay = _useState[1];

  var _useState2 = React.useState(false),
      listLoading = _useState2[0],
      setListLoading = _useState2[1];

  var _useState3 = React.useState(false),
      submitLoading = _useState3[0],
      setSubmitLoading = _useState3[1];

  var _useState4 = React.useState(false),
      responseLoading = _useState4[0],
      setResponseLoading = _useState4[1];

  var auth = reactRedux.useSelector(function (state) {
    return state.auth;
  }) || {};
  var input = reactRedux.useSelector(function (state) {
    return state.core.input;
  }) || {};
  var validation = reactRedux.useSelector(function (state) {
    return state.core.validation;
  }) || [];
  var parameter = reactRedux.useSelector(function (state) {
    return state.core.parameter;
  }) || {};
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  }) || {};
  var dispatch = reactRedux.useDispatch();

  var _useState5 = React.useState({}),
      list = _useState5[0],
      setList = _useState5[1];

  var _useState6 = React.useState({
    activity: {},
    role: '',
    response: []
  }),
      activity = _useState6[0],
      setActivity = _useState6[1];

  var doAfterSubmit = props.doAfterSubmit,
      isLoading = props.isLoading,
      doSubmit = props.doSubmit,
      doCancel = props.doCancel,
      isReadonly = props.isReadonly,
      relation = props.relation,
      id = props.id,
      isDelete = props.isDelete;

  var _useState7 = React.useState(isReadonly),
      readonly = _useState7[0],
      setReadonly = _useState7[1];

  React.useEffect(function () {
    setReadonly(isReadonly);
  }, [isReadonly]);

  function submit(event) {
    if (!input.response_activity || lodash.isEmpty(input.response_activity)) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Respon wajib diisi'
      });
    } else {
      setSubmitLoading(true);
      setIsDelay(true);
      setTimeout(function () {
        return setIsDelay(false);
      }, 1000);
      doSubmit && doSubmit();
    }
  }

  React.useEffect(function () {
    reload_response();
  }, []);
  React.useEffect(function () {
    var allowed_role = [];

    try {
      allowed_role = activity.role.split(',');
    } catch (e) {}

    var user_role = [];

    try {
      user_role = auth.user.role.split(',');
    } catch (e) {}

    var is_allowed = false;
    var is_admin = false;

    for (var i = 0; i < user_role.length; i++) {
      if (!is_admin && user_role[i] && lodash.isEqual(String(user_role[i]).trim().toLowerCase(), 'admin')) {
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
      for (var _i = 0; _i < allowed_role.length; _i++) {
        for (var y = 0; y < user_role.length; y++) {
          if (allowed_role[_i] && user_role[y] && String(allowed_role[_i]).trim().toLowerCase() == String(user_role[y]).trim().toLowerCase() && !is_allowed) {
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

    var allowed = !lodash.isEmpty(activity.activity) && activity.response.length > 0 && is_allowed;

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
  React.useEffect(function () {
    if (submitLoading && !lodash.isEmpty(validation)) {
      setSubmitLoading(false);
    }
  }, [validation]);
  React.useEffect(function () {
    if (submitLoading && !isLoading && !isDelay) {
      setSubmitLoading(false);

      if (lodash.isEmpty(validation)) {
        doAfterSubmit && doAfterSubmit();
      }
    }
  }, [isDelay, validation, isLoading]);

  function cancel(event) {
    doCancel && doCancel();
  }

  function reload_response() {
    var url = process.env.REACT_APP_API_URL + '/komentar_respon?';
    var options = {
      data: tcomponent.secureData({
        relation: relation,
        id: id
      }),
      method: 'POST',
      headers: tcomponent.setAuthHeader(auth),
      url: url
    };
    setResponseLoading(true);
    axios(options).then(function (response) {
      var newactivity = response.data.data || {};

      if (isDelete) {
        newactivity.response = lodash.filter(newactivity.response, function (o) {
          return o.code == 'HAPUS';
        });
      }

      setActivity(newactivity);
      setResponseLoading(false);
    })["catch"](function (error) {
      tcomponent.fetchErrorDispatch(error, dispatch);
      setResponseLoading(false);
    });
  }

  function reload() {
    var url = process.env.REACT_APP_API_URL + '/komentar?';
    var columns = ['user', 'role', 'activity', 'comment', 'due_datetime', 'start_datetime', 'end_datetime'];
    var f = {};

    try {
      f = tcomponent.defaultFilterData(filter, columns, tcomponent.slug(props.relation, '_'));
    } catch (e) {}

    var isi = _extends({
      relation: relation,
      id: id
    }, f);

    var options = {
      data: tcomponent.secureData(isi),
      method: 'POST',
      headers: tcomponent.setAuthHeader(auth),
      url: url
    };
    setListLoading(true);
    axios(options).then(function (response) {
      setList(response.data.data);
      setListLoading(false);
    })["catch"](function (error) {
      tcomponent.fetchErrorDispatch(error, dispatch);
      setListLoading(false);
    });
  }

  if (responseLoading) return /*#__PURE__*/React__default.createElement(Loading, null);
  return /*#__PURE__*/React__default.createElement(MyLoadingOvelay, {
    isLoading: isLoading || submitLoading
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Card, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Card.Body, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Card.Title, {
    tag: "h5"
  }, activity.activity.name || 'Alur tidak ditemukan'), /*#__PURE__*/React__default.createElement(reactBootstrap.Card.Text, null, !readonly && /*#__PURE__*/React__default.createElement(reactBootstrap.Row, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "6"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, {
    as: reactBootstrap.Row
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "3"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, null, "Respon ", /*#__PURE__*/React__default.createElement("span", {
    className: "text-danger"
  }, "*"))), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "9"
  }, /*#__PURE__*/React__default.createElement(InputSelect$1, {
    name: "response_activity",
    options: activity.response,
    separator: " | ",
    optionLabel: ['name'],
    optionValue: "code"
  }))), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, {
    as: reactBootstrap.Row
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "3"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, null, "Lampiran")), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "5"
  }, /*#__PURE__*/React__default.createElement(InputFile, {
    value: input.attachment,
    name: "response_attachment",
    id: "response_attachment"
  })))), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "6"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, {
    as: reactBootstrap.Row
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "3",
    style: {
      marginBottom: 35
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, null, "Komentar")), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "9"
  }, /*#__PURE__*/React__default.createElement(InputText$1, {
    type: "textarea",
    required: true,
    name: "response_comment",
    id: "response_comment",
    rows: "3"
  }))))), /*#__PURE__*/React__default.createElement(DataTable, {
    data: list,
    isLoading: listLoading,
    name: tcomponent.slug(props.relation, '_'),
    primaryKey: "id",
    isSearchable: true,
    isColumnsSearchable: true,
    onReload: reload,
    columns: [{
      Header: 'Nama',
      id: 'user',
      accessor: function accessor(d) {
        return d.user;
      }
    }, {
      Header: 'Jabatan',
      id: 'role',
      accessor: function accessor(d) {
        return d.role;
      }
    }, {
      Header: 'Aktifitas',
      id: 'activity',
      accessor: function accessor(d) {
        return d.activity;
      }
    }, {
      Header: 'Respon',
      id: 'response',
      accessor: function accessor(d) {
        return d.response;
      }
    }, {
      Header: 'Komentar',
      id: 'comment',
      accessor: function accessor(d) {
        return d.comment;
      }
    }, {
      Header: 'Tenggat',
      id: 'due_datetime',
      accessor: function accessor(d) {
        return d.due_datetime && moment$1__default(d.due_datetime).format('DD-MM-YYYY HH:mm');
      }
    }, {
      Header: 'Mulai',
      id: 'start_datetime',
      accessor: function accessor(d) {
        return d.start_datetime && moment$1__default(d.start_datetime).format('DD-MM-YYYY HH:mm');
      }
    }, {
      Header: 'Selesai',
      id: 'end_datetime',
      accessor: function accessor(d) {
        return d.end_datetime && moment$1__default(d.end_datetime).format('DD-MM-YYYY HH:mm');
      }
    }, {
      Header: 'Lampiran',
      id: 'attachment',
      accessor: function accessor(d) {
        return /*#__PURE__*/React__default.createElement(InputFile, {
          value: d.attachment,
          isReadonly: true
        });
      }
    }]
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Row, {
    className: "mt-2"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Col, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    type: "button",
    className: "btn btn-icon btn-primary btn-sm float-left",
    onClick: cancel
  }, "Kembali"), !readonly && /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    type: "button",
    className: "btn btn-icon btn-primary btn-sm float-right",
    onClick: submit
  }, "Proses"))))));
}

function InputYear(props) {
  return /*#__PURE__*/React__default.createElement(InputDate$1, _extends({}, props, {
    yearOnly: true
  }));
}

var _templateObject$1;
var override = react.css(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteralLoose(["\n   position: absolute;\n   top: 50%;\n   left: 50%;\n   margin-top: -25px;\n   margin-left: -50px;\n"])));

function Loading$1() {
  return /*#__PURE__*/React__default.createElement(PuffLoader, {
    color: "#000",
    css: override,
    size: 50
  });
}

var Main = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Main, _React$Component);

  function Main(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleInputChange = function (data) {
      _this.props.setInput(_this.props.name, data.hex);

      _this.props.setParameter('selected_' + _this.props.name, data);
    };

    _this.toggle = function () {
      _this.setState({
        open: !_this.state.open
      });
    };

    _this.state = {
      open: false
    };
    return _this;
  }

  var _proto = Main.prototype;

  _proto.componentDidMount = function componentDidMount() {
    try {
      this.props.setInput(this.props.name, this.props.parameter['selected_' + this.props.name].hex);
    } catch (e) {}
  };

  _proto.render = function render() {
    var val = '';

    try {
      val = tcomponent.findArrayName(this.props.name, this.props.input) || '';
    } catch (e) {}
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, this.state.open ? /*#__PURE__*/React__default.createElement("div", {
      style: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        zIndex: 999
      }
    }, /*#__PURE__*/React__default.createElement(reactColor.SketchPicker, {
      color: val,
      onChangeComplete: this.handleInputChange
    }), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
      style: {
        marginTop: 10,
        backgroundColor: val,
        border: 0
      },
      className: "btn btn-primary",
      onClick: this.toggle,
      type: "button"
    }, "Pilih")) : /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
      style: {
        zIndex: 0,
        backgroundColor: val,
        border: 0
      },
      className: "btn btn-primary",
      onClick: this.toggle,
      type: "button"
    }, "Pilih"));
  };

  return Main;
}(React__default.Component);

var mapStateToProps$8 = function mapStateToProps(state) {
  return {
    input: state.core.input || {},
    parameter: state.core.parameter || {}
  };
};

var mapDispatchToProps$8 = function mapDispatchToProps(dispatch) {
  return {
    setInput: function setInput(key, val) {
      return dispatch({
        type: 'SET_INPUT',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    },
    setParameter: function setParameter(key, val) {
      return dispatch({
        type: 'SET_PARAMETER',
        payload: {
          key: tcomponent.slug(String(key), '_'),
          value: val
        }
      });
    }
  };
};

var InputColor = reactRedux.connect(mapStateToProps$8, mapDispatchToProps$8)(Main);

function ShowData(props) {
  var _useState = React.useState({}),
      val = _useState[0],
      setVal = _useState[1];

  var _useState2 = React.useState(false),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var isMultiple = props.isMultiple,
      optionLabel = props.optionLabel,
      separator = props.separator,
      primaryKey = props.primaryKey,
      id = props.id,
      param = props.param;
  var props_name = tcomponent.slug(props.name, '_');
  var key_select = tcomponent.slug('selected_' + props_name, '_');
  var dispatch = reactRedux.useDispatch();
  var auth = reactRedux.useSelector(function (state) {
    return state.auth;
  }) || {};
  var input = reactRedux.useSelector(function (state) {
    return state.core.input;
  }) || {};
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  }) || {};
  var parameter = reactRedux.useSelector(function (state) {
    return state.core.parameter;
  }) || {};

  function labelGenerate(option) {
    if (lodash.isArray(optionLabel)) {
      var label = [];
      separator = separator || ' | ';

      for (var i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !lodash.isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]]);
        }
      }

      return label.join(separator);
    } else {
      return option[optionLabel] ? option[optionLabel] : '';
    }
  }

  React.useEffect(function () {
    var url = process.env.REACT_APP_API_URL + '/' + props.url;

    var _defaultFilterData = tcomponent.defaultFilterData(filter, [], props_name),
        keyword = _defaultFilterData.keyword;

    var data = tcomponent.secureData(_extends({
      pkey: primaryKey,
      selected: [id],
      keyword: keyword,
      load: 1,
      page: 1
    }, param));
    var options = {
      method: 'POST',
      headers: tcomponent.setAuthHeader(auth),
      url: url,
      data: data
    };
    setLoading(true);
    axios(options).then(function (resp) {
      setVal(resp.data.data.data[0]);
      setLoading(false);
    })["catch"](function (error) {
      setLoading(false);
    });
  }, [id]);

  function deleteData(d) {
    setVal(null);

    if (lodash.isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        var val = props.optionValue[key];
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
      var new_input = lodash.filter(tcomponent.findArrayName(props_name, input), function (o) {
        return o != d;
      });

      var new_input_key = lodash.filter(tcomponent.findArrayName(key_select, input), function (o) {
        return o != d;
      });

      var new_parameter = lodash.filter(tcomponent.findArrayName(key_select, parameter), function (o) {
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

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, val && !lodash.isUndefined(val) && !lodash.isEmpty(val) ? [labelGenerate(val), !props.isReadonly && /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    variant: "link",
    size: "sm",
    onClick: deleteData.bind(null, val[primaryKey]),
    style: {
      borderRadius: 100
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    size: "sm",
    color: "#db2828",
    icon: freeSolidSvgIcons.faTimes
  }))] : loading ? /*#__PURE__*/React__default.createElement(Loading, null) : '');
}

function InputSelectFetch(props) {
  var isMultiple = props.isMultiple,
      defaultValue = props.defaultValue,
      optionLabel = props.optionLabel,
      separator = props.separator;
  var dispatch = reactRedux.useDispatch();
  var auth = reactRedux.useSelector(function (state) {
    return state.auth;
  }) || {};
  var input = reactRedux.useSelector(function (state) {
    return state.core.input;
  }) || {};
  var filter = reactRedux.useSelector(function (state) {
    return state.core.filter;
  }) || {};
  var parameter = reactRedux.useSelector(function (state) {
    return state.core.parameter;
  }) || {};

  var _useState3 = React.useState(false),
      visible = _useState3[0],
      setVisible = _useState3[1];

  var _useState4 = React.useState(false);

  var _useState5 = React.useState(false),
      loading = _useState5[0],
      setLoading = _useState5[1];

  var _useState6 = React.useState(false),
      listLoading = _useState6[0],
      setListLoading = _useState6[1];

  var _useState7 = React.useState({}),
      localParameter = _useState7[0],
      setLocalParameter = _useState7[1];

  var _useState8 = React.useState(isMultiple ? [] : {});

  var _useState9 = React.useState(0),
      setLast = _useState9[1];

  var _useState10 = React.useState(false),
      open = _useState10[0],
      setOpen = _useState10[1];

  var _useState11 = React.useState(1);

  var props_name = tcomponent.slug(props.name, '_');
  var key_select = tcomponent.slug('selected_' + props_name, '_');

  var _useState12 = React.useState(props.label ? props.label : tcomponent.findArrayName(props_name, input));

  var nodeRef = React.useRef();
  var isVisible = reactIsVisible.useIsVisible(nodeRef);

  var _useState13 = React.useState([]),
      data = _useState13[0],
      setData = _useState13[1];

  var _useState14 = React.useState({}),
      meta = _useState14[0],
      setMeta = _useState14[1];

  var primaryKey = props.primaryKey ? props.primaryKey : 'id';

  function labelGenerate(option) {
    var label = [];
    separator = separator || ' | ';

    if (lodash.isArray(optionLabel)) {
      for (var i = 0; i <= optionLabel.length - 1; i++) {
        if (option[optionLabel[i]] && !lodash.isUndefined(option[optionLabel[i]])) {
          label.push(option[optionLabel[i]]);
        }
      }

      return label.join(separator);
    } else {
      return option[optionLabel] ? option[optionLabel] : '';
    }
  }

  function onChecked(rowInfo, local_input, exist) {
    if (exist === void 0) {
      exist = false;
    }

    var _value = rowInfo.row.original || {};

    if (!isMultiple) {
      dispatch({
        type: 'SET_INPUT',
        payload: {
          key: key_select,
          value: _value[primaryKey]
        }
      });
    } else {
      var new_input = [];

      var _local_input = tcomponent.findArrayName(key_select, local_input);

      if (exist) {
        new_input = lodash.filter(_local_input, function (o) {
          return o && _value && String(o) != String(_value[primaryKey]);
        }) || [];
      } else {
        new_input = _local_input || [];

        if (!lodash.isArray(new_input)) {
          new_input = [];
        }

        if (_value[primaryKey]) {
          new_input.push(_value[primaryKey]);
        }
      }

      new_input = lodash.uniq(new_input);
      new_input = lodash.filter(new_input, function (o) {
        return !lodash.isNull(o) && !lodash.isUndefined(o);
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

  var checkComponent = {
    Header: '#',
    id: props_name + '_check',
    Cell: function Cell(row) {
      var local_input = reactRedux.useSelector(function (state) {
        return state.core.input;
      });
      var checked = false;
      var val = tcomponent.findArrayName(key_select, local_input);

      try {
        if (!isMultiple) {
          checked = val === row.row.original[primaryKey];
        } else {
          checked = lodash.findIndex(val, function (o) {
            return o === row.row.original[primaryKey];
          }) > -1;
        }
      } catch (e) {}

      if (!row.row.original[primaryKey]) {
        return null;
      }

      return /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
        id: tcomponent.slug(props_name + '_check_' + row.row.original[primaryKey], '_'),
        name: tcomponent.slug(props_name + '_check_' + row.row.original[primaryKey], '_'),
        style: {
          zIndex: 100
        },
        type: !isMultiple ? 'radio' : 'checkbox',
        value: 1,
        checked: checked,
        disabled: props.isReadonly,
        onChange: function onChange() {
          return onChecked(row, local_input, checked);
        }
      });
    }
  };
  var _columns = [{
    Header: 'Keterangan',
    id: 'label',
    accessor: function accessor(d) {
      return labelGenerate(d);
    }
  }];
  var col = [checkComponent].concat(_columns);

  function onReload() {
    if (open) {
      loadOptions();
    }
  }

  tcomponent.useDebounce(syncParameter, 500, [tcomponent.findArrayName(key_select, input)]);
  tcomponent.useDebounce(onReload, 500, [tcomponent.findArrayName('keyword_' + props_name, filter), tcomponent.findArrayName('page_' + props_name, filter), tcomponent.findArrayName('load_' + props_name, filter)]);

  function syncParameter() {
    if (!isMultiple) {
      var new_input = tcomponent.findArrayName(key_select, input) || null;

      if (new_input) {
        var url = process.env.REACT_APP_API_URL + '/' + props.url;

        var _defaultFilterData2 = tcomponent.defaultFilterData(filter, [], props_name),
            keyword = _defaultFilterData2.keyword;

        var _data = tcomponent.secureData(_extends({
          pkey: primaryKey,
          selected: [new_input],
          keyword: keyword,
          load: 1,
          page: 1
        }, props.parameter));

        var options = {
          method: 'POST',
          headers: tcomponent.setAuthHeader(auth),
          url: url,
          data: _data
        };
        setLoading(true);
        axios(options).then(function (resp) {
          var new_parameter = resp.data.data.data[0] || {};
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: key_select,
              value: new_parameter
            }
          });
          handleInputChange(new_parameter);
          setLoading(false);
        })["catch"](function (error) {
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
      var _new_input = lodash.filter(tcomponent.findArrayName(key_select, input), function (o) {
        return !lodash.isNull(o) && !lodash.isUndefined(o);
      }) || [];

      if (_new_input.length > 0) {
        var _url = process.env.REACT_APP_API_URL + '/' + props.url;

        var _defaultFilterData3 = tcomponent.defaultFilterData(filter, [], props_name),
            _keyword = _defaultFilterData3.keyword;

        var _data2 = tcomponent.secureData(_extends({
          pkey: primaryKey,
          selected: _new_input,
          keyword: _keyword,
          load: _new_input.length,
          page: 1
        }, props.parameter));

        var _options = {
          method: 'POST',
          headers: tcomponent.setAuthHeader(auth),
          url: _url,
          data: _data2
        };
        setLoading(true);
        axios(_options).then(function (resp) {
          dispatch({
            type: 'SET_PARAMETER',
            payload: {
              key: key_select,
              value: resp.data.data.data
            }
          });
          handleInputChange(resp.data.data.data);
          setLoading(false);
        })["catch"](function (error) {
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

  var columns = React__default.useMemo(function () {
    return col;
  }, []);
  React.useEffect(function () {
    if (!lodash.isEqual(props.parameter, localParameter)) {
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
        key: tcomponent.slug('page_' + props_name, '_'),
        value: 1
      }
    });
    setOpen(function (data) {
      return !data;
    });
    loadOptions();
  }

  function closeModal() {
    setOpen(false);
  }

  function reloader() {
    if (visible) {
      var val = null;

      try {
        if (isMultiple) {
          val = lodash.map(defaultValue, 'value');
          val = lodash.filter(val, function (o) {
            return o;
          }) || [];
        } else {
          val = defaultValue.value || null;
        }
      } catch (e) {}

      var _input2 = tcomponent.findArrayName(key_select, input) || null;

      if (!lodash.isEqual(val, _input2)) {
        if (lodash.isNull(val) && !lodash.isNull(_input2)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: _input2
            }
          });
        } else if (!lodash.isNull(val) && lodash.isNull(_input2)) {
          dispatch({
            type: 'SET_INPUT',
            payload: {
              key: key_select,
              value: val
            }
          });
        } else if (!lodash.isNull(val) && !lodash.isNull(_input2)) {
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

  React.useEffect(reloader, [visible]);
  React.useEffect(function () {
    var val = null;

    try {
      if (isMultiple) {
        val = lodash.filter(lodash.map(defaultValue, 'value'), function (o) {
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
    var url = process.env.REACT_APP_API_URL + '/' + props.url;

    var _defaultFilterData4 = tcomponent.defaultFilterData(filter, [], props_name),
        page = _defaultFilterData4.page,
        load = _defaultFilterData4.load,
        keyword = _defaultFilterData4.keyword,
        sorted = _defaultFilterData4.sorted,
        search = _defaultFilterData4.search;

    var data = tcomponent.secureData(_extends({
      pkey: primaryKey,
      page: page,
      load: load,
      keyword: keyword,
      sorted: sorted,
      search: search
    }, props.parameter));
    var options = {
      method: 'POST',
      headers: tcomponent.setAuthHeader(auth),
      url: url,
      data: data
    };
    setListLoading(true);
    return axios(options).then(function (resp) {
      var responseJSON = resp.data || {};

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
    })["catch"](function (error) {
      setListLoading(false);
    });
  }

  function generateInputMultiple(event) {
    if (lodash.isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        var k = props.optionValue[key];
        var v = null;

        if (event) {
          try {
            v = lodash.uniq(lodash.map(event, key));
          } catch (e) {}
        }

        if (!lodash.isEqual(tcomponent.findArrayName(k, input), v)) {
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
      var k = props_name;
      var v = null;

      if (event) {
        v = lodash.uniq(lodash.map(event, primaryKey));
      }

      if (!lodash.isEqual(tcomponent.findArrayName(k, input), v)) {
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
    if (lodash.isObject(props.optionValue)) {
      Object.keys(props.optionValue).map(function (key, index) {
        var k = props.optionValue[key];
        var v = null;

        if (event) {
          try {
            v = event[key];
          } catch (e) {}
        }

        if (!lodash.isEqual(tcomponent.findArrayName(k, input), v)) {
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
      var k = props_name;
      var v = null;

      if (event) {
        v = event[primaryKey];
      }

      if (!lodash.isEqual(tcomponent.findArrayName(k, input), v)) {
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

  var isi = [];

  var _input = tcomponent.findArrayName(key_select, input);

  try {
    if (isMultiple) {
      isi = lodash.isArray(_input) ? _input : [];
    } else {
      isi = _input ? [_input] : [];
    }
  } catch (e) {}

  var _parameter = tcomponent.findArrayName(key_select, parameter);

  var isi_param = null;

  try {
    if (isMultiple) {
      isi_param = lodash.isArray(_parameter) ? _parameter : [];
    } else {
      isi_param = lodash.isObject(_parameter) ? _parameter : {};
    }
  } catch (e) {}

  return /*#__PURE__*/React__default.createElement("div", {
    ref: nodeRef
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Row, null, !props.isReadonly && /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "2",
    md: "2",
    sm: "4",
    xs: "12"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    size: "sm",
    variant: "primary",
    type: "button",
    className: "btn-icon",
    onClick: openModal
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSearch
  }))), /*#__PURE__*/React__default.createElement(reactBootstrap.Col, {
    lg: "10",
    md: "10",
    sm: "8",
    xs: "12"
  }, loading ? /*#__PURE__*/React__default.createElement(Loading, null) : isi.map(function (val, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(ShowData, {
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
  }))), /*#__PURE__*/React__default.createElement(reactBootstrap.Modal, {
    size: "lg",
    show: open,
    onHide: closeModal
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Header, {
    onHide: closeModal,
    closeButton: true
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Title, null, props.placeholder || 'Pilih')), /*#__PURE__*/React__default.createElement(reactBootstrap.Modal.Body, null, /*#__PURE__*/React__default.createElement(MyLoadingOvelay, {
    isLoading: listLoading
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup, {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.InputGroup.Text, {
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSearch
  })), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
    style: {
      borderLeft: 'none'
    },
    className: "form-control",
    value: tcomponent.findArrayName('keyword_' + props_name, filter),
    onChange: function onChange(e) {
      var _payload;

      dispatch({
        type: 'SET_MULTI_FILTER',
        payload: (_payload = {}, _payload['keyword_' + props_name] = e.target.value, _payload['page_' + props_name] = 1, _payload)
      });
    },
    type: "text",
    id: 'search_' + key_select,
    name: "search",
    placeholder: "Pencarian"
  }), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    style: {
      zIndex: 0
    },
    variant: "primary",
    onClick: onReload,
    type: "button",
    disabled: props.isLoading
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSync,
    spin: props.isLoading
  }))), !listLoading && /*#__PURE__*/React__default.createElement(DataTableContainer, {
    name: props_name,
    columns: columns,
    data: data,
    primaryKey: primaryKey,
    isColumnsSearchable: true,
    fetchData: onReload,
    loading: listLoading,
    customPageTotal: meta && !lodash.isEmpty(meta) ? meta.total : 0,
    customPageCount: meta && !lodash.isEmpty(meta) ? meta.last_page : 1,
    customPageSize: meta && !lodash.isEmpty(meta) ? meta.per_page : filter['load_' + props_name] ? filter['load_' + props_name] : 5,
    customPageIndex: meta && !lodash.isEmpty(meta) ? meta.current_page : filter['page_' + props_name] ? filter['page_' + props_name] : 1
  }))), !listLoading && /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React__default.createElement("p", null, "Dipilih : "), loading && /*#__PURE__*/React__default.createElement(Loading, null), /*#__PURE__*/React__default.createElement("ul", null, isMultiple ? isi_param && isi_param.map(function (val, index) {
    return /*#__PURE__*/React__default.createElement("li", null, !lodash.isUndefined(val) && !lodash.isEmpty(val) ? labelGenerate(val) : '');
  }) : isi_param && /*#__PURE__*/React__default.createElement("li", null, !lodash.isUndefined(isi_param) && !lodash.isEmpty(isi_param) ? labelGenerate(isi_param) : ''))))));
}

exports.DataTable = DataTable;
exports.DataTableContainer = DataTableContainer;
exports.Field = Field;
exports.InputChoose = InputChoose$1;
exports.InputColor = InputColor;
exports.InputDate = InputDate$1;
exports.InputDateTime = InputDateTime$1;
exports.InputFile = InputFile;
exports.InputNumber = InputNumber$1;
exports.InputSelect = InputSelect$1;
exports.InputSelectFetch = InputSelectFetch;
exports.InputTag = InputTag$1;
exports.InputText = InputText$1;
exports.InputTime = InputTime$1;
exports.InputWorkflow = InputWorkflow;
exports.InputYear = InputYear;
exports.Loading = Loading;
exports.LoadingOverlay = MyLoadingOvelay;
exports.LoadingPage = Loading$1;
//# sourceMappingURL=index.js.map
