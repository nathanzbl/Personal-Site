import { motion } from 'motion/react'

interface SkillBarProps {
  name: string
  level: number
  category: string
  index: number
}

export default function SkillBar({ name, level, category, index }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-steel uppercase tracking-wider w-16">
            {category}
          </span>
          <span className="text-sm text-ink font-medium group-hover:text-blue transition-colors">
            {name}
          </span>
        </div>
        <span className="font-mono text-xs text-steel">{level}%</span>
      </div>
      <div className="h-2 bg-cloud rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-dim to-blue-light"
        />
      </div>
    </motion.div>
  )
}
