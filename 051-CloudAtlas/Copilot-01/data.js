// Cloud Atlas Data Structure
// All data is separated from HTML for easier maintenance and future updates

const DATA = {
    // Translations for EN and VI
    translations: {
        en: {
            // Header & Controls
            pageTitle: "Cloud Atlas - Comprehensive Cloud Services Guide",
            pageSubtitle: "Comprehensive Cloud Services Comparison Across Major Providers",
            themeBtnDark: "🌙 Dark Mode",
            themeBtnLight: "☀️ Light Mode",
            langBtn: "🌐 Việt",
            searchPlaceholder: "Search cloud services...",

            // Sections
            providerTitle: "Cloud Providers Overview",
            servicesTitle: "Core Cloud Services Explained",
            servicesSubtitle: "A deep dive into the 11 core cloud service categories that form the foundation of modern cloud computing",
            comparisonTitle: "Cloud Services by Provider - Detailed Comparison",
            bbTitle: "Building-Block Concepts & Tools",
            bbSubtitle: "Foundational technologies and patterns that power cloud services",
            bbCompTitle: "Building-Block Tools by Provider — Detailed Comparison",
            takeawaysTitle: "Key Takeaways",

            // Table headers
            provider: "Provider",
            founded: "Founded",
            origin: "Origin",
            targetMarket: "Target Market",
            marketShare: "Market Share",
            serviceCategories: "Service Categories",
            cloudService: "Cloud Service",
            conceptTool: "Concept / Tool",

            // Provider names
            aws: "AWS (Amazon Web Services)",
            azure: "Microsoft Azure",
            gcp: "Google Cloud Platform",
            alibaba: "Alibaba Cloud",
            ibm: "IBM Cloud",
            oracle: "Oracle Cloud",
            salesforce: "Salesforce",
            digitalocean: "DigitalOcean",

            // Service names
            compute: "Compute",
            virtualMachines: "Virtual Machines",
            containerization: "Containerization & Orchestration",
            serverless: "Serverless Computing",
            storage: "Storage",
            objectStorage: "Object Storage",
            relationalDatabases: "Relational Databases",
            noSQLDatabases: "NoSQL Databases",
            networking: "Networking",
            cdnEdgeComputing: "CDN & Edge Computing",
            loadBalancing: "Load Balancing & Traffic Management",
            aiML: "AI/ML",
            machineLearningPlatforms: "Machine Learning Platforms",
            analytics: "Analytics",
            dataWarehouse: "Data Warehouse & MPP",
            iot: "IoT",
            iotHub: "IoT Hub",

            // Building Block names
            hypervisor: "Hypervisor",
            vmImageAmi: "VM Image / AMI",
            dockerfile: "Dockerfile",
            kubernetesBasics: "Kubernetes Basics (Pod, Deployment, Service)",
            helmChart: "Helm Chart",
            apiGateway: "API Gateway",
            storageLifecycle: "Storage Lifecycle Management",
            connectionPooling: "Connection Pooling",
            readReplicaMultiAz: "Read Replica / Multi-AZ Replication",
            gsiSharding: "GSI / Sharding",
            cacheControlHeaders: "Cache-Control Headers",
            healthCheck: "Health Check",
            iamRole: "IAM Role / Service Principal",
            vpcSecurityGroup: "VPC / Security Group",
            featureStore: "Feature Store",
            columnarStorageMpp: "Columnar Storage / MPP",
            etlElt: "ETL / ELT",
            mqttDeviceShadow: "MQTT / Device Shadow",
            timeSeriesDatabase: "Time-Series Database",

            // Common labels
            origin: "Origin",
            whatItIs: "What It Is",
            whenToUse: "When to Use",
            pros: "Pros",
            cons: "Cons",
            cost: "Cost Estimation",
            implementations: "Provider Implementations",
            category: "Category",
            noResults: "No results found. Try adjusting your search.",
        },

        vi: {
            // Header & Controls
            pageTitle: "Cloud Atlas - Hướng Dẫn Dịch Vụ Đám Mây Toàn Diện",
            pageSubtitle: "So Sánh Dịch Vụ Đám Mây Toàn Diện Trên Các Nhà Cung Cấp Chính",
            themeBtnDark: "🌙 Chế Độ Tối",
            themeBtnLight: "☀️ Chế Độ Sáng",
            langBtn: "🌐 English",
            searchPlaceholder: "Tìm kiếm dịch vụ đám mây...",

            // Sections
            providerTitle: "Tổng Quan Nhà Cung Cấp Đám Mây",
            servicesTitle: "Giải Thích Dịch Vụ Đám Mây Cốt Lõi",
            servicesSubtitle: "Tìm hiểu sâu về 11 danh mục dịch vụ đám mây cốt lõi tạo nên nền tảng của điện toán đám mây hiện đại",
            comparisonTitle: "Dịch Vụ Đám Mây Theo Nhà Cung Cấp - So Sánh Chi Tiết",
            bbTitle: "Khái Niệm & Công Cụ Building-Block",
            bbSubtitle: "Các công nghệ và mẫu thiết kế cơ bản hỗ trợ các dịch vụ đám mây",
            bbCompTitle: "Công Cụ Building-Block Theo Nhà Cung Cấp — So Sánh Chi Tiết",
            takeawaysTitle: "Các Bài Học Chính",

            // Table headers
            provider: "Nhà Cung Cấp",
            founded: "Thành Lập",
            origin: "Xuất Xứ",
            targetMarket: "Thị Trường Mục Tiêu",
            marketShare: "Thị Phần",
            serviceCategories: "Danh Mục Dịch Vụ",
            cloudService: "Dịch Vụ Đám Mây",
            conceptTool: "Khái Niệm / Công Cụ",

            // Provider names
            aws: "AWS (Dịch Vụ Dịch Vụ Dây)",
            azure: "Microsoft Azure",
            gcp: "Nền Tảng Đám Mây Google",
            alibaba: "Đám Mây Alibaba",
            ibm: "IBM Cloud",
            oracle: "Oracle Cloud",
            salesforce: "Salesforce",
            digitalocean: "DigitalOcean",

            // Service names
            compute: "Tính Toán",
            virtualMachines: "Máy Ảo",
            containerization: "Hợp Đơn Vị & Điều Phối",
            serverless: "Tính Toán Không Máy Chủ",
            storage: "Lưu Trữ",
            objectStorage: "Lưu Trữ Đối Tượng",
            relationalDatabases: "Cơ Sở Dữ Liệu Quan Hệ",
            noSQLDatabases: "Cơ Sở Dữ Liệu NoSQL",
            networking: "Mạng",
            cdnEdgeComputing: "CDN & Tính Toán Biên",
            loadBalancing: "Cân Bằng Tải & Quản Lý Lưu Lượng",
            aiML: "AI/ML",
            machineLearningPlatforms: "Nền Tảng Học Máy",
            analytics: "Phân Tích",
            dataWarehouse: "Kho Dữ Liệu & MPP",
            iot: "IoT",
            iotHub: "Trung Tâm IoT",

            // Building Block names
            hypervisor: "Hypervisor",
            vmImageAmi: "Hình Ảnh VM / AMI",
            dockerfile: "Dockerfile",
            kubernetesBasics: "Cơ Bản Kubernetes (Pod, Deployment, Service)",
            helmChart: "Biểu Đồ Helm",
            apiGateway: "Cổng API",
            storageLifecycle: "Quản Lý Vòng Đời Lưu Trữ",
            connectionPooling: "Nhóm Kết Nối",
            readReplicaMultiAz: "Sao Chép Đọc / Sao Chép Multi-AZ",
            gsiSharding: "GSI / Sharding",
            cacheControlHeaders: "Tiêu Đề Cache-Control",
            healthCheck: "Kiểm Tra Sức Khỏe",
            iamRole: "Vai Trò IAM / Nguyên Tắc Dịch Vụ",
            vpcSecurityGroup: "VPC / Nhóm Bảo Mật",
            featureStore: "Kho Tính Năng",
            columnarStorageMpp: "Lưu Trữ Columnar / MPP",
            etlElt: "ETL / ELT",
            mqttDeviceShadow: "MQTT / Device Shadow",
            timeSeriesDatabase: "Cơ Sở Dữ Liệu Chuỗi Thời Gian",

            // Common labels
            origin: "Xuất Xứ",
            whatItIs: "Nó Là Gì",
            whenToUse: "Khi Nào Sử Dụng",
            pros: "Ưu Điểm",
            cons: "Nhược Điểm",
            cost: "Ước Tính Chi Phí",
            implementations: "Triển Khai Nhà Cung Cấp",
            category: "Danh Mục",
            noResults: "Không tìm thấy kết quả. Hãy thử điều chỉnh tìm kiếm của bạn.",
        }
    },

    // Cloud Providers
    providers: [
        {
            id: 'aws',
            name: 'AWS',
            fullName: 'Amazon Web Services',
            founded: 2006,
            origin: 'United States',
            targetMarket: 'Enterprise, Startups, All Sizes',
            marketShare: '32%',
            serviceCategories: 'Compute, Storage, Networking, AI/ML, Analytics, IoT, Security, Migration'
        },
        {
            id: 'azure',
            name: 'Azure',
            fullName: 'Microsoft Azure',
            founded: 2010,
            origin: 'United States',
            targetMarket: 'Enterprise, Hybrid Cloud',
            marketShare: '23%',
            serviceCategories: 'Compute, Storage, Networking, AI/ML, Analytics, IoT, Security, Gaming'
        },
        {
            id: 'gcp',
            name: 'GCP',
            fullName: 'Google Cloud Platform',
            founded: 2011,
            origin: 'United States',
            targetMarket: 'Data Analytics, AI/ML, Big Data',
            marketShare: '11%',
            serviceCategories: 'Compute, Storage, Networking, AI/ML, Analytics, IoT, Security'
        },
        {
            id: 'alibaba',
            name: 'Alibaba Cloud',
            fullName: 'Alibaba Cloud',
            founded: 2009,
            origin: 'China',
            targetMarket: 'APAC Region, E-commerce',
            marketShare: '5%',
            serviceCategories: 'Compute, Storage, Networking, AI/ML, Analytics, IoT'
        },
        {
            id: 'ibm',
            name: 'IBM Cloud',
            fullName: 'IBM Cloud',
            founded: 2013,
            origin: 'United States',
            targetMarket: 'Enterprise, AI/ML, Blockchain',
            marketShare: '3%',
            serviceCategories: 'Compute, Storage, Networking, AI/ML, Security, Watson Services'
        },
        {
            id: 'oracle',
            name: 'Oracle Cloud',
            fullName: 'Oracle Cloud Infrastructure',
            founded: 2016,
            origin: 'United States',
            targetMarket: 'Enterprise, Database Workloads',
            marketShare: '2%',
            serviceCategories: 'Compute, Storage, Networking, Database, Analytics'
        },
        {
            id: 'salesforce',
            name: 'Salesforce',
            fullName: 'Salesforce Cloud',
            founded: 1999,
            origin: 'United States',
            targetMarket: 'CRM, Business Applications',
            marketShare: '2%',
            serviceCategories: 'CRM, Marketing, Sales, Service Cloud, Platform'
        },
        {
            id: 'digitalocean',
            name: 'DigitalOcean',
            fullName: 'DigitalOcean',
            founded: 2011,
            origin: 'United States',
            targetMarket: 'Startups, Developers, SMBs',
            marketShare: '<1%',
            serviceCategories: 'Compute, Storage, Networking, Kubernetes'
        }
    ],

    // Core Cloud Services
    services: [
        {
            id: 'virtual-machines',
            category: 'Compute',
            name: 'Virtual Machines',
            origin: 'Virtualization Technology (1960s-2000s)',
            whatItIs: 'On-demand access to computing resources (vCPU, memory, storage) provisioned as isolated servers. You control the OS, middleware, and applications.',
            whenToUse: 'Legacy applications, full OS control needed, lift-and-shift migrations, stateful workloads requiring persistent compute instances.',
            pros: 'Full control, familiar paradigm, easy migration from on-prem, flexible OS choices, long-term cost predictability.',
            cons: 'Requires OS/patch management, higher operational overhead, more expensive than containers/serverless for short tasks, scaling takes time.',
            cost: '$0.01–$1.00+ per hour; pricing based on vCPU, memory, storage, region, and OS type.',
            buildingBlocks: ['hypervisor', 'vm-image-ami', 'vpc-security-group', 'iam-role'],
            implementations: {
                aws: 'EC2 (Elastic Compute Cloud)',
                azure: 'Virtual Machines',
                gcp: 'Compute Engine',
                alibaba: 'ECS (Elastic Compute Service)',
                ibm: 'Virtual Servers',
                oracle: 'Compute Instances'
            }
        },
        {
            id: 'containerization',
            category: 'Compute',
            name: 'Containerization & Orchestration',
            origin: 'Docker (2013), Kubernetes (2014)',
            whatItIs: 'Lightweight, portable application packaging with Docker; automated orchestration via Kubernetes or managed services. Containers share OS kernel, reducing overhead.',
            whenToUse: 'Microservices architecture, rapid scaling needs, CI/CD pipelines, developer teams wanting infrastructure abstraction, cost-efficient short-lived workloads.',
            pros: 'Resource-efficient, fast startup (~seconds), excellent for microservices, strong DevOps tooling, easy versioning & rollback, cloud-agnostic.',
            cons: 'Steeper learning curve, container security management, orchestration complexity at scale, requires container image registry, monitoring overhead.',
            cost: '$0.03–$0.15 per hour for managed Kubernetes clusters; container instances ~$0.10–$0.50 per hour depending on size.',
            buildingBlocks: ['dockerfile', 'kubernetes-basics', 'helm-chart', 'health-check'],
            implementations: {
                aws: 'ECS (Elastic Container Service) / EKS (Elastic Kubernetes Service)',
                azure: 'AKS (Azure Kubernetes Service) / Container Instances',
                gcp: 'GKE (Google Kubernetes Engine) / Cloud Run',
                alibaba: 'ACK (Alibaba Container Service for Kubernetes)',
                ibm: 'IKS (IBM Kubernetes Service)',
                oracle: 'OKE (Oracle Container Engine for Kubernetes)'
            }
        },
        {
            id: 'serverless',
            category: 'Compute',
            name: 'Serverless Computing',
            origin: 'AWS Lambda (2014)',
            whatItIs: 'Run code without provisioning servers. Pay only for execution time (in 100ms increments). Automatic scaling, built-in monitoring.',
            whenToUse: 'Event-driven workloads (API endpoints, file uploads, scheduled tasks), unpredictable traffic, microservices, real-time data processing, reducing operational overhead.',
            pros: 'Pay-per-use pricing, zero infrastructure management, automatic scaling, fast deployment, built-in security updates and availability.',
            cons: 'Cold start latency (100ms–5s), execution time limits (15–30 mins typical), vendor lock-in, complex debugging, not ideal for long-running processes.',
            cost: '$0.20 per 1 million invocations + $0.0000166667 per vCPU-second; practical cost $0.50–$5/month for moderate workloads.',
            buildingBlocks: ['api-gateway', 'health-check'],
            implementations: {
                aws: 'Lambda',
                azure: 'Azure Functions',
                gcp: 'Cloud Functions / Cloud Run',
                alibaba: 'Function Compute',
                ibm: 'IBM Cloud Functions',
                oracle: 'Functions'
            }
        },
        {
            id: 'object-storage',
            category: 'Storage',
            name: 'Object Storage',
            origin: 'Amazon S3 (2006)',
            whatItIs: 'Scalable, unstructured data storage (images, videos, backups, logs). Data stored as objects with metadata, accessed via APIs or URLs.',
            whenToUse: 'Backup & archival, media libraries, data lakes, static website hosting, log storage, machine learning datasets.',
            pros: 'Unlimited scalability, high durability (99.999999999%), low cost for large volumes, easy integration, versioning & lifecycle policies, global distribution.',
            cons: 'No file system semantics (no in-place edits), eventual consistency, additional cost for retrieval in cold storage, can become expensive at scale.',
            cost: '$0.023 per GB/month for standard tier; varies by region and access tier; retrieval costs add $0.01–$5 per GB depending on tier.',
            buildingBlocks: ['storage-lifecycle-management', 'cache-control-headers'],
            implementations: {
                aws: 'S3 (Simple Storage Service)',
                azure: 'Blob Storage',
                gcp: 'Cloud Storage',
                alibaba: 'Object Storage Service (OSS)',
                ibm: 'Cloud Object Storage',
                oracle: 'Object Storage'
            }
        },
        {
            id: 'relational-databases',
            category: 'Storage',
            name: 'Relational Databases',
            origin: 'Relational Model (1970); Cloud adoption ~2010s',
            whatItIs: 'Managed SQL databases (PostgreSQL, MySQL, Oracle, SQL Server). ACID compliance, schema-based structure, complex querying via SQL.',
            whenToUse: 'Transactional systems, CRM/ERP, financial systems, structured data with relationships, ACID guarantees required, complex joins essential.',
            pros: 'ACID guarantees, familiar SQL language, strong consistency, complex query support, backup & recovery, HA/failover built-in.',
            cons: 'Vertical scaling limits, schema changes complex, higher latency for globally distributed reads, expensive for massive scale, not ideal for unstructured data.',
            cost: '$0.12–$1.50+ per hour for managed instances; RDS for AWS ~$150–$500/month typical production setup.',
            buildingBlocks: ['read-replica-multi-az', 'connection-pooling', 'health-check'],
            implementations: {
                aws: 'RDS (Relational Database Service) / Aurora',
                azure: 'Azure SQL Database / PostgreSQL Flexible Server',
                gcp: 'Cloud SQL / Spanner',
                alibaba: 'ApsaraDB for RDS / PolarDB',
                ibm: 'Db2 on Cloud',
                oracle: 'Autonomous Database'
            }
        },
        {
            id: 'nosql-databases',
            category: 'Storage',
            name: 'NoSQL Databases',
            origin: 'MongoDB (2009), DynamoDB (2012)',
            whatItIs: 'Non-relational data stores (document, key-value, graph, time-series). Flexible schema, eventual consistency, horizontal scaling.',
            whenToUse: 'High-volume writes, flexible schema, real-time analytics, caching, IoT time-series data, social graphs, recommendations, content management.',
            pros: 'Horizontal scaling, high throughput, flexible schema, sub-millisecond latency for key-value access, schemaless flexibility.',
            cons: 'Eventual consistency (not ACID), complex joins difficult, query language varies by type, less mature ecosystem for some types.',
            cost: '$0.25–$1.25 per GB/month (DynamoDB on-demand); competitive with relational for write-heavy workloads.',
            buildingBlocks: ['gsi-sharding', 'cache-control-headers', 'time-series-database'],
            implementations: {
                aws: 'DynamoDB / DocumentDB',
                azure: 'Cosmos DB',
                gcp: 'Datastore / Firestore',
                alibaba: 'Table Store (OTS)',
                ibm: 'Cloudant / MongoDB Atlas',
                oracle: 'NoSQL Database'
            }
        },
        {
            id: 'cdn',
            category: 'Networking',
            name: 'CDN & Edge Computing',
            origin: 'Akamai (1998); Cloud integration ~2010s',
            whatItIs: 'Distributed network of servers caching content geographically close to users. Reduces latency, offloads origin servers.',
            whenToUse: 'Video streaming, web content delivery, global user bases, real-time event processing at edge, DDoS mitigation.',
            pros: 'Sub-100ms latency globally, reduces origin bandwidth costs, built-in DDoS protection, easy integration, automatic SSL/TLS.',
            cons: 'Cache invalidation complexity, additional cost (can be 10–30% of CDN), limited real-time compute at edge, regional coverage gaps.',
            cost: '$0.085–$0.15 per GB depending on region; bundled into managed services or $50–$500+/month standalone.',
            buildingBlocks: ['cache-control-headers'],
            implementations: {
                aws: 'CloudFront',
                azure: 'Front Door / CDN',
                gcp: 'Cloud Armor / Media CDN',
                alibaba: 'Alibaba CDN / EdgeScript',
                ibm: 'CDN',
                oracle: 'Web Application Acceleration'
            }
        },
        {
            id: 'load-balancing',
            category: 'Networking',
            name: 'Load Balancing & Traffic Management',
            origin: 'Hardware load balancers (1990s); Cloud LB ~2008',
            whatItIs: 'Distributes incoming traffic across multiple backend instances. Supports Layer 4 (TCP/UDP) and Layer 7 (HTTP/HTTPS/gRPC).',
            whenToUse: 'Scaling web applications, HA setups, API traffic distribution, microservices ingress, multi-region failover.',
            pros: 'Automatic failover, sticky sessions, health check integration, global load balancing, no single point of failure.',
            cons: 'Added latency (2–5ms), additional cost, configuration complexity for advanced routing, regional limits.',
            cost: '$0.006–$0.025 per hour plus $0.006 per GB data processed; typical setup $20–$100/month.',
            buildingBlocks: ['health-check', 'api-gateway'],
            implementations: {
                aws: 'ALB (Application Load Balancer) / NLB (Network Load Balancer)',
                azure: 'Load Balancer / Application Gateway',
                gcp: 'Load Balancing / Cloud Armor',
                alibaba: 'Alibaba Cloud Load Balancer',
                ibm: 'Load Balancer',
                oracle: 'Load Balancer'
            }
        },
        {
            id: 'ml-platforms',
            category: 'AI/ML',
            name: 'Machine Learning Platforms',
            origin: 'TensorFlow (2015); Cloud ML platforms ~2016',
            whatItIs: 'Managed services for building, training, and deploying ML models. Pre-built models, AutoML, GPU acceleration, feature stores.',
            whenToUse: 'Predictive analytics, image/text classification, recommendation systems, anomaly detection, time-series forecasting, computer vision.',
            pros: 'Reduced ML ops overhead, pre-built models, managed infrastructure, automatic scaling, built-in monitoring, API-first design.',
            cons: 'Vendor lock-in, expensive for large-scale training, learning curve for non-ML teams, potential cold starts for inference.',
            cost: '$0.50–$5.00+ per hour for training; inference ~$0.50–$10/month for modest workloads.',
            buildingBlocks: ['feature-store', 'health-check'],
            implementations: {
                aws: 'SageMaker',
                azure: 'Azure Machine Learning',
                gcp: 'Vertex AI / Dialogflow',
                alibaba: 'Machine Learning Platform for AI',
                ibm: 'Watson Machine Learning',
                oracle: 'OML (Oracle Machine Learning)'
            }
        },
        {
            id: 'data-warehouse',
            category: 'Analytics',
            name: 'Data Warehouse & MPP',
            origin: 'Teradata (1979); Cloud adoption ~2012',
            whatItIs: 'Managed massive parallel processing (MPP) databases. Optimized for analytical queries on large datasets. Columnar storage, automatic parallelization.',
            whenToUse: 'BI dashboards, historical data analysis, log aggregation, ETL pipelines, SQL analytics at petabyte scale, time-series analytics.',
            pros: 'Sub-second query performance, massive scalability (petabytes), SQL compatibility, automatic indexing, pay-per-query pricing in some models.',
            cons: 'Not optimized for transactional workloads, learning curve for query optimization, schema design critical, cold start times for rare queries.',
            cost: '$2–$10 per TB scanned; annual contracts $10K–$100K+ depending on organization size.',
            buildingBlocks: ['columnar-storage-mpp', 'etl-elt'],
            implementations: {
                aws: 'Redshift',
                azure: 'Synapse Analytics',
                gcp: 'BigQuery',
                alibaba: 'AnalyticDB',
                ibm: 'Db2 Warehouse',
                oracle: 'Autonomous Data Warehouse'
            }
        },
        {
            id: 'iot-hub',
            category: 'IoT',
            name: 'IoT Hub',
            origin: 'Azure IoT Hub (2015); AWS IoT ~2015',
            whatItIs: 'Managed MQTT/AMQP broker for connecting IoT devices. Handles millions of device connections, message routing, twin state management.',
            whenToUse: 'Connected devices, real-time sensor data ingestion, device management at scale, remote control of devices, firmware updates.',
            pros: 'Massive concurrent device support, built-in security (x.509/SAS), device twins for state management, rule-based message routing, SDKs in 10+ languages.',
            cons: 'Proprietary implementations, learning curve, DDoS exposure risk, regional limitations, expensive at very large scale.',
            cost: '$0.50–$50+ per month depending on tier; pay-as-you-go $0.00001–$0.0002 per message.',
            buildingBlocks: ['mqtt-device-shadow', 'health-check'],
            implementations: {
                aws: 'AWS IoT Core',
                azure: 'Azure IoT Hub',
                gcp: 'Cloud IoT',
                alibaba: 'IoT Platform',
                ibm: 'Watson IoT Platform',
                oracle: 'IoT Hub'
            }
        }
    ],

    // Building Block Concepts & Tools
    buildingBlocks: [
        {
            id: 'hypervisor',
            category: 'Compute Virtualization',
            name: 'Hypervisor',
            origin: 'Hypervisor Technology (1960s–2000s); Cloud adoption ~2006',
            whatItIs: 'Software/firmware layer enabling multiple virtual machines to share physical hardware. Type 1 (bare-metal: KVM, Hyper-V) runs on hardware directly. Type 2 (hosted: VMware Workstation) runs on host OS.',
            whenToUse: 'Creating isolated compute instances, multi-tenant cloud infrastructure, legacy virtualization, cost consolidation of underutilized servers.',
            pros: 'Strong hardware isolation, mature ecosystem, efficient resource utilization, compatibility with legacy workloads.',
            cons: 'Higher overhead (~15–25% CPU) compared to containers, slower boot times (minutes), management complexity.',
            cost: 'Usually bundled into VM pricing; no separate charge. Amortized into infrastructure costs.',
            implementations: {
                aws: 'Xen (custom) / AWS Nitro hypervisor',
                azure: 'Hyper-V (custom fork)',
                gcp: 'KVM (custom)',
                alibaba: 'Custom hypervisor based on KVM',
                ibm: 'PowerVM / z/VM',
                oracle: 'Oracle VM'
            }
        },
        {
            id: 'vm-image-ami',
            category: 'Compute Virtualization',
            name: 'VM Image / AMI',
            origin: 'Amazon AMI (2006); Industry standard by ~2010',
            whatItIs: 'Pre-configured template containing OS, middleware, application code, and configurations. Used to launch identical VM instances at scale.',
            whenToUse: 'Infrastructure as Code (IaC), auto-scaling groups, disaster recovery templates, golden image management, version control of infrastructure.',
            pros: 'Reproducible deployments, consistent environments, rapid scaling, version history, easy sharing across teams.',
            cons: 'Image management overhead, storage costs for multiple versions, update complexity, potential security gaps if not maintained.',
            cost: 'Storage $0.10–$0.50 per GB/month; often bundled into compute costs.',
            implementations: {
                aws: 'AMI (Amazon Machine Image)',
                azure: 'Managed Images / Shared Image Gallery',
                gcp: 'Machine Images',
                alibaba: 'Custom Images',
                ibm: 'Custom Images',
                oracle: 'Custom Images'
            }
        },
        {
            id: 'dockerfile',
            category: 'Containerization',
            name: 'Dockerfile',
            origin: 'Docker (2013); Industry standard ~2015',
            whatItIs: 'Text file defining container image instructions: base OS, dependencies, application code, environment variables, entry points. Builds reproducible container images.',
            whenToUse: 'Building container images for Docker/Kubernetes, microservices deployment, CI/CD pipelines, standardizing dev/prod environments.',
            pros: 'Version-controllable (Git), human-readable, reproducible builds, easy testing locally, ideal for DevOps automation.',
            cons: 'Learning curve for optimization, image bloat if not careful, debugging challenges inside containers, multi-stage builds required for smaller images.',
            cost: 'No direct cost; container registry storage ~$0.10 per GB/month.',
            implementations: {
                aws: 'ECR (Elastic Container Registry)',
                azure: 'ACR (Azure Container Registry)',
                gcp: 'Artifact Registry / Container Registry',
                alibaba: 'ACR (Alibaba Container Registry)',
                ibm: 'Container Registry',
                oracle: 'Container Registry'
            }
        },
        {
            id: 'kubernetes-basics',
            category: 'Container Orchestration',
            name: 'Kubernetes Basics (Pod, Deployment, Service)',
            origin: 'Google Kubernetes Engine (2014); Kubernetes OSS ~2015',
            whatItIs: 'Pod: smallest deployable unit (one or more containers). Deployment: manages Pod replicas, rolling updates, rollback. Service: exposes Pods via stable DNS/IP.',
            whenToUse: 'Running containerized microservices at scale, automated rollouts/rollbacks, traffic distribution, self-healing clusters.',
            pros: 'Industry standard for orchestration, declarative configuration, automatic healing, rolling updates, excellent scaling, cloud-agnostic.',
            cons: 'Steep learning curve, operational complexity, not needed for simple apps, resource overhead for small workloads, requires DevOps expertise.',
            cost: 'Usually $0.10–$0.15/hour cluster fee; node costs ~$0.03–$0.50 per hour depending on instance type.',
            implementations: {
                aws: 'EKS (Elastic Kubernetes Service)',
                azure: 'AKS (Azure Kubernetes Service)',
                gcp: 'GKE (Google Kubernetes Engine)',
                alibaba: 'ACK (Container Service for Kubernetes)',
                ibm: 'IKS (IBM Kubernetes Service)',
                oracle: 'OKE (Oracle Container Engine for Kubernetes)'
            }
        },
        {
            id: 'helm-chart',
            category: 'Container Orchestration',
            name: 'Helm Chart',
            origin: 'Helm (2016); Cloud-Native Computing Foundation ~2018',
            whatItIs: 'Package manager for Kubernetes. Helm Charts bundle Kubernetes manifests (YAML) with templating, versioning, and dependency management.',
            whenToUse: 'Deploying complex multi-component applications to Kubernetes, version management, environment-specific configurations (dev/staging/prod).',
            pros: 'Reduces YAML boilerplate, version control, rollback support, template reusability, large ecosystem of pre-built charts.',
            cons: 'Added abstraction layer, learning curve beyond Kubernetes basics, chart maintenance overhead.',
            cost: 'No direct cost; included in Kubernetes setup.',
            implementations: {
                aws: 'Helm on EKS',
                azure: 'Helm on AKS',
                gcp: 'Helm on GKE',
                alibaba: 'Helm on ACK',
                ibm: 'Helm on IKS',
                oracle: 'Helm on OKE'
            }
        },
        {
            id: 'api-gateway',
            category: 'API Management',
            name: 'API Gateway',
            origin: 'AWS API Gateway (2015)',
            whatItIs: 'Fully managed service for creating, publishing, securing, and monitoring REST/GraphQL APIs. Routes requests to backend services (Lambda, EC2, etc.).',
            whenToUse: 'Exposing microservices as APIs, rate limiting/throttling, request authentication (OAuth, mTLS), versioning APIs, generating SDKs.',
            pros: 'Minimal operational overhead, built-in rate limiting, authentication integration, request/response transformation, automatic documentation.',
            cons: 'Vendor lock-in, added latency (5–20ms), per-request pricing can scale quickly, limited graphQL support in some platforms.',
            cost: '$3.50 per 1 million requests; data transfer $0.09 per GB; typically $10–$100/month for moderate APIs.',
            implementations: {
                aws: 'API Gateway',
                azure: 'API Management',
                gcp: 'Apigee / Cloud Endpoints',
                alibaba: 'API Gateway',
                ibm: 'API Connect',
                oracle: 'API Gateway'
            }
        },
        {
            id: 'storage-lifecycle-management',
            category: 'Storage Optimization',
            name: 'Storage Lifecycle Management',
            origin: 'S3 Lifecycle Policies (2011)',
            whatItIs: 'Automated rules transitioning data between storage tiers (hot→warm→cold→archive) based on age or access patterns. Reduces storage costs.',
            whenToUse: 'Long-term data archival, compliance retention policies, cost optimization of infrequently accessed data.',
            pros: 'Automatic cost savings (cold storage 80% cheaper), compliance automation, minimal operational overhead.',
            cons: 'Retrieval delays for archived data (hours), transition rules complexity, potential for overly aggressive rules.',
            cost: 'Usually no additional cost; savings come from lower tier costs (~$0.004/GB/month for Glacier vs $0.023/GB/month for Standard).',
            implementations: {
                aws: 'S3 Lifecycle Policies',
                azure: 'Blob Lifecycle Management',
                gcp: 'Object Lifecycle Management',
                alibaba: 'OSS Lifecycle Management',
                ibm: 'Lifecycle Configuration',
                oracle: 'Lifecycle Policy'
            }
        },
        {
            id: 'connection-pooling',
            category: 'Database Optimization',
            name: 'Connection Pooling',
            origin: 'Database Optimization (1990s); Cloud adoption ~2010',
            whatItIs: 'Maintains a pool of reusable database connections rather than creating new ones per request. Reduces connection overhead, improves throughput.',
            whenToUse: 'High-concurrency web applications, microservices architectures, serverless functions connecting to databases.',
            pros: 'Reduces connection latency, improves throughput by 2–10x, prevents connection exhaustion, resource efficient.',
            cons: 'Adds complexity, connection staleness issues, incorrect pool sizing degrades performance.',
            cost: 'Usually built into managed database services or ORM libraries; no separate cost.',
            implementations: {
                aws: 'RDS Proxy',
                azure: 'Connection Pooling (built into services)',
                gcp: 'Cloud SQL Auth Proxy / Connection Pooling',
                alibaba: 'Connection Pool Manager',
                ibm: 'Connection Pooling',
                oracle: 'Connection Manager'
            }
        },
        {
            id: 'read-replica-multi-az',
            category: 'Database High Availability',
            name: 'Read Replica / Multi-AZ Replication',
            origin: 'Database Replication (1980s); Cloud HA ~2006',
            whatItIs: 'Read Replicas: async copies of database for scaling reads. Multi-AZ: sync replication across availability zones for automatic failover and HA.',
            whenToUse: 'Scaling read-heavy workloads, disaster recovery, HA requirements, multi-region serving.',
            pros: 'Read scalability (up to 5–15 replicas), zero downtime failover, improved durability, RTO/RPO compliance.',
            cons: 'Replication lag (eventual consistency), write bottleneck at primary, increased operational complexity, additional costs.',
            cost: 'Replica cost = primary cost; Multi-AZ ~+50% standby cost; typical HA setup $200–$500/month.',
            implementations: {
                aws: 'RDS Multi-AZ, RDS Read Replicas',
                azure: 'Geo-Replication, Read Replicas',
                gcp: 'Cloud SQL Replicas, Cloud Spanner',
                alibaba: 'RDS Multi-AZ Read Replicas',
                ibm: 'HA/DR Replicas',
                oracle: 'Data Guard'
            }
        },
        {
            id: 'gsi-sharding',
            category: 'NoSQL Scaling',
            name: 'GSI / Sharding',
            origin: 'Database Sharding (1990s); GSI/LSI (2012–2013)',
            whatItIs: 'Global Secondary Index (GSI): alternate sort key enabling new query patterns. Sharding: horizontal partitioning across nodes for scalability.',
            whenToUse: 'Querying NoSQL data by non-primary key, distributing data across shards to scale beyond single partition limits.',
            pros: 'Enables flexible querying, horizontal scalability beyond partition limits, improves query performance.',
            cons: 'Increased complexity, eventual consistency, hot partition risks, sharding strategy critical.',
            cost: 'GSI cost ~same as base table (~$0.25/GB/month); sharding infrastructure costs scale linearly.',
            implementations: {
                aws: 'DynamoDB GSI/LSI',
                azure: 'Cosmos DB Partitioning',
                gcp: 'Datastore Composite Indexes',
                alibaba: 'Table Store Indexes',
                ibm: 'Cloudant Indexes',
                oracle: 'NoSQL Sharding'
            }
        },
        {
            id: 'cache-control-headers',
            category: 'HTTP Caching',
            name: 'Cache-Control Headers',
            origin: 'HTTP/1.1 Spec (1997)',
            whatItIs: 'HTTP headers (Cache-Control, ETag, Expires) controlling caching behavior. Directives: max-age, public/private, no-cache, no-store.',
            whenToUse: 'Reducing bandwidth, improving response times, CDN integration, static asset delivery, API response caching.',
            pros: 'Reduces bandwidth 50–90%, improves user experience, simple to implement, no server cost.',
            cons: 'Cache invalidation complexity, stale content risks, incorrect headers can break functionality.',
            cost: 'No direct cost; bandwidth savings typically $100–$1K/month at scale.',
            implementations: {
                aws: 'CloudFront Cache-Control',
                azure: 'CDN Cache Rules',
                gcp: 'Cloud CDN Cache Policies',
                alibaba: 'Alibaba CDN Cache',
                ibm: 'CDN Cache Control',
                oracle: 'Web Acceleration Cache'
            }
        },
        {
            id: 'health-check',
            category: 'Reliability',
            name: 'Health Check',
            origin: 'Load Balancing Best Practices (1990s)',
            whatItIs: 'Periodic HTTP requests (or other protocols) to application endpoints. Determines if instances are healthy; unhealthy instances are removed from rotation.',
            whenToUse: 'Load balancing, auto-scaling decisions, Kubernetes liveness/readiness probes, monitoring application health.',
            pros: 'Automatic failover, prevents traffic to degraded instances, simple to implement, industry standard.',
            cons: 'False positives (cascading failures), health check endpoints can become bottleneck, protocol-specific complexity.',
            cost: 'Usually bundled into load balancing/orchestration services; no separate cost.',
            implementations: {
                aws: 'ALB/NLB Health Checks, ASG Health Checks',
                azure: 'Load Balancer Probes',
                gcp: 'Health Checks',
                alibaba: 'SLB Health Checks',
                ibm: 'Health Check',
                oracle: 'Health Check'
            }
        },
        {
            id: 'iam-role',
            category: 'Security',
            name: 'IAM Role / Service Principal',
            origin: 'AWS IAM Roles (2011)',
            whatItIs: 'Identity representing applications/services (not humans). Includes permissions policy. Avoids hardcoding credentials; temporary credentials issued via STS.',
            whenToUse: 'Giving EC2/Lambda/containers cloud permissions (e.g., S3 read), cross-account access, service-to-service authentication.',
            pros: 'No hardcoded credentials, temporary tokens, audit trail, fine-grained permissions, ideal for security.',
            cons: 'Complexity for cross-account setups, debugging permission denials challenging.',
            cost: 'No direct cost; included in IAM.',
            implementations: {
                aws: 'IAM Roles',
                azure: 'Managed Identities / Service Principals',
                gcp: 'Service Accounts',
                alibaba: 'RAM Roles',
                ibm: 'Service IDs',
                oracle: 'IAM Dynamic Groups'
            }
        },
        {
            id: 'vpc-security-group',
            category: 'Network Security',
            name: 'VPC / Security Group',
            origin: 'VPC (2009); AWS Security Groups ~2006',
            whatItIs: 'Virtual Private Cloud (VPC): isolated network environment. Security Group: firewall rules (inbound/outbound) for compute resources.',
            whenToUse: 'Isolating application infrastructure, controlling traffic between resources, enforcing network policies.',
            pros: 'Cost-effective security, fine-grained traffic control, easy to modify, multi-tier architecture support.',
            cons: 'Default deny complexity, misconfiguration risks, troubleshooting network issues challenging.',
            cost: 'No direct cost; included in infrastructure.',
            implementations: {
                aws: 'VPC, Security Groups',
                azure: 'VNets, Network Security Groups (NSGs)',
                gcp: 'VPC, Firewall Rules',
                alibaba: 'VPC, Security Groups',
                ibm: 'VPC, Security Groups',
                oracle: 'VCN, Security Lists'
            }
        },
        {
            id: 'feature-store',
            category: 'ML/Data',
            name: 'Feature Store',
            origin: 'Tecton / Feast (2018–2019); Cloud adoption ~2020',
            whatItIs: 'Centralized repository for ML features (engineered data). Manages feature consistency between training and inference, versioning, and governance.',
            whenToUse: 'ML production systems requiring consistent features across training/inference, feature reuse across models, real-time feature serving.',
            pros: 'Feature consistency, reduces training/serving skew, versioning control, improved time-to-market for new models.',
            cons: 'Added infrastructure complexity, learning curve, cost of managed services, operational overhead.',
            cost: 'Managed feature stores: $1000–$10K/month; self-hosted: infrastructure costs.',
            implementations: {
                aws: 'SageMaker Feature Store',
                azure: 'Azure ML Feature Store',
                gcp: 'Vertex AI Feature Store',
                alibaba: 'Feature Store (beta)',
                ibm: 'Watson Studio Feature Store',
                oracle: 'OML Feature Store'
            }
        },
        {
            id: 'columnar-storage-mpp',
            category: 'Analytics Optimization',
            name: 'Columnar Storage / MPP',
            origin: 'Columnar Storage (1990s); Cloud MPP ~2010',
            whatItIs: 'Data stored by column rather than row. Massive Parallel Processing (MPP) distributes query execution across nodes. Optimizes analytical queries.',
            whenToUse: 'BI dashboards, data warehouse queries, aggregate analytics, time-series analysis.',
            pros: 'Dramatically faster analytical queries (10–100x), compression benefits, sub-second response at petabyte scale.',
            cons: 'Not optimized for transactional workloads, ingestion latency, schema design critical.',
            cost: 'Typically $2–$10 per TB scanned; annual spend $10K–$100K+.',
            implementations: {
                aws: 'Redshift',
                azure: 'Synapse SQL',
                gcp: 'BigQuery',
                alibaba: 'AnalyticDB',
                ibm: 'Db2 Warehouse',
                oracle: 'Autonomous Data Warehouse'
            }
        },
        {
            id: 'etl-elt',
            category: 'Data Integration',
            name: 'ETL / ELT',
            origin: 'ETL (1970s); ELT paradigm ~2010s',
            whatItIs: 'ETL: Extract, Transform, Load (traditional). ELT: Extract, Load, Transform (modern cloud-native). Moves and transforms data between systems.',
            whenToUse: 'Data pipeline orchestration, data warehouse population, data integration from multiple sources.',
            pros: 'ETL: cleaned data, lower storage. ELT: faster ingestion, scalable transformations.',
            cons: 'Complex to maintain, schema evolution challenges, cost scalability (especially ELT).',
            cost: 'Managed services: $500–$5000/month; custom: infrastructure + engineering time.',
            implementations: {
                aws: 'Glue, Data Pipeline',
                azure: 'Data Factory',
                gcp: 'Dataflow / Dataprep',
                alibaba: 'DataWorks',
                ibm: 'DataStage',
                oracle: 'Data Integration'
            }
        },
        {
            id: 'mqtt-device-shadow',
            category: 'IoT Patterns',
            name: 'MQTT / Device Shadow',
            origin: 'MQTT (1999); Device Shadow (Azure, AWS ~2015)',
            whatItIs: 'MQTT: lightweight pub-sub protocol for IoT. Device Shadow: virtual representation of device state (desired vs actual), enabling async device management.',
            whenToUse: 'IoT device communication, remote device configuration, offline-first device handling, command-and-control.',
            pros: 'Low bandwidth, pub-sub model ideal for many-to-many, shadow handles connectivity issues gracefully.',
            cons: 'Eventual consistency, debugging complexity, security configuration critical.',
            cost: 'Usually $0.00001–$0.0002 per message; $50–$500/month at scale.',
            implementations: {
                aws: 'AWS IoT MQTT, Device Shadow',
                azure: 'Azure IoT Hub MQTT, Device Twin',
                gcp: 'Cloud IoT MQTT',
                alibaba: 'IoT Platform MQTT',
                ibm: 'IoT Platform MQTT',
                oracle: 'IoT Device Shadow'
            }
        },
        {
            id: 'time-series-database',
            category: 'Data Storage',
            name: 'Time-Series Database',
            origin: 'InfluxDB (2013); Cloud adoption ~2015',
            whatItIs: 'Optimized database for time-stamped data (metrics, logs, sensor readings). Efficient compression, downsampling, retention policies.',
            whenToUse: 'Monitoring/observability, IoT sensor data, stock market data, application metrics, log ingestion at scale.',
            pros: '10–100x better compression than relational, efficient downsampling, retention automation, sub-millisecond queries.',
            cons: 'Not suitable for transactional data, eventual consistency, learning curve, schema design matters.',
            cost: 'Usually $50–$500/month managed; scales with write volume.',
            implementations: {
                aws: 'Timestream',
                azure: 'Data Explorer',
                gcp: 'BigQuery Time Series',
                alibaba: 'Time Series Database',
                ibm: 'Time Series Database',
                oracle: 'Time Series'
            }
        }
    ],

    // Provider implementations for services (detailed comparison table data)
    serviceComparisonTable: [
        {
            service: 'Virtual Machines',
            aws: 'EC2 • On-demand, Reserved, Spot • 100+ instance types • Auto Scaling Groups • VPC isolated',
            azure: 'VMs • Spot, Reserved, On-demand • 100+ instance types • VMSS for scaling • Multi-region support',
            gcp: 'Compute Engine • Preemptible, Committed • Auto Scaling • Sole Tenancy • Regional resources',
            alibaba: 'ECS • Pay-as-you-go • Spot instances • Auto Scaling • Regional availability',
            ibm: 'Virtual Servers • Public/private clouds • HA across zones • Flexible sizing',
            oracle: 'Compute Instances • Flexible pricing • OCI CLI • Shapes (CPU/Memory combinations) • Regional'
        },
        {
            service: 'Containerization & Orchestration',
            aws: 'ECS: proprietary • EKS: managed K8s • Fargate: serverless containers • ECR: image registry',
            azure: 'AKS: managed K8s • Container Instances: serverless • ACR: image registry • Helm integration',
            gcp: 'GKE: managed K8s • Cloud Run: serverless containers • Artifact Registry • Advanced networking',
            alibaba: 'ACK: managed K8s • Container Registry • Service Mesh support • Cost optimization',
            ibm: 'IKS: managed K8s • Container Registry • Istio pre-installed • Enterprise support',
            oracle: 'OKE: managed K8s • Container Registry • Autonomous provisioning • Registry compartments'
        },
        {
            service: 'Serverless Computing',
            aws: 'Lambda • 15 min timeout • 10K concurrent • Layers • VPC support • 200ms cold start',
            azure: 'Azure Functions • 10 min default • Durable Functions • Elastic Premium • Cold starts ~1s',
            gcp: 'Cloud Functions • 9 min timeout • 1000 concurrent • Cloud Run for longer tasks • HTTP/event triggers',
            alibaba: 'Function Compute • 15 min timeout • Cost-effective • Rapid scaling • Regional',
            ibm: 'Functions • OpenWhisk based • Apache standard • Private containers • Regional',
            oracle: 'Functions • Oracle standard • Async execution • VPC support • Logging/monitoring included'
        },
        {
            service: 'Object Storage',
            aws: 'S3 • 11 nines durability • Storage Classes (Standard/IA/Glacier) • Versioning • Lifecycle policies • Unlimited scale',
            azure: 'Blob Storage • 11 nines durability • Access Tiers (Hot/Cool/Archive) • Lifecycle management • Global replication',
            gcp: 'Cloud Storage • 11 nines durability • Storage Classes • Lifecycle rules • Custom metadata • Signed URLs',
            alibaba: 'OSS • 11 nines durability • Storage Classes • Lifecycle policies • Object ACL • Bandwidth throttling',
            ibm: 'Cloud Object Storage • 11 nines durability • Storage Classes • Retention policies • Cross-region replication',
            oracle: 'Object Storage • 11 nines durability • Tiers • Lifecycle management • Encryption • Namespace structure'
        },
        {
            service: 'Relational Databases',
            aws: 'RDS • Managed PostgreSQL/MySQL/MariaDB/Oracle/SQL Server • Multi-AZ failover • Read Replicas • Automated backups • Aurora proprietary',
            azure: 'SQL Database • Managed SQL Server • PostgreSQL • MySQL • Geo-replication • Azure SQL Managed Instance',
            gcp: 'Cloud SQL • PostgreSQL/MySQL/SQL Server • HA-enabled • Read Replicas • Automated backups • Cloud Spanner for scale',
            alibaba: 'ApsaraDB • RDS • PolarDB (MySQL-compatible) • HA across zones • Auto scaling storage',
            ibm: 'Db2 on Cloud • Managed Db2 • PostgreSQL • High availability • Automated backups',
            oracle: 'Autonomous Database • Fully autonomous • Self-scaling • Workload-optimized (OLTP/DW/JSON) • No maintenance'
        },
        {
            service: 'NoSQL Databases',
            aws: 'DynamoDB • Key-value • Strongly consistent/Eventually consistent • GSI/LSI • Streams • TTL • On-demand/Provisioned',
            azure: 'Cosmos DB • Multi-model (document/key-value/graph/table) • 5 consistency levels • Global distribution • Multi-region writes',
            gcp: 'Firestore • Document store • Real-time sync • Offline support • Scalable • Datastore legacy option',
            alibaba: 'Table Store • Key-value NoSQL • Timeline model • Time-to-live • Conditional update',
            ibm: 'Cloudant • Managed CouchDB • JSON documents • Multi-tenancy • Eventual consistency',
            oracle: 'NoSQL Database • Document/Key-value • ACID transactions • JSON support • Auto-scaling'
        },
        {
            service: 'CDN & Edge Computing',
            aws: 'CloudFront • Edge locations worldwide • DDoS protection (Shield) • Lambda@Edge • Request/response transformation',
            azure: 'Front Door • Global load balancing • DDoS protection • Azure Web Application Firewall • Rules engine',
            gcp: 'Cloud CDN • Media CDN • Cloud Armor DDoS • Cache policies • Custom origin headers',
            alibaba: 'Alibaba CDN • Presence in APAC • EdgeScript custom logic • Real-time analytics',
            ibm: 'CDN • Akamai-backed • Performance monitoring • Purge cache • SSL/TLS',
            oracle: 'Web Application Acceleration • Built on CDN • DDoS protection • Request throttling'
        },
        {
            service: 'Load Balancing & Traffic Management',
            aws: 'ALB • Layer 7 (HTTP/HTTPS/gRPC) • Path/host-based routing • NLB • Layer 4 (TCP/UDP) • Classic LB (legacy)',
            azure: 'Load Balancer • Layer 4 • Inbound/outbound rules • Application Gateway • Layer 7 • Traffic Manager • Global routing',
            gcp: 'HTTP(S) Load Balancing • Layer 7 • Global load balancing • Cloud Armor • Network Load Balancing • Layer 4',
            alibaba: 'SLB • Classic/Application LB • TCP/UDP • Health checks • Session persistence',
            ibm: 'Load Balancer • Public/private • Layer 4/7 • High availability • Monitor health',
            oracle: 'Load Balancer • Flexible routing • SSL offloading • Network load balancing • Monitoring'
        },
        {
            service: 'Machine Learning Platforms',
            aws: 'SageMaker • Notebooks • Model training • Auto ML • Real-time/batch inference • A/B testing • Feature Store',
            azure: 'Azure Machine Learning • Automated ML • Designer (no-code) • MLOps • Model management • Training clusters',
            gcp: 'Vertex AI • Unified ML platform • AutoML • Pre-built models • Model registry • Batch/online prediction',
            alibaba: 'Machine Learning Platform for AI • Notebook environment • Training • Model registry',
            ibm: 'Watson Machine Learning • Auto AI • Model deployment • Explainability • Integration with Watson Studio',
            oracle: 'OML (Oracle Machine Learning) • Notebooks • Algorithms • SQL/Python integration • Model export'
        },
        {
            service: 'Data Warehouse & MPP',
            aws: 'Redshift • Columnar • 160 GB–2 PB capacity • COPY/UNLOAD • Spectrum (query S3) • Concurrency Scaling',
            azure: 'Synapse Analytics • SQL Pools (MPP) • Spark Pools (big data) • Pipelines (ETL) • On-demand scaling',
            gcp: 'BigQuery • Petabyte scale • SQL • Per-query pricing • Nested/repeated fields • Machine Learning integration',
            alibaba: 'AnalyticDB • Columnar storage • Real-time analytics • Query acceleration • Multi-source federation',
            ibm: 'Db2 Warehouse • MPP • In-database ML • Compression • Workload management',
            oracle: 'Autonomous Data Warehouse • Auto-scaling • Workload isolation • Autonomous backup • SQL/PL SQL'
        },
        {
            service: 'IoT Hub',
            aws: 'AWS IoT Core • 7.5 billion device connections/day • MQTT/HTTP APIs • Device Shadow • Rules Engine • Greengrass edge',
            azure: 'Azure IoT Hub • Millions concurrent devices • MQTT/AMQP/HTTPS • Device Twin • Rule-based message routing • Edge modules',
            gcp: 'Cloud IoT • MQTT/HTTP protocols • Device registry • Telemetry • Command & control • EdgeML',
            alibaba: 'IoT Platform • Device management • Data analysis • Rule engine • Multi-protocol (MQTT/CoAP)',
            ibm: 'Watson IoT Platform • Device connectivity • Data analysis • Asset tracking • Application enablement',
            oracle: 'IoT Hub • Message broker • Device management • Analytics • Alerts & notifications'
        }
    ],

    // Building block implementations for comparison table
    bbComparisonTable: [
        {
            bb: 'Hypervisor',
            aws: 'Custom AWS Nitro (KVM-based)',
            azure: 'Hyper-V (custom fork)',
            gcp: 'KVM with custom optimizations',
            alibaba: 'KVM-based custom hypervisor',
            ibm: 'PowerVM, z/VM',
            oracle: 'Oracle VM (KVM-based)'
        },
        {
            bb: 'VM Image / AMI',
            aws: 'AMI (Amazon Machine Image) • Marketplace images • Community AMIs',
            azure: 'Managed Images • Shared Image Gallery • Marketplace images',
            gcp: 'Machine Images • Public images • Custom images',
            alibaba: 'Custom Images • Public images • Marketplace',
            ibm: 'Custom Images • Public image catalog',
            oracle: 'Custom Images • Public images'
        },
        {
            bb: 'Dockerfile',
            aws: 'ECR supports standard Dockerfile • Build via CodeBuild',
            azure: 'ACR supports standard Dockerfile • Azure DevOps integration',
            gcp: 'Artifact Registry • Cloud Build • Standard Dockerfile',
            alibaba: 'ACR supports standard Dockerfile',
            ibm: 'Container Registry • Standard Dockerfile',
            oracle: 'Container Registry • Standard Dockerfile'
        },
        {
            bb: 'Kubernetes Basics',
            aws: 'EKS manages master • User manages worker nodes • kubectl native',
            azure: 'AKS manages master & nodes • Integrated with Azure AD',
            gcp: 'GKE manages master & nodes • Workload Identity',
            alibaba: 'ACK manages master • Regional availability',
            ibm: 'IKS manages master & nodes • OpenShift option',
            oracle: 'OKE manages master • Enhanced networking'
        },
        {
            bb: 'Helm Chart',
            aws: 'Helm on EKS • ECR for chart hosting',
            azure: 'Helm on AKS • ACR for charts',
            gcp: 'Helm on GKE • Artifact Registry',
            alibaba: 'Helm on ACK • Alibaba registry',
            ibm: 'Helm on IKS • IBM registry',
            oracle: 'Helm on OKE • Oracle registry'
        },
        {
            bb: 'API Gateway',
            aws: 'API Gateway • 10K RPS per account • Request transformation',
            azure: 'API Management • Policies for transformation • Analytics',
            gcp: 'Cloud Endpoints • Apigee for enterprise • OpenAPI spec',
            alibaba: 'API Gateway • Request/response mapping',
            ibm: 'API Connect • Portal • Developer experience',
            oracle: 'API Gateway • Policies • Rate limiting'
        },
        {
            bb: 'Storage Lifecycle Management',
            aws: 'S3 Lifecycle Policies • Transition objects between tiers • Expiration',
            azure: 'Blob Lifecycle Management • Transition rules • Archive after N days',
            gcp: 'Object Lifecycle Management • Action types (delete/setStorageClass)',
            alibaba: 'OSS Lifecycle Rules • Tag-based transitions',
            ibm: 'Lifecycle Configuration • Rules & actions',
            oracle: 'Lifecycle Policy • Transition rules'
        },
        {
            bb: 'Connection Pooling',
            aws: 'RDS Proxy • Reuses database connections • Supports all RDS engines',
            azure: 'Built-in • Elastic Pool for scaling',
            gcp: 'Cloud SQL Proxy • Auth proxy • PgBouncer integration',
            alibaba: 'Connection Pool in RDS',
            ibm: 'Connection pooling in managed DB',
            oracle: 'Connection Manager'
        },
        {
            bb: 'Read Replica / Multi-AZ',
            aws: 'RDS Multi-AZ (sync failover) • Read Replicas (async, up to 5) • Aurora Global Database',
            azure: 'Geo-replication (active-geo) • Read replicas • Backup geo-redundancy',
            gcp: 'Cloud SQL Replicas (async) • Cloud Spanner (sync global)',
            alibaba: 'RDS Multi-AZ • Read replicas • Cross-region backup',
            ibm: 'HA/DR Replicas • Backup strategies',
            oracle: 'Data Guard (sync) • Read replicas • Golden Gate'
        },
        {
            bb: 'GSI / Sharding',
            aws: 'DynamoDB GSI • Up to 10 GSI • LSI (legacy) • Sparse index support',
            azure: 'Cosmos DB Partitioning • Composite indexes',
            gcp: 'Datastore Composite Indexes • Query planning',
            alibaba: 'Table Store Indexes • Secondary indexes',
            ibm: 'Cloudant Indexes • Mango query',
            oracle: 'NoSQL Sharding • Global indexes'
        },
        {
            bb: 'Cache-Control Headers',
            aws: 'CloudFront • Cache-Control, Expires, ETag headers • Custom cache behaviors',
            azure: 'CDN • Cache rules • Cache expiration',
            gcp: 'Cloud CDN • Cache-Control headers • Custom responses',
            alibaba: 'Alibaba CDN • Cache headers • Refresh policies',
            ibm: 'CDN • Cache control • Header rules',
            oracle: 'Web Acceleration • Cache headers • Rules engine'
        },
        {
            bb: 'Health Check',
            aws: 'ALB/NLB Target Group Health Checks • ASG Health Checks • Custom health check',
            azure: 'Load Balancer Probes • Application Gateway health • AKS health checks',
            gcp: 'Health Checks • HTTP/HTTPS/TCP • Timeout/interval customizable',
            alibaba: 'SLB Health Checks • TCP/HTTP • Interval settings',
            ibm: 'Health Check • Protocol options',
            oracle: 'Health Check • Custom endpoints'
        },
        {
            bb: 'IAM Role / Service Principal',
            aws: 'IAM Roles • Trust policy • Attached policies • Credential access via STS • Cross-account assume',
            azure: 'Managed Identities (system/user) • RBAC • Access policies',
            gcp: 'Service Accounts • Keys (JSON/P12) • Workload Identity • Cross-project',
            alibaba: 'RAM Roles • Attach policies • STS assume role',
            ibm: 'Service IDs • API keys • Access groups',
            oracle: 'IAM Dynamic Groups • Policies • Rules-based'
        },
        {
            bb: 'VPC / Security Group',
            aws: 'VPC • Subnets (public/private) • Security Groups • NACLs • Route tables',
            azure: 'VNets • Subnets • NSGs • Route tables • Service endpoints',
            gcp: 'VPC • Subnets • Firewall rules • Routes • Service networking',
            alibaba: 'VPC • VSwitches • Security Groups • Route tables',
            ibm: 'VPC • Subnets • Security Groups • Access lists',
            oracle: 'VCN • Subnets • Security Lists • Route tables • NSGs'
        },
        {
            bb: 'Feature Store',
            aws: 'SageMaker Feature Store • Online/offline store • Batch ingestion • Real-time feature retrieval',
            azure: 'Azure ML Feature Store • Feature sets • Materialization',
            gcp: 'Vertex AI Feature Store • Entity/feature definitions • Serving',
            alibaba: 'Feature Store (beta)',
            ibm: 'Watson Studio Feature Store',
            oracle: 'OML Feature Store'
        },
        {
            bb: 'Columnar Storage / MPP',
            aws: 'Redshift • Node slices • RA3 compute-optimized • Spectrum for S3',
            azure: 'Synapse SQL • Distributed query • On-demand scaling',
            gcp: 'BigQuery • Streaming inserts • Wildcard tables • BI Engine',
            alibaba: 'AnalyticDB • Interactive query • Real-time analytics',
            ibm: 'Db2 Warehouse • In-database ML • Compression',
            oracle: 'Autonomous Data Warehouse • Optimized compression'
        },
        {
            bb: 'ETL / ELT',
            aws: 'Glue • Data Catalog • ETL jobs • Data Pipeline (orchestration) • Lambda for custom',
            azure: 'Data Factory • Copy activity • Data flows • Mapping data flows (code-free)',
            gcp: 'Dataflow • Apache Beam • Dataprep (no-code) • Cloud Composer (Airflow)',
            alibaba: 'DataWorks • Data integration • Task scheduling • Data quality monitoring',
            ibm: 'DataStage • ETL design • Integration with Data Warehouse',
            oracle: 'Data Integration • Replication • ETL engine'
        },
        {
            bb: 'MQTT / Device Shadow',
            aws: 'AWS IoT MQTT • Topics • QoS 0/1 • Device Shadow (JSON state) • Retained messages',
            azure: 'Azure IoT Hub MQTT • Device Twin (desired/reported) • Commands',
            gcp: 'Cloud IoT MQTT • Configuration updates • Telemetry messages',
            alibaba: 'IoT Platform MQTT • Device properties/events',
            ibm: 'IoT Platform MQTT • Device state',
            oracle: 'IoT MQTT • Message broker'
        },
        {
            bb: 'Time-Series Database',
            aws: 'Timestream • Retention policies • Downsampling • InfluxDB integration',
            azure: 'Data Explorer • Time series analysis • Real-time analytics',
            gcp: 'BigQuery Time Series • Time series functions • Forecasting',
            alibaba: 'Time Series Database • Time window queries',
            ibm: 'Time Series Database',
            oracle: 'Time Series • Compression • Analytics'
        }
    ],

    // Key takeaways
    takeaways: [
        {
            category: 'Compute',
            insights: 'VMs offer control; containers provide efficiency; serverless minimizes ops. Choose based on workload characteristics: long-running→VMs, microservices→containers, event-driven→serverless.'
        },
        {
            category: 'Storage',
            insights: 'Object storage scales infinitely; relational databases enforce consistency; NoSQL offers flexibility. Mix approaches: operational data (relational), unstructured (object storage), flexible (NoSQL).'
        },
        {
            category: 'Networking',
            insights: 'CDNs cut latency; load balancers prevent bottlenecks; VPCs isolate resources. Multi-region setup requires thoughtful networking design.'
        },
        {
            category: 'AI/ML',
            insights: 'ML platforms abstract complexity; feature stores prevent training/inference skew; pre-built models accelerate deployment. Start with managed services; self-manage only if needed.'
        },
        {
            category: 'Analytics',
            insights: 'Data warehouses enable analytics at scale; columnar storage cuts costs; ETL/ELT bridges systems. Design schemas before loading massive data.'
        },
        {
            category: 'IoT',
            insights: 'IoT hubs handle millions of devices; MQTT is lightweight; device shadows provide async control. Plan for security and device management upfront.'
        },
        {
            category: 'Security',
            insights: 'IAM roles eliminate hardcoded secrets; VPCs limit exposure; health checks enable self-healing. Defense-in-depth is essential: network, identity, encryption.'
        },
        {
            category: 'Cost Optimization',
            insights: 'Reserved capacity saves 30–70%; lifecycle policies cut storage 80%; multi-tier architecture matches workload to tier. Monitor spend continuously.'
        }
    ]
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATA;
}
