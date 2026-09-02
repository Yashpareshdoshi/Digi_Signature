import pytest
from app.services.statistics_service import calculate_wilson_confidence_interval, calculate_forgery_probability, analyze_measurement_statistics

def test_wilson_confidence_interval():
    # 20 errors out of 1000 shots (2%)
    lower, upper = calculate_wilson_confidence_interval(20, 1000, confidence_level=0.95)
    assert 0.01 < lower < 0.02
    assert 0.02 < upper < 0.035
    assert lower < upper

def test_forgery_probability_low_vs_high():
    # Legitimate (2% error)
    res_legit = calculate_forgery_probability(error_rate=0.02, n_shots=1000)
    assert res_legit["forgery_probability"] < 0.05
    
    # Forged (45% error)
    res_forge = calculate_forgery_probability(error_rate=0.45, n_shots=1000)
    assert res_forge["forgery_probability"] > 0.90

def test_analyze_measurement_statistics():
    stats = analyze_measurement_statistics(unexpected_count=15, total_shots=1000)
    assert stats["error_rate"] == 0.015
    assert stats["error_rate_percentage"] == 1.5
    assert stats["unexpected_count"] == 15
    assert stats["expected_count"] == 985
