import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import PortalRenderer from '../../src/js/views/main'
import {BaseComponent} from '../../src/js/views/main'
import Logging from '../logging'
import Form from '../form'
import UserData from '../userdata'
import PortalErrors from './portal-errors'

export default class PortalRendererWrapper extends BaseComponent {
  constructor(props) {
    super(props)

    let initialError = null

    if (props.initialError) {
      initialError = PortalErrors.getError(props.initialError.code)
    }

    this.state = {
      currentPage: props.page,
      renderBirthday: props.renderBirthday,
      loading: false,
      error: initialError
    }
  }

  componentDidMount() {
    if (parseInt(this.props.sessionTimeToExpiry) >= 0) {
      setTimeout(() => {
        const error = {
          code: 'session_expired'
        }

        this.showErrorCallback(this.state.currentPage, error)
      }, this.props.sessionTimeToExpiry * 1000)
    }
  }

  render() {
    return (
      <PortalRenderer
        config={this.props.template}
        currentPage={this.state.currentPage}
        responsive
        sessionId={this.props.sessionId}
        portalHostname={this.props.portalHostname}
        renderBirthday={this.state.renderBirthday}
        loading={this.state.loading}
        error={this.state.error}
        assetApiPath={'/portal-assets/'}
        displayName={this.props.displayName}
        businessName={this.props.businessName}
        onGoOnlineButtonClick={this.onGoOnlineButtonClick}
        onEmailLoginButtonClick={this.onEmailLoginButtonClick}
        onSmsLoginButtonClick={this.onSmsLoginButtonClick}
        onFacebookLoginButtonClick={this.onFacebookLoginButtonClick}
        onBackButtonClick={this.onBackButtonClick}
        onConnectButtonClick={this.onConnectButtonClick}
        onConnectAnonymouslyButtonClick={this.onConnectAnonymouslyButtonClick}
        onReturnConnectButtonClick={this.onReturnConnectButtonClick}
        onNotYouButtonClick={this.onNotYouButtonClick}
        onOnlineSubmitButtonClick={this.onOnlineSubmitButtonClick}
        onErrorMessageClose={this.onErrorMessageClose}
        onlinePageRedirect={this.onlinePageRedirect}
      />
    )
  }

  // handles page transition when the Go Online button is clicked
  onGoOnlineButtonClick = (channels) => {
    const channelCount = channels.length

    if (channelCount === 1) {
      switch (channels[0]) {
        case 'email':
          this.showEmailForm()
          break
        case 'mobile':
          this.showSmsForm()
          break
        case 'facebook':
          this.fbConnect()
          break
        default:
          // TODO: replace with something more actionable like rollbar error
          console.error("unknown channel: " + channels[0])
          break
      }
    } else if (channelCount > 1) {
      this.showLoginMethods()
    } else {
      // TODO: replace with something more actionable like rollbar error
      console.error("empty channels")
    }
  }

  // handles the email login button
  onEmailLoginButtonClick = () => {
    this.showEmailForm()
  }

  // handles the sms login button
  onSmsLoginButtonClick = () => {
    this.showSmsForm()
  }

  // handles the facebook login button
  onFacebookLoginButtonClick = () => {
    this.fbConnect()
  }

  // handle back button clicks
  onBackButtonClick = (channels) => {
    if (channels.length === 1) {
      if (this.props.page === 'returning') {
        this.setState({
          currentPage: 'returning'
        })
      }
      else {
        this.setState({
          currentPage: 'landing'
        })
      }
    } else {
      this.showLoginMethods()
    }
  }

  // handles connect button clicks on sms, email pages
  onConnectButtonClick = (input) => {
    let loginType = 'email'
    let data = {}
    let view = ''

    switch (this.state.currentPage) {
      case 'emailLogin':
        loginType = 'email'
        view = 'email'
        data.email = input
        break
      case 'phoneLogin':
        loginType = 'sms'
        view = 'sms'
        data.phone = input
        break
    }

    const loginData = {
      type: loginType,
      data: data,
      return_login: false,
    }
    const callbacks = {
      showLoading: this.showLoadingCallback,
      showError: this.showErrorCallback
    }

    Form.login(view, loginData, callbacks)
  }

  // handles connect button clicks on sms, email pages
  onConnectAnonymouslyButtonClick = (input) => {
    const loginType = 'anonymous'
    const data = {}
    const view = 'anonymous'

    const loginData = {
      type: loginType,
      data: data,
      return_login: false,
    }
    const callbacks = {
      showLoading: this.showLoadingCallback,
      showError: this.showErrorCallback
    }

    Form.login(view, loginData, callbacks)
  }

  // handles the "not you" link, should be the same behavior as "Go Online"
  onNotYouButtonClick = (channels) => {
    this.onGoOnlineButtonClick(channels)
  }

  // handles the connect button on the "Welcome back" page
  onReturnConnectButtonClick = () => {
    const loginData = {
      type: this.props.currentLoginType,
      data: {},
      return_login: true,
    }
    const callbacks = {
      showLoading: this.showLoadingCallback,
      showError: this.showErrorCallback
    }

    Form.login('returning', loginData, callbacks)
  }

  onOnlineSubmitButtonClick = (day, month) => {
    const userData = {
        day: day,
        month: month
    }
    const callbacks = {
        showLoading: this.showLoadingCallback,
        onSuccess: this.onUserDataUpdateSuccessCallback,
        showError: this.showErrorCallback
    }

    UserData.updateUserData('online', userData, callbacks)
  }

  showEmailForm() {
    Logging.log_analytics('landing.showEmailForm')
    this.setState({
      currentPage: 'emailLogin'
    })
  }

  showSmsForm() {
    Logging.log_analytics('landing.showSmsForm')
    this.setState({
      currentPage: 'phoneLogin'
    })
  }

  showLoginMethods() {
    Logging.log_analytics('landing.showLoginMethods')
    this.setState({
      currentPage: 'login'
    })
  }

  fbConnect() {
    Logging.log_analytics('landing.fbConnect')
    window.location.replace(this.props.facebookUrl)
  }

  // a callback function for the authentication process to show the 'loading' animation
  showLoadingCallback = () => {
    this.setState({
      loading: true
    })
  }

  // a callback function for the authentication process to show error prompts
  showErrorCallback = (view, error) => {
    const portalError = PortalErrors.getError(error.code)

    Logging.log_analytics('error.showError', {'error': portalError, 'view': view})
    this.setState({
      loading: false,
      error: portalError
    })
  }

  onUserDataUpdateSuccessCallback = () => {
    // this should hide the birthday component
    this.setState({
      loading: false,
      renderBirthday: false
    })
  }

  onErrorMessageClose = () => {
    this.setState({
      error: null
    })
  }

  onlinePageRedirect = (url, waitTime) => {
    setTimeout(function() {
      window.location.replace(url)
    }, waitTime)
  }
}

PortalRendererWrapper.propTypes = {}
PortalRendererWrapper.defaultProps = {}
