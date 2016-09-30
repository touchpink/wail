import React, {Component, PropTypes} from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {blueGrey50, darkBlack, lightBlue900} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Header from './header'
import Footer from './footer'
import styles from '../styles/styles'
import {remote} from 'electron'

const baseTheme = getMuiTheme({
  tabs: {
    backgroundColor: blueGrey50,
    textColor: darkBlack,
    selectedTextColor: darkBlack
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
    muiTheme: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  getChildContext () {
    return {
      muiTheme: baseTheme
    }
  }

  render () {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <Header />
        <div className="layoutBody">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    )
  }
}

