---
layout: post
title: "Open-ended interview problem for a competitive programmer"
date: 2026-08-25
tags: [Heuristics]
description: "I have to solve this in my own approach for the Capstone 1."
---

### Winning the Vote

There are $N$ teams and $N$ projects. Each team will ultimately be assigned to exactly one project.

Each project $i$ has a publicly known **affinity value**

$$
A_i,
$$

which represents how desirable that project is to the teams. The affinity values are shared by all teams and are known to every team.

Each team also has its own **underlying preference** over the projects. For team $T_j$, let

$$
V_{j,i}
$$

denote the value that team $T_j$ privately places on project $i$.

The underlying preferences $V_{j,i}$ are not directly provided to the professor. Instead, each team chooses how to communicate its preferences through a submitted form.

For each project $i$, team $T_j$ submits a score

$$
S_{j,i}\in\{1,\ldots,M\}.
$$

The submitted score does not necessarily have to represent the team's underlying preference $V_{j,i}$ truthfully. Different teams may use different strategies for translating their underlying preferences into submitted scores.

The professor does not observe the underlying preferences $V_{j,i}$. The professor only observes the submitted forms $S_{j,i}$.

The purpose of collecting the forms is to determine a suitable matching between teams and projects. The teams know this purpose and therefore understand that their submissions may affect the resulting assignment. However, the exact matching procedure used by the professor is not disclosed.

The professor determines the assignment using the submitted forms and does not have access to the teams' underlying preferences.

You have access to the publicly known affinity values $A_1,\ldots,A_N$, as well as your own underlying preferences $V_{1},\ldots,V_N$. However, you have no access to either:

1. the underlying preferences of the other teams, or
2. the forms submitted by the other teams.

You must therefore decide how to translate your own underlying preferences into a submitted preference vector

$$
S=(S_1,\ldots,S_N).
$$

Let $X$ denote the project ultimately assigned to your team.

Your utility is the affinity of the assigned project:

$$
U=A_X.
$$

Your objective is to choose a submission strategy that maximizes your expected utility:

$$
\boxed{
\max_{S(\cdot)}
\mathbb{E}[A_X]
}
$$

where the expectation is taken over the unknown underlying preferences and submissions of the other teams and any randomness in the assignment process.

The assignment process may first construct a pool containing the top $K$ candidate projects before determining the final assignment.

## Task

Determine an optimal strategy for communicating your preferences through the submitted form.

Before deriving a strategy, identify any additional assumptions or premises necessary to make the problem mathematically well-defined.

In particular, consider:

* How should the professor's objective of producing a "suitable" matching be formally defined?
* How does the professor interpret the submitted scores?
* How does the assignment mechanism resolve competition between teams for the same project?
* What information about the relationship between $V_{j,i}$ and $S_{j,i}$ is available?
* What assumptions should be made about the underlying preferences of other teams?
* What probability distribution, if any, governs those preferences?
* Are teams assumed to act strategically?
* Does the professor know or infer that teams may strategically transform their underlying preferences?
* Does the professor use the absolute values of submitted scores or only their relative ordering?
* How is the top-$K$ pool constructed, if applicable?

If the information provided is insufficient to determine an optimal strategy, explicitly identify the missing premises and explain why they are necessary.

After establishing the necessary premises, formulate the resulting optimization problem and derive a strategy for maximizing

$$
\mathbb{E}[A_X].
$$

Your solution should clearly distinguish between:

1. assumptions given in the problem,
2. assumptions introduced to make the problem solvable, and
3. conclusions that follow from those assumptions.
