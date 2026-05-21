# Bab 2: Memahami Foundation Model

---

Untuk membangun aplikasi dengan foundation model, Anda pertama-tama membutuhkan foundation model. Meskipun Anda tidak perlu tahu cara mengembangkan model untuk menggunakannya, pemahaman tingkat tinggi akan membantu Anda memutuskan model apa yang akan digunakan dan cara menyesuaikannya dengan kebutuhan Anda.

Melatih foundation model adalah proses yang sangat kompleks dan mahal. Mereka yang tahu cara melakukannya dengan baik kemungkinan dilarang oleh perjanjian kerahasiaan untuk mengungkapkan rahasia resep. Bab ini tidak akan bisa memberi tahu Anda cara membangun model untuk bersaing dengan ChatGPT. Sebaliknya, saya akan fokus pada keputusan desain yang memiliki dampak konsekuensial pada aplikasi hilir.

Dengan kurangnya transparansi yang berkembang dalam proses pelatihan foundation model, sulit untuk mengetahui semua keputusan desain yang masuk ke dalam membuat model. Secara umum, however, perbedaan dalam foundation model dapat ditelusuri kembali ke keputusan tentang data pelatihan, arsitektur model dan ukuran, dan bagaimana mereka dilatih lebih lanjut untuk menyelaraskan dengan preferensi manusia.

Karena model belajar dari data, data pelatihan mereka mengungkapkan banyak hal tentang kemampuan dan batasan mereka. Bab ini dimulai dengan bagaimana pengembang model mengkurasi data pelatihan, berfokus pada distribusi data pelatihan. Bab 8 mengeksplorasi teknik dataset engineering secara detail, termasuk evaluasi kualitas data dan sintesis data.

Dengan dominasi arsitektur transformer, mungkin tampak bahwa arsitektur model adalah pilihan yang lebih sedikit. Anda mungkin bertanya, apa yang membuat arsitektur transformer begitu khusus sehingga terus mendominasi? Berapa lama lagi sebelum arsitektur lain mengambil alih, dan apa yang mungkin terlihat seperti arsitektur baru ini? Bab ini akan menjawab semua pertanyaan ini.

Setiap kali model baru dirilis, salah satu hal pertama yang ingin diketahui orang adalah ukurannya. Bab ini juga akan menjelajahi bagaimana pengembang model mungkin menentukan ukuran yang sesuai untuk model mereka.

Seperti yang disebutkan dalam Bab 1, proses pelatihan model sering dibagi menjadi pra-pelatihan dan pasca-pelatihan. Pra-pelatihan membuat model menjadi capable, tetapi tidak necessarily aman atau mudah digunakan. Di sinilah pasca-pelatihan masuk. Tujuan pasca-pelatihan adalah untuk menyelaraskan model dengan preferensi manusia.

Meskipun kebanyakan orang memahami dampak pelatihan pada kinerja model, dampak sampling sering diabaikan. Sampling adalah bagaimana model memilih keluaran dari semua opsi yang mungkin. Ini mungkin adalah konsep yang paling underrated dalam AI. Sampling tidak hanya menjelaskan banyak perilaku AI yang membingungkan, termasuk halusinasi dan ketidakkonsistenan, tetapi memilih strategi sampling yang tepat juga dapat secara signifikan meningkatkan kinerja model dengan usaha yang relatif sedikit.

Konsep yang tercakup dalam bab ini adalah fundamental untuk memahami sisa buku. Namun, karena konsep ini adalah fundamental, Anda mungkin sudah familiar dengan mereka. Silakan lewati konsep apapun yang Anda yakin.

---

## Training Data

Model AI hanya sebaik data yang dilatih padanya. Jika tidak ada bahasa Vietnam dalam data pelatihan, model tidak akan dapat menerjemahkan dari bahasa Inggris ke bahasa Vietnam. Demikian pula, jika model klasifikasi gambar hanya melihat hewan dalam set pelatihannya, ia tidak akan berkinerja baik pada foto tanaman.

Sumber data umum untuk pelatihan adalah Common Crawl, yang dibuat oleh organisasi nonprofit yang sporadis merayapi situs web di internet. Google menyediakan subset Common Crawl yang bersih yang disebut Colossal Clean Crawled Corpus, atau C4 untuk pendeknya.

Kualitas data Common Crawl, dan C4 sampai batas tertentu, dipertanyakan—pikirkan clickbait, misinformasi, propaganda, teori konspirasi, rasisme, misogini, dan setiap situs web yang tidak jelas yang pernah Anda lihat atau hindari di internet. Studi oleh Washington Post menunjukkan bahwa 1.000 situs web paling umum dalam dataset termasuk beberapa outlet media yang peringkat rendah pada skala NewsGuard untuk kepercayaan.

