import React from 'react'
import { connect } from 'vut-react'

class App extends React.Component {
  render () {
    const { census } = this.props
    return (
      <div>
        <p>{census.count}</p>
        <button onClick={() => census.plus()}>plus</button>
        <button onClick={() => census.minus()}>minus</button>
        <input type="number" value={census.count} onInput={(e) => census.setCount(parseInt(e.target.value) || 0)} />
      </div>
    )
  }
}

export default connect(App, (store) => {
  return { census: store.census }
})