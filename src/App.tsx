/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sprout, 
  Bug, 
  CloudSun, 
  TrendingUp, 
  MessageSquare, 
  Camera, 
  Upload, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Menu,
  X,
  MapPin,
  ThermometerSun,
  Droplets,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { identifyDisease, getFarmingAdvice } from './services/gemini';
import { cn } from './lib/utils';

type Tab = 'dashboard' | 'disease' | 'weather' | 'market' | 'chat';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'disease':
        return <DiseaseIdentifier />;
      case 'weather':
        return <WeatherAdvice />;
      case 'market':
        return <MarketInsights />;
      case 'chat':
        return <FarmingChat />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-serif">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-[#5A5A40]/10 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-[#5A5A40] p-2 rounded-lg">
            <Sprout className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AgriSmart AI</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#5A5A40]/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 flex flex-col h-full">
            <div className="hidden lg:flex items-center gap-3 mb-10">
              <div className="bg-[#5A5A40] p-2 rounded-xl">
                <Sprout className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AgriSmart</h1>
            </div>

            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-6 right-6 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="space-y-2 flex-1">
              <SidebarItem 
                icon={<Sprout />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={<Bug />} 
                label="Disease Doctor" 
                active={activeTab === 'disease'} 
                onClick={() => { setActiveTab('disease'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={<CloudSun />} 
                label="Weather & Tips" 
                active={activeTab === 'weather'} 
                onClick={() => { setActiveTab('weather'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={<TrendingUp />} 
                label="Market Insights" 
                active={activeTab === 'market'} 
                onClick={() => { setActiveTab('market'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={<MessageSquare />} 
                label="Expert Chat" 
                active={activeTab === 'chat'} 
                onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }} 
              />
            </nav>

            <div className="mt-auto pt-6 border-t border-[#5A5A40]/10">
              <div className="bg-[#F5F5F0] p-4 rounded-2xl">
                <p className="text-xs text-[#5A5A40] font-sans uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">AI Systems Online</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F5F0] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-8 max-w-6xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" 
          : "text-[#5A5A40]/70 hover:bg-[#5A5A40]/5 hover:text-[#5A5A40]"
      )}
    >
      <span className={cn("transition-transform duration-200 group-hover:scale-110", active ? "text-white" : "text-[#5A5A40]")}>
        {icon}
      </span>
      <span className="font-medium font-sans">{label}</span>
      {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl lg:text-5xl font-bold mb-2">Welcome back, Farmer</h2>
        <p className="text-[#5A5A40]/70 text-lg">Your AI-powered farm management dashboard is ready.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Disease Doctor" 
          description="Upload plant photos to identify pests and diseases instantly."
          icon={<Bug className="w-8 h-8" />}
          color="bg-rose-50"
          iconColor="text-rose-600"
          onClick={() => onNavigate('disease')}
        />
        <DashboardCard 
          title="Weather Advice" 
          description="Get personalized planting and harvesting tips based on local weather."
          icon={<CloudSun className="w-8 h-8" />}
          color="bg-sky-50"
          iconColor="text-sky-600"
          onClick={() => onNavigate('weather')}
        />
        <DashboardCard 
          title="Market Trends" 
          description="Stay ahead with AI-driven market price analysis and predictions."
          icon={<TrendingUp className="w-8 h-8" />}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={() => onNavigate('market')}
        />
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-[#5A5A40]/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Quick Farming Tips</h3>
          <Sprout className="text-[#5A5A40] opacity-20" />
        </div>
        <div className="space-y-4">
          <TipItem text="Rotate crops like legumes with cereals to maintain soil nitrogen levels naturally." />
          <TipItem text="Early morning is the best time for irrigation to minimize evaporation and fungal growth." />
          <TipItem text="Check the underside of leaves weekly for early signs of pest infestations." />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon, color, iconColor, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm hover:shadow-xl transition-all duration-300 text-left group"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", color, iconColor)}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-[#5A5A40]/70 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center text-sm font-bold uppercase tracking-wider text-[#5A5A40] group-hover:gap-2 transition-all">
        Launch Feature <ChevronRight size={16} />
      </div>
    </button>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-[#F5F5F0] transition-colors group">
      <div className="w-2 h-2 rounded-full bg-[#5A5A40] mt-2 group-hover:scale-150 transition-transform" />
      <p className="text-[#5A5A40] leading-relaxed">{text}</p>
    </div>
  );
}

function DiseaseIdentifier() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await identifyDisease(base64Data, mimeType);
      setResult(analysis || "Could not analyze image.");
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-bold mb-2">Disease Doctor</h2>
        <p className="text-[#5A5A40]/70">Snap a photo of your plant to get an instant diagnosis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-square rounded-[40px] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative",
              image ? "border-[#5A5A40]" : "border-[#5A5A40]/20 hover:border-[#5A5A40]/40 bg-white"
            )}
          >
            {image ? (
              <>
                <img src={image} alt="Plant" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white w-12 h-12" />
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="bg-[#F5F5F0] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-[#5A5A40] w-8 h-8" />
                </div>
                <p className="text-xl font-bold mb-2">Upload or Take Photo</p>
                <p className="text-[#5A5A40]/60">Supports JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <button
            disabled={!image || loading}
            onClick={handleIdentify}
            className={cn(
              "w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all",
              !image || loading 
                ? "bg-[#5A5A40]/20 text-[#5A5A40]/40 cursor-not-allowed" 
                : "bg-[#5A5A40] text-white hover:shadow-xl hover:-translate-y-1"
            )}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Bug />}
            {loading ? "Analyzing..." : "Diagnose Plant"}
          </button>
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-[#5A5A40]/10 shadow-sm min-h-[400px]">
          {result ? (
            <div className="prose prose-stone max-w-none">
              <Markdown>{result}</Markdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#5A5A40]/40">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">Diagnosis results will appear here after analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherAdvice() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  }, []);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const prompt = location 
        ? `I am at coordinates ${location.lat}, ${location.lon}. Based on typical weather patterns for this area and current season, give me 5 specific farming tips for this week. Include planting, irrigation, and pest control advice.`
        : "Give me 5 general seasonal farming tips for sustainable agriculture this week.";
      
      const result = await getFarmingAdvice(prompt, "Weather and Seasonal Advice");
      setAdvice(result);
    } catch (error) {
      console.error(error);
      setAdvice("Error getting advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-bold mb-2">Weather & Tips</h2>
        <p className="text-[#5A5A40]/70">Localized farming intelligence based on your environment.</p>
      </header>

      <div className="bg-white rounded-[40px] p-8 border border-[#5A5A40]/10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-sky-50 p-4 rounded-2xl">
              <MapPin className="text-sky-600 w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-[#5A5A40]/60 font-sans uppercase tracking-widest">Your Location</p>
              <p className="text-xl font-bold">
                {location ? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}` : "Location not detected"}
              </p>
            </div>
          </div>
          <button
            onClick={getAdvice}
            disabled={loading}
            className="bg-[#5A5A40] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CloudSun />}
            {loading ? "Fetching Advice..." : "Get AI Advice"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <WeatherStat icon={<ThermometerSun className="text-orange-500" />} label="Temp Range" value="22°C - 30°C" />
          <WeatherStat icon={<Droplets className="text-blue-500" />} label="Humidity" value="65%" />
          <WeatherStat icon={<Wind className="text-slate-500" />} label="Wind Speed" value="12 km/h" />
        </div>

        {advice && (
          <div className="bg-[#F5F5F0] p-8 rounded-3xl prose prose-stone max-w-none">
            <Markdown>{advice}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }: any) {
  return (
    <div className="bg-[#F5F5F0] p-6 rounded-3xl flex items-center gap-4">
      <div className="bg-white p-3 rounded-xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#5A5A40]/60 font-sans uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function MarketInsights() {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    try {
      const result = await getFarmingAdvice(
        "Provide a market analysis for major agricultural commodities (Rice, Wheat, Corn, Soybeans) for this month. Include price trends, supply chain factors, and advice on when to sell or hold crops.",
        "Market Intelligence"
      );
      setInsights(result);
    } catch (error) {
      console.error(error);
      setInsights("Error getting market data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-bold mb-2">Market Insights</h2>
        <p className="text-[#5A5A40]/70">AI-driven analysis of crop prices and market trends.</p>
      </header>

      <div className="bg-white rounded-[40px] p-8 border border-[#5A5A40]/10 shadow-sm">
        {!insights && !loading ? (
          <div className="text-center py-20">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-emerald-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Analyze Market Trends</h3>
            <p className="text-[#5A5A40]/60 max-w-md mx-auto mb-8">
              Get real-time insights into commodity prices and supply chain factors to maximize your farm's profitability.
            </p>
            <button
              onClick={getInsights}
              className="bg-[#5A5A40] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
            >
              Generate Analysis
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#5A5A40] animate-spin mb-4" />
            <p className="text-[#5A5A40] font-medium">Analyzing global market data...</p>
          </div>
        ) : (
          <div className="prose prose-stone max-w-none">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#5A5A40]/10">
              <h3 className="text-2xl font-bold m-0">Monthly Market Report</h3>
              <button onClick={getInsights} className="text-[#5A5A40] hover:underline font-bold text-sm">Refresh Data</button>
            </div>
            <Markdown>{insights}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

function FarmingChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hello! I'm your AgriSmart Expert. How can I help you with your farm today? You can ask about soil health, irrigation, pest control, or crop selection." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getFarmingAdvice(userMsg, "Interactive Expert Chat");
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <header className="mb-6">
        <h2 className="text-4xl font-bold mb-2">Expert Chat</h2>
        <p className="text-[#5A5A40]/70">Get instant answers to any farming question.</p>
      </header>

      <div className="flex-1 bg-white rounded-[40px] border border-[#5A5A40]/10 shadow-sm flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "max-w-[80%] p-5 rounded-3xl",
                msg.role === 'user' 
                  ? "bg-[#5A5A40] text-white rounded-tr-none" 
                  : "bg-[#F5F5F0] text-[#1A1A1A] rounded-tl-none"
              )}>
                <div className="prose prose-sm prose-stone max-w-none">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F5F5F0] p-5 rounded-3xl rounded-tl-none">
                <Loader2 className="w-5 h-5 animate-spin text-[#5A5A40]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#5A5A40]/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about soil, crops, pests..."
              className="flex-1 bg-[#F5F5F0] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#5A5A40] outline-none font-sans"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-[#5A5A40] text-white p-4 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50"
            >
              <MessageSquare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
