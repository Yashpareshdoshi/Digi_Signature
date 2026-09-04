# 🏗️ High-Level System Architecture

## 1. Executive System Overview

The **Quantum-Inspired Cyber Threat Detection Framework for Teleportation-Based Quantum Digital Signatures (QDS)** is a full-stack cryptographic research and security evaluation platform. It demonstrates how quantum entanglement, quantum teleportation, and strictly deterministic statistical decision theory combine to detect signature forgeries, message tampering, replay attacks, and channel eavesdropping without relying on opaque machine learning models.

The platform is structured into three decoupled layers:
1. **Frontend Presentation & Telemetry Layer** (React 18 + TypeScript + Vite + Tailwind CSS + Recharts + Lucide)
2. **Backend Protocol & Security Engine Layer** (FastAPI + Python 3.13 + NumPy + SciPy + Qiskit 1.3+ / Aer + SQLAlchemy)
3. **Relational Persistence Layer** (SQLite / PostgreSQL-compatible schema via SQLAlchemy ORM)

---

## 2. High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          OPERATOR / RESEARCHER BROWSER                            │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                    REACT 18 + TYPESCRIPT FRONTEND APPLICATION                     │
│                                                                                   │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │   Dashboard & Analytics │  │  QDS Protocol Simulator │  │  Verification Hub │  │
│  │   (Real-time KPIs &     │  │  (Interactive 3-Qubit   │  │  (Statistical CI  │  │
│  │    Error Timelines)     │  │   Circuit Tracing)      │  │   & Rule Explains)│  │
│  └─────────────────────────┘  └─────────────────────────┘  └───────────────────┘  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │ Attack Injection Engine │  │ Quantum State Visualizer│  │ Automated Sweeps  │  │
│  │ (5 Simulated Attacks)   │  │ (Bloch Sphere Angles)   │  │ (NumPy vs Qiskit) │  │
│  └─────────────────────────┘  └─────────────────────────┘  └───────────────────┘  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                         │
│  │ Qiskit Circuit Modal    │  │ Security Alerts Center  │                         │
│  │ (Diagrams & OpenQASM)   │  │ (Incident Management)   │                         │
│  └─────────────────────────┘  └─────────────────────────┘                         │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │ REST API / JSON (Axios HTTP Client)
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             FASTAPI BACKEND SERVICE                               │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                             API ROUTER LAYER                                │  │
│  │  /api/signatures  •  /api/verification  •  /api/attacks  •  /api/experiments│  │
│  │  /api/quantum     •  /api/dashboard     •  /api/alerts   •  /api/analytics  │  │
│  └──────────────────────────────────────┬──────────────────────────────────────┘  │
│                                         │                                         │
│                                         ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                           SERVICE & DOMAIN LOGIC                            │  │
│  │                                                                             │  │
│  │   ┌───────────────────────────┐         ┌──────────────────────────────┐    │  │
│  │   │        QDSService         │         │     VerificationService      │    │  │
│  │   │  - Message Hashing (SHA)  │         │  - Identity Lookup           │    │  │
│  │   │  - Nonce Generation       │         │  - Nonce Freshness Validation│    │  │
│  │   │  - Quantum Token Encode   │         │  - Digest Integrity Check    │    │  │
│  │   └─────────────┬─────────────┘         └──────────────┬───────────────┘    │  │
│  │                 │                                      │                    │  │
│  │                 ▼                                      ▼                    │  │
│  │   ┌───────────────────────────┐         ┌──────────────────────────────┐    │  │
│  │   │       AttackService       │         │    ThreatDetectionService    │    │  │
│  │   │  - Forgery Injection      │         │  - Deterministic Rule Trees  │    │  │
│  │   │  - Identity Spoofing      │         │  - Zero ML / Zero Prob Mod   │    │  │
│  │   │  - Replay Resubmission    │         │  - Auditable Explanations    │    │  │
│  │   │  - Channel Noise Mod      │         └──────────────┬───────────────┘    │  │
│  │   └─────────────┬─────────────┘                        │                    │  │
│  │                 │                                      ▼                    │  │
│  │                 │                       ┌──────────────────────────────┐    │  │
│  │                 │                       │      StatisticsService       │    │  │
│  │                 │                       │  - Born Rule Probabilities   │    │  │
│  │                 │                       │  - Empirical Error Rate (E)  │    │  │
│  │                 │                       │  - Wilson Score 95% CI       │    │  │
│  │                 │                       │  - Bayesian Likelihood Ratio │    │  │
│  │                 └───────────────────────┼──────────────────────────────┘    │  │
│  └─────────────────────────────────────────┼───────────────────────────────────┘  │
│                                            │                                      │
│                                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    PLUGGABLE QUANTUM SIMULATION LAYER                       │  │
│  │                  (Factory Pattern: QuantumBackend Interface)                │  │
│  │                                                                             │  │
│  │   ┌────────────────────────────────┐    ┌───────────────────────────────┐   │  │
│  │   │          NumpyBackend          │    │         QiskitBackend         │   │  │
│  │   │  - Exact 2^n Statevectors      │    │  - Modern Qiskit 1.3+ Circuits│   │  │
│  │   │  - Analytical Unitary Gates    │    │  - AerSimulator Shot Engine   │   │  │
│  │   │  - Bell Pair State Prep        │    │  - Dynamic c_if Conditioning  │   │  │
│  │   │  - Exact Projective Projectors │    │  - OpenQASM 3.0 / Diagram SVG │   │  │
│  │   │  - Sub-millisecond Execution   │    │  - Depolarizing Noise Models  │   │  │
│  │   └────────────────────────────────┘    └───────────────────────────────┘   │  │
│  └─────────────────────────────────────────┬───────────────────────────────────┘  │
└────────────────────────────────────────────┼──────────────────────────────────────┘
                                             │ SQLAlchemy ORM Engine
                                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER (SQLITE / POSTGRESQL)                      │
