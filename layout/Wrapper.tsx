import Box from '@mui/material/Box';
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface wrapperProps {
  children: React.ReactNode;
}

const Wrapper = (props: wrapperProps) => {
  const { children } = props;

  return (
    <>
      <Header />

      <Box className='body_content'>{children}</Box>

      <Footer />
    </>
  );
};

export default Wrapper;
