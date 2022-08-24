const { Tag } = require('../models');

// On peut faire le petit détour pour choper les cartes d'une liste et linker les attributs tags ?

const tagController = {
  async getAll(req, res, next) {
    try {
      const tags = await Tag.findAll();

      if (tags) {
        return res.json(tags);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  },
  async getOneById(req, res, next) {
    try {
      const tag = await Tag.findByPk(req.params.id);

      if (tag) {
        return res.json(tag);
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
      const foundTag = await Tag.findOne({
        where: {
          name: req.body.name
        }
      });

      console.log(foundTag);

      if (foundTag) {
        res.json(foundTag);
      }
      else {
        // création de l'instance + sauvegarde en BDD avec la méthode create
        // create = build + save
        const newTag = await Tag.create(req.body);
        res.json(newTag);
      }

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  async update(req, res, next) {
    try {
      const foundTag = await Tag.findByPk(req.params.id);

      if (foundTag) {
        foundTag.update(req.body);
        return res.json(foundTag);
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
      const result = await Tag.destroy({
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
  }
};

module.exports = tagController;