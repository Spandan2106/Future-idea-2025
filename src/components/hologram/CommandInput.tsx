import { useState, KeyboardEvent } from 'react';
import { Terminal } from 'lucide-react';

interface CommandInputProps {
  onCommand: (command: string) => void;
}

export const CommandInput = ({ onCommand }: CommandInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onCommand(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="relative">
        <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="TYPE COMMAND AND PRESS ENTER..."
          className="w-full bg-card/80 backdrop-blur-md border border-primary/30 rounded-lg py-3 pl-12 pr-4 
                     text-primary text-sm font-orbitron tracking-[0.15em] uppercase text-center
                     placeholder:text-muted-foreground/50 placeholder:text-xs
                     focus:outline-none focus:border-primary focus:box-glow-intense
                     transition-all duration-300"
        />
      </div>
    </div>
  );
};
