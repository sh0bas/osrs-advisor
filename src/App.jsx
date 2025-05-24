import { useState } from 'react';
import './App.css';

// Mock data for demo purposes
const mockPlayerData = {
  displayName: "Zezima",
  overallExperience: 5400000000,
  skills: [
    { name: "Attack", level: 99, experience: 13034431 },
    { name: "Strength", level: 99, experience: 13034431 },
    { name: "Defence", level: 99, experience: 13034431 },
    { name: "Ranged", level: 85, experience: 3258594 },
    { name: "Prayer", level: 70, experience: 737627 },
    { name: "Magic", level: 99, experience: 13034431 },
    { name: "Runecraft", level: 50, experience: 101333 },
    { name: "Hitpoints", level: 99, experience: 13034431 },
    { name: "Crafting", level: 75, experience: 1210421 },
    { name: "Mining", level: 60, experience: 273742 },
    { name: "Smithing", level: 55, experience: 166636 },
    { name: "Fishing", level: 82, experience: 2421087 },
    { name: "Cooking", level: 90, experience: 5346332 },
    { name: "Firemaking", level: 99, experience: 13034431 },
    { name: "Woodcutting", level: 88, experience: 4385776 },
    { name: "Agility", level: 65, experience: 449428 },
    { name: "Herblore", level: 78, experience: 1629200 },
    { name: "Thieving", level: 71, experience: 814445 },
    { name: "Fletching", level: 92, experience: 6517253 },
    { name: "Slayer", level: 87, experience: 4008932 },
    { name: "Farming", level: 73, experience: 992895 },
    { name: "Construction", level: 52, experience: 123660 },
    { name: "Hunter", level: 69, experience: 668051 }
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

  const fetchPlayerData = async () => {
    setLoading(true);
    // In real implementation, this would call WiseOldMan API
    // For demo, using mock data
    setTimeout(() => {
      setPlayerData(mockPlayerData);
      setLoading(false);
    }, 1000);
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
    <div className="min-h-screen text-white p-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="osrs-title text-5xl font-bold mb-2 text-yellow-400">
            OSRS Activity Advisor
          </h1>
          <p className="text-gray-400 text-lg">
            Let AI help you decide what to do next in Gielinor
          </p>
        </header>

        {/* Username Input */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
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

        {/* Player Data Display */}
        {playerData && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Skills Grid */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Skills Overview</h2>
              <div className="grid grid-cols-3 gap-2">
                {playerData.skills.map((skill) => (
                  <div key={skill.name} className="skill-tag rounded px-3 py-2 text-sm">
                    <div className="font-semibold">{skill.name}</div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${getSkillColor(skill.level)}`}></span>
                      <span>{skill.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Recent Activity</h2>
              <div className="space-y-3">
                {playerData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-green-400">▶</span>
                    <span className="text-gray-300">{activity}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={getAIRecommendation}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-md font-semibold transition-all glow"
              >
                Get AI Recommendation
              </button>
            </div>
          </div>
        )}

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

        {/* AI Recommendation */}
        {recommendation && (
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700">
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
  );
}

export default App;