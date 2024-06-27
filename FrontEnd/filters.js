//Envoie une requête HTTP GET à l'URL pour récupérer des données, puis les convertit en format JSON.
const apiUrl = fetch("http://localhost:5678/api/categories")
    .then(category => category.json())
    .then (data => {
        console.log(data)
        createFiltre(data)
    })

//Création des boutons filtres
function createFiltre(data) {
    let categories = data
    categories.unshift({id: 0, name : "Tous"})
    categories.forEach((category, index) => {
        let button = document.createElement("button")
        button.textContent = category.name
        document.querySelector("div.filter").appendChild(button)
    })
}

