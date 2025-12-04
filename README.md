# VantEdge - RF Noise Mapping System

**VantEdge** is a cutting-edge Radio Frequency (RF) noise monitoring and visualization dashboard designed for educational campuses and smart environments. Developed by **Team VantEdge (IEEE AP-S BMSIT&M)**, this system provides real-time insights into the RF spectrum, helping to identify interference, optimize network planning, and visualize signal strength across a geographical area.

![VantEdge Dashboard](/project.jpeg)

## 🚀 Key Features

- **Real-Time Dashboard ("War Room")**: Live monitoring of RF signal strength (RSSI), noise floor, and signal-to-noise ratio (SNR) from multiple ESP32-based sensor nodes.
- **Interactive Heatmap**: Visualizes RF noise distribution across the campus using GPS-tagged data, allowing for easy identification of dead zones and interference hotspots.
- **Advanced Analytics**: Historical trend analysis of signal strength and noise floor, with a "Recent Intercepts" log for detailed inspection.
- **Intelligence Export**: Export full datasets as CSV reports for offline analysis, including precise coordinates, device IDs, and signal metrics.
- **Voice Assistant**: Integrated AI voice assistant to explain complex RF metrics and chart trends in plain English.
- **Device Management**: Monitor the status, battery life, and connection quality of all deployed sensor nodes.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (React), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom "Glassmorphism" design system
- **Visualization**: [Recharts](https://recharts.org/) for analytics, [Leaflet](https://leafletjs.com/) for mapping
- **State Management**: React Hooks (`useRFData` custom hook)
- **Icons**: [Heroicons](https://heroicons.com/)

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ArnavTheExploit/rf-dashboard.git
    cd rf-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the dashboard:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Team VantEdge

**IEEE AP-S (BMSIT&M)**

*   **Jishnu K** (1BY24EC069) - Hardware Design
*   **Chinmay Ravindra Gowda** (1BY24EC037) - Firmware Development
*   **Arnav Paniya** (1BY24EC026) - Dashboard UI/UX
*   **Adithya S P** (1BY24EC007) - Data Processing

## 📄 License

This project is open-source and available for educational and research purposes.
