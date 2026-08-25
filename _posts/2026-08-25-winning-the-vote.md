---
layout: post
title: "Open-ended interview problem for a competitive programmer"
date: 2026-08-25
tags: [Heuristics]
description: "A typical problem that awaits you at Capstone 1."
---

# Dominance on Vote

There are $N$ teams and $N$ projects. Each team will ultimately be assigned to exactly one project.

Each team has its own **affinity** for each project. For team $T_j$ and project $i$, let

$$
A_{j,i}
$$

denote how desirable project $i$ is to team $T_j$.

The affinity values are private. You know your own affinity values

$$
A_{1,1},A_{1,2},\ldots,A_{1,N},
$$

but you have no access to the affinity values of any other team.

Before the assignment, each team submits a form containing a score for every project. For team $T_j$ and project $i$, the submitted score is

$$
S_{j,i}\in\{1,\ldots,M\}.
$$

A team is free to choose how it translates its private affinities into submitted scores. In particular, the submitted scores do not necessarily have to equal the team's underlying affinities or truthfully represent them.

The professor does not observe the teams' private affinity values. The professor only observes the submitted forms.

The purpose of collecting the forms is to determine a suitable matching between teams and projects. The teams know this purpose and understand that their submissions may affect the resulting assignment. However, the exact matching procedure used by the professor is not disclosed.

You do not have access to either:

1. the private affinity values of the other teams, or
2. the forms submitted by the other teams.

You must therefore choose your own submitted preference vector

$$
S_1,S_2,\ldots,S_N
$$

based on your own affinities and the information available to you.

Let $X$ denote the project ultimately assigned to your team.

Your utility is the affinity you have for the assigned project:

$$
U=A_{1,X}.
$$

Your objective is to choose a submission strategy that maximizes your expected utility:

$$
\boxed{
\max_{S(\cdot)}
\mathbb{E}[A_{1,X}]
}
$$

where the expectation is taken over the unknown affinities and submissions of the other teams and any randomness in the assignment process.

## Task

Determine an optimal strategy for submitting your preferences.

Before deriving a strategy, identify any additional assumptions or premises necessary to make the problem mathematically well-defined.

In particular, consider:

* How should the professor's objective of producing a "suitable" matching be formally defined?
* How does the professor interpret the submitted scores?
* How does the assignment mechanism resolve competition between teams for the same project?
* What assumptions should be made about the private affinities of other teams?
* What probability distribution, if any, governs the unknown affinities and submissions of other teams?
* Are teams assumed to act strategically?
* Does the professor anticipate that teams may strategically misrepresent their affinities?
* Does the professor use the absolute values of submitted scores or only their relative ordering?
* How is the top-$K$ pool constructed, if applicable?

If the information provided is insufficient to determine an optimal strategy, explicitly identify the missing premises and explain why they are necessary.

After establishing the necessary premises, formulate the resulting optimization problem and derive a strategy for maximizing

$$
\mathbb{E}[A_{1,X}].
$$

Your solution should clearly distinguish between:

1. assumptions given in the problem,
2. assumptions introduced to make the problem solvable, and
3. conclusions that follow from those assumptions.
