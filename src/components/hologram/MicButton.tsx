import { Mic } from 'lucide-react';

interface MicButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export const MicButton = ({ isActive, onClick }: MicButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-full 
                  border-2 flex items-center justify-center transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? 'border-primary bg-primary/20 animate-pulse-glow' 
                    : 'border-muted-foreground/50 bg-card/50 hover:border-primary/50 hover:bg-primary/10'
                  }`}
    >
      <Mic 
        size={24} 
        className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
      />
    </button>
  );
};
