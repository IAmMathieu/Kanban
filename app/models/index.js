const List = require('./List');
const Card = require('./Card');
const Tag = require('./Tag');

// on va connecter nos modèles
List.hasMany(Card, {
  as: 'cards',
  foreignKey: 'list_id'
});

Card.belongsTo(List, {
  as: 'list',
  foreignKey: 'list_id'
});

Tag.belongsToMany(Card, {
  as: 'cards',
  through: 'card_has_tag',
  foreignKey: 'tag_id',
  otherKey: 'card_id'
});

Card.belongsToMany(Tag, {
  as: 'tags',
  through: 'card_has_tag',
  foreignKey: 'card_id',
  otherKey: 'tag_id'
});

// on exporte bien les modèles reliés les uns avec les autres
module.exports = {
  List,
  Card,
  Tag
}