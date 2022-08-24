const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Card extends Model {}

Card.init({
  // Model attributes are defined here
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER
    // allowNull defaults to true
  },
  color: {
    type: DataTypes.STRING
  }
}, {
  sequelize, // connexion à la BDD
  tableName: 'card' // on précise le nom de la table dans la BDD sinon sequelize utilise de base 'Card'
});

module.exports = Card;