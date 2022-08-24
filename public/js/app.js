const listModule = require('./listModule');
const cardModule = require('./cardModule');
const tagModule = require('./tagModule');
const utilsModule = require('./utilsModule');
// on objet qui contient des fonctions
const app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.getListsFromAPI();
    app.addListenerToActions();
    tagModule.fillSelectAssociateTagModal();
  },
  addListenerToActions: function() {
    // cibler le bouton ajouter une liste
    document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);
    // façon querySelector
    // document.querySelector('#addListButton').addEventListener('click', app.showAddListModal);
    // cibler les deux boutons close pour fermer la modale
    const btnClosesNat = document.getElementsByClassName('close');
    //const btnClosesQue = document.querySelectorAll('.close');

    for(const btn of btnClosesNat) {
      btn.addEventListener('click', utilsModule.hideModals);
    }
    // cibler le formulaire d'ajout de liste pour lui ajouter l'écouteur de soumission
    document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
    // ajouter des écouteurs d'évènement click sur les boutons d'ajout de cartes
    /*const btnsAddCard = document.querySelectorAll('.btn-add-card');
    for(const btn of btnsAddCard) {
      btn.addEventListener('click', app.showAddCardModal);
    }*/

    // attacher écouteur d'évènement submit au formulaire d'ajout de carte
    document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
    // attacher un comportement au submit du formulaire d'ajout de tag à une carte
    document.querySelector('#associateTagModal form').addEventListener('submit', tagModule.handleAssociateTagForm);
  },
  getListsFromAPI: async function() {
    try {
      // récupérer toutes les listes via l'API
      // fetch dans un premier temps renvoie un objet avec tout plein d'informations
      const response = await fetch(`${utilsModule.base_url}/lists`);
      // sauf que nous on veut la data ! on va donc utiliser la méthode json de l'objet response
      const lists = await response.json();
      // créer les listes dans le DOM
      for(const list of lists) {
        listModule.makeListInDOM(list);
        for(const card of list.cards) {
          cardModule.makeCardInDOM(card);
          for(const tag of card.tags) {
            tagModule.makeTagInDOM(tag);
          }
        }
      }
      const listContainer = document.querySelector('.card-lists');
      const sortable = new Sortable(listContainer, {
        draggable: '.panel',
        onEnd: function() {
          // modifier la position des listes
          const lists = document.querySelectorAll('.panel');
          lists.forEach(async (list, index) => {
            // récupérer l'id de la liste
            const id = list.dataset.listId;
            // faire le call API en PATH pour modifier la position de la liste
            await fetch(`${utilsModule.base_url}/lists/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                position: index
              })
            });
          })
        }
      });
      } catch(error) {
        console.error(error);
      }
  }
    
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );