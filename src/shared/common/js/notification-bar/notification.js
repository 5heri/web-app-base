/* Commmon code duplicated from Wifast-Base.
 * - common/js/views/notification-bar/notification.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

import _ from 'underscore'
import ClassNames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import BaseComponent from '../base-component'

/*
 * Class representing a notification
 * Belongs to the notification bar
 */
export default class Notification extends BaseComponent {
  componentDidMount() {
    if (this.props.closeAfterTime) {
      _.delay(this.onClose, this.props.closeAfterTime, this.props.id);
    }
  }

  render() {
    const className = ClassNames(this.getClassName(), this.props.className, this.props.level)

    return (
      <div className={className}>
        <div className='message'>{this.props.message}</div>
        <div className='button-close' onClick={_.partial(this.onClose, this.props.id)}/>
      </div>
    )
  }

  onClose = (notificationId) => {
    this.props.onClose(notificationId)
  }
}

Notification.propTypes = {
  id: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  level: React.PropTypes.string,
  message: React.PropTypes.string,
  closeAfterTime: React.PropTypes.number,
  className: React.PropTypes.string
}


Notification.defaultProps = {
  level: 'info'
}