Namun, hanya karena Common Crawl tersedia, variasi darinya digunakan di sebagian besar foundation model yang mengungkapkan sumber data pelatihan mereka, termasuk GPT-3 OpenAI dan Gemini Google. Saya curiga bahwa Common Crawl juga digunakan dalam model yang tidak mengungkapkan data pelatihan mereka. Banyak perusahaan telah berhenti mengungkapkan informasi ini untuk menghindari pengawasan dari publik dan pesaing.

Beberapa tim menggunakan heuristik untuk menyaring data berkualitas rendah dari internet. OpenAI hanya menggunakan tautan Reddit yang menerima setidaknya tiga upvote untuk melatih GPT-2. Meskipun ini membantu menyaring tautan yang tidak ada yang peduli, Reddit bukanlah puncak dari kesopanan dan selera yang baik.

Pendekatan "gunakan apa yang kita miliki, bukan apa yang kita inginkan" dapat menyebabkan model yang berkinerja baik pada tugas yang ada dalam data pelatihan tetapi tidak necessarily pada tugas yang Anda pedulikan. Untuk mengatasi masalah ini, penting untuk mengkurasi dataset yang sesuai dengan kebutuhan spesifik Anda.

### Multilingual Models

Bahasa Inggris mendominasi internet. Analisis dataset Common Crawl menunjukkan bahwa bahasa Inggris menyumbang hampir setengah dari data (45,88%), membuatnya delapan kali lebih umum daripada bahasa kedua yang paling umum, Rusia (5,97%).

Banyak bahasa lain, meskipun memiliki banyak penutur hari ini, sangat kurang terwakili di Common Crawl. Bahasa dengan ketersediaan terbatas sebagai data pelatihan—biasanya bahasa yang tidak termasuk dalam daftar ini—dianggap sebagai bahasa dengan sumber daya rendah.

Dengan dominasi bahasa Inggris dalam data internet, tidak mengherankan bahwa model tujuan umum bekerja jauh lebih baik untuk bahasa Inggris daripada bahasa lain. Pada benchmark MMLU, GPT-4 berkinerja jauh lebih baik dalam bahasa Inggris daripada bahasa yang kurang terwakili seperti Telugu.

Model juga dapat memiliki tantangan kinerja yang tidak terduga dalam bahasa non-Inggris. NewsGuard menemukan bahwa ChatGPT lebih bersedia menghasilkan misinformasi dalam bahasa Mandarin daripada bahasa Inggris.

Selain masalah kualitas, model juga dapat lebih lambat dan lebih mahal untuk bahasa non-Inggris. Latensi inferensi dan biaya model sebanding dengan jumlah token dalam input dan respons. Ternyata tokenization dapat jauh lebih efisien untuk beberapa bahasa daripada yang lain. Untuk dataset MASSIVE, median panjang token dalam bahasa Inggris adalah 7, tetapi median dalam bahasa Hindi adalah 32, dan dalam Burma adalah 72, yang sepuluh kali lebih panjang daripada dalam bahasa Inggris.

Untuk mengatasi ini, banyak model telah dilatih untuk berfokus pada bahasa non-Inggris. Bahasa yang paling aktif selain bahasa Inggris adalah tanpa ragu bahasa Mandarin, dengan ChatGLM, YAYI, Llama-Chinese, dan lainnya. Ada juga model dalam bahasa Prancis (CroissantLLM), Vietnam (PhoGPT), Arab (Jais), dan banyak lagi bahasa.

### Domain-Specific Models

Model tujuan umum seperti Gemini, GPT, dan Llama dapat berkinerja sangat baik pada berbagai domain. Namun, model-model ini tidak mungkin berkinerja baik pada tugas khusus domain, terutama jika mereka tidak pernah melihat tugas ini selama pelatihan.

Dua contoh tugas khusus domain adalah penemuan obat dan skrining kanker. Penemuan obat melibatkan data protein, DNA, dan RNA, yang mengikuti format tertentu dan mahal untuk diperoleh. Data ini tidak mungkin ditemukan dalam data internet yang tersedia untuk umum. Demikian pula, skrining kanker biasanya melibatkan pemindaian X-ray dan fMRI, yang sulit diperoleh karena alasan privasi.

Untuk melatih model untuk berkinerja baik pada tugas khusus domain ini, Anda mungkin perlu mengkurasi dataset yang sangat spesifik. Salah satu model khusus domain yang paling terkenal adalah AlphaFold DeepMind, dilatih pada urutan dan struktur 3D dari sekitar 100.000 protein yang diketahui. NVIDIA BioNeMo adalah model lain yang berfokus pada data biomolekuler untuk penemuan obat. Google Med-PaLM2 menggabungkan kekuatan LLM dengan data medis untuk menjawab kueri medis dengan akurasi yang lebih tinggi.

