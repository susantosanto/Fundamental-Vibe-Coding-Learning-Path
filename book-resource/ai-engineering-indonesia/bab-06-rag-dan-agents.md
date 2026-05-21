# Bab 6: RAG dan Agents

Untuk menyelesaikan tugas, model memerlukan instruksi tentang cara melakukannya dan informasi yang diperlukan untuk melakukannya. Sama seperti manusia yang lebih mungkin memberikan jawaban salah saat kekurangan informasi, model AI lebih mungkin membuat kesalahan dan berhalusinasi saat mereka kehilangan konteks. Untuk aplikasi tertentu, instruksi model umum untuk semua kueri, sedangkan konteks spesifik untuk setiap kueri. Bab terakhir membahas cara menulis instruksi yang baik ke model. Bab ini berfokus pada cara membangun konteks yang relevan untuk setiap kueri.

Dua pola dominan untuk konstruksi konteks adalah RAG, atau retrieval-augmented generation, dan agents. Pola RAG memungkinkan model untuk mengambil informasi relevan dari sumber data eksternal. Pola agentic memungkinkan model menggunakan alat seperti pencarian web dan API berita untuk mengumpulkan informasi.

Sementara pola RAG terutama digunakan untuk membangun konteks, pola agentic bisa melakukan jauh lebih banyak dari itu. Alat eksternal bisa membantu model mengatasi kekurangan mereka dan memperluas kemampuan mereka. Yang paling penting, mereka memberi model kemampuan untuk berinteraksi secara langsung dengan dunia, memungkinkan mereka mengotomatisasi banyak aspek kehidupan kita.

Kedua pola RAG dan agentic menarik karena kemampuan yang mereka bawa ke model yang sudah kuat. Dalam waktu singkat, mereka berhasil menangkap imajinasi kolektif, menghasilkan demo dan produk yang meyakinkan banyak orang bahwa mereka adalah masa depan. Bab ini akan membahas secara rinci masing-masing pola ini, cara kerjanya, dan apa yang membuat mereka sangat menjanjikan.

## RAG

RAG adalah teknik yang meningkatkan generasi model dengan mengambil informasi relevan dari sumber memori eksternal. Sumber memori eksternal bisa berupa database internal, sesi chat sebelumnya pengguna, atau internet.

Pola retrieve-then-generate pertama kali diperkenalkan dalam "Reading Wikipedia to Answer Open-Domain Questions" (Chen et al., 2017). Dalam karya ini, sistem pertama-tama mengambil lima halaman Wikipedia yang paling relevan dengan pertanyaan, kemudian model¹ menggunakan, atau membaca, informasi dari halaman-halaman ini untuk menghasilkan jawaban, seperti yang divisualisasikan pada Gambar 6-1. Model yang digunakan adalah jenis recurrent neural network yang dikenal sebagai LSTM (Long Short-Term Memory). LSTM adalah arsitektur dominan deep learning untuk natural language processing (NLP) sebelum arsitektur transformer mengambil alih pada 2018.

Gambar 6-1. Pola retrieve-then-generate. Model disebut sebagai document reader.

Istilah retrieval-augmented generation diciptakan dalam "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020). Makalah ini mengusulkan RAG sebagai solusi untuk tugas intensif pengetahuan di mana semua pengetahuan yang tersedia tidak bisa dimasukkan langsung ke model. Dengan RAG, hanya informasi yang paling relevan dengan kueri, seperti yang ditentukan oleh retriever, yang diambil dan dimasukkan ke model. Lewis et al. menemukan bahwa memiliki akses ke informasi relevan bisa membantu model menghasilkan respons yang lebih detail sambil mengurangi halusinasi. Sekitar waktu yang sama, makalah lain, juga dari Facebook, "How Context Affects Language Models' Factual Predictions" (Petroni et al., arXiv, Mei 2020), menunjukkan bahwa augmentasi model bahasa pre-trained dengan sistem retrieval bisa secara dramatis meningkatkan performa model pada pertanyaan faktual.

Misalnya, diberikan kueri "Bisakah fancy-printer-A300 milik Acme mencetak 100pps?", model akan bisa merespons lebih baik jika diberikan spesifikasi fancy-printer-A300. Terima kasih kepada Chetan Tekur atas contoh ini.

Anda bisa menganggap RAG sebagai teknik untuk membangun konteks spesifik untuk setiap kueri, alih-alih menggunakan konteks yang sama untuk semua kueri. Ini membantu mengelola data pengguna, karena memungkinkan Anda menyertakan data spesifik untuk pengguna hanya dalam kueri yang terkait dengan pengguna ini. Konstruksi konteks untuk foundation model setara dengan feature engineering untuk model ML klasik. Keduanya melayani tujuan yang sama: memberi model informasi yang diperlukan untuk memproses input.

Di hari-hari awal foundation model, RAG muncul sebagai salah satu pola paling umum. Tujuan utamanya adalah mengatasi keterbatasan konteks model. Banyak orang berpikir bahwa konteks yang cukup panjang akan menjadi akhir dari RAG. Saya tidak berpikir demikian.

Pertama, tidak peduli seberapa panjang panjang konteks model, akan ada aplikasi yang memerlukan konteks lebih panjang dari itu. Bagaimanapun, jumlah data yang tersedia hanya tumbuh dari waktu ke waktu. Orang menghasilkan dan menambahkan data baru tetapi jarang menghapus data. Panjang konteks berkembang pesat, tetapi tidak cukup cepat untuk kebutuhan data aplikasi arbitrer.⁴ Hukum Parkinson biasanya dinyatakan sebagai "Pekerjaan berkembang sehingga memenuhi waktu yang tersedia untuk penyelesaiannya." Saya memiliki teori serupa bahwa konteks aplikasi berkembang untuk memenuhi batas konteks yang didukung oleh model yang digunakannya.

Kedua, model yang bisa memproses konteks panjang belum tentu menggunakan konteks itu dengan baik, seperti yang dibahas di "Context Length and Context Efficiency" di halaman 218. Semakin panjang konteks, semakin besar kemungkinan model berfokus pada bagian konteks yang salah. Setiap token konteks tambahan memerlukan biaya ekstra dan berpotensi menambahkan latensi ekstra. RAG memungkinkan model hanya menggunakan informasi paling relevan untuk setiap kueri, mengurangi jumlah token input sambil berpotensi meningkatkan performa model.

Upaya untuk memperluas panjang konteks terjadi secara paralel dengan upaya untuk membuat model menggunakan konteks lebih efektif. Saya tidak akan terkejut jika penyedia model menggabungkan mekanisme seperti retrieval atau attention untuk membantu model memilih bagian konteks paling menonjol untuk digunakan.

Anthropic menyarankan bahwa untuk model Claude, jika "basis pengetahuan Anda lebih kecil dari 200.000 token (sekitar 500 halaman materi), Anda bisa menyertakan seluruh basis pengetahuan dalam prompt yang Anda berikan ke model, tanpa perlu RAG atau metode serupa" (Anthropic, 2024). Akan luar biasa jika developer model lain memberikan panduan serupa untuk RAG versus konteks panjang untuk model mereka.

### Arsitektur RAG

Sistem RAG memiliki dua komponen: retriever yang mengambil informasi dari sumber memori eksternal dan generator yang menghasilkan respons berdasarkan informasi yang diambil. Gambar 6-2 menunjukkan arsitektur tingkat tinggi sistem RAG.

Gambar 6-2. Arsitektur RAG dasar.

Dalam makalah RAG asli, Lewis et al. melatih retriever dan model generatif bersama. Dalam sistem RAG saat ini, kedua komponen ini sering dilatih secara terpisah, dan banyak tim membangun sistem RAG mereka menggunakan retriever dan model off-the-shelf. Namun, fine-tuning seluruh sistem RAG end-to-end bisa meningkatkan performanya secara signifikan.

Keberhasilan sistem RAG tergantung pada kualitas retriever-nya. Retriever memiliki dua fungsi utama: indexing dan querying. Indexing melibatkan pemrosesan data sehingga bisa diambil dengan cepat nanti. Mengirim kueri untuk mengambil data yang relevan disebut querying. Cara mengindeks data tergantung pada cara Anda ingin mengambilnya nanti.

Sekarang kita telah membahas komponen utama, mari kita pertimbangkan contoh cara kerja sistem RAG. Untuk kesederhanaan, mari kita asumsikan bahwa memori eksternal adalah database dokumen, seperti memo, kontrak, dan catatan rapat perusahaan. Dokumen bisa 10 token atau 1 juta token. Mengambil seluruh dokumen secara naif bisa menyebabkan konteks Anda menjadi panjang secara arbitrer. Untuk menghindari ini, Anda bisa membagi setiap dokumen menjadi chunk yang lebih mudah dikelola. Strategi chunking akan dibahas nanti di bab ini. Untuk saat ini, mari kita asumsikan bahwa semua dokumen telah dibagi menjadi chunk yang bisa dikerjakan. Untuk setiap kueri, tujuan kita adalah mengambil chunk data yang paling relevan dengan kueri ini. Post-processing minor sering diperlukan untuk menggabungkan chunk data yang diambil dengan prompt pengguna untuk menghasilkan prompt final. Prompt final ini kemudian dimasukkan ke model generatif.

Dalam bab ini, saya menggunakan istilah "dokumen" untuk merujuk pada baik "dokumen" maupun "chunk", karena secara teknis, chunk dokumen juga merupakan dokumen. Saya melakukan ini untuk menjaga terminologi buku ini konsisten dengan terminologi NLP klasik dan information retrieval (IR).

### Algoritma Retrieval

Retrieval tidak unik untuk RAG. Information retrieval adalah ide berusia seabad.⁵ Ini adalah tulang punggung mesin pencari, sistem rekomendasi, analitik log, dll. Banyak algoritma retrieval yang dikembangkan untuk sistem retrieval tradisional juga bisa digunakan untuk RAG. Misalnya, information retrieval adalah area penelitian yang subur dengan industri pendukung besar yang hampir tidak bisa dicakup secara memadai dalam beberapa halaman. Oleh karena itu, bagian ini hanya akan membahas garis besarnya. Lihat repositori GitHub buku ini untuk sumber daya lebih mendalam tentang information retrieval. Retrieval digambarkan sejak awal 1920-an dalam paten Emanuel Goldberg untuk "mesin statistik" untuk mencari dokumen yang disimpan pada film. Lihat "The History of Information Retrieval Research" (Sanderson dan Croft, Proceedings of the IEEE, 100: Special Centennial Issue, April 2012).

Retrieval biasanya terbatas pada satu database atau sistem, sedangkan pencarian melibatkan retrieval di berbagai sistem. Bab ini menggunakan retrieval dan pencarian secara bergantian.

Pada intinya, retrieval bekerja dengan memberi peringkat dokumen berdasarkan relevansinya dengan kueri tertentu. Algoritma retrieval berbeda berdasarkan cara skor relevansi dihitung. Saya akan mulai dengan dua mekanisme retrieval umum: retrieval berbasis term dan retrieval berbasis embedding.

#### Sparse versus Dense Retrieval

Dalam literatur, Anda mungkin menemui pembagian algoritma retrieval ke dalam kategori berikut: sparse versus dense. Buku ini, bagaimanapun, memilih kategorisasi berbasis term versus berbasis embedding.

Retriever sparse merepresentasikan data menggunakan vektor sparse. Vektor sparse adalah vektor di mana sebagian besar nilai adalah 0. Retrieval berbasis term dianggap sparse, karena setiap term bisa direpresentasikan menggunakan vektor one-hot sparse, vektor yang 0 di mana-mana kecuali satu nilai 1. Ukuran vektor adalah panjang kosakata. Nilai 1 ada di indeks yang sesuai dengan indeks term dalam kosakata.

Jika kita memiliki kamus sederhana, {"food": 0, "banana": 1, "slug": 2}, maka vektor one-hot dari "food", "banana", dan "slug" adalah [1, 0, 0], [0, 1, 0], dan [0, 0, 1], masing-masing.

Retriever dense merepresentasikan data menggunakan vektor dense. Vektor dense adalah vektor di mana sebagian besar nilai bukan 0. Retrieval berbasis embedding biasanya dianggap dense, karena embedding umumnya vektor dense. Namun, ada juga embedding sparse. Misalnya, SPLADE (Sparse Lexical and Expansion) adalah algoritma retrieval yang bekerja menggunakan embedding sparse (Formal et al., 2021). Ini memanfaatkan embedding yang dihasilkan oleh BERT tetapi menggunakan regularisasi untuk mendorong sebagian besar nilai embedding ke 0. Sparsity membuat operasi embedding lebih efisien.

Pembagian sparse versus dense menyebabkan SPLADE dikelompokkan bersama dengan algoritma berbasis term, meskipun operasi, kekuatan, dan kelemahan SPLADE jauh lebih mirip dengan retrieval embedding dense daripada retrieval berbasis term. Pembagian berbasis term versus berbasis embedding menghindari miskategorisasi ini.

#### Retrieval Berbasis Term

Diberikan kueri, cara paling langsung untuk menemukan dokumen yang relevan adalah dengan kata kunci. Beberapa orang menyebut pendekatan ini lexical retrieval. Misalnya, diberikan kueri "AI engineering", model akan mengambil semua dokumen yang berisi "AI engineering". Namun, pendekatan ini memiliki dua masalah:

- Banyak dokumen mungkin berisi term yang diberikan, dan model Anda mungkin tidak memiliki ruang konteks yang cukup untuk menyertakan semuanya sebagai konteks. Heuristik adalah menyertakan dokumen yang berisi term paling banyak kali. Asumsinya adalah semakin sering term muncul dalam dokumen, semakin relevan dokumen ini dengan term ini. Jumlah kali term muncul dalam dokumen disebut term frequency (TF).
- Prompt bisa panjang dan berisi banyak term. Beberapa lebih penting daripada yang lain. Misalnya, prompt "Resep mudah diikuti untuk makanan Vietnam untuk dimasak di rumah" berisi sembilan term: easy-to-follow, recipes, for, vietnamese, food, to, cook, at, home. Anda ingin berfokus pada term yang lebih informatif seperti vietnamese dan recipes, bukan for dan at. Anda memerlukan cara untuk mengidentifikasi term penting.

Intuisi adalah semakin banyak dokumen berisi term, semakin tidak informatif term ini. "For" dan "at" kemungkinan muncul di sebagian besar dokumen, oleh karena itu, mereka kurang informatif. Jadi kepentingan term berbanding terbalik dengan jumlah dokumen yang muncul. Metrik ini disebut inverse document frequency (IDF). Untuk menghitung IDF untuk term, hitung semua dokumen yang berisi term ini, kemudian bagi jumlah total dokumen dengan hitungan ini. Jika ada 10 dokumen dan 5 di antaranya berisi term tertentu, maka IDF term ini adalah 10 / 5 = 2. Semakin tinggi IDF term, semakin penting term tersebut.

