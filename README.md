1111# Architect AI: The Sovereign Growth Engine

**Live Demo:** This application is designed to be deployed and experienced live. The interactive AI audit on the homepage is the best way to see it in action!

---

## The Vision: From Agency to Autonomy

Architect AI is a full-stack Next.js application that serves as both a demonstration of advanced development capabilities and the front door to a new model of business consulting. Founded on the principle of **digital sovereignty**, this project moves beyond the traditional agency model by empowering businesses with their own autonomous growth engines.

Instead of relying on teams, we build intelligent systems. This application is the blueprint, showcasing how we leverage a sovereign Google Cloud infrastructure, custom AI, and powerful automation to create scalable, efficient, and independent commerce solutions.

## Core Features

This is not just a landing page; it's a fully functional suite of tools designed to provide immediate value.

*   **⚡️ Instant AI Audits:** Users can enter a website or social media URL on the homepage and receive a real-time, comprehensive analysis covering SEO, content strategy, and actionable growth opportunities.
*   **🤖 Conversational AI Strategist:** An interactive chatbot powered by Google's Gemini 2.5 Flash, trained to provide high-value insights on business growth and help users clarify their strategic goals.
*   **📈 Growth Tracking Dashboard:** A client-side dashboard that visualizes audit history and performance metrics over time, showcasing data-driven growth.
*   **⚙️ Automation Lab & n8n Integration:** A showcase of our automation capabilities, explaining how we use tools like `n8n.io` to create efficient, autonomous workflows for businesses.
*   **🎓 Prompt Engineering Academy:** An interactive educational module that teaches users how to master the art of AI prompt engineering.
*   **🔐 Secure, Multi-Tenant Authentication:** A robust authentication system using Firebase Auth, supporting both guest (anonymous) and registered users with secure data isolation.

## Technical Architecture & Philosophy

This project is a testament to modern, scalable, and secure web development practices.

### Frontend
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI for a professional, accessible, and customizable component library.
*   **Styling:** Tailwind CSS for a utility-first styling workflow.
*   **State Management:** A combination of React state/context and client-side data fetching for the dashboard.

### Backend & Database
*   **Database:** Google Firestore is used as the NoSQL database, chosen for its real-time capabilities and massive scalability.
*   **Data Modeling:** The Firestore structure is meticulously designed for **Authorization Independence** and **Structural Segregation**. All user data is isolated within a `/users/{userId}` path, enforcing ownership at the data-model level. This is detailed in `docs/backend.json`.
*   **Security:** Firestore Security Rules are implemented with the **principle of least privilege**. Instead of broad `read/write` access, rules are granular, specifying `get`, `list`, `create`, `update`, `delete` permissions. This ensures data integrity and prevents unauthorized access. The rules are documented in `firestore.rules`.
*   **Deployment:** The application is designed for serverless deployment on platforms like Firebase App Hosting, leveraging Google's global infrastructure.

### Artificial Intelligence
*   **Framework:** Google's **Genkit** is used to orchestrate all AI flows, providing a structured and maintainable way to interact with large language models.
*   **Model:** **Gemini 2.5 Flash** serves as the core cognition engine, chosen for its exceptional balance of speed, intelligence, and cost-effectiveness for real-time analysis and chat.
*   **Flows:** Custom AI flows are defined for different tasks, such as website analysis (`audit-flow.ts`), social media audits (`social-audit-flow.ts`), and conversational chat (`chat-flow.ts`), each with structured (Zod) schemas for reliable input and output.

### Automation
*   **Engine:** **n8n.io** is the designated workflow automation tool. The application's narrative and showcases are built around the concept of integrating `n8n` to connect disparate systems and execute complex business processes autonomously.

## Using This Project as a Portfolio

This repository is designed to be a living portfolio piece. It demonstrates not just coding ability, but also architectural thinking, security-consciousness, and a strong product vision. The best way to experience it is through the live demo, where you can interact with the AI tools directly.

For a deeper dive into the philosophy and story behind the project, please visit the **[About The Architect](/about)** page on the live site.
