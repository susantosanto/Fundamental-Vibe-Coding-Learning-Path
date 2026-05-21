# Bab 9: Optimasi Inferensi

Model baru datang dan pergi, tetapi satu hal akan selalu relevan: membuatnya lebih baik, lebih murah, dan lebih cepat. Hingga saat ini, buku ini telah membahas berbagai teknik untuk membuat model lebih baik. Bab ini berfokus pada membuatnya lebih cepat dan lebih murah.

Tidak peduli seberapa baik model Anda, jika terlalu lambat, pengguna Anda mungkin kehilangan kesabaran, atau lebih buruk, prediksinya bisa menjadi tidak berguna—bayangkan model prediksi harga saham hari berikutnya yang membutuhkan dua hari untuk menghitung setiap hasil. Jika model Anda terlalu mahal, return on investment-nya tidak akan sepadan.

Optimasi inferensi dapat dilakukan di tingkat model, perangkat keras, dan layanan. Di tingkat model, Anda dapat mengurangi ukuran model terlatih atau mengembangkan arsitektur yang lebih efisien, seperti yang tanpa bottleneck komputasi dalam mekanisme attention yang sering digunakan dalam model transformer. Di tingkat perangkat keras, Anda dapat merancang perangkat keras yang lebih kuat.

Layanan inferensi menjalankan model pada perangkat keras yang diberikan untuk mengakomodasi permintaan pengguna. Layanan ini dapat menggabungkan teknik yang mengoptimalkan model untuk perangkat keras tertentu. Layanan ini juga perlu mempertimbangkan pola penggunaan dan lalu lintas untuk mengalokasikan sumber daya secara efisien guna mengurangi latensi dan biaya.

Karena itu, optimasi inferensi adalah bidang interdisipliner yang sering melihat kolaborasi antara peneliti model, pengembang aplikasi, insinyur sistem, desainer compiler, arsitek perangkat keras, dan bahkan operator pusat data.

Bab ini membahas bottleneck untuk inferensi AI dan teknik untuk mengatasinya. Bab ini akan berfokus sebagian besar pada optimasi di tingkat model dan layanan, dengan gambaran umum tentang akselerator AI.

Bab ini juga mencakup metrik performa dan trade-off. Terkadang, teknik yang mempercepat model juga dapat mengurangi biayanya. Misalnya, mengurangi presisi model membuatnya lebih kecil dan lebih cepat. Tetapi sering kali, optimasi memerlukan trade-off. Misalnya, perangkat keras terbaik mungkin membuat model Anda berjalan lebih cepat tetapi dengan biaya lebih tinggi.

Mengingat ketersediaan model open source yang semakin meningkat, lebih banyak tim membangun layanan inferensi mereka sendiri. Namun, bahkan jika Anda tidak mengimplementasikan teknik optimasi inferensi ini, memahami teknik ini akan membantu Anda mengevaluasi layanan dan framework inferensi. Jika latensi dan biaya aplikasi Anda menyakitkan Anda, lanjutkan membaca. Bab ini mungkin membantu Anda mendiagnosis penyebab dan solusi potensial.

## Memahami Optimasi Inferensi

Ada dua fase berbeda dalam siklus hidup model AI: pelatihan dan inferensi. Pelatihan merujuk pada proses membangun model. Inferensi merujuk pada proses menggunakan model untuk menghitung output untuk input yang diberikan.1 Kecuali Anda melatih atau melakukan fine-tuning pada model, Anda sebagian besar hanya perlu peduli tentang inferensi.2

Bagian ini dimulai dengan gambaran umum tentang inferensi yang memperkenalkan kosakata bersama untuk membahas sisa bab ini. Jika Anda sudah familiar dengan konsep-konsep ini, silakan langsung ke bagian yang diminati.

### Gambaran Umum Inferensi

Dalam produksi, komponen yang menjalankan inferensi model disebut server inferensi. Server ini meng-host model yang tersedia dan memiliki akses ke perangkat keras yang diperlukan. Berdasarkan permintaan dari aplikasi (misalnya, prompt pengguna), server ini mengalokasikan sumber daya untuk mengeksekusi model yang sesuai dan mengembalikan respons kepada pengguna. Server inferensi adalah bagian dari layanan inferensi yang lebih luas, yang juga bertanggung jawab untuk menerima, merutekan, dan mungkin memproses awal permintaan sebelum mencapai server inferensi. Visualisasi layanan inferensi sederhana ditunjukkan pada Gambar 9-1.

**Gambar 9-1.** Layanan inferensi sederhana.

API model seperti yang disediakan oleh OpenAI dan Google adalah layanan inferensi. Jika Anda menggunakan salah satu layanan ini, Anda tidak akan mengimplementasikan sebagian besar teknik yang dibahas dalam bab ini. Namun, jika Anda meng-host model sendiri, Anda akan bertanggung jawab untuk membangun, mengoptimalkan, dan memelihara layanan inferensinya.

### Bottleneck Komputasi

Optimasi adalah tentang mengidentifikasi bottleneck dan mengatasinya. Misalnya, untuk mengoptimalkan lalu lintas, perencana kota mungkin mengidentifikasi titik kemacetan dan mengambil langkah untuk mengurangi kemacetan. Demikian pula, server inferensi harus dirancang untuk mengatasi bottleneck komputasi dari beban kerja inferensi yang dilayaninya. Ada dua bottleneck komputasi utama, compute-bound dan memory bandwidth-bound:

**Compute-bound**
Ini merujuk pada tugas yang waktu penyelesaiannya ditentukan oleh komputasi yang diperlukan untuk tugas tersebut. Misalnya, dekripsi password biasanya compute-bound karena perhitungan matematika intensif yang diperlukan untuk memecahkan algoritma enkripsi.

**Memory bandwidth-bound**
Tugas-tugas ini dibatasi oleh kecepatan transfer data dalam sistem, seperti kecepatan perpindahan data antara memori dan prosesor. Misalnya, jika Anda menyimpan data di memori CPU dan melatih model di GPU, Anda harus memindahkan data dari CPU ke GPU, yang dapat memakan waktu lama. Ini dapat disingkat menjadi bandwidth-bound. Dalam literatur, memory bandwidth-bound sering disebut sebagai memory-bound.

#### Ambiguitas Terminologi: Memory-Bound vs Bandwidth-Bound

Memory-bound juga digunakan oleh beberapa orang untuk merujuk pada tugas yang waktu penyelesaiannya dibatasi oleh kapasitas memori alih-alih bandwidth memori. Ini terjadi ketika perangkat keras Anda tidak memiliki memori yang cukup untuk menangani tugas, misalnya, jika mesin Anda tidak memiliki memori yang cukup untuk menyimpan seluruh internet. Memori ini sering termanifestasi dalam kesalahan yang dapat dikenali oleh insinyur di mana-mana: OOM, out-of-memory.3

Namun, situasi ini sering dapat dikurangi dengan membagi tugas Anda menjadi bagian-bagian yang lebih kecil. Misalnya, jika Anda dibatasi oleh memori GPU dan tidak dapat memuat seluruh model ke GPU, Anda dapat membagi model di memori GPU dan memori CPU. Pembagian ini akan memperlambat komputasi Anda karena waktu yang diperlukan untuk mentransfer data antara CPU dan GPU. Namun, jika transfer data cukup cepat, ini menjadi kurang menjadi masalah. Oleh karena itu, batasan kapasitas memori sebenarnya lebih tentang bandwidth memori.

Konsep compute-bound atau memory bandwidth-bound diperkenalkan dalam makalah "Roofline" (Williams et al., 2009).4 Secara matematis, suatu operasi dapat diklasifikasikan sebagai compute-bound atau memory bandwidth-bound berdasarkan intensitas aritmatiknya, yang merupakan jumlah operasi aritmatika per byte akses memori.

Alat profiling seperti NVIDIA Nsight akan menunjukkan kepada Anda grafik roofline untuk memberi tahu Anda apakah beban kerja Anda compute-bound atau memory bandwidth-bound, seperti yang ditunjukkan pada Gambar 9-2. Grafik ini disebut grafik roofline karena menyerupai atap. Grafik roofline umum dalam analisis performa perangkat keras.

Teknik optimasi yang berbeda bertujuan untuk mengurangi bottleneck yang berbeda. Misalnya, beban kerja compute-bound mungkin dapat dipercepat dengan menyebarkannya ke lebih banyak chip atau dengan memanfaatkan chip dengan daya komputasi lebih tinggi (misalnya, angka FLOP/s yang lebih tinggi). Beban kerja memory bandwidth-bound mungkin dapat dipercepat dengan memanfaatkan chip dengan bandwidth lebih tinggi.

**Gambar 9-2.** Grafik roofline dapat membantu Anda memvisualisasikan apakah suatu operasi compute-bound atau memory bandwidth-bound. Grafik ini dalam skala log.

Arsitektur model dan beban kerja yang berbeda menghasilkan bottleneck komputasi yang berbeda. Misalnya, inferensi untuk generator gambar seperti Stable Diffusion biasanya compute-bound, sedangkan inferensi untuk model bahasa autoregresi biasanya memory bandwidth-bound.

Sebagai ilustrasi, mari kita lihat inferensi model bahasa. Ingat dari Bab 2 bahwa inferensi untuk model bahasa berbasis transformer terdiri dari dua langkah, prefilling dan decoding:

**Prefill**
Model memproses token input secara paralel.5 Berapa banyak token yang dapat diproses sekaligus dibatasi oleh jumlah operasi yang dapat dieksekusi oleh perangkat keras Anda dalam waktu tertentu. Oleh karena itu, prefilling adalah compute-bound.

**Decode**
Model menghasilkan satu token output pada satu waktu. Secara garis besar, langkah ini biasanya melibatkan memuat matriks besar (misalnya, weight model) ke GPU, yang dibatasi oleh seberapa cepat perangkat keras Anda dapat memuat data ke memori. Decoding, oleh karena itu, memory bandwidth-bound.

Gambar 9-3 memvisualisasikan prefilling dan decoding.

**Gambar 9-3.** Model bahasa autoregresif mengikuti dua langkah untuk inferensi: prefill dan decode. <eos> menunjukkan token akhir urutan.

Karena prefill dan decode memiliki profil komputasi yang berbeda, keduanya sering dipisahkan dalam produksi dengan mesin terpisah. Teknik ini akan dibahas di "Optimasi Layanan Inferensi" pada halaman 440.

Faktor-faktor yang mempengaruhi jumlah komputasi prefilling dan decoding dalam server inferensi LLM, dan oleh karena itu bottleneck-nya, termasuk panjang konteks, panjang output, dan strategi batching permintaan. Konteks panjang biasanya menghasilkan beban kerja memory bandwidth-bound, tetapi teknik optimasi yang cerdas, seperti yang dibahas nanti di bab ini, dapat menghilangkan bottleneck ini.

Hingga saat ini, karena prevalensi arsitektur transformer dan keterbatasan teknologi akselerator yang ada, banyak beban kerja AI dan data adalah memory bandwidth-bound. Namun, kemajuan perangkat lunak dan perangkat keras di masa depan akan dapat membuat beban kerja AI dan data menjadi compute-bound.

### API Inferensi Online dan Batch

Banyak penyedia menawarkan dua jenis API inferensi, online dan batch:

- **API online** mengoptimalkan untuk latensi. Permintaan diproses segera setelah mereka tiba.
- **API batch** mengoptimalkan untuk biaya. Jika aplikasi Anda tidak memiliki persyaratan latensi yang ketat, Anda dapat mengirimkannya ke API batch untuk pemrosesan yang lebih efisien. Latensi yang lebih tinggi memungkinkan berbagai teknik optimasi yang lebih luas, termasuk batching permintaan bersama dan menggunakan perangkat keras yang lebih murah. Misalnya, hingga saat ini, baik Google Gemini maupun OpenAI menawarkan API batch dengan pengurangan biaya 50% dan waktu turnaround yang secara signifikan lebih tinggi, yaitu dalam urutan jam alih-alih detik atau menit.6

