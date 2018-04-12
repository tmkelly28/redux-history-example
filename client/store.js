import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import thunks from 'redux-thunk'
import axios from 'axios'
import hashHistory from './history'

const initialState = {
  puppies: []
}

const GOT_PUPS = 'GOT_PUPS'
const GOT_PUP = 'GOT_PUP'

const gotPups = (puppies) => ({type: GOT_PUPS, puppies})
const gotPup = (pup) => ({type: GOT_PUP, pup})

export const fetchPups = () => (dispatch, _, {axios}) => {
  return axios.get('/api/puppies')
    .then(res => res.data)
    .then(puppies => dispatch(gotPups(puppies)))
}

export const createPup = () => (dispatch, _, {axios, hashHistory}) => {
  return axios.post('/api/puppies')
    .then(res => res.data)
    .then(pup => {
      dispatch(gotPup(pup))
      hashHistory.push(`/puppies/${pup.id}`)
    })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_PUPS:
      return {
        ...state,
        puppies: action.puppies
      }
    case GOT_PUP:
      return {
        ...state,
        puppies: [...state.puppies, action.pup]
      }
    default:
      return state
  }
}

const store = createStore(
  reducer,
  applyMiddleware(
    logger,
    thunks
      .withExtraArgument({axios, hashHistory})
  )
)

export default store
