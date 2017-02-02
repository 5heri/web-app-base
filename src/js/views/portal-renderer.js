require('../../css/_portalrenderer')

import _ from 'underscore'
import React from 'react'
import dasherize from 'underscore.string/dasherize'
import decapitalize from 'underscore.string/decapitalize'
import BaseComponent from '../../shared/common/js/base-component'
import PortalConstants from '../../shared/portal/js/constants'
import DefaultPortalTemplate from '../../shared/portal/js/default-portal-template'
import CommonUtils from '../../shared/common/js/utils'
import PortalRendererConstants from '../constants'
import PortalPageBody from './portal-page-body'
import ErrorMessage from './error-message'

/*
 * Class representing the rendered portal views: Landing, Login, Email Login, Phone Login, Online,
 * and Returning
 */
export default class PortalRenderer extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = {
      loading: this.props.loading,
      hasScrollListener: false,
      error: this.props.error,
      config: this.getConfigFromProps(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state.loading, nextProps.loading)) {
      this.setState({
        loading: nextProps.loading
      })
    }

    if (!_.isEqual(this.state.error, nextProps.error)) {
      this.handleError(nextProps.error)
    }
    
    this.setConfigFromProps(nextProps)
  }

  componentDidUpdate() {
    if (!this.state.hasScrollListener) {
      const rendererRef = this.getRef('PortalRenderer')

      if (rendererRef) {
        rendererRef.addEventListener('scroll', _.partial(this.handleScroll, rendererRef))

        this.setState({
          hasScrollListener: true
        })
      }
    }
  }

  componentWillUnmount() {
    const rendererRef = this.getRef('PortalRenderer')

    if (rendererRef) {
      rendererRef.removeEventListener('scroll', _.partial(this.handleScroll, rendererRef))
    }
  }

  componentDidMount() {
    const pageData = this.getPageData()

    if (pageData && pageData.id === 'online') {
      const onlinePageRedirect = this.state.config.onlinePageRedirect

      if (onlinePageRedirect && onlinePageRedirect.active && !_.isEmpty(onlinePageRedirect.url)) {
        this.props.onlinePageRedirect && this.props.onlinePageRedirect(onlinePageRedirect.url, 2000)
      }
    }
  }

  render () {
    const pageData = this.getPageData()
    const loading = this.state.loading ? this.renderLoadingScreen() : null
    let dom = null

    if (!_.isEmpty(pageData)) {
      dom = (
        <div
          ref={(ref) => this.setRef('PortalRenderer', ref)}
          className={this.getClassName()}
        >
          {loading}
          <PortalPageBody
            pageData={pageData}
            theme={this.state.config.theme}
            edit={this.props.edit}
            editor={this.props.editor}
            preview={this.props.preview}
            editorContext={this.props.editorContext}
            sessionId={this.props.sessionId}
            portalHostname={this.props.portalHostname}
            renderBirthday={this.props.renderBirthday}
            displayName={this.props.displayName}
            businessName={this.props.businessName}
            assetApiPath={this.props.assetApiPath}
            error={this.state.error}
            hideSms={this.props.hideSms}
            language={this.state.config.tosLanguage}
            onMouseEnter={this.props.onMouseEnter}
            onGoOnlineButtonClick={this.onGoOnlineButtonClick}
            onEmailLoginButtonClick={this.props.onEmailLoginButtonClick}
            onSmsLoginButtonClick={this.props.onSmsLoginButtonClick}
            onFacebookLoginButtonClick={this.props.onFacebookLoginButtonClick}
            onConnectAnonymouslyButtonClick={this.props.onConnectAnonymouslyButtonClick}
            onBackButtonClick={this.onBackButtonClick}
            onConnectButtonClick={this.props.onConnectButtonClick}
            onReturnConnectButtonClick={this.props.onReturnConnectButtonClick}
            onNotYouButtonClick={this.onNotYouButtonClick}
            onOnlineSubmitButtonClick={this.props.onOnlineSubmitButtonClick}
            onTextFieldFocus={this.onTextFieldFocus}
          />
          <ErrorMessage
            onClose={this.onErrorMessageClose}
            error={this.state.error}
          />
          <div className='portal-page-footer'>
            <div className='zr-logo'></div>
          </div>
        </div>
      )

      if (this.props.responsive) {
        dom = <div className='responsive'>{dom}</div>
      }
    }

    return dom
  }

  renderLoadingScreen() {
    return (
      <div className='loading-screen'>
        <div className='loading-container'>
          <div className='loading-animation'>
          {_.times(6, () => { 
            return <div className='bar'/>
          })}
          </div>
        </div>
      </div>
    )
  }

  handleScroll = (rendererRef) => {
    const scrollTop = $(rendererRef).scrollTop()

    this.props.onPortalRendererScroll(scrollTop)
  }

  /*
   * @return {Object} data for the current rendered page
   */
  getPageData() {
    const pages = CommonUtils.deepExtend({}, this.state.config.pages)

    return _.find(pages, (page) => {
      return page.id === this.props.currentPage
    })
  }

  /*
   * @param {Object} error object with 'message' and 'level' keys   
   */   
  handleError = (error) => {
    this.setState({
      error: error
    })
  }

  // Get the config out of props.  If there is no template for the business, use the default ones
  getConfigFromProps = (props) => {
    return props.config ||
      DefaultPortalTemplate.getDefaultTemplate().template
  }
  
  // Set the config if it changed
  setConfigFromProps = (props) => {
    if (!_.isEqual(this.state.config, props.config)) {
      this.setState({
        config: this.getConfigFromProps(props)
      })
    }
  }

  onTextFieldFocus = () => {
    this.setState({
      error: null
    })
  }

  onErrorMessageClose = (notificationId) => {
    this.props.onErrorMessageClose && this.props.onErrorMessageClose(notificationId)
    this.setState({
      error: null
    })
  }

  onGoOnlineButtonClick = () => {
    const channels = this.getLoginChannels()

    this.props.onGoOnlineButtonClick(channels)
  }

  onNotYouButtonClick = () => {
    const channels = this.getLoginChannels()

    this.props.onNotYouButtonClick(channels)
  }

  onBackButtonClick = () => {
    const channels = this.getLoginChannels()

    this.props.onBackButtonClick(channels)
  }

  /*
   * @return {Object} list of enabled login channel ids
   */
  getLoginChannels = () => {
    const loginPage = _.find(this.state.config.pages, (page) => {
      return page.id === 'login'
    })
    const enabledChannels = _.filter(loginPage.channels, function(channel) {
      return channel.render === true
    })
    const channels = _.map(enabledChannels, (channel, index) => {
      return channel.id
    })

    return channels
  }
}

PortalRenderer.propTypes = {
  config: React.PropTypes.object,
  currentPage: React.PropTypes.string,
  responsive: React.PropTypes.bool,
  edit: React.PropTypes.bool,
  editor: React.PropTypes.bool,
  preview: React.PropTypes.bool,
  editorContext: React.PropTypes.object,
  onMouseEnter: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.object,
}

PortalRenderer.defaultProps = {
  currentPage: PortalConstants.pages.landing,
  responsive: true,
  edit: false,
  editor: false,
  preview: false,
  editorContext: null,
  loading: false,
  error: null,
}