TF-IDF adalah algoritma yang menggabungkan kedua metrik ini: term frequency (TF) dan inverse document frequency (IDF). Secara matematis, skor TF-IDF dokumen D untuk kueri Q dihitung sebagai berikut:

- Misalkan t1, t2, ..., tq adalah term dalam kueri Q.
- Diberikan term t, term frequency term ini dalam dokumen D adalah f(t, D).
- Misalkan N adalah jumlah total dokumen, dan C(t) adalah jumlah dokumen yang berisi t. Nilai IDF term t bisa ditulis sebagai IDF(t) = log(N / C(t)).
- Secara naif, skor TF-IDF dokumen D terhadap Q didefinisikan sebagai Score(D, Q) = ∑ᵢ₌₁^q IDF(tᵢ) × f(tᵢ, D).

Dua solusi retrieval berbasis term umum adalah Elasticsearch dan BM25. Elasticsearch (Shay Banon, 2010), dibangun di atas Lucene, menggunakan struktur data yang disebut inverted index. Ini adalah kamus yang memetakan dari term ke dokumen yang berisi mereka. Kamus ini memungkinkan retrieval cepat dokumen diberikan term. Indeks mungkin juga menyimpan informasi tambahan seperti term frequency dan document count (berapa banyak dokumen berisi term ini), yang membantu menghitung skor TF-IDF. Tabel 6-1 mengilustrasikan inverted index.

**Tabel 6-1.** Contoh sederhana inverted index.

| Term | Document Count | (Document Index, Term Frequency) untuk semua dokumen berisi term |
|------|----------------|------------------------------------------------------------------|
| banana | 2 | (10, 3), (5, 2) |
| machine | 4 | (1, 5), (10, 1), (38, 9), (42, 5) |
| learning | 3 | (1, 5), (38, 7), (42, 5) |
| ... | ... | ... |

Okapi BM25, generasi ke-25 dari algoritma Best Matching, dikembangkan oleh Robertson et al. pada 1980-an. Scorer-nya adalah modifikasi TF-IDF. Dibandingkan dengan TF-IDF naif, BM25 menormalisasi skor term frequency berdasarkan panjang dokumen. Dokumen yang lebih panjang lebih mungkin berisi term tertentu dan memiliki nilai term frequency yang lebih tinggi.⁶ Bagi yang tertarik mempelajari lebih lanjut tentang BM25, saya merekomendasikan makalah ini oleh penulis BM25: "The Probabilistic Relevance Framework: BM25 and Beyond" (Robertson dan Zaragoza, Foundations and Trends in Information Retrieval 3 No. 4, 2009).

BM25 dan variasinya (BM25+, BM25F) masih banyak digunakan di industri dan berfungsi sebagai baseline yang tangguh untuk dibandingkan dengan algoritma retrieval modern yang lebih canggih, seperti retrieval berbasis embedding, yang dibahas selanjutnya. Aravind Srinivas, CEO Perplexity, tweeted bahwa "Membuat peningkatan genuin atas BM25 atau full-text search itu sulit".

Satu proses yang saya lewati adalah tokenisasi, proses memecah kueri menjadi term individual. Metode paling sederhana adalah membagi kueri menjadi kata-kata, memperlakukan setiap kata sebagai term terpisah. Namun, ini bisa menyebabkan term multi-kata dipecah menjadi kata-kata individual, kehilangan makna aslinya. Misalnya, "hot dog" akan dipecah menjadi "hot" dan "dog". Saat ini terjadi, keduanya tidak mempertahankan makna term asli. Salah satu cara untuk mengurangi masalah ini adalah memperlakukan n-gram paling umum sebagai term. Jika bigram "hot dog" umum, itu akan diperlakukan sebagai term.

Selain itu, Anda mungkin ingin mengonversi semua karakter ke huruf kecil, menghapus tanda baca, dan menghilangkan stop words (seperti "the", "and", "is", dll.). Solusi retrieval berbasis term sering menangani ini secara otomatis. Paket NLP klasik, seperti NLTK (Natural Language Toolkit), spaCy, dan CoreNLP Stanford, juga menawarkan fungsionalitas tokenisasi.

Bab 4 membahas mengukur kesamaan leksikal antara dua teks berdasarkan overlapping n-gram mereka. Bisakah kita mengambil dokumen berdasarkan sejauh mana overlapping n-gram mereka dengan kueri? Ya, bisa. Pendekatan ini bekerja terbaik saat kueri dan dokumen memiliki panjang yang mirip. Jika dokumen jauh lebih panjang daripada kueri, kemungkinan mereka berisi n-gram kueri meningkat, menyebabkan banyak dokumen memiliki skor overlapping yang sama tingginya. Ini membuat sulit membedakan dokumen yang benar-benar relevan dari yang kurang relevan.

#### Retrieval Berbasis Embedding

Retrieval berbasis term menghitung relevansi pada tingkat leksikal daripada tingkat semantik. Seperti yang disebutkan di Bab 3, penampilan teks belum tentu menangkap maknanya. Ini bisa menghasilkan pengembalian dokumen yang tidak relevan dengan intent Anda. Misalnya, kueri "transformer architecture" mungkin mengembalikan dokumen tentang perangkat listrik atau film Transformers. Di sisi lain, retriever berbasis embedding bertujuan untuk memberi peringkat dokumen berdasarkan seberapa dekat makna mereka dengan kueri. Pendekatan ini juga dikenal sebagai semantic retrieval.

Dengan retrieval berbasis embedding, indexing memiliki fungsi tambahan: mengonversi chunk data asli menjadi embedding. Database tempat embedding yang dihasilkan disimpan disebut vector database. Querying kemudian terdiri dari dua langkah, seperti yang ditunjukkan pada Gambar 6-3:

1. **Model embedding:** mengonversi kueri menjadi embedding menggunakan model embedding yang sama yang digunakan selama indexing.
2. **Retriever:** mengambil k chunk data yang embedding-nya paling dekat dengan embedding kueri, seperti yang ditentukan oleh retriever. Jumlah chunk data yang diambil, k, tergantung pada kasus penggunaan, model generatif, dan kueri.

Gambar 6-3. Pandangan tingkat tinggi cara kerja retriever berbasis embedding, atau semantik.

Alur kerja retrieval berbasis embedding yang ditunjukkan di sini disederhanakan. Sistem retrieval semantik dunia nyata mungkin berisi komponen lain, seperti reranker untuk memberi peringkat ulang semua kandidat yang diambil, dan cache untuk mengurangi latensi. Alur kerja retrieval RAG berbagi banyak langkah serupa dengan sistem rekomendasi tradisional.

Dengan retrieval berbasis embedding, kita kembali menemui embedding, yang dibahas di Bab 3. Sebagai pengingat, embedding biasanya vektor yang bertujuan melestarikan properti penting dari data asli. Retriever berbasis embedding tidak bekerja jika model embedding buruk.

Retrieval berbasis embedding juga memperkenalkan komponen baru: vector database. Vector database menyimpan vektor. Namun, penyimpanan adalah bagian mudah dari vector database. Bagian sulitnya adalah vector search. Diberikan embedding kueri, vector database bertanggung jawab untuk menemukan vektor dalam database yang dekat dengan kueri dan mengembalikannya. Vektor harus diindeks dan disimpan dengan cara yang membuat vector search cepat dan efisien.

Seperti banyak mekanisme lain yang bergantung pada aplikasi generative AI, vector search tidak unik untuk generative AI. Vector search umum dalam aplikasi apa pun yang menggunakan embedding: pencarian, rekomendasi, organisasi data, retrieval informasi, clustering, deteksi penipuan, dan lainnya.

Vector search biasanya diframing sebagai masalah nearest-neighbor search. Misalnya, diberikan kueri, temukan k vektor terdekat. Solusi naif adalah k-nearest neighbors (k-NN), yang bekerja sebagai berikut:

1. Hitung skor kesamaan antara embedding kueri dan semua vektor dalam database, menggunakan metrik seperti cosine similarity.
2. Beri peringkat semua vektor berdasarkan skor kesamaan mereka.
3. Kembalikan k vektor dengan skor kesamaan tertinggi.

Solusi naif ini memastikan bahwa hasilnya presisi, tetapi secara komputasi berat dan lambat. Ini seharusnya hanya digunakan untuk dataset kecil.

Untuk dataset besar, vector search biasanya dilakukan menggunakan algoritma approximate nearest neighbor (ANN). Karena pentingnya vector search, banyak algoritma dan perpustakaan telah dikembangkan untuk itu. Beberapa perpustakaan vector search populer adalah FAISS (Facebook AI Similarity Search) (Johnson et al., 2017), ScaNN dari Google (Scalable Nearest Neighbors) (Sun et al., 2020), Annoy dari Spotify (Bernhardsson, 2013), dan Hnswlib (Hierarchical Navigable Small World) (Malkov dan Yashunin, 2016).

Sebagian besar developer aplikasi tidak akan mengimplementasikan vector search sendiri, jadi saya hanya akan memberikan gambaran singkat tentang pendekatan berbeda. Gambaran ini mungkin membantu saat Anda mengevaluasi solusi.

Secara umum, vector database mengorganisir vektor ke dalam bucket, tree, atau graph. Algoritma vector search berbeda berdasarkan heuristik yang mereka gunakan untuk meningkatkan kemungkinan bahwa vektor serupa dekat satu sama lain. Vektor juga bisa dikuantisasi (presisi dikurangi) atau dibuat sparse. Idenya adalah bahwa vektor terkuantisasi dan sparse kurang intensif secara komputasi untuk dikerjakan. Bagi yang ingin mempelajari lebih lanjut tentang vector search, Zilliz memiliki seri yang sangat bagus tentang itu. Berikut beberapa algoritma vector search signifikan:

**LSH (locality-sensitive hashing)** (Indyk dan Motwani, 1999). Ini adalah algoritma yang kuat dan serbaguna yang bekerja dengan lebih dari sekadar vektor. Ini melibatkan hashing vektor serupa ke bucket yang sama untuk mempercepat pencarian kesamaan, menukar beberapa akurasi untuk efisiensi. Ini diimplementasikan dalam FAISS dan Annoy.

**HNSW (Hierarchical Navigable Small World)** (Malkov dan Yashunin, 2016). HNSW membangun graph multi-layer di mana node merepresentasikan vektor, dan edge menghubungkan vektor serupa, memungkinkan pencarian nearest-neighbor dengan menelusuri edge graph. Implementasinya oleh penulis open source, dan ini juga diimplementasikan dalam FAISS dan Milvus.

**Product Quantization** (Jégou et al., 2011). Ini bekerja dengan mengurangi setiap vektor menjadi representasi yang jauh lebih sederhana dan berdimensi lebih rendah dengan mendekomposisi setiap vektor menjadi beberapa subvektor. Jarak kemudian dihitung menggunakan representasi berdimensi lebih rendah, yang jauh lebih cepat untuk dikerjakan. Product quantization adalah komponen kunci FAISS dan didukung oleh hampir semua perpustakaan vector search populer.

**IVF (inverted file index)** (Sivic dan Zisserman, 2003). IVF menggunakan clustering K-means untuk mengorganisir vektor serupa ke dalam cluster yang sama. Tergantung pada jumlah vektor dalam database, biasanya mengatur jumlah cluster sehingga, rata-rata, ada 100 hingga 10.000 vektor dalam setiap cluster. Selama querying, IVF menemukan centroid cluster yang paling dekat dengan embedding kueri, dan vektor dalam cluster ini menjadi kandidat tetangga. Bersama dengan product quantization, IVF membentuk tulang punggung FAISS.

**Annoy (Approximate Nearest Neighbors Oh Yeah)** (Bernhardsson, 2013). Annoy adalah pendekatan berbasis tree. Ini membangun beberapa binary tree, di mana setiap tree membagi vektor menjadi cluster menggunakan kriteria acak, seperti secara acak menggambar garis dan membagi vektor menjadi dua cabang menggunakan garis ini. Selama pencarian, ini menelusuri tree ini untuk mengumpulkan kandidat tetangga. Spotify telah open source implementasinya.

Ada algoritma lain, seperti SPTAG (Space Partition Tree And Graph) dari Microsoft, dan FLANN (Fast Library for Approximate Nearest Neighbors).

Meskipun vector database muncul sebagai kategori mereka sendiri dengan munculnya RAG, database apa pun yang bisa menyimpan vektor bisa disebut vector database. Banyak database tradisional telah diperluas atau akan diperluas untuk mendukung penyimpanan vektor dan vector search.

#### Membandingkan Algoritma Retrieval

Karena sejarah retrieval yang panjang, banyak solusi matangnya membuat retrieval berbasis term dan berbasis embedding relatif mudah untuk dimulai. Setiap pendekatan memiliki pro dan kontra.

Retrieval berbasis term umumnya jauh lebih cepat daripada retrieval berbasis embedding selama indexing dan query. Ekstraksi term lebih cepat daripada generasi embedding, dan pemetaan dari term ke dokumen yang berisi mereka bisa kurang mahal secara komputasi daripada pencarian nearest-neighbor.

Retrieval berbasis term juga bekerja dengan baik out of the box. Solusi seperti Elasticsearch dan BM25 telah berhasil mendukung banyak aplikasi pencarian dan retrieval. Namun, kesederhanaannya juga berarti bahwa ini memiliki lebih sedikit komponen yang bisa Anda tweak untuk meningkatkan performanya.

Retrieval berbasis embedding, di sisi lain, bisa secara signifikan ditingkatkan dari waktu ke waktu untuk mengungguli retrieval berbasis term. Anda bisa men-finetune model embedding dan retriever, baik secara terpisah, bersama, atau bersama dengan model generatif. Namun, mengonversi data menjadi embedding bisa mengaburkan kata kunci, seperti kode error spesifik, misalnya, EADDRNOTAVAIL (99), atau nama produk, membuatnya lebih sulit untuk dicari nanti. Keterbatasan ini bisa diatasi dengan menggabungkan retrieval berbasis embedding dengan retrieval berbasis term, seperti yang dibahas nanti di bab ini.

Kualitas retriever bisa dievaluasi berdasarkan kualitas data yang diambil. Dua metrik yang sering digunakan oleh framework evaluasi RAG adalah context precision dan context recall, atau precision dan recall untuk singkatnya (context precision juga disebut context relevance):

**Context precision:** Dari semua dokumen yang diambil, berapa persen yang relevan dengan kueri?

**Context recall:** Dari semua dokumen yang relevan dengan kueri, berapa persen yang diambil?

Untuk menghitung metrik ini, Anda menyusun set evaluasi dengan daftar kueri tes dan set dokumen. Untuk setiap kueri tes, Anda menganotasi setiap dokumen tes sebagai relevan atau tidak relevan. Anotasi bisa dilakukan baik oleh manusia maupun AI judge. Anda kemudian menghitung skor precision dan recall retriever pada set evaluasi ini.

