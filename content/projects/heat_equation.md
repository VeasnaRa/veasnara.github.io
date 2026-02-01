---
title: " Heat-Equation-Simulation"
date: 2026-02-01
excerpt: "A C++ project that simulates heat diffusion in 1D (bar) and 2D (plate) implementing the finite difference method. The simulation uses SDL2 for real-time visualization with a heatmap display."
tags: [C++, heat-equation, partial-differential-equation(PDE), sdl2]
thumbnail: "/images/heat.png"
---

# Heat-Equation-Simulation

## Overview

This project simulates heat diffusion through materials using the heat equation, a fundamental partial differential equation (PDE) in physics. The simulator supports both 1D (bar) and 2D (plate) scenarios with real-time visualization of temperature distribution across four different materials simultaneously.

## Mathematical Foundation

### The Heat Equation

The heat equation models temperature distribution over time:
<p align="center">
$$
\frac{\partial u}{\partial t} = \frac{\lambda}{\rho c} \Delta u + \frac{F}{\rho c}
$$
</p>

Where:
- **u(t,x)**: Temperature [K] at time t and position x
- **α = λ/(ρc)**: Thermal diffusivity [m²/s]
- **λ**: Thermal conductivity [W/(m·K)]
- **ρ**: Density [kg/m³]
- **c**: Specific heat capacity [J/(kg·K)]
- **F**: Heat source [W/m³]

### Material Properties
The following table contains the values in international units for the materials considered in this project:

| Material | $\lambda$ (W/(m·K)) | $\rho$ (kg/m³) | $c$ (J/(kg·K)) |
|----------|---------------------|----------------|----------------|
| Copper | 389 | 8940 | 380 |
| Iron | 80.2 | 7874 | 440 |
| Glass | 1.2 | 2530 | 840 |
| Polystyrene | 0.1 | 1040 | 1200 |

### Boundary Conditions

- **Neumann** (x=0, y=0): ∂u/∂n = 0 (insulated boundary)
- **Dirichlet** (x=L, y=L): u = u₀ (fixed temperature)

## Project Objectives
The aim of this project is to implement this simulation in C++ using the finite difference method for two distinct scenarios, namely a thin bar and a thin plate, each with specific boundary conditions in the implicit case, and create an animation of the temperature solution over time with the SDL library.

**Key Features:**
- Unconditionally stable implicit scheme (Backward Euler)
- 1D Bar Simulation: Linear heat diffusion with 2 heat sources
- 2D Plate Simulation: Radial heat diffusion with 4 corner sources
- Real-time visualization at 60 FPS using SDL2
- Simultaneous 4-material comparison in 2×2 grid mode
- Complete Doxygen documentation with UML class diagram

--- 

## Numerical Methods
### 1D Case: Implicit Finite Differences + Thomas Algorithm
In this case, we're working with an infinitely thin bar ($d = 1$) of length $L$. For the bar: Neumann condition at $x = 0$ and Dirichlet condition at $x = L$.

**Mathematical preliminaries**

We have the following equation with its boundary and initial conditions:

$$
\frac{\partial u}{\partial t}
= \frac{\lambda}{\rho c}\frac{\partial^2 u}{\partial x^2}
+ \frac{F}{\rho c}
$$

$$
u(0, x) = u_0 \quad \forall x \in [0, L]
$$

$$
\frac{\partial u}{\partial x}(t, 0) = 0
\quad \forall t \in [0, t_{\max}]
$$

$$
u(t, L) = u_0
\quad \forall t \in [0, t_{\max}]
$$

#### Discretization

**Temporal discretization:**
$$\Delta t = \frac{t_{max}}{1000}, \quad t_n = n \cdot \Delta t$$

**Spatial discretization:**
$$\Delta x = \frac{L}{N-1}, \quad x_i = i \cdot \Delta x$$

#### Implicit Scheme (Backward Euler)

The backward Euler method discretizes the heat equation as:
<p align="center">
$$
-r \cdot u_{i-1}^{n+1} + (1 + 2r) \cdot u_i^{n+1} - r \cdot u_{i+1}^{n+1} = u_i^n + \Delta t \frac{F_i}{\rho c}
$$
</p>

where **r = α·Δt/Δx²** is the diffusion number.

**The heat source $F$ varies along the bar and is defined as:**
$$
F(x) = t_{\max} f^2
\quad \text{if } x \in \left[\frac{L}{10}, \frac{2L}{10}\right]
$$

$$
F(x) = \frac{3 t_{\max} f^2}{4}
\quad \text{if } x \in \left[\frac{5L}{10}, \frac{6L}{10}\right]
$$

$$
F(x) = 0
\quad \text{otherwise}
$$

#### Algorithm and Solution

We use the Tridiagonal Matrix Algorithm, also known as TDMA (TriDiagonal Matrix Algorithm), which is a direct and efficient method for solving systems of linear tridiagonal equations with an algorithmic complexity of $O(N)$.

**Thomas Algorithm (TDMA)**

For a tridiagonal system of form: 
<p align="center">
$$
a_i u_{i-1} + b_i u_i + c_i u_{i+1} = d_i
$$
</p>

