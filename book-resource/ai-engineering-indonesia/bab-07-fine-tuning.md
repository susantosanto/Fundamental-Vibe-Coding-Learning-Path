# Bab 7: Fine-Tuning

5 Beberapa orang, seperti penulis makalah Llama 3.1 (Dubey et al., 2024), menganut "prinsip bahwa post-training seharusnya menyelaraskan model untuk 'tahu apa yang diketahuinya' daripada menambahkan pengetahuan."

mengungguli RAG dengan model yang di-fine-tune, seperti yang ditunjukkan pada Tabel 7-2. Temuan ini mengindikasikan bahwa meskipun fine-tuning dapat meningkatkan performa model pada tugas tertentu, hal itu juga dapat menyebabkan penurunan performa di area lain.

**Tabel 7-2.** RAG mengungguli fine-tuning pada tugas tanya-jawab tentang peristiwa terkini, yang dikurasi oleh Ovadia et al. (2024). FT-reg dan FT-par merujuk pada dua pendekatan fine-tuning berbeda yang digunakan penulis.

| Model Dasar | Model Dasar + RAG | FT-reg | FT-par | FT-reg + RAG | FT-par + RAG |
|---|---|---|---|---|---|
| Mistral-7B | 0,481 | 0,875 | 0,504 | 0,588 | 0,810 | 0,830 |
| Llama 2-7B | 0,353 | 0,585 | 0,219 | 0,392 | 0,326 | 0,520 |
| Orca 2-7B | 0,456 | 0,876 | 0,511 | 0,566 | 0,820 | 0,826 |

Di sisi lain, jika model memiliki masalah perilaku, fine-tuning mungkin bisa membantu. Satu masalah perilaku adalah ketika output model secara faktual benar tetapi tidak relevan dengan tugas. Misalnya, Anda meminta model untuk menghasilkan spesifikasi teknis untuk proyek perangkat lunak yang akan diberikan kepada tim rekayasa Anda. Meskipun akurat, spesifikasi yang dihasilkan tidak memiliki detail yang dibutuhkan tim Anda. Melakukan fine-tuning pada model dengan spesifikasi teknis yang terdefinisi dengan baik dapat membuat output menjadi lebih relevan.

Masalah lainnya adalah ketika model gagal mengikuti format output yang diharapkan. Misalnya, jika Anda meminta model untuk menulis kode HTML, tetapi kode yang dihasilkan tidak bisa dikompilasi, hal itu mungkin karena model tidak cukup terpapar HTML dalam data pelatihannya. Anda dapat memperbaiki ini dengan mengekspos model ke lebih banyak kode HTML selama fine-tuning.

Semantic parsing adalah kategori tugas yang keberhasilannya bergantung pada kemampuan model untuk menghasilkan output dalam format yang diharapkan dan, oleh karena itu, sering memerlukan fine-tuning. Semantic parsing dibahas secara singkat di Bab 2 dan 6. Sebagai pengingat, semantic parsing berarti mengonversi bahasa alami menjadi format terstruktur seperti JSON.

Model off-the-shelf yang kuat umumnya bagus untuk sintaksis umum yang kurang kompleks seperti JSON, YAML, dan regex. Namun, mereka mungkin tidak sebaik untuk sintaksis dengan lebih sedikit contoh yang tersedia di internet, seperti bahasa domain-spesifik untuk alat yang kurang populer atau sintaksis yang kompleks.

Singkatnya, fine-tuning adalah untuk bentuk, dan RAG adalah untuk fakta. Sistem RAG memberi model Anda pengetahuan eksternal untuk membangun jawaban yang lebih akurat dan informatif. Sistem RAG dapat membantu mengurangi halusinasi model Anda. Fine-tuning, di sisi lain, membantu model Anda memahami dan mengikuti sintaksis dan gaya.5 Meskipun fine-tuning berpotensi mengurangi halusinasi jika dilakukan dengan data berkualitas tinggi yang cukup, fine-tuning juga dapat memperburuk halusinasi jika kualitas data rendah.

## Kapan Harus Fine-Tuning

Jika model Anda memiliki masalah informasi dan perilaku, mulailah dengan RAG. RAG biasanya lebih mudah karena Anda tidak perlu khawatir tentang mengurasi data pelatihan atau meng-hosting model yang di-fine-tune. Saat melakukan RAG, mulailah dengan solusi berbasis istilah sederhana seperti BM25 daripada langsung melompat ke sesuatu yang memerlukan database vektor.

RAG juga dapat memperkenalkan peningkatan performa yang lebih signifikan daripada fine-tuning. Ovadia et al. (2024) menunjukkan bahwa untuk hampir semua kategori pertanyaan dalam benchmark MMLU, RAG mengungguli fine-tuning untuk tiga model berbeda: Mistral 7B, Llama 2-7B, dan Orca 2-7B.

Namun, RAG dan fine-tuning tidak saling eksklusif. Keduanya terkadang dapat digunakan bersama-sama untuk memaksimalkan performa aplikasi Anda. Dalam eksperimen yang sama, Ovadia et al. (2024) menunjukkan bahwa menggabungkan RAG di atas model yang di-fine-tune dapat meningkatkan performanya pada benchmark MMLU sebesar 43% dari waktu. Penting untuk dicatat bahwa dalam eksperimen ini, menggunakan RAG dengan model yang di-fine-tune tidak meningkatkan performa 57% dari waktu, dibandingkan dengan menggunakan RAG saja.

Tidak ada alur kerja universal untuk semua aplikasi. Gambar 7-3 menunjukkan beberapa jalur yang mungkin diikuti oleh proses pengembangan aplikasi seiring waktu. Panah menunjukkan langkah berikutnya yang mungkin Anda coba. Gambar ini terinspirasi oleh contoh alur kerja yang ditunjukkan oleh OpenAI (2023).

**Gambar 7-3.** Contoh alur pengembangan aplikasi. Setelah pengambilan sederhana (seperti pengambilan berbasis istilah), apakah akan bereksperimen dengan pengambilan yang lebih kompleks (seperti pencarian hybrid) atau fine-tuning tergantung pada setiap aplikasi dan mode kegagalannya.

Jadi alur kerja untuk mengadaptasi model ke suatu tugas mungkin bekerja sebagai berikut. Perhatikan bahwa sebelum langkah adaptasi apa pun, Anda harus mendefinisikan kriteria evaluasi Anda dan merancang pipeline evaluasi Anda, seperti yang dibahas di Bab 4. Pipeline evaluasi inilah yang akan Anda gunakan untuk membandingkan kemajuan Anda saat mengembangkan aplikasi Anda. Evaluasi tidak hanya terjadi di awal. Evaluasi harus hadir di setiap langkah proses:

1. Coba buat model melakukan tugas Anda hanya dengan prompting. Gunakan praktik terbaik rekayasa prompt yang dibahas di Bab 5, termasuk secara sistematis membuat versi prompt Anda.

2. Tambahkan lebih banyak contoh ke prompt. Tergantung pada kasus penggunaan, jumlah contoh yang dibutuhkan mungkin antara 1 dan 50.

3. Jika model Anda sering gagal karena informasi yang hilang, hubungkan ke sumber data yang dapat menyediakan informasi yang relevan. Saat memulai dengan RAG, mulailah dengan menggunakan metode pengambilan dasar seperti pencarian berbasis istilah. Bahkan dengan pengambilan sederhana, menambahkan pengetahuan yang relevan dan akurat seharusnya menghasilkan beberapa peningkatan pada performa model Anda.

4. Tergantung pada mode kegagalan model Anda, Anda mungkin ingin menjelajahi salah satu langkah berikutnya ini:
   a. Jika model terus mengalami kegagalan berbasis informasi, Anda mungkin ingin mencoba metode RAG yang bahkan lebih canggih, seperti pengambilan berbasis embedding.
   b. Jika model terus mengalami masalah perilaku, seperti terus menghasilkan respons yang tidak relevan, salah format, atau tidak aman, Anda dapat memilih fine-tuning. Pengambilan berbasis embedding meningkatkan kompleksitas inferensi dengan memperkenalkan komponen tambahan ke dalam pipeline, sementara fine-tuning meningkatkan kompleksitas pengembangan model tetapi membiarkan inferensi tidak berubah.

5. Kombinasikan RAG dan fine-tuning untuk peningkatan performa yang bahkan lebih besar.

Jika, setelah mempertimbangkan semua pro dan kontra dari fine-tuning dan teknik alternatif lainnya, Anda memutuskan untuk melakukan fine-tuning pada model Anda, sisa bab ini adalah untuk Anda. Pertama, mari kita lihat tantangan nomor satu dari fine-tuning: bottleneck memorinya.

## Bottleneck Memori

Karena fine-tuning sangat intensif memori, banyak teknik fine-tuning bertujuan untuk meminimalkan jejak memori mereka. Memahami apa yang menyebabkan bottleneck memori ini diperlukan untuk memahami mengapa dan bagaimana teknik-teknik ini bekerja. Pemahaman ini, pada gilirannya, dapat membantu Anda memilih metode fine-tuning yang paling sesuai untuk Anda.

Selain menjelaskan bottleneck memori fine-tuning, bagian ini juga memperkenalkan formula untuk perhitungan memori kasar dari setiap model. Perhitungan ini berguna dalam memperkirakan perangkat keras apa yang Anda perlukan untuk melayani atau melakukan fine-tuning pada suatu model.

### Poin-Poin Kunci untuk Memahami Bottleneck Memori

Jika Anda memutuskan untuk melewatkan bagian ini, berikut adalah beberapa poin kunci. Jika Anda menemukan poin-poin ini tidak familiar, konsep-konsep di bagian ini seharusnya membantu menjelaskannya:

1. Karena skala model foundation, memori adalah bottleneck untuk bekerja dengannya, baik untuk inferensi maupun untuk fine-tuning. Memori yang dibutuhkan untuk fine-tuning biasanya jauh lebih tinggi daripada memori yang dibutuhkan untuk inferensi karena cara neural network dilatih.

2. Kontributor utama jejak memori model selama fine-tuning adalah jumlah parameternya, jumlah parameter yang dapat dilatih, dan representasi numeriknya.

3. Semakin banyak parameter yang dapat dilatih, semakin tinggi jejak memori. Anda dapat mengurangi persyaratan memori untuk fine-tuning dengan mengurangi jumlah parameter yang dapat dilatih. Mengurangi jumlah parameter yang dapat dilatih adalah motivasi untuk PEFT, parameter-efficient fine-tuning.

4. Quantisasi merujuk pada praktik mengonversi model dari format dengan lebih banyak bit ke format dengan lebih sedikit bit. Quantisasi adalah cara yang langsung dan efisien untuk mengurangi jejak memori model. Untuk model dengan 13 miliar parameter, menggunakan FP32 berarti 4 byte per weight atau 52 GB untuk seluruh weight. Jika Anda dapat mengurangi setiap nilai menjadi hanya 2 byte, memori yang dibutuhkan untuk weight model turun menjadi 26 GB.

5. Inferensi biasanya dilakukan menggunakan sedikit bit mungkin, seperti 16 bit, 8 bit, dan bahkan 4 bit.

6. Pelatihan lebih sensitif terhadap presisi numerik, jadi lebih sulit untuk melatih model dalam presisi yang lebih rendah. Pelatihan biasanya dilakukan dalam presisi campuran, dengan beberapa operasi dilakukan dalam presisi yang lebih tinggi (misalnya, 32-bit) dan beberapa dalam presisi yang lebih rendah (misalnya, 16-bit atau 8-bit).

### Backpropagation dan Parameter yang Dapat Dilatih

Faktor kunci yang menentukan jejak memori model selama fine-tuning adalah jumlah parameter yang dapat dilatihnya. Parameter yang dapat dilatih adalah parameter yang dapat diperbarui selama fine-tuning. Selama pre-training, semua parameter model diperbarui. Selama inferensi, tidak ada parameter model yang diperbarui. Selama fine-tuning, beberapa atau semua parameter model dapat diperbarui. Parameter yang tetap tidak berubah disebut parameter beku (frozen parameters).

Memori yang dibutuhkan untuk setiap parameter yang dapat dilatih berasal dari cara model dilatih. Hingga saat ini, neural network biasanya dilatih menggunakan mekanisme yang disebut backpropagation.6 Dengan backpropagation, setiap langkah pelatihan terdiri dari dua fase:

1. **Forward pass**: proses menghitung output dari input.
2. **Backward pass**: proses memperbarui weight model menggunakan sinyal yang terkumpul dari forward pass.

Selama inferensi, hanya forward pass yang dieksekusi. Selama pelatihan, kedua pass dieksekusi. Secara garis besar, backward pass bekerja sebagai berikut:

1. Bandingkan output yang dihitung dari forward pass dengan output yang diharapkan (ground truth). Jika berbeda, model membuat kesalahan, dan parameter perlu disesuaikan. Perbedaan antara output yang dihitung dan output yang diharapkan disebut loss.

2. Hitung seberapa besar setiap parameter yang dapat dilatih berkontribusi pada kesalahan. Nilai ini disebut gradient. Secara matematis, gradien dihitung dengan mengambil turunan dari loss terhadap setiap parameter yang dapat dilatih.7 Ada satu nilai gradien per parameter yang dapat dilatih. Jika sebuah parameter memiliki gradien tinggi, parameter tersebut berkontribusi signifikan terhadap loss dan harus disesuaikan lebih banyak.