API online mungkin masih batching permintaan bersama selama itu tidak secara signifikan mempengaruhi latensi, seperti yang dibahas di "Batching" pada halaman 440. Satu-satunya perbedaan nyata adalah bahwa API online berfokus pada latensi yang lebih rendah, sedangkan API batch berfokus pada throughput yang lebih tinggi.

Kasus penggunaan yang menghadap pelanggan, seperti chatbot dan generasi kode, biasanya memerlukan latensi yang lebih rendah, dan, oleh karena itu, cenderung menggunakan API online. Kasus penggunaan dengan persyaratan latensi yang kurang ketat, yang ideal untuk API batch, termasuk:

- Generasi data sintetis
- Pelaporan berkala, seperti merangkum pesan Slack, analisis sentimen penyebutan merek di media sosial, dan menganalisis tiket dukungan pelanggan
- Onboarding pelanggan baru yang memerlukan pemrosesan semua dokumen yang diunggah
- Migrasi ke model baru yang memerlukan pemrosesan ulang semua data
- Menghasilkan rekomendasi atau newsletter yang dipersonalisasi untuk basis pelanggan yang besar
- Pembaruan basis pengetahuan dengan mengindeks ulang data organisasi

API biasanya mengembalikan respons lengkap secara default. Namun, dengan decoding autoregresif, dapat memakan waktu lama bagi model untuk menyelesaikan respons, dan pengguna tidak sabar. Banyak API online menawarkan mode streaming, yang mengembalikan setiap token saat dihasilkan. Ini mengurangi waktu yang harus ditunggu pengguna hingga token pertama. Kelemahan dari pendekatan ini adalah Anda tidak dapat memberi skor pada respons sebelum menampilkannya kepada pengguna, meningkatkan risiko pengguna melihat respons yang buruk. Namun, Anda masih dapat memperbarui atau menghapus respons secara retrospektif segera setelah risiko terdeteksi.

API batch untuk model foundation berbeda dari inferensi batch untuk ML tradisional. Dalam ML tradisional:

- Inferensi online berarti bahwa prediksi dihitung setelah permintaan tiba.
- Inferensi batch berarti bahwa prediksi dihitung sebelumnya sebelum permintaan tiba.

Prekomputasi dimungkinkan untuk kasus penggunaan dengan input yang terbatas dan dapat diprediksi seperti sistem rekomendasi, di mana rekomendasi dapat dihasilkan untuk semua pengguna sebelumnya. Prediksi yang dihitung sebelumnya ini diambil ketika permintaan tiba, misalnya, ketika pengguna mengunjungi situs web. Namun, dengan kasus penggunaan model foundation di mana inputnya terbuka, sulit untuk memprediksi semua prompt pengguna.7

### Metrik Performa Inferensi

Sebelum melompat ke optimasi, penting untuk memahami metrik apa yang harus dioptimalkan. Dari perspektif pengguna, sumbu pusat adalah latensi (kualitas respons adalah properti dari model itu sendiri, bukan dari layanan inferensi). Namun, pengembang aplikasi juga harus mempertimbangkan throughput dan utilisasi karena mereka menentukan biaya aplikasi mereka.

#### Latency, TTFT, dan TPOT

Latency mengukur waktu dari ketika pengguna mengirim query hingga mereka menerima respons lengkap. Untuk generasi autoregresif, terutama dalam mode streaming, latensi keseluruhan dapat dipecah menjadi beberapa metrik:

**Time to first token**
TTFT mengukur seberapa cepat token pertama dihasilkan setelah pengguna mengirim query. Ini sesuai dengan durasi langkah prefill dan tergantung pada panjang input. Pengguna mungkin memiliki ekspektasi yang berbeda untuk TTFT untuk aplikasi yang berbeda. Misalnya, untuk chatbot percakapan, TTFT harus instan.8 Namun, pengguna mungkin bersedia menunggu lebih lama untuk merangkum dokumen panjang.

**Time per output token**
TPOT mengukur seberapa cepat setiap token output dihasilkan setelah token pertama. Jika setiap token memakan waktu 100 ms, respons 1.000 token akan memakan waktu 100 detik.

Dalam mode streaming, di mana pengguna membaca setiap token saat dihasilkan, TPOT harus lebih cepat dari kecepatan membaca manusia tetapi tidak harus jauh lebih cepat. Pembaca yang sangat cepat dapat membaca 120 ms/token, jadi TPOT sekitar 120 ms, atau 6-8 token/detik, sudah cukup untuk sebagian besar kasus penggunaan.

**Time between tokens dan inter-token latency**
Variasi dari metrik ini termasuk time between tokens (TBT) dan inter-token latency (ITL).9 Keduanya mengukur waktu antara token output.

Total latensi akan sama dengan TTFT + TPOT × (jumlah token output).

Dua aplikasi dengan latensi total yang sama dapat menawarkan pengalaman pengguna yang berbeda dengan TTFT dan TPOT yang berbeda. Apakah pengguna Anda lebih memilih token pertama yang instan dengan waktu tunggu yang lebih lama antara token, atau apakah mereka lebih memilih menunggu sedikit lebih lama untuk token pertama tetapi menikmati generasi token yang lebih cepat setelahnya? Studi pengguna akan diperlukan untuk menentukan pengalaman pengguna yang optimal. Mengurangi TTFT dengan biaya TPOT yang lebih tinggi dimungkinkan dengan mengalihkan lebih banyak instance komputasi dari decoding ke prefilling dan sebaliknya.10

Penting untuk dicatat bahwa nilai TTFT dan TPOT yang diamati oleh pengguna mungkin berbeda dari yang diamati oleh model, terutama dalam skenario yang melibatkan query CoT (chain-of-thought) atau agentic di mana model menghasilkan langkah perantara yang tidak ditampilkan kepada pengguna. Beberapa tim menggunakan metrik time to publish untuk membuatnya eksplisit bahwa ini mengukur waktu ke token pertama yang dilihat pengguna.

Pertimbangkan skenario di mana, setelah pengguna mengirim query, model melakukan langkah-langkah berikut:

1. Menghasilkan rencana, yang terdiri dari urutan tindakan. Rencana ini tidak ditampilkan kepada pengguna.
2. Mengambil tindakan dan mencatat outputnya. Output ini tidak ditampilkan kepada pengguna.
3. Berdasarkan output ini, menghasilkan respons akhir untuk ditampilkan kepada pengguna.

Dari perspektif model, token pertama dihasilkan dalam langkah 1. Ini adalah ketika model secara internal memulai proses generasi tokennya. Pengguna, however, hanya melihat token pertama dari output akhir yang dihasilkan dalam langkah 3. Dengan demikian, dari perspektif mereka, TTFT jauh lebih lama.

Karena latensi adalah distribusi, rata-rata dapat menyesatkan. Bayangkan Anda memiliki 10 permintaan yang nilai TTFT-nya adalah 100 ms, 102 ms, 100 ms, 100 ms, 99 ms, 104 ms, 110 ms, 90 ms, 3.000 ms, 95 ms. Rata-rata nilai TTFT adalah 390 ms, yang membuat layanan inferensi Anda terlihat lebih lambat dari yang sebenarnya. Mungkin ada kesalahan jaringan yang memperlambat satu permintaan atau prompt yang sangat panjang yang memakan waktu jauh lebih lama untuk prefill. Bagaimanapun, Anda harus menyelidiki. Dengan volume permintaan yang besar, outlier yang memiringkan latensi rata-rata hampir tidak dapat dihindari.

Lebih membantu untuk melihat latensi dalam persentil, karena mereka memberi tahu Anda sesuatu tentang persentase tertentu dari permintaan Anda. Persentil yang paling umum adalah persentil ke-50, disingkat p50 (median). Jika median adalah 100 ms, setengah dari permintaan memakan waktu lebih dari 100 ms untuk menghasilkan token pertama, dan setengah memakan waktu kurang dari 100 ms. Persentil juga membantu Anda menemukan outlier, yang mungkin merupakan gejala dari sesuatu yang salah. Biasanya, persentil yang ingin Anda lihat adalah p90, p95, dan p99. Juga membantu untuk memplot nilai TTFT terhadap panjang input.

#### Throughput dan Goodput

Throughput mengukur jumlah token output per detik yang dapat dihasilkan oleh layanan inferensi di seluruh pengguna dan permintaan.

Beberapa tim menghitung token input dan output dalam perhitungan throughput. Namun, karena memproses token input (prefilling) dan menghasilkan token output (decoding) memiliki bottleneck komputasi yang berbeda dan sering dipisahkan dalam server inferensi modern, throughput input dan output harus dihitung secara terpisah. Ketika throughput digunakan tanpa modifier apa pun, ini biasanya merujuk pada token output.

Throughput biasanya diukur sebagai token/s (TPS). Jika Anda melayani banyak pengguna, token/s/juga digunakan untuk mengevaluasi bagaimana sistem skala dengan lebih banyak pengguna.

Throughput juga dapat diukur sebagai jumlah permintaan yang diselesaikan selama waktu tertentu. Banyak aplikasi menggunakan permintaan per detik (RPS). Namun, untuk aplikasi yang dibangun di atas model foundation, permintaan mungkin memakan waktu beberapa detik untuk diselesaikan, jadi banyak orang menggunakan permintaan yang diselesaikan per menit (RPM) sebagai gantinya. Melacak metrik ini berguna untuk memahami bagaimana layanan inferensi menangani permintaan bersamaan. Beberapa penyedia mungkin membatasi layanan Anda jika Anda mengirim terlalu banyak permintaan bersamaan pada waktu yang sama.

Throughput terkait langsung dengan biaya komputasi. Throughput yang lebih tinggi biasanya berarti biaya lebih rendah. Jika sistem Anda biaya $2/jam dalam komputasi dan throughput-nya adalah 100 token/s, biayanya sekitar $5,556 per 1 juta token output. Jika setiap permintaan menghasilkan 200 token output rata-rata, biaya untuk decoding 1.000 permintaan adalah $1,11.

Biaya prefill dapat dihitung dengan cara yang sama. Jika perangkat keras Anda biaya $2 per jam dan dapat prefill 100 permintaan per menit, biaya untuk prefilling 1.000 permintaan adalah $0,33. Total biaya per permintaan adalah jumlah dari biaya prefilling dan decoding. Dalam contoh ini, total biaya untuk 1.000 permintaan adalah $1,11 + $0,33 = $1,44.

Apa yang dianggap throughput yang baik tergantung pada model, perangkat keras, dan beban kerja. Model yang lebih kecil dan chip kelas atas biasanya menghasilkan throughput yang lebih tinggi. Beban kerja dengan panjang input dan output yang konsisten lebih mudah dioptimalkan daripada beban kerja dengan panjang yang variabel.

Bahkan untuk model dengan ukuran yang sama, perangkat keras, dan beban kerja, perbandingan throughput langsung mungkin hanya perkiraan karena jumlah token tergantung pada apa yang merupakan token, dan model yang berbeda memiliki tokenizer yang berbeda. Lebih baik membandingkan efisiensi server inferensi menggunakan metrik seperti biaya per permintaan.

Sama seperti sebagian besar aplikasi perangkat lunak lainnya, aplikasi AI memiliki trade-off latensi/throughput. Teknik seperti batching dapat meningkatkan throughput tetapi mengurangi latensi. Menurut tim AI LinkedIn dalam refleksi mereka setelah setahun menerapkan produk AI generatif (LinkedIn, 2024), tidak jarang untuk menggandakan atau melipatgandakan throughput jika Anda bersedia mengorbankan TTFT dan TPOT.

Karena trade-off ini, berfokus pada layanan inferensi hanya berdasarkan throughput dan biayanya dapat menyebabkan pengalaman pengguna yang buruk. Sebagai gantinya, beberapa tim berfokus pada goodput, metrik yang diadaptasi dari jaringan untuk aplikasi LLM. Goodput mengukur jumlah permintaan per detik yang memenuhi SLO, software-level objective.

