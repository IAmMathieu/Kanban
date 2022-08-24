const tagModule = require('./tagModule');
const utilsModule = require('./utilsModule');
const cardModule = {
    showAddCardModal: function(event) {
        // récupérer l'input hidden list_id
        const input = document.querySelector('#addCardModal input[name="list_id"]');
        // récupérer la liste sur laquelle on a cliqué, où on veut ajouter notre carte
        const list = event.target.closest('.panel');
        // mettre à jour l'input hidden avec l'id de la liste
        // input.value = list.getAttribute('data-list-id');
        // on utilise ici l'API dataset car on souhaite récupérer la valeur d'un data attribute (attribut html custom). le data- est enlevé et on doit indiquer le nom en camelCase.
        input.value = list.dataset.listId; 
    
        // afficher la modale d'ajout de carte
        document.getElementById('addCardModal').classList.add('is-active');
      },
      handleAddCardForm: async function(event) {
        // empêcher le rechargement de la page
        event.preventDefault();
        // récupérer la data du formulaire
        const formData = new FormData(event.target);
        try {
          // faire un call API en POST pour ajouter une carte dans une liste
          const response = await fetch(`${utilsModule.base_url}/cards`, {
            method: 'POST',
            body: formData
          });
    
          const card = await response.json();
    
          // créer la carte dans le DOM
          cardModule.makeCardInDOM(card);
    
        } catch(error) {
          console.error(error);
          alert("Impossible d'ajouter la carte !");
        }
        // cacher la modale
        utilsModule.hideModals();
      },
      makeCardInDOM: function(card) {
        // récupérer le template
        const template = document.getElementById('templateCard');
        // cloner le template
        const cloneTemplate = template.content.cloneNode(true);
        // afficher la couleur de la carte
        const cardDOM = cloneTemplate.querySelector('.box');
        cardDOM.style.backgroundColor = card.color;
        // modifier le clone du template
        // modifier le nom de la carte
        cloneTemplate.querySelector('.title-card').textContent = card.title;
        // on va récupérer la bonne liste grace à l'identifiant récupéré
        const list = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
        // on va mettre à jour l'id de la carte dans le DOM
        cardDOM.dataset.cardId = card.id;
        // ajouter un comportement click sur le bouton d'ajout de tag pour afficher la modale
        cloneTemplate.querySelector('.icon-add-tag').addEventListener('click', tagModule.showAssociateTagModal);
        // selectionner l'icone d'édition de liste pour lui attacher un écouteur d'évent click
        cloneTemplate.querySelector('.icon-edit-card').addEventListener('click', cardModule.showEditCardForm);
        // selectionner le formulaire d'edition pour lui attacher un comportement à la soumission
        cloneTemplate.querySelector('.form-edit-card').addEventListener('submit', cardModule.handleEditCardForm);
        // mettre à jour l'id du hidden du formulaire d'édition
        cloneTemplate.querySelector('input[name="list_id"]').value = card.list_id;
        // ajouter un comportement au click sur le bouton de suppression de la carte
        cloneTemplate.querySelector('.icon-delete-card').addEventListener('click', cardModule.deleteCard);
        // insérer dans la bonne liste le clone du template
        list.querySelector('.panel-block').appendChild(cloneTemplate);
      },
      showEditCardForm: function(event) {
        const cardDOM = event.target.closest('.box');
        // cacher le titre de la carte
        cardDOM.querySelector('.title-card').classList.add('is-hidden');
        // afficher le formulaire d'édition
        cardDOM.querySelector('.form-edit-card').classList.remove('is-hidden');
      },
      handleEditCardForm: async function(event) {
        // empêcher le rechargement de la page
        event.preventDefault();
        // récupérer les informations que l'utilisateur a saisi
        const formData = new FormData(event.target);
        const cardDOM = event.target.closest('.box');
        // récupérer l'id de la carte
        const id = cardDOM.dataset.cardId;
        const cardTitle = cardDOM.querySelector('.title-card');
        try {
          // mettre à jour la carte via un call API (PATCH)
          const response = await fetch(`${utilsModule.base_url}/cards/${id}`, {
            method: 'PATCH',
            body: formData
          });
          // modifier le titre de la carte dans le DOM
          cardTitle.textContent = formData.get('title');
          // modifier la couleur de la carte
          cardDOM.style.backgroundColor = formData.get('color');
    
        } catch(error) {
          console.error(error);
          alert('Impossible de modifier la carte !')
        }
        
        // cacher le formulaire
        event.target.classList.add('is-hidden');
        // afficher le titre
        cardTitle.classList.remove('is-hidden');
    
      },
      deleteCard: async function(event) {
        // récupérer l'id de la carte
        const cardDOM = event.target.closest('.box');
        const id = cardDOM.dataset.cardId;
        try {
          // supprimer la carte via un call API
          const response = await fetch(`${utilsModule.base_url}/cards/${id}`, {
            method: 'DELETE'
          });
          // supprimer la carte du DOM
          cardDOM.remove();
        } catch(error) {
          console.error(error);
          alert('Impossible de supprimer la carte !')
        }
      },
      updatePositionCards: function(cards, listId) {
        cards.forEach(async (card, index) => {
        // récupérer l'id de la carte
        const id = card.dataset.cardId;
        
        // mettre à jour sa position
        /*const formData = new FormData();
        formData.set('position', index);
        formData.set('list_id', listId);*/
        try {
          await fetch(`${utilsModule.base_url}/cards/${id}`, {
            method: 'PATCH',
            // on spécifie le type de donnée envoyée à l'API car on lui envoie ici du JSON
            headers: {
              'Content-Type': 'application/json'
            },
            // on transforme en JSON l'objet JS contenant la position de la carte (index)
            body: JSON.stringify({
              position: index,
              list_id: listId
            })
          });
        } catch(error) {
          console.error(error);
          alert('Impossible de déplacer la carte !');
        }
        
        })
        
      }
      
}

module.exports = cardModule;