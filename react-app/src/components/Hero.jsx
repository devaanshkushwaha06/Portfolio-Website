import { motion } from 'framer-motion';
import BlurText from './BlurText';

const Hero = () => {
  const handleAnimationComplete = () => {
    console.log('Hero animation completed!');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BlurText
              text="Hi, I'm Devaansh Kushwaha"
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-4xl lg:text-6xl font-bold mb-6 text-text-light text-shadow-lg"
            />
            
            <BlurText
              text="VFX Head & Emerging Creative Professional"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-xl lg:text-2xl text-text-gold mb-6 text-shadow"
            />
            
            <BlurText
              text="B.Tech Student at UPES Dehradun | VFX Head at UPES ACM | Ready to bring your vision to life with fresh creativity and professional standards"
              delay={80}
              animateBy="words"
              direction="top"
              className="text-lg text-text-light opacity-90 mb-8 text-shadow leading-relaxed"
            />

            {/* Availability Status */}
            <motion.div
              className="glass-card inline-block p-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-text-light font-medium">Available for projects</span>
                </div>
                <div className="flex items-center space-x-2 text-text-gold">
                  <i className="fas fa-clock"></i>
                  <span>Under 24 hours</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn About Me
              </motion.button>
              
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('vfx')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View My VFX Work
              </motion.button>
              
              <motion.a
                href="https://wa.me/+916265954576?text=Hi%20Devaansh!%20I%27m%20interested%20in%20your%20VFX%20services.%20Can%20we%20discuss%20my%20project?"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-whatsapp"></i>
                <span>Quick Chat</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-80 rounded-full glass-card p-2 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-gold/20 to-cyan-accent/20 flex items-center justify-center">
                  <i className="fas fa-user-circle text-8xl text-primary-gold opacity-70"></i>
                </div>
              </motion.div>
              
              {/* Floating elements around profile */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary-gold rounded-full opacity-80"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-accent rounded-full opacity-80"
                animate={{
                  y: [0, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.5 }}
      >
        <motion.div
          className="flex flex-col items-center text-text-light"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm mb-2">Scroll down</span>
          <i className="fas fa-chevron-down text-primary-gold"></i>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;