const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class List extends Model {}

List.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER
    // allowNull defaults to true
  }
}, {
  sequelize, // connexion à la BDD
  tableName: 'list' // on précise le nom de la table dans la BDD sinon sequelize utilise de base 'List'
});

module.exports = List;