3. Sesuaikan nilai parameter yang dapat dilatih menggunakan gradien yang sesuai. Seberapa besar setiap parameter harus disesuaikan kembali, mengingat nilai gradiennya, ditentukan oleh optimizer. Optimizer umum termasuk SGD (stochastic gradient descent) dan Adam. Untuk model berbasis transformer, Adam, sejauh ini, adalah optimizer yang paling banyak digunakan.

Forward dan backward pass untuk neural network hipotetis dengan tiga parameter dan satu fungsi aktivasi nonlinier divisualisasikan dalam Gambar 7-4. Saya menggunakan neural network dummy ini untuk menyederhanakan visualisasi.

**Gambar 7-4.** Forward dan backward pass dari neural network sederhana.

Selama backward pass, setiap parameter yang dapat dilatih datang dengan nilai tambahan, gradiennya, dan state optimizernya. Oleh karena itu, semakin banyak parameter yang dapat dilatih, semakin banyak memori yang dibutuhkan untuk menyimpan nilai-nilai tambahan ini.

### Matematika Memori

Penting untuk mengetahui berapa banyak memori yang dibutuhkan suatu model sehingga Anda dapat menggunakan perangkat keras yang tepat untuknya. Seringkali, Anda mungkin sudah memiliki perangkat keras dan perlu menghitung apakah Anda mampu menjalankan model tertentu. Jika suatu model memerlukan 30 GB memori untuk melakukan inferensi, chip dengan memori 24 GB tidak akan cukup.

Jejak memori model tergantung pada model serta beban kerja dan berbagai teknik optimasi yang digunakan untuk mengurangi penggunaan memorinya. Karena tidak mungkin untuk memperhitungkan semua teknik optimasi dan beban kerja, di bagian ini, saya hanya akan menguraikan formula untuk perhitungan perkiraan, yang seharusnya memberi Anda gambaran kasar tentang berapa banyak memori yang Anda butuhkan untuk mengoperasikan suatu model, baik selama inferensi maupun pelatihan.

Memiliki profil memori yang berbeda antara inferensi dan pelatihan adalah salah satu alasan divergensinya chip untuk pelatihan dan inferensi, seperti yang dibahas di Bab 9.

#### Memori yang Dibutuhkan untuk Inferensi

Selama inferensi, hanya forward pass yang dieksekusi. Forward pass memerlukan memori untuk weight model. Misalkan N adalah jumlah parameter model dan M adalah memori yang dibutuhkan untuk setiap parameter; memori yang dibutuhkan untuk memuat parameter model adalah:

**N × M**

Forward pass juga memerlukan memori untuk nilai aktivasi. Model transformer memerlukan memori untuk vektor key-value untuk mekanisme attention. Memori untuk nilai aktivasi dan vektor key-value tumbuh secara linear dengan panjang urutan dan ukuran batch.

Untuk banyak aplikasi, memori untuk nilai aktivasi dan vektor key-value dapat diasumsikan sebagai 20% dari memori untuk weight model. Jika aplikasi Anda menggunakan konteks yang lebih panjang atau ukuran batch yang lebih besar, memori yang dibutuhkan sebenarnya akan lebih tinggi. Asumsi ini membawa jejak memori model menjadi:

**N × M × 1,2**

Pertimbangkan model 13B parameter. Jika setiap parameter memerlukan 2 byte, weight model akan memerlukan 13B × 2 byte = 26 GB. Total memori untuk inferensi adalah 26 GB × 1,2 = 31,2 GB.

Jejak memori model tumbuh dengan cepat seiring ukurannya. Seiring model menjadi lebih besar, memori menjadi bottleneck untuk mengoperasikannya.8 Model 70B parameter dengan 2 byte per parameter akan memerlukan 140 GB memori yang luar biasa hanya untuk weight-nya.9

#### Memori yang Dibutuhkan untuk Pelatihan

Untuk melatih model, Anda memerlukan memori untuk weight dan aktivasi model, yang telah dibahas. Selain itu, Anda memerlukan memori untuk gradien dan state optimizer, yang skalanya dengan jumlah parameter yang dapat dilatih.

Secara keseluruhan, memori yang dibutuhkan untuk pelatihan dihitung sebagai:

**Memori pelatihan = weight model + aktivasi + gradien + state optimizer**

Selama backward pass, setiap parameter yang dapat dilatih memerlukan satu nilai untuk gradien ditambah nol hingga dua nilai untuk state optimizer, tergantung pada optimizer:

- Optimizer SGD vanilla tidak memiliki state.
- Optimizer momentum menyimpan satu nilai per parameter yang dapat dilatih.
- Optimizer Adam menyimpan dua nilai per parameter yang dapat dilatih.

Bayangkan Anda memperbarui semua parameter dalam model 13B parameter menggunakan optimizer Adam. Karena setiap parameter yang dapat dilatih memiliki tiga nilai untuk gradien dan state optimizer-nya, jika diperlukan dua byte untuk menyimpan setiap nilai, memori yang dibutuhkan untuk gradien dan state optimizer adalah:

**13 miliar × 3 × 2 byte = 78 GB**

Namun, jika Anda hanya memiliki 1 miliar parameter yang dapat dilatih, memori yang dibutuhkan untuk gradien dan state optimizer hanya:

**1 miliar × 3 × 2 byte = 6 GB**

Satu hal penting yang perlu dicatat adalah bahwa dalam formula sebelumnya, saya mengasumsikan bahwa memori yang dibutuhkan untuk aktivasi kurang dari memori yang dibutuhkan untuk weight model. Namun, pada kenyataannya, memori aktivasi bisa jauh lebih besar. Jika aktivasi disimpan untuk perhitungan gradien, memori yang dibutuhkan untuk aktivasi dapat melebihi memori yang dibutuhkan untuk weight model. Gambar 7-5 menunjukkan memori yang dibutuhkan untuk aktivasi dibandingkan dengan memori yang dibutuhkan untuk weight model untuk model Megatron yang berbeda pada skala yang berbeda, menurut makalah "Reducing Activation Recomputation in Large Transformer Models", oleh Korthikanti et al. (2022).

Salah satu cara untuk mengurangi memori yang dibutuhkan untuk aktivasi adalah dengan tidak menyimpannya. Alih-alih menyimpan aktivasi untuk digunakan kembali, Anda menghitung ulang aktivasi saat diperlukan. Teknik ini disebut gradient checkpointing atau activation recomputation. Meskipun ini mengurangi persyaratan memori, teknik ini meningkatkan waktu yang dibutuhkan untuk pelatihan karena penghitungan ulang.10

**Gambar 7-5.** Memori yang dibutuhkan untuk aktivasi dapat melebihi memori yang dibutuhkan untuk weight model. Gambar dari Korthikanti et al., 2022.

### Representasi Numerik

Dalam perhitungan memori sejauh ini, saya telah mengasumsikan bahwa setiap nilai memakan dua byte memori. Memori yang dibutuhkan untuk merepresentasikan setiap nilai dalam model berkontribusi langsung pada jejak memori keseluruhan model. Jika Anda mengurangi memori yang dibutuhkan untuk setiap nilai menjadi setengahnya, memori yang dibutuhkan untuk weight model juga berkurang setengahnya.

Sebelum membahas cara mengurangi memori yang dibutuhkan untuk setiap nilai, berguna untuk memahami representasi numerik. Nilai numerik dalam neural network secara tradisional direpresentasikan sebagai bilangan float. Keluarga format floating point yang paling umum adalah keluarga FP, yang mengikuti standar Institute of Electrical and Electronics Engineers (IEEE) untuk Floating-Point Arithmetic (IEEE 754):

- **FP32** menggunakan 32 bit (4 byte) untuk merepresentasikan float. Format ini disebut single precision.
- **FP64** menggunakan 64 bit (8 byte) dan disebut double precision.
- **FP16** menggunakan 16 bit (2 byte) dan disebut half precision.

Meskipun FP64 masih digunakan dalam banyak komputasi—hingga saat ini, FP64 adalah format default untuk NumPy dan pandas—format ini jarang digunakan dalam neural network karena jejak memorinya. FP32 dan FP16 lebih umum. Format floating point populer lainnya dalam beban kerja AI termasuk BF16 (BFloat16) dan TF32 (TensorFloat-32). BF16 dirancang oleh Google untuk mengoptimalkan performa AI pada TPU dan TF32 dirancang oleh NVIDIA untuk GPU.11

Bilangan juga dapat direpresentasikan sebagai integer. Meskipun belum seumum format floating, representasi integer menjadi semakin populer. Format integer umum adalah INT8 (integer 8-bit) dan INT4 (integer 4-bit).12

Setiap format float biasanya memiliki 1 bit untuk merepresentasikan tanda bilangan, yaitu negatif atau positif. Sisa bit dibagi antara rentang dan presisi:13

**Rentang**
Jumlah bit rentang menentukan rentang nilai yang dapat direpresentasikan oleh format. Lebih banyak bit berarti rentang yang lebih luas. Ini mirip dengan bagaimana memiliki lebih banyak digit memungkinkan Anda merepresentasikan rentang bilangan yang lebih luas.

**Presisi**
Jumlah bit presisi menentukan seberapa tepat suatu bilangan dapat direpresentasikan. Mengurangi jumlah bit presisi membuat bilangan menjadi kurang tepat. Misalnya, jika Anda mengonversi 10,1234 ke format yang hanya dapat mendukung dua digit desimal, nilai ini menjadi 10,12, yang kurang tepat dari nilai aslinya.

Gambar 7-6 menunjukkan format floating point yang berbeda beserta bit rentang dan presisinya.14

**Gambar 7-6.** Format numerik yang berbeda dengan rentang dan presisinya.

Format dengan lebih banyak bit dianggap presisi lebih tinggi. Mengonversi bilangan dengan format presisi tinggi ke format presisi rendah (misalnya, dari FP32 ke FP16) berarti mengurangi presisinya. Mengurangi presisi dapat menyebabkan nilai berubah atau menghasilkan kesalahan. Tabel 7-3 menunjukkan bagaimana nilai FP32 dapat dikonversi ke FP16, BF16, dan TF32.

**Tabel 7-3.** Mengonversi dari nilai FP32 ke format presisi lebih rendah. Ketidakakuratan yang dihasilkan dicetak miring.

| FP32 | FP16 | BF16 | TF32 |
|---|---|---|---|
| 0,0123456789 | 0,0123443603515625 | 0,0123291 | 0,0123443603515625 |
| 0,123456789 | 0,12347412109375 | 0,123535 | 0,1234130859375 |
| 1,23456789 | 1,234375 | 1,23438 | 1,234375 |
| 12,3456789 | 12,34375 | 12,375 | 12,34375 |
| 123,456789 | 123,4375 | 123,5 | 123,4375 |
| 1234,56789 | 1235,0 | 1232,0 | 1234,0 |
| 12345,6789 | 12344,0 | 12352,0 | 12344,0 |
| 123456,789 | INFa | 123392,0 | 123456,0 |
| 1234567,89 | INF | 1236990,0 | 1233920,0 |

a Nilai di luar batas dalam FP16 dibulatkan ke infinity.

Perhatikan dalam Tabel 7-3 bahwa meskipun BF16 dan FP16 memiliki jumlah bit yang sama, BF16 memiliki lebih banyak bit untuk rentang dan lebih sedikit bit untuk presisi. Ini memungkinkan BF16 untuk merepresentasikan nilai besar yang di luar batas untuk FP16. Namun, ini juga membuat BF16 kurang presisi daripada FP16. Misalnya, 1234,56789 adalah 1235,0 dalam FP16 (perubahan nilai 0,035%) tetapi 1232,0 dalam BF16 (perubahan nilai 0,208%).

Saat menggunakan model, pastikan untuk memuat model dalam format yang dimaksudkan. Memuat model ke format numerik yang salah dapat menyebabkan model berubah secara signifikan. Misalnya, Llama 2 memiliki weight-nya disetel ke BF16 saat pertama kali dirilis. Namun, banyak tim memuat model dalam FP16 dan kemudian frustrasi menemukan kualitas model jauh lebih buruk dari yang diiklankan.15 Meskipun kesalahpahaman ini membuang banyak waktu orang, sisi positifnya adalah hal itu memaksa banyak orang untuk belajar tentang representasi numerik.

Format yang tepat untuk Anda tergantung pada distribusi nilai numerik dari beban kerja Anda (seperti rentang nilai yang Anda butuhkan), seberapa sensitif beban kerja Anda terhadap perubahan numerik kecil, dan perangkat keras yang mendasarinya.16

### Quantization

Semakin sedikit bit yang dibutuhkan untuk merepresentasikan nilai model, semakin rendah jejak memori model. Model 10B parameter dalam format 32-bit memerlukan 40 GB untuk weight-nya, tetapi model yang sama dalam format 16-bit hanya memerlukan 20 GB. Mengurangi presisi, juga dikenal sebagai quantization, adalah cara yang murah dan sangat efektif untuk mengurangi jejak memori model. Ini mudah dilakukan dan menggeneralisasi di atas tugas dan arsitektur. Dalam konteks ML, presisi rendah umumnya merujuk pada format apa pun dengan bit lebih sedikit daripada FP32 standar.

#### Quantisasi vs Presisi Berkurang

Secara ketat, itu hanya disebut quantization jika format targetnya adalah integer. Namun, dalam praktiknya, quantization digunakan untuk merujuk pada semua teknik yang mengonversi nilai ke format presisi lebih rendah. Dalam buku ini, saya menggunakan quantization untuk merujuk pada pengurangan presisi, agar konsisten dengan literatur.

