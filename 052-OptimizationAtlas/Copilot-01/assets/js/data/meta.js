export const LANGUAGES = [
  { id: "csharp", label: "C#" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
  { id: "cpp", label: "C++" }
];

export const LEVELS = [
  { id: "basic", order: 1, en: "Basic", vi: "Cơ bản" },
  { id: "intermediate", order: 2, en: "Intermediate", vi: "Trung cấp" },
  { id: "advanced", order: 3, en: "Advanced", vi: "Nâng cao" }
];

export const PROVIDERS = {
  csharp: ".NET CLR / RyuJIT",
  python: "CPython / PyPy",
  go: "Go Runtime / Toolchain",
  rust: "rustc + LLVM / std",
  java: "JVM (HotSpot, OpenJ9)",
  javascript: "V8 / Node.js / Browser Engines",
  cpp: "C++ Compilers + STL"
};

export const I18N = {
  en: {
    pageTitle: "Memory and Performance Optimization Atlas",
    subtitle: "Cross-language MPOT collection for C#, Python, Go, Rust, Java, JavaScript, C++",
    searchPlaceholder: "Search techniques, concepts, providers...",
    generalComparison: "General MPOT Comparison",
    generalizedTechniques: "Generalized MPOTs",
    conceptsTools: "Building-block Concepts and Tools",
    detailedLanguageTable: "Detailed Language-vs-MPOT Comparison",
    detailedConceptTable: "Detailed Concepts/Tools Comparison",
    complexity: "Time-Space-Cost",
    origin: "Origin",
    what: "What",
    how: "How it works",
    when: "When to use",
    pros: "Pros",
    cons: "Cons",
    buildingBlocks: "Building blocks",
    examples: "Code Examples",
    level: "Level",
    category: "Category",
    language: "Language",
    specifics: "Specifics",
    providerName: "Provider-specific Name",
    filterLevel: "Filter by level",
    filterCategory: "Filter by category",
    filterLanguage: "Filter by language",
    allLevels: "All levels",
    allCategories: "All categories",
    allLanguages: "All languages",
    backToTop: "Back to top",
    notAvailable: "-"
  },
  vi: {
    pageTitle: "Bản Đồ Tối Ưu Hiệu Năng và Bộ Nhớ",
    subtitle: "Bộ sưu tập MPOT đa ngôn ngữ cho C#, Python, Go, Rust, Java, JavaScript, C++",
    searchPlaceholder: "Tìm kỹ thuật, khái niệm, nhà cung cấp...",
    generalComparison: "So Sánh MPOT Tổng Quan",
    generalizedTechniques: "Các MPOT Tổng Quát",
    conceptsTools: "Khái Niệm và Công Cụ Nền Tảng",
    detailedLanguageTable: "So Sánh Chi Tiết Ngôn Ngữ vs MPOT",
    detailedConceptTable: "So Sánh Chi Tiết Khái Niệm/Công Cụ",
    complexity: "Độ Phức Tạp Thời Gian-Không Gian-Chi Phí",
    origin: "Nguồn gốc",
    what: "Là gì",
    how: "Cách hoạt động",
    when: "Khi nào dùng",
    pros: "Ưu điểm",
    cons: "Nhược điểm",
    buildingBlocks: "Thành phần nền tảng",
    examples: "Ví dụ mã nguồn",
    level: "Cấp độ",
    category: "Danh mục",
    language: "Ngôn ngữ",
    specifics: "Đặc điểm",
    providerName: "Tên theo nhà cung cấp",
    filterLevel: "Lọc theo cấp độ",
    filterCategory: "Lọc theo danh mục",
    filterLanguage: "Lọc theo ngôn ngữ",
    allLevels: "Tất cả cấp độ",
    allCategories: "Tất cả danh mục",
    allLanguages: "Tất cả ngôn ngữ",
    backToTop: "Lên đầu trang",
    notAvailable: "-"
  }
};

export const CATEGORIES = [
  "Data Layout",
  "Allocation",
  "Execution Model",
  "Concurrency",
  "Compiler/Runtime",
  "Measurement"
];

export const CATEGORY_I18N = {
  "Data Layout":       { en: "Data Layout",       vi: "Bố Cục Dữ Liệu" },
  "Allocation":        { en: "Allocation",        vi: "Cấp Phát Bộ Nhớ" },
  "Execution Model":   { en: "Execution Model",   vi: "Mô Hình Thực Thi" },
  "Concurrency":       { en: "Concurrency",       vi: "Đồng Thời" },
  "Compiler/Runtime":  { en: "Compiler/Runtime",  vi: "Biên Dịch/Runtime" },
  "Measurement":       { en: "Measurement",       vi: "Đo Lường" }
};
