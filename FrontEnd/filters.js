// Fonction principale pour initialiser l'application
async function initializeFilters() {
    // Définit l'URL de l'API des catégories
    const apiUrl = "http://localhost:5678/api/categories";

    // Récupère les catégories depuis l'API
    const categories = await fetchCategories(apiUrl);

    // Si les catégories sont récupérées avec succès
    if (categories) {
        // Affiche les catégories dans la console pour vérification
        console.log(categories);

        // Crée les boutons de filtre avec les catégories récupérées
        createFilterButtons(categories);

        // Ajoute les écouteurs d'événements aux boutons de filtre
        addFilterButtonListeners();
    }
}

// Ajoute un écouteur d'événement pour initialiser les filtres lorsque le document est complètement chargé
document.addEventListener("DOMContentLoaded", initializeFilters);

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories(apiUrl) {
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

// Fonction pour créer les boutons de filtre
function createFilterButtons(categories) {
    // Ajoute une catégorie "Tous" au début de la liste des catégories
    categories.unshift({id: 0, name: "Tous"});

    // Sélectionne le conteneur des filtres dans le document HTML
    const filterContainer = document.querySelector("div.filter");

    // Parcourt chaque catégorie pour créer un bouton de filtre
    categories.forEach(category => {
        // Crée un nouvel élément de bouton
        let button = document.createElement("button");

        // Ajoute un attribut data-category avec l'ID de la catégorie au bouton
        button.setAttribute("data-category", category.id);

        // Définit le texte du bouton avec le nom de la catégorie
        button.textContent = category.name;

        // Ajoute le bouton au conteneur des filtres
        filterContainer.appendChild(button);
    });
}

// Fonction pour ajouter des écouteurs d'événements aux boutons de filtre
function addFilterButtonListeners() {
    // Sélectionne tous les boutons de filtre dans le conteneur
    const buttons = document.querySelectorAll("div.filter button");

    // Ajoute un écouteur d'événement à chaque bouton
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Récupère la catégorie associée au bouton cliqué
            const category = button.getAttribute("data-category");

            // Filtre les projets en fonction de la catégorie sélectionnée
            filterProjects(category);
        });
    });
}

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
function filterProjects(category) {
    // Sélectionne tous les projets dans la galerie
    const projects = document.querySelectorAll("div.gallery figure");

    // Parcourt chaque projet pour appliquer le filtre
    projects.forEach(project => {
        // Affiche le projet si la catégorie est "Tous" ou correspond à celle du projet
        if (category === "0" || project.getAttribute("data-category") === category) {
            project.style.display = "";
        } else {
            // Masque le projet si la catégorie ne correspond pas
            project.style.display = "none";
        }
    });
}
