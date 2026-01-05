---
title: Probabilistic View of Machine Learning
---


Many machine learning models can be interpreted through a probabilistic lens. Instead of predicting a single value, the model estimates the **probability distribution** of outcomes given the data.

### Random Variables and Data
We model inputs and outputs as random variables:
\[
X \sim \mathcal{D}_X, \quad Y \sim \mathcal{D}_Y
\]
and assume the data is sampled from an unknown joint distribution \( p(x, y) \).

### Conditional Modeling
Learning often focuses on estimating the conditional distribution:
\[
p(y \mid x; \theta)
\]
Predictions are then obtained by:
\[
\hat{y} = \arg\max_y \; p(y \mid x; \theta)
\]

### Maximum Likelihood Estimation (MLE)
A common learning principle is **Maximum Likelihood Estimation**, which chooses parameters that maximize the likelihood of observed data:
\[
\theta^* = \arg\max_\theta \prod_{i=1}^n p(y_i \mid x_i; \theta)
\]
Equivalently, we minimize the negative log-likelihood:
\[
\theta^* = \arg\min_\theta \; -\sum_{i=1}^n \log p(y_i \mid x_i; \theta)
\]

### Bayesian Perspective
In Bayesian machine learning, parameters themselves are treated as random variables:
\[
p(\theta \mid X, Y) \propto p(Y \mid X, \theta)\, p(\theta)
\]
This approach naturally incorporates prior knowledge and quantifies uncertainty in predictions.

### Bias–Variance Tradeoff
Model performance is governed by a fundamental tradeoff:
- **Bias**: error from overly simple assumptions
- **Variance**: error from sensitivity to data fluctuations

The goal of learning is to balance both in order to minimize generalization error.

### Takeaway
From a probabilistic standpoint, machine learning is about **inferring uncertainty**, **modeling data-generating processes**, and making optimal decisions under uncertainty using principled mathematical tools.