Dalam produksi, beberapa framework RAG hanya mendukung context precision, bukan context recall. Untuk menghitung context recall untuk kueri tertentu, Anda perlu menganotasi relevansi semua dokumen dalam database Anda terhadap kueri itu. Context precision lebih sederhana untuk dihitung. Anda hanya perlu membandingkan dokumen yang diambil dengan kueri, yang bisa dilakukan oleh AI judge.

Jika Anda peduli tentang peringkat dokumen yang diambil, misalnya, dokumen yang lebih relevan harus diberi peringkat pertama, Anda bisa menggunakan metrik seperti NDCG (normalized discounted cumulative gain), MAP (Mean Average Precision), dan MRR (Mean Reciprocal Rank).

Untuk retrieval semantik, Anda juga perlu mengevaluasi kualitas embedding Anda. Seperti yang dibahas di Bab 3, embedding bisa dievaluasi secara independen—mereka dianggap baik jika dokumen yang lebih serupa memiliki embedding yang lebih dekat. Embedding juga bisa dievaluasi berdasarkan seberapa baik mereka bekerja untuk tugas spesifik. Benchmark MTEB (Muennighoff et al., 2023) mengevaluasi embedding untuk berbagai tugas termasuk retrieval, klasifikasi, dan clustering.

Kualitas retriever juga harus dievaluasi dalam konteks seluruh sistem RAG. Pada akhirnya, retriever bagus jika membantu sistem menghasilkan jawaban berkualitas tinggi. Mengevaluasi output model generatif dibahas di Bab 3 dan 4.

Apakah janji performa sistem retrieval semantik layak dikejar tergantung pada seberapa besar Anda memprioritaskan biaya dan latensi, terutama selama fase querying. Karena sebagian besar latensi RAG berasal dari generasi output, terutama untuk output panjang, latensi tambahan yang ditambahkan oleh generasi embedding kueri dan vector search mungkin minimal dibandingkan dengan latensi RAG total. Meskipun demikian, latensi tambahan masih bisa memengaruhi pengalaman pengguna.

Kekhawatiran lain adalah biaya. Menghasilkan embedding memerlukan biaya. Ini terutama masalah jika data Anda sering berubah dan memerlukan regenerasi embedding yang sering. Bayangkan harus menghasilkan embedding untuk 100 juta dokumen setiap hari! Tergantung pada vector database apa yang Anda gunakan, penyimpanan vektor dan kueri vector search juga bisa mahal. Tidak jarang melihat pengeluaran vector database perusahaan menjadi seperlima atau bahkan setengah dari pengeluaran mereka pada API model.

Tabel 6-2 menunjukkan perbandingan side-by-side antara retrieval berbasis term dan retrieval semantik.

**Tabel 6-2.** Retrieval berbasis term dan retrieval semantik berdasarkan kecepatan, performa, dan biaya.

| | Retrieval Berbasis Term | Retrieval Berbasis Embedding |
|---|---|---|
| **Kecepatan Querying** | Jauh lebih cepat daripada retrieval berbasis embedding | Generasi embedding kueri dan vector search bisa lambat |
| **Performa** | Biasanya performa kuat out of the box, tetapi sulit ditingkatkan. Bisa mengambil dokumen yang salah karena ambiguitas term. | Bisa mengungguli retrieval berbasis term dengan fine-tuning. Memungkinkan penggunaan kueri yang lebih alami, karena berfokus pada semantik alih-alih term. |
| **Biaya** | Jauh lebih murah daripada retrieval berbasis embedding | Embedding, penyimpanan vektor, dan solusi vector search bisa mahal |

Dengan sistem retrieval, Anda bisa membuat trade-off tertentu antara indexing dan querying. Semakin detail indeks, semakin akurat proses retrieval, tetapi proses indexing akan lebih lambat dan lebih memakan memori. Bayangkan membangun indeks pelanggan potensial. Menambahkan lebih banyak detail (misalnya, nama, perusahaan, email, telepon, minat) membuatnya lebih mudah untuk menemukan orang yang relevan tetapi membutuhkan waktu lebih lama untuk membangun dan memerlukan lebih banyak penyimpanan.

Secara umum, indeks detail seperti HNSW memberikan akurasi tinggi dan waktu query cepat tetapi memerlukan waktu dan memori signifikan untuk membangun. Sebaliknya, indeks yang lebih sederhana seperti LSH lebih cepat dan kurang intensif memori untuk dibuat, tetapi menghasilkan query yang lebih lambat dan kurang akurat.

Situs web ANN-Benchmarks membandingkan algoritma ANN berbeda pada beberapa dataset menggunakan empat metrik utama, dengan mempertimbangkan trade-off antara indexing dan querying. Ini termasuk:

- **Recall:** Fraksi nearest neighbor yang ditemukan oleh algoritma.
- **Query per second (QPS):** Jumlah kueri yang bisa ditangani algoritma per detik. Ini penting untuk aplikasi lalu lintas tinggi.
- **Build time:** Waktu yang diperlukan untuk membangun indeks. Metrik ini terutama penting jika Anda perlu sering memperbarui indeks Anda (misalnya, karena data Anda berubah).
- **Index size:** Ukuran indeks yang dibuat oleh algoritma, yang penting untuk menilai skalabilitas dan persyaratan penyimpanannya.

Selain itu, BEIR (Benchmarking IR) (Thakur et al., 2021) adalah evaluation harness untuk retrieval. Ini mendukung sistem retrieval di 14 benchmark retrieval umum.

Untuk meringkas, kualitas sistem RAG harus dievaluasi baik komponen per komponen maupun end to end. Untuk melakukan ini, Anda harus melakukan hal-hal berikut:

1. Mengevaluasi kualitas retrieval.
2. Mengevaluasi output RAG final.
3. Mengevaluasi embedding (untuk retrieval berbasis embedding).

#### Menggabungkan Algoritma Retrieval

Mengingat keuntungan berbeda dari algoritma retrieval berbeda, sistem retrieval produksi biasanya menggabungkan beberapa pendekatan. Menggabungkan retrieval berbasis term dan retrieval berbasis embedding disebut hybrid search.

Algoritma berbeda bisa digunakan secara berurutan. Pertama, retriever yang murah dan kurang presisi, seperti sistem berbasis term, mengambil kandidat. Kemudian, mekanisme yang lebih presisi tetapi lebih mahal, seperti k-nearest neighbors, menemukan yang terbaik dari kandidat ini. Langkah kedua ini juga disebut reranking.

Misalnya, diberikan term "transformer", Anda bisa mengambil semua dokumen yang berisi kata transformer, terlepas dari apakah mereka tentang perangkat listrik, arsitektur neural, atau film. Kemudian Anda menggunakan vector search untuk menemukan di antara dokumen-dokumen ini yang sebenarnya terkait dengan kueri transformer Anda. Sebagai contoh lain, pertimbangkan kueri "Siapa yang bertanggung jawab atas penjualan terbanyak ke X?" Pertama, Anda mungkin mengambil semua dokumen yang terkait dengan X menggunakan kata kunci X. Kemudian, Anda menggunakan vector search untuk mengambil konteks yang terkait dengan "Siapa yang bertanggung jawab atas penjualan terbanyak?"

Algoritma berbeda juga bisa digunakan secara paralel sebagai ensemble. Ingat bahwa retriever bekerja dengan memberi peringkat dokumen berdasarkan skor relevansi mereka terhadap kueri. Anda bisa menggunakan beberapa retriever untuk mengambil kandidat secara bersamaan, kemudian menggabungkan peringkat berbeda ini bersama untuk menghasilkan peringkat final.

Algoritma untuk menggabungkan peringkat berbeda disebut reciprocal rank fusion (RRF) (Cormack et al., 2009). Ini memberikan setiap dokumen skor berdasarkan peringkatnya oleh retriever. Secara intuitif, jika peringkat pertama, skornya adalah 1/1 = 1. Jika peringkat kedua, skornya adalah ½ = 0,5. Semakin tinggi peringkat, semakin tinggi skornya.

Skor final dokumen adalah jumlah skornya terhadap semua retriever. Jika dokumen diberi peringkat pertama oleh satu retriever dan kedua oleh retriever lain, skornya adalah 1 + 0,5 = 1,5. Contoh ini adalah penyederhanaan berlebihan dari RRF, tetapi ini menunjukkan dasar-dasarnya. Rumus aktual untuk dokumen D lebih rumit, sebagai berikut:

Score(D) = ∑ᵢ₌₁^n 1 / (k + rᵢ(D))

- n adalah jumlah ranked list; setiap rank list diproduksi oleh retriever.
- rᵢ(D) adalah peringkat dokumen oleh retriever i.
- k adalah konstanta untuk menghindari pembagian dengan nol dan mengontrol pengaruh dokumen berperingkat lebih rendah. Nilai tipikal untuk k adalah 60.

### Optimasi Retrieval

Tergantung pada tugas, taktik tertentu bisa meningkatkan kemungkinan dokumen relevan diambil. Empat taktik yang dibahas di sini adalah strategi chunking, reranking, query rewriting, dan contextual retrieval.

#### Strategi Chunking

Bagaimana data Anda harus diindeks tergantung pada cara Anda berniat mengambilnya nanti. Bagian terakhir membahas algoritma retrieval berbeda dan strategi indexing masing-masing. Di sana, diskusi didasarkan pada asumsi bahwa dokumen telah dibagi menjadi chunk yang bisa dikelola. Di bagian ini, saya akan membahas strategi chunking berbeda. Ini adalah pertimbangan penting karena strategi chunking yang Anda gunakan bisa secara signifikan memengaruhi performa sistem retrieval Anda.

Strategi paling sederhana adalah membagi dokumen menjadi chunk dengan panjang sama berdasarkan unit tertentu. Unit umum adalah karakter, kata, kalimat, dan paragraf. Misalnya, Anda bisa membagi setiap dokumen menjadi chunk 2.048 karakter atau 512 kata. Anda juga bisa membagi setiap dokumen sehingga setiap chunk bisa berisi jumlah kalimat tetap (seperti 20 kalimat) atau paragraf (seperti setiap paragraf adalah chunk sendiri).

Anda juga bisa membagi dokumen secara rekursif menggunakan unit yang semakin kecil sampai setiap chunk sesuai dalam ukuran chunk maksimum Anda. Misalnya, Anda bisa mulai dengan membagi dokumen menjadi bagian. Jika bagian terlalu panjang, bagi menjadi paragraf. Jika paragraf masih terlalu panjang, bagi menjadi kalimat. Ini mengurangi kemungkinan teks terkait terpecah secara arbitrer.

Dokumen spesifik mungkin juga mendukung strategi chunking kreatif. Misalnya, ada splitter yang dikembangkan khusus untuk bahasa pemrograman berbeda. Dokumen Q&A bisa dibagi berdasarkan pasangan pertanyaan atau jawaban, di mana setiap pasangan membentuk chunk. Teks Tiongkok mungkin perlu dibagi berbeda dari teks Inggris.

Saat dokumen dibagi menjadi chunk tanpa overlap, chunk mungkin terpotong di tengah konteks penting, menyebabkan hilangnya informasi kritis. Pertimbangkan teks "Saya meninggalkan catatan untuk istri saya". Jika dibagi menjadi "Saya meninggalkan istri saya" dan "catatan", kedua chunk ini tidak menyampaikan informasi kunci dari teks asli. Overlap memastikan bahwa informasi batas penting disertakan dalam setidaknya satu chunk. Jika Anda mengatur ukuran chunk menjadi 2.048 karakter, Anda mungkin mengatur ukuran overlap menjadi 20 karakter.

Ukuran chunk tidak boleh melebihi panjang konteks maksimum model generatif. Untuk pendekatan berbasis embedding, ukuran chunk juga tidak boleh melebihi batas konteks model embedding.

Anda juga bisa membagi dokumen menggunakan token, ditentukan oleh tokenizer model generatif, sebagai unit. Katakan Anda ingin menggunakan Llama 3 sebagai model generatif Anda. Anda kemudian pertama-tama tokenize dokumen menggunakan tokenizer Llama 3. Anda kemudian bisa membagi dokumen menjadi chunk menggunakan token sebagai batas. Chunking berdasarkan token membuatnya lebih mudah untuk bekerja dengan model downstream. Namun, kelemahan dari pendekatan ini adalah jika Anda beralih ke model generatif lain dengan tokenizer berbeda, Anda perlu mengindeks ulang data Anda.

Terlepas dari strategi mana yang Anda pilih, ukuran chunk penting. Ukuran chunk yang lebih kecil memungkinkan informasi yang lebih beragam. Chunk yang lebih kecil berarti Anda bisa memuat lebih banyak chunk ke dalam konteks model. Jika Anda membagi dua ukuran chunk, Anda bisa memuat dua kali lebih banyak chunk. Lebih banyak chunk bisa memberikan model dengan berbagai informasi yang lebih luas, yang bisa memungkinkan model menghasilkan jawaban yang lebih baik.

Ukuran chunk kecil, bagaimanapun, bisa menyebabkan hilangnya informasi penting. Bayangkan dokumen yang berisi informasi penting tentang topik X di seluruh dokumen, tetapi X hanya disebutkan di paruh pertama. Jika Anda membagi dokumen ini menjadi dua chunk, paruh kedua dokumen mungkin tidak diambil, dan model tidak akan bisa menggunakan informasinya.

Ukuran chunk yang lebih kecil juga bisa meningkatkan overhead komputasi. Ini terutama masalah untuk retrieval berbasis embedding. Membagi dua ukuran chunk berarti Anda memiliki dua kali lebih banyak chunk untuk diindeks dan dua kali lebih banyak vektor embedding untuk dihasilkan dan disimpan. Ruang pencarian vektor Anda akan dua kali lebih besar, yang bisa mengurangi kecepatan query.

Tidak ada ukuran chunk atau ukuran overlap terbaik universal. Anda harus bereksperimen untuk menemukan apa yang paling cocok untuk Anda.

#### Reranking

Peringkat dokumen awal yang dihasilkan oleh retriever bisa di-rerank lebih lanjut untuk lebih akurat. Reranking terutama berguna saat Anda perlu mengurangi jumlah dokumen yang diambil, baik untuk memasukkannya ke dalam konteks model atau untuk mengurangi jumlah token input.

Satu pola umum untuk reranking dibahas di "Menggabungkan algoritma retrieval" di halaman 266. Retriever yang murah tetapi kurang presisi mengambil kandidat, kemudian mekanisme yang lebih presisi tetapi lebih mahal memberi peringkat ulang kandidat ini.

Dokumen juga bisa di-rerank berdasarkan waktu, memberikan bobot lebih tinggi ke data yang lebih baru. Ini berguna untuk aplikasi sensitif waktu seperti agregasi berita, chat dengan email Anda (misalnya, chatbot yang bisa menjawab pertanyaan tentang email Anda), atau analisis pasar saham.

