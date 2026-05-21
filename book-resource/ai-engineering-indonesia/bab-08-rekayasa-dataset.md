# Bab 8: Rekayasa Dataset

1 Pentingnya data yang semakin meningkat tercermin dari bagaimana upaya data berubah dari GPT-3 ke GPT-4. Dalam daftar kontribusi untuk GPT-3 (OpenAI, 2020), hanya dua orang yang dikreditkan untuk pengumpulan data, penyaringan, dan deduplikasi, serta melakukan analisis tumpang tindih pada data pelatihan. Ini berubah secara dramatis tiga tahun kemudian. Untuk GPT-4 (OpenAI, 2023), delapan puluh orang dikreditkan karena terlibat dalam berbagai proses data. Daftar ini belum termasuk anotator data yang dikontrak OpenAI melalui penyedia data. Untuk sesuatu yang terdengar sesederhana format ChatML, sebelas orang terlibat, dan banyak dari mereka adalah peneliti senior. Kembali di thread AMA (ask me anything) mereka tahun 2016, Wojciech Zaremba, salah satu pendiri OpenAI, mengatakan bahwa mereka bermaksud melakukan sebagian besar penelitian mereka menggunakan dataset yang tersedia untuk publik.

Kualitas model bergantung pada kualitas data pelatihannya. Tim ML terbaik di dunia dengan komputasi tak terbatas tidak dapat membantu Anda melakukan fine-tuning model yang baik jika Anda tidak memiliki data. Tujuan rekayasa dataset adalah untuk menciptakan dataset yang memungkinkan Anda melatih model terbaik, idealnya dalam anggaran yang dialokasikan.

Seiring semakin sedikit perusahaan yang mampu mengembangkan model dari awal, semakin banyak yang beralih ke data untuk membedakan performa AI mereka. Seiring model membutuhkan lebih banyak data, penanganan data menjadi semakin menantang dan menuntut lebih banyak investasi dalam talenta dan infrastruktur.1

Operasi data telah berevolusi dari tugas sampingan yang ditangani orang ketika mereka punya waktu menjadi peran khusus. Banyak perusahaan AI sekarang mempekerjakan labeler data, pembuat dataset, dan insinyur kualitas data, baik terintegrasi ke dalam atau bekerja bersama tim engineering inti mereka.

Jika lanskap model sudah cukup membingungkan dengan banyaknya penawaran, lanskap data bahkan lebih kompleks, dengan serangkaian dataset dan teknik yang terus bertambah. Bab ini memberi Anda gambaran tentang lanskap data dan pertimbangan yang perlu diperhatikan saat membangun dataset Anda sendiri.

Ini dimulai dengan kurasi data, menjawab pertanyaan seperti Data apa yang Anda butuhkan? Berapa banyak? Apa artinya data berkualitas tinggi? Kemudian bab ini membahas teknik untuk sintesis dan pemrosesan data. Kurasi data, generasi, dan pemrosesan tidak mengikuti jalur linear. Anda mungkin harus bolak-balik antara langkah yang berbeda.

Untuk model yang sama, fase pelatihan yang berbeda bertujuan untuk mengajarkan model kemampuan yang berbeda, dan, oleh karena itu, memerlukan dataset dengan atribut yang berbeda. Misalnya, kuantitas data untuk pre-training sering diukur dalam jumlah token, sedangkan kuantitas data untuk supervised finetuning sering diukur dalam jumlah contoh.

Namun, secara garis besar, proses kurasi mereka mengikuti prinsip yang sama. Bab ini berfokus pada data post-training karena itu lebih relevan bagi pengembang aplikasi. Namun, saya juga akan menyertakan pelajaran dari data pre-training ketika pelajaran ini bermanfaat untuk post-training.

Ada praktik terbaik yang dapat Anda ikuti dan alat yang dapat Anda gunakan untuk mengotomatisasi bagian dari proses. Namun, data sebagian besar hanya akan menjadi kerja keras, air mata, dan keringat.

## Pandangan Data-Centric AI

Peningkatan fokus pada data selama pengembangan AI telah melahirkan data-centric AI, sebagai lawan dari model-centric AI:

- **Model-centric AI** mencoba meningkatkan performa AI dengan meningkatkan model itu sendiri. Ini melibatkan perancangan arsitektur baru, meningkatkan ukuran model, atau mengembangkan teknik pelatihan baru.
- **Data-centric AI** mencoba meningkatkan performa AI dengan meningkatkan data. Ini melibatkan pengembangan teknik pemrosesan data baru dan menciptakan dataset berkualitas tinggi yang memungkinkan model yang lebih baik dilatih dengan lebih sedikit sumber daya.

Di masa awal deep learning, banyak benchmark AI bersifat model-centric. Diberikan dataset seperti ImageNet, orang mencoba melatih model terbaik yang mungkin menggunakan dataset yang sama. Dalam beberapa tahun terakhir, semakin banyak benchmark yang menjadi data-centric. Diberikan model yang sama, orang mencoba mengembangkan dataset yang memberikan performa terbaik pada model ini.

Pada tahun 2021, Andrew Ng meluncurkan kompetisi data-centric AI di mana peserta perlu meningkatkan dataset dasar yang sama dengan menerapkan teknik seperti memperbaiki label yang salah, menambahkan contoh edge case, augmentasi data, dll.

Pada tahun 2023, DataComp (Gadre et al., 2023) menjadi tuan rumah kompetisi yang tujuannya adalah untuk membuat dataset terbaik untuk melatih model CLIP (Radford et al., 2021). Sebuah skrip terstandarisasi melatih model CLIP pada setiap dataset yang dikirimkan. Kualitas dataset dievaluasi berdasarkan performa model yang dihasilkan pada 38 tugas downstream. Pada tahun 2024, mereka mengadakan kompetisi serupa untuk mengevaluasi dataset untuk model bahasa dengan skala dari 412M hingga 7B parameter (Li et al., 2024). Benchmark data-centric serupa lainnya termasuk DataPerf (MLCommons, 2023) dan dcbench (Eyuboglu dan Karlaš, 2022).

Pembagian model-centric dan data-centric membantu memandu penelitian. Pada kenyataannya, namun, kemajuan teknologi yang bermakna sering memerlukan investasi dalam peningkatan model dan data.

## Kurasi Data

Meskipun tidak semua masalah dengan model AI dapat diselesaikan dengan data, data sering menjadi bagian kunci dari solusi. Data yang tepat dapat membuat model lebih mampu, lebih aman, dan mampu menangani konteks yang lebih panjang. Sebaliknya, data yang buruk dapat menyebabkan model meningkatkan bias dan halusinasi. Kesalahan dalam data dapat merugikan model dan membuang sumber daya.

Kurasi data adalah ilmu yang memerlukan pemahaman tentang bagaimana model belajar dan sumber daya apa yang tersedia untuk membantunya belajar. Pembuat dataset harus bekerja erat dengan pengembang aplikasi dan model. Dalam tim kecil, mereka mungkin orang yang sama—orang yang bertanggung jawab untuk melatih model juga bertanggung jawab untuk memperoleh data untuknya. Namun, organisasi dengan permintaan data tinggi sering mempekerjakan peran khusus.2

Data apa yang Anda butuhkan tergantung pada tugas Anda dan apa yang ingin Anda ajarkan pada model. Untuk self-supervised finetuning, Anda memerlukan urutan data. Untuk instruction finetuning, Anda memerlukan data dalam format (instruksi, respons). Untuk preference finetuning, Anda memerlukan data dalam format (instruksi, respons menang, respons kalah). Untuk melatih model reward, Anda dapat menggunakan format data yang sama seperti preference finetuning atau menggunakan data dengan skor teranotasi untuk setiap contoh Anda dalam format ((instruksi, respons), skor).

Data pelatihan harus menunjukkan perilaku yang ingin Anda pelajari oleh model. Memperoleh anotasi data berkualitas tinggi selalu menantang, tetapi ini bahkan lebih menantang jika Anda ingin mengajarkan model perilaku kompleks seperti penalaran chain-of-thought (CoT) dan penggunaan alat. Mari kita bahas dua contoh ini untuk memahami mengapa:

### Chain-of-thought

Seperti yang dibahas di Bab 5, prompting CoT mendorong model untuk bekerja melalui masalah langkah demi langkah sebelum menghasilkan jawaban akhir. Untuk mengajarkan model menghasilkan respons langkah demi langkah, data pelatihannya harus menyertakan respons CoT. "Scaling Instruction-Finetuned Language Models" (Chun et al., 2024) menunjukkan bahwa menggabungkan respons langkah demi langkah dalam data fine-tuning sangat meningkatkan performa model dari berbagai ukuran pada tugas CoT, dengan akurasi hampir dua kali lipat untuk tugas tertentu.

Menghasilkan respons multi-langkah dapat membosankan dan memakan waktu—menjelaskan cara memecahkan masalah matematika langkah demi langkah jauh lebih menantang daripada hanya memberikan jawaban akhir. Untuk mengilustrasikan ini, berikut adalah dua contoh, satu dengan hanya jawaban akhir dan satu dengan CoT. Keduanya dari Chun et al. (2024):

```
Instruksi: Silakan jawab pertanyaan berikut. Berapa titik didih Nitrogen?
Respons (tanpa CoT): -320.4F
```

```
Instruksi CoT: Jawab pertanyaan berikut dengan penalaran langkah demi langkah. Kafetaria memiliki 23 apel. Jika mereka menggunakan 20 untuk makan siang dan membeli 6 lagi, berapa banyak apel yang mereka miliki?
Respons (dengan CoT): Kafetaria memiliki 23 apel pada awalnya. Mereka menggunakan 20 untuk membuat makan siang. Jadi mereka memiliki 23 - 20 = 3. Mereka membeli 6 apel lagi, jadi mereka memiliki 3 + 6 = 9.
```

Akibatnya, dataset CoT kurang umum dibandingkan dengan dataset instruksi lainnya.

### Penggunaan Alat

Diberikan banyaknya pengetahuan yang diperoleh model selama pre-training, banyak model mungkin secara intuitif tahu cara menggunakan alat tertentu. Namun, kemampuan penggunaan alat model dapat ditingkatkan dengan menunjukkan contoh penggunaan alat. Adalah umum untuk menggunakan ahli domain untuk membuat data penggunaan alat, di mana setiap prompt adalah tugas yang memerlukan penggunaan alat, dan responsnya adalah tindakan yang diperlukan untuk melakukan tugas tersebut. Misalnya, jika Anda ingin data untuk melakukan fine-tuning pada model untuk bertindak sebagai asisten pribadi, Anda mungkin ingin bertanya kepada asisten pribadi profesional jenis tugas apa yang biasanya mereka lakukan, bagaimana mereka melakukannya, dan alat apa yang mereka butuhkan. Jika Anda meminta ahli manusia untuk menjelaskan bagaimana mereka melakukan sesuatu, mereka mungkin melewatkan langkah-langkah tertentu, baik karena ingatan yang salah atau karena mereka mungkin berpikir langkah-langkah ini tidak penting. Sering kali perlu untuk mengamati bagaimana manusia melakukan tugas-tugas ini untuk memastikan akurasi.

Namun, apa yang efisien untuk manusia mungkin tidak efisien untuk AI, dan sebaliknya. Akibatnya, anotasi manusia mungkin tidak ideal untuk agen AI. Misalnya, manusia mungkin lebih memilih antarmuka web, sedangkan lebih mudah bagi model untuk menggunakan API. Untuk mencari sesuatu, manusia mungkin pertama-tama membuka browser, menyalin dan menempelkan query tersebut ke bilah pencarian, dan mengklik setiap hasil. Sementara itu, model hanya dapat mengirim permintaan ke API pencarian dengan query dan memproses semua hasil sekaligus. Untuk alasan ini, banyak yang mengandalkan simulasi dan teknik sintetis lainnya untuk menghasilkan data penggunaan alat, seperti yang dieksplorasi nanti di bab ini.

Data penggunaan alat mungkin juga memerlukan format khusus. Dalam data percakapan biasa, pengguna dan AI bergiliran, dengan setiap giliran berisi satu pesan. Namun, untuk penggunaan alat, AI mungkin perlu menghasilkan beberapa pesan setiap giliran, dengan setiap pesan dikirim ke lokasi yang berbeda. Misalnya, AI mungkin mengirim satu pesan ke interpreter kode dan satu pesan ke pengguna (seperti untuk memberi tahu pengguna apa yang sedang dilakukannya). Untuk mendukung ini, penulis Llama 3 (Dubey et al., 2024) merancang format chat multi-pesan yang terdiri dari header pesan yang menentukan sumber dan tujuan setiap pesan, dan token terminasi khusus untuk menentukan di mana giliran manusia dan AI dimulai.

Saat mengurasi data untuk aplikasi dengan antarmuka percakapan, Anda perlu mempertimbangkan apakah Anda memerlukan data satu giliran, data multi-giliran, atau keduanya. Data satu giliran membantu melatih model untuk merespons instruksi individual. Data multi-giliran, di sisi lain, mengajarkan model cara menyelesaikan tugas—banyak tugas dunia nyata melibatkan bolak-balik. Misalnya, ketika diberi query, model mungkin perlu pertama-tama mengklarifikasi niat pengguna sebelum menangani tugas. Setelah respons model, pengguna mungkin memberikan koreksi atau informasi tambahan untuk langkah berikutnya.

Data satu giliran lebih sederhana dan, oleh karena itu, lebih mudah diperoleh. Data multi-giliran sering memerlukan skenario yang dibuat khusus atau interaksi yang lebih terlibat untuk ditangkap.

