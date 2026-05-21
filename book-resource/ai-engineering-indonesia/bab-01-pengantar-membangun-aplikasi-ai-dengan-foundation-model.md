# Bab 1: Pengantar Membangun Aplikasi AI dengan Foundation Model

---

## The Rise of AI Engineering

Foundation model muncul dari large language model, yang pada gilirannya berasal dari language model. Meskipun aplikasi seperti ChatGPT dan GitHub Copilot mungkin terlihat muncul dari mana mana, mereka adalah puncak dari dekade kemajuan teknologi, dengan model bahasa pertama muncul pada tahun 1950-an. Bagian ini mengikuti kemajuan kunci yang memungkinkan evolusi dari language model ke AI engineering.

### Dari Language Model ke Large Language Model

Meskipun language model sudah ada sejak lama, mereka hanya bisa tumbuh ke skala yang ada hari ini dengan self-supervision. Bagian ini memberikan gambaran umum tentang apa yang dimaksud dengan language model dan self-supervision. Jika Anda sudah familiar dengan keduanya, silakan lewati bagian ini.

#### Language Model

Language model mengkodekan informasi statistik tentang satu atau lebih bahasa. Secara intuitif, informasi ini memberitahu kita seberapa besar kemungkinan sebuah kata muncul dalam konteks tertentu. Misalnya, diberikan konteks "Warna kesukaan saya adalah __", language model yang mengkodekan bahasa Inggris harus memprediksi "biru" lebih sering daripada "mobil".

Sifat statistik dari bahasa ditemukan berabad-abad yang lalu. Dalam cerita tahun 1905 "The Adventure of the Dancing Men", Sherlock Holmes memanfaatkan informasi statistik sederhana dari bahasa Inggris untuk mendekodekan urutan gambar tongkat yang misterius. Karena huruf yang paling umum dalam bahasa Inggris adalah E, Holmes menyimpulkan bahwa gambar tongkat yang paling umum harus mewakili E.

Kemudian, Claude Shannon menggunakan statistik yang lebih canggih untuk memecahkan pesan musuh selama Perang Dunia Kedua. Karyanya tentang cara memodelkan bahasa Inggris diterbitkan dalam paper landmark tahun 1951 "Prediction and Entropy of Printed English". Banyak konsep yang diperkenalkan dalam paper ini, termasuk entropy, masih digunakan untuk language modeling hari ini.

Pada masa awal, language model melibatkan satu bahasa. Namun, hari ini, language model dapat melibatkan beberapa bahasa.

Unit dasar dari language model adalah token. Token dapat berupa karakter, kata, atau bagian dari kata (seperti -tion), tergantung pada model. Misalnya, GPT-4, model yang mendukung ChatGPT, memecah frasa "I can't wait to build AI applications" menjadi sembilan token, seperti yang ditunjukkan pada Gambar 1-1. Perhatikan bahwa dalam contoh ini, kata "can't" dipecah menjadi dua token, can dan 't.

Proses memecah teks asli menjadi token disebut tokenization. Untuk GPT-4, token rata-rata memiliki panjang sekitar ¾ dari sebuah kata. Jadi, 100 token adalah sekitar 75 kata.

Semua token yang dapat digunakan oleh model adalah kosakata model. Anda dapat menggunakan sejumlah kecil token untuk membangun sejumlah besar kata yang berbeda, mirip dengan cara Anda menggunakan beberapa huruf dalam alfabet untuk membangun banyak kata. Model Mixtral 8x7B memiliki ukuran kosakata 32.000. Ukuran kosakata GPT-4 adalah 100.256. Metode tokenization dan ukuran kosakata ditentukan oleh pengembang model.

Mengapa language model menggunakan token sebagai unitnya alih-alih kata atau karakter? Ada tiga alasan utama:

1. Dibandingkan dengan karakter, token memungkinkan model memecah kata menjadi komponen yang bermakna. Misalnya, "cooking" dapat dipecah menjadi "cook" dan "ing", dengan kedua komponen membawa beberapa makna dari kata asli.
2. Karena ada lebih sedikit token unik daripada kata unik, ini mengurangi ukuran kosakata model, membuat model lebih efisien.
3. Token juga membantu model memproses kata yang tidak dikenali. Misalnya, kata ciptaan seperti "chatgpting" dapat dipecah menjadi "chatgpt" dan "ing", membantu model memahami strukturnya. Token menyeimbangkan memiliki lebih sedikit unit daripada kata sambil mempertahankan lebih banyak makna daripada karakter individual.

Ada dua jenis utama language model: masked language model dan autoregressive language model. Mereka berbeda berdasarkan informasi apa yang dapat mereka gunakan untuk memprediksi token:

**Masked Language Model**

Masked language model dilatih untuk memprediksi token yang hilang di mana saja dalam urutan, menggunakan konteks dari sebelum dan sesudah token yang hilang. Pada dasarnya, masked language model dilatih untuk bisa mengisi bagian kosong. Misalnya, diberikan konteks, "Warna kesukaan saya adalah __ adalah biru", masked language model harus memprediksi bahwa bagian kosong kemungkinan adalah "warna". Contoh masked language model yang terkenal adalah BERT (Bidirectional Encoder Representations from Transformers).

Masked language model umumnya digunakan untuk tugas non-generatif seperti analisis sentimen dan klasifikasi teks. Mereka juga berguna untuk tugas yang memerlukan pemahaman konteks keseluruhan, seperti debugging kode, di mana model perlu memahami kode yang mendahului dan mengikuti untuk mengidentifikasi kesalahan.

**Autoregressive Language Model**

Autoregressive language model dilatih untuk memprediksi token berikutnya dalam urutan, menggunakan hanya token yang mendahului. Model ini memprediksi apa yang akan datang selanjutnya dalam "Warna kesukaan saya adalah __." Model autoregressive dapat terus menghasilkan satu token setelah token lainnya. Hari ini, autoregressive language model adalah model pilihan untuk generasi teks, dan karena alasan ini, mereka jauh lebih populer daripada masked language model.

Keluaran dari language model adalah terbuka. Language model dapat menggunakan kosakata tetap dan terbatasnya untuk membangun kemungkinan keluaran yang tak terbatas. Model yang dapat menghasilkan keluaran terbuka disebut generatif, hence istilah generative AI.

Anda dapat memikirkan language model sebagai mesin pelengkapan: diberikan teks (prompt), ia mencoba melengkapi teks tersebut. Berikut contoh:

Prompt (dari pengguna): "To be or not to be"
Pelengkapan (dari language model): ", that is the question."

