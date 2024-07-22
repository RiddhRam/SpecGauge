export default function SetCanonical(link) {
  // Change canonical
  const canonicalURL = document.querySelector('link[rel="canonical"]');
  if (canonicalURL) {
    canonicalURL.setAttribute("href", link);
  } else {
    // If there was no canonical then create one
    const newCanonicalURL = document.createElement("link");
    newCanonicalURL.rel = "canonical";
    newCanonicalURL.href = link;
    document.head.appendChild(newCanonicalURL);
  }
}
