import '@tmkelly28/tk-css'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider, connect} from 'react-redux'
import {Router, Route, Link, Switch, withRouter} from 'react-router-dom'
import store, {fetchPups, createPup} from './store'
import hashHistory from './history'

const Home = () => (
  <div>Welcome Home</div>
)

const Puppy = connect((state, ownProps) => {
  return {
    pup: state.puppies.find(pup => pup.id === +ownProps.match.params.puppyId)
  }
})(
  ({pup}) => (
    <div>
      {
        pup
          ? <h1>Welcome to the homepage for: {pup.name}</h1>
          : <div>Loading...</div>
      }
    </div>
  )
)

const Puppies = connect(
  (state) => {
    return {
      puppies: state.puppies
    }
  },
  (dispatch) => {
    return {
      create: () => dispatch(createPup())
    }
  })(
  ({puppies, create}) => (
    <div>
      <ul>
        {
          puppies
            .map(pup => (
              <Link key={pup.id} to={`/puppies/${pup.id}`}>
                <li>{pup.name}</li>
              </Link>
            ))
        }
      </ul>
      <button className='btn' onClick={create}>Add New Pup</button>
    </div>
  )
)

const Main = withRouter(
  connect(null, (dispatch) => {
    return {
      fetchPups: () => dispatch(fetchPups())
    }
  })(
    class extends React.Component {
      componentDidMount = () => this.props.fetchPups()

      render () {
        return (
          <div>
            <Switch>
              <Route exact path='/puppies' component={Puppies} />
              <Route path='/puppies/:puppyId' component={Puppy} />
              <Route component={Home} />
            </Switch>
          </div>
        )
      }
    }
  )
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <div id='demo' className='fill-xy bg-yellow black column center-xy'>
        <Link to='/'>Home</Link>
        <Link to='/puppies'>Puppies</Link>
        <Main />
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
