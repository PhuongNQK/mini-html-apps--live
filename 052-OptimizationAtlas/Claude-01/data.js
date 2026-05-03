const LANGUAGES = ["C#", "Python", "Go", "Rust", "Java", "JavaScript", "C++"];

const MPOTS = [
  {
    id: "stack-alloc",
    level: 1,
    category: "memory-layout",
    name: "Stack Allocation",
    origin: "Hardware / Computer architecture (1950s)",
    summary: "Allocate short-lived data on the call stack rather than the heap for near-zero cost allocation and automatic deallocation.",
    explanation: "The call stack is a region of memory that grows and shrinks as functions are called and return. Each stack frame holds local variables, parameters, and return addresses. Allocation is just a register decrement (O(1)), and deallocation is free (frame is popped automatically). No GC, no fragmentation. Best used for small, fixed-size, short-lived values whose lifetime is bounded by the calling function.",
    pros: ["O(1) allocation/deallocation", "No GC pressure", "Excellent cache locality", "Thread-safe by default (each thread has its own stack)"],
    cons: ["Fixed stack size (typically 1-8 MB)", "Cannot outlive the function scope", "Deep recursion causes stack overflow", "No dynamic sizing"],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n) per frame",
    mermaid: null,
    implementations: {
      "C#": { name: "Value types / stackalloc", snippet: `// Value types auto stack-allocate\nint x = 42;\nPoint p = new Point(1, 2);\n\n// Explicit stack buffer\nSpan<byte> buf = stackalloc byte[128];\nbuf[0] = 0xFF;` },
      "Python": { name: "N/A (CPython uses heap for all objects)", snippet: `# Python allocates all objects on the heap.\n# Local primitives stored in frame's value stack (int, float)\n# but no direct control exposed to user.\n# Use ctypes/numpy for stack-like fixed arrays.\nimport ctypes\nbuf = (ctypes.c_byte * 128)()` },
      "Go": { name: "Automatic (escape analysis)", snippet: `// Go compiler does escape analysis:\n// if a var doesn't escape the function, it goes on stack.\nfunc add(a, b int) int {\n    result := a + b  // stack-allocated\n    return result\n}\n// To verify: go build -gcflags='-m' main.go` },
      "Rust": { name: "Default for local values", snippet: `fn main() {\n    let x: i32 = 42;          // stack\n    let arr: [u8; 128] = [0; 128]; // stack array\n    let s = String::from("hi"); // heap (String)\n    // Fixed-size arrays always on stack\n}` },
      "Java": { name: "JVM stack (primitives only)", snippet: `public void example() {\n    int x = 42;        // stack (primitive)\n    double y = 3.14;   // stack (primitive)\n    // Objects always heap-allocated in Java\n    // JVM JIT may apply scalar replacement\n}` },
      "JavaScript": { name: "Engine-managed (V8 internals)", snippet: `// JS has no direct stack control.\n// V8 may stack-allocate small SMI integers\n// and certain unboxed values internally.\n// TypedArrays provide fixed memory:\nconst buf = new ArrayBuffer(128);\nconst view = new Uint8Array(buf);` },
      "C++": { name: "Default for local variables", snippet: `void example() {\n    int x = 42;           // stack\n    char buf[128];        // stack array\n    std::array<int,4> a{1,2,3,4}; // stack\n    // alloca() for dynamic size (non-portable)\n    void* p = alloca(n);\n}` }
    }
  },
  {
    id: "object-pooling",
    level: 2,
    category: "allocation",
    name: "Object Pooling",
    origin: "Design Patterns (GoF, 1994); widely used in game engines and DB connection pools",
    summary: "Pre-allocate a fixed set of reusable objects; borrow and return instead of allocate and free.",
    explanation: "A pool pre-creates N objects. Callers 'borrow' from the pool; when done, they 'return' it instead of discarding. Eliminates repeated heap allocation/deallocation cycles, reduces GC pressure in managed runtimes, and improves cache warmth since pooled objects occupy the same memory. Critical for tight loops, game engines, DB connection pooling, and high-throughput network servers.",
    pros: ["Eliminates repeated malloc/free overhead", "Reduces GC pauses in managed languages", "Predictable latency", "Better cache locality for reused objects"],
    cons: ["Memory permanently reserved even when idle", "Requires careful return discipline (leaks possible)", "Pool size tuning needed", "Thread-safety adds complexity"],
    timeComplexity: "O(1) borrow/return",
    spaceComplexity: "O(pool_size) fixed",
    implementations: {
      "C#": { name: "ArrayPool<T> / ObjectPool<T> (Microsoft.Extensions)", snippet: `// Built-in ArrayPool\nusing System.Buffers;\nbyte[] buf = ArrayPool<byte>.Shared.Rent(1024);\ntry { /* use buf */ }\nfinally { ArrayPool<byte>.Shared.Return(buf); }\n\n// ObjectPool (NuGet: Microsoft.Extensions.ObjectPool)\nvar pool = new DefaultObjectPool<MyObj>(new DefaultPooledObjectPolicy<MyObj>());\nvar obj = pool.Get();\ntry { /* use */ } finally { pool.Return(obj); }` },
      "Python": { name: "Custom pool or queue.Queue", snippet: `from queue import Queue\nfrom contextlib import contextmanager\n\nclass ObjectPool:\n    def __init__(self, factory, size=10):\n        self._pool = Queue()\n        for _ in range(size):\n            self._pool.put(factory())\n    @contextmanager\n    def acquire(self):\n        obj = self._pool.get()\n        try: yield obj\n        finally: self._pool.put(obj)\n\npool = ObjectPool(lambda: bytearray(1024))\nwith pool.acquire() as buf:\n    buf[0] = 42` },
      "Go": { name: "sync.Pool", snippet: `import "sync"\n\nvar pool = sync.Pool{\n    New: func() any {\n        buf := make([]byte, 1024)\n        return &buf\n    },\n}\n\nfunc handler() {\n    bufPtr := pool.Get().(*[]byte)\n    defer pool.Put(bufPtr)\n    buf := *bufPtr\n    _ = buf\n}` },
      "Rust": { name: "typed-arena / object-pool crate", snippet: `// Using 'object-pool' crate\nuse object_pool::Pool;\n\nlet pool: Pool<Vec<u8>> = Pool::new(32, || Vec::with_capacity(1024));\n{\n    let mut obj = pool.pull(|| Vec::with_capacity(1024));\n    obj.push(42u8);\n} // auto-returned to pool\n\n// Or typed-arena for bump allocation:\nuse typed_arena::Arena;\nlet arena = Arena::new();\nlet x = arena.alloc(42i32);` },
      "Java": { name: "Commons Pool2 / custom", snippet: `import org.apache.commons.pool2.impl.GenericObjectPool;\nimport org.apache.commons.pool2.BasePooledObjectFactory;\n\nvar pool = new GenericObjectPool<>(new BasePooledObjectFactory<byte[]>() {\n    public byte[] create() { return new byte[1024]; }\n    public PooledObject<byte[]> wrap(byte[] b) {\n        return new DefaultPooledObject<>(b);\n    }\n});\nbyte[] buf = pool.borrowObject();\ntry { /* use */ } finally { pool.returnObject(buf); }` },
      "JavaScript": { name: "Custom pool class", snippet: `class ObjectPool {\n  #free = [];\n  #factory;\n  constructor(factory, size = 10) {\n    this.#factory = factory;\n    for (let i = 0; i < size; i++)\n      this.#free.push(factory());\n  }\n  acquire() {\n    return this.#free.length\n      ? this.#free.pop()\n      : this.#factory();\n  }\n  release(obj) { this.#free.push(obj); }\n}\nconst pool = new ObjectPool(() => new Uint8Array(1024));\nconst buf = pool.acquire();\n// use buf\npool.release(buf);` },
      "C++": { name: "Custom pool / Boost.Pool", snippet: `#include <boost/pool/pool.hpp>\n\n// Boost.Pool for fixed-size objects\nboost::pool<> pool(sizeof(MyObject));\nvoid* p = pool.malloc();\nnew(p) MyObject();\n// ...\nstatic_cast<MyObject*>(p)->~MyObject();\npool.free(p);\n\n// Or custom intrusive free-list pool\ntemplate<typename T, size_t N>\nstruct Pool {\n    union Slot { T obj; Slot* next; };\n    Slot slots[N];\n    Slot* head;\n    Pool() { /* link free-list */ }\n    T* acquire() { auto s = head; head = s->next; return &s->obj; }\n    void release(T* p) { auto s = (Slot*)p; s->next = head; head = s; }\n};` }
    }
  },
  {
    id: "arena-allocator",
    level: 2,
    category: "allocation",
    name: "Arena / Region Allocator",
    origin: "1970s compiler design (bump pointer allocators); popularized by tcmalloc, jemalloc, Rust's typed-arena",
    summary: "Allocate many objects from a large pre-reserved block; free all at once by resetting the pointer.",
    explanation: "An arena (or region) is a contiguous block of memory. Allocation is a simple pointer bump — O(1) with no bookkeeping. Individual deallocation is impossible; instead, the entire arena is freed or reset. This perfectly matches use-cases where many objects share the same lifetime: per-request allocations, AST nodes, game frames. Improves cache locality since allocations are contiguous.",
    pros: ["O(1) allocation (pointer bump)", "O(1) bulk free", "Excellent cache locality", "No fragmentation within arena", "No per-object metadata overhead"],
    cons: ["No individual deallocation", "All objects must have same lifetime", "Wasted space if arena is over-provisioned", "Not thread-safe without synchronization"],
    timeComplexity: "O(1) alloc, O(1) free-all",
    spaceComplexity: "O(arena_capacity) pre-reserved",
    implementations: {
      "C#": { name: "NativeMemory / MemoryPool + slabs (custom)", snippet: `using System.Runtime.InteropServices;\n\npublic class Arena : IDisposable {\n    private readonly nint _base;\n    private int _offset;\n    private readonly int _capacity;\n    public Arena(int capacity) {\n        _capacity = capacity;\n        _base = NativeMemory.Alloc((nuint)capacity);\n    }\n    public unsafe Span<byte> Alloc(int size) {\n        var ptr = (byte*)(_base + _offset);\n        _offset += size;\n        return new Span<byte>(ptr, size);\n    }\n    public void Reset() => _offset = 0;\n    public void Dispose() => NativeMemory.Free(_base);\n}` },
      "Python": { name: "bytearray slab / mmap (no built-in)", snippet: `class Arena:\n    def __init__(self, capacity: int):\n        self._buf = bytearray(capacity)\n        self._offset = 0\n    def alloc(self, size: int) -> memoryview:\n        end = self._offset + size\n        view = memoryview(self._buf)[self._offset:end]\n        self._offset = end\n        return view\n    def reset(self):\n        self._offset = 0\n\narena = Arena(1024 * 1024)\nbuf = arena.alloc(256)\n# use buf\narena.reset()  # free all at once` },
      "Go": { name: "Custom slab or go-arena (exp)", snippet: `// Experimental: golang.org/x/exp/arenas\nimport "arena"\n\na := arena.NewArena()\ndefer a.Free()\n\ntype Node struct { Val int; Next *Node }\nn := arena.New[Node](a)\nn.Val = 42\n\n// Or manual slab:\ntype Arena struct { buf []byte; off int }\nfunc (a *Arena) Alloc(n int) []byte {\n    b := a.buf[a.off : a.off+n]\n    a.off += n\n    return b\n}` },
      "Rust": { name: "typed-arena / bumpalo crates", snippet: `use bumpalo::Bump;\n\nlet bump = Bump::new();\nlet x = bump.alloc(5i32);       // O(1)\nlet s = bump.alloc_str("hello"); // O(n) copy\n// Allocate vec of objects:\nlet v: &[i32] = bump.alloc_slice_fill_copy(\n    10, 0\n);\n// All freed when 'bump' drops\n// bumpalo is Send; supports multiple threads\n// with separate arenas per thread` },
      "Java": { name: "JVM off-heap via Unsafe / Panama MemorySegment", snippet: `import java.lang.foreign.*;\n\ntry (Arena arena = Arena.ofConfined()) {\n    MemorySegment seg = arena.allocate(1024);\n    seg.set(ValueLayout.JAVA_INT, 0, 42);\n    // seg is freed when arena closes\n}\n// Alternative: Unsafe (deprecated, avoid)\n// sun.misc.Unsafe unsafe = ...\n// long addr = unsafe.allocateMemory(1024);` },
      "JavaScript": { name: "ArrayBuffer slab (manual)", snippet: `class Arena {\n  #buf;\n  #offset = 0;\n  constructor(bytes) {\n    this.#buf = new ArrayBuffer(bytes);\n  }\n  alloc(bytes) {\n    const view = new Uint8Array(this.#buf, this.#offset, bytes);\n    this.#offset += bytes;\n    return view;\n  }\n  reset() { this.#offset = 0; }\n}\nconst arena = new Arena(1024 * 1024);\nconst a = arena.alloc(256);\narena.reset(); // free all` },
      "C++": { name: "Custom bump allocator / std::pmr::monotonic_buffer_resource", snippet: `#include <memory_resource>\n\nchar buf[1024 * 1024]; // stack slab\nstd::pmr::monotonic_buffer_resource arena{buf, sizeof(buf)};\nstd::pmr::vector<int> v{&arena};\nfor (int i = 0; i < 1000; ++i) v.push_back(i);\n// arena.release() resets to start\n\n// Or C++17 PMR (Polymorphic Memory Resources):\nstd::pmr::pool_options opts{32, 256};\nstd::pmr::unsynchronized_pool_resource pool{opts};` }
    }
  },
  {
    id: "lazy-evaluation",
    level: 2,
    category: "computation",
    name: "Lazy Evaluation",
    origin: "Haskell / functional programming (1970s–90s); Donald Michie coined 'memoization' (1968); LINQ in C# popularized in OOP",
    summary: "Defer computation until the result is actually needed; avoid work whose output is never consumed.",
    explanation: "Lazy evaluation (call-by-need) delays computing a value until it is first accessed. It avoids unnecessary work (values that are never read are never computed), enables infinite data structures, and can reduce memory footprint by generating values on demand. Often paired with memoization — once computed, the value is cached to avoid re-computation. Used heavily in query builders, configuration loading, and stream pipelines.",
    pros: ["Avoids unnecessary computation", "Enables infinite/large sequences", "Reduces memory footprint for unused values", "Composable pipelines with single pass"],
    cons: ["Harder to reason about evaluation order", "Deferred errors make debugging harder", "Thunk overhead if nearly everything is evaluated", "Memory leaks from captured closures holding refs"],
    timeComplexity: "O(k) where k = items consumed",
    spaceComplexity: "O(1) for generators, O(k) for collected",
    implementations: {
      "C#": { name: "Lazy<T>, LINQ (IEnumerable), yield return", snippet: `// Lazy<T> - initialize once on first access\nvar heavy = new Lazy<HeavyObject>(() => new HeavyObject());\nif (needIt) Console.WriteLine(heavy.Value.Data);\n\n// yield return - lazy sequence\nIEnumerable<int> Evens(int max) {\n    for (int i = 0; i <= max; i += 2)\n        yield return i;\n}\n\n// LINQ is lazy: no work until ToList()/foreach\nvar q = Enumerable.Range(0, 1_000_000)\n    .Where(x => x % 2 == 0)\n    .Select(x => x * x);\nforeach (var n in q.Take(5)) Console.WriteLine(n);` },
      "Python": { name: "generators, itertools, functools.cached_property", snippet: `from functools import cached_property\nimport itertools\n\n# Generator - lazy sequence\ndef evens(n):\n    return (x for x in range(n) if x % 2 == 0)\n\nfor x in itertools.islice(evens(10**9), 5):\n    print(x)\n\n# cached_property - compute once on first access\nclass Config:\n    @cached_property\n    def settings(self):\n        return load_from_disk()  # called only once` },
      "Go": { name: "sync.Once, channels as generators", snippet: `import "sync"\n\n// sync.Once - lazy initialization\nvar (\n    instance *DB\n    once     sync.Once\n)\nfunc GetDB() *DB {\n    once.Do(func() { instance = connect() })\n    return instance\n}\n\n// Channel generator (lazy sequence)\nfunc evens(n int) <-chan int {\n    ch := make(chan int)\n    go func() {\n        defer close(ch)\n        for i := 0; i <= n; i += 2 { ch <- i }\n    }()\n    return ch\n}` },
      "Rust": { name: "std::iter::Iterator, once_cell::Lazy", snippet: `use once_cell::sync::Lazy;\n\n// Lazy static initialization\nstatic DB: Lazy<Database> =\n    Lazy::new(|| Database::connect());\n\n// Lazy iterator chain (zero-alloc until collected)\nlet sum: i32 = (0..1_000_000)\n    .filter(|x| x % 2 == 0)\n    .map(|x| x * x)\n    .take(5)\n    .sum();\n\n// Custom generator via impl Iterator\nstruct Evens { cur: i32 }\nimpl Iterator for Evens {\n    type Item = i32;\n    fn next(&mut self) -> Option<i32> {\n        let v = self.cur;\n        self.cur += 2;\n        Some(v)\n    }\n}` },
      "Java": { name: "Stream API (java.util.stream), Supplier<T>", snippet: `import java.util.stream.Stream;\nimport java.util.function.Supplier;\n\n// Lazy stream pipeline\nStream.iterate(0, n -> n + 2)\n    .filter(n -> n > 0)\n    .limit(5)\n    .forEach(System.out::println);\n\n// Lazy init with Supplier\nprivate Supplier<HeavyObj> lazy =\n    () -> { var o = new HeavyObj(); lazy = () -> o; return o; };\nHeavyObj get() { return lazy.get(); }` },
      "JavaScript": { name: "Generators (function*), Promise lazy init", snippet: `// Generator function - lazy sequence\nfunction* evens() {\n  let n = 0;\n  while (true) { yield n; n += 2; }\n}\nconst gen = evens();\nconsole.log(gen.next().value); // 0\nconsole.log(gen.next().value); // 2\n\n// Lazy property via getter\nclass Config {\n  get settings() {\n    const v = loadFromDisk();\n    Object.defineProperty(this, 'settings', { value: v });\n    return v;\n  }\n}` },
      "C++": { name: "std::optional, views (C++20 ranges), std::call_once", snippet: `#include <ranges>\n#include <optional>\n\n// C++20 lazy range pipeline\nauto evens = std::views::iota(0)\n    | std::views::filter([](int x){ return x%2==0; })\n    | std::views::take(5);\nfor (int x : evens) std::cout << x << '\\n';\n\n// Lazy optional init\nstd::optional<HeavyObj> cache;\nHeavyObj& getObj() {\n    if (!cache) cache.emplace();\n    return *cache;\n}` }
    }
  },
  {
    id: "memoization",
    level: 2,
    category: "computation",
    name: "Memoization / Result Caching",
    origin: "Donald Michie, 1968; foundational to dynamic programming (Bellman, 1950s)",
    summary: "Cache the return value of pure/deterministic function calls keyed by their inputs; return cached result on repeated calls.",
    explanation: "Memoization transforms a pure function into one that remembers past results. A hash map stores (input → output). On first call, the result is computed and stored; subsequent identical calls return the cached value in O(1). Ideal for recursive algorithms with overlapping sub-problems (Fibonacci, DP), expensive I/O bound lookups, and pure computations called repeatedly with same args. Not suitable for impure functions with side-effects.",
    pros: ["Converts O(2^n) recursive to O(n) with DP", "Trivial to apply with decorators/wrappers", "Transparent to callers", "Dramatic speedup for repeated calls"],
    cons: ["Memory grows with unique inputs", "Cache invalidation complexity", "Only safe for pure/referentially transparent functions", "Key hashing overhead for complex inputs"],
    timeComplexity: "O(1) for cache hit, O(f(n)) for miss",
    spaceComplexity: "O(unique_inputs)",
    implementations: {
      "C#": { name: "Dictionary<TKey,TVal> / MemoryCache", snippet: `using System.Runtime.Caching;\n\n// Simple dictionary memoize\nvar cache = new Dictionary<int, long>();\nlong Fib(int n) {\n    if (cache.TryGetValue(n, out var v)) return v;\n    var result = n <= 1 ? n : Fib(n-1) + Fib(n-2);\n    cache[n] = result;\n    return result;\n}\n\n// Generic memoize wrapper\nFunc<T, R> Memoize<T, R>(Func<T, R> f) {\n    var d = new Dictionary<T, R>();\n    return x => d.TryGetValue(x, out var r)\n        ? r : d[x] = f(x);\n}` },
      "Python": { name: "@functools.lru_cache / @functools.cache", snippet: `from functools import lru_cache, cache\n\n@cache  # unbounded memo (Python 3.9+)\ndef fib(n: int) -> int:\n    if n <= 1: return n\n    return fib(n - 1) + fib(n - 2)\n\n@lru_cache(maxsize=256)  # bounded LRU\ndef expensive_lookup(key: str) -> dict:\n    return db.fetch(key)\n\nprint(fib(50))              # O(n)\nprint(expensive_lookup.cache_info())  # hits/misses` },
      "Go": { name: "sync.Map or custom map with mutex", snippet: `import "sync"\n\nvar (\n    cache sync.Map  // concurrent safe\n)\n\nfunc fib(n int) int {\n    if n <= 1 { return n }\n    if v, ok := cache.Load(n); ok {\n        return v.(int)\n    }\n    result := fib(n-1) + fib(n-2)\n    cache.Store(n, result)\n    return result\n}` },
      "Rust": { name: "HashMap / cached crate", snippet: `use std::collections::HashMap;\n\nfn fib(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {\n    if n <= 1 { return n; }\n    if let Some(&v) = memo.get(&n) { return v; }\n    let r = fib(n-1, memo) + fib(n-2, memo);\n    memo.insert(n, r);\n    r\n}\n\n// Or 'cached' crate with #[cached] macro:\n#[cached]\nfn fib_cached(n: u64) -> u64 {\n    if n <= 1 { n } else { fib_cached(n-1) + fib_cached(n-2) }\n}` },
      "Java": { name: "HashMap / Guava Cache / Caffeine", snippet: `import com.github.benmanes.caffeine.cache.Cache;\nimport com.github.benmanes.caffeine.cache.Caffeine;\n\nCache<Integer, Long> cache = Caffeine.newBuilder()\n    .maximumSize(10_000)\n    .build();\n\nlong fib(int n) {\n    return cache.get(n, k -> {\n        if (k <= 1) return (long)k;\n        return fib(k-1) + fib(k-2);\n    });\n}` },
      "JavaScript": { name: "Map / WeakMap / memoize-one", snippet: `// Simple memoize\nconst memo = new Map();\nconst fib = (n) => {\n  if (memo.has(n)) return memo.get(n);\n  const r = n <= 1 ? n : fib(n-1) + fib(n-2);\n  memo.set(n, r);\n  return r;\n};\n\n// Generic memoize\nconst memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (!cache.has(key)) cache.set(key, fn(...args));\n    return cache.get(key);\n  };\n};` },
      "C++": { name: "std::unordered_map / manual cache", snippet: `#include <unordered_map>\n\nstd::unordered_map<int, long long> memo;\n\nlong long fib(int n) {\n    if (n <= 1) return n;\n    auto it = memo.find(n);\n    if (it != memo.end()) return it->second;\n    return memo[n] = fib(n-1) + fib(n-2);\n}\n\n// C++23: std::flat_map for better cache locality\n// Template memoize wrapper:\ntemplate<typename F>\nauto memoize(F f) {\n    std::unordered_map</*...*/, /*...*/> cache;\n    return [=](auto&&... args) mutable {\n        auto k = std::make_tuple(args...);\n        auto it = cache.find(k);\n        if (it != cache.end()) return it->second;\n        return cache[k] = f(args...);\n    };\n}` }
    }
  },
  {
    id: "copy-on-write",
    level: 2,
    category: "memory-layout",
    name: "Copy-on-Write (CoW)",
    origin: "UNIX fork() system call (1969, Ken Thompson); used in OS page tables, Python strings, Rust's Cow<T>",
    summary: "Multiple readers share the same memory; only create a private copy when a write is attempted.",
    explanation: "CoW allows sharing of immutable data with zero-copy semantics. When a mutation is needed, a private copy is made at that point. This defers potentially expensive copies to only when necessary. Found in OS page tables (fork copies pages lazily), persistent data structures, Python's string interning, Rust's Cow<T> enum, and database MVCC. Reduces memory usage and speeds up read-heavy workloads.",
    pros: ["Zero-cost reads (shared reference)", "Defers copy cost to write time only", "Reduces memory when mutations are rare", "Enables safe sharing across threads for reads"],
    cons: ["Write triggers unexpected copy (latency spike)", "Complexity: must track shared vs owned state", "CoW thrash: many small writes each trigger copies", "Reference counting overhead"],
    timeComplexity: "O(1) read, O(n) write (copy)",
    spaceComplexity: "O(1) sharing, O(n) after write",
    implementations: {
      "C#": { name: "ImmutableArray<T> + clone-on-write pattern / string interning", snippet: `using System.Collections.Immutable;\n\n// ImmutableArray uses CoW semantics internally\nvar original = ImmutableArray.Create(1, 2, 3);\nvar modified = original.Add(4); // new array; original unchanged\n\n// String interning (CoW via reference sharing)\nstring a = string.Intern(\"hello\");\nstring b = string.Intern(\"hello\");\nConsole.WriteLine(ReferenceEquals(a, b)); // true` },
      "Python": { name: "Implicit in list slices; copy module; str/bytes immutable", snippet: `# Python strings are immutable (shared safely)\na = \"hello\"\nb = a      # no copy, same object\nb += \" world\"  # new object created\nprint(a)   # still \"hello\"\n\n# copy.copy vs copy.deepcopy\nimport copy\norig = [1, [2, 3]]\nshallow = copy.copy(orig)     # CoW-like: inner list shared\ndeep = copy.deepcopy(orig)    # full copy` },
      "Go": { name: "Slice sharing + explicit copy on mutate", snippet: `// Go slices share underlying array (CoW pattern)\norig := []int{1, 2, 3}\nview := orig[:2] // shared backing array\n\n// Mutate safely: copy first\nfunc cowAppend(s []int, v int) []int {\n    c := make([]int, len(s))\n    copy(c, s)\n    return append(c, v)\n}\n\nnewSlice := cowAppend(orig, 4)\nfmt.Println(orig) // [1 2 3] unchanged` },
      "Rust": { name: "std::borrow::Cow<T>", snippet: `use std::borrow::Cow;\n\nfn process(s: Cow<str>) -> Cow<str> {\n    if s.contains('A') {\n        // Clone only if mutation needed\n        Cow::Owned(s.replace('A', 'a'))\n    } else {\n        s  // Return original reference, no copy\n    }\n}\n\nlet s = \"Hello World\";\nlet result = process(Cow::Borrowed(s));\n// result borrows s (no allocation)` },
      "Java": { name: "String pool / copy-on-write collections (CopyOnWriteArrayList)", snippet: `import java.util.concurrent.CopyOnWriteArrayList;\n\n// CopyOnWriteArrayList: full copy on each write\nvar list = new CopyOnWriteArrayList<>(List.of(1,2,3));\n// Multiple readers: zero synchronization needed\n// Any write: creates a new internal array\nlist.add(4); // copies backing array\n\n// String pool is CoW-like via interning\nString a = \"hello\";\nString b = \"hello\";\nSystem.out.println(a == b); // true (same pooled object)` },
      "JavaScript": { name: "Object spread / Object.freeze + produce (Immer.js)", snippet: `// Shallow CoW with spread\nconst orig = { a: 1, b: { c: 2 } };\nconst mutated = { ...orig, a: 99 }; // new obj; orig unchanged\n\n// Immer.js structural sharing (production CoW)\nimport produce from 'immer';\nconst next = produce(orig, draft => {\n  draft.b.c = 42; // CoW: only modified paths copied\n});\nconsole.log(orig.b.c); // still 2` },
      "C++": { name: "std::shared_ptr + clone / Qt implicit sharing", snippet: `#include <memory>\n\nstruct Data { std::vector<int> items; };\n\nstruct CowData {\n    std::shared_ptr<Data> d;\n    void ensure_unique() {\n        if (!d.unique())\n            d = std::make_shared<Data>(*d);\n    }\n    void push(int v) {\n        ensure_unique();\n        d->items.push_back(v);\n    }\n    const auto& get() const { return d->items; }\n};\n\n// Qt uses this pattern for QString, QVector etc.\n// (Qt's \"implicit sharing\")` }
    }
  },
  {
    id: "cache-locality",
    level: 3,
    category: "memory-layout",
    name: "Cache Locality Optimization",
    origin: "CPU cache hierarchy design (1960s onward); Data-Oriented Design (Mike Acton, 2014 CppCon)",
    summary: "Arrange data in memory so that accesses are sequential and fit in CPU cache lines, minimizing cache misses.",
    explanation: "Modern CPUs have L1/L2/L3 caches (64-byte cache lines). Accessing cache-resident data takes ~1-4 ns; a cache miss to RAM takes ~60-100 ns — a 25-100x penalty. Optimizations: keep related data contiguous (SoA vs AoS), use flat arrays instead of linked lists, align structs to cache lines, avoid pointer chasing. Structure-of-Arrays (SoA) packs a single field for many objects together, enabling vectorization and prefetching.",
    pros: ["25-100x speedup on memory-bound loops", "Enables SIMD auto-vectorization", "Hardware prefetcher works well on sequential patterns", "Dramatic improvement on large datasets"],
    cons: ["Requires redesigning data layout", "AoS to SoA transformation adds code complexity", "False sharing between threads on same cache line", "Harder to reason about object identity"],
    timeComplexity: "O(n) but with drastically lower constant",
    spaceComplexity: "O(n) same, but layout-aligned",
    implementations: {
      "C#": { name: "StructLayout, Span<T>, DECS ECS in Unity", snippet: `using System.Runtime.InteropServices;\n\n// Force struct packing / alignment\n[StructLayout(LayoutKind.Sequential, Pack=8)]\npublic struct Particle {\n    public float X, Y, Z;  // 12 bytes\n    public float Vx, Vy, Vz; // 12 bytes\n} // 24 bytes, packed\n\n// SoA pattern with Span<T>\nfloat[] xs = new float[N], ys = new float[N];\nfor (int i = 0; i < N; i++)\n    xs[i] += ys[i] * dt; // sequential access = cache-hot` },
      "Python": { name: "numpy arrays (C-contiguous), struct arrays", snippet: `import numpy as np\n\n# AoS (bad for cache-heavy loops)\nparticles_aos = np.dtype([('x','f4'),('y','f4'),('vx','f4'),('vy','f4')])\n\n# SoA (cache-friendly for per-field ops)\nx = np.zeros(N, dtype=np.float32)\ny = np.zeros(N, dtype=np.float32)\n# Vectorized: operates on contiguous memory\nx += vx * dt  # single cache-line sweep` },
      "Go": { name: "Flat slices; avoid pointer-heavy structs", snippet: `// AoS: pointer-chased, cache-unfriendly\ntype Particle struct { X, Y, Vx, Vy float64 }\nparticles := make([]Particle, N)\n\n// SoA: cache-friendly for separate field loops\ntype ParticlesSoA struct {\n    X, Y, Vx, Vy []float64\n}\nps := ParticlesSoA{\n    X: make([]float64, N), Vx: make([]float64, N),\n    // ...\n}\n// Loop over X alone: sequential cache access\nfor i := range ps.X { ps.X[i] += ps.Vx[i] * dt }` },
      "Rust": { name: "SoA via plain Vec fields; #[repr(C)] alignment", snippet: `// AoS struct\n#[repr(C)]\nstruct Particle { x: f32, y: f32, vx: f32, vy: f32 }\n\n// SoA layout\nstruct Particles {\n    x: Vec<f32>,\n    y: Vec<f32>,\n    vx: Vec<f32>,\n    vy: Vec<f32>,\n}\n\nimpl Particles {\n    fn update(&mut self, dt: f32) {\n        // LLVM can auto-vectorize this:\n        for ((x, vx), (y, vy)) in self.x.iter_mut().zip(&self.vx)\n            .zip(self.y.iter_mut().zip(&self.vy))\n        {\n            *x += vx * dt;\n            *y += vy * dt;\n        }\n    }\n}` },
      "Java": { name: "Primitive arrays vs object arrays; JVM escape analysis", snippet: `// Object array: pointer-chased, GC overhead\nParticle[] aos = new Particle[N]; // N heap objects\n\n// Flat primitive arrays: cache-friendly\nfloat[] x = new float[N];\nfloat[] y = new float[N];\nfloat[] vx = new float[N];\n// JIT can vectorize this loop:\nfor (int i = 0; i < N; i++)\n    x[i] += vx[i] * dt;\n\n// Project Valhalla (Java 25+): value types\n// will allow true SoA-like object arrays` },
      "JavaScript": { name: "TypedArrays (Float32Array) for SoA", snippet: `const N = 100_000;\n// AoS: V8 often de-optimizes mixed-type arrays\nconst particles = Array.from({length:N}, () => ({x:0,y:0,vx:0,vy:0}));\n\n// SoA with TypedArrays: cache-friendly + SIMD in Wasm\nconst x  = new Float32Array(N);\nconst y  = new Float32Array(N);\nconst vx = new Float32Array(N);\nconst vy = new Float32Array(N);\nconst dt = 0.016;\nfor (let i = 0; i < N; i++) {\n  x[i] += vx[i] * dt;\n  y[i] += vy[i] * dt;\n}` },
      "C++": { name: "alignas, #pragma pack, SoA, cacheline padding", snippet: `#include <cstddef>\n\nconstexpr int CACHE_LINE = 64;\n\n// Pad struct to avoid false sharing between threads\nstruct alignas(CACHE_LINE) ThreadCounter {\n    int value = 0;\n    char pad[CACHE_LINE - sizeof(int)];\n};\n\n// SoA pattern\nstruct Particles {\n    alignas(32) float x[N], y[N], vx[N], vy[N];\n    void update(float dt) {\n        // Auto-vectorized with -O2 -march=native\n        for (int i = 0; i < N; ++i)\n            x[i] += vx[i] * dt;\n    }\n};` }
    }
  },
  {
    id: "simd",
    level: 3,
    category: "computation",
    name: "SIMD Vectorization",
    origin: "Flynn's taxonomy (1966); Intel MMX/SSE (1997), AVX (2011), ARM NEON (2002)",
    summary: "Process multiple data elements simultaneously using a single CPU instruction via wide (128–512-bit) vector registers.",
    explanation: "SIMD (Single Instruction, Multiple Data) allows one instruction to operate on 4–16 values in parallel. With AVX-512, a single instruction can add 16 floats simultaneously — 16x throughput on FP32 math. The compiler can auto-vectorize simple loops over contiguous memory. Explicit intrinsics give full control. Critical for image processing, ML inference, DSP, physics simulations, and cryptography.",
    pros: ["4-16x throughput for data-parallel loops", "No threading overhead", "Leverages existing hardware without extra cost", "Auto-vectorized by compilers for simple loops"],
    cons: ["Architecture-specific (SSE vs AVX vs ARM NEON)", "Requires aligned, contiguous data (SoA helps)", "Branching inside loops prevents vectorization", "Porting effort for explicit intrinsics"],
    timeComplexity: "O(n/W) where W = SIMD width",
    spaceComplexity: "O(1) extra (uses registers)",
    implementations: {
      "C#": { name: "System.Runtime.Intrinsics / Vector<T> (hardware intrinsics)", snippet: `using System.Runtime.Intrinsics;\nusing System.Runtime.Intrinsics.X86;\n\n// Auto-SIMD via Vector<T> (portable)\nVector<float> a = new Vector<float>(srcA);\nVector<float> b = new Vector<float>(srcB);\nVector<float> c = a + b; // SIMD add\n\n// Explicit AVX2 intrinsics\nif (Avx2.IsSupported) {\n    var va = Avx.LoadVector256(pA);\n    var vb = Avx.LoadVector256(pB);\n    var vc = Avx.Add(va, vb);\n    Avx.Store(pC, vc);\n}` },
      "Python": { name: "NumPy (C SIMD backend) / numba @vectorize", snippet: `import numpy as np\n\n# NumPy calls SIMD internally via C/Fortran backends\na = np.random.rand(1_000_000).astype(np.float32)\nb = np.random.rand(1_000_000).astype(np.float32)\nc = a + b  # SIMD via OpenBLAS/MKL\n\n# Explicit with Numba\nfrom numba import vectorize, float32\n@vectorize([float32(float32, float32)], target='cpu')\ndef add(a, b): return a + b` },
      "Go": { name: "Compiler auto-vectorization / CGo for intrinsics", snippet: `// Go compiler auto-vectorizes simple loops\n// Use -gcflags=\"-e\" and check assembly\nfunc addSlices(a, b, c []float32) {\n    for i := range a {\n        c[i] = a[i] + b[i]  // may auto-vectorize\n    }\n}\n\n// For explicit SIMD: use CGo + C intrinsics\n// or a library like github.com/klauspost/cpuid\n// Most Go SIMD is via CGo + Plan 9 assembly` },
      "Rust": { name: "std::arch (intrinsics) / packed_simd / portable-simd", snippet: `use std::arch::x86_64::*;\n\n#[target_feature(enable = \"avx2\")]\nunsafe fn add_avx2(a: &[f32], b: &[f32], c: &mut [f32]) {\n    let n = a.len();\n    let chunks = n / 8;\n    let (pa, pb, pc) = (a.as_ptr(), b.as_ptr(), c.as_mut_ptr());\n    for i in 0..chunks {\n        let va = _mm256_loadu_ps(pa.add(i*8));\n        let vb = _mm256_loadu_ps(pb.add(i*8));\n        _mm256_storeu_ps(pc.add(i*8), _mm256_add_ps(va, vb));\n    }\n}\n// Nightly: portable-simd (std::simd)` },
      "Java": { name: "JVM auto-vectorization / Vector API (JEP 338, Java 16+)", snippet: `import jdk.incubator.vector.*;\n\nvar SPECIES = FloatVector.SPECIES_256; // 8 floats\nfloat[] a = new float[N], b = new float[N], c = new float[N];\n\nfor (int i = 0; i < SPECIES.loopBound(N); i += SPECIES.length()) {\n    var va = FloatVector.fromArray(SPECIES, a, i);\n    var vb = FloatVector.fromArray(SPECIES, b, i);\n    va.add(vb).intoArray(c, i);\n}\n// JVM also auto-vectorizes simple loops via C2 JIT` },
      "JavaScript": { name: "WebAssembly SIMD / WASM SIMD128", snippet: `// Direct SIMD in JS not available.\n// Use WebAssembly SIMD (simd128 proposal):\n// compiled via emscripten or Rust/C++ to wasm\n// Example (wat syntax):\n// (v128.load) (v128.load) (f32x4.add) (v128.store)\n\n// JS side: compile Rust with wasm-pack\n// cargo build --target wasm32-unknown-unknown\n// wasm-bindgen --out-dir pkg\n\n// Or use SIMD via typed WebGL/compute shaders` },
      "C++": { name: "Compiler auto-vec (-O2 -mavx2) / Intel Intrinsics", snippet: `#include <immintrin.h>\n\n// Auto-vectorized by compiler:\nvoid add(float* c, const float* a, const float* b, int n) {\n    for (int i = 0; i < n; ++i) c[i] = a[i] + b[i];\n}\n\n// Explicit AVX2 (256-bit, 8 floats at once):\nvoid add_avx2(float* c, const float* a, const float* b, int n) {\n    int i = 0;\n    for (; i <= n - 8; i += 8) {\n        __m256 va = _mm256_loadu_ps(a + i);\n        __m256 vb = _mm256_loadu_ps(b + i);\n        _mm256_storeu_ps(c + i, _mm256_add_ps(va, vb));\n    }\n    for (; i < n; ++i) c[i] = a[i] + b[i]; // scalar tail\n}` }
    }
  },
  {
    id: "zero-copy",
    level: 3,
    category: "io",
    name: "Zero-Copy I/O",
    origin: "sendfile() system call (Linux 2.0, 1996); splice() (Linux 2.6); io_uring (Linux 5.1, 2019)",
    summary: "Transfer data between buffers, files, or network without copying through userspace — data moves directly between kernel buffers or via DMA.",
    explanation: "Traditional I/O requires: kernel reads file → kernel buffer → copy to userspace → copy back to kernel for send. Zero-copy eliminates the userspace round-trip. sendfile() moves data directly from file descriptor to socket descriptor in kernel space. Memory-mapped files (mmap) let the process access file data as memory without explicit read() calls. In languages: slices/spans/views allow sub-ranges without copying underlying buffers.",
    pros: ["Eliminates CPU overhead of copying data", "Reduces user/kernel context switches", "Critical for high-throughput file serving", "Lower latency for large payloads"],
    cons: ["Only beneficial for large buffers (small copies: overhead > benefit)", "Platform-specific syscalls", "Memory mapping adds virtual address space pressure", "io_uring complexity"],
    timeComplexity: "O(1) for view/slice creation, O(n/DMA_bandwidth) for transfer",
    spaceComplexity: "O(1) for views (no copy)",
    implementations: {
      "C#": { name: "Span<T> / Memory<T> / RandomAccess.Read / MemoryMappedFile", snippet: `using System.IO.MemoryMappedFiles;\nusing System;\n\n// Span: zero-copy slice of existing buffer\nbyte[] buffer = new byte[4096];\nSpan<byte> slice = buffer.AsSpan(100, 500);\n// slice refers to same memory, no copy\n\n// Memory-mapped file: OS maps file into VM\nusing var mmf = MemoryMappedFile.CreateFromFile(\"data.bin\");\nusing var view = mmf.CreateViewAccessor();\nview.Read<int>(0, out int val); // no read() syscall` },
      "Python": { name: "memoryview / mmap module", snippet: `import mmap\n\n# memoryview: zero-copy slice\ndata = bytearray(b\"Hello World\" * 1000)\nview = memoryview(data)[5:10]  # no copy\nprint(bytes(view))\n\n# mmap: kernel maps file into process memory\nwith open('data.bin', 'r+b') as f:\n    with mmap.mmap(f.fileno(), 0) as mm:\n        print(mm[0:10])  # direct file access` },
      "Go": { name: "io.Reader chaining / syscall.Mmap / sendfile via net", snippet: `import \"syscall\"\n\n// Zero-copy slice: Go slices are views\nsrc := make([]byte, 4096)\nview := src[100:200]  // same backing array\n\n// Memory-mapped file\nf, _ := os.Open(\"data.bin\")\ndefer f.Close()\nfi, _ := f.Stat()\ndata, _ := syscall.Mmap(\n    int(f.Fd()), 0, int(fi.Size()),\n    syscall.PROT_READ, syscall.MAP_SHARED,\n)\ndefer syscall.Munmap(data)\n// Linux net package uses sendfile() automatically` },
      "Rust": { name: "std::os::unix::fs::FileExt / memmap2 crate / bytes::Bytes", snippet: `use memmap2::MmapOptions;\nuse std::fs::File;\n\nlet file = File::open(\"data.bin\")?;\nlet mmap = unsafe { MmapOptions::new().map(&file)? };\nlet slice: &[u8] = &mmap[0..100]; // direct file access, no copy\n\n// bytes::Bytes: zero-copy reference-counted slices\nuse bytes::Bytes;\nlet data = Bytes::from(vec![1u8; 1024]);\nlet sub = data.slice(10..20); // no copy, ref-counted` },
      "Java": { name: "ByteBuffer.wrap / MappedByteBuffer / FileChannel.transferTo", snippet: `import java.nio.*;\nimport java.nio.channels.*;\n\n// Zero-copy file send (OS sendfile internall)\ntry (var src = FileChannel.open(Path.of(\"data.bin\"));\n     var dst = SocketChannel.open(addr)) {\n    src.transferTo(0, src.size(), dst); // zero-copy!\n}\n\n// Memory-mapped file\ntry (var ch = FileChannel.open(Path.of(\"data.bin\"))) {\n    MappedByteBuffer buf = ch.map(\n        FileChannel.MapMode.READ_ONLY, 0, ch.size());\n    int val = buf.getInt(0); // direct read from mmap\n}` },
      "JavaScript": { name: "SharedArrayBuffer / transferable objects / streams", snippet: `// Transferable: zero-copy buffer ownership transfer\nconst buf = new ArrayBuffer(1024 * 1024);\n// Transfer to Worker (moves, doesn't copy)\nworker.postMessage({ buf }, [buf]);\n// Caller's 'buf' is now detached (zero-copy move)\n\n// Node.js: Buffer.from with offset (no copy)\nconst source = Buffer.alloc(4096);\nconst slice = source.subarray(100, 200);\n// slice points to same memory\n\n// ReadableStream: streaming zero-copy\nconst stream = fs.createReadStream('data.bin');\nstream.pipe(response); // uses sendfile internally` },
      "C++": { name: "mmap / sendfile / std::string_view / std::span", snippet: `#include <sys/mman.h>\n#include <string_view>\n#include <span>\n\n// string_view: zero-copy string slice\nstd::string_view sv = longString.substr(10, 100);\n// no allocation\n\n// std::span (C++20): zero-copy view of any contiguous range\nstd::vector<int> v = {1,2,3,4,5};\nstd::span<int> sp = v;\nstd::span<int> sub = sp.subspan(1, 3); // view[1..4]\n\n// sendfile() for zero-copy file-to-socket\n#include <sys/sendfile.h>\nsendfile(sock_fd, file_fd, nullptr, file_size);` }
    }
  },
  {
    id: "lock-free",
    level: 3,
    category: "concurrency",
    name: "Lock-Free Data Structures",
    origin: "Maurice Herlihy's wait-free/lock-free theory (1991); IBM's Compare-And-Swap hardware (1970s); popularized in Java's java.util.concurrent (2004)",
    summary: "Use atomic CPU operations (CAS, LL/SC) to synchronize concurrent access without mutexes, eliminating deadlock and reducing contention.",
    explanation: "Lock-free algorithms guarantee that at least one thread makes progress in finite steps, even if others are delayed or stalled. They use hardware atomic operations: Compare-And-Swap (CAS), Fetch-And-Add, Load-Linked/Store-Conditional. Avoids mutex lock overhead (~25-100 ns) and deadlock. Used in high-performance queues, counters, and concurrent hash maps. Wait-free (stronger guarantee: all threads complete in bounded steps) is harder to implement.",
    pros: ["No deadlocks or priority inversion", "Lower latency than mutexes for low contention", "Better cache behavior (no lock word contention)", "Scales with core count"],
    cons: ["ABA problem requires careful handling", "Complex to implement correctly", "Livelock possible under extreme contention", "Requires careful memory ordering (acquire/release semantics)"],
    timeComplexity: "O(1) amortized per op (CAS loops)",
    spaceComplexity: "O(n) same as locked equivalent",
    implementations: {
      "C#": { name: "Interlocked / ConcurrentQueue<T> / System.Threading.Channels", snippet: `using System.Threading;\nusing System.Collections.Concurrent;\n\n// Atomic increment\nint counter = 0;\nInterlocked.Increment(ref counter);\nInterlocked.CompareExchange(ref counter, 42, 0); // CAS\n\n// Lock-free queue (MS Queue algorithm)\nvar queue = new ConcurrentQueue<int>();\nqueue.Enqueue(1);\nif (queue.TryDequeue(out int v)) Console.WriteLine(v);\n\n// Channels (bounded/unbounded, lock-free internals)\nvar ch = Channel.CreateUnbounded<int>();\nawait ch.Writer.WriteAsync(42);` },
      "Python": { name: "queue.Queue (GIL-protected) / multiprocessing.Queue", snippet: `from queue import Queue\nimport threading\n\n# Python GIL makes many ops atomic already\n# queue.Queue is thread-safe via mutex internally\nq = Queue()\n\ndef producer():\n    for i in range(10): q.put(i)\n\ndef consumer():\n    while True:\n        item = q.get()\n        if item is None: break\n        print(item)\n        q.task_done()\n\n# No true lock-free in CPython; use Rust ext or C for perf` },
      "Go": { name: "sync/atomic / channels (CSP model)", snippet: `import \"sync/atomic\"\nimport \"sync\"\n\n// Atomic counter\nvar counter int64\natomic.AddInt64(&counter, 1)\natomic.CompareAndSwapInt64(&counter, 0, 42)\n\n// Go idiomatic: channels instead of shared memory\nch := make(chan int, 1024) // buffered = less contention\ngo func() { ch <- 42 }()\nval := <-ch\n\n// sync.Map: concurrent safe map\nvar m sync.Map\nm.Store(\"key\", 42)\nm.Load(\"key\")` },
      "Rust": { name: "std::sync::atomic / crossbeam / dashmap", snippet: `use std::sync::atomic::{AtomicI64, Ordering};\nuse crossbeam::queue::SegQueue;\n\nstatic COUNTER: AtomicI64 = AtomicI64::new(0);\n\n// CAS loop\nlet mut old = COUNTER.load(Ordering::Relaxed);\nloop {\n    match COUNTER.compare_exchange_weak(\n        old, old + 1,\n        Ordering::AcqRel, Ordering::Relaxed\n    ) {\n        Ok(_) => break,\n        Err(x) => old = x,\n    }\n}\n// Lock-free multi-producer queue\nlet q: SegQueue<i32> = SegQueue::new();\nq.push(42);\nq.pop();` },
      "Java": { name: "AtomicInteger / ConcurrentLinkedQueue / LongAdder", snippet: `import java.util.concurrent.atomic.*;\nimport java.util.concurrent.*;\n\n// AtomicInteger CAS\nAtomicInteger counter = new AtomicInteger(0);\ncounter.incrementAndGet();\ncounter.compareAndSet(0, 42);\n\n// High-throughput counter (striped CAS)\nLongAdder adder = new LongAdder();\nadder.increment();\nlong total = adder.sum();\n\n// Lock-free queue\nConcurrentLinkedQueue<Integer> q = new ConcurrentLinkedQueue<>();\nq.offer(42);\nq.poll();` },
      "JavaScript": { name: "SharedArrayBuffer + Atomics", snippet: `// SharedArrayBuffer + Atomics (ES2017+)\nconst sab = new SharedArrayBuffer(4);\nconst arr = new Int32Array(sab);\n\n// Atomic increment (works across Workers)\nAtomics.add(arr, 0, 1);\n// CAS\nAtomics.compareExchange(arr, 0, 0, 42);\n\n// Wait/notify (mutex-like)\nAtomics.wait(arr, 0, 42);\nAtomics.notify(arr, 0, 1);\n\n// Note: JS is single-threaded per context;\n// this matters only with SharedArrayBuffer across Workers` },
      "C++": { name: "std::atomic<T> / lock-free queues (Folly/etc)", snippet: `#include <atomic>\n\nstd::atomic<int> counter{0};\ncounter.fetch_add(1, std::memory_order_relaxed);\n\n// CAS loop\nint old = counter.load();\nwhile (!counter.compare_exchange_weak(\n    old, old + 1,\n    std::memory_order_acq_rel\n)) { /* retry */ }\n\n// Check if lock-free:\nstatic_assert(counter.is_always_lock_free);\n\n// Folly SPSC queue (single-producer/consumer):\nfolly::ProducerConsumerQueue<int> q{1024};\nq.write(42);\nint v; q.read(v);` }
    }
  },
  {
    id: "string-interning",
    level: 2,
    category: "memory-layout",
    name: "String Interning / Deduplication",
    origin: "Lisp symbol tables (1958); Java String pool (JDK 1.0); Python small string cache",
    summary: "Store only one copy of each distinct string value, sharing references; enables O(1) equality comparison by pointer.",
    explanation: "String interning maintains a pool of unique strings. When a new string is created, it is looked up in the pool; if found, the existing reference is returned instead of allocating a new copy. Reduces memory footprint when many duplicate strings exist (e.g., field names in JSON, log levels, config keys). Equality comparison becomes pointer comparison O(1) vs O(n) character comparison. Used in VMs, compilers, and ORMs.",
    pros: ["O(1) equality via pointer comparison", "Reduced memory for duplicate strings", "Improved cache utilization", "Foundation for symbol tables in compilers"],
    cons: ["Pool never shrinks (unless weak references used)", "Hash lookup overhead on intern", "Not suitable for large unique strings", "Concurrency requires synchronization"],
    timeComplexity: "O(n) to intern, O(1) to compare",
    spaceComplexity: "O(unique_strings) for pool",
    implementations: {
      "C#": { name: "string.Intern() / string.IsInterned()", snippet: `// Manual interning\nstring a = string.Intern(\"hello\");\nstring b = string.Intern(\"hello\");\nbool same = ReferenceEquals(a, b); // true\n\n// String literals are auto-interned at compile time\nstring c = \"world\"; // interned\nstring d = \"world\"; // same reference as c\n\n// Custom intern pool with WeakReference for GC\nvar pool = new Dictionary<string, WeakReference<string>>();` },
      "Python": { name: "sys.intern() / automatic for small strings", snippet: `import sys\n\n# Python auto-interns short strings that look like identifiers\na = 'hello'\nb = 'hello'\nprint(a is b)  # True (auto-interned)\n\n# Force interning for arbitrary strings\nx = sys.intern('some long repeated string')\ny = sys.intern('some long repeated string')\nprint(x is y)  # True, uses identity comparison` },
      "Go": { name: "No built-in; manual map[string]string pool", snippet: `// Go strings are immutable; no built-in intern\n// Build manual pool\nvar pool = make(map[string]string)\n\nfunc Intern(s string) string {\n    if v, ok := pool[s]; ok {\n        return v\n    }\n    pool[s] = s\n    return s\n}\n\n// For concurrent use:\nimport \"sync\"\nvar mu sync.RWMutex\nfunc InternSafe(s string) string {\n    mu.RLock()\n    if v, ok := pool[s]; ok { mu.RUnlock(); return v }\n    mu.RUnlock()\n    mu.Lock()\n    defer mu.Unlock()\n    pool[s] = s\n    return s\n}` },
      "Rust": { name: "string-interner / lasso crate / Arc<str>", snippet: `use lasso::{Rodeo, Spur};\n\nlet mut interner = Rodeo::default();\nlet hello: Spur = interner.get_or_intern(\"hello\");\nlet also_hello = interner.get_or_intern(\"hello\");\nassert_eq!(hello, also_hello); // O(1) int comparison\n\n// Resolve back to &str:\nprintln!(\"{}\", interner.resolve(&hello));\n\n// Arc<str> for shared ownership without interning:\nlet s: Arc<str> = Arc::from(\"shared string\");` },
      "Java": { name: "String.intern() / String pool (PermGen/Metaspace)", snippet: `// Java string pool lives in heap (JDK 7+)\nString a = \"hello\";  // auto-interned literal\nString b = new String(\"hello\");  // new heap object\nString c = b.intern();  // returns pooled ref\n\nSystem.out.println(a == c);  // true\nSystem.out.println(a == b);  // false\n\n// Custom pool for non-literal strings\nMap<String, String> pool = new HashMap<>();\nString intern(String s) {\n    return pool.computeIfAbsent(s, k -> k);\n}` },
      "JavaScript": { name: "Symbol / V8 string de-duplication (automatic)", snippet: `// V8 auto-interns short repeated strings internally\n// No direct control exposed in JS\n\n// Symbol as unique string-like tokens\nconst LOG_LEVEL = Symbol('INFO');\nconst SAME = Symbol.for('INFO'); // global registry\n\n// Map-based manual intern\nconst pool = new Map();\nconst intern = s => {\n  if (!pool.has(s)) pool.set(s, s);\n  return pool.get(s);\n};\n// Then: intern(s1) === intern(s2) for equal strings` },
      "C++": { name: "Custom pool / std::string_view + set", snippet: `#include <unordered_set>\n#include <string>\n#include <string_view>\n\nclass StringInterner {\n    std::unordered_set<std::string> pool_;\npublic:\n    std::string_view intern(std::string s) {\n        auto [it, _] = pool_.emplace(std::move(s));\n        return *it;\n    }\n};\n\n// Usage:\nStringInterner interner;\nauto a = interner.intern(\"hello\");\nauto b = interner.intern(\"hello\");\nbool same = a.data() == b.data(); // true: same pointer` }
    }
  },
  {
    id: "compression",
    level: 3,
    category: "io",
    name: "In-Memory Data Compression",
    origin: "Huffman coding (1952), LZ77 (1977), LZ4/Snappy (2011/2008), Zstd (2016, Facebook)",
    summary: "Compress rarely-accessed or transfer-bound data to trade CPU time for reduced memory footprint and I/O bandwidth.",
    explanation: "Compression algorithms trade CPU cycles for memory/bandwidth savings. LZ4 and Snappy optimize for speed (>500 MB/s) with modest ratio; Zstd balances speed and ratio; LZMA/Brotli maximize ratio at higher CPU cost. In-memory compression is used for large caches (e.g., Redis), columnar storage (e.g., Parquet), network protocols, and JVM compressed oops. The tradeoff: decompress on every access vs keep hot data uncompressed.",
    pros: ["2-10x reduction in memory usage", "Reduced I/O bandwidth", "Better cache utilization for cold data", "Transparent to callers with streaming APIs"],
    cons: ["Decompression overhead on every access", "CPU cost for compression during writes", "Not suitable for already-compressed data (images, video)", "Latency spike on first access of cold blocks"],
    timeComplexity: "O(n) compress/decompress",
    spaceComplexity: "O(n) input, O(n/ratio) output",
    implementations: {
      "C#": { name: "GZipStream / BrotliStream / System.IO.Compression", snippet: `using System.IO.Compression;\n\n// Compress to memory\nbyte[] original = LargeData();\nusing var ms = new MemoryStream();\nusing (var gz = new GZipStream(ms, CompressionLevel.Optimal))\n    gz.Write(original);\nbyte[] compressed = ms.ToArray();\n\n// Decompress\nusing var src = new MemoryStream(compressed);\nusing var dst = new MemoryStream();\nusing var gz2 = new GZipStream(src, CompressionMode.Decompress);\ngz2.CopyTo(dst);` },
      "Python": { name: "zlib / lz4 / zstandard (ctypes-based)", snippet: `import zlib, lz4.frame, zstandard\n\ndata = b'hello world ' * 10000\n\n# zlib (DEFLATE)\ncompressed = zlib.compress(data, level=6)\nback = zlib.decompress(compressed)\n\n# LZ4 (fast, ~1.8x ratio)\ncomp_lz4 = lz4.frame.compress(data)\nback_lz4 = lz4.frame.decompress(comp_lz4)\n\n# Zstandard (best ratio/speed balance)\ncctx = zstandard.ZstdCompressor(level=3)\ncomp_zstd = cctx.compress(data)` },
      "Go": { name: "compress/gzip, compress/zstd (klauspost), lz4", snippet: `import (\n    \"bytes\"\n    \"compress/gzip\"\n    \"github.com/klauspost/compress/zstd\"\n)\n\n// GZIP\nvar buf bytes.Buffer\nw := gzip.NewWriter(&buf)\nw.Write([]byte(\"hello world\"))\nw.Close()\n\n// Zstd (faster, better ratio)\nenc, _ := zstd.NewWriter(nil)\ncompressed := enc.EncodeAll(data, nil)\ndec, _ := zstd.NewReader(nil)\nback, _ := dec.DecodeAll(compressed, nil)` },
      "Rust": { name: "flate2 / lz4_flex / zstd crates", snippet: `use flate2::write::GzEncoder;\nuse flate2::Compression;\nuse std::io::Write;\n\nlet mut encoder = GzEncoder::new(\n    Vec::new(),\n    Compression::default()\n);\nencoder.write_all(b\"hello world\")?;\nlet compressed = encoder.finish()?;\n\n// LZ4 (fast)\nuse lz4_flex::{compress_prepend_size, decompress_size_prepended};\nlet c = compress_prepend_size(b\"hello world\");` },
      "Java": { name: "java.util.zip / Apache Commons Compress / Zstd-jni", snippet: `import java.util.zip.*;\nimport java.io.*;\n\n// GZIP compress\nbyte[] data = \"hello world\".repeat(1000).getBytes();\ntry (var baos = new ByteArrayOutputStream();\n     var gz = new GZIPOutputStream(baos)) {\n    gz.write(data);\n    gz.finish();\n    byte[] compressed = baos.toByteArray();\n}\n\n// Zstd via Zstd-jni library:\nint cSize = Zstd.compress(dst, data);\nZstd.decompress(back, compressed);` },
      "JavaScript": { name: "CompressionStream (browser) / zlib (Node.js)", snippet: `// Browser: CompressionStream API\nconst cs = new CompressionStream('gzip');\nconst writer = cs.writable.getWriter();\nwriter.write(new TextEncoder().encode('hello world'));\nwriter.close();\nconst compressed = await new Response(cs.readable).arrayBuffer();\n\n// Node.js zlib\nimport zlib from 'zlib';\nconst compressed2 = zlib.gzipSync(\n  Buffer.from('hello world')\n);\nconst back = zlib.gunzipSync(compressed2);` },
      "C++": { name: "zlib / LZ4 / Zstd (C libs, all bindable)", snippet: `#include <lz4.h>\n#include <zstd.h>\n\n// LZ4 compress\nchar src[] = \"hello world ...\";\nint srcLen = sizeof(src);\nchar* dst = new char[LZ4_compressBound(srcLen)];\nint compSize = LZ4_compress_default(src, dst, srcLen, compBound);\nLZ4_decompress_safe(dst, out, compSize, srcLen);\n\n// Zstd (better ratio)\nsize_t cSize = ZSTD_compress(cBuf, cBufSize, src, srcLen, 3);\nZSTD_decompress(dBuf, dBufSize, cBuf, cSize);` }
    }
  },
  {
    id: "gc-tuning",
    level: 3,
    category: "runtime",
    name: "GC Tuning & Off-Heap Allocation",
    origin: "McCarthy's LISP GC (1960); generational GC hypothesis (David Ungar, 1984); JVM GC (Java 1.0, 1996)",
    summary: "Tune garbage collector parameters or move large/long-lived objects off-heap to reduce pause times and GC overhead.",
    explanation: "Managed language runtimes (Java, C#, Go, Python) use automatic garbage collection. GC pauses interrupt application threads. Tuning involves: adjusting heap size, choosing GC algorithm (G1, ZGC, Shenandoah for Java; workstation/server GC for .NET), allocating large hot objects off-heap to bypass GC scanning, and reducing allocation rate (the primary driver of GC pressure). Off-heap via direct ByteBuffers or native memory avoids GC pauses for large caches.",
    pros: ["Eliminates long GC pauses for latency-sensitive apps", "Off-heap memory unaffected by GC scan", "Predictable performance for real-time systems", "Reduced heap pressure = less frequent GC"],
    cons: ["Off-heap: manual memory management required", "GC tuning is JVM/runtime version specific", "Off-heap bypasses type safety", "Profile-first: wrong flags can hurt more than help"],
    timeComplexity: "N/A (reduces unpredictable pauses)",
    spaceComplexity: "Off-heap: O(n) outside managed heap",
    implementations: {
      "C#": { name: "GC.Collect / Server GC / NativeMemory (off-heap)", snippet: `using System.Runtime;\nusing System.Runtime.InteropServices;\n\n// Configure GC mode\n// In runtimeconfig.json: \"gcServer\": true\n\n// Suppress GC during critical section\nGC.TryStartNoGCRegion(16 * 1024 * 1024);\n// ... critical work ...\nGC.EndNoGCRegion();\n\n// Off-heap allocation (bypasses GC)\nunsafe {\n    var ptr = (byte*)NativeMemory.Alloc(1024 * 1024 * 256);\n    // use ptr directly\n    NativeMemory.Free(ptr);\n}` },
      "Python": { name: "gc module / PyPy (incremental GC) / tracemalloc", snippet: `import gc, tracemalloc\n\n# Tune GC thresholds (generation 0, 1, 2)\ngc.set_threshold(700, 10, 10)\n\n# Disable GC for known-no-cycle code\ngc.disable()\n# ... alloc-heavy tight loop ...\ngc.enable()\n\n# Profile allocations\ntracemalloc.start()\n# ... code ...\nsnap = tracemalloc.take_snapshot()\nfor stat in snap.statistics('lineno')[:5]:\n    print(stat)` },
      "Go": { name: "GOGC / GOMEMLIMIT / runtime.SetGCPercent", snippet: `import \"runtime\"\nimport \"runtime/debug\"\n\n// Increase GOGC: GC triggers less often\n// default: GOGC=100 (trigger when heap doubles)\ndebug.SetGCPercent(400) // less frequent GC\n\n// Set absolute memory limit (Go 1.19+)\ndebug.SetMemoryLimit(512 << 20) // 512 MB\n\n// Hint the scheduler\nruntime.GC()         // force GC\nruntime.FreeOSMemory() // return pages to OS\n\n// Off-heap via CGo or syscall.Mmap` },
      "Rust": { name: "N/A (ownership model = no GC)", snippet: `// Rust has no GC — memory is freed when values drop.\n// 'Tuning' means choosing the right allocator:\n\n// jemalloc (faster for many small allocs):\n// #[global_allocator]\n// static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;\n\n// mimalloc\n#[global_allocator]\nstatic GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;\n\n// All memory is deterministically freed at scope end.\n// No pause-time tuning needed.` },
      "Java": { name: "JVM flags: -XX:+UseZGC / G1GC / heap sizing", snippet: `// JVM startup flags:\n// Low latency (sub-ms pauses):\n// java -XX:+UseZGC -Xms4g -Xmx8g App\n// Throughput:\n// java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 App\n\n// Off-heap via DirectByteBuffer\nByteBuffer directBuf = ByteBuffer.allocateDirect(256 * 1024 * 1024);\n// Not scanned by GC\n\n// Off-heap via Panama (Java 21+)\ntry (Arena arena = Arena.ofAuto()) {\n    MemorySegment seg = arena.allocate(256L * 1024 * 1024);\n}` },
      "JavaScript": { name: "V8 flags / --max-old-space-size / WeakRef", snippet: `// Node.js:\n// node --max-old-space-size=4096 app.js\n// node --expose-gc app.js  (enable global.gc())\n\n// Reduce GC pressure with WeakRef + FinalizationRegistry\nconst cache = new WeakMap();\nfunction getOrCreate(key, factory) {\n  if (cache.has(key)) return cache.get(key);\n  const obj = factory();\n  cache.set(key, obj);\n  return obj;\n}\n\n// Force GC in Node.js (dev only)\nif (global.gc) global.gc();` },
      "C++": { name: "N/A (manual memory) / custom allocators / jemalloc", snippet: `// C++ has no GC. But you can:\n// 1. Use custom allocators to reduce fragmentation\n// 2. Use memory pools to batch free\n// 3. Replace global allocator:\n\n#include <cstdlib>\n// Link with -ljemalloc to replace malloc globally\n\n// Smart pointer patterns avoid leaks without GC:\n#include <memory>\nauto p = std::make_unique<MyObj>(args);\nauto s = std::make_shared<MyObj>(args);\n// freed automatically at scope end` }
    }
  }
];

