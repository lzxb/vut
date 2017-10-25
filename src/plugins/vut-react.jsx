import React from 'react'
import PropTypes from 'prop-types'

export const connect = (Component, mapModules) => {
  return class Connect extends React.Component {
    static contextTypes = {
      vut: PropTypes.object.isRequired
    }
    state = mapModules(this.context.vut.store)
    componentWillMount () {
      this.onChange = () => {
        this.setState(mapModules(this.context.vut.store))
      }
      this.context.vut.$dep.addSub(this.onChange)
    }
    render () {
      return <Component {...this.props} {...this.state} />
    }
    componentDidMount () {
      this.context.vut.$dep.removeSub(this.onChange)
    }
  }
}

export class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    vut: PropTypes.object.isRequired
  }
  static childContextTypes = {
    vut: PropTypes.object.isRequired
  }
  getChildContext () {
    return {
      vut: this.props.vut
    }
  }
  render () {
    return React.Children.only(this.props.children)
  }
}
