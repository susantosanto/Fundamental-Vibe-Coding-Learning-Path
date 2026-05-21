# Bab 3: Metodologi Evaluasi

Semakin banyak AI digunakan, semakin besar peluang terjadinya kegagalan katastropik. Kita telah melihat banyak kegagalan dalam waktu singkat sejak foundation model ada. Seorang pria bunuh diri setelah didorong oleh chatbot. Pengacara menyerahkan bukti palsu yang dihalusinasi oleh AI. Air Canada diperintahkan membayar ganti rugi ketika chatbot AI-nya memberikan informasi palsu kepada penumpang. Tanpa cara untuk mengendalikan kualitas output AI, risiko AI mungkin melebihi manfaatnya bagi banyak aplikasi.

Ketika tim-tim bergegas mengadopsi AI, banyak yang segera menyadari bahwa hambatan terbesar untuk mewujudkan aplikasi AI adalah evaluasi. Untuk beberapa aplikasi, menentukan evaluasi bisa memakan sebagian besar upaya pengembangan.¹

Karena pentingnya dan kompleksitas evaluasi, buku ini memiliki dua bab tentangnya. Bab ini mencakup metode evaluasi berbeda yang digunakan untuk mengevaluasi model open-ended, bagaimana metode ini bekerja, dan keterbatasannya. Bab berikutnya berfokus pada bagaimana menggunakan metode ini untuk memilih model untuk aplikasi Anda dan membangun pipeline evaluasi untuk mengevaluasi aplikasi Anda.

Meskipun saya membahas evaluasi dalam bab-babnya sendiri, evaluasi harus dipertimbangkan dalam konteks seluruh sistem, bukan secara terisolasi. Evaluasi bertujuan untuk memitigasi risiko dan mengungkap peluang. Untuk memitigasi risiko, pertama-tama Anda perlu mengidentifikasi tempat-tempat di mana sistem Anda kemungkinan akan gagal dan merancang evaluasi Anda di sekitarnya. Seringkali, ini mungkin memerlukan desain ulang sistem Anda untuk meningkatkan visibilitas ke dalam kegagalannya. Tanpa pemahaman yang jelas tentang di mana sistem Anda gagal, tidak ada jumlah metrik evaluasi atau alat yang dapat membuat sistem menjadi kokoh.

Sebelum mendalami metode evaluasi, penting untuk mengakui tantangan mengevaluasi foundation model. Karena evaluasi sulit, banyak orang puas dengan informasi dari mulut ke mulut² (misalnya, seseorang mengatakan bahwa model X bagus) atau melihat hasil sekilas.³ Ini menciptakan lebih banyak risiko dan memperlambat iterasi aplikasi. Sebaliknya, kita perlu berinvestasi dalam evaluasi sistematis untuk membuat hasil lebih dapat diandalkan.

Karena banyak foundation model memiliki komponen language model, bab ini akan memberikan gambaran singkat tentang metrik yang digunakan untuk mengevaluasi language model, termasuk cross entropy dan perplexity. Metrik-metrik ini penting untuk memandu pelatihan dan finetuning language model dan sering digunakan dalam banyak metode evaluasi.

Mengevaluasi foundation model sangat menantang karena mereka open-ended, dan saya akan membahas praktik terbaik untuk mengatasinya. Menggunakan evaluator manusia tetap menjadi pilihan yang diperlukan untuk banyak aplikasi. Namun, mengingat betapa lambat dan mahalnya anotasi manusia, tujuannya adalah untuk mengotomatiskan prosesnya. Buku ini berfokus pada evaluasi otomatis, yang mencakup evaluasi eksak dan subjektif.

Bintang yang sedang naik daun dari evaluasi subjektif adalah AI sebagai juri — pendekatan menggunakan AI untuk mengevaluasi respons AI. Ini subjektif karena skornya tergantung pada model dan prompt apa yang digunakan juri AI. Meskipun pendekatan ini mendapatkan daya tarik yang cepat di industri, pendekatan ini juga mengundang oposisi intens dari mereka yang percaya bahwa AI tidak cukup dapat dipercaya untuk tugas penting ini. Saya sangat bersemangat untuk mendalami diskusi ini lebih dalam, dan saya harap Anda juga demikian.

¹ Pada Desember 2023, Greg Brockman, salah satu pendiri OpenAI, mentweet bahwa "eval seringkali adalah semua yang Anda butuhkan."
² Studi 2023 oleh a16z menunjukkan bahwa 6 dari 70 pengambil keputusan mengevaluasi model dari mulut ke mulut.
³ Juga dikenal sebagai vibe check.

## Tantangan Mengevaluasi Foundation Model

Mengevaluasi model ML selalu sulit. Dengan diperkenalkannya foundation model, evaluasi menjadi semakin sulit. Ada beberapa alasan mengapa mengevaluasi foundation model lebih menantang daripada mengevaluasi model ML tradisional.

Pertama, semakin cerdas model AI, semakin sulit mengevaluasinya. Kebanyakan orang dapat mengetahui apakah solusi matematika siswa kelas satu salah. Hanya sedikit yang bisa melakukan hal yang sama untuk solusi matematika tingkat PhD.⁴ Mudah untuk mengatakan apakah ringkasan buku buruk jika itu omong kosong, tetapi jauh lebih sulit jika ringkasannya koheren. Untuk memvalidasi kualitas ringkasan, Anda mungkin perlu membaca buku terlebih dahulu. Ini membawa kita ke korelasi: evaluasi bisa jauh lebih memakan waktu untuk tugas-tugas yang canggih. Anda tidak bisa lagi mengevaluasi respons berdasarkan bagaimana kedengarannya. Anda juga perlu memeriksa fakta, bernalar, dan bahkan menggabungkan keahlian domain.

Kedua, sifat open-ended dari foundation model merusak pendekatan tradisional mengevaluasi model terhadap ground truth. Dengan ML tradisional, sebagian besar tugas bersifat close-ended. Misalnya, model klasifikasi hanya dapat mengeluarkan kategori yang diharapkan. Untuk mengevaluasi model klasifikasi, Anda dapat mengevaluasi output-nya terhadap output yang diharapkan. Jika output yang diharapkan adalah kategori X tetapi output model adalah kategori Y, model itu salah. Namun, untuk tugas open-ended, untuk input tertentu, ada begitu banyak respons yang benar. Tidak mungkin untuk menyusun daftar komprehensif output yang benar untuk dibandingkan.

Ketiga, sebagian besar foundation model diperlakukan sebagai kotak hitam, baik karena penyedia model memilih untuk tidak mengekspos detail model, atau karena pengembang aplikasi kurang memiliki keahlian untuk memahaminya. Detail seperti arsitektur model, data pelatihan, dan proses pelatihan dapat mengungkapkan banyak hal tentang kekuatan dan kelemahan model. Tanpa detail tersebut, Anda hanya dapat mengevaluasi model dengan mengamati output-nya.

Pada saat yang sama, benchmark evaluasi yang tersedia untuk umum terbukti tidak memadai untuk mengevaluasi foundation model. Idealnya, benchmark evaluasi harus menangkap berbagai kemampuan model. Seiring kemajuan AI, benchmark perlu berkembang untuk mengejar ketertinggalan. Sebuah benchmark menjadi jenuh untuk model setelah model mencapai skor sempurna. Dengan foundation model, benchmark menjadi jenuh dengan cepat. Benchmark GLUE (General Language Understanding Evaluation) muncul pada 2018 dan menjadi jenuh hanya dalam setahun, memerlukan pengenalan SuperGLUE pada 2019. Demikian pula, NaturalInstructions (2021) digantikan oleh Super-NaturalInstructions (2022). MMLU (2020), benchmark kuat yang menjadi andalan banyak foundation model awal, sebagian besar digantikan oleh MMLU-Pro (2024).

Terakhir namun tidak kalah penting, ruang lingkup evaluasi telah berkembang untuk model tujuan umum. Dengan model khusus tugas, evaluasi melibatkan pengukuran kinerja model pada tugas yang dilatihnya. Namun, dengan model tujuan umum, evaluasi tidak hanya tentang menilai kinerja model pada tugas yang diketahui tetapi juga tentang menemukan tugas baru yang dapat dilakukan model, dan ini mungkin termasuk tugas yang melampaui kemampuan manusia. Evaluasi mengambil tanggung jawab tambahan untuk mengeksplorasi potensi dan keterbatasan AI.

Kabar baiknya adalah bahwa tantangan baru evaluasi telah mendorong banyak metode dan benchmark baru. Gambar 3-1 menunjukkan bahwa jumlah makalah yang diterbitkan tentang evaluasi LLM tumbuh secara eksponensial setiap bulan pada paruh pertama tahun 2023, dari 2 makalah per bulan menjadi hampir 35 makalah per bulan.

Dalam analisis saya sendiri terhadap 1.000 repositori terkait AI teratas di GitHub, diperingkat berdasarkan jumlah bintang, saya menemukan lebih dari 50 repositori yang didedikasikan untuk evaluasi (per Mei 2024).⁵ Saat memplot jumlah repositori evaluasi berdasarkan tanggal pembuatannya, kurva pertumbuhannya terlihat eksponensial.

Kabar buruknya adalah bahwa meskipun ada peningkatan minat dalam evaluasi, evaluasi masih tertinggal dalam hal minat dibandingkan dengan sisa pipeline AI engineering. Balduzzi et al. dari DeepMind mencatat dalam makalah mereka bahwa "mengembangkan evaluasi telah menerima sedikit perhatian sistematis dibandingkan dengan mengembangkan algoritma." Menurut makalah tersebut, hasil eksperimen hampir secara eksklusif digunakan untuk meningkatkan algoritma dan jarang digunakan untuk meningkatkan evaluasi. Mengakui kurangnya investasi dalam evaluasi, Anthropic menyerukan kepada pembuat kebijakan untuk meningkatkan pendanaan pemerintah baik untuk mengembangkan metodologi evaluasi baru maupun menganalisis ketahanan evaluasi yang ada.

Untuk lebih menunjukkan bagaimana investasi dalam evaluasi tertinggal dari area lain di ruang AI, jumlah alat untuk evaluasi kecil dibandingkan dengan jumlah alat untuk pemodelan dan pelatihan serta orkestrasi AI. Investasi yang tidak memadai menyebabkan infrastruktur yang tidak memadai, sehingga sulit bagi orang untuk melakukan evaluasi sistematis. Ketika ditanya bagaimana mereka mengevaluasi aplikasi AI mereka, banyak orang mengatakan kepada saya bahwa mereka hanya melihat hasilnya sekilas. Banyak yang memiliki serangkaian kecil prompt andalan yang mereka gunakan untuk mengevaluasi model. Proses menyusun prompt ini bersifat ad hoc, biasanya berdasarkan pengalaman pribadi kurator而不是 berdasarkan kebutuhan aplikasi. Anda mungkin bisa lolos dengan pendekatan ad hoc ini ketika memulai proyek, tetapi itu tidak akan cukup untuk iterasi aplikasi. Buku ini berfokus pada pendekatan sistematis untuk evaluasi.

⁴ Ketika GPT-o1 OpenAI dirilis pada September 2024, peraih medali Fields Terrence Tao membandingkan pengalaman bekerja dengan model ini dengan bekerja dengan "mahasiswa pascasarjana yang biasa-biasa saja, tetapi tidak sepenuhnya tidak kompeten." Dia berspekulasi bahwa mungkin hanya perlu satu atau dua iterasi lagi sampai AI mencapai tingkat "mahasiswa pascasarjana yang kompeten." Menanggapi penilaiannya, banyak orang bercanda bahwa jika kita sudah berada pada titik di mana kita membutuhkan pikiran manusia paling cerdas untuk mengevaluasi model AI, kita tidak akan memiliki siapa pun yang memenuhi syarat untuk mengevaluasi model masa depan.
⁵ Saya mencari semua repositori dengan setidaknya 500 bintang menggunakan kata kunci "LLM", "GPT", "generative", dan "transformer". Saya juga mengumpulkan repositori yang hilang melalui situs web saya https://huyenchip.com.

## Memahami Metrik Language Modeling

Foundation model berevolusi dari language model. Banyak foundation model masih memiliki language model sebagai komponen utama mereka. Untuk model-model ini, kinerja komponen language model cenderung berkorelasi baik dengan kinerja foundation model pada aplikasi downstream (Liu et al., 2023). Oleh karena itu, pemahaman kasar tentang metrik language modeling dapat sangat membantu dalam memahami kinerja downstream.⁶

