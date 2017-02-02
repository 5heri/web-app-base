/* Commmon code duplicated from Wifast-Base.
 * - common/js/utils.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

import _ from 'underscore'
import clone from 'clone'
import camelize from 'underscore.string/camelize'
import clean from 'underscore.string/clean'
import functionName from 'function.prototype.name'

module.exports = {
  getClassName(constructor) {
    return constructor.name ? constructor.name : functionName(constructor)
  },

  deepExtend(obj) {
    const parentRE = /#{\s*?_\s*?}/
    const slice = Array.prototype.slice
    const hasOwnProperty = Object.prototype.hasOwnProperty

    _.each(slice.call(arguments, 1), (source) => {
      for (var prop in source) {
        if (hasOwnProperty.call(source, prop)) {
          if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
            if (_.isObject(source[prop])) {
              if (_.isArray(source[prop])) {
                obj[prop] = []
              } else {
                obj[prop] = clone(source[prop])
                continue
              }
              module.exports.deepExtend(obj[prop], source[prop])
            } else {
              obj[prop] = source[prop]
            }
          } else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
            if (_.isString(obj[prop])) {
              obj[prop] = source[prop].replace(parentRE, obj[prop])
            }
          } else if (_.isArray(obj[prop]) || _.isArray(source[prop])) {
            if (!_.isArray(obj[prop]) || !_.isArray(source[prop])) {
              throw 'Error: Trying to combine an array with a non-array (' + prop + ')'
            } else {
              obj[prop] = _.reject(module.exports.deepExtend(obj[prop], source[prop]), (item) => {
                return _.isNull(item)
              })
            }
          } else if (_.isObject(obj[prop]) || _.isObject(source[prop])) {
            if (!_.isObject(obj[prop]) || !_.isObject(source[prop])) {
              throw 'Error: Trying to combine an object with a non-object (' + prop + ')'
            } else {
              obj[prop] = module.exports.deepExtend(obj[prop], source[prop])
            }
          } else {
            obj[prop] = source[prop]
          }
        }
      }
    })

    return obj
  },

  /*
   * Parses a css string and returns an object of camel-cased keys to values (e.g. React inline css)
   * @param String style css string delimited by semicolons
   * @return Object
   */
  parseStyle(style) {
    const result = {}

    if (style) {
      const styles = _.compact(style.split(';'))

      _.each(styles, (s) => {
        const split = s.split(':')
        const key = clean(split.shift())
        const value = clean(split.join(':'))

        result[camelize(key)] = value
      })
    }

    return result
  },

  getSocialLink(id, prefixIfNotFullUrl) {
    // Return the social link, handling case where id is already a full URL - ZENREACH-3173
    if (!_.isEmpty(id) && (id.indexOf('https://') === 0 || id.indexOf('http://') === 0)) {
      return id
    }
    
    return prefixIfNotFullUrl + id
  },
  
  generateSocialLink(channel, id) {
    const facebookUrlPrefix = 'https://www.facebook.com/'
    const twitterUrlPrefix = 'https://www.twitter.com/'
    const instagramUrlPrefix = 'https://www.instagram.com/'
    let link = ''

    switch (channel) {
      case 'facebook':
        link = this.getSocialLink(id, facebookUrlPrefix)
        break
      case 'twitter':
        link = this.getSocialLink(id, twitterUrlPrefix)
        break
      case 'instagram':
        link = this.getSocialLink(id, instagramUrlPrefix)
        break
      default:
        break
    }

    return link
  },
}