Kurasi data bukan hanya tentang membuat data baru untuk membantu model mempelajari perilaku baru tetapi juga tentang menghapus data yang ada untuk membantu model melupakan perilaku buruk. Bayangkan Anda bekerja pada chatbot seperti ChatGPT dan Anda mendengar keluhan pengguna bahwa chatbot agak sombong, mengganggu pengguna dan membuang token mereka. Misalnya, ketika pengguna memintanya untuk memverifikasi apakah suatu pernyataan secara faktual benar, chatbot merespons dengan: "Pernyataan itu benar, tetapi gayanya dapat ditingkatkan menjadi lebih baik." Kemudian chatbot terus menghasilkan penulisan ulang pernyataan yang tidak diminta.

Anda menyelidiki dan menemukan bahwa dalam data pelatihan, ada beberapa contoh anotasi dengan saran yang tidak diminta. Anda mengajukan permintaan untuk menghapus contoh-contoh ini dari data pelatihan dan permintaan lain untuk memperoleh contoh baru yang menunjukkan fact-checking tanpa penulisan ulang yang tidak diminta.

Setiap aplikasi mungkin memerlukan data dengan karakteristik yang berbeda. Fase pelatihan yang berbeda juga memerlukan campuran data yang berbeda. Secara garis besar, namun, kurasi data mengikuti tiga kriteria: kualitas data, cakupan data, dan kuantitas data.

Untuk memberikan intuisi tentang istilah-istilah ini, jika Anda menganggap pelatihan model sebagai memasak, data yang dimasukkan ke dalam model adalah bahan-bahannya. Kualitas data setara dengan kualitas bahan—Anda tidak bisa memiliki makanan yang baik jika bahan-bahannya busuk. Cakupan data setara dengan memiliki campuran bahan yang tepat (misalnya, Anda tidak boleh memiliki terlalu banyak atau terlalu sedikit gula). Kuantitas data adalah tentang berapa banyak bahan yang harus Anda miliki. Mari kita jelajahi istilah-istilah ini secara detail.

### Kualitas Data

Sejumlah kecil data berkualitas tinggi dapat mengungguli sejumlah besar data noisy, misalnya, data yang tidak relevan atau tidak konsisten. Pembuat model keluarga Yi menemukan bahwa 10K instruksi yang dibuat dengan cermat lebih unggul daripada ratusan ribu instruksi noisy (Young et al., 2024).

Demikian pula, "LIMA: Less Is More for Alignment" (Zhou et al., 2023) menunjukkan bahwa model Llama 65B parameter, yang di-fine-tune dengan 1.000 prompt dan respons yang dikurasi dengan cermat, dapat menghasilkan jawaban yang setara atau lebih disukai daripada GPT-4 dalam 43% kasus, seperti yang dinilai oleh anotator manusia. Namun, kelemahan dari memiliki terlalu sedikit contoh data adalah bahwa LIMA tidak sekuat model tingkat produk.

Tim Llama 3 juga sampai pada kesimpulan yang sama. Terutama, mereka menemukan bahwa data yang dihasilkan manusia lebih rentan terhadap kesalahan dan inkonsistensi, terutama untuk kebijakan keamanan yang bernuansa. Ini membuat mereka mengembangkan alat anotasi berbantuan AI untuk memastikan kualitas data yang tinggi.

Sebagian besar orang memahami pentingnya kualitas data, tetapi apa artinya data berkualitas tinggi? Jawaban singkatnya adalah bahwa data dianggap berkualitas tinggi jika membantu Anda melakukan pekerjaan Anda dengan efisien dan andal. Jawaban panjangnya, however, berbeda untuk orang yang berbeda.3 Secara umum, data dapat dianggap berkualitas tinggi jika memiliki enam karakteristik berikut: relevan, selaras dengan persyaratan tugas, konsisten, diformat dengan benar, unik, dan patuh. Beberapa kasus penggunaan spesifik mungkin memiliki persyaratan lain:

**Relevan**
Contoh pelatihan harus relevan dengan tugas yang Anda latih model untuk dilakukan. Misalnya, jika tugasnya adalah menjawab pertanyaan hukum hari ini, dataset hukum dari abad ke-19 mungkin tidak relevan. Namun, jika tugasnya adalah tentang sistem hukum di abad ke-19, dataset ini sangat relevan.

**Selaras dengan persyaratan tugas**
Anotasi harus selaras dengan persyaratan tugas. Misalnya, jika tugas memerlukan konsistensi faktual, anotasi harus secara faktual benar. Jika tugas memerlukan kreativitas, anotasi harus kreatif. Jika tugas menuntut tidak hanya skor tetapi juga pembenaran untuk skor tersebut, anotasi harus menyertakan skor dan pembenaran. Tetapi jika tugas menuntut jawaban yang ringkas, anotasi harus ringkas.

Saya menggunakan "selaras" daripada "akurat" atau "benar" karena, tergantung pada tugasnya, respons yang akurat atau benar mungkin bukan yang diinginkan pengguna.

**Konsisten**
Anotasi harus konsisten di seluruh contoh dan anotator. Jika Anda meminta dua anotator untuk menganotasi contoh yang sama, anotasi mereka tidak boleh terlalu berbeda. Jika tugasnya adalah memberi skor esai dari 1 hingga 5, apakah dua esai dengan skor yang sama memiliki kualitas yang sama? Anotasi yang tidak konsisten dapat membingungkan model, membuatnya lebih sulit bagi model untuk belajar.

Memiliki panduan anotasi yang baik sangat penting untuk memiliki anotasi yang selaras dengan persyaratan tugas dan konsisten.

**Diformat dengan benar**
Semua contoh harus mengikuti format yang diharapkan oleh model. Token pemformatan yang redundan dapat mengganggu pembelajaran model, dan, oleh karena itu, harus dihapus. Misalnya, jika Anda mengikis ulasan produk dari situs web, Anda harus menghapus tag HTML. Waspadai spasi tambahan, baris baru, casing yang tidak konsisten, dan format numerik.4

**Cukup unik**
Ini merujuk pada contoh unik dalam data Anda.5 Dalam konteks pelatihan model, duplikasi dapat memperkenalkan bias dan menyebabkan kontaminasi data. Saya menggunakan "cukup unik" karena kasus penggunaan spesifik dapat mentolerir tingkat duplikasi yang berbeda.

**Patuh**
Data harus mematuhi semua kebijakan internal dan eksternal yang relevan (termasuk hukum dan peraturan). Misalnya, jika Anda tidak diizinkan untuk menggunakan data PII untuk melatih model Anda, data Anda tidak boleh berisi data PII apa pun.

Sebelum memulai untuk membuat data, penting untuk memikirkan apa arti masing-masing karakteristik ini bagi Anda. Teknik yang dibahas di bagian ini bertujuan untuk menghasilkan data dengan karakteristik ini.

### Cakupan Data

Data pelatihan model harus mencakup rentang masalah yang Anda harapkan akan dipecahkan. Pengguna dunia nyata sering memiliki berbagai macam masalah, dan cara mereka mengekspresikan masalah tersebut dapat bervariasi secara signifikan. Memiliki data yang menangkap pola penggunaan aplikasi Anda yang beragam adalah kunci bagi model untuk berkinerja baik. Cakupan memerlukan keragaman data yang cukup, itulah sebabnya banyak yang menyebut atribut ini sebagai keragaman data.

Misalnya, jika beberapa pengguna menyusun instruksi terperinci dengan referensi berlimpah sementara beberapa pengguna lain lebih memilih instruksi pendek, data fine-tuning Anda harus menyertakan instruksi terperinci dan pendek. Jika query pengguna biasanya memiliki typo, Anda harus menyertakan contoh dengan typo. Jika aplikasi Anda bekerja dengan banyak bahasa pemrograman, data pelatihan Anda harus menyertakan bahasa pemrograman yang diperhatikan pengguna Anda.

Aplikasi yang berbeda memiliki dimensi keragaman yang berbeda. Misalnya, alat Prancis-ke-Inggris tidak memerlukan keragaman bahasa tetapi mungkin mendapat manfaat dari keragaman topik, panjang, dan gaya bicara. Di sisi lain, chatbot yang merekomendasikan produk kepada pelanggan global tidak selalu memerlukan keragaman domain, tetapi keragaman linguistik dan budaya akan penting.

Untuk kasus penggunaan tujuan umum seperti chatbot, data fine-tuning harus beragam, mewakili berbagai topik dan pola bicara. Ding et al., (2023) percaya bahwa cara paling langsung untuk lebih lanjut meningkatkan performa model bahasa chat adalah dengan meningkatkan kualitas dan keragaman data yang digunakan dalam proses pelatihan. Untuk mengembangkan Nemotron (Adler et al., 2024), peneliti NVIDIA berfokus pada pembuatan dataset dengan keragaman tugas, keragaman topik, dan keragaman instruksi, yang mencakup instruksi untuk format output yang berbeda, instruksi dengan panjang output yang berbeda, dan instruksi untuk jawaban terbuka serta jawaban ya-atau-tidak. "The Data Addition Dilemma" (Shen et al., 2024) menunjukkan bahwa dalam beberapa kasus, menambahkan data yang lebih heterogen dapat menyebabkan performa yang lebih buruk.

Meta membagikan bahwa Llama 3 tidak menyimpang secara signifikan dari versi Llama yang lebih lama dalam hal arsitektur model. Peningkatan performa Llama 3 "terutama didorong oleh peningkatan kualitas dan keragaman data serta oleh peningkatan skala pelatihan."

Makalah Llama 3 memiliki detail kaya tentang cakupan data melalui ketiga fase pelatihan: pre-training, supervised finetuning, dan preference finetuning. Meskipun bab ini berfokus pada data post-training, berguna untuk melihat campuran data untuk model yang sama di semua fase pelatihan yang berbeda untuk membandingkan dan menyoroti pertimbangan untuk setiap fase.

Sumbu keragaman yang konsisten di ketiga fase adalah keragaman domain, meskipun apa yang sebenarnya beragam berbeda, seperti yang ditunjukkan pada Tabel 8-1. Tabel ini hanya menunjukkan domain tingkat tinggi dan tidak menyertakan topik yang lebih terperinci, seperti "geometri", yang merupakan sub-kategori dalam matematika. Data post-training juga memiliki sumbu keragaman yang berbeda yang tidak ditunjukkan dalam tabel, seperti jumlah token (baik untuk konteks maupun respons) dan jumlah giliran. Llama 3 menggunakan data sintetis untuk post-training, jadi dimensi lain adalah rasio data yang dihasilkan manusia terhadap data yang dihasilkan AI.

**Tabel 8-1.** Untuk Llama 3, fase pelatihan yang berbeda memiliki campuran domain optimal yang berbeda.

| | Pre-training | Supervised finetuning | Preference finetuning |
|---|---|---|---|
| Pengetahuan umum (Inggris) | 50% | 52,66% | 81,99% |
| Matematika dan penalaran | 25% | 21,19% | 5,89% |
| Coding | 17% | 14,89% | 6,93% |
| Multibahasa | 8% | 3,01% | 5,19% |
| Seperti ujian | X | 8,14% | X |
| Konteks panjang | X | 0,11% | X |

Sangat menarik untuk dicatat bahwa selama pre-training dan supervised finetuning, jumlah gabungan token matematika, penalaran, dan kode menyumbang hampir setengah dari data pelatihan. Meskipun saya tidak tahu persis berapa persentase data internet adalah matematika dan kode, saya percaya bahwa itu jauh di bawah 50%. Penulis Llama 3 membagikan bahwa annealing model pada sejumlah kecil kode dan data matematika berkualitas tinggi (melatih model menggunakan learning rate yang semakin kecil dengan semakin banyak data kode dan matematika) dapat meningkatkan performa model mereka pada benchmark kunci. Ini mengkonfirmasi kepercayaan umum bahwa kode dan data matematika berkualitas tinggi lebih efektif daripada teks bahasa alami dalam meningkatkan kemampuan penalaran model.

Persentase data kode dan matematika selama preference finetuning jauh lebih kecil (12,82% gabungan), kemungkinan karena tujuannya adalah untuk mencerminkan distribusi nyata preferensi pengguna.

Ini memunculkan pertanyaan: Bagaimana kita memutuskan campuran data yang tepat? Pendekatan sederhana adalah memilih campuran data yang secara akurat mencerminkan penggunaan aplikasi dunia nyata. Anda juga dapat menggunakan eksperimen untuk menemukan campuran data optimal. Misalnya, Meta melakukan eksperimen hukum penskalaan serupa dengan yang dibahas di "Scaling extrapolation" pada halaman 74. Untuk setiap kandidat campuran data, mereka melatih beberapa model kecil pada campuran data dan menggunakan itu untuk memprediksi performa model besar pada campuran tersebut. Campuran model akhir adalah campuran tebakan terbaik yang berasal dari hasil eksperimen.

Untuk mengevaluasi dampak keragaman dan kualitas data, Zhou et al. (2023) melakukan eksperimen menarik di mana mereka melatih model bahasa 7B parameter pada tiga dataset dengan ukuran yang sama—2.000 contoh—tetapi dengan karakteristik yang berbeda. Yang pertama berkualitas tinggi tetapi tidak beragam. Yang kedua beragam tetapi berkualitas rendah. Yang ketiga beragam dan berkualitas tinggi. Gambar 8-1 menunjukkan kualitas generasi dari ketiga model yang dihasilkan.

**Gambar 8-1.** Model 7B parameter, yang di-fine-tune pada dataset yang berkualitas tinggi dan beragam, mengungguli model yang sama yang di-fine-tune pada dataset yang beragam atau berkualitas tinggi. Gambar dari Zhou et al. (2023). Gambar dilisensikan di bawah CC BY 4.0.

### Kuantitas Data

