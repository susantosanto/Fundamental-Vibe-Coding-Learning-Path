# Bab 10: Arsitektur AI Engineering dan Umpan Balik Pengguna

Anda juga perlu melacak biaya. Metrik terkait biaya meliputi jumlah kueri dan volume token input serta output, seperti token per detik (TPS). Jika Anda menggunakan API dengan batas laju, melacak jumlah permintaan per detik menjadi penting untuk memastikan Anda tetap dalam batas yang dialokasikan dan menghindari potensi gangguan layanan.

Saat menghitung metrik, Anda bisa memilih antara pemeriksaan spot dan pemeriksaan menyeluruh. Pemeriksaan spot melibatkan pengambilan sampel subset data untuk mengidentifikasi masalah dengan cepat, sementara pemeriksaan menyeluruh mengevaluasi setiap permintaan untuk mendapatkan gambaran kinerja yang komprehensif. Pilihannya tergantung pada kebutuhan sistem dan sumber daya yang tersedia, dengan kombinasi keduanya memberikan strategi pemantauan yang seimbang.

Saat menghitung metrik, pastikan metrik tersebut bisa dipecah berdasarkan sumbu yang relevan, seperti pengguna, rilis, versi prompt/rantai, jenis prompt/rantai, dan waktu. Granularitas ini membantu memahami variasi kinerja dan mengidentifikasi masalah spesifik.

## Log dan Trace

Metrik biasanya diagregasi. Metrik mengondensasi informasi dari peristiwa yang terjadi di sistem Anda dari waktu ke waktu. Metrik membantu Anda memahami secara sekilas bagaimana kondisi sistem Anda. Namun, ada banyak pertanyaan yang tidak bisa dijawab oleh metrik. Misalnya, setelah melihat lonjakan aktivitas tertentu, Anda mungkin bertanya-tanya: "Apakah ini pernah terjadi sebelumnya?" Log bisa membantu Anda menjawab pertanyaan ini.

Jika metrik adalah pengukuran numerik yang merepresentasikan atribut dan peristiwa, log adalah catatan peristiwa yang hanya bisa ditambahkan (append-only). Dalam produksi, proses debugging mungkin terlihat seperti ini:

1. Metrik memberi tahu Anda ada yang salah lima menit yang lalu, tetapi tidak memberi tahu apa yang terjadi.
2. Anda melihat log peristiwa yang terjadi sekitar lima menit yang lalu untuk mencari tahu apa yang terjadi.
3. Mengaitkan kesalahan dalam log dengan metrik untuk memastikan Anda telah mengidentifikasi masalah yang tepat.

Untuk deteksi cepat, metrik perlu dihitung dengan cepat. Untuk respons cepat, log perlu tersedia dan mudah diakses. Jika log Anda tertunda 15 menit, Anda harus menunggu log tersebut muncul untuk melacak masalah yang terjadi 5 menit yang lalu.

Karena Anda tidak tahu persis log mana yang perlu Anda lihat di masa depan, aturan umum untuk logging adalah mencatat semuanya. Catat semua konfigurasi, termasuk endpoint API model, nama model, pengaturan sampling (temperature, top-p, top-k, kondisi berhenti, dll.), dan template prompt.

Catat kueri pengguna, prompt akhir yang dikirim ke model, output, dan output antara. Catat jika memanggil tool apa pun. Catat output tool. Catat saat komponen dimulai, berakhir, saat sesuatu crash, dll. Saat mencatat log, pastikan untuk memberinya tag dan ID yang bisa membantu Anda mengetahui dari mana log ini berasal di sistem.

Mencatat semuanya berarti jumlah log yang Anda miliki bisa tumbuh dengan sangat cepat. Banyak alat untuk analisis log otomatis dan deteksi anomali log ditenagai oleh AI. Meskipun tidak mungkin memproses log secara manual, berguna untuk memeriksa data produksi Anda secara manual setiap hari untuk mendapatkan gambaran tentang bagaimana pengguna menggunakan aplikasi Anda. Shankar et al., (2024) menemukan bahwa persepsi developer tentang apa yang merupakan output baik dan buruk berubah saat mereka berinteraksi dengan lebih banyak data, memungkinkan mereka menulis ulang prompt untuk meningkatkan peluang respons baik dan memperbarui pipeline evaluasi mereka untuk menangkap respons buruk.

Jika log adalah serangkaian peristiwa yang terpisah-pisah, trace direkonstruksi dengan menghubungkan peristiwa terkait bersama untuk membentuk timeline lengkap dari transaksi atau proses, menunjukkan bagaimana setiap langkah terhubung dari awal hingga akhir. Singkatnya, trace adalah rekaman detail jalur eksekusi permintaan melalui berbagai komponen dan layanan sistem. Dalam aplikasi AI, trace mengungkapkan seluruh proses dari saat pengguna mengirim kueri hingga respons akhir dikembalikan, termasuk tindakan yang diambil sistem, dokumen yang diambil, dan prompt akhir yang dikirim ke model. Trace juga harus menunjukkan berapa banyak waktu yang dibutuhkan setiap langkah dan biaya terkaitnya, jika bisa diukur. Gambar 10-11 adalah visualisasi trace permintaan di LangSmith.

Idealnya, Anda harus bisa melacak setiap langkah transformasi kueri langkah demi langkah melalui sistem. Jika kueri gagal, Anda harus bisa menentukan langkah tepat di mana itu salah: apakah diproses secara tidak benar, konteks yang diambil tidak relevan, atau model menghasilkan respons yang salah.

## Deteksi Drift

Semakin banyak bagian yang dimiliki sistem, semakin banyak hal yang bisa berubah. Dalam aplikasi AI, ini bisa berupa:

### Perubahan System Prompt

Ada banyak alasan mengapa system prompt aplikasi Anda bisa berubah tanpa sepengetahuan Anda. System prompt bisa dibangun di atas template prompt, dan template prompt tersebut diperbarui. Rekan kerja mungkin menemukan typo dan memperbaikinya. Logika sederhana seharusnya cukup untuk menangkap saat system prompt aplikasi Anda berubah.

### Perubahan Perilaku Pengguna

Seiring waktu, pengguna menyesuaikan perilaku mereka terhadap teknologi. Misalnya, orang sudah tahu cara membingkai kueri mereka untuk mendapatkan hasil yang lebih baik di Google Search atau cara membuat artikel mereka peringkat lebih tinggi di hasil pencarian. Orang yang tinggal di daerah dengan mobil self-driving sudah tahu cara mengintimidasi mobil self-driving agar memberi mereka hak jalan (Liu et al., 2020). Kemungkinan pengguna Anda akan mengubah perilaku mereka untuk mendapatkan hasil yang lebih baik dari aplikasi Anda. Misalnya, pengguna Anda mungkin belajar menulis instruksi agar respons lebih ringkas. Ini bisa menyebabkan penurunan bertahap dalam panjang respons dari waktu ke waktu. Jika Anda hanya melihat metrik, mungkin tidak jelas apa yang menyebabkan penurunan bertahap ini. Anda perlu investigasi untuk memahami akar penyebabnya.

### Perubahan Model Dasar

