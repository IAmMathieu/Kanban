const { Sequelize } = require('sequelize');

// const client = new Sequelize('postgres://okanban:okanban@localhost:5432/okanban');

const client = new Sequelize(process.env.PG_URL, {
  // on précise au client Sequelize qu'on a des nom de champs avec des underscores
  define: {
      updatedAt: 'updated_at',
      createdAt: 'created_at'
  }
});

// const connect = async () => {
//   try {
//     await client.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// connect();

// client.authenticate()
//   .then(() => console.log('Connection has been established successfully.'))
//   .catch((error) => console.error('Unable to connect to the database:', error))

module.exports = client;