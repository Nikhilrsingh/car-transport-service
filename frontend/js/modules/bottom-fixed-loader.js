const path = window.location.pathname;
const isInPagesFolder = path.includes("/pages/");
const base = isInPagesFolder ? ".." : ".";
fetch(`${base}/components/bottom-fixed-buttons.html`)
  .then((res) => res.text())
  .catch(err => console.error(err))