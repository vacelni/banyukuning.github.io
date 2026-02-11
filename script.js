/* ========================================
   DESA BANYUKUNING - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  // --- NAVBAR SCROLL ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.remove('transparent');
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('scrolled');
      }
    }
    // Check if on home page (has hero)
    if (document.querySelector('.hero')) {
      navbar.classList.add('transparent');
      window.addEventListener('scroll', handleScroll);
    } else {
      navbar.classList.add('scrolled');
    }
  }

  // --- MOBILE NAV ---
  const navToggle = document.querySelector('.navbar-toggle');
  const mobileNav = document.querySelector('.navbar-mobile');
  const mobileClose = document.querySelector('.mobile-close');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // --- HERO SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length > 0) {
    showSlide(0);
    slideInterval = setInterval(nextSlide, 5000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(i);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // --- DATE & TIME ---
  const dateDisplay = document.getElementById('dateDisplay');
  const timeDisplay = document.getElementById('timeDisplay');

  function updateDateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (dateDisplay) {
      dateDisplay.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
    if (timeDisplay) {
      timeDisplay.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    }
  }

  if (dateDisplay || timeDisplay) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // --- PRAYER SCHEDULE (Aladhan API) ---
  async function fetchPrayerTimes() {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Semarang&country=Indonesia&method=20`);
      const data = await res.json();
      const timings = data.data.timings;

      const prayerMap = {
        'subuh': timings.Fajr,
        'dzuhur': timings.Dhuhr,
        'ashar': timings.Asr,
        'maghrib': timings.Maghrib,
        'isya': timings.Isha,
      };

      Object.keys(prayerMap).forEach(key => {
        const el = document.getElementById('prayer-' + key);
        if (el) el.textContent = prayerMap[key];
      });

      // Highlight current prayer
      highlightCurrentPrayer(prayerMap);
    } catch (err) {
      console.log('Prayer API error:', err);
    }
  }

  function highlightCurrentPrayer(prayerMap) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const entries = Object.entries(prayerMap);
    let currentPrayer = entries[entries.length - 1][0]; // default isya

    for (let i = 0; i < entries.length; i++) {
      const [, time] = entries[i];
      const [h, m] = time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (currentMinutes < prayerMinutes) {
        currentPrayer = i > 0 ? entries[i - 1][0] : entries[entries.length - 1][0];
        break;
      }
      if (i === entries.length - 1) {
        currentPrayer = entries[i][0];
      }
    }

    document.querySelectorAll('.prayer-item').forEach(el => {
      el.classList.remove('current');
    });
    const currentEl = document.getElementById('item-' + currentPrayer);
    if (currentEl) currentEl.classList.add('current');
  }

  if (document.querySelector('.prayer-card')) {
    fetchPrayerTimes();
  }

  // --- COUNTER ANIMATION ---
  function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 80;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.innerHTML = Math.floor(current).toLocaleString('id-ID') + (suffix ? '<span class="counter-suffix">' + suffix + '</span>' : '');
    }, 20);
  }

  const counterSection = document.querySelector('.counter-section');
  let counterAnimated = false;

  if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
          counterAnimated = true;
          document.querySelectorAll('.counter-number').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counterSection);
  }

  // --- FADE UP ANIMATION ---
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // --- BERITA MODAL ---
  window.openBeritaModal = function (id) {
    const data = beritaData[id];
    if (!data) return;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalImg').alt = data.title;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalContent').innerHTML = data.content;
    document.querySelector('.modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    document.querySelector('.modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelector('.modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) window.closeModal();
  });

  // --- GALERI LIGHTBOX ---
  window.openLightbox = function (src, caption) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox')?.addEventListener('click', function (e) {
    if (e.target === this) window.closeLightbox();
  });

  // --- PENGADUAN FORM -> WHATSAPP ---
  const pengaduanForm = document.getElementById('pengaduanForm');
  if (pengaduanForm) {
    pengaduanForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = document.getElementById('nama').value;
      const nik = document.getElementById('nik').value;
      const kategori = document.getElementById('kategori').value;
      const pesan = document.getElementById('pesan').value;

      const text = `*PENGADUAN DESA BANYUKUNING*%0A%0A*Nama:* ${encodeURIComponent(nama)}%0A*NIK:* ${encodeURIComponent(nik)}%0A*Kategori:* ${encodeURIComponent(kategori)}%0A*Isi Pengaduan:*%0A${encodeURIComponent(pesan)}`;
      const waNumber = '6282100000000';
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    });
  }

  // --- ACTIVE NAV LINK ---
  const currentPage = window.location.pathname.split('/').pop() || 'beranda.html';
  document.querySelectorAll('.navbar-menu a, .navbar-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'beranda.html') || (currentPage === 'index.html' && href === 'beranda.html')) {
      link.classList.add('active');
    }
  });

});

// --- BERITA DATA ---
const beritaData = {
  1: {
    title: 'Musyawarah Desa Tentang Pembangunan Infrastruktur 2025',
    img: 'images/berita1.jpeg',
    date: '15 Januari 2025',
    content: '<p>Pemerintah Desa Banyukuning mengadakan Musyawarah Desa (Musdes) pada tanggal 15 Januari 2025 di Balai Desa Banyukuning. Musyawarah ini dihadiri oleh seluruh perangkat desa, BPD, tokoh masyarakat, dan perwakilan warga dari setiap dusun.</p><p style="margin-top:12px">Dalam musyawarah ini dibahas mengenai rencana pembangunan infrastruktur tahun 2025, meliputi perbaikan jalan desa sepanjang 3 km di Dusun Krajan, pembangunan drainase di Dusun Ngasem, dan renovasi balai pertemuan di Dusun Jatisari. Total anggaran yang dialokasikan mencapai Rp 850 juta dari dana desa dan bantuan provinsi.</p><p style="margin-top:12px">Kepala Desa Banyukuning menyampaikan bahwa pembangunan ini merupakan prioritas untuk meningkatkan kualitas hidup masyarakat dan mendukung sektor pertanian yang menjadi mata pencaharian utama warga.</p>'
  },
  2: {
    title: 'Warga Dusun Gentan Melakukan Tradisi Nyadran',
    img: 'images/berita2.jpeg',
    date: '30 Januari 2026',
    content: '<p>Para Warga dusun Gentan melakukan tradisi Nyadran pada tanggal 30 Januari 2026. Tradisi ini merupakan bagian dari upaya melestarikan budaya lokal Desa Banyukuning.</p><p style="margin-top:12px">Kegiatan Nyadran ini melibatkan seluruh warga dusun Gentan dan diikuti oleh tokoh masyarakat serta perwakilan dari dusun lainnya.</p>'
  },
  3: {
    title: 'Pelatihan Pembuatan Lilin Aromaterapi untuk Warga Desa',
    img: 'images/berita3.jpeg',
    date: '26 Januari 2026',
    content: '<p>KKN UNNES dan KKN UNS berkolaborasi untuk melaksanakan pelatihan pembuatan lilin aromaterapi dari minyak jelantah. Acara ini diikuti oleh ibu-ibu PKK Desa Banyukuning.</p><p style="margin-top:12px">Pelatihan ini diikuti oleh 50 ibu-ibu PKK desa Banyukuning. Materi yang disampaikan meliputi cara memanfaatkan minyak jelantah sebagai bahan baku dan pembuatan lilin aromaterapi.</p><p style="margin-top:12px">Diharapkan setelah pelatihan ini, para ibu-ibu PKK dapat membuat lilin aromaterapi sendiri di rumah masing-masing.</p>'
  },
  4: {
    title: 'Gotong Royong Bersih Saluran Air Sebelum Ramadhan',
    img: 'images/berita4.jpeg',
    date: '31 Januari 2026',
    content: '<p>Dalam rangka menyambut Bulan Ramadhan, seluruh warga Desa Banyukuning mengadakan gotong royong bersih saluran air pada tanggal 31 Januari 2026. Kegiatan ini diikuti oleh warga dari semua dusun.</p><p style="margin-top:12px">Kegiatan meliputi pembersihan jalan, selokan, dan kali.</p>'
  },
  5: {
    title: 'Posyandu Lansia dan Balita Rutin Bulan Ini',
    img: 'images/berita5.jpeg',
    date: '10 Februari 2026',
    content: '<p>Posyandu rutin bulan Februari 2026 telah dilaksanakan di setiap dusun di Desa Banyukuning. Kegiatan ini melayani pemeriksaan kesehatan lansia dan penimbangan balita.</p><p style="margin-top:12px">Petugas kesehatan dari Puskesmas hadir memberikan pelayanan pemeriksaan tekanan darah, gula darah, serta konsultasi kesehatan bagi lansia. Untuk balita, dilakukan penimbangan berat badan, pengukuran tinggi badan, dan pemberian vitamin A.</p>'
  },
  6: {
    title: 'Festival Budaya Desa Banyukuning 2025',
    img: 'images/berita6.jpeg',
    date: '15 Oktober 2025',
    content: '<p>Desa Banyukuning menyelenggarakan Festival Budaya tahunan pada tanggal 15 Oktober 2025. Festival ini menampilkan berbagai kesenian tradisional Jawa Tengah termasuk tari gambyong, wayang kulit, dan pertunjukan seni musik tradisional.</p><p style="margin-top:12px">Festival ini bertujuan untuk melestarikan budaya lokal dan menarik wisatawan ke Desa Banyukuning. Acara ini dihadiri oleh ribuan pengunjung dari berbagai daerah.</p>'
  }
};

