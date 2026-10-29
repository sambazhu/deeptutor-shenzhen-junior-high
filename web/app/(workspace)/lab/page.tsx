'use client'

import { useState } from 'react'
import {
  Compass,
  ExternalLink,
  Globe,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Waves,
  Mountain,
  Microscope,
  Zap,
  Flame,
  CheckCircle2,
  X,
} from 'lucide-react'
import { FeaturePage, PageHeader } from '@/components/layout/FeaturePage'

interface LabExperiment {
  id: string
  slug: string
  title: string
  subject: string
  grade: string
  textbook: string
  summary: string
  keyPoints: string[]
  category: 'geo_earth' | 'geo_land' | 'bio' | 'phys_chem'
  icon: typeof Globe
}

const EXPERIMENTS: LabExperiment[] = [
  {
    id: 'earth-motion',
    slug: 'earth-motion-step',
    title: '地球运动与昼夜更替',
    subject: '地理',
    grade: '七年级上册',
    textbook: '湘教版 第二章 第一节《认识地球》',
    summary: '3D 动态观察地球自转、地轴倾斜（66.5°）、晨昏线移动与昼夜半球更替。',
    keyPoints: ['地轴倾斜角与自转方向（北逆南顺）', '晨线与昏线的空间几何判定', '极昼与极夜的范围变化'],
    category: 'geo_earth',
    icon: Globe,
  },
  {
    id: 'insolation',
    slug: 'insolation-step',
    title: '太阳直射点移动与四季五带',
    subject: '地理',
    grade: '七年级上册',
    textbook: '湘教版 第二章 第二节《认识地球》',
    summary: '拖动回归年时间轴，直观观察直射点在南北回归线间的往返移动与四季成因。',
    keyPoints: ['二分二至日直射纬度与昼夜长短', '正午太阳高度角变化规律', '热带、温带与寒带划分依据'],
    category: 'geo_earth',
    icon: Compass,
  },
  {
    id: 'water-cycle',
    slug: 'water-cycle-step',
    title: '水循环过程与地理意义',
    subject: '地理',
    grade: '七/八年级',
    textbook: '湘教版《自然环境中的水》',
    summary: '3D 动态展示海陆间循环、海上内循环与陆地内循环的完整流动过程。',
    keyPoints: ['蒸发、水汽输送与降水过程', '地表径流与地下下渗补给', '人类活动对水循环环节的影响'],
    category: 'geo_earth',
    icon: Waves,
  },
  {
    id: 'circulation',
    slug: 'circulation-step',
    title: '三圈环流与气压带风带',
    subject: '地理',
    grade: '七/八年级',
    textbook: '湘教版《复杂多样的天气与气候》',
    summary: '立体模拟高低纬受热不均与地转偏向力共同驱动的全球大气环流。',
    keyPoints: ['赤道低压带与副热带高压带成因', '信风带、西风带与极地东风带方向', '气压带风带的季节移动规律'],
    category: 'geo_earth',
    icon: Waves,
  },
  {
    id: 'river',
    slug: 'river-step',
    title: '河流地貌的发育过程',
    subject: '地理',
    grade: '八年级',
    textbook: '湘教版 中国的自然环境《地形与地貌》',
    summary: '3D 仿真河流从源头深山到入海口的侵蚀、搬运与堆积形态演化。',
    keyPoints: ['上游下切侵蚀：V形谷与瀑布', '中游侧蚀：曲流与冲积扇发育', '下游堆积：冲积平原与河口三角洲'],
    category: 'geo_land',
    icon: Mountain,
  },
  {
    id: 'karst',
    slug: 'karst-step',
    title: '喀斯特地貌三维地下切面',
    subject: '地理',
    grade: '八年级',
    textbook: '湘教版 中国自然奇观《喀斯特地貌》',
    summary: '三维地下透视切面，观察石灰岩受流水溶蚀与淀积形成的地貌全景。',
    keyPoints: ['地表峰林、峰丛与溶蚀洼地', '地下溶洞与暗河系统', '钟乳石、石笋与石柱的缓慢沉积'],
    category: 'geo_land',
    icon: Mountain,
  },
  {
    id: 'currents',
    slug: 'currents-step',
    title: '世界表层洋流三维分布',
    subject: '地理',
    grade: '八年级',
    textbook: '湘教版 海洋与气候《大洋环流》',
    summary: '3D 动态观察全球大洋暖流与寒流环流系统及其对气候与渔场的调节作用。',
    keyPoints: ['中低纬副热带反气旋型大洋环流', '寒暖流性质及其对沿岸气候影响', '寒暖流交汇区世界大渔场的形成'],
    category: 'geo_land',
    icon: Waves,
  },
  {
    id: 'plasmolysis',
    slug: 'plasmolysis-step',
    title: '植物细胞质壁分离与复原',
    subject: '生物',
    grade: '七年级上册',
    textbook: '人教版 第二单元《细胞怎样构成生物体》',
    summary: '显微镜下仿真洋葱表皮细胞在高渗溶液与清水中的渗透吸水与失水变化。',
    keyPoints: ['原生质层相当于一层半透膜', '细胞液浓度与外界浓度差驱动水分进出', '液泡体积大小与颜色深浅变化'],
    category: 'bio',
    icon: Microscope,
  },
  {
    id: 'current-field',
    slug: 'current-field-step',
    title: '电流的磁场与安培定则',
    subject: '物理',
    grade: '九年级',
    textbook: '人教版 第二十章《电与磁·电生磁》',
    summary: '三维环绕显示通电直导线与通电螺线管周围的立体磁感线分布。',
    keyPoints: ['右手螺旋定则空间方位判定', '螺线管极性（N/S 极）与电流方向关系', '磁感线密度与磁场强弱直观感知'],
    category: 'phys_chem',
    icon: Zap,
  },
]