Penting untuk dicatat bahwa pelengkapan adalah prediksi, berdasarkan probabilitas, dan tidak dijamin benar. Sifat probabilistik dari language model membuat mereka begitu menarik dan juga mengganggu untuk digunakan. Kita akan menjelajahi ini lebih lanjut di Bab 2.

Seberapa sederhananya, completion sangatlah powerful. Banyak tugas, termasuk terjemahan, ringkasan, coding, dan pemecahan masalah matematika, dapat dirampingkan sebagai tugas completion. Misalnya, diberikan prompt: "How are you in French is …", language model mungkin bisa melengkapinya dengan: "Comment ça va", secara efektif menerjemahkan dari satu bahasa ke bahasa lain.

Sebagai contoh lain, diberikan prompt:
Pertanyaan: Apakah email ini mungkin spam? Berikut email: <isi email>
Jawaban:

Language model mungkin bisa melengkapinya dengan: "Kemungkinan spam", yang mengubah language model ini menjadi classifier spam.

Meskipun completion powerful, completion bukanlah hal yang sama dengan terlibat dalam percakapan. Misalnya, jika Anda bertanya kepada mesin pelengkapan, ia bisa melengkapi apa yang Anda katakan dengan menambahkan pertanyaan lain alih-alih menjawab pertanyaan. "Post-Training" di halaman 78 membahas cara membuat model merespons secara sesuai terhadap permintaan pengguna.

#### Self-Supervision

Language modeling hanyalah satu dari banyak algoritma ML. Ada juga model untuk deteksi objek, pemodelan topik, sistem rekomendasi, peramalan cuaca, prediksi harga saham, dll. Apa yang khusus tentang language model yang membuat mereka menjadi pusat dari pendekatan scaling yang menyebabkan momen ChatGPT?

Jawabannya adalah language model dapat dilatih menggunakan self-supervision, sementara banyak model lain memerlukan supervision. Supervision mengacu pada proses melatih algoritma ML menggunakan data berlabel, yang bisa mahal dan lambat untuk diperoleh. Self-supervision membantu mengatasi bottleneck labeling data ini untuk membuat dataset yang lebih besar untuk model belajar dari, secara efektif memungkinkan model untuk scaling up.

Dengan supervision, Anda melabeli contoh untuk menunjukkan perilaku yang ingin Anda ajarkan pada model, kemudian melatih model pada contoh-contoh ini. Setelah dilatih, model dapat diterapkan ke data baru. Misalnya, untuk melatih model deteksi penipuan, Anda menggunakan contoh transaksi, masing-masing dilabeli dengan "penipuan" atau "bukan penipuan". Setelah model belajar dari contoh-contoh ini, Anda dapat menggunakan model ini untuk memprediksi apakah transaksi tersebut penipuan.

Kesuksesan model AI pada tahun 2010-an terletak pada supervision. Model yang memulai revolusi deep learning, AlexNet, dilatih dengan supervision. Ia dilatih untuk belajar mengklasifikasikan lebih dari 1 juta gambar dalam dataset ImageNet. Ia mengklasifikasikan setiap gambar menjadi salah satu dari 1.000 kategori seperti "mobil", "balon", atau "monyet".

Kelemahan dari supervision adalah labeling data mahal dan memakan waktu. Jika biaya untuk satu orang melabeli satu gambar adalah 5 sen, biaya untuk melabeli 1 juta gambar untuk ImageNet adalah $50.000. Karena dunia berisi jauh lebih dari 1.000 objek, untuk memperluas kemampuan model untuk bekerja dengan lebih banyak objek, Anda perlu menambahkan label dari lebih banyak kategori. Untuk scaling up ke 1 juta kategori, biaya labeling saja akan meningkat menjadi $50 juta.

Labeling objek sehari-hari adalah sesuatu yang dapat dilakukan oleh kebanyakan orang tanpa pelatihan sebelumnya. Oleh karena itu, dapat dilakukan dengan relatif murah. Namun, tidak semua tugas labeling semudah itu. Menghasilkan terjemahan Latin untuk model Inggris-ke-Latin lebih mahal. Melabeli apakah pemindaian CT menunjukkan tanda-tanda kanker akan sangat mahal.

Self-supervision membantu mengatasi bottleneck labeling data. Dalam self-supervision, alih-alih memerlukan label eksplisit, model dapat menyimpulkan label dari data input. Language modeling adalah self-supervised karena setiap urutan input memberikan baik label (token yang akan diprediksi) dan konteks yang dapat digunakan model untuk memprediksi label-label ini.

Setiap kalimat memberikan banyak sampel pelatihan. Misalnya, kalimat "I love street food." memberikan enam sampel pelatihan, dengan setiap token menjadi output dan token sebelumnya menjadi input.

Self-supervision berbeda dari unsupervised. Dalam self-supervised learning, label disimpulkan dari data input. Dalam unsupervised learning, Anda tidak memerlukan label sama sekali.

Self-supervised learning berarti bahwa language model dapat belajar dari urutan teks tanpa memerlukan labeling apapun. Karena urutan teks ada di mana-mana—dalam buku, blog post, artikel, dan komentar Reddit—dimungkinkan untuk membangun sejumlah besar data pelatihan, memungkinkan language model untuk scaling up menjadi LLM.

Namun, LLM adalah istilah yang kurang ilmiah. Seberapa besar language model harus menjadi untuk dianggap besar? Apa yang besar hari ini mungkin dianggap kecil besok. Ukuran model biasanya diukur oleh jumlah parameternya. Parameter adalah variabel dalam model ML yang diperbarui melalui proses pelatihan. Secara umum, meskipun tidak selalu benar, semakin banyak parameter yang dimiliki model, semakin besar kapasitasnya untuk mempelajari perilaku yang diinginkan.

Ketika model generative pre-trained transformer (GPT) pertama OpenAI keluar pada Juni 2018, ia memiliki 117 juta parameter, dan itu dianggap besar. Pada Februari 2019, ketika OpenAI memperkenalkan GPT-2 dengan 1,5 miliar parameter, 117 juta parameter diturunkan menjadi dianggap kecil. Saat menulis buku ini, model dengan 100 miliar parameter dianggap besar. Mungkin suatu hari, ukuran ini akan dianggap kecil.

Mengapa model yang lebih besar membutuhkan lebih banyak data? Model yang lebih besar memiliki lebih banyak kapasitas untuk belajar, dan oleh karena itu, akan membutuhkan lebih banyak data pelatihan untuk memaksimalkan kinerjanya. Anda dapat melatih model besar pada dataset kecil juga, tetapi itu akan membuang-buang compute. Anda bisa mendapatkan hasil yang sebanding atau lebih baik pada dataset ini dengan model yang lebih kecil.

