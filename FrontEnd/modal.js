// --- Fonctions Utilitaires ---

// Récupère les projets depuis l'API
async function fetchProjects(apiUrl) {
    try {
        const response = await fetch(apiUrl); // Envoie une requête à l'API pour obtenir les projets
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // Vérifie si la réponse est correcte
        return await response.json(); // Convertit la réponse en JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error); // Affiche une erreur si la requête échoue
    }
}

// Récupère les catégories depuis l'API
async function fetchCategories() {
    const apiUrl = "http://localhost:5678/api/categories"; // URL de l'API pour les catégories
    try {
        const response = await fetch(apiUrl); // Envoie une requête à l'API pour obtenir les catégories
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // Vérifie si la réponse est correcte
        return await response.json(); // Convertit la réponse en JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error); // Affiche une erreur si la requête échoue
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// --- Gestion des Modals ---

// Insère le modal dans le document
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

    document.body.insertAdjacentHTML('beforeend', modalContainer); // Insère le modal dans le body du document
    insertModalGallery(); // Appelle la fonction pour insérer la galerie de photos dans le modal
}

// Insère la galerie de photos dans le modal
function insertModalGallery() {
    const modalContent = document.querySelector('.modal-content'); // Sélectionne l'élément avec la classe .modal-content
    modalContent.innerHTML = `
        <h2 class="modal-title">Galerie photo</h2>
        <div class="modal-gallery"></div>
        <div class="modal-hr-btn">
            <hr class="modal-separator">
            <button class="modal-btn pointer" type="submit">Ajouter une photo</button>
        </div>
    `;

    initializeProjectsModal(); // Initialise les projets dans le modal
}

// Insère le formulaire d'ajout de photo dans le modal
async function insertModalForm() {
    const categories = await fetchCategories(); // Récupère les catégories depuis l'API
    const modalContent = document.querySelector('.modal-content'); // Sélectionne l'élément avec la classe .modal-content
    modalContent.innerHTML = `
        <form class="modal-form">
            <h2 class="modal-title">Ajout photo</h2>
            <div class="form-element imageUpload">
                <i class="fa-regular fa-image" id="image-icon"></i>
                <label for="file-upload" class="custom-file-upload">+ Ajouter photo</label>
                <input type="file" id="file-upload" accept=".jpg, .jpeg, .png" required>
                <p id="file-info">jpg, png : 4mo max</p>
                <img id="image-preview" src="" alt="Aperçu de l'image" />
            </div>
            <div class="form-element imageTitle">
                <label for="title">Titre</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div class="form-element imageCategory">
                <label for="category">Catégorie</label>
                <select id="category" name="category" required>
                    <option selected disabled hidden></option>
                    ${categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
                </select>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="modal-hr-btn">
                <hr class="modal-separator">
                <button class="modal-btn modal-btn-form pointer button-disabled" type="submit" disabled>Valider</button>
            </div>
        </form>
    `;

    attachFormEventListeners(); // Attache les écouteurs d'événements au formulaire
}

// --- Fonctions pour la Gestion des Projets ---

// Initialise les projets dans le modal
async function initializeProjectsModal() {
    const apiUrl = "http://localhost:5678/api/works"; // URL de l'API pour les projets
    const projects = await fetchProjects(apiUrl); // Récupère les projets depuis l'API
    displayProjectsCardsModal(projects); // Affiche les cartes de projets dans le modal
}

// Crée une carte de projet pour le modal
function createProjectsCardModal(project) {
    const figure = document.createElement("figure"); // Crée un élément figure
    figure.setAttribute("data-category", project.categoryId); // Définit l'attribut data-category
    figure.setAttribute("data-id", project.id); // Définit l'attribut data-id

    const img = document.createElement("img"); // Crée un élément img
    img.setAttribute("src", project.imageUrl); // Définit l'attribut src de l'image
    img.setAttribute("alt", project.title); // Définit l'attribut alt de l'image
    figure.appendChild(img); // Ajoute l'image à la figure

    const figcaption = document.createElement("figcaption"); // Crée un élément figcaption
    figure.appendChild(figcaption); // Ajoute le figcaption à la figure

    const trashIcon = document.createElement("i"); // Crée un élément i pour l'icône de suppression
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash", "pointer"); // Ajoute des classes à l'icône
    trashIcon.addEventListener('click', () => deleteProject(project.id)); // Ajoute un écouteur d'événement pour supprimer le projet
    figure.appendChild(trashIcon); // Ajoute l'icône de suppression à la figure

    return figure; // Retourne la figure complète
}

// Affiche les cartes de projets dans le modal
function displayProjectsCardsModal(projects) {
    const projectsContainer = document.querySelector("div.modal-gallery"); // Sélectionne l'élément avec la classe .modal-gallery
    projectsContainer.innerHTML = ""; // Vide le conteneur des projets
    const projectCards = projects.map(project => createProjectsCardModal(project)); // Utilise .map pour créer les cartes de projet
    projectsContainer.append(...projectCards); // Ajoute toutes les cartes de projet au conteneur
}

// Supprime un projet via l'API
async function deleteProject(projectId) {
    const apiUrl = `http://localhost:5678/api/works/${projectId}`; // URL de l'API pour supprimer un projet
    const token = localStorage.getItem("token"); // Récupère le token d'authentification depuis le localStorage

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE', // Utilise la méthode DELETE pour supprimer le projet
            headers: {
                'Authorization': `Bearer ${token}` // Ajoute le token dans les en-têtes de la requête
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // Vérifie si la réponse est correcte

        initializeProjectsModal(); // Réinitialise les projets dans le modal après suppression
        initializeProjects() // Actualise le contenu dans gallery.js
    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error); // Affiche une erreur si la requête échoue
        alert("Une erreur est survenue lors de la suppression du projet."); // Affiche une alerte en cas d'erreur
    }
}