Saat menggunakan model melalui API, ada kemungkinan API tetap tidak berubah sementara model dasar diperbarui. Seperti disebutkan di Bab 4, penyedia model tidak selalu mengungkapkan pembaruan ini, menyerahkannya kepada Anda untuk mendeteksi perubahan apa pun. Versi berbeda dari API yang sama bisa memiliki dampak signifikan pada kinerja. Misalnya, Chen et al. (2023) mengamati perbedaan mencolok dalam skor benchmark antara versi Maret 2023 dan Juni 2023 dari GPT-4 dan GPT-3.5. Demikian pula, Voiceflow melaporkan penurunan kinerja 10% saat beralih dari GPT-3.5-turbo-0301 yang lebih lama ke GPT-3.5-turbo-1106 yang lebih baru.

## Orkestrasi Pipeline AI

Aplikasi AI bisa menjadi cukup kompleks, terdiri dari beberapa model, mengambil data dari banyak database, dan memiliki akses ke berbagai tool. Orkestrator membantu Anda menentukan bagaimana berbagai komponen ini bekerja bersama untuk membuat pipeline end-to-end. Orkestrator memastikan data mengalir dengan lancar antar komponen. Secara garis besar, orkestrator beroperasi dalam dua langkah: definisi komponen dan chaining:

### Definisi Komponen

Anda perlu memberi tahu orkestrator komponen apa yang digunakan sistem Anda, termasuk berbagai model, sumber data eksternal untuk retrieval, dan tool yang bisa digunakan sistem Anda. Model gateway bisa mempermudah penambahan model. Karena itu, beberapa alat orkestrator ingin menjadi gateway. Bahkan, begitu banyak alat tampaknya ingin menjadi platform end-to-end yang melakukan segalanya. Anda juga bisa memberi tahu orkestrator jika Anda menggunakan alat apa pun untuk evaluasi dan pemantauan.

### Chaining

Chaining pada dasarnya adalah komposisi fungsi: ini menggabungkan berbagai fungsi (komponen) bersama. Dalam chaining (pipelining), Anda memberi tahu orkestrator langkah-langkah yang diambil sistem Anda dari menerima kueri pengguna hingga menyelesaikan tugas. Berikut contoh langkah-langkahnya:

1. Memproses kueri mentah.
2. Mengambil data yang relevan berdasarkan kueri yang telah diproses.
3. Menggabungkan kueri asli dan data yang diambil untuk membuat prompt dalam format yang diharapkan oleh model.
4. Model menghasilkan respons berdasarkan prompt.
5. Mengevaluasi respons.
6. Jika respons dianggap baik, kembalikan ke pengguna. Jika tidak, arahkan kueri ke operator manusia.

Orkestrator bertanggung jawab untuk meneruskan data antar komponen. Orkestrator harus menyediakan alat yang membantu memastikan output dari langkah saat ini dalam format yang diharapkan oleh langkah berikutnya. Idealnya, orkestrator harus memberi tahu Anda saat aliran data ini terganggu karena kesalahan seperti kegagalan komponen atau ketidakcocokan data.

Orkestrasi pipeline AI berbeda dari orkestrator workflow umum, seperti Airflow atau Metaflow.

Saat merancang pipeline untuk aplikasi dengan persyaratan latensi ketat, coba lakukan sebanyak mungkin secara paralel. Misalnya, jika Anda memiliki komponen routing (memutuskan ke mana mengirim kueri) dan komponen penghapusan PII, keduanya bisa dilakukan secara bersamaan.

Ada banyak alat orkestrasi AI, termasuk LangChain, LlamaIndex, Flowise, Langflow, dan Haystack. Karena retrieval dan penggunaan tool adalah pola aplikasi umum, banyak framework RAG dan agent juga merupakan alat orkestrasi.

Meskipun menggoda untuk langsung melompat ke alat orkestrasi saat memulai proyek, Anda mungkin ingin mulai membangun aplikasi Anda tanpa alat tersebut terlebih dahulu. Alat eksternal apa pun membawa kompleksitas tambahan. Orkestrator bisa mengabstraksi detail penting tentang cara kerja sistem Anda, membuatnya sulit untuk memahami dan men-debug sistem Anda.

Saat Anda maju ke tahap akhir proses pengembangan aplikasi, Anda mungkin memutuskan bahwa orkestrator bisa mempermudah hidup Anda. Berikut tiga aspek yang perlu diingat saat mengevaluasi orkestrator:

### Integrasi dan Ekstensibilitas

Evaluasi apakah orkestrator mendukung komponen yang sudah Anda gunakan atau mungkin adopsi di masa depan. Misalnya, jika Anda ingin menggunakan model Llama, periksa apakah orkestrator mendukungnya. Mengingat begitu banyak model, database, dan framework yang ada, tidak mungkin bagi orkestrator untuk mendukung semuanya. Oleh karena itu, Anda juga perlu mempertimbangkan ekstensibilitas orkestrator. Jika tidak mendukung komponen tertentu, seberapa sulit untuk mengubahnya?

### Dukungan untuk Pipeline Kompleks

Saat aplikasi Anda bertambah kompleks, Anda mungkin perlu mengelola pipeline rumit yang melibatkan banyak langkah dan logika kondisional. Orkestrator yang mendukung fitur lanjutan seperti branching, pemrosesan paralel, dan penanganan kesalahan akan membantu Anda mengelola kompleksitas ini secara efisien.

### Kemudahan Penggunaan, Kinerja, dan Skalabilitas

Pertimbangkan kemudahan penggunaan orkestrator. Cari API yang intuitif, dokumentasi komprehensif, dan dukungan komunitas yang kuat, karena ini bisa secara signifikan mengurangi kurva pembelajaran bagi Anda dan tim Anda. Hindari orkestrator yang memulai panggilan API tersembunyi atau menambahkan latensi ke aplikasi Anda. Selain itu, pastikan orkestrator bisa diskalakan secara efektif seiring bertambahnya jumlah aplikasi, developer, dan lalu lintas.

## Umpan Balik Pengguna

Umpan balik pengguna selalu memainkan peran penting dalam aplikasi perangkat lunak dalam dua cara utama: mengevaluasi kinerja aplikasi dan menginformasikan pengembangannya. Namun, dalam aplikasi AI, umpan balik pengguna mengambil peran yang bahkan lebih signifikan. Umpan balik pengguna adalah data proprietary, dan data adalah keunggulan kompetitif. Sistem umpan balik pengguna yang dirancang dengan baik diperlukan untuk menciptakan data flywheel yang dibahas di Bab 8. Salah satu kerugian utama meluncurkan aplikasi open source alih-alih aplikasi komersial adalah jauh lebih sulit untuk mengumpulkan umpan balik pengguna. Pengguna bisa mengambil aplikasi open source Anda dan menerapkannya sendiri, dan Anda tidak tahu bagaimana aplikasi itu digunakan.

Umpan balik pengguna bisa digunakan tidak hanya untuk mempersonalisasi model untuk pengguna individu tetapi juga untuk melatih iterasi model di masa depan. Saat data menjadi semakin langka, data proprietary lebih berharga dari sebelumnya. Produk yang diluncurkan dengan cepat dan menarik pengguna lebih awal bisa mengumpulkan data untuk terus meningkatkan model, membuatnya sulit bagi pesaing untuk mengejar.

