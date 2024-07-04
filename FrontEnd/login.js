// Ajout d'un écouteur d'événement qui exécute la fonction lorsque le contenu de la page est complètement chargé
document.addEventListener("DOMContentLoaded", () => {
    // Sélection de l'élément <form> dans le document
    const form = document.querySelector("form");
    
    // Ajout d'un écouteur d'événement pour l'événement de soumission du formulaire
    form.addEventListener("submit", async (event) => {
        // Empêche le comportement par défaut du formulaire qui est de recharger la page
        event.preventDefault();
        
        // Récupération des valeurs des champs email et mot de passe
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        // Envoi d'une requête POST au serveur pour tenter de se connecter
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // Méthode de la requête
            headers: {
                "Content-Type": "application/json" // Type de contenu envoyé
            },
            body: JSON.stringify({ email, password }) // Corps de la requête contenant les informations d'authentification
        });
        
        // Vérification si la réponse du serveur est correcte
        if (response.ok) {
            // Si la réponse est correcte, extraction des données JSON de la réponse
            const data = await response.json();
            // Enregistrement du token reçu dans le localStorage
            localStorage.setItem("token", data.token);
            // Affichage d'une alerte de succès
            alert("Authentification réussie !");
            // Redirection de l'utilisateur vers une autre page si nécessaire
            location.href = 'index.html';
        } else {
            // Si la réponse n'est pas correcte, affichage d'une alerte d'échec
            alert("Échec de l'authentification.");
        }
    });
});
