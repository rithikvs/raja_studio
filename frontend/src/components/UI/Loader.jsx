
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';
import logoImg from '../../assets/images/logo.jpg';

const Loader = () => {
  return (
    <motion.div 
      className={styles.loaderContainer}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src={logoImg}
        alt="Logo"
        className={styles.logoImg}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  );
};

export default Loader;