Seperti dibahas di Bab 1, language modeling telah ada selama beberapa dekade, dipopulerkan oleh Claude Shannon dalam makalahnya tahun 1951 "Prediction and Entropy of Printed English". Metrik yang digunakan untuk memandu pengembangan language model tidak banyak berubah sejak saat itu. Sebagian besar language model autoregresif dilatih menggunakan cross entropy atau kerabatnya, perplexity. Ketika membaca makalah dan laporan model, Anda mungkin juga menemukan bits-per-character (BPC) dan bits-per-byte (BPB); keduanya adalah variasi dari cross entropy.

Keempat metrik — cross entropy, perplexity, BPC, dan BPB — terkait erat. Jika Anda mengetahui nilai salah satunya, Anda dapat menghitung tiga lainnya, diberikan informasi yang diperlukan. Meskipun saya menyebutnya sebagai metrik language modeling, metrik ini dapat digunakan untuk model apa pun yang menghasilkan urutan token, termasuk token non-teks.

Ingat bahwa language model mengkodekan informasi statistik (seberapa mungkin sebuah token muncul dalam konteks tertentu) tentang bahasa. Secara statistik, diberikan konteks "Saya suka minum __", kata berikutnya lebih mungkin adalah "teh" daripada "arang". Semakin banyak informasi statistik yang dapat ditangkap model, semakin baik model dalam memprediksi token berikutnya.

Dalam istilah ML, language model mempelajari distribusi data pelatihannya. Semakin baik model ini belajar, semakin baik ia dalam memprediksi apa yang akan muncul berikutnya dalam data pelatihan, dan semakin rendah cross entropy pelatihannya. Seperti model ML lainnya, Anda peduli dengan kinerjanya tidak hanya pada data pelatihan tetapi juga pada data produksi Anda. Secara umum, semakin dekat data Anda dengan data pelatihan model, semakin baik model dapat berkinerja pada data Anda.

Dibandingkan dengan sisa buku, bagian ini berat secara matematis. Jika Anda merasa bingung, silakan lewati bagian matematika dan fokus pada diskusi tentang bagaimana menafsirkan metrik ini. Bahkan jika Anda tidak melatih atau melakukan finetuning language model, memahami metrik ini dapat membantu dengan mengevaluasi model mana yang akan digunakan untuk aplikasi Anda. Metrik ini kadang-kadang dapat digunakan untuk teknik evaluasi dan deduplikasi data tertentu, seperti yang dibahas di seluruh buku ini.

⁶ Meskipun ada korelasi yang kuat, kinerja language modeling tidak sepenuhnya menjelaskan kinerja downstream. Ini adalah area penelitian yang aktif.

### Entropi

Entropi mengukur berapa banyak informasi, rata-rata, yang dibawa oleh sebuah token. Semakin tinggi entropi, semakin banyak informasi yang dibawa setiap token, dan semakin banyak bit yang diperlukan untuk mewakili sebuah token.⁷

Mari gunakan contoh sederhana untuk mengilustrasikan ini. Bayangkan Anda ingin membuat bahasa untuk menggambarkan posisi dalam sebuah kotak. Jika bahasa Anda hanya memiliki dua token, setiap token dapat memberi tahu Anda apakah posisinya di atas atau di bawah. Karena hanya ada dua token, satu bit cukup untuk mewakilinya. Entropi bahasa ini, oleh karena itu, adalah 1.

Jika bahasa Anda memiliki empat token, setiap token dapat memberi Anda posisi yang lebih spesifik: kiri-atas, kanan-atas, kiri-bawah, atau kanan-bawah. Namun, karena sekarang ada empat token, Anda memerlukan dua bit untuk mewakilinya. Entropi bahasa ini adalah 2. Bahasa ini memiliki entropi yang lebih tinggi, karena setiap token membawa lebih banyak informasi, tetapi setiap token membutuhkan lebih banyak bit untuk diwakili.

Secara intuitif, entropi mengukur seberapa sulit untuk memprediksi apa yang akan muncul berikutnya dalam suatu bahasa. Semakin rendah entropi suatu bahasa (semakin sedikit informasi yang dibawa oleh sebuah token bahasa), semakin dapat diprediksi bahasa tersebut. Dalam contoh kita sebelumnya, bahasa dengan hanya dua token lebih mudah diprediksi daripada bahasa dengan empat token (Anda harus memprediksi di antara hanya dua kemungkinan token dibandingkan dengan empat). Ini mirip dengan bagaimana, jika Anda dapat dengan sempurna memprediksi apa yang akan saya katakan selanjutnya, apa yang saya katakan tidak membawa informasi baru.

⁷ Seperti dibahas di Bab 1, sebuah token bisa berupa karakter, kata, atau bagian dari kata. Ketika Claude Shannon memperkenalkan entropi pada tahun 1951, token yang ia kerjakan adalah karakter. Berikut entropi dalam kata-katanya sendiri: "Entropi adalah parameter statistik yang mengukur, dalam arti tertentu, berapa banyak informasi yang diproduksi rata-rata untuk setiap huruf dari teks dalam bahasa tersebut. Jika bahasa diterjemahkan ke dalam digit biner (0 atau 1) dengan cara yang paling efisien, entropi adalah jumlah rata-rata digit biner yang diperlukan per huruf dari bahasa aslinya."

### Cross Entropy

Ketika Anda melatih language model pada dataset, tujuan Anda adalah membuat model mempelajari distribusi data pelatihan ini. Dengan kata lain, tujuan Anda adalah membuat model memprediksi apa yang akan muncul berikutnya dalam data pelatihan. Cross entropy language model pada suatu dataset mengukur seberapa sulit bagi language model untuk memprediksi apa yang akan muncul berikutnya dalam dataset ini.

Cross entropy model pada data pelatihan tergantung pada dua kualitas:

1. Prediktabilitas data pelatihan, diukur dengan entropi data pelatihan
2. Seberapa jauh distribusi yang ditangkap oleh language model menyimpang dari distribusi sebenarnya dari data pelatihan

Entropi dan cross entropy berbagi notasi matematika yang sama, H. Misalkan P adalah distribusi sebenarnya dari data pelatihan, dan Q adalah distribusi yang dipelajari oleh language model. Dengan demikian, berikut ini benar:

- Entropi data pelatihan adalah, oleh karena itu, H(P).
- Divergensi Q terhadap P dapat diukur menggunakan divergensi Kullback–Leibler (KL), yang secara matematis direpresentasikan sebagai DKL(P || Q).
- Cross entropy model terhadap data pelatihan adalah: H(P, Q) = H(P) + DKL(P || Q).

Cross entropy tidak simetris. Cross entropy Q terhadap P — H(P, Q) — berbeda dari cross entropy P terhadap Q — H(Q, P).

Language model dilatih untuk meminimalkan cross entropy-nya terhadap data pelatihan. Jika language model belajar dengan sempurna dari data pelatihannya, cross entropy model akan persis sama dengan entropi data pelatihan. Divergensi KL dari Q terhadap P kemudian akan menjadi 0. Anda dapat menganggap cross entropy model sebagai perkiraan entropi data pelatihannya.

### Bits-per-Character dan Bits-per-Byte

Salah satu unit entropi dan cross entropy adalah bit. Jika cross entropy language model adalah 6 bit, language model ini membutuhkan 6 bit untuk mewakili setiap token.

Karena model yang berbeda memiliki metode tokenisasi yang berbeda — misalnya, satu model menggunakan kata sebagai token dan model lain menggunakan karakter sebagai token — jumlah bit per token tidak dapat dibandingkan antar model. Beberapa menggunakan jumlah bits-per-character (BPC) sebagai gantinya. Jika jumlah bit per token adalah 6 dan rata-rata, setiap token terdiri dari 2 karakter, BPC adalah 6/2 = 3.

Satu komplikasi dengan BPC muncul dari skema pengkodean karakter yang berbeda. Misalnya, dengan ASCII, setiap karakter dikodekan menggunakan 7 bit, tetapi dengan UTF-8, sebuah karakter dapat dikodekan menggunakan antara 8 dan 32 bit. Metrik yang lebih terstandarisasi adalah bits-per-byte (BPB), jumlah bit yang dibutuhkan language model untuk mewakili satu byte dari data pelatihan asli. Jika BPC adalah 3 dan setiap karakter adalah 7 bit, atau ⅞ dari byte, maka BPB adalah 3 / (⅞) = 3.43.

Cross entropy memberi tahu kita seberapa efisien language model dalam mengompresi teks. Jika BPB language model adalah 3.43, artinya ia dapat mewakili setiap byte asli (8 bit) menggunakan 3.43 bit, language model ini dapat mengompresi teks pelatihan asli menjadi kurang dari setengah ukuran asli teks.

### Perplexity

Perplexity adalah eksponensial dari entropi dan cross entropy. Perplexity sering disingkat menjadi PPL. Diberikan dataset dengan distribusi sebenarnya P, perplexity-nya didefinisikan sebagai:

PPL(P) = 2^H(P)

Perplexity language model (dengan distribusi yang dipelajari Q) pada dataset ini didefinisikan sebagai:

PPL(P, Q) = 2^H(P,Q)

Jika cross entropy mengukur seberapa sulit bagi model untuk memprediksi token berikutnya, perplexity mengukur jumlah ketidakpastian yang dimilikinya ketika memprediksi token berikutnya. Ketidakpastian yang lebih tinggi berarti ada lebih banyak opsi yang mungkin untuk token berikutnya.

Pertimbangkan language model yang dilatih untuk mengkodekan 4 token posisi dengan sempurna. Cross entropy language model ini adalah 2 bit. Jika language model ini mencoba memprediksi posisi dalam kotak, ia harus memilih di antara 2^2 = 4 kemungkinan opsi. Dengan demikian, language model ini memiliki perplexity 4.

Sejauh ini, saya telah menggunakan bit sebagai unit untuk entropi dan cross entropy. Setiap bit dapat mewakili 2 nilai unik, maka basis 2 dalam persamaan perplexity sebelumnya. Framework ML populer, termasuk TensorFlow dan PyTorch, menggunakan nat (log natural) sebagai unit untuk entropi dan cross entropy. Nat menggunakan basis e, basis logaritma natural.⁸ Jika Anda menggunakan nat sebagai unit, perplexity adalah eksponensial dari e:

PPL(P, Q) = e^H(P,Q)

Karena kebingungan seputar bit dan nat, banyak orang melaporkan perplexity, alih-alih cross entropy, ketika melaporkan kinerja language model mereka.

⁸ Salah satu alasan banyak orang mungkin lebih memilih log natural daripada log basis 2 adalah karena log natural memiliki sifat tertentu yang membuat perhitungan matematisnya lebih mudah. Misalnya, turunan dari ln(x) adalah 1/x.

### Interpretasi dan Kasus Penggunaan Perplexity

Seperti dibahas, cross entropy, perplexity, BPC, dan BPB adalah variasi dari pengukuran akurasi prediktif language model. Semakin akurat model dapat memprediksi sebuah teks, semakin rendah metrik ini. Dalam buku ini, saya akan menggunakan perplexity sebagai metrik language modeling default. Ingat bahwa semakin banyak ketidakpastian model dalam memprediksi apa yang akan muncul berikutnya dalam dataset tertentu, semakin tinggi perplexity-nya.

Apa yang dianggap sebagai nilai yang baik untuk perplexity tergantung pada data itu sendiri dan bagaimana tepatnya perplexity dihitung, seperti berapa banyak token sebelumnya yang dapat diakses model. Berikut adalah beberapa aturan umum:

**Data yang lebih terstruktur memberikan perplexity yang diharapkan lebih rendah**
Data yang lebih terstruktur lebih dapat diprediksi. Misalnya, kode HTML lebih dapat diprediksi daripada teks sehari-hari. Jika Anda melihat tag HTML pembuka seperti `<head>`, Anda dapat memprediksi bahwa harus ada tag penutup, `</head>`, di dekatnya. Oleh karena itu, perplexity yang diharapkan dari sebuah model pada kode HTML harus lebih rendah daripada perplexity yang diharapkan dari sebuah model pada teks sehari-hari.

**Semakin besar vocabulary, semakin tinggi perplexity**
Secara intuitif, semakin banyak kemungkinan token, semakin sulit bagi model untuk memprediksi token berikutnya. Misalnya, perplexity model pada buku anak-anak kemungkinan akan lebih rendah daripada perplexity model yang sama pada War and Peace. Untuk dataset yang sama, katakanlah dalam bahasa Inggris, perplexity berbasis karakter (memprediksi karakter berikutnya) akan lebih rendah daripada perplexity berbasis kata (memprediksi kata berikutnya), karena jumlah karakter yang mungkin lebih kecil daripada jumlah kata yang mungkin.

