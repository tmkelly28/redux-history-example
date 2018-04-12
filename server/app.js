const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const db = require('./db')
const app = express()
const PORT = process.env.PORT || 3000
const Puppies = db.model('puppies')

// Logging middleware
app.use(morgan('dev'))

// Body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// If you want to add routes, they should go here!
app.get('/api/puppies', (req, res, next) => {
  Puppies.findAll()
    .then(puppies => res.json(puppies))
    .catch(next)
})

app.post('/api/puppies', (req, res, next) => {
  Puppies.create({
    name: 'Puppy #' + Math.random()
  })
    .then(pup => res.json(pup))
    .catch(next)
})

app.get('/api/puppies/:puppyId', (req, res, next) => {
  Puppies.findById(req.params.puppyId)
    .then(pup => {
      if (!pup) {
        const err = new Error('Pup not found')
        err.status = 404
        throw err
      }
      res.json(pup)
    })
    .catch(next)
})

// For all GET requests that aren't to an API route,
// we will send the index.html!
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'))
})

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal server error')
})

db.sync()
  .then(() => {
    console.log('The database is synced')
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  })