Bertanya berapa banyak data yang Anda butuhkan seperti bertanya berapa banyak uang yang Anda butuhkan. Jawabannya sangat bervariasi dari satu situasi ke situasi lain. Di satu ekstrem, Jeremy Howard dan Jonathan Whitaker melakukan eksperimen menyenangkan untuk menunjukkan bahwa LLM dapat belajar dari satu contoh. Di ekstrem lain, beberapa tim telah melakukan fine-tuning pada model dengan jutaan contoh.

Meskipun jutaan contoh terdengar banyak, itu kecil dibandingkan dengan data yang biasanya diperlukan untuk melatih model foundation dari awal. Sebagai referensi, Llama 2 dan Llama 3 dilatih menggunakan 2 triliun dan 16 triliun token, masing-masing. Jika setiap contoh adalah 2.000 token, itu akan setara dengan 1 miliar dan 15 miliar contoh.

Anda mungkin bertanya-tanya: jika saya memiliki jutaan contoh, bukankah saya harus melatih model dari awal? Anda bisa dan harus mengevaluasi apakah melatih model dari awal akan meningkatkan performa Anda. Meskipun fine-tuning di atas model pre-trained biasanya lebih efisien daripada pelatihan dari awal, ada situasi ketika fine-tuning bisa lebih buruk, terutama ketika Anda memiliki banyak data pelatihan. Ini karena fenomena yang disebut ossification, di mana pre-training dapat mengosifikasi (yaitu, membekukan) weight model sehingga mereka tidak beradaptasi dengan baik dengan data fine-tuning (Hernandez et al., 2021). Model yang lebih kecil lebih rentan terhadap ossification daripada model yang lebih besar.

Selain kualitas data dan keragaman data, tiga faktor lain mempengaruhi berapa banyak data yang Anda butuhkan:

**Teknik fine-tuning**
Full fine-tuning menjanjikan untuk memberikan performa terbaik, tetapi memerlukan orde magnitudo lebih banyak data daripada metode PEFT seperti LoRA. Jika Anda memiliki puluhan ribu hingga jutaan pasangan (instruksi, respons), Anda mungkin ingin mencoba full fine-tuning. Jika Anda hanya memiliki beberapa ratus atau beberapa ribu contoh, PEFT mungkin bekerja terbaik.

**Kompleksitas tugas**
Tugas sederhana, seperti mengklasifikasikan apakah ulasan produk positif atau negatif, akan memerlukan jauh lebih sedikit data daripada tugas kompleks, seperti tanya-jawab tentang laporan keuangan.

**Performa model dasar**
Semakin dekat model dasar dengan performa yang diinginkan, semakin sedikit contoh yang diperlukan untuk sampai ke sana. Dengan asumsi bahwa model dasar yang lebih besar lebih baik, Anda mungkin memerlukan lebih sedikit contoh untuk melakukan fine-tuning pada model besar. Ini adalah kebalikan dari pre-training, di mana model yang lebih besar memerlukan lebih banyak data pelatihan.

Panduan fine-tuning OpenAI menunjukkan bahwa jika Anda memiliki lebih sedikit contoh (100), model yang lebih canggih memberi Anda performa fine-tuning yang lebih baik. Ini kemungkinan karena model yang lebih canggih sudah berkinerja lebih baik langsung dari kotak. Namun, setelah fine-tuning pada banyak contoh (550.000), kelima model dalam eksperimen berkinerja serupa, seperti yang diilustrasikan pada Gambar 8-2.

**Gambar 8-2.** Dengan 100 contoh, model yang lebih canggih memberikan performa yang jauh lebih baik setelah fine-tuning. Dengan 550.000 contoh, semua model memberikan performa yang serupa setelah fine-tuning. Eksperimen dilakukan oleh Stanford Natural Language Inference (SNLI) Corpus.

Singkatnya, jika Anda memiliki sejumlah kecil data, Anda mungkin ingin menggunakan metode PEFT pada model yang lebih canggih. Jika Anda memiliki sejumlah besar data, gunakan full fine-tuning dengan model yang lebih kecil.

Sebelum berinvestasi dalam mengurasi dataset besar, Anda mungkin ingin memulai dengan dataset kecil yang dibuat dengan baik (misalnya, 50 contoh) untuk melihat apakah fine-tuning dapat meningkatkan model. Jika dataset kecil ini cukup untuk mencapai performa yang Anda inginkan, itu bagus. Peningkatan yang jelas menunjukkan bahwa lebih banyak data akan meningkatkan performa lebih jauh. Jika tidak ada peningkatan yang diamati dengan data kecil, dataset yang lebih besar jarang akan berhasil.

Namun, berhati-hatilah sebelum menyimpulkan bahwa fine-tuning dengan dataset kecil tidak meningkatkan model. Banyak hal, selain data, dapat mempengaruhi hasil fine-tuning, seperti pilihan hyperparameter (misalnya, learning rate terlalu tinggi atau terlalu rendah), kualitas data, prompt yang dibuat dengan buruk, dll. Dalam sebagian besar kasus, Anda seharusnya melihat peningkatan setelah fine-tuning dengan 50-100 contoh.

Dimungkinkan untuk mengurangi jumlah data berkualitas tinggi yang dibutuhkan dengan pertama-tama melakukan fine-tuning pada model Anda menggunakan data berkualitas lebih rendah atau kurang relevan. Berikut adalah tiga contoh pendekatan ini:

**Self-supervised → supervised**
Anda ingin melakukan fine-tuning pada model untuk menjawab pertanyaan hukum. Set (pertanyaan, jawaban) Anda kecil, tetapi Anda memiliki banyak dokumen hukum. Anda dapat pertama-tama melakukan fine-tuning pada model Anda pada dokumen hukum secara self-supervised, kemudian lebih lanjut melakukan fine-tuning pada model pada pasangan (pertanyaan, jawaban).

**Data kurang relevan → data relevan**
Anda ingin melakukan fine-tuning pada model untuk mengklasifikasikan sentimen untuk ulasan produk, tetapi Anda memiliki sedikit data sentimen produk dan jauh lebih banyak data sentimen tweet. Anda dapat pertama-tama melakukan fine-tuning pada model Anda untuk mengklasifikasikan sentimen tweet, kemudian lebih lanjut melakukan fine-tuning untuk mengklasifikasikan sentimen produk.

**Data sintetis → data nyata**
Anda ingin melakukan fine-tuning pada model untuk memprediksi kondisi medis dari laporan medis. Karena sifat sensitif tugas ini, data Anda terbatas. Anda dapat menggunakan model AI untuk mensintesis sejumlah besar data untuk melakukan fine-tuning pada model Anda terlebih dahulu, kemudian lebih lanjut melakukan fine-tuning pada data nyata Anda. Pendekatan ini lebih sulit untuk dilakukan dengan benar, karena Anda harus melakukan dua pekerjaan fine-tuning yang berbeda sambil mengkoordinasikan transisi di antara keduanya. Jika Anda tidak tahu apa yang Anda lakukan, Anda mungkin akhirnya menggunakan lebih banyak komputasi hanya untuk menghasilkan model yang lebih buruk dari yang akan Anda dapatkan dengan hanya melakukan fine-tuning dengan data berkualitas tinggi.6

Bereksperimen dengan dataset kecil dapat membantu Anda memperkirakan berapa banyak lebih banyak data yang Anda perlukan. Anda dapat melakukan fine-tuning pada model pada subset dari dataset Anda saat ini—misalnya, 25%, 50%, 100%—dan memplot bagaimana performa skala dengan ukuran dataset. Kemiringan peningkatan performa yang curam dengan meningkatnya ukuran dataset berarti bahwa Anda dapat mengharapkan peningkatan performa yang signifikan dengan menggandakan data Anda. Kemiringan datar berarti bahwa menggandakan data Anda hanya akan memberikan peningkatan kecil. Gambar 8-3 menunjukkan contoh plot ini.

**Gambar 8-3.** Kurva peningkatan performa dengan ukuran dataset yang berbeda dapat membantu Anda memperkirakan dampak contoh pelatihan tambahan pada performa model Anda.

Kurva peningkatan performa yang ditunjukkan pada Gambar 8-3 cukup umum. Dalam kebanyakan kasus, contoh pelatihan tambahan menghasilkan pengembalian yang semakin menurun: jumlah contoh yang sama biasanya memberikan peningkatan performa yang lebih rendah seiring dataset tumbuh. Misalnya, 1.000 contoh pertama mungkin meningkatkan akurasi model sebesar sepuluh poin persentase, tetapi 1.000 contoh berikutnya mungkin hanya meningkatkannya sebesar lima.

Meskipun jumlah contoh fine-tuning yang lebih besar umumnya meningkatkan performa model, keragaman contoh juga penting. Makalah "Scaling Instruction-Finetuned Language Models" (Chung et al., 2022) menunjukkan bahwa performa model meningkat secara signifikan ketika jumlah tugas fine-tuning meningkat dari 9 menjadi 282. Di luar 282 tugas, peningkatan performa mulai datar, meskipun masih ada peningkatan positif tetapi bertahap hingga 1.836 tugas, seperti yang ditunjukkan pada Gambar 8-4. Ini menunjukkan bahwa model sangat benefiting dari paparan berbagai tugas yang beragam selama fine-tuning.

Keragaman data dapat tercermin dalam jenis tugas (seperti ringkasan dan tanya-jawab), keragaman topik (seperti fashion, keuangan, dan teknologi), dan format output yang diharapkan (seperti output JSON atau jawaban ya-atau-tidak).

**Gambar 8-4.** Keragaman dalam jumlah fine-tuning, diukur dengan jumlah tugas, dapat mempengaruhi performa model. Gambar dari "Scaling Instruction-Finetuned Language Models" (Chung et al., 2022). Gambar dilisensikan di bawah CC BY 4.0.

Berapa banyak data yang digunakan untuk fine-tuning ditentukan tidak hanya oleh apa yang Anda butuhkan tetapi juga oleh apa yang Anda mampu. Jika Anda menganggarkan $10.000 untuk anotasi data dan setiap contoh biaya $2 untuk dianotasi, Anda dapat memiliki paling banyak 5.000 contoh. Anda mungkin juga perlu menyeimbangkan anggaran untuk data dan komputasi. Menghabiskan lebih banyak uang untuk data meninggalkan lebih sedikit uang untuk komputasi, dan sebaliknya.

## Akuisisi dan Anotasi Data

Tujuan akuisisi data adalah untuk menghasilkan dataset yang cukup besar dengan kualitas dan keragaman yang Anda butuhkan, sambil memastikan bahwa praktik data Anda menghormati privasi pengguna dan mematuhi peraturan. Akuisisi data melibatkan pengumpulan data melalui metode seperti sumber data publik, pembelian data proprietari, anotasi data, dan sintesis data. Ada bidang penelitian niche tetapi berkembang dalam strategi akuisisi data: cara terbaik untuk memperoleh dataset yang memenuhi persyaratan tertentu dengan anggaran tertentu.

Sumber data yang paling penting, however, biasanya adalah data dari aplikasi Anda sendiri. Jika Anda dapat menemukan cara untuk membuat data flywheel yang memanfaatkan data yang dihasilkan oleh pengguna Anda untuk terus meningkatkan produk Anda, Anda akan mendapatkan keuntungan yang signifikan.7 Data aplikasi ideal karena sangat relevan dan selaras dengan tugas Anda. Dengan kata lain, data ini cocok dengan distribusi data yang Anda pedulikan, yang sangat sulit dicapai dengan sumber data lainnya. Data yang dihasilkan pengguna dapat berupa konten pengguna, data yang dihasilkan sistem dari penggunaan pengguna, atau umpan balik pengguna. Cara merancang sistem umpan balik pengguna Anda dibahas di Bab 10.

Sebelum berinvestasi dalam membuat data Anda sendiri, periksa dataset yang tersedia terlebih dahulu. Pasar data sangat luas dan menawarkan data open source dan proprietari. Jika Anda beruntung, beberapa dari mereka mungkin persis apa yang Anda butuhkan. Namun, ini sering kali merupakan pendekatan mix-and-match. Dataset dapat dikembangkan dari banyak sumber data melalui banyak saluran akuisisi. Misalnya, proses membuat dataset (instruksi, respons) mungkin terlihat sebagai berikut:

1. Temukan dataset yang tersedia dengan karakteristik yang diinginkan. Anda mungkin menemukan satu dataset yang menjanjikan dengan 10.000 contoh.
2. Hapus instruksi berkualitas rendah. Katakanlah ini menyisakan Anda dengan 9.000 contoh.
3. Sisihkan instruksi dengan respons berkualitas rendah. Katakanlah Anda menemukan 3.000 contoh seperti itu. Ini menyisakan Anda dengan 6.000 contoh instruksi berkualitas tinggi dan respons berkualitas tinggi.
4. Tulis respons secara manual untuk 3.000 instruksi berkualitas tinggi. Sekarang dataset Anda memiliki total 9.000 contoh berkualitas tinggi.
5. Menyadari bahwa tidak ada cukup data untuk topik X, buat secara manual satu set 100 template instruksi tentang X. Gunakan model AI untuk mensintesis 2.000 instruksi menggunakan 10 template ini.
6. Anotasi secara manual 2.000 instruksi sintetis ini. Sekarang dataset Anda memiliki total 11.000 contoh.

Ini, tentu saja, adalah penyederhanaan yang berlebihan dari proses kurasi dataset yang sebenarnya, dengan sebagian besar langkah tersembunyi untuk menghemat kertas dan menyelamatkan pembaca dari kebosanan. Misalnya, mungkin ada beberapa langkah di mana Anda menyadari bahwa banyak anotasi tidak membantu, jadi Anda harus memperbarui panduan anotasi dan menganotasi ulang data Anda. Lebih buruk lagi, Anda mungkin menemukan bahwa beberapa di antaranya secara faktual salah, jadi Anda harus menyewa anotator lain untuk fact-check anotasi asli Anda. Atau Anda mungkin menemukan bahwa memiliki 100 instruksi sintetis per template merusak keragaman data Anda, jadi Anda harus membuat lebih banyak template dan menghasilkan lebih sedikit instruksi per template. Dan seterusnya.

