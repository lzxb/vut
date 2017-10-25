import React from 'react'
import { connect } from 'vut-react'

class App extends React.Component {
  render () {
    const { user } = this.props
    return (
      <div>
        {
          user.loading ? (
            <div>
              用户信息正在加载中
            </div>
          ) : null
        }
        {user.detail.name}
      </div>
    )
  }
}

export default connect(App, (store) => {
  return { user: store.user }
})