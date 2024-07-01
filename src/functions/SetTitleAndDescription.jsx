export default function SetTitleAndDescription(title, description) {
  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  } else {
    const newMetaDescription = document.createElement("meta");
    newMetaDescription.name = "description";
    newMetaDescription.content = description;
    document.head.appendChild(newMetaDescription);
  }
}
