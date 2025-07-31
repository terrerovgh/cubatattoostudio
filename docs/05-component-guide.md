# Component Guide

This guide provides a detailed explanation of the components used in this project.

## Common Components

These components are located in `src/components/common/` and are used across multiple pages.

### `Button.astro`

The `Button` component is a reusable button that can be styled with different variants.

**Props:**

-   `variant` (optional, string): The button style. Can be `primary` or `secondary`. Defaults to `primary`.
-   `href` (optional, string): If provided, the button will be rendered as an `<a>` tag.
-   `target` (optional, string): The target attribute for the link. Only used if `href` is provided.
-   `rel` (optional, string): The rel attribute for the link. Only used if `href` is provided.

**Usage:**

```astro
---
import Button from '../components/common/Button.astro';
---

<Button>Click me</Button>
<Button variant="secondary" href="/contact">Contact us</Button>
```

### `Footer.astro`

The `Footer` component is the site-wide footer. It contains links to social media and other important pages.

**Usage:**

```astro
---
import Footer from '../components/common/Footer.astro';
---

<Footer />
```

## Layout Components

These components are located in `src/components/layout/` and are used to structure the layout of pages.

### `Header.astro`

The `Header` component is the site-wide header. It contains the logo and the main navigation.

**Usage:**

```astro
---
import Header from '../components/layout/Header.astro';
---

<Header />
```

### `Navbar.astro`

The `Navbar` component is the main navigation menu. It is used within the `Header` component.

**Usage:**

```astro
---
import Navbar from '../components/layout/Navbar.astro';
---

<Navbar />
```

## Layouts

These components are located in `src/layouts/` and define the overall HTML structure of pages.

### `BaseLayout.astro`

The `BaseLayout` component is the base layout for all pages. It includes the `Header`, `Footer`, and the basic HTML document structure.

**Props:**

-   `title` (string): The title of the page.

**Usage:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="My Page">
  <h1>Hello, world!</h1>
</BaseLayout>
```
