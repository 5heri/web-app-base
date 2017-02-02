/* Commmon code duplicated from Wifast-Base.
 * - common/js/floating-label-textfield.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

require('../css/_floatinglabeltextfield')

import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import ClassNames from 'classnames'
import BaseComponent from './base-component'

/*
 * Reusable floating label text field component
 */
export default class FloatingLabelTextField extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = {
      floating: !!this.props.value,
      active: this.props.focus,
      value: this.props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState({
        floating: this.state.active || nextProps.value.length > 0,
        value: nextProps.value
      })
    }

    if (nextProps.focus && !this.props.focus) {
      this.onFocus()
    } else if (!nextProps.focus && this.props.focus) {
      this.onBlur()
    }
  }

  render() {
    const containerClassNames = ClassNames(this.getClassName(), 'fl-container', this.props.className, {
      floating: this.state.floating,
      'hide-floating-label': this.props.hideFloatingLabel,
      active: this.state.active,
      disabled: this.props.disabled
    })

    return (
      <div className={containerClassNames}>
        <div className='fl-input-wrapper' onClick={this.onClick}>
          <input
            ref={(ref) => this.setRef('input', ref)}
            type={this.props.type}
            name={this.props.name}
            className='fl-input'
            value={this.state.value}
            placeholder={!this.state.value && this.state.floating ? this.props.placeholder : null}
            disabled={this.props.disabled}
            min={this.props.min}
            max={this.props.max}
            spellCheck={this.props.spellcheck}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        </div>
        <label className='fl-label'>{this.props.label}</label>
        {this.renderMax()}
        {this.props.children}
      </div>
    )
  }

  renderMax = () => {
    if (_.isUndefined(this.props.maxLength)) {
      return null
    }

    return (
      <div className='max-length'>
        {this.state.value.length} / {this.props.maxLength}
      </div>
    )
  }

  componentDidMount() {
    /* Fixes a bug where the onChange event is not fired when Chrome prefills values,
    and as a result, the password and the label overlap */
    this.pollAttempts = 0
    this.chromePrefillPollId = setInterval(this.checkForChromePrefill, 200)
  }

  componentWillUnmount() {
    clearInterval(this.chromePrefillPollId)
  }

  onClick = () => {
    const inputRef = this.getRef('input')

    inputRef.focus()
  }

  onChange = (event) => {
    let value = event.currentTarget.value

    if (!_.isUndefined(this.props.maxLength) && value.length > this.props.maxLength) {
      value = this.state.value
    }

    this.setState({
      floating: this.state.active || value.length > 0,
      value
    })

    this.props.onChange && this.props.onChange(event)
  }

  onBlur = (event) => {
    const value = !_.isUndefined(event)
      ? event.currentTarget.value
      : this.state.value

    this.props.onBlur && this.props.onBlur(value)

    this.setState({
      active: false,
      floating: value.length > 0
    })
  }

  onFocus = (event) => {
    ReactDOM.findDOMNode(this.getRef('input')).focus()

    this.props.onFocus && this.props.onFocus()

    this.setState({
      active: true,
      floating: true
    })
  }

  checkForChromePrefill = () => {
    const input = this.getRef('input')
    const chromePrefillSelector = `input[name=${input.name}]:-webkit-autofill`
    let isAutoFilledByChrome

    // error is thrown on non-webkit browsers when calling querySelector on :-webkit-autofill
    try {
      isAutoFilledByChrome = document.querySelector(chromePrefillSelector)
    } catch (e) {
      isAutoFilledByChrome = false
    }

    if (input.value || isAutoFilledByChrome) {
      this.setState({
        floating: true
      })
    }

    this.pollAttempts++

    if (this.pollAttempts >= this.props.pollAttempts) {
      clearInterval(this.chromePrefillPollId)
    }
  }
}

FloatingLabelTextField.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  className: React.PropTypes.string,
  type: React.PropTypes.string,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  errors: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  children: React.PropTypes.element,
  pollAttempts: React.PropTypes.number,
  hideFloatingLabel: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  maxLength: React.PropTypes.number,
  spellcheck: React.PropTypes.bool,
  focus: React.PropTypes.bool
}

FloatingLabelTextField.defaultProps = {
  type: 'text',
  value: '',
  pollAttempts: 20,
  hideFloatingLabel: false,
  disabled: false,
  spellcheck: false,
  focus: false
}
