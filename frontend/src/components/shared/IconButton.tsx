import React from 'react';

interface IconButtonProps {
  iconSrc: string;
  onClick?: () => void;
  altText?: string;
  borderColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc, onClick, altText, borderColor}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2"
      style={{'borderColor': `${borderColor}`}}
    >
      <img src={iconSrc} alt={altText || 'icon'} className="w-6 h-6" />
    </button>
  );
};

export default IconButton;