### Sumber Daya untuk Dataset yang Tersedia untuk Publik

Berikut adalah beberapa sumber daya di mana Anda dapat mencari dataset yang tersedia untuk publik. Meskipun Anda harus memanfaatkan data yang tersedia, Anda tidak boleh sepenuhnya mempercayainya. Data perlu diperiksa dan divalidasi secara menyeluruh.

Selalu periksa lisensi dataset sebelum menggunakannya. Lakukan yang terbaik untuk memahami dari mana data berasal. Bahkan jika dataset memiliki lisensi yang mengizinkan penggunaan komersial, mungkin sebagian berasal dari sumber yang tidak mengizinkan:

1. Hugging Face dan Kaggle masing-masing menampung ratusan ribu dataset.
2. Google memiliki Dataset Search yang bagus dan kurang dihargai.
3. Pemerintah sering kali merupakan penyedia data terbuka yang hebat. Data.gov menampung ratusan ribu dataset, dan data.gov.in menampung puluhan ribu.
4. Institute for Social Research ICPSR dari University of Michigan memiliki data dari puluhan ribu studi sosial.
5. Machine Learning Repository dari UC Irvine dan OpenML adalah dua repositori dataset yang lebih tua, masing-masing menampung beberapa ribu dataset.
6. Open Data Network memungkinkan Anda mencari di antara puluhan ribu dataset.
7. Penyedia layanan cloud sering menampung koleksi kecil dataset terbuka; yang paling terkenal adalah Open Data dari AWS.
8. Framework ML sering memiliki dataset bawaan kecil yang dapat Anda muat saat menggunakan framework, seperti dataset TensorFlow.
9. Beberapa alat evaluasi harness menampung dataset benchmark evaluasi yang cukup besar untuk fine-tuning PEFT. Misalnya, lm-evaluation-harness dari Eleuther AI menampung 400+ dataset benchmark, rata-rata 2.000+ contoh per dataset.
10. Stanford Large Network Dataset Collection adalah repositori hebat untuk dataset graf.

Sering kali, Anda mungkin perlu menganotasi data Anda sendiri untuk fine-tuning. Anotasi menantang bukan hanya karena proses anotasi tetapi juga karena kompleksitas membuat panduan anotasi yang jelas. Misalnya, Anda perlu secara eksplisit menyatakan seperti apa respons yang baik, dan apa yang membuatnya baik. Dapatkah respons benar tetapi tidak membantu? Apa perbedaan antara respons yang pantas mendapat skor 3 dan 4? Panduan anotasi diperlukan untuk anotasi manual maupun bertenaga AI.

Beberapa tim, termasuk LinkedIn, telah melaporkan bahwa panduan anotasi adalah bagian paling menantang dari pipeline engineering AI mereka. Mengagetkan betapa seringnya orang meninggalkan anotasi yang cermat di tengah jalan karena waktu dan upaya yang diperlukan, berharap sebagai gantinya bahwa model mereka akan mencari tahu respons yang tepat sendiri. Banyak model cukup kuat sehingga mereka kadang-kadang bisa berhasil, tetapi mengandalkan model untuk mencari tahu itu mungkin terlalu berisiko untuk banyak aplikasi.

Kabar baiknya adalah bahwa panduan ini sama dengan panduan untuk data evaluasi, seperti yang dibahas di Bab 4. Ini adalah argumen lain mengapa Anda harus menginvestasikan lebih banyak waktu dalam mengurasi panduan dan data evaluasi. Jika Anda beruntung, contoh evaluasi Anda dapat diperkaya atau digunakan sebagai contoh benih untuk mensintesis data baru. Di bagian berikutnya kita akan membahas cara melakukannya.

## Augmentasi dan Sintesis Data

Bersama dengan komputasi dan bakat, data adalah tantangan terkeras AI. Menghasilkan data secara terprogram telah menjadi tujuan jangka panjang seluruh industri. Dua proses yang umum digunakan adalah augmentasi data dan sintesis data:

- **Augmentasi data** membuat data baru dari data yang ada (yang nyata). Misalnya, diberikan gambar nyata seekor kucing, Anda dapat membaliknya untuk membuat gambar baru dari kucing yang sama.8
- **Sintesis data** menghasilkan data untuk meniru properti data nyata. Misalnya, Anda dapat mensimulasikan bagaimana mouse bergerak melalui halaman web untuk menghasilkan data seperti apa gerakan bot.

Dengan kata lain, data yang diperkaya berasal dari data nyata, sedangkan data sintetis tidak nyata. Namun, karena tujuan augmentasi dan sintesis adalah untuk mengotomatisasi pembuatan data, kadang-kadang kedua istilah ini digunakan secara bergantian. Dalam bab ini, saya akan sering menggunakan sintesis data untuk merujuk pada keduanya.

Data yang dihasilkan secara artifisial memiliki sejarah panjang dalam rekayasa perangkat lunak. Ini awalnya digunakan untuk menghasilkan data palsu untuk tujuan pengujian. Misalnya, pustaka seperti Faker dan Chance memungkinkan Anda menghasilkan data dalam format sederhana seperti nama, alamat, nomor telepon, dan alamat email untuk pengujian. Katakanlah Anda telah membangun program untuk mengurai alamat pengiriman. Anda dapat menggunakan generator data palsu untuk menghasilkan alamat di berbagai negara dan bagian dengan format yang berbeda untuk memastikan program Anda dapat mengurai semuanya.

Dengan AI yang mampu menghasilkan data yang tidak dapat dibedakan dari yang dihasilkan oleh manusia, dimungkinkan untuk mensintesis data yang jauh lebih canggih, seperti catatan dokter, kontrak, laporan keuangan, deskripsi produk, gambar, iklan video, dll. Ini membuat lebih mudah untuk menghasilkan data dan memungkinkan lebih banyak kasus penggunaan data sintetis.

Meskipun data sintetis berjanji untuk secara signifikan mengurangi tekanan untuk data yang dihasilkan manusia, data sintetis tidak sepenuhnya menggantikan data manusia. Dalam banyak kasus penggunaan, seperti yang dibahas di "Keterbatasan data yang dihasilkan AI" pada halaman 393, mencampur data yang dihasilkan manusia dan AI sering menghasilkan nilai terbaik.

### Mengapa Sintesis Data

Data sintetis menarik karena banyak alasan. Anda dapat mensintesis data untuk meningkatkan trio data emas: kuantitas, cakupan, dan kualitas. Anda juga dapat mensintesis data untuk mengurangi kekhawatiran privasi dan mendistilasi model:

**Untuk meningkatkan kuantitas data**
Alasan terbesar untuk sintesis data adalah bahwa ini memungkinkan Anda menghasilkan data dalam skala besar, menjanjikan pasokan data yang berlimpah untuk melatih dan menguji model AI. Lebih banyak data, secara teori, membantu model menggeneralisasi ke berbagai tugas yang lebih luas. Ini sangat membantu ketika data dunia nyata langka atau sulit diperoleh, seperti data untuk kondisi cuaca langka, data untuk eksplorasi laut dalam, atau data yang melibatkan kecelakaan untuk mobil self-driving.

**Untuk meningkatkan cakupan data**
Anda dapat menghasilkan data dengan karakteristik yang ditargetkan untuk meningkatkan performa model atau untuk membuat model mengekspresikan perilaku tertentu. Misalnya, Anda dapat menghasilkan teks yang sangat pendek atau teks yang sangat panjang. Anda dapat membuat percakapan yang berisi frasa beracun untuk model deteksi beracun. Sebaliknya, jika data dunia nyata beracun, Anda dapat mensintesis data yang aman. Sangat umum untuk menggunakan AI untuk mensintesis contoh adversarial. Juga dimungkinkan untuk menghasilkan data untuk kelas langka untuk mengatasi tantangan ketidakseimbangan kelas. Seperti yang dijelaskan dalam "TrueTeacher", Gekhman et al. (2022) menggunakan LLM untuk menghasilkan ringkasan yang secara faktual tidak konsisten yang kemudian mereka gunakan untuk melatih model untuk mendeteksi inkonsistensi faktual.

Dalam makalah mereka, "Discovering Language Model Behaviors with Model-Written Evaluations" (Perez et al., 2022), Anthropic membahas berbagai teknik sintesis data untuk menghasilkan dataset spesifik yang dapat menguji 154 perilaku AI yang berbeda, termasuk sifat kepribadian, pandangan politik, sikap etika, dan bias sosial. Mereka menemukan bahwa dalam perbandingan head-to-head antara dataset yang dihasilkan LM (language model) dan yang dihasilkan manusia, "dataset yang ditulis LM mendekati kualitas yang ditulis manusia, kadang-kadang bahkan melampauinya."

Dengan kata lain, Anda dapat menggunakan data sintetis untuk meningkatkan cakupan data: menghasilkan data yang ditargetkan untuk mencakup area di mana data yang ada tidak cukup.

**Untuk meningkatkan kualitas data**
Meskipun persepsi umum adalah bahwa data sintetis sering berkualitas lebih rendah daripada data yang dihasilkan manusia, kadang-kadang, sebaliknya bisa benar. Terkadang, manusia mungkin memiliki keterbatasan fundamental yang menyebabkan data yang dihasilkan manusia berkualitas lebih rendah daripada data yang dihasilkan AI. Satu contoh adalah data penggunaan alat yang dibahas sebelumnya—manusia dan AI memiliki mode operasi dan preferensi alat yang secara fundamental berbeda. Contoh lainnya adalah dalam menghasilkan masalah matematika yang kompleks—AI dapat menghasilkan pertanyaan yang jauh lebih kompleks daripada yang mungkin dikonsepsikan oleh ahli manusia rata-rata.9

Beberapa tim juga lebih memilih menggunakan AI untuk menghasilkan data preferensi. Meskipun setiap individu manusia dapat agak konsisten dalam preferensi mereka, performa di antara orang yang berbeda cenderung bervariasi secara signifikan, dipengaruhi tidak hanya oleh preferensi setiap orang tetapi juga oleh suasana hati dan motivasi. Peringkat preferensi yang dihasilkan AI, sebaliknya, dapat jauh lebih konsisten dan andal.

**Untuk mengurangi kekhawatiran privasi**
Data sintetis sering merupakan satu-satunya pilihan untuk kasus penggunaan di mana Anda tidak dapat menggunakan data yang dihasilkan manusia karena kekhawatiran privasi. Misalnya, dalam perawatan kesehatan, di mana legislasi membuatnya sulit, jika tidak mustahil, untuk menggunakan catatan pasien nyata untuk melatih model, Anda dapat menghasilkan catatan pasien sintetis yang tidak berisi informasi sensitif apa pun. Dalam asuransi, Anda dapat menggunakan klaim sintetis alih-alih menggunakan klaim nyata yang mencakup informasi pribadi dan keuangan yang sensitif.

**Untuk mendistilasi model**
Terkadang, Anda mungkin ingin melatih model untuk meniru perilaku model lain. Tujuannya sering kali untuk membuat model yang lebih murah dan/atau lebih cepat (model yang didistilasi) dengan performa yang sebanding dengan model asli. Ini dilakukan dengan melatih model yang didistilasi menggunakan data yang dihasilkan oleh model asli.

Ini hanyalah lima dari banyak alasan mengapa orang beralih ke sintesis data. Karena daya tariknya yang tidak dapat disangkal, lebih banyak model dilatih dengan data sintetis dan lebih banyak teknik dikembangkan untuk mensintesis data.

### Teknik Sintesis Data Tradisional

Sintesis data tidak unik untuk AI. Ini memiliki sejarah panjang dalam pengujian perangkat lunak, gaming, dan robotika. Menggunakan algoritma untuk menghasilkan data juga disebut generasi prosedural, sebagai lawan dari generasi manual. Generasi prosedural umum digunakan dalam gaming untuk menghasilkan konten seperti level, peta, item, dan karakter secara langsung.10 Sebagian besar teknik generasi data yang digunakan dalam industri ini dapat diterapkan ke AI.

Secara tradisional, dua pendekatan untuk sintesis dan augmentasi data adalah berbasis aturan dan simulasi. Metode yang lebih baru yang dimungkinkan oleh model AI canggih adalah menggunakan AI itu sendiri untuk mensintesis data. Bagian ini memberikan gambaran singkat tentang dua teknik tradisional ini sebelum beralih ke sintesis data bertenaga AI di bagian berikutnya.

#### Sintesis Data Berbasis Aturan

Cara paling sederhana untuk menghasilkan data adalah dengan menggunakan aturan dan template yang telah ditentukan. Misalnya, untuk membuat transaksi kartu kredit, mulai dengan template transaksi dan gunakan generator acak seperti Faker untuk mengisi setiap bidang dalam template ini:

```
Contoh template transaksi.
Transaction ID: [Unique Identifier]
Date: [MM/DD/YYYY]
Time: [HH:MM:SS]
Amount: [Transaction Amount]
Merchant Name: [Merchant/Store Name]
Merchant Category: [Category Code]
Location: [City, State, Country]
Payment Method: [Credit Card/Debit Card/Cash/Online Payment]
Transaction Status: [Completed/Pending/Failed]
Description: [Transaction Description]
```

Karena sensitivitas data transaksi, banyak model deteksi penipuan pertama-tama dilatih pada data transaksi sintetis yang dihasilkan dari template seperti ini untuk membuktikan kelayakan mereka sebelum diberi akses ke data nyata.