Reranking konteks berbeda dari reranking pencarian tradisional di mana posisi tepat item kurang kritis. Dalam pencarian, peringkat (misalnya, pertama atau kelima) sangat penting. Dalam reranking konteks, urutan dokumen masih penting karena memengaruhi seberapa baik model bisa memprosesnya. Model mungkin lebih baik memahami dokumen di awal dan akhir konteks, seperti yang dibahas di "Context Length and Context Efficiency" di halaman 218. Namun, selama dokumen disertakan, dampak urutannya kurang signifikan dibandingkan dengan peringkat pencarian.

#### Query Rewriting

Query rewriting juga dikenal sebagai query reformulation, query normalization, dan kadang-kadang query expansion. Pertimbangkan percakapan berikut:

```
Pengguna: Kapan terakhir kali John Doe membeli sesuatu dari kami?
AI: John terakhir membeli topi Fruity Fedora dari kami dua minggu lalu, pada 3 Januari 2030.
Pengguna: Bagaimana dengan Emily Doe?
```

Pertanyaan terakhir, "Bagaimana dengan Emily Doe?", ambigu tanpa konteks. Jika Anda menggunakan kueri ini secara verbatim untuk mengambil dokumen, Anda kemungkinan akan mendapatkan hasil yang tidak relevan. Anda perlu menulis ulang kueri ini untuk mencerminkan apa yang sebenarnya ditanyakan pengguna. Kueri baru harus masuk akal dengan sendirinya. Dalam hal ini, kueri harus ditulis ulang menjadi "Kapan terakhir kali Emily Doe membeli sesuatu dari kami?"

Meskipun saya menempatkan query rewriting di "RAG" di halaman 253, query rewriting tidak unik untuk RAG. Dalam mesin pencari tradisional, query rewriting sering dilakukan menggunakan heuristik. Dalam aplikasi AI, query rewriting juga bisa dilakukan menggunakan model AI lain, menggunakan prompt serupa dengan "Diberikan percakapan berikut, tulis ulang input pengguna terakhir untuk mencerminkan apa yang sebenarnya ditanyakan pengguna". Gambar 6-4 menunjukkan cara ChatGPT menulis ulang kueri menggunakan prompt ini.

Gambar 6-4. Anda bisa menggunakan model generatif lain untuk menulis ulang kueri.

Query rewriting bisa menjadi rumit, terutama jika Anda perlu melakukan resolusi identitas atau menggabungkan pengetahuan lain. Misalnya, jika pengguna bertanya "Bagaimana dengan istrinya?" Anda pertama-tama perlu menanyakan database Anda untuk mencari tahu siapa istrinya. Jika Anda tidak memiliki informasi ini, model rewriting harus mengakui bahwa kueri ini tidak bisa diselesaikan alih-alih berhalusinasi nama, menyebabkan jawaban yang salah.

#### Contextual Retrieval

Ide di balik contextual retrieval adalah augmentasi setiap chunk dengan konteks relevan untuk membuatnya lebih mudah mengambil chunk yang relevan. Teknik sederhana adalah augmentasi chunk dengan metadata seperti tag dan kata kunci. Untuk ecommerce, produk bisa diaugmentasi oleh deskripsi dan ulasannya. Gambar dan video bisa dikueri berdasarkan judul atau caption mereka.

Metadata mungkin juga termasuk entitas yang diekstrak secara otomatis dari chunk. Beberapa tim memberi tahu saya bahwa sistem retrieval mereka bekerja terbaik saat data diorganisir dalam format pertanyaan-dan-jawaban.

### RAG Melampaui Teks

Bagian terakhir membahas sistem RAG berbasis teks di mana sumber data eksternal adalah dokumen teks. Namun, sumber data eksternal juga bisa berupa data multimodal dan tabular.

#### RAG Multimodal

Jika generator Anda multimodal, konteksnya mungkin diaugmentasi tidak hanya dengan dokumen teks tetapi juga dengan gambar, video, audio, dll., dari sumber eksternal. Saya akan menggunakan gambar dalam contoh untuk menjaga penulisan tetap ringkas, tetapi Anda bisa mengganti gambar dengan modalitas lain. Diberikan kueri, retriever mengambil teks dan gambar yang relevan. Misalnya, diberikan "Apa warna rumah dalam film Pixar Up?" retriever bisa mengambil gambar rumah di Up untuk membantu model menjawab, seperti yang ditunjukkan pada Gambar 6-6. (*Gambar asli dari Up tidak digunakan, karena alasan hak cipta.)

Gambar 6-6. RAG multimodal bisa augmentasi kueri dengan teks dan gambar.

Jika gambar memiliki metadata—seperti judul, tag, dan caption—gambar bisa diambil menggunakan metadata. Misalnya, gambar diambil jika caption-nya dianggap relevan dengan kueri.

Jika Anda ingin mengambil gambar berdasarkan kontennya, Anda perlu memiliki cara untuk membandingkan gambar dengan kueri. Jika kueri adalah teks, Anda memerlukan model embedding multimodal yang bisa menghasilkan embedding untuk gambar dan teks. Katakan Anda menggunakan CLIP (Radford et al., 2021) sebagai model embedding multimodal. Retriever bekerja sebagai berikut:

1. Menghasilkan embedding CLIP untuk semua data Anda, baik teks maupun gambar, dan menyimpannya dalam vector database.
2. Diberikan kueri, menghasilkan embedding CLIP-nya.
3. Query dalam vector database untuk semua gambar dan teks yang embedding-nya dekat dengan embedding kueri.

#### RAG dengan Data Tabular

Sebagian besar aplikasi bekerja tidak hanya dengan data tidak terstruktur seperti teks dan gambar tetapi juga dengan data tabular. Banyak kueri mungkin memerlukan informasi dari tabel data untuk dijawab. Alur kerja untuk augmentasi konteks menggunakan data tabular secara signifikan berbeda dari alur kerja RAG klasik.

Bayangkan Anda bekerja untuk situs ecommerce bernama Kitty Vogue yang mengkhususkan diri dalam fashion kucing. Toko ini memiliki tabel pesanan bernama Sales, seperti yang ditunjukkan pada Tabel 6-3.

**Tabel 6-3.** Contoh tabel pesanan, Sales, untuk situs ecommerce imajiner Kitty Vogue.

| Order ID | Timestamp | Product ID | Product | Unit Price ($) | Units | Total |
|----------|-----------|------------|---------|----------------|-------|-------|
| 1 | ... | 2044 | Meow Mix Seasoning | 10,99 | 1 | 10,99 |
| 2 | ... | 3492 | Purr & Shake | 25 | 2 | 50 |
| 3 | ... | 2045 | Fruity Fedora | 18 | 1 | 18 |
| ... | ... | ... | ... | ... | ... | ... |

Untuk menghasilkan respons terhadap pertanyaan "Berapa unit Fruity Fedora yang terjual dalam 7 hari terakhir?", sistem Anda perlu mengqueri tabel ini untuk semua pesanan yang melibatkan Fruity Fedora dan menjumlahkan jumlah unit di semua pesanan. Asumsikan bahwa tabel ini bisa dikueri menggunakan SQL. Kueri SQL mungkin terlihat seperti ini:

```sql
SELECT SUM(units) AS total_units_sold
FROM Sales
WHERE product_name = 'Fruity Fedora'
AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);
```

Alur kerjanya sebagai berikut, divisualisasikan pada Gambar 6-7. Untuk menjalankan alur kerja ini, sistem Anda harus memiliki kemampuan untuk menghasilkan dan mengeksekusi kueri SQL:

1. **Text-to-SQL:** berdasarkan kueri pengguna dan skema tabel yang disediakan, tentukan kueri SQL apa yang diperlukan. Text-to-SQL adalah contoh semantic parsing, seperti yang dibahas di Bab 2.
2. **Eksekusi SQL:** eksekusi kueri SQL.
3. **Generasi:** menghasilkan respons berdasarkan hasil SQL dan kueri pengguna asli.

Gambar 6-7. Sistem RAG yang augmentasi konteks dengan data tabular.

Untuk langkah text-to-SQL, jika ada banyak tabel yang tersedia yang skema-nya tidak bisa semuanya masuk ke konteks model, Anda mungkin memerlukan langkah antara untuk memprediksi tabel apa yang akan digunakan untuk setiap kueri. Text-to-SQL bisa dilakukan oleh generator yang sama yang menghasilkan respons final atau model text-to-S khusus.

Di bagian ini, kita telah membahas bagaimana alat seperti retriever dan executor SQL bisa memungkinkan model menangani lebih banyak kueri dan menghasilkan respons berkualitas lebih tinggi. Apakah memberi model akses ke lebih banyak alat akan meningkatkan kemampuannya lebih jauh? Penggunaan tool adalah karakteristik inti dari pola agentic, yang akan kita bahas di bagian berikutnya.

## Agents

Intelligent agents dianggap oleh banyak orang sebagai tujuan akhir AI. Buku klasik oleh Stuart Russell dan Peter Norvig, Artificial Intelligence: A Modern Approach (Prentice Hall, 1995) mendefinisikan bidang penelitian kecerdasan buatan sebagai "studi dan desain agen rasional."

Kemampuan foundation model yang belum pernah terjadi sebelumnya telah membuka pintu ke aplikasi agentic yang sebelumnya tidak terbayangkan. Kemampuan baru ini akhirnya memungkinkan pengembangan agen otonom dan cerdas untuk bertindak sebagai asisten, rekan kerja, dan pelatih kita. Mereka bisa membantu kita membuat situs web, mengumpulkan data, merencanakan perjalanan, melakukan riset pasar, mengelola akun pelanggan, mengotomatisasi entri data, mempersiapkan kita untuk wawancara, mewawancarai kandidat kita, menegosiasikan kesepakatan, dll. Kemungkinan tampaknya tidak ada habisnya, dan nilai ekonomi potensial dari agen ini sangat besar.

Agen bertenaga AI adalah bidang yang muncul, tanpa kerangka teoretis yang mapan untuk mendefinisikan, mengembangkan, dan mengevaluasinya. Bagian ini adalah upaya terbaik untuk membangun kerangka dari literatur yang ada, tetapi ini akan berkembang seiring bidang tersebut. Dibandingkan dengan sisa buku, bagian ini lebih eksperimental. Keluhan di hari-hari awal agen adalah bahwa agen hanya bagus untuk menghabiskan kredit API Anda.

Bagian ini akan dimulai dengan gambaran umum agen, dan kemudian berlanjut dengan dua aspek yang menentukan kemampuan agen: alat dan perencanaan. Agen, dengan mode operasi baru mereka, memiliki mode kegagalan baru. Bagian ini akan diakhiri dengan diskusi tentang cara mengevaluasi agen untuk menangkap kegagalan ini.

Meskipun agen baru, mereka dibangun di atas konsep yang sudah muncul dalam buku ini, termasuk self-critique, chain-of-thought, dan output terstruktur. Artificial Intelligence: A Modern Approach (1995) mendefinisikan agen sebagai apa pun yang bisa dilihat sebagai merasakan lingkungannya melalui sensor dan bertindak terhadap lingkungan itu melalui aktuator.

### Gambaran Umum Agen

Istilah agen telah digunakan dalam banyak konteks teknik berbeda, termasuk tetapi tidak terbatas pada software agent, intelligent agent, user agent, conversational agent, dan reinforcement learning agent. Jadi, apa sebenarnya agen itu?

Agen adalah apa pun yang bisa merasakan lingkungannya dan bertindak terhadap lingkungan itu. Ini berarti bahwa agen dicirikan oleh lingkungan tempat ia beroperasi dan set tindakan yang bisa dilakukannya.

Lingkungan tempat agen bisa beroperasi didefinisikan oleh kasus penggunaannya. Jika agen dikembangkan untuk bermain game (misalnya, Minecraft, Go, Dota), game itu adalah lingkungannya. Jika Anda ingin agen mengikis dokumen dari internet, lingkungannya adalah internet. Jika agen Anda adalah robot memasak, dapur adalah lingkungannya. Lingkungan agen mobil self-driving adalah sistem jalan dan area yang berdekatan.

Set tindakan yang bisa dilakukan agen AI diaugmentasi oleh alat yang memiliki akses. Banyak aplikasi generative AI bertenaga yang Anda interaksi setiap hari adalah agen dengan akses ke alat, meskipun sederhana. ChatGPT adalah agen. Ini bisa mencari web, mengeksekusi kode Python, dan menghasilkan gambar. Sistem RAG adalah agen, dan text retriever, image retriever, dan SQL executor adalah alat mereka.

Ada ketergantungan kuat antara lingkungan agen dan set alatnya. Lingkungan menentukan alat apa yang berpotensi bisa digunakan agen. Misalnya, jika lingkungan adalah permainan catur, satu-satunya tindakan yang mungkin untuk agen adalah langkah catur yang valid. Namun, inventaris alat agen membatasi lingkungan tempat ia bisa beroperasi. Misalnya, jika satu-satunya tindakan robot adalah berenang, robot akan terbatas pada lingkungan air.

Gambar 6-8 menunjukkan visualisasi SWE-agent (Yang et al., 2024), agen yang dibangun di atas GPT-4. Lingkungannya adalah komputer dengan terminal dan sistem file. Set tindakannya termasuk navigasi repo, pencarian file, melihat file, dan mengedit baris.

Gambar 6-8. SWE-agent (Yang et al., 2024) adalah agen coding yang lingkungannya adalah komputer dan tindakannya termasuk navigasi, pencarian, dan pengeditan. Diadaptasi dari gambar asli yang dilisensikan di bawah CC BY 4.0.

Agen AI dimaksudkan untuk menyelesaikan tugas yang biasanya diberikan oleh pengguna dalam input. Dalam agen AI, AI adalah otak yang memproses informasi yang diterimanya, termasuk tugas dan umpan balik dari lingkungan, merencanakan urutan tindakan untuk mencapai tugas ini, dan menentukan apakah tugas telah selesai.

Mari kita kembali ke sistem RAG dengan data tabular dalam contoh Kitty Vogue. Ini adalah agen sederhana dengan tiga tindakan: generasi respons, generasi kueri SQL, dan eksekusi kueri SQL. Diberikan kueri "Proyeksikan pendapatan penjualan Fruity Fedora selama tiga bulan ke depan", agen mungkin melakukan urutan tindakan berikut:

1. Bernalar tentang cara menyelesaikan tugas ini. Ini mungkin memutuskan bahwa untuk memprediksi penjualan masa depan, ini pertama-tama memerlukan angka penjualan dari lima tahun terakhir. Perhatikan bahwa penalaran agen ditampilkan sebagai respons antara.
2. Memanggil generasi kueri SQL untuk menghasilkan kueri untuk mendapatkan angka penjualan dari lima tahun terakhir.
3. Memanggil eksekusi kueri SQL untuk mengeksekusi kueri ini.
4. Bernalar tentang output tool dan bagaimana mereka membantu dengan prediksi penjualan. Ini mungkin memutuskan bahwa angka-angka ini tidak cukup untuk membuat proyeksi yang andal, mungkin karena nilai yang hilang. Ini kemudian memutuskan bahwa ini juga memerlukan informasi tentang kampanye pemasaran masa lalu.
5. Memanggil generasi kueri SQL untuk menghasilkan kueri untuk kampanye pemasaran masa lalu.
6. Memanggil eksekusi SQL.
7. Bernalar bahwa informasi baru ini cukup untuk membantu memprediksi penjualan masa depan. Ini kemudian menghasilkan proyeksi.
8. Bernalar bahwa tugas telah berhasil diselesaikan.

