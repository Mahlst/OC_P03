// Fonction pour récupérer les projets depuis l'API
async function fetchProjects(apiUrl) {
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
        console.error('Erreur lors de la récupération des projets:', error);
    }
}

// Fonction pour créer une carte de projet
function createProjectsCard(project) {
    // Crée un élément <figure> pour le projet
    let figure = document.createElement("figure");
    // Ajoute un attribut data-category avec l'ID de la catégorie du projet
    figure.setAttribute("data-category", project.categoryId);

    // Crée un élément <img> pour l'image du projet
    let img = document.createElement("img");
    // Définit l'URL de l'image et le texte alternatif
    img.setAttribute("src", project.imageUrl);
    img.setAttribute("alt", project.title);
    // Ajoute l'élément <img> à l'élément <figure>
    figure.appendChild(img);

    // Crée un élément <figcaption> pour le titre du projet
    let figcaption = document.createElement("figcaption");
    // Définit le texte du titre
    figcaption.textContent = project.title;
    // Ajoute l'élément <figcaption> à l'élément <figure>
    figure.appendChild(figcaption);
    
    // Retourne l'élément <figure> complet représentant la carte de projet
    return figure;
}

// Fonction pour afficher les cartes de projets
function displayProjectsCards(projects) {
    // Sélectionne le conteneur de la galerie dans le document HTML
    const projectsContainer = document.querySelector("div.gallery");

    // Vérifie si le conteneur existe
    if (!projectsContainer) {
        // Affiche une erreur dans la console si le conteneur n'est pas trouvé
        console.error("Le conteneur de la galerie n'a pas été trouvé.");
        return; // Arrête l'exécution de la fonction si le conteneur n'existe pas
    }
    
    // Efface le contenu précédent pour éviter la duplication
    projectsContainer.innerHTML = ""; 

    // Utilise .map pour créer les cartes de projet et les ajoute au conteneur de la galerie
    const projectCards = projects.map(project => createProjectsCard(project));

    // Ajoute les cartes de projet au conteneur de la galerie en une seule opération
    projectsContainer.append(...projectCards);
}

// Fonction principale pour initialiser l'application
async function initializeProjects() {
    // Définit l'URL de l'API des projets
    const apiUrl = "http://localhost:5678/api/works";

    // Récupère les projets depuis l'API
    const projects = await fetchProjects(apiUrl);

    // Si les projets sont récupérés avec succès
    if (projects) {
        // Affiche les projets dans la console pour vérification
        console.log(projects);

        // Crée les cartes avec les projets récupérés
        displayProjectsCards(projects);
    }
}

// Ajoute un écouteur d'événement pour initialiser les projets lorsque le document est complètement chargé
document.addEventListener("DOMContentLoaded", initializeProjects);