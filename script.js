const repoList = document.getElementById("repo-list");

async function getRepos() {
    const response = await fetch("https://api.github.com/users/aInsan/repos");
    const data = await response.json();
    return data;
}

function displayRepos(repos) {
    repoList.innerHTML = "";
    repos.forEach(repo => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = repo.html_url;
        a.target = "_blank";
        a.textContent = repo.name;
        li.appendChild(a);
        repoList.appendChild(li);
    });
}

getRepos().then(data => displayRepos(data));
