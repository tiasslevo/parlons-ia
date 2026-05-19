(() => {
  const root = document.querySelector("[data-download-file]");
  if (!root) return;

  const file = root.dataset.downloadFile;
  const filename = root.dataset.downloadName || file.split("/").pop();
  const autoDownload = root.dataset.autoDownload === "true";
  const downloadBtn = document.querySelector("[data-role='download']");
  const preview = document.querySelector("[data-role='preview']");
  const status = document.querySelector("[data-role='status']");

  const attachDownload = async () => {
    const resp = await fetch(file);
    if (!resp.ok) throw new Error(`Impossible de charger ${file}`);
    const text = await resp.text();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadBtn.href = url;
    downloadBtn.download = filename;
    if (preview) preview.textContent = text;
    if (status) {
      status.textContent = autoDownload
        ? "Le telechargement devrait demarrer automatiquement. Sinon, utilise le bouton."
        : "Le skill est pret. Utilise le bouton pour le telecharger ou lis l'apercu juste en dessous.";
    }
    if (autoDownload) {
      setTimeout(() => downloadBtn.click(), 250);
    }
  };

  attachDownload().catch((err) => {
    if (status) status.textContent = err.message;
    if (preview) preview.textContent = "Erreur de chargement du skill.";
  });
})();
