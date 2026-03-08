/**
 * i18n Dictionary — vi / en / de
 * Add all UI strings here. Access via useTranslation() hook.
 */

export type Locale = 'en' | 'vi' | 'de';

export const LOCALES: Locale[] = ['en', 'vi', 'de'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  de: 'Deutsch',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'EN',
  vi: '🇻🇳',
  de: '🇩🇪',
};

// ─── Dictionary type ──────────────────────────────────────────────────────────

export interface Dictionary {
  // Site-wide
  site: {
    name: string;
    tagline: string;
    description: string;
  };

  // Navigation
  nav: {
    home: string;
    garden: string;
    projects: string;
    german: string;
    wanderlust: string;
    search: string;
  };

  // Home page
  home: {
    location: string;
    labelListening: string;
    labelGetInTouch: string;
    labelDailyChallenge: string;
    labelWeather: string;
    labelWordOfDay: string;
    labelQuote: string;
    labelMarkets: string;
    labelProjects: string;
    labelGarden: string;
    labelAbout: string;
    aboutHero: string;
    viewAll: string;
  };

  // Garden section
  garden: {
    title: string;
    description: string;
    readMore: string;
    minRead: string;
    publishedOn: string;
    tags: string;
    tableOfContents: string;
    backToGarden: string;
    noArticles: string;
    filterByTag: string;
    searchPlaceholder: string;
  };

  // German section
  german: {
    title: string;
    description: string;
    latestNews: string;
    readOriginal: string;
    translated: string;
    wordOfDay: string;
    listenAudio: string;
    sourceArticle: string;
    loadingNews: string;
    errorNews: string;
    pronunciation: string;
    example: string;
    definition: string;
  };

  // Wanderlust section
  wanderlust: {
    title: string;
    description: string;
    visitedPlaces: string;
    mapLegend: string;
    photos: string;
    checkedIn: string;
    viewOnMap: string;
  };

  // Projects
  projects: {
    title: string;
    description: string;
    tryIt: string;
    sourceCode: string;
    backToProjects: string;
    chat: {
      title: string;
      description: string;
      placeholder: string;
      send: string;
      thinking: string;
      you: string;
    };
    codeSandbox: {
      title: string;
      description: string;
      run: string;
      running: string;
      output: string;
      description2: string;
      difficulty: string;
      language: string;
      reset: string;
      submit: string;
    };
    doodleClassifier: {
      title: string;
      description: string;
      draw: string;
      classify: string;
      result: string;
      clear: string;
      topPredictions: string;
    };
    ielts: {
      title: string;
      description: string;
      writing: string;
      speaking: string;
      submit: string;
      evaluating: string;
      yourScore: string;
      feedback: string;
      essayPlaceholder: string;
      minWords: string;
    };
    stocks: {
      title: string;
      description: string;
      search: string;
      price: string;
      change: string;
      volume: string;
      prediction: string;
      chart: string;
    };
    aiRoaster: {
      title: string;
      description: string;
      placeholder: string;
      roast: string;
      roasting: string;
    };
    objectDetection: {
      title: string;
      description: string;
      upload: string;
      detect: string;
      detecting: string;
      objects: string;
      confidence: string;
    };
  };

  // Contact form
  contact: {
    title: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    successTitle: string;
    successMsg: string;
    errorMsg: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
  };

  // API check
  apiCheck: {
    title: string;
    description: string;
    checking: string;
    online: string;
    offline: string;
    unknown: string;
    lastChecked: string;
    recheck: string;
  };

  // Footer
  footer: {
    builtWith: string;
    rights: string;
    darkMode: string;
    lightMode: string;
  };

  // Weather widget
  weather: {
    title: string;
    loading: string;
    feelsLike: string;
    humidity: string;
    wind: string;
    live: string;
    cached: string;
  };

  // Quote widget
  quote: {
    loading: string;
    source: string;
  };

  // Search
  search: {
    title: string;
    placeholder: string;
    results: string;
    noResults: string;
    searching: string;
    all: string;
  };

