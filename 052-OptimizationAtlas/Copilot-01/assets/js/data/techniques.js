import { LANGUAGES } from "./meta.js";

export const TECHNIQUES = [
  {
    id: "data-locality",
    order: 1,
    level: "basic",
    category: "Data Layout",
    name: {
      en: "Data Locality and Cache-friendly Layout",
      vi: "Tính cục bộ dữ liệu và bố trí thân thiện cache"
    },
    summary: {
      en: "Arrange data so CPU cache lines are reused effectively.",
      vi: "Sắp xếp dữ liệu để CPU tái sử dụng cache line hiệu quả."
    },
    origin: { en: "From hardware cache hierarchy and systems programming practices.", vi: "Từ cấu trúc cache phân cấp phần cứng và thực hành lập trình hệ thống." },
    what: { en: "Organize structures and iteration order so frequently accessed fields stay close in memory.", vi: "Tổ chức cấu trúc và thứ tự duyệt để các trường truy cập thường xuyên nằm gần nhau trong bộ nhớ." },
    how: { en: "Prefer contiguous arrays, structure-of-arrays for hot loops, and sequential traversal.", vi: "Ưu tiên mảng liền kề, cấu trúc mảng cho vòng lặp nóng và duyệt tuần tự." },
    when: { en: "Large loops, numeric kernels, game engines, data pipelines.", vi: "Vòng lặp lớn, nhân số học, game engine, pipeline dữ liệu." },
    pros: [
      { en: "Lower cache miss rate", vi: "Tỷ lệ cache miss thấp hơn" },
      { en: "Higher throughput with the same algorithm", vi: "Thông lượng cao hơn với cùng thuật toán" },
      { en: "Usually no algorithmic risk", vi: "Thường không có rủi ro thuật toán" }
    ],
    cons: [
      { en: "Can reduce code readability", vi: "Có thể giảm độ dễ đọc của code" },
      { en: "May require data model changes", vi: "Có thể cần thay đổi mô hình dữ liệu" }
    ],
    complexity: {
      time: { en: "Usually constant-factor speedup; asymptotic unchanged", vi: "Thường tăng tốc hằng số; độ phức tạp không đổi" },
      space: { en: "Neutral or slightly lower due to compact layout", vi: "Trung tính hoặc thấp hơn một chút do bố cục gọn" },
      cost: { en: "Medium refactor effort", vi: "Nỗ lực tái cấu trúc trung bình" }
    },
    buildingBlocks: ["cache-lines", "contiguous-containers", "profilers"],
    mermaid: "flowchart LR\nA[CPU] --> B[L1/L2/L3 Cache]\nB --> C[Contiguous Data]\nC --> D[Fewer Cache Misses]\nD --> E[Higher Throughput]",
    languageDetails: {
      csharp: { name: "Span<T>/Memory<T> + arrays", specifics: "Use struct layout and Span<T> for contiguous access." },
      python: { name: "NumPy arrays / array module", specifics: "Vectorized contiguous buffers outperform Python object lists." },
      go: { name: "Slices over arrays", specifics: "Avoid pointer-chasing linked structures in hot paths." },
      rust: { name: "Vec<T>, slices", specifics: "Prefer packed structs and predictable iteration." },
      java: { name: "Primitive arrays / ByteBuffer", specifics: "Avoid boxing in hot loops." },
      javascript: { name: "TypedArray", specifics: "Typed arrays give dense numeric storage." },
      cpp: { name: "std::vector / AoS-SoA tuning", specifics: "Cache-aware layout is common in HPC code." }
    },
    examples: {
      csharp: "var sum = 0;\nvar arr = new int[1_000_000];\nfor (int i = 0; i < arr.Length; i++) sum += arr[i];",
      python: "import numpy as np\na = np.arange(1_000_000, dtype=np.int64)\ns = int(a.sum())",
      go: "sum := 0\narr := make([]int, 1_000_000)\nfor i := range arr { sum += arr[i] }",
      rust: "let v = vec![0_i64; 1_000_000];\nlet sum: i64 = v.iter().sum();",
      java: "int[] arr = new int[1_000_000];\nlong sum = 0;\nfor (int x : arr) sum += x;",
      javascript: "const a = new Int32Array(1_000_000);\nlet sum = 0;\nfor (let i = 0; i < a.length; i++) sum += a[i];",
      cpp: "std::vector<int> v(1'000'000);\nlong long sum = 0;\nfor (int x : v) sum += x;"
    }
  },
  {
    id: "preallocation-pooling",
    order: 2,
    level: "basic",
    category: "Allocation",
    name: {
      en: "Preallocation and Object Pooling",
      vi: "Cấp phát trước và tái sử dụng đối tượng"
    },
    summary: {
      en: "Reduce allocation churn and GC pressure by reusing memory.",
      vi: "Giảm tạo mới liên tục và áp lực GC bằng cách tái sử dụng bộ nhớ."
    },
    origin: { en: "Game engines and low-latency systems where allocation spikes hurt latency.", vi: "Game engine và hệ thống độ trễ thấp nơi các đột biến cấp phát làm tăng độ trễ." },
    what: { en: "Reserve capacity early and reuse objects from pools instead of repeatedly allocating.", vi: "Dự trữ dung lượng sớm và tái dùng đối tượng từ pool thay vì cấp phát liên tục." },
    how: { en: "Use capacity hints, pools, arenas, or reusable buffers.", vi: "Dùng gợi ý dung lượng, pool, arena hoặc buffer tái sử dụng được." },
    when: { en: "High-frequency request handling, parsing loops, frame-based systems.", vi: "Xử lý yêu cầu tần suất cao, vòng lặp phân tích, hệ thống theo khung." },
    pros: [
      { en: "Lower GC/allocator overhead", vi: "Giảm overhead GC/bộ cấp phát" },
      { en: "More stable tail latency", vi: "Độ trễ đuôi ổn định hơn" }
    ],
    cons: [
      { en: "Potential stale-state bugs", vi: "Lỗi trạng thái cũ tiềm ẩn" },
      { en: "Pool sizing complexity", vi: "Phức tạp khi định cỡ pool" }
    ],
    complexity: {
      time: { en: "Lower allocation overhead; asymptotic unchanged", vi: "Overhead cấp phát thấp hơn; độ phức tạp không đổi" },
      space: { en: "Higher steady-state reserved memory", vi: "Bộ nhớ dự trữ ổn định cao hơn" },
      cost: { en: "Low to medium", vi: "Thấp đến trung bình" }
    },
    buildingBlocks: ["allocators", "gc", "arenas"],
    languageDetails: {
      csharp: { name: "ArrayPool<T>/ObjectPool", specifics: "Use Microsoft.Extensions.ObjectPool and ArrayPool<T>." },
      python: { name: "List pre-size patterns / buffer reuse", specifics: "Reuse bytearray, deque, and worker-local objects." },
      go: { name: "sync.Pool", specifics: "Good for temporary objects under concurrent load." },
      rust: { name: "with_capacity / typed arenas", specifics: "Reserve Vec capacity and use arena crates if needed." },
      java: { name: "Object pools / ByteBuffer reuse", specifics: "Prefer pooling only for expensive objects." },
      javascript: { name: "ArrayBuffer reuse", specifics: "Reuse typed-array buffers in hot rendering/data paths." },
      cpp: { name: "reserve + custom allocators", specifics: "PMR allocators and slab pools are common." }
    },
    examples: {
      csharp: "var list = new List<int>(10000);\nvar buf = System.Buffers.ArrayPool<byte>.Shared.Rent(4096);",
      python: "buf = bytearray(4096)\nfor _ in range(1000):\n    buf[:4] = b'data'",
      go: "var pool = sync.Pool{New: func() any { b := make([]byte, 4096); return &b }}",
      rust: "let mut v: Vec<u8> = Vec::with_capacity(4096);\nv.clear();",
      java: "ByteBuffer buf = ByteBuffer.allocateDirect(4096);\nbuf.clear();",
      javascript: "const buf = new Uint8Array(4096);\nbuf.fill(0);",
      cpp: "std::vector<int> v;\nv.reserve(10000);"
    }
  },
  {
    id: "lazy-streaming",
    order: 3,
    level: "basic",
    category: "Execution Model",
    name: {
      en: "Lazy Evaluation and Streaming",
      vi: "Tính toán trễ và xử lý luồng"
    },
    summary: {
      en: "Process data incrementally instead of materializing full datasets.",
      vi: "Xử lý tăng dần thay vì tải toàn bộ dữ liệu vào bộ nhớ."
    },
    origin: { en: "Functional programming and IO pipeline design.", vi: "Lập trình hàm và thiết kế pipeline IO." },
    what: { en: "Compute only when needed and consume sequences chunk by chunk.", vi: "Chỉ tính toán khi cần và tiêu thụ chuỗi theo từng khối." },
    how: { en: "Use iterators, generators, streams, and backpressure-aware pipelines.", vi: "Dùng iterator, generator, stream và pipeline nhận thức áp lực ngược." },
    when: { en: "Large files, network streams, ETL, memory-sensitive workloads.", vi: "Tập tin lớn, luồng mạng, ETL, khối lượng công việc nhạy cảm bộ nhớ." },
    pros: [
      { en: "Lower peak memory", vi: "Bộ nhớ đỉnh thấp hơn" },
      { en: "Composable pipelines", vi: "Pipeline có thể kết hợp" }
    ],
    cons: [
      { en: "Debugging can be harder", vi: "Gỡ lỗi có thể khó hơn" },
      { en: "Potential iterator overhead", vi: "Overhead iterator tiềm ẩn" }
    ],
    complexity: {
      time: { en: "Similar asymptotics, may improve cache behavior", vi: "Độ phức tạp tương đương, có thể cải thiện hành vi cache" },
      space: { en: "O(chunk) instead of O(n) materialization", vi: "O(khối) thay vì O(n) vật chất hóa" },
      cost: { en: "Low", vi: "Thấp" }
    },
    buildingBlocks: ["iterators", "backpressure", "profilers"],
    languageDetails: {
      csharp: { name: "IEnumerable / IAsyncEnumerable", specifics: "yield return and async streams." },
      python: { name: "Generators", specifics: "yield with itertools for low-memory pipelines." },
      go: { name: "Channels + iter loops", specifics: "Use goroutines/channels for streamed stages." },
      rust: { name: "Iterator trait", specifics: "Zero-cost iterator chains in optimized builds." },
      java: { name: "Stream API", specifics: "Lazily fused map/filter/reduce." },
      javascript: { name: "Generators / async iterators", specifics: "for await over async sources." },
      cpp: { name: "Ranges/views", specifics: "C++20 ranges enable lazy composition." }
    },
    examples: {
      csharp: "IEnumerable<int> Evens(int n){ for(int i=0;i<n;i++) if((i&1)==0) yield return i; }",
      python: "def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i",
      go: "for scanner.Scan() { line := scanner.Text(); _ = line }",
      rust: "let sum: i32 = (0..1_000_000).filter(|x| x % 2 == 0).sum();",
      java: "long c = java.util.stream.IntStream.range(0, 1_000_000).filter(i -> i % 2 == 0).count();",
      javascript: "function* evens(n){ for(let i=0;i<n;i++) if(i%2===0) yield i; }",
      cpp: "auto v = std::views::iota(0, 1'000'000) | std::views::filter([](int x){ return x % 2 == 0; });"
    }
  },
  {
    id: "memoization-caching",
    order: 4,
    level: "intermediate",
    category: "Execution Model",
    name: {
      en: "Memoization and Caching",
      vi: "Ghi nhớ kết quả và bộ đệm"
    },
    summary: {
      en: "Trade memory for speed by reusing previously computed results.",
      vi: "Đánh đổi bộ nhớ lấy tốc độ bằng cách tái sử dụng kết quả đã tính."
    },
    origin: { en: "Dynamic programming and web/backend cache architectures.", vi: "Lập trình động và kiến trúc cache web/backend." },
    what: { en: "Store function results or expensive query outputs keyed by input.", vi: "Lưu kết quả hàm hoặc đầu ra truy vấn tốn kém theo khóa đầu vào." },
    how: { en: "Use hash maps, LRU caches, TTL caches, and invalidation rules.", vi: "Dùng hash map, cache LRU, cache TTL và quy tắc vô hiệu hóa." },
    when: { en: "Repeated calculations, expensive IO, deterministic pure functions.", vi: "Tính toán lặp lại, IO tốn kém, hàm thuần xác định." },
    pros: [
      { en: "Big speedups on repeated workloads", vi: "Tăng tốc lớn với khối lượng lặp lại" },
      { en: "Reduces backend pressure", vi: "Giảm áp lực backend" }
    ],
    cons: [
      { en: "Memory growth", vi: "Tăng trưởng bộ nhớ" },
      { en: "Invalidation complexity", vi: "Phức tạp vô hiệu hóa" }
    ],
    complexity: {
      time: { en: "Lookup O(1) average; misses pay original cost", vi: "Tra cứu trung bình O(1); lần trượt trả chi phí gốc" },
      space: { en: "O(k) for cached entries", vi: "O(k) cho các mục được cache" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["hashmaps", "eviction", "coherency"],
    languageDetails: {
      csharp: { name: "MemoryCache", specifics: "Use size-limited entries and expiry." },
      python: { name: "functools.lru_cache", specifics: "Simple memoization for pure functions." },
      go: { name: "map + eviction policy", specifics: "Use sync.Map or guarded map with LRU packages." },
      rust: { name: "HashMap/LruCache crates", specifics: "Crates provide TTL/LRU behavior." },
      java: { name: "Caffeine/Guava", specifics: "W-TinyLFU offers strong hit rates." },
      javascript: { name: "Map + LRU libraries", specifics: "Memoize pure function outputs." },
      cpp: { name: "unordered_map + LRU", specifics: "Custom policies for latency critical services." }
    },
    examples: {
      csharp: "var cache = new Dictionary<int,long>();\nlong Fib(int n)=> cache.TryGetValue(n,out var v)?v:cache[n]=(n<2?n:Fib(n-1)+Fib(n-2));",
      python: "from functools import lru_cache\n@lru_cache(maxsize=1024)\ndef fib(n): return n if n < 2 else fib(n-1) + fib(n-2)",
      go: "memo := map[int]int{}\nvar fib func(int) int\nfib = func(n int) int { if n < 2 { return n }; if v, ok := memo[n]; ok { return v }; memo[n] = fib(n-1)+fib(n-2); return memo[n] }",
      rust: "use std::collections::HashMap;",
      java: "Map<Integer, Long> memo = new HashMap<>();",
      javascript: "const memo = new Map();\nfunction fib(n){ if(n < 2) return n; if(memo.has(n)) return memo.get(n); const v = fib(n-1)+fib(n-2); memo.set(n,v); return v; }",
      cpp: "std::unordered_map<int,long long> memo;"
    }
  },
  {
    id: "async-concurrency",
    order: 5,
    level: "intermediate",
    category: "Concurrency",
    name: {
      en: "Async I/O and Structured Concurrency",
      vi: "I/O bất đồng bộ và đồng thời có cấu trúc"
    },
    summary: {
      en: "Improve throughput by overlapping waiting time and limiting contention.",
      vi: "Tăng thông lượng bằng cách chồng lấp thời gian chờ và giảm tranh chấp."
    },
    origin: { en: "Event loops, actor models, and modern async runtimes.", vi: "Vòng lặp sự kiện, mô hình actor và runtime async hiện đại." },
    what: { en: "Run many wait-heavy tasks concurrently with clear cancellation and lifecycle boundaries.", vi: "Chạy nhiều tác vụ nặng về chờ đồng thời với hủy rõ ràng và ranh giới vòng đời." },
    how: { en: "Use async/await, task groups, and bounded worker pools.", vi: "Dùng async/await, nhóm tác vụ và pool worker có giới hạn." },
    when: { en: "Network servers, crawlers, pipelines with external IO.", vi: "Máy chủ mạng, trình thu thập, pipeline với IO bên ngoài." },
    pros: [
      { en: "High IO throughput", vi: "Thông lượng IO cao" },
      { en: "Cleaner than callback chains", vi: "Gọn hơn chuỗi callback" }
    ],
    cons: [
      { en: "Context-switch overhead", vi: "Overhead chuyển ngữ cảnh" },
      { en: "Shared-state bugs if misused", vi: "Lỗi trạng thái chia sẻ nếu dùng sai" }
    ],
    complexity: {
      time: { en: "Latency hiding; throughput often scales with in-flight tasks", vi: "Ẩn độ trễ; thông lượng thường mở rộng theo tác vụ đang bay" },
      space: { en: "Task state O(concurrency)", vi: "Trạng thái tác vụ O(đồng thời)" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["async-runtime", "schedulers", "cancellation"],
    languageDetails: {
      csharp: { name: "Task/async-await", specifics: "Use CancellationToken and ValueTask for hot paths." },
      python: { name: "asyncio", specifics: "Use bounded semaphores to avoid overload." },
      go: { name: "Goroutines + channels", specifics: "Cheap goroutines with explicit context cancellation." },
      rust: { name: "Tokio async/await", specifics: "Pinning and Send bounds matter across executors." },
      java: { name: "CompletableFuture / Virtual Threads", specifics: "Virtual threads simplify concurrent IO code." },
      javascript: { name: "Promises + async/await", specifics: "Use Promise.all with concurrency limits." },
      cpp: { name: "std::async/coroutines", specifics: "Modern coroutine frameworks improve scalability." }
    },
    examples: {
      csharp: "await Task.WhenAll(urls.Select(http.GetStringAsync));",
      python: "await asyncio.gather(*(fetch(u) for u in urls))",
      go: "var wg sync.WaitGroup\nfor _, u := range urls { wg.Add(1); go func(url string){ defer wg.Done(); _ = url }(u) }\nwg.Wait()",
      rust: "let _ = futures::future::join_all(tasks).await;",
      java: "CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();",
      javascript: "await Promise.all(urls.map(fetchText));",
      cpp: "auto fut = std::async(std::launch::async, work);"
    }
  },
  {
    id: "zero-copy",
    order: 6,
    level: "intermediate",
    category: "Allocation",
    name: {
      en: "Zero-copy Buffers and Slicing",
      vi: "Buffer zero-copy và cắt lát"
    },
    summary: {
      en: "Avoid unnecessary data copies by passing views/references.",
      vi: "Tránh sao chép dữ liệu không cần thiết bằng cách truyền view/tham chiếu."
    },
    origin: { en: "Systems and network programming where copy costs dominate.", vi: "Lập trình hệ thống và mạng nơi chi phí sao chép chiếm ưu thế." },
    what: { en: "Reuse underlying memory with slices, spans, views, and borrowed references.", vi: "Tái dùng bộ nhớ nền bằng slice, span, view và tham chiếu mượn." },
    how: { en: "Use immutable views and ownership-aware APIs to avoid clone-heavy flows.", vi: "Dùng view bất biến và API nhận thức sở hữu để tránh luồng sao chép nhiều." },
    when: { en: "Protocol parsing, file processing, serialization pipelines.", vi: "Phân tích giao thức, xử lý tập tin, pipeline tuần tự hóa." },
    pros: [
      { en: "Lower CPU and memory bandwidth", vi: "Băng thông CPU và bộ nhớ thấp hơn" },
      { en: "Reduced allocation pressure", vi: "Giảm áp lực cấp phát" }
    ],
    cons: [
      { en: "Lifetime/aliasing complexity", vi: "Phức tạp vòng đời/biệt danh" },
      { en: "Potential accidental retention", vi: "Giữ lưu vô tình tiềm ẩn" }
    ],
    complexity: {
      time: { en: "Can remove O(n) copy steps", vi: "Có thể loại bỏ các bước sao chép O(n)" },
      space: { en: "Lower transient memory", vi: "Bộ nhớ tạm thời thấp hơn" },
      cost: { en: "Medium to high", vi: "Trung bình đến cao" }
    },
    buildingBlocks: ["views", "ownership", "buffers"],
    languageDetails: {
      csharp: { name: "Span<T>/ReadOnlySpan<T>", specifics: "Stack-only spans for safe non-copy slicing." },
      python: { name: "memoryview", specifics: "Works well with bytes-like objects and NumPy." },
      go: { name: "Slice headers", specifics: "Slicing shares backing array; watch retention." },
      rust: { name: "&[T]/&str", specifics: "Borrow checker enforces safe references." },
      java: { name: "ByteBuffer.slice", specifics: "NIO buffers can share underlying storage." },
      javascript: { name: "TypedArray.subarray", specifics: "subarray is view-based; slice copies." },
      cpp: { name: "std::span/string_view", specifics: "Non-owning views avoid copies." }
    },
    examples: {
      csharp: "ReadOnlySpan<byte> header = packet.AsSpan(0, 8);",
      python: "mv = memoryview(b'abcdef')\nsub = mv[1:4]",
      go: "buf := make([]byte, 1024)\nhead := buf[:8]",
      rust: "let s = String::from(\"abcdef\");\nlet sub = &s[1..4];",
      java: "ByteBuffer view = buffer.slice(0, 8);",
      javascript: "const view = new Uint8Array(buf.buffer, 0, 8);",
      cpp: "std::span<const char> head(data.data(), 8);"
    }
  },
  {
    id: "simd-vectorization",
    order: 7,
    level: "advanced",
    category: "Compiler/Runtime",
    name: {
      en: "SIMD and Vectorization",
      vi: "SIMD và vector hóa"
    },
    summary: {
      en: "Use data-parallel CPU instructions to process multiple values per cycle.",
      vi: "Dùng lệnh CPU song song dữ liệu để xử lý nhiều giá trị mỗi chu kỳ."
    },
    origin: { en: "HPC, multimedia, and numerical computing.", vi: "HPC, đa phương tiện và tính toán số học." },
    what: { en: "Exploit SIMD units via compiler auto-vectorization or explicit vector APIs.", vi: "Khai thác đơn vị SIMD qua vector hóa tự động của trình biên dịch hoặc API vector tường minh." },
    how: { en: "Align data, remove dependencies, and use vector-friendly loops.", vi: "Căn chỉnh dữ liệu, loại bỏ phụ thuộc và dùng vòng lặp thân thiện vector." },
    when: { en: "Large numeric arrays, DSP, image processing, analytics kernels.", vi: "Mảng số lớn, DSP, xử lý ảnh, nhân phân tích." },
    pros: [
      { en: "Significant throughput gains", vi: "Tăng thông lượng đáng kể" },
      { en: "Good fit for dense numeric loops", vi: "Phù hợp với vòng lặp số đặc" }
    ],
    cons: [
      { en: "Hardware-dependent behavior", vi: "Hành vi phụ thuộc phần cứng" },
      { en: "Complex benchmarking", vi: "Benchmark phức tạp" }
    ],
    complexity: {
      time: { en: "Constant-factor speedup with same asymptotic order", vi: "Tăng tốc hằng số với cùng bậc độ phức tạp" },
      space: { en: "Usually unchanged", vi: "Thường không đổi" },
      cost: { en: "Medium to high", vi: "Trung bình đến cao" }
    },
    buildingBlocks: ["simd", "compiler-flags", "data-locality"],
    languageDetails: {
      csharp: { name: "System.Numerics.Vector<T>", specifics: "JIT emits vector instructions when possible." },
      python: { name: "NumPy vector ops", specifics: "Vectorized kernels in C/Fortran under the hood." },
      go: { name: "Compiler + asm/intrinsics", specifics: "Limited high-level SIMD APIs; use packages/asm." },
      rust: { name: "std::simd / portable-simd", specifics: "Portable SIMD is evolving but powerful." },
      java: { name: "Vector API (Incubator)", specifics: "Explicit vector programming on JVM." },
      javascript: { name: "WebAssembly SIMD", specifics: "JS itself has no direct SIMD API today." },
      cpp: { name: "Auto-vectorization / intrinsics", specifics: "Mature compiler support and intrinsics." }
    },
    examples: {
      csharp: "var v = new System.Numerics.Vector<float>(arr, 0);",
      python: "import numpy as np\nc = a + b",
      go: "// Go often relies on compiler optimizations or asm for SIMD hot paths",
      rust: "// use portable-simd crate for explicit vector types",
      java: "// jdk.incubator.vector.IntVector usage in JDK with incubator module",
      javascript: "// use WebAssembly SIMD module for vectorized kernels",
      cpp: "// compile with -O3 -march=native for auto-vectorization"
    }
  },
  {
    id: "lock-free-atomics",
    order: 8,
    level: "advanced",
    category: "Concurrency",
    name: {
      en: "Lock-free Structures with Atomics",
      vi: "Cấu trúc lock-free với atomic"
    },
    summary: {
      en: "Use atomic operations to reduce lock contention in hot concurrent paths.",
      vi: "Dùng phép toán atomic để giảm tranh chấp khóa trên đường nóng đa luồng."
    },
    origin: { en: "Non-blocking algorithms and multicore scalability research.", vi: "Thuật toán không chặn và nghiên cứu khả năng mở rộng đa nhân." },
    what: { en: "Coordinate threads with CAS/load-store atomics and memory ordering.", vi: "Phối hợp luồng bằng CAS/atomic load-store và thứ tự bộ nhớ." },
    how: { en: "Build queues/counters with compare-exchange loops and careful ordering.", vi: "Xây dựng hàng đợi/bộ đếm bằng vòng lặp compare-exchange và thứ tự cẩn thận." },
    when: { en: "High contention counters/queues where mutexes become bottlenecks.", vi: "Bộ đếm/hàng đợi tranh chấp cao nơi mutex trở thành điểm nghữn." },
    pros: [
      { en: "Lower contention stalls", vi: "Giảm ngưng trễ tranh chấp" },
      { en: "Improved scalability in hotspots", vi: "Cải thiện khả năng mở rộng ở điểm nóng" }
    ],
    cons: [
      { en: "Hard to reason about", vi: "Khó lập luận" },
      { en: "ABA and memory ordering pitfalls", vi: "Bắy ABA và thứ tự bộ nhớ" }
    ],
    complexity: {
      time: { en: "Amortized near O(1) operations under moderate contention", vi: "Gần O(1) khấu hao dưới tranh chấp vừa phải" },
      space: { en: "Usually compact", vi: "Thường gọn" },
      cost: { en: "High engineering complexity", vi: "Phức tạp kỹ thuật cao" }
    },
    buildingBlocks: ["atomics", "memory-order", "profilers"],
    languageDetails: {
      csharp: { name: "Interlocked / Volatile", specifics: "Atomic primitives in BCL." },
      python: { name: "Limited in CPython", specifics: "GIL reduces need; use multiprocessing/shared memory for true parallelism." },
      go: { name: "sync/atomic", specifics: "Use atomics with race detector and clear invariants." },
      rust: { name: "std::sync::atomic", specifics: "Strong type-level guarantees, explicit ordering." },
      java: { name: "java.util.concurrent.atomic", specifics: "Atomic classes + VarHandle." },
      javascript: { name: "Atomics + SharedArrayBuffer", specifics: "Available with workers in supporting environments." },
      cpp: { name: "std::atomic", specifics: "Full memory model control with low-level power." }
    },
    examples: {
      csharp: "System.Threading.Interlocked.Increment(ref counter);",
      python: "# Use multiprocessing.Value with a lock for process-safe counters",
      go: "atomic.AddInt64(&counter, 1)",
      rust: "counter.fetch_add(1, std::sync::atomic::Ordering::Relaxed);",
      java: "atomicCounter.incrementAndGet();",
      javascript: "Atomics.add(sharedInt32Array, 0, 1);",
      cpp: "counter.fetch_add(1, std::memory_order_relaxed);"
    }
  },
  {
    id: "compiler-runtime-tuning",
    order: 9,
    level: "advanced",
    category: "Compiler/Runtime",
    name: {
      en: "Compiler and Runtime Tuning",
      vi: "Tinh chỉnh trình biên dịch và runtime"
    },
    summary: {
      en: "Tune build/runtime options to unlock optimizer and GC/runtime strengths.",
      vi: "Tinh chỉnh tùy chọn build/runtime để khai thác ưu điểm bộ tối ưu và GC/runtime."
    },
    origin: { en: "Compiler engineering and managed runtime tuning.", vi: "Kỹ thuật trình biên dịch và tinh chỉnh runtime được quản lý." },
    what: { en: "Use optimization levels, PGO, JIT hints, and runtime flags.", vi: "Dùng cấp độ tối ưu, PGO, gợi ý JIT và cờ runtime." },
    how: { en: "Profile first, then tune flags and verify with benchmarks.", vi: "Profile trước, sau đó tinh chỉnh cờ và xác minh bằng benchmark." },
    when: { en: "Performance-critical releases and stable production workloads.", vi: "Phát hành quan trọng về hiệu năng và khối lượng sản xuất ổn định." },
    pros: [
      { en: "Often large gains without code rewrite", vi: "Thường tăng lớn mà không viết lại code" },
      { en: "Works across whole program", vi: "Hoạt động trên toàn chương trình" }
    ],
    cons: [
      { en: "Environment-specific", vi: "Cụ thể theo môi trường" },
      { en: "Can regress if over-tuned", vi: "Có thể hồi quy nếu tinh chỉnh quá mức" }
    ],
    complexity: {
      time: { en: "Can improve broad runtime performance", vi: "Có thể cải thiện hiệu năng runtime rộng rãi" },
      space: { en: "May increase binary size or warmup cost", vi: "Có thể tăng kích thước nhị phân hoặc chi phí khởi động" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["compiler-flags", "pgo", "jit-gc-tuning"],
    languageDetails: {
      csharp: { name: "Tiered JIT / ReadyToRun / PGO", specifics: "Use profile-guided and tiered compilation options." },
      python: { name: "PyPy / C extensions / mypyc", specifics: "Interpreter choice and native extensions matter." },
      go: { name: "go build flags / pprof-guided", specifics: "Tune inliner and GC target via GOGC." },
      rust: { name: "-C opt-level / LTO / PGO", specifics: "Cargo profiles and LLVM tuning are powerful." },
      java: { name: "JVM flags + GC selection", specifics: "Tune G1/ZGC and JIT compilation thresholds." },
      javascript: { name: "V8 optimization patterns", specifics: "Stable object shapes and monomorphic calls help JIT." },
      cpp: { name: "-O3/-Ofast/LTO/PGO", specifics: "Compiler and linker flags can be decisive." }
    },
    examples: {
      csharp: "// Enable TieredPGO in runtimeconfig or project settings",
      python: "# run under PyPy or accelerate with Cython/mypyc for hotspots",
      go: "// GOGC=100 go test -bench . -benchmem",
      rust: "// Cargo.toml: [profile.release] lto = true, codegen-units = 1",
      java: "// Example flags: -XX:+UseG1GC -Xms1g -Xmx1g",
      javascript: "// Keep object shapes stable for V8 optimized paths",
      cpp: "// Build with -O3 -flto -fprofile-generate/use"
    }
  },
  {
    id: "profiling-driven",
    order: 10,
    level: "advanced",
    category: "Measurement",
    name: {
      en: "Profiling-driven Optimization",
      vi: "Tối ưu hóa dựa trên profiling"
    },
    summary: {
      en: "Optimize only measured bottlenecks using CPU/memory profiles.",
      vi: "Chỉ tối ưu các điểm nghữn đã đo bằng profile CPU/bộ nhớ."
    },
    origin: { en: "Scientific performance engineering and observability.", vi: "Kỹ thuật hiệu năng khoa học và khả năng quan sát." },
    what: { en: "Measure, hypothesize, change one thing, and re-measure.", vi: "Đo lường, giả thuyết, thay đổi một thứ, và đo lại." },
    how: { en: "Use flame graphs, allocation profiles, and benchmark baselines.", vi: "Dùng flame graph, profile cấp phát và đường cơ sở benchmark." },
    when: { en: "Always for non-trivial optimization work.", vi: "Luôn luôn cho công việc tối ưu không tầm thường." },
    pros: [
      { en: "Prevents cargo-cult optimization", vi: "Ngăn tối ưu thần tượng" },
      { en: "Maximizes ROI of engineering time", vi: "Tối đa ROI thời gian kỹ thuật" }
    ],
    cons: [
      { en: "Requires tooling discipline", vi: "Yêu cầu kỷ luật công cụ" },
      { en: "Benchmark noise can mislead", vi: "Nhiễu benchmark có thể gây hiểu sai" }
    ],
    complexity: {
      time: { en: "Improves targeted hotspots only", vi: "Chỉ cải thiện các điểm nóng mục tiêu" },
      space: { en: "Profiling overhead during measurement", vi: "Overhead profiling trong khi đo" },
      cost: { en: "Low to medium", vi: "Thấp đến trung bình" }
    },
    buildingBlocks: ["profilers", "benchmarks", "statistics"],
    mermaid: "flowchart TD\nA[Measure] --> B[Find Hotspot]\nB --> C[Apply Small Change]\nC --> D[Re-measure]\nD --> E{Improved?}\nE -- Yes --> F[Keep]\nE -- No --> G[Revert and iterate]",
    languageDetails: {
      csharp: { name: "dotnet-trace / BenchmarkDotNet", specifics: "Use both macro and micro benchmarks." },
      python: { name: "cProfile / py-spy / perf", specifics: "Separate Python overhead from native extension cost." },
      go: { name: "pprof", specifics: "Built-in CPU/heap profiling is a major strength." },
      rust: { name: "criterion + perf/flamegraph", specifics: "Use criterion for stable benchmark statistics." },
      java: { name: "JFR / async-profiler / JMH", specifics: "Use JMH to avoid JVM benchmark traps." },
      javascript: { name: "DevTools profiler / Node --prof", specifics: "Inspect event-loop blocking and hidden class churn." },
      cpp: { name: "perf / VTune / Google Benchmark", specifics: "Use hardware counters and optimized builds." }
    },
    examples: {
      csharp: "// BenchmarkDotNet: [Benchmark] public void HotPath() { /* ... */ }",
      python: "import cProfile\ncProfile.run('workload()')",
      go: "go test -bench=. -benchmem -cpuprofile cpu.out",
      rust: "// criterion_group!(benches, bench_fn);",
      java: "// @Benchmark method in JMH harness",
      javascript: "console.time('x'); workload(); console.timeEnd('x');",
      cpp: "// BENCHMARK(MyHotPath) in Google Benchmark"
    }
  },
  {
    id: "stack-allocation",
    order: 11,
    level: "intermediate",
    category: "Allocation",
    name: {
      en: "Value Types and Stack Allocation",
      vi: "Kiểu giá trị và cấp phát trên stack"
    },
    summary: {
      en: "Keep small objects on the stack or in value types to avoid heap pressure.",
      vi: "Giữ đối tượng nhỏ trên stack hoặc dùng kiểu giá trị để giảm áp lực heap."
    },
    origin: { en: "Systems programming; stack allocation predates heap management in language runtimes.", vi: "Lập trình hệ thống; cấp phát stack có trước quản lý heap trong runtime ngôn ngữ." },
    what: { en: "Use struct/value types and local scope to allocate data on the execution stack.", vi: "Dùng struct/kiểu giá trị và phạm vi cục bộ để cấp phát dữ liệu trên stack thực thi." },
    how: { en: "Declare small, short-lived data as struct or on-stack type; avoid escape to heap.", vi: "Khai báo dữ liệu nhỏ, ngắn hạn là struct hoặc kiểu trên stack; tránh thoát ra heap." },
    when: { en: "Small, short-lived data that does not need polymorphism or shared references.", vi: "Dữ liệu nhỏ, ngắn hạn không cần đa hình hay tham chiếu chia sẻ." },
    pros: [
      { en: "Zero allocator cost", vi: "Chi phí cấp phát bằng không" },
      { en: "GC-invisible", vi: "GC không nhìn thấy" },
      { en: "Better cache density", vi: "Mật độ cache tốt hơn" }
    ],
    cons: [
      { en: "Limited by stack size", vi: "Bị giới hạn bởi kích thước stack" },
      { en: "Copying overhead for large structs", vi: "Overhead sao chép cho struct lớn" }
    ],
    complexity: {
      time: { en: "O(1) allocation and deallocation by pointer decrement", vi: "Cấp phát và giải phóng O(1) bằng giảm con trỏ" },
      space: { en: "Bounded by call stack; typically 1–8 MB", vi: "Bị giới hạn bởi call stack; thường 1–8 MB" },
      cost: { en: "Low", vi: "Thấp" }
    },
    buildingBlocks: ["allocators", "gc", "profilers"],
    languageDetails: {
      csharp: { name: "struct / stackalloc", specifics: "stackalloc allocates a Span<T> on the stack in safe code." },
      python: { name: "Limited; slots reduce per-instance dict", specifics: "__slots__ removes per-object dict overhead." },
      go: { name: "Escape analysis; small vars on stack", specifics: "go build -gcflags=-m shows what escapes." },
      rust: { name: "Local bindings / no Box", specifics: "By default bindings live on the stack; Box moves to heap." },
      java: { name: "Scalar replacement via JIT", specifics: "JIT may scalarize small objects that do not escape." },
      javascript: { name: "SMI / unboxed values in V8", specifics: "V8 keeps small ints unboxed in typed arrays." },
      cpp: { name: "Local variables / alloca", specifics: "Stack objects are destroyed deterministically at scope exit." }
    },
    examples: {
      csharp: "Span<byte> buffer = stackalloc byte[256];",
      python: "class Point:\n    __slots__ = ('x', 'y')\n    def __init__(self, x, y): self.x = x; self.y = y",
      go: "// go build -gcflags=-m 2>&1 | grep 'does not escape'",
      rust: "let buf = [0u8; 256]; // on stack, no heap allocation",
      java: "// JIT handles escape analysis; use primitive types where possible",
      javascript: "const buf = new Int32Array(64); // dense numeric storage",
      cpp: "char buf[256]; // stack allocation, no new"
    }
  },
  {
    id: "soa-pattern",
    order: 12,
    level: "intermediate",
    category: "Data Layout",
    name: {
      en: "Structure of Arrays (SoA) vs Array of Structures (AoS)",
      vi: "Cấu trúc mảng (SoA) so với mảng cấu trúc (AoS)"
    },
    summary: {
      en: "Reorganize fields into separate arrays to maximize SIMD and cache efficiency.",
      vi: "Sắp xếp trường thành mảng riêng biệt để tối đa hóa SIMD và hiệu quả cache."
    },
    origin: { en: "Data-oriented design movement and game engine engineering.", vi: "Phong trào thiết kế hướng dữ liệu và kỹ thuật game engine." },
    what: { en: "Instead of array-of-structs (mixed fields), use struct-of-arrays (fields contiguous per type).", vi: "Thay vì mảng-cấu-trúc (trường hỗn hợp), dùng cấu-trúc-mảng (trường liên tiếp theo kiểu)." },
    how: { en: "Group each field in its own array; iterate fields separately in inner loops.", vi: "Nhóm từng trường vào mảng riêng; duyệt trường riêng lẻ trong vòng lặp bên trong." },
    when: { en: "Hot loops that access only a subset of struct fields, or that can be vectorized.", vi: "Vòng lặp nóng chỉ truy cập một phần trường cấu trúc, hoặc có thể vector hóa." },
    pros: [
      { en: "Better cache utilization per field", vi: "Sử dụng cache tốt hơn theo từng trường" },
      { en: "Enables SIMD across field arrays", vi: "Kích hoạt SIMD trên mảng trường" }
    ],
    cons: [
      { en: "More complex data management", vi: "Quản lý dữ liệu phức tạp hơn" },
      { en: "Pointer bookkeeping", vi: "Quản lý con trỏ" }
    ],
    complexity: {
      time: { en: "Constant-factor improvement in loop throughput", vi: "Cải thiện hằng số thông lượng vòng lặp" },
      space: { en: "Same total memory; may improve cache occupancy", vi: "Tổng bộ nhớ như cũ; có thể cải thiện cách chiếm cache" },
      cost: { en: "Medium refactor effort", vi: "Nỗ lực tái cấu trúc trung bình" }
    },
    buildingBlocks: ["cache-lines", "simd", "profilers"],
    mermaid: "graph LR\nAoS[AoS: xyz xyz xyz] -->|Refactor| SoA[SoA: xxx... yyy... zzz...]\nSoA --> Speedup[SIMD / cache win]",
    languageDetails: {
      csharp: { name: "Multiple arrays / MemoryMarshal", specifics: "Use separate float[] x, y, z arrays for hot fields." },
      python: { name: "NumPy structured arrays / column arrays", specifics: "Prefer separate ndarray per field over array of tuples." },
      go: { name: "Multiple slices", specifics: "Replace []Entity with separate []X, []Y, []Z slices." },
      rust: { name: "Multiple Vec<T>", specifics: "Pattern common in ECS (Entity-Component-System) crates." },
      java: { name: "Multiple primitive arrays", specifics: "Value Objects JEP (Valhalla) may improve AoS case eventually." },
      javascript: { name: "Multiple TypedArrays", specifics: "Float32Array per field for WebGL/physics." },
      cpp: { name: "Multiple std::vector fields", specifics: "SoA is the dominant pattern in HPC/game engines." }
    },
    examples: {
      csharp: "float[] xs = new float[N], ys = new float[N], zs = new float[N];",
      python: "import numpy as np\nxs = np.zeros(N, dtype=np.float32)\nys = np.zeros(N, dtype=np.float32)",
      go: "xs := make([]float64, N)\nys := make([]float64, N)",
      rust: "struct Particles { x: Vec<f32>, y: Vec<f32>, z: Vec<f32> }",
      java: "float[] xs = new float[N]; float[] ys = new float[N];",
      javascript: "const xs = new Float32Array(N);\nconst ys = new Float32Array(N);",
      cpp: "std::vector<float> xs(N), ys(N), zs(N);"
    }
  },
  {
    id: "memory-mapped-files",
    order: 13,
    level: "intermediate",
    category: "Allocation",
    name: {
      en: "Memory-mapped Files and Shared Memory",
      vi: "Tệp ánh xạ bộ nhớ và bộ nhớ dùng chung"
    },
    summary: {
      en: "Map file regions directly into the process address space, letting the OS page content in on demand.",
      vi: "Ánh xạ vùng tệp trực tiếp vào không gian địa chỉ tiến trình, để OS phân trang nội dung theo yêu cầu."
    },
    origin: { en: "POSIX mmap and Windows MapViewOfFile APIs from early Unix.", vi: "API POSIX mmap và Windows MapViewOfFile từ Unix đầu." },
    what: { en: "Bypass read/write syscalls by treating a file as a byte slice in memory.", vi: "Bỏ qua syscall đọc/ghi bằng cách coi tệp là mảng byte trong bộ nhớ." },
    how: { en: "OS maps file pages lazily; dirty pages are written back on flush or close.", vi: "OS ánh xạ trang tệp lười biếng; trang bẩn được ghi lại khi flush hoặc đóng." },
    when: { en: "Large file access with random patterns, IPC, database storage engines.", vi: "Truy cập tệp lớn theo mẫu ngẫu nhiên, IPC, engine lưu trữ CSDL." },
    pros: [
      { en: "Zero-copy IO", vi: "IO zero-copy" },
      { en: "Lazy loading reduces startup cost", vi: "Tải lười biếng giảm chi phí khởi động" },
      { en: "IPC without sockets", vi: "IPC không cần socket" }
    ],
    cons: [
      { en: "Harder to handle errors", vi: "Khó xử lý lỗi hơn" },
      { en: "Fragmentation on 32-bit processes", vi: "Phân mảnh trên tiến trình 32-bit" },
      { en: "OS-dependent behavior", vi: "Hành vi phụ thuộc OS" }
    ],
    complexity: {
      time: { en: "Access O(1) once paged in; page faults on first touch", vi: "Truy cập O(1) sau khi phân trang; lỗi trang lần đầu" },
      space: { en: "Virtual address range; physical pages are demand-paged", vi: "Dải địa chỉ ảo; trang vật lý được phân trang theo yêu cầu" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["views", "buffers", "profilers"],
    languageDetails: {
      csharp: { name: "MemoryMappedFile", specifics: "System.IO.MemoryMappedFiles namespace; supports named maps for IPC." },
      python: { name: "mmap module", specifics: "mmap.mmap wraps OS mmap; supports slicing." },
      go: { name: "golang.org/x/exp/mmap or syscall.Mmap", specifics: "No stdlib high-level wrapper; use os + syscall." },
      rust: { name: "memmap2 crate", specifics: "Safe wrapper around OS mmap." },
      java: { name: "FileChannel.map / MappedByteBuffer", specifics: "NIO; unmapping requires JDK internal APIs or GC." },
      javascript: { name: "SharedArrayBuffer (Node.js only for files)", specifics: "Node fs doesn't expose mmap directly; use native addons." },
      cpp: { name: "mmap / MapViewOfFile", specifics: "Portable via boost::iostreams or direct POSIX/Win32 APIs." }
    },
    examples: {
      csharp: "using var mmf = MemoryMappedFile.CreateFromFile(\"data.bin\", FileMode.Open);\nusing var acc = mmf.CreateViewAccessor();",
      python: "import mmap\nwith open('data.bin','r+b') as f:\n    mm = mmap.mmap(f.fileno(), 0)\n    data = mm[:8]",
      go: "import \"golang.org/x/exp/mmap\"\nr, _ := mmap.Open(\"data.bin\")",
      rust: "use memmap2::MmapOptions;\nlet file = std::fs::File::open(\"data.bin\")?;\nlet map = unsafe { MmapOptions::new().map(&file)? };",
      java: "try(var ch = FileChannel.open(Path.of(\"data.bin\"),StandardOpenOption.READ)){\n  var buf = ch.map(FileChannel.MapMode.READ_ONLY,0,ch.size());\n}",
      javascript: "// Use native addon or SharedArrayBuffer with file descriptor",
      cpp: "int fd = open(\"data.bin\", O_RDONLY);\nvoid* p = mmap(nullptr, size, PROT_READ, MAP_PRIVATE, fd, 0);"
    }
  },
  {
    id: "thread-local-storage",
    order: 14,
    level: "intermediate",
    category: "Concurrency",
    name: {
      en: "Thread-local Storage and Per-core Data",
      vi: "Lưu trữ cục bộ luồng và dữ liệu trên mỗi core"
    },
    summary: {
      en: "Give each thread its own copy of hot state to eliminate synchronization overhead.",
      vi: "Cấp cho mỗi luồng bản sao riêng của trạng thái nóng để loại bỏ overhead đồng bộ."
    },
    origin: { en: "POSIX pthread_key and platform TLS from 1990s threading.", vi: "pthread_key POSIX và TLS nền tảng từ lập trình đa luồng thập niên 90." },
    what: { en: "Thread-local variables live in per-thread storage, invisible to other threads.", vi: "Biến cục bộ luồng sống trong bộ nhớ theo luồng, ẩn với các luồng khác." },
    how: { en: "Declare thread_local/ThreadLocal; aggregate (merge) results on collection.", vi: "Khai báo thread_local/ThreadLocal; tổng hợp (gộp) kết quả khi thu thập." },
    when: { en: "Accumulators, per-thread buffers, random-number generators, loggers.", vi: "Bộ tích lũy, buffer theo luồng, bộ tạo số ngẫu nhiên, logger." },
    pros: [
      { en: "No locking needed for writes", vi: "Không cần khóa khi ghi" },
      { en: "High throughput accumulators", vi: "Bộ tích lũy thông lượng cao" }
    ],
    cons: [
      { en: "Memory multiplied by thread count", vi: "Bộ nhớ nhân với số luồng" },
      { en: "Aggregation complexity", vi: "Phức tạp tổng hợp" }
    ],
    complexity: {
      time: { en: "Access O(1); aggregation O(threads)", vi: "Truy cập O(1); tổng hợp O(luồng)" },
      space: { en: "O(threads × data size)", vi: "O(luồng × kích thước dữ liệu)" },
      cost: { en: "Low", vi: "Thấp" }
    },
    buildingBlocks: ["schedulers", "profilers"],
    languageDetails: {
      csharp: { name: "[ThreadStatic] / ThreadLocal<T>", specifics: "ThreadLocal<T> supports lazy initialization and value enumeration." },
      python: { name: "threading.local()", specifics: "Per-thread attribute namespace; common for DB connections." },
      go: { name: "goroutine-local via context or sync.Pool", specifics: "No explicit TLS; pass state in context.Context." },
      rust: { name: "thread_local! macro", specifics: "Wraps Cell/RefCell for interior mutability per thread." },
      java: { name: "ThreadLocal<T>", specifics: "Use remove() to avoid memory leaks in thread pools." },
      javascript: { name: "Worker-local variables", specifics: "Each Worker has its own global; no cross-worker TLS needed." },
      cpp: { name: "thread_local", specifics: "C++11 keyword; supported on all major platforms." }
    },
    examples: {
      csharp: "[ThreadStatic]\nstatic int _counter;\n// or\nstatic ThreadLocal<int> _tls = new ThreadLocal<int>(() => 0);",
      python: "import threading\n_local = threading.local()\n_local.value = 42",
      go: "// Use context.WithValue or pass per-goroutine structs",
      rust: "thread_local! { static COUNTER: std::cell::Cell<u64> = std::cell::Cell::new(0); }",
      java: "static ThreadLocal<StringBuilder> tls = ThreadLocal.withInitial(StringBuilder::new);",
      javascript: "// Each Worker has its own scope — no shared globals",
      cpp: "thread_local int counter = 0;"
    }
  },
  {
    id: "parallel-task-execution",
    order: 15,
    level: "intermediate",
    category: "Concurrency",
    name: {
      en: "Parallel Task Execution and Work Stealing",
      vi: "Thực thi tác vụ song song và ăn cắp công việc"
    },
    summary: {
      en: "Distribute CPU-bound work across cores using thread/task pools with work-stealing schedulers.",
      vi: "Phân phối công việc CPU-bound qua các core dùng pool và scheduler ăn cắp công việc."
    },
    origin: { en: "Cilk, fork-join frameworks, and multicore processor adoption.", vi: "Cilk, framework fork-join và đánh dấu vi xử lý đa nhân." },
    what: { en: "Split independent data chunks across worker threads; idle workers steal tasks from busy ones.", vi: "Chia khối dữ liệu độc lập qua luồng worker; worker rảnh lấy cắp tác vụ từ luồng bận." },
    how: { en: "Use data-parallel APIs, fork-join, or parallel-for constructs.", vi: "Dùng API song song dữ liệu, fork-join hoặc cấu trúc parallel-for." },
    when: { en: "CPU-bound loops with independent iterations (embarrassingly parallel).", vi: "Vòng lặp CPU-bound với lần lặp độc lập (song song dễ dàng)." },
    pros: [
      { en: "Linear scaling with core count for independent work", vi: "Mở rộng tuyến tính với số core cho công việc độc lập" },
      { en: "Automatic load balancing", vi: "Cân bằng tải tự động" }
    ],
    cons: [
      { en: "Coordination overhead for small tasks", vi: "Overhead phối hợp cho tác vụ nhỏ" },
      { en: "Race conditions if data is not partitioned properly", vi: "Race condition nếu dữ liệu không phân vùng đúng" }
    ],
    complexity: {
      time: { en: "T/P + overhead for P cores on task of cost T", vi: "T/P + overhead cho P core với tác vụ chi phí T" },
      space: { en: "O(P) for task queues", vi: "O(P) cho hàng đợi tác vụ" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["schedulers", "async-runtime", "profilers"],
    languageDetails: {
      csharp: { name: "Parallel.For / PLINQ / Task.WhenAll", specifics: "TPL DataFlow and Parallel class for CPU work." },
      python: { name: "multiprocessing.Pool / concurrent.futures", specifics: "GIL requires multiprocessing for CPU parallelism." },
      go: { name: "Goroutines + GOMAXPROCS", specifics: "Go runtime uses work-stealing M:N scheduler." },
      rust: { name: "rayon crate", specifics: "par_iter() splits work with work-stealing over Rayon's thread pool." },
      java: { name: "ForkJoinPool / Stream.parallel()", specifics: "ForkJoinPool uses work-stealing by default." },
      javascript: { name: "Worker threads (Node.js) / Web Workers", specifics: "SharedArrayBuffer for shared memory; Atomics for sync." },
      cpp: { name: "std::execution / TBB / OpenMP", specifics: "Intel TBB provides work-stealing; C++17 parallel algorithms." }
    },
    examples: {
      csharp: "Parallel.For(0, N, i => { result[i] = Process(data[i]); });",
      python: "from concurrent.futures import ProcessPoolExecutor\nwith ProcessPoolExecutor() as ex:\n    list(ex.map(process, data))",
      go: "var wg sync.WaitGroup\nfor _, chunk := range chunks { wg.Add(1); go func(c Chunk){ defer wg.Done(); process(c) }(chunk) }\nwg.Wait()",
      rust: "use rayon::prelude::*;\ndata.par_iter().map(|x| process(x)).collect::<Vec<_>>();",
      java: "IntStream.range(0, N).parallel().forEach(i -> result[i] = process(data[i]));",
      javascript: "// Split work across Worker threads, collect via MessageChannel",
      cpp: "#include <execution>\nstd::transform(std::execution::par, v.begin(), v.end(), out.begin(), process);"
    }
  },
  {
    id: "string-interning",
    order: 16,
    level: "intermediate",
    category: "Allocation",
    name: {
      en: "String Interning and Deduplication",
      vi: "Intern chuỗi và loại bỏ trùng lập"
    },
    summary: {
      en: "Store only one copy of equal strings to reduce memory and speed up equality tests.",
      vi: "Chỉ lưu một bản sao chuỗi bằng nhau để giảm bộ nhớ và tăng tốc kiểm tra bằng."
    },
    origin: { en: "Lisp and early compiler symbol table design.", vi: "Lisp và thiết kế bảng ký hiệu trình biên dịch sớm." },
    what: { en: "Maintain a pool of canonical string instances; reuse existing instance if content matches.", vi: "Duy trì pool các chuỗi chuẩn; tái sử dụng instance hiện có nếu nội dung khớp." },
    how: { en: "Use intern pools or hash-consing; replace equality check with identity check.", vi: "Dùng pool intern hoặc hash-consing; thay kiểm tra bằng bằng kiểm tra đồng nhất." },
    when: { en: "Many repeated strings (keys, identifiers, tags, log fields).", vi: "Nhiều chuỗi lặp lại (khóa, định danh, tag, trường log)." },
    pros: [
      { en: "Lower memory for repeated strings", vi: "Bộ nhớ thấp hơn cho chuỗi lặp lại" },
      { en: "O(1) identity equality instead of O(n) content comparison", vi: "So sánh đồng nhất O(1) thay vì so sánh nội dung O(n)" }
    ],
    cons: [
      { en: "Interning has upfront cost", vi: "Intern có chi phí ban đầu" },
      { en: "Pool memory is not reclaimed until cleared", vi: "Bộ nhớ pool không được thu hồi cho đến khi xóa" }
    ],
    complexity: {
      time: { en: "Intern O(n) first call; O(1) lookup/compare thereafter", vi: "Intern O(n) lần đầu; tra cứu/so sánh O(1) sau đó" },
      space: { en: "O(unique strings) pool", vi: "Pool O(chuỗi độc nhất)" },
      cost: { en: "Low", vi: "Thấp" }
    },
    buildingBlocks: ["hashmaps", "gc"],
    languageDetails: {
      csharp: { name: "string.Intern / FrozenDictionary", specifics: "string.Intern adds to the intern pool; cannot be released." },
      python: { name: "sys.intern()", specifics: "CPython auto-interns many short strings; sys.intern for others." },
      go: { name: "Manual map[string]string pool", specifics: "No built-in intern; use a global or package-level map." },
      rust: { name: "string-interner / Arc<str> caches", specifics: "Crates like 'string-interner' provide type-safe pools." },
      java: { name: "String.intern() / String pool", specifics: "JVM constant pool; prefer explicit maps to avoid perm gen issues." },
      javascript: { name: "Automatic by V8 for literals", specifics: "String literals are interned; dynamic strings are not." },
      cpp: { name: "std::string_view + dedup map", specifics: "Custom intern pool using unordered_map<std::string_view,…>." }
    },
    examples: {
      csharp: "var s = string.Intern(dynamicStr);",
      python: "import sys\ns = sys.intern(dynamic_str)",
      go: "var pool = map[string]string{}\nfunc intern(s string) string { if v, ok := pool[s]; ok { return v }; pool[s] = s; return s }",
      rust: "// Use 'string-interner' crate:\nuse string_interner::StringInterner;\nlet mut interner = StringInterner::default();\nlet id = interner.get_or_intern(\"hello\");",
      java: "String s = dynamicStr.intern();",
      javascript: "// V8 interns literals automatically; use Map for explicit dedup",
      cpp: "std::unordered_set<std::string> pool;\nauto it = pool.insert(str).first;\nauto view = std::string_view(*it);"
    }
  },
  {
    id: "branch-prediction",
    order: 17,
    level: "advanced",
    category: "Compiler/Runtime",
    name: {
      en: "Branch Prediction and Branchless Code",
      vi: "Dự đoán nhánh và code không rẽ nhánh"
    },
    summary: {
      en: "Eliminate unpredictable conditional branches with arithmetic or select operations.",
      vi: "Loại bỏ các nhánh điều kiện khó dự đoán bằng phép toán hoặc chọn giá trị."
    },
    origin: { en: "CPU pipeline stall analysis from early superscalar architecture research.", vi: "Phân tích ngưng pipeline CPU từ nghiên cứu kiến trúc siêu vô hướng sớm." },
    what: { en: "Replace hard-to-predict if/else branches with conditional moves or arithmetic equivalents.", vi: "Thay các nhánh if/else khó dự đoán bằng di chuyển có điều kiện hoặc tương đương số học." },
    how: { en: "Benchmark branch prediction rate; use ternary/select/CMOV patterns.", vi: "Benchmark tỷ lệ dự đoán nhánh; dùng mẫu ternary/select/CMOV." },
    when: { en: "Inner loops with random or data-dependent branches on hot paths.", vi: "Vòng lặp bên trong có nhánh ngẫu nhiên hoặc phụ thuộc dữ liệu trên đường nóng." },
    pros: [
      { en: "Eliminates misprediction penalties (5-15 cycles each)", vi: "Loại bỏ phạt dự đoán sai (5-15 chu kỳ mỗi lần)" },
      { en: "Improves instruction-level parallelism", vi: "Cải thiện song song cấp lệnh" }
    ],
    cons: [
      { en: "Can increase instruction count", vi: "Có thể tăng số lượng lệnh" },
      { en: "Less readable; requires profiling to confirm gain", vi: "Ít dễ đọc; cần profiling để xác nhận lợi ích" }
    ],
    complexity: {
      time: { en: "Constant-factor speedup in tight loops", vi: "Tăng tốc hằng số trong vòng lặp chặt" },
      space: { en: "Unchanged", vi: "Không đổi" },
      cost: { en: "Medium to high", vi: "Trung bình đến cao" }
    },
    buildingBlocks: ["compiler-flags", "profilers", "simd"],
    languageDetails: {
      csharp: { name: "Conditional expressions / JIT CMOV", specifics: "JIT may emit CMOV for simple ternaries." },
      python: { name: "NumPy np.where", specifics: "np.where applies conditional element-wise without Python branches." },
      go: { name: "Compiler emits CMOV for simple conds", specifics: "Avoid panic-inducing branches in hot loops." },
      rust: { name: "Iterator select / match optimizations", specifics: "LLVM often lowers simple match to CMOV." },
      java: { name: "JIT CMOV via simple ternaries", specifics: "Complex branches may deopt; profile with JMH." },
      javascript: { name: "V8 inline cache optimization", specifics: "Monomorphic functions avoid polymorphic dispatch overhead." },
      cpp: { name: "Ternary / __builtin_expect / CMOV intrinsics", specifics: "__builtin_expect hints to compiler; PGO improves layout." }
    },
    examples: {
      csharp: "int max = a > b ? a : b; // JIT may use CMOV",
      python: "import numpy as np\nresult = np.where(condition, a, b)",
      go: "max := a\nif b > a { max = b }",
      rust: "let max = if a > b { a } else { b }; // LLVM CMOV",
      java: "int max = (a > b) ? a : b;",
      javascript: "const max = a > b ? a : b;",
      cpp: "int max = a > b ? a : b; // likely emits CMOV with -O2"
    }
  },
  {
    id: "inlining-devirtualization",
    order: 18,
    level: "advanced",
    category: "Compiler/Runtime",
    name: {
      en: "Inlining and Devirtualization",
      vi: "Nội tuyến và loại bỏ ảo hóa"
    },
    summary: {
      en: "Eliminate function call overhead and enable further optimizations by inlining hot callees.",
      vi: "Loại bỏ overhead gọi hàm và mở khóa tối ưu thêm bằng cách nội tuyến các callee nóng."
    },
    origin: { en: "Classical compiler optimization literature (Allen & Cocke, Dragon Book).", vi: "Văn học tối ưu trình biên dịch cổ điển (Allen & Cocke, Dragon Book)." },
    what: { en: "Copy callee body into caller; for virtual/dynamic dispatch, speculate or concretize the type.", vi: "Sao chép thân callee vào caller; đối với dispatch ảo/động, đưa ra suy đoán hoặc cụ thể hóa kiểu." },
    how: { en: "Mark hot small functions for inlining; use final/sealed types, static dispatch, value types.", vi: "Đánh dấu hàm nhỏ nóng để nội tuyến; dùng kiểu final/sealed, dispatch tĩnh, kiểu giá trị." },
    when: { en: "Tiny but frequently called functions, virtual dispatch in tight loops.", vi: "Hàm nhỏ nhưng gọi thường xuyên, dispatch ảo trong vòng lặp chặt." },
    pros: [
      { en: "Removes call overhead", vi: "Loại bỏ overhead gọi hàm" },
      { en: "Enables constant folding across call boundary", vi: "Kích hoạt gấp hằng qua ranh giới gọi" }
    ],
    cons: [
      { en: "Binary size growth (code bloat)", vi: "Tăng kích thước nhị phân (phồng mã)" },
      { en: "Recursive inlining can cause exponential expansion", vi: "Nội tuyến đệ quy có thể mở rộng lũy thừa" }
    ],
    complexity: {
      time: { en: "Constant-factor reduction in loop overhead", vi: "Giảm hằng số overhead vòng lặp" },
      space: { en: "Larger binary / code cache pressure", vi: "Nhị phân lớn hơn / áp lực cache mã" },
      cost: { en: "Low (hint-based) to medium (redesign)", vi: "Thấp (dựa trên gợi ý) đến trung bình (thiết kế lại)" }
    },
    buildingBlocks: ["compiler-flags", "pgo", "profilers"],
    languageDetails: {
      csharp: { name: "[MethodImpl(MethodImplOptions.AggressiveInlining)]", specifics: "JIT respects attribute hint; final classes aid devirtualization." },
      python: { name: "C extensions / mypyc / Cython", specifics: "Python has no inlining; move hot functions to C level." },
      go: { name: "Automatic inline budget", specifics: "go build -gcflags=-m shows inlining decisions." },
      rust: { name: "#[inline] / #[inline(always)]", specifics: "LLVM inlines aggressively in opt builds; monomorphization helps." },
      java: { name: "JIT inline heuristics / final / sealed", specifics: "HotSpot inlines up to ~35 bytecodes by default." },
      javascript: { name: "V8 monomorphic inline cache", specifics: "Single-type call sites are inlined by V8 TurboFan." },
      cpp: { name: "inline keyword / LTO / __forceinline", specifics: "LTO enables cross-TU inlining." }
    },
    examples: {
      csharp: "[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]\nstatic int Add(int a, int b) => a + b;",
      python: "# Move hot function to Cython or C extension for inlining",
      go: "// Small functions are inlined automatically; check with -gcflags=-m",
      rust: "#[inline(always)]\nfn add(a: i32, b: i32) -> i32 { a + b }",
      java: "// Mark class as final to help JIT devirtualize",
      javascript: "// Keep call sites monomorphic for V8 inline cache hits",
      cpp: "inline int add(int a, int b) { return a + b; }"
    }
  },
  {
    id: "arena-bump-allocator",
    order: 19,
    level: "advanced",
    category: "Allocation",
    name: {
      en: "Arena and Bump Allocator",
      vi: "Arena và bộ cấp phát bump pointer"
    },
    summary: {
      en: "Allocate from a pre-reserved region; release the entire arena at once instead of individually.",
      vi: "Cấp phát từ vùng đã đặt trước; giải phóng toàn bộ arena cùng lúc thay vì từng đối tượng."
    },
    origin: { en: "Compiler scratch allocators, request-scoped allocation in web servers.", vi: "Bộ cấp phát tạm trình biên dịch, cấp phát phạm vi yêu cầu trong máy chủ web." },
    what: { en: "Bump a pointer through a contiguous buffer; bulk-free by resetting the pointer.", vi: "Tăng con trỏ qua buffer liên tiếp; giải phóng hàng loạt bằng cách đặt lại con trỏ." },
    how: { en: "Create an arena sized for expected allocation; free all by resetting offset to 0.", vi: "Tạo arena cỡ phù hợp cấp phát dự kiến; giải phóng tất cả bằng đặt lại offset về 0." },
    when: { en: "Request/frame-scoped allocations, compilers, parsers, game-frame temporaries.", vi: "Cấp phát phạm vi yêu cầu/khung, trình biên dịch, parser, tạm thời khung game." },
    pros: [
      { en: "O(1) allocation and deallocation", vi: "Cấp phát và giải phóng O(1)" },
      { en: "No fragmentation within arena", vi: "Không phân mảnh trong arena" },
      { en: "Excellent cache behavior", vi: "Hành vi cache xuất sắc" }
    ],
    cons: [
      { en: "Cannot free individual objects", vi: "Không thể giải phóng đối tượng riêng lẻ" },
      { en: "Must size arena correctly in advance", vi: "Phải định cỡ arena đúng trước" }
    ],
    complexity: {
      time: { en: "O(1) alloc/free", vi: "Cấp phát/giải phóng O(1)" },
      space: { en: "Pre-reserved block; may waste if under-used", vi: "Khối dự trữ; có thể lãng phí nếu dùng ít" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["allocators", "gc", "profilers"],
    languageDetails: {
      csharp: { name: "System.Buffers / MemoryPool", specifics: "Use ArrayPool<byte> as frame-scoped arena substitute." },
      python: { name: "No native arena; buffer protocol + bytearray", specifics: "Use bytearray and manual offset for custom arena." },
      go: { name: "sync.Pool + scratch buffers", specifics: "sync.Pool reuses objects; not a true arena." },
      rust: { name: "bumpalo crate", specifics: "bumpalo is a safe bump allocator with typed references." },
      java: { name: "Off-heap DirectByteBuffer arena", specifics: "Allocate large direct buffer; slice into regions." },
      javascript: { name: "Typed array region slicing", specifics: "Pre-allocate Uint8Array; track offset manually." },
      cpp: { name: "Custom allocator / std::pmr::monotonic_buffer_resource", specifics: "C++17 PMR provides arena semantics in the standard library." }
    },
    examples: {
      csharp: "// Use ArrayPool for per-request scratch\nbyte[] buf = ArrayPool<byte>.Shared.Rent(65536);\ntry { /* use buf */ } finally { ArrayPool<byte>.Shared.Return(buf); }",
      python: "class Arena:\n    def __init__(self, cap): self._buf = bytearray(cap); self._off = 0\n    def alloc(self, n): start = self._off; self._off += n; return memoryview(self._buf)[start:start+n]",
      go: "// Use sync.Pool as a simple arena substitute\nbuf := make([]byte, 0, 65536)",
      rust: "use bumpalo::Bump;\nlet arena = Bump::new();\nlet x = arena.alloc(42_i32);",
      java: "ByteBuffer arena = ByteBuffer.allocateDirect(1 << 20);\n// slice regions from arena",
      javascript: "const arena = new Uint8Array(65536);\nlet offset = 0;\nfunction alloc(n){ const start = offset; offset += n; return arena.subarray(start, offset); }",
      cpp: "#include <memory_resource>\nchar buf[65536];\nstd::pmr::monotonic_buffer_resource arena(buf, sizeof(buf));"
    }
  },
  {
    id: "compression-encoding",
    order: 20,
    level: "advanced",
    category: "Data Layout",
    name: {
      en: "Lossless Compression and Compact Encoding",
      vi: "Nén không tổn thất và mã hóa gọn"
    },
    summary: {
      en: "Reduce memory footprint and IO bandwidth by compressing or bit-packing data.",
      vi: "Giảm dung lượng bộ nhớ và băng thông IO bằng cách nén hoặc đóng gói bit dữ liệu."
    },
    origin: { en: "Data compression theory and columnar database storage research.", vi: "Lý thuyết nén dữ liệu và nghiên cứu lưu trữ CSDL dạng cột." },
    what: { en: "Apply dictionary encoding, delta encoding, bit-packing, or general LZ compression to data.", vi: "Áp dụng mã hóa từ điển, mã hóa delta, đóng gói bit hoặc nén LZ chung cho dữ liệu." },
    how: { en: "Choose encoding based on data distribution; decompress lazily or in streaming chunks.", vi: "Chọn mã hóa dựa theo phân phối dữ liệu; giải nén lười biếng hoặc theo khối streaming." },
    when: { en: "Large datasets in memory, high-latency IO, columnar analytics.", vi: "Tập dữ liệu lớn trong bộ nhớ, IO độ trễ cao, phân tích dạng cột." },
    pros: [
      { en: "Lower memory and IO", vi: "Bộ nhớ và IO thấp hơn" },
      { en: "Can improve effective cache capacity", vi: "Có thể cải thiện dung lượng cache hiệu quả" }
    ],
    cons: [
      { en: "CPU overhead for encode/decode", vi: "Overhead CPU cho mã hóa/giải mã" },
      { en: "Random access may be slow", vi: "Truy cập ngẫu nhiên có thể chậm" }
    ],
    complexity: {
      time: { en: "Decode O(n); compression ratio reduces effective data size", vi: "Giải mã O(n); tỷ lệ nén giảm kích thước dữ liệu hiệu quả" },
      space: { en: "Reduced by 2–10× for typical data", vi: "Giảm 2–10× cho dữ liệu điển hình" },
      cost: { en: "Medium", vi: "Trung bình" }
    },
    buildingBlocks: ["buffers", "profilers", "cache-lines"],
    languageDetails: {
      csharp: { name: "System.IO.Compression / MessagePack", specifics: "BrotliStream, GZipStream, MemoryPack for high-perf binary." },
      python: { name: "lz4 / zstandard / msgpack", specifics: "lz4 for speed, zstd for ratio; NumPy structured arrays for columns." },
      go: { name: "compress/* stdlib / lz4-go / zstd", specifics: "Streaming compression via io.Writer wrapping." },
      rust: { name: "lz4_flex / zstd crates", specifics: "Block and streaming APIs; integrate with serde for zero-copy." },
      java: { name: "GZIPOutputStream / LZ4 / Snappy", specifics: "Snappy and LZ4 via third-party JARs for speed." },
      javascript: { name: "CompressionStream (browser) / zlib (Node)", specifics: "CompressionStream in modern browsers; zlib in Node.js." },
      cpp: { name: "zstd / lz4 / snappy libraries", specifics: "Direct C APIs; integrate with memory-mapped buffers." }
    },
    examples: {
      csharp: "using var ms = new MemoryStream();\nusing var gz = new System.IO.Compression.BrotliStream(ms, System.IO.Compression.CompressionMode.Compress);\ngz.Write(data, 0, data.Length);",
      python: "import lz4.frame\ncompressed = lz4.frame.compress(data)",
      go: "import \"compress/zlib\"\nbuf := new(bytes.Buffer)\nw := zlib.NewWriter(buf)\nw.Write(data)",
      rust: "use lz4_flex::compress_prepend_size;\nlet compressed = compress_prepend_size(&data);",
      java: "ByteArrayOutputStream baos = new ByteArrayOutputStream();\nGZIPOutputStream gz = new GZIPOutputStream(baos);\ngz.write(data);",
      javascript: "const cs = new CompressionStream('gzip');\nconst writer = cs.writable.getWriter();\nwriter.write(data);",
      cpp: "// Use ZSTD_compress() from libzstd"
    }
  },
];

export const GENERAL_COMPARISON_ROWS = TECHNIQUES.map((t) => {
  const row = {
    id: t.id,
    order: t.order,
    level: t.level,
    category: t.category,
    name: t.name
  };

  for (const lang of LANGUAGES) {
    const detail = t.languageDetails[lang.id];
    row[lang.id] = detail ? `${detail.name}: ${detail.specifics}` : "-";
  }

  return row;
});