Penting untuk diingat bahwa umpan balik pengguna adalah data pengguna. Memanfaatkan umpan balik pengguna memerlukan kehati-hatian yang sama saat memanfaatkan data apa pun. Privasi pengguna harus dihormati. Pengguna berhak tahu bagaimana data mereka digunakan.

## Mengekstrak Umpan Balik Konversasional

Secara tradisional, umpan balik bisa eksplisit atau implisit. Umpan balik eksplisit adalah informasi yang diberikan pengguna sebagai respons terhadap permintaan eksplisit untuk umpan balik dalam aplikasi, seperti jempol ke atas/ke bawah, upvote/downvote, peringkat bintang, atau jawaban ya/tidak untuk pertanyaan "Apakah kami menyelesaikan masalah Anda?" Umpan balik eksplisit cukup standar di seluruh aplikasi—hanya ada begitu banyak cara Anda bisa meminta seseorang apakah mereka menyukai sesuatu. Oleh karena itu, umpan balik eksplisit lebih dipahami dengan baik.

Umpan balik implisit adalah informasi yang disimpulkan dari tindakan pengguna. Misalnya, jika seseorang membeli produk yang direkomendasikan kepada mereka, itu berarti rekomendasi itu bagus. Apa yang bisa dianggap sebagai umpan balik implisit tergantung pada tindakan apa yang bisa dilakukan pengguna dalam setiap aplikasi dan, oleh karena itu, sangat bergantung pada aplikasi. Foundation model memungkinkan dunia aplikasi baru dan, bersama mereka, banyak genre umpan balik implisit.

Antarmuka konversasional yang digunakan banyak aplikasi AI membuatnya lebih mudah bagi pengguna untuk memberikan umpan balik. Pengguna bisa mendorong perilaku baik dan mengoreksi kesalahan dengan cara yang sama seperti mereka memberikan umpan balik dalam dialog sehari-hari. Bahasa yang digunakan pengguna untuk memberi arahan ke AI bisa menyampaikan umpan balik tentang kinerja aplikasi dan preferensi pengguna.

Sebagai contoh, bayangkan Anda menggunakan asisten AI untuk membantu merencanakan perjalanan ke Australia. Anda meminta AI untuk menemukan hotel selama tiga malam di Sydney. AI merespons dengan tiga rekomendasi sebagai berikut:

```
Berikut tiga saran hotel di Sydney untuk menginap 3 malam:
1. Historic Rocks Boutique Hotel (The Rocks)
   • Harga: ~$400/malam
   • Lingkungan: Jalan-jalan menawan dan dekat dengan pemandangan ikonik.
2. Stylish Surry Hills House Hotel (Surry Hills)
   • Harga: ~$200/malam
   • Lingkungan: Trendi, dengan kafe dan galeri seni yang semarak.
3. Chill Bondi Beachside Hotel (Bondi Beach)
   • Harga: ~$300/malam
   • Lingkungan: Tepi pantai, ideal untuk relaksasi dan eksplorasi kota.
```

Bagaimana Anda merespons ketiga rekomendasi ini mengungkapkan preferensi Anda. Misalnya, jika Anda merespons dengan "Ya, pesan yang dekat dengan galeri", Anda menunjukkan minat pada seni. Di sisi lain, respons "Tidak ada yang di bawah $200?" mengungkapkan preferensi sadar harga dan menunjukkan bahwa asisten belum cukup memahami Anda.

Umpan balik pengguna, yang diekstrak dari percakapan, bisa digunakan untuk evaluasi, pengembangan, dan personalisasi:

- **Evaluasi**: menurunkan metrik untuk memantau aplikasi
- **Pengembangan**: melatih model masa depan atau memandu pengembangannya
- **Personalisasi**: mempersonalisasi aplikasi untuk setiap pengguna

Umpan balik konversasional implisit bisa disimpulkan dari konten pesan pengguna dan pola komunikasi mereka. Karena umpan balik menyatu ke dalam percakapan sehari-hari, umpan balik juga menantang untuk diekstrak. Meskipun intuisi tentang petunjuk konversasional bisa membantu Anda menyusun set awal sinyal untuk dicari, analisis data yang ketat dan studi pengguna diperlukan untuk memahami.

Meskipun umpan balik konversasional menikmati perhatian lebih besar berkat popularitas bot konversasional, ini telah menjadi area penelitian aktif selama beberapa tahun sebelum ChatGPT keluar. Komunitas reinforcement learning telah mencoba membuat algoritma RL belajar dari umpan balik bahasa alami sejak akhir 2010-an, banyak di antaranya dengan hasil yang menjanjikan; lihat Fu et al. (2019); Goyal et al. (2019); Zhou dan Small (2020); dan Sumers et al. (2020). Umpan balik bahasa alami juga sangat menarik untuk aplikasi conversational AI awal seperti Amazon Alexa (Ponnusamy et al., 2019; Park et al., 2020), fitur kontrol suara Spotify (Xiao et al., 2021), dan Yahoo! Voice (Hashimoto dan Sassano, 2018).

### Umpan Balik Bahasa Alami

Umpan balik yang diekstrak dari konten pesan disebut umpan balik bahasa alami. Berikut beberapa sinyal umpan balik bahasa alami yang memberi tahu Anda bagaimana jalannya percakapan. Berguna untuk melacak sinyal ini dalam produksi untuk memantau kinerja aplikasi Anda.

**Penghentian Dini.** Jika pengguna menghentikan respons lebih awal, misalnya menghentikan generasi respons di tengah jalan, keluar dari aplikasi (untuk aplikasi web dan seluler), memberi tahu model untuk berhenti (untuk asisten suara), atau hanya meninggalkan agent menggantung (misalnya, tidak merespons agent dengan opsi mana yang Anda inginkan untuk dilanjutkan), kemungkinan percakapan tidak berjalan dengan baik.

**Koreksi Kesalahan.** Jika pengguna memulai tindak lanjut mereka dengan "Tidak, ..." atau "Maksud saya, ...", respons model kemungkinan meleset.

Untuk mengoreksi kesalahan, pengguna mungkin mencoba memparafrase permintaan mereka. Gambar 10-12 menunjukkan contoh upaya pengguna untuk mengoreksi kesalahpahaman model. Upaya parafrase bisa dideteksi menggunakan heuristik atau model ML.

Karena pengguna baik menghentikan generasi lebih awal dan memparafrase pertanyaan, bisa disimpulkan bahwa model salah memahami maksud permintaan asli.

Pengguna juga bisa menunjuk hal-hal spesifik yang seharusnya dilakukan model secara berbeda. Misalnya, jika pengguna meminta model untuk merangkum cerita dan model membingungkan karakter, pengguna ini bisa memberikan umpan balik seperti: "Bill adalah tersangka, bukan korban." Model seharusnya bisa mengambil umpan balik ini dan merevisi ringkasan.

Jenis umpan balik koreksi tindakan ini sangat umum untuk kasus penggunaan agentic di mana pengguna mungkin mendorong agent ke tindakan opsional yang lebih banyak. Misalnya, jika pengguna menugaskan agent tugas melakukan analisis pasar tentang perusahaan XYZ, pengguna ini bisa memberikan umpan balik seperti "Anda juga harus memeriksa halaman GitHub XYZ" atau "Periksa profil X CEO".

