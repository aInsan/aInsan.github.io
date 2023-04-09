const projectList = document.querySelector("#project-list");

const displayProjects = async () => {
    try {
        const response = await fetch("https://api.github.com/users/aInsan/repos");
        const projects = await response.json();
        projects.forEach((project) => {
            const projectItem = document.createElement("li");
            projectItem.classList.add("project-item");
            projectItem.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <a href="${project.html_url}" target="_blank">View on GitHub</a>
            `;
            projectList.appendChild(projectItem);
        });
    } catch (error) {
        console.error(error);
    }
};

displayProjects();