### Dari Large Language Model ke Foundation Model

Meskipun language model mampu melakukan tugas-tugas yang luar biasa, mereka terbatas pada teks. Sebagai manusia, kita memandang dunia tidak hanya melalui bahasa, tetapi juga melalui penglihatan, pendengaran, sentuhan, dan banyak lagi. Kemampuan untuk memproses data di luar teks sangat penting bagi AI untuk beroperasi di dunia nyata.

Untuk alasan ini, language model sedang diperluas untuk menggabungkan lebih banyak modality data. GPT-4V dan Claude 3 dapat memahami gambar dan teks. Beberapa model bahkan memahami video, aset 3D, struktur protein, dan sebagainya. Menggabungkan lebih banyak modality data ke dalam language model membuat mereka semakin powerful.

Banyak orang masih menyebut Gemini dan GPT-4V sebagai LLM, tetapi mereka lebih tepat digambarkan sebagai foundation model. Kata foundation menandakan baik pentingnya model-model ini dalam aplikasi AI maupun fakta bahwa mereka dapat dibangun untuk kebutuhan yang berbeda.

Foundation model menandai terobosan dari struktur tradisional riset AI. Selama lama, riset AI dibagi berdasarkan modality data. Natural language processing (NLP) hanya menangani teks. Computer vision hanya menangani penglihatan. Model berbasis teks dapat digunakan untuk tugas seperti terjemahan dan deteksi spam. Model berbasis gambar dapat digunakan untuk deteksi objek dan klasifikasi gambar. Model berbasis audio dapat menangani pengenalan suara (speech-to-text) dan sintesis suara (text-to-speech).

Model yang dapat bekerja dengan lebih dari satu modality data juga disebut model multimodal. Model multimodal generatif juga disebut large multimodal model (LMM). Jika language model menghasilkan token berikutnya yang dikondisikan pada token berbasis teks saja, model multimodal menghasilkan token berikutnya yang dikondisikan pada baik token teks dan gambar, atau modality apapun yang didukung model.

Model multimodal juga membutuhkan data untuk scaling up. Self-supervision bekerja untuk model multimodal juga. OpenAI menggunakan varian self-supervision yang disebut natural language supervision untuk melatih model bahasa-gambar CLIP mereka. Alih-alih menghasilkan label secara manual untuk setiap gambar, mereka menemukan pasangan (gambar, teks) yang muncul bersama di internet. Mereka dapat menghasilkan dataset 400 juta pasang (gambar, teks), yang 400 kali lebih besar dari ImageNet, tanpa biaya labeling manual.

Buku ini menggunakan istilah foundation model untuk mengacu pada baik large language model maupun large multimodal model.

Foundation model juga menandai transisi dari model khusus tugas ke model tujuan umum. Sebelumnya, model sering dikembangkan untuk tugas tertentu, seperti analisis sentimen atau terjemahan. Model yang dilatih untuk analisis sentimen tidak akan bisa melakukan terjemahan, dan sebaliknya.

Foundation model, berkat skala dan cara mereka dilatih, mampu melakukan berbagai tugas yang luas. Out of the box, model tujuan umum dapat bekerja cukup baik untuk banyak tugas. LLM dapat melakukan baik analisis sentimen maupun terjemahan. Namun, Anda sering dapat menyesuaikan model tujuan umum untuk memaksimalkan kinerjanya pada tugas tertentu.

Bayangkan Anda bekerja dengan retailer untuk membangun aplikasi untuk menghasilkan deskripsi produk untuk situs web mereka. Model out-of-the-box mungkin dapat menghasilkan deskripsi yang akurat tetapi mungkin gagal menangkap suara merek atau menyoroti pesan merek. Deskripsi yang dihasilkan bahkan mungkin penuh dengan pidato pemasaran dan klise.

Ada beberapa teknik yang dapat Anda gunakan untuk mendapatkan model menghasilkan apa yang Anda inginkan. Misalnya, Anda dapat membuat instruksi terperinci dengan contoh deskripsi produk yang diinginkan. Pendekatan ini adalah prompt engineering. Anda dapat menghubungkan model ke database ulasan pelanggan yang dapat digunakan model untuk menghasilkan deskripsi yang lebih baik. Menggunakan database untuk melengkapi instruksi disebut retrieval-augmented generation (RAG). Anda juga dapat finetune—melatih lebih lanjut—model pada dataset deskripsi produk berkualitas tinggi.

Prompt engineering, RAG, dan finetuning adalah tiga teknik AI engineering yang sangat umum yang dapat Anda gunakan untuk menyesuaikan model dengan kebutuhan Anda. Sisa buku ini akan membahas semuanya secara detail.

Menyesuaikan model yang powerful yang ada dengan tugas Anda umumnya jauh lebih mudah daripada membangun model untuk tugas Anda dari nol—misalnya, sepuluh contoh dan satu akhir pekan versus 1 juta contoh dan enam bulan. Foundation model membuat pengembangan aplikasi AI lebih murah dan mengurangi waktu masuk pasar.

### Dari Foundation Model ke AI Engineering

AI engineering mengacu pada proses membangun aplikasi di atas foundation model. Orang telah membangun aplikasi AI selama lebih dari satu dekade—proses yang sering dikenal sebagai ML engineering atau MLOps. Mengapa kita berbicara tentang AI engineering sekarang?

Dengan ML engineering tradisional, tim membangun aplikasi menggunakan model proprietary mereka. Dengan foundation model, banyak tim menggunakan model yang sama. Diferensiasi harus diperoleh melalui proses pengembangan aplikasi.

AI engineering berbeda dari ML engineering dalam tiga hal utama:

1. Tanpa foundation model, Anda harus melatih model Anda sendiri untuk aplikasi Anda. Dengan AI engineering, Anda menggunakan model yang dilatih oleh orang lain untuk Anda. Ini berarti AI engineering lebih berfokus pada adaptasi model daripada pengembangan model.
2. AI engineering bekerja dengan model yang lebih besar, mengonsumsi lebih banyak sumber daya compute, dan menimbulkan latensi lebih tinggi daripada ML engineering tradisional. Ini berarti ada lebih banyak tekanan untuk pelatihan dan inferensi yang efisien.
3. AI engineering bekerja dengan model yang dapat menghasilkan keluaran terbuka. Keluaran terbuka memberikan fleksibilitas model untuk digunakan untuk lebih banyak tugas, tetapi mereka juga lebih sulit dievaluasi. Ini membuat evaluasi menjadi masalah yang jauh lebih besar dalam AI engineering.