---

## Modeling

Sebelum melatih model, pengembang perlu memutuskan seperti apa model itu. Arsitektur apa yang harus diikuti? Berapa banyak parameternya? Keputusan ini mempengaruhi tidak hanya kemampuan model tetapi juga kegunaannya untuk aplikasi hilir.

### Model Architecture

Arsitektur yang paling dominan untuk foundation model berbasis bahasa adalah arsitektur transformer, yang didasari pada mekanisme perhatian (attention). Ia mengatasi banyak batasan dari arsitektur sebelumnya, yang berkontribusi pada popularitasnya. Namun, arsitektur transformer memiliki batasan sendiri.

#### Transformer Architecture

Untuk memahami transformer, mari kita lihat masalah yang ingin diselesaikannya. Arsitektur transformer dipopulerkan di tengah kesuksesan arsitektur seq2seq (sequence-to-sequence). Seq2seq menggunakan RNN (recurrent neural networks) sebagai encoder dan decoder. Ada dua masalah dengan seq2seq yang ditangani oleh Vaswani dkk. (2017):

1. Decoder seq2seq vanilla menghasilkan token keluaran menggunakan hanya keadaan tersembunyi akhir dari input. Ini seperti membuat jawaban tentang buku menggunakan ringkasan buku. Ini membatasi kualitas keluaran yang dihasilkan.
2. RNN encoder dan decoder berarti bahwa pemrosesan input dan generasi keluaran dilakukan secara berurutan, membuatnya lambat untuk urutan yang panjang.

Arsitektur transformer mengatasi kedua masalah dengan mekanisme perhatian. Mekanisme perhatian memungkinkan model untuk menimbang pentingnya token input yang berbeda ketika menghasilkan setiap token keluaran. Ini seperti membuat jawaban dengan mereferensikan halaman mana pun dalam buku.

Transformer sepenuhnya menghilangkan RNN. Dengan transformer, token input dapat diproses secara paralel, secara signifikan mempercepat pemrosesan input. Namun, model bahasa autoregresif berbasis transformer masih memiliki bottleneck keluaran berurutan.

Inferensi untuk model bahasa berbasis transformer terdiri dari dua langkah:
1. **Prefill**: Model memproses token input secara paralel. Langkah ini membuat keadaan intermediate yang diperlukan untuk menghasilkan token keluaran pertama.
2. **Decode**: Model menghasilkan satu token keluaran pada satu waktu.

#### Mekanisme Perhatian (Attention Mechanism)

Inti dari arsitektur transformer adalah mekanisme perhatian. Mekanisme ini memanfaatkan vektor kunci (key), nilai (value), dan kueri (query):

- **Vektor kueri (Q)** mewakili keadaan decoder saat ini pada setiap langkah decoding.
- **Setiap vektor kunci (K)** mewakili token sebelumnya. Setiap kunci adalah seperti nomor halaman.
- **Setiap vektor nilai (V)** mewakili nilai sebenarnya dari token sebelumnya, seperti yang dipelajari oleh model. Setiap nilai adalah seperti isi halaman.

Mekanisme perhatian menghitung seberapa banyak perhatian yang harus diberikan pada token input dengan melakukan dot product antara vektor kueri dan vektor kuncinya. Skor tinggi berarti model akan menggunakan lebih banyak konten halaman itu (vektor nilainya) ketika menghasilkan ringkasan buku.

Karena setiap token sebelumnya memiliki vektor kunci dan nilai yang sesuai, semakin panjang urutan, semakin banyak vektor kunci dan nilai yang perlu dihitung dan disimpan. Ini adalah salah satu alasan mengapa sangat sulit untuk memperpanjang panjang konteks untuk model transformer.

#### Transformer Block

Arsitektur transformer terdiri dari beberapa blok transformer. Setiap blok transformer berisi modul perhatian dan modul MLP (multi-layer perceptron):

**Modul Perhatian**
Setiap modul perhatian terdiri dari empat matriks bobot: kueri, kunci, nilai, dan proyeksi keluaran.

**Modul MLP**
Modul MLP terdiri dari lapisan linear yang dipisahkan oleh fungsi aktivasi non-linear. Setiap lapisan linear adalah matriks bobot yang digunakan untuk transformasi linear.

Jumlah blok transformer dalam model transformer sering disebut sebagai jumlah lapisan model. Model bahasa berbasis transformer juga dilengkapi dengan modul sebelum dan sesudah semua blok transformer:

- **Modul embedding sebelum blok transformer**: Modul ini mengonversi token dan posisi mereka menjadi vektor embedding.
- **Lapisan keluaran setelah blok transformer**: Modul ini memetakan vektor keluaran model menjadi probabilitas token yang digunakan untuk sampling keluaran model.

