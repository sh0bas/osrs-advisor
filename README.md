# 🗡️ OSRS Activity Advisor

An AI-powered web application that analyzes Old School RuneScape player stats and provides personalized activity recommendations using Google's Gemini AI.

![OSRS Activity Advisor](https://img.shields.io/badge/OSRS-Activity%20Advisor-yellow?style=for-the-badge&logo=runescape)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-GPL%20v3-green?style=for-the-badge)

## 🎮 Features

- **Player Stats Fetching**: Automatically retrieves player data from WiseOldMan API
- **AI-Powered Recommendations**: Uses Google Gemini AI to analyze player stats and suggest personalized activities
- **Real-time Activity Tracking**: Shows recent player activities including XP gains and boss kills
- **Interactive UI**: Modern, OSRS-themed interface with smooth animations
- **Skill Progress Visualization**: Color-coded skill levels based on in-game gem tiers
- **Quick Access Tools**: Sidebar with links to essential OSRS resources

## 🚀 Demo

### Screenshots
- Fetch player stats by entering username
- View comprehensive skill overview with color-coded levels
- Get AI-generated activity recommendations
- Track recent gains and achievements

## 🛠️ Technologies Used

- **React 19.1.0** - UI framework
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS 4.1.7** - Styling framework
- **Axios** - API requests
- **Google Generative AI** - AI recommendations
- **WiseOldMan API** - Player data source

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm or yarn package manager
- Google Gemini API key (for AI recommendations)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/osrs-advisor.git
   cd osrs-advisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🎯 Usage

1. **Enter Username**: Type your OSRS username in the input field
2. **Fetch Stats**: Click "Fetch Stats" to retrieve player data from WiseOldMan
3. **View Stats**: Explore your skills and recent activities in the side panel
4. **Get Recommendations**: Click "Get AI Recommendation" for personalized suggestions
5. **Explore Tools**: Use the sidebar links to access OSRS Wiki, GE prices, and more

## 🏗️ Project Structure

```
osrs-advisor/
├── src/
│   ├── components/
│   │   └── LoadingSpinner.jsx    # Loading animation component
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Custom styles and animations
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Application entry point
├── public/
│   └── vite.svg                  # Default Vite icon
├── .gitignore
├── package.json
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
├── README.md
└── LICENSE                       # GPL v3 license
```

## 🎨 Features in Detail

### Player Statistics
- Displays all 23 OSRS skills with current levels
- Color-coded skill levels based on gemstone tiers

### AI Recommendations
The AI considers:
- Current skill levels and combat stats
- Recent training activities
- Profitable activities based on levels
- AFK training options
- Appropriate content for player's progression

### Recent Activity Tracking
- Top 5 skills with most XP gained
- Boss kills in the past week

## 🔧 Configuration

### API Keys
The application requires a Google Gemini API key for AI recommendations. You can either:
1. Set it in the `.env` file (recommended)
2. Enter it manually when prompted in the app

### Customization
- Modify `App.css` for theme adjustments
- Update AI prompts in `getAIRecommendation()` function
- Adjust skill color thresholds in `getSkillColor()` function

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Player data requires recent tracking on WiseOldMan
- Some players may need to be updated on WiseOldMan before fetching
- API rate limits may apply for frequent requests

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WiseOldMan](https://wiseoldman.net) for providing the player data API
- [Old School RuneScape Wiki](https://oldschool.runescape.wiki) for game information
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- The OSRS community for inspiration and support

## 📞 Contact

For questions or suggestions, please open an issue.

---

<p align="center">Made with ❤️ for the OSRS community</p>
<p align="center">Happy 'Scaping! 🎮</p>