Dibandingkan dengan kasus penggunaan non-agen, agen biasanya memerlukan model yang lebih kuat karena dua alasan:

- **Kesalahan majemuk:** agen sering perlu melakukan beberapa langkah untuk menyelesaikan tugas, dan akurasi keseluruhan menurun seiring jumlah langkah meningkat. Jika akurasi model adalah 95% per langkah, selama 10 langkah, akurasi akan turun menjadi 60%, dan selama 100 langkah, akurasi hanya akan menjadi 0,6%.
- **Taruhan lebih tinggi:** dengan akses ke alat, agen mampu melakukan tugas yang lebih berdampak, tetapi kegagalan apa pun bisa memiliki konsekuensi yang lebih parah.

Tugas yang memerlukan banyak langkah bisa memakan waktu dan uang untuk dijalankan. Namun, jika agen bisa otonom, agen bisa menghemat banyak waktu manusia, membuat biayanya sepadan.

Diberikan lingkungan, keberhasilan agen dalam lingkungan tergantung pada inventaris alat yang memiliki akses dan kekuatan perencana AI-nya. Mari kita mulai dengan melihat berbagai jenis alat yang bisa digunakan model.

### Alat

Sistem tidak perlu akses ke alat eksternal untuk menjadi agen. Namun, tanpa alat eksternal, kemampuan agen akan terbatas. Dengan sendirinya, model biasanya bisa melakukan satu tindakan—misalnya, LLM bisa menghasilkan teks, dan generator gambar bisa menghasilkan gambar. Alat eksternal membuat agen jauh lebih mampu.

Alat membantu agen untuk baik merasakan lingkungan maupun bertindak terhadapnya. Tindakan yang memungkinkan agen merasakan lingkungan adalah tindakan read-only, sedangkan tindakan yang memungkinkan agen bertindak terhadap lingkungan adalah tindakan write.

Bagian ini memberikan gambaran umum tentang alat eksternal. Cara alat bisa digunakan akan dibahas di "Planning" di halaman 281.

Set alat yang memiliki akses agen adalah inventaris alatnya. Karena inventaris alat agen menentukan apa yang bisa dilakukan agen, penting untuk memikirkan alat apa dan berapa banyak yang diberikan ke agen. Lebih banyak alat memberi agen lebih banyak kemampuan. Namun, semakin banyak alat, semakin menantang untuk memahami dan memanfaatkannya dengan baik. Eksperimen diperlukan untuk menemukan set alat yang tepat, seperti yang dibahas di "Tool selection" di halaman 295.

Tergantung pada lingkungan agen, ada banyak alat yang mungkin. Berikut tiga kategori alat yang mungkin ingin Anda pertimbangkan: augmentasi pengetahuan (yaitu, konstruksi konteks), ekstensi kemampuan, dan alat yang memungkinkan agen Anda bertindak terhadap lingkungannya.

#### Augmentasi Pengetahuan

Saya berharap bahwa buku ini, sejauh ini, telah meyakinkan Anda tentang pentingnya memiliki konteks yang relevan untuk kualitas respons model. Kategori penting alat termasuk yang membantu augmentasi pengetahuan agen Anda. Beberapa dari mereka telah dibahas: text retriever, image retriever, dan SQL executor. Alat potensial lain termasuk pencarian orang internal, API inventaris yang mengembalikan status produk berbeda, retrieval Slack, pembaca email, dll.

Banyak alat seperti itu augmentasi model dengan proses dan informasi privat organisasi Anda. Namun, alat juga bisa memberi model akses ke informasi publik, terutama dari internet.

Web browsing adalah salah satu kemampuan paling awal dan paling diantisipasi untuk diintegrasikan ke chatbot seperti ChatGPT. Web browsing mencegah model menjadi usang. Model menjadi usang saat data yang dilatih menjadi ketinggalan zaman. Jika data training model terputus minggu lalu, model tidak akan bisa menjawab pertanyaan yang memerlukan informasi dari minggu ini kecuali informasi ini disediakan dalam konteks. Tanpa web browsing, model tidak akan bisa memberi tahu Anda tentang cuaca, berita, acara mendatang, harga saham, status penerbangan, dll.

Saya menggunakan web browsing sebagai istilah umum untuk mencakup semua alat yang mengakses internet, termasuk browser web dan API spesifik seperti API pencarian, API berita, API GitHub, atau API media sosial seperti X, LinkedIn, dan Reddit.

Meskipun web browsing memungkinkan agen Anda merujuk informasi terkini untuk menghasilkan respons yang lebih baik dan mengurangi halusinasi, ini juga bisa membuka agen Anda ke tempat-tempat kotor internet. Pilih API Internet Anda dengan hati-hati.

#### Ekstensi Kemampuan

Kategori kedua alat yang perlu dipertimbangkan adalah yang mengatasi keterbatasan inherent model AI. Ini adalah cara mudah untuk memberi model Anda peningkatan performa. Misalnya, model AI terkenal buruk dalam matematika. Jika Anda bertanya pada model berapa 199.999 dibagi 292, model kemungkinan akan gagal. Namun, perhitungan ini sepele jika model memiliki akses ke kalkulator. Alih-alih mencoba melatih model agar baik dalam aritmatika, jauh lebih efisien sumber daya untuk hanya memberi model akses ke alat.

Alat sederhana lain yang bisa secara signifikan meningkatkan kemampuan model termasuk kalender, konverter zona waktu, konverter unit (misalnya, dari lbs ke kg), dan penerjemah yang bisa menerjemahkan ke dan dari bahasa yang tidak baik model.

Alat yang lebih kompleks tetapi kuat adalah interpreter kode. Alih-alih melatih model untuk memahami kode, Anda bisa memberinya akses ke interpreter kode sehingga bisa mengeksekusi potongan kode, mengembalikan hasil, atau menganalisis kegagalan kode. Kemampuan ini memungkinkan agen Anda bertindak sebagai asisten coding, analis data, dan bahkan asisten riset yang bisa menulis kode untuk menjalankan eksperimen dan melaporkan hasil. Namun, eksekusi kode otomatis datang dengan risiko serangan injeksi kode, seperti yang dibahas di "Defensive Prompt Engineering" di halaman 235. Pengukuran keamanan yang tepat penting untuk menjaga Anda dan pengguna Anda tetap aman.

Alat eksternal bisa membuat model hanya teks atau hanya gambar menjadi multimodal. Misalnya, model yang hanya bisa menghasilkan teks bisa memanfaatkan model text-to-image sebagai alat, memungkinkannya menghasilkan teks dan gambar. Diberikan permintaan teks, perencana AI agen memutuskan apakah akan memanggil generasi teks, generasi gambar, atau keduanya. Ini adalah cara ChatGPT bisa menghasilkan teks dan gambar—ini menggunakan DALL-E sebagai generator gambarnya. Agen juga bisa menggunakan interpreter kode untuk menghasilkan chart dan grafik, kompiler LaTeX untuk merender persamaan matematika, atau browser untuk merender halaman web dari kode HTML.

Demikian pula, model yang hanya bisa memproses input teks bisa menggunakan alat captioning gambar untuk memproses gambar dan alat transkripsi untuk memproses audio. Ini bisa menggunakan alat OCR (optical character recognition) untuk membaca PDF.

Penggunaan tool bisa secara signifikan meningkatkan performa model dibandingkan hanya prompting atau bahkan fine-tuning. Chameleon (Lu et al., 2023) menunjukkan bahwa agen bertenaga GPT-4, diaugmentasi dengan set 13 alat, bisa mengungguli GPT-4 saja pada beberapa benchmark. Contoh alat yang digunakan agen ini adalah retrieval pengetahuan, generator kueri, captioner gambar, detektor teks, dan pencarian Bing.

Pada ScienceQA, benchmark pertanyaan jawaban sains, Chameleon meningkatkan hasil few-shot terbaik yang dipublikasikan sebesar 11,37%. Pada TabMWP (Tabular Math Word Problems) (Lu et al., 2022), benchmark yang melibatkan pertanyaan matematika tabular, Chameleon meningkatkan akurasi sebesar 17%.

#### Tindakan Write

Sejauh ini, kita telah membahas tindakan read-only yang memungkinkan model membaca dari sumber datanya. Tetapi alat juga bisa melakukan tindakan write, membuat perubahan pada sumber data. SQL executor bisa mengambil tabel data (read) tetapi juga bisa mengubah atau menghapus tabel (write). API email bisa membaca email tetapi juga bisa meresponsnya. API perbankan bisa mengambil saldo Anda saat ini tetapi juga bisa memulai transfer bank.

Tindakan write memungkinkan sistem melakukan lebih banyak. Tindakan write bisa memungkinkan Anda mengotomatisasi seluruh alur kerja outreach pelanggan: meneliti pelanggan potensial, menemukan kontak mereka, menyusun email, mengirim email pertama, membaca respons, menindaklanjuti, mengekstrak pesanan, memperbarui database Anda dengan pesanan baru, dll.

Namun, prospek memberi AI kemampuan untuk secara otomatis mengubah kehidupan kita menakutkan. Sama seperti Anda tidak boleh memberi magang wewenang untuk menghapus database produksi Anda, Anda tidak boleh mengizinkan AI yang tidak andal untuk memulai transfer bank. Kepercayaan pada kemampuan sistem dan pengukuran keamanannya sangat penting. Anda perlu memastikan bahwa sistem dilindungi dari aktor jahat yang mungkin mencoba memanipulasinya untuk melakukan tindakan berbahaya.

Saat saya berbicara tentang agen AI otonom kepada sekelompok orang, sering ada seseorang yang mengangkat mobil self-driving. "Bagaimana jika seseorang meretas mobil untuk menculik Anda?" Meskipun contoh mobil self-driving tampak visceral karena fisikanya, sistem AI bisa menyebabkan bahaya tanpa kehadiran di dunia fisik. Ini bisa memanipulasi pasar saham, mencuri hak cipta, melanggar privasi, memperkuat bias, menyebarkan misinformasi dan propaganda, dan lainnya, seperti yang dibahas di "Defensive Prompt Engineering" di halaman 235.

Ini semua adalah kekhawatiran yang valid, dan organisasi apa pun yang ingin memanfaatkan AI perlu mengambil keamanan dan keselamatan dengan serius. Namun, ini bukan berarti bahwa sistem AI tidak boleh diberi kemampuan untuk bertindak di dunia nyata. Jika kita bisa membuat orang mempercayai mesin untuk membawa kita ke luar angkasa, saya berharap bahwa suatu hari, pengukuran keamanan akan cukup bagi kita untuk mempercayai sistem AI otonom. Selain itu, manusia juga bisa gagal. Secara pribadi, saya akan mempercayai mobil self-driving lebih daripada orang asing rata-rata untuk mengemudi saya.

Sama seperti alat yang tepat bisa membantu manusia menjadi jauh lebih produktif—bisakah Anda membayangkan melakukan bisnis tanpa Excel atau membangun gedung pencakar langit tanpa crane?—alat memungkinkan model menyelesaikan banyak tugas lagi. Banyak penyedia model sudah mendukung penggunaan tool dengan model mereka, fitur yang sering disebut function calling. Ke depan, saya akan mengharapkan function calling dengan set alat yang luas menjadi umum dengan sebagian besar model.

### Planning

Di jantung agen foundation model adalah model yang bertanggung jawab untuk menyelesaikan tugas. Tugas didefinisikan oleh tujuan dan batasannya. Misalnya, satu tugas adalah menjadwalkan perjalanan dua minggu dari San Francisco ke India dengan anggaran $5.000. Tujuannya adalah perjalanan dua minggu. Batasannya adalah anggaran.

Tugas kompleks memerlukan perencanaan. Output dari proses perencanaan adalah rencana, yang merupakan peta jalan yang menguraikan langkah-langkah yang diperlukan untuk menyelesaikan tugas. Perencanaan yang efektif biasanya memerlukan model untuk memahami tugas, mempertimbangkan opsi berbeda untuk mencapai tugas ini, dan memilih yang paling menjanjikan.

Jika Anda pernah berada dalam rapat perencanaan apa pun, Anda tahu bahwa perencanaan itu sulit. Sebagai masalah komputasi penting, perencanaan dipelajari dengan baik dan akan memerlukan beberapa volume untuk dibahas. Saya hanya bisa membahas permukaannya di sini.

#### Gambaran Umum Planning

Diberikan tugas, ada banyak cara yang mungkin untuk mendekomposisinya, tetapi tidak semua dari mereka akan mengarah pada hasil yang berhasil. Di antara solusi yang benar, beberapa lebih efisien daripada yang lain. Pertimbangkan kueri, "Berapa banyak perusahaan tanpa pendapatan yang telah mengumpulkan setidaknya $1 miliar?" Ada banyak cara yang mungkin untuk menyelesaikan ini, tetapi sebagai ilustrasi, pertimbangkan dua opsi:

1. Temukan semua perusahaan tanpa pendapatan, kemudian filter mereka berdasarkan jumlah yang dikumpulkan.
2. Temukan semua perusahaan yang telah mengumpulkan setidaknya $1 miliar, kemudian filter mereka berdasarkan pendapatan.

Opsi kedua lebih efisien. Ada jauh lebih banyak perusahaan tanpa pendapatan daripada perusahaan yang telah mengumpulkan $1 miliar. Diberikan hanya dua opsi ini, agen yang cerdas harus memilih opsi 2.

Anda bisa menggabungkan perencanaan dengan eksekusi dalam prompt yang sama. Misalnya, Anda memberi model prompt, memintanya berpikir langkah demi langkah (seperti dengan prompt chain-of-thought), dan kemudian mengeksekusi langkah-langkah itu semua dalam satu prompt. Tetapi bagaimana jika model menghasilkan rencana 1.000 langkah yang bahkan tidak mencapai tujuan? Tanpa pengawasan, agen bisa menjalankan langkah-langkah itu selama berjam-jam, membuang waktu dan uang pada panggilan API, sebelum Anda menyadari bahwa itu tidak ke mana-mana.