### Mengapa Istilah "AI Engineering?"

Banyak istilah yang digunakan untuk menggambarkan proses membangun aplikasi di atas foundation model, termasuk ML engineering, MLOps, AIOps, LLMOps, dll. Mengapa penulis memilih untuk menggunakan AI engineering untuk buku ini?

Penulis tidak menggunakan istilah ML engineering karena, seperti yang dibahas, bekerja dengan foundation model berbeda dari bekerja dengan model ML tradisional dalam beberapa hal penting. Istilah ML engineering tidak akan cukup untuk menangkap diferensiasi ini. Namun, ML engineering adalah istilah yang bagus untuk mencakup kedua proses.

Penulis tidak menggunakan semua istilah yang diakhiri dengan "Ops" karena, meskipun ada komponen operasional dari proses, fokusnya lebih pada menyesuaikan (engineering) foundation model untuk melakukan apa yang Anda inginkan.

Akhirnya, penulis menyurvei 20 orang yang sedang mengembangkan aplikasi di atas foundation model tentang istilah apa yang akan mereka gunakan untuk menggambarkan apa yang mereka lakukan. Kebanyakan orang lebih suka AI engineering. Penulis memutuskan untuk mengikuti orang-orang.

---

## Foundation Model Use Cases

Jika Anda belum membangun aplikasi AI, penulis berharap bagian sebelumnya telah meyakinkan Anda bahwa sekarang adalah waktu yang tepat untuk melakukannya. Jika Anda memiliki aplikasi yang ingin dibangun, Anda mungkin ingin melompat ke "Planning AI Applications". Jika Anda mencari inspirasi, bagian ini mencakup berbagai pola penggunaan yang umum dan menjanjikan.

Jumlah potensi aplikasi yang dapat Anda bangun dengan foundation model tampaknya tak terbatas. Apapun use case yang Anda pikirkan, kemungkinan ada AI untuk itu. Mustahil untuk mencantumkan semua potensi use case untuk AI.

Bahkan mencoba mengkategorikan use case ini menantang, karena survei berbeda menggunakan kategori yang berbeda. Amazon Web Services (AWS) telah mengkategorikan use case generative AI perusahaan menjadi tiga kategori: pengalaman pelanggan, produktivitas karyawan, dan optimasi proses. Survei O'Reilly 2024 mengkategorikan use case menjadi delapan kategori: pemrograman, analisis data, dukungan pelanggan, copywriting pemasaran, copywriting lain, riset, desain web, dan seni.

Beberapa organisasi, seperti Deloitte, telah mengkategorikan use case berdasarkan nilai yang ditangkap, seperti pengurangan biaya, efisiensi proses, pertumbuhan, dan percepatan inovasi. Untuk nilai yang ditangkap, Gartner memiliki kategori untuk kelangsungan bisnis, yang berarti organisasi mungkin akan keluar dari bisnis jika mereka tidak mengadopsi generative AI.

Eloundou dkk. (2023) memiliki penelitian yang sangat baik tentang seberapa terpapar berbagai pekerjaan terhadap AI. Mereka mendefinisikan tugas sebagai terpapar jika AI dan software yang ditenagai AI dapat mengurangi waktu yang dibutuhkan untuk menyelesaikan tugas ini setidaknya 50%. Pekerjaan dengan paparan 80% berarti 80% tugas pekerjaan tersebut terpapar. Menurut studi tersebut, pekerjaan dengan paparan 100% atau mendekati 100% termasuk penerjemah dan interpreter, penyiap pajak, desainer web, dan penulis.

Saat menganalisis use case, penulis melihat baik aplikasi perusahaan maupun konsumen. Untuk memahami use case perusahaan, penulis mewawancarai 50 perusahaan tentang strategi AI mereka dan membaca lebih dari 100 studi kasus. Untuk memahami aplikasi konsumen, penulis memeriksa 205 aplikasi AI open source dengan setidaknya 500 bintang di GitHub. Penulis mengkategorikan aplikasi menjadi delapan kelompok.

Kategori ini termasuk:
- **Coding**: Alat bantuan coding, ekstraksi data terstruktur dari halaman web dan PDF, konversi bahasa Inggris ke kode, generasi kode dari desain, terjemahan bahasa pemrograman, penulisan dokumentasi, pembuatan tes, generasi pesan commit.
- **Image and Video Production**: Editing foto dan video, desain, presentasi, generasi iklan.
- **Writing**: Email, media sosial dan blog post, copywriting, SEO, laporan, memo, desain dokumen.
- **Education**: Tutoring, penilaian esai, orientasi karyawan, pelatihan peningkatan karyawan.
- **Conversational Bots**: Chatbot umum, AI companion, dukungan pelanggan, produk copilot.
- **Information Aggregation**: Ringkasan, talk-to-your-docs, riset pasar.
- **Data Organization**: Pencarian gambar, manajemen pengetahuan, pemrosesan dokumen.
- **Workflow Automation**: Perencanaan perjalanan, perencanaan acara, ekstraksi data, entri data, annotasi data, generasi lead.

Karena foundation model bersifat umum, aplikasi yang dibangun di atasnya dapat memecahkan banyak masalah. Ini berarti aplikasi dapat termasuk dalam lebih dari satu kategori.

Dunia perusahaan umumnya lebih memilih aplikasi dengan risiko yang lebih rendah. Perusahaan lebih cepat menerapkan aplikasi yang menghadap internal (manajemen pengetahuan internal) daripada aplikasi yang menghadap eksternal (chatbot dukungan pelanggan). Aplikasi internal membantu perusahaan mengembangkan keahlian AI engineering mereka sambil meminimalkan risiko yang terkait dengan privasi data, kepatuhan, dan kegagalan katastrofi yang berpotensi.

### Coding

Dalam beberapa survei generative AI, coding adalah use case yang paling populer. Alat coding AI populer baik karena AI bagus dalam coding maupun karena AI engineer awal adalah programmer yang lebih terpapar dengan tantangan coding.

Salah satu kesuksesan awal foundation model dalam produksi adalah alat penyelesaian kode GitHub Copilot, yang pendapatan berulang tahunan melampaui $100 juta hanya dua tahun setelah peluncuran. Alat coding open source seperti gpt-engineer dan screenshot-to-code masing-masing mendapatkan 50.000 bintang di GitHub dalam satu tahun.

Alat coding AI dapat membantu pengembang menjadi dua kali lebih produktif untuk dokumentasi, dan 25-50% lebih produktif untuk generasi kode dan refactoring kode. Peningkatan produktivitas minimal diamati untuk tugas yang sangat kompleks.

