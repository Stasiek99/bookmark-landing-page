import './BlueShape.scss';

interface BlueShapeProps {
  side: 'left' | 'right';
  className?: string;
}

export const BlueShape = ({ side, className = '' }: BlueShapeProps) => (
  <div className={`blue-shape blue-shape--${side} ${className}`} aria-hidden="true" />
);