  // Error states
  errors: {
    notFound: string;
    notFoundDesc: string;
    serverError: string;
    serverErrorDesc: string;
    loading: string;
    retry: string;
    backHome: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    close: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    yes: string;
    no: string;
    or: string;
    and: string;
    by: string;
    on: string;
    at: string;
    from: string;
    to: string;
    new: string;
    beta: string;
    comingSoon: string;
    learnMore: string;
  };
}

// ─── English ──────────────────────────────────────────────────────────────────

const en: Dictionary = {
  site: {
    name: 'Magnus',
    tagline: 'Engineer & Designer',
    description: 'Building at the intersection of details and dreams.',
  },
  nav: {
    home: 'Home',
    garden: 'Garden',
    projects: 'Projects',
    german: 'German',
    wanderlust: 'Wanderlust',
    search: 'Search',
  },
  home: {
    location: 'Bach Khoa, District 10, HCMC',
    labelListening: 'Listening',
    labelGetInTouch: 'Get in Touch',
    labelDailyChallenge: 'Daily Challenge',
    labelWeather: 'Weather',
    labelWordOfDay: 'Word of the Day',
    labelQuote: 'Quote',
    labelMarkets: 'Markets',
    labelProjects: 'Projects',
    labelGarden: 'Garden',
    labelAbout: 'About',
    aboutHero:
      'Hi, I\'m Anh Khoa (Magnus) — a developer and designer from Vietnam. I build AI-powered tools, write about software craft, learn German, and explore the world.',
    viewAll: 'View All',
  },
  garden: {
    title: 'Digital Garden',
    description:
      'Personal growth, engineering notes, reflections, and essays. A living collection of ideas.',
    readMore: 'Read more',
    minRead: 'min read',
    publishedOn: 'Published on',
    tags: 'Tags',
    tableOfContents: 'Table of Contents',
    backToGarden: '← Back to Garden',
    noArticles: 'No articles found.',
    filterByTag: 'Filter by tag',
    searchPlaceholder: 'Search articles…',
  },
  german: {
    title: 'Deutsch lernen',
    description: 'Latest German news with translations, word of the day, and audio.',
    latestNews: 'Latest News',
    readOriginal: 'Read original',
    translated: 'Translated',
    wordOfDay: 'Word of the Day',
    listenAudio: 'Listen',
    sourceArticle: 'Source',
    loadingNews: 'Loading news…',
    errorNews: 'Could not load news. Please try again.',
    pronunciation: 'Pronunciation',
    example: 'Example',
    definition: 'Definition',
  },
  wanderlust: {
    title: 'Wanderlust',
    description: 'Places visited, maps, and memories.',
    visitedPlaces: 'Visited Places',
    mapLegend: 'Map Legend',
    photos: 'Photos',
    checkedIn: 'Checked in',
    viewOnMap: 'View on map',
  },
  projects: {
    title: 'Projects',
    description: 'Experiments, tools, and playgrounds.',
    tryIt: 'Try it',
    sourceCode: 'Source code',
    backToProjects: '← Back to Projects',
    chat: {
      title: 'AI Chat',
      description: 'Chat with a large language model powered by Groq.',
      placeholder: 'Ask me anything…',
      send: 'Send',
      thinking: 'Thinking…',
      you: 'You',
    },
    codeSandbox: {
      title: 'Code Sandbox',
      description: 'Execute code online. Daily LeetCode challenges.',
      run: 'Run Code',
      running: 'Running…',
      output: 'Output',
      description2: 'Description',
      difficulty: 'Difficulty',
      language: 'Language',
      reset: 'Reset',
      submit: 'Submit',
    },
    doodleClassifier: {
      title: 'Doodle Classifier',
      description: 'Draw anything and let AI guess what it is.',
      draw: 'Draw',
      classify: 'Classify',
      result: 'Result',
      clear: 'Clear',
      topPredictions: 'Top Predictions',
    },
    ielts: {
      title: 'IELTS Examiner',
      description: 'AI-powered IELTS writing and speaking evaluation.',
      writing: 'Writing',
      speaking: 'Speaking',
      submit: 'Submit',
      evaluating: 'Evaluating…',
      yourScore: 'Your Score',
      feedback: 'Feedback',
      essayPlaceholder: 'Write your essay here…',
      minWords: 'Minimum 50 words required.',
    },
    stocks: {
      title: 'Stock Tracker',
      description: 'Real-time quotes, charts, and AI price predictions.',
      search: 'Search symbol…',
      price: 'Price',
      change: 'Change',
      volume: 'Volume',
      prediction: 'Prediction',
      chart: 'Chart',
    },
    aiRoaster: {
      title: 'AI Roaster',
      description: 'Get humorously roasted by AI.',
      placeholder: 'Describe yourself or paste your code…',
      roast: 'Roast Me',
      roasting: 'Roasting…',
    },
    objectDetection: {
      title: 'Object Detection',
      description: 'Upload an image and detect objects with YOLOv8.',
      upload: 'Upload Image',
      detect: 'Detect',
      detecting: 'Detecting…',
      objects: 'Objects Detected',
      confidence: 'Confidence',
    },
  },
  contact: {
    title: 'Get in Touch',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending…',
    successTitle: 'Message Sent!',
    successMsg: "Thanks! I'll get back to you soon.",
    errorMsg: 'Something went wrong. Please try again.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    messagePlaceholder: 'What would you like to say?',
  },
  apiCheck: {
    title: 'API Status',
    description: 'Health status of all connected services.',
    checking: 'Checking…',
    online: 'Online',
    offline: 'Offline',
    unknown: 'Unknown',
    lastChecked: 'Last checked',
    recheck: 'Re-check',
  },
  footer: {
    builtWith: 'Built to learn.',
    rights: 'All rights reserved.',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
  },
  weather: {
    title: 'Weather',
    loading: 'Loading weather…',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    live: 'Live',
    cached: 'Cached',
  },
  quote: {
    loading: 'Loading quote…',
    source: 'Source',
  },
  search: {
    title: 'Search',
    placeholder: 'Search articles, projects…',
    results: 'results',
    noResults: 'No results found for',
    searching: 'Searching…',
    all: 'All',
  },
  errors: {
    notFound: 'Page Not Found',
    notFoundDesc: "The page you're looking for doesn't exist.",
    serverError: 'Server Error',
    serverErrorDesc: 'Something went wrong on our end.',
    loading: 'Loading…',
    retry: 'Try again',
    backHome: 'Back to Home',
  },
  common: {
    loading: 'Loading…',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    by: 'by',
    on: 'on',
    at: 'at',
    from: 'from',
    to: 'to',
    new: 'New',
    beta: 'Beta',
    comingSoon: 'Coming Soon',
    learnMore: 'Learn More',
  },
};