**Semakin panjang context length, semakin rendah perplexity**
Semakin banyak konteks yang dimiliki model, semakin sedikit ketidakpastian yang akan dimilikinya dalam memprediksi token berikutnya. Pada tahun 1951, Claude Shannon mengevaluasi cross entropy modelnya dengan menggunakannya untuk memprediksi token berikutnya yang dikondisikan pada hingga 10 token sebelumnya. Pada saat penulisan ini, perplexity model biasanya dapat dihitung dan dikondisikan pada antara 500 dan 10.000 token sebelumnya, dan mungkin lebih, dibatasi oleh panjang konteks maksimum model.

Sebagai referensi, tidak jarang melihat nilai perplexity serendah 3 atau bahkan lebih rendah. Jika semua token dalam bahasa hipotetis memiliki peluang yang sama untuk terjadi, perplexity 3 berarti bahwa model ini memiliki peluang 1 banding 3 untuk memprediksi token berikutnya dengan benar. Mengingat bahwa vocabulary model berada dalam urutan puluhan ribu dan ratusan ribu, peluang ini luar biasa.

Selain memandu pelatihan language model, perplexity berguna di banyak bagian alur kerja AI engineering. Pertama, perplexity adalah proxy yang baik untuk kemampuan model. Jika model buruk dalam memprediksi token berikutnya, kinerjanya pada tugas downstream kemungkinan juga akan buruk. Laporan GPT-2 OpenAI menunjukkan bahwa model yang lebih besar, yang juga merupakan model yang lebih kuat, secara konsisten memberikan perplexity yang lebih rendah pada berbagai dataset.

Sayangnya, mengikuti tren perusahaan yang semakin merahasiakan model mereka, banyak yang berhenti melaporkan perplexity model mereka.

Perplexity mungkin bukan proxy yang baik untuk mengevaluasi model yang telah melalui post-training menggunakan teknik seperti SFT dan RLHF.⁹ Post-training adalah tentang mengajar model bagaimana menyelesaikan tugas. Saat model menjadi lebih baik dalam menyelesaikan tugas, model mungkin menjadi lebih buruk dalam memprediksi token berikutnya. Perplexity language model biasanya meningkat setelah post-training. Beberapa orang mengatakan bahwa post-training memampatkan entropi. Demikian pula, kuantisasi — teknik yang mengurangi presisi numerik model dan, dengan itu, jejak memorinya — juga dapat mengubah perplexity model dengan cara yang tidak terduga.¹⁰

Ingat bahwa perplexity model terhadap sebuah teks mengukur seberapa sulit bagi model ini untuk memprediksi teks ini. Untuk model tertentu, perplexity paling rendah untuk teks yang telah dilihat dan dihafal model selama pelatihan. Oleh karena itu, perplexity dapat digunakan untuk mendeteksi apakah sebuah teks ada dalam data pelatihan model. Ini berguna untuk mendeteksi kontaminasi data — jika perplexity model pada data benchmark rendah, benchmark ini kemungkinan termasuk dalam data pelatihan model, membuat kinerja model pada benchmark ini kurang dapat dipercaya. Ini juga dapat digunakan untuk deduplikasi data pelatihan: misalnya, tambahkan data baru ke dataset pelatihan yang ada hanya jika perplexity data baru tinggi.

Perplexity paling tinggi untuk teks yang tidak dapat diprediksi, seperti teks yang mengekspresikan ide-ide yang tidak biasa (seperti "anjing saya mengajar fisika kuantum di waktu luangnya") atau omong kosong (seperti "rumah kucing pergi mata"). Oleh karena itu, perplexity dapat digunakan untuk mendeteksi teks abnormal.

Perplexity dan metrik terkaitnya membantu kita memahami kinerja language model yang mendasarinya, yang merupakan proxy untuk memahami kinerja model pada tugas downstream. Sisa bab ini membahas bagaimana mengukur kinerja model pada tugas downstream secara langsung.

⁹ Jika Anda tidak yakin apa itu SFT (supervised finetuning) dan RLHF (reinforcement learning from human feedback), lihat kembali Bab 2.
¹⁰ Kuantisasi dibahas di Bab 7.

### Cara Menggunakan Language Model untuk Menghitung Perplexity Teks

Perplexity model terhadap sebuah teks mengukur seberapa sulit bagi model untuk memprediksi teks tersebut. Diberikan language model X, dan urutan token x1, x2, ..., xn, perplexity X untuk urutan ini adalah:

PPL = (∏_{i=1}^{n} 1/P(xi | x1, ..., xi-1))^(1/n)

di mana P(xi | x1, ..., xi-1) menunjukkan probabilitas yang diberikan X kepada token xi diberikan token sebelumnya x1, ..., xi-1.

Untuk menghitung perplexity, Anda memerlukan akses ke probabilitas (atau logprobs) yang diberikan language model kepada setiap token berikutnya. Sayangnya, tidak semua model komersial mengekspos logprobs model mereka, seperti dibahas di Bab 2.

## Evaluasi Eksak

Ketika mengevaluasi kinerja model, penting untuk membedakan antara evaluasi eksak dan subjektif. Evaluasi eksak menghasilkan penilaian tanpa ambiguitas. Misalnya, jika jawaban untuk pertanyaan pilihan ganda adalah A dan Anda memilih B, jawaban Anda salah. Tidak ada ambiguitas tentang itu. Di sisi lain, penilaian esai bersifat subjektif. Skor esai tergantung pada siapa yang menilai esai. Orang yang sama, jika ditanya dua kali dengan jarak waktu tertentu, dapat memberikan skor yang berbeda untuk esai yang sama. Penilaian esai bisa menjadi lebih eksak dengan pedoman penilaian yang jelas. Seperti yang akan Anda lihat di bagian selanjutnya, AI sebagai juri bersifat subjektif. Hasil evaluasi dapat berubah berdasarkan model juri dan prompt.

Saya akan membahas dua pendekatan evaluasi yang menghasilkan skor eksak: kebenaran fungsional dan pengukuran kesamaan terhadap data referensi. Perhatikan bahwa bagian ini berfokus pada mengevaluasi respons open-ended (generasi teks arbitrer) sebagai lawan dari respons close-ended (seperti klasifikasi). Ini bukan karena foundation model tidak digunakan untuk tugas close-ended. Faktanya, banyak sistem foundation model memiliki setidaknya satu komponen klasifikasi, biasanya untuk klasifikasi intensi atau penilaian. Bagian ini berfokus pada evaluasi open-ended karena evaluasi close-ended sudah dipahami dengan baik.

### Kebenaran Fungsional

Evaluasi kebenaran fungsional berarti mengevaluasi sistem berdasarkan apakah ia melakukan fungsionalitas yang dimaksudkan. Misalnya, jika Anda meminta model untuk membuat situs web, apakah situs web yang dihasilkan memenuhi persyaratan Anda? Jika Anda meminta model untuk membuat reservasi di restoran tertentu, apakah model berhasil?

Kebenaran fungsional adalah metrik utama untuk mengevaluasi kinerja aplikasi apa pun, karena ia mengukur apakah aplikasi Anda melakukan apa yang dimaksudkan. Namun, kebenaran fungsional tidak selalu mudah diukur, dan pengukurannya tidak dapat dengan mudah diotomatiskan.

Pembuatan kode adalah contoh tugas di mana pengukuran kebenaran fungsional dapat diotomatiskan. Kebenaran fungsional dalam pengkodean kadang-kadang disebut execution accuracy. Misalkan Anda meminta model untuk menulis fungsi Python, gcd(num1, num2), untuk menemukan pembagi persekutuan terbesar (gcd) dari dua angka, num1 dan num2. Kode yang dihasilkan kemudian dapat dimasukkan ke interpreter Python untuk memeriksa apakah kode tersebut valid dan jika ya, apakah ia mengeluarkan hasil yang benar dari pasangan tertentu (num1, num2). Misalnya, diberikan pasangan (num1=15, num2=20), jika fungsi gcd(15, 20) tidak mengembalikan 5, jawaban yang benar, Anda tahu bahwa fungsinya salah.

Jauh sebelum AI digunakan untuk menulis kode, verifikasi otomatis kebenaran fungsional kode adalah praktik standar dalam rekayasa perangkat lunak. Kode biasanya divalidasi dengan unit test di mana kode dijalankan dalam skenario yang berbeda untuk memastikan bahwa ia menghasilkan output yang diharapkan. Evaluasi kebenaran fungsional adalah bagaimana platform coding seperti LeetCode dan HackerRank memvalidasi solusi yang dikirimkan.

Benchmark populer untuk mengevaluasi kemampuan pembuatan kode AI, seperti HumanEval OpenAI dan MBPP (Mostly Basic Python Problems Dataset) Google, menggunakan kebenaran fungsional sebagai metrik mereka. Benchmark untuk text-to-SQL (menghasilkan kueri SQL dari bahasa alami) seperti Spider (Yu et al., 2018), BIRD-SQL (Li et al., 2023), dan WikiSQL (Zhong et al., 2017) juga mengandalkan kebenaran fungsional.

Sebuah masalah benchmark dilengkapi dengan serangkaian test case. Setiap test case terdiri dari skenario di mana kode harus dijalankan dan output yang diharapkan untuk skenario tersebut.

Ketika mengevaluasi model, untuk setiap masalah sejumlah sampel kode, dilambangkan sebagai k, dihasilkan. Model memecahkan masalah jika salah satu dari k sampel kode yang dihasilkan lulus semua test case masalah tersebut. Skor akhir, yang disebut pass@k, adalah fraksi dari masalah yang terpecahkan dari semua masalah. Jika ada 10 masalah dan model memecahkan 5 dengan k = 3, maka pass@3 model adalah 50%. Semakin banyak sampel kode yang dihasilkan model, semakin besar peluang model untuk memecahkan setiap masalah, maka semakin besar skor akhirnya. Ini berarti bahwa dalam ekspektasi, skor pass@1 harus lebih rendah dari pass@3, yang, pada gilirannya, harus lebih rendah dari pass@10.

Kategori tugas lain yang kebenaran fungsionalnya dapat dievaluasi secara otomatis adalah game bot. Jika Anda membuat bot untuk bermain Tetris, Anda dapat mengetahui seberapa baik bot itu dengan skor yang didapatnya. Tugas dengan tujuan yang terukur biasanya dapat dievaluasi menggunakan kebenaran fungsional. Misalnya, jika Anda meminta AI untuk menjadwalkan beban kerja Anda untuk mengoptimalkan konsumsi energi, kinerja AI dapat diukur dengan berapa banyak energi yang dihemat.¹¹

¹¹ Tantangannya adalah bahwa sementara banyak tugas kompleks memiliki tujuan yang terukur, AI belum cukup baik untuk melakukan tugas kompleks secara end-to-end, sehingga AI mungkin digunakan untuk melakukan bagian dari solusi. Terkadang, mengevaluasi bagian dari solusi lebih sulit daripada mengevaluasi hasil akhirnya. Bayangkan Anda ingin mengevaluasi kemampuan seseorang bermain catur. Lebih mudah untuk mengevaluasi hasil akhir permainan (menang/kalah/seri) daripada mengevaluasi hanya satu langkah.

### Pengukuran Kesamaan Terhadap Data Referensi

Jika tugas yang Anda pedulikan tidak dapat dievaluasi secara otomatis menggunakan kebenaran fungsional, salah satu pendekatan umum adalah mengevaluasi output AI terhadap data referensi. Misalnya, jika Anda meminta model untuk menerjemahkan kalimat dari bahasa Prancis ke bahasa Inggris, Anda dapat mengevaluasi terjemahan bahasa Inggris yang dihasilkan terhadap terjemahan bahasa Inggris yang benar.

Setiap contoh dalam data referensi mengikuti format (input, respons referensi). Sebuah input dapat memiliki beberapa respons referensi, seperti beberapa kemungkinan terjemahan bahasa Inggris dari kalimat Prancis. Respons referensi juga disebut ground truth atau respons kanonik. Metrik yang memerlukan referensi disebut reference-based, dan metrik yang tidak memerlukannya disebut reference-free.

Karena pendekatan evaluasi ini memerlukan data referensi, ia dibatasi oleh seberapa banyak dan seberapa cepat data referensi dapat dihasilkan. Data referensi dihasilkan biasanya oleh manusia dan semakin sering oleh AI. Menggunakan data yang dihasilkan manusia sebagai referensi berarti bahwa kita memperlakukan kinerja manusia sebagai standar emas, dan kinerja AI diukur terhadap kinerja manusia. Data yang dihasilkan manusia bisa mahal dan memakan waktu untuk dihasilkan, menyebabkan banyak orang menggunakan AI untuk menghasilkan data referensi sebagai gantinya. Data yang dihasilkan AI mungkin masih memerlukan tinjauan manusia, tetapi tenaga kerja yang diperlukan untuk meninjaunya jauh lebih sedikit daripada tenaga kerja yang diperlukan untuk menghasilkan data referensi dari awal.

