# Teleportation-Based Quantum Digital Signature (QDS) Protocol

## 1. Protocol Concept

Quantum Digital Signatures (QDS) provide message authentication, integrity, and non-repudiation rooted in quantum mechanical principles. In this teleportation-based implementation, the signature generation and verification phases leverage shared quantum entanglement and classical communication.

---

## 2. Step-by-Step Workflow

### Step 1: Classical Message Integrity Hashing
- Alice prepares classical message $M$ (e.g., `"Transfer ₹5000 to Account X"`).
- Computes classical digest $H = \text{SHA-256}(M)$ and creates a unique cryptographic nonce $N$.
- *Important*: $H$ verifies classical message integrity, whereas quantum state correlations verify the authenticity of the signature.

### Step 2: Quantum State Preparation
- Alice prepares her message qubit $q_0$ in a designated Pauli eigenstate $|\psi\rangle \in \{|0\rangle, |1\rangle, |+\rangle, |-\rangle, |+i\rangle, |-i\rangle\}$.

### Step 3: Bell Pair Entanglement
- Alice and Bob share a maximally entangled Bell pair on qubits $(q_1, q_2)$:
  $$|\Phi^+\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$$

### Step 4: Alice's Bell-Basis Measurement
- Alice performs a joint Bell measurement on $(q_0, q_1)$ by applying:
  1. $CNOT(q_0 \to q_1)$
  2. $H(q_0)$
  3. Computational basis measurement yielding 2 classical bits $(b_0, b_1) \in \{00, 01, 10, 11\}$.

### Step 5: Classical Transmission & Pauli Correction
- Alice sends classical bits $(b_0, b_1)$ to Bob over the classical channel.
- Bob applies unitary correction $U_{\text{Bob}} = Z^{b_0} X^{b_1}$ to his qubit $q_2$:
  - $00 \implies I$ (Identity)
  - $01 \implies X$ (Bit flip)
  - $10 \implies Z$ (Phase flip)
  - $11 \implies ZX$ (or $-iY$)
- Bob's qubit $q_2$ collapses exactly into $|\psi'\rangle = |\psi\rangle$ with fidelity $\mathcal{F} = 1.000$.

### Step 6: Projective Verification Measurement
- Bob measures $q_2$ in the agreed measurement basis ($Z, X$, or $Y$) across $N$ shots (e.g., $1000$ shots).
- Calculates the measurement error rate $E = N_{\text{unexpected}} / N_{\text{total}}$.
- Evaluates deterministic security decision against thresholds ($T_{\text{low}} = 5\%, T_{\text{high}} = 15\%$).
