// Fonction principale pour initialiser l'application
async function initializeProjets() {
    // Définit l'URL de l'API des projets
    const apiUrl = "http://localhost:5678/api/works";

    // Récupère les projets depuis l'API
    const projets = await fetchProjets(apiUrl);

    // Si les projets sont récupérées avec succès
    if (projets) {
        // Affiche les projets dans la console pour vérification
        console.log(projets);

        // Crée les cartes avec les projets récupérées
        createProjets(projets);
    }
}

// Ajoute un écouteur d'événement pour initialiser les projets lorsque le document est complètement chargé
document.addEventListener("DOMContentLoaded", initializeProjets);

// Fonction pour récupérer les catégories depuis l'API
async function fetchProjets(apiUrl) {
    try {
        // Envoie une requête HTTP GET à l'URL de l'API
        const response = await fetch(apiUrl);

        // Vérifie si la réponse est correcte (status 200-299)
        if (!response.ok) {
            // Si la réponse n'est pas correcte, lève une erreur avec le code de statut HTTP
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convertit la réponse en format JSON et la retourne
        return await response.json();
    } catch (error) {
        // En cas d'erreur (réseau, conversion JSON, etc.), affiche l'erreur dans la console
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

// Fonction pour créer les cartes de projets
function createProjets(projets) {
    // Sélectionne le conteneur de la galerie dans le document HTML
    const projetsContainer = document.querySelector("div.gallery");

    // Parcourt chaque projet récupéré
    projets.forEach(projet => {
        // Crée un élément <figure> pour chaque projet
        let figure = document.createElement("figure");
        // Ajoute un attribut data-category avec l'ID de la catégorie du projet
        figure.setAttribute("data-category", projet.categoryId)
        // Ajoute l'élément <figure> au conteneur de la galerie
        projetsContainer.appendChild(figure);

        // Crée un élément <img> pour l'image du projet
        let img = document.createElement("img");
        // Définit l'URL de l'image et le texte alternatif
        img.setAttribute("src", projet.imageUrl);
        img.setAttribute("alt", projet.title);
        // Ajoute l'élément <img> à l'élément <figure>
        figure.appendChild(img);
        
        // Crée un élément <figcaption> pour le titre du projet
        let figcaption = document.createElement("figcaption");
        // Définit le texte du titre
        figcaption.textContent = projet.title;
        // Ajoute l'élément <figcaption> à l'élément <figure>
        figure.appendChild(figcaption);
    });
}