### Image and Video Production

Berkat sifat probabilistiknya, AI hebat untuk tugas kreatif. Beberapa startup AI yang paling sukses adalah aplikasi kreatif, seperti Midjourney untuk generasi gambar, Adobe Firefly untuk editing foto, dan Runway, Pika Labs, dan Sora untuk generasi video.

Untuk perusahaan, iklan dan pemasaran telah dengan cepat mengadopsi AI. AI dapat digunakan untuk menghasilkan gambar promosi dan video secara langsung. Ia dapat membantu brainstorming ide atau menghasilkan draf pertama untuk dieksplorasi oleh ahli manusia.

### Writing

AI sudah lama digunakan untuk membantu menulis. Jika Anda menggunakan smartphone, Anda mungkin sudah familiar dengan autocorrect dan auto-completion, keduanya ditenagai oleh AI. Menulis adalah aplikasi ideal untuk AI karena kita melakukannya banyak, bisa cukup membosankan, dan kita memiliki toleransi yang tinggi terhadap kesalahan.

MIT study (Noy dan Zhang, 2023) menetapkan tugas menulis spesifik pekerjaan kepada 453 profesional berpendidikan perguruan tinggi dan secara acak mengekspos setengah dari mereka ke ChatGPT. Hasil mereka menunjukkan bahwa di antara mereka yang terpapar ChatGPT, waktu rata-rata yang dibutuhkan berkurang 40% dan kualitas keluaran meningkat 18%.

Untuk konsumen, use case sangat jelas. Banyak orang menggunakan AI untuk membantu mereka berkomunikasi lebih baik. Anda dapat marah dalam email dan meminta AI membuatnya menyenangkan. Anda dapat memberikan poin bullet dan mendapatkan paragraf lengkap.

Beberapa orang mengaku mereka tidak lagi mengirim email penting tanpa meminta AI untuk meningkatkannya terlebih dahulu. Mahasiswa menggunakan AI untuk menulis esai. Penulis menggunakan AI untuk menulis buku.

Untuk perusahaan, penulisan AI umum dalam penjualan, pemasaran, dan komunikasi tim umum. Banyak manajer mengatakan mereka telah menggunakan AI untuk membantu mereka menulis laporan kinerja. AI dapat membantu menyusun email outreach dingin yang efektif, copywriting iklan, dan deskripsi produk.

### Education

Kapan saja ChatGPT turun, server Discord OpenAI dipenuhi dengan siswa yang mengeluh tentang ketidakmampuan menyelesaikan pekerjaan rumah. Namun, alih-alih melarang AI, sekolah dapat menggunakannya untuk membantu siswa belajar lebih cepat.

AI dapat merangkum buku teks dan menghasilkan rencana kuliah yang dipersonalisasi untuk setiap siswa. AI dapat membantu menyesuaikan materi ke format yang paling sesuai untuk setiap siswa. Pembelajar auditory dapat meminta AI untuk membaca materi tersebut keras. Siswa yang menyukai hewan dapat menggunakan AI untuk menyesuaikan visualisasi dengan lebih banyak hewan.

AI terutama membantu untuk pembelajaran bahasa, karena Anda dapat meminta AI untuk memainkan skenario latihan yang berbeda. AI dapat menghasilkan kuis, baik pilihan ganda maupun terbuka, dan mengevaluasi jawabannya. AI dapat menjadi mitra debat karena AI jauh lebih baik dalam menyajikan pandangan yang berbeda tentang topik yang sama daripada manusia rata-rata.

### Conversational Bots

Chatbot percakapan serba bisa. Mereka dapat membantu kita menemukan informasi, menjelaskan konsep, dan brainstorming ide. AI dapat menjadi teman dan terapis Anda. AI dapat meniru kepribadian, memungkinkan Anda berbicara dengan salinan digital siapa pun yang Anda suka.

Untuk perusahaan, bot percakapan yang paling populer adalah bot dukungan pelanggan. Mereka dapat membantu perusahaan menghemat biaya sambil meningkatkan pengalaman pelanggan karena mereka dapat merespons pengguna lebih cepat daripada agen manusia. AI juga dapat menjadi produk copilot yang memandu pelanggan melalui tugas yang menyakitkan dan membingungkan seperti mengajukan klaim asuransi, melakukan pajak, atau mencari kebijakan perusahaan.

### Information Aggregation

Banyak orang percaya bahwa kesuksesan kita tergantung pada kemampuan kita untuk menyaring dan mencerna informasi yang berguna. Namun, mengikuti email, pesan Slack, dan berita kadang bisa sangat menumpuk. Untungnya, AI datang untuk menyelamatkan. AI terbukti mampu mengagregasi informasi dan merangkumnya.

Untuk konsumen, banyak aplikasi yang dapat memproses dokumen Anda—kontrak, pengungkapan, makalah—dan memungkinkan Anda mengambil informasi dengan cara percakapan. Use case ini juga disebut talk-to-your-docs. AI dapat membantu Anda merangkum situs web, penelitian, dan membuat laporan tentang topik pilihan Anda.

### Data Organization

Satu hal yang pasti tentang masa depan adalah kita akan terus menghasilkan lebih banyak data. Pengguna smartphone akan terus mengambil foto dan video. Perusahaan akan terus mencatat segala sesuatu tentang produk, karyawan, dan pelanggan. Miliaran kontrak dibuat setiap tahun. Foto, video, log, dan PDF adalah semua data tidak terstruktur atau semi terstruktur. Penting untuk mengatur semua data ini dengan cara yang dapat dicari nanti.

AI dapat membantu dengan tepat itu. AI dapat secara otomatis menghasilkan deskripsi teks tentang gambar dan video, atau membantu mencocokkan kueri teks dengan visual yang sesuai dengan kueri tersebut. Layanan seperti Google Photos sudah menggunakan AI untuk menampilkan gambar yang sesuai dengan kueri pencarian.

AI sangat bagus dengan analisis data. Ia dapat menulis program untuk menghasilkan visualisasi data, mengidentifikasi outlier, dan membuat prediksi seperti peramalan pendapatan. Perusahaan dapat menggunakan AI untuk mengekstrak informasi terstruktur dari data tidak terstruktur, yang dapat digunakan untuk mengatur data dan membantu pencarian.

### Workflow Automation

Pada akhirnya, AI harus mengotomatiskan sebanyak mungkin. Untuk pengguna akhir, otomatisasi dapat membantu dengan tugas harian yang membosankan seperti memesan restoran, meminta pengembalian dana, merencanakan perjalanan, dan mengisi formulir.

