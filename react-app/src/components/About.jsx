import { motion } from 'framer-motion';
import BlurText from './BlurText';

const About = () => {
  return (
    <section id="about" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <BlurText
            text="About Me"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-4xl lg:text-5xl font-bold text-primary-gold mb-6 text-glow"
          />
          
          <BlurText
            text="Passionate about creating stunning visual experiences"
            delay={120}
            animateBy="words"
            direction="top"
            className="text-xl text-text-light opacity-90"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-primary-gold mb-6">My Journey</h3>
            <div className="space-y-4 text-text-light">
              <p>
                Currently pursuing B.Tech at UPES Dehradun, I've found my passion in the intersection 
                of technology and creativity. As VFX Head at UPES ACM, I lead a team of creative minds 
                in bringing extraordinary visual stories to life.
              </p>
              <p>
                My expertise spans across motion graphics, 3D modeling, compositing, and emerging 
                technologies in visual effects. I believe in pushing the boundaries of what's possible 
                in digital storytelling.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-6">
              <h4 className="text-xl font-semibold text-cyan-accent mb-3">Skills & Expertise</h4>
              <div className="grid grid-cols-2 gap-3">
                {['Motion Graphics', 'VFX Compositing', '3D Modeling', 'Creative Direction', 'Team Leadership', 'Visual Storytelling'].map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="bg-dark-bg/50 px-3 py-2 rounded-lg text-text-light text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="text-xl font-semibold text-primary-gold mb-3">Education</h4>
              <div className="space-y-2">
                <p className="text-text-light font-medium">B.Tech in Computer Science</p>
                <p className="text-text-gold">UPES Dehradun</p>
                <p className="text-text-light opacity-75">Current Student</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;