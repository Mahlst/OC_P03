// Ajout d'un écouteur d'événement qui exécute la fonction lorsque le contenu de la page est complètement chargé
document.addEventListener("DOMContentLoaded", () => {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem("token");
    // Sélection de tous les éléments nécessitant une authentification
    const authRequiredElements = document.querySelectorAll(".auth-required");
    // Sélection de l'élément de connexion/déconnexion
    const loginLogoutElement = document.getElementById("login-logout");

    // Si un token est présent (utilisateur authentifié)
    if (token) {
        // Afficher les éléments pour les utilisateurs authentifiés
        addEditModeElement();
        addEditProjectElement();
        insertModal()
        changeModalListener()
        
        // Changer le texte du lien de connexion en déconnexion
        loginLogoutElement.textContent = "logout";
        loginLogoutElement.href = "#";
        // Ajout d'un écouteur d'événement pour gérer la déconnexion
        loginLogoutElement.addEventListener("click", (event) => {
            event.preventDefault();
            // Suppression du token du localStorage
            localStorage.removeItem("token");
            // Alerte de déconnexion
            alert("Vous êtes déconnecté.");
            // Rechargement de la page
            window.location.reload();
        });
    } else {
        // Masquer les éléments pour les utilisateurs non authentifiés
        authRequiredElements.forEach(element => {
            element.remove();
        });
    }

    const modalActiveButtons = document.querySelectorAll('.modal-open');
    const modalContainer = document.querySelector('.modal-container');
    
    modalActiveButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.classList.add('active');
        });
    });

    const closeModal = document.querySelector('.modal-close'); 
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modalContainer.classList.remove('active');

            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML =""

            const returnModal = document.querySelector('.modal-return');
            returnModal.style.visibility = 'hidden'
            
            insertModalGallery()
            changeModalListener()

        });
    }

    const returnModal = document.querySelector('.modal-return');
    if (returnModal) {
        returnModal.addEventListener('click', function() {
            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML =""

            const returnModal = document.querySelector('.modal-return');
            returnModal.style.visibility = 'hidden'
            
            insertModalGallery()
            changeModalListener();
        });
    }

});



// Fonction pour ajouter l'élément de mode édition
function addEditModeElement() {
    // Création d'un div pour le mode édition
    const editModeDiv = document.createElement('div');
    editModeDiv.classList.add('edit-mode', 'auth-required');

    // Création d'un bouton
    const button = document.createElement('button');
    button.classList.add('modal-open', 'pointer');

    // Création d'une icône
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    // Création d'un texte pour le mode édition
    const text = document.createTextNode('Mode édition');

    // Ajout de l'icône et du texte au lien
    button.appendChild(icon);
    button.appendChild(text);
    editModeDiv.appendChild(button);

    // Insertion du mode édition dans le conteneur du corps du document
    const bodyContainer = document.querySelector('.body_container');
    if (bodyContainer) {
        document.body.insertBefore(editModeDiv, bodyContainer);
    } else {
        console.error('Element with class .body_container not found');
    }
}

// Fonction pour ajouter l'élément de modification de projet
function addEditProjectElement() {
    // Création d'un div pour la modification de projet
    const editProjectDiv = document.createElement('div');
    editProjectDiv.classList.add('edit-project', 'auth-required');

    // Création d'un bouton
    const button = document.createElement('button');
    button.classList.add('modal-open', 'modal-open', 'pointer');

    // Création d'une icône
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    // Création d'un texte pour la modification de projet
    const text = document.createTextNode('modifier');

    // Ajout de l'icône et du texte au lien
    button.appendChild(icon);
    button.appendChild(text);
    editProjectDiv.appendChild(button);

    // Insertion de la modification de projet dans le conteneur du titre du portfolio
    const portfolioTitleContainer = document.querySelector('.portfolio_title_container');
    if (portfolioTitleContainer) {
        portfolioTitleContainer.appendChild(editProjectDiv);
    } else {
        console.error('Element with class .portfolio_title_container not found');
    }
}

