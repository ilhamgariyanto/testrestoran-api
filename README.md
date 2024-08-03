restoran-api
restoran-api adalah API yang dirancang untuk mengelola pesanan dan tagihan di restoran secara efisien. Dengan fitur utama untuk mengelola pesanan, menghitung tagihan, dan menentukan printer yang tepat untuk mencetak pesanan, API ini memastikan proses restoran berjalan lancar.

🚀 Fitur Utama
Post Order: Kirim pesanan baru ke restoran dan alokasikan printer yang sesuai untuk mencetak pesanan, baik untuk kasir, dapur, maupun bar.
Get Bill: Ambil rincian tagihan berdasarkan nomor meja, termasuk daftar item yang dipesan dan total biaya.
Printer Allocation: Informasikan printer mana yang harus mencetak item berdasarkan kategori (makanan atau minuman).

🛠 Teknologi
Node.js: Platform yang digunakan untuk membangun server API.
Express.js: Framework web untuk Node.js, mempermudah pengembangan aplikasi web.
MySQL: Sistem basis data untuk menyimpan informasi produk dan pesanan.
📋 Instalasi

Clone Repositori:
git clone git@github.com:ilhamgariyanto/testrestoran-api.git

Instal Dependensi :
cd restoran-api # Sesuaikan dengan direktori Anda
npm install

Jalankan Server :
nodemon app.js