Bayangkan aplikasi Anda memiliki tujuan berikut: TTFT paling banyak 200 ms dan TPOT paling banyak 100 ms. Katakanlah layanan inferensi Anda dapat menyelesaikan 100 permintaan per menit. Namun, dari 100 permintaan ini, hanya 30 yang memenuhi SLO. Maka, goodput layanan ini adalah 30 permintaan per menit. Visualisasi ini ditunjukkan pada Gambar 9-4.

**Gambar 9-4.** Jika layanan inferensi dapat menyelesaikan 10 RPS tetapi hanya 3 yang memenuhi SLO, maka goodput-nya adalah 3 RPS.

#### Utilisasi, MFU, dan MBU

Metrik utilisasi mengukur seberapa efisien sumber daya digunakan. Ini biasanya mengkuantifikasi proporsi sumber daya yang secara aktif digunakan dibandingkan dengan kapasitas total yang tersedia.

Metrik yang umum tetapi sering disalahpahami adalah utilisasi GPU, dan NVIDIA sebagian bertanggung jawab atas kesalahpahaman ini. Alat resmi NVIDIA untuk memantau penggunaan GPU adalah nvidia-smi—SMI singkatan dari System Management Interface. Satu metrik yang ditunjukkan alat ini adalah utilisasi GPU, yang mewakili persentase waktu di mana GPU secara aktif memproses tugas. Misalnya, jika Anda menjalankan inferensi pada cluster GPU selama 10 jam, dan GPU secara aktif memproses tugas selama 5 jam tersebut, utilisasi GPU Anda adalah 50%.

Namun, secara aktif memproses tugas tidak berarti melakukannya dengan efisien. Untuk kesederhanaan, pertimbangkan GPU kecil yang mampu melakukan 100 operasi per detik. Dalam definisi utilisasi nvidia-smi, GPU ini dapat melaporkan utilisasi 100% bahkan jika hanya melakukan satu operasi per detik.

Jika Anda membayar mesin yang dapat melakukan 100 operasi dan menggunakannya hanya untuk 1 operasi, Anda membuang uang. Metrik optimasi GPU nvidia-smi, oleh karena itu, tidak terlalu berguna. Metrik utilisasi yang mungkin Anda pedulikan, dari semua operasi yang dapat dihitung oleh mesin, adalah berapa banyak yang dilakukannya dalam waktu tertentu. Metrik ini disebut MFU (Model FLOP/s Utilization), yang membedakannya dari metrik utilisasi GPU NVIDIA.

MFU adalah rasio throughput yang diamati (token/s) relatif terhadap throughput maksimum teoretis dari sistem yang beroperasi pada FLOP/s puncak. Jika pada FLOP/s puncak yang diiklankan oleh pembuat chip, chip dapat menghasilkan 100 token/s, tetapi ketika digunakan untuk layanan inferensi Anda, chip hanya dapat menghasilkan 20 token/s, MFU Anda adalah 20%.11

Demikian pula, karena bandwidth memori mahal, Anda mungkin juga ingin tahu seberapa efisien bandwidth perangkat keras Anda digunakan. MBU (Model Bandwidth Utilization) mengukur persentase bandwidth memori yang dapat dicapai yang digunakan. Jika bandwidth puncak chip adalah 1 TB/s dan inferensi Anda hanya menggunakan 500 GB/s, MBU Anda adalah 50%.

Menghitung bandwidth memori yang digunakan untuk inferensi LLM langsung: jumlah parameter × byte/param × token/s

MBU dihitung sebagai berikut:

(jumlah parameter × byte/param × token/s) / (bandwidth teoretis)

Misalnya, jika Anda menggunakan model 7B parameter dalam FP16 (dua byte per parameter) dan mencapai 100 token/s, bandwidth yang digunakan adalah:

7B × 2 × 100 = 700 GB/s

Ini menggarisbawahi pentingnya quantization (dibahas di Bab 7). Lebih sedikit byte per parameter berarti model Anda mengonsumsi bandwidth berharga lebih sedikit.

Jika ini dilakukan pada GPU A100-80GB dengan bandwidth memori teoretis 2 TB/s, MBU adalah:

(700 GB/s) / (2 TB/s) = 70%

Hubungan antara throughput (token/s) dan MBU dan antara throughput dan MFU adalah linear, jadi beberapa orang mungkin menggunakan throughput untuk merujuk ke MBU dan MFU.

Apa yang dianggap MFU dan MBU yang baik tergantung pada model, perangkat keras, dan beban kerja. Beban kerja compute-bound biasanya memiliki MFU lebih tinggi dan MBU lebih rendah, sementara beban kerja bandwidth-bound sering menunjukkan MFU lebih rendah dan MBU lebih tinggi.

Karena pelatihan dapat benefiting dari optimasi yang lebih efisien (misalnya, batching yang lebih baik), berkat beban kerja yang lebih dapat diprediksi, MFU untuk pelatihan biasanya lebih tinggi daripada MFU untuk inferensi. Untuk inferensi, karena prefill adalah compute-bound dan decode adalah memory bandwidth-bound, MFU selama prefilling biasanya lebih tinggi daripada MFU selama decoding. Untuk pelatihan model, hingga saat ini, MFU di atas 50% umumnya dianggap baik, tetapi dapat sulit dicapai pada perangkat keras tertentu.12 Tabel 9-1 menunjukkan MFU untuk beberapa model dan akselerator.

**Tabel 9-1.** Contoh MFU dari "PaLM: Scaling Language Modeling with Pathways" (Chowdhery et al., 2022).

| Model | Jumlah parameter (dalam miliar) | Chip akselerator | Model FLOP/s utilization |
|---|---|---|---|
| GPT-3 | 175B | V100 | 21,3% |
| Gopher | 280B | 4096 TPU v3 | 32,5% |
| Megatron-Turing NLG | 530B | 2240 A100 | 30,2% |
| PaLM | 540B | 6144 TPU v4 | 46,2% |

Gambar 9-5 menunjukkan MBU untuk proses inferensi menggunakan Llama 2-70B dalam FP16 pada perangkat keras yang berbeda. Penurunan ini kemungkinan karena beban komputasi yang lebih tinggi per detik dengan lebih banyak pengguna, menggeser beban kerja dari bandwidth-bound ke compute-bound.

**Gambar 9-5.** Utilisasi bandwidth untuk Llama 2-70B dalam FP16 di tiga chip yang berbeda menunjukkan penurunan MBU seiring meningkatnya jumlah pengguna bersamaan. Gambar dari "LLM Training and Inference with Intel Gaudi 2 AI Accelerators" (Databricks, 2024).

Metrik utilisasi membantu melacak efisiensi sistem Anda. Tingkat utilisasi yang lebih tinggi untuk beban kerja yang sama pada perangkat keras yang sama umumnya berarti bahwa layanan Anda menjadi lebih efisien. Namun, tujuannya bukan untuk mendapatkan chip dengan utilisasi tertinggi. Yang benar-benar Anda pedulikan adalah bagaimana menyelesaikan pekerjaan Anda lebih cepat dan lebih murah. Tingkat utilisasi yang lebih tinggi tidak berarti apa-apa jika biaya dan latensi keduanya meningkat.

## Akselerator AI

Seberapa cepat dan murah perangkat lunak dapat berjalan tergantung pada perangkat keras yang dijalankannya. Meskipun ada teknik optimasi yang bekerja lintas perangkat keras, memahami perangkat keras memungkinkan optimasi yang lebih dalam. Bagian ini melihat perangkat keras dari perspektif inferensi, tetapi ini dapat diterapkan ke pelatihan juga.

Pengembangan model AI dan perangkat keras selalu terkait erat. Kurangnya komputer yang cukup kuat adalah salah satu faktor yang berkontribusi pada musim dingin AI pertama di tahun 1970-an.13

Kebangkitan minat dalam deep learning pada tahun 2012 juga terkait erat dengan komputasi. Salah satu alasan yang umum diakui untuk popularitas AlexNet (Krizhevsky et al., 2012) adalah bahwa ini adalah makalah pertama yang berhasil menggunakan GPU, graphics processing units, untuk melatih neural network.14 Sebelum GPU, jika Anda ingin melatih model pada skala AlexNet, Anda harus menggunakan ribuan CPU, seperti yang dirilis Google hanya beberapa bulan sebelum AlexNet. Dibandingkan dengan ribuan CPU, beberapa GPU jauh lebih mudah diakses oleh mahasiswa PhD dan peneliti, memicu boom penelitian deep learning.

### Apa itu Akselerator?

Akselerator adalah chip yang dirancang untuk mempercepat jenis beban kerja komputasi tertentu. Akselerator AI dirancang untuk beban kerja AI. Jenis akselerator AI yang dominan adalah GPU, dan pendorong ekonomi terbesar selama boom AI di awal 2020-an tidak diragukan lagi adalah NVIDIA.

Perbedaan utama antara CPU dan GPU adalah bahwa CPU dirancang untuk penggunaan tujuan umum, sedangkan GPU dirancang untuk pemrosesan paralel:

- **CPU** memiliki beberapa core yang kuat, biasanya hingga 64 core untuk mesin konsumen kelas atas. Meskipun banyak core CPU dapat menangani beban kerja multi-thread secara efektif, mereka unggul dalam tugas yang membutuhkan performa single-thread tinggi, seperti menjalankan sistem operasi, mengelola operasi I/O (input/output), atau menangani proses sekuensial yang kompleks.
- **GPU** memiliki ribuan core yang lebih kecil dan kurang kuat yang dioptimalkan untuk tugas yang dapat dipecah menjadi banyak perhitungan independen yang lebih kecil, seperti rendering grafis dan machine learning. Operasi yang merupakan sebagian besar beban kerja ML adalah perkalian matriks, yang sangat dapat diparalelkan.15

Sementara pengejaran pemrosesan paralel yang efisien meningkatkan kemampuan komputasi, ini menimbulkan tantangan pada desain memori dan konsumsi daya.

Kesuksesan GPU NVIDIA telah menginspirasi banyak akselerator yang dirancang untuk mempercepat beban kerja AI, termasuk generasi GPU yang lebih baru dari Advanced Micro Devices (AMD), TPU (Tensor Processing Unit) dari Google, Habana Gaudi dari Intel, Intelligent Processing Unit (IPU) dari Graphcore, Language Processing Unit (LPU) dari Groq, Wafer-Scale Quant Processing Unit (QPU) dari Cerebras, dan banyak lagi yang diperkenalkan.

Meskipun banyak chip dapat menangani pelatihan dan inferensi, satu tema besar yang muncul adalah chip khusus untuk inferensi. Survei oleh Desislavov et al. (2023) berbagi bahwa inferensi dapat melebihi biaya pelatihan dalam sistem yang umum digunakan, dan bahwa inferensi menyumbang hingga 90% dari biaya machine learning untuk sistem AI yang diterapkan.

Seperti yang dibahas di Bab 7, pelatihan menuntut jauh lebih banyak memori karena backpropagation dan umumnya lebih sulit dilakukan dalam presisi lebih rendah. Lebih lanjut, pelatihan biasanya menekankan throughput, sedangkan inferensi bertujuan untuk meminimalkan latensi. Akibatnya, chip yang dirancang untuk inferensi sering dioptimalkan untuk presisi lebih rendah dan akses memori lebih cepat, alih-alih kapasitas memori besar. Contoh chip tersebut termasuk Apple Neural Engine, AWS Inferentia, dan MTIA (Meta Training and Inference Accelerator). Chip yang dirancang untuk komputasi edge, seperti Edge TPU dari Google dan NVIDIA Jetson Xavier, juga biasanya diarahkan ke inferensi.