Terkadang, pengguna mungkin ingin model mengoreksi dirinya sendiri dengan meminta konfirmasi eksplisit, seperti "Apakah Anda yakin?", "Periksa lagi", atau "Tunjukkan sumbernya". Ini tidak selalu berarti model memberikan jawaban yang salah. Namun, ini bisa berarti jawaban model Anda kurang detail yang dicari pengguna. Ini juga bisa menunjukkan ketidakpercayaan umum pada model Anda.

Beberapa aplikasi memungkinkan pengguna mengedit respons model secara langsung. Misalnya, jika pengguna meminta model untuk menghasilkan kode, dan pengguna mengoreksi kode yang dihasilkan, ini adalah sinyal yang sangat kuat bahwa kode yang diedit tidak cukup benar.

Edit pengguna juga berfungsi sebagai sumber data preferensi yang berharga. Ingat bahwa data preferensi, biasanya dalam format (kueri, respons menang, respons kalah), bisa digunakan untuk menyelaraskan model dengan preferensi manusia. Setiap edit pengguna membentuk contoh preferensi, dengan respons asli yang dihasilkan sebagai respons kalah dan respons yang diedit sebagai respons menang.

**Keluhan.** Seringkali, pengguna hanya mengeluh tentang output aplikasi Anda tanpa mencoba mengoreksinya. Misalnya, mereka mungkin mengeluh bahwa jawaban salah, tidak relevan, beracun, panjang, kurang detail, atau hanya buruk. Tabel 10-1 menunjukkan delapan kelompok umpan balik bahasa alami yang dihasilkan dari pengelompokan otomatis dataset FITS (Feedback for Interactive Talk & Search) (Xu et al., 2022).

**Tabel 10-1.** Jenis umpan balik yang diturunkan dari pengelompokan otomatis dataset FITS (Xu et al., 2022). Hasil dari Yuan et al. (2023).

| Kelompok | Jenis Umpan Balik | Jumlah | % |
|----------|-------------------|--------|---|
| 1 | Menjelaskan kembali permintaan mereka. | 3702 | 26,54% |
| 2 | Mengeluh bahwa bot (1) tidak menjawab pertanyaan atau (2) memberikan informasi tidak relevan atau (3) meminta pengguna mencari jawaban sendiri. | 2260 | 16,20% |
| 3 | Menunjuk hasil pencarian spesifik yang bisa menjawab pertanyaan. | 2255 | 16,17% |
| 4 | Menyarankan bahwa bot seharusnya menggunakan hasil pencarian. | 2130 | 15,27% |
| 5 | Menyatakan bahwa jawaban (1) salah secara faktual, atau (2) tidak berdasar pada hasil pencarian. | 1572 | 11,27% |
| 6 | Menunjuk bahwa jawaban bot tidak spesifik/akurat/lengkap/detail. | 1309 | 9,39% |
| 7 | Menunjuk bahwa bot tidak yakin dengan jawabannya dan selalu memulai responsnya dengan "Saya tidak yakin" atau "Saya tidak tahu". | 582 | 4,17% |
| 8 | Mengeluh tentang pengulangan/kekasaran dalam respons bot. | 137 | 0,99% |

Memahami bagaimana bot gagal bagi pengguna sangat penting dalam membuatnya lebih baik. Misalnya, jika Anda tahu pengguna tidak suka jawaban bertele-tele, Anda bisa mengubah prompt bot agar lebih ringkas. Jika pengguna tidak senang karena jawaban kurang detail, Anda bisa meminta bot agar lebih spesifik.

**Sentimen.** Keluhan juga bisa berupa ekspresi umum sentimen negatif (frustrasi, kekecewaan, ejekan, dll.) tanpa menjelaskan alasannya, seperti "Uggh". Ini mungkin terdengar distopis, tetapi analisis sentimen pengguna sepanjang percakapan dengan bot bisa memberi Anda wawasan tentang bagaimana kinerja bot. Beberapa call center melacak suara pengguna sepanjang panggilan. Jika pengguna semakin keras, ada yang salah. Sebaliknya, jika seseorang memulai percakapan dengan marah tetapi berakhir dengan senang, percakapan mungkin telah menyelesaikan masalah mereka.

Umpan balik bahasa alami juga bisa disimpulkan dari respons model. Satu sinyal penting adalah tingkat penolakan model. Jika model mengatakan hal-hal seperti "Maaf, saya tidak tahu yang itu" atau "Sebagai model bahasa, saya tidak bisa melakukan ...", pengguna mungkin tidak senang.

### Umpan Balik Konversasional Lainnya

Jenis umpan balik konversasional lainnya bisa diturunkan dari tindakan pengguna alih-alih pesan.

**Regenerasi.** Banyak aplikasi memungkinkan pengguna menghasilkan respons lain, terkadang dengan model berbeda. Jika pengguna memilih regenerasi, mungkin karena mereka tidak puas dengan respons pertama. Namun, ini juga bisa berarti respons pertama memadai, tetapi pengguna ingin opsi untuk membandingkan. Ini sangat umum untuk permintaan kreatif seperti generasi gambar atau cerita.

Sinyal regenerasi mungkin juga lebih kuat untuk aplikasi dengan penagihan berbasis penggunaan daripada yang berlangganan. Dengan penagihan berbasis penggunaan, pengguna cenderung tidak melakukan regenerasi dan menghabiskan uang ekstra karena keingintahuan yang menganggur.

Secara pribadi, saya sering memilih regenerasi untuk permintaan kompleks untuk memastikan respons model konsisten. Jika dua respons memberikan jawaban yang bertentangan, saya tidak bisa mempercayai keduanya.

Setelah regenerasi, beberapa aplikasi mungkin secara eksplisit meminta untuk membandingkan respons baru dengan yang sebelumnya, seperti yang ditunjukkan pada Gambar 10-13. Data lebih baik atau lebih buruk ini, sekali lagi, bisa digunakan untuk preference finetuning.

**Organisasi Percakapan.** Tindakan yang diambil pengguna untuk mengatur percakapan mereka—seperti menghapus, mengganti nama, berbagi, dan bookmark—juga bisa menjadi sinyal. Menghapus percakapan adalah sinyal yang cukup kuat bahwa percakapan itu buruk, kecuali itu adalah percakapan yang memalukan dan pengguna ingin menghapus jejaknya. Mengganti nama percakapan menunjukkan bahwa percakapan itu bagus, tetapi judul yang dihasilkan otomatis buruk.

**Panjang Percakapan.** Sinyal lain yang umum dilacak adalah jumlah giliran per percakapan. Apakah ini sinyal positif atau negatif tergantung pada aplikasi. Untuk pendamping AI, percakapan panjang mungkin menunjukkan bahwa pengguna menikmati percakapan. Namun, untuk chatbot yang ditujukan untuk produktivitas seperti dukungan pelanggan, percakapan panjang mungkin menunjukkan bahwa bot tidak efisien dalam membantu pengguna menyelesaikan masalah mereka.

