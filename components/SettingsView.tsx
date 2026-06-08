import React, { useState, useEffect } from 'react';
import { Save, Settings, Key, Database, Volume2, KeyRound, HelpCircle, KeySquare, HelpCircleIcon } from 'lucide-react';
import { AppSettings, FirebaseConfig } from '../types';
import { getAvailableVoices } from '../services/ttsService';
import { auth, logout, initFirebase } from '../services/firebaseService';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey);
  const [firebaseEnabled, setFirebaseEnabled] = useState(settings.firebaseEnabled);

  // TTS fields
  const [ttsRate, setTtsRate] = useState(settings.ttsRate);
  const [ttsPitch, setTtsPitch] = useState(settings.ttsPitch);
  const [ttsVoiceName, setTtsVoiceName] = useState(settings.ttsVoiceName || '');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  // Load danh sách giọng nói TTS
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = getAvailableVoices();
      // Chỉ lấy giọng đọc tiếng Anh
      const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
      setVoices(enVoices);
      
      if (!ttsVoiceName && enVoices.length > 0) {
        const defaultVoice = enVoices.find(v => v.lang.startsWith('en-US')) || enVoices[0];
        setTtsVoiceName(defaultVoice.name);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings: AppSettings = {
      geminiApiKey: geminiKey.trim(),
      firebaseEnabled: settings.firebaseEnabled,
      firebaseConfig: settings.firebaseConfig,
      ttsRate,
      ttsPitch,
      ttsVoiceName
    };

    onSaveSettings(updatedSettings);
    alert("Đã lưu cấu hình cài đặt hệ thống!");
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await logout();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Tiêu đề */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl py-3.5 px-5 border border-slate-150 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
          <Settings size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Cấu hình Hệ thống</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Cài đặt API, đồng bộ đám mây và giọng đọc</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Phần cấu hình Gemini API Key */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-150 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <Key className="text-indigo-500" size={18} />
            Gemini AI Credentials
          </h3>
          <div className="border-t border-slate-100 dark:border-slate-850 w-full" />
          
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Gemini API Key
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Nhập AI Studio API Key..."
                className="w-full p-3.5 pl-10 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20 dark:text-white rounded-2xl outline-none focus:ring-4 focus:ring-indigo-150 dark:focus:ring-indigo-900/50 focus:border-indigo-500 transition-all font-mono"
              />
              <span className="absolute left-3.5 text-slate-400">
                <KeyRound size={16} />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic">Key này được lưu an toàn tại Client của bạn để gọi AI tạo từ vựng, truyện học AI và chấm thi VSTEP.</p>
          </div>
        </div>

        {/* 2. Cấu hình Giọng đọc TTS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-150 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <Volume2 className="text-amber-500" size={18} />
            Giọng phát âm ngoại ngữ (TTS)
          </h3>
          <div className="border-t border-slate-100 dark:border-slate-850 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chọn accent giọng đọc */}
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Chọn Accent phát âm
              </label>
              <select
                value={ttsVoiceName}
                onChange={(e) => setTtsVoiceName(e.target.value)}
                className="w-full p-3.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-200 rounded-2xl focus:border-indigo-500 outline-none cursor-pointer"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.localService ? "[Offline]" : ""}
                  </option>
                ))}
                {voices.length === 0 && (
                  <option>Đang nạp giọng đọc tiếng Anh...</option>
                )}
              </select>
            </div>

            {/* Tốc độ đọc */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>Tốc độ đọc (Rate)</span>
                <span>{ttsRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={ttsRate}
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cao độ */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>Cao độ giọng (Pitch)</span>
                <span>{ttsPitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={ttsPitch}
                onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* 3. Phần tài khoản */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-150 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <Database className="text-emerald-500" size={18} />
            Tài khoản Đám mây
          </h3>
          <div className="border-t border-slate-100 dark:border-slate-850 w-full" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                {auth.currentUser?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{auth.currentUser?.displayName || 'Người dùng'}</p>
                <p className="text-xs font-semibold text-slate-500">{auth.currentUser?.email}</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Nút lưu */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
        >
          <Save size={16} />
          Lưu cấu hình hệ thống
        </button>

      </form>

    </div>
  );
};
