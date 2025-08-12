document.addEventListener("DOMContentLoaded", function() {
    // Sélection des éléments du DOM
    const form = document.querySelector(".signup-form");
    const ctaButton = document.querySelector(".cta-button");

    // Écoute de l'événement de soumission du formulaire
    form.addEventListener("submit", function(event) {
        // Empêche le rechargement de la page par défaut
        event.preventDefault(); 

        // Récupération des données du formulaire
        const formData = new FormData(form);

        // Affiche un message de succès
        ctaButton.textContent = "Inscription réussie ! 🎉";
        ctaButton.disabled = true; 
        ctaButton.style.backgroundColor = "#28a745"; // Couleur verte pour le succès
        
        // Optionnel : Vous pouvez décommenter le code ci-dessous pour l'envoi réel à Formspree
        // fetch(form.action, {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
        // .then(response => {
        //     if (response.ok) {
        //         ctaButton.textContent = "Inscription réussie ! 🎉";
        //         ctaButton.disabled = true;
        //         ctaButton.style.backgroundColor = "#28a745";
        //     } else {
        //         throw new Error('Erreur lors de l\'envoi du formulaire.');
        //     }
        // })
        // .catch(error => {
        //     alert("Une erreur s'est produite lors de l'inscription.");
        //     console.error('Erreur:', error);
        //     ctaButton.textContent = "Erreur, réessayez";
        //     ctaButton.disabled = false;
        //     ctaButton.style.backgroundColor = "#dc3545"; // Couleur rouge pour l'erreur
        // });
    });
});