Untuk perusahaan, AI dapat mengotomatiskan tugas berulang seperti manajemen lead, penagihan, reimbursemen, mengelola permintaan pelanggan, entri data, dan sebagainya. Satu use case yang sangat menarik adalah menggunakan model AI untuk mensintesis data, yang kemudian dapat digunakan untuk meningkatkan model-model itu sendiri.

Akses ke alat eksternal diperlukan untuk menyelesaikan banyak tugas. AI yang dapat merencanakan dan menggunakan alat disebut agent. Tingkat minat terhadap agent hampir menjadi obsesi, tetapi tidak sepenuhnya tidak beralasan. AI agent berpotensi membuat setiap orang jauh lebih produktif dan menghasilkan nilai ekonomi yang jauh lebih besar. Agent adalah topik pusat di Bab 6.

---

## Planning AI Applications

Dengan potensi AI yang tampaknya tidak terbatas, sangat menggoda untuk langsung masuk ke membangun aplikasi. Jika Anda hanya ingin belajar dan bersenang-senang, lompatlah ke dalamnya. Membangun adalah salah satu cara terbaik untuk belajar.

Namun, jika Anda melakukan ini untuk penghidupan, mungkin layak untuk mundur sejenak dan mempertimbangkan mengapa Anda membangun ini dan bagaimana Anda harus melakukannya. Mudah untuk membuat demo yang keren dengan foundation model. Sulit untuk membuat produk yang menguntungkan.

### Use Case Evaluation

Pertanyaan pertama yang harus ditanyakan adalah mengapa Anda ingin membangun aplikasi ini. Seperti banyak keputusan bisnis, membangun aplikasi AI seringkali merupakan respons terhadap risiko dan peluang.

Tingkat risiko dari tinggi ke rendah:
1. Jika Anda tidak melakukan ini, pesaing dengan AI dapat membuat Anda usang. Jika AI menimbulkan ancaman eksistensial utama bagi bisnis Anda, mengadopsi AI harus memiliki prioritas tertinggi.
2. Jika Anda tidak melakukan ini, Anda akan melewatkan peluang untuk meningkatkan laba dan produktivitas. Kebanyakan perusahaan mengadopsi AI untuk peluang yang dibawanya.
3. Anda tidak yakin di mana AI akan cocok dengan bisnis Anda, tetapi Anda tidak ingin tertinggal. Berinvestasi dalam memahami bagaimana teknologi transformasional baru dapat memengaruhi bisnis Anda bukan ide yang buruk jika Anda bisa membelinya.

Setelah Anda menemukan alasan yang baik untuk mengembangkan use case ini, Anda mungkin mempertimbangkan apakah Anda harus membangunnya sendiri. Jika AI menimbulkan ancaman eksistensial bagi bisnis Anda, Anda mungkin ingin melakukan AI secara internal alih-alih mengontraknya ke pesaing.

### The Role of AI and Humans in the Application

Peran yang dimainkan AI dalam produk AI mempengaruhi pengembangan aplikasi dan persyaratannya. Apple memiliki dokumen hebat yang menjelaskan cara berbeda AI dapat digunakan dalam produk:

- **Kritis atau komplementer**: Jika aplikasi masih dapat bekerja tanpa AI, AI adalah komplementer untuk aplikasi. Semakin kritis AI ke aplikasi, semakin akurat dan andal bagian AI harus.
- **Reaktif atau proaktif**: Fitur reaktif menunjukkan responsnya sebagai reaksi terhadap permintaan pengguna atau tindakan tertentu, sedangkan fitur proaktif menunjukkan responsnya ketika ada kesempatan. Fitur proaktif dapat dihitung terlebih dahulu dan ditampilkan secara oportunistik, sehingga latensi kurang penting.
- **Dinamis atau statis**: Fitur dinamis diperbarui terus menerus dengan umpan balik pengguna, sedangkan fitur statis diperbarui secara periodik.

Juga penting untuk mengklarifikasi peran manusia dalam aplikasi. Apakah AI akan memberikan dukungan latar belakang kepada manusia, membuat keputusan secara langsung, atau keduanya? Melibatkan manusia dalam proses pengambilan keputusan AI disebut human-in-the-loop.

Microsoft mengusulkan kerangka kerja untuk meningkatkan otomatisasi AI dalam produk yang mereka sebut Crawl-Walk-Run:
1. Crawl berarti keterlibatan manusia wajib.
2. Walk berarti AI dapat berinteraksi langsung dengan karyawan internal.
3. Run berarti otomatisasi yang meningkat, termasuk berpotensi interaksi AI langsung dengan pengguna eksternal.

### AI Product Defensibility

Jika Anda menjual aplikasi AI sebagai produk mandiri, penting untuk mempertimbangkan defensibilitasnya. Hambatan masuk yang rendah adalah both berkat dan kutukan. Jika sesuatu mudah bagi Anda untuk dibangun, juga mudah bagi pesaing Anda.

Dalam AI, ada generally tiga jenis keunggulan kompetitif: teknologi, data, dan distribusi—kemampuan untuk membawa produk Anda di depan pengguna. Dengan foundation model, teknologi inti dari kebanyakan perusahaan akan serupa. Keunggulan distribusi kemungkinan dimiliki oleh perusahaan besar.

Keunggulan data lebih nuansa. Perusahaan besar kemungkinan memiliki lebih banyak data yang ada. Namun, jika startup dapat masuk ke pasar terlebih dahulu dan mengumpulkan data penggunaan yang cukup untuk terus meningkatkan produk mereka, data akan menjadi moat mereka.

### Setting Expectations

Setelah Anda memutuskan bahwa Anda perlu membangun aplikasi AI yang luar biasa ini sendiri, langkah selanjutnya adalah mencari tahu seperti apa kesuksesan terlihat: bagaimana Anda akan mengukur kesuksesan?

Metrik yang paling penting adalah bagaimana ini akan memengaruhi bisnis Anda. Misalnya, jika itu adalah chatbot dukungan pelanggan, metrik bisnis dapat mencakup:
- Persentase pesan pelanggan yang ingin Anda otomatiskan oleh chatbot?
- Berapa banyak pesan lagi yang harus memungkinkan chatbot memproses untuk Anda?
- Seberapa cepat Anda dapat merespons menggunakan chatbot?
- Berapa banyak tenaga kerja manusia yang dapat dihemat chatbot?

Juga penting untuk melacak kepuasan pelanggan dan umpan balik pelanggan secara umum.

