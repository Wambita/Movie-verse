import React from 'react';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import { ThemeProvider } from '../features/theme/ThemeContext';

const Home = () => {
  return (
    <ThemeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
};

export default Home;