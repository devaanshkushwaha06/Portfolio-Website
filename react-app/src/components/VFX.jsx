import { motion } from 'framer-motion';
import BlurText from './BlurText';

const VFX = () => {
  const projects = [
    {
      id: 1,
      title: "Epic Battle Sequence",
      category: "VFX Compositing",
      description: "High-energy battle scene with particle effects and dynamic lighting",
      status: "Coming Soon"
    },
    {
      id: 2,
      title: "Corporate Brand Animation",
      category: "Motion Graphics",
      description: "Sleek brand reveal with fluid transitions and kinetic typography",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Environmental VFX",
      category: "3D Effects",
      description: "Photorealistic environment enhancement with atmospheric effects",
      status: "Completed"
    },
    {
      id: 4,
      title: "Character Animation",
      category: "Animation",
      description: "Detailed character rigging and animation for storytelling",
      status: "Coming Soon"
    }
  ];

  return (
    <section id="vfx" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <BlurText
            text="VFX Portfolio"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-4xl lg:text-5xl font-bold text-primary-gold mb-6 text-glow"
          />
          
          <BlurText
            text="Bringing imagination to life through cutting-edge visual effects"
            delay={120}
            animateBy="words"
            direction="top"
            className="text-xl text-text-light opacity-90"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="glass-card p-6 group hover:border-primary-gold/30 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="aspect-video bg-gradient-to-br from-dark-bg to-darker-bg rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-gold/20 to-cyan-accent/20"
                  initial={{ scale: 0, rotate: 0 }}
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="relative z-10 text-center">
                  <i className="fas fa-video text-4xl text-primary-gold mb-2"></i>
                  <p className="text-text-light text-sm">{project.status}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text-light group-hover:text-primary-gold transition-colors">
                    {project.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed' 
                      ? 'bg-green-500/20 text-green-400'
                      : project.status === 'In Progress'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-cyan-accent font-medium">{project.category}</p>
                <p className="text-text-light opacity-75">{project.description}</p>
                
                <motion.button
                  className="mt-4 text-primary-gold hover:text-accent-gold transition-colors flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span>View Details</span>
                  <i className="fas fa-arrow-right"></i>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VFX;