Respons yang dihasilkan yang lebih mirip dengan respons referensi dianggap lebih baik. Ada empat cara untuk mengukur kesamaan antara dua teks open-ended:

1. Meminta evaluator untuk membuat penilaian apakah dua teks itu sama
2. Exact match: apakah respons yang dihasilkan cocok dengan salah satu respons referensi secara persis
3. Kesamaan leksikal: seberapa mirip respons yang dihasilkan dengan respons referensi
4. Kesamaan semantik: seberapa dekat respons yang dihasilkan dengan respons referensi dalam makna (semantik)

Dua respons dapat dibandingkan oleh evaluator manusia atau evaluator AI. Evaluator AI semakin umum dan akan menjadi fokus bagian selanjutnya.

Bagian ini berfokus pada metrik yang dirancang secara manual: exact match, kesamaan leksikal, dan kesamaan semantik. Skor dengan pencocokan eksak bersifat biner (cocok atau tidak), sedangkan dua skor lainnya berada pada skala geser (seperti antara 0 dan 1 atau antara -1 dan 1).

Meskipun kemudahan penggunaan dan fleksibilitas pendekatan AI sebagai juri, pengukuran kesamaan yang dirancang secara manual masih banyak digunakan dalam industri karena sifatnya yang eksak.

Bagian ini membahas bagaimana Anda dapat menggunakan pengukuran kesamaan untuk mengevaluasi kualitas output yang dihasilkan. Namun, Anda juga dapat menggunakan pengukuran kesamaan untuk banyak kasus penggunaan lain, termasuk namun tidak terbatas pada:

- **Retrieval dan pencarian**: temukan item yang mirip dengan kueri
- **Peringkat**: peringkat item berdasarkan seberapa mirip mereka dengan kueri
- **Pengelompokan (clustering)**: kelompokkan item berdasarkan seberapa mirip mereka satu sama lain
- **Deteksi anomali**: deteksi item yang paling tidak mirip dengan yang lain
- **Deduplikasi data**: hapus item yang terlalu mirip dengan item lain

Teknik yang dibahas di bagian ini akan muncul lagi di seluruh buku.

#### Exact Match

Ini dianggap exact match jika respons yang dihasilkan cocok dengan salah satu respons referensi secara persis. Exact matching bekerja untuk tugas yang mengharapkan respons pendek dan eksak seperti masalah matematika sederhana, kueri pengetahuan umum, dan pertanyaan bergaya trivia. Berikut adalah contoh input yang memiliki respons pendek dan eksak:

- "Berapa 2 + 3?"
- "Siapa wanita pertama yang memenangkan Nobel?"
- "Berapa saldo akun saya saat ini?"
- "Isi bagian yang kosong: Paris ke Perancis seperti ___ ke Inggris."

Ada variasi dalam pencocokan yang mempertimbangkan masalah pemformatan. Satu variasi adalah menerima output apa pun yang mengandung respons referensi sebagai kecocokan. Pertimbangkan pertanyaan "Berapa 2 + 3?" Respons referensinya adalah "5". Variasi ini menerima semua output yang mengandung "5", termasuk "Jawabannya adalah 5" dan "2 + 3 adalah 5".

Namun, variasi ini terkadang dapat menyebabkan solusi yang salah diterima. Pertimbangkan pertanyaan "Tahun berapa Anne Frank lahir?" Anne Frank lahir pada 12 Juni 1929, jadi respons yang benar adalah 1929. Jika model mengeluarkan "12 September 1929", tahun yang benar termasuk dalam output, tetapi outputnya secara faktual salah.

Di luar tugas sederhana, exact match jarang berhasil. Diberikan kalimat asli Prancis "Comment ça va?", ada beberapa kemungkinan terjemahan bahasa Inggris, seperti "How are you?", "How is everything?", dan "How are you doing?" Jika data referensi hanya berisi tiga terjemahan ini dan model menghasilkan "How is it going?", respons model akan ditandai sebagai salah. Semakin panjang dan kompleks teks asli, semakin banyak kemungkinan terjemahan yang ada. Tidak mungkin untuk membuat set respons yang mungkin lengkap untuk sebuah input. Untuk tugas kompleks, kesamaan leksikal dan kesamaan semantik bekerja lebih baik.

#### Kesamaan Leksikal

Kesamaan leksikal mengukur seberapa besar dua teks tumpang tindih. Anda dapat melakukannya dengan terlebih dahulu memecah setiap teks menjadi token yang lebih kecil.

Dalam bentuknya yang paling sederhana, kesamaan leksikal dapat diukur dengan menghitung berapa banyak token yang dimiliki dua teks secara bersama. Sebagai contoh, pertimbangkan respons referensi "Kucingku menakuti tikus" dan dua respons yang dihasilkan:

- "Kucingku memakan tikus"
- "Kucing dan tikus bertengkar sepanjang waktu"

Asumsikan bahwa setiap token adalah sebuah kata. Jika Anda menghitung tumpang tindih kata individual saja, respons A mengandung 4 dari 5 kata dalam respons referensi (skor kesamaan 80%), sedangkan respons B hanya mengandung 3 dari 5 (skor kesamaan 60%). Respons A, oleh karena itu, dianggap lebih mirip dengan respons referensi.

Salah satu cara untuk mengukur kesamaan leksikal adalah approximate string matching, yang dikenal secara informal sebagai fuzzy matching. Ia mengukur kesamaan antara dua teks dengan menghitung berapa banyak suntingan yang diperlukan untuk mengonversi dari satu teks ke teks lain, sebuah angka yang disebut edit distance. Tiga operasi suntingan yang biasa adalah:

1. **Penghapusan**: "brad" -> "bad"
2. **Penyisipan**: "bad" -> "bard"
3. **Substitusi**: "bad" -> "bed"

Beberapa fuzzy matcher juga memperlakukan transposisi, menukar dua huruf (misalnya, "mats" -> "mast"), sebagai satu suntingan. Namun, beberapa fuzzy matcher memperlakukan setiap transposisi sebagai dua operasi suntingan: satu penghapusan dan satu penyisipan.

Misalnya, "bad" adalah satu suntingan ke "bard" dan tiga suntingan ke "cash", jadi "bad" dianggap lebih mirip dengan "bard" daripada dengan "cash".

Cara lain untuk mengukur kesamaan leksikal adalah kesamaan n-gram, diukur berdasarkan tumpang tindih urutan token, n-gram, bukan token tunggal. 1-gram (unigram) adalah sebuah token. 2-gram (bigram) adalah satu set dua token. "Kucingku menakuti tikus" terdiri dari empat bigram: "kucingku menakuti", "menakuti tikus", "tikus".

Metrik umum untuk kesamaan leksikal adalah BLEU, ROUGE, METEOR++, TER, dan CIDEr. Mereka berbeda dalam bagaimana tepatnya tumpang tindih dihitung. Sebelum foundation model, BLEU, ROUGE, dan kerabatnya adalah umum, terutama untuk tugas penerjemahan. Sejak kebangkitan foundation model, lebih sedikit benchmark yang menggunakan kesamaan leksikal. Contoh benchmark yang menggunakan metrik ini adalah WMT, COCO Captions, dan GEMv2.

Kekurangan dari metode ini adalah memerlukan penyusunan set respons referensi yang komprehensif. Respons yang baik bisa mendapatkan skor kesamaan yang rendah jika set referensi tidak mengandung respons yang mirip dengannya. Pada beberapa contoh benchmark, Adept menemukan bahwa modelnya, Fuyu, berkinerja buruk bukan karena output model salah, tetapi karena beberapa jawaban yang benar hilang dalam data referensi.

Tidak hanya itu, referensi bisa salah. Misalnya, penyelenggara tugas bersama WMT 2023 Metrics, yang berfokus pada pemeriksaan metrik evaluasi untuk terjemahan mesin, melaporkan bahwa mereka menemukan banyak terjemahan referensi yang buruk dalam data mereka. Data referensi berkualitas rendah adalah salah satu alasan bahwa metrik reference-free adalah pesaing kuat untuk metrik reference-based dalam hal korelasi dengan penilaian manusia (Freitag et al., 2023).

Kekurangan lain dari pengukuran ini adalah bahwa skor kesamaan leksikal yang lebih tinggi tidak selalu berarti respons yang lebih baik. Misalnya, pada HumanEval, benchmark pembuatan kode, OpenAI menemukan bahwa skor BLEU untuk solusi yang salah dan benar serupa. Ini menunjukkan bahwa mengoptimalkan skor BLEU tidak sama dengan mengoptimalkan kebenaran fungsional (Chen et al., 2021).

#### Kesamaan Semantik

Kesamaan leksikal mengukur apakah dua teks terlihat mirip, bukan apakah mereka memiliki makna yang sama. Pertimbangkan dua kalimat "What's up?" dan "How are you?" Secara leksikal, mereka berbeda — ada sedikit tumpang tindih dalam kata dan huruf yang mereka gunakan. Namun, secara semantik, mereka dekat. Sebaliknya, teks yang terlihat mirip dapat berarti hal yang sangat berbeda. "Let's eat, grandma" dan "Let's eat grandma" berarti dua hal yang sama sekali berbeda.

Kesamaan semantik bertujuan untuk menghitung kesamaan dalam semantik. Ini pertama-tama memerlukan transformasi teks menjadi representasi numerik, yang disebut embedding. Misalnya, kalimat "the cat sits on a mat" mungkin direpresentasikan menggunakan embedding yang terlihat seperti ini: [0.11, 0.02, 0.54]. Kesamaan semantik, oleh karena itu, juga disebut embedding similarity.

"Pengantar Embedding" di halaman 158 membahas bagaimana embedding bekerja. Untuk saat ini, mari kita asumsikan bahwa Anda memiliki cara untuk mengubah teks menjadi embedding. Kesamaan antara dua embedding dapat dihitung menggunakan metrik seperti cosine similarity. Dua embedding yang persis sama memiliki skor kesamaan 1. Dua embedding yang berlawanan memiliki skor kesamaan -1.

Saya menggunakan contoh teks, tetapi kesamaan semantik dapat dihitung untuk embedding dari modalitas data apa pun, termasuk gambar dan audio. Kesamaan semantik untuk teks kadang-kadang disebut semantic textual similarity.

Meskipun saya menempatkan kesamaan semantik dalam kategori evaluasi eksak, itu bisa dianggap subjektif, karena algoritma embedding yang berbeda dapat menghasilkan embedding yang berbeda. Namun, diberikan dua embedding, skor kesamaan di antara mereka dihitung secara eksak.

Secara matematis, misalkan A adalah embedding dari respons yang dihasilkan, dan B adalah embedding dari respons referensi. Cosine similarity antara A dan B dihitung sebagai (A · B) / (||A|| ||B||), dengan:

- A · B adalah dot product dari A dan B
- ||A|| adalah norma Euclidean (juga dikenal sebagai norma L2) dari A

Metrik untuk semantic textual similarity termasuk BERTScore (embedding dihasilkan oleh BERT) dan MoverScore (embedding dihasilkan oleh campuran algoritma).

Kesamaan tekstual semantik tidak memerlukan set respons referensi yang komprehensif seperti kesamaan leksikal. Namun, keandalan kesamaan semantik tergantung pada kualitas algoritma embedding yang mendasarinya. Dua teks dengan makna yang sama masih dapat memiliki skor kesamaan semantik yang rendah jika embedding mereka buruk.

Kekurangan lain dari pengukuran ini adalah bahwa algoritma embedding yang mendasarinya mungkin memerlukan komputasi dan waktu yang tidak sepele untuk dijalankan.

Sebelum kita beralih ke pembahasan AI sebagai juri, mari kita bahas pengantar singkat tentang embedding. Konsep embedding terletak di jantung kesamaan semantik, dan merupakan tulang punggung dari banyak topik yang kita jelajahi di seluruh buku, termasuk pencarian vektor di Bab 6 dan deduplikasi data di Bab 8.

### Pengantar Embedding

Karena komputer bekerja dengan angka, model perlu mengonversi inputnya menjadi representasi numerik yang dapat diproses komputer. Embedding adalah representasi numerik yang bertujuan untuk menangkap makna dari data asli.

Embedding adalah vektor. Misalnya, kalimat "the cat sits on a mat" mungkin direpresentasikan menggunakan vektor embedding yang terlihat seperti ini: [0.11, 0.02, 0.54]. Di sini, saya menggunakan vektor kecil sebagai contoh. Pada kenyataannya, ukuran vektor embedding (jumlah elemen dalam vektor embedding) biasanya antara 100 dan 10.000.¹³

Model yang dilatih khusus untuk menghasilkan embedding termasuk model open source BERT, CLIP (Contrastive Language–Image Pre-training), dan Sentence Transformers. Ada juga model embedding proprietary yang disediakan sebagai API.¹⁴