**Keragaman Dialog.** Panjang percakapan juga bisa ditafsirkan bersama dengan keragaman dialog, yang bisa diukur dengan jumlah token atau topik yang berbeda. Misalnya, jika percakapan panjang tetapi bot terus mengulang beberapa baris, pengguna mungkin terjebak dalam loop.

Umpan balik eksplisit lebih mudah ditafsirkan, tetapi memerlukan upaya ekstra dari pengguna. Karena banyak pengguna mungkin tidak mau melakukan upaya tambahan ini, umpan balik eksplisit bisa jarang, terutama dalam aplikasi dengan basis pengguna yang lebih kecil. Umpan balik eksplisit juga menderita bias respons. Misalnya, pengguna yang tidak senang mungkin lebih cenderung mengeluh, menyebabkan umpan balik tampak lebih negatif dari yang sebenarnya.

Umpan balik implisit lebih melimpah—apa yang bisa dianggap sebagai umpan balik implisit hanya dibatasi oleh imajinasi Anda—tetapi lebih berisik. Menafsirkan sinyal implisit bisa menantang. Misalnya, berbagi percakapan bisa menjadi sinyal negatif atau positif. Misalnya, salah satu teman saya sebagian besar berbagi percakapan saat model membuat kesalahan yang mencolok, dan teman lain sebagian besar berbagi percakapan yang berguna dengan rekan kerja mereka. Penting untuk mempelajari pengguna Anda untuk memahami mengapa mereka melakukan setiap tindakan.

Menambahkan lebih banyak sinyal bisa membantu mengklarifikasi niat. Misalnya, jika pengguna memparafrase pertanyaan mereka setelah membagikan tautan, ini mungkin menunjukkan bahwa percakapan tidak memenuhi harapan mereka. Mengekstrak, menafsirkan, dan memanfaatkan respons implisit dari percakapan adalah area penelitian kecil tetapi berkembang. Tidak hanya Anda bisa mengumpulkan umpan balik tentang aplikasi AI, Anda juga bisa menggunakan AI untuk menganalisis umpan balik.

## Desain Umpan Balik

Jika Anda tidak yakin umpan balik apa yang harus dikumpulkan, saya harap bagian terakhir memberi Anda beberapa ide.

Bagian ini membahas kapan dan bagaimana mengumpulkan umpan balik berharga ini.

### Kapan Mengumpulkan Umpan Balik

Umpan balik bisa dan harus dikumpulkan sepanjang perjalanan pengguna. Pengguna harus memiliki opsi untuk memberikan umpan balik, terutama untuk melaporkan kesalahan, kapan pun kebutuhan ini muncul. Opsi pengumpulan umpan balik, bagaimanapun, harus tidak mengganggu. Opsi ini tidak boleh mengganggu alur kerja pengguna. Berikut beberapa tempat di mana umpan balik pengguna mungkin sangat berharga.

**Di Awal.** Saat pengguna baru saja mendaftar, umpan balik pengguna bisa membantu mengkalibrasi aplikasi untuk pengguna. Misalnya, aplikasi face ID pertama-tama harus memindai wajah Anda untuk bekerja. Asisten suara mungkin meminta Anda membaca kalimat dengan lantang untuk mengenali suara Anda untuk kata-kata bangun (kata-kata yang mengaktifkan asisten suara, seperti "Hey Google"). Aplikasi pembelajaran bahasa mungkin mengajukan beberapa pertanyaan untuk mengukur tingkat keterampilan Anda. Untuk beberapa aplikasi, seperti face ID, kalibrasi diperlukan. Untuk aplikasi lain, bagaimanapun, umpan balik awal harus opsional, karena ini menciptakan gesekan bagi pengguna untuk mencoba produk Anda. Jika pengguna tidak menentukan preferensi mereka, Anda bisa kembali ke opsi netral dan mengkalibrasi dari waktu ke waktu.

**Saat Sesuatu yang Buruk Terjadi.** Saat model mengalami halusinasi respons, memblokir permintaan yang sah, menghasilkan gambar yang kompromi, atau membutuhkan waktu terlalu lama untuk merespons, pengguna harus bisa memberi tahu Anda tentang kegagalan ini. Anda bisa memberi pengguna opsi untuk downvote respons, regenerasi dengan model yang sama, atau beralih ke model lain. Pengguna mungkin hanya memberikan umpan balik konversasional seperti "Anda salah", "Terlalu klise", atau "Saya ingin sesuatu yang lebih pendek".

Idealnya, saat produk Anda membuat kesalahan, pengguna seharusnya masih bisa menyelesaikan tugas mereka. Misalnya, jika model salah mengkategorikan produk, pengguna bisa mengedit kategori. Biarkan pengguna berkolaborasi dengan AI. Jika itu tidak berhasil, biarkan mereka berkolaborasi dengan manusia. Banyak bot dukungan pelanggan menawarkan untuk mentransfer pengguna ke agen manusia jika percakapan berlarut-larut atau jika pengguna tampak frustrasi.

Contoh kolaborasi manusia-AI adalah fungsionalitas inpainting untuk generasi gambar. Saya berharap ada inpainting untuk text-to-speech. Saya merasa text-to-speech bekerja dengan baik 95% dari waktu, tetapi 5% lainnya bisa membuat frustrasi. AI mungkin salah mengucapkan nama atau gagal berhenti selama dialog. Saya berharap ada aplikasi yang memungkinkan saya mengedit hanya kesalahan alih-alih harus menghasilkan ulang seluruh audio. Jika gambar yang dihasilkan tidak persis seperti yang dibutuhkan pengguna, mereka bisa memilih area gambar dan menjelaskan dengan prompt cara membuatnya lebih baik. Gambar 10-14 menunjukkan contoh inpainting dengan DALL-E (OpenAI, 2021). Fitur ini memungkinkan pengguna mendapatkan hasil yang lebih baik sambil memberi developer umpan balik berkualitas tinggi.

**Saat Model Memiliki Kepercayaan Rendah.** Saat model tidak yakin tentang suatu tindakan, Anda bisa meminta umpan balik pengguna untuk meningkatkan kepercayaannya. Misalnya, mengingat permintaan untuk merangkum makalah, jika model tidak yakin apakah pengguna lebih suka ringkasan tingkat tinggi yang singkat atau ringkasan per bagian yang terperinci, model bisa menghasilkan kedua ringkasan secara berdampingan, dengan asumsi bahwa menghasilkan dua ringkasan tidak meningkatkan latensi bagi pengguna. Pengguna bisa memilih mana yang mereka sukai. Sinyal komparatif seperti ini bisa digunakan untuk preference finetuning. Contoh evaluasi komparatif dalam produksi ditunjukkan pada Gambar 10-15.