Ada juga chip yang dikhususkan untuk arsitektur model yang berbeda, seperti chip yang dikhususkan untuk transformer.16 Banyak chip dirancang untuk pusat data, dengan semakin banyak yang dirancang untuk perangkat konsumen (seperti ponsel dan laptop).

Arsitektur perangkat keras yang berbeda memiliki tata letak memori yang berbeda dan unit komputasi khusus yang berkembang dari waktu ke waktu. Unit-unit ini dioptimalkan untuk tipe data tertentu, seperti skalar, vektor, atau tensor, seperti yang ditunjukkan pada Gambar 9-6.

**Gambar 9-6.** Primitif komputasi yang berbeda. Gambar terinspirasi oleh Chen et al. (2018).

Chip mungkin memiliki campuran unit komputasi yang berbeda yang dioptimalkan untuk berbagai tipe data. Misalnya, GPU secara tradisional mendukung operasi vektor, tetapi banyak GPU modern sekarang menyertakan tensor core yang dioptimalkan untuk komputasi matriks dan tensor. TPU, di sisi lain, dirancang dengan operasi tensor sebagai primitif komputasi utama mereka. Untuk mengoperasikan model secara efisien pada arsitektur perangkat keras, tata letak memori dan primitif komputasinya perlu diperhitungkan.

Spesifikasi chip berisi banyak detail yang dapat berguna saat mengevaluasi chip ini untuk setiap kasus penggunaan tertentu. Namun, karakteristik utama yang penting di seluruh kasus penggunaan adalah kemampuan komputasi, ukuran dan bandwidth memori, dan konsumsi daya. Saya akan menggunakan GPU sebagai contoh untuk mengilustrasikan karakteristik ini.

#### Kemampuan Komputasi

Kemampuan komputasi biasanya diukur dengan jumlah operasi yang dapat dilakukan chip dalam waktu tertentu. Metrik yang paling umum adalah FLOP/s, sering ditulis sebagai FLOPS, yang mengukur jumlah puncak operasi floating-point per detik. Pada kenyataannya, however, sangat tidak mungkin bahwa aplikasi dapat mencapai FLOP/s puncak ini. Rasio antara FLOP/s aktual dan FLOP/s teoretis adalah satu metrik utilisasi.

Jumlah operasi yang dapat dilakukan chip dalam satu detik tergantung pada presisi numerik—semakin tinggi presisi, semakin sedikit operasi yang dapat dieksekusi chip. Pikirkan tentang bagaimana menambahkan dua bilangan 32-bit umumnya memerlukan dua kali komputasi dari menambahkan dua bilangan 16-bit. Jumlah operasi 32-bit yang dapat dilakukan chip dalam waktu tertentu tidak persis setengah dari operasi 16-bit karena optimasi chip yang berbeda. Untuk gambaran umum tentang presisi numerik, kunjungi kembali "Representasi Numerik" pada halaman 325.

Tabel 9-2 menunjukkan spesifikasi FLOP/s untuk format presisi yang berbeda untuk chip NVIDIA H100 SXM.

**Tabel 9-2.** Spesifikasi FLOP/s untuk chip NVIDIA H100 SXM.

| Presisi numerik | teraFLOP/s (triliun FLOP/s) dengan sparsity |
|---|---|
| TF32 Tensor Corea | 989 |
| BFLOAT16 Tensor Core | 1.979 |
| FP16 Tensor Core | 1.979 |
| FP8 Tensor Core | 3.958 |

a Ingat dari Bab 7 bahwa TF32 adalah format 19-bit, bukan 32-bit.

#### Ukuran dan Bandwidth Memori

Karena GPU memiliki banyak core yang bekerja secara paralel, data sering perlu dipindahkan dari memori ke core-core ini, dan, oleh karena itu, kecepatan transfer data penting.

Transfer data sangat penting saat bekerja dengan model AI yang melibatkan matriks weight besar dan data pelatihan. Sejumlah besar data ini perlu dipindahkan dengan cepat untuk menjaga core tetap terisi secara efisien. Oleh karena itu, memori GPU perlu memiliki bandwidth lebih tinggi dan latensi lebih rendah daripada memori CPU, dan dengan demikian, memori GPU memerlukan teknologi memori yang lebih canggih. Ini adalah salah satu faktor yang membuat memori GPU lebih mahal daripada memori CPU.

Lebih spesifik, CPU biasanya menggunakan DDR SDRAM (Double Data Rate Synchronous Dynamic Random-Access Memory), yang memiliki struktur 2D. GPU, terutama yang kelas atas, sering menggunakan HBM (high-bandwidth memory), yang memiliki struktur bertumpuk 3D.17

Memori akselerator diukur berdasarkan ukuran dan bandwidth. Angka-angka ini perlu dievaluasi dalam sistem tempat akselerator menjadi bagiannya. Akselerator, seperti GPU, biasanya berinteraksi dengan tiga tingkat memori, seperti yang divisualisasikan pada Gambar 9-7:

**Memori CPU (DRAM)**
Akselerator biasanya diterapkan bersama dengan CPU, memberi mereka akses ke memori CPU (juga dikenal sebagai memori sistem, memori host, atau hanya CPU DRAM).

Memori CPU biasanya memiliki bandwidth terendah di antara jenis memori ini, dengan kecepatan transfer data berkisar dari 25 GB/s hingga 50 GB/s. Ukuran memori CPU bervariasi. Laptop rata-rata mungkin memiliki sekitar 16-64 GB, sedangkan workstation kelas atas dapat memiliki satu TB atau lebih.

**Memori high-bandwidth GPU (HBM)**
Ini adalah memori yang didedikasikan untuk GPU, terletak dekat dengan GPU untuk akses lebih cepat daripada memori CPU.

HBM menyediakan bandwidth yang secara signifikan lebih tinggi, dengan kecepatan transfer data biasanya berkisar dari 256 GB/s hingga lebih dari 1,5 TB/s. Kecepatan ini penting untuk menangani transfer data besar dan tugas throughput tinggi secara efisien. GPU konsumen memiliki sekitar 24-80 GB HBM.

**SRAM on-chip GPU**
Terintegrasi langsung ke dalam chip, memori ini digunakan untuk menyimpan data dan instruksi yang sering diakses untuk akses yang hampir instan. Ini termasuk cache L1 dan L2 yang terbuat dari SRAM, dan, dalam beberapa arsitektur, cache L3 juga. Cache ini adalah bagian dari memori on-chip yang lebih luas, yang juga mencakup komponen lain seperti register file dan memori bersama.

RAM memiliki kecepatan transfer data yang sangat tinggi, sering melebihi 10 TB/s. Ukuran SRAM GPU kecil, biasanya 40 MB atau kurang.

**Gambar 9-7.** Hierarki memori akselerator AI. Angka-angka hanya untuk referensi. Angka sebenarnya bervariasi untuk setiap chip.

Banyak optimasi GPU adalah tentang bagaimana memanfaatkan hierarki memori ini sebaik-baiknya. Namun, hingga saat ini, framework populer seperti PyTorch dan TensorFlow belum memungkinkan kontrol halus atas akses memori. Ini telah membuat banyak peneliti dan insinyur AI tertarik pada bahasa pemrograman GPU seperti CUDA (aslinya Compute Unified Device Architecture), Triton dari OpenAI, dan ROCm (Radeon Open Compute). Yang terakhir adalah alternatif open source AMD untuk CUDA proprietari NVIDIA.

#### Konsumsi Daya

Chip mengandalkan transistor untuk melakukan komputasi. Setiap komputasi dilakukan oleh transistor yang menyala dan mati, yang memerlukan energi. GPU dapat memiliki miliaran transistor—NVIDIA A100 memiliki 54 miliar transistor, sedangkan NVIDIA H100 memiliki 80 miliar. Ketika akselerator digunakan secara efisien, miliaran transistor dengan cepat beralih status, mengonsumsi sejumlah besar energi dan menghasilkan jumlah panas yang tidak sepele. Panas ini memerlukan sistem pendingin, yang juga mengonsumsi listrik, menambah konsumsi energi keseluruhan pusat data.

Konsumsi energi chip mengancam memiliki dampak yang mencengangkan pada lingkungan, meningkatkan tekanan pada perusahaan untuk berinvestasi dalam teknologi pusat data hijau. NVIDIA H100 yang berjalan pada puncaknya selama setahun mengkonsumsi sekitar 7.000 kWh. Sebagai perbandingan, konsumsi listrik tahunan rata-rata rumah tangga AS adalah 10.000 kWh. Itulah mengapa listrik adalah bottleneck untuk meningkatkan skala komputasi.18

Akselerator biasanya menentukan konsumsi daya mereka di bawah daya tarik maksimum atau metrik proksi TDP (thermal design power):

- **Daya tarik maksimum** menunjukkan daya puncak yang dapat ditarik chip di bawah beban penuh.
- **TDP** mewakili panas maksimum yang perlu dihamburkan oleh sistem pendingin ketika chip beroperasi di bawah beban kerja biasa. Meskipun ini bukan ukuran pasti konsumsi daya, ini adalah indikasi dari daya tarik yang diharapkan. Untuk CPU dan GPU, daya tarik maksimum dapat kira-kira 1,1 hingga 1,5 kali TDP, meskipun hubungan pastinya bervariasi tergantung pada arsitektur dan beban kerja tertentu.

Jika Anda memilih penyedia cloud, Anda tidak perlu khawatir tentang pendinginan atau listrik. Namun, angka-angka ini masih dapat menarik untuk memahami dampak akselerator pada lingkungan dan permintaan listrik keseluruhan.

### Memilih Akselerator

Akselerator apa yang digunakan tergantung pada beban kerja Anda. Jika beban kerja Anda compute-bound, Anda mungkin ingin mencari chip dengan FLOP/s lebih banyak. Jika beban kerja Anda memory-bound, mengeluarkan uang untuk chip dengan bandwidth lebih tinggi dan memori lebih banyak akan membuat hidup Anda lebih mudah.

Saat mengevaluasi chip mana yang akan dibeli, ada tiga pertanyaan utama:

- Dapatkah perangkat keras menjalankan beban kerja Anda?
- Berapa lama waktu yang diperlukan untuk melakukannya?
- Berapa biayanya?

FLOP/s, ukuran memori, dan bandwidth memori adalah tiga angka besar yang membantu Anda menjawab dua pertanyaan pertama. Pertanyaan terakhir langsung. Harga penyedia cloud biasanya berbasis penggunaan dan cukup mirip di seluruh penyedia. Jika Anda membeli perangkat keras sendiri, biaya dapat dihitung berdasarkan harga awal dan konsumsi daya yang berkelanjutan.

## Optimasi Inferensi

Optimasi inferensi dapat dilakukan di tingkat model, perangkat keras, atau layanan. Untuk mengilustrasikan perbedaannya, pertimbangkan panahan. Optimasi tingkat model seperti membuat panah yang lebih baik. Optimasi tingkat perangkat keras seperti melatih pemanah yang lebih kuat dan lebih baik. Optimasi tingkat layanan seperti menyempurnakan seluruh proses penembakan, termasuk busur dan kondisi membidik.

Idealnya, mengoptimalkan model untuk kecepatan dan biaya tidak boleh mengubah kualitas model. Namun, banyak teknik mungkin menyebabkan degradasi model. Gambar 9-8 menunjukkan performa model Llama yang sama pada benchmark yang berbeda, dilayani oleh penyedia layanan inferensi yang berbeda.

**Gambar 9-8.** Penyedia layanan inferensi mungkin menggunakan teknik optimasi yang dapat mengubah perilaku model, menyebabkan penyedia yang berbeda memiliki variasi kualitas model yang sedikit. Eksperimen dilakukan oleh Cerebras (2024).

Karena desain perangkat keras di luar ruang lingkup buku ini, saya akan membahas teknik di tingkat model dan layanan. Meskipun teknik dibahas secara terpisah, perlu diingat bahwa, dalam produksi, optimasi biasanya melibatkan teknik di lebih dari satu tingkat.

