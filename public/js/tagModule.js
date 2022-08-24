const utilsModule = require('./utilsModule');
const tagModule = {
    makeTagInDOM: function(tag) {
        // créer l'élément span représentant le tag
        const span = document.createElement('span');
        // lui ajouter une class tag
        span.classList.add('tag');
        // lui ajouter son nom
        span.textContent = tag.name;
        // lui donner un identifiant (data-tag-id)
        span.dataset.tagId = tag.id;
        // on attache l'écouteur d'évènement dblclick sur le span pour déclencher la dissociation du tag de la carte
        span.addEventListener('dblclick', tagModule.dissociateTagFromCard);
        // l'insérer dans la bonne carte
        document.querySelector(`.box[data-card-id="${tag.card_has_tag.card_id}"`).appendChild(span);
    },
    dissociateTagFromCard: async function(event) {
        // récupérer l'identifiant du tag
        const tagId = event.target.dataset.tagId;
        // récupérer l'identifiant de la carte
        const cardId = event.target.closest('.box').dataset.cardId;
        try {
            // faire un call API en DELETE pour dissocier un tag d'une carte
            await fetch(`${utilsModule.base_url}/cards/${cardId}/tag/${tagId}`, {
                method: 'DELETE'
            });
            // supprimer le tag dans le DOM
            event.target.remove();
        } catch(error) {
            console.error(error);
            alert('Impossible de dissocier le tag de la carte !');
        } 
    },
    showAssociateTagModal: function(event) {
        // afficher la modale pour associer un tag à une carte
        document.getElementById('associateTagModal').classList.add('is-active');
        // récupère l'id de la carte et modifie le hidden du form en conséquence
        const cardId = event.target.closest('.box').dataset.cardId;
        document.querySelector('#associateTagModal input[name="card_id"]').value = cardId;
    },
    fillSelectAssociateTagModal: async function() {
        // récupérer le select de la modale
        const select = document.querySelector('#associateTagModal select');
        // récupérer la liste des tags via un call API en GET
        const response = await fetch(`${utilsModule.base_url}/tags`);
        const tags = await response.json();
        for(const tag of tags) {
            // créer une balise option pour chacun de ces tags
            const option = document.createElement('option');
            // modifier le texte de la balise option avec le nom du tag
            option.textContent = tag.name;
            // modifier la value de la balise option avec l'identifiant du tag
            option.value = tag.id;
            // insérer la balise option dans le select
            select.appendChild(option);
        }     
    },
    handleAssociateTagForm: async function(event) {
        // empêcher le rechargement de la page
        event.preventDefault();
        // créer un formData pour récupérer plus facilement les données du form
        const formData = new FormData(event.target);
        // récupérer l'id de la carte
        const cardId = formData.get('card_id');
        try {
            // associer le tag à la carte en faisant un call API en POST
            const response = await fetch(`${utilsModule.base_url}/cards/${cardId}/tag`, {
                method: 'POST',
                body: formData
            });
            // on récupère la carte via l'api vu que c'est ce qu'elle nous retourne
            const card = await response.json();
            // on récupère le tag sous forme d'objet via card
            const tag = card.tags.find(tag => tag.id == formData.get('tag_id'));
            // ajouter le tag dans le DOM
            tagModule.makeTagInDOM(tag);
        } catch(error) {
            console.error(error);
            alert("Impossible d'associer le tag à la carte !");
        }
        utilsModule.hideModals();
    }
}

module.exports = tagModule;