Menampilkan dua respons lengkap bagi pengguna untuk dipilih berarti meminta pengguna tersebut untuk umpan balik eksplisit. Pengguna mungkin tidak punya waktu untuk membaca dua respons lengkap atau cukup peduli untuk memberikan umpan balik yang bijaksana. Ini bisa menghasilkan suara yang berisik. Beberapa aplikasi, seperti Google Gemini, hanya menampilkan awal setiap respons, seperti yang ditunjukkan pada Gambar 10-16. Pengguna bisa mengklik untuk memperluas respons yang ingin mereka baca. Tidak jelas, bagaimanapun, apakah menampilkan respons lengkap atau parsial secara berdampingan memberikan umpan balik yang lebih andal. Saat saya mengajukan pertanyaan ini di acara yang saya hadiri, responsnya terpecah. Beberapa orang berpikir menampilkan respons lengkap memberikan umpan balik yang lebih andal karena memberi pengguna lebih banyak informasi untuk membuat keputusan. Pada saat yang sama, beberapa orang berpikir bahwa setelah pengguna membaca respons lengkap, tidak ada insentif bagi mereka untuk mengklik yang lebih baik.

Contoh lain adalah aplikasi organisasi foto yang secara otomatis menandai foto Anda, sehingga bisa merespons kueri seperti "Tunjukkan semua foto X". Saat tidak yakin apakah dua orang sama, aplikasi bisa meminta umpan balik Anda, seperti yang dilakukan Google Photos pada Gambar 10-17.

Anda mungkin bertanya-tanya: bagaimana dengan umpan balik saat sesuatu yang baik terjadi? Tindakan yang bisa diambil pengguna untuk mengekspresikan kepuasan mereka termasuk jempol ke atas, favorit, atau berbagi. Namun, pedoman antarmuka manusia Apple memperingatkan terhadap meminta umpan balik positif dan negatif. Aplikasi Anda seharusnya menghasilkan hasil yang baik secara default. Meminta umpan balik tentang hasil yang baik mungkin memberi pengguna kesan bahwa hasil yang baik adalah pengecualian. Pada akhirnya, jika pengguna senang, mereka terus menggunakan aplikasi Anda.

Namun, banyak orang yang saya ajak bicara percaya pengguna harus memiliki opsi untuk memberikan umpan balik saat mereka menemukan sesuatu yang menakjubkan. Manajer produk untuk produk bertenaga AI populer menyebutkan bahwa tim mereka membutuhkan umpan balik positif karena ini mengungkapkan fitur yang sangat disukai pengguna sehingga mereka memberikan umpan balik antusias tentangnya. Ini memungkinkan tim berkonsentrasi pada penyempurnaan sejumlah kecil fitur berdampak tinggi alih-alih menyebarkan sumber daya ke banyak fitur dengan nilai tambah minimal.

Beberapa menghindari meminta umpan balik positif karena khawatir ini bisa mengacaukan antarmuka atau mengganggu pengguna. Namun, risiko ini bisa dikelola dengan membatasi frekuensi permintaan umpan balik. Misalnya, jika Anda memiliki basis pengguna besar, menampilkan permintaan hanya kepada 1% pengguna pada satu waktu bisa membantu mengumpulkan umpan balik yang cukup tanpa mengganggu pengalaman bagi sebagian besar pengguna. Perlu diingat bahwa semakin kecil persentase pengguna yang diminta, semakin besar risiko bias umpan balik. Namun, dengan kumpulan yang cukup besar, umpan balik bisa memberikan wawasan produk yang bermakna.

### Bagaimana Mengumpulkan Umpan Balik

Umpan balik harus terintegrasi dengan mulus ke dalam alur kerja pengguna. Harus mudah bagi pengguna untuk memberikan umpan balik tanpa kerja ekstra. Pengumpulan umpan balik tidak boleh mengganggu pengalaman pengguna dan harus mudah diabaikan. Harus ada insentif bagi pengguna untuk memberikan umpan balik yang baik.

Satu contoh yang sering dikutip sebagai desain umpan balik yang baik adalah dari aplikasi generator gambar Midjourney. Untuk setiap prompt, Midjourney menghasilkan satu set (empat) gambar dan memberi pengguna opsi berikut, seperti yang ditunjukkan pada Gambar 10-18:

1. Menghasilkan versi tidak diskalakan dari salah satu gambar ini.
2. Menghasilkan variasi untuk salah satu gambar ini.
3. Regenerasi.

Semua opsi ini memberi Midjourney sinyal yang berbeda. Opsi 1 dan 2 memberi tahu Midjourney mana dari empat foto yang dianggap pengguna paling menjanjikan. Opsi 1 memberi sinyal positif terkuat tentang foto yang dipilih. Opsi 2 memberi sinyal positif yang lebih lemah. Opsi 3 menandakan bahwa tidak ada foto yang cukup bagus. Namun, pengguna mungkin memilih untuk melakukan regenerasi meskipun foto yang ada bagus hanya untuk melihat apa lagi yang mungkin.

Asisten kode seperti GitHub Copilot mungkin menampilkan draf mereka dalam warna yang lebih terang daripada teks akhir, seperti yang ditunjukkan pada Gambar 10-19. Pengguna bisa menggunakan tombol Tab untuk menerima saran atau terus mengetik untuk mengabaikan saran, keduanya memberikan umpan balik.

Salah satu tantangan terbesar dari aplikasi AI mandiri seperti ChatGPT dan Claude adalah mereka tidak terintegrasi ke dalam alur kerja harian pengguna, membuatnya sulit untuk mengumpulkan umpan balik berkualitas tinggi seperti produk terintegrasi seperti GitHub Copilot. Misalnya, jika Gmail menyarankan draf email, Gmail bisa melacak bagaimana draf ini digunakan atau diedit. Namun, jika Anda menggunakan ChatGPT untuk menulis email, ChatGPT tidak tahu apakah email yang dihasilkan benar-benar dikirim.

Umpan balik saja mungkin membantu untuk analitik produk. Misalnya, melihat informasi jempol ke atas/jempol ke bawah saja berguna untuk menghitung seberapa sering orang senang atau tidak senang dengan produk Anda. Untuk analisis yang lebih dalam, bagaimanapun, Anda memerlukan konteks di sekitar umpan balik, seperti 5 hingga 10 giliran dialog sebelumnya. Konteks ini bisa membantu Anda mencari tahu apa yang salah. Namun, mendapatkan konteks ini mungkin tidak mungkin tanpa persetujuan eksplisit pengguna, terutama jika konteks mungkin berisi informasi yang dapat diidentifikasi secara pribadi.

Untuk alasan ini, beberapa produk menyertakan ketentuan dalam perjanjian layanan mereka yang memungkinkan mereka mengakses data pengguna untuk analitik dan peningkatan produk. Untuk aplikasi tanpa ketentuan tersebut, umpan balik pengguna mungkin dikaitkan dengan aliran donasi data pengguna, di mana pengguna diminta untuk menyumbangkan (misalnya, berbagi) data interaksi terbaru mereka bersama dengan umpan balik mereka. Misalnya, saat mengirimkan umpan balik, Anda mungkin diminta untuk mencentang kotak untuk membagikan data terbaru Anda sebagai konteks untuk umpan balik ini.

Menjelaskan kepada pengguna bagaimana umpan balik mereka digunakan bisa memotivasi mereka untuk memberikan umpan balik yang lebih banyak dan lebih baik. Apakah Anda menggunakan umpan balik pengguna untuk mempersonalisasi produk untuk pengguna ini, untuk mengumpulkan statistik tentang penggunaan umum, atau untuk melatih model baru? Jika pengguna khawatir tentang privasi, yakinkan mereka bahwa data mereka tidak akan digunakan untuk melatih model atau tidak akan meninggalkan perangkat mereka (hanya jika ini benar).