Untuk melakukan quantization, Anda perlu memutuskan apa yang akan dikuantisasi dan kapan:

**Apa yang akan dikuantisasi**
Idealnya, Anda ingin mengkuantisasi apa pun yang mengonsumsi sebagian besar memori Anda, tetapi ini juga tergantung pada apa yang dapat Anda kuantisasi tanpa terlalu merusak performa. Seperti yang dibahas di "Matematika Memori" pada halaman 322, kontributor utama jejak memori model selama inferensi adalah weight dan aktivasi model.17 Quantisasi weight lebih umum daripada quantisasi aktivasi, karena aktivasi weight cenderung memiliki dampak yang lebih stabil pada performa dengan kehilangan akurasi yang lebih sedikit.

**Kapan mengkuantisasi**
Quantization dapat terjadi selama pelatihan atau post-training. Post-training quantization (PTQ) berarti mengkuantisasi model setelah sepenuhnya dilatih. PTQ sejauh ini adalah yang paling umum. Ini juga lebih relevan bagi pengembang aplikasi AI yang biasanya tidak melatih model.

#### Quantisasi Inferensi

Di masa-masa awal deep learning, standar adalah melatih dan menyajikan model menggunakan 32 bit dengan FP32. Sejak akhir 2010-an, semakin umum untuk menyajikan model dalam 16 bit dan bahkan presisi yang lebih rendah. Misalnya, Dettmers et al. (2022) telah melakukan pekerjaan luar biasa dalam mengkuantisasi LLM menjadi 8 bit dengan LLM.int8() dan 4 bit dengan QLoRA (Dettmers et al., 2023).

Model juga dapat disajikan dalam presisi campuran, di mana nilai dikurangi presisinya saat memungkinkan dan dipertahankan dalam presisi lebih tinggi saat diperlukan. Untuk menyajikan model pada perangkat, Apple (2024) memanfaatkan skema quantization yang menggunakan campuran format 2-bit dan 4-bit, rata-rata 3,5 bit per weight. Juga pada tahun 2024, dalam antisipasi neural network 4-bit, NVIDIA mengumumkan arsitektur GPU baru mereka, Blackwell, yang mendukung inferensi model dalam float 4-bit.

Setelah Anda mencapai 8 bit ke bawah, representasi numerik menjadi lebih rumit. Anda dapat mempertahankan nilai parameter sebagai float menggunakan salah satu format minifloat, seperti FP8 (8 bit) dan FP4 (4 bit).18 Lebih umum, namun, nilai parameter dikonversi ke format integer, seperti INT8 atau INT4.

Quantization efektif, tetapi ada batas seberapa jauh ia bisa pergi. Anda tidak bisa memiliki kurang dari 1 bit per nilai, dan beberapa orang telah mencoba representasi 1-bit, misalnya, BinaryConnect (Courbariaux et al., 2015), Xnor-Net (Rastegari et al., 2016), dan BitNet (Wang et al., 2023).19

Pada tahun 2024, peneliti Microsoft (Ma et al.) menyatakan bahwa kita memasuki era LLM 1-bit dengan memperkenalkan BitNet b1.58, model bahasa berbasis transformer yang hanya memerlukan 1,58 bit per parameter dan yang performanya sebanding dengan Llama 2 16-bit (Touvron et al., 2023) hingga 3,9B parameter, seperti yang ditunjukkan pada Tabel 7-4.

**Tabel 7-4.** Performa BitNet b1.58 dibandingkan dengan Llama 2 16-bit pada benchmark yang berbeda dan pada ukuran model yang berbeda, hingga 3,9B parameter. Hasil dari Ma et al. (2024).

| Model | Ukuran | ARCe | ARCc | HS | BQ | OQ | PQ | WGe | Rata-rata |
|---|---|---|---|---|---|---|---|---|---|
| Llama LLM | 700M | 54,7 | 23,0 | 37,0 | 60,0 | 20,2 | 68,9 | 54,8 | 45,5 |
| BitNet b1.58 | 700M | 51,8 | 21,4 | 35,1 | 58,2 | 20,0 | 68,1 | 55,2 | 44,3 |
| Llama LLM | 1,3B | 56,9 | 23,5 | 38,5 | 59,1 | 21,6 | 70,0 | 53,9 | 46,2 |
| BitNet b1.58 | 1,3B | 54,9 | 24,2 | 37,7 | 56,7 | 19,6 | 68,8 | 55,8 | 45,4 |
| Llama LLM | 3B | 62,1 | 25,6 | 43,3 | 61,8 | 24,6 | 72,1 | 58,2 | 49,7 |
| BitNet b1.58 | 3B | 61,4 | 28,3 | 42,9 | 61,5 | 26,6 | 71,5 | 59,3 | 50,2 |
| BitNet b1.58 | 3,9B | 64,2 | 28,7 | 44,2 | 63,5 | 24,2 | 73,2 | 60,5 | 51,2 |

Presisi yang berkurang tidak hanya mengurangi jejak memori tetapi juga sering meningkatkan kecepatan komputasi. Pertama, ini memungkinkan ukuran batch yang lebih besar, memungkinkan model untuk memproses lebih banyak input secara paralel. Kedua, presisi yang berkurang mempercepat komputasi, yang lebih lanjut mengurangi latensi inferensi dan waktu pelatihan. Untuk mengilustrasikan ini, pertimbangkan penjumlahan dua bilangan. Jika kita melakukan penjumlahan bit demi bit, dan masing-masing memakan waktu t nanodetik, ini akan memakan waktu 32t nanodetik untuk 32 bit tetapi hanya 16t nanodetik untuk 16 bit.

Namun, mengurangi presisi tidak selalu mengurangi latensi karena komputasi tambahan yang diperlukan untuk konversi format.

Ada kekurangan dari presisi yang berkurang. Setiap konversi sering menyebabkan perubahan nilai kecil, dan banyak perubahan kecil dapat menyebabkan perubahan performa yang besar. Jika suatu nilai berada di luar rentang yang dapat direpresentasikan oleh format presisi berkurang, nilai tersebut mungkin dikonversi ke infinity atau nilai arbitrer, yang menyebabkan kualitas model semakin menurun. Cara mengurangi presisi dengan dampak minimal pada performa model adalah area penelitian aktif, yang dilakukan oleh pengembang model serta pembuat perangkat keras dan pengembang aplikasi.

Inferensi dalam presisi lebih rendah telah menjadi standar. Model dilatih menggunakan format presisi lebih tinggi untuk memaksimalkan performa, kemudian presisinya dikurangi untuk inferensi. Framework ML utama, termasuk PyTorch, TensorFlow, dan transformers dari Hugging Face, menawarkan PTQ secara gratis dengan beberapa baris kode.

Beberapa perangkat edge hanya mendukung inferensi terkuantisasi. Oleh karena itu, framework untuk inferensi on-device, seperti TensorFlow Lite dan PyTorch Mobile, juga menawarkan PTQ.

#### Quantisasi Pelatihan

Quantization selama pelatihan belum seumum PTQ, tetapi semakin gaining traction. Ada dua tujuan berbeda untuk quantisasi pelatihan:

1. Untuk menghasilkan model yang dapat berkinerja baik dalam presisi rendah selama inferensi. Ini untuk mengatasi tantangan bahwa kualitas model mungkin menurun selama post-training quantization.

2. Untuk mengurangi waktu dan biaya pelatihan. Quantization mengurangi jejak memori model, memungkinkan model dilatih pada perangkat keras yang lebih murah atau memungkinkan pelatihan model yang lebih besar pada perangkat keras yang sama. Quantization juga mempercepat komputasi, yang lebih lanjut mengurangi biaya.

Teknik quantization mungkin membantu mencapai satu atau kedua tujuan ini.

Quantization-aware training (QAT) bertujuan untuk menciptakan model dengan kualitas tinggi dalam presisi rendah untuk inferensi. Dengan QAT, model mensimulasikan perilaku presisi rendah (misalnya, 8-bit) selama pelatihan, yang memungkinkan model belajar untuk menghasilkan output berkualitas tinggi dalam presisi rendah. Namun, QAT tidak mengurangi waktu pelatihan model karena komputasinya masih dilakukan dalam presisi tinggi. QAT bahkan dapat meningkatkan waktu pelatihan karena pekerjaan ekstra mensimulasikan perilaku presisi rendah.

Di sisi lain, melatih model langsung dalam presisi lebih rendah dapat membantu kedua tujuan. Orang-orang mencoba melatih model dalam presisi berkurang sejak awal 2016; lihat Hubara et al. (2016) dan Jacob et al. (2017). Character.AI (2024) berbagi bahwa mereka dapat melatih model mereka seluruhnya dalam INT8, yang membantu menghilangkan ketidakcocokan presisi pelatihan/penyajian sambil juga secara signifikan meningkatkan efisiensi pelatihan.

Namun, melatih dalam presisi lebih rendah lebih sulit dilakukan, karena backpropagation lebih sensitif terhadap presisi lebih rendah.20

Pelatihan presisi lebih rendah sering dilakukan dalam presisi campuran, di mana salinan weight disimpan dalam presisi lebih tinggi tetapi nilai lainnya, seperti gradien dan aktivasi, disimpan dalam presisi lebih rendah.21 Anda juga dapat memiliki nilai weight yang kurang sensitif dihitung dalam presisi lebih rendah dan nilai weight yang lebih sensitif dihitung dalam presisi lebih tinggi. Misalnya, LLM-QAT (Liu et al., 2023) mengkuantisasi weight dan aktivasi menjadi 4 bit tetapi mempertahankan embedding dalam 16 bit.

Bagian model yang harus berada dalam presisi lebih rendah dapat disetel secara otomatis menggunakan fungsionalitas automatic mixed precision (AMP) yang ditawarkan oleh banyak framework ML.

Juga dimungkinkan untuk memiliki fase pelatihan yang berbeda dalam tingkat presisi yang berbeda. Misalnya, model dapat dilatih dalam presisi lebih tinggi tetapi di-fine-tune dalam presisi lebih rendah. Ini sangat umum dengan model foundation, di mana tim yang melatih model dari awal mungkin merupakan organisasi dengan komputasi yang cukup untuk pelatihan presisi lebih tinggi. Setelah model dipublikasikan, pengembang dengan akses komputasi yang lebih sedikit dapat melakukan fine-tuning model tersebut dalam presisi lebih rendah.

## Teknik Fine-Tuning

Saya harap bagian sebelumnya telah memperjelas mengapa fine-tuning model skala besar sangat intensif memori. Semakin banyak memori yang dibutuhkan fine-tuning, semakin sedikit orang yang mampu melakukannya. Teknik yang mengurangi jejak memori model membuat fine-tuning lebih mudah diakses, memungkinkan lebih banyak orang untuk mengadaptasi model ke aplikasi mereka.

Bagian ini berfokus pada teknik fine-tuning yang efisien memori, yang berpusat pada parameter-efficient fine-tuning.

Saya juga akan membahas model merging, pendekatan yang menarik tetapi lebih eksperimental untuk membuat model kustom. Meskipun model merging umumnya tidak dianggap sebagai fine-tuning, saya memasukkannya di bagian ini karena bersifat komplementer terhadap fine-tuning. Fine-tuning menyesuaikan satu model dengan kebutuhan spesifik. Model merging menggabungkan beberapa model, sering kali model yang di-fine-tune, untuk tujuan yang sama.

Meskipun menggabungkan beberapa model bukanlah konsep baru, jenis model dan teknik fine-tuning yang baru telah menginspirasi banyak teknik model merging yang kreatif, membuat bagian ini terutama menyenangkan untuk ditulis.

### Parameter-Efficient Fine-Tuning

Di masa-masa awal fine-tuning, model cukup kecil sehingga orang dapat melakukan fine-tuning seluruh model. Pendekatan ini disebut full fine-tuning. Dalam full fine-tuning, jumlah parameter yang dapat dilatih sama persis dengan jumlah parameter.

Full fine-tuning dapat terlihat mirip dengan pelatihan. Perbedaan utamanya adalah pelatihan dimulai dengan weight model yang diacak, sedangkan fine-tuning dimulai dengan weight model yang telah dilatih sebelumnya.

Seperti yang dibahas di "Matematika Memori" pada halaman 322, semakin banyak parameter yang dapat dilatih, semakin banyak memori yang dibutuhkan. Pertimbangkan model 7B parameter:

- Jika Anda menggunakan format 16-bit seperti FP16, memuat weight model saja memerlukan 14 GB memori.
- Full fine-tuning model ini dengan optimizer Adam, juga dalam format 16-bit, memerlukan tambahan 7B × 3 × 2 byte = 42 GB memori.
- Total memori yang dibutuhkan untuk weight model, gradien, dan state optimizer kemudian menjadi 14 GB + 42 GB = 56 GB.

56 GB melebihi kapasitas memori sebagian besar GPU konsumen, yang biasanya datang dengan memori 12-24 GB, dengan GPU kelas atas menawarkan hingga 48 GB. Dan estimasi memori ini belum memperhitungkan memori yang dibutuhkan untuk aktivasi.

Untuk memuat model pada perangkat keras tertentu, Anda dapat mengurangi jejak memori model atau menemukan cara untuk menggunakan memori perangkat keras dengan lebih efisien. Teknik seperti quantization dan PEFT membantu meminimalkan total jejak memori. Teknik yang berfokus pada pemanfaatan memori perangkat keras dengan lebih baik termasuk CPU offloading. Alih-alih mencoba memuat seluruh model di GPU, Anda dapat memindahkan memori berlebih ke CPU, seperti yang ditunjukkan oleh DeepSpeed (Rasley et al., 2020).

