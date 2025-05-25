import { useState } from 'react';
import './App.css';
import axios from 'axios';

// Mock data for demo purposes
const mockPlayerData = {
  displayName: "Lynx Titan",
  overallExperience: 4600000000,
  skills: [
    { name: "Attack", level: 99, experience: 200000000 },
    { name: "Hitpoints", level: 99, experience: 200000000 },
    { name: "Mining", level: 99, experience: 200000000 },
    { name: "Strength", level: 99, experience: 200000000 },
    { name: "Agility", level: 99, experience: 200000000 },
    { name: "Smithing", level: 99, experience: 200000000 },
    { name: "Defence", level: 99, experience: 200000000 },
    { name: "Herblore", level: 99, experience: 200000000 },
    { name: "Fishing", level: 99, experience: 200000000 },
    { name: "Ranged", level: 99, experience: 200000000 },
    { name: "Thieving", level: 99, experience: 200000000 },
    { name: "Cooking", level: 99, experience: 200000000 },
    { name: "Prayer", level: 99, experience: 200000000 },
    { name: "Crafting", level: 99, experience: 200000000 },
    { name: "Firemaking", level: 99, experience: 200000000 },
    { name: "Magic", level: 99, experience: 200000000 },
    { name: "Fletching", level: 99, experience: 200000000 },
    { name: "Woodcutting", level: 99, experience: 200000000 },
    { name: "Runecrafting", level: 99, experience: 200000000 },
    { name: "Slayer", level: 99, experience: 200000000 },
    { name: "Farming", level: 99, experience: 200000000 },
    { name: "Construction", level: 99, experience: 200000000 },
    { name: "Hunter", level: 99, experience: 200000000 }
  ],
  recentActivities: [
    "Gained 150k Slayer XP",
    "Completed 50 Vorkath kills",
    "Gained 80k Ranged XP"
  ]
};

