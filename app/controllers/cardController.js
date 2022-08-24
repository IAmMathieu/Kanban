const { Card, Tag } = require('../models');

// On peut faire le petit détour pour choper les cartes d'une liste et linker les attributs tags ?

const cardController = {
  async getAll(req, res, next) {
    try {
      const cards = await Card.findAll();

      if (cards) {
        return res.json(cards);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  },
  async getOneById(req, res, next) {
    try {
      const card = await Card.findByPk(req.params.id, {
        include: 'tags',
        order: [
          ['tags', 'name', 'ASC']
        ]
      });

      if (card) {
        return res.json(card);
      }

      // 404
      next();
    } catch (error) {
      // toutes les autres erreurs
      // on passe l'erreur en argument
      // ce qui fera exécuter le MW de traitement d'erreur
      next(error);
    }
  },
  async create(req, res) {
    try {
      // avant d'enregistrer une liste, on peut vérifier si le nom
      // envoyé existe déjà
      const foundCard = await Card.findOne({
        where: {
          title: req.body.title
        }
      });

      console.log(foundCard);

      if (foundCard) {
        res.json(foundCard);
      }
      else {
        // création de l'instance + sauvegarde en BDD avec la méthode create
        // create = build + save
        const newCard = await Card.create(req.body);
        res.json(newCard);
      }

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async update(req, res, next) {
    try {
      const foundCard = await Card.findByPk(req.params.id);

      if (foundCard) {
        foundCard.update(req.body);
        return res.json(foundCard);
      }
      // si on a pas trouvé de carte, on ne peut faire l'update
      // on le signale à notre utilisateur => 404
      next();
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async destroy(req, res, next) {
    try {
      const result = await Card.destroy({
        where: {
          id: req.params.id
        }
      });
  
      // result correspond au nombre de suppression faites en BDD
      // s'il est égal à 0 => rien à été suprrimé => on a rien trouvé => 404
      if (result) {
        return res.json({
          ok: true
        });
      }

      next();
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async addTag(req, res, next) {
    try {
      const card = await Card.findByPk(req.params.id, {
        include: 'tags',
        order: [
          ['tags', 'name', 'ASC']
        ]
      });

      if (!card) {
        // on sort de la fonction et on exécute next => 404
        return next();
      }

      const tag = await Tag.findByPk(req.body.tag_id);

      if (!tag) {
        // on sort de la fonction et on exécute next => 404
        return next();
      }

      // une fois les models associés sequelize génère des fonctions spéciales
      // que l'on va pouvoir utiliser directement sur les instances des Models
      // ici pour card on aura accès aux méthode setTag, getTag, addTag 
      await card.addTag(tag);

      // notre card a été mise à jour en BDD mais il faut recharger l'instance
      // pour que celle-ci soit synchronisée avec les infos en base
      await card.reload();

      res.json(card);
    } catch (error) {
      next(error);
    }
  },
  async removeTag(req, res, next) {
    try {
      const card = await Card.findByPk(req.params.card_id, {
        include: 'tags',
        order: [
          ['tags', 'name', 'ASC']
        ]
      });

      if (!card) {
        return next();
      }

      const tag = await Tag.findByPk(req.params.tag_id);

      if (!tag) {
        return next();
      }

      await card.removeTag(tag);
      await card.reload();

      res.json(card);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cardController;