Ukuran model transformer ditentukan oleh dimensi blok bangunannya. Nilai kunci termasuk:
- Dimensi model menentukan ukuran matriks kueri, kunci, nilai, dan proyeksi keluaran dalam blok transformer.
- Jumlah blok transformer.
- Dimensi lapisan feedforward.
- Ukuran kosakata.

#### Arsitektur Model Lain

Meskipun model transformer mendominasi lanskap, itu bukan satu-satunya arsitektur. Sejak AlexNet menghidupkan kembali minat dalam deep learning pada tahun 2012, banyak arsitektur yang naik dan turun dari mode.

RWKV adalah model berbasis RNN yang dapat diparalelkan untuk pelatihan. Karena sifat RNN-nya, secara teori, ia tidak memiliki batasan panjang konteks yang sama dengan model berbasis transformer.

Arsitektur yang menunjukkan banyak janji dalam memori jangka panjang adalah SSM (state space models). Sejak pengenalan arsitektur pada tahun 2021, beberapa teknik telah diperkenalkan untuk membuat arsitektur lebih efisien, lebih baik dalam pemrosesan urutan panjang, dan dapat diskalakan ke ukuran model yang lebih besar.

Mamba menskalakan SSM ke tiga miliar parameter. Pada language modeling, Mamba-3B mengungguli transformer dengan ukuran yang sama dan mencocokkan transformer dua kali ukurannya.

Jamba adalah model hybrid yang menyelang blok transformer dan lapisan Mamba untuk mengembangkan SSM lebih jauh.

### Model Size

Sebagian besar kemajuan AI dalam tahun-tahun terakhir dapat diatributkan ke peningkatan ukuran model. Sulit berbicara tentang foundation model tanpa berbicara tentang jumlah parameternya. Nama model biasanya diikuti dengan jumlah parameternya. Misalnya, Llama-13B mengacu pada versi keluarga Llama dengan 13 miliar parameter.

Secara umum, meningkatkan parameter model meningkatkan kapasitasnya untuk belajar, menghasilkan model yang lebih baik. Jumlah parameter membantu kita memperkirakan sumber daya compute yang dibutuhkan untuk melatih dan menjalankan model ini.

Jumlah parameter dapat menyesatkan jika modelnya jarang. Model jarang memiliki persentase besar parameter bernilai nol. Model 7B-parameter yang 90% jarang hanya memiliki 700 juta parameter bukan nol. Jarang memungkinkan penyimpanan data dan komputasi yang lebih efisien.

Jenis model jarang yang mendapatkan popularitas dalam tahun-tahun terakhir adalah mixture-of-experts (MoE). Model MoE dibagi menjadi kelompok parameter yang berbeda, dan setiap kelompok adalah ahli. Hanya subset ahli yang aktif untuk memproses setiap token.

Contohnya, Mixtral 8x7B adalah campuran dari delapan ahli, masing-masing ahli dengan tujuh miliar parameter. Namun, pada setiap lapisan, untuk setiap token, hanya dua ahli yang aktif. Ini berarti bahwa hanya 12,9 miliar parameter yang aktif untuk setiap token. Sementara model ini memiliki 46,7 miliar parameter, biaya dan kecepatannya sama dengan model 12,9-miliar-parameter.

Model yang lebih besar juga dapat berkinerja lebih buruk daripada model yang lebih kecil jika ia tidak dilatih pada data yang cukup. Ukuran data yang dilatih model sering diukur oleh jumlah token dalam dataset. LLM dilatih menggunakan dataset dalam urutan triliunan token.

Tiga angka yang menandakan skala model:
- Jumlah parameter, yang merupakan proxy untuk kapasitas belajar model.
- Jumlah token yang dilatih model, yang merupakan proxy untuk berapa banyak yang dipelajari model.
- Jumlah FLOPs, yang merupakan proxy untuk biaya pelatihan.

#### Scaling Law: Building Compute-Optimal Models

Kinerja model sangat bergantung pada ukuran model dan ukuran dataset. Model yang lebih besar dan dataset yang lebih besar memerlukan lebih banyak compute. Compute costs money.

Kecuali Anda memiliki uang yang tidak terbatas, penganggaran sangat penting. Anda tidak ingin mulai dengan ukuran model yang sewenang-wenang dan melihat berapa biayanya. Anda mulai dengan anggaran—berapa banyak uang yang ingin Anda habiskan—dan bekerja keluar kinerja model terbaik yang dapat Anda afford.

Angka yang membantu menghitung ukuran model optimal dan ukuran dataset yang diberikan anggaran compute disebut Chinchilla scaling law. Para penulis menemukan bahwa untuk pelatihan compute-optimal, Anda membutuhkan jumlah token pelatihan untuk kira-kira 20 kali ukuran model. Ini berarti bahwa model 3B-parameter membutuhkan sekitar 60B token pelatihan. Ukuran model dan jumlah token pelatihan harus diskalakan secara setara.

