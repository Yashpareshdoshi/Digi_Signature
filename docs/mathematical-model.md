# Mathematical, Quantum & Statistical Formulations

## 1. 4-Bell-State Quantum Teleportation Mathematics

Let the arbitrary input quantum state on qubit $0$ be:
$$|\psi\rangle_0 = \alpha|0\rangle + \beta|1\rangle, \quad |\alpha|^2 + |\beta|^2 = 1$$

Alice and Bob share one of four maximally entangled Bell states on qubits $(1, 2)$:
- $|\Phi^+\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$
- $|\Phi^-\rangle = \frac{1}{\sqrt{2}} (|00\rangle - |11\rangle)$
- $|\Psi^+\rangle = \frac{1}{\sqrt{2}} (|01\rangle + |10\rangle)$
- $|\Psi^-\rangle = \frac{1}{\sqrt{2}} (|01\rangle - |10\rangle)$

The total initial 3-qubit state $|\Psi_{\text{total}}\rangle_{012} = |\psi\rangle_0 \otimes |\text{Bell}\rangle_{12}$ can be expanded in the Bell basis of qubits $(0, 1)$. Alice measures qubits $(0, 1)$ in the computational basis after applying $CNOT(0 \to 1)$ and $H(0)$, yielding classical bits $(b_0, b_1) \in \{00, 01, 10, 11\}$.

### Complete Pauli Correction Matrix $U(b_0, b_1)$ by Bell Resource:
Bob applies the following unitary operations to qubit $2$ to recover $|\psi\rangle$ with exact fidelity $\mathcal{F} = |\langle\psi|\psi_{\text{rec}}\rangle|^2 \equiv 1.000000$:

| Classical Bits $(b_0 b_1)$ | $|\Phi^+\rangle$ | $|\Phi^-\rangle$ | $|\Psi^+\rangle$ | $|\Psi^-\rangle$ |
| :---: | :---: | :---: | :---: | :---: |
| **00** | $I$ | $Z$ | $X$ | $ZX$ (or $-iY$) |
| **01** | $X$ | $XZ$ (or $iY$) | $I$ | $Z$ |
| **10** | $Z$ | $I$ | $ZX$ (or $-iY$) | $X$ |
| **11** | $ZX$ (or $-iY$) | $X$ | $Z$ | $I$ |

---

## 2. Designated-Verifier Memory-Free Sifted Measurement

### Basis Sifting:
Let Alice's private token table be $SK_A = \{(B_A[i], \alpha_A[i])\}_{i=0}^{L-1}$ and Bob's immediate enrollment record be $VK_B = \{(B_B[i], O_B[i])\}_{i=0}^{L-1}$, where $B_A[i], B_B[i] \in \{Z, X\}$.

For signature indices $\mathcal{I} \subset \{0, \dots, L-1\}$ selected via $h = \text{SHA-256}(M \parallel N)$, basis sifting yields the subset:
$$\mathcal{I}_{\text{sifted}} = \{i \in \mathcal{I} \mid B_B[i] == B_A[i]\}$$

Expected sifted token count:
$$\mathbb{E}[n_{\text{sifted}}] = \frac{1}{2} M$$

### Multi-Shot Born-Rule Projection:
For each sifted position $i \in \mathcal{I}_{\text{sifted}}$, Bob performs $N_{\text{shots}} = 250$ independent projective measurements.
The empirical Quantum Bit Error Rate (QBER) across total sample size $n = n_{\text{sifted}} \cdot N_{\text{shots}}$ is:
$$\hat{p} = \frac{N_{\text{unexpected}}}{n}$$

---

## 3. Wilson Score 95% Confidence Interval

For sample size $n$ and observed errors $k = N_{\text{unexpected}}$, the Wilson score interval ($z = 1.95996$ for 95% confidence) does not suffer from normal-approximation degradation near $p=0$ or $p=1$:

$$\text{Center} = \frac{\hat{p} + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}$$

$$\text{Margin} = \frac{z}{1 + \frac{z^2}{n}} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}$$

$$[LCL, UCL] = \left[\max\left(0, \text{Center} - \text{Margin}\right), \min\left(1, \text{Center} + \text{Margin}\right)\right]$$

---

## 4. Deterministic Threat Detection Boundaries

Given configured operational thresholds $T_{\text{low}} = 0.05$ (5%) and $T_{\text{high}} = 0.15$ (15%):

$$\text{Decision} = \begin{cases} 
\text{VERIFIED}, & UCL \le T_{\text{low}} \\
\text{REJECTED}, & LCL > T_{\text{high}} \\
\text{SUSPICIOUS}, & \text{otherwise}
\end{cases}$$

- **Legitimate Transmission**: Physical channel noise $\le 2\% \implies UCL \le 0.05 \implies$ **VERIFIED** (`RULE_6_CHANNEL_ACCEPTANCE` PASS).
- **Signature Forgery**: Unentangled conjugate state $\implies \hat{p} \approx 50\% \implies LCL > 0.15 \implies$ **REJECTED** (`RULE_4_QUANTUM_VERIFICATION` FAIL, benchmark attribution $\hat{p} > 0.38$). Rules 5 and 6 are strictly `NOT REACHED`.
- **Intercept-Resend Eavesdropping**: Wave-function collapse $\implies \hat{p} \approx 25\% \implies LCL > 0.15 \implies$ **REJECTED** (`RULE_4_QUANTUM_VERIFICATION` FAIL, benchmark attribution $\hat{p} \le 0.38$). Rules 5 and 6 are strictly `NOT REACHED`.
- **Intermediate Channel Disturbance**: Noise $5\% < E \le 15\% \implies$ **SUSPICIOUS** (`RULE_5_INTERMEDIATE_DISTURBANCE` FAIL, Rule 6 strictly `NOT REACHED`).

> [!NOTE]
> **Heuristic Attribution Cutoff**: The threshold $\hat{p} \approx 0.38$ is an empirical midpoint benchmark classifier between theoretical intercept-resend ($25\%$) and blind guessing ($50\%$), not a fundamental quantum-security limit or formally proven cryptographic boundary.

---

## 5. Bayesian Binomial Likelihood Ratio Anomaly Score

Under point hypotheses $H_0: \theta_0 = 0.02$ (legitimate baseline) versus $H_1: \theta_1 = 0.50$ (forgery attempt):

$$\ln \Lambda(k) = \ln \left[\frac{\binom{n}{k} \theta_1^k (1-\theta_1)^{n-k}}{\binom{n}{k} \theta_0^k (1-\theta_0)^{n-k}}\right] = k \ln\left(\frac{\theta_1}{\theta_0}\right) + (n-k) \ln\left(\frac{1-\theta_1}{1-\theta_0}\right)$$

$$P_{\text{forge}} = \frac{1}{1 + \exp(-\ln \Lambda(k))}$$

---

## 6. Ground Truth Academic Evaluation Metrics

Evaluated across legitimate verification sessions ($N_{\text{legit}}$) and attack simulation sessions ($N_{\text{attack}}$):

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN} \times 100\%$$

$$\text{Detection Rate (TPR)} = \frac{TP}{TP + FN} \times 100\%$$

$$\text{False Positive Rate (FPR)} = \frac{FP}{TN + FP} \times 100\%$$

$$\text{False Negative Rate (FNR)} = \frac{FN}{TP + FN} \times 100\%$$

$$\text{Precision} = \frac{TP}{TP + FP} \times 100\%$$