// --- Gestion de l'Authentification ---

// Initialise l'état authentifié
function initializeAuthenticatedState() {
    addEditModeElement(); // Ajoute le bouton "Mode édition"
    addEditProjectElement(); // Ajoute le bouton "modifier" pour les projets
    insertModal(); // Insère le modal dans le document
    changeModalListener(); // Change le contenu du modal pour afficher le formulaire d'ajout

    const loginLogoutElement = document.getElementById("login-logout"); // Sélectionne l'élément de connexion/déconnexion
    loginLogoutElement.textContent = "logout"; // Change le texte en "logout"
    loginLogoutElement.href = "#"; // Change le lien href
    loginLogoutElement.addEventListener("click", (event) => { // Ajoute un écouteur d'événement pour la déconnexion
        event.preventDefault(); // Empêche le comportement par défaut du lien
        localStorage.removeItem("token"); // Supprime le token d'authentification du localStorage
        alert("Vous êtes déconnecté."); // Affiche une alerte de déconnexion
        window.location.reload(); // Recharge la page
    });
}

// Ajoute le bouton "Mode édition"
function addEditModeElement() {
    const editModeDiv = document.createElement('div'); // Crée un élément div
    editModeDiv.classList.add('edit-mode', 'auth-required'); // Ajoute des classes à la div

    const button = document.createElement('button'); // Crée un élément button
    button.classList.add('modal-open', 'pointer'); // Ajoute des classes au bouton
    button.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition'; // Ajoute le contenu HTML du bouton

    editModeDiv.appendChild(button); // Ajoute le bouton à la div

    const bodyContainer = document.querySelector('.body_container'); // Sélectionne l'élément avec la classe .body_container
    document.body.insertBefore(editModeDiv, bodyContainer); // Insère la div avant l'élément body_container
}

// Ajoute le bouton "modifier" pour les projets
function addEditProjectElement() {
    const editProjectDiv = document.createElement('div'); // Crée un élément div
    editProjectDiv.classList.add('edit-project', 'auth-required'); // Ajoute des classes à la div

    const button = document.createElement('button'); // Crée un élément button
    button.classList.add('modal-open', 'pointer'); // Ajoute des classes au bouton
    button.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'; // Ajoute le contenu HTML du bouton

    editProjectDiv.appendChild(button); // Ajoute le bouton à la div

    const portfolioTitleContainer = document.querySelector('.portfolio_title_container'); // Sélectionne l'élément avec la classe .portfolio_title_container
    portfolioTitleContainer.appendChild(editProjectDiv); // Ajoute la div au conteneur de titre du portfolio
}

// --- Événements de Formulaires ---

