'use strict';

const http = require('node:http');
const dayjs = require('dayjs');

const PORT = 3000;
// Kişisel bilgilerin gelince bu alanları güncelle.
const DERS_GUNU = '[DERS GÜNÜNÜ YAZ]';

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

  // Yöntem kontrolü bütün yollardan önce yapılır.
  if (istek.method !== 'GET') {
    yanit.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      Allow: 'GET',
    });
    yanit.end('Yönteme izin verilmiyor');
    return;
  }

  if (yol === '/api/ders') {
    yanit.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    yanit.end(JSON.stringify({ kod: 'BMH231', ad: 'Web Programlama', gun: DERS_GUNU }));
    return;
  }

  if (yol === '/hakkimda') {
    yanit.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    yanit.end(sayfa('Hakkımda', `
      <h1>Hakkımda</h1>
      <p>Merhaba, ben [AD SOYAD]. Yozgat Bozok Üniversitesi Bilgisayar Mühendisliği öğrencisiyim.</p>
      <p>Bu projeyi BMH231 Web Programlama dersinde HTTP, Node.js ve Git konularını öğrenmek için hazırlıyorum.</p>
      <p><a href="/">Ana sayfaya dön</a></p>`));
    return;
  }

  if (yol === '/api/agep') {
    // İki tarihi de gün başlangıcına çekmek saatten kaynaklanan eksik gün hesabını önler.
    // Sunucunun yerel saat dilimi kullanılır; Türkiye için TZ=Europe/Istanbul uygundur.
    const bugun = dayjs().startOf('day');
    const sonTeslim = dayjs('2026-11-01').startOf('day');
    const kalanGun = sonTeslim.diff(bugun, 'day');
    yanit.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    yanit.end(JSON.stringify({
      sonTeslimTarihi: sonTeslim.format('DD.MM.YYYY'),
      bugun: bugun.format('DD.MM.YYYY'),
      kalanGun,
    }));
    return;
  }

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
