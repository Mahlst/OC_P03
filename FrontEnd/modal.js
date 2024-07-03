document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const authRequiredElements = document.querySelectorAll(".auth-required");
    const loginLogoutElement = document.getElementById("login-logout");

    if (token) {
        // Afficher les éléments pour les utilisateurs authentifiés
        addEditModeElement()
        addEditProjectElement()
        
        // Changer le texte du lien de connexion en déconnexion
        loginLogoutElement.textContent = "logout";
        loginLogoutElement.href = "#";
        loginLogoutElement.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            alert("Vous êtes déconnecté.");
            window.location.reload();
        });
    } else {
        // Masquer les éléments pour les utilisateurs non authentifiés
        authRequiredElements.forEach(element => {
            element.remove();
        });
    }
});

function addEditModeElement() {
    const editModeDiv = document.createElement('div');
    editModeDiv.classList.add('edit-mode', 'auth-required');

    const link = document.createElement('a');
    link.href = "";

    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    const div = document.createElement('div');
    const text = document.createTextNode('Mode édition');

    link.appendChild(icon);
    link.appendChild(div);
    div.appendChild(text)
    editModeDiv.appendChild(link);

    const bodyContainer = document.querySelector('.body_container');
    if (bodyContainer) {
        document.body.insertBefore(editModeDiv, bodyContainer);
    } else {
        console.error('Element with class .body_container not found');
    }
}

function addEditProjectElement() {
    const editProjectDiv = document.createElement('div');
    editProjectDiv.classList.add('edit-project', 'auth-required');

    const link = document.createElement('a');
    link.href = "";

    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    const div = document.createElement('div');

    const text = document.createTextNode('modifier');

    link.appendChild(icon);
    link.appendChild(div);
    div.appendChild(text)
    editProjectDiv.appendChild(link);

    const portfolioTitleContainer = document.querySelector('.portfolio_title_container');
    if (portfolioTitleContainer) {
        portfolioTitleContainer.appendChild(editProjectDiv);
    } else {
        console.error('Element with class .portfolio_title_container not found');
    }
}