Adalah umum untuk menggunakan template untuk menghasilkan dokumen yang mengikuti struktur tertentu, seperti faktur, resume, formulir pajak, laporan bank, agenda acara, katalog produk, kontrak, file konfigurasi, dll. Template juga dapat digunakan untuk menghasilkan data yang mengikuti tata bahasa dan sintaksis tertentu, seperti ekspresi reguler dan persamaan matematika. Anda dapat menggunakan template untuk menghasilkan persamaan matematika untuk model AI untuk dipecahkan. DeepMind melatih model geometri tingkat Olimpiade, AlphaGeometry, menggunakan 100 juta contoh sintetis (Trinh et al., 2024).

Anda dapat menghasilkan data baru secara prosedural dari data yang ada dengan menerapkan transformasi sederhana. Untuk gambar, Anda dapat secara acak memutar, memotong, menskala, atau menghapus bagian dari gambar. Gambar terbalik dari seekor kucing seharusnya masih menjadi kucing. Gambar yang sedikit dipotong dari pertandingan sepak bola seharusnya masih menjadi pertandingan sepak bola. Krizhevsky et al. (2012) mendemonstrasikan dalam makalah AlexNet legendaris mereka kegunaan teknik ini dengan menggunakannya untuk memperkaya dataset ImageNet (Deng et al., 2009).

Untuk teks, Anda dapat secara acak mengganti kata dengan kata yang mirip, dengan asumsi bahwa penggantian ini tidak akan mengubah makna atau sentimen kalimat. Misalnya, kalimat asli "Dia adalah perawat yang fantastis" dapat menghasilkan contoh baru: "Dia adalah perawat yang hebat".

Pendekatan ini dapat digunakan untuk mengurangi potensi bias dalam data Anda. Jika Anda khawatir ada bias gender dalam data Anda, di mana, misalnya, kata "perawat" dikaitkan dengan wanita sementara kata "dokter" dikaitkan dengan pria, Anda dapat mengganti kata-kata yang biasanya bergender dengan lawan mereka, seperti "dia" (perempuan) dengan "dia" (laki-laki), seperti yang ditunjukkan pada Tabel 8-2.

**Tabel 8-2.** Augmentasi data dapat membantu mengurangi bias tertentu dalam data Anda.

| Data Asli | Data yang Diperkaya |
|---|---|
| Dia (perempuan) adalah perawat yang fantastis. | Dia (laki-laki) adalah perawat yang fantastis. |
| Dia (perempuan) adalah dokter yang fantastis. | |
| CEO perusahaan, Tn. Alex Wang, ... | CEO perusahaan, Nn. Alexa Wang, ... |
| Hari ini, ibu saya membuat casserole untuk makan malam. | Hari ini, ayah saya membuat casserole untuk makan malam. |
| Emily selalu menyukai biola. | Mohammed selalu menyukai biola. |

Kata-kata yang mirip dapat ditemukan baik dengan kamus kata sinonim atau dengan menemukan kata-kata yang embedding-nya berdekatan satu sama lain dalam ruang embedding kata. Anda dapat melampaui penggantian kata sederhana dengan meminta AI untuk memparafrase atau menerjemahkan contoh, seperti yang akan kita bahas nanti.

Satu transformasi yang menarik adalah perturbasi: menambahkan noise ke data yang ada untuk menghasilkan data baru. Awalnya, peneliti menemukan bahwa mengganggu sampel data sedikit dapat menipu model untuk salah mengklasifikasikannya. Misalnya, menambahkan white noise ke gambar kapal dapat menyebabkan model salah mengklasifikasikannya sebagai mobil. Makalah "One Pixel Attack for Fooling Deep Neural Networks" (Su et al., 2017) menunjukkan bahwa 67,97% gambar alami dalam dataset uji Kaggle CIFAR-10 dan 16,04% gambar uji ImageNet dapat salah diklasifikasikan dengan hanya mengubah satu piksel. Ini menimbulkan risiko serius jika dieksploitasi. Penyerang dapat menipu model AI untuk salah mengidentifikasi mereka sebagai karyawan yang berwenang atau membuat mobil self-driving salah mengidentifikasi pembagi untuk jalur, menyebabkan kecelakaan.

Anda dapat melatih model Anda pada data yang terganggu. Perturbasi dapat meningkatkan performa model dan membuatnya lebih kuat terhadap serangan; lihat Goodfellow et al., 2013 dan Moosavi-Dezfooli et al., 2015. Pada tahun 2019, Hendrycks dan Dietterich membuat ImageNet-C dan ImageNet-P dengan menerapkan 15 korupsi visual umum, seperti mengubah kecerahan, menambahkan salju, mengubah kontras, dan menambahkan noise ke gambar ImageNet.

Perturbasi juga dapat digunakan untuk teks. Misalnya, untuk melatih BERT, penulis mengganti 1,5% token dengan kata acak (Devlin et al., 2018). Mereka menemukan perturbasi ini menyebabkan peningkatan performa kecil.

Data visual dapat diperkaya menggunakan algoritma yang lebih canggih. Snap (2022) memiliki studi kasus hebat tentang bagaimana mereka memperkaya aset mereka untuk membuat corner case yang tidak terwakili dan mengurangi bias implisit dalam data mereka. Diberikan sebuah karakter, mereka mensintesis karakter yang mirip tetapi dengan warna kulit yang berbeda, tipe tubuh, gaya rambut, pakaian, dan bahkan ekspresi wajah. Aset yang diperkaya ini kemudian digunakan untuk melatih model AI.

#### Simulasi

Alih-alih menjalankan eksperimen untuk mengumpulkan data di dunia nyata, di mana bisa mahal dan berbahaya, Anda dapat mensimulasikan eksperimen ini secara virtual. Misalnya, untuk menguji bagaimana mobil self-driving bereaksi ketika bertemu kuda di jalan raya, akan berbahaya untuk melepaskan kuda sungguhan di jalan raya. Sebagai gantinya, Anda mensimulasikan situasi ini di lingkungan virtual. Contoh mesin simulasi self-driving termasuk CARLA (Dosovitskiy et al., 2017), SimulationCity dari Waymo, dan simulasi San Francisco dari Tesla.

Demikian pula, sangat umum untuk mensimulasikan data pelatihan untuk robotika di lingkungan virtual. Katakanlah Anda ingin melatih robot untuk menuangkan kopi, tetapi Anda tidak tahu persis bagaimana setiap sendi harus bergerak untuk membuat tindakan berhasil. Anda dapat mensimulasikan banyak skenario dengan pergerakan sendi yang berbeda dan hanya menggunakan skenario di mana kopi berhasil dituangkan untuk melatih robot.

Simulasi memungkinkan Anda menjalankan banyak eksperimen dengan biaya minimal sambil menghindari kecelakaan dan kerusakan fisik. Robot yang bekerja dalam simulasi mungkin tidak bekerja di dunia nyata, tetapi jika gagal dalam simulasi, kemungkinan akan gagal di dunia nyata. Tidak peduli seberapa canggih simulasi Anda, however, mereka adalah penyederhanaan dari dunia nyata. Sim2Real adalah subfield yang berfokus pada mengadaptasi algoritma yang telah dilatih dalam simulasi ke dunia nyata.

Simulasi umum digunakan untuk menghasilkan data untuk mengajarkan model menggunakan alat. Seperti yang disebutkan sebelumnya, tindakan yang dihasilkan manusia mungkin tidak selalu yang paling efisien untuk agen AI. Simulasi mungkin membantu mengungkap tindakan yang diabaikan manusia. Diberikan sebuah query, Anda dapat mensimulasikan urutan tindakan yang berbeda, mengeksekusi urutan ini, dan memvalidasi hasilnya. Urutan tindakan yang paling efisien kemudian digunakan sebagai respons teranotasi untuk query tersebut.

Simulasi sangat berharga untuk menghasilkan data untuk peristiwa langka. Misalnya, dalam keuangan, peneliti dapat mensimulasikan skenario seperti perusahaan yang berhasil go public atau kebangkrutan yang signifikan untuk memahami dampak pasar mereka. Produsen dapat mensimulasikan cacat pada material atau rakitan untuk menghasilkan data untuk melatih model deteksi anomali dan kontrol kualitas. Demikian pula, dengan mensimulasikan sistem Bumi, ilmuwan iklim dapat membuat variasi dalam perubahan suhu, pola curah hujan, dan skenario cuaca ekstrem. Data sintetis ini kemudian dimasukkan ke dalam model AI, memungkinkan mereka belajar dari spektrum kemungkinan masa depan yang lebih luas.

Baik teknik berbasis aturan maupun berbasis simulasi telah berguna untuk banyak kasus penggunaan, tetapi tidak sampai AI menjadi mampu menghasilkan data yang realistis dan berkualitas tinggi bahwa sintesis data benar-benar lepas landas. Mari kita lihat metode-metode itu berikutnya.

### Sintesis Data Bertenaga AI

Sama seperti ada cara yang hampir tak terbatas bagi manusia untuk menghasilkan data, AI juga dapat melakukannya dengan banyak cara. Teknik yang dibahas di sini tidak komprehensif, tetapi mereka seharusnya memberi Anda gambaran yang baik.

Model AI yang kuat membuka banyak kemungkinan baru untuk simulasi. AI dapat mensimulasikan hasil dari program arbitrer. Misalnya, "StableToolBench" (Guo et al., 2024) mendemonstrasikan cara menggunakan AI untuk mensimulasikan API tanpa harus memanggilnya. Bayangkan Anda ingin melatih model untuk berinteraksi dengan satu set API. Alih-alih membuat panggilan API aktual—yang mungkin mahal atau lambat—Anda dapat menggunakan model AI untuk mensimulasikan hasil yang diharapkan dari panggilan tersebut.

AI dapat mensimulasikan manusia. Misalnya, bayangkan Anda ingin melatih bot untuk bermain catur. Permainan yang dimainkan oleh manusia mungkin memakan waktu terlalu lama. Pertandingan dengan pemain AI akan jauh lebih cepat. Untuk melatih bot Dota 2-nya, OpenAI menggunakan simulator yang memungkinkan bot untuk bermain sekitar 180 tahun permainan setiap hari. Bot belajar dengan bermain melawan dirinya sendiri, pendekatan yang disebut self-play, yang membantunya mengembangkan dan menyempurnakan strategi dari waktu ke waktu (OpenAI, 2019). Demikian pula, DeepMind menggunakan self-play untuk mengumpulkan data dari jutaan permainan Go untuk melatih AlphaGo (Silver et al., 2016).

Self-play berguna tidak hanya untuk bot game tetapi juga untuk agen umum. Anda dapat membuat AI bernegosiasi satu sama lain menggunakan strategi yang berbeda untuk melihat mana yang bekerja lebih baik. Anda dapat membuat satu versi model memainkan peran pelanggan dengan masalah dan yang lain memainkan agen dukungan pelanggan.

Kemampuan parafrase dan terjemahan AI dapat digunakan untuk memperkaya dataset yang ada. Misalnya, diberikan query "Bagaimana cara mereset kata sandi saya?", AI dapat memparafrasekannya untuk membuat tiga query baru:

1. "Saya lupa kata sandi saya."
2. "Bagaimana saya bisa mengubah kata sandi saya?"
3. "Langkah-langkah untuk mereset kata sandi."

Yu et al. (2023) menulis ulang 15.000 contoh dalam MATH dan GSM-8K dengan cara yang berbeda untuk membuat MetaMath, dataset baru dengan hampir 400.000 contoh. Mereka menunjukkan bahwa model mereka, yang dilatih pada dataset baru ini, mengungguli model yang lebih besar pada benchmark matematika terkait.

Adalah umum untuk menggunakan AI untuk menerjemahkan data dalam bahasa high-resource (lebih tersedia online) ke bahasa low-resource untuk membantu melatih model dalam bahasa low-resource. Ini berguna untuk melatih model kecil yang mengkhususkan diri dalam bahasa low-resource seperti Quechua atau Lao.

Anda dapat memverifikasi kualitas terjemahan dengan back-translation. Katakanlah kalimat Inggris asli adalah X dan kalimat Lao yang diterjemahkan adalah Y. Anda dapat menggunakan model lain untuk menerjemahkan terjemahan kembali ke bahasa asli, Xʹ, kemudian membandingkan Xʹ dengan kalimat asli X. Jika mereka sangat berbeda, terjemahan Y kemungkinan buruk.

AI dapat menerjemahkan tidak hanya bahasa alami tetapi juga bahasa pemrograman. Anda dapat menggunakan AI untuk menerjemahkan kode yang ditulis dalam satu bahasa ke bahasa lain. Penulis Llama 3 menggunakan terjemahan kode dari dataset SFT mereka dengan berbagai bahasa pemrograman yang lebih luas. Faktanya, pelatihan Llama 3 sangat bergantung pada data sintetis, dan penulis menggunakan banyak teknik kreatif untuk menghasilkan data yang berguna.

Misalnya, mereka menggunakan back-translation untuk menghasilkan penjelasan dan dokumentasi kode. Dimulai dengan cuplikan kode, mereka menggunakan AI untuk menghasilkan penjelasan dan dokumentasi. Mereka kemudian lagi menggunakan AI untuk menghasilkan cuplikan kode dari penjelasan dan dokumentasi. Hanya jika kode yang dihasilkan dianggap setia pada aslinya, penjelasan dan dokumentasi akan digunakan untuk melakukan fine-tuning pada model.

AI dapat menghasilkan data untuk pre-training maupun post-training, meskipun data sintetis sengaja disertakan jauh lebih sering dalam post-training daripada dalam pre-training. Satu penjelasan yang mungkin untuk ini adalah bahwa tujuan pre-training adalah untuk meningkatkan pengetahuan model, dan meskipun AI dapat mensintesis pengetahuan yang ada dalam format yang berbeda, lebih sulit untuk mensintesis pengetahuan baru.

