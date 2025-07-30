---
layout: page
title: Component Mapping & Functional Overview
---

<link rel="stylesheet" href="assets/css/custom.css">
<script src="assets/js/animations.js"></script>

<div class="docs-hero">
  <img src="assets/images/logo.png" alt="Cubatattoo Studio Banner" style="max-width:220px;margin-bottom:1rem;">
  <h1>Component Mapping & Functional Overview</h1>
  <p>Detailed mapping of UI components and their roles.</p>
  <nav class="docs-nav">
    <a href="index.html">Home</a>
    <a href="1-introduction_overview.html">Overview</a>
    <a href="2-architectural_strategic_fundamentals.html">Architecture</a>
    <a href="4-ejecucion_agentes_flujos_operativos.html">Agents & Flows</a>
    <a href="5-roadmap_temporal_planning.html">Roadmap</a>
    <a href="6-annexes_references.html">Annexes</a>
  </nav>
</div>

# Component Mapping and Functional Overview

This document provides a detailed mapping between system components and implemented functionalities, enabling AI agents and developers to understand technical relationships and plan development efficiently.

## Component-Function Matrix
| Component                | Functionality                                      | Page/Context                |
|--------------------------|----------------------------------------------------|-----------------------------|
| Hero Section             | Visual impact, brand introduction                  | Homepage                    |
| Featured Artists         | Showcase principal artists                         | Homepage                    |
| Portfolio Grid           | Display curated works                              | Homepage, Portfolio         |
| Artist Card/Grid         | Present artist profiles                            | Artists                     |
| Artist Profile           | Detailed bio, personal gallery, booking CTA        | Artist Profile              |
| Studio Tour              | Visual walkthrough, hygiene info                   | Studio                      |
| Contact Form             | Client qualification, booking requests              | Contact                     |
| Google Map Embed         | Location info                                      | Contact                     |
| Booking Policy           | Reservation, deposit, cancellation info             | Contact                     |
| Custom Cursor            | Artistic UI enhancement                            | Global                      |
| Model Viewer             | 3D/AR presentation (if available)                  | Studio                      |

## Technical Notes
- All components must be implemented as modular, reusable React/TypeScript files.
- Third-party components from reactbits.dev must be placed in `/src/components/react-bits/`.
- Each functionality is cross-referenced with the relevant page and mapped to the corresponding UI component.

---
