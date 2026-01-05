---
title: "Mathematical Foundations of Machine Learning"
---
## Mathematical Foundations of Machine Learning

Machine learning is deeply rooted in mathematics. Behind every model lies a precise mathematical formulation that defines how learning occurs, how errors are measured, and how parameters are optimized.

### Data Representation
Data is typically represented as vectors or matrices. Given a dataset with $n$ samples and $d$ features, we write:

$$
X \in \mathbb{R}^{n \times d}, \quad y \in \mathbb{R}^n
$$

where each row of $X$ corresponds to one observation, and $y$ contains the associated targets or labels.

### Models as Functions
A machine learning model is a parametric function:

$$
\hat{y} = f_\theta(x)
$$

where $\theta$ denotes the model parameters. Learning consists of finding the optimal parameters that best explain the data.

### Loss Functions
To quantify how well a model performs, we define a loss function:

$$
\mathcal{L}(y, \hat{y})
$$

For example:
- Mean Squared Error (MSE) for regression:

$$
\mathcal{L}_{\text{MSE}} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

- Cross-Entropy for classification

### Optimization
Training a model is formulated as an optimization problem:

$$
\theta^* = \arg\min_{\theta} \; \frac{1}{n} \sum_{i=1}^{n} \mathcal{L}\big(y_i, f_\theta(x_i)\big)
$$

This minimization is commonly solved using gradient-based methods such as gradient descent:

$$
\theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}
$$

where $\eta$ is the learning rate.

### Regularization
To prevent overfitting, additional constraints are often imposed:

$$
\min_\theta \; \mathcal{L}(\theta) + \lambda \|\theta\|_p
$$

Regularization encourages simpler models that generalize better to unseen data.

### Key Insight
Machine learning can be viewed as the intersection of **linear algebra**, **probability**, **statistics**, and **optimization**, providing a rigorous mathematical framework for learning from data.
