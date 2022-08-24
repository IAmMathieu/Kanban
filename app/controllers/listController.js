const { List, Card } = require('../models');
const sanitizer = require('sanitizer');

const listController = {
  // retourner toutes les listes
  // getAll(req, res) {
  //   // res.send => texte
  //   // res.sendFile => fichier
  //   // res.render => vue ejs
  //   List.findAll()
  //     .then((lists) => {
  //       res.json(lists);
  //     })
  //     .catch((error) => {
  //       res.status(404).send(error.message);
  //     });
  // },
  async getAll(req, res, next) {
    try {
      const lists = await List.findAll({
        include: [{
          association: 'cards',
          include: ['tags']
        }],
        order: [
          // on ordonne les listes par position
          ['position', 'ASC'],
          // si on veut ordonner les cartes, il faut descendre dans les propriétés
          // de l'objet qui nous est retourné
          ['cards', 'position', 'ASC'],
          // on peut aussi trier les tags par ordre alphabétique
          ['cards', 'tags', 'name', 'ASC']
        ]
      });

      if (lists) {
        return res.json(lists);
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async getOneById(req, res, next) {
    try {
      const list = await List.findByPk(req.params.id, {
        include: [{
          association: 'cards',
          include: ['tags']
        }],
        order: [
          // si on veut ordonner les cartes, il faut descendre dans les propriétés
          // de l'objet qui nous est retourné
          ['cards', 'position', 'ASC']
        ]
      });

      if (list) {
        return res.json(list);
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async create(req, res) {
    try {
      
      // on crée une nouvelle instance de List
      // const newList = new List({ name: "Atome yellow" });
      // const newList = List.build({ name: "Atome yellow" });

      // on sauvegarde la nouvelle instance de List en BDD
      // ici on aura l'id renseigné par la BDD
      // await newList.save();

      // création de l'instance + sauvegarde en BDD avec la méthode create
      // const newList = await List.create(req.body);

      // avant d'enregistrer une liste, on peut vérifier si le nom
      // envoyé existe déjà
      // const foundList = await List.findOne({
      //   where: {
      //     name: req.body.name
      //   }
      // });

      // if (foundList) {
      //   res.json(foundList);
      // }
      // else {
        // const newList = await List.create(req.body);
        // res.json(newList);
      // }

      // pour se prémunir de faille XSS (Cross Site Scripting)
      // on assainit les inputs utilisateur
      req.body.name = sanitizer.sanitize(req.body.name);

      const foundList = await List.findOrCreate({
        where: {
          name: req.body.name
        }
      });

      // on renvoie cette instance au front
      res.json(foundList[0]);
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async update(req, res) {
    try {
      const foundList = await List.findByPk(req.params.id);

      // foundList.name = req.body.name;
      // foundList.position = req.body.position;
  
      foundList.update(req.body);
  
      res.json(foundList);
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async destroy(req, res) {
    try {
      const result = await List.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (result) {
        return res.json({
          ok: true
        });
      }

      next();
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request'
      });
    }
  },
  async getListCards(req, res) {
    try {
      const cards = await Card.findAll({
        where: {
          list_id: req.params.id
        },
        include: 'tags',
        order: [
          ['position', 'ASC']
        ]
      });
      
      if (cards) {
        return res.json(cards);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
};


module.exports = listController;