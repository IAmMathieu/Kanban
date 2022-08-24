const utilsModule = {
    // url de base de l'API
    base_url: 'http://localhost:3000',
    hideModals: function() {
        // cibler les modales
        document.querySelectorAll('.modal').forEach(modal => {
          // les cacher
          modal.classList.remove('is-active');
        });
        
      },
}

module.exports = utilsModule;