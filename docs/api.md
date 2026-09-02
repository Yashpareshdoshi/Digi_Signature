# REST API Documentation

## Base URL: `http://localhost:8000/api`
Interactive Swagger UI: `http://localhost:8000/docs`

---

## 1. Signatures
- `POST /api/signatures` — Create new simulated Quantum Digital Signature.
- `GET /api/signatures` — List signatures with pagination.
- `GET /api/signatures/{id}` — Get single signature details.

## 2. Quantum Simulation
- `GET /api/quantum/states` — List supported Pauli eigenstates (|0>, |1>, |+>, |->, |+i>, |-i>).
- `GET /api/quantum/bell-states` — List supported Bell EPR states.
- `POST /api/quantum/bell-state` — Generate Bell state and return circuit execution steps.
- `POST /api/quantum/teleport` — Execute 3-qubit quantum teleportation circuit with Pauli correction.
- `POST /api/quantum/measure` — Perform projective measurements across Z, X, or Y basis.

## 3. Verification
- `POST /api/verification/start` — Execute deterministic statistical verification.
- `GET /api/verification` — List verification sessions.
- `GET /api/verification/{id}` — Get specific verification session details.

## 4. Attack Simulation
- `POST /api/attacks/simulate` — Safely inject cyber attack (Forgery, Replay, Impersonation, Noise).
- `GET /api/attacks` — List attack history.
- `GET /api/attacks/{id}` — Get attack details.

## 5. Dashboard & Analytics
- `GET /api/dashboard/summary` — High-level KPI metrics & recent activity.
- `GET /api/dashboard/threat-distribution` — Aggregated threat breakdown.
- `GET /api/dashboard/timeline` — Chronological error rates & confidence intervals.
- `GET /api/analytics/metrics` — Accuracy, Detection Rate, FPR, FNR, latency.
- `GET /api/analytics/attack-comparison` — Comparative evaluation matrix.
- `GET /api/analytics/shots-benchmark` — Shot sweep convergence statistics.

## 6. Alerts & Settings
- `GET /api/alerts` — List security incident alerts.
- `PATCH /api/alerts/{id}` — Update alert status (INVESTIGATING, RESOLVED).
- `GET /api/settings` — Get dynamic threshold settings.
- `PUT /api/settings/{key}` — Update configuration parameter.
- `POST /api/settings/reset` — Reset all configuration parameters to defaults.

## 7. Automated Demo
- `POST /api/demo/run-complete` — Execute the 12-step research demonstration.
