
import Wrapper from '@/layout/Wrapper';
import { TCmnLayoutProps } from '@/types/commonAll.types';
import React from 'react';

const CmsLayout: React.FC<TCmnLayoutProps> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default CmsLayout;