function insertModal() {
    const modalContainer = `
        <div class="modal-container auth-required">
            <div id="myModal" class="modal">
                <div class="modal-icon">
                    <i class="modal-return fa-solid fa-arrow-left pointer"></i>
                    <i class="modal-close fa-solid fa-xmark pointer"></i>
                </div>
                <div class="modal-content modal-upload-form"></div>
            </div>
        </div>
    `;

    // Append the modal HTML to the body
    document.body.insertAdjacentHTML('beforeend', modalContainer);

    insertModalGallery();
}

function insertModalGallery() {
    const modalContent = document.querySelector('.modal-content');

    if (modalContent) {
        modalContent.innerHTML = `
            <h2 class="modal-title">Galerie photo</h2>
            <div class="modal-gallery"></div>
            <hr class="modal-separator">
            <button class="modal-btn pointer" type="submit">Ajouter une photo</button>
        `;
    } else {
        console.error('Element with class "modal-content" not found.');
    }

    initializeProjectsModal();
}

function insertModalForm() {
    const modalContent = document.querySelector('.modal-content');

    if (modalContent) {
        modalContent.innerHTML = `
            <form class="modal-form">
            <h2 class="modal-title">Ajout photo</h2>
            <div class="form-element imageUpload">
            <i class="fa-regular fa-image"></i>
            <button class="pointer">+ Ajouter photo</button>
            <p>jpg, png : 4mo max</p>
            </div>
            <div class="form-element imageTitle">
            <label for="title">Titre</label>
            <input type="text" id="title" name="title" required>
            </div>
            <div class="form-element imageCategory">
            <label for="category">Catégorie</label>
            <select id="category" name="category" required>
                <option selected disabled hidden></option>
                <option>Objets</option>
                <option>Appartements</option>
                <option>Hotels & restaurants</option>
            </select>
            <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr class="modal-separator">
            <button class="modal-btn pointer" type="submit">Valider</button>
        </form>
        `;
    } else {
        console.error('Element with class "modal-content" not found.');
    }
}

function changeModalListener() {
    const addPictureBtnModal = document.querySelector('.modal-btn');
    if (addPictureBtnModal) {
        addPictureBtnModal.addEventListener('click', function() {
            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML = "";

            const returnModal = document.querySelector('.modal-return');
            returnModal.style.visibility = 'visible';
            insertModalForm();
        });
    }
}

// Fonction principale pour initialiser l'application
async function initializeProjectsModal() {
    // Définit l'URL de l'API des projets
    const apiUrl = "http://localhost:5678/api/works";

    // Récupère les projets depuis l'API
    const projects = await fetchProjects(apiUrl);

    // Si les projets sont récupérés avec succès
    if (projects) {
        // Affiche les projets dans la console pour vérification
        console.log(projects);

        // Crée les cartes avec les projets récupérés
        displayProjectsCardsModal(projects);
    }
}

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
function createProjectsCardModal(project) {
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

    // Création d'une icône
    let trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash" , "pointer")
    // Ajoute l'élément <trashIcon> à l'élément <figure>
    figure.appendChild(trashIcon);
    
    // Retourne l'élément <figure> complet représentant la carte de projet
    return figure;
}

// Fonction pour afficher les cartes de projets
function displayProjectsCardsModal(projects) {
    // Sélectionne le conteneur de la galerie dans le document HTML
    const projectsContainer = document.querySelector("div.modal-gallery");

    // Vérifie si le conteneur existe
    if (!projectsContainer) {
        // Affiche une erreur dans la console si le conteneur n'est pas trouvé
        console.error("Le conteneur de la galerie du modal n'a pas été trouvé.");
        return; // Arrête l'exécution de la fonction si le conteneur n'existe pas
    }

    // Parcourt chaque projet récupéré
    projects.forEach(project => {
        // Crée une carte de projet en utilisant la fonction createProjectsCard
        let projectCard = createProjectsCardModal(project);
        
        // Vérifie si la carte de projet a été créée correctement
        if (projectCard) {
            // Ajoute la carte de projet au conteneur de la galerie
            projectsContainer.appendChild(projectCard);
        } else {
            // Affiche une erreur dans la console si la carte de projet n'a pas pu être créée
            console.error("La carte de projet n'a pas pu être créée pour le projet :", project);
        }
    });
}