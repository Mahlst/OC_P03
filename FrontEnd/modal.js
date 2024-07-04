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
});

// Fonction pour ajouter l'élément de mode édition
function addEditModeElement() {
    // Création d'un div pour le mode édition
    const editModeDiv = document.createElement('div');
    editModeDiv.classList.add('edit-mode', 'auth-required');

    // Création d'un lien
    const link = document.createElement('a');
    link.href = "";

    // Création d'une icône
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    // Création d'un div et d'un texte pour le mode édition
    const div = document.createElement('div');
    const text = document.createTextNode('Mode édition');

    // Ajout de l'icône et du texte au lien
    link.appendChild(icon);
    link.appendChild(div);
    div.appendChild(text);
    editModeDiv.appendChild(link);

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

    // Création d'un lien
    const link = document.createElement('a');
    link.href = "";

    // Création d'une icône
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    // Création d'un div et d'un texte pour la modification de projet
    const div = document.createElement('div');
    const text = document.createTextNode('modifier');

    // Ajout de l'icône et du texte au lien
    link.appendChild(icon);
    link.appendChild(div);
    div.appendChild(text);
    editProjectDiv.appendChild(link);

    // Insertion de la modification de projet dans le conteneur du titre du portfolio
    const portfolioTitleContainer = document.querySelector('.portfolio_title_container');
    if (portfolioTitleContainer) {
        portfolioTitleContainer.appendChild(editProjectDiv);
    } else {
        console.error('Element with class .portfolio_title_container not found');
    }
}
