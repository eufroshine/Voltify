# ⚡ Voltify - Smart Electricity Management System

<div align="center">

![Voltify Logo](https://img.shields.io/badge/Voltify-DSS-blue?style=for-the-badge&logo=lightning)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Decision Support System (DSS) untuk Monitoring dan Analisis Penggunaan Listrik Rumah Tangga dengan Fuzzy Logic**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📖 **Tentang Voltify**

Voltify adalah aplikasi web Decision Support System (DSS) yang membantu pengguna menganalisis dan mengoptimalkan penggunaan listrik rumah tangga. Sistem ini menggunakan **Fuzzy Logic** untuk mengklasifikasikan pola penggunaan listrik menjadi kategori **Hemat**, **Normal**, atau **Boros**, serta memberikan rekomendasi untuk penghematan energi.

### **🎯 Tujuan Sistem**
- Membantu pengguna memantau konsumsi listrik harian
- Memberikan analisis otomatis menggunakan Fuzzy Logic
- Menyediakan visualisasi data dalam bentuk grafik
- Memberikan rekomendasi penghematan energi
- Mengestimasi biaya listrik bulanan

---

## ✨ **Features**

### **1. Manajemen Alat Elektronik**
- ✅ Tambah, lihat, dan hapus alat elektronik
- ✅ Input spesifikasi: Nama, Daya (Watt), Jam Pemakaian, Kategori
- ✅ Perhitungan otomatis kWh per hari

### **2. Analisis Fuzzy Logic**
- ✅ Klasifikasi penggunaan: Hemat / Normal / Boros
- ✅ Fuzzy Score (0-100)
- ✅ Membership values visualization
- ✅ Rekomendasi berdasarkan kategori

### **3. Dashboard & Statistik**
- ✅ Total penggunaan kWh
- ✅ Total biaya listrik
- ✅ Rata-rata harian
- ✅ Estimasi bulanan
- ✅ Breakdown kategori (Hemat/Normal/Boros)

### **4. Visualisasi Data**
- ✅ Line Chart & Bar Chart
- ✅ Tracking penggunaan 7/14/30 hari
- ✅ Grafik biaya dan konsumsi

### **5. History Management**
- ✅ Lihat riwayat penggunaan harian
- ✅ Input tanggal manual (untuk data historis)
- ✅ Hapus data per item atau semua history

### **6. Settings**
- ✅ Konfigurasi harga per kWh
- ✅ Set target bulanan
- ✅ Referensi tarif listrik PLN

---

## 🛠️ **Tech Stack**

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | 5.x | Build Tool |
| Axios | 1.x | HTTP Client |
| Recharts | 2.x | Data Visualization |
| Lucide React | Latest | Icons |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | JavaScript Runtime |
| Express.js | 5.x | Web Framework |
| Mongoose | 8.x | MongoDB ODM |
| CORS | 2.x | Cross-Origin Resource Sharing |
| Dotenv | 17.x | Environment Variables |

### **Database**
| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | 6.x+ | NoSQL Database |

### **Development Tools**
- Nodemon - Auto-restart server
- MongoDB Compass - Database GUI (optional)

---

## 📋 **Prerequisites**

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **MongoDB** (v6 atau lebih baru) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)
- **VS Code** atau text editor lainnya

---

## 🚀 **Installation**

### **1. Clone Repository**
```bash
git clone https://github.com/username/voltify.git
cd voltify
```

### **2. Setup MongoDB**

#### **Opsi A: MongoDB Local**
```bash
# Install MongoDB Community Edition
# Jalankan MongoDB service
mongod --dbpath="C:\data\db"  # Windows
# atau
sudo systemctl start mongod    # Linux
```

#### **Opsi B: MongoDB Atlas (Cloud - Recommended)**

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create Free Cluster (M0)
3. Setup Database User & Network Access
4. Copy Connection String

### **3. Setup Backend**
```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env
touch .env  # atau buat manual di Windows
```

**Edit file `.env`:**
```env
PORT=5000

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/voltify

# Atau MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voltify?retryWrites=true&w=majority
```

### **4. Setup Frontend**
```bash
# Masuk ke folder frontend
cd ../frontend

# Install dependencies
npm install
```

### **5. (Optional) Seed Data**

