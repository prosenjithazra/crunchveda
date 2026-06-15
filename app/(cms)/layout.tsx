
import Wrapper from '@/layout/Wrapper';
import { TCmnLayoutProps } from '@/types/commonAll.types';
import React from 'react';
import CmsLoader from '@/components/Loader/CmsLoader';

const CmsLayout: React.FC<TCmnLayoutProps> = ({ children }) => {
  return (
    <Wrapper>
      <CmsLoader />
      {children}
    </Wrapper>
  );
};

export default CmsLayout;
