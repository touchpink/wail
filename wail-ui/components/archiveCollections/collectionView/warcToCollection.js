import React, { Component, Proptypes } from 'react'
import BeamMeUpScotty from 'drag-drop'
import {Scrollbars} from 'react-custom-scrollbars'
import autobind from 'autobind-decorator'

export default class WarcToCollection extends Component {

  @autobind
  onDrop (files) {
    console.log(files)
  }

  componentDidMount () {
    BeamMeUpScotty('#warcUpload', files => {
      files.forEach(f => console.log(f))
    })
  }

  render () {
    return (

      <div id='warcUpload'>
        Try dropping some files here, or click to select files to upload.
      </div>

    )
  }

}