# BMH231 - Web Programlama Ödev 1

Node.js'in yerleşik `http` modülü ve `dayjs` paketiyle geliştirilen küçük bir
web sunucusu. HTTP yanıtları, JSON, durum kodları ve Git dallanma/birleştirme
sürecini örneklendirir. Express kullanılmaz.

Öğrenci: **Fatmanur Bazoğlu**. Ders günü: **Cuma**.

## Kurulum

Node.js LTS (22 veya üzeri), npm ve Git gereklidir.

```bash
git clone https://github.com/Fatee0/bmh231-odev1.git
cd bmh231-odev1
npm install
npm start
```

Tarayıcıda `http://localhost:3000/` adresini açın. Durdurmak için terminalde
`Ctrl+C` kullanın. 3000 portunu kullanan başka bir program varsa önce onu durdurun.
`package-lock.json` depoda bulunur; tam kilitli kurulum için `npm ci` de kullanılabilir.

Gün hesabı sunucunun yerel saat dilimindeki takvim tarihlerine göre yapılır.
Türkiye dışında çalıştırırken Linux/macOS'ta `TZ=Europe/Istanbul npm start`,
PowerShell'de `$env:TZ="Europe/Istanbul"; npm start` kullanılabilir.

## Desteklenen yollar

| Yol / yöntem | Durum | İçerik |
| --- | --- | --- |
| `GET /` | 200 | Ana sayfa; hakkımda ve API bağlantıları |
| `GET /hakkimda` | 200 | Kısa tanıtım sayfası |
| `GET /api/ders` | 200 | Ders kodu, adı ve günü (JSON) |
| `GET /api/agep` | 200 | 01.11.2026 tarihi, bugün ve kalan takvim günü (JSON) |
| `GET /olmayan-sayfa` ve diğer yollar | 404 | `Sayfa bulunamadı` düz metni |
| GET dışındaki bütün yöntemler | 405 | Düz metin ve `Allow: GET` başlığı |

HTML, JSON ve düz metin yanıtlarında uygun `Content-Type` ile `charset=utf-8`
gönderilir. İstek yöntemi ve yolu terminale yazılır. Sorgu dizesi yönlendirmeden
ayrılır; örneğin `/api/ders?ornek=1` de aynı ders verisini döndürür.
Son teslim günü kalan gün `0`, sonrasında geçen günleri gösterecek şekilde
negatif olur. 20.10.2026 tarihinde sonuç `12` gündür.

## Elle doğrulama

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/hakkimda
curl -i http://localhost:3000/api/ders
curl -i http://localhost:3000/api/agep
curl -i http://localhost:3000/olmayan-sayfa
curl -i -X POST http://localhost:3000/api/ders
```

Windows PowerShell'de `curl` yerine `curl.exe` yazın.

## Otomatik doğrulama

Başka terminalde çalışan sunucuyu durdurduktan sonra:

```bash
npm test
```

Testler kendi sunucusunu 3000 portunda başlatır; yolları, başlıkları,
yöntem kısıtlamasını, UTF-8 metni ve takvim günü hesabını denetler.

## Git geçmişi

`hakkimda` dalı tanıtım sayfasını ekler. `baslik` dalıyla `main` aynı `<h1>`
satırını farklı değiştirir. Oluşan gerçek birleştirme çakışması, iki metni
bir araya getiren başlıkla çözülmüştür. Geçmişi görmek için:

```bash
git log --oneline --graph --all
```

## Yapay zekâ desteği

Bu proje Codex (OpenAI) yardımıyla hazırlanmıştır. Kod üretimi, Git işlemleri,
testler ve dokümantasyon için sağlanan destek `YAPAY_ZEKA_KULLANIMI.md` içinde
açıklanır. İlk geliştirme commit'lerinin yazarı bu nedenle Codex olarak
kaydedilmiştir. Öğrenci, teslim öncesinde kodu incelemeli ve açıklayabilmelidir.
