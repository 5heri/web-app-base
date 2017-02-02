import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import ClassNames from 'classnames'
import CommonUtils from '../../shared/common/js/utils'
import BaseComponent from '../../shared/common/js/base-component'
import PortalConstants from '../../shared/portal/js/constants'
import PortalUtils from '../../shared/portal/js/utils'
import PortalRendererConstants from '../constants'

/*
 * Class representing the editable wrapper in the Portal Renderer.
 */
export default class ComponentWrapper extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = {
      layout: null,
      active: false
    }
  }

  componentDidMount() {
    this.calculateLayout()
  }

  componentDidUpdate() {
    this.calculateLayout()
  }

  /*
   * An active componentWrapper has a higher z-index so that it stays above
   * other componentWrappers that might overlap it in a normal hierarchy
  */
  render() {
    const hasStyleButton = PortalUtils.hasStyleButton(this.props.context)
    let style = null

    if (hasStyleButton) {
      style = {
        paddingTop: PortalConstants.dimensions.toolbarHeight,
        marginTop: -1 * PortalConstants.dimensions.toolbarHeight,
        zIndex: this.state.active ? 2 : 1
      }
    } else {
      style = {
        zIndex: this.state.active ? 2 : 1
      }
    }

    let dom = (
      <div
        className={this.getClassName()}
        ref={(ref) => this.setRef('componentWrapper', ref)}
        style={style}
        data-component-type={this.props.type}
        data-component-index={this.props.index}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.getChild()}
      </div>
    )

    return dom
  }

  calculateLayout() {
    const elem = $(this.getRef('componentWrapper'))
    const layout = PortalUtils.calculateLayout(elem)

    if (!_.isEqual(layout, this.state.layout)) {
      this.setState({
        layout
      })
    }
  }

  onMouseEnter = () => {
    this.props.onMouseEnter && this.props.onMouseEnter(this.state.layout)

    this.setState({
      active: true
    })
  }

  onMouseLeave = () => {
    this.setState({
      active: false
    })
  }

  getChild() {
    return React.Children.only(this.props.children)
  }
}

ComponentWrapper.propTypes = {
  children: React.PropTypes.any.isRequired,
  edit: React.PropTypes.bool,
  onMouseEnter: React.PropTypes.func,
}
