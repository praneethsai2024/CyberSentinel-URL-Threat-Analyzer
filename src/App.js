import React, { useState } from 'react';
import { Shield, Search, Home, Clock, AlertTriangle, CheckCircle, XCircle, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CyberSentinel = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchHistory, setSearchHistory] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // URL Feature extraction function
  const extractUrlFeatures = (url) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'http://' + url);
      
      return {
        length: url.length,
        numDots: (url.match(/\./g) || []).length,
        numSubdomains: (urlObj.hostname.match(/\./g) || []).length,
        numSlashes: (url.match(/\//g) || []).length,
        numDashes: (url.match(/-/g) || []).length,
        numDigits: (url.match(/\d/g) || []).length,
        hasHttps: url.startsWith('https'),
        hasIP: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlObj.hostname),
        pathLength: urlObj.pathname.length,
        queryLength: urlObj.search.length,
        suspiciousKeywords: (url.toLowerCase().match(/phish|malware|spam|fraud|scam|virus|trojan/g) || []).length
      };
    } catch (error) {
      return {
        length: url.length,
        numDots: (url.match(/\./g) || []).length,
        numSubdomains: 0,
        numSlashes: (url.match(/\//g) || []).length,
        numDashes: (url.match(/-/g) || []).length,
        numDigits: (url.match(/\d/g) || []).length,
        hasHttps: false,
        hasIP: false,
        pathLength: 0,
        queryLength: 0,
        suspiciousKeywords: (url.toLowerCase().match(/phish|malware|spam|fraud|scam|virus|trojan/g) || []).length
      };
    }
  };

  // Simplified Random Forest implementation
  const randomForestClassify = (features) => {
    // Decision trees (simplified rules based on common threat indicators)
    const trees = [
      // Tree 1: Length and structure based
      () => {
        if (features.length > 100) return features.suspiciousKeywords > 0 ? 0.8 : 0.6;
        if (features.numSubdomains > 3) return 0.7;
        if (features.hasIP) return 0.9;
        return features.hasHttps ? 0.1 : 0.3;
      },
      // Tree 2: Content based
      () => {
        if (features.suspiciousKeywords > 0) return 0.9;
        if (features.numDashes > 5) return 0.6;
        if (features.numDigits > 10) return 0.5;
        return features.hasHttps ? 0.2 : 0.4;
      },
      // Tree 3: Protocol and path based
      () => {
        if (!features.hasHttps && features.pathLength > 50) return 0.8;
        if (features.queryLength > 100) return 0.7;
        if (features.hasIP) return 0.85;
        return 0.25;
      },
      // Tree 4: Anomaly detection
      () => {
        if (features.length > 200) return 0.9;
        if (features.numSubdomains > 4) return 0.75;
        if (features.numSlashes > 6) return 0.6;
        return features.hasHttps ? 0.15 : 0.35;
      },
      // Tree 5: Combined indicators
      () => {
        let score = 0;
        if (!features.hasHttps) score += 0.3;
        if (features.hasIP) score += 0.4;
        if (features.suspiciousKeywords > 0) score += 0.5;
        if (features.numDashes > 3) score += 0.2;
        return Math.min(score, 1.0);
      }
    ];

    // Average predictions from all trees
    const predictions = trees.map(tree => tree());
    const averageScore = predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;
    
    return {
      threatScore: averageScore,
      predictions: predictions,
      classification: averageScore > 0.6 ? 'High Risk' : averageScore > 0.3 ? 'Medium Risk' : 'Low Risk'
    };
  };

  const analyzeUrl = async (url) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const features = extractUrlFeatures(url);
    const result = randomForestClassify(features);
    
    const analysis = {
      url,
      timestamp: new Date().toLocaleString(),
      features,
      ...result,
      recommendations: generateRecommendations(result.classification, features)
    };
    
    setAnalysisResult(analysis);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      url,
      classification: result.classification,
      threatScore: result.threatScore,
      timestamp: new Date().toLocaleString()
    };
    
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10
    setIsAnalyzing(false);
    setCurrentPage('results');
  };

  const generateRecommendations = (classification, features) => {
    const recommendations = [];
    
    if (classification === 'High Risk') {
      recommendations.push("⚠️ Do not visit this URL");
      recommendations.push("🔒 Check for HTTPS before entering sensitive data");
      recommendations.push("🛡️ Use additional security tools before accessing");
    } else if (classification === 'Medium Risk') {
      recommendations.push("⚡ Proceed with caution");
      recommendations.push("🔍 Verify the website's legitimacy");
      recommendations.push("🔒 Ensure HTTPS is enabled");
    } else {
      recommendations.push("✅ URL appears to be safe");
      recommendations.push("🔒 Still verify HTTPS for sensitive data");
      recommendations.push("📱 Keep security software updated");
    }
    
    if (!features.hasHttps) {
      recommendations.push("🚨 URL lacks HTTPS encryption");
    }
    
    if (features.hasIP) {
      recommendations.push("🔍 URL uses IP address instead of domain name");
    }
    
    return recommendations;
  };

  const Header = () => (
    <header className="bg-gradient-to-r from-purple-100 to-pink-100 shadow-sm border-b border-purple-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-800">CyberSentinel</h1>
          </div>
          <nav className="relative">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'home' 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setCurrentPage('history')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'history' 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>History</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Shield className="h-20 w-20 text-purple-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-purple-800 mb-4">CyberSentinel</h1>
            <p className="text-xl text-purple-600 mb-8">
              AI-Powered URL Threat Analysis & Protection
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
            <div className="mb-6">
              <label htmlFor="url-input" className="block text-lg font-semibold text-purple-800 mb-3">
                Enter URL to analyze
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="text"
                  placeholder="https://example.com"
                  className="w-full px-4 py-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white/80"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && currentUrl && analyzeUrl(currentUrl)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-400" />
              </div>
            </div>
            
            <button
              onClick={() => currentUrl && analyzeUrl(currentUrl)}
              disabled={!currentUrl || isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </span>
              ) : (
                'Analyze URL'
              )}
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-800 mb-2">Advanced Protection</h3>
              <p className="text-purple-600 text-sm">Machine learning algorithms detect threats in real-time</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-800 mb-2">Detailed Analysis</h3>
              <p className="text-purple-600 text-sm">Comprehensive reports with visual insights</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-800 mb-2">Search History</h3>
              <p className="text-purple-600 text-sm">Track and review all your security analyses</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const ResultsPage = () => {
    if (!analysisResult) return <HomePage />;

    const getRiskColor = (classification) => {
      switch (classification) {
        case 'High Risk': return 'text-red-600 bg-red-100 border-red-200';
        case 'Medium Risk': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        case 'Low Risk': return 'text-green-600 bg-green-100 border-green-200';
        default: return 'text-gray-600 bg-gray-100 border-gray-200';
      }
    };

    const getRiskIcon = (classification) => {
      switch (classification) {
        case 'High Risk': return <XCircle className="h-6 w-6" />;
        case 'Medium Risk': return <AlertTriangle className="h-6 w-6" />;
        case 'Low Risk': return <CheckCircle className="h-6 w-6" />;
        default: return <AlertTriangle className="h-6 w-6" />;
      }
    };

    const featureData = [
      { name: 'URL Length', value: analysisResult.features.length },
      { name: 'Subdomains', value: analysisResult.features.numSubdomains },
      { name: 'Suspicious Keywords', value: analysisResult.features.suspiciousKeywords },
      { name: 'Path Length', value: analysisResult.features.pathLength },
    ];

    const pieData = [
      { name: 'Safe', value: Math.max(0, 100 - analysisResult.threatScore * 100), fill: '#10B981' },
      { name: 'Threat', value: analysisResult.threatScore * 100, fill: '#EF4444' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-3xl font-bold text-purple-800 mb-2">Analysis Results</h1>
              <p className="text-purple-600 break-all">{analysisResult.url}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Threat Score Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                  <div className={`flex items-center justify-center p-4 rounded-xl border-2 ${getRiskColor(analysisResult.classification)} mb-4`}>
                    {getRiskIcon(analysisResult.classification)}
                    <span className="ml-2 text-xl font-bold">{analysisResult.classification}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-800 mb-2">
                      {Math.round(analysisResult.threatScore * 100)}%
                    </div>
                    <p className="text-purple-600">Threat Score</p>
                  </div>
                </div>

                {/* Threat Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 mt-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Threat Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Feature Analysis */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Feature Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={featureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Random Forest Predictions */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 mt-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Random Forest Tree Predictions</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {analysisResult.predictions.map((pred, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-purple-100 rounded-lg p-3 mb-2">
                          <div className="text-lg font-bold text-purple-800">
                            {Math.round(pred * 100)}%
                          </div>
                        </div>
                        <div className="text-sm text-purple-600">Tree {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Security Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* URL Features Details */}
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800 mb-4">URL Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{analysisResult.features.length}</div>
                    <div className="text-sm text-purple-600">URL Length</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{analysisResult.features.numDots}</div>
                    <div className="text-sm text-purple-600">Dots</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{analysisResult.features.numSubdomains}</div>
                    <div className="text-sm text-purple-600">Subdomains</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{analysisResult.features.hasHttps ? 'Yes' : 'No'}</div>
                    <div className="text-sm text-purple-600">HTTPS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const HistoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">Search History</h1>
          
          {searchHistory.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-purple-100">
              <Clock className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-800 mb-2">No Search History</h3>
              <p className="text-purple-600">Start analyzing URLs to see your search history here.</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Analyze URL
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {searchHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          item.classification === 'High Risk' ? 'text-red-600 bg-red-100' :
                          item.classification === 'Medium Risk' ? 'text-yellow-600 bg-yellow-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {item.classification === 'High Risk' ? <XCircle className="h-4 w-4 mr-1" /> :
                           item.classification === 'Medium Risk' ? <AlertTriangle className="h-4 w-4 mr-1" /> :
                           <CheckCircle className="h-4 w-4 mr-1" />}
                          {item.classification}
                        </div>
                        <span className="ml-3 text-sm text-purple-600">{item.timestamp}</span>
                      </div>
                      <p className="text-purple-800 break-all mb-2">{item.url}</p>
                      <div className="text-sm text-purple-600">
                        Threat Score: <span className="font-semibold">{Math.round(item.threatScore * 100)}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentUrl(item.url);
                        analyzeUrl(item.url);
                      }}
                      className="ml-4 text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return (
    <div className="font-sans">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'results' && <ResultsPage />}
      {currentPage === 'history' && <HistoryPage />}
    </div>
  );
};

// Export for use in Create React App
function App() {
  return <CyberSentinel />;
}

export default App;