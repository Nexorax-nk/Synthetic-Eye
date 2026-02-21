# ThirdEye

**NXT-GEN Hackathon Project - Track: Develocity**

Third-Eye is a next-generation monitoring and business flow intelligence platform designed to address critical blind spots in traditional monitoring systems. It focuses on user-journey-centric monitoring to ensure seamless business operations and proactive issue resolution.

---

## Problem Statement

Most monitoring systems only check if servers are running. However, real failures occur when users can't log in, payments fail, or checkout becomes slow, even while uptime dashboards stay green. These issues often go unnoticed until customers report them, leading to revenue loss and a decline in trust. Traditional infrastructure monitoring creates a dangerous blind spot where critical business flows break silently, leaving engineering teams reactive rather than preventive.

---

## Solution

ThirdEye provides a user-journey-centric monitoring layer that continuously validates critical business flows from the outside-in. It ensures that engineering teams know exactly which user flow is broken and where, with full context and evidence, before a single customer is affected or revenue is lost.

---

## Unique Selling Points (USP)

- **Synthetic Monitoring**: Simulate user interactions to proactively identify issues.
- **Real User Journey Tracking**: Monitor and validate real user flows.
- **Topwatch Latency (p50 / p95 / p99)**: Gain insights into performance metrics.
- **Step-Level Failure Detection**: Pinpoint exactly where failures occur in the user journey.
- **Proactive Monitoring**: Identify and resolve issues before they impact customers.
- **Startup-Friendly Observability**: Scalable and easy-to-use monitoring for startups.

---

## Project Structure

The project is organized as follows:

- **dummy-store/**: A sample store application built with React and Vite.
- **frontend/**: The main dashboard application built with React, TypeScript, and TailwindCSS.
- **monitor/**: Synthetic monitoring scripts for simulating user interactions.
- **monitoring backend/**: Python-based backend services for metrics processing and API endpoints.
- **synthetic-bot/**: Scripts for automated synthetic testing.

---

## Workflow

The following diagram illustrates the workflow of Synthetic-Eye:

![Workflow](attachment:image2)

1. **Playwright Bot**: Simulates user interactions with the e-commerce server.
2. **E-commerce Server**: Processes user actions and sends data to the backend.
3. **Backend-Flow Processing**: Handles data and processes metrics.
4. **Metrics Engine**: Analyzes data and generates insights.
5. **Dashboard**: Displays real-time telemetry and incident management tools.
6. **Alerts**: Sends alerts and snapshots via email and Discord.

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- Virtual environment tools (e.g., `venv`, `conda`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nexorax-nk/Synthetic-Eye.git
   cd Synthetic-Eye
   ```

2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Install dependencies for the backend:
   ```bash
   cd "monitoring backend/app"
   pip install -r requirements.txt
   ```

4. Set up the synthetic monitoring scripts:
   ```bash
   cd monitor
   npm install
   ```

### Running the Applications

- **Frontend Dashboard**:
  ```bash
  cd frontend
  npm run dev
  ```

- **Backend Services**:
  ```bash
  cd "monitoring backend/app"
  python main.py
  ```

- **Synthetic Monitoring**:
  ```bash
  cd monitor
  node bot.js
  ```

---

## Team Members

| Name               | GitHub Username       |
|--------------------|-----------------------|
| <span style="color:green">Naveen Kumar G</span>     | [Nexorax-nk](https://github.com/Nexorax-nk) |
| <span style="color:red">Srinath Y</span>          | [srinath-y-dev](https://github.com/srinath-y-dev) |
| <span style="color:gold">Yuvarrunjitha R S</span>  | [2024yuva](https://github.com/2024yuva) |
| <span style="color:magenta">Pavithra S</span>         | [Pavithra898](https://github.com/Pavithra898) |

**Team Name**: **Espada**

---

## License

This project is developed for the NXT-GEN Hackathon by Team Develocity. Contributions are not accepted as this is a closed project.
