import React, {Component, PropTypes} from 'react'
import {RouteTransition} from 'react-router-transition/lib/react-router-transition'
import {darkBlack, lightBlue900, blue500, cyan500, cyan700, white} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Header from './header'
import Footer from './footer'

const baseTheme = getMuiTheme({
  palette: {
    primary1Color: cyan700,
    primary2Color: blue500
  },
  tabs: {
    backgroundColor: white,
    textColor: darkBlack,
    selectedTextColor: lightBlue900
  },
  inkBar: {
    backgroundColor: lightBlue900
  },
  userAgent: false
})

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }
  static childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
    routeInfo: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  getChildContext () {
    return {
      muiTheme: baseTheme,
      routeInfo: {
        params: this.props.params,
        location: this.props.location,
        route: this.props.route
      }
    }
  }

  render () {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <Header />
        <div className='layoutBody'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}