Kita juga belum menyentuh fakta bahwa full fine-tuning, terutama supervised fine-tuning dan preference fine-tuning, biasanya memerlukan banyak data teranotasi berkualitas tinggi yang tidak mampu dimiliki sebagian besar orang. Karena persyaratan memori dan data yang tinggi dari full fine-tuning, orang mulai melakukan partial fine-tuning. Dalam partial fine-tuning, hanya beberapa parameter model yang diperbarui. Misalnya, jika model memiliki sepuluh lapisan, Anda mungkin membekukan sembilan lapisan pertama dan hanya melakukan fine-tuning pada lapisan terakhir,22 mengurangi jumlah parameter yang dapat dilatih menjadi 10% dari full fine-tuning.

Meskipun partial fine-tuning dapat mengurangi jejak memori, teknik ini tidak efisien secara parameter. Partial fine-tuning memerlukan banyak parameter yang dapat dilatih untuk mencapai performa yang mendekati full fine-tuning. Sebuah studi oleh Houlsby et al. (2019) menunjukkan bahwa dengan BERT large (Devlin et al., 2018), Anda perlu memperbarui sekitar 25% parameter untuk mencapai performa yang sebanding dengan full fine-tuning pada benchmark GLUE (Wang et al., 2018). Gambar 7-7 menunjukkan kurva performa partial fine-tuning dengan jumlah parameter yang dapat dilatih yang berbeda.

**Gambar 7-7.** Garis biru menunjukkan bahwa partial fine-tuning memerlukan banyak parameter yang dapat dilatih untuk mencapai performa yang sebanding dengan full fine-tuning. Gambar dari Houlsby et al. (2019).

Ini memunculkan pertanyaan: Bagaimana mencapai performa yang mendekati full fine-tuning sambil menggunakan parameter yang dapat dilatih secara signifikan lebih sedikit? Teknik fine-tuning yang dihasilkan dari pencarian ini adalah parameter-efficient. Tidak ada ambang batas yang jelas yang harus dilewati metode fine-tuning untuk dianggap parameter-efficient. Namun, secara umum, teknik dianggap parameter-efficient jika dapat mencapai performa yang mendekati full fine-tuning sambil menggunakan beberapa orde magnitudo lebih sedikit parameter yang dapat dilatih.

Ide PEFT (parameter-efficient fine-tuning) diperkenalkan oleh Houlsby et al. (2019). Penulis menunjukkan bahwa dengan menyisipkan parameter tambahan ke dalam model di tempat yang tepat, Anda dapat mencapai performa fine-tuning yang kuat menggunakan sejumlah kecil parameter yang dapat dilatih. Mereka menyisipkan dua modul adapter ke dalam setiap blok transformer dari model BERT, seperti yang ditunjukkan pada Gambar 7-8.

**Gambar 7-8.** Dengan menyisipkan dua modul adapter ke dalam setiap lapisan transformer untuk model BERT dan hanya memperbarui adapter, Houlsby et al. (2019) mampu mencapai performa fine-tuning yang kuat menggunakan sejumlah kecil parameter yang dapat dilatih.

Selama fine-tuning, mereka mempertahankan parameter asli model tetap tidak berubah dan hanya memperbarui adapter. Jumlah parameter yang dapat dilatih adalah jumlah parameter dalam adapter. Pada benchmark GLUE, mereka mencapai performa dalam 0,4% dari full fine-tuning menggunakan hanya 3% dari jumlah parameter yang dapat dilatih. Garis oranye pada Gambar 7-7 menunjukkan delta performa antara full fine-tuning dan fine-tuning menggunakan ukuran adapter yang berbeda.

Namun, kelemahan dari pendekatan ini adalah meningkatkan latensi inferensi dari model yang di-fine-tune. Adapter memperkenalkan lapisan tambahan, yang menambahkan lebih banyak langkah komputasi ke forward pass, memperlambat inferensi.

PEFT memungkinkan fine-tuning pada perangkat keras yang lebih terjangkau, membuatnya dapat diakses oleh lebih banyak pengembang. Metode PEFT umumnya tidak hanya efisien secara parameter tetapi juga efisien secara sampel. Sementara full fine-tuning mungkin memerlukan puluhan ribu hingga jutaan contoh untuk mencapai peningkatan kualitas yang nyata, beberapa metode PEFT dapat memberikan performa yang kuat dengan hanya beberapa ribu contoh.

Mengingat daya tarik PEFT yang jelas, teknik PEFT sedang dikembangkan dengan cepat. Bagian berikutnya akan memberikan gambaran umum tentang teknik-teknik ini sebelum menyelami lebih dalam teknik PEFT yang paling umum: LoRA.

#### Teknik PEFT

Dunia PEFT yang berkembang pesat saat ini umumnya terbagi menjadi dua kategori: metode berbasis adapter dan metode berbasis soft prompt. Namun, kemungkinan kategori yang lebih baru akan diperkenalkan di masa depan.

Metode berbasis adapter merujuk pada semua metode yang melibatkan modul tambahan pada weight model, seperti yang dikembangkan oleh Houlsby et al. (2019). Karena metode berbasis adapter melibatkan penambahan parameter, metode ini juga disebut metode aditif.

Hingga saat ini, LoRA (Hu et al., 2021) sejauh ini merupakan metode berbasis adapter yang paling populer, dan ini akan menjadi topik bagian berikutnya. Metode berbasis adapter lainnya termasuk BitFit (Zaken et al., 2021), yang muncul sekitar waktu yang sama dengan LoRA. Metode adapter yang lebih baru termasuk IA3 (Liu et al., 2022), yang strategi batching mixed-task-nya yang efisien membuatnya sangat menarik untuk fine-tuning multi-tugas. Metode ini telah terbukti mengungguli LoRA dan bahkan full fine-tuning dalam beberapa kasus. LongLoRA (Chen et al., 2023) adalah varian LoRA yang menggabungkan teknik modifikasi attention untuk memperpanjang panjang konteks.

Jika metode berbasis adapter menambahkan parameter yang dapat dilatih ke arsitektur model, metode berbasis soft prompt memodifikasi cara model memproses input dengan memperkenalkan token khusus yang dapat dilatih. Token tambahan ini dimasukkan ke dalam model bersama dengan token input. Token-token ini disebut soft prompt karena, seperti input (hard prompt), soft prompt juga memandu perilaku model. Namun, soft prompt berbeda dari hard prompt dalam dua hal:

- Hard prompt dapat dibaca manusia. Hard prompt biasanya berisi token diskrit seperti "saya", "tulis", "sebuah", dan "banyak". Sebaliknya, soft prompt adalah vektor kontinu, menyerupai vektor embedding, dan tidak dapat dibaca manusia.
- Hard prompt bersifat statis dan tidak dapat dilatih, sedangkan soft prompt dapat dioptimalkan melalui backpropagation selama proses tuning, memungkinkan mereka disesuaikan untuk tugas tertentu.

Beberapa orang menggambarkan soft prompting sebagai persilangan antara prompt engineering dan fine-tuning. Gambar 7-9 memvisualisasikan bagaimana Anda dapat menggunakan soft prompt bersama dengan hard prompt untuk memandu perilaku model.

**Gambar 7-9.** Hard prompt dan soft prompt dapat digabungkan untuk mengubah perilaku model.

Soft prompt tuning sebagai subfield dicirikan oleh serangkaian teknik yang terdengar mirip yang dapat membingungkan, seperti prefix-tuning (Li dan Liang, 2021), P-Tuning (Liu et al., 2021), dan prompt tuning (Lester et al., 2021).23 Teknik-teknik ini terutama berbeda pada lokasi di mana soft prompt disisipkan. Misalnya, prefix tuning menambahkan token soft prompt di awal input pada setiap lapisan transformer, sedangkan prompt tuning menambahkan token soft prompt hanya pada input yang di-embed. Jika Anda ingin menggunakan salah satunya, banyak framework PEFT akan mengimplementasikannya langsung untuk Anda.

Untuk mendapatkan gambaran tentang metode PEFT apa yang sedang digunakan, saya menganalisis lebih dari 1.000 issue terbuka di repositori GitHub huggingface/peft pada Oktober 2024. Asumsinya adalah jika seseorang menggunakan suatu teknik, mereka lebih mungkin melaporkan issue atau mengajukan pertanyaan tentangnya. Gambar 7-10 menunjukkan hasilnya. Untuk "P-Tuning", saya mencari kata kunci "p_tuning" dan "p tuning" untuk memperhitungkan ejaan yang berbeda.

**Gambar 7-10.** Jumlah issue yang sesuai dengan berbagai teknik fine-tuning dari repositori GitHub huggingface/peft. Ini adalah proksi untuk memperkirakan popularitas setiap teknik.

Dari analisis ini, jelas bahwa LoRA mendominasi. Soft prompt kurang umum, tetapi tampaknya ada minat yang berkembang dari mereka yang menginginkan lebih banyak kustomisasi daripada yang diberikan oleh prompt engineering tetapi tidak ingin berinvestasi dalam fine-tuning.

Karena popularitas LoRA, bagian berikutnya berfokus pada cara kerja LoRA dan bagaimana ia menyelesaikan tantangan yang ditimbulkan oleh metode berbasis adapter awal. Bahkan jika Anda tidak menggunakan LoRA, deep dive ini seharusnya memberikan kerangka kerja bagi Anda untuk menjelajahi metode fine-tuning lainnya.

### LoRA

Tidak seperti metode adapter asli oleh Houlsby et al. (2019), LoRA (Low-Rank Adaptation) (Hu et al., 2021) menggabungkan parameter tambahan dengan cara yang tidak menimbulkan latensi inferensi ekstra. Alih-alih memperkenalkan lapisan tambahan ke model dasar, LoRA menggunakan modul yang dapat digabungkan kembali ke lapisan asli.

Anda dapat menerapkan LoRA ke matriks weight individual. Diberikan sebuah matriks weight, LoRA menguraikan matriks ini menjadi produk dari dua matriks yang lebih kecil, kemudian memperbarui dua matriks yang lebih kecil ini sebelum menggabungkannya kembali ke matriks asli.

Pertimbangkan matriks weight W dengan dimensi n × m. LoRA bekerja sebagai berikut:

1. Pertama, pilih dimensi matriks yang lebih kecil. Misalkan r adalah nilai yang dipilih. Buat dua matriks: A (dimensi n × r) dan B (dimensi r × m). Produk mereka adalah WAB, yang memiliki dimensi yang sama dengan W. r adalah rank LoRA.

2. Tambahkan WAB ke matriks weight asli W untuk membuat matriks weight baru Wʹ. Gunakan Wʹ sebagai pengganti W sebagai bagian dari model. Anda dapat menggunakan hyperparameter α untuk menentukan seberapa besar WAB harus berkontribusi pada matriks baru: **W' = W + (α/r) × WAB**

3. Selama fine-tuning, hanya perbarui parameter di A dan B. W tetap utuh.

Gambar 7-11 memvisualisasikan proses ini.

**Gambar 7-11.** Untuk menerapkan LoRA pada matriks weight W, uraikan menjadi produk dari dua matriks A dan B. Selama fine-tuning, hanya A dan B yang diperbarui. W tetap utuh.

LoRA (Low-Rank Adaptation) dibangun di atas konsep faktorisasi low-rank, teknik reduksi dimensi yang sudah lama ada. Ide kuncinya adalah Anda dapat memfaktorkan matriks besar menjadi produk dari dua matriks yang lebih kecil untuk mengurangi jumlah parameter, yang, pada gilirannya, mengurangi persyaratan komputasi dan memori. Misalnya, matriks 9 × 9 dapat difaktorkan menjadi produk dari dua matriks dengan dimensi 9 × 1 dan 1 × 9. Matriks asli memiliki 81 parameter, tetapi dua matriks produk hanya memiliki 18 parameter secara gabungan.

Jumlah kolom dalam matriks terfaktorkan pertama dan jumlah kolom dalam matriks terfaktorkan kedua sesuai dengan rank faktorisasi. Matriks asli adalah full-rank, sedangkan dua matriks yang lebih kecil merepresentasikan aproksimasi low-rank.

Meskipun faktorisasi dapat secara signifikan mengurangi jumlah parameter, faktorisasi bersifat lossy karena hanya mengaproksimasi matriks asli. Semakin tinggi rank, semakin banyak informasi dari matriks asli yang dapat dipertahankan oleh faktorisasi.

Seperti metode adapter asli, LoRA efisien secara parameter dan efisien secara sampel. Faktorisasi memungkinkan LoRA menggunakan bahkan lebih sedikit parameter yang dapat dilatih. Makalah LoRA menunjukkan bahwa, untuk GPT-3, LoRA mencapai performa yang sebanding atau lebih baik dengan full fine-tuning pada beberapa tugas sambil menggunakan hanya ~4,7M parameter yang dapat dilatih, 0,0027% dari full fine-tuning.

#### Mengapa LoRA Bekerja?

Metode parameter-efficient seperti LoRA telah menjadi begitu populer sehingga banyak orang menganggapnya begitu saja. Tetapi mengapa efisiensi parameter mungkin sama sekali? Jika suatu model memerlukan banyak parameter untuk mempelajari perilaku tertentu selama pre-training, bukankah model tersebut juga memerlukan banyak parameter untuk mengubah perilakunya selama fine-tuning?

