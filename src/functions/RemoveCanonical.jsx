export default function RemoveCanonical() {
  // Change canonical
  const canonicalURL = document.querySelector('link[rel="canonical"]');
  if (canonicalURL) {
    document.head.removeChild(canonicalURL);
  }
}