### Optimasi Model

Optimasi tingkat model bertujuan untuk membuat model lebih efisien, sering dengan memodifikasi model itu sendiri, yang dapat mengubah perilakunya. Hingga saat ini, banyak model foundation mengikuti arsitektur transformer dan menyertakan komponen model bahasa autoregresif. Model-model ini memiliki tiga karakteristik yang membuat inferensi intensif sumber daya: ukuran model, decoding autoregresif, dan mekanisme attention. Mari kita bahas pendekatan untuk mengatasi tantangan ini.

#### Kompresi Model

Kompresi model melibatkan teknik yang mengurangi ukuran model. Membuat model lebih kecil juga dapat membuatnya lebih cepat. Buku ini telah membahas dua teknik kompresi model: quantization dan distilasi. Quantization, mengurangi presisi model untuk mengurangi jejak memori dan meningkatkan throughput, dibahas di Bab 7. Distilasi model, melatih model kecil untuk meniru perilaku model besar, dibahas di Bab 8.

Distilasi model menunjukkan bahwa dimungkinkan untuk menangkap perilaku model besar menggunakan lebih sedikit parameter. Mungkinkah dalam model besar, ada subset parameter yang mampu menangkap seluruh perilaku model? Ini adalah konsep inti di balik pruning.

Pruning, dalam konteks neural network, memiliki dua arti. Satu adalah menghapus seluruh node dari neural network, yang berarti mengubah arsitekturnya dan mengurangi jumlah parameternya. Yang lain adalah menemukan parameter yang paling tidak berguna untuk prediksi dan menyetelnya ke nol. Dalam hal ini, pruning tidak mengurangi jumlah total parameter, hanya jumlah parameter non-nol. Ini membuat model lebih sparse, yang mengurangi ruang penyimpanan model dan mempercepat komputasi.

Model yang dipangkas dapat digunakan apa adanya atau lebih lanjut di-fine-tune untuk menyesuaikan parameter yang tersisa dan memulihkan degradasi performa apa pun yang disebabkan oleh proses pruning. Pruning dapat membantu menemukan arsitektur model yang menjanjikan (Liu et al., 2018). Arsitektur yang dipangkas ini, lebih kecil dari arsitektur sebelum dipangkas, juga dapat dilatih dari awal (Zhu et al., 2017).

Dalam literatur, telah ada banyak hasil pruning yang menggembirakan. Misalnya, Frankle dan Carbin (2019) menunjukkan bahwa teknik pruning dapat mengurangi jumlah parameter non-nol dari jaringan terlatih tertentu lebih dari 90%, mengurangi jejak memori dan meningkatkan kecepatan tanpa mengorbankan akurasi. Namun, dalam praktik, hingga saat ini, pruning kurang umum. Ini lebih sulit dilakukan, karena memerlukan pemahaman tentang arsitektur model asli, dan peningkatan performa yang dapat dibawanya sering kali jauh lebih sedikit daripada pendekatan lain. Pruning juga menghasilkan model sparse, dan tidak semua arsitektur perangkat keras dirancang untuk memanfaatkan sparsity yang dihasilkan.

Weight-only quantization sejauh ini merupakan pendekatan paling populer karena mudah digunakan, bekerja langsung untuk banyak model, dan sangat efektif. Mengurangi presisi model dari 32 bit menjadi 16 bit mengurangi jejak memori menjadi setengahnya. Namun, kita mendekati batas quantization—kita tidak bisa lebih rendah dari 1 bit per nilai. Distilasi juga umum karena dapat menghasilkan model yang lebih kecil yang perilakunya sebanding dengan model yang jauh lebih besar untuk kebutuhan Anda.

#### Mengatasi Bottleneck Decoding Autoregresif

Seperti yang dibahas di Bab 2, model bahasa autoregresif menghasilkan satu token demi satu token. Jika diperlukan 100 ms untuk menghasilkan satu token, respons 100 token akan memakan waktu 10 detik.19 Proses ini tidak hanya lambat, tetapi juga mahal. Di seluruh penyedia API model, token output biaya sekitar dua hingga empat kali token input. Dalam sebuah eksperimen, Anyscale menemukan bahwa satu token output dapat memiliki dampak yang sama pada latensi seperti 100 token input (Kadous et al., 2023). Meningkatkan proses generasi autoregresif sebesar persentase kecil dapat secara signifikan meningkatkan pengalaman pengguna.

Seiring ruang yang berkembang pesat, teknik baru sedang dikembangkan untuk mengatasi bottleneck yang tampaknya mustahil ini. Mungkin suatu hari, akan ada arsitektur yang tidak memiliki bottleneck ini. Teknik yang dibahas di sini adalah untuk mengilustrasikan seperti apa solusinya, tetapi teknik-teknik ini masih berkembang.

**Speculative decoding.** Speculative decoding (juga disebut speculative sampling) menggunakan model yang lebih cepat tetapi kurang kuat untuk menghasilkan urutan token, yang kemudian diverifikasi oleh model target. Model target adalah model yang ingin Anda gunakan. Model yang lebih cepat disebut model draft atau proposal karena mengusulkan output draft.

Bayangkan token input adalah x1, x2, …, xt:

1. Model draft menghasilkan urutan K token: xt+1, xt+2, …, xt+K.
2. Model target memverifikasi K token yang dihasilkan ini secara paralel.
3. Model target menerima subsequence terpanjang dari token draft, dari kiri ke kanan, yang disetujui untuk digunakan oleh model target.
4. Katakanlah model target menerima j token draft, xt+1, xt+2, …, xt+j. Model target kemudian menghasilkan satu token tambahan, xt+j+1.

Proses kembali ke langkah 1, dengan model draft menghasilkan K token yang dikondisikan pada x1, x2, …, xt, xt+1, xt+2, …, xt+j. Proses divisualisasikan pada Gambar 9-9.

Jika tidak ada token draft yang diterima, loop ini hanya menghasilkan satu token yang dihasilkan oleh model target. Jika semua token draft diterima, loop ini menghasilkan K + 1 token, dengan K dihasilkan oleh model draft dan satu oleh model target.

**Gambar 9-9.** Model draft menghasilkan urutan K token, dan model utama menerima subsequence terpanjang yang disetujuinya. Gambar dari "Blockwise Parallel Decoding for Deep Autoregressive Models" (Stern et al., 2018).

Jika semua urutan draft ditolak, model target harus menghasilkan seluruh respons selain memverifikasinya, berpotensi menyebabkan peningkatan latensi. Namun, ini dapat dihindari karena tiga wawasan ini:

1. Waktu yang diperlukan model target untuk memverifikasi urutan token kurang dari waktu yang diperlukan untuk menghasilkannya, karena verifikasi dapat diparalelkan, sedangkan generasi bersifat sekuensial. Speculative decoding secara efektif mengubah profil komputasi decoding menjadi prefilling.
2. Dalam urutan token output, beberapa token lebih mudah diprediksi daripada yang lain. Dimungkinkan untuk menemukan model draft yang lebih lemah yang mampu mendapatkan token yang lebih mudah diprediksi ini dengan benar, menghasilkan tingkat penerimaan token draft yang tinggi.
3. Decoding adalah memory bandwidth-bound, yang berarti bahwa selama proses decoding, biasanya ada FLOP yang menganggur yang dapat digunakan untuk verifikasi gratis.20

Tingkat penerimaan tergantung pada domain. Untuk teks yang mengikuti struktur tertentu seperti kode, tingkat penerimaan biasanya lebih tinggi. Nilai K yang lebih besar berarti lebih sedikit panggilan verifikasi untuk model target tetapi tingkat penerimaan token draft yang rendah. Model draft dapat berupa arsitektur apa pun, meskipun idealnya harus berbagi kosakata dan tokenizer yang sama dengan model target. Anda dapat melatih model draft khusus atau menggunakan model yang lebih lemah yang ada.

Misalnya, untuk mempercepat proses decoding Chinchilla-70B, DeepMind melatih model draft 4B parameter dengan arsitektur yang sama (Chen et al., 2023). Model draft dapat menghasilkan token delapan kali lebih cepat dari model target (1,8 ms/token dibandingkan dengan 14,1 ms/token). Ini mengurangi latensi respons keseluruhan lebih dari setengah tanpa mengorbankan kualitas respons. Peningkatan kecepatan yang serupa dicapai untuk T5-XXL (Laviathan et al., 2022).

Pendekatan ini gaining traction karena relatif mudah diimplementasikan dan tidak mengubah kualitas model. Misalnya, dimungkinkan untuk melakukannya dalam 50 baris kode di PyTorch. Ini telah digabungkan ke dalam framework inferensi populer seperti vLLM, TensorRT-LLM, dan llama.cpp.

**Inference with reference.** Sering kali, respons perlu merujuk token dari input. Misalnya, jika Anda meminta model pertanyaan tentang dokumen yang dilampirkan, model mungkin mengulang sebagian teks secara verbatim dari dokumen. Contoh lainnya adalah jika Anda meminta model untuk memperbaiki bug dalam sepotong kode, model mungkin menggunakan kembali sebagian besar kode asli dengan perubahan kecil. Alih-alih membuat model menghasilkan token yang berulang ini, bagaimana jika kita menyalin token-token ini dari input untuk mempercepat generasi? Ini adalah ide inti di balik inference with reference.

Inference with reference mirip dengan speculative decoding, tetapi alih-alih menggunakan model untuk menghasilkan token draft, ini memilih token draft dari input. Tantangan utamanya adalah mengembangkan algoritma untuk mengidentifikasi rentang teks yang paling relevan dari konteks pada setiap langkah decoding. Opsi paling sederhana adalah menemukan rentang teks yang cocok dengan token saat ini.

Tidak seperti speculative decoding, inference with reference tidak memerlukan model tambahan. Namun, ini hanya berguna dalam skenario generasi di mana ada tumpang tindih yang signifikan antara konteks dan output, seperti dalam sistem retrieval, coding, atau percakapan multi-turn. Dalam "Inference with Reference: Lossless Acceleration of Large Language Models" (Yang et al., 2023), teknik ini membantu mencapai percepatan generasi dua kali lipat dalam kasus penggunaan tersebut.

Contoh cara kerja inference with reference ditunjukkan pada Gambar 9-10.

**Gambar 9-10.** Dua contoh inference with reference. Rentang teks yang berhasil disalin dari input berwarna merah dan hijau. Gambar dari Yang et al. (2023). Gambar dilisensikan di bawah CC BY 4.0.

**Parallel decoding.** Alih-alih membuat generasi autoregresif lebih cepat dengan token draft, beberapa teknik bertujuan untuk memutus ketergantungan sekuensial. Diberikan urutan token yang ada x1, x2,…,xt, teknik-teknik ini mencoba menghasilkan xt+1, xt+2,…,xt+k secara simultan. Ini berarti bahwa model menghasilkan xt+2 sebelum mengetahui bahwa token sebelumnya adalah xt+1.

Ini dapat bekerja karena pengetahuan tentang urutan yang ada sering cukup untuk memprediksi beberapa token berikutnya. Misalnya, diberikan "the cat sits", tanpa mengetahui bahwa token berikutnya adalah "on", "under", atau "behind", Anda mungkin masih memprediksi bahwa kata setelahnya adalah "the".

Token paralel dapat dihasilkan oleh decoder yang sama, seperti dalam Lookahead decoding (Fu et al., 2024), atau oleh kepala decoding yang berbeda, seperti dalam Medusa (Cai et al., 2024). Dalam Medusa, model asli diperluas dengan beberapa kepala decoding, dan setiap kepala adalah lapisan neural network kecil yang kemudian dilatih untuk memprediksi token masa depan pada posisi tertentu. Jika model asli dilatih untuk memprediksi token berikutnya xt+1, kepala ke-k akan memprediksi token xt+k+1. Kepala-kepala ini dilatih bersama dengan model asli, tetapi model asli dibekukan. NVIDIA mengklaim Medusa membantu meningkatkan generasi token Llama 3.1 hingga 1,9× pada GPU HGX H200 mereka (Eassa et al., 2024).