#### Scaling Bottlenecks

Foundation model menggunakan begitu banyak data sehingga ada kekhawatiran yang realistis kita akan kehabisan data internet dalam beberapa tahun ke depan. Laju pertumbuhan ukuran dataset pelatihan jauh lebih cepat daripada laju data baru yang dihasilkan.

Bottleneck lain, yang kurang jelas tetapi lebih mendesak, adalah listrik. Pusat data diperkirakan mengonsumsi 1-2% listrik global. Angka ini diperkirakan akan mencapai antara 4% dan 20% pada tahun 2030.

---

## Post-Training

Pasca-pelatihan dimulai dengan model yang telah dilatih sebelumnya. Karena cara pra-pelatihan bekerja hari ini, model yang telah dilatih sebelumnya biasanya memiliki dua masalah. Pertama, self-supervision mengoptimalkan model untuk pelengkapan teks, bukan percakapan. Kedua, jika model dilatih pada data yang diambil secara sewenang-wenang dari internet, keluaranannya dapat menjadi rasis, seksis, kasar, atau salah.

Tujuan pasca-pelatihan adalah untuk mengatasi kedua masalah ini. Setiap pasca-pelatihan model berbeda. Namun, secara umum, pasca-pelatihan terdiri dari dua langkah:

1. **Supervised Finetuning (SFT)**: Finetune model yang telah dilatih sebelumnya pada data instruksi berkualitas tinggi untuk mengoptimalkan model untuk percakapan alih-alih pelengkapan.
2. **Preference Finetuning**: Lebih lanjut finetune model untuk menghasilkan respons yang sesuai dengan preferensi manusia. Preference finetuning biasanya dilakukan dengan reinforcement learning (RL).

Pasca-pelatihan mengonsumsi sebagian kecil sumber daya dibandingkan dengan pra-pelatihan. Anda dapat memikirkan pasca-pelatihan sebagai membuka kemampuan yang sudah dimiliki model yang telah dilatih sebelumnya tetapi sulit diakses pengguna hanya melalui prompting.

### Supervised Finetuning

Model yang telah dilatih sebelumnya kemungkinan dioptimalkan untuk pelengkapan daripada percakapan. Jika Anda memasukkan "How to make pizza" ke dalam model, model akan melanjutkan melengkapi kalimat ini, karena model tidak memiliki konsep bahwa ini seharusnya menjadi percakapan.

Kita tahu bahwa model meniru data pelatihannya. Untuk mendorong model menghasilkan respons yang sesuai, Anda dapat menunjukkan contoh respons yang sesuai. Contoh-contoh ini mengikuti format (prompt, response) dan disebut demonstration data. Beberapa orang menyebut proses ini behavior cloning: Anda mendemonstrasikan bagaimana model harus berperilaku, dan model meniru perilaku ini.

Karena jenis permintaan yang berbeda memerlukan jenis respons yang berbeda, demonstration data Anda harus berisi berbagai permintaan yang ingin Anda tangani model, seperti penjawaban pertanyaan, ringkasan, dan terjemahan.

Data demonstration dapat mahal untuk dihasilkan. Jika biaya $10 untuk satu pasangan (prompt, response), 13.000 pasangan yang digunakan OpenAI untuk InstructGPT akan biaya $130.000. Itu belum termasuk biaya merancang data, merekrut labeler, dan kontrol kualitas data.

### Preference Finetuning

Dengan kekuatan besar datang tanggung jawab besar. Model yang dapat membantu pengguna mencapai hal-hal yang hebat juga dapat membantu pengguna mencapai hal-hal yang mengerikan. Demonstration data mengajarkan model untuk memiliki percakapan tetapi tidak mengajarkan model percakapan seperti apa yang harus dimiliki.

Tujuan preference finetuning adalah untuk mendapatkan model AI berperilaku sesuai preferensi manusia. Ini adalah tujuan yang ambisius, jika tidak mustahil. Bukan hanya ini mengasumsikan bahwa preferensi manusia universal ada, tetapi juga mengasumsikan bahwa mungkin untuk memasukkannya ke dalam AI.

Teknik preference finetuning termasuk:
- **RLHF (Reinforcement Learning from Human Feedback)**: Digunakan oleh GPT-3.5 dan Llama 2.
- **DPO (Direct Preference Optimization)**: Digunakan oleh Llama 3.
- **RLAIF (Reinforcement Learning from AI Feedback)**: Berpotensi digunakan oleh Claude.

RLHF terdiri dari dua bagian:
1. Latih model reward yang menilai keluaran model foundation.
2. Optimalkan model foundation untuk menghasilkan respons yang akan mendapatkan skor maksimal oleh model reward.

