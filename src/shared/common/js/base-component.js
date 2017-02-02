/* Commmon code duplicated from Wifast-Base.
 * - common/js/views/base-component.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

import React from 'react'
import dasherize from 'underscore.string/dasherize'
import decapitalize from 'underscore.string/decapitalize'
import CommonUtils from './utils'

export default class BaseComponent extends React.Component {
  getClassName() {
    return dasherize(decapitalize(CommonUtils.getClassName(this.constructor)))
  }

  getRef(refName) {
    return this._refs && this._refs[refName]
  }

  setRef(refName, refObj) {
    this._refs = this._refs || {}
    this._refs[refName] = refObj
  }

  render() {
    return <div className={this.getClassName()}/>
  }
}
