import numpy as np
import scipy.stats as stats
from typing import Dict, Any, Tuple

def calculate_wilson_confidence_interval(
    k_errors: int,
    n_shots: int,
    confidence_level: float = 0.95
) -> Tuple[float, float]:
    """
    Computes the Wilson Score Interval for a binomial proportion.
    Unlike the simple normal approximation (Wald interval), the Wilson score interval
    remains reliable even when p is close to 0 or 1 and for finite shot counts.
    
    Formula:
    center = (p_hat + z^2 / (2n)) / (1 + z^2 / n)
    spread = (z / (1 + z^2 / n)) * sqrt( (p_hat*(1 - p_hat)/n) + (z^2 / (4n^2)) )
    CI = [center - spread, center + spread]
    """
    if n_shots <= 0:
        return 0.0, 0.0
    
    p_hat = float(k_errors) / float(n_shots)
    alpha = 1.0 - confidence_level
    z = stats.norm.ppf(1.0 - alpha / 2.0)
    
    denom = 1.0 + (z ** 2) / n_shots
    center = (p_hat + (z ** 2) / (2.0 * n_shots)) / denom
    spread = (z / denom) * np.sqrt((p_hat * (1.0 - p_hat) / n_shots) + ((z ** 2) / (4.0 * (n_shots ** 2))))
    
    lower = max(0.0, float(center - spread))
    upper = min(1.0, float(center + spread))
    
    return lower, upper

def calculate_forgery_probability(
    error_rate: float,
    n_shots: int,
    legitimate_baseline_error: float = 0.02,
    forged_expected_error: float = 0.50
) -> Dict[str, Any]:
    """
    Calculates the statistical forgery probability under a rigorous binomial / likelihood ratio model.
    
    Model Assumptions:
    - Legitimate transmission: Measurement error follows Binomial(n, theta_0), where theta_0 ~= 0.02.
    - Forgery attempt: Attacker without knowledge of Alice's Pauli basis/entangled state must guess.
      In a random basis guess, unexpected outcome probability theta_forge ~= 0.50 (or 0.25).
    - We compute the posterior probability / p-value of observing the error count under the legitimate
      hypothesis vs the forgery hypothesis using Bayesian Likelihood Ratio with uniform prior.
      
    P(Forgery | k errors) = L(k; theta_forge) / (L(k; theta_forge) + L(k; theta_0))
    """
    error_rate = np.clip(error_rate, 0.0, 1.0)
    k = int(round(error_rate * n_shots))
    
    # Avoid log(0) or division by zero with smoothing
    theta_0 = np.clip(legitimate_baseline_error, 1e-4, 0.40)
    theta_1 = np.clip(forged_expected_error, 0.40, 0.99)
    
    # Calculate log-likelihoods using scipy.stats.binom.logpmf
    log_l0 = stats.binom.logpmf(k, n_shots, theta_0)
    log_l1 = stats.binom.logpmf(k, n_shots, theta_1)
    
    # Softmax / Sigmoid of log likelihood ratio
    log_diff = log_l1 - log_l0
    if log_diff > 700:
        p_forge = 1.0
    elif log_diff < -700:
        p_forge = 0.0
    else:
        p_forge = 1.0 / (1.0 + np.exp(-log_diff))
        
    p_forge = float(np.clip(p_forge, 0.0, 1.0))
    
    # Also calculate p-value under legitimate hypothesis: P(X >= k | theta_0)
    p_value_legitimate = float(1.0 - stats.binom.cdf(k - 1, n_shots, theta_0)) if k > 0 else 1.0
    
    return {
        "forgery_probability": p_forge,
        "p_value_legitimate": p_value_legitimate,
        "k_errors": k,
        "n_shots": n_shots,
        "observed_error_rate": float(error_rate),
        "baseline_error_rate": float(theta_0),
        "forged_expected_error_rate": float(theta_1),
        "confidence_level": 0.95
    }

def analyze_measurement_statistics(
    unexpected_count: int,
    total_shots: int,
    low_threshold: float = 0.05,
    high_threshold: float = 0.15,
    confidence_level: float = 0.95
) -> Dict[str, Any]:
    """
    Performs complete deterministic statistical verification breakdown.
    """
    if total_shots <= 0:
        raise ValueError("Total shots must be greater than zero.")
        
    error_rate = float(unexpected_count) / float(total_shots)
    ci_lower, ci_upper = calculate_wilson_confidence_interval(
        unexpected_count, total_shots, confidence_level=confidence_level
    )
    
    forgery_metrics = calculate_forgery_probability(
        error_rate=error_rate,
        n_shots=total_shots
    )
    
    return {
        "total_shots": total_shots,
        "unexpected_count": unexpected_count,
        "expected_count": total_shots - unexpected_count,
        "error_rate": error_rate,
        "error_rate_percentage": round(error_rate * 100.0, 2),
        "confidence_lower": ci_lower,
        "confidence_upper": ci_upper,
        "confidence_interval_text": f"[{ci_lower*100.0:.2f}%, {ci_upper*100.0:.2f}%]",
        "forgery_probability": forgery_metrics["forgery_probability"],
        "forgery_probability_percentage": round(forgery_metrics["forgery_probability"] * 100.0, 2),
        "p_value_legitimate": forgery_metrics["p_value_legitimate"],
        "low_threshold": low_threshold,
        "high_threshold": high_threshold
    }
