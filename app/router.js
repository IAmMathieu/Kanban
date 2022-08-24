const express = require('express');

const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');

const router = express.Router();

//router.get('/', (req, res) => res.send('coucou'));

// LIST
router.get('/lists', listController.getAll);
router.get('/lists/:id', listController.getOneById);
router.get('/lists/:id/cards', listController.getListCards);

router.post('/lists', listController.create);

router.patch('/lists/:id', listController.update);

router.delete('/lists/:id', listController.destroy);

// CARD
router.get('/cards', cardController.getAll);
router.get('/cards/:id', cardController.getOneById);

router.post('/cards', cardController.create);
router.post('/cards/:id/tag', cardController.addTag);

router.patch('/cards/:id', cardController.update);

router.delete('/cards/:id', cardController.destroy);
router.delete('/cards/:card_id/tag/:tag_id', cardController.removeTag);

// TAG
router.get('/tags', tagController.getAll);
router.get('/tags/:id', tagController.getOneById);

router.post('/tags', tagController.create);

router.patch('/tags/:id', tagController.update);

router.delete('/tags/:id', tagController.destroy);


// 404
router.use((req, res) => {
  res.status(404).json({
    error: '404 not found'
  });
});

module.exports = router;