Pertanyaan yang sama dapat diajukan untuk data. Jika suatu model memerlukan banyak data untuk mempelajari suatu perilaku, bukankah model tersebut juga memerlukan banyak data untuk mengubah perilaku ini secara bermakna? Bagaimana mungkin Anda memerlukan jutaan atau miliaran contoh untuk pre-training suatu model, tetapi hanya ratusan atau ribuan contoh untuk fine-tuning-nya?

Banyak makalah telah berpendapat bahwa meskipun LLM memiliki banyak parameter, mereka memiliki dimensi intrinsik yang sangat rendah; lihat Li et al. (2018); Aghajanyan et al. (2020); dan Hu et al. (2021). Mereka menunjukkan bahwa pre-training secara implisit meminimalkan dimensi intrinsik model. Mengejutkannya, model yang lebih besar cenderung memiliki dimensi intrinsik yang lebih rendah setelah pre-training. Ini menunjukkan bahwa pre-training bertindak sebagai framework kompresi untuk tugas downstream. Dengan kata lain, semakin baik suatu LLM dilatih, semakin mudah untuk melakukan fine-tuning pada model tersebut menggunakan sejumlah kecil parameter yang dapat dilatih dan sejumlah kecil data.

Anda mungkin bertanya-tanya, jika faktorisasi low-rank bekerja dengan sangat baik, mengapa kita tidak menggunakan LoRA untuk pre-training juga? Alih-alih pre-training model besar dan menerapkan faktorisasi low-rank hanya selama fine-tuning, bisakah kita memfaktorkan model dari awal untuk pre-training? Pre-training low-rank dapat secara signifikan mengurangi jumlah parameter model, secara signifikan mengurangi waktu dan biaya pre-training model.

Sepanjang 2010-an, banyak orang mencoba melatih neural network low-rank, yang dicontohkan dalam studi seperti "Low-Rank Matrix Factorization for Deep Neural Network Training with High-Dimensional Output Targets" (Sainath et al., 2013), "Semi-Orthogonal Low-Rank Matrix Factorization for Deep Neural Networks" (Povey et al., 2018), dan "Speeding up Convolutional Neural Networks with Low Rank Expansions" (Jaderberg et al., 2014).

Faktorisasi low-rank telah terbukti efektif pada skala yang lebih kecil. Misalnya, dengan menerapkan berbagai strategi faktorisasi, termasuk mengganti konvolusi 3 × 3 dengan konvolusi 1 × 1, SqueezeNet (Iandola et al., 2016) mencapai akurasi tingkat AlexNet pada ImageNet menggunakan 50 kali lebih sedikit parameter.

Upaya yang lebih baru untuk melatih LLM low-rank termasuk ReLoRA (Lialin et al., 2023) dan GaLore (Zhao et al., 2024). ReLoRA bekerja untuk model berbasis transformer hingga 1,3B parameter. GaLore mencapai performa yang sebanding dengan model full-rank pada 1B parameter dan performa yang menjanjikan pada 7B parameter.

Mungkin suatu hari yang tidak terlalu jauh di masa depan, peneliti akan mengembangkan cara untuk meningkatkan skala pre-training low-rank hingga ratusan miliar parameter. Namun, jika argumen Aghajanyan et al. benar—bahwa pre-training secara implisit mengompresi dimensi intrinsik model—pre-training full-rank masih diperlukan untuk cukup mengurangi dimensi intrinsik model ke titik di mana faktorisasi low-rank dapat bekerja. Akan menarik untuk mempelajari secara tepat berapa banyak pelatihan full-rank yang diperlukan sebelum memungkinkan untuk beralih ke pelatihan low-rank.

#### Konfigurasi LoRA

Untuk menerapkan LoRA, Anda perlu memutuskan matriks weight apa yang akan diterapkan LoRA dan rank setiap faktorisasi. Bagian ini akan membahas pertimbangan untuk masing-masing keputusan ini.

LoRA dapat diterapkan ke setiap matriks weight individual. Efisiensi LoRA, oleh karena itu, tidak hanya tergantung pada matriks apa LoRA diterapkan tetapi juga pada arsitektur model, karena arsitektur yang berbeda memiliki matriks weight yang berbeda.

Meskipun telah ada contoh LoRA dengan arsitektur lain, seperti convolutional neural network (Dutt et al., 2023; Zhong et al., 2024; Aleem et al., 2024), LoRA terutama digunakan untuk model transformer.24 LoRA paling umum diterapkan pada empat matriks weight dalam modul attention: matriks query (Wq), key (Wk), value (Wv), dan output projection (Wo).

Biasanya, LoRA diterapkan secara seragam ke semua matriks dengan tipe yang sama dalam suatu model. Misalnya, menerapkan LoRA pada matriks query berarti menerapkan LoRA ke semua matriks query dalam model.

Secara naif, Anda dapat menerapkan LoRA ke semua matriks attention ini. Namun, sering kali, Anda dibatasi oleh memori perangkat keras Anda dan hanya dapat menampung sejumlah tetap parameter yang dapat dilatih. Diberikan anggaran tetap parameter yang dapat dilatih, matriks apa yang harus Anda terapkan LoRA, untuk memaksimalkan performa?

Saat melakukan fine-tuning pada GPT-3 175B, Hu et al. (2021) menetapkan anggaran parameter yang dapat dilatih mereka pada 18M, yaitu 0,01% dari total jumlah parameter model. Anggaran ini memungkinkan mereka untuk menerapkan LoRA pada hal-hal berikut:

1. Satu matriks dengan rank 8
2. Dua matriks dengan rank 4
3. Keempat matriks dengan rank 2

GPT-3 175B memiliki 96 lapisan transformer dengan dimensi model 12.288. Menerapkan LoRA dengan rank = 2 ke keempat matriks akan menghasilkan (12.288 × 2 × 2) × 4 = 196.608 parameter yang dapat dilatih per lapisan, atau 18.874.368 parameter yang dapat dilatih untuk seluruh model.

Mereka menemukan bahwa menerapkan LoRA ke keempat matriks dengan rank = 2 menghasilkan performa terbaik pada benchmark WikiSQL (Zhong et al., 2017) dan MultiNLI (Multi-Genre Natural Language Inference) (Williams et al., 2017). Tabel 7-5 menunjukkan hasil mereka. Namun, penulis menyarankan bahwa jika Anda hanya dapat memilih dua matriks attention, matriks query dan value umumnya menghasilkan hasil terbaik.

**Tabel 7-5.** Performa LoRA dengan anggaran 18M parameter yang dapat dilatih. Hasil dari LoRA (Hu et al., 2021).

| Jumlah parameter yang dapat dilatih = 18M | | | | | | | |
|---|---|---|---|---|---|---|---|
| Tipe Weight | Wq | Wk | Wv | Wo | Wq, Wk | Wq, Wv | Wq, Wk, Wv, Wo |
| Rank r | 8 | 8 | 8 | 8 | 4 | 4 | 2 |
| WikiSQL (± 0,5%) | 70,4 | 70,0 | 73,0 | 73,2 | 71,4 | 73,7 | 73,7 |
| MultiNLI (± 0,1%) | 91,0 | 90,8 | 91,0 | 91,3 | 91,3 | 91,3 | 91,7 |

Pengamatan empiris menunjukkan bahwa menerapkan LoRA ke lebih banyak matriks weight, termasuk matriks feedforward, menghasilkan hasil yang lebih baik. Misalnya, Databricks menunjukkan bahwa peningkatan performa terbesar yang mereka dapatkan adalah dari menerapkan LoRA ke semua lapisan feedforward (Sooriyarachchi, 2023). Fomenko et al. (2024) mencatat bahwa LoRA berbasis feedforward dapat bersifat komplementer terhadap LoRA berbasis attention, meskipun LoRA berbasis attention biasanya menawarkan efikasi yang lebih besar dalam batasan memori.

Keindahan LoRA adalah bahwa meskipun performanya tergantung pada rank-nya, studi telah menunjukkan bahwa r yang kecil, seperti antara 4 dan 64, biasanya cukup untuk banyak kasus penggunaan. r yang lebih kecil berarti lebih sedikit parameter LoRA, yang diterjemahkan ke jejak memori yang lebih rendah.

Penulis LoRA mengamati bahwa, mengejutkan bagi mereka, meningkatkan nilai r tidak meningkatkan performa fine-tuning. Pengamatan ini konsisten dengan laporan Databricks bahwa "meningkatkan r di luar nilai tertentu mungkin tidak menghasilkan peningkatan yang terlihat dalam kualitas output model" (Sooriyarachchi, 2023).25 Beberapa berpendapat bahwa r yang lebih tinggi bahkan dapat merugikan karena dapat menyebabkan overfitting. Namun, dalam beberapa kasus, rank yang lebih tinggi mungkin diperlukan. Raschka (2023) menemukan bahwa r = 256 mencapai performa terbaik pada tugasnya.

Hyperparameter LoRA lain yang dapat Anda konfigurasikan adalah nilai α yang menentukan seberapa besar produk WAB harus berkontribusi pada matriks baru selama penggabungan: **W' = W + (α/r) × WAB**. Dalam praktiknya, saya sering melihat α dipilih sehingga rasio α:r biasanya antara 1:8 dan 8:1, tetapi rasio optimal bervariasi. Misalnya, jika r kecil, Anda mungkin ingin α lebih besar, dan jika r besar, Anda mungkin ingin α lebih kecil. Eksperimen diperlukan untuk menentukan kombinasi (r, α) terbaik untuk kasus penggunaan Anda.

#### Menyajikan Adapter LoRA

LoRA tidak hanya memungkinkan Anda melakukan fine-tuning pada model menggunakan lebih sedikit memori dan data, tetapi juga menyederhanakan penyajian beberapa model karena modularitasnya. Untuk memahami manfaat ini, mari kita periksa cara menyajikan model yang di-fine-tune dengan LoRA.

Secara umum, ada dua cara untuk menyajikan model yang di-fine-tune dengan LoRA:

1. Gabungkan weight LoRA A dan B ke dalam model asli untuk membuat matriks baru Wʹ sebelum menyajikan model yang di-fine-tune. Karena tidak ada komputasi ekstra yang dilakukan selama inferensi, tidak ada latensi ekstra yang ditambahkan.

2. Pertahankan W, A, dan B terpisah selama penyajian. Proses penggabungan A dan B kembali ke W terjadi selama inferensi, yang menambahkan latensi ekstra.

Opsi pertama umumnya lebih baik jika Anda hanya memiliki satu model LoRA untuk disajikan, sedangkan opsi kedua umumnya lebih baik untuk penyajian multi-LoRA—menyajikan beberapa model LoRA yang berbagi model dasar yang sama. Gambar 7-12 memvisualisasikan penyajian multi-LoRA jika Anda mempertahankan adapter LoRA terpisah.

**Gambar 7-12.** Mempertahankan adapter LoRA terpisah memungkinkan penggunaan kembali matriks full-rank W yang sama dalam penyajian multi-LoRA.

Untuk penyajian multi-LoRA, meskipun opsi 2 menambahkan overhead latensi, opsi ini secara signifikan mengurangi penyimpanan yang dibutuhkan. Pertimbangkan skenario di mana Anda melakukan fine-tuning pada model untuk setiap pelanggan Anda menggunakan LoRA. Dengan 100 pelanggan, Anda berakhir dengan 100 model yang di-fine-tune, semuanya berbagi model dasar yang sama. Dengan opsi 1, Anda harus menyimpan 100 matriks full-rank Wʹ. Dengan opsi 2, Anda hanya perlu menyimpan satu matriks full-rank W, dan 100 set matriks yang lebih kecil (A, B).

Untuk menempatkan ini dalam perspektif, katakanlah matriks asli W memiliki dimensi 4096 × 4096 (16,8M parameter). Jika rank LoRA adalah 8, jumlah parameter dalam A dan B adalah 4096 × 8 × 2 = 65.536:

- Dalam opsi 1, 100 matriks full-rank Wʹ total 16,8M × 100 = 1,68B parameter.
- Dalam opsi 2, satu matriks full-rank W dan 100 set matriks kecil (A, B) total: 16,8M + 65.536 × 100 = 23,3M parameter.

Opsi 2 juga membuatnya lebih cepat untuk beralih antar tugas. Katakanlah Anda saat ini melayani pelanggan X menggunakan model pelanggan ini. Untuk beralih ke melayani pelanggan Y, alih-alih memuat matriks weight penuh pelanggan ini, Anda hanya perlu memuat adapter LoRA Y, yang dapat secara signifikan mengurangi waktu pemuatan. Meskipun mempertahankan A dan B terpisah menimbulkan latensi tambahan, ada teknik optimasi untuk meminimalkan latensi yang ditambahkan. Repositori GitHub buku ini berisi walkthrough tentang cara melakukannya.

Penyajian multi-LoRA memudahkan untuk menggabungkan beberapa model yang dispesialisasikan. Alih-alih memiliki satu model besar yang kuat untuk banyak tugas, Anda dapat memiliki satu adapter LoRA untuk setiap tugas. Misalnya, Apple menggunakan beberapa adapter LoRA untuk mengadaptasi model dasar 3B parameter yang sama ke fitur iPhone yang berbeda (2024). Mereka memanfaatkan teknik quantization untuk lebih lanjut mengurangi jejak memori model dasar dan adapter ini, memungkinkan penyajian semuanya on-device.

