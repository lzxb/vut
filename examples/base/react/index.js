import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'vut-react'
import App from './App'

import vut from '../../vut'

export default ReactDOM.render((
  <Provider vut={vut}>
    <App />
  </Provider>
), document.getElementById('app-react'))
