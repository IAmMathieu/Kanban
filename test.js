// const List = require('./app/models/List');
// const Card = require('./app/models/Card');
// const Tag = require('./app/models/Tag');

const { List, Card, Tag } = require('./app/models')

// List.findAll({
//   include: 'cards'
// })
//   .then((lists) => console.log(lists))
//   .catch((error) => console.log(error))

List.findAll({
  include: [{
    association: "cards",
    include: ["tags"]
  }]
})
  .then((lists) => console.log(lists[0].cards))
  .catch((error) => console.log(error))

// Card.findAll()
//   .then((cards) => console.log(cards))
//   .catch((error) => console.log(error))

// Tag.findAll()
//   .then((tags) => console.log(tags))
//   .catch((error) => console.log(error))