Tabel 3-2 menunjukkan ukuran embedding dari beberapa model populer.

| Model | Ukuran Embedding |
|-------|-----------------|
| BERT Google | BERT base: 768, BERT large: 1024 |
| CLIP OpenAI | Gambar: 512, Teks: 512 |
| OpenAI Embeddings API | text-embedding-3-small: 1536, text-embedding-3-large: 3072 |
| Cohere Embed v3 | embed-english-v3.0: 1024, embed-english-light-3.0: 384 |

Karena model biasanya memerlukan input mereka untuk terlebih dahulu diubah menjadi representasi vektor, banyak model ML, termasuk GPT dan Llama, juga melibatkan langkah untuk menghasilkan embedding. "Arsitektur Transformer" di halaman 58 memvisualisasikan lapisan embedding dalam model transformer. Jika Anda memiliki akses ke lapisan perantara dari model ini, Anda dapat menggunakannya untuk mengekstrak embedding. Namun, kualitas embedding ini mungkin tidak sebaik embedding yang dihasilkan oleh model embedding khusus.

Tujuan dari algoritma embedding adalah menghasilkan embedding yang menangkap esensi dari data asli. Bagaimana kita memverifikasinya? Vektor embedding [0.11, 0.02, 0.54] tidak terlihat seperti teks asli "the cat sits on a mat".

Pada tingkat tinggi, algoritma embedding dianggap baik jika teks yang lebih mirip memiliki embedding yang lebih dekat, diukur dengan cosine similarity atau metrik terkait. Embedding dari kalimat "the cat sits on a mat" harus lebih dekat dengan embedding dari "the dog plays on the grass" daripada embedding dari "AI research is super fun".

Anda juga dapat mengevaluasi kualitas embedding berdasarkan kegunaannya untuk tugas Anda. Embedding digunakan dalam banyak tugas, termasuk klasifikasi, topic modeling, sistem rekomendasi, dan RAG. Contoh benchmark yang mengukur kualitas embedding pada banyak tugas adalah MTEB, Massive Text Embedding Benchmark (Muennighoff et al., 2023).

Saya menggunakan teks sebagai contoh, tetapi data apa pun dapat memiliki representasi embedding. Misalnya, solusi ecommerce seperti Criteo dan Coveo memiliki embedding untuk produk. Pinterest memiliki embedding untuk gambar, grafik, kueri, dan bahkan pengguna.

Perbatasan baru adalah menciptakan joint embedding untuk data dari modalitas yang berbeda. CLIP (Radford et al., 2021) adalah salah satu model besar pertama yang dapat memetakan data dari modalitas yang berbeda, teks dan gambar, ke dalam ruang embedding bersama. ULIP (Xue et al., 2022) bertujuan untuk menciptakan representasi terpadu dari teks, gambar, dan point cloud 3D. ImageBind (Girdhar et al., 2023) mempelajari joint embedding di enam modalitas yang berbeda, termasuk teks, gambar, dan audio.

CLIP dilatih menggunakan pasangan (gambar, teks). Teks yang sesuai dengan gambar bisa berupa caption atau komentar yang terkait dengan gambar ini. Untuk setiap pasangan (gambar, teks), CLIP menggunakan encoder teks untuk mengonversi teks menjadi embedding teks, dan encoder gambar untuk mengonversi gambar menjadi embedding gambar. Ia kemudian memproyeksikan kedua embedding ini ke dalam ruang embedding bersama. Tujuan pelatihannya adalah untuk mendapatkan embedding gambar dekat dengan embedding teks yang sesuai dalam ruang bersama ini.

Ruang embedding bersama yang dapat mewakili data dari modalitas yang berbeda adalah ruang embedding multimodal. Dalam ruang embedding bersama teks-gambar, embedding dari gambar seorang pria memancing harus lebih dekat dengan embedding dari teks "seorang nelayan" daripada embedding dari teks "peragaan busana". Ruang embedding bersama ini memungkinkan embedding dari modalitas yang berbeda untuk dibandingkan dan digabungkan. Misalnya, ini memungkinkan pencarian gambar berbasis teks. Diberikan sebuah teks, ini membantu Anda menemukan gambar yang paling dekat dengan teks ini.

¹³ Sementara ruang vektor 10.000 elemen tampak berdimensi tinggi, itu jauh lebih rendah daripada dimensionalitas data mentah. Oleh karena itu, embedding dianggap sebagai representasi data kompleks dalam ruang berdimensi lebih rendah.
¹⁴ Ada juga model yang menghasilkan word embedding, sebagai lawan dari document embedding, seperti word2vec (Mikolov et al., "Efficient Estimation of Word Representations in Vector Space", arXiv, v3, 7 September 2013) dan GloVe (Pennington et al., "GloVe: Global Vectors for Word Representation", Stanford University Natural Language Processing Group (blog), 2014).

## AI sebagai Juri

Tantangan mengevaluasi respons open-ended telah menyebabkan banyak tim beralih ke evaluasi manusia. Karena AI telah berhasil digunakan untuk mengotomatiskan banyak tugas yang menantang, dapatkah AI mengotomatiskan evaluasi juga? Pendekatan menggunakan AI untuk mengevaluasi AI disebut AI sebagai juri atau LLM sebagai juri. Model AI yang digunakan untuk mengevaluasi model AI lain disebut juri AI.¹⁵

Meskipun ide menggunakan AI untuk mengotomatiskan evaluasi telah ada sejak lama,¹⁶ hal itu baru menjadi praktis ketika model AI menjadi mampu melakukannya, yaitu sekitar tahun 2020 dengan dirilisnya GPT-3. Pada saat penulisan ini, AI sebagai juri telah menjadi salah satu metode yang paling, jika bukan yang paling, umum untuk mengevaluasi model AI dalam produksi. Sebagian besar demo startup evaluasi AI yang saya lihat pada tahun 2023 dan 2024 menggunakan AI sebagai juri dalam satu atau lain cara. Laporan State of AI LangChain pada tahun 2023 mencatat bahwa 58% evaluasi pada platform mereka dilakukan oleh juri AI. AI sebagai juri juga merupakan area penelitian yang aktif.

¹⁵ Istilah AI judge tidak boleh disamakan dengan kasus penggunaan di mana AI digunakan sebagai hakim di pengadilan.
¹⁶ Pada tahun 2017, saya mempresentasikan di workshop NeurIPS MEWR (Machine translation Evaluation metric Without Reference text), sebuah metode evaluasi yang memanfaatkan language model yang lebih kuat untuk secara otomatis mengevaluasi terjemahan mesin. Sayangnya, saya tidak pernah melanjutkan jalur penelitian ini karena keadaan.

### Mengapa AI sebagai Juri?

Juri AI cepat, mudah digunakan, dan relatif murah dibandingkan dengan evaluator manusia. Mereka juga dapat bekerja tanpa data referensi, yang berarti mereka dapat digunakan di lingkungan produksi di mana tidak ada data referensi.

Anda dapat meminta model AI untuk menilai output berdasarkan kriteria apa pun: kebenaran, repetitif, toksisitas, kebaikan, halusinasi, dan lainnya. Ini mirip dengan bagaimana Anda dapat meminta seseorang untuk memberikan pendapat mereka tentang apa pun. Anda mungkin berpikir, "Tapi Anda tidak bisa selalu mempercayai pendapat orang." Itu benar, dan Anda juga tidak bisa selalu mempercayai penilaian AI. Namun, karena setiap model AI adalah agregasi dari massa, mungkin bagi model AI untuk membuat penilaian yang mewakili massa. Dengan prompt yang tepat untuk model yang tepat, Anda bisa mendapatkan penilaian yang cukup baik pada berbagai topik.

Studi telah menunjukkan bahwa juri AI tertentu sangat berkorelasi dengan evaluator manusia. Pada tahun 2023, Zheng et al. menemukan bahwa pada benchmark evaluasi mereka, MT-Bench, kesepakatan antara GPT-4 dan manusia mencapai 85%, yang bahkan lebih tinggi dari kesepakatan di antara manusia (81%). Penulis AlpacaEval (Dubois et al., 2023) juga menemukan bahwa juri AI mereka memiliki korelasi hampir sempurna (0.98) dengan leaderboard LMSYS Chat Arena, yang dievaluasi oleh manusia.

Tidak hanya AI dapat mengevaluasi respons, tetapi juga dapat menjelaskan keputusannya, yang bisa sangat berguna ketika Anda ingin mengaudit hasil evaluasi Anda.

Fleksibilitasnya membuat AI sebagai juri berguna untuk berbagai aplikasi, dan untuk beberapa aplikasi, ini adalah satu-satunya opsi evaluasi otomatis. Bahkan ketika penilaian AI tidak sebaik penilaian manusia, mereka mungkin masih cukup baik untuk memandu pengembangan aplikasi dan memberikan kepercayaan yang cukup untuk memulai proyek.

### Cara Menggunakan AI sebagai Juri

Ada banyak cara Anda dapat menggunakan AI untuk membuat penilaian. Misalnya, Anda dapat menggunakan AI untuk mengevaluasi kualitas respons dengan sendirinya, membandingkan respons tersebut dengan data referensi, atau membandingkan respons tersebut dengan respons lain. Berikut adalah contoh prompt naif untuk ketiga pendekatan ini:

1. **Evaluasi kualitas respons dengan sendirinya**, diberikan pertanyaan asli:
   "Given the following question and answer, evaluate how good the answer is for the question. Use the score from 1 to 5. - 1 means very bad. - 5 means very good. Question: [QUESTION] Answer: [ANSWER] Score:"

2. **Bandingkan respons yang dihasilkan dengan respons referensi** untuk mengevaluasi apakah respons yang dihasilkan sama dengan respons referensi:
   "Given the following question, reference answer, and generated answer, evaluate whether this generated answer is the same as the reference answer. Output True or False. Question: [QUESTION] Reference answer: [REFERENCE ANSWER] Generated answer: [GENERATED ANSWER]"

3. **Bandingkan dua respons yang dihasilkan** dan tentukan mana yang lebih baik atau prediksi mana yang mungkin lebih disukai pengguna:
   "Given the following question and two answers, evaluate which answer is better. Output A or B. Question: [QUESTION] A: [FIRST ANSWER] B: [SECOND ANSWER] The better answer is:"

Juri AI tujuan umum dapat diminta untuk mengevaluasi respons berdasarkan kriteria apa pun. Jika Anda membangun chatbot roleplaying, Anda mungkin ingin mengevaluasi apakah respons chatbot konsisten dengan peran yang diinginkan pengguna, seperti "Apakah respons ini terdengar seperti sesuatu yang akan dikatakan Gandalf?" Jika Anda membangun aplikasi untuk menghasilkan foto produk promosi, Anda mungkin ingin bertanya "Dari 1 hingga 5, bagaimana Anda menilai kepercayaan produk dalam gambar ini?"

Tabel 3-3 menunjukkan kriteria AI sebagai juri bawaan yang umum ditawarkan oleh beberapa alat AI.

| Alat AI | Kriteria Bawaan |
|---------|----------------|
| Azure AI Studio | Groundedness, relevance, coherence, fluency, similarity |
| MLflow.metrics | Faithfulness, relevance |
| LangChain Criteria Evaluation | Conciseness, relevance, correctness, coherence, harmfulness, maliciousness, helpfulness, controversiality, misogyny, insensitivity, criminality |
| Ragas | Faithfulness, answer relevance |

Penting untuk diingat bahwa kriteria AI sebagai juri tidak terstandarisasi. Skor relevansi Azure AI Studio mungkin sangat berbeda dari skor relevansi MLflow. Skor ini tergantung pada model dan prompt yang mendasari juri.

Cara mem-prompt juri AI mirip dengan cara mem-prompt aplikasi AI lainnya. Secara umum, prompt juri harus menjelaskan dengan jelas:

1. **Tugas** yang harus dilakukan model, seperti mengevaluasi relevansi antara jawaban yang dihasilkan dan pertanyaan.
2. **Kriteria** yang harus diikuti model untuk mengevaluasi, seperti "Fokus utama Anda harus pada menentukan apakah jawaban yang dihasilkan mengandung informasi yang cukup untuk menjawab pertanyaan yang diberikan sesuai dengan jawaban ground truth." Semakin detail instruksi, semakin baik.
3. **Sistem penilaian**, yang bisa berupa salah satu dari:
   - **Klasifikasi**, seperti baik/buruk atau relevan/tidak relevan/netral.
   - **Nilai numerik diskrit**, seperti 1 hingga 5.
   - **Nilai numerik kontinu**, seperti antara 0 dan 1.

