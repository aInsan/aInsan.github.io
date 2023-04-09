const repoList = document.getElementById('repo-list');

fetch('https://api.github.com/users/aInsan/repos')
  .then(response => response.json())
  .then(data => {
    data.forEach(repo => {
      const repoItem = document.createElement('li');
      repoItem.classList.add('repo-item');
      const repoLink = document.createElement('a');
      repoLink.href = repo.html_url;
      repoLink.textContent = repo.name;
      repoItem.appendChild(repoLink);
      repoList.appendChild(repoItem);
    });
  })
  .catch(error => console.log(error));