Namun, karena token-token ini tidak dihasilkan secara sekuensial, mereka perlu diverifikasi untuk memastikan bahwa mereka cocok bersama. Bagian penting dari parallel decoding adalah verifikasi dan integrasi. Lookahead decoding menggunakan metode Jacobi21 untuk memverifikasi token yang dihasilkan, yang bekerja sebagai berikut:

1. K token masa depan dihasilkan secara paralel.
2. K token ini diverifikasi untuk koherensi dan konsistensi dengan konteks.
3. Jika satu atau lebih token gagal verifikasi, alih-alih menggabungkan semua K token masa depan, model hanya menghasilkan ulang atau menyesuaikan token yang gagal ini.

Model terus menyempurnakan token yang dihasilkan hingga semuanya lulus verifikasi dan diintegrasikan ke dalam output akhir. Keluarga algoritma parallel decoding ini juga disebut Jacobi decoding.

Di sisi lain, Medusa menggunakan mekanisme attention berbasis pohon untuk memverifikasi dan mengintegrasikan token. Setiap kepala Medusa menghasilkan beberapa opsi untuk setiap posisi. Opsi-opsi ini kemudian diatur ke dalam struktur seperti pohon untuk memilih kombinasi yang paling menjanjikan. Proses divisualisasikan pada Gambar 9-11.

**Gambar 9-11.** Dalam Medusa (Cai et al., 2024), setiap kepala memprediksi beberapa opsi untuk posisi token. Urutan yang paling menjanjikan dari opsi-opsi ini dipilih. Gambar diadaptasi dari makalah, yang dilisensikan di bawah CC BY 4.0.

Meskipun perspektif untuk dapat menghindari ketergantungan sekuensial menarik, parallel decoding tidak intuitif, dan beberapa teknik, seperti Medusa, dapat menantang untuk diimplementasikan.

#### Optimasi Mekanisme Attention

Ingat dari Bab 2 bahwa menghasilkan token berikutnya memerlukan vektor key dan value untuk semua token sebelumnya. Ini berarti bahwa berikut ini berlaku:

- Menghasilkan token xt memerlukan vektor key dan value untuk token x1, x2, …, xt–1.
- Menghasilkan token xt+1 memerlukan vektor key dan value untuk token x1, x2, …,xt–1, xt.

Saat menghasilkan token xt+1, alih-alih menghitung vektor key dan value untuk token x1, x2, …, xt–1 lagi, Anda menggunakan kembali vektor-vektor ini dari langkah sebelumnya. Ini berarti bahwa Anda hanya perlu menghitung vektor key dan value untuk token terbaru, xt. Cache yang menyimpan vektor key dan value untuk digunakan kembali disebut KV cache.

Vektor key dan value yang baru dihitung kemudian ditambahkan ke KV cache, yang divisualisasikan pada Gambar 9-12.

**Gambar 9-12.** Untuk menghindari komputasi ulang vektor key dan value pada setiap langkah decoding, gunakan KV cache untuk menyimpan vektor-vektor ini untuk digunakan kembali.

KV cache hanya digunakan selama inferensi, bukan pelatihan. Selama pelatihan, karena semua token dalam urutan diketahui sebelumnya, generasi token berikutnya dapat dihitung sekaligus alih-alih secara sekuensial, seperti selama inferensi. Oleh karena itu, tidak perlu KV cache.

Karena menghasilkan token memerlukan perhitungan skor attention dengan semua token sebelumnya, jumlah komputasi attention tumbuh secara eksponensial dengan panjang urutan.22 Ukuran KV cache, di sisi lain, tumbuh secara linear dengan panjang urutan. Ukuran KV cache juga tumbuh dengan ukuran batch yang lebih besar. Makalah Google menghitung bahwa untuk model 500B+ dengan multi-head attention, ukuran batch 512, dan panjang konteks 2048, KV cache total 3TB (Pope et al., 2022). Ini tiga kali ukuran weight model tersebut.

Ukuran KV cache pada akhirnya dibatasi oleh penyimpanan perangkat keras yang tersedia, menciptakan bottleneck untuk menjalankan aplikasi dengan konteks panjang. Ukuran cache yang besar juga memakan waktu untuk dimuat ke memori, yang dapat menjadi masalah untuk aplikasi dengan latensi ketat. Persyaratan komputasi dan memori dari mekanisme attention adalah salah satu alasan mengapa sangat sulit untuk memiliki konteks yang lebih panjang.

Banyak teknik telah dikembangkan untuk membuat mekanisme attention lebih efisien. Secara umum, mereka jatuh ke dalam tiga kategori: mendesain ulang mekanisme attention, mengoptimalkan KV cache, dan menulis kernel untuk komputasi attention.

#### Menghitung Ukuran KV Cache

Memori yang dibutuhkan untuk KV cache, tanpa optimasi apa pun, dihitung sebagai berikut:

**2 × B × S × L × H × M**

- B: ukuran batch
- S: panjang urutan
- L: jumlah lapisan transformer
- H: dimensi model
- M: memori yang dibutuhkan untuk representasi numerik cache (misalnya, FP16 atau FP32).

Nilai ini dapat menjadi substansial seiring panjang konteks meningkat. Misalnya, LLama 2 13B memiliki 40 lapisan dan dimensi model 5.120. Dengan ukuran batch 32, panjang urutan 2.048, dan 2 byte per nilai, memori yang dibutuhkan untuk KV cache-nya, tanpa optimasi apa pun, adalah 2 × 32 × 2.048 × 40 × 5.120 × 2 = 54 GB.

**Mendesain ulang mekanisme attention.** Teknik-teknik ini melibatkan mengubah cara kerja mekanisme attention. Meskipun teknik-teknik ini membantu mengoptimalkan inferensi, karena mereka mengubah arsitektur model secara langsung, mereka hanya dapat diterapkan selama pelatihan atau fine-tuning.

Misalnya, saat menghasilkan token baru, alih-alih attending ke semua token sebelumnya, local windowed attention hanya attending ke jendela tetap token terdekat (Beltagy et al., 2020). Ini mengurangi panjang urutan efektif ke jendela ukuran tetap, mengurangi KV cache dan komputasi attention. Jika panjang urutan rata-rata adalah 10.000 token, attending ke jendela ukuran 1.000 token mengurangi ukuran KV cache 10 kali lipat.

Local windowed attention dapat diselang-selingi dengan global attention, dengan local attention menangkap konteks terdekat; global attention menangkap informasi spesifik tugas di seluruh dokumen.

Baik cross-layer attention (Brandon et al., 2024) maupun multi-query attention (Shazeer, 2019) mengurangi jejak memori KV cache dengan mengurangi jumlah pasangan key-value. Cross-layer attention berbagi vektor key dan value di seluruh lapisan yang berdekatan. Memiliki tiga lapisan yang berbagi vektor key-value yang sama berarti mengurangi KV cache tiga kali lipat. Di sisi lain, multi-query attention berbagi vektor key-value di seluruh kepala query.

Grouped-query attention (Ainslie et al., 2023) adalah generalisasi dari multi-query attention. Alih-alih menggunakan hanya satu set pasangan key-value untuk semua kepala query, grouped-query attention-nya menempatkan kepala query ke dalam grup yang lebih kecil dan berbagi pasangan key-value hanya di antara kepala query dalam grup yang sama. Ini memungkinkan keseimbangan yang lebih fleksibel antara jumlah kepala query dan jumlah pasangan key-value.

Character.AI, aplikasi chatbot AI, berbagi bahwa percakapan rata-rata mereka memiliki riwayat dialog 180 pesan (2024). Mengingat urutan yang biasanya panjang, bottleneck utama untuk throughput inferensi adalah ukuran KV cache. Tiga desain mekanisme attention—multi-query attention, menyelang-selingi local attention dan global attention, dan cross-layer attention—membantu mereka mengurangi KV cache lebih dari 20 kali lipat. Lebih penting lagi, pengurangan KV cache yang signifikan ini berarti bahwa memori tidak lagi menjadi bottleneck bagi mereka untuk melayani ukuran batch yang besar.

**Mengoptimalkan ukuran KV cache.** Cara KV cache dikelola sangat penting dalam mengurangi bottleneck memori selama inferensi dan memungkinkan ukuran batch yang lebih besar, terutama untuk aplikasi dengan konteks panjang. Banyak teknik sedang aktif dikembangkan untuk mengurangi dan mengelola KV cache.

Salah satu framework inferensi yang paling cepat berkembang, vLLM, gaining popularity karena memperkenalkan PagedAttention, yang mengoptimalkan manajemen memori dengan membagi KV cache menjadi blok yang tidak berdekatan, mengurangi fragmentasi, dan memungkinkan berbagi memori yang fleksibel untuk meningkatkan efisiensi serving LLM (Kwon et al., 2023).

Teknik lainnya termasuk quantisasi KV cache (Hooper et al., 2024; Kang et al., 2024), kompresi KV cache adaptif (Ge et al., 2023), dan KV cache selektif (Liu et al., 2024).

**Menulis kernel untuk komputasi attention.** Alih-alih mengubah desain mekanisme atau mengoptimalkan penyimpanan, pendekatan ini melihat bagaimana skor attention dihitung dan menemukan cara untuk membuat komputasi ini lebih efisien. Pendekatan ini paling efektif ketika memperhitungkan perangkat keras yang mengeksekusi komputasi.

Kode yang dioptimalkan untuk chip tertentu disebut kernel. Penulisan kernel akan dibahas lebih lanjut di bagian berikutnya.

Salah satu kernel yang paling terkenal yang dioptimalkan untuk komputasi attention adalah FlashAttention (Dao et al., 2022). Kernel ini menggabungkan bersama banyak operasi yang umum digunakan dalam model berbasis transformer untuk membuatnya berjalan lebih cepat, seperti yang ditunjukkan pada Gambar 9-13.

**Gambar 9-13.** FlashAttention adalah kernel yang menggabungkan beberapa operator umum bersama. Diadaptasi dari gambar asli yang dilisensikan di bawah BSD 3-Clause.

#### Kernel dan Compiler

Kernel adalah potongan kode khusus yang dioptimalkan untuk akselerator perangkat keras tertentu, seperti GPU atau TPU. Mereka biasanya ditulis untuk melakukan rutin intensif komputasi yang perlu dieksekusi berulang kali, sering secara paralel, untuk memaksimalkan performa akselerator ini.

Operasi AI umum, termasuk perkalian matriks, komputasi attention, dan operasi konvolusi, semuanya memiliki kernel khusus untuk membuat komputasi mereka lebih efisien pada perangkat keras yang berbeda.23

Menulis kernel memerlukan pemahaman mendalam tentang arsitektur perangkat keras yang mendasarinya. Ini termasuk pengetahuan tentang bagaimana hierarki memori terstruktur (seperti cache, memori global, memori bersama, dan register) dan bagaimana data diakses dan dipindahkan antara tingkat yang berbeda ini.

Lebih lanjut, kernel biasanya ditulis dalam bahasa pemrograman tingkat rendah seperti CUDA (untuk GPU NVIDIA), Triton (bahasa yang dikembangkan oleh OpenAI untuk menulis kernel khusus), dan ROCm (untuk GPU AMD). Bahasa-bahasa ini memungkinkan kontrol halus atas manajemen thread dan akses memori tetapi juga lebih sulit dipelajari daripada bahasa yang paling dikenal oleh insinyur AI, seperti Python.

Karena hambatan masuk ini, menulis kernel dulunya adalah seni gelap yang dipraktikkan oleh beberapa orang. Pembuat chip seperti NVIDIA dan AMD mempekerjakan insinyur optimasi untuk menulis kernel untuk membuat perangkat keras mereka efisien untuk beban kerja AI, sedangkan framework AI seperti PyTorch dan TensorFlow mempekerjakan insinyur kernel untuk mengoptimalkan framework mereka pada akselerator yang berbeda.