Language model umumnya lebih baik dengan teks daripada dengan angka. Telah dilaporkan bahwa juri AI bekerja lebih baik dengan klasifikasi daripada dengan sistem penilaian numerik. Untuk sistem penilaian numerik, penilaian diskrit tampaknya bekerja lebih baik daripada penilaian kontinu. Secara empiris, semakin lebar rentang untuk penilaian diskrit, semakin buruk kinerja model. Sistem penilaian diskrit tipikal adalah antara 1 dan 5.

Prompt dengan contoh telah terbukti berkinerja lebih baik. Jika Anda menggunakan sistem penilaian antara 1 dan 5, sertakan contoh seperti apa respons dengan skor 1, 2, 3, 4, atau 5, dan jika mungkin, mengapa respons menerima skor tertentu. Praktik terbaik untuk prompting dibahas di Bab 5.

Juri AI bukan hanya model — ini adalah sistem yang mencakup model dan prompt. Mengubah model, prompt, atau parameter sampling model menghasilkan juri yang berbeda.

### Keterbatasan AI sebagai Juri

Meskipun banyak keuntungan dari AI sebagai juri, banyak tim ragu untuk mengadopsi pendekatan ini. Menggunakan AI untuk mengevaluasi AI tampak tautologis. Sifat probabilistik AI membuatnya tampak terlalu tidak dapat diandalkan untuk bertindak sebagai evaluator. Juri AI berpotensi memperkenalkan biaya dan latensi yang tidak sepele ke dalam aplikasi. Mengingat keterbatasan ini, beberapa tim melihat AI sebagai juri sebagai opsi cadangan ketika mereka tidak memiliki cara lain untuk mengevaluasi sistem mereka, terutama dalam produksi.

**Inkonsistensi**
Agar metode evaluasi dapat dipercaya, hasilnya harus konsisten. Namun, juri AI, seperti semua aplikasi AI, bersifat probabilistik. Juri yang sama, pada input yang sama, dapat mengeluarkan skor yang berbeda jika diprompt secara berbeda. Bahkan juri yang sama, diprompt dengan instruksi yang sama, dapat mengeluarkan skor yang berbeda jika dijalankan dua kali. Inkonsistensi ini membuatnya sulit untuk mereproduksi atau mempercayai hasil evaluasi.

Mungkin untuk membuat juri AI lebih konsisten. Bab 2 membahas bagaimana melakukannya dengan variabel sampling. Zheng et al. (2023) menunjukkan bahwa memasukkan contoh evaluasi dalam prompt dapat meningkatkan konsistensi GPT-4 dari 65% menjadi 77.5%. Namun, mereka mengakui bahwa konsistensi tinggi mungkin tidak menyiratkan akurasi tinggi — juri mungkin secara konsisten membuat kesalahan yang sama. Di atas itu, memasukkan lebih banyak contoh membuat prompt lebih panjang, dan prompt yang lebih panjang berarti biaya inferensi yang lebih tinggi. Dalam eksperimen Zheng et al., memasukkan lebih banyak contoh dalam prompt mereka menyebabkan pengeluaran GPT-4 mereka naik empat kali lipat.

**Ambiguitas kriteria**
Tidak seperti banyak metrik yang dirancang manusia, metrik AI sebagai juri tidak terstandarisasi, membuatnya mudah untuk disalahartikan dan disalahgunakan. Pada saat penulisan ini, alat open source MLflow, Ragas, dan LlamaIndex semuanya memiliki kriteria bawaan faithfulness untuk mengukur seberapa setia output yang dihasilkan terhadap konteks yang diberikan, tetapi instruksi dan sistem penilaian mereka semua berbeda.

MLflow menggunakan sistem penilaian dari 1 hingga 5, Ragas menggunakan 0 dan 1, sedangkan prompt LlamaIndex meminta juri untuk mengeluarkan YES dan NO. Skor faithfulness yang dikeluarkan oleh ketiga alat ini tidak akan sebanding.

**Perubahan dari waktu ke waktu**
Aplikasi berevolusi dari waktu ke waktu, tetapi cara evaluasinya idealnya harus tetap. Dengan cara ini, metrik evaluasi dapat digunakan untuk memantau perubahan aplikasi. Namun, juri AI juga merupakan aplikasi AI, yang berarti mereka juga dapat berubah dari waktu ke waktu.

Bayangkan bahwa bulan lalu, skor koherensi aplikasi Anda adalah 90%, dan bulan ini, skor ini adalah 92%. Apakah ini berarti bahwa koherensi aplikasi Anda telah membaik? Sulit untuk menjawab pertanyaan ini kecuali Anda tahu pasti bahwa juri AI yang digunakan dalam kedua kasus persis sama. Bagaimana jika prompt juri bulan ini berbeda dari yang bulan lalu?

Ini bisa menjadi sangat membingungkan jika aplikasi dan juri AI dikelola oleh tim yang berbeda. Tim juri AI mungkin mengubah juri tanpa memberi tahu tim aplikasi. Akibatnya, tim aplikasi mungkin secara keliru mengaitkan perubahan dalam hasil evaluasi dengan perubahan dalam aplikasi, daripada perubahan dalam juri.

**Jangan percaya juri AI mana pun jika Anda tidak bisa melihat model dan prompt yang digunakan untuk juri tersebut.**

Metode evaluasi membutuhkan waktu untuk distandarisasi. Seiring berkembangnya bidang ini dan lebih banyak guardrails diperkenalkan, saya berharap bahwa juri AI masa depan akan menjadi jauh lebih terstandarisasi dan dapat diandalkan.

**Peningkatan biaya dan latensi**
Anda dapat menggunakan juri AI untuk mengevaluasi aplikasi baik selama eksperimen maupun dalam produksi. Banyak tim menggunakan juri AI sebagai guardrails dalam produksi untuk mengurangi risiko, hanya menampilkan kepada pengguna respons yang dihasilkan yang dianggap baik oleh juri AI.

Menggunakan model yang kuat untuk mengevaluasi respons bisa mahal. Jika Anda menggunakan GPT-4 untuk menghasilkan dan mengevaluasi respons, Anda akan melakukan dua kali lebih banyak panggilan GPT-4, kira-kira menggandakan biaya API Anda. Jika Anda memiliki tiga prompt evaluasi karena Anda ingin mengevaluasi tiga kriteria — katakanlah, kualitas respons keseluruhan, konsistensi faktual, dan toksisitas — Anda akan meningkatkan jumlah panggilan API Anda empat kali lipat.¹⁷

Anda dapat mengurangi biaya dengan menggunakan model yang lebih lemah sebagai juri. Anda juga dapat mengurangi biaya dengan spot-checking: mengevaluasi hanya subset respons.¹⁸ Spot-checking berarti Anda mungkin gagal menangkap beberapa kegagalan. Semakin besar persentase sampel yang Anda evaluasi, semakin percaya diri Anda dalam hasil evaluasi Anda, tetapi juga semakin tinggi biayanya. Menemukan keseimbangan yang tepat antara biaya dan kepercayaan mungkin memerlukan trial and error. Semua hal dipertimbangkan, juri AI jauh lebih murah daripada evaluator manusia.

Menerapkan juri AI dalam pipeline produksi Anda dapat menambah latensi. Jika Anda mengevaluasi respons sebelum mengembalikannya kepada pengguna, Anda menghadapi trade-off: risiko berkurang tetapi latensi meningkat. Latensi yang ditambahkan dapat membuat opsi ini tidak mungkin untuk aplikasi dengan persyaratan latensi yang ketat.

¹⁷ Dalam beberapa kasus, evaluasi dapat memakan sebagian besar anggaran, bahkan lebih dari generasi respons.
¹⁸ Spot-checking sama dengan sampling.

**Bias AI sebagai juri**
Evaluator manusia memiliki bias, dan begitu juga juri AI. Juri AI yang berbeda memiliki bias yang berbeda. Bagian ini akan membahas beberapa yang umum. Mengetahui bias juri AI Anda membantu Anda menafsirkan skor mereka dengan benar dan bahkan memitigasi bias ini.

Juri AI cenderung memiliki **self-bias**, di mana model menyukai responsnya sendiri daripada respons yang dihasilkan oleh model lain. Dalam eksperimen Zheng et al. 2023, GPT-4 menyukai dirinya sendiri dengan tingkat kemenangan 10% lebih tinggi, sementara Claude-v1 menyukai dirinya sendiri dengan tingkat kemenangan 25% lebih tinggi.

Banyak model AI memiliki **first-position bias**. Juri AI mungkin menyukai jawaban pertama dalam perbandingan berpasangan atau yang pertama dalam daftar opsi. Ini dapat dimitigasi dengan mengulangi tes yang sama beberapa kali dengan urutan yang berbeda atau dengan prompt yang dirancang dengan hati-hati. Bias posisi AI adalah kebalikan dari manusia. Manusia cenderung menyukai jawaban yang mereka lihat terakhir, yang disebut recency bias.

Beberapa juri AI memiliki **verbosity bias**, menyukai jawaban yang lebih panjang, terlepas dari kualitasnya. Wu dan Aji (2023) menemukan bahwa baik GPT-4 maupun Claude-1 lebih suka respons yang lebih panjang (~100 kata) dengan kesalahan faktual daripada respons yang lebih pendek dan benar (~50 kata). Saito et al. (2023) mempelajari bias ini untuk tugas kreatif dan menemukan bahwa ketika perbedaan panjang cukup besar, juri hampir selalu lebih suka yang lebih panjang.¹⁹

Di atas semua bias ini, juri AI memiliki keterbatasan yang sama seperti semua aplikasi AI, termasuk privasi dan kekayaan intelektual. Jika Anda menggunakan model proprietary sebagai juri, Anda perlu mengirim data Anda ke model ini. Jika penyedia model tidak mengungkapkan data pelatihan mereka, Anda tidak akan tahu pasti apakah juri aman secara komersial untuk digunakan.

Meskipun ada keterbatasan dari pendekatan AI sebagai juri, banyak kelebihannya membuat saya percaya bahwa adopsinya akan terus berkembang. Namun, juri AI harus dilengkapi dengan metode evaluasi eksak dan/atau evaluasi manusia.

¹⁹ Saito et al. (2023) menemukan bahwa manusia juga cenderung menyukai respons yang lebih panjang, tetapi pada tingkat yang jauh lebih rendah.

### Model Apa yang Dapat Bertindak sebagai Juri?

Juri bisa lebih kuat, lebih lemah, atau sama dengan model yang sedang dinilai. Setiap skenario memiliki pro dan kontra.

Pada pandangan pertama, juri yang lebih kuat masuk akal. Bukankah penguji ujian harus lebih berpengetahuan daripada peserta ujian? Tidak hanya model yang lebih kuat dapat membuat penilaian yang lebih baik, tetapi mereka juga dapat membantu meningkatkan model yang lebih lemah dengan membimbing mereka untuk menghasilkan respons yang lebih baik.

Anda mungkin bertanya-tanya: jika Anda sudah memiliki akses ke model yang lebih kuat, mengapa repot-repot menggunakan model yang lebih lemah untuk menghasilkan respons? Jawabannya adalah biaya dan latensi. Anda mungkin tidak memiliki anggaran untuk menggunakan model yang lebih kuat untuk menghasilkan semua respons, jadi Anda menggunakannya untuk mengevaluasi subset respons. Misalnya, Anda dapat menggunakan model internal yang murah untuk menghasilkan respons dan GPT-4 untuk mengevaluasi 1% dari respons.

Model yang lebih kuat juga mungkin terlalu lambat untuk aplikasi Anda. Anda dapat menggunakan model cepat untuk menghasilkan respons sementara model yang lebih kuat, tetapi lebih lambat, melakukan evaluasi di latar belakang. Jika model kuat berpikir bahwa respons model lemah buruk, tindakan perbaikan dapat diambil.

Menggunakan model yang lebih kuat sebagai juri meninggalkan kita dengan dua tantangan. Pertama, model terkuat tidak akan memiliki juri yang memenuhi syarat. Kedua, kita memerlukan metode evaluasi alternatif untuk menentukan model mana yang terkuat.

Menggunakan model untuk menilai dirinya sendiri, **self-evaluation** atau **self-critique**, terdengar seperti kecurangan, terutama karena self-bias. Namun, self-evaluation bisa sangat baik untuk pemeriksaan kewajaran. Jika model menganggap responsnya sendiri tidak benar, model mungkin tidak begitu dapat diandalkan. Di luar pemeriksaan kewajaran, meminta model untuk mengevaluasi dirinya sendiri dapat mendorong model untuk merevisi dan meningkatkan responsnya (Press et al., 2022; Gou et al., 2023; Valmeekamet et al., 2023).²⁰