Untuk memastikan produk tidak diletakkan di depan pelanggan sebelum siap, memiliki ekspektasi yang jelas pada ambang kegunaannya: seberapa baik harus menjadi agar berguna. Ambang kegunaan mungkin mencakup metrik kualitas, metrik latensi, metrik biaya, dan metrik lain seperti interpretabilitas dan keadilan.

### Milestone Planning

Setelah Anda menetapkan tujuan yang terukur, Anda membutuhkan rencana untuk mencapai tujuan ini. Bagaimana mencapai tujuan tergantung dari mana Anda memulai. Evaluasi model yang ada untuk memahami kemampuan mereka. Semakin kuat model off-the-shelf, semakin sedikit pekerjaan yang harus Anda lakukan.

Perencanaan produk AI perlu memperhitungkan last mile challenge-nya. Kesuksesan awal dengan foundation model bisa menyesatkan. Karena kemampuan dasar foundation model sudah cukup mengesankan, mungkin tidak membutuhkan banyak waktu untuk membuat demo yang menyenangkan. Namun, demo awal yang baik tidak menjanjikan produk akhir yang baik. Mungkin membutuhkan akhir pekan untuk membuat demo tetapi bulan, bahkan tahun, untuk membuat produk.

### Maintenance

Perencanaan produk tidak berhenti pada pencapaian tujuannya. Anda perlu memikirkan bagaimana produk ini mungkin berubah dari waktu ke waktu dan bagaimana seharusnya dipelihara. Pemeliharaan produk AI memiliki tantangan tambahan dari kecepatan cepat perubahan AI.

Perubahan yang baik umumnya terjadi. Misalnya, batasan dari banyak model sedang diatasi. Panjang konteks menjadi lebih panjang. Keluaran model menjadi lebih baik. Inferensi model menjadi lebih cepat dan lebih murah.

Namun, bahkan perubahan baik ini dapat menyebabkan gesekan dalam alur kerja Anda. Anda harus terus waspada dan melakukan analisis cost-benefit dari setiap investasi teknologi. Opsi terbaik hari ini mungkin menjadi opsi terburuk besok.

---

## The AI Engineering Stack

AI engineering's rapid growth juga mengindukasi jumlah hype dan FOMO yang luar biasa. Jumlah alat, teknik, model, dan aplikasi baru yang diperkenalkan setiap hari bisa sangat menumpuk. Mari kita lihat ke blok bangunan dasar dari AI engineering.

### Three Layers of the AI Stack

Ada tiga lapisan untuk tumpukan aplikasi AI apa pun: pengembangan aplikasi, pengembangan model, dan infrastruktur. Saat mengembangkan aplikasi AI, Anda kemungkinan akan mulai dari lapisan atas dan bergerak ke bawah sesuai kebutuhan:

**Application Development**
Dengan model yang readily available, siapa pun dapat menggunakannya untuk mengembangkan aplikasi. Ini adalah lapisan yang telah melihat paling banyak aksi dalam dua tahun terakhir, dan masih berkembang dengan cepat. Pengembangan aplikasi melibatkan memberikan prompt yang baik dan konteks yang diperlukan kepada model. Lapisan ini memerlukan evaluasi yang ketat. Aplikasi yang baik juga menuntut antarmuka yang baik.

**Model Development**
Lapisan ini menyediakan tooling untuk mengembangkan model, termasuk kerangka kerja untuk modeling, training, finetuning, dan optimasi inferensi. Karena data adalah pusat dari pengembangan model, lapisan ini juga mengandung dataset engineering. Pengembangan model juga memerlukan evaluasi yang ketat.

**Infrastructure**
Di dasar tumpukan adalah infrastruktur, yang mencakup tooling untuk model serving, mengelola data dan compute, dan monitoring.

Ketika perusahaan mulai bereksperimen dengan foundation model, alami bahwa tim ML yang ada harus memimpin usaha ini. Beberapa perusahaan memperlakukan AI engineering sama dengan ML engineering. Beberapa perusahaan memiliki deskripsi pekerjaan terpisah untuk AI engineering.

### AI Engineering Versus ML Engineering

Membangun aplikasi menggunakan foundation model hari ini berbeda dari ML engineering tradisional dalam tiga cara utama:

1. Tanpa foundation model, Anda harus melatih model Anda sendiri untuk aplikasi Anda. Dengan AI engineering, Anda menggunakan model yang dilatih oleh orang lain.
2. AI engineering bekerja dengan model yang lebih besar, mengonsumsi lebih banyak sumber daya compute, dan menimbulkan latensi lebih tinggi.
3. AI engineering bekerja dengan model yang dapat menghasilkan keluaran terbuka. Keluaran terbuka lebih sulit dievaluasi.

AI engineering lebih sedikit tentang pengembangan model dan lebih banyak tentang menyesuaikan dan mengevaluasi model. Teknik adaptasi model dapat dibagi menjadi dua kategori, tergantung pada apakah mereka memerlukan pembaruan bobot model:

**Teknik berbasis prompt**, yang mencakup prompt engineering, menyesuaikan model tanpa memperbarui bobot model. Anda menyesuaikan model dengan memberikan instruksi dan konteks alih-alih mengubah model itu sendiri. Prompt engineering lebih mudah untuk memulai dan memerlukan lebih sedikit data. Namun, prompt engineering mungkin tidak cukup untuk tugas yang kompleks atau aplikasi dengan persyaratan kinerja yang ketat.

**Finetuning**, di sisi lain, memerlukan pembaruan bobot model. Anda menyesuaikan model dengan membuat perubahan pada model itu sendiri. Teknik finetuning secara umum lebih rumit dan memerlukan lebih banyak data, tetapi mereka dapat meningkatkan kualitas, latensi, dan biaya model Anda secara signifikan.

#### Model Development

Pengembangan model adalah lapisan yang paling sering diasosiasikan dengan ML engineering tradisional. Ia memiliki tiga tanggung jawab utama: modeling dan training, dataset engineering, dan inferensi optimasi.

**Modeling dan Training**
Mengembangkan model ML memerlukan pengetahuan ML khusus. Namun, dengan ketersediaan foundation model, pengetahuan ML bukan lagi keharusan untuk membangun aplikasi AI. Banyak pembuat aplikasi AI yang sukses sama sekali tidak tertarik untuk belajar tentang gradient descent. Namun, pengetahuan ML masih sangat berharga.

**Dataset Engineering**
Dataset engineering mengacu pada kurasi, generasi, dan annotasi data yang dibutuhkan untuk melatih dan menyesuaikan model AI. Dalam ML engineering tradisional, sebagian besar use case adalah close-ended. Foundation model, bagaimanapun, adalah open-ended. Mengannotasi kueri terbuka jauh lebih sulit daripada mengannotasi kueri tertutup.

