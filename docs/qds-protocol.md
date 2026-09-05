# Designated-Verifier, Memory-Free Sifted-Measurement QDS Protocol with Bell Teleportation Transport

## 1. Literature Lineage & Architectural Context

This implementation provides an academic and hackathon demonstration simulation prototype of a **Designated-Verifier, Memory-Free Sifted-Measurement Quantum Digital Signature (QDS) protocol with Bell-State Teleportation Transport**.

### Academic Lineage:
1. **Foundational QDS Framework**:
   - *Gottesman & Chuang (2001)*: First quantum digital signature concept requiring quantum one-way functions, quantum memory, and swap-test comparisons.
2. **QDS Protocol Simplification**:
   - *Andersson, Curty, & Jex (2006)*: Introduced QDS schemes utilizing coherent states and phase-encoded quantum states with multiport beam-splitters.
3. **Memory-Free Sifted Verification**:
   - *Collins et al. (2014)* and *Wallden et al. (2015)*: Eliminated long-term quantum memory requirements by having verifiers measure incoming quantum states immediately upon receipt in random conjugate bases, storing only classical measurement records ($VK_B$).
4. **Teleportation-Based Quantum Transport**:
   - *Bennett, Brassard, Crépeau, Jozsa, Peres, & Wootters (1993)*: 3-qubit quantum teleportation transport utilizing shared Bell entanglement, Bell-state projective measurement, classical feed-forward, and exact Pauli unitary recovery.

> [!NOTE]
> **Scientific Prototype Scope**: This software is an educational and hackathon simulation prototype designed to model quantum mechanical principles and deterministic protocol-aware threat detection. It does **not** claim to provide an unconditional or formally security-proven cryptosystem, universal 100% detection, or execution on physical cryo-hardware.

---

## 2. Protocol Specification

### Phase 1: Setup & Enrollment (Memory-Free Quantum Transport)
1. **Token Pool Generation**: Alice generates a private table of $L = 32$ BB84 states:
   $$SK_A = \{(B_A[i], \alpha_A[i])\}_{i=0}^{L-1}$$
   where $B_A[i] \in \{Z, X\}$ and $\alpha_A[i] \in \{0, 1\}$.
   Associated Pauli eigenstates:
   $$\{|0\rangle, |1\rangle, |+\rangle, |-\rangle\}$$
   *Alice's unrevealed preparation table remains strictly confidential.*
2. **Teleportation Transport**: For each token $i \in \{0, \dots, L-1\}$:
   - Alice and Bob share an entangled Bell pair $|\beta\rangle \in \{|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle\}$.
   - Alice performs a joint Bell-state measurement on her token qubit $q_0$ and EPR qubit $q_1$, obtaining classical bits $(b_0, b_1) \in \{00, 01, 10, 11\}$.
   - Alice transmits $(b_0, b_1)$ to Bob over a classical channel.
   - Bob applies the exact unitary Pauli correction $U(b_0, b_1, |\beta\rangle)$ to recover the original quantum state with theoretical fidelity $\mathcal{F} = 1.000000$.
3. **Immediate Measurement Enrollment ($VK_B$)**:
   - Bob immediately measures the recovered qubit in a randomly chosen basis $B_B[i] \in \{Z, X\}$, obtaining binary outcome $O_B[i] \in \{0, 1\}$.
   - Bob records classical verification key $VK_B = \{(B_B[i], O_B[i])\}_{i=0}^{L-1}$.
   - **Zero Quantum Memory**: The quantum states are consumed immediately; only classical bitstrings are retained.

---

### Phase 2: Message Signing & Token Selection
1. **Classical Message Digest & Nonce**:
   - Alice prepares message $M$ and generates a fresh 128-bit cryptographic nonce $N$.
   - Computes classical digest $h = \text{SHA-256}(M \parallel N)$.
2. **Deterministic Unbiased Index Selection**:
   - Alice maps $h$ into $M = 8$ distinct token indices $\mathcal{I} = \{i_1, \dots, i_M\} \subset \{0, \dots, L-1\}$ using unbiased 8-bit rejection sampling over the SHA-256 digest bytes.
3. **Classical Declaration ($Dec_A$)**:
   - Alice reveals classical preparation parameters **only** for the $M=8$ selected indices:
     $$Dec_A = \{(i, B_A[i], \alpha_A[i])\}_{i \in \mathcal{I}}$$
   - The remaining $L - M = 24$ tokens remain secret for future signatures or are safely discarded.

---

### Phase 3: Verification & Basis Sifting
1. **Basis Sifting**:
   - Bob inspects indices $i \in \mathcal{I}$. For each index, Bob compares his measurement basis $B_B[i]$ against Alice's declared basis $B_A[i]$.
   - If $B_B[i] == B_A[i]$ (Basis Match), the token is **sifted** and retained (expected sifting rate $\approx 50\%$).
   - If $B_B[i] \neq B_A[i]$ (Conjugate Basis), the token is **discarded** by sifting.
2. **Statistical Sifted Error Evaluation**:
   - For all sifted positions $i \in \mathcal{I}_{\text{sifted}}$, Bob checks whether his recorded outcome $O_B[i]$ agrees with Alice's declared bit $\alpha_A[i]$.
   - In simulation, physical projection variance and channel noise are evaluated using an ensemble of $N_{\text{shots}} = 250$ independent trials per sifted position (yielding total sample size $n \approx 1000$).
   - Computes empirical Quantum Bit Error Rate (QBER):
     $$E = \frac{N_{\text{unexpected}}}{N_{\text{total}}}$$
   - Calculates the exact **Wilson Score 95% Confidence Interval** $[LCL, UCL]$.

---

### Phase 4: Deterministic Threat Detection & Decision Ledger
The verification engine evaluates a strict, 6-rule deterministic decision ledger:
- **Rule 1 (Identity & Authorization Check)**: Claimed signer matches registered credentials.
- **Rule 2 (Message Integrity)**: $h == \text{SHA-256}(M \parallel N)$. Detects classical tampering.
- **Rule 3 (Nonce Freshness)**: Nonce $N$ has not been previously consumed. Detects replay attacks.
- **Rule 4 (Quantum Verification & Abort Boundary)**: Fails if $LCL > T_{\text{high}} = 0.15$ or $QBER > 0.15$. Detects active eavesdropping disturbance ($\approx 25\%$ QBER, benchmark boundary $\le 0.38$) and unentangled quantum state forgery ($\approx 50\%$ QBER, benchmark boundary $> 0.38$). Halts evaluation; Rules 5 and 6 are strictly `NOT REACHED`.
- **Rule 5 (Intermediate Disturbance Boundary)**: Evaluated only if Rule 4 passes. Fails if $LCL > T_{\text{low}} = 0.05$ or $QBER > 0.05$. Detects intermediate disturbance ($5\% < E \le 15\%$). Halts evaluation; Rule 6 is strictly `NOT REACHED`.
- **Rule 6 (Channel Noise Acceptance)**: Evaluated only if Rules 1–5 pass. Passes if $UCL \le T_{\text{low}} = 0.05$. Confirms legitimate low-noise transmission.