Namun, dengan meningkatnya permintaan untuk optimasi inferensi dan di mana-mana akselerator, lebih banyak insinyur AI tertarik pada penulisan kernel. Ada banyak tutorial online hebat untuk penulisan kernel. Di sini, saya akan membahas empat teknik umum yang sering digunakan untuk mempercepat komputasi:

**Vectorization**
Diberikan loop atau loop bersarang, alih-alih memproses satu elemen data pada satu waktu, secara simultan mengeksekusi beberapa elemen data yang berdekatan dalam memori. Ini mengurangi latensi dengan meminimalkan operasi I/O data.

**Parallelization**
Membagi array input (atau array n-dimensi) menjadi chunk independen yang dapat diproses secara simultan pada core atau thread yang berbeda, mempercepat komputasi.

**Loop tiling**
Mengoptimalkan urutan akses data dalam loop untuk tata letak memori dan cache perangkat keras. Optimasi ini tergantung pada perangkat keras. Pola tiling CPU yang efisien mungkin tidak bekerja dengan baik di GPU.

**Operator fusion**
Menggabungkan beberapa operator menjadi satu pass untuk menghindari akses memori yang redundan. Misalnya, jika dua loop beroperasi pada array yang sama, mereka dapat digabungkan menjadi satu, mengurangi jumlah kali data dibaca dan ditulis.

Sementara vectorization, parallelization, dan loop tiling dapat diterapkan secara luas di berbagai model, operator fusion memerlukan pemahaman yang lebih dalam tentang operator dan arsitektur spesifik model. Akibatnya, operator fusion menuntut lebih banyak perhatian dari insinyur optimasi.

Kernel dioptimalkan untuk arsitektur perangkat keras. Ini berarti bahwa setiap kali arsitektur perangkat keras baru diperkenalkan, kernel baru perlu dikembangkan. Misalnya, FlashAttention (Dao et al., 2022) awalnya dikembangkan terutama untuk GPU NVIDIA A100. Kemudian, FlashAttention-3 diperkenalkan untuk GPU H100 (Shah et al., 2024).

Skrip model menentukan serangkaian operasi yang perlu dilakukan untuk mengeksekusi model tersebut. Untuk menjalankan kode ini pada perangkat keras, seperti GPU, kode harus dikonversi ke bahasa yang kompatibel dengan perangkat keras tersebut. Proses ini disebut lowering.

Alat yang menurunkan kode untuk menjalankan perangkat keras tertentu disebut compiler. Compiler menjembatani model ML dan perangkat keras yang dijalankannya. Selama proses lowering, kapan pun memungkinkan, operasi ini dikonversi menjadi kernel khusus untuk berjalan lebih cepat pada perangkat keras target.

#### Studi Kasus Optimasi Inferensi dari PyTorch

Gambar 9-14 menunjukkan seberapa besar peningkatan throughput yang dapat diberikan tim PyTorch kepada Llama-7B melalui langkah-langkah optimasi berikut (PyTorch, 2023):

1. Panggil torch.compile untuk mengompilasi model menjadi kernel yang lebih efisien.
2. Kuantisasi weight model ke INT8.
3. Lebih lanjut kuantisasi weight model ke INT4.
4. Tambahkan speculative decoding.

**Gambar 9-14.** Peningkatan throughput oleh teknik optimasi yang berbeda di PyTorch. Gambar dari PyTorch (2023).

Eksperimen dijalankan pada GPU A100 dengan memori 80 GB. Tidak jelas bagaimana langkah-langkah optimasi ini mempengaruhi kualitas output model.

Compiler dapat menjadi alat mandiri, seperti Apache TVM dan MLIR (Multi-Level Intermediate Representation) atau terintegrasi ke dalam framework ML dan inferensi, seperti torch.compile (fitur di PyTorch), XLA (Accelerated Linear Algebra, awalnya dikembangkan oleh TensorFlow, dengan versi open source yang disebut OpenXLA), dan compiler yang dibangun ke dalam TensorRT, yang dioptimalkan untuk GPU NVIDIA. Perusahaan AI mungkin memiliki compiler mereka sendiri, dengan kernel proprietari mereka yang dirancang untuk mempercepat beban kerja mereka sendiri.24

### Optimasi Layanan Inferensi

Sebagian besar teknik optimasi tingkat layanan berfokus pada manajemen sumber daya. Diberikan jumlah sumber daya yang tetap (komputasi dan memori) dan beban kerja yang dinamis (permintaan inferensi dari pengguna yang mungkin melibatkan model yang berbeda), tujuannya adalah mengalokasikan sumber daya secara efisien ke beban kerja ini untuk mengoptimalkan latensi dan biaya. Tidak seperti banyak teknik tingkat model, teknik tingkat layanan tidak memodifikasi model dan tidak boleh mengubah kualitas output.

#### Batching

Salah satu cara termudah untuk mengurangi biaya Anda adalah batching. Dalam produksi, layanan inferensi Anda mungkin menerima banyak permintaan secara bersamaan. Alih-alih memproses setiap permintaan secara terpisah, batching permintaan yang tiba sekitar waktu yang sama bersama-sama dapat secara signifikan mengurangi throughput layanan. Jika memproses setiap permintaan secara terpisah seperti setiap orang mengendarai mobil mereka sendiri, batching seperti menempatkan mereka bersama-sama di bus. Bus dapat memindahkan lebih banyak orang, tetapi juga dapat membuat perjalanan setiap orang lebih lama. Namun, jika Anda melakukannya dengan cerdas, dampak pada latensi dapat minimal.

Tiga teknik utama untuk batching adalah: static batching, dynamic batching, dan continuous batching.

Teknik batching paling sederhana adalah static batching. Layanan mengelompokkan sejumlah input tetap dalam satu batch. Ini seperti bus yang menunggu hingga setiap kursi terisi sebelum berangkat. Kelemahan dari static batching adalah bahwa semua permintaan harus menunggu hingga batch penuh untuk dieksekusi. Dengan demikian permintaan pertama dalam batch ditunda hingga permintaan terakhir batch tiba, tidak peduli seberapa terlambat permintaan terakhir.

Dynamic batching, di sisi lain, menetapkan jendela waktu maksimum untuk setiap batch. Jika ukuran batch adalah empat dan jendela adalah 100 ms, server memproses batch baik ketika memiliki empat permintaan atau ketika 100 ms telah berlalu, mana yang terjadi lebih dulu. Ini seperti bus yang berangkat sesuai jadwal tetap atau ketika penuh. Pendekatan ini menjaga latensi terkendali, sehingga permintaan sebelumnya tidak tertahan oleh yang berikutnya. Kelemahannya adalah bahwa batch mungkin tidak selalu penuh saat diproses, mungkin menyebabkan komputasi yang terbuang. Static batching dan dynamic batching divisualisasikan pada Gambar 9-15.

**Gambar 9-15.** Dynamic batching menjaga latensi terkelola tetapi mungkin kurang efisien secara komputasi.

Dalam implementasi batching naif, semua permintaan batch harus diselesaikan sebelum respons mereka dikembalikan. Untuk LLM, beberapa permintaan mungkin memakan waktu jauh lebih lama daripada yang lain. Jika satu permintaan dalam batch hanya menghasilkan 10 token respons dan permintaan lain menghasilkan 1.000 token respons, respons pendek harus menunggu hingga respons panjang diselesaikan sebelum dikembalikan kepada pengguna. Ini menghasilkan latensi yang tidak perlu untuk permintaan pendek.

Continuous batching memungkinkan respons dalam batch dikembalikan kepada pengguna segera setelah selesai. Ini bekerja dengan secara selektif batching operasi yang tidak menyebabkan generasi satu respons menahan yang lain, seperti yang diperkenalkan dalam makalah Orca (Yu et al., 2022). Setelah permintaan dalam batch selesai dan responsnya dikembalikan, layanan dapat menambahkan permintaan lain ke batch di tempatnya, membuat batching menjadi kontinu. Ini seperti bus yang, setelah menurunkan satu penumpang, dapat segera mengambil penumpang lain untuk memaksimalkan tingkat okupansinya. Continuous batching, juga disebut in-flight batching, divisualisasikan pada Gambar 9-16.

**Gambar 9-16.** Dengan continuous batching, respons yang selesai dapat dikembalikan segera kepada pengguna, dan permintaan baru dapat diproses di tempatnya.

#### Decoupling Prefill dan Decode

Inferensi LLM terdiri dari dua langkah: prefill dan decode. Karena prefill adalah compute-bound dan decode adalah memory bandwidth-bound, menggunakan mesin yang sama untuk melakukan keduanya dapat menyebabkan mereka bersaing secara tidak efisien untuk sumber daya dan secara signifikan memperlambat TTFT dan TPOT. Bayangkan GPU yang sudah menangani prefilling dan decoding dekat kapasitas komputasi puncaknya. Mungkin dapat menangani pekerjaan komputasi rendah lain seperti decoding. Namun, menambahkan query baru ke GPU ini berarti memperkenalkan pekerjaan prefilling bersama dengan pekerjaan decoding. Satu pekerjaan prefilling ini dapat menguras sumber daya komputasi dari pekerjaan decoding yang ada, memperlambat TPOT untuk permintaan ini.

Satu teknik optimasi umum untuk server inferensi adalah memisahkan prefill dan decode. "DistServe" (Zhong et al., 2024) dan "Inference Without Interference" (Hu et al., 2024) menunjukkan bahwa untuk berbagai LLM dan aplikasi populer, menetapkan operasi prefill dan decode ke instance yang berbeda (misalnya, GPU yang berbeda) dapat secara signifikan meningkatkan volume permintaan yang diproses sambil mematuhi persyaratan latensi. Meskipun decoupling memerlukan transfer state perantara dari instance prefill ke instance decode, makalah menunjukkan overhead komunikasi tidak substansial dalam cluster GPU modern dengan koneksi bandwidth tinggi seperti NVLink dalam satu node.

Rasio instance prefill ke instance decode tergantung pada banyak faktor, seperti karakteristik beban kerja (misalnya, panjang input yang lebih panjang memerlukan lebih banyak komputasi prefill) dan persyaratan latensi (misalnya, apakah Anda ingin TTFT atau TPOT yang lebih rendah). Misalnya, jika urutan input biasanya panjang dan Anda ingin memprioritaskan TTFT, rasio ini dapat antara 2:1 dan 4:1. Jika urutan input pendek dan Anda ingin memprioritaskan TPOT, rasio ini dapat 1:2 hingga 1:1.25

#### Prompt Caching

Banyak prompt dalam aplikasi memiliki segmen teks yang tumpang tindih. Prompt cache menyimpan segmen yang tumpang tindih ini untuk digunakan kembali, sehingga Anda hanya perlu memprosesnya sekali. Segmen teks yang tumpang tindih umum dalam prompt yang berbeda adalah system prompt. Tanpa prompt cache, model Anda perlu memproses system prompt dengan setiap query. Dengan prompt cache, system prompt perlu diproses hanya sekali untuk query pertama.

Prompt caching berguna untuk query yang melibatkan dokumen panjang. Misalnya, jika banyak query pengguna Anda terkait dengan dokumen panjang yang sama (seperti buku atau codebase), dokumen panjang ini dapat di-cache untuk digunakan kembali di seluruh query. Ini juga berguna untuk percakapan panjang ketika pemrosesan pesan sebelumnya dapat di-cache dan digunakan kembali saat memprediksi pesan masa depan.

Prompt cache divisualisasikan pada Gambar 9-17. Ini juga disebut context cache atau prefix cache.

**Gambar 9-17.** Dengan prompt cache, segmen yang tumpang tindih dalam prompt yang berbeda dapat di-cache dan digunakan kembali.

