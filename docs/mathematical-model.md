# Mathematical & Statistical Formulations

## 1. Born Rule & Projective Measurements

For a 1-qubit normalized statevector $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, the probability of obtaining measurement outcome $k$ corresponding to projector $P_k = |\phi_k\rangle\langle\phi_k|$ is:

$$p_k = \langle\psi|P_k|\psi\rangle = \text{Tr}(P_k |\psi\rangle\langle\psi|)$$

Subject to $\sum_k p_k = 1.0$.

---

## 2. Empirical Measurement Error Rate

$$E = \frac{N_{\text{unexpected}}}{N_{\text{total}}}$$

where $N_{\text{unexpected}}$ is the count of projective measurement shots deviating from the theoretical eigenstate outcome, and $N_{\text{total}}$ is the total shot count (default $N = 1000$).

---

## 3. Wilson Score Confidence Interval

For observed error proportion $\hat{p} = \frac{k}{n}$ under $n$ shots and confidence level $1 - \alpha = 0.95$ ($z = 1.95996$):

$$\text{Center} = \frac{\hat{p} + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}$$

$$\text{Margin} = \frac{z}{1 + \frac{z^2}{n}} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}$$

$$\text{CI}_{95\%} = [\text{Center} - \text{Margin}, \text{Center} + \text{Margin}]$$

---

## 4. Binomial Likelihood Forgery Model

Let $\theta_0 \approx 0.02$ be the baseline quantum simulation noise under legitimate transmission, and $\theta_1 \approx 0.50$ be the expected error rate under unentangled basis guessing (forgery).

The Bayesian Likelihood Ratio (with uninformative uniform prior) is:

$$\Lambda(k) = \frac{\mathcal{L}(k; \theta_1)}{\mathcal{L}(k; \theta_0)} = \frac{\binom{n}{k} \theta_1^k (1-\theta_1)^{n-k}}{\binom{n}{k} \theta_0^k (1-\theta_0)^{n-k}}$$

$$P_{\text{forge}} = \frac{1}{1 + \exp\left(-\left(\ln \mathcal{L}_1 - \ln \mathcal{L}_0\right)\right)}$$

---

## 5. Security Decision Thresholds

- $E \le T_{\text{low}} = 0.05 \implies$ **VERIFIED**
- $0.05 < E \le T_{\text{high}} = 0.15 \implies$ **SUSPICIOUS**
- $E > 0.15 \implies$ **REJECTED**