function App() {
  const [username, setUsername] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchPlayerData = async () => {
    setLoading(true);
    setError('');

    try {
      // First, try to get the player from WiseOldMan
      const response = await axios.get(`https://api.wiseoldman.net/v2/players/${username}`);

      if (response.data) {
        // Format the data to match our component's expected structure
        const formattedData = {
          displayName: response.data.displayName,
          overallExperience: response.data.exp,
          skills: Object.entries(response.data.latestSnapshot.data.skills).map(([skill, data]) => ({
            name: skill.charAt(0).toUpperCase() + skill.slice(1),
            level: data.level,
            experience: data.experience
          })),
          recentActivities: [] // We'll fetch this separately if needed
        };

        // Optionally fetch recent gains
        try {
          const gainsResponse = await axios.get(`https://api.wiseoldman.net/v2/players/${username}/gained`, {
            params: { period: 'week' }
          });

          if (gainsResponse.data?.data?.skills) {
            const topGains = Object.entries(gainsResponse.data.data.skills)
              .filter(([_, data]) => data.experience > 0)
              .sort((a, b) => b[1].experience - a[1].experience)
              .slice(0, 3)
              .map(([skill, data]) => `Gained ${(data.experience / 1000).toFixed(0)}k ${skill.charAt(0).toUpperCase() + skill.slice(1)} XP`);

            formattedData.recentActivities = topGains;
          }
        } catch (gainsError) {
          // If gains fail, continue without them
          console.error('Failed to fetch gains:', gainsError);
        }

        setPlayerData(formattedData);
        setStatsOpen(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Player not found. Make sure the username is correct.');
      } else if (error.response?.status === 400) {
        setError('Invalid username format.');
      } else {
        setError('Failed to fetch player data. Please try again later.');
      }
      setPlayerData(null);
      setStatsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendation = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);

    // Mock AI response for demo
    const mockRecommendations = [
      "Based on your recent Slayer gains and Vorkath kills, you're clearly enjoying combat! However, I notice your Runecraft is only level 50. Consider trying the Guardians of the Rift minigame - it's much more engaging than traditional RC training and offers great rewards!",
      "Your combat stats are impressive! Since you've been grinding Vorkath, why not take a break and work on your Construction? Level 83 unlocks the Ornate Pool which would greatly benefit your bossing efficiency.",
      "I see you're close to 88 Agility! Push for level 90 to unlock the Ardougne Rooftop Course. With your high Slayer level, you could also try Cerberus for a chance at Primordial Boots.",
      "Your Farming is at 73 - perfect for starting herb runs! With Ranarr herbs, you could make significant profit while training. Between runs, your Mining could use some love - try Volcanic Mine for engaging group content!"
    ];

    setTimeout(() => {
      const randomRec = mockRecommendations[Math.floor(Math.random() * mockRecommendations.length)];
      setRecommendation(randomRec);
      setLoading(false);
    }, 1500);
  };

  const getSkillColor = (level) => {
    if (level >= 99) return 'bg-yellow-500';
    if (level >= 90) return 'bg-purple-500';
    if (level >= 80) return 'bg-blue-500';
    if (level >= 70) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  return (
    <div className="min-h-screen text-white bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className={`font-bold text-yellow-400 ${!sidebarOpen && 'hidden'}`}>Quick Tools</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className={`flex-1 p-4 space-y-4 ${!sidebarOpen && 'hidden'}`}>
          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Useful Links</h3>
            <div className="space-y-2">
              <a href="https://oldschool.runescape.wiki" target="_blank" rel="noopener noreferrer"
                className="block px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors">
                📚 OSRS Wiki
              </a>
              <a href="https://www.wiseoldman.net" target="_blank" rel="noopener noreferrer"
                className="block px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors">
                📊 WiseOldMan
              </a>
              <a href="https://prices.runescape.wiki/osrs" target="_blank" rel="noopener noreferrer"
                className="block px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors">
                💰 GE Prices
              </a>
            </div>
          </div>

          {/* Quick Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Calculators</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors">
                🧮 XP Calculator
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors">
                ⚔️ Combat Level Calc
              </button>
            </div>
          </div>

          {/* Recent Players */}
          {playerData && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Players</h3>
              <div className="space-y-2">
                <div className="px-3 py-2 bg-gray-700 rounded-md text-sm">
                  {playerData.displayName}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Center Panel - Always visible */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <header className="text-center mb-8">
              <h1 className="osrs-title text-5xl font-bold mb-2 text-yellow-400">
                OSRS Activity Advisor
              </h1>
              <p className="text-gray-400 text-lg">
                Let AI help you decide what to do next in Gielinor
              </p>
            </header>

            {/* Username Input */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter your RuneScape username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={fetchPlayerData}
                  disabled={!username || loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
                >
                  {loading ? 'Loading...' : 'Fetch Stats'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}

            {/* Update Notice */}
            <div className="text-center text-gray-400 text-sm max-w-2xl mx-auto mb-4">
              <p>Note: If the player hasn't been tracked recently, you may need to update them on WiseOldMan first.</p>
            </div>

            {/* AI Recommendation */}
            {recommendation && (
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                  🤖 AI Recommendation
                </h2>
                <p className="text-lg leading-relaxed text-gray-100">
                  {recommendation}
                </p>
                <button
                  onClick={getAIRecommendation}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm"
                >
                  Get Another Suggestion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Panel - Slides in from right */}
        <div className={`${statsOpen ? 'w-[600px]' : 'w-0'} bg-gray-800 border-l border-gray-700 transition-all duration-300 overflow-hidden`}>
          <div className="p-6 w-[600px]">
            {/* Close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">Player Stats</h2>
              <button
                onClick={() => setStatsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>

            {playerData && (
              <div className="space-y-6">
                {/* Skills Grid */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Skills Overview</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {playerData.skills.map((skill) => (
                      <div key={skill.name} className="skill-tag rounded px-3 py-2 text-sm">
                        <div className="font-semibold text-xs">{skill.name}</div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${getSkillColor(skill.level)}`}></span>
                          <span>{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Recent Activity</h3>
                  <div className="space-y-3 mb-6">
                    {playerData.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-green-400">▶</span>
                        <span className="text-gray-300">{activity}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={getAIRecommendation}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-md font-semibold transition-all glow"
                  >
                    Get AI Recommendation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Enter API Key</h3>
            <p className="text-gray-400 mb-4">
              Enter your OpenAI or Gemini API key to get personalized recommendations
            </p>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApiKeyInput(false);
                  getAIRecommendation();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;