Untuk menghindari eksekusi yang sia-sia, perencanaan harus dipisahkan dari eksekusi. Anda meminta agen untuk pertama-tama menghasilkan rencana, dan hanya setelah rencana ini divalidasi baru dieksekusi. Rencana bisa divalidasi menggunakan heuristik. Misalnya, satu heuristik sederhana adalah menghilangkan rencana dengan tindakan yang tidak valid. Jika rencana yang dihasilkan memerlukan pencarian Google dan agen tidak memiliki akses ke Google Search, rencana ini tidak valid. Heuristik sederhana lain mungkin menghilangkan semua rencana dengan lebih dari X langkah. Rencana juga bisa divalidasi menggunakan AI judge. Anda bisa meminta model untuk mengevaluasi apakah rencana tampaknya masuk akal atau cara meningkatkannya.

Jika rencana yang dihasilkan dievaluasi buruk, Anda bisa meminta perencana untuk menghasilkan rencana lain. Jika rencana yang dihasilkan baik, eksekusi. Jika rencana terdiri dari alat eksternal, function calling akan dipanggil. Output dari mengeksekusi rencana ini kemudian perlu dievaluasi lagi. Perhatikan bahwa rencana yang dihasilkan tidak harus menjadi rencana end-to-end untuk seluruh tugas. Ini bisa menjadi rencana kecil untuk subtugas. Seluruh proses terlihat seperti Gambar 6-9.

Gambar 6-9. Memisahkan perencanaan dan eksekusi sehingga hanya rencana yang divalidasi yang dieksekusi.

Sistem Anda sekarang memiliki tiga komponen: satu untuk menghasilkan rencana, satu untuk memvalidasi rencana, dan yang lain untuk mengeksekusi rencana. Jika Anda menganggap setiap komponen sebagai agen, ini adalah sistem multi-agen. Karena sebagian besar alur kerja agentic cukup kompleks untuk melibatkan beberapa komponen, sebagian besar agen adalah multi-agen.

Untuk mempercepat proses, alih-alih menghasilkan rencana secara berurutan, Anda bisa menghasilkan beberapa rencana secara paralel dan meminta evaluator untuk memilih yang paling menjanjikan. Ini adalah trade-off latensi/biaya lain, karena menghasilkan beberapa rencana secara bersamaan akan memerlukan biaya ekstra.

Perencanaan memerlukan pemahaman intent di balik tugas: apa yang coba dilakukan pengguna dengan kueri ini? Intent classifier sering digunakan untuk membantu agen merencanakan. Seperti yang ditunjukkan di "Break Complex Tasks into Simpler Subtasks" di halaman 224, klasifikasi intent bisa dilakukan menggunakan prompt lain atau model klasifikasi yang dilatih untuk tugas ini. Mekanisme klasifikasi intent bisa dianggap sebagai agen lain dalam sistem multi-agen Anda.

Mengetahui intent bisa membantu agen memilih alat yang tepat. Misalnya, untuk dukungan pelanggan, jika kueri tentang penagihan, agen mungkin perlu akses ke alat untuk mengambil pembayaran terbaru pengguna. Tetapi jika kueri tentang cara mereset kata sandi, agen mungkin perlu mengakses retrieval dokumentasi.

Beberapa kueri mungkin di luar cakupan agen. Intent classifier harus bisa mengklasifikasikan permintaan sebagai IRRELEVAN sehingga agen bisa menolak dengan sopan alih-alih membuang FLOPs menghasilkan solusi yang mustahil.

Sejauh ini, kita telah mengasumsikan bahwa agen mengotomatisasi ketiga tahap: menghasilkan rencana, memvalidasi rencana, dan mengeksekusi rencana. Dalam kenyataannya, manusia bisa terlibat di salah satu tahap tersebut untuk membantu proses dan mengurangi risiko. Ahli manusia bisa memberikan rencana, memvalidasi rencana, atau mengeksekusi bagian dari rencana. Misalnya, untuk tugas kompleks di mana agen kesulitan menghasilkan seluruh rencana, ahli manusia bisa memberikan rencana tingkat tinggi yang bisa diperluas agen. Jika rencana melibatkan operasi berisiko, seperti memperbarui database atau menggabungkan perubahan kode, sistem bisa meminta persetujuan manusia eksplisit sebelum mengeksekusi atau membiarkan manusia mengeksekusi operasi ini. Untuk membuat ini mungkin, Anda perlu mendefinisikan dengan jelas tingkat otomasi yang bisa dimiliki agen untuk setiap tindakan.

Untuk meringkas, menyelesaikan tugas biasanya melibatkan proses berikut. Perhatikan bahwa refleksi tidak wajib untuk agen, tetapi ini akan secara signifikan meningkatkan performa agen:

1. **Generasi rencana:** menghasilkan rencana untuk menyelesaikan tugas ini. Rencana adalah urutan tindakan yang bisa dikelola, jadi proses ini juga disebut dekomposisi tugas.
2. **Refleksi dan koreksi kesalahan:** mengevaluasi rencana yang dihasilkan. Jika rencana buruk, menghasilkan rencana baru.
3. **Eksekusi:** mengambil tindakan yang diuraikan dalam rencana yang dihasilkan. Ini sering melibatkan memanggil fungsi spesifik.
4. **Refleksi dan koreksi kesalahan:** setelah menerima hasil tindakan, mengevaluasi hasil ini dan menentukan apakah tujuan telah tercapai. Mengidentifikasi dan memperbaiki kesalahan. Jika tujuan tidak selesai, menghasilkan rencana baru.

Anda sudah melihat beberapa teknik untuk generasi rencana dan refleksi dalam buku ini. Saat Anda meminta model untuk "berpikir langkah demi langkah", Anda memintanya untuk mendekomposisi tugas. Saat Anda meminta model untuk "memverifikasi apakah jawaban Anda benar", Anda memintanya untuk merefleksikan.

#### Foundation Model sebagai Perencana

Pertanyaan terbuka adalah seberapa baik foundation model bisa merencanakan. Banyak peneliti percaya bahwa foundation model, setidaknya yang dibangun di atas model bahasa autoregresif, tidak bisa. Ilmuwan Kepala AI Meta Yann LeCun menyatakan dengan tegas bahwa LLM autoregresif tidak bisa merencanakan (2023). Dalam artikel "Can LLMs Really Reason and Plan?" Kambhampati (2023) berpendapat bahwa LLM hebat dalam mengekstrak pengetahuan tetapi tidak merencanakan. Kambhampati menyarankan bahwa makalah yang mengklaim kemampuan perencanaan LLM membingungkan pengetahuan perencanaan umum yang diekstrak dari LLM dengan rencana yang bisa dieksekusi. "Rencana yang keluar dari LLM mungkin tampak masuk akal bagi pengguna awam, namun menyebabkan interaksi dan kesalahan waktu eksekusi."

Namun, sementara ada banyak bukti anekdotal bahwa LLM adalah perencana yang buruk, tidak jelas apakah ini karena kita tidak tahu cara menggunakan LLM dengan cara yang benar atau karena LLM, secara fundamental, tidak bisa merencanakan.

Perencanaan, pada intinya, adalah masalah pencarian. Anda mencari di antara jalur berbeda ke tujuan, memprediksi hasil (reward) dari setiap jalur, dan memilih jalur dengan hasil yang paling menjanjikan. Sering kali, Anda mungkin menentukan bahwa tidak ada jalur yang ada yang bisa membawa Anda ke tujuan.

Pencarian sering memerlukan backtracking. Misalnya, bayangkan Anda berada di langkah di mana ada dua tindakan yang mungkin: A dan B. Setelah mengambil tindakan A, Anda memasuki keadaan yang tidak menjanjikan, jadi Anda perlu backtrack ke keadaan sebelumnya untuk mengambil tindakan B.

Beberapa orang berpendapat bahwa model autoregresif hanya bisa menghasilkan tindakan maju. Ini tidak bisa backtrack untuk menghasilkan tindakan alternatif. Karena ini, mereka menyimpulkan bahwa model autoregresif tidak bisa merencanakan. Namun, ini belum tentu benar. Setelah mengeksekusi jalur dengan tindakan A, jika model menentukan bahwa jalur ini tidak masuk akal, model bisa merevisi jalur menggunakan tindakan B sebagai gantinya, secara efektif backtrack. Model juga selalu bisa memulai dari awal dan memilih jalur lain.

Juga mungkin bahwa LLM adalah perencana yang buruk karena mereka tidak diberikan alat yang diperlukan untuk merencanakan. Untuk merencanakan, perlu mengetahui tidak hanya tindakan yang tersedia tetapi juga hasil potensial dari setiap tindakan. Sebagai contoh sederhana, katakan Anda ingin berjalan ke atas gunung. Tindakan potensial Anda adalah belok kanan, belok kiri, berbalik, atau lurus ke depan. Namun, jika belok kanan akan menyebabkan Anda jatuh dari tebing, Anda mungkin tidak ingin mempertimbangkan tindakan ini. Dalam istilah teknis, tindakan membawa Anda dari satu keadaan ke keadaan lain, dan perlu mengetahui keadaan hasil untuk menentukan apakah akan mengambil tindakan.

Ini berarti bahwa tidak cukup memprompt model untuk hanya menghasilkan urutan tindakan seperti yang dilakukan teknik chain-of-thought prompting yang populer. Makalah "Reasoning with Language Model is Planning with World Model" (Hao et al., 2023) berpendapat bahwa LLM, dengan mengandung begitu banyak informasi tentang dunia, mampu memprediksi hasil dari setiap tindakan. LLM ini bisa menggabungkan prediksi hasil ini untuk menghasilkan rencana yang koheren.

Bahkan jika AI tidak bisa merencanakan, AI masih bisa menjadi bagian dari perencana. Mungkin bisa augmentasi LLM dengan alat pencarian dan sistem pelacakan keadaan untuk membantunya merencanakan.

#### Perencana Foundation Model (FM) versus Reinforcement Learning (RL)

Agen adalah konsep inti dalam RL, yang didefinisikan di Wikipedia sebagai bidang "berkaitan dengan bagaimana agen cerdas seharusnya mengambil tindakan dalam lingkungan dinamis untuk memaksimalkan reward kumulatif."

Agen RL dan agen FM mirip dalam banyak hal. Keduanya dicirikan oleh lingkungan dan tindakan yang mungkin. Perbedaan utama adalah cara kerja perencana mereka. Dalam agen RL, perencana dilatih oleh algoritma RL. Melatih perencana RL ini bisa memerlukan banyak waktu dan sumber daya. Dalam agen FM, model adalah perencana. Model ini bisa diprompt atau di-finetune untuk meningkatkan kemampuan perencanaannya, dan umumnya memerlukan lebih sedikit waktu dan lebih sedikit sumber daya.

Namun, tidak ada yang mencegah agen FM menggabungkan algoritma RL untuk meningkatkan performanya. Saya menduga bahwa dalam jangka panjang, agen FM dan agen RL akan bergabung.

#### Generasi Rencana

Cara paling sederhana untuk mengubah model menjadi generator rencana adalah dengan rekayasa prompt. Bayangkan Anda ingin membuat agen untuk membantu pelanggan mempelajari produk di Kitty Vogue. Anda memberi agen ini akses ke tiga alat eksternal: mengambil produk berdasarkan harga, mengambil produk teratas, dan mengambil informasi produk. Berikut contoh prompt untuk generasi rencana. Prompt ini hanya untuk tujuan ilustrasi. Prompt produksi kemungkinan lebih kompleks:

```
SYSTEM PROMPT
Usulkan rencana untuk menyelesaikan tugas. Anda memiliki akses ke 5 tindakan:
get_today_date()
fetch_top_products(start_date, end_date, num_products)
fetch_product_info(product_name)
generate_query(task_history, tool_output)
generate_response(query)

Rencana harus berupa urutan tindakan yang valid.

Contoh
Tugas: "Beri tahu saya tentang Fruity Fedora"
Rencana: [fetch_product_info, generate_query, generate_response]

Tugas: "Apa produk terlaris minggu lalu?"
Rencana: [fetch_top_products, generate_query, generate_response]

Tugas: {USER INPUT}
Rencana:
```

Ada dua hal yang perlu diperhatikan tentang contoh ini:

- Format rencana yang digunakan di sini—daftar fungsi yang parameternya disimpulkan oleh agen—hanya salah satu dari banyak cara untuk menyusun kontrol alur agen.
- Fungsi generate_query mengambil riwayat tugas saat ini dan output tool terbaru untuk menghasilkan kueri yang akan dimasukkan ke generator respons. Output tool di setiap langkah ditambahkan ke riwayat tugas.

Diberikan input pengguna "Berapa harga produk terlaris minggu lalu", rencana yang dihasilkan mungkin terlihat seperti ini:

1. get_time()
2. fetch_top_products()
3. fetch_product_info()
4. generate_query()
5. generate_response()

Anda mungkin bertanya-tanya, "Bagaimana dengan parameter yang diperlukan untuk setiap fungsi?" Parameter yang tepat sulit diprediksi sebelumnya karena mereka sering diekstrak dari output tool sebelumnya. Jika langkah pertama, get_time(), mengeluarkan "2030-09-13", maka agen bisa bernalar bahwa parameter untuk langkah berikutnya harus dipanggil dengan parameter berikut:

```
retrieve_top_products(
    start_date="2030-09-07",
    end_date="2030-09-13",
    num_products=1
)
```

Sering kali, informasi tidak cukup untuk menentukan nilai parameter yang tepat untuk fungsi. Misalnya, jika pengguna bertanya, "Berapa harga rata-rata produk terlaris?", jawaban untuk pertanyaan berikut tidak jelas:

- Berapa banyak produk terlaris yang ingin dilihat pengguna?
- Apakah pengguna ingin produk terlaris minggu lalu, bulan lalu, atau sepanjang masa?

Ini berarti bahwa model sering harus menebak, dan tebakan bisa salah.

Karena baik urutan tindakan maupun parameter terkait dihasilkan oleh model AI, mereka bisa dihalusinasi. Halusinasi bisa menyebabkan model memanggil fungsi yang tidak valid atau memanggil fungsi yang valid tetapi dengan parameter yang salah. Teknik untuk meningkatkan performa model secara umum bisa digunakan untuk meningkatkan kemampuan perencanaan model.

Berikut beberapa pendekatan untuk membuat agen lebih baik dalam merencanakan:

- Menulis system prompt yang lebih baik dengan lebih banyak contoh.
- Memberikan deskripsi alat dan parameter yang lebih baik sehingga model memahaminya dengan lebih baik.
- Menulis ulang fungsi itu sendiri untuk membuatnya lebih sederhana, seperti memfaktorkan fungsi kompleks menjadi dua fungsi yang lebih sederhana.
- Menggunakan model yang lebih kuat. Secara umum, model yang lebih kuat lebih baik dalam merencanakan.
- Men-finetune model untuk generasi rencana.

**Function calling.** Banyak penyedia model menawarkan penggunaan tool untuk model mereka, secara efektif mengubah model mereka menjadi agen. Alat adalah fungsi. Memanggil alat, oleh karena itu, sering disebut function calling. API model berbeda bekerja berbeda, tetapi secara umum, function calling bekerja sebagai berikut:

