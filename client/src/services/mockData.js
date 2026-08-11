export const DEMO_PERSONAS = {
  fullstack: {
    id: "persona-fullstack",
    candidate_name: "Alex Rivera",
    contact_email: "alex.rivera@university.edu",
    education: "B.Tech Computer Science, 3rd Year (CGPA: 8.4)",
    target_role: "Full-Stack AI Engineer",
    experience_level: "Entry-Level / Intern",
    target_companies: "Product Companies & AI Startups",
    timeline_weeks: 12,
    readiness_score: 64,
    summary_assessment: "Solid foundation in modern React and Python scripting. Lacks production backend architecture, database optimization, and vector search retrieval patterns required for modern AI roles.",
    current_skills: ["React", "JavaScript", "TypeScript", "Python", "Tailwind CSS", "Git", "REST APIs"],
    tools_and_platforms: ["Git", "VS Code", "Postman", "Linux", "Vercel"],
    projects: [
      {
        title: "Campus Notes Exchange",
        tech_stack: ["React", "Node.js", "MongoDB"],
        description: "Document sharing platform with JWT authentication and file upload handling."
      },
      {
        title: "Algorithmic Code Visualizer",
        tech_stack: ["TypeScript", "Canvas API"],
        description: "Interactive browser visualization for sorting and graph pathfinding algorithms."
      }
    ],
    skills_present: [
      { skill: "React & TypeScript", proficiency_or_importance: "85%" },
      { skill: "Python Fundamentals", proficiency_or_importance: "78%" },
      { skill: "REST API Design", proficiency_or_importance: "70%" },
      { skill: "Git & Version Control", proficiency_or_importance: "88%" }
    ],
    skills_missing: [
      { skill: "FastAPI & Microservices", proficiency_or_importance: "Critical" },
      { skill: "PostgreSQL & Indexing", proficiency_or_importance: "High" },
      { skill: "Vector Databases & RAG Pipelines", proficiency_or_importance: "Critical" },
      { skill: "Docker & Containerization", proficiency_or_importance: "Medium" }
    ],
    roadmap: [
      {
        id: "m1",
        phase: 1,
        title: "Production Backend & Relational Data",
        duration: "Weeks 1 - 3",
        completed: true,
        action_items: [
          "Build production-ready CRUD services in FastAPI with Pydantic v2 validation",
          "Design normalized relational schemas in PostgreSQL with SQLModel",
          "Implement connection pooling and indexed search queries"
        ],
        curated_resources: [
          "FastAPI Official Tutorial - User Guide",
          "PostgreSQL for Developers - Full Course (freeCodeCamp)",
          "Designing Data-Intensive Applications (Chapters 2-3)"
        ]
      },
      {
        id: "m2",
        phase: 2,
        title: "AI Retrieval & Vector Embeddings",
        duration: "Weeks 4 - 7",
        completed: false,
        action_items: [
          "Set up hybrid search using Qdrant or pgvector in PostgreSQL",
          "Build chunking and embedding pipelines for PDF documentation",
          "Implement context-aware prompt caching with Google Gemini 1.5 Flash"
        ],
        curated_resources: [
          "DeepLearning.AI: Retrieval Augmented Generation Fundamentals",
          "Gemini API Documentation: Function Calling & Structured Outputs"
        ]
      },
      {
        id: "m3",
        phase: 3,
        title: "System Design & Deployment Pipeline",
        duration: "Weeks 8 - 12",
        completed: false,
        action_items: [
          "Containerize frontend and backend using multi-stage Docker builds",
          "Configure Redis for API rate limiting and token bucket throttles",
          "Deploy containerized microservices to cloud hosting with CI/CD"
        ],
        curated_resources: [
          "ByteByteGo: System Design Fundamentals",
          "Docker Documentation for Python & Node Services"
        ]
      }
    ],
    recommended_projects: [
      {
        id: "p1",
        title: "Enterprise Knowledge Base with Hybrid Search",
        difficulty: "Intermediate",
        skills_gained: ["FastAPI", "pgvector", "Gemini API", "React"],
        architecture_overview: "A document analysis service allowing teams to upload PDFs, generate vector embeddings, and perform semantic search with source citations.",
        github_starter_steps: [
          "Initialize FastAPI backend with asynchronous background file processing",
          "Configure pgvector extension in PostgreSQL for cosine similarity search",
          "Implement React frontend with live stream response rendering"
        ]
      },
      {
        id: "p2",
        title: "API Gateway with Redis Rate Limiting",
        difficulty: "Advanced",
        skills_gained: ["Python", "Redis", "Docker", "Nginx"],
        architecture_overview: "High-throughput reverse proxy handling JWT validation, IP-based sliding window rate limits, and health check monitoring.",
        github_starter_steps: [
          "Set up Redis sliding-window counter algorithm",
          "Write Docker Compose specification for multi-container orchestration",
          "Benchmark throughput with locust/autocannon"
        ]
      }
    ],
    mock_interview_questions: [
      {
        id: "q1",
        topic: "System Design",
        question: "How would you prevent duplicate requests when designing an asynchronous document processing API?",
        ideal_answer_points: [
          "Implement idempotency keys stored in Redis with a short TTL",
          "Validate unique file hashes (e.g. SHA-256) before starting parsing jobs",
          "Return HTTP 409 Conflict or existing task ID if duplicate hash is active"
        ]
      },
      {
        id: "q2",
        topic: "Database Architecture",
        question: "Explain when you would choose B-Tree indexing versus HNSW indexing in PostgreSQL.",
        ideal_answer_points: [
          "B-Tree is optimized for scalar equality and range queries (<, >, =)",
          "HNSW (Hierarchical Navigable Small World) is used in pgvector for high-dimensional approximate nearest neighbor search",
          "HNSW trades slight accuracy for significantly faster sub-second vector queries"
        ]
      }
    ]
  },

  datascience: {
    id: "persona-datascience",
    candidate_name: "Priya Sharma",
    contact_email: "priya.sharma@tech.edu",
    education: "B.Tech Information Technology, 4th Year (CGPA: 8.9)",
    target_role: "Data Scientist / ML Engineer",
    experience_level: "Entry-Level / Fresher",
    target_companies: "Enterprise Tech & FinTech",
    timeline_weeks: 8,
    readiness_score: 72,
    summary_assessment: "Strong statistical background and exploratory data analysis proficiency in Python. Needs hands-on exposure to model deployment, Dockerization, and ML pipeline orchestration.",
    current_skills: ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Data Visualization", "Matplotlib"],
    tools_and_platforms: ["Jupyter", "Git", "Google Colab", "PostgreSQL"],
    projects: [
      {
        title: "Credit Risk Prediction Model",
        tech_stack: ["Python", "Scikit-Learn", "Pandas", "XGBoost"],
        description: "Classification model predicting loan defaults with 89% ROC-AUC score using gradient boosting."
      }
    ],
    skills_present: [
      { skill: "Statistical Analysis & EDA", proficiency_or_importance: "92%" },
      { skill: "Supervised Learning (Scikit-Learn)", proficiency_or_importance: "85%" },
      { skill: "SQL Querying", proficiency_or_importance: "80%" }
    ],
    skills_missing: [
      { skill: "Model Serving & FastAPI", proficiency_or_importance: "Critical" },
      { skill: "MLflow / Experiment Tracking", proficiency_or_importance: "High" },
      { skill: "Docker for ML Workloads", proficiency_or_importance: "High" }
    ],
    roadmap: [
      {
        id: "dm1",
        phase: 1,
        title: "Model Serving & Serialization",
        duration: "Weeks 1 - 4",
        completed: true,
        action_items: [
          "Package trained Scikit-Learn models using ONNX and Joblib",
          "Build low-latency inference endpoints in FastAPI",
          "Implement request payload validation and anomaly detection"
        ],
        curated_resources: [
          "Made With ML: Production Machine Learning Systems",
          "FastAPI for Machine Learning Deployment Guide"
        ]
      },
      {
        id: "dm2",
        phase: 2,
        title: "MLOps & Containerized Pipelines",
        duration: "Weeks 5 - 8",
        completed: false,
        action_items: [
          "Log metrics and model artifacts using MLflow",
          "Build repeatable Docker images for inference containers",
          "Set up data drift monitoring metrics"
        ],
        curated_resources: [
          "Full Stack Deep Learning: Deployment & Monitoring",
          "MLflow Documentation: Model Registry & Tracking"
        ]
      }
    ],
    recommended_projects: [
      {
        id: "dp1",
        title: "Real-Time Fraud Detection Inference Service",
        difficulty: "Intermediate",
        skills_gained: ["FastAPI", "XGBoost", "Docker", "Redis"],
        architecture_overview: "End-to-end pipeline serving sub-50ms fraud predictions with automated feature caching in Redis.",
        github_starter_steps: [
          "Train and serialize benchmark gradient boosted classifier",
          "Construct FastAPI inference wrapper with batching",
          "Dockerize application and expose Prometheus metrics"
        ]
      }
    ],
    mock_interview_questions: [
      {
        id: "dq1",
        topic: "Machine Learning Engineering",
        question: "How do you detect and handle data drift in a production recommendation system?",
        ideal_answer_points: [
          "Monitor population stability index (PSI) and Kolmogorov-Smirnov test on incoming feature distributions",
          "Track model performance metrics against delayed ground truth labels",
          "Trigger automated retraining jobs when drift thresholds exceed tolerance"
        ]
      }
    ]
  }
};
