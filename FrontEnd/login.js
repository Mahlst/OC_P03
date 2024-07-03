document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            alert("Authentification réussie !");
            // Rediriger l'utilisateur vers une autre page si nécessaire
            location.href = 'index.html';
        } else {
            alert("Échec de l'authentification.");
        }
    });
});
