import React from 'react'
import { connect } from 'vut-react'

class App extends React.Component {
  render () {
    const { census } = this.props
    return (
      <div>
        <p>{census.count}</p>
        <button className="plus" onClick={() => census.plus()}>plus</button>
        <button className="minus" onClick={() => census.minus()}>minus</button>
        <input className="input" type="number" value={census.count} onInput={(e) => census.setCount(parseInt(e.target.value) || 0)} />
      </div>
    )
  }
}

export default connect(App, (vut) => {
  return vut.getModule({ census: 'census' })
})