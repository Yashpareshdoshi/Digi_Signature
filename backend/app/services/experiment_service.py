import time
import json
import secrets
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.experiment import Experiment, ExperimentTrial
from app.quantum.factory import get_quantum_backend
from app.quantum.measurement import get_expected_outcome
from app.services.statistics_service import analyze_measurement_statistics, compute_false_positive_negative_rates
from app.services.threat_detection_service import ThreatDetectionService
from app.core.config import settings

class ExperimentService:
    @staticmethod
    def run_sweep(
        db: Session,
        name: str,
        description: str,
        states: List[str],
        bases: List[str],
        shots_list: List[int],
        noise_levels: List[float],
        trials_per_config: int = 1,
        backend_name: str = "numpy",
        attack_scenario: str = "LEGITIMATE"
    ) -> Experiment:
        """
        Executes a multi-parameter batch experiment sweep across
        quantum states, measurement bases, shot counts, noise rates,
        and attack scenarios.
        """
        experiment_id = f"EXP-{secrets.token_hex(4).upper()}"
        backend = get_quantum_backend(backend_name)

        trial_records = []
        trial_orm_objects = []
        trial_counter = 0

        # Bound parameter space to prevent excessive execution time
        safe_states = states[:4]
        safe_bases = bases[:3]
        safe_shots = shots_list[:3]
        safe_noise = noise_levels[:5]
        safe_trials = min(max(1, trials_per_config), 5)

        for q_state in safe_states:
            for basis in safe_bases:
                for shots in safe_shots:
                    for noise in safe_noise:
                        for t_idx in range(safe_trials):
                            trial_counter += 1
                            t0 = time.time()

                            # 1. State preparation
                            in_state = backend.get_pauli_state(q_state)

                            # 2. Teleportation
                            tele_res = backend.teleport(in_state, "Phi+")
                            rec_state = tele_res.get("recovered_statevector") or in_state

                            # 3. Channel noise & Attack injection
                            is_attack = False
                            if attack_scenario == "SIGNATURE_FORGERY":
                                # Forger injects orthogonal / conjugate state
                                forged_symbol = "|1>" if q_state == "|0>" else ("|0>" if q_state == "|1>" else "|->")
                                rec_state = backend.get_pauli_state(forged_symbol)
                                is_attack = True
                            elif attack_scenario == "INTERCEPT_RESEND":
                                # Eve measures in conjugate basis and resends collapsed state
                                eve_basis = "X" if basis == "Z" else "Z"
                                eve_meas = backend.measure(rec_state, basis=eve_basis, shots=1, noise_rate=0.0)
                                collapsed = ("|0>" if eve_meas["outcome"] == 0 else "|1>") if eve_basis == "Z" else ("|+>" if eve_meas["outcome"] == 0 else "|->")
                                rec_state = backend.get_pauli_state(collapsed)
                                is_attack = True
                            elif attack_scenario == "CHANNEL_MANIPULATION":
                                is_attack = (noise > 0.0)
                            else: # LEGITIMATE
                                is_attack = (noise > settings.HIGH_ERROR_THRESHOLD)

                            if noise > 0.0:
                                rec_state, _ = backend.apply_channel_noise(
                                    rec_state,
                                    noise_type="depolarizing",
                                    noise_parameter=noise
                                )

                            # 4. Measurement
                            exp_out = get_expected_outcome(q_state, basis)
                            meas = backend.measure(
                                state=rec_state,
                                basis=basis,
                                shots=shots,
                                expected_outcome=exp_out,
                                noise_rate=0.0
                            )

                            # 5. Statistics
                            stats = analyze_measurement_statistics(
                                unexpected_count=meas["unexpected_count"],
                                total_shots=shots,
                                low_threshold=settings.LOW_ERROR_THRESHOLD,
                                high_threshold=settings.HIGH_ERROR_THRESHOLD
                            )

                            # 6. Threat evaluation
                            eval_res = ThreatDetectionService.evaluate_signature_security(
                                identity_valid=True,
                                nonce_already_consumed=False,
                                message_hash_match=True,
                                error_rate=stats["error_rate"],
                                low_threshold=settings.LOW_ERROR_THRESHOLD,
                                high_threshold=settings.HIGH_ERROR_THRESHOLD
                            )

                            latency = (time.time() - t0) * 1000.0

                            trial_data = {
                                "trial_number": trial_counter,
                                "quantum_state": q_state,
                                "measurement_basis": basis,
                                "shots": shots,
                                "noise_rate": noise,
                                "is_attack": is_attack,
                                "error_rate": stats["error_rate"],
                                "confidence_lower": stats["confidence_lower"],
                                "confidence_upper": stats["confidence_upper"],
                                "decision": eval_res["decision"],
                                "threat_detected": eval_res["threat_detected"],
                                "latency_ms": latency
                            }
                            trial_records.append(trial_data)

                            trial_orm = ExperimentTrial(
                                experiment_id=experiment_id,
                                trial_number=trial_counter,
                                quantum_state=q_state,
                                measurement_basis=basis,
                                shots=shots,
                                noise_rate=noise,
                                is_attack=is_attack,
                                error_rate=stats["error_rate"],
                                confidence_lower=stats["confidence_lower"],
                                confidence_upper=stats["confidence_upper"],
                                decision=eval_res["decision"],
                                threat_detected=eval_res["threat_detected"],
                                latency_ms=latency,
                                created_at=datetime.utcnow()
                            )
                            trial_orm_objects.append(trial_orm)

        # Aggregate metrics
        rate_metrics = compute_false_positive_negative_rates(trial_records)
        mean_err = sum(t["error_rate"] for t in trial_records) / max(1, len(trial_records))

        exp_record = Experiment(
            experiment_id=experiment_id,
            name=name,
            description=description,
            parameters=json.dumps({
                "states": safe_states,
                "bases": safe_bases,
                "shots": safe_shots,
                "noise_levels": safe_noise,
                "backend": backend.name,
                "attack_scenario": attack_scenario
            }),
            total_trials=len(trial_records),
            mean_error_rate=float(mean_err),
            false_positive_rate=rate_metrics["false_positive_rate"],
            false_negative_rate=rate_metrics["false_negative_rate"],
            created_at=datetime.utcnow()
        )
        db.add(exp_record)
        db.commit()

        for t_obj in trial_orm_objects:
            db.add(t_obj)
        db.commit()
        db.refresh(exp_record)

        return exp_record