Untuk aplikasi dengan system prompt yang panjang, prompt caching dapat secara signifikan mengurangi latensi dan biaya. Jika system prompt Anda adalah 1.000 token, dan aplikasi Anda menghasilkan satu juta panggilan API model setiap hari, prompt cache akan menyelamatkan Anda dari memproses sekitar satu miliar token input repetitif sehari! Namun, ini tidak sepenuhnya gratis. Seperti KV cache, ukuran prompt cache bisa cukup besar dan memakan ruang memori. Kecuali Anda menggunakan API model dengan fungsionalitas ini, mengimplementasikan prompt caching dapat memerlukan upaya engineering yang signifikan.

Sejak diperkenalkan pada November 2023 oleh Gim et al., prompt cache telah dengan cepat digabungkan ke dalam API model. Hingga saat ini, Google Gemini menawarkan fungsionalitas ini, dengan token input yang di-cache diberikan diskon 75% dibandingkan dengan token input biasa, tetapi Anda harus membayar ekstra untuk penyimpanan cache (hingga saat ini, $1,00/juta token per jam). Anthropic menawarkan prompt caching yang menjanjikan penghematan biaya hingga 90% (semakin panjang konteks yang di-cache, semakin tinggi penghematan) dan pengurangan latensi hingga 75%. Dampak prompt caching pada biaya dan latensi skenario yang berbeda ditunjukkan pada Tabel 9-3.26

**Tabel 9-3.** Biaya dan latensi yang dikurangi oleh prompt caching. Informasi dari Anthropic (2024).

| Kasus penggunaan | Latensi tanpa caching (time to first token) | Latensi dengan caching (time to first token) | Pengurangan biaya |
|---|---|---|---|
| Chat dengan buku (prompt yang di-cache 100.000 token) | 11,5 s | 2,4 s (–79%) | –90% |
| Many-shot prompting (prompt 10.000 token) | 1,6 s | 1,1 s (–31%) | –86% |
| Percakapan multi-turn (percakapan 10-turn dengan system prompt panjang) | ~10 s | ~2,5 s (–75%) | –53% |

#### Parallelism

Akselerator dirancang untuk pemrosesan paralel, dan strategi parallelism adalah tulang punggung komputasi berperforma tinggi. Banyak strategi parallelism baru sedang dikembangkan. Bagian ini hanya mencakup beberapa di antaranya untuk referensi. Dua keluarga strategi parallelism yang dapat diterapkan di seluruh model adalah data parallelism dan model parallelism. Keluarga strategi yang diterapkan khusus untuk LLM adalah context dan sequence parallelism. Teknik optimasi mungkin melibatkan beberapa strategi parallelism.

**Replica parallelism** adalah strategi paling langsung untuk diimplementasikan. Ini hanya membuat beberapa replika dari model yang ingin Anda layani.27 Lebih banyak replika memungkinkan Anda menangani lebih banyak permintaan pada waktu yang sama, berpotensi dengan biaya menggunakan lebih banyak chip.

Mencoba memuat model dengan ukuran yang berbeda ke chip yang berbeda adalah masalah bin-packing, yang bisa menjadi rumit dengan lebih banyak model, lebih banyak replika, dan lebih banyak chip.

Katakanlah Anda memiliki campuran model dengan ukuran yang berbeda (misalnya, 8B, 13B, 34B, dan 70B parameter) dan akses ke GPU dengan kemampuan memori yang berbeda (misalnya, 24 GB, 40 GB, 48 GB, dan 80 GB). Untuk kesederhanaan, asumsikan bahwa semua model dalam presisi yang sama, 8 bit:

- Jika Anda memiliki jumlah chip yang tetap, Anda perlu memutuskan berapa banyak replika yang akan dibuat untuk setiap model dan GPU apa yang digunakan untuk setiap replika untuk memaksimalkan metrik Anda. Misalnya, haruskah Anda menempatkan tiga model 13B pada GPU 40 GB, atau haruskah Anda menyimpan GPU ini untuk satu model 34B?
- Jika Anda memiliki jumlah replika model yang tetap, Anda perlu memutuskan chip apa yang akan diperoleh untuk meminimalkan biaya. Situasi ini, however, jarang terjadi.

Sering kali, model Anda begitu besar sehingga tidak dapat muat ke dalam satu mesin. Model parallelism merujuk pada praktik membagi model yang sama di beberapa mesin. Memuat model ke chip dapat menjadi masalah yang bahkan lebih rumit dengan model parallelism.

Ada beberapa cara untuk membagi model. Pendekatan paling umum untuk inferensi adalah tensor parallelism, juga dikenal sebagai intra-operator parallelism. Inferensi melibatkan urutan operator pada tensor multidimensi, seperti perkalian matriks. Dalam pendekatan ini, tensor yang terlibat dalam operator dipartisi di beberapa perangkat, secara efektif memecah operator ini menjadi potongan-potongan yang lebih kecil untuk dieksekusi secara paralel, sehingga mempercepat komputasi. Misalnya, saat mengalikan dua matriks, Anda dapat membagi salah satu matriks secara kolom, seperti yang ditunjukkan pada Gambar 9-18.

Tensor parallelism memberikan dua manfaat. Pertama, ini memungkinkan untuk melayani model besar yang tidak muat pada mesin tunggal. Kedua, ini mengurangi latensi. Manfaat latensi, however, mungkin berkurang karena overhead komunikasi tambahan.

**Gambar 9-18.** Tensor parallelism untuk perkalian matriks.

Cara lain untuk membagi model adalah pipeline parallelism, yang melibatkan membagi komputasi model menjadi tahapan yang berbeda dan menetapkan setiap tahap ke perangkat yang berbeda. Saat data mengalir melalui model, setiap tahap memproses satu bagian sementara yang lain memproses bagian berikutnya, memungkinkan komputasi yang tumpang tindih. Gambar 9-19 menunjukkan seperti apa pipeline parallelism pada empat mesin.

**Gambar 9-19.** Pipeline parallelism memungkinkan pemisahan model dieksekusi secara paralel.

Gambar 9-19 menunjukkan bahwa batch dapat dibagi menjadi micro-batch yang lebih kecil. Setelah micro-batch diproses pada satu mesin, outputnya diteruskan ke bagian berikutnya dari model pada mesin berikutnya.

Meskipun pipeline parallelism memungkinkan melayani model besar pada beberapa mesin, ini meningkatkan latensi total untuk setiap permintaan karena komunikasi tambahan antara tahapan pipeline. Oleh karena itu, untuk aplikasi dengan persyaratan latensi yang ketat, pipeline parallelism biasanya dihindari demi replica parallelism. Namun, pipeline parallelism umum digunakan dalam pelatihan karena dapat membantu meningkatkan throughput.

Dua teknik yang kurang umum tetapi mungkin memerlukan sebutan cepat untuk mengilustrasikan keragaman teknik adalah context parallelism dan sequence parallelism. Keduanya dikembangkan untuk membuat pemrosesan urutan input panjang lebih efisien, termasuk context parallelism dan sequence parallelism.

Dalam context parallelism, urutan input itu sendiri dibagi di perangkat yang berbeda untuk diproses secara terpisah. Misalnya, setengah pertama dari input diproses pada mesin 1 dan setengah kedua pada mesin 2.

Dalam sequence parallelism, operator yang diperlukan untuk seluruh input dibagi di mesin. Misalnya, jika input memerlukan komputasi attention dan feedforward, attention mungkin diproses pada mesin 1 sedangkan feedforward diproses pada mesin 2.

## Ringkasan

Kegunaan model sangat tergantung pada biaya inferensi dan latensinya. Inferensi yang lebih murah membuat keputusan berbasis AI lebih terjangkau, sementara inferensi yang lebih cepat memungkinkan integrasi AI ke lebih banyak aplikasi. Mengingat dampak potensial yang besar dari optimasi inferensi, ini telah menarik banyak individu berbakat yang terus-menerus datang dengan pendekatan inovatif.

Sebelum kita mulai membuat sesuatu lebih efisien, kita perlu memahami bagaimana efisiensi diukur. Bab ini dimulai dengan metrik efisiensi umum untuk latensi, throughput, dan utilisasi. Untuk inferensi berbasis model bahasa, latensi dapat dipecah menjadi time to first token (TTFT), yang dipengaruhi oleh fase prefilling, dan time per output token (TPOT), yang dipengaruhi oleh fase decoding. Metrik throughput terkait langsung dengan biaya. Ada trade-off antara latensi dan throughput. Anda berpotensi mengurangi biaya jika Anda baik-baik saja dengan latensi yang meningkat, dan mengurangi latensi sering melibatkan peningkatan biaya.

Seberapa efisien model dapat berjalan tergantung pada perangkat keras yang dijalankannya. Untuk alasan ini, bab ini juga memberikan gambaran singkat tentang perangkat keras AI dan apa yang diperlukan untuk mengoptimalkan model pada akselerator yang berbeda.

Bab ini kemudian melanjutkan dengan berbagai teknik untuk optimasi inferensi. Mengingat ketersediaan API model, sebagian besar pengembang aplikasi akan menggunakan API ini dengan optimasi bawaan mereka alih-alih mengimplementasikan teknik ini sendiri. Meskipun teknik-teknik ini mungkin tidak relevan bagi semua pengembang aplikasi, saya percaya bahwa memahami teknik apa yang mungkin dapat membantu untuk mengevaluasi efisiensi API model.

Bab ini juga berfokus pada optimasi di tingkat model dan tingkat layanan inferensi. Optimasi tingkat model sering memerlukan mengubah model itu sendiri, yang dapat menyebabkan perubahan dalam perilaku model. Optimasi tingkat layanan inferensi, di sisi lain, biasanya menjaga model tetap utuh dan hanya mengubah cara dilayaninya.

Teknik tingkat model termasuk teknik yang tidak tergantung model seperti quantization dan distilasi. Arsitektur model yang berbeda memerlukan optimasi mereka sendiri. Misalnya, karena bottleneck utama model transformer adalah dalam mekanisme attention, banyak teknik optimasi melibatkan membuat attention lebih efisien, termasuk manajemen KV cache dan menulis kernel attention. Bottleneck besar untuk model bahasa autoregresif adalah dalam proses decoding autoregresifnya, dan akibatnya, banyak teknik telah dikembangkan untuk mengatasinya juga.

Teknik tingkat layanan inferensi termasuk berbagai strategi batching dan parallelism. Ada juga teknik yang dikembangkan khusus untuk model bahasa autoregresif, termasuk decoupling prefilling/decoding dan prompt caching.

Pilihan teknik optimasi tergantung pada beban kerja Anda. Misalnya, KV caching secara signifikan lebih penting untuk beban kerja dengan konteks panjang daripada yang dengan konteks pendek. Prompt caching, di sisi lain, sangat penting untuk beban kerja yang melibatkan segmen prompt yang panjang dan tumpang tindih atau percakapan multi-turn. Pilihan juga tergantung pada persyaratan performa Anda. Misalnya, jika latensi rendah adalah prioritas lebih tinggi daripada biaya, Anda mungkin ingin meningkatkan skala replica parallelism. Meskipun lebih banyak replika memerlukan mesin tambahan, setiap mesin menangani lebih sedikit permintaan, memungkinkannya mengalokasikan lebih banyak sumber daya per permintaan dan, dengan demikian, meningkatkan waktu respons.

Namun, di berbagai kasus penggunaan, teknik yang paling berdampak biasanya adalah quantization (yang umumnya bekerja baik di seluruh model), tensor parallelism (yang mengurangi latensi dan memungkinkan melayani model yang lebih besar), replica parallelism (yang relatif langsung untuk diimplementasikan), dan optimasi mekanisme attention (yang dapat secara signifikan mempercepat model transformer).

Optimasi inferensi menyimpulkan daftar teknik adaptasi model yang dibahas dalam buku ini. Bab berikutnya akan mengeksplorasi cara mengintegrasikan teknik-teknik ini ke dalam sistem yang kohesif.