Perbedaan lain adalah bahwa ML engineering tradisional bekerja lebih banyak dengan data tabular, sedangkan foundation model bekerja dengan data tidak terstruktur. Dalam AI engineering, manipulasi data lebih tentang deduplikasi, tokenization, pengambilan konteks, dan kontrol kualitas.

**Inferensi Optimasi**
Optimasi inferensi berarti membuat model lebih cepat dan lebih murah. Optimasi inferensi selalu penting untuk ML engineering. Namun, karena foundation model scaling up untuk menimbulkan biaya dan latensi inferensi yang lebih tinggi, optimasi inferensi menjadi semakin penting.

Satu tantangan dengan foundation model adalah mereka seringkali autoregresif—token dihasilkan secara berurutan. Jika membutuhkan 10 ms untuk model menghasilkan token, akan membutuhkan satu detik untuk menghasilkan keluaran 100 token.

#### Application Development

Dengan ML engineering tradisional, di mana tim membangun aplikasi menggunakan model proprietary mereka, kualitas model adalah diferensiasi. Dengan foundation model, di mana banyak tim menggunakan model yang sama, diferensiasi harus diperoleh melalui proses pengembangan aplikasi.

Lapisan pengembangan aplikasi terdiri dari tanggung jawab ini: evaluasi, prompt engineering, dan antarmuka AI.

**Evaluasi**
Evaluasi tentang memitigasi risiko dan mengungkap peluang. Evaluasi diperlukan di seluruh proses adaptasi model. Evaluasi diperlukan untuk memilih model, untuk mengukur kemajuan, untuk menentukan apakah aplikasi siap untuk deployment, dan untuk mendeteksi masalah dan peluang untuk perbaikan dalam produksi.

Meskipun evaluasi selalu penting dalam ML engineering, ini bahkan lebih penting dengan foundation model, untuk banyak alasan. Tantangan mengevaluasi foundation model terutama muncul dari sifat terbuka dan kemampuan yang diperluas dari foundation model.

Eksistensi dari begitu banyak teknik adaptasi juga membuat evaluasi lebih sulit. Sistem yang berkinerja buruk dengan satu teknik mungkin berkinerja jauh lebih baik dengan yang lain. Google meluncurkan Gemini pada Desember 2023, mereka mengklaim bahwa Gemini lebih baik daripada ChatGPT dalam benchmark MMLU. Google telah mengevaluasi Gemini menggunakan teknik prompt engineering yang disebut CoT@32. Dalam teknik ini, Gemini ditampilkan 32 contoh, sementara ChatGPT hanya ditampilkan 5 contoh. Ketika keduanya ditampilkan lima contoh, ChatGPT berkinerja lebih baik.

**Prompt Engineering dan Context Construction**
Prompt engineering tentang mendapatkan model AI untuk mengekspresikan perilaku yang diinginkan dari input saja, tanpa mengubah bobot model. Cerita evaluasi Gemini menyoroti dampak prompt engineering pada kinerja model. Dengan menggunakan teknik prompt engineering yang berbeda, kinerja Gemini Ultra pada MMLU naik dari 83,7% menjadi 90,04%.

**Antarmuka AI**
Antarmuka AI berarti membuat antarmuka untuk pengguna akhir untuk berinteraksi dengan aplikasi AI Anda. Sebelum foundation model, hanya organisasi dengan sumber daya yang cukup untuk mengembangkan model AI yang dapat mengembangkan aplikasi AI. Dengan foundation model, siapa pun dapat membangun aplikasi AI.

---

## Summary

Bab ini bertujuan untuk dua tujuan. Satu adalah menjelaskan munculnya AI engineering sebagai disiplin, berkat ketersediaan foundation model. Dua adalah memberikan gambaran umum tentang proses yang dibutuhkan untuk membangun aplikasi di atas model-model ini.

Bab ini membahas evolusi cepat AI dalam tahun-tahun terakhir. Ini berjalan melalui beberapa transformasi paling penting, mulai dengan transisi dari language model ke large language model, berkat pendekatan pelatihan yang disebut self-supervision. Kemudian ini melacak bagaimana language model menggabungkan modality data lain untuk menjadi foundation model, dan bagaimana foundation model melahirkan AI engineering.

Pertumbuhan cepat AI engineering dimotivasi oleh banyak aplikasi yang diaktifkan oleh kemampuan emerging dari foundation model. Bab ini membahas beberapa pola aplikasi yang paling sukses, baik untuk konsumen maupun perusahaan. Meskipun jumlah aplikasi AI yang sudah ada dalam produksi tidak terhitung, kita masih berada di tahap awal AI engineering, dengan lebih banyak inovasi yang belum dibangun.

Sebelum membangun aplikasi, pertanyaan penting yang sering diabaikan adalah apakah Anda harus membangunnya. Bab ini membahas pertanyaan ini bersama dengan pertimbangan utama untuk membangun aplikasi AI.

Meskipun AI engineering adalah istilah baru, itu berkembang dari ML engineering, yang merupakan disiplin overarching yang terlibat dengan membangun aplikasi dengan semua model ML. Banyak prinsip dari ML engineering masih berlaku untuk AI engineering. Namun, AI engineering juga membawa tantangan baru dan solusi baru. Bagian terakhir dari bab ini membahas tumpukan AI engineering, termasuk bagaimana ia telah berubah dari ML engineering.

Satu aspek AI engineering yang terutama menantang untuk ditangkap dalam penulisan adalah jumlah energi kolektif, kreativitas, dan bakat engineering yang dibawa komunitas. Semangat kolektif ini seringkali bisa sangat menumpuk, karena mustahil untuk tetap up-to-date dengan teknik baru, penemuan, dan prestasi engineering yang tampaknya terjadi terus menerus.

Satu penghiburan adalah karena AI hebat dalam agregasi informasi, ia dapat membantu kita mengagregasi dan merangkum semua pembaruan baru ini. Namun, alat hanya dapat membantu sampai batas tertentu. Semakin menumpuknya ruang, semakin pentingnya memiliki kerangka kerja untuk membantu kita menavigasinya. Buku ini bertujuan untuk memberikan kerangka kerja tersebut.

Sisa buku ini akan menjelajahi kerangka kerja ini langkah demi langkah, mulai dengan blok bangunan dasar dari AI engineering: foundation model yang membuat begitu banyak aplikasi yang menakjubkan mungkin.