Modularitas adapter LoRA berarti bahwa adapter LoRA dapat dibagikan dan digunakan kembali. Ada adapter LoRA yang di-fine-tune yang tersedia secara publik yang dapat Anda gunakan seperti Anda menggunakan model pre-trained. Anda dapat menemukannya di Hugging Face26 atau inisiatif seperti AdapterHub.

Anda mungkin bertanya-tanya: "LoRA terdengar hebat, tetapi apa tangkapannya?" Kelemahan utama LoRA adalah bahwa LoRA tidak menawarkan performa sekuat full fine-tuning. LoRA juga lebih menantang untuk dilakukan daripada full fine-tuning karena melibatkan modifikasi implementasi model, yang memerlukan pemahaman tentang arsitektur model dan keterampilan coding. Namun, ini biasanya hanya menjadi masalah untuk model dasar yang kurang populer. Framework PEFT—seperti PEFT dari Hugging Face, Axolotl, unsloth, dan LitGPT—kemungkinan mendukung LoRA untuk model dasar yang populer langsung dari kotak.

#### Quantized LoRA

Munculnya LoRA yang cepat telah mengarah pada pengembangan banyak varian LoRA. Beberapa bertujuan untuk mengurangi jumlah parameter yang dapat dilatih bahkan lebih jauh. Namun, seperti yang diilustrasikan dalam Tabel 7-6, memori adapter LoRA minimal dibandingkan dengan memori weight model. Mengurangi jumlah parameter LoRA mengurangi jejak memori keseluruhan hanya dengan persentase kecil.

**Tabel 7-6.** Memori yang dibutuhkan oleh weight LoRA dibandingkan dengan yang dibutuhkan oleh weight model.

| Weight Model Memori (16 bit) | Parameter LoRA yang Dapat Dilatih (r=2, matriks query & key) | Memori Adapter LoRA (16 bit) |
|---|---|---|
| Llama 2 (13B) | 26 GB | 3,28M | 6,55 MB |
| GPT-3 (175B) | 350 GB | 18,87M | 37,7 MB |

Alih-alih mencoba mengurangi jumlah parameter LoRA, Anda dapat mengurangi penggunaan memori dengan lebih efektif dengan mengkuantisasi weight, aktivasi, dan/atau gradien model selama fine-tuning. Versi LoRA terkuantisasi awal yang menjanjikan adalah QLoRA (Dettmers et al., 2023).27 Dalam makalah LoRA asli, selama fine-tuning, weight model disimpan menggunakan 16 bit. QLoRA menyimpan weight model dalam 4 bit tetapi mendekuantisasi (mengonversi) mereka kembali ke BF16 saat menghitung forward dan backward pass.

Format 4-bit yang digunakan QLoRA adalah NF4 (NormalFloat-4), yang mengkuantisasi nilai berdasarkan wawasan bahwa weight pre-trained biasanya mengikuti distribusi normal dengan median nol. Di atas quantization 4-bit, QLoRA juga menggunakan optimizer berpaged untuk secara otomatis mentransfer data antara CPU dan GPU saat GPU kehabisan memori, terutama dengan panjang urutan yang panjang. Teknik-teknik ini memungkinkan model 65B parameter di-fine-tune pada satu GPU 48 GB.

Penulis melakukan fine-tuning pada berbagai model, termasuk Llama 7B hingga 65B, dalam mode 4-bit. Keluarga model yang dihasilkan, yang disebut Guanaco, menunjukkan performa yang kompetitif pada benchmark publik dan evaluasi komparatif. Tabel 7-7 menunjukkan peringkat Elo dari model Guanaco, GPT-4, dan ChatGPT pada Mei 2023, seperti yang dinilai oleh GPT-4. Meskipun Guanaco 65B tidak mengungguli GPT-4, model ini sering lebih disukai daripada ChatGPT.

**Tabel 7-7.** Peringkat Elo dari model Guanaco dibandingkan dengan model populer pada Mei 2023 menggunakan GPT-4 sebagai juri. Eksperimen dari QLoRA (Dettmers et al., 2023).

| Model | Ukuran | Elo |
|---|---|---|
| GPT-4 | - | 1348 ± 1 |
| Guanaco 65B | 41 GB | 1022 ± 1 |
| Guanaco 33B | 21 GB | 992 ± 1 |
| Vicuna 13B | 26 GB | 974 ± 1 |
| ChatGPT | - | 966 ± 1 |
| Guanaco 13B | 10 GB | 916 ± 1 |
| Bard | - | 902 ± 1 |
| Guanaco 7B | 6 GB | 879 ± 1 |

Keterbatasan utama QLoRA adalah bahwa quantization NF4 mahal. Meskipun QLoRA dapat mengurangi jejak memori, QLoRA mungkin meningkatkan waktu pelatihan karena waktu ekstra yang diperlukan oleh langkah quantization dan dequantization.

Karena janji penghematan memorinya, LoRA terkuantisasi adalah area penelitian aktif. Selain QLoRA, karya LoRA terkuantisasi termasuk QA-LoRA (Xu et al., 2023), ModuLoRA (Yin et al., 2023), dan IR-QLoRA (Qin et al., 2024).

## Model Merging dan Multi-Task Fine-Tuning

Jika fine-tuning memungkinkan Anda membuat model kustom dengan mengubah satu model, model merging memungkinkan Anda membuat model kustom dengan menggabungkan beberapa model. Model merging menawarkan fleksibilitas yang lebih besar daripada fine-tuning saja. Anda dapat mengambil dua model yang tersedia dan menggabungkannya untuk membuat model baru, yang semoga lebih berguna. Anda juga dapat melakukan fine-tuning pada salah satu atau semua model konstituen sebelum menggabungkannya.

Meskipun Anda tidak harus melakukan fine-tuning lebih lanjut pada model yang digabungkan, performanya sering kali dapat ditingkatkan dengan fine-tuning. Tanpa fine-tuning, model merging dapat dilakukan tanpa GPU, membuat merging sangat menarik bagi pengembang model independen yang tidak memiliki akses ke banyak komputasi.

Tujuan model merging adalah untuk membuat satu model yang memberikan nilai lebih daripada menggunakan semua model konstituen secara terpisah. Nilai tambah dapat berasal dari peningkatan performa. Misalnya, jika Anda memiliki dua model yang bagus dalam hal yang berbeda pada tugas yang sama, Anda dapat menggabungkannya menjadi satu model yang lebih baik dari keduanya pada tugas tersebut. Bayangkan satu model yang dapat menjawab 60% pertama pertanyaan dan model lain yang dapat menjawab 60% terakhir pertanyaan. Digabungkan, mungkin mereka dapat menjawab 80% pertanyaan.

Nilai tambah juga dapat berasal dari jejak memori yang berkurang, yang mengarah pada pengurangan biaya. Misalnya, jika Anda memiliki dua model yang dapat melakukan tugas yang berbeda, keduanya dapat digabungkan menjadi satu model yang dapat melakukan kedua tugas tetapi dengan lebih sedikit parameter. Ini sangat menarik untuk model berbasis adapter. Diberikan dua model yang di-fine-tune di atas model dasar yang sama, Anda dapat menggabungkan adapter mereka menjadi satu adapter.

Satu kasus penggunaan penting dari model merging adalah multi-task fine-tuning. Tanpa model merging, jika Anda ingin melakukan fine-tuning pada model untuk banyak tugas, Anda umumnya harus mengikuti salah satu pendekatan ini:

**Fine-tuning simultan**
Anda membuat dataset dengan contoh untuk semua tugas dan melakukan fine-tuning pada model pada dataset ini untuk membuat model mempelajari semua tugas secara simultan. Namun, karena umumnya lebih sulit untuk mempelajari banyak keterampilan secara bersamaan, pendekatan ini biasanya memerlukan lebih banyak data dan lebih banyak pelatihan.

**Fine-tuning sekuensial**
Anda dapat melakukan fine-tuning pada model pada setiap tugas secara terpisah tetapi sekuensial. Setelah melatih model pada tugas A, latih pada tugas B, dan seterusnya. Asumsinya adalah lebih mudah bagi model untuk mempelajari satu tugas pada satu waktu. Sayangnya, neural network rentan terhadap catastrophic forgetting (Kirkpatrick et al., 2016). Model dapat melupakan cara melakukan tugas lama saat dilatih pada tugas baru, yang mengarah pada penurunan performa yang signifikan pada tugas-tugas sebelumnya.

Model merging menawarkan metode lain untuk multi-task fine-tuning. Anda dapat melakukan fine-tuning pada model pada tugas yang berbeda secara terpisah tetapi secara paralel. Setelah selesai, model-model yang berbeda ini digabungkan bersama. Fine-tuning pada setiap tugas secara terpisah memungkinkan model mempelajari tugas tersebut dengan lebih baik. Karena tidak ada pembelajaran sekuensial, ada lebih sedikit risiko catastrophic forgetting.

Model merging juga menarik ketika Anda harus menyebarkan model ke perangkat seperti ponsel, laptop, mobil, smartwatch, dan robot gudang. Penyebaran on-device sering kali menantang karena kapasitas memori on-device yang terbatas. Alih-alih memeras banyak model untuk tugas yang berbeda ke dalam satu perangkat, Anda dapat menggabungkan model-model ini bersama menjadi satu model yang dapat melakukan banyak tugas sambil memerlukan jauh lebih sedikit memori.

Penyebaran on-device diperlukan untuk kasus penggunaan di mana data tidak dapat meninggalkan perangkat (sering karena privasi), atau di mana ada akses internet yang terbatas atau tidak dapat diandalkan. Penyebaran on-device juga dapat secara signifikan mengurangi biaya inferensi. Semakin banyak komputasi yang dapat Anda alihkan ke perangkat pengguna, semakin sedikit yang harus Anda bayar ke pusat data.28

Model merging adalah salah satu cara untuk melakukan federated learning (McMahan et al., 2016), di mana beberapa perangkat melatih model yang sama menggunakan data yang terpisah. Misalnya, jika Anda menyebarkan model X ke banyak perangkat, setiap salinan X dapat terus belajar secara terpisah dari data on-device. Setelah beberapa waktu, Anda memiliki banyak salinan X, semuanya dilatih pada data yang berbeda. Anda dapat menggabungkan salinan-salinan ini bersama menjadi satu model dasar baru yang berisi pembelajaran dari semua model konstituen.

Ide menggabungkan model bersama untuk mendapatkan performa yang lebih baik dimulai dengan metode model ensemble. Menurut Wikipedia, ensembling menggabungkan "banyak algoritma pembelajaran untuk mendapatkan performa prediktif yang lebih baik daripada yang bisa diperoleh dari algoritma pembelajaran konstituen mana pun sendiri." Jika model merging biasanya melibatkan pencampuran parameter model konstituen bersama, ensembling biasanya hanya menggabungkan output model sambil mempertahankan setiap model konstituen tetap utuh.

Misalnya, dalam ensembling, diberikan sebuah query, Anda mungkin menggunakan tiga model untuk menghasilkan tiga jawaban yang berbeda. Kemudian, jawaban akhir dihasilkan berdasarkan ketiga jawaban ini, menggunakan voting mayoritas sederhana atau modul ML lain yang dapat dilatih.29 Meskipun ensembling umumnya dapat meningkatkan performa, ensembling memiliki biaya inferensi yang lebih tinggi karena memerlukan banyak panggilan inferensi per permintaan.

Gambar 7-13 membandingkan ensembling dan model merging. Sama seperti model ensemble yang dulu mendominasi leaderboard, banyak model di puncak Open LLM Leaderboard Hugging Face adalah model yang digabungkan.

**Gambar 7-13.** Cara kerja ensembling dan model merging.

Banyak teknik model merging bersifat eksperimental dan mungkin menjadi usang seiring komunitas mendapatkan pemahaman yang lebih baik tentang teori yang mendasarinya. Untuk alasan ini, saya akan berfokus pada pendekatan merging tingkat tinggi daripada teknik individual mana pun.

Pendekatan model merging berbeda dalam cara parameter konstituen digabungkan. Tiga pendekatan yang dibahas di sini adalah penjumlahan, layer stacking, dan konkatenasi. Gambar 7-14 menunjukkan perbedaan tingkat tinggi mereka.

**Gambar 7-14.** Tiga pendekatan utama untuk model merging: penjumlahan, layer stacking, dan konkatenasi.

Anda dapat mencampur pendekatan-pendekatan ini saat menggabungkan model, misalnya, menjumlahkan beberapa lapisan dan menumpuk yang lain. Mari kita jelajahi masing-masing pendekatan ini.

### Penjumlahan

Pendekatan ini melibatkan penambahan nilai weight dari model konstituen bersama. Saya akan membahas dua metode penjumlahan: kombinasi linear dan interpolasi linear sferis. Jika parameter dalam dua model berada dalam skala yang berbeda, misalnya, nilai parameter satu model jauh lebih besar dari yang lain, Anda dapat menskala ulang model sebelum menjumlahkan sehingga nilai parameter mereka berada dalam rentang yang sama.

#### Kombinasi Linear

Kombinasi linear mencakup rata-rata dan rata-rata tertimbang. Diberikan dua model, A dan B, rata-rata tertimbang mereka adalah:

**Merge(A, B) = (WA × A + WB × B) / (WA + WB)**

Gambar 7-15 menunjukkan cara menggabungkan dua lapisan secara linear ketika wA = wB = 1.

**Gambar 7-15.** Menggabungkan parameter dengan merata-ratakannya.