**Forward sweep:**
<p align="center">
$$
c'_i = \frac{c_i}{b_i - a_i c'_{i-1}}, \quad d'_i = \frac{d_i - a_i d'_{i-1}}{b_i - a_i c'_{i-1}}
$$
</p>

**Back substitution:**
<p align="center">
$$
u_{n-1} = d'_{n-1}, \quad u_i = d'_i - c'_i u_{i+1}
$$
</p>

**1D simulation results**

| Copper| Glass| 
|------|------|
| ![](/images/heatcpp_project/cuivre.png) | ![](/images/heatcpp_project/verre.png) | 

| Iron| Polystyrene| 
|------|------|
| ![](/images/heatcpp_project/fer.png) | ![](/images/heatcpp_project/poly.png) | 

---

### 2D Case: 5-Point Stencil + Gauss-Seidel Iteration
In this case, we're working in two-dimensional space and our material is a square plate with side $L$. For the plate: Neumann condition in $x = 0$ and $y = 0$, Dirichlet condition in $x = L$ and $y = L$.

**Mathematical preliminaries**

We have the following equation with its boundary and initial conditions:
$$
\frac{\partial u}{\partial t}
= \frac{\lambda}{\rho c}
\left(
\frac{\partial^2 u}{\partial x^2}
+ \frac{\partial^2 u}{\partial y^2}
\right)
+ \frac{F}{\rho c},
\quad
\forall (t,x,y) \in [0,t_{\max}] \times [0,L]^2
$$

$$
u(0, x, y) = u_0,
\quad
\forall (x,y) \in [0,L]^2
$$

$$
\frac{\partial u}{\partial x}(t, 0, y) = 0,
\quad
\forall (t,y) \in [0,t_{\max}] \times [0,L]
$$

$$
\frac{\partial u}{\partial y}(t, x, 0) = 0,
\quad
\forall (t,x) \in [0,t_{\max}] \times [0,L]
$$

$$
u(t, L, y) = u_0,
\quad
\forall (t,y) \in [0,t_{\max}] \times [0,L]
$$

$$
u(t, x, L) = u_0,
\quad
\forall (t,x) \in [0,t_{\max}] \times [0,L]
$$

#### Discretized Form

Using a 5-point stencil, each grid point depends only on its 4 neighbors:

$$-r \cdot u_{i-1,j}^{n+1} - r \cdot u_{i,j-1}^{n+1} + (1 + 4r) \cdot u_{i,j}^{n+1} - r \cdot u_{i+1,j}^{n+1} - r \cdot u_{i,j+1}^{n+1} = u_{i,j}^n + \Delta t\frac{F_{i,j}}{\rho c}$$

The heat source $F$ is distributed symmetrically over four rectangular regions at the corners of the plate:
$$
F(x,y) = t_{\max} f^2 \times s
\quad \text{if } (x,y) \in \mathcal{R}_1 \cup \mathcal{R}_2 \cup \mathcal{R}_3 \cup \mathcal{R}_4
$$

$$
F(x,y) = 0
\quad \text{otherwise}
$$

$$
\mathcal{R}_1
= \left[\frac{L}{6}, \frac{2L}{6}\right]
\times
\left[\frac{L}{6}, \frac{2L}{6}\right]
$$

$$
\mathcal{R}_2
= \left[\frac{4L}{6}, \frac{5L}{6}\right]
\times
\left[\frac{L}{6}, \frac{2L}{6}\right]
$$

$$
\mathcal{R}_3
= \left[\frac{L}{6}, \frac{2L}{6}\right]
\times
\left[\frac{4L}{6}, \frac{5L}{6}\right]
$$

$$
\mathcal{R}_4
= \left[\frac{4L}{6}, \frac{5L}{6}\right]
\times
\left[\frac{4L}{6}, \frac{5L}{6}\right]
$$

#### Gauss-Seidel Method

**Update formula:**

$$u_{i,j}^{new} = \frac{1}{1 + 4r} \left[ u_{i,j}^n + \Delta t \frac{F_{i,j}}{\rho c} + r(u_{i-1,j} + u_{i+1,j} + u_{i,j-1} + u_{i,j+1}) \right]$$

**Convergence criterion:**
<p align="center">
$$
\max_{i,j} |u_{i,j}^{(k+1)} - u_{i,j}^{(k)}| < \varepsilon = 10^{-6}
$$
</p>
Typically converges in less than 20 iterations for the heat equation.

**Advantages of the Gauss–Seidel Method**
- **Memory efficiency**: No need to store the full $$N^2 \times N^2$$ matrix
- **Ease of implementation**: Local update of each grid point
- **Efficiency**: Fast convergence for systems arising from the discretization of the heat equation
- **Flexibility**: Easy to adapt to different boundary conditions

**2D simulation results**

| Copper| Glass| 
|------|------|
| ![](/images/heatcpp_project/cuivre2d.png) | ![](/images/heatcpp_project/verre2d.png) | 

| Iron| Polystyrene| 
|------|------|
| ![](/images/heatcpp_project/fer2d.png) | ![](/images/heatcpp_project/poly2d.png) | 

--- 

## Code implementation(C++)

### Project Structure

This section describes the internal organization of the project and how the heat equation simulation features are implemented in C++ using a modular design.
```
heat-equation-simulator/
├── heat_equation_solver.hpp/cpp  # Numerical solvers (1D/2D)
├── material.hpp                  # Material properties
├── sdl_core.hpp/cpp              # SDL initialization
├── sdl_window.hpp/cpp            # Window management
├── sdl_heatmap.hpp/cpp           # Visualization engine
├── sdl_app.hpp/cpp               # Application controller
├── main.cpp                      # Entry point & menu
├── Doxyfile                      # Documentation config
├── uml_diagram.plantuml          # Class diagram source
├── rapport_PAP.pdf               # Report detail about the project
└── README.md                     # This file
```

### Project Repository

You can access the complete source code and all project files  and UML class diagram and documentation on GitHub by just click link below:
[![GitHub](https://img.shields.io/badge/GitHub-Heat--Equation--Simulation-181717?logo=github&logoColor=white)](https://github.com/VeasnaRa/Heat-Equation-Simulation)


### Heat equation solver (1D & 2D) module
`heat_equation_solver.hpp`
```cpp
/**
 * @file heat_equation_solver.hpp
 * @brief 1D and 2D heat equation solvers using implicit finite differences.
 *
 * This module provides numerical solvers for the heat equation:
 * @f[
 *   \frac{\partial u}{\partial t} = \alpha \nabla^2 u + \frac{F}{\rho c}
 * @f]
 *
 * where:
 * - u(x,t) is the temperature [K]
 * - α = λ / (ρc) is the thermal diffusivity [m²/s]
 * - λ is the thermal conductivity [W/(m·K)]
 * - ρ is the density [kg/m³]
 * - c is the specific heat capacity [J/(kg·K)]
 * - F is a volumetric heat source [W/m³]
 *
 * Numerical methods:
 * - 1D: Backward Euler implicit scheme solved with Thomas algorithm
 * - 2D: Backward Euler implicit scheme solved with Gauss–Seidel iterations
 *
 * Boundary conditions:
 * - Neumann (zero flux) on left/bottom boundaries
 * - Dirichlet (fixed temperature) on right/top boundaries
 */

#ifndef HEAT_EQUATION_SOLVER_HPP
#define HEAT_EQUATION_SOLVER_HPP

#include "material.hpp"
#include <vector>

namespace ensiie {

/**
 * @class HeatEquationSolver1D
 * @brief Implicit finite difference solver for the 1D heat equation.
 *
 * Solves the heat equation on the domain x ∈ [0, L] using a backward
 * Euler time discretization and centered finite differences in space.
 *
 * The resulting tridiagonal linear system is solved using the Thomas
 * algorithm with O(n) complexity.
 *
 * Boundary conditions:
 * - Neumann condition (∂u/∂x = 0) at x = 0
 * - Dirichlet condition (u = u₀) at x = L
 */
class HeatEquationSolver1D {
private:
    Material mat_;        /**< Material properties (λ, ρ, c) */
    double L_;            /**< Length of the 1D domain */
    double tmax_;         /**< Maximum simulation time */
    double dx_;           /**< Spatial discretization step */
    double dt_;           /**< Time discretization step */
    double u0_kelvin_;    /**< Initial temperature (Kelvin) */
    double t_;            /**< Current simulation time */
    int n_;               /**< Number of grid points */

    std::vector<double> u_; /**< Temperature field */
    std::vector<double> F_; /**< Heat source term */

    /**
     * @brief Initialize the spatial heat source.
     * @param f Source amplitude.
     */
    void init_source(double f);

    /**
     * @brief Solve a tridiagonal linear system using the Thomas algorithm.
     *
     * @param a Sub-diagonal coefficients
     * @param b Main diagonal coefficients
     * @param c Super-diagonal coefficients
     * @param d Right-hand side vector
     * @param x Solution vector
     */
    void solve_tridiagonal(
        const std::vector<double>& a,
        const std::vector<double>& b,
        const std::vector<double>& c,
        std::vector<double>& d,
        std::vector<double>& x
    );

public:
    /**
     * @brief Construct a 1D heat equation solver.
     *
     * @param mat Material properties
     * @param L Length of the domain
     * @param tmax Maximum simulation time
     * @param u0 Initial temperature (°C)
     * @param f Heat source amplitude
     * @param n Number of spatial grid points
     */
    HeatEquationSolver1D(
        const Material& mat,
        double L,
        double tmax,
        double u0,
        double f,
        int n
    );

    /**
     * @brief Advance the solution by one time step.
     * @return false if the final time is reached
     */
    bool step();

    /**
     * @brief Get the current temperature field.
     */
    const std::vector<double>& get_temperature() const { return u_; }

    /**
     * @brief Get the current simulation time.
     */
    double get_time() const { return t_; }

    /**
     * @brief Get the number of grid points.
     */
    int get_n() const { return n_; }

    /**
     * @brief Reset the solver to the initial state (t=0, u=u0)
     */
    void reset();
};


/**
 * @class HeatEquationSolver2D
 * @brief Implicit finite difference solver for the 2D heat equation.
 *
 * Solves the heat equation on a square domain [0, L]² using a five-point
 * stencil and a backward Euler time discretization.
 *
 * The implicit system is solved using Gauss–Seidel iterations.
 *
 * Boundary conditions:
 * - Neumann condition on left and bottom boundaries
 * - Dirichlet condition on right and top boundaries
 */
class HeatEquationSolver2D {
private:
    Material mat_;        /**< Material properties */
    double L_;            /**< Domain size */
    double tmax_;         /**< Maximum simulation time */
    double dx_;           /**< Spatial step */
    double dt_;           /**< Time step */
    double u0_kelvin_;    /**< Initial temperature in Kelvin */
    double t_;            /**< Current time */
    int n_;               /**< Grid points per dimension */

    std::vector<double> u_; /**< Temperature field (row-major) */
    std::vector<double> F_; /**< Heat source */

    /**
     * @brief Convert 2D indices to 1D index.
     */
    int idx(int i, int j) const { return j * n_ + i; }

    /**
     * @brief Initialize the 2D heat source.
     */
    void init_source(double f);

public:
    /**
     * @brief Construct a 2D heat equation solver.
     */
    HeatEquationSolver2D(
        const Material& mat,
        double L,
        double tmax,
        double u0,
        double f,
        int n
    );

    /**
     * @brief Advance one step using Gauss-Seidel iteration
     */
    bool step();

    /**
     * @brief Get temperature at grid point (i,j).
     */
    double get_temperature(int i, int j) const { return u_[idx(i, j)]; }

    /**
     * @brief Get the full temperature field as a 2D array.
     */
    std::vector<std::vector<double>> get_temperature_2d() const;
    double get_time() const { return t_; }
    double get_tmax() const { return tmax_; }
    int get_n() const { return n_; }

    /**
     * @brief Reset the solver to the initial state.
     */
    void reset();
};

} // namespace ensiie

#endif
```

`heat_equation_solver.cpp`
```cpp
/**
 * @file heat_equation_solver.cpp
 * @brief Implementation of implicit heat equation solvers (1D and 2D).
 */

#include "heat_equation_solver.hpp"
#include <cmath>
#include <algorithm>

/// Conversion from Celsius to Kelvin
constexpr double KELVIN_OFFSET = 273.15;

namespace ensiie {

// =============================================================================
// 1D SOLVER IMPLEMENTATION
// =============================================================================

HeatEquationSolver1D::HeatEquationSolver1D(
    const Material& mat,
    double L,
    double tmax,
    double u0,
    double f,
    int n
)
    : mat_(mat)
    , L_(L)
    , tmax_(tmax)
    , dx_(L / (n - 1))
    , dt_(tmax / 1000.0)
    , u0_kelvin_(u0 + KELVIN_OFFSET)
    , t_(0.0)
    , n_(n)
    , u_(n, u0_kelvin_)
    , F_(n, 0.0)
{
    init_source(f);
}

void HeatEquationSolver1D::init_source(double f) {
    // Source regions: [L/10, 2L/10] and [5L/10, 6L/10]
    // F(x) = tmax * f^2 according to PDF
    double f1 = tmax_ * f * f;
    double f2 = 0.75 * tmax_ * f * f;

    // Scale factor to make heat propagation visible
    double scale = 100.0;  // Amplification factor for visualization

    for (int i = 0; i < n_; i++) {
        double x = i * dx_;
        if (x >= L_ / 10.0 && x <= 2.0 * L_ / 10.0) {
            F_[i] = f1 * scale;
        } else if (x >= 5.0 * L_ / 10.0 && x <= 6.0 * L_ / 10.0) {
            F_[i] = f2 * scale;
        } else {
            F_[i] = 0.0;
        }
    }
}

bool HeatEquationSolver1D::step() {
    if (t_ >= tmax_) return false;

    // Implicit scheme coefficients
    double alpha = mat_.alpha();
    double r = alpha * dt_ / (dx_ * dx_);
    double coef = dt_ / (mat_.rho * mat_.c);

    std::vector<double> a(n_, -r);
    std::vector<double> b(n_, 1.0 + 2.0 * r);
    std::vector<double> c(n_, -r);
    std::vector<double> d(n_);

    // RHS
    for (int i = 0; i < n_; i++) {
        d[i] = u_[i] + coef * F_[i];
    }

    // Neumann boundary condition at x = 0
    b[0] = 1.0 + r;
    c[0] = -r;

    // Dirichlet boundary condition at x = L
    b[n_ - 1] = 1.0;
    a[n_ - 1] = 0.0;
    c[n_ - 1] = 0.0;
    d[n_ - 1] = u0_kelvin_;

    std::vector<double> u_new(n_);
    solve_tridiagonal(a, b, c, d, u_new);

    u_ = u_new;
    t_ += dt_;
    return true;
}

void HeatEquationSolver1D::solve_tridiagonal(
    const std::vector<double>& a,
    const std::vector<double>& b,
    const std::vector<double>& c,
    std::vector<double>& d,
    std::vector<double>& x
) 
{
    // Thomas algorithm (TDMA)
    int n = static_cast<int>(b.size());
    std::vector<double> c_prime(n);
    std::vector<double> d_prime(n);

    // Forward elimination
    c_prime[0] = c[0] / b[0];
    d_prime[0] = d[0] / b[0];

    for (int i = 1; i < n; i++) {
        double denom = b[i] - a[i] * c_prime[i - 1];
        c_prime[i] = c[i] / denom;
        d_prime[i] = (d[i] - a[i] * d_prime[i - 1]) / denom;
    }

    // Back substitution
    x[n - 1] = d_prime[n - 1];
    for (int i = n - 2; i >= 0; --i) {
        x[i] = d_prime[i] - c_prime[i] * x[i + 1];
    }
}

void HeatEquationSolver1D::reset() {
    t_ = 0.0;
    std::fill(u_.begin(), u_.end(), u0_kelvin_);
}


// =============================================================================
// 2D SOLVER IMPLEMENTATION
// =============================================================================

HeatEquationSolver2D::HeatEquationSolver2D(
    const Material& mat,
    double L,
    double tmax,
    double u0,
    double f,
    int n
)
    : mat_(mat)
    , L_(L)
    , tmax_(tmax)
    , dx_(L / (n - 1))
    , dt_(tmax / 1000.0)
    , u0_kelvin_(u0 + KELVIN_OFFSET)
    , t_(0.0)
    , n_(n)
    , u_(n * n, u0_kelvin_)
    , F_(n * n, 0.0)
{
    init_source(f);
}

void HeatEquationSolver2D::init_source(double f) {
    // Four symmetric sources at corners
    // F(x,y) = tmax * f^2 according to PDF
    double f_val = tmax_ * f * f;

    // Scale factor to make heat propagation visible
    double scale = 100.0;  // Amplification factor for visualization

    for (int j = 0; j < n_; j++) {
        for (int i = 0; i < n_; i++) {
            double x = i * dx_;
            double y = j * dx_;

            bool in_source = false;

            // Bottom-left
            if (x >= L_/6.0 && x <= 2.0*L_/6.0 && y >= L_/6.0 && y <= 2.0*L_/6.0)
                in_source = true;
            // Bottom-right
            if (x >= 4.0*L_/6.0 && x <= 5.0*L_/6.0 && y >= L_/6.0 && y <= 2.0*L_/6.0)
                in_source = true;
            // Top-left
            if (x >= L_/6.0 && x <= 2.0*L_/6.0 && y >= 4.0*L_/6.0 && y <= 5.0*L_/6.0)
                in_source = true;
            // Top-right
            if (x >= 4.0*L_/6.0 && x <= 5.0*L_/6.0 && y >= 4.0*L_/6.0 && y <= 5.0*L_/6.0)
                in_source = true;

            F_[idx(i, j)] = in_source ? (f_val * scale) : 0.0;
        }
    }
}

bool HeatEquationSolver2D::step() {
    if (t_ >= tmax_) return false;

    // Implicit scheme with 5-point stencil
    double alpha = mat_.alpha();
    double r = alpha * dt_ / (dx_ * dx_);
    double src_coef = dt_ / (mat_.rho * mat_.c);

    std::vector<double> u_new = u_;

    // Gauss-Seidel parameters
    const int max_iter = 100;
    const double tol = 1e-6;

    for (int iter = 0; iter < max_iter; iter++) {
        double max_diff = 0.0;

        for (int j = 0; j < n_; ++j) {
            for (int i = 0; i < n_; ++i) {
                // Dirichlet BC at right and top edges
                if (i == n_ - 1 || j == n_ - 1) {
                    u_new[idx(i, j)] = u0_kelvin_;
                    continue;
                }

                double old_val = u_new[idx(i, j)];

                // Neighbors with Neumann BC (mirror at i=0, j=0)
                double u_left  = (i > 0) ? u_new[idx(i-1, j)] : u_new[idx(1, j)];
                double u_right = u_new[idx(i+1, j)];
                double u_down  = (j > 0) ? u_new[idx(i, j-1)] : u_new[idx(i, 1)];
                double u_up    = u_new[idx(i, j+1)];

                double rhs = u_[idx(i, j)] + src_coef * F_[idx(i, j)];
                u_new[idx(i, j)] = (rhs + r * (u_left + u_right + u_down + u_up)) / (1.0 + 4.0 * r);

                max_diff = std::max(max_diff, std::abs(u_new[idx(i, j)] - old_val));
            }
        }

        if (max_diff < tol) break;
    }

    u_ = u_new;
    t_ += dt_;
    return true;
}

std::vector<std::vector<double>> HeatEquationSolver2D::get_temperature_2d() const {
    std::vector<std::vector<double>> result(n_, std::vector<double>(n_));
    for (int j = 0; j < n_; j++) {
        for (int i = 0; i < n_; i++) {
            result[j][i] = u_[idx(i, j)];
        }
    }
    return result;
}

void HeatEquationSolver2D::reset() {
    t_ = 0.0;
    std::fill(u_.begin(), u_.end(), u0_kelvin_);
}

} // namespace ensiie
```

`material.hpp `
```cpp
/**
 * @file material.hpp
 * @brief Definition of physical material properties for heat simulations.
 */

#ifndef MATERIAL_HPP
#define MATERIAL_HPP

#include <string>

namespace ensiie {
/**
 * @struct Material
 * @brief Physical properties of a material used in heat simulations.
 */
struct Material {
    std::string name;    ///< Material name
    double lambda;       ///< Thermal conductivity W/(mK)
    double rho;          ///< Density kg/m^{3}
    double c;            ///< Specific heat J/(kgK)

    /**
     * @brief Compute thermal diffusivity.
     * @return Thermal diffusivity α = λ / (ρc) in m²/s
     */
    double alpha() const { return lambda / (rho * c); }
};

/**
 * @namespace Materials
 * @brief Predefined common materials.
 */
namespace Materials {
    const Material COPPER      = {"Cuivre",      389.0, 8940.0,  380.0};
    const Material IRON        = {"Fer",          80.2, 7874.0,  440.0};
    const Material GLASS       = {"Verre",         1.2, 2530.0,  840.0};
    const Material POLYSTYRENE = {"Polystyrène",   0.1, 1040.0, 1200.0};
}

} // namespace ensiie

#endif
```

### SDL Initialization Module
`sdl_core.hpp`
```cpp
/**
 * @file sdl_core.hpp
 * @brief SDL2 initialization and event handling wrapper.
 *
 * This module provides a minimal RAII-style wrapper around SDL2
 * initialization, shutdown, and event polling.
 */

#ifndef SDL_CORE_HPP
#define SDL_CORE_HPP

#include <SDL.h>
#include <string>
#include <stdexcept>

namespace sdl {
/**
 * @class SDLException
 * @brief Exception thrown when an SDL error occurs
 */
class SDLException : public std::runtime_error {
public:
    /**
     * @brief Construct an SDL exception with SDL error message
     * @param msg Custom error message
     */
    explicit SDLException(const std::string& msg)
        : std::runtime_error(msg + ": " + SDL_GetError()) {}
};

/**
 * @class SDLCore
 * @brief Static wrapper for SDL initialization and event handling
 */
class SDLCore {
private:
    static bool initialized_; ///< SDL initialization state

public:
    /**
     * @brief Initialize SDL
     * @param flag SDL initialization flags (default: SDL_INIT_VIDEO)
     */
    static void init(Uint32 flag = SDL_INIT_VIDEO);

    /**
     * @brief Quit SDL properly
     */
    static void quit();

    /**
     * @brief Poll SDL events and detect quit request
     * @return true if user wants to quit
     */
    static bool poll_quit();

    /**
     * @brief Delay execution
     * @param ms Milliseconds to wait
     */
    static void delay(Uint32 ms);

    /**
     * @brief Check if SDL is initialized
     * @return true if initialized
     */
    static bool is_initialized() { return initialized_; }
};

}

#endif
```

`sdl_core.cpp`
```cpp
/**
 * @file sdl_core.cpp
 * @brief Implementation of SDL2 core utilities.
 */

#include "sdl_core.hpp"

namespace sdl {

bool SDLCore::initialized_ = false;

void SDLCore::init(Uint32 flag) {
    if (!initialized_) {
        if (SDL_Init(flag) < 0) {
            throw SDLException("SDL_Init failed");
        }
        initialized_ = true;
    }
}

void SDLCore::quit() {
    if (initialized_) {
        SDL_Quit();
        initialized_ = false;
    }
}

bool SDLCore::poll_quit() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_QUIT) return true;
        if (event.type == SDL_KEYDOWN) {
            if (event.key.keysym.sym == SDLK_ESCAPE) return true;
            if (event.key.keysym.sym == SDLK_q) return true;
        }
    }
    return false;
}

void SDLCore::delay(Uint32 ms) {
    SDL_Delay(ms);
}

}
```

### SDL Window Management Module
`sdl_window.hpp`
```cpp
/**
 * @file sdl_window.hpp
 * @brief SDL2 window and renderer wrapper
 */

#ifndef SDL_WINDOW_HPP
#define SDL_WINDOW_HPP

#include "SDL.h"
#include <string>

namespace sdl {

/**
 * @class SDLWindow
 * @brief Encapsulates an SDL window and renderer.
 *
 * This class manages the lifetime of an SDL_Window and SDL_Renderer.
 * It provides helper methods for clearing, presenting, fullscreen
 * toggling, and window title management.
 */
class SDLWindow {
private:
    SDL_Window* window_;     ///< SDL window handle
    SDL_Renderer* renderer_; ///< SDL renderer handle
    int width_;              ///< Window width in pixels
    int height_;             ///< Window height in pixels
    bool fullscreen_;        ///< Fullscreen state

public:
    /**
     * @brief Construct an SDL window and renderer.
     * @param title Window title
     * @param width Window width in pixels
     * @param height Window height in pixels
     * @param fullscreen Whether to start in fullscreen mode
     */
    SDLWindow(const std::string& title, int width, int height, bool fullscreen = false);

    /**
     * @brief Destroy the SDL window and renderer.
     */
    ~SDLWindow();

    SDLWindow(const SDLWindow&) = delete;
    SDLWindow& operator=(const SDLWindow&) = delete;

    /**
     * @brief Clear the window with a given color.
     * @param r Red component (0–255)
     * @param g Green component (0–255)
     * @param b Blue component (0–255)
     */
    void clear(Uint8 r = 0, Uint8 g = 0, Uint8 b = 0);

    /**
     * @brief Present the rendered frame on screen.
     */   
    void present();

    /**
     * @brief Change the window title.
     * @param title New window title
     */
    void set_title(const std::string& title);

    /**
     * @brief Toggle fullscreen mode.
     */
    void toggle_fullscreen();

    /**
     * @brief Check if the window is in fullscreen mode.
     */
    bool is_fullscreen() const { return fullscreen_; }

    /**
     * @brief Get the underlying SDL window.
     */
    SDL_Window* get_window() const { return window_; }

    /**
     * @brief Get the SDL renderer.
     */
    SDL_Renderer* get_renderer() const { return renderer_; }

    /**
     * @brief Get window width.
     */
    int get_width() const { return width_; }
    
    /**
     * @brief Get window height.
     */
    int get_height() const { return height_; }
};

}

#endif
```

`sdl_window.cpp`
```cpp
/**
 * @file sdl_window.cpp
 * @brief SDL2 window implementation
 */

#include "sdl_window.hpp"
#include "sdl_core.hpp"

namespace sdl {

SDLWindow::SDLWindow(const std::string& title, int width, int height, bool fullscreen)
    : window_(nullptr)
    , renderer_(nullptr)
    , width_(width)
    , height_(height)
    , fullscreen_(fullscreen)
{
    Uint32 flags = SDL_WINDOW_SHOWN;

    // If width/height are 0, use maximized window
    if (width == 0 || height == 0) {
        flags |= SDL_WINDOW_MAXIMIZED | SDL_WINDOW_RESIZABLE;
        // Get display bounds for initial size
        SDL_DisplayMode dm;
        SDL_GetCurrentDisplayMode(0, &dm);
        width  = dm.w;
        height = dm.h;
    }

    window_ = SDL_CreateWindow(
        title.c_str(),
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED,
        width,
        height,
        flags
    );

    if (!window_) {
        throw SDLException("SDL_CreateWindow failed");
    }

    if (fullscreen_) {
        SDL_SetWindowFullscreen(window_, SDL_WINDOW_FULLSCREEN_DESKTOP);
    }

    // Get actual window size
    SDL_GetWindowSize(window_, &width_, &height_);

    renderer_ = SDL_CreateRenderer(
        window_, -1,
        SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC
    );

    if (!renderer_) {
        SDL_DestroyWindow(window_);
        throw SDLException("SDL_CreateRenderer failed");
    }
}

SDLWindow::~SDLWindow() {
    if (renderer_) SDL_DestroyRenderer(renderer_);
    if (window_) SDL_DestroyWindow(window_);
}

void SDLWindow::clear(Uint8 r, Uint8 g, Uint8 b) {
    SDL_SetRenderDrawColor(renderer_, r, g, b, 255);
    SDL_RenderClear(renderer_);
}

void SDLWindow::present() {
    SDL_RenderPresent(renderer_);
}

void SDLWindow::set_title(const std::string& title) {
    SDL_SetWindowTitle(window_, title.c_str());
}

void SDLWindow::toggle_fullscreen() {
    fullscreen_ = !fullscreen_;
    SDL_SetWindowFullscreen(window_, fullscreen_ ? SDL_WINDOW_FULLSCREEN : 0);
    SDL_GetWindowSize(window_, &width_, &height_);
}

}
```


### SDL Visualization Engine Module
`sdl_heatmap.hpp`
```cpp
/**
 * @file sdl_heatmap.hpp
 * @brief Temperature visualization using Inferno colormap
 */

#ifndef SDL_HEATMAP_HPP
#define SDL_HEATMAP_HPP

#include "sdl_window.hpp"
#include <vector>
#include <string>

namespace sdl {

/**
 * @brief Runtime simulation metadata for display
 * 
 * This structure contains all necessary information to display
 * simulation status and material properties in the visualization.
 */
struct SimInfo {
    std::string material_name;  ///< Name of the material being simulated
    double alpha;               ///< Thermal diffusivity [m²/s]
    double time;                ///< Current simulation time [s]
    double tmax;                ///< Maximum simulation time [s]
    double L;                   ///< Domain length [m]
    double u0;                  ///< Boundary temperature [K]
    int speed;                  ///< Simulation speed multiplier
    bool paused;                ///< Simulation pause state
};

/**
 * @class SDLHeatmap
 * @brief Fullscreen temperature visualization
 *
 * Uses Inferno colormap (perceptually uniform).
 * 2D uses bilinear interpolation for smooth gradients.
 */
class SDLHeatmap {
private:
    SDLWindow& win_;  ///< Reference to SDL window
    double t_min_;    ///< Minimum temperature for colormap scaling [K]
    double t_max_;    ///< Maximum temperature for colormap scaling [K]

    /**
     * @brief Convert temperature to RGB color using Inferno colormap
     * @param t Temperature value to convert [K]
     * @param r Output red component (0-255)
     * @param g Output green component (0-255)
     * @param b Output blue component (0-255)
     */
    void temp_to_rgb(double t, Uint8& r, Uint8& g, Uint8& b) const;

    /**
     * @brief Draw a numerical value at specified position
     * @param rend SDL renderer
     * @param x X coordinate in pixels
     * @param y Y coordinate in pixels
     * @param value Numerical value to display
     */
    void draw_number(SDL_Renderer* rend, int x, int y, double value) const;

    /**
     * @brief Draw text string at specified position
     * @param rend SDL renderer
     * @param x X coordinate in pixels
     * @param y Y coordinate in pixels
     * @param text C-string to display
     */
    void draw_text(SDL_Renderer* rend, int x, int y, const char* text) const;

    /**
     * @brief Draw vertical colorbar legend
     * @param rend SDL renderer
     * @param x X coordinate of top-left corner
     * @param y Y coordinate of top-left corner
     * @param w Width in pixels
     * @param h Height in pixels
     */
    void draw_colorbar(SDL_Renderer* rend, int x, int y, int w, int h) const;

    /**
     * @brief Draw information panel with simulation metadata
     * @param rend SDL renderer
     * @param info Simulation information to display
     */
    void draw_info_panel(SDL_Renderer* rend, const SimInfo& info) const;

    /**
     * @brief Draw grid lines for spatial reference
     * @param rend SDL renderer
     * @param x0 Starting X coordinate
     * @param y0 Starting Y coordinate
     * @param w Grid width in pixels
     * @param h Grid height in pixels
     * @param nx Number of vertical grid lines
     * @param ny Number of horizontal grid lines
     */
    void draw_grid(SDL_Renderer* rend, int x0, int y0, int w, int h, int nx, int ny) const;

public:
    /**
     * @brief Construct heatmap visualizer
     * @param win Reference to SDL window for rendering
     * @param t_min Initial minimum temperature for scaling [K]
     * @param t_max Initial maximum temperature for scaling [K]
     */
    SDLHeatmap(SDLWindow& win, double t_min, double t_max);

    /**
     * @brief Manually set temperature range for colormap scaling
     * @param t_min Minimum temperature [K]
     * @param t_max Maximum temperature [K]
     */
    void set_range(double t_min, double t_max);

    /**
     * @brief Automatically determine range from 1D temperature data
     * @param temps Vector of temperature values [K]
     */
    void auto_range(const std::vector<double>& temps);

    /**
     * @brief Automatically determine range from 2D temperature data
     * @param temps 2D vector of temperature values [K]
     */
    void auto_range_2d(const std::vector<std::vector<double>>& temps);

    /**
     * @brief Draw 1D temperature distribution in fullscreen mode
     * @param temps Vector of temperature values [K]
     * @param info Simulation metadata for display
     */
    void draw_1d_fullscreen(const std::vector<double>& temps, const SimInfo& info);

    /**
     * @brief Draw 2D temperature distribution in fullscreen mode
     * @param temps 2D grid of temperature values [K]
     * @param info Simulation metadata for display
     */
    void draw_2d_fullscreen(const std::vector<std::vector<double>>& temps, const SimInfo& info);

    /**
     * @brief Draw 1D temperature distribution in a grid cell (2x2 mode)
     * @param temps Vector of temperature values [K]
     * @param info Simulation metadata for display
     * @param cell_x X coordinate of cell top-left corner
     * @param cell_y Y coordinate of cell top-left corner
     * @param cell_w Cell width in pixels
     * @param cell_h Cell height in pixels
     */
    void draw_1d_cell(const std::vector<double>& temps, const SimInfo& info,
                      int cell_x, int cell_y, int cell_w, int cell_h);

    /**
     * @brief Draw 2D temperature distribution in a grid cell (2x2 mode)
     * @param temps 2D grid of temperature values [K]
     * @param info Simulation metadata for display
     * @param cell_x X coordinate of cell top-left corner
     * @param cell_y Y coordinate of cell top-left corner
     * @param cell_w Cell width in pixels
     * @param cell_h Cell height in pixels
     */
    void draw_2d_cell(const std::vector<std::vector<double>>& temps, const SimInfo& info,
                      int cell_x, int cell_y, int cell_w, int cell_h);

    /**
     * @brief Get current minimum temperature of colormap range
     * @return Minimum temperature [K]
     */
    double get_min() const { return t_min_; }

    /**
     * @brief Get current maximum temperature of colormap range
     * @return Maximum temperature [K]
     */
    double get_max() const { return t_max_; }
};

}

#endif
```

`sdl_heatmap.cpp`
```cpp
/**
 * @file sdl_heatmap.cpp
 * @brief Temperature visualization implementation
 */

#include "sdl_heatmap.hpp"
#include <algorithm>
#include <cmath>

namespace sdl {

// Helper: 7-segment digit rendering
static void draw_digit(SDL_Renderer* rend, int x, int y, int digit) {
    static const bool segments[10][7] = {
        {1,1,1,1,1,1,0}, // 0
        {0,1,1,0,0,0,0}, // 1
        {1,1,0,1,1,0,1}, // 2
        {1,1,1,1,0,0,1}, // 3
        {0,1,1,0,0,1,1}, // 4
        {1,0,1,1,0,1,1}, // 5
        {1,0,1,1,1,1,1}, // 6
        {1,1,1,0,0,0,0}, // 7
        {1,1,1,1,1,1,1}, // 8
        {1,1,1,1,0,1,1}  // 9
    };

    const int w = 4;
    const int h = 5;

    if (segments[digit][0]) SDL_RenderDrawLine(rend, x, y, x+w, y);
    if (segments[digit][1]) SDL_RenderDrawLine(rend, x+w, y, x+w, y+h);
    if (segments[digit][2]) SDL_RenderDrawLine(rend, x+w, y+h, x+w, y+2*h);
    if (segments[digit][3]) SDL_RenderDrawLine(rend, x, y+2*h, x+w, y+2*h);
    if (segments[digit][4]) SDL_RenderDrawLine(rend, x, y+h, x, y+2*h);
    if (segments[digit][5]) SDL_RenderDrawLine(rend, x, y, x, y+h);
    if (segments[digit][6]) SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
}

// Helper: Letter rendering upper case
static void draw_letter(SDL_Renderer* rend, int x, int y, char c) {
    const int w = 4;
    const int h = 10;
    switch (c) {
        case 'A':
            SDL_RenderDrawLine(rend, x, y+h, x+w/2, y);
            SDL_RenderDrawLine(rend, x+w/2, y, x+w, y+h);
            SDL_RenderDrawLine(rend, x+1, y+h/2, x+w-1, y+h/2);
            break;
        case 'C':
            SDL_RenderDrawLine(rend, x+w, y, x, y);
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            break;
        case 'D':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w-1, y+2);
            SDL_RenderDrawLine(rend, x+w-1, y+2, x+w-1, y+h-2);
            SDL_RenderDrawLine(rend, x+w-1, y+h-2, x, y+h);
            break;
        case 'E':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x, y+h/2, x+w-1, y+h/2);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            break;
        case 'F':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x, y+h/2, x+w-1, y+h/2);
            break;
        case 'G':
            SDL_RenderDrawLine(rend, x+w, y+1, x+1, y);
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y+h, x+w, y+h/2);
            SDL_RenderDrawLine(rend, x+w, y+h/2, x+w/2, y+h/2);
            break;
        case 'I':
            SDL_RenderDrawLine(rend, x+w/2, y, x+w/2, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            break;
        case 'K':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x+w, y, x, y+h/2);
            SDL_RenderDrawLine(rend, x, y+h/2, x+w, y+h);
            break;
        case 'L':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            break;
        case 'M':
            SDL_RenderDrawLine(rend, x, y+h, x, y);
            SDL_RenderDrawLine(rend, x, y, x+w/2, y+h/3);
            SDL_RenderDrawLine(rend, x+w/2, y+h/3, x+w, y);
            SDL_RenderDrawLine(rend, x+w, y, x+w, y+h);
            break;
        case 'N':
            SDL_RenderDrawLine(rend, x, y+h, x, y);
            SDL_RenderDrawLine(rend, x, y, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y+h, x+w, y);
            break;
        case 'O':
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x+w, y, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y+h, x, y+h);
            SDL_RenderDrawLine(rend, x, y+h, x, y);
            break;
        case 'P':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x+w, y, x+w, y+h/2);
            SDL_RenderDrawLine(rend, x+w, y+h/2, x, y+h/2);
            break;
        case 'R':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x+w, y, x+w, y+h/2);
            SDL_RenderDrawLine(rend, x+w, y+h/2, x, y+h/2);
            SDL_RenderDrawLine(rend, x+w/2, y+h/2, x+w, y+h);
            break;
        case 'S':
            SDL_RenderDrawLine(rend, x+w, y, x, y);
            SDL_RenderDrawLine(rend, x, y, x, y+h/2);
            SDL_RenderDrawLine(rend, x, y+h/2, x+w, y+h/2);
            SDL_RenderDrawLine(rend, x+w, y+h/2, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y+h, x, y+h);
            break;
        case 'T':
            SDL_RenderDrawLine(rend, x, y, x+w, y);
            SDL_RenderDrawLine(rend, x+w/2, y, x+w/2, y+h);
            break;
        case 'U':
            SDL_RenderDrawLine(rend, x, y, x, y+h);
            SDL_RenderDrawLine(rend, x, y+h, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y+h, x+w, y);
            break;
        case 'V':
            SDL_RenderDrawLine(rend, x, y, x+w/2, y+h);
            SDL_RenderDrawLine(rend, x+w/2, y+h, x+w, y);
            break;
        case 'X':
            SDL_RenderDrawLine(rend, x, y, x+w, y+h);
            SDL_RenderDrawLine(rend, x+w, y, x, y+h);
            break;
        case 'Y':
            SDL_RenderDrawLine(rend, x, y, x+w/2, y+h/2);
            SDL_RenderDrawLine(rend, x+w, y, x+w/2, y+h/2);
            SDL_RenderDrawLine(rend, x+w/2, y+h/2, x+w/2, y+h);
            break;
        default:
            // Unknown letter - draw rectangle
            SDL_Rect r = {x, y, w, h};
            SDL_RenderDrawRect(rend, &r);
            break;
    }
}

SDLHeatmap::SDLHeatmap(SDLWindow& win, double t_min, double t_max)
    : win_(win), t_min_(t_min), t_max_(t_max) {}

void SDLHeatmap::set_range(double t_min, double t_max) {
    t_min_ = t_min;
    t_max_ = t_max;
}

void SDLHeatmap::auto_range(const std::vector<double>& temps) {
    if (temps.empty()) return;
    auto minmax     = std::minmax_element(temps.begin(), temps.end());
    double margin   = (*minmax.second - *minmax.first) * 0.05;
    t_min_ = *minmax.first - margin;
    t_max_ = *minmax.second + margin;
    if (t_max_ - t_min_ < 1.0) {
        t_min_ -= 0.5;
        t_max_ += 0.5;
    }
}

void SDLHeatmap::auto_range_2d(const std::vector<std::vector<double>>& temps) {
    if (temps.empty()) return;
    double min_v = temps[0][0];
    double max_v = temps[0][0];
    for (const auto& row : temps) {
        for (double v : row) {
            min_v = std::min(min_v, v);
            max_v = std::max(max_v, v);
        }
    }
    double margin = (max_v - min_v) * 0.05;
    t_min_ = min_v - margin;
    t_max_ = max_v + margin;
    if (t_max_ - t_min_ < 1.0) {
        t_min_ -= 0.5;
        t_max_ += 0.5;
    }
}

// Inferno colormap (matplotlib)
static const int INFERNO_SIZE = 256;
static const unsigned char INFERNO_MAP[256][3] = {
    {0,0,4},{1,0,5},{1,1,6},{1,1,8},{2,1,10},{2,2,12},{2,2,14},{3,2,16},
    {4,3,18},{4,3,20},{5,4,23},{6,4,25},{7,5,27},{8,5,29},{9,6,32},{10,6,34},
    {11,7,36},{12,7,39},{13,8,41},{14,8,43},{16,9,46},{17,9,48},{18,10,51},{20,10,53},
    {21,11,56},{22,11,58},{24,12,61},{25,12,63},{27,12,66},{28,13,68},{30,13,71},{31,13,73},
    {33,13,76},{35,14,78},{36,14,81},{38,14,83},{40,14,86},{41,14,88},{43,14,91},{45,14,93},
    {47,14,95},{48,14,98},{50,14,100},{52,14,102},{54,14,105},{56,14,107},{57,14,109},{59,14,111},
    {61,13,113},{63,13,115},{65,13,117},{67,13,119},{69,13,121},{70,13,123},{72,13,125},{74,12,127},
    {76,12,128},{78,12,130},{80,12,132},{82,11,133},{84,11,135},{86,11,136},{88,10,138},{90,10,139},
    {92,10,140},{94,10,142},{96,9,143},{98,9,144},{100,9,145},{102,9,146},{104,9,147},{106,8,148},
    {108,8,149},{110,8,150},{112,8,151},{114,8,152},{116,8,152},{118,8,153},{120,8,154},{122,8,154},
    {124,8,155},{126,8,155},{128,8,156},{130,8,156},{132,8,156},{134,9,157},{136,9,157},{138,9,157},
    {140,10,157},{142,10,157},{144,10,157},{146,11,157},{148,11,157},{150,12,157},{152,12,157},{154,13,157},
    {156,14,157},{158,14,156},{160,15,156},{162,16,156},{164,17,155},{166,17,155},{168,18,154},{170,19,154},
    {172,20,153},{174,21,152},{176,22,152},{178,23,151},{180,24,150},{182,25,149},{184,27,148},{186,28,147},
    {188,29,146},{190,30,145},{192,32,144},{193,33,143},{195,35,142},{197,36,141},{199,38,139},{200,39,138},
    {202,41,137},{204,43,135},{206,44,134},{207,46,133},{209,48,131},{210,50,130},{212,52,128},{214,54,127},
    {215,56,125},{217,58,124},{218,60,122},{220,62,121},{221,64,119},{223,66,117},{224,68,116},{226,71,114},
    {227,73,112},{228,75,111},{230,77,109},{231,79,107},{232,82,105},{234,84,104},{235,86,102},{236,89,100},
    {237,91,98},{238,93,97},{239,96,95},{240,98,93},{241,100,91},{242,103,89},{243,105,88},{244,108,86},
    {245,110,84},{246,113,82},{246,115,80},{247,118,79},{248,120,77},{249,123,75},{249,125,73},{250,128,71},
    {250,130,70},{251,133,68},{252,135,66},{252,138,64},{253,141,62},{253,143,60},{254,146,59},{254,148,57},
    {254,151,55},{255,153,53},{255,156,51},{255,159,50},{255,161,48},{255,164,46},{255,166,45},{255,169,43},
    {255,172,41},{255,174,40},{255,177,38},{255,180,37},{255,182,35},{255,185,34},{255,188,32},{255,190,31},
    {255,193,30},{255,196,29},{255,199,27},{255,201,26},{255,204,25},{255,207,24},{255,210,24},{255,212,23},
    {255,215,22},{255,218,22},{255,221,21},{255,223,21},{255,226,21},{255,229,21},{255,231,21},{255,234,21},
    {255,237,22},{255,239,22},{255,242,23},{255,244,24},{255,247,25},{254,249,27},{254,252,28},{252,254,30},
    {251,255,31},{249,255,33},{248,255,35},{246,255,37},{244,255,39},{243,255,41},{241,255,43},{239,255,46},
    {238,255,48},{236,255,50},{234,255,53},{232,255,55},{231,255,58},{229,255,60},{227,255,63},{225,255,66},
    {223,255,68},{222,255,71},{220,255,74},{218,255,77},{216,255,80},{214,255,83},{212,255,86},{210,255,89},
    {208,255,92},{206,255,95},{204,255,98},{202,255,101},{200,255,104},{198,255,107},{196,255,111},{194,255,114},
    {192,255,117},{190,255,120},{188,255,124},{186,255,127},{184,255,130},{182,255,134},{180,255,137},{178,255,141},
    {175,255,144},{173,255,148},{171,255,151},{169,255,155},{167,255,159},{165,255,162},{163,255,166},{252,255,164}
};

void SDLHeatmap::temp_to_rgb(double t, Uint8& r, Uint8& g, Uint8& b) const {
    double norm = (t - t_min_) / (t_max_ - t_min_);
    norm = std::max(0.0, std::min(1.0, norm));

    double idx = norm * (INFERNO_SIZE - 1);
    int i0 = static_cast<int>(idx);
    int i1 = std::min(i0 + 1, INFERNO_SIZE - 1);
    double frac = idx - i0;

    r = static_cast<Uint8>(INFERNO_MAP[i0][0] * (1 - frac) + INFERNO_MAP[i1][0] * frac);
    g = static_cast<Uint8>(INFERNO_MAP[i0][1] * (1 - frac) + INFERNO_MAP[i1][1] * frac);
    b = static_cast<Uint8>(INFERNO_MAP[i0][2] * (1 - frac) + INFERNO_MAP[i1][2] * frac);
}

// Number rendering display
void SDLHeatmap::draw_number(SDL_Renderer* rend, int x, int y, double value) const {
    char buffer[32];
    snprintf(buffer, sizeof(buffer), "%.1f", value);

    int offset = 0;
    for (int i = 0; buffer[i] != '\0'; ++i) {
        char c = buffer[i];
        if (c == '.') {
            SDL_Rect dot = {x + offset, y + 8, 2, 2};
            SDL_RenderFillRect(rend, &dot);
            offset += 3;
        } else if (c >= '0' && c <= '9') {
            int digit = c - '0';
            draw_digit(rend, x + offset, y, digit);
            offset += 7;
        } else if (c == '-') {
            SDL_RenderDrawLine(rend, x + offset, y + 5, x + offset + 4, y + 5);
            offset += 6;
        }
    }
}

// Text rendering using 7-segment digits
void SDLHeatmap::draw_text(SDL_Renderer* rend, int x, int y, const char* text) const {
    int offset = 0;
    for (int i = 0; text[i] != '\0'; ++i) {
        char c = text[i];
        if (c == ' ') {
            offset += 5;
        } else if (c == '.') {
            SDL_Rect dot = {x + offset, y + 8, 2, 2};
            SDL_RenderFillRect(rend, &dot);
            offset += 3;
        } else if (c == ':') {
            SDL_Rect dot1 = {x + offset + 1, y + 3, 2, 2};
            SDL_Rect dot2 = {x + offset + 1, y + 7, 2, 2};
            SDL_RenderFillRect(rend, &dot1);
            SDL_RenderFillRect(rend, &dot2);
            offset += 5;
        } else if (c == '=') {
            SDL_RenderDrawLine(rend, x + offset, y + 3, x + offset + 4, y + 3);
            SDL_RenderDrawLine(rend, x + offset, y + 7, x + offset + 4, y + 7);
            offset += 6;
        } else if (c == '/') {
            SDL_RenderDrawLine(rend, x + offset + 4, y, x + offset, y + 10);
            offset += 6;
        } else if (c == '[') {
            SDL_RenderDrawLine(rend, x + offset, y, x + offset, y + 10);
            SDL_RenderDrawLine(rend, x + offset, y, x + offset + 2, y);
            SDL_RenderDrawLine(rend, x + offset, y + 10, x + offset + 2, y + 10);
            offset += 4;
        } else if (c == ']') {
            SDL_RenderDrawLine(rend, x + offset + 2, y, x + offset + 2, y + 10);
            SDL_RenderDrawLine(rend, x + offset, y, x + offset + 2, y);
            SDL_RenderDrawLine(rend, x + offset, y + 10, x + offset + 2, y + 10);
            offset += 4;
        } else if (c >= '0' && c <= '9') {
            draw_digit(rend, x + offset, y, c - '0');
            offset += 7;
        } else if (c >= 'A' && c <= 'Z') {
            draw_letter(rend, x + offset, y, c);
            offset += 6;
        } else if (c >= 'a' && c <= 'z') {
            draw_letter(rend, x + offset, y, c - 32); // Convert to uppercase
            offset += 6;
        }
    }
}

// Colorbar: vertical gradient showing ΔT scale
void SDLHeatmap::draw_colorbar(SDL_Renderer* rend, int x, int y, int w, int h) const {
    // Draw gradient
    for (int i = 0; i < h; ++i) {
        double t = t_max_ - (i * (t_max_ - t_min_)) / h;
        Uint8 r, g, b;
        temp_to_rgb(t, r, g, b);
        SDL_SetRenderDrawColor(rend, r, g, b, 255);
        SDL_RenderDrawLine(rend, x, y + i, x + w, y + i);
    }

    // Border
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    SDL_Rect border = {x - 1, y - 1, w + 2, h + 2};
    SDL_RenderDrawRect(rend, &border);

    // ΔT labels
    int num_labels = 5;
    for (int i = 0; i <= num_labels; ++i) {
        int ly = y + (i * h) / num_labels;
        double temp = t_max_ - (i * (t_max_ - t_min_)) / num_labels;
        SDL_RenderDrawLine(rend, x + w, ly, x + w + 3, ly);
        draw_number(rend, x + w + 5, ly - 5, temp);
    }

    // Label: ΔT [K]
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    draw_text(rend, x - 5, y - 15, "DT [K]");
}

// Info panel: material, time, status, speed
void SDLHeatmap::draw_info_panel(SDL_Renderer* rend, const SimInfo& info) const {
    int x = 10;
    int y = 5;

    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);

    // Material name
    draw_text(rend, x, y, info.material_name.c_str());

    // Alpha value
    char alpha_buf[64];
    snprintf(alpha_buf, sizeof(alpha_buf), "a=%.2e", info.alpha);
    draw_text(rend, x + 100, y, alpha_buf);

    // Time and progress
    char time_buf[64];
    snprintf(time_buf, sizeof(time_buf), "t=%.2f/%.1f s", info.time, info.tmax);
    draw_text(rend, x + 220, y, time_buf);

    // Progress bar
    int bar_x = x + 380;
    int bar_w = 80;
    int bar_h = 10;
    double progress = info.time / info.tmax;

    SDL_SetRenderDrawColor(rend, 80, 80, 80, 255);
    SDL_Rect bar_bg = {bar_x, y + 2, bar_w, bar_h};
    SDL_RenderFillRect(rend, &bar_bg);
    SDL_SetRenderDrawColor(rend, 100, 200, 100, 255);
    SDL_Rect bar_fg = {bar_x, y + 2, static_cast<int>(bar_w * progress), bar_h};
    SDL_RenderFillRect(rend, &bar_fg);
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    SDL_RenderDrawRect(rend, &bar_bg);

    // Speed indicator
    char speed_buf[16];
    snprintf(speed_buf, sizeof(speed_buf), "X%d", info.speed);
    SDL_SetRenderDrawColor(rend, 150, 200, 255, 255);
    draw_text(rend, bar_x + bar_w + 10, y, speed_buf);

    // Paused indicator
    if (info.paused) {
        SDL_SetRenderDrawColor(rend, 255, 200, 50, 255);
        draw_text(rend, x + 540, y, "PAUSED");
    }
}

// Grid lines
void SDLHeatmap::draw_grid(SDL_Renderer* rend, int x0, int y0, int w, int h, int nx, int ny) const {
    SDL_SetRenderDrawColor(rend, 100, 100, 100, 128);

    // Vertical lines
    for (int i = 1; i < nx; ++i) {
        int x = x0 + (i * w) / nx;
        for (int y = y0; y < y0 + h; y += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }

    // Horizontal lines
    for (int j = 1; j < ny; ++j) {
        int y = y0 + (j * h) / ny;
        for (int x = x0; x < x0 + w; x += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }
}

void SDLHeatmap::draw_1d_fullscreen(const std::vector<double>& temps, const SimInfo& info) {
    if (temps.empty()) return;

    SDL_Renderer* rend = win_.get_renderer();
    int win_w = win_.get_width();
    int win_h = win_.get_height();
    int n = static_cast<int>(temps.size());

    // Margins for axes and info panel
    int margin_left     = 60;
    int margin_right    = 80;   
    int margin_top      = 25;    
    int margin_bottom   = 50;

    int plot_w = win_w - margin_left - margin_right;
    int plot_h = win_h - margin_top - margin_bottom;

    // Draw info panel at top
    draw_info_panel(rend, info);

    // Draw heatmap
    for (int i = 0; i < n; i++) {
        Uint8 r, g, b;
        temp_to_rgb(temps[i], r, g, b);

        int x1 = margin_left + (i * plot_w) / n;
        int x2 = margin_left + ((i + 1) * plot_w) / n;

        SDL_SetRenderDrawColor(rend, r, g, b, 255);
        SDL_Rect rect = {x1, margin_top, x2 - x1 + 1, plot_h};
        SDL_RenderFillRect(rend, &rect);
    }

    // Draw grid lines
    draw_grid(rend, margin_left, margin_top, plot_w, plot_h, 5, 5);

    // Draw temperature profile line (white curve)
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    for (int i = 0; i < n - 1; i++) {
        double norm1 = (temps[i] - t_min_) / (t_max_ - t_min_);
        double norm2 = (temps[i+1] - t_min_) / (t_max_ - t_min_);
        norm1 = std::max(0.0, std::min(1.0, norm1));
        norm2 = std::max(0.0, std::min(1.0, norm2));

        int x1 = margin_left + (i * plot_w) / n;
        int x2 = margin_left + ((i + 1) * plot_w) / n;
        int y1 = margin_top + plot_h - static_cast<int>(norm1 * plot_h);
        int y2 = margin_top + plot_h - static_cast<int>(norm2 * plot_h);

        SDL_RenderDrawLine(rend, x1, y1, x2, y2);
    }

    // Find min and max temperature positions
    int min_idx = 0, max_idx = 0;
    double min_temp = temps[0], max_temp = temps[0];
    for (int i = 1; i < n; i++) {
        if (temps[i] < min_temp) { min_temp = temps[i]; min_idx = i; }
        if (temps[i] > max_temp) { max_temp = temps[i]; max_idx = i; }
    }

    // Draw min marker (blue circle)
    int min_x       = margin_left + (min_idx * plot_w) / n;
    double min_norm = (min_temp - t_min_) / (t_max_ - t_min_);
    int min_y       = margin_top + plot_h - static_cast<int>(min_norm * plot_h);
    SDL_SetRenderDrawColor(rend, 100, 150, 255, 255);
    for (int dx = -4; dx <= 4; dx++) {
        for (int dy = -4; dy <= 4; dy++) {
            if (dx*dx + dy*dy <= 16) SDL_RenderDrawPoint(rend, min_x + dx, min_y + dy);
        }
    }

    // Draw max marker (red circle)
    int max_x = margin_left + (max_idx * plot_w) / n;
    double max_norm = (max_temp - t_min_) / (t_max_ - t_min_);
    int max_y = margin_top + plot_h - static_cast<int>(max_norm * plot_h);
    SDL_SetRenderDrawColor(rend, 255, 100, 100, 255);
    for (int dx = -4; dx <= 4; dx++) {
        for (int dy = -4; dy <= 4; dy++) {
            if (dx*dx + dy*dy <= 16) SDL_RenderDrawPoint(rend, max_x + dx, max_y + dy);
        }
    }

    // Draw colorbar on right side
    draw_colorbar(rend, win_w - 70, margin_top, 15, plot_h);

    // Draw axes
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);

    // X-axis
    SDL_RenderDrawLine(rend, margin_left, win_h - margin_bottom,
                       margin_left + plot_w, win_h - margin_bottom);

    // Y-axis (temperature)
    SDL_RenderDrawLine(rend, margin_left, margin_top,
                       margin_left, win_h - margin_bottom);

    // X-axis ticks and labels unit meters
    int num_x_ticks = 5;
    for (int i = 0; i <= num_x_ticks; i++) {
        int x = margin_left + (i * plot_w) / num_x_ticks;
        SDL_RenderDrawLine(rend, x, win_h - margin_bottom,
                          x, win_h - margin_bottom + 5);

        double pos = (i * info.L) / num_x_ticks;
        draw_number(rend, x - 10, win_h - margin_bottom + 10, pos);
    }

    // X-axis label
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, margin_left + plot_w / 2 - 20, win_h - 15, "X [M]");

    // Y-axis ticks (temperature)
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    int num_y_ticks = 5;
    for (int i = 0; i <= num_y_ticks; i++) {
        int y = win_h - margin_bottom - (i * plot_h) / num_y_ticks;
        SDL_RenderDrawLine(rend, margin_left - 5, y, margin_left, y);

        double temp = t_min_ + (i * (t_max_ - t_min_)) / num_y_ticks;
        draw_number(rend, margin_left - 50, y - 5, temp);
    }

    // Boundary condition labels
    SDL_SetRenderDrawColor(rend, 150, 255, 150, 255);
    draw_text(rend, margin_left - 5, margin_top + plot_h + 25, "NEUMANN");

    SDL_SetRenderDrawColor(rend, 255, 180, 100, 255);
    char dirichlet_buf[32];
    snprintf(dirichlet_buf, sizeof(dirichlet_buf), "U=%.0fK", info.u0);
    draw_text(rend, margin_left + plot_w - 40, margin_top + plot_h + 25, dirichlet_buf);

    // Heat source labels
    // Source 1: [L/10, 2L/10]
    int src1_x1 = margin_left + static_cast<int>((1.0/10.0) * plot_w);
    int src1_x2 = margin_left + static_cast<int>((2.0/10.0) * plot_w);
    int src1_center = (src1_x1 + src1_x2) / 2;

    // Source 2: [5L/10, 6L/10]
    int src2_x1 = margin_left + static_cast<int>((5.0/10.0) * plot_w);
    int src2_x2 = margin_left + static_cast<int>((6.0/10.0) * plot_w);
    int src2_center = (src2_x1 + src2_x2) / 2;

    // Draw source region
    // Source 1 
    SDL_SetRenderDrawColor(rend, 0, 255, 255, 255);
    SDL_Rect src1_rect = {src1_x1, margin_top, src1_x2 - src1_x1, plot_h};
    SDL_RenderDrawRect(rend, &src1_rect);

    // Source 2 
    SDL_Rect src2_rect = {src2_x1, margin_top, src2_x2 - src2_x1, plot_h};
    SDL_RenderDrawRect(rend, &src2_rect);

    // Draw source region brackets at bottom
    int bracket_y = win_h - margin_bottom + 35;

    // Source 1 bracket with arrow pointing up
    SDL_RenderDrawLine(rend, src1_x1, bracket_y, src1_x1, bracket_y - 5);
    SDL_RenderDrawLine(rend, src1_x1, bracket_y - 5, src1_x2, bracket_y - 5);
    SDL_RenderDrawLine(rend, src1_x2, bracket_y, src1_x2, bracket_y - 5);

    // Arrow pointing to source region
    int arrow_x1 = src1_center;
    SDL_RenderDrawLine(rend, arrow_x1, bracket_y - 5, arrow_x1, bracket_y - 12);
    SDL_RenderDrawLine(rend, arrow_x1 - 3, bracket_y - 9, arrow_x1, bracket_y - 12);
    SDL_RenderDrawLine(rend, arrow_x1 + 3, bracket_y - 9, arrow_x1, bracket_y - 12);

    // Source 2 bracket with arrow
    SDL_RenderDrawLine(rend, src2_x1, bracket_y, src2_x1, bracket_y - 5);
    SDL_RenderDrawLine(rend, src2_x1, bracket_y - 5, src2_x2, bracket_y - 5);
    SDL_RenderDrawLine(rend, src2_x2, bracket_y, src2_x2, bracket_y - 5);
    int arrow_x2 = src2_center;
    SDL_RenderDrawLine(rend, arrow_x2, bracket_y - 5, arrow_x2, bracket_y - 12);
    SDL_RenderDrawLine(rend, arrow_x2 - 3, bracket_y - 9, arrow_x2, bracket_y - 12);
    SDL_RenderDrawLine(rend, arrow_x2 + 3, bracket_y - 9, arrow_x2, bracket_y - 12);

    // Draw source labels with power percentage
    SDL_SetRenderDrawColor(rend, 255, 200, 0, 255);  // Yellow for high power
    draw_text(rend, src1_center - 30, bracket_y + 2, "F1 100");

    SDL_SetRenderDrawColor(rend, 200, 150, 50, 255);  // Dimmer for lower power
    draw_text(rend, src2_center - 25, bracket_y + 2, "F2 75");
}

void SDLHeatmap::draw_2d_fullscreen(const std::vector<std::vector<double>>& temps, const SimInfo& info) {
    if (temps.empty()) return;

    SDL_Renderer* rend = win_.get_renderer();
    int win_w = win_.get_width();
    int win_h = win_.get_height();

    int ny = static_cast<int>(temps.size());
    int nx = static_cast<int>(temps[0].size());

    // Margins for axes and info panel
    int margin_left     = 60;
    int margin_right    = 80;  // Space for colorbar
    int margin_top      = 25;    // Space for info panel
    int margin_bottom   = 50;

    int plot_w = win_w - margin_left - margin_right;
    int plot_h = win_h - margin_top - margin_bottom;

    // Draw panel at top
    draw_info_panel(rend, info);

    // Bilinear interpolation with subsampling
    int sub = 2;
    int render_nx = (nx - 1) * sub;
    int render_ny = (ny - 1) * sub;

    for (int sj = 0; sj < render_ny; ++sj) {
        for (int si = 0; si < render_nx; ++si) {
            double fi = static_cast<double>(si) / sub;
            double fj = static_cast<double>(sj) / sub;

            int i0 = static_cast<int>(fi);
            int j0 = static_cast<int>(fj);
            int i1 = std::min(i0 + 1, nx - 1);
            int j1 = std::min(j0 + 1, ny - 1);

            double fx = fi - i0;
            double fy = fj - j0;

            double t = temps[j0][i0] * (1-fx) * (1-fy)
                     + temps[j0][i1] * fx * (1-fy)
                     + temps[j1][i0] * (1-fx) * fy
                     + temps[j1][i1] * fx * fy;

            Uint8 r, g, b;
            temp_to_rgb(t, r, g, b);

            int x1 = margin_left + (si * plot_w) / render_nx;
            int x2 = margin_left + ((si + 1) * plot_w) / render_nx;

            // Flip Y-axis: y=0 (Neumann) at bottom, y=L (Dirichlet) at top
            int y1 = margin_top + plot_h - ((sj + 1) * plot_h) / render_ny;
            int y2 = margin_top + plot_h - (sj * plot_h) / render_ny;

            SDL_SetRenderDrawColor(rend, r, g, b, 255);
            SDL_Rect rect = {x1, y1, x2 - x1 + 1, y2 - y1 + 1};
            SDL_RenderFillRect(rend, &rect);
        }
    }

    // Draw grid lines
    draw_grid(rend, margin_left, margin_top, plot_w, plot_h, 5, 5);

    // Find and mark min/max temperature positions
    int min_i = 0, min_j = 0, max_i = 0, max_j = 0;
    double min_temp = temps[0][0], max_temp = temps[0][0];
    for (int j = 0; j < ny; j++) {
        for (int i = 0; i < nx; i++) {
            if (temps[j][i] < min_temp) { min_temp = temps[j][i]; min_i = i; min_j = j; }
            if (temps[j][i] > max_temp) { max_temp = temps[j][i]; max_i = i; max_j = j; }
        }
    }

    // Draw min marker (blue circle)
    int min_x = margin_left + (min_i * plot_w) / nx;
    int min_y = margin_top + plot_h - (min_j * plot_h) / ny;  // Flip Y
    SDL_SetRenderDrawColor(rend, 100, 150, 255, 255);
    for (int dx = -5; dx <= 5; dx++) {
        for (int dy = -5; dy <= 5; dy++) {
            if (dx*dx + dy*dy <= 25 && dx*dx + dy*dy >= 9)
                SDL_RenderDrawPoint(rend, min_x + dx, min_y + dy);
        }
    }

    // Draw max marker (red circle)
    int max_x = margin_left + (max_i * plot_w) / nx;
    int max_y = margin_top + plot_h - (max_j * plot_h) / ny;  // Flip Y
    SDL_SetRenderDrawColor(rend, 255, 100, 100, 255);
    for (int dx = -5; dx <= 5; dx++) {
        for (int dy = -5; dy <= 5; dy++) {
            if (dx*dx + dy*dy <= 25 && dx*dx + dy*dy >= 9)
                SDL_RenderDrawPoint(rend, max_x + dx, max_y + dy);
        }
    }

    // Draw colorbar on right side
    draw_colorbar(rend, win_w - 70, margin_top, 15, plot_h);

    // Draw axes
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);

    // X-axis
    SDL_RenderDrawLine(rend, margin_left, win_h - margin_bottom,
                       margin_left + plot_w, win_h - margin_bottom);

    // Y-axis
    SDL_RenderDrawLine(rend, margin_left, margin_top,
                       margin_left, win_h - margin_bottom);

    // X-axis ticks
    int num_ticks = 5;
    for (int i = 0; i <= num_ticks; i++) {
        int x = margin_left + (i * plot_w) / num_ticks;
        SDL_RenderDrawLine(rend, x, win_h - margin_bottom,
                          x, win_h - margin_bottom + 5);

        double pos = (i * info.L) / num_ticks;
        draw_number(rend, x - 10, win_h - margin_bottom + 10, pos);
    }

    // X-axis label
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, margin_left + plot_w / 2 - 20, win_h - 15, "X [M]");

    // Y-axis ticks
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    for (int i = 0; i <= num_ticks; i++) {
        int y = win_h - margin_bottom - (i * plot_h) / num_ticks;
        SDL_RenderDrawLine(rend, margin_left - 5, y, margin_left, y);

        double pos = (i * info.L) / num_ticks;
        draw_number(rend, 10, y - 5, pos);
    }

    // Y-axis label
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, 5, margin_top + plot_h / 2 - 5, "Y[M]");

    // Boundary condition labels for 2D
    // Bottom-left corner: Neumann (x=0, y=0)
    SDL_SetRenderDrawColor(rend, 150, 255, 150, 255);
    draw_text(rend, margin_left - 5, margin_top + plot_h + 25, "NEUMANN");

    // Top-right: Dirichlet (x=L, y=L)
    SDL_SetRenderDrawColor(rend, 255, 180, 100, 255);
    char dirichlet_buf[32];
    snprintf(dirichlet_buf, sizeof(dirichlet_buf), "U=%.0fK", info.u0);
    draw_text(rend, margin_left + plot_w - 40, margin_top - 12, dirichlet_buf);

    // Calculate source positions in screen coordinates
    double src_x1_norm = 1.0/6.0, src_x2_norm = 2.0/6.0;
    double src_x3_norm = 4.0/6.0, src_x4_norm = 5.0/6.0;
    double src_y1_norm = 1.0/6.0, src_y2_norm = 2.0/6.0;
    double src_y3_norm = 4.0/6.0, src_y4_norm = 5.0/6.0;

    // Screen coordinates for source regions
    int sx1 = margin_left + static_cast<int>(src_x1_norm * plot_w);
    int sx2 = margin_left + static_cast<int>(src_x2_norm * plot_w);
    int sx3 = margin_left + static_cast<int>(src_x3_norm * plot_w);
    int sx4 = margin_left + static_cast<int>(src_x4_norm * plot_w);

    int sy1 = margin_top + plot_h - static_cast<int>(src_y2_norm * plot_h);
    int sy2 = margin_top + plot_h - static_cast<int>(src_y1_norm * plot_h);
    int sy3 = margin_top + plot_h - static_cast<int>(src_y4_norm * plot_h);
    int sy4 = margin_top + plot_h - static_cast<int>(src_y3_norm * plot_h);

    // Draw source region rectangles
    SDL_SetRenderDrawColor(rend, 0, 255, 255, 255);
    SDL_Rect src_bl = {sx1, sy1, sx2 - sx1, sy2 - sy1};  // Bottom-left
    SDL_Rect src_br = {sx3, sy1, sx4 - sx3, sy2 - sy1};  // Bottom-right
    SDL_Rect src_tl = {sx1, sy3, sx2 - sx1, sy4 - sy3};  // Top-left
    SDL_Rect src_tr = {sx3, sy3, sx4 - sx3, sy4 - sy3};  // Top-right

    // Outer border
    SDL_RenderDrawRect(rend, &src_bl);
    SDL_RenderDrawRect(rend, &src_br);
    SDL_RenderDrawRect(rend, &src_tl);
    SDL_RenderDrawRect(rend, &src_tr);

    // Inner border
    SDL_Rect src_bl_inner = {sx1 + 1, sy1 + 1, sx2 - sx1 - 2, sy2 - sy1 - 2};
    SDL_Rect src_br_inner = {sx3 + 1, sy1 + 1, sx4 - sx3 - 2, sy2 - sy1 - 2};
    SDL_Rect src_tl_inner = {sx1 + 1, sy3 + 1, sx2 - sx1 - 2, sy4 - sy3 - 2};
    SDL_Rect src_tr_inner = {sx3 + 1, sy3 + 1, sx4 - sx3 - 2, sy4 - sy3 - 2};
    SDL_RenderDrawRect(rend, &src_bl_inner);
    SDL_RenderDrawRect(rend, &src_br_inner);
    SDL_RenderDrawRect(rend, &src_tl_inner);
    SDL_RenderDrawRect(rend, &src_tr_inner);

    // Draw corner marks for each source
    int mark_len = 5;

    // Bottom-left source corners
    SDL_RenderDrawLine(rend, sx1 - mark_len, sy1, sx1, sy1);
    SDL_RenderDrawLine(rend, sx1, sy1 - mark_len, sx1, sy1);
    SDL_RenderDrawLine(rend, sx2, sy2, sx2 + mark_len, sy2);
    SDL_RenderDrawLine(rend, sx2, sy2, sx2, sy2 + mark_len);

    // Draw source labels with "F" for flux/heat source
    SDL_SetRenderDrawColor(rend, 255, 200, 0, 255);  // Yellow
    draw_text(rend, (sx1 + sx2) / 2 - 5, (sy1 + sy2) / 2 - 5, "F1");
    draw_text(rend, (sx3 + sx4) / 2 - 5, (sy1 + sy2) / 2 - 5, "F2");
    draw_text(rend, (sx1 + sx2) / 2 - 5, (sy3 + sy4) / 2 - 5, "F3");
    draw_text(rend, (sx3 + sx4) / 2 - 5, (sy3 + sy4) / 2 - 5, "F4");
}

void SDLHeatmap::draw_1d_cell(const std::vector<double>& temps, const SimInfo& info,
                               int cell_x, int cell_y, int cell_w, int cell_h) {
    if (temps.empty()) return;

    SDL_Renderer* rend = win_.get_renderer();
    int n = static_cast<int>(temps.size());

    // Margins for cell mode
    int margin_left     = 50;
    int margin_right    = 60;
    int margin_top      = 20;
    int margin_bottom   = 40;

    int plot_x = cell_x + margin_left;
    int plot_y = cell_y + margin_top;
    int plot_w = cell_w - margin_left - margin_right;
    int plot_h = cell_h - margin_top - margin_bottom;

    // Draw material name and alpha at top
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    draw_text(rend, cell_x + 5, cell_y + 5, info.material_name.c_str());

    char alpha_buf[32];
    snprintf(alpha_buf, sizeof(alpha_buf), "A=%.1E", info.alpha);
    draw_text(rend, cell_x + 80, cell_y + 5, alpha_buf);

    // Draw time
    char time_buf[32];
    snprintf(time_buf, sizeof(time_buf), "T=%.1FS", info.time);
    draw_text(rend, cell_x + cell_w - 70, cell_y + 5, time_buf);

    // Draw heatmap
    for (int i = 0; i < n; i++) {
        Uint8 r, g, b;
        temp_to_rgb(temps[i], r, g, b);

        int x1 = plot_x + (i * plot_w) / n;
        int x2 = plot_x + ((i + 1) * plot_w) / n;

        SDL_SetRenderDrawColor(rend, r, g, b, 255);
        SDL_Rect rect = {x1, plot_y, x2 - x1 + 1, plot_h};
        SDL_RenderFillRect(rend, &rect);
    }

    // Draw temperature profile line (white curve)
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    for (int i = 0; i < n - 1; i++) {
        double norm1 = (temps[i] - t_min_) / (t_max_ - t_min_);
        double norm2 = (temps[i+1] - t_min_) / (t_max_ - t_min_);
        norm1 = std::max(0.0, std::min(1.0, norm1));
        norm2 = std::max(0.0, std::min(1.0, norm2));

        int x1 = plot_x + (i * plot_w) / n;
        int x2 = plot_x + ((i + 1) * plot_w) / n;
        int y1 = plot_y + plot_h - static_cast<int>(norm1 * plot_h);
        int y2 = plot_y + plot_h - static_cast<int>(norm2 * plot_h);

        SDL_RenderDrawLine(rend, x1, y1, x2, y2);
    }

    // Temperature value projections at key positions
    // Temperature values at: x=0 (Neumann), center of sources, x=L (Dirichlet)
    int key_indices[] = {0, n/10 + n/20, n/2 + n/20, n-1};  // x=0, src1 center, src2 center, x=L
    //const char* key_labels[] = {"", "S1", "S2", ""};

    for (int k = 0; k < 4; k++) {
        int idx = key_indices[k];
        if (idx >= n) idx = n - 1;

        double temp_val = temps[idx];
        double norm     = (temp_val - t_min_) / (t_max_ - t_min_);
        norm = std::max(0.0, std::min(1.0, norm));

        int px = plot_x + (idx * plot_w) / n;
        int py = plot_y + plot_h - static_cast<int>(norm * plot_h);

        // Draw projection line to Y-axis (dashed)
        SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
        for (int x = plot_x; x < px; x += 4) {
            SDL_RenderDrawPoint(rend, x, py);
        }

        // Draw small marker at the point
        SDL_SetRenderDrawColor(rend, 255, 255, 0, 255);
        SDL_Rect marker = {px - 2, py - 2, 5, 5};
        SDL_RenderFillRect(rend, &marker);

        // Draw temperature value near the projection on Y-axis
        SDL_SetRenderDrawColor(rend, 255, 255, 150, 255);
        char val_buf[16];
        snprintf(val_buf, sizeof(val_buf), "%.0f", temp_val);

        // Offset labels to avoid overlap
        int label_y = py - 3 + (k % 2) * 12;
        if (k == 0) {
            draw_text(rend, plot_x - 25, label_y, val_buf);
        } else if (k == 3) {
            draw_text(rend, px + 3, label_y, val_buf);
        }
    }

    // Draw colorbar on right side
    int cb_x = cell_x + cell_w - margin_right + 5;
    int cb_w = 12;
    int cb_h = plot_h;

    for (int i = 0; i < cb_h; ++i) {
        double t = t_max_ - (i * (t_max_ - t_min_)) / cb_h;
        Uint8 r, g, b;
        temp_to_rgb(t, r, g, b);
        SDL_SetRenderDrawColor(rend, r, g, b, 255);
        SDL_RenderDrawLine(rend, cb_x, plot_y + i, cb_x + cb_w, plot_y + i);
    }
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    SDL_Rect cb_border = {cb_x - 1, plot_y - 1, cb_w + 2, cb_h + 2};
    SDL_RenderDrawRect(rend, &cb_border);

    // Colorbar labels (min/max)
    draw_number(rend, cb_x + cb_w + 3, plot_y - 3, t_max_);
    draw_number(rend, cb_x + cb_w + 3, plot_y + cb_h - 8, t_min_);

    // Draw axes
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    SDL_RenderDrawLine(rend, plot_x, plot_y + plot_h, plot_x + plot_w, plot_y + plot_h);  // X-axis
    SDL_RenderDrawLine(rend, plot_x, plot_y, plot_x, plot_y + plot_h);  // Y-axis

    // X-axis labels (0 and L)
    draw_number(rend, plot_x - 5, plot_y + plot_h + 5, 0.0);
    draw_number(rend, plot_x + plot_w - 15, plot_y + plot_h + 5, info.L);

    // Y-axis label "ΔT [K]" for temperature increase
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, plot_x - 45, plot_y + plot_h / 2 - 5, "DT[K]");

    // Y-axis labels (temp range)
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    draw_number(rend, plot_x - 45, plot_y - 3, t_max_);
    draw_number(rend, plot_x - 45, plot_y + plot_h - 8, t_min_);

    // X-axis label
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, plot_x + plot_w / 2 - 10, plot_y + plot_h + 25, "X[M]");

    // Boundary condition labels
    SDL_SetRenderDrawColor(rend, 150, 255, 150, 255);
    draw_text(rend, plot_x - 5, plot_y + plot_h + 15, "N");  // Neumann at x=0

    SDL_SetRenderDrawColor(rend, 255, 180, 100, 255);
    draw_text(rend, plot_x + plot_w - 10, plot_y + plot_h + 15, "D");  // Dirichlet at x=L

    // Heat source regions - improved visualization
    int src1_x1 = plot_x + static_cast<int>((1.0/10.0) * plot_w);
    int src1_x2 = plot_x + static_cast<int>((2.0/10.0) * plot_w);
    int src2_x1 = plot_x + static_cast<int>((5.0/10.0) * plot_w);
    int src2_x2 = plot_x + static_cast<int>((6.0/10.0) * plot_w);

    // Draw semi-transparent filled regions for heat sources
    SDL_SetRenderDrawColor(rend, 255, 200, 0, 255);  // Yellow/orange for heat
    // Source 1 
    for (int y = plot_y; y < plot_y + plot_h; y += 3) {
        for (int x = src1_x1; x < src1_x2; x += 3) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }
    // Source 2 
    for (int y = plot_y; y < plot_y + plot_h; y += 3) {
        for (int x = src2_x1; x < src2_x2; x += 3) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }

    // Draw thick borders around heat sources
    SDL_SetRenderDrawColor(rend, 255, 150, 0, 255);  // Orange border

    // Source 1
    SDL_Rect src1 = {src1_x1, plot_y, src1_x2 - src1_x1, plot_h};
    SDL_Rect src1_inner = {src1_x1 + 1, plot_y + 1, src1_x2 - src1_x1 - 2, plot_h - 2};
    SDL_RenderDrawRect(rend, &src1);
    SDL_RenderDrawRect(rend, &src1_inner);

    // Source 2
    SDL_Rect src2 = {src2_x1, plot_y, src2_x2 - src2_x1, plot_h};
    SDL_Rect src2_inner = {src2_x1 + 1, plot_y + 1, src2_x2 - src2_x1 - 2, plot_h - 2};
    SDL_RenderDrawRect(rend, &src2);
    SDL_RenderDrawRect(rend, &src2_inner);

    // Draw arrows pointing down into the sources (heat input indicator)
    SDL_SetRenderDrawColor(rend, 255, 255, 0, 255);  // Bright yellow arrows
    int arrow_y = plot_y - 8;
    int src1_cx = (src1_x1 + src1_x2) / 2;
    int src2_cx = (src2_x1 + src2_x2) / 2;

    // Arrow 1 pointing down
    SDL_RenderDrawLine(rend, src1_cx, arrow_y, src1_cx, plot_y - 2);
    SDL_RenderDrawLine(rend, src1_cx - 3, plot_y - 5, src1_cx, plot_y - 2);
    SDL_RenderDrawLine(rend, src1_cx + 3, plot_y - 5, src1_cx, plot_y - 2);

    // Arrow 2 pointing down
    SDL_RenderDrawLine(rend, src2_cx, arrow_y, src2_cx, plot_y - 2);
    SDL_RenderDrawLine(rend, src2_cx - 3, plot_y - 5, src2_cx, plot_y - 2);
    SDL_RenderDrawLine(rend, src2_cx + 3, plot_y - 5, src2_cx, plot_y - 2);

    // Find and draw min/max temperature markers
    int min_idx = 0, max_idx = 0;
    double min_temp = temps[0], max_temp = temps[0];
    for (int i = 1; i < n; i++) {
        if (temps[i] < min_temp) { min_temp = temps[i]; min_idx = i; }
        if (temps[i] > max_temp) { max_temp = temps[i]; max_idx = i; }
    }

    // Min marker (blue circle)
    int min_x = plot_x + (min_idx * plot_w) / n;
    double min_norm = (min_temp - t_min_) / (t_max_ - t_min_);
    min_norm        = std::max(0.0, std::min(1.0, min_norm));
    int min_y       = plot_y + plot_h - static_cast<int>(min_norm * plot_h);
    SDL_SetRenderDrawColor(rend, 100, 150, 255, 255);
    for (int dx = -3; dx <= 3; dx++) {
        for (int dy = -3; dy <= 3; dy++) {
            if (dx*dx + dy*dy <= 9) SDL_RenderDrawPoint(rend, min_x + dx, min_y + dy);
        }
    }

    // Max marker (red circle)
    int max_x = plot_x + (max_idx * plot_w) / n;
    double max_norm = (max_temp - t_min_) / (t_max_ - t_min_);
    max_norm = std::max(0.0, std::min(1.0, max_norm));
    int max_y = plot_y + plot_h - static_cast<int>(max_norm * plot_h);
    SDL_SetRenderDrawColor(rend, 255, 100, 100, 255);
    for (int dx = -3; dx <= 3; dx++) {
        for (int dy = -3; dy <= 3; dy++) {
            if (dx*dx + dy*dy <= 9) SDL_RenderDrawPoint(rend, max_x + dx, max_y + dy);
        }
    }

    // Progress bar
    int bar_x = cell_x + cell_w - 65;
    int bar_y = cell_y + cell_h - 18;
    int bar_w = 55;
    int bar_h = 8;
    double progress = info.time / info.tmax;

    SDL_SetRenderDrawColor(rend, 60, 60, 60, 255);
    SDL_Rect bar_bg = {bar_x, bar_y, bar_w, bar_h};
    SDL_RenderFillRect(rend, &bar_bg);
    SDL_SetRenderDrawColor(rend, 80, 180, 80, 255);
    SDL_Rect bar_fg = {bar_x, bar_y, static_cast<int>(bar_w * progress), bar_h};
    SDL_RenderFillRect(rend, &bar_fg);
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    SDL_RenderDrawRect(rend, &bar_bg);

    // Speed indicator
    char speed_buf[16];
    snprintf(speed_buf, sizeof(speed_buf), "X%d", info.speed);
    SDL_SetRenderDrawColor(rend, 150, 200, 255, 255);
    draw_text(rend, cell_x + cell_w - 130, cell_y + cell_h - 18, speed_buf);

    // Paused indicator
    if (info.paused) {
        SDL_SetRenderDrawColor(rend, 255, 200, 50, 255);
        draw_text(rend, cell_x + 5, cell_y + cell_h - 18, "PAUSED");
    }

    // Draw border
    SDL_SetRenderDrawColor(rend, 100, 100, 100, 255);
    SDL_Rect border = {plot_x, plot_y, plot_w, plot_h};
    SDL_RenderDrawRect(rend, &border);
}

void SDLHeatmap::draw_2d_cell(const std::vector<std::vector<double>>& temps, const SimInfo& info,
                               int cell_x, int cell_y, int cell_w, int cell_h) {
    if (temps.empty()) return;

    SDL_Renderer* rend = win_.get_renderer();

    int ny = static_cast<int>(temps.size());
    int nx = static_cast<int>(temps[0].size());

    // Margins for cell mode
    int margin_left     = 50;
    int margin_right    = 60;
    int margin_top      = 20;
    int margin_bottom   = 40;

    int plot_x = cell_x + margin_left;
    int plot_y = cell_y + margin_top;
    int plot_w = cell_w - margin_left - margin_right;
    int plot_h = cell_h - margin_top - margin_bottom;

    // Draw material name and alpha at top
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    draw_text(rend, cell_x + 5, cell_y + 5, info.material_name.c_str());

    char alpha_buf[32];
    snprintf(alpha_buf, sizeof(alpha_buf), "A=%.1E", info.alpha);
    draw_text(rend, cell_x + 80, cell_y + 5, alpha_buf);

    // Draw time
    char time_buf[32];
    snprintf(time_buf, sizeof(time_buf), "T=%.1FS", info.time);
    draw_text(rend, cell_x + cell_w - 70, cell_y + 5, time_buf);

    // Draw heatmap with bilinear interpolation
    int sub       = 2;
    int render_nx = (nx - 1) * sub;
    int render_ny = (ny - 1) * sub;

    for (int sj = 0; sj < render_ny; ++sj) {
        for (int si = 0; si < render_nx; ++si) {
            double fi = static_cast<double>(si) / sub;
            double fj = static_cast<double>(sj) / sub;

            int i0 = static_cast<int>(fi);
            int j0 = static_cast<int>(fj);
            int i1 = std::min(i0 + 1, nx - 1);
            int j1 = std::min(j0 + 1, ny - 1);

            double fx = fi - i0;
            double fy = fj - j0;

            double t = temps[j0][i0] * (1-fx) * (1-fy)
                     + temps[j0][i1] * fx * (1-fy)
                     + temps[j1][i0] * (1-fx) * fy
                     + temps[j1][i1] * fx * fy;

            Uint8 r, g, b;
            temp_to_rgb(t, r, g, b);

            int x1 = plot_x + (si * plot_w) / render_nx;
            int x2 = plot_x + ((si + 1) * plot_w) / render_nx;
            // Flip Y-axis
            int y1 = plot_y + plot_h - ((sj + 1) * plot_h) / render_ny;
            int y2 = plot_y + plot_h - (sj * plot_h) / render_ny;

            SDL_SetRenderDrawColor(rend, r, g, b, 255);
            SDL_Rect rect = {x1, y1, x2 - x1 + 1, y2 - y1 + 1};
            SDL_RenderFillRect(rend, &rect);
        }
    }

    // Draw heat flow arrows (negative gradient shows direction of heat flow)
    // Heat flows from hot to cold regions
    int arrow_grid  = 8; // 8x8 grids
    int arrow_len   = std::min(plot_w, plot_h) / (arrow_grid * 2);

    for (int aj = 0; aj < arrow_grid; aj++) {
        for (int ai = 0; ai < arrow_grid; ai++) {
            // Sample point in the grid
            int i = (ai * (nx - 1)) / arrow_grid;
            int j = (aj * (ny - 1)) / arrow_grid;

            if (i <= 0 || i >= nx - 1 || j <= 0 || j >= ny - 1) continue;

            // Calculate gradient
            double dTdx = (temps[j][i+1] - temps[j][i-1]) / (2.0 * (info.L / nx));
            double dTdy = (temps[j+1][i] - temps[j-1][i]) / (2.0 * (info.L / ny));

            // Heat flow is 
            double flow_x = -dTdx;
            double flow_y = -dTdy;

            // Normalize and scale arrow
            double mag = std::sqrt(flow_x * flow_x + flow_y * flow_y);
            if (mag < 0.1) continue; 

            double scale = arrow_len / mag;
            if (scale > arrow_len) scale = arrow_len;  // Limit max length

            int ax = static_cast<int>(flow_x * scale);
            int ay = static_cast<int>(flow_y * scale);

            // Arrow base position
            int bx = plot_x + (i * plot_w) / nx;
            int by = plot_y + plot_h - (j * plot_h) / ny;  // Y flipped

            // Arrow tip
            int tx = bx + ax;
            int ty = by - ay;  // Y flipped

            // Draw arrow line 
            SDL_SetRenderDrawColor(rend, 0, 255, 200, 255);
            SDL_RenderDrawLine(rend, bx, by, tx, ty);

            // Draw arrowhead
            double angle = std::atan2(-ay, ax);
            int head_len = 4;
            int hx1 = tx - static_cast<int>(head_len * std::cos(angle - 0.5));
            int hy1 = ty - static_cast<int>(head_len * std::sin(angle - 0.5));
            int hx2 = tx - static_cast<int>(head_len * std::cos(angle + 0.5));
            int hy2 = ty - static_cast<int>(head_len * std::sin(angle + 0.5));
            SDL_RenderDrawLine(rend, tx, ty, hx1, hy1);
            SDL_RenderDrawLine(rend, tx, ty, hx2, hy2);
        }
    }

    // Draw contour lines (isotherms) 
    int num_contours = 5;
    for (int c = 1; c < num_contours; c++) {
        double contour_temp = t_min_ + c * (t_max_ - t_min_) / num_contours;

        // Color based on temperature level
        Uint8 cr, cg, cb;
        temp_to_rgb(contour_temp, cr, cg, cb);
        SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);

        for (int j = 0; j < ny - 1; j++) {
            for (int i = 0; i < nx - 1; i++) {
                double t00 = temps[j][i];
                double t10 = temps[j][i+1];
                double t01 = temps[j+1][i];
                double t11 = temps[j+1][i+1];

                double cell_min = std::min({t00, t10, t01, t11});
                double cell_max = std::max({t00, t10, t01, t11});

                if (contour_temp >= cell_min && contour_temp <= cell_max) {
                    int cx = plot_x + ((i * 2 + 1) * plot_w) / (2 * nx);
                    int cy = plot_y + plot_h - ((j * 2 + 1) * plot_h) / (2 * ny);
                    // Draw small cross for contour point
                    SDL_RenderDrawPoint(rend, cx, cy);
                    SDL_RenderDrawPoint(rend, cx+1, cy);
                    SDL_RenderDrawPoint(rend, cx-1, cy);
                    SDL_RenderDrawPoint(rend, cx, cy+1);
                    SDL_RenderDrawPoint(rend, cx, cy-1);
                }
            }
        }
    }

    // Draw temperature profile along bottom edge (Y=0, varying X)
    int profile_h = 25;  // Height of profile graph
    int profile_y = plot_y + plot_h + 5;  // Below the main plot

    SDL_SetRenderDrawColor(rend, 100, 200, 255, 255);  // Light blue for X profile
    for (int i = 0; i < nx - 1; i++) {
        double t1 = temps[0][i];
        double t2 = temps[0][i+1];
        double norm1 = (t1 - t_min_) / (t_max_ - t_min_);
        double norm2 = (t2 - t_min_) / (t_max_ - t_min_);

        norm1 = std::max(0.0, std::min(1.0, norm1));
        norm2 = std::max(0.0, std::min(1.0, norm2));

        int x1 = plot_x + (i * plot_w) / nx;
        int x2 = plot_x + ((i + 1) * plot_w) / nx;
        int y1 = profile_y + profile_h - static_cast<int>(norm1 * profile_h);
        int y2 = profile_y + profile_h - static_cast<int>(norm2 * profile_h);

        SDL_RenderDrawLine(rend, x1, y1, x2, y2);
    }

    // Draw temperature profile along left edge (X=0, varying Y)
    int profile_w = 20;  // Width of profile graph
    int profile_x = plot_x - profile_w - 5;  // Left of the main plot

    SDL_SetRenderDrawColor(rend, 255, 200, 100, 255);  // Orange for Y profile
    for (int j = 0; j < ny - 1; j++) {
        double t1 = temps[j][0];
        double t2 = temps[j+1][0];
        double norm1 = (t1 - t_min_) / (t_max_ - t_min_);
        double norm2 = (t2 - t_min_) / (t_max_ - t_min_);
        norm1 = std::max(0.0, std::min(1.0, norm1));
        norm2 = std::max(0.0, std::min(1.0, norm2));

        int y1 = plot_y + plot_h - (j * plot_h) / ny;
        int y2 = plot_y + plot_h - ((j + 1) * plot_h) / ny;
        int x1 = profile_x + static_cast<int>(norm1 * profile_w);
        int x2 = profile_x + static_cast<int>(norm2 * profile_w);

        SDL_RenderDrawLine(rend, x1, y1, x2, y2);
    }

    // Temperature values at key positions
    struct ProjPt2D { int i; int j; };
    ProjPt2D proj_pts_2d[] = {
        {0, 0},           // Bottom-left (Neumann corner)
        {nx-1, ny-1},     // Top-right (Dirichlet corner)
        {nx/2, ny/2}      // Center
    };

    for (int k = 0; k < 3; k++) {
        int pi = proj_pts_2d[k].i;
        int pj = proj_pts_2d[k].j;
        double temp_val = temps[pj][pi];

        int px = plot_x + (pi * plot_w) / nx;
        int py = plot_y + plot_h - (pj * plot_h) / ny;  // Y flipped

        // Draw marker
        SDL_SetRenderDrawColor(rend, 255, 255, 0, 255);
        for (int dx = -2; dx <= 2; dx++) {
            for (int dy = -2; dy <= 2; dy++) {
                if (dx*dx + dy*dy <= 4) SDL_RenderDrawPoint(rend, px + dx, py + dy);
            }
        }

        // Draw temperature value
        SDL_SetRenderDrawColor(rend, 255, 255, 150, 255);
        char val_buf[16];
        snprintf(val_buf, sizeof(val_buf), "%.0f", temp_val);

        // Position label
        int lx = px + 4, ly = py - 5;
        if (pi == 0) lx = px - 22;
        if (pj == ny-1) ly = py + 2;

        draw_text(rend, lx, ly, val_buf);
    }

    // Draw colorbar on right side
    int cb_x = cell_x + cell_w - margin_right + 5;
    int cb_w = 12;
    int cb_h = plot_h;
    for (int i = 0; i < cb_h; ++i) {
        double t = t_max_ - (i * (t_max_ - t_min_)) / cb_h;
        Uint8 r, g, b;
        temp_to_rgb(t, r, g, b);
        SDL_SetRenderDrawColor(rend, r, g, b, 255);
        SDL_RenderDrawLine(rend, cb_x, plot_y + i, cb_x + cb_w, plot_y + i);
    }

    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);

    SDL_Rect cb_border = {cb_x - 1, plot_y - 1, cb_w + 2, cb_h + 2};
    SDL_RenderDrawRect(rend, &cb_border);

    // Colorbar labels (min/max)
    draw_number(rend, cb_x + cb_w + 3, plot_y - 3, t_max_);
    draw_number(rend, cb_x + cb_w + 3, plot_y + cb_h - 8, t_min_);

    // Draw axes
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    SDL_RenderDrawLine(rend, plot_x, plot_y + plot_h, plot_x + plot_w, plot_y + plot_h);  // X-axis
    SDL_RenderDrawLine(rend, plot_x, plot_y, plot_x, plot_y + plot_h);  // Y-axis

    // X-axis labels (0 and L)
    draw_number(rend, plot_x - 5, plot_y + plot_h + 5, 0.0);
    draw_number(rend, plot_x + plot_w - 15, plot_y + plot_h + 5, info.L);

    // Y-axis labels (0 and L)
    draw_number(rend, plot_x - 30, plot_y + plot_h - 8, 0.0);
    draw_number(rend, plot_x - 30, plot_y - 3, info.L);

    // Axis labels with ΔT for temperature increase (colorbar)
    SDL_SetRenderDrawColor(rend, 180, 180, 180, 255);
    draw_text(rend, plot_x + plot_w / 2 - 10, plot_y + plot_h + 25, "X[M]");
    draw_text(rend, plot_x - 30, plot_y + plot_h / 2 - 5, "Y");
    // ΔT label next to colorbar
    draw_text(rend, cb_x - 10, plot_y - 12, "DT[K]");

    // Boundary condition labels
    SDL_SetRenderDrawColor(rend, 150, 255, 150, 255);
    draw_text(rend, plot_x - 5, plot_y + plot_h + 15, "N");  // Neumann at x=0, y=0

    SDL_SetRenderDrawColor(rend, 255, 180, 100, 255);
    draw_text(rend, plot_x + plot_w - 10, plot_y + plot_h + 15, "D");  // Dirichlet at x=L
    draw_text(rend, plot_x + plot_w - 10, plot_y - 10, "D");  // Dirichlet at y=L

    // Heat source regions
    double src_x1 = 1.0/6.0, src_x2 = 2.0/6.0;
    double src_x3 = 4.0/6.0, src_x4 = 5.0/6.0;
    double src_y1 = 1.0/6.0, src_y2 = 2.0/6.0;
    double src_y3 = 4.0/6.0, src_y4 = 5.0/6.0;

    int sx1 = plot_x + static_cast<int>(src_x1 * plot_w);
    int sx2 = plot_x + static_cast<int>(src_x2 * plot_w);
    int sx3 = plot_x + static_cast<int>(src_x3 * plot_w);
    int sx4 = plot_x + static_cast<int>(src_x4 * plot_w);

    // Y flipped
    int sy1 = plot_y + plot_h - static_cast<int>(src_y2 * plot_h);
    int sy2 = plot_y + plot_h - static_cast<int>(src_y1 * plot_h);
    int sy3 = plot_y + plot_h - static_cast<int>(src_y4 * plot_h);
    int sy4 = plot_y + plot_h - static_cast<int>(src_y3 * plot_h);

    // Draw dithered fill pattern for heat sources (yellow/orange dots)
    SDL_SetRenderDrawColor(rend, 255, 200, 0, 255);
    // Bottom-left source
    for (int y = sy1; y < sy2; y += 4) {
        for (int x = sx1; x < sx2; x += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }
    // Bottom-right source
    for (int y = sy1; y < sy2; y += 4) {
        for (int x = sx3; x < sx4; x += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }
    // Top-left source
    for (int y = sy3; y < sy4; y += 4) {
        for (int x = sx1; x < sx2; x += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }
    // Top-right source
    for (int y = sy3; y < sy4; y += 4) {
        for (int x = sx3; x < sx4; x += 4) {
            SDL_RenderDrawPoint(rend, x, y);
        }
    }

    // Draw thick orange borders around heat sources
    SDL_SetRenderDrawColor(rend, 255, 150, 0, 255);
    SDL_Rect src_bl = {sx1, sy1, sx2 - sx1, sy2 - sy1};
    SDL_Rect src_br = {sx3, sy1, sx4 - sx3, sy2 - sy1};
    SDL_Rect src_tl = {sx1, sy3, sx2 - sx1, sy4 - sy3};
    SDL_Rect src_tr = {sx3, sy3, sx4 - sx3, sy4 - sy3};

    // Double border for visibility
    SDL_RenderDrawRect(rend, &src_bl);
    SDL_RenderDrawRect(rend, &src_br);
    SDL_RenderDrawRect(rend, &src_tl);
    SDL_RenderDrawRect(rend, &src_tr);
    SDL_Rect src_bl_in = {sx1+1, sy1+1, sx2-sx1-2, sy2-sy1-2};
    SDL_Rect src_br_in = {sx3+1, sy1+1, sx4-sx3-2, sy2-sy1-2};
    SDL_Rect src_tl_in = {sx1+1, sy3+1, sx2-sx1-2, sy4-sy3-2};
    SDL_Rect src_tr_in = {sx3+1, sy3+1, sx4-sx3-2, sy4-sy3-2};
    SDL_RenderDrawRect(rend, &src_bl_in);
    SDL_RenderDrawRect(rend, &src_br_in);
    SDL_RenderDrawRect(rend, &src_tl_in);
    SDL_RenderDrawRect(rend, &src_tr_in);

    // Find and draw min/max temperature markers
    int min_i = 0, min_j = 0, max_i = 0, max_j = 0;
    double min_temp = temps[0][0], max_temp = temps[0][0];
    for (int j = 0; j < ny; j++) {
        for (int i = 0; i < nx; i++) {
            if (temps[j][i] < min_temp) { min_temp = temps[j][i]; min_i = i; min_j = j; }
            if (temps[j][i] > max_temp) { max_temp = temps[j][i]; max_i = i; max_j = j; }
        }
    }

    // Min marker (blue circle ring)
    int minx = plot_x + (min_i * plot_w) / nx;
    int miny = plot_y + plot_h - (min_j * plot_h) / ny;  // Y flipped
    SDL_SetRenderDrawColor(rend, 100, 150, 255, 255);
    for (int dx = -4; dx <= 4; dx++) {
        for (int dy = -4; dy <= 4; dy++) {
            if (dx*dx + dy*dy <= 16 && dx*dx + dy*dy >= 4)
                SDL_RenderDrawPoint(rend, minx + dx, miny + dy);
        }
    }

    // Max marker (red circle ring)
    int maxx = plot_x + (max_i * plot_w) / nx;
    int maxy = plot_y + plot_h - (max_j * plot_h) / ny;  // Y flipped
    SDL_SetRenderDrawColor(rend, 255, 100, 100, 255);
    for (int dx = -4; dx <= 4; dx++) {
        for (int dy = -4; dy <= 4; dy++) {
            if (dx*dx + dy*dy <= 16 && dx*dx + dy*dy >= 4)
                SDL_RenderDrawPoint(rend, maxx + dx, maxy + dy);
        }
    }

    // Progress bar
    int bar_x = cell_x + cell_w - 65;
    int bar_y = cell_y + cell_h - 18;
    int bar_w = 55;
    int bar_h = 8;
    double progress = info.time / info.tmax;


    SDL_SetRenderDrawColor(rend, 60, 60, 60, 255);
    SDL_Rect bar_bg = {bar_x, bar_y, bar_w, bar_h};
    SDL_RenderFillRect(rend, &bar_bg);
    SDL_SetRenderDrawColor(rend, 80, 180, 80, 255);
    SDL_Rect bar_fg = {bar_x, bar_y, static_cast<int>(bar_w * progress), bar_h};
    SDL_RenderFillRect(rend, &bar_fg);
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    SDL_RenderDrawRect(rend, &bar_bg);

    // Speed indicator
    char speed_buf[16];
    snprintf(speed_buf, sizeof(speed_buf), "X%d", info.speed);
    SDL_SetRenderDrawColor(rend, 150, 200, 255, 255);
    draw_text(rend, cell_x + cell_w - 130, cell_y + cell_h - 18, speed_buf);

    // Paused indicator
    if (info.paused) {
        SDL_SetRenderDrawColor(rend, 255, 200, 50, 255);
        draw_text(rend, cell_x + 5, cell_y + cell_h - 18, "PAUSED");
    }

    // Draw border
    SDL_SetRenderDrawColor(rend, 100, 100, 100, 255);
    SDL_Rect border = {plot_x, plot_y, plot_w, plot_h};
    SDL_RenderDrawRect(rend, &border);
}

}
```

### SDL Application Controller Module
`sdl_app.hpp`
```cpp
/**
 * @file sdl_app.hpp
 * @brief SDL2 application for heat equation visualization
 */

#ifndef SDL_APP_HPP
#define SDL_APP_HPP

#include "SDL.h"
#include "sdl_window.hpp"
#include "sdl_heatmap.hpp"
#include "material.hpp"
#include "heat_equation_solver.hpp"
#include <memory>

namespace sdl {

/**
 * @class SDLApp
 * @brief Heat simulation with fullscreen visualization
 *
 * Controls: SPACE=pause, R=reset, UP/DOWN=speed, ESC=quit
 */
class SDLApp {
public:
    /**
     * @brief Type of simulation
     */
    enum class SimType { 
        BAR_1D,       ///< 1D heat equation (bar)
        PLATE_2D };   ///< 2D heat equation (plate)

private:
    std::unique_ptr<SDLWindow> window_;
    std::unique_ptr<SDLHeatmap> heatmap_;
    std::unique_ptr<ensiie::HeatEquationSolver1D> solver_1d_;
    std::unique_ptr<ensiie::HeatEquationSolver2D> solver_2d_;

    SimType sim_type_;           ///< Simulation type
    ensiie::Material material_;  ///< Selected material

    double L_;       ///< Domain size
    double tmax_;    ///< Maximum simulation time
    double u0_;      ///< Initial temperature
    double f_;       ///< Source intensity
    int n_;          ///< Grid resolution

    bool paused_;    ///< Pause state
    int speed_;      ///< Simulation speed
    bool running_;   ///< Application state
    bool grid_mode_; ///< Multi-material grid mode

    // For grid mode: 4 solvers (one per material)
    std::unique_ptr<ensiie::HeatEquationSolver1D> solvers_1d_[4];
    std::unique_ptr<ensiie::HeatEquationSolver2D> solvers_2d_[4];
    ensiie::Material materials_[4];

    void render();
    void render_grid();
    void process_events(SDL_Event& event);
    void start_simulation();
    void start_grid_simulation();

public:
    /**
     * @brief Create application for single material simulation
     */
    SDLApp(
        SimType type,
        const ensiie::Material& mat,
        double L,
        double tmax,
        double u0,
        double f
    );

    /**
     * @brief Create application in grid mode (all materials)
     */
    SDLApp(
        SimType type,
        double L,
        double tmax,
        double u0,
        double f
    );

    /**
     * @brief Run the application main loop
     */
    void run();
};

}

#endif
```

`sdl_app.cpp`
```cpp
/**
 * @file sdl_app.cpp
 * @brief SDL2 application implementation
 */

#include "sdl_app.hpp"
#include "sdl_core.hpp"
#include <algorithm>

namespace sdl {

// Single material constructor
SDLApp::SDLApp(
    SimType type,
    const ensiie::Material& mat,
    double L,
    double tmax,
    double u0,
    double f
)
    : window_(std::make_unique<SDLWindow>("Heat Equation", 800, 600, false))
    , heatmap_(std::make_unique<SDLHeatmap>(*window_, 280.0, 380.0))
    , solver_1d_(nullptr)
    , solver_2d_(nullptr)
    , sim_type_(type)
    , material_(mat)
    , L_(L)
    , tmax_(tmax)
    , u0_(u0)
    , f_(f)
    , n_(1001)
    , paused_(false)
    , speed_(10)
    , running_(true)
    , grid_mode_(false)
{
    start_simulation();
}

// Grid mode constructor (all 4 materials)
SDLApp::SDLApp(
    SimType type,
    double L,
    double tmax,
    double u0,
    double f
)
    : window_(nullptr)
    , heatmap_(nullptr)
    , solver_1d_(nullptr)
    , solver_2d_(nullptr)
    , sim_type_(type)
    , material_(ensiie::Materials::COPPER)
    , L_(L)
    , tmax_(tmax)
    , u0_(u0)
    , f_(f)
    , n_(1001)
    , paused_(false)
    , speed_(10)
    , running_(true)
    , grid_mode_(true)
{
    // Use 0,0 to trigger maximized window mode
    window_ = std::make_unique<SDLWindow>("Heat Equation - All Materials", 0, 0, false);
    heatmap_ = std::make_unique<SDLHeatmap>(*window_, 280.0, 380.0);

    // Initialize 4 materials
    materials_[0] = ensiie::Materials::COPPER;
    materials_[1] = ensiie::Materials::IRON;
    materials_[2] = ensiie::Materials::GLASS;
    materials_[3] = ensiie::Materials::POLYSTYRENE;

    start_grid_simulation();
}

void SDLApp::start_simulation() {
    paused_ = false;

    if (sim_type_ == SimType::BAR_1D) {
        n_ = 1001;
        speed_ = 1;  
        solver_1d_ = std::make_unique<ensiie::HeatEquationSolver1D>(
            material_, L_, tmax_, u0_, f_, n_
        );
        solver_2d_.reset();
    } else {
        n_ = 101;
        speed_ = 1;  
        solver_2d_ = std::make_unique<ensiie::HeatEquationSolver2D>(
            material_, L_, tmax_, u0_, f_, n_
        );
        solver_1d_.reset();
    }
}

void SDLApp::start_grid_simulation() {
    paused_ = false;

    if (sim_type_ == SimType::BAR_1D) {
        n_ = 1001;
        speed_ = 1;  
        for (int i = 0; i < 4; i++) {
            solvers_1d_[i] = std::make_unique<ensiie::HeatEquationSolver1D>(
                materials_[i], L_, tmax_, u0_, f_, n_
            );
            solvers_2d_[i].reset();
        }
    } else {
        n_ = 101;
        speed_ = 1;  
        for (int i = 0; i < 4; i++) {
            solvers_2d_[i] = std::make_unique<ensiie::HeatEquationSolver2D>(
                materials_[i], L_, tmax_, u0_, f_, n_
            );
            solvers_1d_[i].reset();
        }
    }
}

void SDLApp::render() {
    window_->clear(0, 0, 0);

    SimInfo info;
    info.material_name = material_.name;
    info.alpha = material_.alpha();
    info.L = L_;
    info.tmax = tmax_;
    info.u0 = u0_ + 273.15;
    info.speed = speed_;
    info.paused = paused_;

    if (sim_type_ == SimType::BAR_1D && solver_1d_) {
        info.time = solver_1d_->get_time();
        auto temps = solver_1d_->get_temperature();
        if (!temps.empty()) {
            heatmap_->auto_range(temps);
            heatmap_->draw_1d_fullscreen(temps, info);
        }
    } else if (sim_type_ == SimType::PLATE_2D && solver_2d_) {
        info.time = solver_2d_->get_time();
        auto temps = solver_2d_->get_temperature_2d();
        if (!temps.empty() && !temps[0].empty()) {
            heatmap_->auto_range_2d(temps);
            heatmap_->draw_2d_fullscreen(temps, info);
        }
    }

    window_->present();
}

void SDLApp::render_grid() {
    window_->clear(0, 0, 0);

    int win_w = window_->get_width();
    int win_h = window_->get_height();
    int cell_w = win_w / 2;
    int cell_h = win_h / 2;

    // Grid positions: [0]=top-left, [1]=top-right, [2]=bottom-left, [3]=bottom-right
    int cell_x[4] = {0, cell_w, 0, cell_w};
    int cell_y[4] = {0, 0, cell_h, cell_h};

    // Reference temperature for ΔT calculation
    double u0_kelvin = u0_ + 273.15;

    // Find global min/max ΔT (temperature increase from u0)
    double global_min = 0.0;  // ΔT minimum is 0 (no heating)
    double global_max = 0.0;

    if (sim_type_ == SimType::BAR_1D) {
        for (int i = 0; i < 4; i++) {
            if (solvers_1d_[i]) {
                auto temps = solvers_1d_[i]->get_temperature();
                for (double t : temps) {
                    double delta_t = t - u0_kelvin;
                    global_max = std::max(global_max, delta_t);
                }
            }
        }
    } else {
        for (int i = 0; i < 4; i++) {
            if (solvers_2d_[i]) {
                auto temps = solvers_2d_[i]->get_temperature_2d();
                for (const auto& row : temps) {
                    for (double t : row) {
                        double delta_t = t - u0_kelvin;
                        global_max = std::max(global_max, delta_t);
                    }
                }
            }
        }
    }

    // Set range for ΔT: 0 to max with small margin
    double margin = global_max * 0.05;
    if (global_max < 0.1) global_max = 1.0;  // Minimum range for visibility
    heatmap_->set_range(global_min, global_max + margin);

    // Render each material in its cell
    for (int i = 0; i < 4; i++) {
        SimInfo info;
        info.material_name = materials_[i].name;
        info.alpha = materials_[i].alpha();
        info.L = L_;
        info.tmax = tmax_;
        info.u0 = u0_kelvin;
        info.speed = speed_;
        info.paused = paused_;

        if (sim_type_ == SimType::BAR_1D && solvers_1d_[i]) {
            info.time = solvers_1d_[i]->get_time();
            auto temps = solvers_1d_[i]->get_temperature();
            if (!temps.empty()) {
                // Convert to ΔT
                std::vector<double> delta_temps(temps.size());
                for (size_t j = 0; j < temps.size(); j++) {
                    delta_temps[j] = temps[j] - u0_kelvin;
                }
                heatmap_->draw_1d_cell(delta_temps, info, cell_x[i], cell_y[i], cell_w, cell_h);
            }
        } else if (sim_type_ == SimType::PLATE_2D && solvers_2d_[i]) {
            info.time = solvers_2d_[i]->get_time();
            auto temps = solvers_2d_[i]->get_temperature_2d();
            if (!temps.empty() && !temps[0].empty()) {
                // Convert to ΔT
                std::vector<std::vector<double>> delta_temps(temps.size());
                for (size_t j = 0; j < temps.size(); j++) {
                    delta_temps[j].resize(temps[j].size());
                    for (size_t k = 0; k < temps[j].size(); k++) {
                        delta_temps[j][k] = temps[j][k] - u0_kelvin;
                    }
                }
                heatmap_->draw_2d_cell(delta_temps, info, cell_x[i], cell_y[i], cell_w, cell_h);
            }
        }
    }

    // Draw grid separators 
    SDL_Renderer* rend = window_->get_renderer();
    SDL_SetRenderDrawColor(rend, 255, 255, 255, 255);
    // Vertical separator (3 pixels wide)
    for (int dx = -1; dx <= 1; dx++) {
        SDL_RenderDrawLine(rend, cell_w + dx, 0, cell_w + dx, win_h);
    }
    // Horizontal separator (3 pixels wide)
    for (int dy = -1; dy <= 1; dy++) {
        SDL_RenderDrawLine(rend, 0, cell_h + dy, win_w, cell_h + dy);
    }

    // Add corner markers
    SDL_SetRenderDrawColor(rend, 200, 200, 200, 255);
    int corner_size = 10;
    
    // Center cross highlight
    SDL_RenderDrawLine(rend, cell_w - corner_size, cell_h, cell_w + corner_size, cell_h);
    SDL_RenderDrawLine(rend, cell_w, cell_h - corner_size, cell_w, cell_h + corner_size);

    window_->present();
}

void SDLApp::process_events(SDL_Event& event) {
    if (event.type == SDL_KEYDOWN) {
        switch (event.key.keysym.sym) {
            case SDLK_ESCAPE:
                running_ = false;
                break;
            case SDLK_SPACE:
                paused_ = !paused_;
                break;
            case SDLK_r:
                if (grid_mode_) {
                    for (int i = 0; i < 4; i++) {
                        if (solvers_1d_[i]) solvers_1d_[i]->reset();
                        if (solvers_2d_[i]) solvers_2d_[i]->reset();
                    }
                } else {
                    if (solver_1d_) solver_1d_->reset();
                    if (solver_2d_) solver_2d_->reset();
                }
                paused_ = false;
                break;
            case SDLK_UP:
                speed_ = std::min(sim_type_ == SimType::BAR_1D ? 50 : 20, speed_ + 5);
                break;
            case SDLK_DOWN:
                speed_ = std::max(1, speed_ - 5);
                break;
        }
    }
}

void SDLApp::run() {
    while (running_) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT ||
                (event.type == SDL_WINDOWEVENT &&
                 event.window.event == SDL_WINDOWEVENT_CLOSE)) {
                running_ = false;
            }
            process_events(event);
        }

        if (!running_) break;

        if (!paused_) {
            for (int s = 0; s < speed_; s++) {
                if (grid_mode_) {
                    bool all_done = true;
                    for (int i = 0; i < 4; i++) {
                        if (sim_type_ == SimType::BAR_1D && solvers_1d_[i]) {
                            if (solvers_1d_[i]->step()) all_done = false;
                        } else if (sim_type_ == SimType::PLATE_2D && solvers_2d_[i]) {
                            if (solvers_2d_[i]->step()) all_done = false;
                        }
                    }
                    if (all_done) {
                        paused_ = true;
                        break;
                    }
                } else {
                    if (sim_type_ == SimType::BAR_1D && solver_1d_) {
                        if (!solver_1d_->step()) {
                            paused_ = true;
                            break;
                        }
                    } else if (sim_type_ == SimType::PLATE_2D && solver_2d_) {
                        if (!solver_2d_->step()) {
                            paused_ = true;
                            break;
                        }
                    }
                }
            }
        }

        if (grid_mode_) {
            render_grid();
        } else {
            render();
        }
        SDLCore::delay(16);
    }

    heatmap_.reset();
    window_.reset();
}

}
```

### Main program
`main.cpp`
```cpp
/**
 * @file main.cpp
 * @brief Console menu and SDL2 visualization launcher
 */

#include "sdl_core.hpp"
#include "sdl_app.hpp"
#include "material.hpp"

#include <iostream>
#include <string>
#include <limits>
#include <iomanip>

void clear_input() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

void print_header() {
    std::cout << "\n";
    std::cout << "========================================\n";
    std::cout << "   HEAT EQUATION SIMULATOR\n";
    std::cout << "   ENSIIE - Master 1\n";
    std::cout << "========================================\n\n";
}

int select_simulation_type() {
    std::cout << "SELECT SIMULATION TYPE\n";
    std::cout << "----------------------\n";
    std::cout << "  1. 1D Bar  (All 4 Materials - 2x2 Grid)\n";
    std::cout << "  2. 2D Plate (All 4 Materials - 2x2 Grid)\n";
    std::cout << "  0. Quit\n";
    std::cout << "Choice: ";

    int choice;
    if (!(std::cin >> choice)) {
        clear_input();
        return -1;
    }
    return choice;
}

bool get_parameters(double& L, double& tmax, double& u0, double& f) {
    std::cout << "\nPARAMETERS (Enter for default, 'b' to go back)\n";
    std::cout << "----------------------------------------------\n";

    std::string input;
    clear_input();

    std::cout << "Domain length L [1.0] m: ";
    std::getline(std::cin, input);
    if (input == "b" || input == "B") return false;
    if (!input.empty()) {
        try { L = std::stod(input); } catch (...) { L = 1.0; }
    }

    std::cout << "Max time tmax [16.0] s: ";
    std::getline(std::cin, input);
    if (input == "b" || input == "B") return false;
    if (!input.empty()) {
        try { tmax = std::stod(input); } catch (...) { tmax = 16.0; }
    }

    std::cout << "Initial temp u0 [13.0] C: ";
    std::getline(std::cin, input);
    if (input == "b" || input == "B") return false;
    if (!input.empty()) {
        try { u0 = std::stod(input); } catch (...) { u0 = 13.0; }
    }

    std::cout << "Source amplitude f [80.0] C: ";
    std::getline(std::cin, input);
    if (input == "b" || input == "B") return false;
    if (!input.empty()) {
        try { f = std::stod(input); } catch (...) { f = 80.0; }
    }

    return true;
}

bool confirm_and_start_grid(int sim_type, double L, double tmax, double u0, double f) {
    const char* sim_names[] = {"1D Bar", "2D Plate"};

    std::cout << "\nCONFIGURATION (2x2 Grid - All Materials)\n";
    std::cout << "----------------------------------------\n";
    std::cout << "  Type:      " << sim_names[sim_type - 1] << "\n";
    std::cout << "  Materials: Copper, Iron, Glass, Polystyrene\n";
    std::cout << "  L=" << L << " m, tmax=" << tmax << " s\n";
    std::cout << "  u0=" << u0 << " C, f=" << f << " C\n\n";
    std::cout << "Controls: SPACE=pause, R=reset, UP/DOWN=speed, ESC=quit\n\n";
    std::cout << "[S]tart  [B]ack  [Q]uit: ";

    char choice;
    std::cin >> choice;
    return (std::tolower(choice) == 's');
}

int main() {
    bool running = true;

    while (running) {
        print_header();

        int sim_type = select_simulation_type();
        if (sim_type == 0) {
            std::cout << "\nExit.\n";
            break;
        }
        if (sim_type < 1 || sim_type > 2) {
            std::cout << "\nInvalid choice.\n";
            continue;
        }

        double L = 1.0, tmax = 16.0, u0 = 13.0, f = 80.0;

        // Grid mode (all 4 materials)
        if (!get_parameters(L, tmax, u0, f)) continue;
        if (!confirm_and_start_grid(sim_type, L, tmax, u0, f)) continue;

        std::cout << "\nStarting grid simulation...\n";

        try {
            sdl::SDLCore::init();

            sdl::SDLApp::SimType type = (sim_type == 1)
                ? sdl::SDLApp::SimType::BAR_1D
                : sdl::SDLApp::SimType::PLATE_2D;

            sdl::SDLApp app(type, L, tmax, u0, f);  // Grid mode constructor
            app.run();

            sdl::SDLCore::quit();
            std::cout << "\nReturning to menu...\n";

        } catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
            sdl::SDLCore::quit();
        }
    }

    return 0;
}
```

### Documentation config
`Doxyfile`
```text 
# Doxyfile 1.9.0 - Configuration file for Doxygen
#
# Heat Equation Simulator Documentation
# ENSIIE - Master 1 - Programmation Avancee
#

#---------------------------------------------------------------------------
# Project related configuration options
#---------------------------------------------------------------------------

PROJECT_NAME           = "Heat Equation Simulator"
PROJECT_NUMBER         = "1.0"
PROJECT_BRIEF          = "1D and 2D Heat Equation Solver using Implicit Finite Differences with SDL2 Visualization"
PROJECT_LOGO           =

OUTPUT_DIRECTORY       = doc
CREATE_SUBDIRS         = NO
OUTPUT_LANGUAGE        = English

#---------------------------------------------------------------------------
# Build related configuration options
#---------------------------------------------------------------------------

EXTRACT_ALL            = YES
EXTRACT_PRIVATE        = YES
EXTRACT_STATIC         = YES
EXTRACT_LOCAL_CLASSES  = YES

HIDE_UNDOC_MEMBERS     = NO
HIDE_UNDOC_CLASSES     = NO
BRIEF_MEMBER_DESC      = YES
REPEAT_BRIEF           = YES

#---------------------------------------------------------------------------
# Input configuration
#---------------------------------------------------------------------------

INPUT                  = .
INPUT_ENCODING         = UTF-8
FILE_PATTERNS          = *.cpp *.hpp *.h
RECURSIVE              = NO
EXCLUDE                =
EXCLUDE_PATTERNS       =

#---------------------------------------------------------------------------
# Source browsing options
#---------------------------------------------------------------------------

SOURCE_BROWSER         = YES
INLINE_SOURCES         = NO
STRIP_CODE_COMMENTS    = NO
REFERENCED_BY_RELATION = YES
REFERENCES_RELATION    = YES

#---------------------------------------------------------------------------
# Alphabetical index options
#---------------------------------------------------------------------------

ALPHABETICAL_INDEX     = YES

#---------------------------------------------------------------------------
# HTML output options
#---------------------------------------------------------------------------

GENERATE_HTML          = YES
HTML_OUTPUT            = html
HTML_FILE_EXTENSION    = .html
HTML_COLORSTYLE_HUE    = 220
HTML_COLORSTYLE_SAT    = 100
HTML_COLORSTYLE_GAMMA  = 80
HTML_DYNAMIC_SECTIONS  = YES
GENERATE_TREEVIEW      = YES
TREEVIEW_WIDTH         = 250

#---------------------------------------------------------------------------
# LaTeX output options
#---------------------------------------------------------------------------

GENERATE_LATEX         = NO

#---------------------------------------------------------------------------
# Configuration for formulas
#---------------------------------------------------------------------------

USE_MATHJAX            = YES
MATHJAX_FORMAT         = HTML-CSS
MATHJAX_RELPATH        = https://cdn.jsdelivr.net/npm/mathjax@3/es5/

#---------------------------------------------------------------------------
# Preprocessor options
#---------------------------------------------------------------------------

ENABLE_PREPROCESSING   = YES
MACRO_EXPANSION        = NO
EXPAND_ONLY_PREDEF     = NO

#---------------------------------------------------------------------------
# Diagram options
#---------------------------------------------------------------------------

HAVE_DOT               = YES
DOT_IMAGE_FORMAT       = svg
DOT_TRANSPARENT        = YES
DOT_GRAPH_MAX_NODES    = 100

UML_LOOK               = YES
CLASS_GRAPH            = YES
COLLABORATION_GRAPH    = YES
INCLUDE_GRAPH          = YES
INCLUDED_BY_GRAPH      = YES

CALL_GRAPH             = YES
CALLER_GRAPH           = YES


#---------------------------------------------------------------------------
# Warnings
#---------------------------------------------------------------------------

QUIET                  = NO
WARNINGS               = YES
WARN_IF_UNDOCUMENTED   = YES
WARN_IF_DOC_ERROR      = YES
WARN_NO_PARAMDOC       = NO

#---------------------------------------------------------------------------
# Main page content
#---------------------------------------------------------------------------

USE_MDFILE_AS_MAINPAGE =
```

## Simulation Results

### 1D Simulations

- **Copper:** Rapid diffusion with wide and smooth temperature profiles  
- **Iron:** Moderate diffusion with more pronounced gradients  
- **Glass:** Limited diffusion with sharp, localized peaks  
- **Polystyrene:** Negligible diffusion; heat remains confined near the sources  

![1D heat diffusion simulation for four materials](/images/heatcpp_project/1D.png)

### 2D Simulations

- **Copper:** Large thermal halos with efficient radial heat propagation  
- **Iron:** Moderate spreading with smoothly rounded isotherms  
- **Glass:** Highly localized heat distribution with sharp boundaries  
- **Polystyrene:** Maximum thermal insulation with minimal heat propagation  

![2D heat diffusion simulation for four materials](/images/heatcpp_project/2d.png)

--- 

## Algorithm Complexity

| Case | Method | Complexity | Speedup |
|------|--------|------------|---------|
| 1D | Thomas Algorithm | O(n) | 1000× vs O(n³) |
| 2D | Gauss-Seidel | O(kn²) | 1,000,000× vs O(n⁶) |

## References
### Numerical Methods
- [Tridiagonal Matrix Algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm)
- [Gauss-Seidel Method (Wikipedia)](https://en.wikipedia.org/wiki/Gauss%E2%80%93Seidel_method)
- [Finite Difference Method (Wikipedia)](https://en.wikipedia.org/wiki/Finite_difference_method)

### Libraries
- [SDL2 - Simple DirectMedia Layer](https://www.libsdl.org/)
- [Doxygen - Documentation Generator](https://www.doxygen.nl/)