Satu pertanyaan terbuka adalah apakah juri bisa lebih lemah daripada model yang dinilai. Beberapa berpendapat bahwa menilai adalah tugas yang lebih mudah daripada menghasilkan. Siapa pun dapat memiliki pendapat tentang apakah sebuah lagu bagus, tetapi tidak semua orang dapat menulis lagu. Model yang lebih lemah seharusnya dapat menilai output dari model yang lebih kuat.

Zheng et al. (2023) menemukan bahwa model yang lebih kuat lebih berkorelasi dengan preferensi manusia, yang membuat orang memilih model terkuat yang mampu mereka beli. Namun, eksperimen ini terbatas pada juri tujuan umum. Satu arah penelitian yang saya sukai adalah juri khusus kecil. Juri khusus dilatih untuk membuat penilaian spesifik, menggunakan kriteria spesifik dan mengikuti sistem penilaian spesifik. Juri khusus yang kecil bisa lebih dapat diandalkan daripada juri tujuan umum yang lebih besar untuk penilaian tertentu.

²⁰ Teknik ini kadang-kadang disebut self-critique atau self-ask.

Karena ada banyak kemungkinan cara untuk menggunakan juri AI, ada banyak kemungkinan juri AI khusus. Berikut adalah contoh tiga juri khusus:

**Reward model**
Reward model menerima pasangan (prompt, respons) dan memberikan skor seberapa baik respons tersebut diberikan prompt. Reward model telah berhasil digunakan dalam RLHF selama bertahun-tahun. Cappy adalah contoh reward model yang dikembangkan oleh Google (2023). Diberikan pasangan (prompt, respons), Cappy menghasilkan skor antara 0 dan 1, menunjukkan seberapa benar respons tersebut. Cappy adalah pemberi skor ringan dengan 360 juta parameter, jauh lebih kecil daripada foundation model tujuan umum.

**Reference-based judge**
Juri berbasis referensi mengevaluasi respons yang dihasilkan terhadap satu atau lebih respons referensi. Juri ini dapat mengeluarkan skor kesamaan atau skor kualitas. Misalnya, BLEURT (Sellam et al., 2020) menerima pasangan (respons kandidat, respons referensi) dan mengeluarkan skor kesamaan antara kandidat dan respons referensi.²¹ Prometheus (Kim et al., 2023) menerima (prompt, respons yang dihasilkan, respons referensi, rubrik penilaian) dan mengeluarkan skor kualitas antara 1 dan 5.

**Preference model**
Preference model menerima (prompt, respons 1, respons 2) sebagai input dan mengeluarkan mana dari dua respons yang lebih baik (lebih disukai oleh pengguna) untuk prompt yang diberikan. Ini mungkin salah satu arah yang lebih menarik untuk juri khusus. Mampu memprediksi preferensi manusia membuka banyak kemungkinan. Seperti dibahas di Bab 2, data preferensi sangat penting untuk menyelaraskan model AI dengan preferensi manusia, dan sulit serta mahal untuk diperoleh. Memiliki prediktor preferensi manusia yang baik dapat membuat evaluasi lebih mudah dan model lebih aman digunakan. Telah ada banyak inisiatif dalam membangun preference model, termasuk PandaLM (Wang et al., 2023) dan JudgeLM (Zhu et al., 2023).

²¹ Rentang skor BLEURT membingungkan. Ini kira-kira antara -2.5 dan 1.0. Ini menyoroti tantangan ambiguitas kriteria dengan juri AI: rentang skor bisa arbitrer.

Meskipun memiliki keterbatasan, pendekatan AI sebagai juri serbaguna dan kuat. Menggunakan model yang lebih murah sebagai juri membuatnya semakin berguna. Banyak rekan saya, yang awalnya skeptis, telah mulai lebih mengandalkannya dalam produksi.

AI sebagai juri menarik, dan pendekatan berikutnya yang akan kita bahas sama menariknya. Ini terinspirasi oleh desain game, bidang yang menarik.

## Peringkat Model dengan Evaluasi Komparatif

Seringkali, Anda mengevaluasi model bukan karena Anda peduli dengan skor mereka, tetapi karena Anda ingin tahu model mana yang terbaik untuk Anda. Yang Anda inginkan adalah peringkat model-model ini. Anda dapat memberi peringkat model menggunakan evaluasi pointwise atau evaluasi komparatif.

Dengan **evaluasi pointwise**, Anda mengevaluasi setiap model secara independen,²² kemudian memberi peringkat berdasarkan skor mereka. Misalnya, jika Anda ingin mengetahui penari mana yang terbaik, Anda mengevaluasi setiap penari secara individual, memberi mereka skor, lalu memilih penari dengan skor tertinggi.

Dengan **evaluasi komparatif**, Anda mengevaluasi model terhadap satu sama lain dan menghitung peringkat dari hasil perbandingan. Untuk kontes dansa yang sama, Anda dapat meminta semua kandidat menari berdampingan dan meminta juri memilih tarian kandidat mana yang paling mereka sukai, dan memilih penari yang paling disukai oleh sebagian besar juri.

Untuk respons yang kualitasnya subjektif, evaluasi komparatif biasanya lebih mudah dilakukan daripada evaluasi pointwise. Misalnya, lebih mudah untuk mengatakan lagu mana dari dua lagu yang lebih baik daripada memberikan skor konkret untuk setiap lagu.

Dalam AI, evaluasi komparatif pertama kali digunakan pada tahun 2021 oleh Anthropic untuk memberi peringkat model yang berbeda. Ini juga mendukung leaderboard LMSYS Chatbot Arena yang populer yang memberi peringkat model menggunakan skor yang dihitung dari perbandingan model berpasangan dari komunitas.

Banyak penyedia model menggunakan evaluasi komparatif untuk mengevaluasi model mereka dalam produksi.

Untuk setiap permintaan, dua atau lebih model dipilih untuk merespons. Seorang evaluator, yang bisa manusia atau AI, memilih pemenangnya. Banyak pengembang mengizinkan seri untuk menghindari pemenang dipilih secara acak ketika draf sama-sama baik atau buruk.

Hal yang sangat penting untuk diingat adalah bahwa **tidak semua pertanyaan harus dijawab oleh preferensi**. Banyak pertanyaan harus dijawab oleh kebenaran. Bayangkan bertanya kepada model "Apakah ada hubungan antara radiasi ponsel dan tumor otak?" dan model menyajikan dua opsi, "Ya" dan "Tidak", untuk Anda pilih. Voting berbasis preferensi dapat menyebabkan sinyal yang salah yang, jika digunakan untuk melatih model Anda, dapat mengakibatkan perilaku yang tidak selaras.

Meminta pengguna untuk memilih juga dapat menyebabkan frustrasi pengguna. Bayangkan mengajukan pertanyaan matematika kepada model karena Anda tidak tahu jawabannya, dan model memberi Anda dua jawaban berbeda dan meminta Anda memilih yang Anda sukai. Jika Anda tahu jawaban yang benar, Anda tidak akan bertanya pada model sejak awal.

Ketika mengumpulkan umpan balik komparatif dari pengguna, satu tantangan adalah menentukan pertanyaan apa yang dapat ditentukan oleh voting preferensi dan apa yang tidak boleh. Voting berbasis preferensi hanya berfungsi jika pemilih berpengetahuan dalam subjek tersebut.

Evaluasi komparatif tidak boleh disamakan dengan A/B testing. Dalam A/B testing, pengguna melihat output dari satu model kandidat pada satu waktu. Dalam evaluasi komparatif, pengguna melihat output dari beberapa model pada waktu yang sama.

Setiap perbandingan disebut **match**. Proses ini menghasilkan serangkaian perbandingan. Probabilitas bahwa model A lebih disukai daripada model B adalah **win rate** A terhadap B. Kita dapat menghitung win rate ini dengan melihat semua pertandingan antara A dan B dan menghitung persentase di mana A menang.

²² Seperti menggunakan skala Likert.

Jika hanya ada dua model, memberi peringkat sangatlah mudah. Model yang lebih sering menang mendapat peringkat lebih tinggi. Semakin banyak model, semakin menantang peringkatnya.

Dengan sinyal komparatif, algoritma peringkat kemudian digunakan untuk menghitung peringkat model. Biasanya, algoritma ini pertama-tama menghitung skor untuk setiap model dari sinyal komparatif dan kemudian memberi peringkat model berdasarkan skor mereka.

Evaluasi komparatif baru dalam AI tetapi telah ada selama hampir satu abad di industri lain. Ini sangat populer dalam olahraga dan video game. Banyak algoritma peringkat yang dikembangkan untuk domain lain ini dapat diadaptasi untuk mengevaluasi model AI, seperti Elo, Bradley–Terry, dan TrueSkill. LMSYS Chatbot Arena awalnya menggunakan Elo untuk menghitung peringkat model tetapi kemudian beralih ke algoritma Bradley–Terry karena mereka menemukan Elo sensitif terhadap urutan evaluator dan prompt.²³

Peringkat dikatakan benar jika, untuk setiap pasangan model, model berperingkat lebih tinggi lebih mungkin menang dalam pertandingan melawan model berperingkat lebih rendah. Jika model A mendapat peringkat lebih tinggi dari model B, pengguna harus lebih menyukai model A daripada model B lebih dari separuh waktu.

Melalui lensa ini, peringkat model adalah masalah prediktif. Kami menghitung peringkat dari hasil pertandingan historis dan menggunakannya untuk memprediksi hasil pertandingan di masa depan. Algoritma peringkat yang berbeda dapat menghasilkan peringkat yang berbeda, dan tidak ada ground truth untuk peringkat yang benar. Kualitas peringkat ditentukan oleh seberapa baik ia dalam memprediksi hasil pertandingan di masa depan.

²³ Meskipun Chatbot Arena berhenti menggunakan algoritma peringkat Elo, pengembangnya, untuk sementara, terus merujuk pada peringkat model mereka sebagai "skor Elo". Mereka menskalakan skor Bradley-Terry yang dihasilkan agar terlihat seperti skor Elo. Skalanya cukup rumit. Setiap skor dikalikan dengan 400 (skala yang digunakan dalam Elo) dan ditambahkan ke 1.000 (skor Elo awal). Kemudian skor ini diskalakan ulang sehingga model Llama-13b memiliki skor 800.

### Tantangan Evaluasi Komparatif

Dengan evaluasi pointwise, bagian terberat dari prosesnya adalah dalam merancang benchmark dan metrik untuk mengumpulkan sinyal yang tepat. Menghitung skor untuk memberi peringkat model itu mudah. Dengan evaluasi komparatif, baik pengumpulan sinyal maupun peringkat model menantang. Bagian ini membahas tiga tantangan umum evaluasi komparatif.

**Kemacetan skalabilitas**
Evaluasi komparatif intensif data. Jumlah pasangan model yang akan dibandingkan tumbuh secara kuadratik dengan jumlah model. Pada Januari 2024, LMSYS mengevaluasi 57 model menggunakan 244.000 perbandingan. Meskipun ini terdengar seperti banyak perbandingan, ini rata-rata hanya 153 perbandingan per pasangan model (57 model sesuai dengan 1.596 pasangan model). Ini adalah angka yang kecil, mengingat berbagai tugas yang kita inginkan untuk foundation model.

Untungnya, kita tidak selalu memerlukan perbandingan langsung antara dua model untuk menentukan mana yang lebih baik. Algoritma peringkat biasanya mengasumsikan transitivitas. Jika model A mendapat peringkat lebih tinggi dari B, dan B mendapat peringkat lebih tinggi dari C, maka dengan transitivitas, Anda dapat menyimpulkan bahwa A mendapat peringkat lebih tinggi dari C.

Namun, tidak jelas apakah asumsi transitivitas ini berlaku untuk model AI. Banyak makalah yang menganalisis Elo untuk evaluasi AI mengutip asumsi transitivitas sebagai keterbatasan (Boubdir et al.; Balduzzi et al.; dan Munos et al.). Mereka berpendapat bahwa preferensi manusia tidak selalu transitif. Selain itu, non-transitivitas dapat terjadi karena pasangan model yang berbeda dievaluasi oleh evaluator yang berbeda dan pada prompt yang berbeda.

Juga ada tantangan mengevaluasi model baru. Dengan evaluasi independen, hanya model baru yang perlu dievaluasi. Dengan evaluasi komparatif, model baru harus dievaluasi terhadap model yang ada, yang dapat mengubah peringkat model yang ada.

Ini juga membuatnya sulit untuk mengevaluasi model privat. Bayangkan Anda telah membangun model untuk perusahaan Anda, menggunakan data internal. Anda ingin membandingkan model ini dengan model publik untuk memutuskan apakah akan lebih bermanfaat menggunakan model publik. Jika Anda ingin menggunakan evaluasi komparatif untuk model Anda, Anda kemungkinan harus mengumpulkan sinyal komparatif Anda sendiri dan membuat leaderboard Anda sendiri.

