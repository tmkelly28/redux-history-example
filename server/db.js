const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/YOUR_DB')

db.define('puppies', {
  name: Sequelize.STRING
})

module.exports = db
