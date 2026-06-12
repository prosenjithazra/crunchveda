'use client';

import React from 'react';
import ContactHero from './ContactHero';
import ContactMain from './ContactMain';
import ContactSupport from './ContactSupport';

export default function ContactUI() {
  return (
    <>
      <ContactHero />
      <ContactMain />
      <ContactSupport />
    </>
  );
}
