import ReactGA from 'react-ga'

const ANALYTICS_ID = 'UA-145282946-2'

const analyticsEvent = (category = '', action, label = '') => {
  ReactGA.event({
    category,
    action,
    label
  })
}

const trackPage = () => {
  ReactGA.initialize(ANALYTICS_ID)
  // Report page view
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.search)
}


export default {
  analyticsEvent,
  trackPage
}