Namun, seiring internet dibanjiri konten yang dihasilkan AI, model yang mengandalkan data internet kemungkinan sudah pre-trained pada data sintetis. Ada juga dataset sintetis seperti Cosmopedia (Allal et al., 2024), koleksi 25 miliar token dari buku teks sintetis, posting blog, cerita, posting, dan artikel WikiHow yang dihasilkan oleh Mixtral-8x7B-Instruct-v0.1 (Jiang et al., 2024).

Sintesis data untuk post-training juga lebih umum karena data post-training, termasuk data instruksi dan data preferensi, umumnya menuntut upaya paling besar untuk diproduksi. Menggunakan AI untuk memilih respons yang lebih baik di antara beberapa respons lebih langsung—sebagian besar sudah dibahas di Bab 3. Tantangan utamanya adalah memperhitungkan bias model, seperti first-position bias, di mana model lebih cenderung memilih opsi pertama. Untuk menghindari ini, peneliti NVIDIA meminta AI judge dua kali, sekali dengan urutan respons ditukar. Mereka hanya memilih triplet (prompt, menang, kalah) yang valid ketika AI judge memilih pemenang yang sama kedua kalinya (NVIDIA, 2024).

Bagian berikutnya akan berfokus pada cara menggunakan AI untuk mensintesis data instruksi untuk supervised finetuning.

#### Sintesis Data Instruksi

Selama instruction finetuning, setiap contoh menyertakan instruksi dan respons. AI dapat digunakan untuk mensintesis instruksi, respons, atau keduanya. Misalnya, Anda dapat menggunakan AI untuk menghasilkan instruksi dan manusia untuk menulis respons. Anda juga dapat menggunakan manusia untuk menulis instruksi dan AI untuk menghasilkan respons:

- **Untuk generasi instruksi**, untuk memastikan bahwa Anda menghasilkan instruksi yang cukup untuk mencakup kasus penggunaan Anda, Anda dapat memulai dengan daftar topik, kata kunci, dan/atau jenis instruksi yang Anda inginkan dalam dataset Anda. Kemudian, untuk setiap item dalam daftar ini, hasilkan sejumlah instruksi. Anda juga dapat memulai dengan satu set template dan menghasilkan sejumlah contoh per template. Perhatikan bahwa baik daftar topik maupun template dapat dihasilkan oleh AI.
- **Untuk generasi respons**, Anda dapat menghasilkan satu atau lebih respons per instruksi.

Misalnya, untuk membuat UltraChat (Ding et al., 2023), dataset dialog multi-giliran, penulis pertama-tama meminta ChatGPT untuk menghasilkan 30 topik tentang berbagai aspek kehidupan sehari-hari kita, seperti teknologi, makanan dan minuman, fashion, alam, pendidikan, keuangan, perjalanan, dll. Untuk setiap topik, mereka meminta ChatGPT untuk menghasilkan 30 hingga 50 subtopik. Penulis kemudian menggunakan model yang sama untuk menghasilkan instruksi dan respons yang sesuai untuk subtopik ini.

Demikian pula, untuk melatih Alpaca (Taori et al., 2023), peneliti Stanford mulai dengan 175 contoh (instruksi, respons) dari dataset benih Self-Instruct (Wang et al., 2022). Contoh-contoh ini awalnya ditulis untuk mencakup berbagai penggunaan yang beragam dan menarik. Penulis Alpaca kemudian menggunakan model GPT-3, text-davinci-003, untuk menghasilkan 52.000 pasangan (instruksi, respons) yang mencerminkan contoh benih ini, seperti yang ditunjukkan pada Gambar 8-5.

**Gambar 8-5.** Tugas benih dan tugas yang dihasilkan digunakan untuk melatih Alpaca.

Ada juga banyak cara kreatif untuk mensintesis data instruksi dengan karakteristik tertentu. Misalnya, sama seperti lebih sulit bagi manusia untuk menulis konten yang lebih panjang daripada konten yang lebih pendek, lebih sulit bagi AI untuk menghasilkan respons panjang berkualitas tinggi daripada instruksi pendek. Semakin panjang respons, semakin besar kemungkinan AI untuk berhalusinasi. Bagaimana jika kita menggunakan respons yang dihasilkan manusia dengan instruksi yang dihasilkan AI? Beberapa peneliti, seperti Köksal et al. (2023), Li et al. (2023), dan Chen et al. (2023), mengikuti pendekatan reverse instruction: mengambil konten berkualitas tinggi bentuk panjang yang ada seperti cerita, buku, dan artikel Wikipedia dan menggunakan AI untuk menghasilkan prompt yang akan memunculkan konten tersebut. Ini menghasilkan data instruksi berkualitas lebih tinggi, menghindari halusinasi yang dihasilkan AI dalam respons.

Dimungkinkan untuk menggunakan reverse instruction untuk mengembangkan model yang semakin kuat tanpa menambahkan data yang dianotasi secara manual.11 Li et al. (2023) menunjukkan cara kerjanya:

1. Mulai dengan sejumlah kecil contoh benih untuk melatih model yang lemah.
2. Gunakan model yang lemah ini untuk menghasilkan instruksi untuk konten berkualitas tinggi yang ada untuk membuat data instruksi berkualitas tinggi.
3. Lakukan fine-tuning pada model yang lemah dengan data instruksi berkualitas tinggi baru ini.
4. Ulangi hingga performa yang diinginkan tercapai.

Pendekatan yang kreatif adalah menggunakan data sintetis untuk melakukan fine-tuning pada model untuk memahami konteks yang lebih panjang. Misalnya, jika model Anda saat ini memproses maksimum 8K token tetapi Anda ingin model tersebut menangani 128K token, proses fine-tuning konteks panjang mungkin terlihat seperti ini:

- Bagi dokumen panjang menjadi potongan yang lebih pendek (misalnya, di bawah 8K token).
- Untuk setiap potongan pendek, hasilkan beberapa pasangan (pertanyaan, jawaban).
- Untuk setiap pasangan (pertanyaan, jawaban), gunakan dokumen panjang asli, yang mungkin melebihi 8K token tetapi lebih pendek dari panjang target Anda, sebagai konteks. Ini melatih model untuk menggunakan konteks yang diperpanjang untuk menjawab pertanyaan.

Tingkat detail dalam makalah Llama 3 (Dubey et al., 2024) menjadikannya studi kasus yang sangat baik untuk sintesis data instruksi. Saya telah menyebutkan dua cara di mana Llama 3 mensintesis data: terjemahan kode dan back-translation kode. Kedua metode ini menghasilkan lebih banyak data dari cuplikan kode yang ada. Namun, penulis juga menggunakan AI untuk mensintesis data instruksi coding dari awal, menggunakan alur kerja berikut:

1. Gunakan AI untuk menghasilkan koleksi besar deskripsi masalah pemrograman yang mencakup berbagai topik yang beragam.
2. Diberikan deskripsi masalah dan bahasa pemrograman, hasilkan solusi. Dubey et al. menemukan bahwa menyertakan aturan umum pemrograman yang baik dan penalaran CoT membantu meningkatkan kualitas respons.

Untuk memastikan kualitas data yang dihasilkan, mereka menerapkan analisis ketelitian yang ketat dan pipeline koreksi kesalahan:

1. Jalankan kode yang dihasilkan melalui parser dan linter untuk menangkap kesalahan sintaksis seperti import yang hilang dan variabel yang tidak diinisialisasi.
2. Gunakan unit test untuk menangkap kesalahan eksekusi runtime. Menariknya, mereka menggunakan AI untuk menghasilkan unit test ini.
3. Ketika solusi gagal pada langkah apa pun, prompt model untuk merevisi kode. Prompt menyertakan deskripsi masalah asli, solusi yang salah, dan umpan balik dari parser, linter, dan unit test. Hanya contoh yang lulus semua pemeriksaan yang disertakan dalam dataset supervised finetuning akhir.12

Menggabungkan ketiga metode bersama—terjemahan kode, back-translation kode, dan generasi kode—alur kerja sintesis data Llama 3 cukup mengesankan. Untuk merangkum, berikut adalah cara ketiga metode ini bekerja bersama:

1. Gunakan AI untuk menghasilkan deskripsi masalah.
2. Gunakan AI untuk menghasilkan solusi untuk setiap masalah dalam bahasa pemrograman yang berbeda.
3. Gunakan AI untuk menghasilkan unit test untuk menguji kode yang dihasilkan.
4. Prompt AI untuk memperbaiki kesalahan dalam kode yang disintesis.
5. Gunakan AI untuk menerjemahkan kode yang dihasilkan ke bahasa pemrograman yang berbeda. Saring kode terjemahan yang tidak lulus test.
6. Gunakan AI untuk menghasilkan percakapan tentang kode, termasuk penjelasan kode dan menambahkan dokumentasi. Saring penjelasan dan dokumentasi yang dihasilkan yang tidak lulus verifikasi back-translation.

Menggunakan pipeline ini, Dubey et al. mampu menghasilkan lebih dari 2,7 juta contoh terkait coding sintetis untuk supervised finetuning Llama 3.1.

#### Verifikasi Data

Mengingat pentingnya kualitas data dalam performa model, sangat penting bahwa kita memiliki cara untuk memverifikasi kualitas data. Kualitas data yang dihasilkan AI dapat diukur dengan cara yang sama seperti Anda mengevaluasi output AI lainnya—dengan kebenaran fungsional dan AI judges.

Meskipun bagian ini berfokus pada data sintetis, sebagian besar teknik dapat digunakan untuk mengevaluasi kualitas data pelatihan secara umum.

Ingat konsep evaluation-driven development dari Bab 4, di mana perusahaan lebih mungkin membuat aplikasi yang dapat mereka evaluasi. Demikian pula, orang cenderung mensintesis data yang dapat mereka verifikasi. Coding adalah salah satu kasus penggunaan model foundation yang paling populer karena dapat dievaluasi secara fungsional, dan untuk alasan yang sama, contoh terkait coding adalah salah satu data yang paling umum disintesis. Sebagian besar data sintetis yang digunakan untuk melatih Llama 3 terkait coding. Ketiga metode yang digunakan penulis untuk mensintesis data menghasilkan data yang dapat diverifikasi secara terprogram, x, oleh eksekusi kode dan back-translation.

Untuk data sintetis yang tidak dapat diverifikasi oleh kebenaran fungsional, adalah umum untuk menggunakan AI verifier. AI verifier dapat berupa AI judge tujuan umum atau scorer khusus. Ada banyak cara untuk membingkai masalah verifikasi. Dalam bentuk paling sederhana, AI verifier dapat memberi setiap contoh yang dihasilkan skor dari 1 hingga 5 atau mengklasifikasikan setiap contoh sebagai baik atau buruk. Anda juga dapat menjelaskan kepada model foundation persyaratan kualitas dan menginstruksikan model untuk menentukan apakah contoh data memenuhi persyaratan ini.

Jika Anda peduli tentang konsistensi faktual data, Anda dapat menggunakan teknik deteksi inkonsistensi faktual yang dibahas di Bab 4 untuk menyaring contoh yang kemungkinan mengandung halusinasi.

Tergantung pada kasus penggunaan dan data yang dihasilkan, Anda juga bisa kreatif. Misalnya, jika Anda ingin data sintetis meniru data nyata, kualitasnya dapat diukur dengan seberapa sulitnya membedakan antara keduanya. Anda dapat melatih detektor konten AI untuk mengidentifikasi data yang dihasilkan AI—jika mudah untuk membedakan antara data nyata dan sintetis, data sintetis tidak bagus. Atau, jika Anda ingin data sintetis menyerupai karya akademik berkualitas tinggi, Anda dapat melatih classifier untuk memprediksi apakah makalah yang dihasilkan akan diterima di konferensi bergengsi seperti NeurIPS (Conference and Workshop on Neural Information Processing Systems) dan membuang makalah apa pun yang diprediksi sebagai penolakan yang jelas.

Anda dapat membuat model untuk mendeteksi topik setiap contoh yang dihasilkan dan kemudian menghapus contoh yang topiknya tidak relevan dengan tugas Anda. Jika Anda mengharapkan semua data mengikuti pola yang mirip, Anda juga dapat menggunakan deteksi anomali untuk mengidentifikasi outlier—contoh outlier mungkin berkualitas rendah.

Sama seperti data nyata, data sintetis juga dapat disaring menggunakan heuristik. Secara umum, Anda mungkin ingin menghapus contoh yang kosong atau terlalu pendek untuk aplikasi Anda. Jika contoh terlalu panjang, Anda mungkin ingin memotong atau menghapusnya. Anda dapat menyaring data berdasarkan kata kunci, berdasarkan pengguna/penulis, berdasarkan tanggal pembuatan, berdasarkan metadata, atau berdasarkan sumber. Misalnya, penulis Self-Instruct (Wang et al., 2022) menyaring contoh yang dihasilkan menggunakan heuristik berikut:

- Contoh yang berulang
- Instruksi yang terlalu panjang atau terlalu pendek
- Contoh dengan instruksi yang sama tetapi respons yang berbeda
- Contoh di mana output adalah pengulangan dari input

Meskipun ada banyak teknik untuk mengevaluasi data sintetis, evaluasi tetap menantang. Seperti halnya aplikasi AI lainnya, uji kualitas akhir untuk data yang dihasilkan AI adalah performa dunia nyatanya—apakah dapat meningkatkan performa model—dan data sintetis telah lulus uji ini untuk banyak model.

### Keterbatasan Data yang Dihasilkan AI

Mengingat kegunaan data sintetis yang semakin meningkat, menarik untuk membayangkan kemungkinan tidak perlu khawatir tentang data yang dianotasi manusia lagi. Namun, meskipun peran data sintetis pasti akan terus meningkat dalam pentingnya dari waktu ke waktu, data yang dihasilkan AI mungkin tidak akan pernah sepenuhnya menggantikan data yang dihasilkan manusia. Ada banyak alasan mengapa, tetapi empat alasan utama adalah perbedaan kualitas, keterbatasan imitasi, potensi model collapse, dan cara generasi data AI mengaburkan lineage-nya.

