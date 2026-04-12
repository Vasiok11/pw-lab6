# 💼 Developer Career Tracker

A client-side only web application designed for developers to track their professional growth, projects, and career milestones. The app is built with React and Vite, utilizing IndexedDB for persistent in-browser storage. 

App link: [TO BE ADDED - GitHub Pages]

## 🌟 App Description
Developer Career Tracker acts as a personal portfolio manager, learning tracker, and job hunt pipeline combined into a single, compact dashboard. It allows you to log the skills you've acquired, manage a portfolio of your technical projects, track the courses and resources you are currently learning, and keep an eye on active job applications.

All data is stored directly in your browser using persistent local storage (IndexedDB), providing full privacy and a snappy runtime experience without the need for a backend database.

## 📊 Core Entities

1. **Skills (Technical & soft skills)**
   * Name, category (languages, frameworks, tools, soft skills), proficiency level (beginner/intermediate/advanced/expert)
   * Self-assessment notes and associations 

2. **Projects (Portfolio items)**
   * Name, description, tech stack tags, repo link, live demo link
   * Status (planned/in-progress/completed), highlight/favorite toggle

3. **Learning Resources (Courses, tutorials, books)**
   * Title, platform, resource link
   * Status (to-learn/learning/completed), progress (percentage)

4. **Job Applications**
   * Company, position, application date
   * Status pipeline (applied/interview/offer/rejected/accepted)

## 📋 Key User Flows

* **Add New Skill:** 
  Navigate to Skills page → Click "Add Skill" → Enter name (e.g., "React") → Select category (Frontend Framework) → Set proficiency (Intermediate) → Save.
* **Log a Project:** 
  Navigate to Projects → Click "Add Project" → Enter name, description → Select tech stack (e.g., React, Node) → Add GitHub link → Mark as "portfolio-worthy" → Save.
* **Track Learning:** 
  Navigate to Learning → Click "Add Resource" → Enter course name → Set total modules and current progress → Save → Update progress bar as you learn.
* **Job Application Pipeline:** 
  Navigate to Jobs → Click "Add Application" → Fill in Company and Position details → Set status to "Applied" → Save. Update the status as you progress through the interview stages.

## 🛠 Tech Stack

* **Frontend Framework:** React (Vite)
* **Styling:** Custom theme with CSS/UI Library (Light/Dark mode supported)
* **State Management:** Zustand
* **Local Storage:** IndexedDB (for structured, persistent client-side data)
* **Routing:** React Router

## 🚀 Running Locally

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
