import Image from 'next/image';

interface BookShelfLogoProps {
  width?: number;
  height?: number;
  className?: string;
  color?: 'default' | 'white';
}

export const BookShelfLogo: React.FC<BookShelfLogoProps> = ({ 
  width = 140, 
  height = 30, 
  className = "",
  color = 'default'
}) => {
  const logoSrc = color === 'white' ? '/logo_bookshelf-2.svg' : '/logo_bookshelf.svg';
  
  return (
    <Image
      src={logoSrc}
      alt="BookShelf"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};