Untuk mengisi data contoh:
```bash
cd backend
node seed.js
```

---

## 🎮 **Usage**

### **Menjalankan Aplikasi**

#### **Terminal 1: Backend**
```bash
cd backend
npm run dev
```

Output:
```
🚀 Voltify Server running on port 5000
📡 API URL: http://localhost:5000
✅ MongoDB connected successfully
```

#### **Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

Output:
```
VITE v7.1.11 ready in 1729 ms
➜ Local:   http://localhost:5173/
```

#### **Buka Browser**
```
http://localhost:5173
```

---

## 📱 **Cara Penggunaan Aplikasi**

### **1. Setup Awal**

1. Buka tab **"⚙️ Pengaturan"**
2. Set **Harga per kWh** sesuai tarif PLN Anda (default: Rp 1.445)
3. Set **Target Bulanan** (default: 300 kWh)
4. Klik **"Simpan Pengaturan"**

### **2. Tambah Alat Elektronik**

1. Buka tab **"⚡ Hitung Penggunaan"**
2. Isi form:
   - **Nama Alat**: Contoh "Kulkas"
   - **Kategori**: Pilih kategori (Pendingin, Penerangan, dll)
   - **Daya (Watt)**: Contoh 150
   - **Jam Pemakaian per Hari**: Contoh 24
3. Klik **"Tambah Alat"**
4. Ulangi untuk semua alat elektronik Anda

### **3. Hitung Penggunaan**

1. Di tab **"⚡ Hitung Penggunaan"**
2. Pilih **tanggal** (default: hari ini)
3. Centang alat-alat yang ingin dihitung
4. Klik **"Hitung Penggunaan"**
5. Lihat hasil analisis:
   - Kategori (Hemat/Normal/Boros)
   - Total kWh dan Biaya
   - Fuzzy Score
   - Breakdown per alat
   - Saran & Rekomendasi

### **4. Lihat Dashboard**

1. Buka tab **"📊 Dashboard"**
2. Pilih periode (7/14/30 hari)
3. Lihat statistik:
   - Total penggunaan & biaya
   - Rata-rata harian
   - Estimasi bulanan
   - Breakdown kategori
4. Lihat **grafik** tren penggunaan

### **5. Kelola History**

1. Buka tab **"📜 History"**
2. Lihat semua riwayat penggunaan
3. Hapus data yang tidak diperlukan
4. Atau klik **"Hapus Semua History"** untuk reset

---

## 🧪 **Studi Kasus**

### **Contoh Penggunaan: Rumah Tangga 1300 VA**
```
Alat Elektronik:
1. Kulkas           : 150W × 24h = 3.6 kWh
2. Lampu LED (3x)   : 15W × 10h = 0.15 kWh
3. TV LED 32"       : 80W × 6h = 0.48 kWh
4. Rice Cooker      : 400W × 2h = 0.8 kWh
5. Kipas Angin      : 60W × 10h = 0.6 kWh
6. Charger HP (2x)  : 10W × 4h = 0.04 kWh
--------------------------------
Total               : 5.67 kWh/hari
Biaya               : Rp 8.193/hari
Estimasi Bulanan    : 170 kWh = Rp 245.650/bulan
Kategori            : HEMAT ✅
```

---

## 📡 **API Documentation**

### **Base URL**
```
http://localhost:5000/api
```

### **Endpoints**

#### **Appliances**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appliances` | Get all appliances |
| GET | `/appliances/:id` | Get appliance by ID |
| POST | `/appliances` | Create new appliance |
| PUT | `/appliances/:id` | Update appliance |
| DELETE | `/appliances/:id` | Delete appliance |

#### **Usage**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/usage` | Get usage history |
| POST | `/usage/calculate` | Calculate daily usage |
| GET | `/usage/summary?days=7` | Get summary statistics |
| DELETE | `/usage/:id` | Delete usage record |
| DELETE | `/usage` | Delete all history |

#### **Settings**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get settings |
| PUT | `/settings` | Update settings |

### **Request Example**

**POST /api/usage/calculate**
```json
{
  "applianceIds": ["67123abc...", "67124def..."],
  "date": "2025-10-23T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage calculated and saved",
  "data": {
    "totalKwh": 6.207,
    "totalCost": 8969,
    "fuzzyCategory": "Hemat",
    "fuzzyScore": 32,
    "suggestions": ["✅ Excellent! Penggunaan listrik sangat HEMAT"]
  }
}
```

