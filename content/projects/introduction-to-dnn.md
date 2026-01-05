---
title: "Introduction to DNN"
date: 2026-01-06
description: "Short Introduction to Deep Neural Network"
tags: [dnn, python, llm]
thumbnail: /images/dnn.png
---

## What is a Deep Neural Network?

A **Deep Neural Network (DNN)** is a parametric function composed of multiple nonlinear layers that map inputs $x \in \mathbb{R}^d$ to outputs $y$. By stacking layers, DNNs can approximate highly complex functions.

## Mathematical Model

A single layer in a DNN is defined as:
$$
z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \quad a^{(l)} = \sigma(z^{(l)})
$$
where $\sigma(\cdot)$ is a nonlinear activation function.

A common choice is the **sigmoid**:
$$
\sigma(x) = \frac{1}{1 + e^{-x}}
$$

Its derivative, required for learning, is:
$$
\sigma'(x) = \sigma(x)\big(1 - \sigma(x)\big)
$$

## Learning via Optimization

Given a loss function $\mathcal{L}(y, \hat{y})$, training a DNN consists of solving:
$$
\min_\theta \; \frac{1}{n} \sum_{i=1}^n \mathcal{L}\big(y_i, f_\theta(x_i)\big)
$$

Gradients are computed using the **chain rule**:
$$
\frac{\partial \mathcal{L}}{\partial W^{(l)}} =
\frac{\partial \mathcal{L}}{\partial a^{(l)}}
\frac{\partial a^{(l)}}{\partial z^{(l)}}
\frac{\partial z^{(l)}}{\partial W^{(l)}}
$$

Parameters are updated via gradient descent:
$$
\theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}
$$

## Summary

A DNN is a differentiable function optimized end-to-end using calculus. Its power comes from **composition of nonlinear functions**, **derivatives**, and **efficient gradient-based optimization**.