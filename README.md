# Sabharishraja's Personal Portfolio 🚀

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)

Welcome to the repository for my personal portfolio website! I am an AI & Data Science Engineer, and this site serves as my digital resume, showcasing my technical skills, projects, and the domains I explore.

Check out the live version here: sabharishrajaportfolio.vercel.app

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contact](#contact)

## About the Project
I built this portfolio to highlight my journey in data science, artificial intelligence, and software engineering. Beyond just a standard resume, I wanted the website itself to demonstrate my interest in building intelligent, interactive, and visually engaging systems. 

The site utilizes a premium dark theme, glassmorphism UI elements, and complex interactive backgrounds to create a highly responsive and modern web experience.

## Features
- **3D Interactive Backgrounds**: Uses `Three.js` to render a particle network background and a rotating neural sphere that reacts to mouse movements.
- **Scroll Animations**: Smooth, high-performance reveal animations tied to scroll positions using `GSAP ScrollTrigger`.
- **Custom Cursor**: A custom dual-element cursor that intelligently snaps to interactive elements like links and buttons.
- **Dynamic Contact Form**: A functional "Get In Touch" section that securely submits directly to Google Forms.
- **Responsive Layout**: Fully functional on mobile, tablet, and desktop screens with custom media queries.

## Tech Stack
* **Markup & Styling:** HTML5, CSS3 (Vanilla)
* **Logic:** Vanilla JavaScript (ES6+)
* **3D Rendering:** [Three.js](https://threejs.org/)
* **Animations:** [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform)
* **Card Interactions:** [Vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/)
* **Icons:** FontAwesome 6.4

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
You only need a modern web browser to view the site. However, for the best development experience without CORS issues, you should run it through a local HTTP server.

### Installation & Running Locally

1. **Clone the repo**
   ```sh
   git clone https://github.com/yourusername/Portfolio.git
   ```
2. **Navigate into the directory**
   ```sh
   cd Portfolio
   ```
3. **Start a local server**
   
   If you have Node.js installed, use `serve`:
   ```sh
   npx serve .
   ```
   
   If you use Python 3:
   ```sh
   python -m http.server 8000
   ```
   
   Or simply use the **Live Server** extension in VS Code.

4. Open your browser and navigate to `http://localhost:3000` (or the port specified by your tool).

## Project Structure
```text
📦 Portfolio_site
 ┣ images/           # Contains profile placeholder and favicons
 ┣ index.html        # Main HTML layout
 ┣ style.css         # Styling, Layouts, CSS Variables
 ┣ script.js         # GSAP triggers, Three.js scenes, Contact form logic
 ┗ README.md         # Documentation

