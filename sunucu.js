'use strict';

const http = require('node:http');

const PORT = 3000;

// Her sayfa aynı HTML iskeletini kullanır. Dosyalar UTF-8 olarak saklanır.
function sayfa(baslik, icerik) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${baslik} | BMH231</title>
  <style>
    body { max-width: 760px; margin: 60px auto; padding: 0 24px;
      font: 18px/1.7 system-ui, sans-serif; color: #183343; background: #f5f8fa; }
    main { padding: 32px; background: white; border: 1px solid #dce5eb; border-radius: 16px; }
    h1 { line-height: 1.2; } a { color: #075b94; } li { margin: 8px 0; }
    small { color: #526776; } code { font-size: 0.9em; }
  </style>
</head>
<body><main>${icerik}<hr><small>BMH231 · Web Programlama · Ödev 1</small></main></body>
</html>`;
}

const sunucu = http.createServer((istek, yanit) => {
  // Sorgu dizesi, yönlendirmede kullanılan yoldan ayrılır.
  const yol = new URL(istek.url, 'http://localhost:3000').pathname;
  console.log(`${istek.method} ${yol}`);

  if (yol === '/') {
    yanit.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    yanit.end(sayfa('Ana sayfa', `
      <h1>Web Programlama Projem</h1>
      <p>Node.js ile hazırlanan küçük HTTP sunucusuna hoş geldiniz.</p>
      <ul>
        <li><a href="/hakkimda">Hakkımda</a></li>
        <li><a href="/api/ders">Ders bilgileri (JSON)</a></li>
        <li><a href="/api/agep">AGEP takvimi (JSON)</a></li>
      </ul>`));
    return;
  }

  yanit.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  yanit.end('Sayfa bulunamadı');
});

sunucu.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
