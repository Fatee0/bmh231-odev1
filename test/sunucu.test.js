'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const dayjs = require('dayjs');

let processHandle;

before(async () => {
  processHandle = spawn(process.execPath, ['sunucu.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, TZ: 'Europe/Istanbul' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Sunucu başlatılamadı')), 5000);
    processHandle.once('error', (error) => { clearTimeout(timer); reject(error); });
    processHandle.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Sunucu ${code} koduyla kapandı; 3000 portu dolu olabilir.`));
    });
    processHandle.stdout.once('data', () => { clearTimeout(timer); resolve(); });
  });
});

after(async () => {
  if (processHandle && processHandle.exitCode === null) {
    await new Promise((resolve) => {
      processHandle.once('exit', resolve);
      processHandle.kill();
    });
  }
});

for (const yol of ['/', '/hakkimda']) {
  test(`${yol}: HTML, UTF-8 ve 200`, async () => {
    const response = await fetch(`http://localhost:3000${yol}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    const body = await response.text();
    assert.match(body, /<html lang="tr">/);
    assert.match(body, yol === '/' ? /href="\/hakkimda"/ : /Fatmanur Bazoğlu/);
  });
}

test('Ders API: gerçek ders bilgileri ve JSON başlığı', async () => {
  const response = await fetch('http://localhost:3000/api/ders');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.deepEqual(await response.json(), { kod: 'BMH231', ad: 'Web Programlama', gun: 'Cuma' });
});

test('AGEP: saatten bağımsız kalan takvim günü', async () => {
  const response = await fetch('http://localhost:3000/api/agep');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  const data = await response.json();
  assert.equal(data.sonTeslimTarihi, '01.11.2026');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul',
    year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const expected = Math.round((Date.UTC(2026, 10, 1) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  assert.equal(data.kalanGun, expected);
  assert.equal(dayjs('2026-11-01').diff(dayjs('2026-10-20'), 'day'), 12);
  assert.equal(dayjs('2026-11-01').diff(dayjs('2026-11-01'), 'day'), 0);
});

test('Sorgu dizesi doğru yolu bozmuyor', async () => {
  const response = await fetch('http://localhost:3000/api/ders?kaynak=test');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).kod, 'BMH231');
});

test('Bilinmeyen yol: 404, düz metin ve Türkçe karakterler', async () => {
  const response = await fetch('http://localhost:3000/olmayan-sayfa');
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.equal(await response.text(), 'Sayfa bulunamadı');
});

for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']) {
  test(`${method}: 405 ve Allow: GET`, async () => {
    const response = await fetch('http://localhost:3000/api/ders', { method });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'GET');
    assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
  });
}

test('Bilinmeyen yola POST da 405 döndürür', async () => {
  const response = await fetch('http://localhost:3000/yok', { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
});
