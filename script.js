document.addEventListener("DOMContentLoaded", async () => {
  const projectContainer = document.getElementById("project-container");
  const resumeOverlay = document.getElementById("resume-overlay");
  const closeResume = document.getElementById("close-resume");
  const resumeBtn = document.getElementById("resume-btn");
  const projectOverlay = document.getElementById("project-overlay");
  const projectDetails = document.getElementById("project-details");
  const closeProject = document.getElementById("close-project");

  // Load Projects
  const res = await fetch("data/projects.json");
  const projects = await res.json();
  renderProjects(projects);

  // Format the date into something readable (e.g., Jan 3, 2025)
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Render project cards
  function renderProjects(projects) {
    projects.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      var status = "";
      if (p.active) {
        status = `<span class="status active">Active</span>`;
      }

      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div class="project-card-content">
          <div class="project-header">
            <h3>${p.title}</h3>
            ${status}
          </div>
          <p class="created">${formatDate(p.created_at)}</p>
          <p>${p.short_description}</p>
          <p class="skills"><strong>Skills:</strong> ${p.skills.join(", ")}</p>
        </div>
      `;
      card.addEventListener("click", () => openProject(p));
      projectContainer.appendChild(card);
    });
  }

  // Résumé overlay
  resumeBtn.addEventListener("click", () => resumeOverlay.classList.remove("hidden"));
  closeResume.addEventListener("click", () => resumeOverlay.classList.add("hidden"));

  // Project detail overlay
  function openProject(project) {
    const status = project.active
      ? `<span class="status active">Active</span>`
      : `<span class="status complete">Completed</span>`;

    let html = `
      <div class="project-meta">
        <h2>${project.full_content.title}</h2>
        <p class="created">${formatDate(project.created_at)}</p>
        ${status}
      </div>
    `;

    project.full_content.sections.forEach(section => {
      if (section.p) html += `<p>${section.p.replace(/\n/g, "<br>")}</p>`;
      if (section.media) html += `<img src="${section.media}" alt="">`;
    });

    projectDetails.innerHTML = html;
    projectOverlay.classList.remove("hidden");
  }

  closeProject.addEventListener("click", () => projectOverlay.classList.add("hidden"));
});