Model reward dilatih menggunakan data perbandingan—respons A lebih baik daripada respons B—tanpa penjelasan mengapa A lebih baik. Reward model dapat dilatih dari nol atau finetune di atas model lain.

Dengan model reward yang terlatih, kita lebih lanjut melatih model SFT untuk menghasilkan respons keluaran yang akan memaksimalkan skor oleh model reward. Proses pelatihan ini sering dilakukan dengan proximal policy optimization (PPO), algoritma reinforcement learning yang dirilis oleh OpenAI pada tahun 2017.

---

## Sampling

Model membangun keluaranannya melalui proses yang dikenal sebagai sampling. Bagian ini membahas strategi sampling yang berbeda dan variabel sampling, termasuk temperature, top-k, dan top-p.

### Sampling Fundamentals

Model neural menghasilkan keluaran dengan pertama-tama menghitung probabilitas dari hasil yang mungkin. Untuk model bahasa, untuk menghasilkan token berikutnya, model pertama-tama menghitung distribusi probabilitas atas semua token dalam kosakata.

Strategi umum saat bekerja dengan hasil yang memiliki probabilitas berbeda adalah memilih hasil dengan probabilitas tertinggi. Selalu memilih hasil yang paling mungkin disebut greedy sampling. Namun, untuk model bahasa, greedy sampling menciptakan keluaran yang membosankan.

Alih-alih selalu memilih token berikutnya yang paling mungkin, model dapat sampling token berikutnya sesuai distribusi probabilitas atas semua nilai yang mungkin. Jika "merah" memiliki peluang 30% menjadi token berikutnya dan "hijau" memiliki peluang 50%, "merah" akan dipilih 30% dari waktu, dan "hijau" 50% dari waktu.

Bagaimana model menghitung probabilitas ini? Diberikan input, jaringan neural menghasilkan vektor logit. Setiap logit sesuai dengan satu nilai yang mungkin. Meskipun logit yang lebih besar sesuai dengan probabilitas yang lebih tinggi, logit tidak mewakili probabilitas. Logit tidak menjumlahkan menjadi satu. Logit bahkan dapat negatif, sementara probabilitas harus non-negatif. Untuk mengubah logit menjadi probabilitas, lapisan softmax sering digunakan.

### Sampling Strategies

Strategi sampling yang tepat dapat membuat model menghasilkan respons yang lebih sesuai untuk aplikasi Anda.

#### Temperature

Satu masalah dengan sampling token berikutnya sesuai distribusi probabilitas adalah model dapat kurang kreatif. Kata-kata umum seperti "merah", "hijau", "ungu" memiliki probabilitas tertinggi. Jawaban model terdengar seperti jawaban anak lima tahun.

Untuk mendistribusikan ulang probabilitas dari nilai yang mungkin, Anda dapat sampling dengan suhu. Secara intuitif, suhu yang lebih tinggi mengurangi probabilitas token umum, dan sebagai hasilnya, meningkatkan probabilitas token yang lebih jarang. Ini memungkinkan model untuk menciptakan respons yang lebih kreatif.

Suhu adalah konstanta yang digunakan untuk menyesuaikan logit sebelum transformasi softmax. Logit dibagi dengan suhu. Semakin tinggi suhu, semakin kecil kemungkinan model akan memilih nilai yang paling jelas, membuat keluaran model lebih kreatif tetapi mungkin kurang koheren. Semakin rendah suhu, semakin besar kemungkinan model akan memilih nilai yang paling jelas, membuat keluaran model lebih konsisten tetapi mungkin lebih membosankan.

Suhu 0,7 sering direkomendasikan untuk use case kreatif, karena menyeimbangkan kreativitas dan prediktabilitas, tetapi Anda harus bereksperimen dan menemukan suhu yang terbaik untuk Anda.

#### Top-k

Top-k adalah strategi sampling untuk mengurangi beban komputasi tanpa mengorbankan terlalu banyak keragaman respons model. Setelah model telah menghitung logit, kita memilih k logit teratas dan melakukan softmax hanya atas logit teratas ini. Nilai k dapat berupa apa pun dari 50 hingga 500—jauh lebih kecil dari ukuran kosakata model. Nilai k yang lebih kecil membuat teks lebih dapat diprediksi tetapi kurang menarik.

#### Top-p

Top-p, juga dikenal sebagai nucleus sampling, memungkinkan pemilihan nilai yang lebih dinamis untuk di-sample dari. Dalam sampling top-p, model menjumlahkan probabilitas dari nilai berikutnya yang paling mungkin dalam urutan menurun dan berhenti ketika jumlah mencapai p. Hanya nilai dalam probabilitas kumulatif ini yang dipertimbangkan. Nilai umum untuk sampling top-p dalam model bahasa biasanya berkisar dari 0,9 hingga 0,95.

