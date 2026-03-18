import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowUpRight } from 'lucide-react'
import type { Project } from './ProjectCard'

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, onClose])

  const statusColors: Record<string, string> = {
    live: 'bg-teal',
    wip: 'bg-blue',
    archived: 'bg-silver',
  }

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg bg-white rounded-2xl border border-mist shadow-2xl pointer-events-auto overflow-hidden">
              {/* Accent bar */}
              <div className="h-1.5 w-full" style={{ background: project.color }} />

              <div className="p-7 md:p-8">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
                    <span className="font-mono text-xs text-steel uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-silver">{project.year}</span>
                    <button
                      onClick={onClose}
                      className="text-silver hover:text-ink transition-colors"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-sans font-semibold text-ink mb-5">
                  {project.title}
                </h3>

                {/* Full description */}
                <p className="text-steel text-sm leading-relaxed mb-7">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-cloud text-slate"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Live link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs text-blue hover:text-blue-dim transition-colors"
                  >
                    View Live
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
