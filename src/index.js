'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var format = require('occasion');
var parse = require('dehumanize-date');
var LinkedValueUtils = require('./linked-value-utils');

class ReactDate extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onInvalid: PropTypes.func,
    onValid: PropTypes.func,
    format: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    parse: PropTypes.oneOfType([
      PropTypes.oneOf(['us', 'US']),
      PropTypes.func
    ])
  };

  constructor(props) {
    super(props);
    var defaultValue = props.defaultValue;
    this.state = {
      currentValue: defaultValue != null ? defaultValue : null,
      isEditing: false,
      textContent: ''
    };
  }

  render() {
    var props = {};
    for (var key in this.props) {
      if (key in this.props) {
        if (['value', 'defaultValue', 'valueLink', 'onChange',
             'format', 'parse', 'onBlur', 'onInvalid', 'onValid', 'inputRef'].indexOf(key) === -1) {
          props[key] = this.props[key];
        }
      }
    }
    var value = LinkedValueUtils.getValue(this);
    value = value != null ? value : this.state.currentValue;
    if (this.state.isEditing && (
      null === this._parse(this.state.textContent) || value === this._parse(this.state.textContent)
    )) {
      props.value = this.state.textContent;
    } else {
      props.value = this._format(value);
    }
    props.onChange = this._handleChange;
    props.onBlur = this._handleBlur;
    if (this.props.inputRef) {
      props.ref = this.props.inputRef;
    }
    return React.createElement('input', props);
  }

  _parse(value) {
    if (typeof this.props.parse === 'string' && this.props.parse.toLowerCase() === 'us') {
      return parse(value, true);
    } else if (typeof this.props.parse === 'function') {
      return this.props.parse(value);
    } else {
      return parse(value);
    }
  }

  _format(value) {
    if (/^\d\d\d\d\-\d\d\-\d\d$/.test(value)) {
      if (typeof this.props.format === 'function') {
        return this.props.format(value);
      } else {
        return format(value, this.props.format);
      }
    } else {
      return value;
    }
  }

  _handleBlur = (e) => {
    this.setState({isEditing: false});
    if (this.props.onBlur) {
      return this.props.onBlur.call(this, e);
    }
  }

  _handleChange = (e) => {
    var value = e.target.value;
    this.setState({textContent: value, isEditing: true});
    var returnValue;
    value = value ? this._parse(value) : '';
    if (value !== null) {
      var invalid = this.props.required && !value;
      if (!invalid && this.state.invalid && this.props.onValid) {
        this.props.onValid.call(this);
      }
      this.setState({invalid: invalid});

      var onChange = LinkedValueUtils.getOnChange(this);
      if (onChange) {
        returnValue = onChange.call(this, {target: {value: value}});
      }

      if (LinkedValueUtils.getValue(this) == null) {
        this.setState({currentValue: value});
      } else {
        this.setState({currentValue: value});
      }
    } else {
      if (!this.state.invalid && this.props.onInvalid) {
        this.props.onInvalid.call(this);
      }
      this.setState({invalid: true});
    }
    return returnValue;
  }
}

module.exports = ReactDate;