const BUILDING_BLOCKS = [
  { id:"cache-line", name:"CPU Cache Line", area:"Hardware", description:"64-byte unit of data loaded/evicted by CPU cache. Access within a cache line is ~1-4 ns; a miss is ~60-100 ns. Design data layouts to maximize hits." },
  { id:"cas", name:"Compare-And-Swap (CAS)", area:"Hardware / OS", description:"Atomic instruction: if *addr == expected, set *addr = new, return true; else return false. Foundation of all lock-free algorithms. CMPXCHG on x86, LDREX/STREX on ARM." },
  { id:"tlb", name:"TLB (Translation Lookaside Buffer)", area:"Hardware", description:"CPU cache for virtual→physical page mappings. TLB miss causes page-table walk (~20-100 ns). Large pages (2 MB hugepages) reduce TLB pressure for large allocations." },
  { id:"heap", name:"Dynamic Heap Allocator", area:"Runtime/OS", description:"General-purpose allocator (malloc/free). Uses free-lists, binning, and slab allocation internally. Thread-contention on a single global allocator is a scalability bottleneck. jemalloc/mimalloc improve on this." },
  { id:"jit", name:"JIT Compilation", area:"Runtime", description:"Just-In-Time compiler compiles hot bytecode to native machine code at runtime. Java's C2 JIT, V8's Turbofan, .NET's RyuJIT. Enables loop vectorization, inline caching, and escape analysis." },
  { id:"escape-analysis", name:"Escape Analysis", area:"Compiler/Runtime", description:"Determines if a heap-allocated object can be moved to the stack (it doesn't 'escape' the function). Go compiler, Java JIT, and .NET RyuJIT do this automatically. Eliminates GC pressure for short-lived objects." },
  { id:"virtual-dispatch", name:"Virtual Dispatch", area:"OOP Runtime", description:"Indirect function call via vtable pointer. Prevents inlining and branch prediction, adding ~5-10 ns per call. Prefer monomorphic call sites or devirtualize via 'final'/'sealed' / Rust's generics monomorphization." },
  { id:"hugepages", name:"Huge Pages (THP)", area:"OS / Memory", description:"Linux Transparent Huge Pages (THP) and Windows Large Pages group 2 MB (or 1 GB) of physical memory into one TLB entry. Dramatically reduces TLB misses for large working sets." },
  { id:"mmap-concept", name:"Memory-Mapped I/O (mmap)", area:"OS", description:"Maps file or device into the process's virtual address space. Pages loaded on demand via page fault. No explicit read() calls needed. OS page cache used directly. Zero-copy access." },
  { id:"write-barrier", name:"GC Write Barrier", area:"Runtime", description:"Code inserted by the compiler/runtime at every pointer write to inform the GC of object references. Overhead: ~1-5 ns per write. Generational GCs use card tables to track cross-generation pointers." },
  { id:"prefetch", name:"Hardware / Software Prefetch", area:"CPU / Compiler", description:"Loads data into cache before it is needed. Hardware prefetcher detects sequential/strided access patterns automatically. Software: __builtin_prefetch (C++), PrefetchNonTemporal (.NET), Unsafe.ReadUnaligned (Java)." },
  { id:"branch-predict", name:"Branch Prediction", area:"CPU", description:"CPU speculatively executes instructions before the branch outcome is known (OOO execution). Mispredictions flush the pipeline (~15-20 cycles). Predictable branches (sorted data, monotone conditions) are free." },
];

