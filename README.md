# 🍳 DayBite

> Meals that fit your life, not the other way around.

**DayBite** is an AI-powered, glassmorphism-styled web application powered by **Gemini 2.5 Flash** that instantly generates personalized, budget-conscious meal plans and grocery lists tailored directly to your chaotic daily schedule, complete with a smart "Make it Cheaper" substitution engine to guarantee you never overspend.

---

## 🚀 Live Demo
**[Play with DayBite Live on Vercel](https://promptwarsproj.vercel.app)**

## ✨ Features

- **Schedule-Aware Generation:** Input your daily schedule (e.g., "Back-to-back meetings until 7 PM") and receive meal suggestions that actually fit your time constraints.
- **Budget Feasibility Tracker:** Dynamically calculates total costs. A visual progress meter turns red if your AI-generated meal plan exceeds your designated daily limit.
- **AI "Make it Cheaper" Engine:** Got a meal that's too expensive? Click "Make it Cheaper" to trigger a targeted AI re-prompt. The system will swap out that specific meal for a budget-friendly alternative while maintaining the rest of your daily plan and updating your total cost.
- **Automated Grocery Lists:** Instantly generates a consolidated shopping list based on your exact meal plan.
- **Stunning UI:** Built with a modern, fully-responsive **Glassmorphism** design system, featuring fluid micro-animations, glowing accents, and a deep-space aesthetic.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Vanilla CSS (Glassmorphism UI)
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash model)
- **Testing:** Vitest, React Testing Library, Happy DOM
- **Deployment:** Vercel

## 🏆 Hackathon Polish

This project has been rigorously audited and optimized for competition:
- **Strict Typing:** Zero `any` usage. Complete TypeScript interfaces enforce contract stability between the UI and AI data payloads.
- **Robust Error Handling:** Strict JSON schema parsing and `try/catch` boundaries ensure the app safely catches AI hallucinations without crashing the React tree.
- **Performance Optimized:** Uses `React.memo` and custom hooks (`useMealPlanner`) to prevent excessive component re-rendering during form inputs.
- **100% Accessible (A11y):** Fully compliant with semantic HTML, `aria-live` dynamic regions, and `aria-label` tags for screen readers.
- **Test Coverage:** Core AI parsing logic and UI state transitions are backed by a fully passing Vitest test suite.

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akshayurs/promptwars_proj.git
   cd promptwars_proj
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY="your_api_key_here"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm run test
   ```
