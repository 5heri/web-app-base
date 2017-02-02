import _ from 'underscore'
import React from 'react'
import BaseComponent from '../../shared/common/js/base-component'
import Notification from '../../shared/common/js/notification-bar/notification'

const AUTO_CLOSE_DELAY = 2000

/*
 * Represents error message
 */
export default class ErrorMessage extends BaseComponent {
  render() {
    const error = this.props.error

    if (_.isNull(error)) {
      return null
    }

    if (error.level === 'fullscreen') {
      return (
        <div className='fullscreen-error'>
          <div className='message'>
            <span className='main'>{error.message || ''}</span>
            {this.renderSubMessage(error.subMessage)}
          </div>
        </div>
      )
    }

    return (
      <div className='notification-bar'>
        <Notification
          key={this.getClassName()}
          id={this.getClassName()}
          onClose={this.props.onClose}
          closeAfterTime={AUTO_CLOSE_DELAY}
          message={error.message}
          level={error.level}
        />
      </div>
    )
  }

  renderSubMessage(subMessage) {
    if (subMessage) {
      return (
        <div>
          <span className='sub'>{subMessage}</span>
        </div>
      )
    }
    return null
  }
}

ErrorMessage.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  error: React.PropTypes.shape({
    message: React.PropTypes.string,
    subMessage: React.PropTypes.string,
    level: React.PropTypes.string
  })
}
