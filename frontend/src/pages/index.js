import React from 'react';
import Layout from '../components/Layout';
import APITest from '../components/APITest';
import { ThemeProvider } from '../features/theme/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <APITest />
      </Layout>
    </ThemeProvider>
  );
}