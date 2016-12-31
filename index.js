'use strict';

var React = require('react');
var format = require('occasion');
var parse = require('dehumanize-date');
var LinkedValueUtils = require('./lib/linked-value-utils');

module.exports = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onInvalid: React.PropTypes.func,
    onValid: React.PropTypes.func,
    format: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    parse: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(['us', 'US']),
      React.PropTypes.func
    ])
  },
  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    return {
      currentValue: defaultValue != null ? defaultValue : null,
      isEditing: false,
      textContent: ''
    };
  },

  render: function () {
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
      null === parse(this.state.textContent) || value === parse(this.state.textContent)
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
  },
  _parse: function (value) {
    if (typeof this.props.parse === 'string' && this.props.parse.toLowerCase() === 'us') {
      return parse(value, true);
    } else if (typeof this.props.parse === 'function') {
      return this.props.parse(value);
    } else {
      return parse(value);
    }
  },
  _format: function (value) {
    if (/^\d\d\d\d\-\d\d\-\d\d$/.test(value)) {
      if (typeof this.props.format === 'function') {
        return this.props.format(value);
      } else {
        return format(value, this.props.format);
      }
    } else {
      return value;
    }
  },
  _handleBlur: function (e) {
    this.setState({isEditing: false});
    if (this.props.onBlur) {
      return this.props.onBlur.call(this, e);
    }
  },
  _handleChange: function(e) {
    var value = e.target.value;
    this.setState({textContent: value, isEditing: true});
    var returnValue;
    value = value ? parse(value) : '';
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
});
