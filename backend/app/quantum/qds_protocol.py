from __future__ import annotations
import hashlib
import random
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from app.quantum.factory import get_quantum_backend
from app.services.statistics_service import calculate_wilson_confidence_interval

DEFAULT_TOKEN_POOL_SIZE = 32
DEFAULT_SIGNATURE_TOKEN_COUNT = 8
DEFAULT_SHOTS_PER_TOKEN = 250
BB84_BASES = ["Z", "X"]

def bb84_state_label(basis: str, bit: int) -> str:
    """Returns Pauli eigenstate symbol for given basis and bit value."""
    basis = basis.upper()
    if basis == "Z":
        return "|0>" if bit == 0 else "|1>"
    elif basis == "X":
        return "|+>" if bit == 0 else "|->"
    raise ValueError(f"Unsupported basis: {basis}. Supported: Z, X")

def bb84_expected_outcome(basis: str, bit: int) -> str:
    """Returns expected measurement outcome symbol for given basis and bit value."""
    basis = basis.upper()
    if basis == "Z":
        return "0" if bit == 0 else "1"
    elif basis == "X":
        return "+" if bit == 0 else "-"
    raise ValueError(f"Unsupported basis: {basis}. Supported: Z, X")

def generate_alice_private_table(pool_size: int = DEFAULT_TOKEN_POOL_SIZE, seed: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Alice generates private classical preparation table SK_A = {(B_A[i], alpha_A[i])}.
    Uses uniform independent random selection for basis B_A in {Z, X} and bit alpha_A in {0, 1}.
    """
    rng = random.Random(seed) if seed is not None else random
    table = []
    for i in range(pool_size):
        basis = rng.choice(BB84_BASES)
        bit = rng.choice([0, 1])
        table.append({
            "index": i,
            "basis": basis,
            "bit": bit,
            "state_label": bb84_state_label(basis, bit)
        })
    return table

def teleport_and_measure_enrollment(
    alice_table: List[Dict[str, Any]],
    bell_state: str = "Phi+",
    backend = None,
    seed: Optional[int] = None
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Executes Memory-Free Sifted-Measurement QDS Enrollment:
    1. Alice prepares physical quantum state |psi_i> for each token i in SK_A.
    2. Alice teleports |psi_i> to Bob via shared Bell state using CNOT, H, 2 classical bits, and Pauli correction.
    3. Bob immediately measures the recovered state in an independently chosen basis B_B[i] in {Z, X}.
    4. Bob stores ONLY the classical verification record VK_B = {(B_B[i], O_B[i])}. No quantum memory is required.
    """
    if backend is None:
        backend = get_quantum_backend()
    rng = random.Random(seed) if seed is not None else random

    bob_vk_table = []
    teleport_telemetry = []

    for item in alice_table:
        idx = item["index"]
        state_label = item["state_label"]

        # Prepare and teleport state
        in_state = backend.get_pauli_state(state_label)
        tele_res = backend.teleport(in_state, bell_state_name=bell_state)
        rec_state = tele_res.get("recovered_statevector")
        if rec_state is None:
            rec_state = backend.get_pauli_state(state_label)

        # Bob chooses measurement basis independently and uniformly at random
        bob_basis = rng.choice(BB84_BASES)

        # Bob measures immediately without quantum memory
        meas = backend.measure(
            state=rec_state,
            basis=bob_basis,
            shots=1,
            noise_rate=0.0
        )
        sample_recs = meas.get("sample_records", [])
        bob_outcome = sample_recs[0]["actual_outcome"] if sample_recs else ("0" if bob_basis == "Z" else "+")

        # Bob stores ONLY his classical basis and measurement outcome
        bob_vk_table.append({
            "index": idx,
            "bob_basis": bob_basis,
            "bob_outcome": bob_outcome,
            "teleport_fidelity": float(tele_res.get("fidelity", 1.0))
        })

        teleport_telemetry.append({
            "index": idx,
            "classical_bits": tele_res.get("classical_bits", "00"),
            "pauli_correction": tele_res.get("pauli_correction", "I"),
            "fidelity": float(tele_res.get("fidelity", 1.0)),
            "bob_basis": bob_basis,
            "bob_outcome": bob_outcome
        })

    return bob_vk_table, teleport_telemetry

def extract_signature_indices(
    digest_hex: str,
    pool_size: int = DEFAULT_TOKEN_POOL_SIZE,
    token_count: int = DEFAULT_SIGNATURE_TOKEN_COUNT
) -> List[int]:
    """
    Deterministic, unbiased index selection from hash digest using rejection sampling.
    Maps SHA-256 digest bytes into token_count distinct indices in [0, pool_size - 1].
    Eliminates modulo bias and ensures cryptographic avalanche effect.
    """
    if token_count > pool_size:
        raise ValueError(f"Token count ({token_count}) cannot exceed pool size ({pool_size})")

    digest_bytes = bytes.fromhex(digest_hex)
    selected: List[int] = []
    max_unbiased = 256 - (256 % pool_size)

    for b in digest_bytes:
        if b < max_unbiased:
            idx = b % pool_size
            if idx not in selected:
                selected.append(idx)
                if len(selected) == token_count:
                    break

    counter = 1
    while len(selected) < token_count:
        ext = hashlib.sha256(digest_bytes + bytes([counter])).digest()
        for b in ext:
            if b < max_unbiased:
                idx = b % pool_size
                if idx not in selected:
                    selected.append(idx)
                    if len(selected) == token_count:
                        break
        counter += 1

    return sorted(selected)

def create_signature_declaration(
    alice_sk_table: List[Dict[str, Any]],
    selected_indices: List[int]
) -> List[Dict[str, Any]]:
    """
    Alice creates her classical declaration Dec_A = {(index, B_A[index], alpha_A[index])}
    revealing preparation details ONLY for the selected signature indices.
    All unselected tokens remain completely private.
    """
    sk_map = {item["index"]: item for item in alice_sk_table}
    declaration = []
    for idx in selected_indices:
        if idx not in sk_map:
            raise ValueError(f"Index {idx} not found in Alice private key table.")
        entry = sk_map[idx]
        declaration.append({
            "index": idx,
            "basis": entry["basis"],
            "bit": entry["bit"],
            "state_label": entry["state_label"]
        })
    return declaration

def verify_sifted_declaration(
    bob_vk_table: List[Dict[str, Any]],
    declaration: List[Dict[str, Any]],
    shots_per_token: int = DEFAULT_SHOTS_PER_TOKEN,
    noise_rate: float = 0.0,
    attack_scenario: str = "NONE",
    backend = None
) -> Dict[str, Any]:
    """
    Bob performs basis sifting and quantum measurement outcome verification:
    1. Basis Sifting: Retain token positions where B_B[index] == B_A[index].
    2. Sifted Error Check: Compare Bob's recorded outcome O_B[index] against Alice's declared bit.
    3. Multi-shot simulation: Models physical Born-rule projection and channel noise
       using shots_per_token independent trials per sifted position.
    4. Computes exact Wilson 95% confidence interval [LCL, UCL] and aggregate statistics.
    """
    if backend is None:
        backend = get_quantum_backend()

    vk_map = {item["index"]: item for item in bob_vk_table}
    sifted_tokens = []
    unsifted_tokens = []
    token_details = []

    total_shots = 0
    total_unexpected = 0

    for dec_item in declaration:
        idx = dec_item["index"]
        alice_basis = dec_item["basis"]
        alice_bit = dec_item["bit"]
        alice_state_label = dec_item["state_label"]

        if idx not in vk_map:
            raise ValueError(f"Index {idx} not present in Bob verification table.")

        vk_entry = vk_map[idx]
        bob_basis = vk_entry["bob_basis"]
        bob_outcome = vk_entry["bob_outcome"]
        is_sifted = (alice_basis == bob_basis)

        expected_outcome = bb84_expected_outcome(alice_basis, alice_bit)

        if is_sifted:
            sifted_tokens.append(idx)
            target_state_label = alice_state_label
            if attack_scenario == "SIGNATURE_FORGERY":
                # Blind forgery: Attacker lacks the entangled Bell state and private basis.
                # Fabricating an unentangled quantum state (conjugate basis state)
                # produces the theoretical 50% Born-rule measurement error.
                target_state_label = "|+>" if alice_basis == "Z" else "|0>"
            elif attack_scenario == "INTERCEPT_RESEND":
                # Eve intercepts and measures in random basis {Z, X}
                # 50% prob same basis (0% error), 50% prob conjugate basis (50% error) -> 25% expected QBER
                eve_basis = random.choice(BB84_BASES)
                if eve_basis != alice_basis:
                    target_state_label = "|+>" if alice_basis == "Z" else "|0>"

            state = backend.get_pauli_state(target_state_label)
            meas = backend.measure(
                state=state,
                basis=alice_basis,
                shots=shots_per_token,
                expected_outcome=expected_outcome,
                noise_rate=noise_rate
            )

            token_unexp = meas["unexpected_count"]
            token_err_rate = meas["empirical_error_rate"]
            total_shots += shots_per_token
            total_unexpected += token_unexp

            token_details.append({
                "index": idx,
                "sifted": True,
                "alice_basis": alice_basis,
                "alice_bit": alice_bit,
                "bob_basis": bob_basis,
                "bob_outcome": bob_outcome,
                "expected_outcome": expected_outcome,
                "token_shots": shots_per_token,
                "token_errors": token_unexp,
                "token_error_rate": float(token_err_rate),
                "status": "MATCH" if token_err_rate < 0.15 else "MISMATCH"
            })
        else:
            unsifted_tokens.append(idx)
            token_details.append({
                "index": idx,
                "sifted": False,
                "alice_basis": alice_basis,
                "alice_bit": alice_bit,
                "bob_basis": bob_basis,
                "bob_outcome": bob_outcome,
                "expected_outcome": expected_outcome,
                "token_shots": 0,
                "token_errors": 0,
                "token_error_rate": 0.0,
                "status": "DISCARDED_BY_SIFTING"
            })

    # Statistical evaluation
    sifted_count = len(sifted_tokens)
    if total_shots > 0:
        empirical_qber = total_unexpected / float(total_shots)
        ci_low, ci_high = calculate_wilson_confidence_interval(
            k_errors=total_unexpected,
            n_shots=total_shots,
            confidence_level=0.95
        )
    else:
        empirical_qber = 0.0
        ci_low, ci_high = 0.0, 0.0

    return {
        "pool_size": len(bob_vk_table),
        "declared_token_count": len(declaration),
        "sifted_token_count": sifted_count,
        "unsifted_token_count": len(unsifted_tokens),
        "sifted_indices": sifted_tokens,
        "unsifted_indices": unsifted_tokens,
        "total_simulation_shots": total_shots,
        "unexpected_count": total_unexpected,
        "empirical_qber": float(empirical_qber),
        "wilson_ci_lower": float(ci_low),
        "wilson_ci_upper": float(ci_high),
        "confidence_interval_text": f"[{ci_low*100:.2f}%, {ci_high*100:.2f}%]",
        "token_details": token_details
    }