type CategoryKey = 'all' | 'geo_earth' | 'geo_land' | 'bio' | 'phys_chem'

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: '全部实验' },
  { key: 'geo_earth', label: '七年级地理 · 认识地球与水文' },
  { key: 'geo_land', label: '八年级地理 · 地貌与洋流演变' },
  { key: 'bio', label: '初中生物 · 细胞微观探索' },
  { key: 'phys_chem', label: '初中物理 · 磁场与微观作用' },
]

export default function LabPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all')
  const [activeExp, setActiveExp] = useState<LabExperiment | null>(null)
  const [iframeKey, setIframeKey] = useState(0)

  const filteredExperiments = EXPERIMENTS.filter((exp) => {
    if (selectedCategory === 'all') return true
    return exp.category === selectedCategory
  })

  return (
    <FeaturePage>
      <PageHeader
        title="3D 互动沙盘与科学实验室"
        description="精选对齐深圳初中 7~9 年级教材重点与难点考点，将抽象的宇宙空间、地貌演化与微观细胞具象化呈现。支持页内即时 3D 旋转操作与全屏沉浸式探索。"
        action={
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>三维物理仿真 · 无需插件 · 点开即玩</span>
          </div>
        }
      />

      {/* 嵌入式交互工作台（点击任意卡片后展开） */}
      {activeExp && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--muted)]/50 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-semibold">
                3D
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">{activeExp.title}</h2>
                  <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                    {activeExp.textbook}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{activeExp.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                title="重新加载"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>重置</span>
              </button>
              <a
                href={`/api/labs/${activeExp.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>本地全屏 ↗</span>
              </a>
              <a
                href={`https://lab.tongjiang.app/${activeExp.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="访问铜匠实验室原站"
              >
                <span>原站 🌐</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveExp(null)}
                title="关闭沙盘"
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full aspect-[16/10] max-h-[660px] min-h-[480px] bg-[var(--muted)]/30">
            <iframe
              key={iframeKey}
              src={`/api/labs/${activeExp.slug}`}
              className="h-full w-full border-0"
              title={activeExp.title}
              allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
            />
          </div>
        </section>
      )}

      {/* 学科分类筛选栏 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === cat.key
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 实验卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExperiments.map((exp) => {
          const Icon = exp.icon
          const isCurrentActive = activeExp?.id === exp.id

          return (
            <div
              key={exp.id}
              className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                isCurrentActive
                  ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 bg-[var(--card)]'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--ring)]/50 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted-foreground)]">
                    {exp.grade} {exp.subject}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {exp.title}
                </h3>
                <p className="text-[11.5px] font-medium text-[var(--muted-foreground)] mb-2.5">
                  {exp.textbook}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
                  {exp.summary}
                </p>

                <div className="mb-4 space-y-1.5 border-t border-[var(--border)]/60 pt-3">
                  {exp.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11.5px] text-[var(--muted-foreground)]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]/60">
                <button
                  type="button"
                  onClick={() => {
                    setActiveExp(exp)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                    isCurrentActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {isCurrentActive ? '正在体验中' : '页内交互 🎮'}
                </button>
                <a
                  href={`/api/labs/${exp.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  title="在新标签页全屏打开（本地秒开）"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </FeaturePage>
  )
}
