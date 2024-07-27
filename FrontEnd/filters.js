// Variable pour stocker les projets d'origine
let originalProjects = [];

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

    // Utilise .map pour parcourir chaque catégorie et créer un bouton de filtre
    categories.map(category => {
        // Crée un nouvel élément de bouton
        let button = document.createElement("button");

        // Ajoute un attribut data-category avec l'ID de la catégorie au bouton
        button.setAttribute("data-category", category.id);
        // Ajoute la classe 'pointer' au bouton cliqué
        button.classList.add('pointer');

        // Si la catégorie est "Tous", ajoute une classe pour indiquer qu'il est actif
        category.id === 0 && button.classList.add("filter-active");

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

    // Convertit la NodeList en tableau et utilise .map pour ajouter un écouteur d'événement à chaque bouton
    Array.from(buttons).map(button => {
        button.addEventListener("click", () => {
            // Utilise .map pour retirer la classe 'filter-active' de tous les boutons
            Array.from(buttons).map(button => button.classList.remove('filter-active'));

            // Ajoute la classe 'filter-active' au bouton cliqué
            button.classList.add('filter-active');
            
            // Récupère la catégorie associée au bouton cliqué
            const category = button.getAttribute("data-category");

            // Filtre les projets en fonction de la catégorie sélectionnée
            filterProjects(category);
        });
    });
}

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
function filterProjects(category) {
    // Filtre les projets selon la catégorie sélectionnée
    const filteredProjects = originalProjects.filter(project => {
        // Retourne true si la catégorie est "0" (tous les projets) ou si la catégorie du projet correspond à celle sélectionnée
        return category === "0" || project.getAttribute("data-category") === category;
    });

    // Met à jour le conteneur de la galerie avec les projets filtrés
    const galleryContainer = document.querySelector("div.gallery");
    galleryContainer.innerHTML = ""; // Vide le conteneur

    // Utilise .map pour ajouter les projets filtrés au conteneur de la galerie
    filteredProjects.map(project => galleryContainer.appendChild(project));
}

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

    // Sélectionne tous les éléments <figure> dans le conteneur de la galerie et les stocke dans originalProjects
    originalProjects = Array.from(document.querySelectorAll("div.gallery figure"));
}

// Ajoute un écouteur d'événement pour initialiser les filtres lorsque le document est complètement chargé
document.addEventListener("DOMContentLoaded", initializeFilters);
