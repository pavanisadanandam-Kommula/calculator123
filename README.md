# EngineerCalc-Pro

EngineerCalc-Pro is a professional calculator dashboard built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. It is designed to support a suite of engineering tools with responsive layouts, reusable UI components, lazy loading, and input validation.

## Features

- Modular calculator pages: Basic, Scientific, Engineering, Matrix, Statistics, Unit Converter, CGPA
- Responsive UX with Tailwind CSS
- Animation support using Framer Motion
- Route-based lazy loading
- Error boundary handling and loading states
- Clean TypeScript interfaces and reusable components

## Project Structure

```
EngineerCalc-Pro/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── charts/
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── Dashboard/
│   ├── calculators/
│   │   ├── BasicCalculator/
│   │   ├── ScientificCalculator/
│   │   ├── EngineeringCalculator/
│   │   ├── MatrixCalculator/
│   │   ├── StatisticsCalculator/
│   │   ├── UnitConverter/
│   │   └── CGPACalculator/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── .gitignore
├── README.md
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vercel.json
└── eslint.config.js
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This project is configured for Vercel. Push the repository to GitHub and connect it to Vercel. The default `vercel.json` file handles static build deployment.

## Screenshots

- Screenshot 1: Landing page overview
- Screenshot 2: Dashboard calculators
- Screenshot 3: Mobile responsive layout

## Notes

- Use `npm run lint` to verify code quality.
- The app is designed with a clean component hierarchy and extensible calculator modules.
