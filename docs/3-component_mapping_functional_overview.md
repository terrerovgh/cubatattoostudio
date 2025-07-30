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