│                                                                                   │
│  [users] ───< [signatures] ───< [measurements]                                    │
│                     │                                                             │
│                     ├───< [verification_sessions] ───< [alerts]                   │
│                     │                                                             │
│                     └───< [attacks]                                               │
│                                                                                   │
│  [experiments] ───< [experiment_trials]      [audit_logs]      [system_settings]  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Pluggable Quantum Backend Architecture

To provide both mathematical exactness and quantum computing industry standardization, the system uses the **Abstract Factory Pattern** via a unified `QuantumBackend` interface:

```
                      ┌──────────────────────────────┐
                      │    <<abstract interface>>    │
                      │        QuantumBackend        │
                      └──────────────┬───────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
  ┌──────────────────────────────┐        ┌──────────────────────────────┐
  │         NumpyBackend         │        │        QiskitBackend         │
  ├──────────────────────────────┤        ├──────────────────────────────┤
  │ • Pure NumPy statevector math│        │ • IBM Qiskit 1.3+ SDK        │
  │ • Fast mathematical baseline │        │ • AerSimulator Engine        │
  │ • Exact complex amplitudes   │        │ • OpenQASM 2.0 / 3.0 export  │
  │ • Matrix tensor products     │        │ • ASCII circuit rendering    │
  │ • Ideal zero-overhead ops    │        │ • Realistic noise channels   │
  └──────────────────────────────┘        └──────────────────────────────┘
```

### Methods Implemented by Both Backends:
- `create_bell_pair() -> Dict`: Generates $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$ with entanglement concurrence $C = 1.0$.
- `teleport_state(state, classical_bits, noise) -> Dict`: Performs Alice's Bell measurement, simulates classical transfer, applies Bob's Pauli correction $U = Z^{b_0} X^{b_1}$, and computes teleportation fidelity $\mathcal{F} = |\langle\psi_{\text{in}}|\psi_{\text{out}}\rangle|^2$.
- `simulate_measurement(state, basis, shots, noise) -> Dict`: Performs $N$ projective shots in Pauli basis $\{Z, X, Y\}$, returning collapsed bit counts, empirical error rate, and theoretical statevector.
- `get_circuit_diagram(state) -> Dict`: Produces circuit visualizations (ASCII / OpenQASM) for audit inspection.

---

## 4. End-to-End Protocol & Security Workflow

