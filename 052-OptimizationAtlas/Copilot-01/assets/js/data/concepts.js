import { LANGUAGES, PROVIDERS } from "./meta.js";

export const CONCEPTS = [
  {
    id: "cache-lines",
    name: { en: "Cache Line Awareness", vi: "Nhận thức cache line" },
    origin: { en: "CPU architecture and cache hierarchy design.", vi: "Kiến trúc CPU và thiết kế hệ thống cache phân cấp." },
    what: { en: "Understand fixed-size cache lines and spatial locality effects.", vi: "Hiểu kích thước cache line cố định và hiệu ứng cục bộ không gian." },
    how: { en: "Keep adjacent hot fields together and iterate sequentially.", vi: "Giữ các trường nóng liền kề nhau và duyệt tuần tự." },
    when: { en: "Any hot loop on arrays/structs.", vi: "Mọi vòng lặp nóng trên mảng/struct." },
    pros: [
      { en: "Large practical speed gains", vi: "Tăng tốc đáng kể trong thực tế" },
      { en: "No algorithm changes required", vi: "Không cần thay đổi thuật toán" }
    ],
    cons: [
      { en: "Data model refactoring may be needed", vi: "Có thể cần tái cấu trúc mô hình dữ liệu" }
    ],
    complexity: { en: "Constant-factor runtime gains; no asymptotic change", vi: "Tăng tốc hằng số; không thay đổi độ phức tạp tiệm cận" },
    providerSpecific: {
      csharp: "Span<T>, struct layout hints",
      python: "NumPy contiguous ndarray",
      go: "slice-backed arrays",
      rust: "Vec<T>, packed/ordered structs",
      java: "primitive arrays",
      javascript: "TypedArray",
      cpp: "std::vector, aligned storage"
    }
  },
  {
    id: "allocators",
    name: { en: "Allocator Strategy", vi: "Chiến lược bộ cấp phát" },
    origin: { en: "Systems allocators and memory management research.", vi: "Bộ cấp phát hệ thống và nghiên cứu quản lý bộ nhớ." },
    what: { en: "Control allocation frequency and placement.", vi: "Kiểm soát tần suất và vị trí cấp phát." },
    how: { en: "Preallocate, pool, or select custom allocator behavior.", vi: "Cấp phát trước, dùng pool hoặc chọn hành vi bộ cấp phát tùy chỉnh." },
    when: { en: "Low-latency or allocation-heavy workloads.", vi: "Khối lượng công việc độ trễ thấp hoặc nặng về cấp phát." },
    pros: [
      { en: "Lower allocation overhead", vi: "Giảm overhead cấp phát" },
      { en: "Improved latency consistency", vi: "Độ trễ nhất quán hơn" }
    ],
    cons: [
      { en: "Extra tuning and lifecycle complexity", vi: "Cần tinh chỉnh thêm và phức tạp vòng đời" }
    ],
    complexity: { en: "Lower constant overhead, possibly higher reserved memory", vi: "Overhead hằng số thấp hơn, bộ nhớ dự trữ có thể cao hơn" },
    providerSpecific: {
      csharp: "ArrayPool<T>, ObjectPool",
      python: "bytearray reuse, object freelists",
      go: "sync.Pool, make(cap)",
      rust: "with_capacity, arena allocators",
      java: "ByteBuffer reuse, object pools",
      javascript: "ArrayBuffer reuse",
      cpp: "pmr allocators, slab/pool allocators"
    }
  },
  {
    id: "gc",
    name: { en: "Garbage Collection Behavior", vi: "Cơ chế GC" },
    origin: { en: "Managed runtime memory management.", vi: "Quản lý bộ nhớ runtime được quản lý." },
    what: { en: "Automatic memory reclamation with pause/throughput tradeoffs.", vi: "Thu hồi bộ nhớ tự động với đánh đổi giữa tạm dừng và thông lượng." },
    how: { en: "Tune generation/heap parameters and allocation patterns.", vi: "Điều chỉnh tham số thế hệ/heap và mẫu cấp phát." },
    when: { en: "Managed languages under memory pressure.", vi: "Ngôn ngữ được quản lý dưới áp lực bộ nhớ." },
    pros: [
      { en: "Safer memory lifecycle", vi: "Vòng đời bộ nhớ an toàn hơn" },
      { en: "Simpler code ownership", vi: "Sở hữu code đơn giản hơn" }
    ],
    cons: [
      { en: "Pause time and throughput trade-offs", vi: "Đánh đổi giữa thời gian tạm dừng và thông lượng" }
    ],
    complexity: { en: "Runtime overhead depends on allocation rate and live set", vi: "Overhead runtime phụ thuộc tốc độ cấp phát và tập đang sống" },
    providerSpecific: {
      csharp: ".NET GC (Workstation/Server)",
      python: "Refcount + cyclic GC",
      go: "Concurrent tri-color GC",
      rust: "-",
      java: "G1/ZGC/Shenandoah",
      javascript: "V8 generational GC",
      cpp: "-"
    }
  },
  {
    id: "iterators",
    name: { en: "Iterator/Stream Abstractions", vi: "Trình lặp/stream trừu tượng" },
    origin: { en: "Functional and container library evolution.", vi: "Tiến hóa thư viện hàm và container." },
    what: { en: "Composable lazy operations over sequences.", vi: "Các phép toán lười biếng có thể kết hợp trên chuỗi phần tử." },
    how: { en: "Map/filter/reduce with pull- or push-based iteration.", vi: "Map/filter/reduce với duyệt kiểu pull hoặc push." },
    when: { en: "Pipeline processing and large sequence handling.", vi: "Xử lý pipeline và xử lý chuỗi lớn." },
    pros: [
      { en: "Composability", vi: "Khả năng kết hợp" },
      { en: "Lower peak memory", vi: "Bộ nhớ đỉnh thấp hơn" }
    ],
    cons: [
      { en: "Can hide cost if over-chained", vi: "Có thể ẩn chi phí nếu kết hợp quá nhiều" }
    ],
    complexity: { en: "Typically linear, with allocation avoided in lazy pipelines", vi: "Thường tuyến tính, không cấp phát trong pipeline lười biếng" },
    providerSpecific: {
      csharp: "IEnumerable LINQ",
      python: "generators + itertools",
      go: "channels + loops",
      rust: "Iterator trait",
      java: "Stream API",
      javascript: "sync/async iterators",
      cpp: "C++20 ranges"
    }
  },
  {
    id: "atomics",
    name: { en: "Atomic Primitives", vi: "Nguyên tố atomic" },
    origin: { en: "CPU memory model and lock-free algorithm theory.", vi: "Mô hình bộ nhớ CPU và lý thuyết thuật toán lock-free." },
    what: { en: "Single-instruction read-modify-write operations.", vi: "Các phép toán đọc-sửa-ghi đơn lệnh." },
    how: { en: "Use fetch_add/CAS and explicit memory ordering.", vi: "Dùng fetch_add/CAS và thứ tự bộ nhớ tường minh." },
    when: { en: "Counters, queues, and lock contention hotspots.", vi: "Bộ đếm, hàng đợi và điểm nóng tranh chấp khóa." },
    pros: [
      { en: "Lower lock overhead", vi: "Giảm overhead khóa" },
      { en: "Better scaling in hotspots", vi: "Mở rộng tốt hơn ở điểm nóng" }
    ],
    cons: [
      { en: "Correctness is hard", vi: "Tính đúng đắn khó đảm bảo" },
      { en: "Memory model pitfalls", vi: "Bẫy mô hình bộ nhớ" }
    ],
    complexity: { en: "Near O(1) operations, contention dependent", vi: "Gần O(1), phụ thuộc tranh chấp" },
    providerSpecific: {
      csharp: "Interlocked",
      python: "Limited direct atomics",
      go: "sync/atomic",
      rust: "std::sync::atomic",
      java: "Atomic* and VarHandle",
      javascript: "Atomics with SharedArrayBuffer",
      cpp: "std::atomic"
    }
  },
  {
    id: "compiler-flags",
    name: { en: "Compiler Optimization Flags", vi: "Cờ tối ưu hóa trình biên dịch" },
    origin: { en: "Compiler engineering.", vi: "Kỹ thuật trình biên dịch." },
    what: { en: "Instruction selection and optimization passes tuned by flags.", vi: "Chọn lệnh và các bước tối ưu hóa được điều chỉnh bởi cờ." },
    how: { en: "Use release profiles, LTO, and architecture-specific options.", vi: "Dùng cấu hình phát hành, LTO và tùy chọn theo kiến trúc." },
    when: { en: "Production builds and performance benchmarks.", vi: "Build sản xuất và benchmark hiệu năng." },
    pros: [
      { en: "System-wide speedups", vi: "Tăng tốc toàn hệ thống" },
      { en: "No API changes", vi: "Không thay đổi API" }
    ],
    cons: [
      { en: "Build variability across targets", vi: "Biến thiên build theo nền tảng mục tiêu" }
    ],
    complexity: { en: "No algorithmic change; possible binary size growth", vi: "Không thay đổi thuật toán; kích thước nhị phân có thể tăng" },
    providerSpecific: {
      csharp: "R2R / TieredPGO",
      python: "Native extension compiler flags",
      go: "gcflags/ldflags",
      rust: "opt-level, lto, codegen-units",
      java: "JIT flags",
      javascript: "Engine heuristics (no direct user flags in browser)",
      cpp: "-O2/-O3/-march/-flto"
    }
  },
  {
    id: "profilers",
    name: { en: "Profiling and Benchmarking", vi: "Profiling và benchmarking" },
    origin: { en: "Performance engineering methodology.", vi: "Phương pháp kỹ thuật hiệu năng." },
    what: { en: "Measure runtime and memory behavior before optimization.", vi: "Đo lường hành vi runtime và bộ nhớ trước khi tối ưu." },
    how: { en: "Collect CPU flame graphs, allocation traces, and benchmark stats.", vi: "Thu thập flame graph CPU, trace cấp phát và thống kê benchmark." },
    when: { en: "Before and after every significant optimization.", vi: "Trước và sau mỗi tối ưu hóa đáng kể." },
    pros: [
      { en: "Evidence-driven decisions", vi: "Quyết định dựa trên bằng chứng" },
      { en: "Avoid wasted effort", vi: "Tránh nỗ lực lãng phí" }
    ],
    cons: [
      { en: "Learning curve", vi: "Đường cong học tập" },
      { en: "Measurement noise", vi: "Nhiễu đo lường" }
    ],
    complexity: { en: "Measurement overhead only during profiling", vi: "Overhead đo lường chỉ trong khi profiling" },
    providerSpecific: {
      csharp: "dotnet-trace + BenchmarkDotNet",
      python: "cProfile, py-spy",
      go: "pprof",
      rust: "criterion + perf",
      java: "JFR + JMH",
      javascript: "Chrome DevTools / Node --prof",
      cpp: "perf/VTune + Google Benchmark"
    }
  },
  {
    id: "async-runtime",
    name: { en: "Async Runtime / Event Loop", vi: "Runtime bất đồng bộ / Vòng lặp sự kiện" },
    origin: { en: "Event-driven I/O from libevent, Node.js, and Python asyncio.", vi: "I/O hướng sự kiện từ libevent, Node.js và Python asyncio." },
    what: { en: "A scheduler that multiplexes many concurrent tasks onto a small thread pool via non-blocking I/O.", vi: "Bộ lập lịch ghép kênh nhiều tác vụ đồng thời trên pool luồng nhỏ qua I/O không chặn." },
    how: { en: "Tasks yield on I/O; the runtime polls for completion and resumes the next ready task.", vi: "Tác vụ nhường khi I/O; runtime thăm dò hoàn thành và tiếp tục tác vụ sẵn sàng tiếp theo." },
    when: { en: "High-concurrency I/O-bound services; avoids thread-per-connection scaling limits.", vi: "Dịch vụ I/O-bound đồng thời cao; tránh giới hạn mở rộng luồng-mỗi-kết-nối." },
    pros: [
      { en: "Millions of concurrent I/O operations on few threads", vi: "Hàng triệu thác đáo I/O đồng thời trên ít luồng" },
      { en: "Low context-switch overhead", vi: "Overhead chuyển ngữ cảnh thấp" }
    ],
    cons: [
      { en: "CPU-bound tasks block the event loop", vi: "Tác vụ CPU-bound chặn vòng lặp sự kiện" },
      { en: "Complex debugging for async call chains", vi: "Gỡ lỗi phức tạp cho chuỗi gọi async" }
    ],
    complexity: { en: "O(1) per I/O wakeup via OS epoll/kqueue/IOCP", vi: "O(1) mỗi lần đánh thức I/O qua OS epoll/kqueue/IOCP" },
    providerSpecific: {
      csharp: "Task/async-await over .NET ThreadPool + IOCP",
      python: "asyncio event loop (uvloop for speed)",
      go: "Built-in runtime scheduler; goroutines multiplexed over threads",
      rust: "tokio / async-std runtimes",
      java: "CompletableFuture / Project Loom virtual threads",
      javascript: "V8 event loop + libuv (Node.js)",
      cpp: "Boost.Asio / liburing io_uring"
    }
  },
  {
    id: "schedulers",
    name: { en: "Thread and Task Schedulers", vi: "Bộ lập lịch luồng và tác vụ" },
    origin: { en: "Operating system process scheduling adapted for user-space task libraries.", vi: "Lập lịch tiến trình hệ điều hành được điều chỉnh cho thư viện tác vụ user-space." },
    what: { en: "A component that decides which ready task/thread runs next on which CPU core.", vi: "Thành phần quyết định tác vụ/luồng nào sẵn sàng chạy tiếp theo trên CPU nào." },
    how: { en: "Maintains ready queues; assigns work using work-stealing, FIFO, or priority strategies.", vi: "Duy trì hàng đợi sẵn sàng; phân công dùng work-stealing, FIFO hoặc ưu tiên." },
    when: { en: "Multi-threaded apps that need load balancing and low overhead scheduling.", vi: "Ứng dụng đa luồng cần cân bằng tải và lập lịch overhead thấp." },
    pros: [
      { en: "Automatic load balancing", vi: "Cân bằng tải tự động" },
      { en: "Reduces idle core waste", vi: "Giảm lãng phí core rảnh" }
    ],
    cons: [
      { en: "Scheduling overhead for very fine-grained tasks", vi: "Overhead lập lịch cho tác vụ rất nhỏ" },
      { en: "Non-deterministic execution order", vi: "Thứ tự thực thi không xác định" }
    ],
    complexity: { en: "O(1) average for work-stealing queues", vi: "O(1) trung bình cho hàng đợi work-stealing" },
    providerSpecific: {
      csharp: "ThreadPool + TPL with work-stealing queues",
      python: "GIL + threading; multiprocessing has separate process schedulers",
      go: "M:N work-stealing scheduler (GOMAXPROCS workers)",
      rust: "Rayon's work-stealing pool; tokio's cooperative scheduler",
      java: "ForkJoinPool work-stealing; virtual thread scheduler (Loom)",
      javascript: "Single-threaded event loop; Libuv thread pool for blocking ops",
      cpp: "TBB task scheduler; OpenMP; std::execution backends"
    }
  },
  {
    id: "simd",
    name: { en: "SIMD / Vector Units", vi: "Đơn vị SIMD / Vector" },
    origin: { en: "Intel MMX (1996), SSE, AVX; ARM NEON; Rust/Clang portable intrinsics.", vi: "Intel MMX (1996), SSE, AVX; ARM NEON; intrinsics portable Rust/Clang." },
    what: { en: "CPU registers that process multiple data elements in one instruction (data parallelism).", vi: "Thanh ghi CPU xử lý nhiều phần tử dữ liệu trong một lệnh (song song dữ liệu)." },
    how: { en: "Load vectors, apply arithmetic/logic, store results; lane width 128\u2013512 bits.", vi: "Nạp vector, áp dụng số học/logic, lưu kết quả; độ rộng lane 128\u2013512 bit." },
    when: { en: "Arithmetic over homogeneous arrays (image processing, physics, ML).", vi: "Số học trên mảng đồng nhất (xử lý ảnh, vật lý, ML)." },
    pros: [
      { en: "2\u201316\u00d7 throughput improvement in math-heavy code", vi: "Cải thiện thông lượng 2\u201316 lần trong code nặng toán học" },
      { en: "Single-cycle latency on modern CPUs", vi: "Độ trễ một chu kỳ trên CPU hiện đại" }
    ],
    cons: [
      { en: "Non-portable if using platform-specific intrinsics", vi: "Không portable nếu dùng intrinsics riêng nền tảng" },
      { en: "Data alignment requirements", vi: "Yêu cầu căn chỉnh dữ liệu" }
    ],
    complexity: { en: "N-element op in O(N/W) where W is SIMD width", vi: "Phép toán N phần tử trong O(N/W) với W là độ rộng SIMD" },
    providerSpecific: {
      csharp: "System.Runtime.Intrinsics + Vector<T>",
      python: "NumPy ufuncs use SIMD via LAPACK/MKL backends",
      go: "Compiler auto-vectorization; no stdlib intrinsics yet",
      rust: "std::simd (portable_simd) / std::arch intrinsics",
      java: "JVM Vector API (incubator)",
      javascript: "WebAssembly SIMD proposal; WebGL compute shaders",
      cpp: "SSE/AVX intrinsics; highway/xsimd/xtl libraries"
    }
  },
  {
    id: "pgo",
    name: { en: "Profile-Guided Optimization (PGO)", vi: "Tối ưu hóa theo hướng profile (PGO)" },
    origin: { en: "ICC and GCC PGO from the late 1990s; modern AOT and JIT runtimes.", vi: "ICC và GCC PGO từ cuối những năm 1990; runtime AOT và JIT hiện đại." },
    what: { en: "Use runtime profile data (branch frequencies, call counts) to guide compile-time decisions.", vi: "Dùng dữ liệu profile runtime (độ thường xuyên nhánh, số lần gọi) để hướng dẫn quyết định biên dịch." },
    how: { en: "Instrument binary, run representative workload, recompile with profile data.", vi: "Instrument nhị phân, chạy khối lượng công việc đại diện, biên dịch lại với dữ liệu profile." },
    when: { en: "Before shipping production binaries of CPU-intensive services.", vi: "Trước khi phát hành nhị phân sản xuất cho dịch vụ CPU-intensive." },
    pros: [
      { en: "Better inlining, branch layout, function ordering automatically", vi: "Nội tuyến, bố cục nhánh, sắp xếp hàm tốt hơn tự động" },
      { en: "5\u201320% real-world speedup", vi: "Tăng tốc 5\u201320% trong thực tế" }
    ],
    cons: [
      { en: "Requires representative workload", vi: "Yêu cầu khối lượng công việc đại diện" },
      { en: "Longer build pipeline", vi: "Pipeline build dài hơn" }
    ],
    complexity: { en: "Build-time cost; runtime speedup is problem-dependent", vi: "Chi phí lúc build; tốc độ runtime phụ thuộc bài toán" },
    providerSpecific: {
      csharp: "ReadyToRun + NGEN; .NET 7+ dynamic PGO",
      python: "Cython/Nuitka support PGO via GCC",
      go: "go test -cpuprofile + pprof; PGO added in Go 1.21",
      rust: "LLVM PGO via cargo-pgo crate",
      java: "JVM automatically collects and acts on profile data (JIT tiered)",
      javascript: "V8 uses inline caches as implicit PGO",
      cpp: "-fprofile-generate / -fprofile-use (GCC/Clang); /GL + PGO in MSVC"
    }
  },
  {
    id: "hashmaps",
    name: { en: "Hash Maps and Hash Tables", vi: "Bảng băm (Hash map / Hash table)" },
    origin: { en: "H.P. Luhn's 1953 paper on hashing; open addressing from Knuth.", vi: "Bài báo năm 1953 của H.P. Luhn về băm; địa chỉ mở từ Knuth." },
    what: { en: "Constant-time key\u2013value store using a hash function to map keys to bucket indices.", vi: "Kho key-value thời gian hằng dùng hàm băm ánh xạ khóa thành chỉ số bucket." },
    how: { en: "Hash key \u2192 index; handle collisions via chaining or open addressing (probing).", vi: "Băm khóa \u2192 chỉ số; xử lý xung đột qua chaining hoặc địa chỉ mở (probing)." },
    when: { en: "Memoization, caches, index lookups, deduplication.", vi: "Ghi nhớ kết quả, cache, tra cứu chỉ mục, loại bỏ trùng lặp." },
    pros: [
      { en: "O(1) average insert/lookup/delete", vi: "Chèn/tra cứu/xóa trung bình O(1)" },
      { en: "Flexible key types", vi: "Kiểu khóa linh hoạt" }
    ],
    cons: [
      { en: "Hash collisions degrade performance", vi: "Va chạm băm làm giảm hiệu năng" },
      { en: "High memory overhead for sparse tables", vi: "Overhead bộ nhớ cao cho bảng thưa" }
    ],
    complexity: { en: "O(1) average, O(n) worst case", vi: "Trung bình O(1), trường hợp xấu nhất O(n)" },
    providerSpecific: {
      csharp: "Dictionary<K,V> (chaining); FrozenDictionary (read-only, probe)",
      python: "dict (open addressing, 8/3 load factor)",
      go: "map[K]V (hash + chaining; runtime growth)",
      rust: "std::collections::HashMap (Siphash-1-3 default key)",
      java: "HashMap (chaining, treeified on collision)",
      javascript: "Map / object (V8 hidden class + hash table)",
      cpp: "std::unordered_map (chaining); absl::flat_hash_map (open addressing)"
    }
  },
  {
    id: "memory-order",
    name: { en: "Memory Ordering and Memory Model", vi: "Thứ tự bộ nhớ và mô hình bộ nhớ" },
    origin: { en: "ANSI C++ memory model (C++11) and Java Memory Model (JSR-133).", vi: "Mô hình bộ nhớ ANSI C++ (C++11) và Java Memory Model (JSR-133)." },
    what: { en: "Rules defining when writes by one thread become visible to other threads.", vi: "Quy tắc định nghĩa khi nào ghi của một luồng trở nên hiển thị với luồng khác." },
    how: { en: "Use acquire/release or seq_cst fences; pairs of atomic load-store enforce visibility.", vi: "Dùng fence acquire/release hoặc seq_cst; cặp atomic load-store đảm bảo khả năng hiển thị." },
    when: { en: "Lock-free data structures, producer/consumer queues, shared flags.", vi: "Cấu trúc dữ liệu lock-free, hàng đợi producer/consumer, cờ chia sẻ." },
    pros: [
      { en: "Fine-grained control over synchronization cost", vi: "Kiểm soát chi tiết chi phí đồng bộ" },
      { en: "Avoids full barriers for one-way visibility", vi: "Tránh barrier đầy đủ cho khả năng hiển thị một chiều" }
    ],
    cons: [
      { en: "Subtle bugs from incorrect ordering", vi: "Lỗi tinh tế từ thứ tự sai" },
      { en: "Architecture-specific reordering (ARM vs x86)", vi: "Sắp xếp lại theo kiến trúc (ARM vs x86)" }
    ],
    complexity: { en: "Hardware fence cost: seq_cst > release/acquire > relaxed", vi: "Chi phí fence phần cứng: seq_cst > release/acquire > relaxed" },
    providerSpecific: {
      csharp: "Volatile.Read/Write; Interlocked (seq_cst); Unsafe.As for relaxed",
      python: "GIL provides implicit sequencing; no explicit model needed",
      go: "sync/atomic package; Go memory model guarantees happen-before",
      rust: "std::sync::atomic::Ordering: Relaxed, Acquire, Release, AcqRel, SeqCst",
      java: "volatile (seq_cst); VarHandle with acquire/release modes",
      javascript: "Atomics.load/store/fence on SharedArrayBuffer",
      cpp: "std::memory_order enum; std::atomic<T> methods"
    }
  },
  {
    id: "views-ownership",
    name: { en: "Views, Slices, and Ownership Semantics", vi: "View, Slice và ngữ nghĩa sở hữu" },
    origin: { en: "Rust borrow checker; C++ string_view; Java ByteBuffer; Span<T> in .NET.", vi: "Borrow checker Rust; C++ string_view; Java ByteBuffer; Span<T> trong .NET." },
    what: { en: "A non-owning reference to a contiguous range of memory for zero-copy operations.", vi: "Tham chiếu không sở hữu đến vùng bộ nhớ liên tiếp cho phép toán không sao chép." },
    how: { en: "Create a view over existing data; pass to APIs that accept read/write access without copying.", vi: "Tạo view trên dữ liệu hiện có; truyền cho API chấp nhận truy cập đọc/ghi mà không sao chép." },
    when: { en: "Parsing, sub-buffer operations, passing data across API boundaries.", vi: "Phân tích cú pháp, thác đáo sub-buffer, truyền dữ liệu qua ranh giới API." },
    pros: [
      { en: "Zero-copy", vi: "Không sao chép" },
      { en: "Enables composable pipelines without allocation", vi: "Cho phép pipeline có thể kết hợp mà không cấp phát" }
    ],
    cons: [
      { en: "Lifetime tracking required", vi: "Cần theo dõi thời gian sống" },
      { en: "Views may outlive backing data (dangling)", vi: "View có thể sống lâu hơn dữ liệu nền (dangling)" }
    ],
    complexity: { en: "O(1) slice creation", vi: "Tạo slice O(1)" },
    providerSpecific: {
      csharp: "Span<T> / ReadOnlySpan<T> / Memory<T>",
      python: "memoryview (PEP 3118 buffer protocol)",
      go: "Slice header (ptr + len + cap); sub-slicing is O(1)",
      rust: "&[T] / &str; lifetime system prevents dangling",
      java: "ByteBuffer.slice() / array views in NIO",
      javascript: "TypedArray.subarray() / DataView",
      cpp: "std::span (C++20); std::string_view"
    }
  },
  {
    id: "eviction",
    name: { en: "Cache Eviction Policies", vi: "Chính sách loại bỏ cache" },
    origin: { en: "CPU cache replacement algorithms; Belady's optimal, LRU, LFU in OS and DB design.", vi: "Thuật toán thay thế cache CPU; Belady tối ưu, LRU, LFU trong thiết kế OS và DB." },
    what: { en: "Algorithm that decides which cached item to remove when space is needed.", vi: "Thuật toán quyết định mục cache nào cần loại bỏ khi cần chỗ trống." },
    how: { en: "Track recency (LRU), frequency (LFU), or use approximations (CLOCK, TinyLFU).", vi: "Theo dõi gần đây (LRU), tần suất (LFU) hoặc dùng xấp xỉ (CLOCK, TinyLFU)." },
    when: { en: "Application-level caches, DNS resolvers, CDN routing.", vi: "Cache mức ứng dụng, giải quyết DNS, định tuyến CDN." },
    pros: [
      { en: "Right policy minimizes cache misses for access pattern", vi: "Chính sách đúng giảm thiểu cache miss theo mẫu truy cập" },
      { en: "LRU is O(1) with a linked hash map", vi: "LRU là O(1) với linked hash map" }
    ],
    cons: [
      { en: "LFU is expensive to implement accurately", vi: "LFU tốn kém để triển khai chính xác" },
      { en: "Scan resistance needed for streaming access", vi: "Cần kháng quét cho truy cập streaming" }
    ],
    complexity: { en: "LRU: O(1) ops; LFU accurate: O(log n); approximate: O(1)", vi: "LRU: O(1) thác đáo; LFU chính xác: O(log n); xấp xỉ: O(1)" },
    providerSpecific: {
      csharp: "MemoryCache with size limit + expiry; ConcurrentDictionary + custom eviction",
      python: "functools.lru_cache(maxsize=N); cachetools LRUCache / LFUCache",
      go: "golang-lru/v2 (groupcache); sync.Map does not evict",
      rust: "lru crate; moka (Caffeine-inspired TinyLFU)",
      java: "Caffeine (W-TinyLFU, near-optimal); Guava LoadingCache",
      javascript: "lru-cache npm; Map as manual FIFO",
      cpp: "Abseil lru_cache; custom LRU with std::list + std::unordered_map"
    }
  },
  {
    id: "backpressure",
    name: { en: "Backpressure and Flow Control", vi: "Áp lực ngược và kiểm soát luồng" },
    origin: { en: "Reactive Streams specification (2013); TCP flow control in networking.", vi: "Đặc tả Reactive Streams (2013); kiểm soát luồng TCP trong mạng máy tính." },
    what: { en: "Mechanism by which a consumer signals to a producer to slow down or pause.", vi: "Cơ chế consumer báo hiệu cho producer làm chậm hoặc tạm dừng." },
    how: { en: "Use bounded queues, permits, or demand signaling; drop/buffer/retry on overflow.", vi: "Dùng hàng đợi có giới hạn, permit hoặc báo hiệu nhu cầu; xử lý tràn bằng drop/buffer/retry." },
    when: { en: "Producer faster than consumer in pipelines; prevents unbounded memory growth.", vi: "Producer nhanh hơn consumer trong pipeline; ngăn bộ nhớ tăng vô hạn." },
    pros: [
      { en: "Prevents OOM from fast producers", vi: "Ngăn OOM từ producer nhanh" },
      { en: "Enables predictable latency under load", vi: "Cho phép độ trễ có thể dự đoán dưới tải" }
    ],
    cons: [
      { en: "Added complexity in pipeline design", vi: "Tăng phức tạp trong thiết kế pipeline" },
      { en: "Tuning buffer sizes requires load testing", vi: "Điều chỉnh kích thước buffer cần kiểm thử tải" }
    ],
    complexity: { en: "O(1) signal overhead per permit/demand call", vi: "Overhead tín hiệu O(1) mỗi lần gọi permit/nhu cầu" },
    providerSpecific: {
      csharp: "Channel<T> with bounded capacity; IAsyncEnumerable with cancellation",
      python: "asyncio.Queue(maxsize=N); anyio memory streams",
      go: "Buffered channels (make(chan T, N)); select with default for non-blocking",
      rust: "tokio::sync::mpsc bounded channel; async-channel",
      java: "BlockingQueue; Reactor Flux.limitRate(); Reactive Streams Publisher",
      javascript: "WritableStream backpressure in WHATWG Streams API",
      cpp: "Boost.Asio strand queues; custom semaphore + producer throttle"
    }
  },
  {
    id: "statistics-benchmarks",
    name: { en: "Benchmarking and Statistical Analysis", vi: "Chuẩn tham số và phân tích thống kê" },
    origin: { en: "Performance engineering methodology; Cliff's delta, Latin hypercube sampling.", vi: "Phương pháp kỹ thuật hiệu năng; Cliff's delta, lấy mẫu Latin hypercube." },
    what: { en: "Rigorous measurement of code performance with statistical analysis to detect real improvements.", vi: "Đo lường chặt chẽ hiệu năng code với phân tích thống kê để phát hiện cải tiến thực sự." },
    how: { en: "Use dedicated benchmark harnesses; warm up JIT; measure percentiles not just mean; use t-test.", vi: "Dùng harness benchmark chuyên dụng; làm ấm JIT; đo phân vị không chỉ trung bình; dùng t-test." },
    when: { en: "Before/after every optimization to verify improvement is real and significant.", vi: "Trước/sau mỗi tối ưu để xác minh cải tiến là thực sự và có ý nghĩa." },
    pros: [
      { en: "Separates real gains from noise", vi: "Phân tách lợi ích thực với nhiễu" },
      { en: "Prevents regression-masking optimizations", vi: "Ngăn tối ưu che giấu hồi quy" }
    ],
    cons: [
      { en: "Requires dedicated infrastructure", vi: "Yêu cầu cơ sở hạ tầng chuyên dụng" },
      { en: "Easy to benchmark the wrong thing (microbench traps)", vi: "Dễ benchmark sai thứ (bẫy microbench)" }
    ],
    complexity: { en: "Measurement overhead: harness-dependent; statistics: O(n samples)", vi: "Overhead đo lường: phụ thuộc harness; thống kê: O(n mẫu)" },
    providerSpecific: {
      csharp: "BenchmarkDotNet (standard library of .NET perf)",
      python: "timeit / pytest-benchmark / pyperf",
      go: "go test -bench; benchstat for statistical comparison",
      rust: "criterion.rs (statistical, Welch t-test); cargo-bench",
      java: "JMH (Java Microbenchmark Harness); async-profiler",
      javascript: "Benchmark.js; Vitest bench; browser DevTools timeline",
      cpp: "Google Benchmark; Celero; nanobench"
    }
  }
];

export const DETAILED_CONCEPT_ROWS = CONCEPTS.map((concept) => {
  const row = {
    id: concept.id,
    conceptName: concept.name,
    origin: concept.origin,
    what: concept.what,
    how: concept.how,
    when: concept.when,
    pros: {
      en: concept.pros.map(p => typeof p === "string" ? p : p.en).join("; "),
      vi: concept.pros.map(p => typeof p === "string" ? p : (p.vi || p.en)).join("; ")
    },
    cons: {
      en: concept.cons.map(c => typeof c === "string" ? c : c.en).join("; "),
      vi: concept.cons.map(c => typeof c === "string" ? c : (c.vi || c.en)).join("; ")
    },
    complexity: concept.complexity
  };

  for (const lang of LANGUAGES) {
    row[`${lang.id}_provider`] = PROVIDERS[lang.id];
    row[`${lang.id}_specific`] = concept.providerSpecific[lang.id] || "-";
  }

  return row;
});
