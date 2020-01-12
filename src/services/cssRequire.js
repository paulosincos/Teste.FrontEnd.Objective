const basePath = '/app/';

export default function cssRequire(path) {
  const generatedId = encodeURIComponent(path);
  if (!document.getElementById(generatedId)) {
    const link  = document.createElement('link');
    link.id   = generatedId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = basePath + path + '.css';
    document.head.appendChild(link);
  }
}
