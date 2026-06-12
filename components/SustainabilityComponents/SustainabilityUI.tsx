'use client';

import React from 'react';
import SustainabilityHero from './SustainabilityHero';
import RegenerativeAgriculture from './RegenerativeAgriculture';
import ZeroPlasticMandate from './ZeroPlasticMandate';
import ClimateNeutralDelivery from './ClimateNeutralDelivery';

export default function SustainabilityUI() {
  return (
    <>
      <SustainabilityHero />
      <RegenerativeAgriculture />
      <ZeroPlasticMandate />
      <ClimateNeutralDelivery />
    </>
  );
}