Berbeda dengan top-k, top-p tidak necessarily mengurangi beban komputasi softmax. Manfaatnya adalah karena ia hanya berfokus pada himpunan nilai yang paling relevan untuk setiap konteks, ia memungkinkan keluaran menjadi lebih sesuai secara kontekstual.

#### Kondisi Berhenti

Model bahasa autoregresif menghasilkan urutan token dengan menghasilkan satu token setelah token lainnya. Satu metode mudah adalah meminta model berhenti menghasilkan setelah jumlah token yang tetap. Metode lain adalah menggunakan token berhenti atau kata berhenti. Kondisi berhenti membantu menjaga latensi dan biaya tetap rendah.

### Test Time Compute

Satu cara sederhana untuk meningkatkan kualitas respons model adalah test time compute: alih-alih menghasilkan hanya satu respons per kueri, Anda menghasilkan beberapa respons untuk meningkatkan kesempatan respons yang baik. Satu cara untuk melakukan test time compute adalah teknik best of N—Anda menghasilkan beberapa keluaran secara acak dan memilih yang terbaik.

Namun, Anda juga bisa lebih strategis tentang cara menghasilkan beberapa keluaran. Alih-alih menghasilkan semua keluaran secara independen, Anda dapat menggunakan beam search untuk menghasilkan jumlah tetap kandidat yang paling menjanjikan pada setiap langkah generasi urutan.

Strategi sederhana untuk meningkatkan efektivitas test time compute adalah meningkatkan keragaman keluaran, karena himpunan opsi yang lebih beragam lebih mungkin menghasilkan kandidat yang lebih baik. Jika Anda menggunakan model yang sama untuk menghasilkan opsi yang berbeda, praktik yang baik adalah bervariasi variabel sampling model untuk mendiversifikasi keluaran.

Meskipun Anda biasanya dapat mengharapkan beberapa peningkatan kinerja model dengan sampling beberapa keluaran, itu mahal. Rata-rata, menghasilkan dua keluaran biaya sekitar dua kali lipat menghasilkan satu.

### Structured Outputs

Seringkali, dalam produksi, Anda memerlukan model untuk menghasilkan keluaran mengikuti format tertentu. Keluaran terstruktur sangat penting untuk dua skenario:

1. **Tugas yang memerlukan keluaran terstruktur**: Kategori tugas yang paling umum dalam skenario ini adalah semantic parsing. Semantic parsing melibatkan mengubah bahasa alami menjadi format terstruktur yang dapat dibaca mesin. Text-to-SQL adalah contoh semantic parsing, di mana keluaran harus berupa kueri SQL yang valid.
2. **Tugas yang keluaranannya digunakan oleh aplikasi hilir**: Dalam skenario ini, tugas itu sendiri tidak memerlukan keluaran terstruktur, tetapi karena keluaran digunakan oleh aplikasi lain, mereka perlu dapat diuraikan oleh aplikasi ini.

Beberapa pendekatan untuk mendapatkan keluaran terstruktur:
- **Prompting**: Instruksikan model untuk menghasilkan keluaran dalam format apa pun. Namun, apakah model dapat mengikuti instruksi ini tergantung pada kemampuan mengikuti instruksi model.
- **Post-processing**: Post-processing sederhana dan murah tetapi dapat bekerja dengan mengejutkan baik. Jika Anda menemukan kesalahan umum yang dibuat model, Anda dapat menulis skrip untuk memperbaikinya.
- **Constrained Sampling**: Constraint sampling adalah teknik untuk memandu generasi teks menuju batasan tertentu. Ini memfilter vektor logit untuk hanya menyimpan token yang memenuhi batasan.
- **Finetuning**: Finetuning model pada contoh yang mengikuti format yang diinginkan adalah pendekatan paling efektif dan umum untuk mendapatkan model menghasilkan keluaran dalam format ini.

### The Probabilistic Nature of AI

Cara model AI sampling respons mereka membuat mereka probabilistik. Jika Anda bertanya kepada model AI pertanyaan yang sama dua kali, jawabannya dapat berubah. Jika model AI berpikir bahwa masakan Vietnam memiliki peluang 70% menjadi masakan terbaik di dunia dan masakan Italia memiliki peluang 30%, ia akan menjawab "masakan Vietnam" 70% dari waktu dan "masakan Italia" 30% dari waktu.

Sifat probabilistik ini dapat menyebabkan inkonsistensi dan halusinasi.

#### Inconsistency

Inkonsistensi model bermanifestasi dalam dua skenario:
1. Input yang sama, keluaran yang berbeda: Memberikan model prompt yang sama dua kali mengarah ke dua respons yang sangat berbeda.
2. Input yang sedikit berbeda, keluaran yang sangat berbeda: Memberikan model prompt yang sedikit berbeda, seperti secara tidak sengaja mengkapitalisasi huruf, dapat mengarah ke keluaran yang sangat berbeda.

