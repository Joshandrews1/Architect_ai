'use client';

import { icons, LucideProps } from 'lucide-react';
import type { FC } from 'react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const DynamicIcon: FC<DynamicIconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    // Return a default icon or null if the icon name is invalid
    return null; 
  }

  return <LucideIcon {...props} />;
};

export default DynamicIcon;
