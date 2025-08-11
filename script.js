document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".signup-form");
    const ctaButton = document.querySelector(".cta-button");

    form.addEventListener("submit", function(event) {
        // Empêche le comportement par défaut du formulaire (rechargement de la page)
        event.preventDefault();

        // Simule l'envoi des données (en production, vous enverriez à un vrai serveur)
        // Ici, nous affichons simplement un message de succès

        ctaButton.textContent = "Inscription réussie ! 🎉";
        ctaButton.disabled = true; // Désactive le bouton pour éviter les envois multiples
        ctaButton.style.backgroundColor = "#28a745"; // Changement de couleur pour indiquer le succès

        // Vous pouvez ajouter ici la logique d'envoi à Formspree ou à un autre service
        // const formData = new FormData(form);
        // fetch(form.action, {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.ok) {
        //         ctaButton.textContent = "Inscription réussie ! 🎉";
        //         ctaButton.disabled = true;
        //         ctaButton.style.backgroundColor = "#28a745";
        //     } else {
        //         alert("Une erreur s'est produite.");
        //     }
        // });
    });
});