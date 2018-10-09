export function saveFile(filename, data, contentType = 'application/json') {
  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([ data ], { type: contentType }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
