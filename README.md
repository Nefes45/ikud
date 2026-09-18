<div align="center">

# IKUD — Live Precious Metals Price Platform

**Real-time gold and foreign-exchange price display with a configurable administration panel.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/Data-WebSocket-010101)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

[Türkçe](#türkçe) · [English](#english)

</div>

## Türkçe

IKUD; kuyumculuk ve döviz sektöründe canlı fiyatların müşterilere hızlı, okunabilir ve yönetilebilir biçimde sunulması için geliştirilmiş bir web uygulamasıdır.

### Öne çıkanlar

- Altın, döviz ve parite fiyatlarının canlı gösterimi
- WebSocket tabanlı gerçek zamanlı veri akışı
- Yetkilendirilmiş kullanıcı girişi ve korumalı sayfalar
- Fiyat yayını başlatma/durdurma ve anlık fiyat dondurma
- 14 ve 18 ayar görünürlük kontrolleri
- Kayan yazı içeriği ve hız yönetimi
- Yönetim paneli üzerinden ekran ayarları
- Responsive kullanıcı arayüzü

### Teknolojiler

- React 18, React Router
- Node.js, Express
- WebSocket
- Firebase, MongoDB/Mongoose ve MySQL istemcileri
- Chart.js, Bootstrap
- Formik ve Yup
- JWT tabanlı kimlik doğrulama bileşenleri

### Yerel kurulum

```bash
git clone https://github.com/ozcan-karakoc/ikud.git
cd ikud
npm install
npm start
```

Uygulama varsayılan olarak `http://localhost:3003` adresinde çalışır. Sunucu tarafını ayrı çalıştırmak için:

```bash
npm run server
```

> Ortam değişkenleri ve harici servis bilgileri güvenlik nedeniyle repoda paylaşılmamalıdır. Yerel kullanım için kendi `.env` dosyanızı oluşturun.

### Durum

Bu proje aktif geliştirme/portföy sunumu amacıyla paylaşılmaktadır. Üretim ortamına almadan önce ortam değişkenleri, yetkilendirme, hata yönetimi ve test kapsamı gözden geçirilmelidir.

---

## English

IKUD is a web application built for the jewellery and foreign-exchange industry. It presents live market prices in a fast, readable interface and provides operational controls through an administration panel.

### Highlights

- Live gold, currency and parity prices
- Real-time WebSocket data flow
- Authenticated users and protected routes
- Start/stop streaming and freeze displayed prices
- Visibility controls for 14K and 18K prices
- Configurable ticker text and speed
- Screen configuration through an administration panel
- Responsive user interface

### Tech stack

- React 18 and React Router
- Node.js and Express
- WebSocket
- Firebase, MongoDB/Mongoose and MySQL clients
- Chart.js and Bootstrap
- Formik and Yup
- JWT-oriented authentication components

### Local setup

```bash
git clone https://github.com/ozcan-karakoc/ikud.git
cd ikud
npm install
npm start
```

The application runs at `http://localhost:3003` by default. To start the server separately:

```bash
npm run server
```

> Secrets and external service credentials must not be committed. Create your own local `.env` file.

### Project status

Shared as an actively developed portfolio project. Review environment configuration, authorization, error handling and test coverage before production deployment.

## Author

**Özcan Karakoç** — Full-Stack Software Developer  
[GitHub](https://github.com/ozcan-karakoc)
