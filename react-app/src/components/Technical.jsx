import { motion } from 'framer-motion';
import BlurText from './BlurText';

const Technical = () => {
  const skills = [
    {
      category: "VFX Software",
      items: ["After Effects", "Nuke", "Houdini", "Cinema 4D", "Blender", "Maya"]
    },
    {
      category: "Programming",
      items: ["Python", "JavaScript", "React", "Node.js", "C++", "HLSL"]
    },
    {
      category: "Creative Tools",
      items: ["Photoshop", "Illustrator", "Premiere Pro", "DaVinci Resolve", "Substance Painter"]
    },
    {
      category: "Technologies",
      items: ["Real-time Rendering", "Motion Capture", "Virtual Production", "AI/ML in VFX"]
    }
  ];

  const achievements = [
    {
      title: "VFX Head at UPES ACM",
      description: "Leading the visual effects team and coordinating creative projects",
      icon: "fas fa-crown"
    },
    {
      title: "Creative Project Lead",
      description: "Managed multiple high-profile creative campaigns",
      icon: "fas fa-project-diagram"
    },
    {
      title: "Technical Innovation",
      description: "Implemented cutting-edge workflows and pipeline optimizations",
      icon: "fas fa-cogs"
    }
  ];

  return (
    <section id="technical" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <BlurText
            text="Technical Expertise"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-4xl lg:text-5xl font-bold text-primary-gold mb-6 text-glow"
          />
          
          <BlurText
            text="Mastering the tools and technologies that power modern VFX"
            delay={120}
            animateBy="words"
            direction="top"
            className="text-xl text-text-light opacity-90"
          />
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-cyan-accent mb-4">{skillGroup.category}</h3>
              <div className="grid grid-cols-2 gap-3">
                {skillGroup.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    className="bg-dark-bg/50 px-3 py-2 rounded-lg text-text-light text-sm text-center hover:bg-primary-gold/20 transition-colors cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-primary-gold text-center mb-12">Key Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="glass-card p-6 text-center group hover:border-primary-gold/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-primary-gold to-accent-gold rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <i className={`${achievement.icon} text-dark-bg text-xl`}></i>
                </motion.div>
                <h4 className="text-lg font-bold text-text-light mb-3 group-hover:text-primary-gold transition-colors">
                  {achievement.title}
                </h4>
                <p className="text-text-light opacity-75">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Ready to Collaborate?</h3>
            <p className="text-text-light opacity-90 mb-6">
              Let's bring your creative vision to life with cutting-edge VFX and technical expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Project
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technical;