// ─── Vietnamese ───────────────────────────────────────────────────────────────

const vi: Dictionary = {
  site: {
    name: 'Magnus',
    tagline: 'Kỹ sư & Nhà thiết kế',
    description: 'Xây dựng tại giao điểm của chi tiết và ước mơ.',
  },
  nav: {
    home: 'Trang chủ',
    garden: 'Khu vườn',
    projects: 'Dự án',
    german: 'Tiếng Đức',
    wanderlust: 'Du lịch',
    search: 'Tìm kiếm',
  },
  home: {
    location: 'Bách Khoa, Quận 10, TP.HCM',
    labelListening: 'Đang nghe',
    labelGetInTouch: 'Liên hệ',
    labelDailyChallenge: 'Thử thách hôm nay',
    labelWeather: 'Thời tiết',
    labelWordOfDay: 'Từ vựng ngày',
    labelQuote: 'Câu trích dẫn',
    labelMarkets: 'Thị trường',
    labelProjects: 'Dự án',
    labelGarden: 'Khu vườn',
    labelAbout: 'Giới thiệu',
    aboutHero:
      'Xin chào, mình là Anh Khoa (Magnus) — lập trình viên và nhà thiết kế người Việt. Mình xây dựng công cụ AI, viết về phần mềm, học tiếng Đức và khám phá thế giới.',
    viewAll: 'Xem tất cả',
  },
  garden: {
    title: 'Khu vườn kỹ thuật số',
    description:
      'Phát triển cá nhân, ghi chú kỹ thuật, suy ngẫm và bài luận. Bộ sưu tập ý tưởng đang phát triển.',
    readMore: 'Đọc thêm',
    minRead: 'phút đọc',
    publishedOn: 'Đăng ngày',
    tags: 'Thẻ',
    tableOfContents: 'Mục lục',
    backToGarden: '← Quay lại Khu vườn',
    noArticles: 'Không tìm thấy bài viết.',
    filterByTag: 'Lọc theo thẻ',
    searchPlaceholder: 'Tìm kiếm bài viết…',
  },
  german: {
    title: 'Học tiếng Đức',
    description: 'Tin tức Đức mới nhất với bản dịch, từ vựng hôm nay và audio.',
    latestNews: 'Tin tức mới nhất',
    readOriginal: 'Đọc bản gốc',
    translated: 'Đã dịch',
    wordOfDay: 'Từ vựng ngày',
    listenAudio: 'Nghe',
    sourceArticle: 'Nguồn',
    loadingNews: 'Đang tải tin tức…',
    errorNews: 'Không thể tải tin tức. Vui lòng thử lại.',
    pronunciation: 'Phát âm',
    example: 'Ví dụ',
    definition: 'Định nghĩa',
  },
  wanderlust: {
    title: 'Du lịch',
    description: 'Những nơi đã đến, bản đồ và ký ức.',
    visitedPlaces: 'Nơi đã đến',
    mapLegend: 'Chú thích bản đồ',
    photos: 'Ảnh',
    checkedIn: 'Đã check-in',
    viewOnMap: 'Xem trên bản đồ',
  },
  projects: {
    title: 'Dự án',
    description: 'Thí nghiệm, công cụ và sân chơi.',
    tryIt: 'Thử ngay',
    sourceCode: 'Mã nguồn',
    backToProjects: '← Quay lại Dự án',
    chat: {
      title: 'AI Chat',
      description: 'Trò chuyện với mô hình ngôn ngữ lớn được cung cấp bởi Groq.',
      placeholder: 'Hỏi tôi bất cứ điều gì…',
      send: 'Gửi',
      thinking: 'Đang suy nghĩ…',
      you: 'Bạn',
    },
    codeSandbox: {
      title: 'Sân chơi code',
      description: 'Chạy code trực tuyến. Thử thách LeetCode hàng ngày.',
      run: 'Chạy code',
      running: 'Đang chạy…',
      output: 'Kết quả',
      description2: 'Mô tả',
      difficulty: 'Độ khó',
      language: 'Ngôn ngữ',
      reset: 'Đặt lại',
      submit: 'Nộp bài',
    },
    doodleClassifier: {
      title: 'Nhận dạng hình vẽ',
      description: 'Vẽ bất cứ thứ gì và để AI đoán đó là gì.',
      draw: 'Vẽ',
      classify: 'Phân loại',
      result: 'Kết quả',
      clear: 'Xóa',
      topPredictions: 'Dự đoán hàng đầu',
    },
    ielts: {
      title: 'IELTS Examiner',
      description: 'Chấm điểm bài viết và nói IELTS tự động bằng AI.',
      writing: 'Viết',
      speaking: 'Nói',
      submit: 'Nộp bài',
      evaluating: 'Đang chấm điểm…',
      yourScore: 'Điểm của bạn',
      feedback: 'Phản hồi',
      essayPlaceholder: 'Viết bài luận của bạn tại đây…',
      minWords: 'Cần ít nhất 50 từ.',
    },
    stocks: {
      title: 'Theo dõi cổ phiếu',
      description: 'Giá thời gian thực, biểu đồ và dự báo AI.',
      search: 'Tìm mã cổ phiếu…',
      price: 'Giá',
      change: 'Thay đổi',
      volume: 'Khối lượng',
      prediction: 'Dự báo',
      chart: 'Biểu đồ',
    },
    aiRoaster: {
      title: 'AI Roaster',
      description: 'Bị AI "diss" theo cách hài hước.',
      placeholder: 'Mô tả bản thân hoặc dán code của bạn…',
      roast: 'Roast tôi',
      roasting: 'Đang roast…',
    },
    objectDetection: {
      title: 'Nhận dạng vật thể',
      description: 'Tải ảnh lên và nhận dạng vật thể bằng YOLOv8.',
      upload: 'Tải ảnh lên',
      detect: 'Nhận dạng',
      detecting: 'Đang nhận dạng…',
      objects: 'Vật thể phát hiện',
      confidence: 'Độ chính xác',
    },
  },
  contact: {
    title: 'Liên hệ',
    name: 'Tên',
    email: 'Email',
    message: 'Tin nhắn',
    send: 'Gửi tin nhắn',
    sending: 'Đang gửi…',
    successTitle: 'Đã gửi thành công!',
    successMsg: 'Cảm ơn bạn! Tôi sẽ phản hồi sớm.',
    errorMsg: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    namePlaceholder: 'Tên của bạn',
    emailPlaceholder: 'email@của.bạn.com',
    messagePlaceholder: 'Bạn muốn nhắn gì?',
  },
  apiCheck: {
    title: 'Trạng thái API',
    description: 'Tình trạng hoạt động của các dịch vụ kết nối.',
    checking: 'Đang kiểm tra…',
    online: 'Trực tuyến',
    offline: 'Ngoại tuyến',
    unknown: 'Không xác định',
    lastChecked: 'Kiểm tra lần cuối',
    recheck: 'Kiểm tra lại',
  },
  footer: {
    builtWith: 'Xây dựng để học.',
    rights: 'Mọi quyền được bảo lưu.',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
  },
  weather: {
    title: 'Thời tiết',
    loading: 'Đang tải thời tiết…',
    feelsLike: 'Cảm giác như',
    humidity: 'Độ ẩm',
    wind: 'Gió',
    live: 'Trực tiếp',
    cached: 'Đã lưu',
  },
  quote: {
    loading: 'Đang tải câu trích dẫn…',
    source: 'Nguồn',
  },
  search: {
    title: 'Tìm kiếm',
    placeholder: 'Tìm kiếm bài viết, dự án…',
    results: 'kết quả',
    noResults: 'Không tìm thấy kết quả cho',
    searching: 'Đang tìm kiếm…',
    all: 'Tất cả',
  },
  errors: {
    notFound: 'Không tìm thấy trang',
    notFoundDesc: 'Trang bạn đang tìm không tồn tại.',
    serverError: 'Lỗi máy chủ',
    serverErrorDesc: 'Đã xảy ra lỗi ở phía máy chủ.',
    loading: 'Đang tải…',
    retry: 'Thử lại',
    backHome: 'Về trang chủ',
  },
  common: {
    loading: 'Đang tải…',
    error: 'Lỗi',
    success: 'Thành công',
    cancel: 'Hủy',
    close: 'Đóng',
    save: 'Lưu',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    confirm: 'Xác nhận',
    yes: 'Có',
    no: 'Không',
    or: 'hoặc',
    and: 'và',
    by: 'bởi',
    on: 'vào',
    at: 'lúc',
    from: 'từ',
    to: 'đến',
    new: 'Mới',
    beta: 'Beta',
    comingSoon: 'Sắp ra mắt',
    learnMore: 'Tìm hiểu thêm',
  },
};

