# hubertdeng.com

Personal site and blog built with React, Vite, TypeScript, and Markdown content.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The build writes static files to `dist`.

## Writing posts

Add Markdown files to `src/content/posts`. Required front matter:

```yaml
---
title: Post Title
description: One sentence summary.
date: 2026-06-05
tags:
  - engineering
---
```

The filename becomes the post slug.
