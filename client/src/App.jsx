import React, { useState } from 'react';
import Auth from './pages/Auth';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';

export default function App() {
  const [activeTab, setActiveTab] = useState('auth');

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-indigo-400">Dayflow HRMS</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('auth')} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'auth' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            Auth
          </button>
          <button 
            onClick={() => setActiveTab('attendance')} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            Attendance
          </button>
          <button 
            onClick={() => setActiveTab('leaves')} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'leaves' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            Leaves
          </button>
          <button 
            onClick={() => setActiveTab('payroll')} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'payroll' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            Payroll
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'auth' && <Auth />}
        {activeTab === 'attendance' && <Attendance />}
        {activeTab === 'leaves' && <Leaves />}
        {activeTab === 'payroll' && <Payroll />}
      </div>
    </div>
  );
}