// Attache les écouteurs d'événements au formulaire
function attachFormEventListeners() {
    const form = document.querySelector('.modal-form'); // Sélectionne le formulaire avec la classe .modal-form
    form.addEventListener('submit', handleFormSubmit); // Ajoute un écouteur d'événement pour la soumission du formulaire

    form.querySelector('#file-upload').addEventListener('change', handleFileInputChange); // Ajoute un écouteur d'événement pour le changement de fichier
    form.querySelector('#title').addEventListener('input', updateSubmitButtonState); // Ajoute un écouteur d'événement pour les changements dans le champ titre
    form.querySelector('#category').addEventListener('change', updateSubmitButtonState); // Ajoute un écouteur d'événement pour les changements dans le champ catégorie
}

// Met à jour l'état du bouton de soumission
function updateSubmitButtonState() {
    const fileInput = document.querySelector('#file-upload'); // Sélectionne l'élément input de fichier
    const titleInput = document.querySelector('#title'); // Sélectionne l'élément input de titre
    const categorySelect = document.querySelector('#category'); // Sélectionne l'élément select de catégorie
    const submitButton = document.querySelector('.modal-btn-form'); // Sélectionne le bouton de soumission

    // Vérifie si le formulaire est valide
    const isFormValid = fileInput.files.length > 0 && titleInput.value.trim() !== '' && categorySelect.value !== '';
    submitButton.disabled = !isFormValid; // Active ou désactive le bouton de soumission
    submitButton.classList.toggle('button-disabled', !isFormValid); // Ajoute ou retire la classe button-disabled
}

// Gère les changements de fichier dans le formulaire
function handleFileInputChange() {
    const fileInput = document.querySelector('#file-upload'); // Sélectionne l'élément input de fichier
    const file = fileInput.files[0]; // Récupère le fichier sélectionné
    const imagePreview = document.querySelector('#image-preview'); // Sélectionne l'élément image de prévisualisation
    const imageIcon = document.querySelector('#image-icon'); // Sélectionne l'icône d'image
    const fileInfo = document.querySelector('#file-info'); // Sélectionne l'élément info de fichier
    const labelInput = document.querySelector('.custom-file-upload'); // Sélectionne l'élément label pour le fichier

    if (file && file.size <= 4 * 1024 * 1024) { // Vérifie que le fichier existe et ne dépasse pas 4 Mo
        const reader = new FileReader(); // Crée un nouveau FileReader
        reader.onload = function(e) { // Définie ce qui se passe lorsque le fichier est chargé
            imagePreview.src = e.target.result; // Définit la source de l'image de prévisualisation
            imagePreview.style.display = 'block'; // Affiche l'image de prévisualisation
            imageIcon.style.display = 'none'; // Masque l'icône de l'image
            fileInfo.style.display = 'none'; // Masque les informations du fichier
            labelInput.style.display = 'none'; // Masque le label d'upload
        };
        reader.readAsDataURL(file); // Lit le contenu du fichier comme URL
    } else {
        alert('La taille du fichier ne doit pas dépasser 4 Mo.'); // Affiche une alerte si le fichier dépasse 4 Mo
        fileInput.value = ''; // Réinitialise la valeur de l'input fichier
        imagePreview.style.display = 'none'; // Masque l'image de prévisualisation
        imageIcon.style.display = 'block'; // Affiche l'icône de l'image
        fileInfo.style.display = 'block'; // Affiche les informations du fichier
        labelInput.style.display = 'flex'; // Affiche le label d'upload
    }

    updateSubmitButtonState(); // Met à jour l'état du bouton de soumission
}

// Gère la soumission du formulaire
async function handleFormSubmit(event) {
    event.preventDefault(); // Empêche l'action par défaut du formulaire
    
    const form = event.target; // Sélectionne le formulaire
    const formData = new FormData(); // Crée un nouvel objet FormData

    const title = form.querySelector('#title').value; // Récupère la valeur du titre
    const category = form.querySelector('#category').value; // Récupère la valeur de la catégorie
    const fileInput = form.querySelector('#file-upload'); // Sélectionne l'élément input de fichier
    const file = fileInput.files[0]; // Récupère le fichier sélectionné

    // Vérifie que tous les champs sont présents
    if (!title || !category || !file) {
        alert("Tous les champs sont obligatoires !"); // Affiche une alerte si des champs sont manquants
        return;
    }

    // Ajouter les champs à l'objet FormData
    formData.append('title', title); // Ajoute le titre à formData
    formData.append('category', category); // Ajoute la catégorie à formData
    formData.append('image', file); // Ajoute le fichier à formData

    const token = localStorage.getItem("token"); // Récupère le token d'authentification depuis le localStorage

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST', // Utilise la méthode POST pour ajouter le projet
            headers: {
                'Authorization': `Bearer ${token}` // Ajoute le token dans les en-têtes de la requête
            },
            body: formData // Ajoute formData au corps de la requête
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // Vérifie si la réponse est correcte

        alert("Photo ajoutée avec succès !"); // Affiche une alerte de succès
        
        resetModalContent() // Réinitialise le contenu du modal
        initializeProjects() // Actualise le contenu dans gallery.js
    } catch (error) {
        alert("Une erreur est survenue lors de l'ajout de la photo."); // Affiche une alerte en cas d'erreur
        console.error("Erreur lors de l'ajout de la photo :", error); // Affiche une erreur dans la console
    }
}