Jangan meminta pengguna melakukan hal yang mustahil. Misalnya, jika Anda mengumpulkan sinyal komparatif dari pengguna, jangan meminta mereka memilih antara dua opsi yang tidak mereka pahami. Misalnya, saya pernah bingung saat ChatGPT meminta saya memilih antara dua kemungkinan jawaban untuk pertanyaan statistik, seperti yang ditunjukkan pada Gambar 10-20. Saya berharap ada opsi bagi saya untuk mengatakan, "Saya tidak tahu".

Tambahkan ikon dan tooltip ke opsi jika mereka membantu orang memahaminya. Hindari desain yang bisa membingungkan pengguna. Instruksi yang ambigu bisa menyebabkan umpan balik yang berisik. Saya pernah mengadakan workshop optimasi GPU, menggunakan Luma untuk mengumpulkan umpan balik. Saat saya membaca umpan balik negatif, saya bingung. Meskipun responsnya positif, peringkat bintangnya 1/5. Saat saya menggali lebih dalam, saya menyadari bahwa Luma menggunakan emoji untuk mewakili angka dalam formulir pengumpulan umpan balik mereka, tetapi emoji marah, yang sesuai dengan peringkat satu bintang, diletakkan di tempat peringkat lima bintang seharusnya, seperti yang ditunjukkan pada Gambar 10-21.

Karena Luma meletakkan emoji marah, yang sesuai dengan peringkat satu bintang, di tempat peringkat lima bintang seharusnya, beberapa pengguna secara tidak sengaja memilihnya untuk ulasan positif.

Berpikirlah apakah Anda ingin umpan balik pengguna bersifat pribadi atau publik. Misalnya, jika pengguna menyukai sesuatu, apakah Anda ingin informasi ini ditampilkan kepada pengguna lain? Di hari-hari awal Midjourney, umpan balik—seseorang memilih untuk memperbesar gambar, menghasilkan variasi, atau menghasilkan ulang batch gambar lain—bersifat publik.

Keterlihatan sinyal bisa sangat memengaruhi perilaku pengguna, pengalaman pengguna, dan kualitas umpan balik. Pengguna cenderung lebih jujur secara pribadi—ada peluang lebih rendah aktivitas mereka dihakimi—yang bisa menghasilkan sinyal berkualitas lebih tinggi. Pada 2024, X (sebelumnya Twitter) membuat "suka" bersifat pribadi. Elon Musk, pemilik X, mengklaim peningkatan signifikan dalam jumlah suka setelah perubahan ini.

Namun, sinyal pribadi bisa mengurangi penemuan dan keterjelasan. Misalnya, menyembunyikan suka mencegah pengguna menemukan tweet yang telah disukai koneksi mereka. Jika X merekomendasikan tweet berdasarkan suka dari orang-orang yang Anda ikuti, menyembunyikan suka bisa menyebabkan kebingungan pengguna tentang mengapa tweet tertentu muncul di feed mereka.

## Keterbatasan Umpan Balik

Tidak ada keraguan tentang nilai umpan balik pengguna bagi developer aplikasi. Namun, umpan balik bukan makan siang gratis. Umpan balik datang dengan keterbatasannya sendiri.

### Bias

Seperti data lainnya, umpan balik pengguna memiliki bias. Penting untuk memahami bias ini dan merancang sistem umpan balik Anda di sekitarnya. Setiap aplikasi memiliki biasnya sendiri. Berikut beberapa contoh bias umpan balik untuk memberi Anda gambaran tentang apa yang harus diwaspadai:

**Bias Keringanan.** Bias keringanan adalah kecenderungan orang untuk menilai item lebih positif dari yang seharusnya, sering kali untuk menghindari konflik karena mereka merasa harus bersikap baik atau karena itu adalah opsi termudah. Bayangkan Anda sedang terburu-buru, dan aplikasi meminta Anda menilai transaksi. Anda tidak senang dengan transaksi itu, tetapi Anda tahu bahwa jika Anda menilainya secara negatif, Anda akan diminta memberikan alasan, jadi Anda hanya memilih positif untuk menyelesaikannya. Ini juga mengapa Anda tidak boleh membuat orang melakukan kerja ekstra untuk umpan balik Anda.

Pada skala peringkat lima bintang, empat dan lima bintang biasanya dimaksudkan untuk menunjukkan pengalaman yang baik. Namun, dalam banyak kasus, pengguna mungkin merasa tertekan untuk memberikan peringkat lima bintang, menyimpan empat bintang untuk saat ada yang salah. Menurut Uber, pada 2015, peringkat rata-rata pengemudi adalah 4,8, dengan skor di bawah 4,6 membuat pengemudi berisiko dinonaktifkan.

Bias ini belum tentu menjadi masalah. Tujuan Uber adalah membedakan pengemudi yang baik dari yang buruk. Bahkan dengan bias ini, sistem peringkat mereka tampaknya membantu mereka mencapai tujuan ini. Penting untuk melihat distribusi peringkat pengguna Anda untuk mendeteksi bias ini.

Jika Anda ingin umpan balik yang lebih granular, menghilangkan konotasi negatif yang kuat terkait dengan peringkat rendah bisa membantu orang keluar dari bias ini. Misalnya, alih-alih menampilkan angka satu hingga lima kepada pengguna, tampilkan opsi seperti berikut:

- "Perjalanan bagus. Pengemudi bagus."
- "Cukup bagus."
- "Tidak ada yang dikeluhkan tetapi tidak ada yang luar biasa juga."
- "Seharusnya bisa lebih baik."
- "Jangan cocokkan saya dengan pengemudi ini lagi." Opsi yang disarankan di sini hanya untuk menunjukkan bagaimana opsi bisa ditulis ulang. Opsi ini belum divalidasi.

**Keacakan.** Pengguna sering memberikan umpan balik acak, bukan karena niat jahat, tetapi karena mereka kurang motivasi untuk memberikan input yang lebih bijaksana. Misalnya, saat dua respons panjang ditampilkan berdampingan untuk evaluasi komparatif, pengguna mungkin tidak ingin membaca keduanya dan hanya mengklik salah satu secara acak. Dalam kasus Midjourney, pengguna mungkin juga secara acak memilih satu gambar untuk menghasilkan variasi.

**Bias Posisi.** Posisi di mana opsi disajikan kepada pengguna memengaruhi bagaimana opsi ini dipersepsikan. Pengguna umumnya lebih cenderung mengklik saran pertama daripada yang kedua. Jika pengguna mengklik saran pertama, ini tidak selalu berarti itu adalah saran yang bagus.

Saat merancang sistem umpan balik Anda, bias ini bisa dikurangi dengan memvariasikan posisi saran Anda secara acak atau dengan membangun model untuk menghitung tingkat keberhasilan sebenarnya dari saran berdasarkan posisinya.

