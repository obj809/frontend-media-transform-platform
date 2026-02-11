# Frontend Data Processing Engine

[![CI](https://github.com/obj809/frontend-media-transform-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/obj809/frontend-media-transform-platform/actions/workflows/ci.yml)

Next.js frontend for uploading images (JPG, PNG, HEIC), triggering backend processing, previewing results, and downloading.

## Stack

- Next.js 16
- React 19
- TypeScript
- Sass
- Jest + Testing Library

## Prerequisites

- Node.js 20+
- Backend API running (default: `http://localhost:8000`)

## Setup

```bash
npm install
```

Create `.env.local` if you want a non-default API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint
- `npm test` - run tests
- `npm run test:watch` - run tests in watch mode

## App Flow

1. Frontend checks backend health (`GET /health`)
2. User selects or drags an image file (JPG, PNG, or HEIC; max 25MB)
3. Frontend uploads to `POST /upload`
4. Backend converts to JPG and returns metadata
5. UI renders processed image from `GET /download/{filename}`
6. User can download the processed file

## Supported Formats

- **Input**: JPG, PNG, HEIC/HEIF
- **Output**: JPG (from backend)
