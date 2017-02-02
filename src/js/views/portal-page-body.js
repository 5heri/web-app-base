require('../../css/_portalpagebody')

import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import ClassNames from 'classnames'
import ObjectPath from 'object-path'
import dasherize from 'underscore.string/dasherize'
import decapitalize from 'underscore.string/decapitalize'
import CommonUtils from '../../shared/common/js/utils'
import BaseComponent from '../../shared/common/js/base-component'
import FloatingLabelTextField from '../../shared/common/js/floating-label-textfield'
import PortalConstants from '../../shared/portal/js/constants'
import PortalUtils from '../../shared/portal/js/utils'
import PortalRendererConstants from '../constants'
import ComponentWrapper from './component-wrapper'

const PORTAL_ORIGIN_URL = 'https://gateway.wifast.com'

/*
 * Portal Page Body.
 */
export default class PortalPageBody extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = {
      contactInfo: null,
      birthDay: null,
      birthMonth: null,
      tosChecked: false,
      portalHostName: this.props.preview || this.props.editor ? '' : (this.props.portalHostname || PORTAL_ORIGIN_URL),
      textFieldError: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.portalHostName !== nextProps.portalHostName) {
      this.setState({
        portalHostName: nextProps.preview ? '' : (nextProps.portalHostname || PORTAL_ORIGIN_URL)
      })
    }

    // only accept the error as a text field error if the level is 'error' (user error)
    if (nextProps.error !== null && nextProps.error.level === 'error' && !_.isEqual(this.state.textFieldError, nextProps.error)) {
      this.setState({
        textFieldError: nextProps.error
      })
    }

    // Clear any text field error on page change
    if (!_.isEqual(this.props.pageData.id, nextProps.pageData.id)) {
      this.setState({
        textFieldError: null
      })
    }
  }

  componentDidMount = () => {
    this.updateContentHeight()

    $('.additional-message-img').load((e) => {
      this.imageLoadHandler(e)
    })

    window.addEventListener('resize', _.debounce(this.handleResize, 100))
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.pageData, this.props.pageData)) {
      this.updateContentHeight()

      $('.additional-message-img').load((e) => {
        this.imageLoadHandler(e)
      })
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  /*
   * Ensure that the portal content container fills the entire page body height
   */
  updateContentHeight() {
    const pageBody = $(this.getRef('pageBody'))
    const content = $(this.getRef('content'))

    // Reset content to { height: 'auto' } so that we can make a height comparison to get the max
    content.css({
      height: 'auto'
    })

    content.css({
      height: Math.max(pageBody.innerHeight(), content.outerHeight())
    })
  }

  /*
   * Handle images that load after the componentDidMount or componentDidUpdate event
   */
  imageLoadHandler(e) {
    const target = $(e.target)

    target.unbind('load')
    this.updateContentHeight()
  }

  render() {
    const pageData = this.props.pageData
    let className = this.getClassName()
    let body = null

    if (pageData) {
      className = ClassNames(this.getClassName(), pageData.id, {
        preview: this.props.preview
      })

      switch (pageData.id) {
        case PortalConstants.pages.landing:
          body = this.renderLanding()
          break
        case PortalConstants.pages.login:
          body = this.renderLogin()
          break
        case PortalConstants.pages.emailLogin:
          body = this.renderFormFieldEmailLogin()
          break
        case PortalConstants.pages.phoneLogin:
          body = this.renderFormFieldMobileLogin()
          break
        case PortalConstants.pages.online:
          body = this.renderOnline()
          break
        case PortalConstants.pages.returning:
          body = this.renderReturning()
          break
        default:
          return null
      }
    }

    return (
      <div
        ref={(ref) => this.setRef('pageBody', ref)}
        className={className}
      >
        {body}
      </div>
    )
  }

  renderPage(components) {
    const types = PortalConstants.contentTypes
    const theme = this.props.theme
    const backgroundAssetId = theme.background && theme.background.assetId
    const backgroundImage = backgroundAssetId
        ? 'url(' + this.getAssetUrl(backgroundAssetId) + ')'
        : null
    const pageStyle = CommonUtils.deepExtend(CommonUtils.parseStyle(theme.background.style), {
      backgroundImage
    })
    let pageContentClassName = null
    let hasLogo = false
    let dom = _.map(components, (key) => {
      const type = types[key]
      let component = null

      switch (type) {
        case types.logo:
          hasLogo = true
          component = this.renderLogo(type, key)
          break
        case types.headline:
        case types.body:
        case types.link:
        case types.button:
          component = this.renderContent(type, key)
          break
        case types.tos:
          component = this.renderTos(type, key)
          break
        case types.tosCheckbox:
          component = this.renderTosCheckbox(type, key)
          break
        case types.consent:
          component = this.renderConsent(type, key)
          break
        case types.displayName:
          component = this.renderDisplayName(type, key)
          break
        case types.channels:
          component = this.renderChannels(type, key)
          break
        case types.formField:
          component = this.renderFormField(type, key)
          break
        case types.birthday:
          component = this.renderBirthday(type, key)
          break
        case types.social:
          component = this.renderSocial(type, key)
          break
        case types.additionalMessaging:
          component = this.renderAdditionalMessaging(type, key)
          break
        case types.skipButton:
          component = this.renderSkipButton(type, key)
          break
        default:
          break
      }

      if (this.props.edit) {
        // renderBirthday handles its own componentWrapper logic because it is an edge case
        if (type !== types.birthday) {
          component = this.renderComponentWrapper(component, type, key)
        }
      }

      return component
    })

    pageContentClassName = ClassNames('portal-content', {
      'has-logo': hasLogo
    })

    return (
      <div
        ref={(ref) => this.setRef('content', ref)}
        className={pageContentClassName}
        style={pageStyle}
      >
        {dom}
      </div>
    )
  }

  /*
   * Component Wrapper Renderer
   * If this.props.edit === true (edit mode is on), render a
   * ComponentWrapper around each editable component
   */
  renderComponentWrapper(component, type, key) {
    const types = PortalConstants.contentTypes
    const editableTypes = [
      types.headline,
      types.body,
      types.formField,
      types.button,
      types.additionalMessaging,
      types.link,
      types.logo,
      types.channels,
      types.social
    ]
    const showComponentWrapper = _.contains(editableTypes, type)
    const pageData = this.props.pageData || {}
    let dom = component

    if (component && showComponentWrapper) {
      const isAdditionalMessaging = type === types.additionalMessaging
      const isChannels = type === types.channels
      let componentList = null

      if (isAdditionalMessaging || isChannels) {
        // AdditionalMessaging and Channel are an array of objects
        componentList = component
      } else {
        // The remaining components are a single object, so we convert them into a list
        componentList = [component]
      }

      dom = _.map(componentList, (singleComponent, index) => {
        const context = this.getContext(type, key, index)

        return !_.isEmpty(singleComponent)
          ? (<ComponentWrapper
              type={type}
              index={index}
              context={context}
              onMouseEnter={_.partial(this.props.onMouseEnter, context)}
            >
              {singleComponent}
            </ComponentWrapper>)
          : null
      })
    }

    return dom
  }

  /* Page Renderers */

  renderLanding() {
    return this.renderPage([
      'logo',
      'headline',
      'body',
      'tos',
      'goButton',
      'additionalMessaging'
    ])
  }

  renderLogin() {
    return this.renderPage([
      'headline',
      'body',
      'channels'
    ])
  }

  renderFormFieldEmailLogin() {
    return this.renderPage([
      'headline',
      'body',
      'formField',
      'connectButton',
      'backButton'
    ])
  }

  renderFormFieldMobileLogin() {
    return this.renderPage([
      'headline',
      'body',
      'formField',
      'tosCheckbox',
      'connectButton',
      'skipButton',
      'consent'
    ])
  }

  renderOnline() {
    return this.renderPage([
      'logo',
      'headline',
      'body',
      'birthday',
      'social',
      'additionalMessaging',
    ])
  }

  renderReturning() {
    return this.renderPage([
      'logo',
      'headline',
      'displayName',
      'body',
      'tos',
      'returnConnectButton',
      'notButton',
      'additionalMessaging'
    ])
  }

  /* Component Renderers */

  /*
   * Renders a content component with theme and WYSIWYG styles
   * @param String component type
   * @param String component key
   * @return JSX content component
   */
  renderContent(type, key) {
    const content = this.props.pageData[key] || {}
    const dontRender = !_.isUndefined(content.render) && !content.render
    const contentClassName = ClassNames(
      'inline-content',
      dasherize(decapitalize(type)),
      dasherize(decapitalize(key))
    )
    const context = this.getContext(type, key)
    const hideInlineContent = this.isComponentInlineAndBeingEdited(context)
    const style = CommonUtils.deepExtend(
      CommonUtils.parseStyle(PortalUtils.getThemeData(type, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle(content.style)), {
        visibility: hideInlineContent ? 'hidden' : 'visible'
      }
    )
    const disabledInteraction = this.isInteractionDisabled()

    if (dontRender) {
      return null
    } else {
      let eventHandler
      let disabled

      switch (key) {
        case 'goButton':
          eventHandler = this.props.onGoOnlineButtonClick
          break
        case 'backButton':
          eventHandler = this.props.onBackButtonClick
          break
        case 'connectButton':
          if (this.props.onConnectButtonClick) {
            eventHandler = _.partial(this.props.onConnectButtonClick, this.state.contactInfo)
          }
          if (this.props.pageData.id === PortalConstants.pages.phoneLogin) {
            disabled = !this.state.tosChecked
            if (disabled) {
              eventHandler = null
            }
          }
          break
        case 'returnConnectButton':
          eventHandler = this.props.onReturnConnectButtonClick
          break
        case 'notButton':
          eventHandler = this.props.onNotYouButtonClick
          break
        case 'headline':
        case 'body':
          if (!this.props.edit && this.isEmptyText(content.text)) {
            style.display = 'none'
          }
          break
        default:
          break
      }

      if (disabledInteraction) {
        eventHandler = _.noop
      }

      return (
        <div
          className={contentClassName}
          style={style}
          dangerouslySetInnerHTML={{__html:content.text}}
          onClick={eventHandler}
          disabled={disabled}
        />
      )
    }
  }

  renderChannels() {
    const pageData = this.props.pageData
    const channels = _.map(pageData.channels, (channel, index) => {
      const theme = PortalUtils.getThemeData(PortalConstants.contentTypes.button, this.props.theme)
      const style = CommonUtils.deepExtend(
        CommonUtils.parseStyle(theme),
        this.filterStyles(CommonUtils.parseStyle(channel.style))
      )
      const buttonClassName = ClassNames('button-channel', channel.id)
      let text = channel.text
      let eventHandler
      let icon

      if (this.props.hideSms && channel.id === 'mobile') {
        return null
      }

      if (!channel.render) {
        return null
      }

      switch (channel.id) {
        case PortalRendererConstants.channels.facebook:
          icon = <i className='fa fa-facebook'/>
          eventHandler = this.props.onFacebookLoginButtonClick
          break
        case PortalRendererConstants.channels.email:
          icon = <i className='fa fa-envelope'/>
          eventHandler = this.props.onEmailLoginButtonClick
          break
        case PortalRendererConstants.channels.mobile:
          icon = <i className='fa fa-phone'/>
          eventHandler = this.props.onSmsLoginButtonClick
          break
        case PortalRendererConstants.channels.anonymous:
          eventHandler = this.props.onConnectAnonymouslyButtonClick
          break
        default:
          return; // Skip any unrecognized buttons
      }

      if (icon != null) {
        icon = ReactDOMServer.renderToString(icon)
      } else {
        icon = ''
      }
      if (_.isUndefined(text)) {
        text = PortalConstants.defaultValues.buttonText[channel.id]
      }

      return (
        <button
          className={buttonClassName}
          style={style}
          key={index}
          onClick={eventHandler}
          dangerouslySetInnerHTML={{__html: icon + text}}
        />
      )
    })

    return channels
  }

  renderFormField() {
    const pageData = this.props.pageData
    const textFieldClassName = ClassNames({
      dark: this.props.theme.formFields === 'dark',
      error: this.state.textFieldError !== null
    })
    let placeholder = ''

    if (pageData.id === PortalConstants.pages.emailLogin) {
      placeholder = PortalRendererConstants.placeholders.email
    } else if (pageData.id === PortalConstants.pages.phoneLogin) {
      placeholder = PortalRendererConstants.placeholders.phone
    }

    return (
      <FloatingLabelTextField
        onChange={this.onTextFieldChange}
        key={PortalConstants.pages[pageData.id]}
        name={PortalConstants.pages[pageData.id]}
        className={textFieldClassName}
        label={pageData.formField.label}
        placeholder={placeholder}
        onFocus={this.onTextFieldFocus}
      />
    )
  }

  onTextFieldChange = (event) => {
    this.setState({
      contactInfo: event.currentTarget.value
    })
  }

  onTextFieldFocus = () => {
    this.props.onTextFieldFocus && this.props.onTextFieldFocus()
    this.setState({
      textFieldError: null
    })
  }

  getContext(type, key, index) {
    const types = PortalConstants.contentTypes
    const pageData = this.props.pageData
    const isAdditionalMessaging = (type === types.additionalMessaging)
    const isChannels = (type === types.channels)
    const isSocial = (type === types.social)
    const isBirthday = (type === types.birthday)
    const component = pageData[key]
    const context = {
      page: pageData.id,
      key,
      inline: this.isInline(type)
    }

    if (!_.isEmpty(component)) {
      if (isAdditionalMessaging) {
        const setting = component[index].setting

        context.setting = setting
        context.index = index
        context.inline = this.isInline(setting)
      } else if (isChannels) {
        context.index = index
      } else if (isSocial || isBirthday) {
        context.inline = true
      }
    }

    return context
  }

  renderAdditionalMessaging(type, key) {
    const pageData = this.props.pageData
    const messageTypes = PortalConstants.messageTypes

    return _.map(pageData.additionalMessaging, (message, index) => {
      const dontRender = !message.render
      const context = this.getContext(type, key, index)
      let dom = null

      switch(message.setting) {
        case messageTypes.image:
          dom = this.renderAdditionalMessagingImage(message)
          break
        case messageTypes.text:
          dom = this.renderAdditionalMessagingText(message, context)
          break
        default:
          break
      }

      return !dontRender ? dom : null
    })
  }

  renderAdditionalMessagingImage(message) {
    const hyperlink = message.image && message.image.hyperlink
    const className = ClassNames('message', 'portal-image', {
      'is-link': !_.isEmpty(hyperlink)
    })
    const assetId =  !_.isUndefined(message.image) ? message.image.assetId : ''
    const imageMargin = '20px'
    let containerStyle = {}
    let imageStyle = !_.isUndefined(message.image)
      ? CommonUtils.parseStyle(message.image.style)
      : {}

    if (this.props.editor && !this.props.preview && (_.isEmpty(assetId) || !message.render)) {
      return this.renderImageImportZone()
    }

    // Separate container and image styles
    if (!_.has(imageStyle, 'textAlign')) {
      containerStyle.textAlign = 'center'
    } else {
      containerStyle.textAlign = imageStyle.textAlign
      imageStyle = _.omit(imageStyle, 'textAlign')
    }

    containerStyle.marginTop = imageMargin
    containerStyle.marginBottom = imageMargin
    containerStyle.backgroundColor = imageStyle.backgroundColor
    imageStyle = _.omit(imageStyle, 'backgroundColor')

    return (
      <div
        className={className}
        style={containerStyle}
        onClick={_.partial(this.onClickMessage, hyperlink)}
      >
        <img
          className='additional-message-img'
          src={this.getAssetUrl(assetId)}
          style={imageStyle}
        />
      </div>
    )
  }

  renderAdditionalMessagingText(message, context) {
    const hideInlineContent = this.isComponentInlineAndBeingEdited(context)
    const className = ClassNames('message', 'inline-content')
    const emptyText = this.isEmptyText(message.text ? message.text.value : message.text)
    const isHovering = !_.isNull(this.props.editorContext) && this.props.editorContext.mouseover
    let style = !_.isUndefined(message.text) ? CommonUtils.deepExtend({},
      CommonUtils.parseStyle(PortalUtils.getThemeData(PortalConstants.contentTypes.body, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle(message.text.style)), {
        visibility: hideInlineContent ? 'hidden' : 'visible'
      })
      : {}
    let text = emptyText
      ? this.getAdditionalMessagingPlaceholderText(PortalConstants.placeholders.additionalMessagingText, hideInlineContent)
      : message.text.value

    if (!_.has(style, 'padding')) {
      style.padding = '20px'
    }

    // Placeholder specific styling
    if (emptyText) {
      style = {
        padding: '10px'
      }
    }

    // Show the placeholder text if the text is empty and the editor is active.
    if ((hideInlineContent && emptyText) || (!hideInlineContent && isHovering)) {
      style.visibility = 'visible'
    }

    // Hide empty space on the live portal if there's no text
    if (!this.props.edit && emptyText) {
      style.display = 'none'
    }

    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{__html: text}}
      >
      </div>
    )
  }

  renderBirthday(type, key) {
    const types = PortalConstants.contentTypes
    const birthday = this.props.pageData.birthday
    const notOnPortal = !this.props.editor && !this.props.preview
    const dontRender = !birthday.render || (notOnPortal && !this.props.renderBirthday)
    let component = null

    if (!_.isEmpty(birthday) && !dontRender) {
      const birthdayStyle = this.filterStyles(CommonUtils.parseStyle(birthday.style))
      const bodyContext = this.getContext(types.birthdaySubhead, 'birthdaySubhead')
      const fields = this.renderBirthdayFields()
      let body = this.renderBirthdayBody(birthday, bodyContext)
      let button = this.renderBirthdayButton(birthday.button)

      if (this.props.edit) {
        body = this.renderComponentWrapper(body, types.birthdaySubhead, 'birthdaySubhead')
        button = this.renderComponentWrapper(button, types.button, 'birthdayButton')
      }

      component = (
        <div className='birthday-section' style={birthdayStyle}>
          {body}
          {fields}
          {button}
        </div>
      )
    }

    return component
  }

  renderBirthdayBody(birthday, context) {
    const hideInlineContent = this.isComponentInlineAndBeingEdited(context)
    const [stylePath, textPath] = this.getCompatibleSocialFields(birthday)
    const bodyStyle = CommonUtils.deepExtend({},
      CommonUtils.parseStyle(PortalUtils.getThemeData(PortalConstants.contentTypes.body, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle(ObjectPath.get(birthday, stylePath))), {
        visibility: hideInlineContent ? 'hidden' : 'visible'
      }
    )

    return (
      <div
        className='inline-content'
        style={bodyStyle}
        dangerouslySetInnerHTML={{__html: ObjectPath.get(birthday, textPath)}}
      />
    )
  }

  renderBirthdayFields() {
    const textFieldClassName = ClassNames({
      dark: this.props.theme.formFields === 'dark',
      error: this.state.textFieldError !== null
    })

    return (
      <div className='birthday-fields'>
        <FloatingLabelTextField
          onChange={this.onBirthMonthChange}
          label='Month (MM)'
          name='bday-month'
          type='text'
          className={textFieldClassName}
          onFocus={this.props.onTextFieldFocus}
        />
        <FloatingLabelTextField
          onChange={this.onBirthDayChange}
          label='Day (DD)'
          name='bday-day'
          type='text'
          className={textFieldClassName}
          onFocus={this.props.onTextFieldFocus}
        />
      </div>
    )
  }

  renderBirthdayButton(button) {
    const style = CommonUtils.deepExtend({},
      CommonUtils.parseStyle(PortalUtils.getThemeData(PortalConstants.contentTypes.button, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle(button.style)))
    const className = ClassNames('inline-content', 'button', 'birthday-button')
    let eventHandler

    if (this.props.onOnlineSubmitButtonClick) {
      eventHandler = _.partial(this.props.onOnlineSubmitButtonClick, this.state.birthDay, this.state.birthMonth)
    }

    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{__html:button.text}}
        onClick={eventHandler}
      />
    )
  }

  onBirthDayChange = (event) => {
    this.setState({
      birthDay: event.currentTarget.value
    })
  }

  onBirthMonthChange = (event) => {
    this.setState({
      birthMonth: event.currentTarget.value
    })
  }

  renderSocial(type, key) {
    const social = this.props.pageData.social
    const context = this.getContext(type, key)
    const hideInlineContent = this.isComponentInlineAndBeingEdited(context)
    const [stylePath, textPath] = this.getCompatibleSocialFields(social)
    const bodyStyle = CommonUtils.deepExtend({},
      CommonUtils.parseStyle(PortalUtils.getThemeData(PortalConstants.contentTypes.body, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle(ObjectPath.get(social, stylePath))), {
        visibility: hideInlineContent ? 'hidden' : 'visible'
      }
    )
    const socialStyle = this.filterStyles(CommonUtils.parseStyle(social.style))
    const buttons = _.map(social.channels, (id, channel) => {
      const socialClassName = ClassNames('button-social', channel)
      const iconClassName = 'fa fa-' + channel
      const socialLink = !this.isInteractionDisabled()
        ? CommonUtils.generateSocialLink(channel, id)
        : null

      if (!social.channelStatus[channel]) {
        return null
      }

      return <a href={socialLink} className={socialClassName}>
        <i className={iconClassName}/>
      </a>
    })
    const dontRender = !_.filter(social.channelStatus, (channel) => {
      return channel
    }).length

    return !_.isEmpty(social) && !dontRender ? (
      <div className='social-section' style={socialStyle}>
        <div
          className='inline-content'
          style={bodyStyle}
          dangerouslySetInnerHTML={{__html: ObjectPath.get(social, textPath)}}
        />
        <div className='buttons-container'>{buttons}</div>
      </div>
    ) : null
  }

  renderTos() {
    const termsUrl = this.getTermsUrl()
    const privacyUrl = this.getPrivacyUrl()
    const tosStyle = this.getTosStyle()
    const linkColor = this.getTosLinkColor()
    const linkStyle = linkColor ? {color: linkColor} : {}
    const goButtonTextPath = this.props.pageData.id === PortalConstants.pages.landing
      ? 'goButton.text'
      : 'returnConnectButton.text'
    const goButtonText = ObjectPath.get(this.props.pageData, goButtonTextPath) || ''
    const clickingText = this.renderClickingText(goButtonText)
    const termsText = this.renderTermsText()
    const privacyText = this.renderPrivacyText()
    
    return (
      <p className='tos-text' style={tosStyle}>
        {clickingText}<br/>
        <a href={termsUrl} title='Terms of Use' style={linkStyle}>{termsText}</a>
        &nbsp;&&nbsp;
        <a href={privacyUrl} title='Privacy Policy' style={linkStyle}>{privacyText}</a>
      </p>
    )
  }

  renderSkipButtonText() {
    switch (this.props.language) {
    case 'spanish':
      return 'Regresar'
    case 'french':
      return 'Précédent'
    case 'english':
    default:
      return 'Back'
    }
  }
  renderSkipButton() {
    const disabledInteraction = this.isInteractionDisabled()
    const types = PortalConstants.contentTypes
    const text = this.renderSkipButtonText()
    const disabled = false
    // Need to add padding styling that comes from default portal template for other buttons/links
    const style = CommonUtils.deepExtend(
      CommonUtils.parseStyle(PortalUtils.getThemeData(types.link, this.props.theme)),
      this.filterStyles(CommonUtils.parseStyle('padding: 0;'))
    )
    const contentClassName = ClassNames(
      'inline-content',
      dasherize(decapitalize(types.link)),
      dasherize(decapitalize('backButton'))
    )
    const eventHandler = disabledInteraction ? _.noop : this.props.onBackButtonClick

    return (
      <div
        className={contentClassName}
        style={style}
        dangerouslySetInnerHTML={{__html:text}}
        disabled={disabled}
        onClick={eventHandler}
      />
    )
  }
  
  renderClickingText(buttonText) {
    const htmlRegex = /(<([^>]+)>)/gi

    buttonText = buttonText.replace(htmlRegex, '')

    switch (this.props.language) {
      case 'spanish':
        return 'Al hacer clic en “' + buttonText + '”, usted acepta nuestros'
      case 'french':
        return 'En cliquant sur "' + buttonText + '" vous acceptez nos'
      case 'english':
      default:
        return 'By clicking "' + buttonText + '", you agree to our'
    }
  }

  renderTermsText() {
    switch (this.props.language) {
      case 'spanish':
        return 'Términos y Condiciones'
      case 'french':
        return 'Conditions d’utilisation'
      case 'english':
      default:
        return 'Terms of Use'
    }
  }

  renderPrivacyText() {
    switch (this.props.language) {
      case 'spanish':
        return 'Política de Privacidad.'
      case 'french':
        return 'Politique de confidentialité.'
      case 'english':
      default:
        return 'Privacy Policy.'
    }
  }

  renderTosCheckbox() {
    const termsUrl = this.getTermsUrl()
    const privacyUrl = this.getPrivacyUrl()
    const tosStyle = this.getTosStyle()
    const linkColor = this.getTosLinkColor()
    const backgroundColor = CommonUtils.parseStyle(this.props.theme.buttons).backgroundColor || 'inherit'
    const checkboxStyle = this.state.tosChecked && linkColor ? { backgroundColor: backgroundColor } : {}
    const linkStyle = linkColor ? {color: linkColor} : {}

    return (
      <div className='sms-tos-text'>
        <label style={tosStyle}>
          <input
            type='checkbox'
            checked={this.state.tosChecked}
            style={checkboxStyle}
            onChange={this.onTosChecked}
          />
          Send me text message offers and promotions.*<br/>
          By clicking 'Agree & Continue', you further agree to our&nbsp;
          <a href={termsUrl} title='Terms of Use' style={linkStyle}>Terms of Use</a> &amp;&nbsp;
          <a href={privacyUrl} title='Privacy Policy' style={linkStyle}>Privacy Policy</a>.
        </label>
      </div>
    )
  }

  renderConsent() {
    const smsPath = true
    const termsUrl = this.getTermsUrl(smsPath)
    const affiliatesUrl = this.getAffiliatesUrl()
    const tosStyle = this.getTosStyle()
    const linkColor = this.getTosLinkColor()
    const linkStyle = linkColor ? {color: linkColor} : {}
    const businessName = _.isEmpty(this.props.businessName) ? 'company' : this.props.businessName

    return (
      <div className='consent-text' style={tosStyle}>
        <p>
          *Consent: I <a href={termsUrl} title='electronically agree' style={linkStyle}>electronically agree</a> that&nbsp;
          {businessName}, its <a href={affiliatesUrl} style={linkStyle}>affiliates</a>, or their&nbsp;
          agents may use automated means to text me with offers to the phone number I entered&nbsp;
          above. I understand that enrollment is not required to use {businessName} services.
        </p>
        <p>
          Message frequency varies. Message and data rates may apply. Text <strong>HELP</strong> to&nbsp;
          <strong>54269</strong> for help. Text <strong>STOP</strong> to <strong>54269</strong> to
          cancel. Supported carriers: AT&T, Boost Mobile, T-Mobile, Metro PCS, Verizon Wireless,
          Sprint, U.S. Cellular, NTelos, Cricket, and Virgin Mobile.
        </p>
        <p>
          T-Mobile is not liable for delayed or undelivered messages.
        </p>
      </div>
    )
  }

  /*
   * Renders the display name of a returning user
   * @param String component type
   * @param String component key
   * @return JSX content component
   */
  renderDisplayName(type, key) {
    // ZENREACH-2613 - Suppress display name iff user explicitly says don't show it
    // FYI: True is default for these setting so if not set (i.e. null) keep these settings enabled 
    if (this.props.pageData.showDisplayName === false) {
      return null
    }

    const theme = PortalUtils.getThemeData(PortalConstants.contentTypes.body, this.props.theme)
    const style = CommonUtils.deepExtend({}, CommonUtils.parseStyle(theme), {
      textAlign: 'center'
    })
    const previewDisplayName = 'Alex Miller'
    const displayName = this.props.preview ? previewDisplayName : this.props.displayName

    return !_.isEmpty(displayName)
      ? (<div className={'display-name'} style={style}>
          ({displayName})
        </div>)
      : null
  }

  renderLogo() {
    const logo = this.props.pageData.logo
    const backgroundImage = logo.assetId
        ? 'url(' + this.getAssetUrl(logo.assetId) + ')'
        : null
    const logoStyle = CommonUtils.deepExtend(CommonUtils.parseStyle(logo.style), {
      backgroundSize: logo.scale,
      backgroundImage
    })
    const disableHyperlink = this.isInteractionDisabled() || _.isEmpty(logo.hyperlink)
    const hyperlink = disableHyperlink ? '' : logo.hyperlink
    const className = 'logo-image' + (disableHyperlink ? '' : ' message is-link')
    const dontRender = !_.isUndefined(logo.render) && !logo.render

    if (this.props.editor && !this.props.preview && dontRender) {
      return this.renderImageImportZone()
    } else if (dontRender) {
      return null
    }

    return (
      <div 
        className={className}
        style={logoStyle}
        onClick={_.partial(this.onClickMessage, hyperlink)}
      >
      </div>
    )
  }

  renderImageImportZone() {
    return (
      <div className='logo-image no-image'>
        <div className='import-zone'>
          <div className='empty'>
            <div className='logo'/>
            <div className='text'><em>Add Image</em></div>
            <div className='text'>This component will not appear if you decided not to add an image.</div>
          </div>
        </div>
      </div>
    )
  }

  /*
   * Filters the React inline styles object to remove disallowed style properties.
   * @param Object styles
   * @param Array filter keys of what should be kept
   * @return Object filteredStyles
   */
  filterStyles(styles, filter = PortalRendererConstants.allowedStyles.all) {
    let filteredStyles = {}

    _.mapObject(styles, (val, key) => {
      if (_.indexOf(filter, key) !== -1) {
        filteredStyles[key] = val
      }
    })

    return filteredStyles
  }

  /*
   * @param String hyperlink, URL to navigate to
   */
  onClickMessage(hyperlink) {
    if (hyperlink) {
      window.location = hyperlink
    }
  }

  onTosChecked = (event) => {
    this.setState({
      tosChecked: event.target.checked
    })
  }

  /*
   * @param String, a string constant representing the component type
   */
  isInline(inlineType) {
    const types = PortalConstants.contentTypes
    const inlineTypes = [
      types.headline,
      types.body,
      PortalConstants.messageTypes.text,
      types.subhead
    ]

    return _.contains(inlineTypes, inlineType)
  }

  /*
   * Return true if the given component is being currently edited AND is an inline component
   * @param Object, the context of the given component
   */
  isComponentInlineAndBeingEdited(context) {
    const editorContext = this.props.editorContext

    return _.isMatch(editorContext, context) && editorContext.isInlineEditor
  }

  /*
   * Checks if in the editor or preview contexts.
   * @return {Bool}
   */
  isInteractionDisabled = () => {
    return this.props.preview || this.props.editor
  }

  /*
   * Generate a portal asset URL for the current environment and repository
   */
  getAssetUrl(assetId) {
    return PortalUtils.getAssetUrl(assetId, this.props.assetApiPath, this.state.portalHostName)
  }

  /*
   * @param {Boolean} isSmsLink
   */
  getTermsUrl = (isSmsLink = false) => {
    const sidParam = this.getSidParam()
    const smsPath = isSmsLink ? 'sms/' : ''
    const languageParam = this.getLanguageParam(sidParam)

    if (this.isInteractionDisabled()) {
      return null
    }

    return this.state.portalHostName + '/terms/' + smsPath + sidParam + languageParam
  }

  getAffiliatesUrl = () => {
    const sidParam = this.getSidParam()
    const languageParam = this.getLanguageParam(sidParam)

    if (this.isInteractionDisabled()) {
      return null
    }

    return this.state.portalHostName + '/terms/sms/affiliates' + sidParam + languageParam
  }

  getPrivacyUrl = () => {
    const sidParam = this.getSidParam()
    const languageParam = this.getLanguageParam(sidParam)

    if (this.isInteractionDisabled()) {
      return null
    }

    return this.state.portalHostName + '/privacy/' + sidParam + languageParam
  }

  getSidParam = () => {
    return (this.props.sessionId ? '?sid=' + this.props.sessionId : '')
  }

  getLanguageParam = (sidParam) => {
    if (!this.props.language) {
      return ''
    } else {
      return (sidParam ? '&' : '?') + 'language=' + this.props.language 
    }
  }

  getTosStyle = () => {
    return {
      color: CommonUtils.parseStyle(this.props.theme.bodyText).color || 'inherit'
    }
  }

  getTosLinkColor = () => {
    return CommonUtils.parseStyle(this.props.theme.textLinks).color
  }

  /*
   * Generates a quill compatible placeholder text. React Quill does not currently support placeholders.
   * @param {String} text
   * @param {Boolean} hideInlineContent flag to render placeholder or not (make transparent)
   */
  getAdditionalMessagingPlaceholderText(text, hideInlineContent) {
    const color = hideInlineContent || _.isUndefined(hideInlineContent) ? '#ccc' : 'transparent'

    return '<p style="text-align: center; font-size: 14px; color: ' + color + ';">' + text + '</p>'
  }

  /*
   * For backwards compatability. The online page formerly read from the 'subhead' field.
   * @retun {Array}
   */
  getCompatibleSocialFields = (pageData) => {
    const subheadStylePath = 'subhead.style'
    const subheadTextPath = 'subhead.text'
    const subheadExists = ObjectPath.get(pageData, subheadTextPath)
    const stylePath = subheadExists ? subheadStylePath : 'body.style'
    const textPath = subheadExists ? subheadTextPath : 'body.text'

    return [stylePath, textPath]
  }

  /*
   * Checks if a quill text (i.e. with html tags) is empty or not.
   * @param {String} text potentially wrapped in html tags
   */
  isEmptyText(text) {
    if (_.isUndefined(text)) {
      return true
    }

    return !PortalUtils.getTextCharacterCount(text)
  }

  handleResize = () => {
    this.updateContentHeight()
  }
}

PortalPageBody.propTypes = {
  pageData: React.PropTypes.object.isRequired,
  theme: React.PropTypes.object.isRequired,
  edit: React.PropTypes.bool,
  editor: React.PropTypes.bool,
  preview: React.PropTypes.bool,
  hideSms: React.PropTypes.bool,
  editorContext: React.PropTypes.object,
  businessName: React.PropTypes.string,
  language: React.PropTypes.string,
  onMouseEnter: React.PropTypes.func
}

PortalPageBody.defaultProps = {
  hideSms: false,
  language: 'english'
}
