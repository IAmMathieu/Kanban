const cardModule = require('./cardModule');
const utilsModule = require('./utilsModule');
const listModule = {
    showAddListModal: function() {
        // cibler la div modal et lui attribuer la class is-active
        document.getElementById('addListModal').classList.add('is-active');
      },
      handleAddListForm: async function(event) {
        // couper le rechargement de la page
        event.preventDefault();
        // récupérer la data du formulaire
        const formData = new FormData(event.target);
    
        try {
          // enregistrer la nouvelle liste dans la base via l'API
          const response = await fetch(`${utilsModule.base_url}/lists`, {
            method: 'POST', // on lui précise qu'on veut du POST
            body: formData // on lui donne les infos du form
          });
    
          if(!response.ok) alert("Il y a eu un problème lors de l'envoi de la liste au serveur !");
    
          const list = await response.json();
    
          console.log(list);
          // créer une liste dans le DOM
          listModule.makeListInDOM(list);
        } catch(error) {
          console.error(error);
          alert('Impossible de créer la liste !');
        }
        
        // fermer la modale
        utilsModule.hideModals();
      },
      makeListInDOM: function(list) {
        // récupérer le template
        const template = document.getElementById('templateList');
        // cloner le contenu du template
        // const cloneTemplate = document.importNode(template.content, true);
        const cloneTemplate = template.content.cloneNode(true);
        const h2 = cloneTemplate.querySelector('.panel h2');
        // modifier le clone du template (le nom de la liste)
        h2.textContent = list.name;
        // attacher un écouteur d'évènement dblclick sur le titre
        h2.addEventListener('dblclick', listModule.showEditListForm);
        // modifier l'id de la liste
        cloneTemplate.querySelector('.panel').dataset.listId = list.id;
        // attacher un écouteur d'évènement click sur le bouton + d'ajout de carte
        cloneTemplate.querySelector('.btn-add-card').addEventListener('click', cardModule.showAddCardModal);
        // attacher un evenement submit au formulaire d'édition de liste
        cloneTemplate.querySelector('.form-edit-list').addEventListener('submit', listModule.handleEditListForm);
        // attacher un comportement click à l'icone de suppression de liste
        cloneTemplate.querySelector('.icon-delete-list').addEventListener('click', listModule.deleteList);
        // on récupère le container qui va contenir nos cartes à déplacer (la zone blanche des listes)
        const listContainer = cloneTemplate.querySelector('.panel-block');
        // instancier Sortable pour activer le drag and drop des cartes
        const sortable = new Sortable(listContainer, {
          group: 'list',
          draggable: '.box',
          onEnd: function(event) {
            // mettre à jour la position des cartes de la liste d'origine
            let cards = event.from.querySelectorAll('.box');
            let idList = event.from.closest('.panel').dataset.listId;
            cardModule.updatePositionCards(cards, idList);
            // on check si l'utilisateur a déplacé sa carte dans une autre liste (la liste d'origine sera  différente de la nouvelle liste)
            if(event.from !== event.to) {
              cards = event.to.querySelectorAll('.box');
              // on récupère l'id de la liste
              idList = event.to.closest('.panel').dataset.listId;
              cardModule.updatePositionCards(cards, idList);
            }
          }
        });
        // insérer le clone du template dans le DOM
        document.querySelector('.card-lists').appendChild(cloneTemplate);
      },
      showEditListForm: function(event) {
        // masquer le bon h2 (event.target)
        event.target.classList.add('is-hidden');
        // afficher le formulaire d'édition de la bonne liste
        event.target.closest('.panel').querySelector('.form-edit-list').classList.remove('is-hidden');
    },
    handleEditListForm: async function(event) {
        // on coupe le rechargement de la page
        event.preventDefault();
        // récupérer la data du formulaire
        const formData = new FormData(event.target);
        const h2 = event.target.closest('.panel').querySelector('h2');
        // récupérer l'id de la bonne liste
        const id = event.target.closest('.panel').dataset.listId;
        try {
          // modifier la liste via un call API (PATCH)
          const response = await fetch(`${utilsModule.base_url}/lists/${id}`, {
            method: 'PATCH',
            body: formData
          });
    
          // mettre à jour le h2
          h2.textContent = formData.get('name');
        
        } catch(error) {
          console.error(error);
          alert('Impossible de mettre à jour la liste !')
        }
        
        // masquer le form
        event.target.classList.add('is-hidden');
        // afficher le h2
        h2.classList.remove('is-hidden');
        
      },
      deleteList: async function (event) {
        // demander la confirmation à l'utilisateur
        if(!confirm("Etes vous sûr de vouloir supprimer cette liste ?")) return;
        // récupérer l'id de la liste
        const listDOM = event.target.closest('.panel');
        const id = listDOM.dataset.listId;
        try {
          // supprimer la liste via un call API (DELETE)
          const response = await fetch(`${utilsModule.base_url}/lists/${id}`, {
            method: 'DELETE'
          });
          // supprimer la liste dans le DOM
          listDOM.remove();
        } catch(error) {
          console.error(error);
          alert('Impossible de supprimer la liste !');
        }
        
      },
}

module.exports = listModule;