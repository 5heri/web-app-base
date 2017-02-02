import _ from 'underscore'
import PortalConstants from './constants'

const logo = {
  "render": false,
  "assetId": "",
  "scale": "58%",
  "style": "text-align: center;"
 }
const quillPrefix = "<p class=\"ql-align-center\" style=\"text-align: center;\">"
const quillSuffix = "</p>"
const button = {
  connect: 'Connect',
  online: 'Submit',
  goOnline: 'Go Online',
  birthday: 'Submit',
  style: "",
  facebookStyle: "background-color: #3b5999;",
  anonymousStyle: "background-color: transparent; color:#d3d3d3; text-align: center;",
  theme: "font-size: 16px; background-color: #42B7B1;"
}
const textLinks = {
  backButton: "Back",
  notYou: "Not You?",
  style: "padding: 0;",
  theme: "font-size: 16px; color: #42B7B1; font-weight: lighter; background-color: transparent;"
}
const form = {
  emailLoginLabel: "Email Address",
  phoneLoginLabel: "Mobile Number",
  birthdayLabel: "Birthday",
  theme: "light"
}

const headline = {
  landing: "Welcome!",
  login: "How would you like to connect?",
  emailLogin: "Log in",
  phoneLogin: "Log in",
  online: "You're online!",
  returning: "Welcome back!",
  style: "padding: 20px;",
  theme: "font-size: 30px;"
}

const body = {
  landing: "Please continue to enjoy our complimentary wifi.",
  login: "Please select from one of the options below.",
  emailLogin: "Please enter your email address to continue.",
  phoneLogin: "Please enter your mobile number to continue.",
  online: "Thanks for visiting us and we hope to see you again soon!",
  returning: "Please continue to enjoy our complimentary wifi.",
  social: "Connect With Us",
  birthday: "Enter your birthday so we can get to know each other!",
  style: "padding: 0 25px 25px;",
  theme: "font-size: 16px;"
}

const channels = [
  {
    "render": true,
    "id": PortalConstants.channels.email,
    "text": PortalConstants.defaultValues.buttonText.email,
    "style": button.style
  },
  {
    "render": false,
    "id": PortalConstants.channels.mobile,
    "text": PortalConstants.defaultValues.buttonText.mobile,
    "style": button.style
  },
  {
    "render": true,
    "id": PortalConstants.channels.facebook,
    "text": PortalConstants.defaultValues.buttonText.facebook,
    "style": button.facebookStyle
  },
  {
    "render": false,
    "id": PortalConstants.channels.anonymous,
    "text": PortalConstants.defaultValues.buttonText.anonymous,
    "style": button.anonymousStyle
  }
]

/* 
 * This class returns a default template for a business.
 */
export default class DefaultPortalTemplate {
  
  /*
   * @return {Object} Object representation of default template for business name passed in
   */
  static getDefaultTemplate() {
    return {
      "template_id": "",
      "login_tags": ['wifi'],
      "template": {
        "showWizard": true,
        "name": "",
        "customTos": "",
        "tosLanguage": "english",
        "onlinePageRedirect": {
          "active": false,
          "type": "none",
          "url": "",
          "time": 40
        },
        "returningUserPage": true,
        "theme": {
          "background": {
            "style": "background-color: #fff"
          },
          "headlines": headline.theme,
          "bodyText": body.theme,
          "buttons": button.theme,
          "textLinks": textLinks.theme,
          "formFields": form.theme
        },
        "pages": [{
          "id": "landing",
          "logo": logo,
          "headline": {
            "text": quillPrefix + headline.landing + quillSuffix,
            "style": headline.style
          },
          "body": {
            "text": quillPrefix + body.landing + quillSuffix,
            "style": body.style
          },
          "goButton": {
            "text": button.goOnline,
            "style": button.style
          },
          "additionalMessaging": [{
            "render": false,
            "setting": "none"
          }]
        }, {
          "id": "login",
          "channels": channels,
          "headline": {
            "text": quillPrefix + headline.login + quillSuffix,
            "style": headline.style
          },
          "body": {
            "text": quillPrefix + body.login + quillSuffix,
            "style": body.style
          }
        }, {
          "id": "emailLogin",
          "headline": {
            "text": quillPrefix + headline.emailLogin + quillSuffix,
            "style": headline.style
          },
          "body": {
            "text": quillPrefix + body.emailLogin + quillSuffix,
            "style": body.style
          },
          "connectButton": {
            "text": button.connect,
            "style": button.style
          },
          "backButton": {
            "text": textLinks.backButton,
            "style": textLinks.style
          },
          "formField": {
            "label": form.emailLoginLabel,
            "colorScheme": form.theme
          }
        }, {
          "id": "phoneLogin",
          "headline": {
            "text": quillPrefix + headline.phoneLogin + quillSuffix,
            "style": headline.style
          },
          "body": {
            "text": quillPrefix + body.phoneLogin + quillSuffix,
            "style": body.style
          },
          "connectButton": {
            "text": button.connect,
            "style": button.style
          },
          "formField": {
            "label": form.phoneLoginLabel,
            "colorScheme": form.theme
          }
        }, {
          "id": "online",
          "logo": logo,
          "headline": {
            "text": quillPrefix + headline.online + quillSuffix,
            "style": headline.style
          },
          "body": {
            "text": quillPrefix + body.online + quillSuffix,
            "style": body.style
          },
          "button": {
            "render": false,
            "text": button.online,
            "style": button.style
          },
          "social": {
            "body": {
              "text": quillPrefix + body.social + quillSuffix
            },
            "style": "background-color: #EFEFEF; padding: 20px;",
            "channels": {
              "facebook": "",
              "twitter": "",
              "instagram": ""
            },
            "channelStatus": {
              "facebook": false,
              "twitter": false,
              "instagram": false
            }
          },
          "birthday": {
            "body": {
              "text": quillPrefix + body.birthday + quillSuffix
            },
            "formField": {
              "label": form.birthdayLabel,
              "colorScheme": form.theme
            },
            "button": {
              "text": button.birthday,
              "style": button.style
            },
            "style": "padding-top: 30px; padding-bottom: 10px;",
            "render": true
          },
          "additionalMessaging": [
            {
              "render": false,
              "setting": "none"
            },
            {
              "render": false,
              "setting": "none"
            },
            {
              "render": false,
              "setting": "none"
            }
          ]
        }, {
          "id": "returning",
          "logo": logo,
          "headline": {
            "text": quillPrefix + headline.returning + quillSuffix,
            "style": headline.style + "padding-bottom: 0;"
          },
          "body": {
            "text": quillPrefix + body.returning + quillSuffix,
            "style": body.style + "padding-top: 10px;"
          },
          "returnConnectButton": {
            "text": button.goOnline,
            "style": button.style
          },
          "notButton": {
            "render": true,
            "text": textLinks.notYou,
            "style": textLinks.style
          },
          "additionalMessaging": [{
            "render": false,
            "setting": "none"
          }],
          "showDisplayName": true
        }]
      }
    }
  }
  
  /*
   * @param id the id for the channel
   * @return {Object} The default channel template for the id passed in
   */
  static getDefaultChannel(channelId) {
    return _.findWhere(channels, {id: channelId})
  }
}
