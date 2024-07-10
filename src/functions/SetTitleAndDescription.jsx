export default function SetTitleAndDescription(title, description, url) {
  // Change title
  document.title = title;

  // Change description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  } else {
    // If there was no description then create one
    const newMetaDescription = document.createElement("meta");
    newMetaDescription.name = "description";
    newMetaDescription.content = description;
    document.head.appendChild(newMetaDescription);
  }

  // Change OpenGraph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  } else {
    const newMetaTitle = document.createElement("meta");
    newMetaTitle.property = "og:title";
    newMetaTitle.content = title;
    document.head.appendChild(newMetaTitle);
  }

  // Change OpenGraph description
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  } else {
    const newMetaDescription = document.createElement("meta");
    newMetaDescription.property = "og:description";
    newMetaDescription.content = description;
    document.head.appendChild(newMetaDescription);
  }

  // Change OpenGraph url
  const ogURL = document.querySelector('meta[property="og:url"]');
  if (ogURL) {
    ogURL.setAttribute("content", url);
  } else {
    const newMetaURL = document.createElement("meta");
    newMetaURL.property = "og:url";
    newMetaURL.content = url;
    document.head.appendChild(newMetaURL);
  }
}