1. **Buat inventaris alat.** Deklarasikan semua alat yang mungkin ingin Anda gunakan model. Setiap alat dijelaskan oleh titik masuk eksekusinya (misalnya, nama fungsinya), parameternya, dan dokumentasinya (misalnya, apa yang dilakukan fungsi dan parameter apa yang diperlukan).
2. **Tentukan alat apa yang bisa digunakan agen.** Karena kueri berbeda mungkin memerlukan alat berbeda, banyak API memungkinkan Anda menentukan daftar alat yang dideklarasikan untuk digunakan per kueri. Beberapa memungkinkan Anda mengontrol penggunaan tool lebih lanjut dengan pengaturan berikut:
   - **required:** Model harus menggunakan setidaknya satu alat.
   - **none:** Model tidak boleh menggunakan alat apa pun.
   - **auto:** Model memutuskan alat mana yang akan digunakan.

Function calling diilustrasikan pada Gambar 6-10. Ini ditulis dalam pseudocode untuk membuatnya representatif dari beberapa API. Untuk menggunakan API spesifik, silakan lihat dokumentasinya.

Gambar 6-10. Contoh model menggunakan dua alat sederhana.

Diberikan kueri, agen yang didefinisikan seperti pada Gambar 6-10 akan secara otomatis menghasilkan alat apa yang akan digunakan dan parameternya. Beberapa API function calling akan memastikan bahwa hanya fungsi valid yang dihasilkan, meskipun mereka tidak bisa menjamin nilai parameter yang benar.

Misalnya, diberikan kueri pengguna "Berapa kilogram 40 pon?", agen mungkin memutuskan bahwa ini memerlukan alat lbs_to_kg_tool dengan satu nilai parameter 40. Respons agen mungkin terlihat seperti ini:

```
response = ModelResponse(
   finish_reason='tool_calls',
   message=chat.Message(
       content=None,
       role='assistant',
       tool_calls=[
           ToolCall(
               function=Function(
                   arguments='{"lbs":40}',
                   name='lbs_to_kg'),
               type='function')
       ])
)
```

Dari respons ini, Anda bisa memanggil fungsi lbs_to_kg(lbs=40) dan menggunakan outputnya untuk menghasilkan respons kepada pengguna.

Saat bekerja dengan agen, selalu minta sistem untuk melaporkan nilai parameter apa yang digunakan untuk setiap panggilan fungsi. Periksa nilai-nilai ini untuk memastikan mereka benar.

**Granularitas perencanaan.** Rencana adalah peta jalan yang menguraikan langkah-langkah yang diperlukan untuk menyelesaikan tugas. Peta jalan bisa memiliki tingkat granularitas berbeda. Untuk merencanakan satu tahun, rencana per kuartal lebih tingkat tinggi daripada rencana per bulan, yang pada gilirannya lebih tingkat tinggi daripada rencana per minggu.

Ada trade-off perencanaan/eksekusi. Rencana yang detail lebih sulit dihasilkan tetapi lebih mudah dieksekusi. Rencana tingkat tinggi lebih mudah dihasilkan tetapi lebih sulit dieksekusi. Pendekatan untuk menghindari trade-off ini adalah merencanakan secara hierarkis. Pertama, gunakan perencana untuk menghasilkan rencana tingkat tinggi, seperti rencana per kuartal. Kemudian, untuk setiap kuartal, gunakan perencana yang sama atau berbeda untuk menghasilkan rencana per bulan.

Sejauh ini, semua contoh rencana yang dihasilkan menggunakan nama fungsi yang tepat, yang sangat granular. Masalah dengan pendekatan ini adalah bahwa inventaris alat agen bisa berubah dari waktu ke waktu. Misalnya, fungsi untuk mendapatkan tanggal saat ini get_time() bisa diganti nama menjadi get_current_time(). Saat alat berubah, Anda perlu memperbarui prompt dan semua contoh Anda. Menggunakan nama fungsi yang tepat juga membuatnya lebih sulit untuk menggunakan ulang perencana di kasus penggunaan berbeda dengan API alat berbeda.

Jika Anda sebelumnya men-finetune model untuk menghasilkan rencana berdasarkan inventaris alat lama, Anda perlu men-finetune model lagi pada inventaris alat baru.

Untuk menghindari masalah ini, rencana juga bisa dihasilkan menggunakan bahasa yang lebih alami, yang lebih tingkat tinggi daripada nama fungsi spesifik domain. Misalnya, diberikan kueri "Berapa harga produk terlaris minggu lalu", agen bisa diinstruksikan untuk menghasilkan rencana yang terlihat seperti ini:

1. dapatkan tanggal saat ini
2. ambil produk terlaris minggu lalu
3. ambil informasi produk
4. hasilkan kueri
5. hasilkan respons

Menggunakan bahasa yang lebih alami membantu generator rencana Anda menjadi tangguh terhadap perubahan dalam API alat. Jika model Anda sebagian besar dilatih pada bahasa alami, ini kemungkinan lebih baik dalam memahami dan menghasilkan rencana dalam bahasa alami dan kurang mungkin berhalusinasi.

Kelemahan dari pendekatan ini adalah Anda memerlukan penerjemah untuk menerjemahkan setiap tindakan bahasa alami ke perintah yang bisa dieksekusi. Chameleon (Lu et al., 2023) menyebut penerjemah ini program generator. Namun, menerjemahkan adalah tugas yang jauh lebih sederhana daripada merencanakan dan bisa dilakukan oleh model yang lebih lemah dengan risiko halusinasi yang lebih rendah.

**Rencana kompleks.** Contoh rencana sejauh ini bersifat berurutan: tindakan berikutnya dalam rencana selalu dieksekusi setelah tindakan sebelumnya selesai. Urutan di mana tindakan bisa dieksekusi disebut control flow. Bentuk berurutan hanyalah satu jenis control flow. Jenis control flow lain termasuk paralel, pernyataan if, dan loop for. Daftar berikut memberikan gambaran umum tentang setiap control flow, termasuk berurutan untuk perbandingan:

- **Berurutan:** Menjalankan tugas B setelah tugas A selesai, kemungkinan karena tugas B bergantung pada tugas A. Misalnya, kueri SQL bisa dieksekusi hanya setelah diterjemahkan dari input bahasa alami.
- **Paralel:** Menjalankan tugas A dan B secara bersamaan. Misalnya, diberikan kueri "Temukan produk terlaris di bawah $100", agen mungkin pertama-tama mengambil 100 produk terlaris teratas dan, untuk masing-masing produk ini, mengambil harganya.
- **Pernyataan if:** Menjalankan tugas B atau tugas C tergantung pada output dari langkah sebelumnya. Misalnya, agen pertama-tama memeriksa laporan pendapatan NVIDIA. Berdasarkan laporan ini, agen kemudian bisa memutuskan untuk menjual atau membeli saham NVIDIA.
- **Loop for:** Ulangi menjalankan tugas A sampai kondisi spesifik terpenuhi. Misalnya, terus menghasilkan angka acak sampai bilangan prima.

Control flow berbeda ini divisualisasikan pada Gambar 6-11.

Gambar 6-11. Contoh urutan berbeda di mana rencana bisa dieksekusi.

Dalam rekayasa perangkat lunak tradisional, kondisi untuk control flow bersifat eksak. Dengan agen bertenaga AI, model AI menentukan control flow. Rencana dengan control flow non-berurutan lebih sulit baik dihasilkan maupun diterjemahkan ke perintah yang bisa dieksekusi.

Saat mengevaluasi framework agen, periksa control flow apa yang didukungnya. Misalnya, jika sistem perlu menelusuri sepuluh situs web, bisakah ini dilakukan secara bersamaan? Eksekusi paralel bisa secara signifikan mengurangi latensi yang dirasakan pengguna.

#### Refleksi dan Koreksi Kesalahan

Bahkan rencana terbaik perlu terus-menerus dievaluasi dan disesuaikan untuk memaksimalkan peluang keberhasilan mereka. Meskipun refleksi tidak sepenuhnya diperlukan untuk agen beroperasi, refleksi diperlukan untuk agen berhasil.

Refleksi bisa berguna di banyak tempat selama proses tugas:

- Setelah menerima kueri pengguna untuk mengevaluasi apakah permintaan layak.
- Setelah generasi rencana awal untuk mengevaluasi apakah rencana masuk akal.
- Setelah setiap langkah eksekusi untuk mengevaluasi apakah berada di jalur yang benar.
- Setelah seluruh rencana dieksekusi untuk menentukan apakah tugas telah selesai.

Refleksi dan koreksi kesalahan adalah dua mekanisme berbeda yang berjalan beriringan. Refleksi menghasilkan wawasan yang membantu mengungkap kesalahan yang akan dikoreksi. Ini mengingatkan saya tentang metode agen actor-critic (AC) (Konda dan Tsitsiklis, 1999) dalam reinforcement learning.

Refleksi bisa dilakukan dengan agen yang sama menggunakan prompt self-critique. Ini juga bisa dilakukan dengan komponen terpisah, seperti scorer terspesialisasi: model yang mengeluarkan skor konkret untuk setiap hasil.

Pertama diusulkan oleh ReAct (Yao et al., 2022), interleaving reasoning dan action telah menjadi pola umum untuk agen. Yao et al. menggunakan istilah "reasoning" untuk mencakup baik perencanaan maupun refleksi. Di setiap langkah, agen diminta untuk menjelaskan pemikirannya (perencanaan), mengambil tindakan, kemudian menganalisis observasi (refleksi), sampai tugas dianggap selesai oleh agen. Agen biasanya diprompt, menggunakan contoh, untuk menghasilkan output dalam format berikut:

```
Thought 1: ...
Act 1: ...
Observation 1: ...
... [lanjutkan sampai refleksi menentukan bahwa tugas selesai] ...
Thought N: ...
Act N: Finish [Respons terhadap kueri]
```

Gambar 6-12 menunjukkan contoh agen mengikuti framework ReAct merespons pertanyaan dari HotpotQA (Yang et al., 2018), benchmark untuk pertanyaan jawaban multi-hop.

Gambar 6-12. Agen ReAct dalam aksi. Gambar dari makalah ReAct (Yao et al., 2022). Gambar ini dilisensikan di bawah CC BY 4.0.

Anda bisa mengimplementasikan refleksi dalam pengaturan multi-agen: satu agen merencanakan dan mengambil tindakan, dan agen lain mengevaluasi hasil setelah setiap langkah atau setelah beberapa langkah.

Jika respons agen gagal menyelesaikan tugas, Anda bisa memprompt agen untuk merefleksikan mengapa gagal dan cara meningkatkan. Berdasarkan saran ini, agen menghasilkan rencana baru. Ini memungkinkan agen belajar dari kesalahan mereka. Misalnya, diberikan tugas generasi coding, evaluator mungkin mengevaluasi bahwa kode yang dihasilkan gagal pada ⅓ kasus uji. Agen kemudian merefleksikan alasan gagal adalah karena tidak memperhitungkan array di mana semua angka negatif. Aktor kemudian menghasilkan kode baru, memperhitungkan semua array negatif.

Ini adalah pendekatan yang diambil Reflexion (Shinn et al., 2023). Dalam framework ini, refleksi dipisahkan menjadi dua modul: evaluator yang mengevaluasi hasil dan modul self-reflection yang menganalisis apa yang salah. Gambar 6-13 menunjukkan contoh agen Reflexion dalam aksi. Penulis menggunakan istilah "trajectory" untuk merujuk pada rencana. Di setiap langkah, setelah evaluasi dan self-reflection, agen mengusulkan trajectory baru.

Gambar 6-13. Contoh cara kerja agen Reflexion. Gambar dari repositori GitHub Reflexion.

Dibandingkan dengan generasi rencana, refleksi relatif mudah diimplementasikan dan bisa membawa peningkatan performa yang mengejutkan. Kelemahan dari pendekatan ini adalah latensi dan biaya. Pikiran, observasi, dan kadang-kadang tindakan bisa memerlukan banyak token untuk dihasilkan, yang meningkatkan biaya dan latensi yang dirasakan pengguna, terutama untuk tugas dengan banyak langkah antara. Untuk mendorong agen mereka mengikuti format, penulis ReAct dan Reflexion menggunakan banyak contoh dalam prompt mereka. Ini meningkatkan biaya menghitung token input dan mengurangi ruang konteks yang tersedia untuk informasi lain.

#### Seleksi Alat

Karena alat sering memainkan peran penting dalam keberhasilan tugas, seleksi alat memerlukan pertimbangan yang hati-hati. Alat yang diberikan ke agen Anda tergantung pada lingkungan dan tugas, tetapi mereka juga tergantung pada model AI yang mendukung agen.

Tidak ada panduan yang sempurna tentang cara memilih set alat terbaik. Literatur agen terdiri dari berbagai inventaris alat. Misalnya, Toolformer (Schick et al., 2023) men-finetune GPT-J untuk mempelajari lima alat. Chameleon (Lu et al., 2023) menggunakan 13 alat. Di sisi lain, Gorilla (Patil et al., 2023) mencoba memprompt agen untuk memilih panggilan API yang tepat di antara 1.645 API.

Lebih banyak alat memberi agen lebih banyak kemampuan. Namun, semakin banyak alat, semakin sulit untuk secara efisien menggunakannya. Ini mirip dengan bagaimana lebih sulit bagi manusia untuk menguasai set alat yang besar. Menambahkan alat juga berarti meningkatkan deskripsi alat, yang mungkin tidak muat ke dalam konteks model.

Seperti banyak keputusan lain saat membangun aplikasi AI, seleksi alat memerlukan eksperimen dan analisis. Berikut beberapa hal yang bisa Anda lakukan untuk membantu Anda memutuskan:

- Bandingkan bagaimana agen berperforma dengan set alat berbeda.
- Lakukan studi ablasi untuk melihat seberapa banyak performa agen turun jika alat dihapus dari inventarisnya. Jika alat bisa dihapus tanpa penurunan performa, hapus.
- Cari alat yang agen sering membuat kesalahan. Jika alat terbukti terlalu sulit untuk digunakan agen—misalnya, prompting ekstensif dan bahkan fine-tuning tidak bisa membuat model belajar menggunakannya—ganti alat.
- Plot distribusi panggilan alat untuk melihat alat apa yang paling sering digunakan dan alat apa yang paling jarang digunakan. Gambar 6-14 menunjukkan perbedaan pola penggunaan alat GPT-4 dan ChatGPT dalam Chameleon (Lu et al., 2023).

Gambar 6-14. Model dan tugas berbeda mengekspresikan pola penggunaan alat berbeda. Gambar dari Lu et al. (2023). Diadaptasi dari gambar asli yang dilisensikan di bawah CC BY 4.0.

Eksperimen oleh Lu et al. (2023) juga mendemonstrasikan dua poin:

