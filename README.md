# ⚡ UPS Control Software
### Custom Project for ViewPower software

![UPS Dashboard Preview](https://github.com/neurodivergent-dev/UPS-Control-Software/raw/main/public/preview.png)

Modern, ultra-premium UPS (Uninterruptible Power Supply) management and monitoring software. Designed to be used with **ViewPower** software, it integrates with the **ViewPower** API to provide hardware-level control and advanced data visualization.

## ✨ Features

-   **Real-Time Monitoring:** Track input/output voltage, load percentage, and battery capacity in real-time.
-   **Dynamic Power Flow:** Watch energy transitions between grid and battery modes with high-fidelity animations.
-   **Hardware Control:** Send UPS test, buzzer control, and system shutdown commands via ViewPower authentication.
-   **Smart Shutdown Logic:** Customizable local system shutdown scenarios for low battery or scheduled events.
-   **Ultra-Premium UI:** Built with Framer Motion, Glassmorphism design principles, and 15+ "Atmosphere" (Theme) presets.
-   **Diagnostics & Event Logs:** Access detailed system diagnostic data and historical event tracking.

## 🚀 Quick Start

### Prerequisites

-   **Node.js** (v18+)
-   **ViewPower Pro** (Required as a background API service)

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Launch development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## 🛠️ Technology Stack

-   **Framework:** React 19 + TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Animations:** Framer Motion
-   **Icons:** Lucide React
-   **Data Fetching:** TanStack Query (React Query)
-   **Charts:** Recharts

## 🎨 Creative Atmospheres (Themes)

Personalize your monitoring experience with a wide range of premium themes:
-   **Tokyo Night:** Cyberpunk-inspired neon violet.
-   **Matrix Core:** Classic tech green.
-   **Glacier Blue:** High-contrast arctic blue.
-   **Vulcan Forge:** Deep inferno red.
-   ...and over 10 other unique presets.

## 🔒 Security Note

To execute hardware commands (Shutdown, Buzzer, etc.), you must log in via **Settings > UPS Authentication** using your ViewPower administrator credentials. Default credentials are usually `administrator` / `administrator`.

## 📄 License

This project is designed for personal and industrial monitoring use. All rights reserved.
