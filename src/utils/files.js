export function saveFile(filename, data, content_type = 'application/json') {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([ data ], { type: content_type }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