// --- Autres Fonctions de Gestion des Modals ---

// Ajoute l'écouteur pour fermer le modal
function addCloseModalListener() {
    const closeModal = document.querySelector('.modal-close'); // Sélectionne l'élément pour fermer le modal
    if (closeModal) { // Vérifie si l'élément existe
        closeModal.addEventListener('click', () => { // Ajoute un écouteur d'événement pour le clic
            const modalContainer = document.querySelector('.modal-container'); // Sélectionne le conteneur du modal
            if (modalContainer) { // Vérifie si le conteneur existe
                modalContainer.classList.remove('active'); // Retire la classe active du conteneur
                resetModalContent(); // Réinitialise le contenu du modal
            }
        });
    }
}

// Ajoute l'écouteur pour retourner au modal précédent
function addReturnModalListener() {
    const returnModal = document.querySelector('.modal-return'); // Sélectionne l'élément pour retourner au modal précédent
    if (returnModal) { // Vérifie si l'élément existe
        returnModal.addEventListener('click', resetModalContent); // Ajoute un écouteur d'événement pour le clic
    }
}

// Réinitialise le contenu du modal
function resetModalContent() {
    const modalContent = document.querySelector('.modal-content'); // Sélectionne le contenu du modal
    modalContent.innerHTML = ""; // Vide le contenu du modal
    const returnModal = document.querySelector('.modal-return'); // Sélectionne l'élément pour retourner au modal précédent
    if (returnModal) {
        returnModal.style.visibility = 'hidden'; // Masque l'élément de retour
    }
    insertModalGallery(); // Insère la galerie de photos dans le modal
    changeModalListener(); // Change le contenu du modal pour afficher le formulaire d'ajout
}

// Change le contenu du modal pour afficher le formulaire d'ajout
function changeModalListener() {
    const addPictureBtnModal = document.querySelector('.modal-btn'); // Sélectionne le bouton pour ajouter une photo
    if (addPictureBtnModal) { // Vérifie si le bouton existe
        addPictureBtnModal.addEventListener('click', () => { // Ajoute un écouteur d'événement pour le clic
            const modalContent = document.querySelector('.modal-content'); // Sélectionne le contenu du modal
            if (modalContent) { // Vérifie si le contenu existe
                modalContent.innerHTML = ""; // Vide le contenu du modal
                const returnModal = document.querySelector('.modal-return'); // Sélectionne l'élément pour retourner au modal précédent
                if (returnModal) {
                    returnModal.style.visibility = 'visible'; // Affiche l'élément de retour
                }
                insertModalForm(); // Insère le formulaire d'ajout de photo dans le modal
            }
        });
    }
}

// --- Point d'entrée du script ---

// Initialise l'état du document une fois chargé
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token"); // Récupère le token d'authentification depuis le localStorage

    if (token) { // Vérifie si le token existe
        initializeAuthenticatedState(); // Initialise l'état authentifié
        
        Array.from(document.querySelectorAll('.modal-open')).map(button => { // Sélectionne tous les éléments pour ouvrir le modal
            button.addEventListener('click', () => { // Ajoute un écouteur d'événement pour le clic
                const modalContainer = document.querySelector('.modal-container'); // Sélectionne le conteneur du modal
                if (modalContainer) { // Vérifie si le conteneur existe
                    modalContainer.classList.add('active'); // Ajoute la classe active au conteneur
                }
            });
        });

        addCloseModalListener(); // Ajoute l'écouteur pour fermer le modal
        addReturnModalListener(); // Ajoute l'écouteur pour retourner au modal précédent
    } else {
        Array.from(document.querySelectorAll(".auth-required")).map(element => element.remove()); // Supprime tous les éléments nécessitant une authentification
    }
});