Untuk skenario input yang sama, keluaran yang berbeda, ada beberapa pendekatan untuk mengurangi inkonsistensi. Anda dapat menyimpan jawaban sehingga ketika pertanyaan yang sama ditanyakan lagi, jawaban yang sama dikembalikan. Anda dapat memperbaiki variabel sampling model, seperti nilai suhu, top-p, dan top-k. Anda juga dapat memperbaiki variabel seed, yang dapat Anda pikirkan sebagai titik awal untuk generator angka acak yang digunakan untuk sampling token berikutnya.

#### Hallucination

Halusinasi adalah ketika model memberikan respons yang tidak didasari pada fakta. Jika seseorang di internet menulis esai tentang bagaimana semua presiden AS adalah alien, dan esai ini disertakan dalam data pelatihan, model kemudian akan secara probabilistik menghasilkan bahwa presiden AS saat ini adalah alien.

Terdapat dua hipotesis tentang mengapa language model halusinasi:

**Hipotesis pertama**: Model halusinasi karena tidak dapat membedakan antara data yang diberikan dan data yang dihasilkan sendiri. Model memperlakukan sesuatu yang dihasilkan sendiri dengan cara yang sama seperti memperlakukan fakta yang diberikan. Ini disebut halusinasi sebagai bentuk self-delusion.

**Hipotesis kedua**: Halusinasi disebabkan oleh ketidakcocokan antara pengetahuan internal model dan pengetahuan internal labeler. Selama SFT, model dilatih untuk meniru respons yang ditulis oleh labeler. Jika respons ini menggunakan pengetahuan yang dimiliki labeler tetapi tidak dimiliki model, kita secara efektif mengajarkan model untuk halusinasi.

Kedua hipotesis ini saling melengkapi. Hipotesis self-delusion berfokus pada bagaimana self-supervision menyebabkan halusinasi, sedangkan hipotesis pengetahuan internal yang tidak cocok berfokus pada bagaimana supervision menyebabkan halusinasi.

Jika kita tidak dapat menghentikan halusinasi sama sekali, dapatkah kita setidaknya mendeteksi ketika model halusinasi sehingga kita tidak akan menyajikan respons yang dihalusinasi tersebut kepada pengguna? Mendeteksi halusinasi juga tidak semudah itu—pikirkan seberapa sulit bagi kita untuk mendeteksi ketika manusia lain berbohong atau membuat sesuatu. Tetapi orang telah mencoba.

---

## Summary

Bab ini membahas keputusan desain inti ketika membangun foundation model. Karena kebanyakan orang akan menggunakan foundation model yang sudah jadi alih-alih melatihnya dari nol, saya melewatkan detail pelatihan yang rumit demi faktor modeling yang membantu Anda menentukan model apa yang akan digunakan dan cara menggunakannya.

Faktor penting yang mempengaruhi kinerja model adalah data pelatihannya. Model besar memerlukan sejumlah besar data pelatihan, yang bisa mahal dan memakan waktu untuk diperoleh. Pengembang model, oleh karena itu, sering mengandalkan data apa pun yang tersedia.

Setelah mendapatkan data, pengembangan model dapat dimulai. Sementara pelatihan model sering mendominasi judul, langkah penting sebelum itu adalah mengatur model. Bab ini melihat ke dalam pilihan modeling, seperti arsitektur model dan ukuran model.

Arsitektur yang mendominasi untuk foundation model berbasis bahasa adalah transformer. Bab ini menjelajahi masalah yang dirancang untuk diatasi oleh arsitektur transformer, serta batasannya.

Skala model dapat diukur oleh tiga angka kunci: jumlah parameter, jumlah token pelatihan, dan jumlah FLOPs yang dibutuhkan untuk pelatihan.

Dua aspek yang mempengaruhi jumlah compute yang dibutuhkan untuk melatih model adalah ukuran model dan ukuran data. Scaling law membantu menentukan jumlah parameter dan jumlah token yang optimal diberikan anggaran compute. Bab ini juga melihat scaling bottlenecks. Saat ini, scaling up model umumnya membuatnya lebih baik. Berapa lama ini akan tetap benar?

Karena kualitas data pelatihan yang rendah dan self-supervision selama pra-pelatihan, model yang dihasilkan mungkin menghasilkan keluaran yang tidak sesuai dengan yang diinginkan pengguna. Ini ditangani oleh pasca-pelatihan, yang terdiri dari dua langkah: supervised finetuning dan preference finetuning. Preferensi manusia beragam dan tidak mungkin ditangkap dalam satu formula matematika, sehingga solusi yang ada jauh dari sempurna.
