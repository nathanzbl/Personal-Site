import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import SectionHeader from '../components/SectionHeader'
import TimelineItem from '../components/TimelineItem'
import { api, type AboutResponse, type InterestResponse, type CourseworkResponse, type ExperienceResponse } from '../lib/api'
import { getIcon } from '../lib/iconMap'

export default function About() {
  const [about, setAbout] = useState<AboutResponse | null>(null)
  const [interests, setInterests] = useState<InterestResponse[]>([])
  const [coursework, setCoursework] = useState<CourseworkResponse[]>([])
  const [experience, setExperience] = useState<ExperienceResponse[]>([])

  useEffect(() => {
    Promise.all([
      api.about.get(),
      api.interests.list(),
      api.coursework.list(),
      api.experience.list(),
    ]).then(([ab, intr, cw, ex]) => {
      setAbout(ab)
      setInterests(intr)
      setCoursework(cw)
      setExperience(ex)
    })
  }, [])

  return (
    <>
      {/* Bio section */}
      <section className="py-16 md:py-28">
        <div className="max-w-[900px] w-full mx-auto px-6">
          <SectionHeader code="// ABOUT" title="About Me" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 space-y-6"
            >
              {about?.bio_paragraphs[0] && (
                <p className="text-base md:text-lg text-ink leading-relaxed">
                  {about.bio_paragraphs[0]}
                </p>
              )}
              {about?.bio_paragraphs[1] && (
                <p className="text-slate leading-relaxed">
                  {about.bio_paragraphs[1]}
                </p>
              )}
              {about?.bio_paragraphs[2] && (
                <p className="text-slate leading-relaxed">
                  {about.bio_paragraphs[2]}
                </p>
              )}

              {about?.facts && about.facts.length > 0 && (
                <div className="pt-6 grid grid-cols-2 gap-3 md:gap-4">
                  {about.facts.map((fact, i) => {
                    const Icon = getIcon(fact.icon)
                    return (
                      <motion.div
                        key={fact.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-mist bg-snow"
                      >
                        <Icon size={16} className="text-blue shrink-0" />
                        <span className="text-sm text-ink">{fact.text}</span>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2"
            >
              <div className="aspect-[3/4] rounded-2xl border border-mist bg-cloud overflow-hidden relative">
                <img
                  src={about?.headshot_url ?? '/headshot.jpg'}
                  alt="Nathan Blatter"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/5 to-violet/5">
                        <div class="text-center">
                          <div class="w-20 h-20 rounded-full bg-white border-2 border-mist mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <span style="font-family: var(--font-serif); font-size: 2rem; font-style: italic; color: var(--color-blue);">N</span>
                          </div>
                          <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-steel);">Photo coming soon</p>
                        </div>
                      </div>`
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 md:py-28 bg-snow">
        <div className="max-w-[900px] w-full mx-auto px-6">
          <SectionHeader
            code="// FOCUS"
            title="Interests"
            subtitle="Areas I'm most passionate about."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {interests.map((item, i) => {
              const Icon = getIcon(item.icon)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group p-5 md:p-6 rounded-xl border border-mist bg-white hover:border-blue/30 hover:shadow-lg hover:shadow-blue/5 transition-all"
                >
                  <Icon size={20} className="text-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-sans font-semibold text-ink mb-1">{item.label}</h4>
                  <p className="text-sm text-steel leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Coursework */}
      <section className="py-16 md:py-28">
        <div className="max-w-[700px] w-full mx-auto px-6">
          <SectionHeader
            code="// COURSEWORK"
            title="Studies"
            subtitle="Key courses shaping my technical foundation at BYU."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {coursework.map((course, i) => (
              <motion.span
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="font-mono text-xs md:text-sm px-4 md:px-5 py-2.5 md:py-3 rounded-xl border border-mist text-ink bg-snow hover:border-blue/30 hover:text-blue transition-colors cursor-default"
              >
                {course.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-28 bg-snow">
        <div className="max-w-[700px] w-full mx-auto px-6">
          <SectionHeader
            code="// TIMELINE"
            title="Experience"
            subtitle="Where I've been and what I've done."
          />
          <div>
            {experience.map((item, i) => (
              <TimelineItem key={item.id} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