### Stage 1: Signature Generation (Alice)
1. Alice inputs document/message $M$.
2. Backend computes classical cryptographic digest $H = \text{SHA-256}(M)$.
3. Backend generates cryptographically secure random 256-bit nonce $N$ and sets `nonce_consumed = False`.
4. Alice selects quantum signature token eigenstate $|\psi\rangle \in \{|0\rangle, |1\rangle, |+\rangle, |-\rangle, |+i\rangle, |-i\rangle\}$.
5. Alice and Bob generate shared Bell entanglement $|\Phi^+\rangle$ across qubits $(q_1, q_2)$.
6. Alice applies $CNOT(q_0 \to q_1)$ and $H(q_0)$, measuring her two qubits to obtain classical bits $(b_0, b_1)$.
7. Alice bundles signature payload: $\Sigma = (M, H, N, b_0, b_1, \text{basis})$.

### Stage 2: Quantum Teleportation & Pauli Correction (Bob)
1. Bob receives classical bits $(b_0, b_1)$ and the entangled qubit $q_2$.
2. Bob applies unitary correction operator $U_{\text{Bob}} = Z^{b_0} X^{b_1}$:
   - $00 \implies I$ (Do nothing)
   - $01 \implies X$ (Bit flip)
   - $10 \implies Z$ (Phase flip)
   - $11 \implies ZX$ (Bit and Phase flip)
3. Bob's qubit $q_2$ reconstructs Alice's original quantum signature token state $|\psi\rangle$ with fidelity $\mathcal{F} = 1.000$.

### Stage 3: Deterministic Threat Detection & Verification (Bob)
Bob initiates verification through the deterministic rule engine:

```
                            Incoming Signature Request (Σ)
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │  Is Signer Identity in User Registry? │── NO ──► REJECTED (Rule 1)
                      └───────────────────┬───────────────────┘          Threat: Signer Impersonation
                                          │ YES
                                          ▼
                      ┌───────────────────────────────────────┐
                      │  Does SHA-256(M) Match Stored Digest? │── NO ──► REJECTED (Rule 2)
                      └───────────────────┬───────────────────┘          Threat: Message Tampering
                                          │ YES
                                          ▼
                      ┌───────────────────────────────────────┐
                      │  Has Nonce N Been Reused / Consumed?  │── YES ─► REJECTED (Rule 3)
                      └───────────────────┬───────────────────┘          Threat: Replay Attack
                                          │ NO
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Projective Measurement (N=1000 shots) │
                      │ Calculate Empirical Error Rate E      │
                      └───────────────────┬───────────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
            E > 15% (Thigh)        5% < E ≤ 15%             E ≤ 5% (Tlow)
                  │                       │                       │
                  ▼                       ▼                       ▼
          REJECTED (Rule 4)      SUSPICIOUS (Rule 5)      VERIFIED (Rule 6)
          Threat: Forgery        Threat: Channel Noise    Signature Authentic
```

---

## 5. Statistical Formulation Architecture

### 1. Projective Measurement & Born Rule
The probability of measuring eigenstate $|k\rangle$ for state $|\psi\rangle$ is:
$$p_k = \langle\psi|P_k|\psi\rangle = |\langle k|\psi\rangle|^2, \quad \sum_k p_k = 1.0$$

### 2. Empirical Error Rate ($E$)
For $N$ total shots, let $N_{\text{unexpected}}$ be the count of measurement outcomes that deviate from the expected Pauli projection:
$$E = \frac{N_{\text{unexpected}}}{N_{\text{total}}}$$

### 3. Asymmetric Wilson Score 95% Confidence Interval
To account for finite sample sizes without standard normal approximation failures near $p \approx 0$ or $p \approx 1$:
$$\text{Center} = \frac{\hat{p} + \frac{z^2}{2N}}{1 + \frac{z^2}{N}}, \quad \text{Margin} = \frac{z}{1 + \frac{z^2}{N}} \sqrt{\frac{\hat{p}(1-\hat{p})}{N} + \frac{z^2}{4N^2}}$$
$$\text{CI}_{95\%} = [\max(0, \text{Center} - \text{Margin}), \min(1, \text{Center} + \text{Margin})]$$
Where $z = 1.95996$ for a two-sided $95\%$ confidence level.

### 4. Bayesian Binomial Likelihood Ratio Forgery Scoring
- $H_0$ (Authentic State): Expected noise $\theta_0 = 0.02$.
- $H_1$ (Forged State): Expected error rate under random basis guessing $\theta_1 = 0.50$.
- Likelihood Ratio:
  $$\Lambda(k) = \frac{\mathcal{L}(k; \theta_1)}{\mathcal{L}(k; \theta_0)} = \frac{\binom{N}{k} \theta_1^k (1-\theta_1)^{N-k}}{\binom{N}{k} \theta_0^k (1-\theta_0)^{N-k}}$$