Kombinasi linear bekerja dengan mengejutkan baik, mengingat betapa sederhananya.30 Ide bahwa banyak model dapat digabungkan secara linear untuk membuat model yang lebih baik telah dipelajari sejak awal 1990-an (Perrone, 1993). Kombinasi linear sering digunakan dalam federated learning (Wang et al., 2020).

Anda dapat menggabungkan seluruh model atau bagian model secara linear. Model soups (Wortsman et al., 2022) menunjukkan bagaimana merata-ratakan seluruh weight dari beberapa model yang di-fine-tune dapat meningkatkan akurasi tanpa meningkatkan waktu inferensi. Namun, lebih umum untuk menggabungkan model dengan menggabungkan komponen spesifik secara linear, seperti adapter mereka.

Meskipun Anda dapat menggabungkan secara linear setiap set model, kombinasi linear paling efektif untuk model yang di-fine-tune di atas model dasar yang sama. Dalam hal ini, kombinasi linear dapat dilihat melalui konsep task vectors. Idenya adalah setelah Anda melakukan fine-tuning pada model untuk tugas tertentu, mengurangi model dasar darinya seharusnya memberi Anda vektor yang menangkap esensi tugas. Task vectors juga disebut delta parameters. Jika Anda melakukan fine-tuning menggunakan LoRA, Anda dapat membangun task vector dari weight LoRA.

Task vectors memungkinkan kita melakukan aritmatika tugas (Ilharco et al., 2022), seperti menambahkan dua task vector untuk menggabungkan kemampuan tugas atau mengurangi task vector untuk mengurangi kemampuan spesifik. Pengurangan task vector dapat berguna untuk menghilangkan perilaku model yang tidak diinginkan, seperti kemampuan invasif seperti pengenalan wajah atau bias yang diperoleh selama pre-training.

Kombinasi linear langsung ketika komponen yang akan digabungkan memiliki arsitektur yang sama dan ukuran yang sama. Namun, kombinasi linear juga dapat bekerja untuk model yang tidak berbagi arsitektur atau ukuran yang sama. Misalnya, jika satu lapisan model lebih besar dari model lain, Anda dapat memproyeksikan satu atau kedua lapisan ke dimensi yang sama.

Beberapa orang mengusulkan menyelaraskan model sebelum merata-ratakan untuk memastikan bahwa parameter yang terkait secara fungsional dirata-ratakan bersama, seperti dalam "Model Fusion via Optimal Transport" (Singh dan Jaggi, 2020), "Git Re-Basin: Merging Models Modulo Permutation Symmetries" (Ainsworth et al., 2022), dan "Merging by Matching Models in Task Parameter Subspaces" (Tam et al., 2023). Meskipun masuk akal untuk menggabungkan parameter yang selaras, menyelaraskan parameter dapat menantang untuk dilakukan, dan, oleh karena itu, pendekatan ini kurang umum daripada kombinasi linear naif.

#### Interpolasi Linear Sferis (SLERP)

Metode penjumlahan model umum lainnya adalah SLERP, yang didasarkan pada operator matematika dengan nama yang sama, Spherical LinEar inteRPolation.

Interpolasi berarti memperkirakan nilai yang tidak diketahui berdasarkan nilai yang diketahui. Dalam kasus model merging, nilai yang tidak diketahui adalah model yang digabungkan, dan nilai yang diketahui adalah model konstituen. Kombinasi linear adalah satu teknik interpolasi. SLERP adalah teknik lainnya.

Karena formula untuk SLERP matematis, dan alat model merging biasanya mengimplementasikannya untuk Anda, saya tidak akan membahas detailnya di sini. Secara intuitif, Anda dapat memikirkan setiap komponen (vektor) yang akan digabungkan sebagai titik pada bola. Untuk menggabungkan dua vektor, Anda pertama-tama menggambar jalur terpendek antara kedua titik ini di sepanjang permukaan bola. Ini mirip dengan menggambar jalur terpendek antara dua kota di sepanjang permukaan Bumi. Vektor yang digabungkan dari kedua vektor ini adalah titik di sepanjang jalur terpendek mereka. Di mana tepatnya titik jatuh di sepanjang jalur tergantung pada faktor interpolasi, yang dapat Anda atur antara 0 dan 1. Nilai faktor kurang dari 0,5 membawa vektor yang digabungkan lebih dekat ke vektor pertama, yang berarti bahwa vektor tugas pertama akan berkontribusi lebih banyak pada hasil. Faktor 0,5 berarti Anda memilih titik tepat di tengah. Titik tengah ini adalah titik biru pada Gambar 7-16.

SLERP, sebagai operasi matematika, didefinisikan dengan hanya dua vektor, yang berarti bahwa Anda hanya dapat menggabungkan dua vektor pada satu waktu. Jika Anda ingin menggabungkan lebih dari dua vektor, Anda mungkin dapat melakukan SLERP secara sekuensial, yaitu, menggabungkan A dengan B, dan kemudian menggabungkan hasil tersebut dengan C.

**Gambar 7-16.** Cara kerja SLERP untuk dua vektor t1 dan t2. Garis merah adalah jalur terpendek mereka di permukaan bola. Tergantung pada interpolasi, vektor yang digabungkan dapat berupa titik mana pun di sepanjang jalur ini. Vektor biru adalah vektor yang digabungkan ketika faktor interpolasi adalah 0,5.

#### Memangkas Parameter Spesifik-Tugas yang Redundan

Selama fine-tuning, banyak parameter model disesuaikan. Namun, sebagian besar penyesuaian ini kecil dan tidak berkontribusi secara signifikan pada performa model pada tugas.31 Penyesuaian yang tidak berkontribusi pada performa model dianggap redundan.

Dalam makalah "TIES-Merging: Resolving Interference When Merging Models", Yadav et al. (2023) menunjukkan bahwa Anda dapat mereset sebagian besar parameter task vector dengan degradasi performa minimal, seperti yang ditunjukkan pada Gambar 7-17. Mereset berarti mengubah parameter yang di-fine-tune ke nilai aslinya dalam model dasar, secara efektif mengatur parameter task vector yang sesuai menjadi nol. (Ingat bahwa task vector dapat diperoleh dengan mengurangi model dasar dari model yang di-fine-tune.)

**Gambar 7-17.** Dalam eksperimen Yadav et al., mempertahankan 20% teratas parameter task vector memberikan performa yang sebanding dengan mempertahankan 100% parameter.

Parameter redundan ini, meskipun tidak berbahaya bagi satu model, mungkin berbahaya bagi model yang digabungkan. Teknik merging seperti TIES (Yadav et al., 2023) dan DARE (Yu et al., 2023) pertama-tama memangkas parameter redundan dari task vector sebelum menggabungkannya.32 Kedua makalah menunjukkan bahwa praktik ini dapat secara signifikan meningkatkan kualitas model yang digabungkan akhir. Semakin banyak model yang akan digabungkan, semakin penting pemangkasan karena ada lebih banyak peluang bagi parameter redundan dalam satu tugas untuk mengganggu tugas lain.33

### Layer Stacking

Dalam pendekatan ini, Anda mengambil lapisan yang berbeda dari satu atau lebih model dan menumpuknya di atas satu sama lain. Misalnya, Anda mungkin mengambil lapisan pertama dari model 1 dan lapisan kedua dari model 2. Pendekatan ini juga disebut passthrough atau frankenmerging. Pendekatan ini dapat membuat model dengan arsitektur unik dan jumlah parameter.

Tidak seperti pendekatan merging dengan penjumlahan, model yang digabungkan yang dihasilkan dari layer stacking biasanya memerlukan fine-tuning lebih lanjut untuk mencapai performa yang baik.

Salah satu kesuksesan awal frankenmerging adalah Goliath-120B (alpindale, 2023), yang digabungkan dari dua model Llama 2-70B yang di-fine-tune, Xwin dan Euryale. Model ini mengambil 72 dari 80 lapisan dari setiap model dan menggabungkannya bersama.

Layer stacking dapat digunakan untuk melatih model mixture-of-experts (MoE), seperti yang diperkenalkan dalam "Sparse Upcycling: Training Mixture-of-Experts from Dense Checkpoints" (Komatsuzaki et al., 2022). Alih-alih melatih MOE dari awal, Anda mengambil model pre-trained dan membuat banyak salinan dari lapisan atau modul tertentu. Sebuah router kemudian ditambahkan untuk mengirim setiap input ke salinan yang paling cocok. Anda kemudian melatih lebih lanjut model yang digabungkan bersama dengan router untuk menyempurnakan performa mereka. Gambar 7-18 mengilustrasikan proses ini.

Komatsuzaki et al. menunjukkan bahwa layer stacking dapat menghasilkan model yang mengungguli model MoE yang dilatih dari awal. Menggunakan pendekatan ini, Together AI mencampurkan enam model open source yang lebih lemah bersama untuk membuat Mixture-of-Agents, yang mencapai performa yang sebanding dengan GPT-4o dari OpenAI dalam beberapa benchmark (Wang et al., 2024).

**Gambar 7-18.** Anda dapat membuat model MoE dari model pre-trained. Gambar diadaptasi dari Komatsuzaki et al. (2022).

Kasus penggunaan yang menarik dari layer stacking adalah model upscaling. Model upscaling adalah studi tentang cara membuat model yang lebih besar menggunakan lebih sedikit sumber daya. Terkadang, Anda mungkin menginginkan model yang lebih besar dari yang sudah Anda miliki, mungkin karena model yang lebih besar memberikan performa yang lebih baik. Misalnya, tim Anda mungkin awalnya melatih model agar muat di GPU 40 GB Anda. Namun, Anda mendapatkan mesin baru dengan 80 GB, yang memungkinkan Anda menyajikan model yang lebih besar. Alih-alih melatih model baru dari awal, Anda dapat menggunakan layer stacking untuk membuat model yang lebih besar dari model yang ada.

Satu pendekatan untuk layer upscaling adalah depthwise scaling. Kim et al. (2023) menggunakan teknik ini untuk membuat SOLAR 10.7B dari satu model 7B parameter dengan 32 lapisan. Prosedurnya bekerja sebagai berikut:

1. Buat salinan model pre-trained asli.
2. Gabungkan kedua salinan ini dengan menjumlahkan lapisan tertentu (menjumlahkan dua lapisan dan mengubahnya menjadi satu lapisan) dan menumpuk sisanya. Lapisan yang akan dijumlahkan dipilih dengan hati-hati agar sesuai dengan ukuran model target. Untuk SOLAR 10.7B, 16 lapisan dijumlahkan, meninggalkan model akhir dengan 32 × 2 - 16 = 48 lapisan.
3. Latih lebih lanjut model yang di-upscale ini menuju performa target.

Gambar 7-19 mengilustrasikan proses ini.

**Gambar 7-19.** Gunakan depthwise scaling untuk membuat model 48 lapisan dari model 32 lapisan. Gambar dilisensikan di bawah CC BY 4.0 dan sedikit dimodifikasi untuk keterbacaan.

### Konkatenasi

Alih-alih menambahkan parameter model konstituen bersama dengan cara yang berbeda, Anda juga dapat mengonkatenasi mereka. Jumlah parameter komponen yang digabungkan akan menjadi jumlah dari jumlah parameter dari semua komponen konstituen. Jika Anda menggabungkan dua adapter LoRA dengan rank r1 dan r2, rank adapter yang digabungkan akan menjadi r1 + r2, seperti yang ditunjukkan pada Gambar 7-20.

**Gambar 7-20.** Jika Anda menggabungkan dua adapter LoRA menggunakan konkatenasi, rank adapter yang digabungkan akan menjadi jumlah dari rank kedua adapter.

Konkatenasi tidak direkomendasikan karena tidak mengurangi jejak memori dibandingkan dengan menyajikan model yang berbeda secara terpisah. Konkatenasi mungkin memberikan performa yang lebih baik, tetapi peningkatan performa tambahan mungkin tidak sepadan dengan jumlah parameter ekstra.34

## Taktik Fine-Tuning

Bab ini telah membahas banyak pendekatan fine-tuning, masalah apa yang mereka selesaikan, dan cara kerjanya. Di bagian terakhir ini, saya akan berfokus pada taktik fine-tuning yang lebih praktis.

### Framework Fine-Tuning dan Model Dasar

Meskipun banyak hal di sekitar fine-tuning—memutuskan apakah akan melakukan fine-tuning, memperoleh data, dan memelihara model yang di-fine-tune—sulit, proses aktual fine-tuning lebih langsung. Ada tiga hal yang perlu Anda pilih: model dasar, metode fine-tuning, dan framework untuk fine-tuning.

#### Model Dasar

Bab 4 telah membahas kriteria untuk pemilihan model yang dapat diterapkan pada metode berbasis prompt maupun fine-tuning. Beberapa kriteria yang dibahas termasuk ukuran model, lisensi, dan performa benchmark. Di awal proyek AI, ketika Anda masih mengeksplorasi kelayakan tugas Anda, berguna untuk memulai dengan model paling kuat yang dapat Anda mampu. Jika model ini kesulitan menghasilkan hasil yang baik, model yang lebih lemah kemungkinan akan berkinerja lebih buruk. Jika model terkuat memenuhi kebutuhan Anda, Anda kemudian dapat mengeksplorasi model yang lebih lemah, menggunakan model awal sebagai benchmark untuk perbandingan.

Untuk fine-tuning, model awal bervariasi untuk proyek yang berbeda. Dokumen praktik terbaik fine-tuning OpenAI memberikan contoh dua jalur pengembangan: jalur progresi dan jalur distilasi.

