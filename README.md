# 🎬 Movie Finder

A high-performance, dynamic web application that allows users to search, filter, and save movies using real-time data from the OMDb API.

## 📖 Project Overview

Movie Finder is an interactive platform built to demonstrate proficiency in modern JavaScript (ES6+), API integration, and responsive UI design. It features a robust search engine with real-time debouncing, advanced filtering using Higher-Order Functions (HOFs), and a persistent favorites system.

## ✨ Implemented Features

### 🔍 Search & Discovery
* **Real-time Search:** Uses debouncing (600ms) to optimize API calls while typing.
* **API-Level Filtering:** Users can filter by Content Type (Movies/Series) and specific Release Year directly through API queries.
* **Pagination:** Supports full navigation through large result sets with "Top" and "Bottom" pagination bars.

### 🛠️ Technical Implementation (HOFs)
The project utilizes a dedicated `utils.js` library to handle data manipulation without using standard loops, focusing on functional programming:
* **Filtering:** Implemented via `Array.prototype.filter()` for genre and rating logic.
* **Sorting:** Dynamic sorting (A-Z, Z-A, Newest, Oldest) using `Array.prototype.sort()`.
* **Data Transformation:** Uses `Array.prototype.map()` and `Array.prototype.reduce()` for unique value extraction and result counting.

### 💾 User Experience & Persistence
* **Favorites System:** Users can "Save" movies to a personal list, which persists across sessions using the **Local Storage API**.
* **Responsive Design:** A mobile-first approach ensuring compatibility across all device sizes.
* **Visual Feedback:** Includes loading spinners and "No Results" states for a polished user experience.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Inter Font Family).
* **Logic:** Vanilla JavaScript (ES6+).
* **API:** OMDb (Open Movie Database).
* **Storage:** Browser LocalStorage.

## 📁 Project Structure

```text
movie-finder-app/
├── index.html          # Main entry point and UI structure
├── css/
│   └── styles.css      # Custom styling and layout
├── js/
│   ├── config.js       # API Key and configuration
│   ├── api.js          # Fetch logic and API handlers
│   ├── utils.js        # HOF-based utility functions
│   └── app.js          # DOM manipulation and state management
└── README.md           # Project documentation