const LANG_FEATURES = {
  "C#": {
    gcModel: "Generational mark-and-sweep (workstation/server GC); ZGC-like low-pause via background GC",
    memModel: "Managed heap + stackalloc + NativeMemory (unsafe)",
    concurrency: "Task/async-await, Channels, Thread, PLINQ",
    simd: "System.Runtime.Intrinsics (SSE/AVX/ARM NEON), Vector<T>",
    zeroalloc: "Span<T>, Memory<T>, ref structs, stackalloc",
    notes: ".NET 8+ supports AOT, Frozen collections, and aggressive inline hinting."
  },
  "Python": {
    gcModel: "Reference counting + cyclic GC; GIL serializes threads",
    memModel: "CPython heap; no stack control; numpy uses C allocator",
    concurrency: "asyncio, multiprocessing (bypasses GIL), concurrent.futures",
    simd: "Via NumPy/Numba; no direct intrinsics in pure Python",
    zeroalloc: "memoryview, mmap; otherwise GC-managed",
    notes: "PyPy JIT gives 2-10x speedup. Python 3.12 sub-interpreters reduce GIL contention."
  },
  "Go": {
    gcModel: "Concurrent tricolor mark-and-sweep; sub-ms pauses; GOGC/GOMEMLIMIT",
    memModel: "Goroutine stacks (1-8 KB, growable); escape analysis to heap",
    concurrency: "Goroutines + channels (CSP); sync.Mutex; sync/atomic",
    simd: "Compiler auto-vec; manual via assembly (Plan 9 asm) or CGo",
    zeroalloc: "Slice views; sync.Pool; no stack annotations needed",
    notes: "Go 1.21 PGO (Profile-Guided Optimization) improves inlining and devirtualization."
  },
  "Rust": {
    gcModel: "No GC; ownership + borrow checker; RAII drop",
    memModel: "Stack by default; Box<T>/Vec<T> for heap; custom allocators",
    concurrency: "Thread + Arc<Mutex<T>>; Rayon (data parallelism); tokio (async)",
    simd: "std::arch intrinsics; portable-simd (nightly); packed_simd2",
    zeroalloc: "Zero-copy via &[T] slices; Cow<T>; bytes::Bytes; no GC alloc",
    notes: "Rust guarantees memory safety without GC via type system; ideal for latency-critical systems."
  },
  "Java": {
    gcModel: "G1GC (default), ZGC (sub-ms), Shenandoah, Serial/Parallel; JVM tuning via flags",
    memModel: "JVM heap (objects) + stack (primitives/frames); off-heap via DirectBuffer",
    concurrency: "Thread, ForkJoinPool, CompletableFuture, Virtual Threads (Java 21)",
    simd: "Vector API (JEP 338, Java 16+); JIT auto-vectorization via C2",
    zeroalloc: "Object pooling; DirectByteBuffer; Panama MemorySegment (Java 21+)",
    notes: "Project Valhalla (value types) and Project Panama (foreign memory) reduce GC and allocation overhead."
  },
  "JavaScript": {
    gcModel: "Generational GC (V8 Orinoco); incremental/concurrent; hidden class optimization",
    memModel: "V8 heap (new/old space); TypedArrays bypass GC scan; SharedArrayBuffer",
    concurrency: "Event loop + Promises/async-await; Workers (true parallelism) + SharedArrayBuffer",
    simd: "WebAssembly SIMD; no direct SIMD in JS",
    zeroalloc: "TypedArrays; Transferable objects; SharedArrayBuffer; Streams API",
    notes: "V8 hidden classes (shapes) are critical: keep object structure monomorphic for JIT optimization."
  },
  "C++": {
    gcModel: "No GC; manual new/delete; RAII (smart pointers); custom allocators",
    memModel: "Full control: stack, heap, pool, arena, mmap; std::pmr (C++17)",
    concurrency: "std::thread; std::atomic; coroutines (C++20); TBB; OpenMP",
    simd: "Compiler auto-vec; Intel intrinsics (_mm256_*); std::experimental::simd (C++23)",
    zeroalloc: "std::string_view; std::span (C++20); placement new; RVO/NRVO",
    notes: "C++ zero-overhead abstraction principle: high-level code compiles to optimal machine code without runtime overhead."
  }
};

export { MPOTS, BUILDING_BLOCKS, LANG_FEATURES, LANGUAGES };
