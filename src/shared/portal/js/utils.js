/* Commmon code duplicated from Wifast-Base.
 * - portal/js/utils.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

import _ from 'underscore'
import startsWith from 'underscore.string/startsWith'
import CommonUtils from '../../common/js/utils'
import PortalConstants from './constants'

export default class Utils {
  /*
   * @param {Object} Current page Id
   * @param {Array} Array of all pages
   * @return {Object} Page data for the current rendered page
   */
  static getPageData(pageId, pages) {
    return _.findWhere(pages, {id: pageId})
  }

  /*
   * @param {Object} The context containing a {key, index} of the requested component
   * @param {Object} Current page data
   * @return {Object} Component data for the current rendered page
   */
  static getComponentData(context, pageData) {
    if (context) {
      const types = PortalConstants.contentTypes
      const key = context.key
      const isAdditionalMessage = types[key] === types.additionalMessaging
      const isChannels = types[key] === types.channels
      const isBirthday = startsWith(key, 'birthday')
      let componentData = pageData[key] || {}

      if (isAdditionalMessage || isChannels) {
        componentData = !_.isEmpty(componentData) && componentData[context.index]
      } else if (isBirthday) {
        const birthday = pageData[types.birthday] || {}

        if (key === 'birthdaySubhead') {
          if (this.subheadExists(birthday)) {
            componentData = birthday[types.subhead]
          } else {
            componentData = birthday[types.birthdaySubhead]
          }
        } else if (key === 'birthdayButton') {
          componentData = birthday[types.button]
        }
      }

      return componentData
    } else {
      return null
    }
  }

  /*
   * @param {Object} The context containing a {key, index} of the requested component
   * @return {string} The content type of the requested component
   */
  static getComponentType(context) {
    return PortalConstants.contentTypes[context.key]
  }

  /*
   * @param {Object} The context containing a {key, index} of the requested component
   * @param {Object} The new component data
   * @param {Object} Current page data
   * @return {Object} Page data containing the current rendered page with the updated component
   */
  static setComponentData(context, data, pageData) {
    const types = PortalConstants.contentTypes
    const key = context.key
    const isAdditionalMessage = types[key] === types.additionalMessaging
    const isChannels = types[key] === types.channels
    const isBirthday = startsWith(key, 'birthday')

    pageData = CommonUtils.deepExtend({}, pageData)

    if (isAdditionalMessage) {
      pageData[key][context.index] = data
    } else if (isChannels) {
      const channels = pageData[key]

      if (channels) {
        channels[context.index] = data
      }
    } else if (isBirthday) {
      const birthday = pageData[types.birthday] || {}

      if (key === 'birthdaySubhead') {
        if (this.subheadExists(pageData.birthday)) {
          birthday[types.subhead] = data
        } else {
          birthday[types.birthdaySubhead] = data
        }
      } else if (key === 'birthdayButton') {
        birthday[types.button] = data
      }
    } else {
      pageData[key] = data
    }

    return pageData
  }

  /*
   * @param {String} A type of component
   * @return {String} CSS stylestring for the requested component type
   */
  static getThemeData(type, theme) {
    const componentThemeMap = {
      headline: 'headlines',
      body: 'bodyText',
      button: 'buttons',
      link: 'textLinks'
    }

    return theme[componentThemeMap[type]] || null
  }

  /*
   * @param {$jQuery DOM reference} element
   * @return {Object}
   */
  static calculateLayout(element) {
    const position = element.position()
    const scrollTop = element.scrollTop()
    const layout = {
      height: element.height(),
      width: element.width(),
      top: position.top + scrollTop,
      left: position.left,
      offset: element.offset()
    }

    return layout
  }

  /*
   * The inline/popover editors take in a component with props (a React component).
   * Since the portal editor works differently from other composers, we use this method to
   * manually construct a component to match the expected component format.
   * @param {Object} The context containing a {key, index} of the component
   * @param {Object} Current page data
   * @param {Object} Portal theme styles
   */
  static prepareComponentForEditor(context, pageData, themeConfig) {
    const types = PortalConstants.contentTypes
    const key = context.key
    const type = this.getComponentType(context)
    const component = {}
    const isAdditionalMessaging = types[key] === types.additionalMessaging
    const isSocial = types[key] === types.social
    const isBirthday = types[key] === types.birthday
    let componentData = this.getComponentData(context, pageData)
    let theme = this.getThemeData(type, themeConfig)
    let props = {}
    let style = null

    if (isAdditionalMessaging) {
      theme = this.getThemeData(types.body, themeConfig)
    } else if (isSocial || isBirthday) {
      theme = this.getThemeData(types.body, themeConfig)
    }

    style = CommonUtils.deepExtend({},
      CommonUtils.parseStyle(theme),
      CommonUtils.parseStyle(componentData.style)
    )

    switch (type) {
      case types.channels:
      case types.button:
        props = {
          defaultBackgroundColor: CommonUtils.parseStyle(theme).backgroundColor,
          backgroundColor: style.backgroundColor || null,
          style: _.omit(style, 'backgroundColor'),
          text: componentData.text
        }
        break
      case types.headline:
      case types.subhead:
      case types.body:
        props = {
          text: componentData.text,
          style: CommonUtils.deepExtend({ padding: 0 }, style)
        }
        break
      case types.additionalMessaging:
        const textStyles = componentData.text ? CommonUtils.parseStyle(componentData.text.style) : {}
        const backgroundColor = textStyles.backgroundColor

        if (context.isInlineEditor) {
          props = {
            text: !_.isUndefined(componentData.text) ? componentData.text.value : '',
            style: CommonUtils.deepExtend({},
              {
                padding: '20px'
              },
              {backgroundColor},
              style
            ),
            context
          }
        } else if (context.isStyleEditor) {
          props = {
            backgroundColor: backgroundColor
          }
        } else if (context.isPopoverEditor) {
          const imageProps = !_.isUndefined(componentData.image) ? componentData.image : {}
          const imageStyles = CommonUtils.parseStyle(imageProps.style)

          props = {
            backgroundColor: imageStyles.backgroundColor,
            backgroundPosition: imageStyles.textAlign || 'center',
            assetId: imageProps.assetId,
            scale: imageStyles.maxWidth || '100%',
            hyperlink: imageProps.hyperlink,
            context
          }
        }
        break
      case types.link:
        props = {
          text: componentData.text
        }
        break
      case types.formField:
        props = {
          label: componentData.label
        }
        break
      case types.logo:
        const defaultBackground = CommonUtils.parseStyle(themeConfig.background.style).backgroundColor
        
        props = {
          backgroundColor: style.backgroundColor || defaultBackground,
          backgroundPosition: style.backgroundPosition || 'center',
          assetId: componentData.assetId,
          scale: componentData.scale || '100%',
          context
        }

        if (context.page === PortalConstants.pages.online) {
          props.hyperlink = componentData.hyperlink || ''
        }
        break
      case types.social:
        if (context.isInlineEditor) {
          if (this.subheadExists(componentData)) {
            props = {
              text: componentData.subhead.text,
              style: CommonUtils.deepExtend({ padding: 0 }, style)
            }
          } else {
            props = {
              text: componentData.body.text,
              style: CommonUtils.deepExtend({ padding: 0 }, style)
            }
          }
        } else if (context.isStyleEditor) {
          props = {
            backgroundColor: style.backgroundColor
          }
        }
        break
      default:
        break
    }

    component.props = props

    return component
  }

  /*
   * Parse the values returned by each editor into the format expected by the portal renderer
   * @param {Object} The context containing a {key, index} of the component
   * @param {Object} Current page data
   * @param {Object} New data of the updated component
   * @return {Object} Page data object containing the updated component
   */
  static prepareComponentForUpdate(context, pageData, newComponentData) {
    const types = PortalConstants.contentTypes
    const type = this.getComponentType(context)
    const oldComponentData = this.getComponentData(context, pageData)
    let data = {}
    let style = CommonUtils.deepExtend({},
      CommonUtils.parseStyle(oldComponentData.style),
      newComponentData.style
    )

    switch (type) {
      case types.channels:
      case types.button:
        style = CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, style, {
          backgroundColor: newComponentData.backgroundColor
        }))

        data = {
          text: newComponentData.text,
          style
        }
        break
      case types.headline:
      case types.subhead:
      case types.body:
        data = { text: newComponentData.text }
        break
      case types.additionalMessaging:
        if (context.isInlineEditor) {
          const textStyle = oldComponentData.text
            ? CommonUtils.parseStyle(oldComponentData.text.style)
            : {}

          data = {
            text: {
              value: newComponentData.text,
              style: CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, textStyle, {
                padding: '20px'
              }))
            }
          }
        } else if (context.isStyleEditor) {
          style = CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, style, {
            backgroundColor: newComponentData.backgroundColor
          }))

          data = {
            text: { style }
          }
        } else if (context.isPopoverEditor) {
          data = {
            setting: PortalConstants.messageTypes.image,
            image: {
              assetId: newComponentData.assetId,
              hyperlink: newComponentData.hyperlink,
              style: CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, {
                maxWidth: Number.parseInt(newComponentData.scale) + '%',
                backgroundColor: newComponentData.backgroundColor,
                textAlign: newComponentData.backgroundPosition
              }))
            }
          }
        }
        break
      case types.link:
        data = {
          text: newComponentData.text
        }
        break
      case types.formField:
        data = { label: newComponentData.label }
        break
      case types.logo:
        data = {
          render: !_.isEmpty(newComponentData.assetId),
          assetId: newComponentData.assetId,
          scale: Number.parseInt(newComponentData.scale) + '%',
          style: CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, style, {
            backgroundColor: newComponentData.backgroundColor,
            backgroundPosition: newComponentData.backgroundPosition
          }))
        }

        if (context.page === PortalConstants.pages.online) {
          data.hyperlink = newComponentData.hyperlink
        }
        break
      case types.social:
        if (context.isInlineEditor) {
          if (this.subheadExists(oldComponentData)) {
            data = {
              subhead: {
                text: newComponentData.text
              }
            }
          } else {
            data = {
              body: {
                text: newComponentData.text
              }
            }
          }
        } else if (context.isStyleEditor) {
          style = CommonUtils.stringifyStyle(CommonUtils.deepExtend({}, style, {
            backgroundColor: newComponentData.backgroundColor
          }))

          data = { style }
        }
        break
      default:
        break
    }

    data = CommonUtils.deepExtend({}, oldComponentData, data)

    return this.setComponentData(context, data, pageData)
  }

  /*
   * Generate a generic portal asset URL
   * If hostName is not provided, the asset URL is relative to the current page.
   * @param {String} Asset ID for the s3 bucket where assets are stored
   * @param {assetApiPath} Asset API path, changes based on repository
   * @param {hostName} The URL that is prepended to the asset path
   */
  static getAssetUrl(assetId, assetApiPath, hostName) {
    let url = null

    // If no hostname is provided, use the host url of the browser window
    // Strip all trailing slashes in the hostName
    hostName = hostName || window.location.origin
    hostName = hostName.replace(/\/+$/, '')

    url = !_.isEmpty(assetId) ? hostName + assetApiPath + assetId : ''

    return url
  }

  /*
   * Strips HTML tags from quill text and counts number of characters
   * @param {String} text that may contain HTML tags
   * @return {Number}
   */
  static getTextCharacterCount(text) {
    const htmlRegex = /(<([^>]+)>)/gi

    return !_.isUndefined(text) ? text.replace(htmlRegex, '').length : text
  }

  /*
   * Given an editor context, determine if that editor has a style button
   */
  static hasStyleButton(context) {
    const type = this.getComponentType(context)
    const types = PortalConstants.contentTypes
    const isSocial = type === types.social
    const isAdditionalMessaging = type === types.additionalMessaging
    const isAdditionalMessagingText = isAdditionalMessaging && (context.setting === PortalConstants.messageTypes.text)
    const isLogo = type === types.logo

    return isAdditionalMessagingText || isSocial || isLogo
  }

  /*
   * To preserve backwards compatibility, check here if the section has the subhead field.
   * @param {Object} pageData
   * @return {Boolean}
   */
  static subheadExists(pageData) {
    return ObjectPath.get(pageData, 'subhead.text')
  }
}
