import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
          skills: Object.entries(response.data.latestSnapshot.data.skills)
            .filter(([skill]) => skill !== 'overall')
            .map(([skill, data]) => ({
              name: skill.charAt(0).toUpperCase() + skill.slice(1),
              level: data.level,
              experience: data.experience
            }))
            .concat([{
              name: 'Overall',
              level: response.data.latestSnapshot.data.skills.overall.level,
              experience: response.data.latestSnapshot.data.skills.overall.experience
            }]),
          recentActivities: [] // We'll fetch this separately if needed
        };

        // Optionally fetch recent gains
        try {
          const gainsResponse = await axios.get(`https://api.wiseoldman.net/v2/players/${username}/gained`, {
            params: { period: 'week' }
          });

          console.log('Gains response:', gainsResponse.data); // Keep this to see the structure

          // Initialize arrays
          formattedData.recentActivities = [];
          const activities = [];

          // Get skill gains
          if (gainsResponse.data?.data?.skills) {
            const topGains = Object.entries(gainsResponse.data.data.skills)
              .filter(([skill, data]) => data.experience?.gained > 0)
              .sort((a, b) => b[1].experience.gained - a[1].experience.gained)
              .slice(0, 5)
              .map(([skill, data]) => {
                const xpGained = data.experience.gained;
                if (xpGained >= 1000000) {
                  return `Gained ${(xpGained / 1000000).toFixed(1)}M ${skill.charAt(0).toUpperCase() + skill.slice(1)} XP`;
                } else {
                  return `Gained ${Math.floor(xpGained / 1000)}k ${skill.charAt(0).toUpperCase() + skill.slice(1)} XP`;
                }
              });
            activities.push(...topGains);
          }

          // Get boss kills
          if (gainsResponse.data?.data?.bosses) {
            const bossKills = Object.entries(gainsResponse.data.data.bosses)
              .filter(([boss, data]) => data.kills?.gained > 0)
              .sort((a, b) => b[1].kills.gained - a[1].kills.gained)
              .slice(0, 3)
              .map(([boss, data]) => {
                const bossName = boss.split('_').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                return `Killed ${data.kills.gained} ${bossName}`;
              });
            activities.push(...bossKills);
          }

          formattedData.recentActivities = activities.length > 0 ? activities : ['No recent activity found.'];
        } catch (gainsError) {
          console.error('Failed to fetch gains:', gainsError);
          formattedData.recentActivities = ['Activity data unavailable. Try updating the player on WiseOldMan.'];
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
    // Check if we have an API key (either from env or user input)
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || apiKey;

    console.log('Environment key:', import.meta.env.VITE_GEMINI_API_KEY);
    console.log('State key:', apiKey);
    console.log('Final geminiApiKey:', geminiApiKey);
    console.log('Key exists?', !!geminiApiKey);

    if (!geminiApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);

    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Prepare the prompt with player data
      const prompt = `
      You are an expert Old School RuneScape activity advisor. Based on this player's stats and recent activity, suggest ONE specific activity they should do next.

      Player: ${playerData.displayName}
      
      Current Stats:
      ${playerData.skills.map(s => `${s.name}: Level ${s.level}`).join(', ')}
      
      Recent Activity (past week):
      ${playerData.recentActivities.join('\n')}
      
      IMPORTANT CONTEXT FOR RECOMMENDATIONS:
      - Skills under level 50 are considered low and easy to train
      - Skills 50-70 are mid-level, 70-90 are high-level, 90+ are end-game
      - Combat skills: Attack, Strength, Defence, Ranged, Magic, Prayer
      - Profitable skills: Slayer (85+ for good money), Runecraft (77+ for bloods), Hunter (80+ for chins)
      - AFK skills: Fishing, Woodcutting, Mining
      - Expensive but fast skills: Construction, Prayer, Herblore
      
      GOOD RECOMMENDATIONS BASED ON LEVELS:
      - If Slayer is lagging behind the rest of the player's combat stats: Suggest training Slayer
      - If Runecraft is low (<77): Suggest Guardians of the Rift minigame
      - If combat stats are 80+: Suggest specific bosses.
      - If Agility is low: Suggest rooftop courses for the player's level
      - If Construction is low (<83): Mention that with 83 + boosts, they can build all the important POH features
      - If stats are generally high level: Suggest working toward Quest Cape or Achievement Diaries
      - Herb runs and birdhouse runs are always good to do, regardless of how high the player's levels are.
      
      AVOID:
      - Generic suggestions like "train your lowest skill"
      - Suggesting content way above their level
      - Recommending the same skill they've been training recently
      - Avoid suggesting Fight Caves unless mentioned as a goal for players with base 60s in combat or lower.
      - Suggesting prayer training if the player has 77, as this is the highest level needed for a prayer. Only suggest prayer if they have 90+ in most other combat skills.
      - Trying to recommend a specific training method for skills where you are processing items. Instead, post the link to the OSRS Wiki training page for that skill.
      - Suggesting quests and/or achievement diary tasks, as these aren't tracked by WiseOldMan.
      
      Based on their recent activity, suggest something different but appropriate for their levels. Be specific about WHERE to train and WHAT method to use. Keep your response concise (2-3 sentences max).
    `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const recommendation = response.text();

      setRecommendation(recommendation);
    } catch (error) {
      console.error('AI recommendation error:', error);
      setRecommendation('Failed to get AI recommendation. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSkillColor = (level) => {
    if (level >= 99) return 'bg-orange-500'; // Zenyte (#FF8920)
    if (level >= 90) return 'bg-gray-800'; // Onyx (#2D2D2D)
    if (level >= 80) return 'bg-purple-600'; // Dragonstone (#861CD4)
    if (level >= 70) return 'bg-cyan-100'; // Diamond (#C8E8E6)
    if (level >= 60) return 'bg-red-500'; // Ruby (#EC2323)
    if (level >= 50) return 'bg-green-500'; // Emerald (#1BC92C)
    if (level >= 40) return 'bg-blue-600'; // Sapphire (#1524F9)
    if (level >= 30) return 'bg-pink-500'; // Red Topaz (#E546FC)
    if (level >= 20) return 'bg-teal-200'; // Jade (#A7EED4)
    if (level >= 10) return 'bg-amber-100'; // Opal (#FAEBD7)
    return 'bg-gray-600'; // Below 10
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
              <form onSubmit={(e) => {
                e.preventDefault();
                if (username && !loading) {
                  fetchPlayerData();
                }
              }}>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter your RuneScape username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!username || loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
                  >
                    {loading ? 'Loading...' : 'Fetch Stats'}
                  </button>
                </div>
              </form>
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

            {/* AI disclaimer */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-gray-400">
                Disclaimer: The AI can make mistakes and give inaccurate information.
              </p>
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