1. Tugas berbeda memerlukan alat berbeda. ScienceQA, tugas pertanyaan jawaban sains, jauh lebih bergantung pada alat retrieval pengetahuan daripada TabMWP, tugas penyelesaian masalah matematika tabular.
2. Model berbeda memiliki preferensi alat berbeda. Misalnya, GPT-4 sepertinya memilih set alat yang lebih luas daripada ChatGPT. ChatGPT sepertinya menyukai captioning gambar, sedangkan GPT-4 sepertinya menyukai retrieval pengetahuan.

Saat mengevaluasi framework agen, evaluasi perencana dan alat apa yang didukungnya. Framework berbeda mungkin berfokus pada kategori alat berbeda. Misalnya, AutoGPT berfokus pada API media sosial (Reddit, X, dan Wikipedia), sedangkan Composio berfokus pada API enterprise (Google Apps, GitHub, dan Slack).

Seiring kebutuhan Anda kemungkinan berubah dari waktu ke waktu, evaluasi seberapa mudah untuk memperluas agen Anda untuk menggabungkan alat baru.

Sebagai manusia, kita menjadi lebih produktif tidak hanya dengan menggunakan alat yang diberikan kepada kita, tetapi juga dengan membuat alat yang semakin kuat dari alat yang lebih sederhana. Bisakah AI membuat alat baru dari alat awalnya?

Chameleon (Lu et al., 2023) mengusulkan studi tentang tool transition: setelah alat X, seberapa besar kemungkinan agen memanggil alat Y? Gambar 6-15 menunjukkan contoh tool transition. Jika dua alat sering digunakan bersama, mereka bisa digabungkan menjadi alat yang lebih besar. Jika agen menyadari informasi ini, agen itu sendiri bisa menggabungkan alat awal untuk terus-menerus membangun alat yang lebih kompleks.

Gambar 6-15. Pohon tool transition oleh Lu et al. (2023). Diadaptasi dari gambar asli yang dilisensikan di bawah CC BY 4.0.

Voyager (Wang et al., 2023) mengusulkan skill manager untuk melacak skill (alat) baru yang diperoleh agen untuk penggunaan ulang nanti. Setiap skill adalah program coding. Saat skill manager menentukan skill yang baru dibuat akan berguna (misalnya, karena berhasil membantu agen menyelesaikan tugas), skill ini ditambahkan ke perpustakaan skill (secara konseptual mirip dengan inventaris alat). Skill ini bisa diambil nanti untuk digunakan untuk tugas lain.

Sebelumnya di bagian ini, kita menyebutkan bahwa keberhasilan agen dalam lingkungan tergantung pada inventaris alat dan kemampuan perencanaannya. Kegagalan dalam salah satu aspek bisa menyebabkan agen gagal. Bagian berikutnya akan membahas mode kegagalan berbeda dari agen dan cara mengevaluasinya.

### Mode Kegagalan dan Evaluasi Agen

Evaluasi adalah tentang mendeteksi kegagalan. Semakin kompleks tugas yang dilakukan agen, semakin banyak titik kegagalan yang mungkin. Selain mode kegagalan yang umum untuk semua aplikasi AI yang dibahas di Bab 3 dan 4, agen juga memiliki kegagalan unik yang disebabkan oleh perencanaan, eksekusi alat, dan efisiensi. Beberapa kegagalan lebih mudah ditangkap daripada yang lain.

Untuk mengevaluasi agen, identifikasi mode kegagalannya dan ukur seberapa sering setiap mode kegagalan ini terjadi.

Saya membuat benchmark sederhana untuk mengilustrasikan mode kegagalan berbeda ini yang bisa Anda lihat di repositori GitHub buku. Ada juga benchmark dan leaderboard agen seperti Berkeley Function Calling Leaderboard, evaluation harness AgentOps, dan benchmark TravelPlanner.

#### Kegagalan Perencanaan

Perencanaan sulit dan bisa gagal dalam banyak cara. Mode kegagalan perencanaan paling umum adalah kegagalan penggunaan alat. Agen mungkin menghasilkan rencana dengan satu atau lebih kesalahan ini:

- **Alat tidak valid:** Misalnya, menghasilkan rencana yang berisi bing_search, tetapi bing_search tidak ada dalam inventaris alat agen.
- **Alat valid, parameter tidak valid:** Misalnya, memanggil lbs_to_kg dengan dua parameter. lbs_to_kg ada dalam inventaris alat tetapi hanya memerlukan satu parameter, lbs.
- **Alat valid, nilai parameter salah:** Misalnya, memanggil lbs_to_kg dengan satu parameter, lbs, tetapi menggunakan nilai 100 untuk lbs padahal seharusnya 120.

Mode kegagalan perencanaan lain adalah kegagalan tujuan: agen gagal mencapai tujuan. Ini bisa karena rencana tidak menyelesaikan tugas, atau menyelesaikan tugas tanpa mengikuti batasan. Untuk mengilustrasikan ini, bayangkan Anda meminta model untuk merencanakan perjalanan dua minggu dari San Francisco ke Hanoi dengan anggaran $5.000. Agen mungkin merencanakan perjalanan dari San Francisco ke Ho Chi Minh City, atau merencanakan perjalanan dua minggu dari San Francisco ke Hanoi yang akan jauh melebihi anggaran.

Batasan umum yang sering diabaikan oleh evaluasi agen adalah waktu. Dalam banyak kasus, waktu yang dibutuhkan agen kurang penting, karena Anda bisa menugaskan tugas ke agen dan hanya perlu memeriksa saat selesai. Namun, dalam banyak kasus, agen menjadi kurang berguna seiring waktu. Misalnya, jika Anda meminta agen untuk menyiapkan proposal hibah dan agen menyelesaikannya setelah batas waktu hibah, agen tidak terlalu membantu.

Mode kegagalan perencanaan yang menarik disebabkan oleh kesalahan dalam refleksi. Agen yakin bahwa telah menyelesaikan tugas padahal belum. Misalnya, Anda meminta agen untuk menugaskan 50 orang ke 30 kamar hotel. Agen mungkin hanya menugaskan 40 orang dan bersikeras bahwa tugas telah selesai.

Untuk mengevaluasi agen untuk kegagalan perencanaan, satu opsi adalah membuat dataset perencanaan di mana setiap contoh adalah tuple (tugas, inventaris alat). Untuk setiap tugas, gunakan agen untuk menghasilkan K jumlah rencana. Hitung metrik berikut:

1. Dari semua rencana yang dihasilkan, berapa banyak yang valid?
2. Untuk tugas tertentu, berapa banyak rencana yang harus dihasilkan agen, rata-rata, untuk mendapatkan rencana yang valid?
3. Dari semua panggilan alat, berapa banyak yang valid?
4. Seberapa sering alat tidak valid dipanggil?
5. Seberapa sering alat valid dipanggil dengan parameter tidak valid?
6. Seberapa sering alat valid dipanggil dengan nilai parameter yang salah?

Analisis output agen untuk pola. Jenis tugas apa yang lebih sering gagal oleh agen? Apakah Anda memiliki hipotesis mengapa? Alat apa yang sering membuat kesalahan model? Beberapa alat mungkin lebih sulit untuk digunakan agen. Anda bisa meningkatkan kemampuan agen untuk menggunakan alat yang menantang dengan prompting yang lebih baik, lebih banyak contoh, atau fine-tuning. Jika semua gagal, Anda mungkin mempertimbangkan menukar alat ini dengan sesuatu yang lebih mudah digunakan.

#### Kegagalan Alat

Kegagalan alat terjadi saat alat yang benar digunakan, tetapi output alat salah. Satu mode kegagalan adalah saat alat hanya memberikan output yang salah. Misalnya, captioner gambar mengembalikan deskripsi yang salah, atau generator kueri SQL mengembalikan kueri SQL yang salah.

Jika agen hanya menghasilkan rencana tingkat tinggi dan modul penerjemah terlibat dalam menerjemahkan dari setiap tindakan yang direncanakan ke perintah yang bisa dieksekusi, kegagalan bisa terjadi karena kesalahan terjemahan.

Kegagalan alat juga bisa terjadi karena agen tidak memiliki akses ke alat yang tepat untuk tugas. Contoh yang jelas adalah saat tugas melibatkan mengambil harga saham saat ini dari internet, dan agen tidak memiliki akses ke internet.

Kegagalan alat bergantung pada alat. Setiap alat perlu diuji secara independen. Selalu cetak setiap panggilan alat dan outputnya sehingga Anda bisa memeriksa dan mengevaluasinya. Jika Anda memiliki penerjemah, buat benchmark untuk mengevaluasinya.

Mendeteksi kegagalan alat yang hilang memerlukan pemahaman tentang alat apa yang seharusnya digunakan. Jika agen Anda sering gagal pada domain spesifik, ini mungkin karena kekurangan alat untuk domain ini. Bekerja dengan ahli domain manusia dan amati alat apa yang akan mereka gunakan.

#### Efisiensi

Agen mungkin menghasilkan rencana valid menggunakan alat yang tepat untuk menyelesaikan tugas, tetapi mungkin tidak efisien. Berikut beberapa hal yang mungkin ingin Anda lacak untuk mengevaluasi efisiensi agen:

- Berapa banyak langkah yang diperlukan agen, rata-rata, untuk menyelesaikan tugas?
- Berapa biaya agen, rata-rata, untuk menyelesaikan tugas?
- Berapa lama setiap tindakan biasanya memakan waktu? Apakah ada tindakan yang terutama memakan waktu atau mahal?

Anda bisa membandingkan metrik ini dengan baseline Anda, yang bisa berupa agen lain atau operator manusia. Saat membandingkan agen AI dengan agen manusia, perlu diingat bahwa manusia dan AI memiliki mode operasi yang sangat berbeda, jadi apa yang dianggap efisien untuk manusia mungkin tidak efisien untuk AI, dan sebaliknya. Misalnya, mengunjungi 100 halaman web mungkin tidak efisien untuk agen manusia yang bisa mengunjungi hanya satu halaman pada satu waktu, tetapi sepele untuk agen AI yang bisa mengunjungi semua halaman web sekaligus.

## Memori

Memori merujuk pada mekanisme yang memungkinkan model mempertahankan dan memanfaatkan informasi. Sistem memori terutama berguna untuk aplikasi kaya pengetahuan seperti RAG dan aplikasi multi-langkah seperti agen. Sistem RAG mengandalkan memori untuk konteks yang diaugmentasi, yang bisa tumbuh selama beberapa giliran saat mengambil lebih banyak informasi. Sistem agentic memerlukan memori untuk menyimpan instruksi, contoh, konteks, inventaris alat, rencana, output alat, refleksi, dan lainnya. Meskipun RAG dan agen menempatkan tuntutan lebih besar pada memori, ini bermanfaat untuk aplikasi AI apa pun yang memerlukan mempertahankan informasi.

Model AI biasanya memiliki tiga mekanisme memori utama:

**Pengetahuan internal.** Model itu sendiri adalah mekanisme memori, karena mempertahankan pengetahuan dari data yang dilatih. Pengetahuan ini adalah pengetahuan internalnya. Pengetahuan internal model tidak berubah kecuali model itu sendiri diperbarui. Model bisa mengakses pengetahuan ini dalam semua kueri.

**Memori jangka pendek.** Konteks model adalah mekanisme memori. Pesan sebelumnya dalam percakapan bisa ditambahkan ke konteks model, memungkinkan model memanfaatkannya untuk menghasilkan respons masa depan. Konteks model bisa dianggap sebagai memori jangka pendek karena tidak bertahan di seluruh tugas (kueri). Ini cepat diakses, tetapi kapasitasnya terbatas. Oleh karena itu, ini sering digunakan untuk menyimpan informasi yang paling penting untuk tugas saat ini.

**Memori jangka panjang.** Sumber data eksternal yang bisa diakses model melalui retrieval, seperti dalam sistem RAG, adalah mekanisme memori. Ini bisa dianggap sebagai memori jangka panjang model, karena bisa bertahan di seluruh tugas. Tidak seperti pengetahuan internal model, informasi dalam memori jangka panjang bisa dihapus tanpa memperbarui model.

Manusia memiliki akses ke mekanisme memori serupa. Cara bernapas adalah pengetahuan internal Anda. Anda biasanya tidak lupa cara bernapas kecuali Anda dalam masalah serius. Memori jangka pendek Anda berisi informasi yang segera relevan dengan apa yang Anda lakukan, seperti nama orang yang baru Anda temui. Memori jangka panjang Anda diaugmentasi dengan buku, komputer, catatan, dll.

Mekanisme memori mana yang akan digunakan untuk data Anda tergantung pada frekuensi penggunaannya. Informasi yang penting untuk semua tugas harus digabungkan ke dalam pengetahuan internal model melalui training atau fine-tuning. Informasi yang jarang diperlukan harus berada dalam memori jangka panjangnya. Memori jangka pendek dicadangkan untuk informasi spesifik konteks yang segera. Ketiga mekanisme memori ini diilustrasikan pada Gambar 6-16.

Gambar 6-16. Tiga mekanisme memori: pengetahuan internal, memori jangka pendek, dan memori jangka panjang.

Dalam bab ini, kita telah membahas secara rinci cara kerja sistem RAG dan agen. Kedua pola sering berurusan dengan informasi yang melebihi batas konteks model. Sistem memori yang melengkapi konteks model dalam menangani informasi bisa secara signifikan meningkatkan kemampuannya.

## Ringkasan

Bab ini dimulai dengan RAG, pola yang pertama muncul. Banyak tugas memerlukan pengetahuan latar belakang yang luas yang sering melebihi jendela konteks model. Awalnya dikembangkan untuk mengatasi keterbatasan konteks model, RAG juga memungkinkan penggunaan informasi yang lebih efisien, meningkatkan kualitas respons sambil mengurangi biaya.

RAG menggunakan proses dua langkah: pertama mengambil informasi relevan dari memori eksternal, kemudian menggunakan informasi ini untuk menghasilkan respons yang lebih akurat. Retriever berbasis term seperti Elasticsearch dan BM25 lebih ringan dan memberikan baseline yang kuat. Retriever berbasis embedding lebih intensif komputasi tetapi berpotensi mengungguli algoritma berbasis term.

Pola RAG bisa dilihat sebagai kasus khusus dari agen di mana retriever adalah alat yang bisa digunakan model. Agen didefinisikan oleh lingkungannya dan alat yang bisa diaksesnya. Dalam agen berbasis AI, AI adalah perencana yang menganalisis tugas, mempertimbangkan solusi berbeda, dan memilih yang paling menjanjikan.

Baik RAG maupun agen bekerja dengan banyak informasi, yang sering melebihi panjang konteks maksimum model. Ini memerlukan sistem memori untuk mengelola dan menggunakan semua informasi yang dimiliki model.

RAG dan agen adalah metode berbasis prompt—mereka memengaruhi kualitas model hanya melalui input tanpa memodifikasi model itu sendiri. Memodifikasi model yang mendasarinya bisa membuka lebih banyak kemungkinan, yang akan menjadi topik bab berikutnya.
