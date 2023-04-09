const GITHUB_URL = 'https://api.github.com/users/aInsan/repos?sort=updated&per_page=6';

async function getRepos() {
  try {
    const response = await fetch(GITHUB_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function createProjectItem(project) {
  const { name, html_url } = project;
  const description = project.description || 'No description provided.';
  const updated = new Date(project.updated_at).toLocaleDateString();
  const language = project.language || 'N/A';

  const projectItem = `
    <div class="project-item">
      <h3>${name}</h3>
      <p>${description}</p>
      <p><strong>Language:</strong> ${language}</p>
      <p><strong>Last updated:</strong> ${updated}</p>
      <a href="${html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
    </div>
  `;

  return projectItem;
}

async function displayProjects() {
  const projectsContainer = document.querySelector('.project-grid');

  try {
    const projects = await getRepos();
    const projectItems = projects.map(project => createProjectItem(project)).join('');
    projectsContainer.innerHTML = projectItems;
  } catch (error) {
    console.error(error);
    projectsContainer.innerHTML = '<p>Unable to load projects. Please try again later.</p>';
  }
}

displayProjects();