**Kontrol kualitas.** Data yang dihasilkan AI bisa berkualitas rendah, dan, seperti orang tidak pernah bosan mengatakan, "garbage in, garbage out." Seperti yang disebutkan sebelumnya, orang akan enggan menggunakan data sintetis jika mereka tidak dapat memverifikasi kualitasnya. Mampu mengembangkan metode dan metrik yang andal untuk mengevaluasi data akan sangat penting dalam membuat data sintetis lebih berguna.

**Imitasi superfisial.** Seperti yang diperingatkan oleh "The False Promise of Imitating Proprietary LLMs" (Gudibande et al., 2023), performa yang dirasakan yang dicapai dengan meniru mungkin bersifat superfisial. Penelitian ini menunjukkan bahwa model imitasi bagus dalam meniru gaya model guru tetapi mungkin kesulitan dengan akurasi faktual dan generalisasi ke tugas di luar data pelatihan.

Lebih buruk lagi, imitasi dapat memaksa model siswa untuk berhalusinasi. Bayangkan jika model guru mampu menjawab pertanyaan matematika yang kompleks, jadi responsnya terhadap pertanyaan tersebut adalah solusi. Melatih model siswa pada solusi ini secara efektif mengajarkannya untuk menghasilkan jawaban yang terlihat seperti solusi, bahkan jika model siswa tidak mampu menyelesaikan pertanyaan ini.13 Gudibande et al. (2023) menyarankan bahwa untuk peningkatan dalam kemampuan penalaran, kita perlu fokus pada meningkatkan kualitas model dasar.

**Potensi model collapse.** Juga tidak jelas berapa banyak data yang dihasilkan AI dapat dilatih oleh model. Beberapa penelitian telah menunjukkan bahwa menggunakan data yang dihasilkan AI secara rekursif dalam pelatihan menyebabkan cacat yang ireversibel pada model yang dihasilkan, menurunkan performa mereka dari waktu ke waktu. Dalam "The Curse of Recursion: Training on Generated Data Makes Models Forget", Shumailov et al. (2023) menamai fenomena ini model collapse dan mendemonstrasikan kejadiannya pada model termasuk Variational Autoencoders, Gaussian mixture models, dan LLM. Model collapse dapat terjadi selama pre-training maupun post-training.14

Satu penjelasan yang mungkin adalah bahwa model AI lebih cenderung menghasilkan peristiwa yang mungkin (misalnya, tidak memiliki kanker) dan kurang mungkin menghasilkan peristiwa yang tidak mungkin (misalnya, memiliki kanker). Selama beberapa iterasi, peristiwa yang mungkin menjadi terlalu terwakili, sedangkan peristiwa yang tidak mungkin menjadi kurang terwakili dalam data yang dihasilkan. Ini menyebabkan model menghasilkan peristiwa yang lebih umum dari waktu ke waktu sambil melupakan peristiwa langka.

Dalam "Is Model Collapse Inevitable?" Gerstgrasser et al. (2024) berpendapat bahwa meskipun model collapse tidak dapat dihindari jika seluruh dataset pelatihan sintetis, hal itu dapat dihindari dengan mencampur data sintetis dengan data nyata. Bertrand et al. (2023) dan Dohmatob et al. (2024) menunjukkan hasil yang serupa. Namun, tidak satu pun dari makalah ini memiliki rekomendasi definitif untuk proporsi data sintetis terhadap data nyata.

Beberapa orang telah mampu meningkatkan performa model menggunakan sejumlah besar data sintetis. Misalnya, "Common 7B Language Models Already Possess Strong Math Capabilities" (Li et al., 2024) mendemonstrasikan bahwa data sintetis hampir seefektif data nyata dalam fine-tuning model Llama 2-7B pada masalah matematika. Dalam eksperimen mereka, data sintetis tidak menunjukkan kejenuhan yang jelas ketika ditingkatkan hingga sekitar satu juta sampel. Demikian pula, Nemotron-4 340B-Instruct (NVIDIA, 2024) menggunakan 98% data sintetis selama fase instruction finetuning dan preference finetuning-nya. Namun, eksperimen ini dilakukan hanya untuk satu iterasi model.

Data yang dihasilkan AI juga dapat melanggengkan bias. "Data Feedback Loops: Model-driven Amplification of Dataset Biases" (Taori dan Hashimoto, 2023) mendemonstrasikan bahwa ketika model dilatih pada dataset yang mencakup output model sebelumnya, bias yang ada dalam model dapat diamplifikasi. Penulis menemukan bahwa semakin setia output model terhadap karakteristik distribusi pelatihan asli, semakin stabil loop umpan balik, sehingga meminimalkan risiko amplifikasi bias.

**Lineage data yang tidak jelas.** Keterbatasan data yang dihasilkan AI ini lebih halus. Generasi AI mengaburkan lineage data. Model AI dipengaruhi oleh data pelatihan mereka dan kadang-kadang dapat memuntahkannya tanpa sepengetahuan pengguna. Ini menciptakan risiko. Katakanlah Anda menggunakan model X untuk menghasilkan data untuk melatih model Anda. Jika model X dilatih pada data dengan pelanggaran hak cipta, model Anda mungkin juga melanggar hak cipta.

Atau bayangkan Anda kemudian menggunakan benchmark B untuk mengevaluasi model Anda, yang menunjukkan performa yang kuat. Namun, jika model X juga dilatih pada benchmark B, hasil Anda pada B terkontaminasi. Tanpa lineage data yang jelas, sulit untuk menilai kelayakan komersial model atau mempercayai performanya.

Kita telah membahas cara menggunakan AI untuk menghasilkan data dan cara mengevaluasi data yang dihasilkan, serta keterbatasannya. Di bagian berikutnya, mari kita beralih untuk membahas satu kasus penggunaan khusus sintesis data di mana data yang dihasilkan AI tidak hanya bersifat tambahan tetapi diperlukan: distilasi model.

## Distilasi Model

Distilasi model (juga disebut knowledge distillation) adalah metode di mana model kecil (siswa) dilatih untuk meniru model yang lebih besar (guru) (Hinton et al., 2015). Pengetahuan model besar didistilasi ke dalam model kecil, oleh karena itu istilah distilasi.

Secara tradisional, tujuan distilasi model adalah untuk menghasilkan model yang lebih kecil untuk deployment. Menampilkan model besar bisa sangat intensif sumber daya. Distilasi dapat menghasilkan model siswa yang lebih kecil dan lebih cepat yang mempertahankan performa yang sebanding dengan guru. Misalnya, DistilBERT, model yang didistilasi dari BERT, mengurangi ukuran model BERT sebesar 40% sambil mempertahankan 97% kemampuan pemahaman bahasanya dan 60% lebih cepat (Sanh et al., 2019).

Model siswa dapat dilatih dari awal seperti DistilBERT atau di-fine-tune dari model pre-trained seperti Alpaca. Pada tahun 2023, Taori et al. melakukan fine-tuning pada Llama-7B, versi 7 miliar parameter dari Llama, pada contoh yang dihasilkan oleh text-davinci-003, model 175 miliar parameter. Model yang dihasilkan, Alpaca, berperilaku mirip dengan text-davinci-003, sementara berukuran 4% dari ukuran model guru.

Tidak semua model dapat didistilasi. Banyak lisensi model melarang penggunaan output mereka untuk melatih model lain, terutama untuk melatih model yang bersaing.

Data instruksi sintetis umum digunakan bersama dengan teknik berbasis adapter, seperti LoRA. Misalnya, BuzzFeed melakukan fine-tuning pada model Flan-T5 menggunakan LoRA dan contoh yang dihasilkan oleh text-davinci-003 dari OpenAI. Model yang dihasilkan mengurangi biaya inferensi mereka sebesar 80%, meskipun tidak jelas seberapa baik model berkinerja (2023).

Perhatikan bahwa tidak semua pelatihan dengan data sintetis adalah distilasi model. Distilasi model menyiratkan bahwa performa model guru adalah standar emas siswa. Namun, dimungkinkan untuk menggunakan data sintetis untuk melatih model siswa yang lebih besar dan lebih kuat daripada guru.

Model bootstrapping dengan reverse instruction (Li et al., 2023), yang dibahas di bagian sebelumnya, adalah satu contoh. Contoh lainnya adalah Nemotron-4 dari NVIDIA. Tim peneliti NVIDIA pertama-tama melakukan pre-training pada model dasar 340B parameter. Model dasar ini kemudian di-fine-tune menggunakan data instruksi dan preferensi yang dihasilkan oleh Mixtral-8x7B-Instruct-v0.1 (Jiang et al., 2024), model mixture-of-experts 56 miliar parameter.15 Model siswa yang dihasilkan, Nemotron-4-340B-Instruct, mengungguli model guru pada berbagai tugas (NVIDIA, 2024).

Makalah Llama 3 mencatat bahwa meskipun pelatihan pada data yang dihasilkan oleh model yang lebih kompeten dapat secara signifikan meningkatkan performa model, pelatihan secara membabi buta pada data yang dihasilkan sendiri tidak meningkatkan performa model dan bahkan dapat menurunkannya. Namun, dengan memperkenalkan mekanisme untuk memverifikasi kualitas data sintetis dan hanya menggunakan data sintetis yang diverifikasi, mereka dapat terus meningkatkan model menggunakan data yang dihasilkannya.

## Pemrosesan Data

Data perlu diproses sesuai dengan persyaratan setiap kasus penggunaan. Bagian ini membahas beberapa langkah pemrosesan data untuk referensi.

Saya merasa berguna untuk membaca makalah model yang mengungkapkan detail dataset mereka, karena mereka sering berisi tips hebat tentang bagaimana peneliti mengurasi, menghasilkan, dan memproses data.

Dengan sejumlah besar data, setiap langkah pemrosesan ini dapat memakan waktu berjam-jam, jika tidak berhari-hari. Tips untuk membantu mengoptimalkan efisiensi selama proses meliputi:

- Anda dapat melakukan langkah pemrosesan data ini dalam urutan apa pun yang menghemat waktu dan komputasi. Misalnya, jika membutuhkan lebih banyak waktu untuk membersihkan setiap contoh daripada mendeduplikasi data, Anda mungkin ingin menghapus contoh yang terduplikasi terlebih dahulu sebelum membersihkannya. Tetapi jika deduplikasi membutuhkan lebih banyak waktu daripada menyaring data berkualitas rendah, saring data berkualitas rendah terlebih dahulu.
- Selalu lakukan uji coba untuk memvalidasi bahwa skrip pemrosesan Anda bekerja seperti yang diharapkan sebelum menerapkan skrip ke semua data Anda.
- Hindari mengubah data di tempat. Pertimbangkan untuk menyimpan salinan data asli karena dua alasan:
  - Anda atau tim lain mungkin perlu memproses data dengan cara yang berbeda untuk aplikasi lain.
  - Bug dalam skrip Anda berpotensi merusak data Anda.

### Inspeksi Data

Katakanlah setelah menyisir data publik dan internal, Anda telah mengumpulkan dataset mentah. Hal pertama yang harus dilakukan adalah memeriksa data untuk mendapatkan gambaran tentang kualitasnya. Dapatkan informasi dan statistik data. Dari mana data berasal? Bagaimana data telah diproses? Untuk apa lagi data telah digunakan?

Plot distribusi token (untuk melihat token apa yang umum), panjang input, panjang respons, dll. Apakah data menggunakan token khusus? Dapatkah Anda mendapatkan distribusi topik dan bahasa dalam data? Seberapa relevan topik dan bahasa ini dengan tugas Anda?

Anda bisa kreatif dalam statistik yang digunakan untuk memahami data Anda. Misalnya, sekelompok peneliti Microsoft (2023) menggunakan distribusi pasangan (kata kerja, objek langsung, kata benda) dan panjang respons untuk membandingkan perbedaan antara generasi GPT-3 dan GPT-4 untuk set instruksi yang sama, seperti yang ditunjukkan pada Gambar 8-6 dan Gambar 8-7. Jenis analisis ini membantu tidak hanya untuk mengevaluasi data tetapi juga untuk mengevaluasi model.

**Gambar 8-6.** Satu statistik yang dapat Anda gunakan adalah distribusi pasangan (kata kerja, kata benda objek langsung) dalam data Anda. Gambar dari "Instruction Tuning with GPT-4" (Peng et al., 2023).

**Gambar 8-7.** Distribusi panjang respons untuk GPT-4 dan GPT-3. Gambar dari "Instruction Tuning with GPT-4" (Peng et al., 2023).

GPT-4 tampaknya memiliki rentang pasangan kata benda-kata kerja yang lebih luas dan lebih beragam dan cenderung menghasilkan respons yang lebih panjang.

Plot distribusi ini berdasarkan sumber data, waktu, anotator, dll. Apakah Anda melihat pola pertanyaan yang cenderung mendapatkan respons yang lebih panjang/lebih pendek atau skor yang lebih tinggi/lebih rendah? Apakah ada outlier? Apa yang mungkin menjadi penyebab outlier ini? Apa yang harus dilakukan dengan mereka? Jika skor seharusnya mengikuti distribusi normal, apakah skor oleh semua anotator mengikuti distribusi normal? Anda mungkin memperhatikan bahwa beberapa anotator cenderung memberikan respons yang jauh lebih pendek atau bias terhadap skor yang lebih tinggi, dan terserah Anda untuk memutuskan apa yang harus dilakukan dengan anotasi mereka.

Jika setiap contoh memiliki lebih dari satu anotasi, hitung ketidaksetujuan antar-anotator. Periksa contoh dengan anotasi yang bertentangan dan selesaikan konflik.