**Jalur progresi** terlihat seperti ini:

1. Uji kode fine-tuning Anda menggunakan model termurah dan tercepat untuk memastikan kode bekerja seperti yang diharapkan.35
2. Uji data Anda dengan melakukan fine-tuning pada model menengah. Jika loss pelatihan tidak turun dengan lebih banyak data, sesuatu mungkin salah.
3. Jalankan beberapa eksperimen lagi dengan model terbaik untuk melihat seberapa jauh Anda dapat mendorong performa.
4. Setelah Anda memiliki hasil yang baik, lakukan pelatihan dengan semua model untuk memetakan batas harga/performa dan pilih model yang paling masuk akal untuk kasus penggunaan Anda.

**Jalur distilasi** mungkin terlihat sebagai berikut:

1. Mulai dengan dataset kecil dan model terkuat yang dapat Anda mampu. Latih model terbaik yang mungkin dengan dataset kecil ini. Karena model dasar sudah kuat, model ini memerlukan lebih sedikit data untuk mencapai performa yang baik.
2. Gunakan model yang di-fine-tune ini untuk menghasilkan lebih banyak data pelatihan.
3. Gunakan dataset baru ini untuk melatih model yang lebih murah.

Karena fine-tuning biasanya datang setelah eksperimen dengan prompt engineering, pada saat Anda mulai melakukan fine-tuning, idealnya, Anda seharusnya memiliki pemahaman yang cukup baik tentang perilaku model yang berbeda. Anda harus merencanakan jalur pengembangan fine-tuning Anda berdasarkan pemahaman ini.

#### Metode Fine-Tuning

Ingat bahwa teknik adapter seperti LoRA hemat biaya tetapi biasanya tidak memberikan tingkat performa yang sama seperti full fine-tuning. Jika Anda baru memulai dengan fine-tuning, coba sesuatu seperti LoRA, dan coba full fine-tuning nanti.

Metode fine-tuning yang digunakan juga tergantung pada volume data Anda. Tergantung pada model dasar dan tugas, full fine-tuning biasanya memerlukan setidaknya ribuan contoh dan sering kali lebih banyak lagi. Metode PEFT, bagaimanapun, dapat menunjukkan performa yang baik dengan dataset yang jauh lebih kecil. Jika Anda memiliki dataset kecil, seperti beberapa ratus contoh, full fine-tuning mungkin tidak mengungguli LoRA.

Pertimbangkan berapa banyak model yang di-fine-tune yang Anda butuhkan dan bagaimana Anda ingin menyajikannya saat memutuskan metode fine-tuning. Metode berbasis adapter seperti LoRA memungkinkan Anda menyajikan beberapa model yang berbagi model dasar yang sama dengan lebih efisien. Dengan LoRA, Anda hanya perlu menyajikan satu model penuh, sedangkan full fine-tuning memerlukan penyajian banyak model penuh.

#### Framework Fine-Tuning

Cara termudah untuk melakukan fine-tuning adalah menggunakan API fine-tuning di mana Anda dapat mengunggah data, memilih model dasar, dan mendapatkan kembali model yang di-fine-tune. Seperti API inferensi model, API fine-tuning dapat disediakan oleh penyedia model, penyedia layanan cloud, dan penyedia pihak ketiga. Keterbatasan dari pendekatan ini adalah Anda terbatas pada model dasar yang didukung oleh API. Keterbatasan lainnya adalah API mungkin tidak mengekspos semua kenop yang dapat Anda gunakan untuk performa fine-tuning yang optimal. API fine-tuning cocok untuk mereka yang menginginkan sesuatu yang cepat dan mudah, tetapi mungkin membuat frustrasi bagi mereka yang menginginkan lebih banyak kustomisasi.

Anda juga dapat melakukan fine-tuning menggunakan salah satu dari banyak framework fine-tuning hebat yang tersedia, seperti LLaMA-Factory, unsloth, PEFT, Axolotl, dan LitGPT. Mereka mendukung berbagai metode fine-tuning, terutama teknik berbasis adapter. Jika Anda ingin melakukan full fine-tuning, banyak model dasar menyediakan kode pelatihan open source mereka di GitHub yang dapat Anda clone dan jalankan dengan data Anda sendiri. Llama Police memiliki daftar framework fine-tuning dan repositori model yang lebih komprehensif dan terkini.

Melakukan fine-tuning sendiri memberi Anda lebih banyak fleksibilitas, tetapi Anda harus menyediakan komputasi yang diperlukan. Jika Anda hanya melakukan teknik berbasis adapter, GPU kelas menengah mungkin cukup untuk sebagian besar model. Jika Anda memerlukan lebih banyak komputasi, Anda dapat memilih framework yang terintegrasi dengan mulus dengan penyedia cloud Anda.

Untuk melakukan fine-tuning pada model menggunakan lebih dari satu mesin, Anda memerlukan framework yang membantu Anda melakukan pelatihan terdistribusi, seperti DeepSpeed, PyTorch Distributed, dan ColossalAI.

### Hyperparameter Fine-Tuning

Tergantung pada model dasar dan metode fine-tuning, ada banyak hyperparameter yang dapat Anda sesuaikan untuk meningkatkan efisiensi fine-tuning. Untuk hyperparameter spesifik untuk kasus penggunaan Anda, lihat dokumentasi model dasar atau framework fine-tuning yang Anda gunakan. Di sini, saya akan membahas beberapa hyperparameter penting yang sering muncul.

#### Learning Rate

Learning rate menentukan seberapa cepat parameter model harus berubah dengan setiap langkah pembelajaran. Jika Anda menganggap pembelajaran sebagai menemukan jalur menuju tujuan, learning rate adalah ukuran langkah. Jika ukuran langkah terlalu kecil, mungkin perlu waktu terlalu lama untuk mencapai tujuan. Jika ukuran langkah terlalu besar, Anda mungkin melangkahi tujuan, dan, oleh karena itu, model mungkin tidak pernah konvergen.

Tidak ada learning rate optimal universal. Anda harus bereksperimen dengan learning rate yang berbeda, biasanya antara rentang 1e-7 hingga 1e-3, untuk melihat mana yang bekerja terbaik. Praktik umum adalah mengambil learning rate di akhir fase pre-training dan mengalikannya dengan konstanta antara 0,1 dan 1.

Kurva loss dapat memberi Anda petunjuk tentang learning rate. Jika kurva loss banyak berfluktuasi, kemungkinan learning rate terlalu besar. Jika kurva loss stabil tetapi membutuhkan waktu lama untuk menurun, learning rate kemungkinan terlalu kecil. Tingkatkan learning rate setinggi mungkin selama kurva loss tetap stabil.

Anda dapat memvariasikan learning rate selama proses pelatihan. Anda dapat menggunakan learning rate yang lebih besar di awal dan learning rate yang lebih kecil di dekat akhir. Algoritma yang menentukan bagaimana learning rate harus berubah sepanjang proses pelatihan disebut jadwal learning rate.

#### Batch Size

Batch size menentukan berapa banyak contoh yang dipelajari model dalam setiap langkah untuk memperbarui weight-nya. Batch size yang terlalu kecil, seperti kurang dari delapan, dapat menyebabkan pelatihan yang tidak stabil.36 Batch size yang lebih besar membantu mengumpulkan sinyal dari contoh yang berbeda, menghasilkan update yang lebih stabil dan andal.

Secara umum, semakin besar batch size, semakin cepat model dapat melewati contoh pelatihan. Namun, semakin besar batch size, semakin banyak memori yang dibutuhkan untuk menjalankan model Anda. Dengan demikian, batch size dibatasi oleh perangkat keras yang Anda gunakan.

Di sinilah Anda melihat trade-off biaya versus efisiensi. Komputasi yang lebih mahal memungkinkan fine-tuning yang lebih cepat.

Hingga saat ini, komputasi masih menjadi bottleneck untuk fine-tuning. Sering kali, model begitu besar, dan memori begitu terbatas, sehingga hanya batch size kecil yang dapat digunakan. Ini dapat menyebabkan update weight model yang tidak stabil. Untuk mengatasi ini, alih-alih memperbarui weight model setelah setiap batch, Anda dapat mengakumulasi gradien di beberapa batch dan memperbarui weight model setelah gradien yang cukup andal terakumulasi. Teknik ini disebut gradient accumulation.37

Ketika biaya komputasi bukan faktor yang paling penting, Anda dapat bereksperimen dengan batch size yang berbeda untuk melihat mana yang memberikan performa model terbaik.

#### Jumlah Epoch

Epoch adalah satu lintasan melalui data pelatihan. Jumlah epoch menentukan berapa kali setiap contoh pelatihan dilatih.

Dataset kecil mungkin memerlukan lebih banyak epoch daripada dataset besar. Untuk dataset dengan jutaan contoh, 1-2 epoch mungkin cukup. Dataset dengan ribuan contoh mungkin masih melihat peningkatan performa setelah 4-10 epoch.

Perbedaan antara loss pelatihan dan loss validasi dapat memberi Anda petunjuk tentang epoch. Jika loss pelatihan dan loss validasi sama-sama masih menurun secara stabil, model dapat benefiting dari lebih banyak epoch (dan lebih banyak data). Jika loss pelatihan masih menurun tetapi loss validasi meningkat, model mengalami overfitting pada data pelatihan, dan Anda mungkin mencoba menurunkan jumlah epoch.

#### Prompt Loss Weight

Untuk instruction fine-tuning, setiap contoh terdiri dari prompt dan respons, keduanya dapat berkontribusi pada loss model selama pelatihan. Selama inferensi, bagaimanapun, prompt biasanya disediakan oleh pengguna, dan model hanya perlu menghasilkan respons. Oleh karena itu, token respons harus berkontribusi lebih banyak pada loss model selama pelatihan daripada token prompt.

Bobot model prompt menentukan seberapa besar prompt harus berkontribusi pada loss ini dibandingkan dengan respons. Jika bobot ini 100%, prompt berkontribusi pada loss sebanyak respons, yang berarti bahwa model belajar sama dari keduanya. Jika bobot ini 0%, model belajar hanya dari respons. Biasanya, bobot ini disetel ke 10% secara default, yang berarti bahwa model harus belajar sedikit dari prompt tetapi sebagian besar dari respons.

## Ringkasan

Di luar bab evaluasi, fine-tuning adalah bab yang paling menantang untuk ditulis. Bab ini menyentuh berbagai konsep, baik lama (transfer learning) maupun baru (PEFT), fundamental (faktorisasi low-rank) dan eksperimental (model merging), matematis (perhitungan memori) dan taktis (tuning hyperparameter). Mengatur semua aspek yang berbeda ini ke dalam struktur yang koheren sambil membuatnya mudah diakses adalah sulit.

Proses fine-tuning itu sendiri tidak sulit. Banyak framework fine-tuning menangani proses pelatihan untuk Anda. Framework ini bahkan dapat menyarankan metode fine-tuning umum dengan hyperparameter default yang masuk akal.

Namun, konteks di sekitar fine-tuning kompleks. Ini dimulai dengan apakah Anda seharusnya bahkan melakukan fine-tuning pada suatu model. Bab ini dimulai dengan alasan untuk melakukan fine-tuning dan alasan untuk tidak melakukan fine-tuning. Bab ini juga membahas satu pertanyaan yang sering saya tanyakan: kapan harus melakukan fine-tuning dan kapan harus melakukan RAG.

Di masa-masa awalnya, fine-tuning mirip dengan pre-training—keduanya melibatkan pembaruan seluruh weight model. Namun, seiring model meningkat dalam ukuran, full fine-tuning menjadi tidak praktis bagi sebagian besar praktisi. Semakin banyak parameter yang diperbarui selama fine-tuning, semakin banyak memori yang dibutuhkan fine-tuning. Sebagian besar praktisi tidak memiliki akses ke sumber daya yang cukup (perangkat keras, waktu, dan data) untuk melakukan full fine-tuning dengan model foundation.

Banyak teknik fine-tuning telah dikembangkan dengan motivasi yang sama: untuk mencapai performa yang kuat pada jejak memori yang minimal. Misalnya, PEFT mengurangi persyaratan memori fine-tuning dengan mengurangi jumlah parameter yang dapat dilatih. Pelatihan terkuantisasi, di sisi lain, mengurangi bottleneck memori ini dengan mengurangi jumlah bit yang diperlukan untuk merepresentasikan setiap nilai.

Setelah memberikan gambaran umum tentang PEFT, bab ini memperdalam ke LoRA—mengapa dan bagaimana cara kerjanya. LoRA memiliki banyak properti yang membuatnya populer di kalangan praktisi. Selain parameter-efficient dan data-efficient, LoRA juga modular, membuatnya jauh lebih mudah untuk menyajikan dan menggabungkan banyak model LoRA.

Ide menggabungkan model yang di-fine-tune membawa bab ini ke model merging; tujuannya adalah untuk menggabungkan beberapa model menjadi satu model yang bekerja lebih baik daripada model-model ini secara terpisah. Bab ini membahas banyak kasus penggunaan model merging, dari deployment on-device hingga model upscaling, dan pendekatan umum untuk model merging.

Komentar yang sering saya dengar dari praktisi adalah bahwa fine-tuning itu mudah, tetapi mendapatkan data untuk fine-tuning itu sulit. Memperoleh data teranotasi berkualitas tinggi, terutama data instruksi, adalah menantang. Bab berikutnya akan membahas tantangan-tantangan ini secara mendalam.
