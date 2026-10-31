'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Compass,
  Target,
  BookOpen,
  Sparkles,
  HelpCircle,
  X,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'

interface StudentWelcomeGuideProps {
  onPick: (prompt: string) => void
  disabled?: boolean
}

export default function StudentWelcomeGuide({ onPick, disabled }: StudentWelcomeGuideProps) {
  const router = useRouter()
  const [showHelpModal, setShowHelpModal] = useState(false)

  const scenarios = [
    {
      id: 'wrongbook',
      title: '错题攻坚与变式',
      badge: '已同步 52 题',
      desc: '调取微信台账错题，出一道有理数或代数同类型变式题巩固消灭',
      icon: Target,
      color: 'amber',
      action: () => {
        onPick(
          '请查看我的错题知识库（qiuyu-wrongbook），针对最近错误率较高的知识点，帮我出一道同类型的初一变式题让我练手。'
        )
      },
    },
    {
      id: 'lab3d',
      title: '3D 科学互动沙盘',
      badge: '9 个三维课件',
      desc: '三维动态观察地球自转昼夜更替、太阳直射点四季移动与水循环',
      icon: Compass,
      color: 'indigo',
      action: () => {
        router.push('/lab')
      },
    },
    {
      id: 'textbook',
      title: '深圳教材同步答疑',
      badge: '44 本教材 PDF',
      desc: '紧扣湘教版地理、人教版数学等深圳七科教材，讲透核心考点与公式',
      icon: BookOpen,
      color: 'blue',
      action: () => {
        onPick(
          '请结合深圳七年级上册教材，帮我梳理湘教版地理《认识地球：地球运动》的核心考点与易错题。'
        )
      },
    },
    {
      id: 'socratic',
      title: '苏格拉底作业伴读',
      badge: '启发不剧透',
      desc: '发题目拍照或打字，老师一步步提问启发思路，绝不直接给答案',
      icon: Sparkles,
      color: 'emerald',
      action: () => {
        onPick(
          '我遇到了一道做不出来的题目，请作为我的苏格拉底辅导老师：不要直接告诉我答案，请一步一步提问启发我解题思路。题目如下：\n'
        )
      },
    },
  ]

  const quickPills = [
    {
      label: '📐 有理数错题变式题 2 道',
      prompt: '请针对我错题本里的“有理数乘方与符号规律”，给我出 2 道易错变式选择题，并带解析。',
    },
    {
      label: '🌍 湘教版地理：极昼极夜成因',
      prompt: '请结合湘教版七年级地理教材，用直白的语言帮我讲讲：为什么南极圈内会出现极夜现象？',
    },
    {
      label: '🔤 初一英语 Unit 1-3 重点单词',
      prompt: '帮我整理初一上册英语 Unit 1-3 的核心高频考点单词和容易拼错的变形词汇清单。',
    },
    {
      label: '🔬 细胞质壁分离实验要点',
      prompt: '请用表格总结“洋葱鳞片叶外表皮细胞质壁分离与复原”实验的操作步骤、试剂浓度和观察要点。',
    },
  ]

  return (
    <div className="w-full max-w-[960px] mx-auto px-6 py-4 space-y-4">
      {/* 顶部温和问候与指引按钮 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <span>秋宇，今天想攻克什么知识？</span>
            <span className="text-lg">👋</span>
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            微信台账已同步 · 包含 52 道错题库与深圳初一上册教材。点击下方卡片即可开始：
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--primary)] bg-[var(--accent)] hover:opacity-90 transition-opacity shrink-0 border border-[var(--border)]"
        >
          <HelpCircle size={14} />
          <span>学习向导</span>
        </button>
      </div>

      {/* 四大学习场景核心大卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {scenarios.map((item) => {
          const Icon = item.icon
          const colorStyles: Record<string, { border: string; bg: string; iconBg: string; text: string; badgeBg: string }> = {
            amber: {
              border: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400',
              bg: 'bg-amber-50/50 dark:bg-amber-950/20',
              iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              text: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
              badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
            },
            indigo: {
              border: 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400',
              bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
              iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
              text: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
              badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
            },
            blue: {
              border: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400',
              bg: 'bg-blue-50/50 dark:bg-blue-950/20',
              iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
              text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
              badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
            },
            emerald: {
              border: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400',
              bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
              iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              text: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
              badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
            },
          }
          const theme = colorStyles[item.color]

          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={item.action}
              className={`group text-left p-4 rounded-2xl border ${theme.border} ${theme.bg} hover:shadow-md transition-all flex items-start gap-3.5 cursor-pointer disabled:opacity-50`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold text-[var(--foreground)] ${theme.text} transition-colors`}
                  >
                    {item.title}
                  </h3>
                  <span
                    className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium shrink-0 ${theme.badgeBg}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--muted-foreground)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 常用快捷提问胶囊 */}
      <div className="space-y-2 pt-1">
        <p className="text-[11.5px] font-semibold text-[var(--muted-foreground)] flex items-center gap-1.5">
          <span>🔥</span>
          <span>初一高频提问（点击直接填入输入框）：</span>
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onPick(pill.prompt)}
              className="bg-[var(--card)] hover:bg-[var(--accent)] hover:text-[var(--primary)] border border-[var(--border)] px-3 py-1.5 rounded-xl transition-all text-left text-xs text-[var(--foreground)] shadow-xs disabled:opacity-50"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 新手学习向导模态弹窗 */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  💡
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  初一学生伴读指南 · 三步搞懂每个知识点
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[var(--foreground)]">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--secondary)]/40 border border-[var(--border)]/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs">
                  1
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">遇到作业错题卡壳了？</h4>
                  <p className="text-[var(--muted-foreground)]">
                    直接给题目拍照上传或输入文字，点击「苏格拉底伴读」。老师会一步一步提问启发你，带你自己想通解法，绝不提前剧透答案！
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--secondary)]/40 border border-[var(--border)]/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xs">
                  2
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">空间概念脑子里转不过来？</h4>
                  <p className="text-[var(--muted-foreground)]">
                    点击左侧「3D 科学实验室」，在三维地球上用鼠标任意旋转、拖动回归年时间轴，亲眼看懂太阳直射点移动、晨昏线与四季昼夜变化。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--secondary)]/40 border border-[var(--border)]/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs">
                  3
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">考前复习查漏补缺怎么做？</h4>
                  <p className="text-[var(--muted-foreground)]">
                    点击「错题攻坚」，AI 会调取微信台账里积累的 52 道真题，给你出同难度的变式题巩固消灭；或者提问“帮我梳理湘教版地理考点”，权威教材秒查！
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                我知道啦，开始学习 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