**Bias Preferensi.** Banyak bias lain yang bisa memengaruhi umpan balik seseorang, beberapa di antaranya telah dibahas dalam buku ini. Misalnya, orang mungkin lebih suka respons yang lebih panjang dalam perbandingan berdampingan, meskipun respons yang lebih panjang kurang akurat—panjang lebih mudah diperhatikan daripada ketidakakuratan. Bias lain adalah bias kebaruan, di mana orang cenderung menyukai jawaban yang mereka lihat terakhir saat membandingkan dua jawaban.

Penting untuk memeriksa umpan balik pengguna Anda untuk mengungkap biasnya. Memahami bias ini akan membantu Anda menafsirkan umpan balik dengan benar, menghindari keputusan produk yang menyesatkan.

### Loop Umpan Balik Degeneratif

Perlu diingat bahwa umpan balik pengguna tidak lengkap. Anda hanya mendapatkan umpan balik tentang apa yang Anda tampilkan kepada pengguna.

Dalam sistem di mana umpan balik pengguna digunakan untuk memodifikasi perilaku model, loop umpan balik degeneratif bisa muncul. Loop umpan balik degeneratif bisa terjadi saat prediksi itu sendiri memengaruhi umpan balik, yang pada gilirannya memengaruhi iterasi model berikutnya, memperkuat bias awal.

Bayangkan Anda membangun sistem untuk merekomendasikan video. Video yang peringkat lebih tinggi muncul lebih dulu, sehingga mereka mendapat lebih banyak klik, memperkuat keyakinan sistem bahwa mereka adalah pilihan terbaik. Awalnya, perbedaan antara dua video, A dan B, mungkin kecil, tetapi karena A peringkat sedikit lebih tinggi, A mendapat lebih banyak klik, dan sistem terus mendorongnya. Seiring waktu, peringkat A melonjak, meninggalkan B di belakang. Loop umpan balik ini adalah alasan video populer tetap populer, membuatnya sulit bagi yang baru untuk menembus.

Masalah ini dikenal sebagai "bias paparan", "bias popularitas", atau "gelembung filter", dan ini adalah masalah yang banyak dipelajari.

Loop umpan balik degeneratif bisa mengubah fokus dan basis penggunaan produk Anda. Bayangkan bahwa awalnya, sejumlah kecil pengguna memberikan umpan balik bahwa mereka menyukai foto kucing. Sistem menangkap ini dan mulai menghasilkan lebih banyak foto dengan kucing. Ini menarik pecinta kucing, yang memberikan lebih banyak umpan balik bahwa foto kucing bagus, mendorong sistem untuk menghasilkan lebih banyak kucing. Sebelum lama, aplikasi Anda menjadi surga kucing. Di sini, saya menggunakan foto kucing sebagai contoh, tetapi mekanisme yang sama bisa memperkuat bias lain, seperti rasisme, seksisme, dan preferensi untuk konten eksplisit.

Bertindak berdasarkan umpan balik pengguna juga bisa mengubah agen konversasional menjadi, karena kurangnya kata yang lebih baik, pembohong. Beberapa penelitian telah menunjukkan bahwa melatih model pada umpan balik pengguna bisa mengajarkannya untuk memberi pengguna apa yang menurutnya diinginkan pengguna, meskipun itu bukan yang paling akurat atau menguntungkan (Stray, 2023). Sharma et al. (2023) menunjukkan bahwa model AI yang dilatih pada umpan balik manusia cenderung menuju sycophancy. Mereka lebih cenderung menyajikan respons pengguna yang sesuai dengan pandangan pengguna ini.

Umpan balik pengguna sangat penting untuk meningkatkan pengalaman pengguna, tetapi jika digunakan secara sembarangan, umpan balik bisa melanggengkan bias dan menghancurkan produk Anda. Sebelum menggabungkan umpan balik ke dalam produk Anda, pastikan Anda memahami keterbatasan umpan balik ini dan dampak potensialnya.

## Ringkasan

Jika setiap bab sebelumnya berfokus pada aspek spesifik AI engineering, bab ini melihat ke dalam proses membangun aplikasi di atas foundation model secara keseluruhan.

Bab ini terdiri dari dua bagian. Bagian pertama membahas arsitektur umum untuk aplikasi AI. Meskipun arsitektur pasti untuk aplikasi mungkin bervariasi, arsitektur tingkat tinggi ini memberikan kerangka kerja untuk memahami bagaimana berbagai komponen saling cocok. Saya menggunakan pendekatan langkah demi langkah dalam membangun arsitektur ini untuk membahas tantangan di setiap langkah dan teknik yang bisa Anda gunakan untuk mengatasinya.

Meskipun perlu memisahkan komponen untuk menjaga sistem Anda tetap modular dan mudah dipelihara, pemisahan ini bersifat cair. Ada banyak cara komponen bisa tumpang tindih dalam fungsionalitas. Misalnya, guardrails bisa diimplementasikan dalam layanan inferensi, model gateway, atau sebagai komponen mandiri.

Setiap komponen tambahan berpotensi membuat sistem Anda lebih mampu, lebih aman, atau lebih cepat tetapi juga akan meningkatkan kompleksitas sistem, memaparkannya ke mode kegagalan baru.

Satu bagian integral dari sistem kompleks apa pun adalah pemantauan dan observabilitas. Observabilitas melibatkan memahami bagaimana sistem Anda gagal, merancang metrik dan peringatan di sekitar kegagalan, dan memastikan bahwa sistem Anda dirancang dengan cara yang membuat kegagalan ini terdeteksi dan bisa dilacak. Meskipun banyak praktik terbaik observabilitas dan alat dari rekayasa perangkat lunak dan machine learning tradisional berlaku untuk aplikasi AI engineering, foundation model memperkenalkan mode kegagalan baru, yang memerlukan metrik tambahan dan pertimbangan desain.

Pada saat yang sama, antarmuka konversasional memungkinkan jenis umpan balik pengguna baru, yang bisa Anda manfaatkan untuk analitik, peningkatan produk, dan data flywheel.

Bagian kedua bab ini membahas berbagai bentuk umpan balik konversasional dan cara merancang aplikasi Anda untuk mengumpulkannya secara efektif.

Secara tradisional, desain umpan balik pengguna telah dilihat sebagai tanggung jawab produk alih-alih rekayasa, dan sebagai hasilnya, ini sering diabaikan oleh engineer. Namun, karena umpan balik pengguna adalah sumber data penting untuk terus meningkatkan model AI, semakin banyak AI engineer yang sekarang terlibat dalam proses untuk memastikan mereka menerima data yang mereka butuhkan. Ini memperkuat ide dari Bab 1 bahwa, dibandingkan dengan ML engineering tradisional, AI engineering bergerak lebih dekat ke produk. Ini karena semakin pentingnya data flywheel dan pengalaman produk sebagai keunggulan kompetitif.

Banyak tantangan AI, pada intinya, adalah masalah sistem. Untuk menyelesaikannya, sering kali perlu mundur dan mempertimbangkan sistem secara keseluruhan. Masalah tunggal mungkin ditangani oleh berbagai komponen yang bekerja secara independen, atau solusi bisa memerlukan kolaborasi beberapa komponen. Pemahaman menyeluruh tentang sistem sangat penting untuk menyelesaikan masalah nyata, membuka kemungkinan baru, dan memastikan keamanan.
