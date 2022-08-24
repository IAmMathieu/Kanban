const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Tag extends Model {}

Tag.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // connexion à la BDD
  tableName: 'tag' // on précise le nom de la table dans la BDD sinon sequelize utilise de base 'Tag'
});

module.exports = Tag;