---

## 🧮 **Fuzzy Logic Algorithm**

### **Input Variable: Total kWh per hari**
```
Membership Functions:
- Low (Hemat):   μ(x) = 1 if x ≤ 3
                      = (7-x)/4 if 3 < x < 7
                      = 0 if x ≥ 7

- Medium (Normal): μ(x) = (x-5)/3 if 5 < x < 8
                        = 1 if 8 ≤ x ≤ 12
                        = (15-x)/3 if 12 < x < 15

- High (Boros):  μ(x) = 0 if x ≤ 10
                      = (x-10)/5 if 10 < x < 15
                      = 1 if x ≥ 15
```

### **Fuzzy Rules**
```
IF penggunaan Low THEN Hemat (score ~20)
IF penggunaan Medium THEN Normal (score ~50)
IF penggunaan High THEN Boros (score ~85)
```

### **Defuzzification**
```
Weighted Average Method:
Score = (μ_hemat × 20 + μ_normal × 50 + μ_boros × 85) / (μ_hemat + μ_normal + μ_boros)
```

---

## 📁 **Project Structure**
```
voltify/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── fuzzyLogic.js         # Fuzzy logic algorithm
│   ├── models/
│   │   ├── Appliance.js          # Appliance schema
│   │   ├── DailyUsage.js         # Usage schema
│   │   └── Settings.js           # Settings schema
│   ├── routes/
│   │   ├── appliances.js         # Appliance routes
│   │   ├── usage.js              # Usage routes
│   │   └── settings.js           # Settings routes
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   ├── seed.js                   # Seed data (optional)
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ApplianceForm.jsx
│   │   │   ├── ApplianceList.jsx
│   │   │   ├── FuzzyAnalysis.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UsageChart.jsx
│   │   │   ├── UsageHistory.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API service
│   │   ├── App.jsx               # Main component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🐛 **Troubleshooting**

### **Problem: "MongoDB connection error"**

**Solution:**
```bash
# Cek MongoDB service running
# Windows:
net start MongoDB

# Linux:
sudo systemctl status mongod

# Atau cek .env connection string sudah benar
```

### **Problem: "CORS policy blocked"**

**Solution:**
```javascript
// Pastikan di backend/server.js ada:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### **Problem: "Cannot read properties of undefined"**

**Solution:**
```javascript
// Tambahkan optional chaining (?)
summary?.estimatedMonthlyCost || 0
```

### **Problem: Port already in use**

**Solution:**
```bash
# Kill process di port 5000 atau 5173
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

---

## 🎓 **Learning Resources**

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Fuzzy Logic Tutorial](https://en.wikipedia.org/wiki/Fuzzy_logic)

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **TODO / Roadmap**

- [ ] Edit functionality untuk alat elektronik
- [ ] Export data ke PDF/Excel
- [ ] Multi-user authentication
- [ ] Mobile responsive optimization
- [ ] PWA (Progressive Web App)
- [ ] Email notification untuk penggunaan boros
- [ ] Comparison dengan rumah tangga lain (anonymized)
- [ ] Machine Learning prediction

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 **Acknowledgments**

- PLN (Perusahaan Listrik Negara) untuk referensi tarif listrik
- MongoDB Team untuk database yang powerful
- React & Express community untuk framework yang luar biasa
- Dosen pembimbing Decision Support System

---

## 📞 **Support**

Jika Anda mengalami masalah atau punya pertanyaan:

1. Buka [Issues](https://github.com/username/voltify/issues)
2. Search terlebih dahulu apakah ada issue serupa
3. Jika belum ada, buat issue baru dengan detail:
   - Deskripsi masalah
   - Langkah untuk reproduce
   - Screenshot (jika perlu)
   - Environment (OS, Node version, dll)

---

## 📊 **Stats**

![GitHub stars](https://img.shields.io/github/stars/username/voltify?style=social)
![GitHub forks](https://img.shields.io/github/forks/username/voltify?style=social)
![GitHub issues](https://img.shields.io/github/issues/username/voltify)

---

<div align="center">

**Made with ❤️ for saving energy and money**

⭐ Star this repo if you find it helpful!

</div>