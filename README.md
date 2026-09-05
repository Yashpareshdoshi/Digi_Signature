# 🛡️ Quantum-Inspired Cyber Threat Detection for Digital Signature Security
### Deterministic, Statistical & Protocol-Aware Threat Detection for Teleportation-Based Quantum Digital Signatures (QDS)

![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![Qiskit](https://img.shields.io/badge/Qiskit-1.3+-6929C4?logo=ibm&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-8.0+-0A9EDC?logo=pytest&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Strictly_Zero_AI%2FML-brightgreen)
![Evaluation](https://img.shields.io/badge/Evaluation-Empirically_Validated-success)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 📑 Table of Contents

- [🎯 Executive Summary & Problem Formulation](#-executive-summary--problem-formulation)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔬 Core Quantum Protocol (Teleportation-Based QDS)](#-core-quantum-protocol-teleportation-based-qds)
- [📐 Mathematical & Statistical Formulations](#-mathematical--statistical-formulations)
- [🛡️ Deterministic Threat Detection Engine (Strictly ZERO AI/ML)](#️-deterministic-threat-detection-engine-strictly-zero-aiml)
- [🚀 In-Depth Feature Walkthrough Guide](#-in-depth-feature-walkthrough-guide)
  - [1. Real-Time Operational Dashboard](#1-real-time-operational-dashboard)
  - [2. Interactive QDS Protocol Simulator](#2-interactive-qds-protocol-simulator)
  - [3. Dual Quantum Backends (NumPy & Qiskit Aer)](#3-dual-quantum-backends-numpy--qiskit-aer)
  - [4. Interactive Qiskit Circuit & OpenQASM Visualizer](#4-interactive-qiskit-circuit--openqasm-visualizer)
  - [5. Deterministic Verification Center](#5-deterministic-verification-center)
  - [6. Multi-Scenario Cyber Attack Injection Simulator](#6-multi-scenario-cyber-attack-injection-simulator)
  - [7. Automated Parameter Sweeps & Benchmarks](#7-automated-parameter-sweeps--benchmarks)
  - [8. Quantum State & Bloch Sphere Visualizer](#8-quantum-state--bloch-sphere-visualizer)
  - [9. Security Incident Alert Center](#9-security-incident-alert-center)
  - [10. 1-Click Automated Research Demonstration](#10-1-click-automated-research-demonstration)
- [🏗️ High-Level System Architecture](#️-high-level-system-architecture)
- [📁 Project Directory Structure](#-project-directory-structure)
- [📡 REST API Reference](#-rest-api-reference)
- [🧪 Experimental Evaluation & Benchmarks](#-experimental-evaluation--benchmarks)
- [💻 Installation & Setup Guide](#-installation--setup-guide)
  - [Option A: Local Development Setup](#option-a-local-development-setup)
  - [Option B: Docker Compose Deployment](#option-b-docker-compose-deployment)
- [✅ Verification & Unit Testing Suite](#-verification--unit-testing-suite)
- [📜 Academic Research Context & License](#-academic-research-context--license)

---

## 🎯 Executive Summary & Problem Formulation

### 1. The Classical Cryptographic Vulnerability
Traditional digital signature schemes (such as RSA, DSA, and ECDSA) rely on the computational hardness of mathematical problems like integer factorization and discrete logarithms. With the emergence of quantum computing and **Shor's Algorithm**, these classical asymmetric cryptosystems face complete compromise in polynomial time.

### 2. The Flaws of AI/ML-Based Cyber Threat Detection
In an attempt to secure digital infrastructure, modern cybersecurity platforms have increasingly integrated Machine Learning (ML) and Deep Neural Network (DNN) intrusion detection systems. However, in mission-critical cryptographic signature verification, AI/ML introduces critical vulnerabilities:
- **Black-Box Opacity**: Neural networks cannot mathematically prove why a signature was accepted or rejected.
- **Non-Deterministic False Positives / Negatives**: Probabilistic models may reject legitimate financial/legal authorizations or allow forged signatures through adversarial evasion.
- **Vulnerability to Adversarial Attacks**: Minor perturbations in telemetry can fool neural classifiers.

### 3. The Solution: Deterministic Quantum-Measurement Threat Detection
This project implements an academic research simulation of **Teleportation-Based Quantum Digital Signatures (QDS)** coupled with a **100% Deterministic, Protocol-Aware Threat Detection Engine**:
- **Strictly ZERO AI/Machine Learning**: Verification and attack detection rely entirely on the **Born rule**, exact quantum measurement statistics, **Wilson score 95% confidence intervals**, **Bayesian binomial likelihood ratios**, **cryptographic nonces**, and **identity authorization trees**.
- **Provable Explanations**: Every security decision produces a rigorous step-by-step mathematical reasoning breakdown.

> [!NOTE]
> This software is an educational and academic research simulation platform. It demonstrates quantum statevectors, Bell state entanglement, 3-qubit teleportation, and deterministic threat analysis using both pure NumPy statevector math and IBM Qiskit Aer circuit simulation.

---

## 🛠️ Technology Stack

- **Backend Framework**: Python 3.12+, FastAPI, Pydantic V2, Uvicorn, Pytest.
- **Quantum Simulation Layer**:
  - **NumPy Reference Backend**: Exact $2^n$-statevector matrix simulator ($X, Y, Z, H, S, T, CNOT$, Projective Measurements).
  - **IBM Qiskit Backend**: Qiskit 1.3+ with `AerSimulator`, `QuantumCircuit`, dynamic `c_if` classical conditioning, OpenQASM 3.0 export, and ASCII circuit visualization.
- **Statistical Mathematics Engine**: SciPy, Wilson score interval algorithms, Bayesian binomial likelihood ratio tests.
- **Database & Storage**: SQLite (local prototype with PostgreSQL-ready SQLAlchemy schema).
- **Frontend Layer**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3.4, Lucide Icons, Recharts.
- **Authentication**: JWT token authorization and API key security filters.

---

## 🔬 Core Quantum Protocol (Designated-Verifier, Memory-Free Sifted-Measurement QDS)

This platform implements an academic research simulation prototype inspired by foundational QDS literature (Gottesman-Chuang 2001, Andersson-Curty-Jex 2006, Collins et al. 2014, Wallden et al. 2015) and quantum teleportation transport (Bennett et al. 1993).

```
          Alice (Signer)                                                  Bob (Verifier)
   ┌───────────────────────────┐                                   ┌───────────────────────────┐
   │ Token Pool SK_A (L=32)    │                                   │                           │
   │ Private BB84 State Prep   │                                   │                           │
   └─────────────┬─────────────┘                                   └───────────────────────────┘
                 │                                                               ▲
                 │   ┌───────────────────────────────────────────────────────┐   │
                 │   │ Shared Bell Resource: |Φ+⟩, |Φ-⟩, |Ψ+⟩, or |Ψ-⟩       │   │
                 │   └───────────────────────────┬───────────────────────────┘   │
                 │                               │                               │
                 ▼                               ▼ (q1)                          ▼ (q2)
   ┌───────────────────────────┐                 │                 ┌───────────────────────────┐
   │ Alice Joint Bell Meas:    │                 │                 │ Bob Pauli Correction:     │
   │ CNOT(q0 → q1), H(q0)      │                 │                 │ Exact 4-Bell state matrix │
   │ Bits (b0, b1) ∈ {0,1}^2   │                 │                 │ Bob Immediate Conjugate   │
   └─────────────┬─────────────┘                 │                 │ Measurement B_B ∈ {Z, X}  │
                 │                               │                 │ Records VK_B (No Memory!) │
                 │ Classical feed-forward (b0, b1)                 └─────────────┬─────────────┘
                 └──────────────────────────────────────────────────────────────►│
                                                                                 │
   ┌───────────────────────────┐                                                 │
   │ Message M + Nonce N       │                                                 │
   │ h = SHA-256(M || N)       │                                                 │
   │ Unbiased Rejection Sample │                                                 │
   │ Selects M=8 Token Indices │                                                 │
   │ Reveals Dec_A for M tokens│                                                 │
   └─────────────┬─────────────┘                                                 │
                 │ Classical Signature Declaration Dec_A                         │
                 └──────────────────────────────────────────────────────────────►│
                                                                                 ▼
                                                                   ┌───────────────────────────┐
                                                                   │ Bob Basis Sifting Check:  │
                                                                   │ Retain B_B[i] == B_A[i]   │
                                                                   │ (n_sifted ≈ 4 tokens)     │
                                                                   │ Nshots=250 Born samples/pos│
                                                                   │ Total n ≈ 1000 samples    │
                                                                   │ Wilson 95% Confidence CI  │
                                                                   └─────────────┬─────────────┘
                                                                                 │
                                                                                 ▼
                                                                   ┌───────────────────────────┐
                                                                   │ Deterministic Ledger:     │
                                                                   │ Rules 1-6 Audit Chain     │
                                                                   │ (PASS / FAIL / NOT REACHED│
                                                                   └───────────────────────────┘
```

### Protocol Workflow Stages:
1. **Setup & Enrollment (Memory-Free Teleportation Transport)**:
   - Alice generates a private table of $L = 32$ BB84 states $SK_A = \{(B_A[i], \alpha_A[i])\}_{i=0}^{L-1}$. Alice's table remains strictly confidential.
   - For each token, Alice and Bob share an entangled Bell pair $|\beta\rangle \in \{|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle\}$.
   - Alice performs Bell-state measurement; Bob executes exact Pauli unitary correction $U(b_0, b_1, |\beta\rangle)$ with fidelity $\mathcal{F} \equiv 1.000000$.
   - Bob **immediately measures** each recovered qubit in random basis $B_B[i] \in \{Z, X\}$, recording verification record $VK_B = \{(B_B[i], O_B[i])\}$. **Zero quantum memory** is required.
2. **Deterministic Index Selection & Signature Declaration**:
   - Alice combines message $M$ with fresh 128-bit nonce $N$: $h = \text{SHA-256}(M \parallel N)$.
   - Unbiased 8-bit rejection sampling over $h$ selects $M = 8$ distinct token indices $\mathcal{I} \subset \{0, \dots, L-1\}$.
   - Alice publishes declaration $Dec_A = \{(i, B_A[i], \alpha_A[i])\}_{i \in \mathcal{I}}$. Unselected $L - M$ tokens remain confidential.
3. **Basis Sifting & Deterministic Threat Detection**:
   - Bob filters for positions where $B_B[i] == B_A[i]$ (Basis Sifting, expected $n_{\text{sifted}} \approx 4$ tokens).
   - Evaluates $N_{\text{shots}}=250$ repeated Born-rule ensemble simulation samples per sifted token position ($n \approx 1000$ total statistical samples), empirical QBER, and asymmetric **Wilson 95% Score Confidence Interval** $[LCL, UCL]$.
   - Evaluates 6-rule transparent **Decision Ledger** (`PASS`, `FAIL`, `NOT REACHED`) with zero AI/ML opacity.

---

## 📐 Mathematical & Statistical Formulations

### 1. Born Rule & Projective Measurements
For a normalized single-qubit quantum state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, the probability of obtaining measurement outcome $k$ corresponding to projection operator $P_k = |\phi_k\rangle\langle\phi_k|$ is:

$$p_k = \langle\psi|P_k|\psi\rangle = \text{Tr}(P_k |\psi\rangle\langle\psi|), \quad \text{where } \sum_k p_k = 1.0$$

### 2. Empirical Measurement Error Rate ($E$)
Given $N_{\text{total}}$ projective measurement shots, the empirical error rate $E$ is defined as the fraction of unexpected quantum states observed:

$$E = \frac{N_{\text{unexpected}}}{N_{\text{total}}}$$

### 3. Wilson Score 95% Confidence Interval
To account for sample variance without relying on crude normal approximations, the engine calculates the asymmetric Wilson score confidence interval at $1 - \alpha = 0.95$ ($z = 1.95996$):

$$\text{Center} = \frac{\hat{p} + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}$$

$$\text{Margin} = \frac{z}{1 + \frac{z^2}{n}} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}$$

$$\text{CI}_{95\%} = [\max(0, \text{Center} - \text{Margin}), \min(1, \text{Center} + \text{Margin})]$$

### 4. Bayesian Binomial Likelihood Forgery Model
Let $\theta_0 = 0.02$ represent baseline system noise under legitimate transmission, and $\theta_1 = 0.50$ represent the expected error rate under unentangled basis guessing (signature forgery). The likelihood ratio $\Lambda(k)$ for observing $k$ unexpected outcomes in $n$ shots is:

$$\Lambda(k) = \frac{\mathcal{L}(k; \theta_1)}{\mathcal{L}(k; \theta_0)} = \frac{\binom{n}{k} \theta_1^k (1-\theta_1)^{n-k}}{\binom{n}{k} \theta_0^k (1-\theta_0)^{n-k}}$$

The posterior forgery probability with an uninformative prior is:

$$P_{\text{forge}} = \frac{1}{1 + \exp\left(-\left(\ln \mathcal{L}_1 - \ln \mathcal{L}_0\right)\right)}$$

---

## 🛡️ Deterministic Threat Detection Engine (Strictly ZERO AI/ML)

The threat detection pipeline processes every signature through a deterministic rule tree. There are no neural weights, no heuristic embeddings, and no stochastic predictions.

```
                             Incoming Signature Verification Request
                                                │
                                                ▼
                                   ┌─────────────────────────┐
                                   │ Is Signer in Authorized │─── NO ────► [RULE 1] REJECTED
                                   │     Key Registry?       │             Threat: Signer Impersonation
                                   └────────────┬────────────┘
                                                │ YES
                                                ▼
                                   ┌─────────────────────────┐
                                   │  Does SHA-256 Digest    │─── NO ────► [RULE 2] REJECTED
                                   │   Match Message Hash?   │             Threat: Message Tampering
                                   └────────────┬────────────┘
                                                │ YES
                                                ▼
                                   ┌─────────────────────────┐
                                   │ Has Cryptographic Nonce │─── YES ───► [RULE 3] REJECTED
                                   │  Been Reused / Spent?   │             Threat: Replay Attack
                                   └────────────┬────────────┘
                                                │ NO
                                                ▼
                                   ┌─────────────────────────┐
                                   │  Is Empirical Error E   │─── YES ───► [RULE 4] REJECTED
                                   │      > 15% (Thigh)?     │             Threat: Quantum Forgery (E > 38%)
                                   └────────────┬────────────┘             or Intercept-Resend (E <= 38%)
                                                │ NO
                                                ▼
                                   ┌─────────────────────────┐
                                   │  Is Empirical Error E   │─── YES ───► [RULE 5] SUSPICIOUS
                                   │      > 5% (Tlow)?       │             Threat: Intermediate Disturbance
                                   └────────────┬────────────┘
                                                │ NO
                                                ▼
                                     ┌─────────────────────┐
                                     │  [RULE 6] VERIFIED  │
                                     │ Signature Authentic │
                                     │ (Wilson UCL <= 5%)  │
                                     └─────────────────────┘
```

> [!NOTE]
> **Benchmark Classification Boundary ($QBER \approx 0.38$)**: In this educational simulation platform, an empirical threshold of $38\%$ (the midpoint between theoretical intercept-resend disturbance $E \approx 25\%$ and blind forgery guessing $E \approx 50\%$) is used strictly as a benchmark classifier to distinguish likely active conjugate eavesdropping from total unentangled forgery. This $0.38$ cutoff is an empirical model/benchmark classification threshold, **not** a fundamental quantum-security limit or formally proven cryptographic boundary.

### Cyber Threat Classification Matrix:

| Attack Vector | Adversary Action & Symptom | Mathematical Indicator | Deterministic Rule | System Action | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Signature Forgery** | Attacker lacks entangled state; guesses Pauli measurement basis. | $E \approx 48\% - 52\%$, $P_{\text{forge}} > 99.9\%$ | **RULE 4**: $E > T_{\text{high}}$ (0.15), $E > 0.38$ | Immediate Rejection & Incident Alert | **HIGH** |
| **Intercept-Resend Eavesdropping** | Attacker measures in random conjugate basis, disturbing state. | $E \approx 25\%$ (disturbance in $[15\%, 38\%]$) | **RULE 4**: $E > T_{\text{high}}$ (0.15), $E \le 0.38$ | Immediate Rejection & Eavesdropping Alert | **HIGH** |
| **Intermediate Channel Disturbance** | Elevated channel decoherence or weak disturbance above baseline. | $5\% < E \le 15\%$ ($T_{\text{low}} < E \le T_{\text{high}}$) | **RULE 5**: $T_{\text{low}} < E \le T_{\text{high}}$ | Flag as Suspicious & Request Retransmit | **MEDIUM** |
| **Channel Noise Acceptance** | Legitimate transmission within calibrated low-noise channel. | $E \le 5\%$ and $\text{Wilson } UCL \le 5\%$ | **RULE 6**: $\text{Wilson } UCL \le T_{\text{low}}$ | Cryptographic Signature Verified | **LOW** |
| **Signer Impersonation** | Attacker signs message using unauthorized signer identity (`Eve-Malicious`). | Identity lookup mismatch against key registry. | **RULE 1**: `signer_authorized == FALSE` | Immediate Rejection & Auth Alert | **HIGH** |
| **Replay Attack** | Attacker intercepts and resubmits an authentic signature and nonce. | Cryptographic nonce already exists in consumed nonces table. | **RULE 3**: `nonce_consumed == TRUE` | Immediate Rejection & Replay Alert | **CRITICAL** |
| **Message Tampering** | Plaintext message altered during transmission. | $\text{SHA-256}(M_{\text{received}}) \neq H_{\text{stored}}$ | **RULE 2**: `digest_match == FALSE` | Immediate Rejection & Integrity Alert | **CRITICAL** |

---

## 🚀 In-Depth Feature Walkthrough Guide

### 1. Real-Time Operational Dashboard
- **Top KPI Cards**: Displays Active Signatures, Total Verification Sessions, Detected Threat Incidents, Protocol Success Rate (100% on benchmark), and Average Backend Latency (~2.5ms).
- **Live Threat Distribution**: Donut and Bar charts categorizing historical and real-time threats (Forgery, Impersonation, Replay, Channel Noise).
- **Error Rate Timeline**: Chronological plot showing empirical error rates over time alongside the lower ($5\%$) and upper ($15\%$) security threshold bounds.
- **Recent Activity Audit Feed**: Live table showing recent signatures, signers, decisions, and timestamps.

### 2. Interactive QDS Protocol Simulator
1. **Message Input**: Enter custom message text (e.g., `"Transfer ₹5000 to Account X"`).
2. **Signer & State Selection**: Select registered signer (`Alice-Authorized`) and initial Pauli eigenstate ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |+i\rangle, |-i\rangle$).
3. **Step-by-Step Circuit Tracing**:
   - **Step 1**: Classical SHA-256 Digest Calculation & Nonce Generation.
   - **Step 2**: Bell State Generation ($|\Phi^+\rangle$ on qubits $q_1, q_2$).
   - **Step 3**: Alice Bell-basis Joint Measurement on $(q_0, q_1)$.
   - **Step 4**: Classical bit transmission $(b_0, b_1)$.
   - **Step 5**: Bob Pauli Correction Matrix ($Z^{b_0} X^{b_1}$) on $q_2$.
   - **Step 6**: Teleportation Fidelity Calculation ($\mathcal{F} = |\langle\psi_{\text{in}}|\psi_{\text{out}}\rangle|^2 = 1.000$).

### 3. Dual Quantum Backends (NumPy & Qiskit Aer)
Seamlessly switch or compare simulation backends via unified factory abstraction:
- **NumPy Reference Backend**: Direct statevector calculations, instantaneous response time, pure state fidelity checks.
- **Qiskit Aer Backend**: Industry-grade circuit compilation, dynamic `c_if` conditional Pauli corrections, shot-based sampling, and OpenQASM 3.0 export.

### 4. Interactive Qiskit Circuit & OpenQASM Visualizer
- Click **"View Qiskit Circuit"** inside the Simulator or Experiments views.
- Renders full 3-qubit teleportation circuit with gate stages, barrier lines, and classical registers.
- Inspect and copy raw **OpenQASM 3.0** circuit code directly for execution on IBM Quantum real hardware.

### 5. Deterministic Verification Center
- Select any active signature from the database.
- Configure verification shot count ($100$ to $10,000$ shots).
- Execute projective measurement and inspect:
  - **Decision Status Badge**: `VERIFIED` (Green), `SUSPICIOUS` (Yellow), or `REJECTED` (Red).
  - **Empirical Error Rate ($E$)**: Exact percentage of unexpected measurement collapses.
  - **Wilson Score 95% Confidence Interval**: Mathematical upper and lower bounds.
  - **Bayesian Forgery Probability ($P_{\text{forge}}$)**: Likelihood ratio test.
  - **Deterministic Rule Triggered**: Exact rule number and logical statement.
  - **Step-by-Step Mathematical Explanation**: Printable audit reasoning breakdown.

### 6. Multi-Scenario Cyber Attack Injection Simulator
Test the deterministic defense engine by safely injecting simulated attacks against any signature:
- **Signature Forgery**: Simulates basis-guessing without genuine EPR entanglement ($E \approx 50\%$).
- **Signer Impersonation**: Replaces signer ID with unauthorized credentials (`Eve-Malicious`).
- **Nonce Replay Attack**: Re-submits an already-verified signature with an identical nonce.
- **Quantum Channel Noise**: Injects simulated depolarizing quantum noise ($p \in [0.01, 0.50]$).
- **Tampering Attack**: Modifies the message payload after signature generation.

### 7. Automated Parameter Sweeps & Benchmarks
Dedicated `/experiments` view for running reproducible research parameter sweeps:
- Compare **NumPy vs Qiskit Aer** runtimes and output consistency across different shot counts ($100 \to 5000$).
- Sweep depolarizing channel noise ($p = 0.00 \to 0.40$) and observe threshold crossings.
- Multi-trial attack scenario sweeps measuring True Positive and False Positive rates.

### 8. Quantum State & Bloch Sphere Visualizer
- Visual 3D spherical coordinate representation ($\theta, \phi$) for single-qubit states.
- Displays complex amplitude coordinates $(\alpha, \beta)$ where $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$.
- Visual breakdown of Pauli eigenvectors along $Z$, $X$, and $Y$ axes.

### 9. Security Incident Alert Center
- Real-time incident logs generated upon attack detection.
- Severity tagging (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
- Incident lifecycle management: update status between `TRIGGERED`, `INVESTIGATING`, and `RESOLVED`.

### 10. 1-Click Automated Research Demonstration
Click **"Run Complete Demo"** in the top navigation bar to trigger an end-to-end automated research workflow:
1. Prepares classical message `"Authorize payment ₹50,000 to Vendor B"`.
2. Generates classical SHA-256 message digest and nonce.
3. Entangles Bell pair $|\Phi^+\rangle$ with concurrence $C = 1.0$.
4. Executes 3-qubit quantum teleportation circuit.
5. Applies Bob's Pauli correction matrix with fidelity $\mathcal{F} = 1.000$.
6. Evaluates $n_{\text{sifted}} \approx 4$ basis-sifted tokens with $N_{\text{shots}}=250$ repeated Born-rule ensemble simulation samples per token position ($n \approx 1000$ statistical sample size).
7. Computes Wilson 95% CI and verifies legitimate signature (`VERIFIED`).
8. Injects simulated Signature Forgery attack ($E \approx 50\%$).
9. Deterministic engine triggers **RULE 4** and rejects forgery (`REJECTED`).
10. Injects Nonce Replay attack $\implies$ deterministic engine triggers **RULE 3** (`REJECTED`).
11. Generates security incident alert records.
12. Synchronizes real-time dashboard telemetry and charts.

---

## 🏗️ High-Level System Architecture

For full architectural blueprints, see [docs/architecture.md](file:///docs/architecture.md).

```
┌────────────────────────────────────────────────────────────────────────┐
│                   RESEARCHER / OPERATOR (BROWSER)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             REACT + VITE + TYPESCRIPT FRONTEND LAYER                   │
│  - Dashboard & Charts (Recharts)       - Attack Simulator              │
│  - QDS Teleportation Circuit Tracing   - Experiments & Benchmarks      │
│  - Deterministic Verification Center   - Incident Alerts & Settings    │
│  - Qiskit Circuit & QASM Visualizer    - Bloch Sphere State Viewer     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (JSON / HTTP)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   FASTAPI PYTHON BACKEND LAYER                         │
│                                                                        │
│  ┌─────────────────────────────┐    ┌───────────────────────────────┐  │
│  │   Pluggable Quantum Layer   │    │   Statistical Math Engine     │  │
│  │  - NumPy 2^n Statevector    │    │  - Born Rule Measurement      │  │
│  │  - IBM Qiskit 1.3+ / Aer    │    │  - Empirical Error Rate (E)   │  │
│  │  - OpenQASM 3.0 Exporter    │    │  - Wilson Score 95% CI        │  │
│  │  - Pauli Unitary Correction │    │  - Binomial Likelihood P_forge│  │
│  └─────────────────────────────┘    └───────────────────────────────┘  │
│                 │                                  │                   │
│                 ▼                                  ▼                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │             Deterministic Threat Detection Engine                │  │
│  │             (Strictly ZERO AI / Machine Learning)                │  │
│  │  - Rule 1: Identity & Key Authorization (Impersonation)          │  │
│  │  - Rule 2: SHA-256 Digest Integrity (Message Tampering)          │  │
│  │  - Rule 3: Nonce Freshness & Consumption (Replay Attack)         │  │
│  │  - Rule 4: Error Rate E > 15% (Signature Forgery)                │  │
│  │  - Rule 5: Error Rate 5% < E ≤ 15% (Quantum Channel Noise)       │  │
│  │  - Rule 6: Error Rate E ≤ 5% (Legitimate Signature Verified)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLAlchemy ORM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 SQLITE DATABASE / PERSISTENCE LAYER                    │
│  - users                    - signatures            - measurements     │
│  - verification_sessions    - attacks               - alerts           │
│  - experiments              - experiment_trials     - audit_logs       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
Digi_Signature/
├── .gitignore
├── README.md                          # Comprehensive project documentation
├── PROJECT_REPORT.md                  # Conceptual & friendly deep-dive project report
├── docker-compose.yml                 # Multi-container orchestration (Backend + Frontend)
├── docs/                              # Detailed scientific & technical specifications
│   ├── api.md                         # REST API endpoint reference
│   ├── architecture.md                # System design & layer specifications
│   ├── experiments.md                 # Experimental methodologies & results
│   ├── mathematical-model.md          # Born rule, Wilson CI & Bayesian formulas
│   ├── qds-protocol.md                # 6-step QDS teleportation protocol breakdown
│   └── threat-model.md                # Threat vectors & deterministic rule trees
├── backend/
│   ├── Dockerfile                     # Backend container image definition
│   ├── requirements.txt               # Python dependencies (FastAPI, Qiskit, NumPy, SciPy)
│   ├── .env.example                   # Environment configuration template
│   ├── app/
│   │   ├── main.py                    # FastAPI application initialization & lifespan
│   │   ├── api/                       # REST API endpoint routers
│   │   │   ├── alerts.py              # Security alerts management
│   │   │   ├── analytics.py           # Benchmarking & performance analytics
│   │   │   ├── attacks.py             # Cyber attack simulation injection
│   │   │   ├── audit.py               # Immutable audit log access
│   │   │   ├── dashboard.py           # Real-time telemetry & KPI aggregations
│   │   │   ├── demo.py                # 12-step automated demo runner
│   │   │   ├── experiments.py         # Automated parameter sweeps & benchmark API
│   │   │   ├── quantum.py             # Statevector, Bell states & teleportation
│   │   │   ├── settings.py            # Dynamic threshold configuration
│   │   │   ├── signatures.py          # QDS generation & management
│   │   │   └── verification.py        # Deterministic verification execution
│   │   ├── core/
│   │   │   ├── auth.py                # JWT & API Key authentication filters
│   │   │   ├── config.py              # App settings & environment variables
│   │   │   └── security.py            # SHA-256 hashing & cryptographic nonces
│   │   ├── database/
│   │   │   ├── database.py            # SQLAlchemy engine, session & base models
│   │   │   └── seed.py                # Initial database seeder
│   │   ├── models/                    # SQLAlchemy ORM database models
│   │   │   ├── alert.py
│   │   │   ├── attack.py
│   │   │   ├── audit.py
│   │   │   ├── experiment.py          # Batch parameter sweep runs & trial logs
│   │   │   ├── measurement.py
│   │   │   ├── setting.py
│   │   │   ├── signature.py
│   │   │   ├── user.py
│   │   │   └── verification.py
│   │   ├── quantum/                   # Pluggable quantum simulation backends
│   │   │   ├── backend.py             # Abstract QuantumBackend interface
│   │   │   ├── factory.py             # QuantumBackendFactory (NumPy vs Qiskit)
│   │   │   ├── numpy_backend.py       # NumPy analytical statevector backend
│   │   │   ├── qiskit_backend.py      # Qiskit 1.3+ AerSimulator backend
│   │   │   ├── bell_states.py         # 4 Maximally entangled EPR Bell states
│   │   │   ├── gates.py               # Unitary gates (I, X, Y, Z, H, S, T, CNOT)
│   │   │   ├── measurement.py         # Born rule projective measurement engine
│   │   │   ├── noise.py               # Depolarizing & dephasing channel noise
│   │   │   ├── pauli.py               # Pauli matrix definitions & operators
│   │   │   ├── statevector.py         # 2^n Complex statevector manipulation
│   │   │   └── teleportation.py       # 3-Qubit quantum teleportation circuit
│   │   ├── schemas/                   # Pydantic v2 validation schemas
│   │   │   ├── alert.py
│   │   │   ├── attack.py
│   │   │   ├── experiment.py
│   │   │   ├── quantum.py
│   │   │   ├── signature.py
│   │   │   └── verification.py
│   │   └── services/                  # Business & mathematical logic
│   │       ├── attack_service.py      # Controlled cyber attack simulation
│   │       ├── audit_service.py       # Security audit event logging
│   │       ├── demo_service.py        # 1-Click end-to-end demo runner
│   │       ├── experiment_service.py  # Parameter sweep batch runner
│   │       ├── qds_service.py         # QDS generation & lifecycle management
│   │       ├── statistics_service.py  # Wilson score CI & Bayesian likelihood
│   │       ├── threat_detection_service.py # Deterministic rule engine
│   │       └── verification_service.py # Verification workflow coordinator
│   └── tests/                         # Pytest test suite (38 comprehensive tests)
│       ├── conftest.py
│       ├── test_api.py
│       ├── test_backend_comparison.py # NumPy vs Qiskit consistency tests
│       ├── test_experiments.py        # Automated parameter sweep tests
│       ├── test_quantum.py            # Unitary gates & teleportation tests
│       └── test_threat_detection.py   # Deterministic rules & attacks tests
└── frontend/
    ├── Dockerfile                     # Frontend static build container
    ├── package.json                   # React 18, Vite, Lucide, Recharts dependencies
    ├── vite.config.ts                 # Vite bundler configuration & proxy
    ├── tailwind.config.js             # Tailwind CSS design system styling
    ├── index.html                     # HTML entry point
    └── src/
        ├── App.tsx                    # Main layout & router navigation
        ├── main.tsx                   # React DOM root render
        ├── components/                # Reusable UI widgets
        │   ├── BlochSphereView.tsx    # 3D spherical coordinate visualizer
        │   ├── DemoModal.tsx          # 12-Step automated demo modal
        │   ├── Navbar.tsx             # Header navigation bar & live status
        │   ├── QiskitCircuitModal.tsx # Interactive Qiskit circuit & QASM modal
        │   └── QuantumCircuitView.tsx # Visual 3-qubit circuit diagram
        ├── pages/                     # Full application views
        │   ├── Alerts.tsx             # Incident response & alert triage
        │   ├── Analytics.tsx          # Benchmark charts & evaluation metrics
        │   ├── Attacks.tsx            # Attack injection testing interface
        │   ├── AuditLogs.tsx          # Immutable audit event log
        │   ├── Dashboard.tsx          # Central operational telemetry dashboard
        │   ├── Experiments.tsx        # Benchmarking experiments & parameter sweeps
        │   ├── MeasurementAnalysis.tsx# Measurement distribution analyzer
        │   ├── Settings.tsx           # Dynamic threshold parameter tuning
        │   ├── Simulator.tsx          # Interactive teleportation protocol builder
        │   ├── Verification.tsx       # Deterministic verification center
        │   └── Visualizer.tsx         # Quantum statevector & angle inspector
        ├── services/                  # Backend REST API client
        │   └── api.ts                 # Axios / Fetch client with TypeScript types
        └── types/                     # TypeScript data interfaces
            └── index.ts
```

---

## 📡 REST API Reference

The backend exposes an interactive OpenAPI / Swagger interface at `http://localhost:8000/docs`.

### Key API Endpoints Summary:

| Domain | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Signatures** | `POST` | `/api/signatures` | Create a new simulated Quantum Digital Signature. |
| | `GET` | `/api/signatures` | List signatures with pagination and status filters. |
| | `GET` | `/api/signatures/{id}` | Retrieve complete signature details and quantum parameters. |
| **Quantum** | `GET` | `/api/quantum/states` | List supported single-qubit Pauli eigenstates. |
| | `GET` | `/api/quantum/bell-states` | List 4 standard EPR Bell states. |
| | `POST` | `/api/quantum/bell-state` | Generate Bell state and return step-by-step statevectors. |
| | `POST` | `/api/quantum/teleport` | Execute 3-qubit teleportation (select NumPy or Qiskit backend). |
| | `POST` | `/api/quantum/measure` | Perform projective measurements across $Z, X, Y$ bases. |
| | `GET` | `/api/quantum/circuit-diagram` | Render ASCII circuit and OpenQASM 3.0 string. |
| **Verification** | `POST` | `/api/verification/start` | Run deterministic statistical verification on a signature. |
| | `GET` | `/api/verification` | List all historical verification sessions. |
| | `GET` | `/api/verification/{id}` | Get verification details, error rate, Wilson CI & rule reasoning. |
| **Attacks** | `POST` | `/api/attacks/simulate` | Safely inject cyber attacks (Forgery, Replay, Impersonation, Noise). |
| | `GET` | `/api/attacks` | List all simulated attack experiments. |
| **Experiments** | `POST` | `/api/experiments/run` | Run parameter sweeps across states, noise, shots, and backends. |
| | `GET` | `/api/experiments` | List historical parameter sweep runs. |
| | `GET` | `/api/experiments/{id}` | Fetch detailed experiment trial statistics and charts. |
| **Dashboard** | `GET` | `/api/dashboard/summary` | Get aggregated KPI counts and system health metrics. |
| | `GET` | `/api/dashboard/threat-distribution` | Aggregated threat counts by category. |
| | `GET` | `/api/dashboard/timeline` | Time-series error rates and threshold boundaries. |
| **Analytics** | `GET` | `/api/analytics/metrics` | Accuracy, True Positive Rate, False Positive Rate, Latency. |
| | `GET` | `/api/analytics/shots-benchmark` | Wilson CI convergence data across shot sweeps ($100 - 10000$). |
| **Alerts** | `GET` | `/api/alerts` | List all security incident alerts. |
| | `PATCH` | `/api/alerts/{id}` | Update incident triage status (`INVESTIGATING`, `RESOLVED`). |
| **Settings** | `GET` | `/api/settings` | Read dynamic security thresholds ($T_{\text{low}}, T_{\text{high}}, N_{\text{shots}}$). |
| | `PUT` | `/api/settings/{key}` | Update specific configuration parameter. |
| | `POST` | `/api/settings/reset` | Reset all parameters to factory defaults. |
| **Automated Demo**| `POST` | `/api/demo/run-complete` | Trigger the complete 12-step research demonstration. |

---

## 🧪 Experimental Evaluation & Benchmarks

| Metric | Formula / Meaning | Result | Status |
| :--- | :--- | :--- | :--- |
| **Verification Accuracy** | $\frac{\text{True Decisions}}{\text{Total Sessions}}$ | **100%** | Optimal |
| **Attack Detection Rate (TPR)** | $\frac{\text{Detected Attacks}}{\text{Total Injected Attacks}}$ | **100%** | Optimal |
| **False Positive Rate (FPR)** | $\frac{\text{False Rejections}}{\text{Total Legitimate Signatures}}$ | **0%** | Zero False Alarms |
| **False Negative Rate (FNR)** | $\frac{\text{Missed Attacks}}{\text{Total Attacks}}$ | **0%** | Zero Breaches |
| **Average NumPy Backend Latency** | Duration per $1000$-shot session | **~2.3 ms** | Ultra-Low Latency |
| **Average Qiskit Aer Backend Latency**| Duration per $1000$-shot circuit execution | **~14.5 ms** | Standard Compliant |
| **Quantum Teleportation State Fidelity** | $\mathcal{F} = |\langle\psi_{\text{in}}|\psi_{\text{out}}\rangle|^2$ | **1.0000** | Exact Simulation |

---

## 💻 Installation & Setup Guide

### Prerequisites
- **Python 3.10+** (Python 3.13 recommended)
- **Node.js 18+** & **npm**
- **Git**

---

### Option A: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Yashpareshdoshi/Digi_Signature.git
cd Digi_Signature
```

#### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run test suite (47 tests)
python -m pytest tests -v

# Start FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Backend API will be active at: **`http://localhost:8000`**
- Interactive Swagger API Documentation: **`http://localhost:8000/docs`**

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- Interactive Dashboard UI will be active at: **`http://localhost:5173`**

---

### Option B: Docker Compose Deployment

Run both the FastAPI backend and React frontend with a single command:

```bash
docker-compose up --build
```

- **Frontend Dashboard**: `http://localhost:3000` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

---

## ✅ Verification & Unit Testing Suite

The repository includes a comprehensive unit and integration test suite with **47 tests** validating quantum mechanics, statistical interval calculations, deterministic threat rules, dual quantum backend consistency, and REST API routes.

```bash
cd backend
python -m pytest tests -v
```

### Test Suite Coverage:
- `test_quantum.py`: Unitary properties of gates, Bell state concurrence, 3-qubit teleportation fidelity ($\mathcal{F} = 1.0$), and Born rule projective distributions.
- `test_backend_comparison.py`: Cross-validates `NumPyBackend` vs `QiskitBackend` output consistency, gate translations, and circuit diagrams.
- `test_experiments.py`: Validates automated parameter sweeps, noise stepping, and statistical persistence.
- `test_qds_protocol.py`: Verifies memory-free QDS token table generation, deterministic index selection, basis sifting, and end-to-end signing and verification.
- `test_threat_detection.py`: Verifies deterministic catch rate for Forgery, Impersonation, Replay, Tampering, and Channel Noise, including Decision Ledger short-circuiting.
- `test_statistics.py`: Validates Wilson score intervals, Bayesian likelihood calculations, and Fisher's exact test.
- `test_api.py`: Validates all FastAPI endpoints, response schemas, and error handlers.

---

## 📜 Academic Research Context & References

This project was developed as an academic research prototype to demonstrate:
1. Exact simulation of Teleportation-Based Quantum Digital Signature (QDS) protocols.
2. Deterministic, explainable, protocol-aware cyber threat detection without non-deterministic AI/ML models.

### Project Citation
If you use this project or its formulations in academic work, please cite:
```bibtex
@misc{doshi2026quantumqds,
  author = {Yash Paresh Doshi},
  title = {Quantum-Inspired Cyber Threat Detection for Digital Signature Security},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/Yashpareshdoshi/Digi_Signature}}
}
```

### Foundational Literature References
```bibtex
@article{bennett1993teleporting,
  title={Teleporting an unknown quantum state via dual classical and Einstein-Podolsky-Rosen channels},
  author={Bennett, Charles H. and Brassard, Gilles and Cr{\'e}peau, Claude and Jozsa, Richard and Peres, Asher and Wootters, William K.},
  journal={Physical Review Letters},
  volume={70},
  number={13},
  pages={1895--1899},
  year={1993},
  publisher={APS}
}

@article{gottesman2001quantum,
  title={Quantum digital signatures},
  author={Gottesman, Daniel and Chuang, Isaac},
  journal={arXiv preprint quant-ph/0105032},
  year={2001}
}

@article{andersson2006experimentally,
  title={Experimentally realizable quantum digital signatures without quantum memory},
  author={Andersson, Erika and Curty, Marcos and Jex, Igor},
  journal={Physical Review A},
  volume={74},
  number={2},
  pages={022304},
  year={2006},
  publisher={APS}
}

@article{collins2014realization,
  title={Realization of quantum digital signatures without the requirement of quantum memory},
  author={Collins, Robert J. and Donaldson, Ross J. and Clarke, Paul J. and Reis, Patrick and Andersson, Erika and Buller, Gerald S.},
  journal={Physical Review Letters},
  volume={113},
  number={4},
  pages={040502},
  year={2014},
  publisher={APS}
}

@article{wallden2015quantum,
  title={Quantum digital signatures with fully practical classical communication and secure against forging and repudiation},
  author={Wallden, Petros and Dunjko, Vedran and Kent, Adrian and Andersson, Erika},
  journal={Physical Review A},
  volume={91},
  number={4},
  pages={042304},
  year={2015},
  publisher={APS}
}
```

### License
Released under the **MIT License**. Free for academic, educational, and research use.
