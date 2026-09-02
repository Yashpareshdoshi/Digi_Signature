# Cyber Threat Model & Deterministic Defense Rules

## 1. Threat Scenarios & Attack Vectors

| Attack Vector | Adversary Capability | Signature Symptom | Deterministic Rule | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **Signature Forgery** | Fabricates quantum state / guesses measurement basis without genuine entanglement. | Extreme measurement discrepancy ($E \approx 48\% - 52\%$), $P_{\text{forge}} > 99.9\%$. | **RULE 4**: $E > T_{\text{high}}$ (15%) $\implies$ REJECT | HIGH |
| **Signer Impersonation** | Submits valid message but unauthorized signer ID (e.g. `Eve-Malicious`). | Identity mismatch against authorized key registry. | **RULE 1**: `identity_valid == FALSE` $\implies$ REJECT | HIGH |
| **Replay Attack** | Intercepts and re-submits previously verified signature + nonce. | Nonce marked as already consumed in session database. | **RULE 3**: `nonce_consumed == TRUE` $\implies$ REJECT | CRITICAL |
| **Channel Manipulation** | Introduces decoherence noise or eavesdropper intercept-resend measurements. | Elevated measurement error rate ($5\% < E \le 15\%$). | **RULE 5**: $T_{\text{low}} < E \le T_{\text{high}}$ $\implies$ SUSPICIOUS | MEDIUM |
| **Message Tampering** | Modifies plaintext message content in transit. | SHA-256 message digest mismatch. | **RULE 2**: `hash_match == FALSE` $\implies$ REJECT | CRITICAL |

---

## 2. Deterministic Rule Tree (Strictly NO AI/ML)

```text
IF claimed_signer != registered_signer:
    -> TRIGGER RULE 1: IMPERSONATION DETECTED (REJECT)

ELSE IF calculated_sha256 != stored_sha256:
    -> TRIGGER RULE 2: MESSAGE TAMPERING DETECTED (REJECT)

ELSE IF nonce_already_consumed == TRUE:
    -> TRIGGER RULE 3: REPLAY ATTACK DETECTED (REJECT)

ELSE IF measurement_error > HIGH_ERROR_THRESHOLD (0.15):
    -> TRIGGER RULE 4: SIGNATURE FORGERY DETECTED (REJECT)

ELSE IF measurement_error > LOW_ERROR_THRESHOLD (0.05):
    -> TRIGGER RULE 5: QUANTUM CHANNEL NOISE ELEVATION (SUSPICIOUS)

ELSE:
    -> TRIGGER RULE 6: SIGNATURE VERIFIED (VERIFIED)
```
