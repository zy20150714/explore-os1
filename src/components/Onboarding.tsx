import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Briefcase, Calendar, ChevronRight, ChevronLeft, Sparkles, Compass } from 'lucide-react';
import { useData } from '@/context/DataProvider';

const steps = [
  {
    title: '欢迎来到 Explore OS',
    subtitle: '你的个人管理仪表盘',
    description: '一站式管理你的待办事项、长期项目、日程安排和生活习惯。',
    icon: Compass,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    title: '三大核心功能',
    subtitle: '快速上手',
    features: [
      { icon: CheckSquare, label: '待办事项', desc: '管理日常任务，设置截止日期', color: 'text-blue-400' },
      { icon: Briefcase, label: '长期项目', desc: '追踪项目进度，每日打卡', color: 'text-purple-400' },
      { icon: Calendar, label: '日程管理', desc: '规划时间，不错过重要安排', color: 'text-green-400' },
    ],
  },
  {
    title: '准备好了吗？',
    subtitle: '开始探索',
    description: '你可以随时在设置中重新查看本引导。',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
  },
];

export function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const { updateSettings } = useData();

  const handleComplete = () => {
    updateSettings({ onboardingCompleted: true });
    onClose();
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) handleComplete(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 max-w-md w-[90vw] shadow-2xl"
        >
          {/* Step indicator */}
          <div className="flex gap-2 mb-6 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-teal-500' : i < step ? 'w-4 bg-teal-500/60' : 'w-4 bg-slate-600'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon */}
            {'icon' in current && current.icon && (
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${current.color} bg-opacity-20`}>
                  <current.icon size={40} className="text-white" />
                </div>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-white text-center mb-1">{current.title}</h2>
            <p className="text-sm text-slate-400 text-center mb-6">{current.subtitle}</p>

            {/* Features (step 2) */}
            {'features' in current && current.features && (
              <div className="space-y-3 mb-6">
                {current.features.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-slate-600/50"
                  >
                    <div className={`p-2 rounded-lg bg-slate-600/50 ${f.color}`}>
                      <f.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{f.label}</div>
                      <div className="text-xs text-slate-400">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Description (step 1 & 3) */}
            {'description' in current && (
              <p className="text-sm text-slate-300 text-center mb-6">{current.description}</p>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> 上一步
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                下一步 <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-1 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                开始使用 <Sparkles size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}