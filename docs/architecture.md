# High-Level System Architecture

## 1. Overview

The **Quantum-Inspired Cyber Threat Detection Framework for Teleportation-Based Quantum Digital Signatures (QDS)** is structured into three clean decoupled layers:

1. **Frontend Presentation & Telemetry (React + Vite + TypeScript + Tailwind CSS)**:
   - Real-time operational dashboard with Recharts data visualization.
   - Interactive QDS Protocol Simulator with visual 3-qubit circuit tracing.
   - Deterministic Verification Center with mathematical reasoning breakdown.
   - Multi-scenario Attack Simulator (Forgery, Impersonation, Replay, Channel Noise).
   - Quantum Visualizer for Bloch sphere spherical angles and statevectors.
   - Benchmark Analytics and Incident Alert Center.

2. **Backend Application & Protocol Engine (FastAPI + Python 3.13)**:
   - **REST API Routers**: `/api/signatures`, `/api/quantum`, `/api/verification`, `/api/attacks`, `/api/dashboard`, `/api/alerts`, `/api/settings`, `/api/analytics`, `/api/demo`.
   - **Quantum Statevector Engine (`app/quantum/`)**: Exact $2^n$-dimensional statevector simulation, unitary gate operators, Bell state generators, quantum teleportation with Pauli correction, and projective measurements ($Z, X, Y$ bases).
   - **Statistical & Probability Engine (`app/services/statistics_service.py`)**: Wilson score confidence intervals, empirical error rate calculations, and binomial likelihood ratio forgery probability models.
   - **Threat Detection Engine (`app/services/threat_detection_service.py`)**: Deterministic, rule-based decision trees with strictly **ZERO AI/Machine Learning**.
   - **Attack Simulation Engine (`app/services/attack_service.py`)**: Controlled software-based injection of physical quantum noise, basis mismatch, identity spoofing, and nonce replay.
   - **Audit & Security Service (`app/services/audit_service.py`)**: Cryptographic message hashing (SHA-256) and immutable audit event logging.

3. **Storage & Persistence (SQLAlchemy ORM + SQLite)**:
   - Relational tables: `users`, `signatures`, `measurements`, `verification_sessions`, `attacks`, `alerts`, `audit_logs`, `system_settings`.
   - Easy migration to PostgreSQL in production environments.

---

## 2. Architectural Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│                   RESEARCHER / USER                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│           REACT DASHBOARD & FRONTEND LAYER             │
│  - Dashboard & Charts      - Attack Simulator          │
│  - QDS Teleport Simulator  - Analytics & Benchmarks    │
│  - Verification Center     - Alert Center & Settings   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / HTTP)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND                      │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Quantum Engine     │    │  Statistical Engine  │  │
│  │  - Statevectors      │    │  - Error Rate (E)    │  │
│  │  - Bell Entanglement │    │  - Wilson 95% CI     │  │
│  │  - Teleportation     │    │  - Forgery Prob P_f  │  │
│  │  - Pauli Corrections │    │  - Threshold Bounds  │  │
│  │  - Measurements      │    └──────────────────────┘  │
│  └──────────────────────┘               │              │
│             │                           │              │
│             ▼                           ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Deterministic Threat Detection Engine      │  │
│  │  - Identity & Authorization Check (Impersonation)│  │
│  │  - Nonce Freshness & Consumption (Replay)        │  │
│  │  - SHA-256 Classical Digest Match (Tampering)    │  │
│  │  - Empirical Error vs Configurable Thresholds    │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy ORM
                            ▼
┌────────────────────────────────────────────────────────┐
│                  SQLITE RELATIONAL DB                  │
│  - signatures              - verification_sessions     │
│  - measurements            - attacks & alerts          │
│  - users & audit_logs      - system_settings           │
└────────────────────────────────────────────────────────┘
```
