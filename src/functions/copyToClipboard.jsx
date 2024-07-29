export default function copyURLToClipboard(shareURL) {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");
  textarea.value = shareURL;
  textarea.setAttribute("readonly", ""); // Prevent mobile devices from popping up the keyboard
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px"; // Move the textarea off-screen
  document.body.appendChild(textarea);

  // Select and copy the URL from the textarea
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length); // For mobile devices
  document.execCommand("copy");

  // Clean up: remove the textarea from the DOM
  document.body.removeChild(textarea);
}
