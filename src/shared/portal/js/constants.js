/* Commmon code duplicated from Wifast-Base.
 * - portal/js/constants.js
 * IMPORTANT: Changes to this file MUST also be made in Wifast-Base to maintain code consistency
 */

module.exports = {
  dispatchEvents: {
    loading: 'LOADING',
    portal: {
      load: 'LOAD_PORTAL',
      updateOne: 'UPDATE_PORTAL'
    },
    save: {
      success: 'SAVE_SUCCESS',
      error: 'SAVE_ERROR'
    },
    image: {
      update: 'UPDATE_IMAGE'
    }
  },
  assetApiPath: '/api/portal-assets/',
  pages: {
    landing: 'landing',
    login: 'login',
    emailLogin: 'emailLogin',
    phoneLogin: 'phoneLogin',
    facebookLogin: 'facebookLogin',
    online: 'online',
    returning: 'returning'
  },
  pageOrder: [
    'landing',
    'login',
    'emailLogin',
    'phoneLogin',
    'facebookLogin',
    'online'
  ],
  languages: [{
    value: 'english',
    label: 'English (Default)'
  }, {
    value: 'spanish',
    label: 'Spanish'
  }, {
    value: 'french',
    label: 'French'
  }],
  channels: {
    email: 'email',
    mobile: 'mobile',
    facebook: 'facebook',
    anonymous: 'anonymous'
  },
  socialPlatforms: {
    facebook: 'facebook',
    twitter: 'twitter',
    instagram: 'instagram'
  },
  placeholders: {
    email: 'janesmith@example.com',
    phone: '+1 (234) 567-8910',
    additionalMessagingText: 'Use this area to tell your customers about new products, specials, or events.'
  },
  allowedStyles: {
    all: [
      'color',
      'backgroundColor',
      'textAlign',
      'fontSize',
      'fontStyle',
      'fontFamily',
      'fontWeight',
      'lineHeight',
      'border',
      'borderSize',
      'borderWidth',
      'borderColor'
    ]
  },
  backgroundOptions: [{
    value: 'solid',
    label: 'Solid Color'
  }, {
    value: 'image',
    label: 'Image'
  }],
  messageTypes: {
    'image': 'image',
    'text': 'text',
    'none': 'none'
  },
  screenTypes: {
    'mobile': 'mobile',
    'tablet': 'tablet',
    'desktop': 'desktop'
  },
  contentTypes: {
    'logo': 'logo',
    'headline': 'headline',
    'subhead': 'subhead',
    'body': 'body',
    'button': 'button',
    'goButton': 'button',
    'returnConnectButton': 'button',
    'connectButton': 'button',
    'link': 'link',
    'notButton': 'link',
    'backButton': 'link',
    'skipButton': 'skipButton',
    'tos': 'tos',
    'tosCheckbox': 'tosCheckbox',
    'consent': 'consent',
    'channels': 'channels',
    'social': 'social',
    'birthday': 'birthday',
    'birthdaySubhead': 'body',
    'birthdayFields': 'formField',
    'birthdayButton': 'button',
    'additionalMessaging': 'additionalMessaging',
    'formField': 'formField'
  },
  dragTypes: {
    CHANNEL: 'channel'
  },
  tooltipText: {
    walkthroughIntro: `These are the pages your customers will see as they go through the process
      of signing up for your wifi. Click continue to learn more about each page!`,
    walkthroughLanding: `Because the landing page is the first thing your customers will see, it's a
      great place to have a nice welcome message thanking them for your business!`,
    walkthroughLoginSelection: `Your customers will decide how they want to login on this page. You can always
      choose which methods to offer within the settings tab.`,
    walkthroughLogin: `This page is for customers deciding to login with their email address. Those
      who decide to use Facebook will be taken to a Facebook login page.`,
    walkthroughOnline: `The Online Page lets your customers know they're connected to the wifi. It's
      a great place to advertise things such as special events or new products! However, If you'd
      rather divert them to a different web page, you can setup a redirect under the settings tab.`,
    walkthroughReturning: `Customers who have already signed up for your wifi will see this page. This
      would be a great place to have a welcome back message!`,
    loginMethods: `These are the ways your customers will be able to log in to use your wifi. Feel
      free to reorder them based on your preference. You can enable or disable login methods within
      the settings tab.`,
    additionalMessagingSingle: `This section can be used in the cases you would like to add additional
      content for announcements or other types of advertisements. You can only have one message and
      it must be either image or text based.`,
    additionalMessaging: `This section can be used in the cases you would like to add additional
      content for announcements or other types of advertisements. You can add up to three messages,
      but each one must be either image or text based.`,
    content: `Here you'll be able to define a global style for all of your assets. This will be your
      default style for all elements except when defined otherwise.`,
    background: `This is where you can define a background for all of your pages. You have the
      option to either use a solid color or upload an image.`,
    formFields: `Here you're able to adjust the form field style depending on your background color.
      If you have a lighter background, select light, and if you have a darker background, select
      dark.`,
    portalName: 'This nickname is for organizational purposes and will only be visible to you.',
    tos: 'You can define the language your TOS appears in as well as inserting custom TOS text.',
    loginTypes: 'These are the ways your customers can register in order to use your wifi services.',
    labels: 'These labels will be applied to any customer that registers through this portal.',
    redirect: `Enabling this feature will bypass the online page and take the customer directly
      to the provided URL.`,
    returning: 'This page is dedicated for customers who have already registered for your wifi.',
    theme: 'Head over to the Theme tab to change the look and feel of your portal with a couple of clicks!'

  },
  defaultValues: {
    fonts: {
      headlines: 'font-family: Helvetica; font-size: 28px; color: #3a434a;',
      subheads: 'font-family: Helvetica; font-size: 16px; color: #797979;',
      bodyText: 'font-family: Helvetica; font-size: 16px; color: #797979;',
      textLinks: 'color: #2875df;',
      buttons: 'font-family: Helvetica; font-size: 16px; color: #ffffff; background-color: #2875df;'
    },
    buttonText: {
      email: 'Connect with Email',
      mobile: 'Connect with Mobile Number',
      facebook: 'Connect with Facebook',
      anonymous: 'Continue as Guest'
    },
    colors: {
      bodyText: '#121b1f',
      buttonText: '#fff'
    },
    backgroundColor: '#e4e4e4'
  },
  dimensions: {
    tabBarHeight: 56,
    toolbarHeight: 41
  },
  notifications: {
    saveSuccess: 'Success! Your Portal changes have been saved.',
    saveError: 'Oops! Your Portal changes have not been saved.',
    facebookStyling: 'Styling for this page is controlled by Facebook.',
    facebookDisabled: `Facebook Login has been disabled. You can enable this login method within the
      Login Selection page.`
  },
  characterCount: {
    headline: 50,
    body: 100,
    birthdaySubhead: 100,
    social: 100,
    formLabel: 20,
    buttonLabel: 30,
    additionalMessaging: 200
  }
}