// ─── German ───────────────────────────────────────────────────────────────────

const de: Dictionary = {
  site: {
    name: 'Magnus',
    tagline: 'Ingenieur & Designer',
    description: 'Im Schnittpunkt von Details und Träumen bauen.',
  },
  nav: {
    home: 'Startseite',
    garden: 'Garten',
    projects: 'Projekte',
    german: 'Deutsch',
    wanderlust: 'Wanderlust',
    search: 'Suche',
  },
  home: {
    location: 'Bach Khoa, Bezirk 10, Ho-Chi-Minh-Stadt',
    labelListening: 'Höre gerade',
    labelGetInTouch: 'Kontakt',
    labelDailyChallenge: 'Tagesaufgabe',
    labelWeather: 'Wetter',
    labelWordOfDay: 'Wort des Tages',
    labelQuote: 'Zitat',
    labelMarkets: 'Märkte',
    labelProjects: 'Projekte',
    labelGarden: 'Garten',
    labelAbout: 'Über mich',
    aboutHero:
      'Hallo, ich bin Anh Khoa (Magnus) — Entwickler und Designer aus Vietnam. Ich baue KI-Tools, schreibe über Software, lerne Deutsch und erkunde die Welt.',
    viewAll: 'Alle anzeigen',
  },
  garden: {
    title: 'Digitaler Garten',
    description:
      'Persönliches Wachstum, Technik-Notizen, Reflexionen und Essays. Eine lebendige Sammlung von Ideen.',
    readMore: 'Weiterlesen',
    minRead: 'Min. Lesezeit',
    publishedOn: 'Veröffentlicht am',
    tags: 'Tags',
    tableOfContents: 'Inhaltsverzeichnis',
    backToGarden: '← Zurück zum Garten',
    noArticles: 'Keine Artikel gefunden.',
    filterByTag: 'Nach Tag filtern',
    searchPlaceholder: 'Artikel suchen…',
  },
  german: {
    title: 'Deutsch lernen',
    description: 'Aktuelle Nachrichten auf Deutsch mit Übersetzungen, Wort des Tages und Audio.',
    latestNews: 'Neueste Nachrichten',
    readOriginal: 'Original lesen',
    translated: 'Übersetzt',
    wordOfDay: 'Wort des Tages',
    listenAudio: 'Anhören',
    sourceArticle: 'Quelle',
    loadingNews: 'Nachrichten werden geladen…',
    errorNews: 'Nachrichten konnten nicht geladen werden. Bitte erneut versuchen.',
    pronunciation: 'Aussprache',
    example: 'Beispiel',
    definition: 'Definition',
  },
  wanderlust: {
    title: 'Wanderlust',
    description: 'Besuchte Orte, Karten und Erinnerungen.',
    visitedPlaces: 'Besuchte Orte',
    mapLegend: 'Kartenlegende',
    photos: 'Fotos',
    checkedIn: 'Eingecheckt',
    viewOnMap: 'Auf Karte anzeigen',
  },
  projects: {
    title: 'Projekte',
    description: 'Experimente, Tools und Spielplätze.',
    tryIt: 'Ausprobieren',
    sourceCode: 'Quellcode',
    backToProjects: '← Zurück zu Projekten',
    chat: {
      title: 'KI-Chat',
      description: 'Chatte mit einem Sprachmodell, betrieben von Groq.',
      placeholder: 'Frag mich etwas…',
      send: 'Senden',
      thinking: 'Denke nach…',
      you: 'Du',
    },
    codeSandbox: {
      title: 'Code Sandbox',
      description: 'Code online ausführen. Tägliche LeetCode-Aufgaben.',
      run: 'Code ausführen',
      running: 'Wird ausgeführt…',
      output: 'Ausgabe',
      description2: 'Beschreibung',
      difficulty: 'Schwierigkeit',
      language: 'Sprache',
      reset: 'Zurücksetzen',
      submit: 'Einreichen',
    },
    doodleClassifier: {
      title: 'Kritzel-Klassifikator',
      description: 'Zeichne etwas und lass die KI erraten, was es ist.',
      draw: 'Zeichnen',
      classify: 'Klassifizieren',
      result: 'Ergebnis',
      clear: 'Löschen',
      topPredictions: 'Top-Vorhersagen',
    },
    ielts: {
      title: 'IELTS Prüfer',
      description: 'KI-gestützte IELTS-Schreib- und Sprechbewertung.',
      writing: 'Schreiben',
      speaking: 'Sprechen',
      submit: 'Einreichen',
      evaluating: 'Wird bewertet…',
      yourScore: 'Deine Punktzahl',
      feedback: 'Feedback',
      essayPlaceholder: 'Schreibe deinen Aufsatz hier…',
      minWords: 'Mindestens 50 Wörter erforderlich.',
    },
    stocks: {
      title: 'Aktien-Tracker',
      description: 'Echtzeitkurse, Charts und KI-Preisprognosen.',
      search: 'Symbol suchen…',
      price: 'Kurs',
      change: 'Änderung',
      volume: 'Volumen',
      prediction: 'Prognose',
      chart: 'Chart',
    },
    aiRoaster: {
      title: 'KI-Satiriker',
      description: 'Lass dich humorvoll von der KI kritisieren.',
      placeholder: 'Beschreibe dich oder füge deinen Code ein…',
      roast: 'Kritisier mich',
      roasting: 'Wird kritisiert…',
    },
    objectDetection: {
      title: 'Objekterkennung',
      description: 'Bild hochladen und Objekte mit YOLOv8 erkennen.',
      upload: 'Bild hochladen',
      detect: 'Erkennen',
      detecting: 'Wird erkannt…',
      objects: 'Erkannte Objekte',
      confidence: 'Konfidenz',
    },
  },
  contact: {
    title: 'Kontakt aufnehmen',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    send: 'Nachricht senden',
    sending: 'Wird gesendet…',
    successTitle: 'Nachricht gesendet!',
    successMsg: 'Danke! Ich melde mich bald.',
    errorMsg: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    namePlaceholder: 'Dein Name',
    emailPlaceholder: 'deine@email.com',
    messagePlaceholder: 'Was möchtest du sagen?',
  },
  apiCheck: {
    title: 'API-Status',
    description: 'Betriebsstatus aller verbundenen Dienste.',
    checking: 'Wird überprüft…',
    online: 'Online',
    offline: 'Offline',
    unknown: 'Unbekannt',
    lastChecked: 'Zuletzt überprüft',
    recheck: 'Erneut prüfen',
  },
  footer: {
    builtWith: 'Zum Lernen gebaut.',
    rights: 'Alle Rechte vorbehalten.',
    darkMode: 'Dunkelmodus',
    lightMode: 'Hellmodus',
  },
  weather: {
    title: 'Wetter',
    loading: 'Wetter wird geladen…',
    feelsLike: 'Gefühlt wie',
    humidity: 'Luftfeuchtigkeit',
    wind: 'Wind',
    live: 'Live',
    cached: 'Zwischengespeichert',
  },
  quote: {
    loading: 'Zitat wird geladen…',
    source: 'Quelle',
  },
  search: {
    title: 'Suche',
    placeholder: 'Artikel, Projekte suchen…',
    results: 'Ergebnisse',
    noResults: 'Keine Ergebnisse gefunden für',
    searching: 'Wird gesucht…',
    all: 'Alle',
  },
  errors: {
    notFound: 'Seite nicht gefunden',
    notFoundDesc: 'Die gesuchte Seite existiert nicht.',
    serverError: 'Serverfehler',
    serverErrorDesc: 'Auf unserer Seite ist etwas schiefgelaufen.',
    loading: 'Wird geladen…',
    retry: 'Erneut versuchen',
    backHome: 'Zur Startseite',
  },
  common: {
    loading: 'Wird geladen…',
    error: 'Fehler',
    success: 'Erfolg',
    cancel: 'Abbrechen',
    close: 'Schließen',
    save: 'Speichern',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
    or: 'oder',
    and: 'und',
    by: 'von',
    on: 'am',
    at: 'um',
    from: 'von',
    to: 'bis',
    new: 'Neu',
    beta: 'Beta',
    comingSoon: 'Demnächst',
    learnMore: 'Mehr erfahren',
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const dictionaries: Record<Locale, Dictionary> = { en, vi, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