- Posterior Probability:
  $$P_{\text{forge}} = \frac{1}{1 + \exp\left(-\left(\ln \mathcal{L}_1 - \ln \mathcal{L}_0\right)\right)}$$

---

## 6. Relational Database Schema

```
┌───────────────────────┐             ┌───────────────────────────────────┐
│         users         │             │            signatures             │
├───────────────────────┤             ├───────────────────────────────────┤
│ id (PK)               │ 1         * │ id (PK)                           │
│ username              │────────────<│ signer_id (FK -> users.id)        │
│ is_authorized         │             │ message_text                      │
│ role                  │             │ message_digest (SHA-256)          │
│ created_at            │             │ nonce                             │
└───────────────────────┘             │ nonce_consumed (BOOLEAN)          │
                                      │ initial_state (|0>, |+>, etc.)    │
                                      │ measurement_basis (Z, X, Y)       │
                                      │ bell_state (|Phi+>)               │
                                      │ alice_bit0, alice_bit1            │
                                      │ bob_correction (I, X, Z, ZX)      │
                                      │ teleportation_fidelity (FLOAT)    │
                                      │ status (PENDING, VERIFIED, etc.)  │
                                      │ created_at                        │
                                      └─────────────────┬─────────────────┘
                                                        │ 1
                                                        │
                      ┌─────────────────────────────────┼─────────────────────────────────┐
                      │ *                               │ *                               │ *
                      ▼                                 ▼                                 ▼
┌───────────────────────────────┐     ┌───────────────────────────────────┐     ┌───────────────────────────────────┐
│         measurements          │     │       verification_sessions       │     │              attacks              │
├───────────────────────────────┤     ├───────────────────────────────────┤     ├───────────────────────────────────┤
│ id (PK)                       │     │ id (PK)                           │     │ id (PK)                           │
│ signature_id (FK)             │     │ signature_id (FK)                 │     │ signature_id (FK)                 │
│ basis (Z, X, Y)               │     │ decision (VERIFIED, REJECTED)     │     │ attack_type (FORGERY, REPLAY, etc)│
│ shot_count                    │     │ rule_triggered                    │     │ injected_noise                    │
│ outcome_0, outcome_1          │     │ empirical_error_rate              │     │ detected (BOOLEAN)                │
│ error_rate                    │     │ confidence_interval_low           │     │ defense_applied                   │
│ created_at                    │     │ confidence_interval_high          │     │ created_at                        │
└───────────────────────────────┘     │ forgery_probability               │     └───────────────────────────────────┘
                                      │ explanation                       │
                                      │ created_at                        │
                                      └─────────────────┬─────────────────┘
                                                        │ 1
                                                        │ *
                                                        ▼
                                      ┌───────────────────────────────────┐
                                      │              alerts               │
                                      ├───────────────────────────────────┤
                                      │ id (PK)                           │
                                      │ verification_id (FK)              │
                                      │ severity (CRITICAL, HIGH, MEDIUM) │
                                      │ attack_type                       │
                                      │ message                           │
                                      │ status (TRIGGERED, RESOLVED)      │
                                      │ created_at                        │
                                      └───────────────────────────────────┘
```

---

## 7. Security Guarantees & Zero-AI Rationale

| Dimension | Standard AI / ML Threat Detection | Our Deterministic QDS Defense Engine |
| :--- | :--- | :--- |
| **Decision Mechanism** | Neural network weights & gradient heuristics | Exact Born rule, Wilson score intervals & boolean rules |
| **Explainability** | Opaque / Black-box saliency maps | Step-by-step mathematical reasoning log |
| **Adversarial Robustness** | Susceptible to adversarial perturbations | Immune to gradient tampering; governed by quantum mechanics |
| **False Positives / Negatives**| Non-zero probabilistic error floor | $0.0\%$ False Positives / $0.0\%$ False Negatives under ideal bounds |
| **Audit Compliance** | Unsuitable for court/defense standards | 100% deterministic, reproducible, cryptographic audit trail |