Ada banyak alat eksplorasi data yang harus Anda gunakan, tetapi mereka tidak akan menggantikan inspeksi data manual. Dalam setiap proyek yang saya kerjakan, menatap data selama 15 menit biasanya memberi saya beberapa wawasan yang dapat menghemat waktu berjam-jam. Greg Brockman, salah satu pendiri OpenAI, tweeted: "Inspeksi manual data mungkin memiliki rasio nilai-terhadap-prestise tertinggi dari aktivitas apa pun dalam machine learning."

Lihat data Anda untuk melihat apakah contoh masuk akal. Jika data dianotasi, pilih beberapa query dan coba anotasi sendiri untuk melihat apakah anotasi Anda cocok dengan anotasi yang diberikan. Ini akan memberi Anda gambaran tentang seberapa dapat dipercaya anotasi tersebut. Fact-check respons. Seberapa unik contoh? Apakah ada contoh dengan query yang sama tetapi dengan respons yang berbeda? Apakah ada contoh dengan respons yang sama tetapi dengan query yang berbeda?

### Deduplikasi Data

Data yang terduplikasi dapat memiringkan distribusi data dan memperkenalkan bias ke dalam model. Bayangkan dataset yang terlihat seperti Tabel 8-3. Entri yang terduplikasi mungkin menyebabkan model pada kesimpulan yang salah bahwa semua item berwarna merah harus mahal. Duplikasi dapat menyebabkan kontaminasi set uji. Saat membagi data yang terduplikasi menjadi set train dan test, satu contoh mungkin berada di set train dan duplikatnya di set test.

**Tabel 8-3.** Dataset mainan dengan contoh duplikat dalam sel abu-abu.

| | Input (Deskripsi produk) | Output (Harga) |
|---|---|---|
| 1 | {item: pencil, color: red} | $20 |
| 2 | {item: compass, color: green} | $2 |
| 3 | {item: pencil, color: red} | $20 |
| 4 | {item: pencil, color: red} | $20 |
| 5 | {item: pencil, color: green} | $1 |

Beberapa penelitian telah menunjukkan dampak negatif dari duplikasi data pelatihan pada performa model; lihat Lee et al. (2021) dan Tirumala et al. (2023). Sebuah studi Anthropic mendemonstrasikan bahwa mengulang 0,1% data 100 kali dapat menyebabkan performa model 800M parameter menurun ke model 400M parameter meskipun 90% token pelatihan lainnya tetap unik (Hernandez et al., 2022). Bahkan ketika duplikasi tidak merugikan performa model Anda, duplikasi dapat membuang waktu dan komputasi Anda.

Tergantung pada data, ada banyak bentuk duplikasi, beberapa di antaranya lebih sulit dideteksi. Misalnya, berikut adalah beberapa jenis duplikasi dalam dataset dokumen:

- **Duplikasi seluruh dokumen**: dokumen yang sama muncul lebih dari sekali.
- **Duplikasi intra-dokumen**: misalnya, paragraf yang sama muncul dua kali dalam satu dokumen.
- **Duplikasi antar-dokumen**: misalnya, kutipan populer yang sama muncul di banyak dokumen.

Apa yang dapat dianggap sebagai duplikasi juga tergantung pada definisi Anda. Misalnya, apakah Anda ingin menangani duplikasi pada tingkat dokumen, tingkat paragraf, tingkat kalimat, atau tingkat token? Apakah dua teks harus cocok persis untuk dianggap sebagai duplikat, atau apakah tumpang tindih 80% sudah cukup? Apakah dua daftar dianggap duplikat jika mereka memiliki item yang sama tetapi dalam urutan yang berbeda?

Tugas deduplikasi dapat memanfaatkan teknik yang sama yang digunakan untuk pengukuran kesamaan (dibahas di Bab 3). Deduplikasi data juga digunakan untuk resolusi identitas, menentukan apakah dua identitas (misalnya, dua profil media sosial) adalah sama. Berikut adalah beberapa cara konkret yang dapat Anda gunakan untuk mendeduplikasi data:

**Perbandingan pairwise**
Hitung skor kesamaan setiap contoh dengan setiap contoh lain dalam dataset, menggunakan pencocokan eksak, pencocokan n-gram, pencocokan fuzzy, atau skor kesamaan semantik, seperti yang dibahas di Bab 3. Pendekatan ini bisa mahal dengan dataset besar, however.

**Hashing**
Hash contoh ke dalam bucket yang berbeda dan periksa hanya di antara contoh yang jatuh ke dalam bucket yang sama. Metode deduplikasi terkait hashing termasuk MinHash dan Bloom filter.

**Reduksi dimensionalitas**
Gunakan teknik reduksi dimensionalitas untuk pertama-tama mengurangi dimensi data Anda dan kemudian melakukan perbandingan pairwise. Banyak teknik yang digunakan untuk pencarian vektor, seperti yang dibahas di Bab 6, dapat digunakan untuk ini.

Pencarian cepat akan mengembalikan banyak pustaka yang membantu dengan deduplikasi. Beberapa di antaranya adalah dupeGuru, Dedupe, datasketch, TextDistance, TheFuzz, dan deduplicate-text-datasets.16

### Membersihkan dan Memfilter Data

Data perlu dibersihkan untuk membuat model Anda berkinerja dan aman.

Pertama, Anda mungkin ingin menghapus token pemformatan yang tidak perlu. Karena banyak dataset publik diikis dari internet, tag HTML yang tidak perlu cukup umum. Kecuali jika Anda ingin melatih model Anda pada tag HTML, hapus mereka. Databricks menemukan bahwa menghapus token Markdown dan HTML yang tidak perlu meningkatkan akurasi model mereka sebesar 20% sambil mengurangi panjang token input mereka sebesar 60%.

Anda perlu membersihkan data Anda dari apa pun yang tidak sesuai dengan kebijakan Anda, seperti PII, data sensitif, data berhak cipta, atau data yang dianggap beracun. Teknik yang dibahas di Bab 4 dapat membantu. Hapus semua bidang yang tidak boleh Anda gunakan, seperti kode pos, nama, dan jenis kelamin.

Anda juga mungkin ingin menghapus data berkualitas rendah, menggunakan teknik yang dibahas di "Verifikasi data" pada halaman 391 untuk mendeteksi data berkualitas rendah.

Inspeksi manual data sangat penting dalam langkah ini. Menatap data mungkin membantu Anda melihat pola yang dapat Anda gunakan sebagai heuristik untuk mendeteksi data berkualitas rendah. Heuristik untuk mendeteksi data berkualitas rendah mungkin tidak jelas. Misalnya, Kern et al. (2024) menemukan bahwa anotasi yang dibuat di paruh kedua sesi anotasi berkualitas lebih rendah, kemungkinan karena kebosanan atau kelelahan anotator.

Jika ada lebih banyak data daripada yang Anda butuhkan atau mampu gunakan (misalnya, karena anggaran komputasi Anda), Anda dapat lebih lanjut menyaring data Anda. Misalnya, Anda dapat menggunakan teknik active learning untuk memilih contoh yang paling membantu bagi model Anda untuk dipelajari. Anda juga dapat menggunakan importance sampling untuk menemukan contoh yang paling penting untuk tugas Anda. Efisiensinya tergantung pada apakah Anda memiliki cara yang baik untuk mengevaluasi pentingnya setiap contoh pelatihan. Peneliti Meta, dalam makalah mereka tentang pemangkasan data (Sorscher et al., 2022), menyimpulkan bahwa penemuan metrik pemangkasan data yang baik dapat secara signifikan mengurangi biaya sumber daya dari deep learning modern.

### Memformat Data

Setelah Anda mendeduplikasi dan membersihkan data, Anda perlu mendapatkannya dalam format yang benar yang diharapkan oleh model yang Anda fine-tune. Setiap model menggunakan tokenizer spesifik dan mengharapkan data dalam template chat tertentu, seperti yang dibahas di Bab 5. Mendapatkan data ke template chat yang salah dapat menyebabkan bug aneh pada model Anda.

Jika Anda melakukan supervised finetuning, data Anda kemungkinan besar dalam format (instruksi, respons). Instruksi dapat diuraikan lebih lanjut menjadi (system prompt, user prompt). Jika Anda telah lulus dari prompt engineering ke fine-tuning, instruksi yang digunakan untuk fine-tuning mungkin berbeda dari instruksi yang digunakan selama prompt engineering. Selama fine-tuning, instruksi biasanya tidak memerlukan deskripsi tugas atau contoh. Jika Anda memiliki cukup contoh pelatihan, model dapat mempelajari perilaku yang diharapkan dari tugas dari contoh secara langsung.

Sebagai contoh, bayangkan Anda telah menggunakan instruksi tiga-shot ini untuk tugas klasifikasi makanan Anda dengan model dasar:

```
Label item berikut sebagai edible atau inedible.
Item: burger
Label: edible
Item: car
Label: inedible
Item: mushroom
Label: edible
Item: {INPUT}
Label:
```

Untuk fine-tuning, semua contoh yang disertakan dalam prompt 3-shot dapat dikonversi menjadi contoh pelatihan. Data pelatihan untuk fine-tuning akan terlihat seperti Tabel 8-4.

**Tabel 8-4.** Contoh data pelatihan yang digunakan untuk tugas klasifikasi makanan.

| ID Contoh | Input | Output |
|---|---|---|
| 1 | burger --> | edible |
| 2 | car --> | inedible |
| 3 | mushroom --> | edible |
| ... | ... | ... |

Setelah model di-fine-tune, Anda dapat menggunakan prompt sesederhana:

```
{INPUT} -->
```

Ini jauh lebih pendek dari prompt yang digunakan dengan model dasar. Oleh karena itu, jika Anda khawatir tentang token input dari instruksi Anda, fine-tuning dapat menjadi salah satu cara untuk membantu mengelola biaya.

Format data fine-tuning yang berbeda dapat mempengaruhi performa model yang di-fine-tune Anda. Eksperimen untuk menentukan format terbaik untuk Anda dapat membantu.

Saat Anda menggunakan model yang di-fine-tune, pastikan bahwa prompt yang Anda gunakan cocok dengan format data fine-tuning. Misalnya, jika data pelatihan menggunakan prompt dalam format "burger -->", salah satu prompt berikut dapat menyebabkan masalah:

- "burger": panah akhir hilang
- "Item: burger -->": awalan ekstra
- "burger --> ": spasi ekstra ditambahkan

## Ringkasan

Meskipun proses aktual pembuatan data pelatihan sangat rumit, prinsip-prinsip pembuatan dataset sangat sederhana. Untuk membangun dataset guna melatih model, Anda mulai dengan memikirkan perilaku yang ingin Anda ajarkan pada model, lalu mendesain dataset untuk menunjukkan perilaku ini. Karena pentingnya data, tim memperkenalkan peran data khusus yang bertanggung jawab untuk memperoleh dataset yang sesuai sambil memastikan privasi dan kepatuhan.

Data apa yang Anda butuhkan tidak hanya tergantung pada kasus penggunaan Anda tetapi juga pada fase pelatihan. Pre-training membutuhkan data yang berbeda dari instruction finetuning dan preference finetuning. Namun, desain dataset di semua fase pelatihan berbagi tiga kriteria inti yang sama: kualitas, cakupan, dan kuantitas.

Meskipun berapa banyak data yang dilatih oleh model menarik perhatian utama, memiliki data berkualitas tinggi dengan cakupan yang cukup sama pentingnya. Sejumlah kecil data berkualitas tinggi dapat mengungguli sejumlah besar data noisy. Demikian pula, banyak tim telah menemukan bahwa meningkatkan keragaman dataset mereka adalah kunci untuk meningkatkan performa model mereka.

Karena tantangan dalam memperoleh data berkualitas tinggi, banyak tim beralih ke data sintetis. Meskipun menghasilkan data secara terprogram telah lama menjadi tujuan, tidak sampai AI dapat membuat data yang realistis dan kompleks bahwa data sintetis menjadi solusi praktis untuk banyak kasus penggunaan lainnya. Bab ini membahas berbagai teknik untuk sintesis data dengan pembahasan mendalam tentang mensintesis data instruksi untuk fine-tuning.

Sama seperti data nyata, data sintetis harus dievaluasi untuk memastikan kualitasnya sebelum digunakan untuk melatih model. Mengevaluasi data yang dihasilkan AI sama rumitnya dengan mengevaluasi output AI lainnya, dan orang lebih cenderung menggunakan data yang dihasilkan yang dapat mereka evaluasi secara andal.

Data menantang karena banyak langkah dalam pembuatan dataset tidak mudah diotomatisasi. Sulit untuk menganotasi data, tetapi bahkan lebih sulit untuk membuat panduan anotasi. Sulit untuk mengotomatisasi generasi data, tetapi bahkan lebih sulit untuk mengotomatisasi verifikasinya. Meskipun sintesis data membantu menghasilkan lebih banyak data, Anda tidak dapat mengotomatisasi pemikiran tentang data apa yang Anda inginkan. Anda tidak dapat dengan mudah mengotomatisasi panduan anotasi. Anda tidak dapat mengotomatisasi perhatian pada detail.

Namun, masalah yang menantang mengarah pada solusi yang kreatif. Satu hal yang menonjol bagi saya saat melakukan penelitian untuk bab ini adalah betapa banyak kreativitas yang terlibat dalam desain dataset. Ada begitu banyak cara orang membangun dan mengevaluasi data. Saya berharap bahwa berbagai teknik sintesis dan verifikasi data yang dibahas dalam bab ini akan memberi Anda inspirasi tentang cara mendesain dataset Anda.

Katakanlah Anda telah mengurasi dataset indah yang memungkinkan Anda melatih model yang luar biasa. Bagaimana Anda harus menyajikan model ini? Bab berikutnya akan membahas cara mengoptimalkan inferensi untuk latensi dan biaya.
