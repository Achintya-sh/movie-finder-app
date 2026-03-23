# 🎬 Movie Finder

A dynamic web application that allows users to search, filter, and explore movies and TV shows using real-time data from a public API.

## 📖 Project Description

Movie Finder is an interactive web application designed to help users discover movies and TV shows based on their preferences. Users can search for titles, filter results by type and year, sort content, and toggle between light and dark themes for an enhanced viewing experience.

This project demonstrates proficiency in JavaScript, API integration, responsive design, and modern web development practices.

## 🌐 API Used

**OMDb API (Open Movie Database)**
- Website: [http://www.omdbapi.com/](http://www.omdbapi.com/)
- Description: A RESTful web service to obtain movie information
- Features: Returns detailed movie/TV show data including titles, posters, ratings, plot, cast, and more
- Authentication: Requires a free API key (available at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx))

## ✨ Planned Features

### Core Features (Required)
1. **Search Functionality**
   - Real-time search for movies and TV shows by title
   - Implemented using array higher-order functions (filter, map)

2. **Filtering**
   - Filter by content type (Movies, TV Series, Episodes)
   - Filter by year range
   - All filtering logic using array HOFs

3. **Sorting**
   - Sort results alphabetically (A-Z, Z-A)
   - Sort by year (newest first, oldest first)
   - Sort by IMDb rating
   - Implemented using array sort() method

### Additional Features
4. **Interactive Buttons**
   - "View Details" button to show full movie information
   - "Add to Favorites" functionality
   - Quick view for movie posters

5. **Dark Mode / Light Mode**
   - Theme toggle button
   - Smooth transition between themes
   - User preference persistence

### Bonus Features (Planned)
- **Debouncing**: Applied to search input to optimize API calls
- **Loading Indicators**: Visual feedback during data fetching
- **Local Storage**: Save favorite movies and theme preference
- **Error Handling**: Graceful handling of API failures and no results

## 🛠️ Technologies

- **HTML5**: Semantic markup and structure
- **CSS3**: Styling, animations, and responsive design
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **JavaScript (ES6+)**: Core functionality, DOM manipulation, and API integration
- **Fetch API**: For making HTTP requests to OMDb API
- **Local Storage API**: For persisting user data

## 📁 Project Structure

```
movie-finder/
│
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── api.js          # API integration logic
│   ├── app.js          # Main application logic
│   └── utils.js        # Helper functions (HOFs)
├── assets/
│   └── images/         # Project images and icons
└── README.md           # Project documentation
```

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for API calls
- Text editor or IDE (VS Code recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Achintya-sh/movie-finder.git
   cd movie-finder
   ```

2. **Get API Key**
   - Visit [OMDb API Key](https://www.omdbapi.com/apikey.aspx)
   - Sign up for a free API key
   - Add your API key to the `js/api.js` file

3. **Open the project**
   - Open `index.html` in your web browser
   - Or use a local development server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (with live-server)
     npx live-server
     ```

4. **Start exploring movies!**

## 📝 Usage

1. Enter a movie or TV show title in the search bar
2. Use filters to narrow down results by type or year
3. Click sort options to reorder results
4. Click "View Details" to see full information about a movie
5. Toggle dark/light mode using the theme switcher
6. Add movies to favorites for quick access

## 🎯 Project Milestones

- **Milestone 1**: Project Setup and Planning ✅ (23rd March)
- **Milestone 2**: API Integration (1st April)
- **Milestone 3**: Core Features Implementation (8th April)
- **Milestone 4**: Documentation, Deployment & Final Submission (10th April)

## 🌟 Future Enhancements

- Pagination for large result sets
- Infinite scroll functionality
- Detailed movie statistics and visualizations
- User reviews and ratings
- Watchlist functionality
- Social sharing options

## 👨‍💻 Development

This project is being developed as part of a web development course, focusing on:
- Modern JavaScript practices
- API integration and data handling
- Responsive web design
- User experience optimization
- Clean code principles

## 📄 License

This project is created for educational purposes.

---

**Developed with ❤️ as part of Web Development Project**

*Last Updated: March 23, 2026*