Kemacetan skalabilitas dapat dimitigasi dengan algoritma pencocokan yang lebih baik. Sejauh ini, kita telah mengasumsikan bahwa model dipilih secara acak untuk setiap pertandingan, sehingga semua pasangan model muncul dalam jumlah pertandingan yang kira-kira sama. Namun, tidak semua pasangan model perlu dibandingkan secara setara. Setelah kita yakin tentang hasil dari sepasang model, kita dapat berhenti mencocokkan mereka satu sama lain. Algoritma pencocokan yang efisien harus mengambil sampel pertandingan yang mengurangi paling banyak ketidakpastian dalam peringkat keseluruhan.

**Kurangnya standardisasi dan kontrol kualitas**
Salah satu cara untuk mengumpulkan sinyal komparatif adalah dengan crowdsourcing perbandingan ke komunitas seperti yang dilakukan LMSYS Chatbot Arena. Siapa pun dapat pergi ke situs web, memasukkan prompt, mendapatkan dua respons dari dua model anonim, dan memilih yang lebih baik. Hanya setelah voting selesai, nama model diungkapkan.

Manfaat dari pendekatan ini adalah bahwa ia menangkap berbagai sinyal dan relatif sulit untuk dimanipulasi.²⁴ Namun, sisi negatifnya adalah sulit untuk menegakkan standardisasi dan kontrol kualitas.

Pertama, siapa pun dengan akses internet dapat menggunakan prompt apa pun untuk mengevaluasi model ini, dan tidak ada standar tentang apa yang harus merupakan respons yang lebih baik. Mungkin terlalu banyak untuk mengharapkan sukarelawan memeriksa fakta respons, sehingga mereka mungkin tanpa sadar lebih menyukai respons yang terdengar lebih baik tetapi secara faktual salah.

Beberapa orang mungkin lebih suka respons yang sopan dan moderat, sementara yang lain mungkin lebih suka respons tanpa filter. Ini baik dan buruk. Ini baik karena membantu menangkap preferensi manusia di alam liar. Ini buruk karena preferensi manusia di alam liar mungkin tidak sesuai untuk semua kasus penggunaan.

Kedua, crowdsourcing perbandingan mengharuskan pengguna untuk mengevaluasi model di luar lingkungan kerja mereka. Tanpa landasan dunia nyata, prompt pengujian mungkin tidak mencerminkan bagaimana model ini digunakan di dunia nyata. Orang mungkin hanya menggunakan prompt pertama yang terlintas dalam pikiran dan tidak mungkin menggunakan teknik prompting yang canggih.

Di antara 33.000 prompt yang diterbitkan oleh LMSYS Chatbot Arena pada tahun 2023, 180 di antaranya adalah "halo" dan "hai", yang mencakup 0,55% dari data, dan ini belum termasuk variasi seperti "halo!", "halo.", "hola", "hey", dan seterusnya. Ada banyak teka-teki. Pertanyaan "X memiliki 3 saudara perempuan, masing-masing memiliki satu saudara laki-laki. Berapa banyak saudara laki-laki yang dimiliki X?" ditanyakan 44 kali.

Prompt sederhana mudah untuk direspons, sehingga sulit untuk membedakan kinerja model. Mengevaluasi model menggunakan terlalu banyak prompt sederhana dapat mencemari peringkat.

Jika leaderboard publik tidak mendukung konstruksi konteks yang canggih, seperti menambahkan konteks dengan dokumen yang relevan yang diambil dari database internal Anda, peringkatnya tidak akan mencerminkan seberapa baik model mungkin bekerja untuk sistem RAG Anda.

Salah satu cara potensial untuk menegakkan standardisasi adalah dengan membatasi pengguna pada serangkaian prompt yang telah ditentukan. Namun, ini dapat mempengaruhi kemampuan leaderboard untuk menangkap berbagai kasus penggunaan. LMSYS sebagai gantinya memungkinkan pengguna menggunakan prompt apa pun tetapi kemudian menyaring prompt yang sulit menggunakan model internal mereka dan memberi peringkat model hanya menggunakan prompt yang sulit ini.

Cara lain adalah dengan hanya menggunakan evaluator yang dapat kita percaya. Kita dapat melatih evaluator tentang kriteria untuk membandingkan dua respons atau melatih mereka untuk menggunakan prompt praktis dan teknik prompting yang canggih. Ini adalah pendekatan yang digunakan Scale dengan leaderboard komparatif privat mereka. Sisi negatif dari pendekatan ini adalah mahal dan dapat secara drastis mengurangi jumlah perbandingan yang bisa kita dapatkan.

Pilihan lain adalah menggabungkan evaluasi komparatif ke dalam produk Anda dan membiarkan pengguna mengevaluasi model selama alur kerja mereka. Misalnya, untuk tugas pembuatan kode, Anda dapat menyarankan pengguna dua potongan kode di dalam editor kode pengguna dan membiarkan mereka memilih yang lebih baik. Banyak aplikasi chat sudah melakukan ini. Namun, seperti disebutkan sebelumnya, pengguna mungkin tidak tahu potongan kode mana yang lebih baik.

²⁴ Seiring Chatbot Arena menjadi lebih populer, upaya untuk memanipulasinya menjadi lebih umum. Meskipun tidak ada yang mengakui kepada saya bahwa mereka mencoba memanipulasi peringkat, beberapa pengembang model telah mengatakan kepada saya bahwa mereka yakin pesaing mereka mencoba memanipulasinya.

**Dari kinerja komparatif ke kinerja absolut**
Untuk banyak aplikasi, kita tidak selalu memerlukan model terbaik yang mungkin. Kita memerlukan model yang cukup baik. Evaluasi komparatif memberi tahu kita model mana yang lebih baik. Ia tidak memberi tahu kita seberapa baik model atau apakah model ini cukup baik untuk kasus penggunaan kita. Mari kita asumsikan bahwa kita mendapatkan peringkat bahwa model B lebih baik dari model A. Salah satu skenario berikut bisa valid:

1. Model B bagus, tetapi model A buruk.
2. Baik model A maupun model B buruk.
3. Baik model A maupun model B bagus.

Anda memerlukan bentuk evaluasi lain untuk menentukan skenario mana yang benar.

Bayangkan kita menggunakan model A untuk dukungan pelanggan, dan model A dapat menyelesaikan 70% dari semua tiket. Pertimbangkan model B, yang menang melawan A 51% dari waktu. Tidak jelas bagaimana tingkat kemenangan 51% ini akan dikonversi menjadi jumlah permintaan yang dapat diselesaikan model B. Beberapa orang telah mengatakan kepada saya bahwa dalam pengalaman mereka, perubahan 1% dalam tingkat kemenangan dapat menyebabkan peningkatan kinerja yang besar di beberapa aplikasi tetapi hanya peningkatan minimal di aplikasi lain.

Ketika memutuskan untuk mengganti A dengan B, preferensi manusia bukanlah segalanya. Kami juga peduli dengan faktor lain seperti biaya. Tidak mengetahui peningkatan kinerja apa yang diharapkan membuatnya sulit untuk melakukan analisis biaya-manfaat. Jika model B berharga dua kali lipat dari A, evaluasi komparatif tidak cukup untuk membantu kami menentukan apakah peningkatan kinerja dari B akan sebanding dengan biaya tambahan.

### Masa Depan Evaluasi Komparatif

Mengingat banyak keterbatasan evaluasi komparatif, Anda mungkin bertanya-tanya apakah ada masa depan untuknya. Ada banyak manfaat untuk evaluasi komparatif.

Pertama, seperti dibahas di "Post-Training" di halaman 78, orang telah menemukan bahwa lebih mudah membandingkan dua output daripada memberikan skor konkret untuk setiap output. Saat model menjadi lebih kuat, melampaui kinerja manusia, mungkin menjadi tidak mungkin bagi evaluator manusia untuk memberikan skor konkret pada respons model. Namun, evaluator manusia mungkin masih dapat mendeteksi perbedaannya, dan evaluasi komparatif mungkin tetap menjadi satu-satunya pilihan. Misalnya, makalah Llama 2 membagikan bahwa ketika model memasuki jenis tulisan di luar kemampuan annotator manusia terbaik, manusia masih dapat memberikan umpan balik yang berharga ketika membandingkan dua jawaban (Touvron et al., 2023).

Kedua, evaluasi komparatif bertujuan untuk menangkap kualitas yang kita pedulikan: preferensi manusia. Ini mengurangi tekanan untuk harus terus-menerus membuat lebih banyak benchmark untuk mengejar kemampuan AI yang terus berkembang. Tidak seperti benchmark yang menjadi tidak berguna ketika kinerja model mencapai skor sempurna, evaluasi komparatif tidak akan pernah menjadi jenuh selama model yang lebih baru dan lebih kuat diperkenalkan.

Evaluasi komparatif relatif sulit untuk dimanipulasi, karena tidak ada cara mudah untuk curang, seperti melatih model Anda pada data referensi. Untuk alasan ini, banyak yang lebih mempercayai hasil leaderboard komparatif publik daripada leaderboard publik lainnya.

Evaluasi komparatif dapat memberikan sinyal yang membedakan tentang model yang tidak dapat diperoleh sebaliknya. Untuk evaluasi offline, ini bisa menjadi tambahan yang bagus untuk benchmark evaluasi. Untuk evaluasi online, ini bisa menjadi pelengkap untuk A/B testing.

## Ringkasan

Semakin kuat model AI, semakin tinggi potensi kegagalan katastropik, yang membuat evaluasi semakin penting. Pada saat yang sama, mengevaluasi model open-ended yang kuat itu menantang. Tantangan-tantangan ini membuat banyak tim beralih ke evaluasi manusia. Memiliki manusia dalam loop untuk pemeriksaan kewajaran selalu membantu, dan dalam banyak kasus, evaluasi manusia sangat penting. Namun, bab ini berfokus pada pendekatan yang berbeda untuk evaluasi otomatis.

Bab ini dimulai dengan diskusi tentang mengapa foundation model lebih sulit dievaluasi daripada model ML tradisional. Sementara banyak teknik evaluasi baru sedang dikembangkan, investasi dalam evaluasi masih tertinggal dari investasi dalam pengembangan model dan aplikasi.

Karena banyak foundation model memiliki komponen language model, kita mendalami metrik language modeling, termasuk perplexity dan cross entropy. Banyak orang yang telah saya ajak bicara menemukan metrik ini membingungkan, jadi saya menyertakan bagian tentang bagaimana menafsirkan metrik ini dan memanfaatkannya dalam evaluasi dan pemrosesan data.

Bab ini kemudian menggeser fokus ke pendekatan yang berbeda untuk mengevaluasi respons open-ended, termasuk kebenaran fungsional, skor kesamaan, dan AI sebagai juri. Dua pendekatan evaluasi pertama bersifat eksak, sementara evaluasi AI sebagai juri bersifat subjektif.

Tidak seperti evaluasi eksak, metrik subjektif sangat tergantung pada juri. Skor mereka perlu ditafsirkan dalam konteks juri apa yang digunakan. Skor yang bertujuan untuk mengukur kualitas yang sama oleh juri AI yang berbeda mungkin tidak sebanding. Juri AI, seperti semua aplikasi AI, harus diiterasi, yang berarti penilaian mereka berubah. Ini membuat mereka tidak dapat diandalkan sebagai benchmark untuk melacak perubahan aplikasi dari waktu ke waktu. Meskipun menjanjikan, juri AI harus dilengkapi dengan evaluasi eksak, evaluasi manusia, atau keduanya.

Ketika mengevaluasi model, Anda dapat mengevaluasi setiap model secara independen, dan kemudian memberi peringkat berdasarkan skor mereka. Atau, Anda dapat memberi peringkat menggunakan sinyal komparatif: mana dari dua model yang lebih baik? Evaluasi komparatif umum dalam olahraga, terutama catur, dan semakin populer dalam evaluasi AI. Baik evaluasi komparatif maupun proses alignment post-training memerlukan sinyal preferensi, yang mahal untuk dikumpulkan. Ini memotivasi pengembangan preference model: juri AI khusus yang memprediksi respons mana yang lebih disukai pengguna.

Sementara metrik language modeling dan pengukuran kesamaan yang dirancang secara manual telah ada selama beberapa waktu, AI sebagai juri dan evaluasi komparatif baru mendapatkan adopsi dengan munculnya foundation model. Banyak tim yang mencari cara untuk memasukkannya ke dalam pipeline evaluasi mereka. Mencari cara untuk membangun pipeline evaluasi yang andal untuk mengevaluasi aplikasi open-ended adalah topik bab berikutnya.
