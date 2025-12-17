import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CommandPanelProps {
  onCommand: (command: string) => void;
}

export const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shapes: true,
    physics: false,
    modes: false,
    rotation: false,
    camera: false,
    particles: false,
    colors: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const commands = {
    shapes: [
      { label: 'DNA', cmd: 'dna' },
      { label: 'Saturn', cmd: 'saturn' },
      { label: 'Cube', cmd: 'cube' },
      { label: 'Sphere', cmd: 'sphere' },
      { label: 'Heart', cmd: 'heart' },
      { label: 'Galaxy', cmd: 'galaxy' },
      { label: 'Pyramid', cmd: 'pyramid' },
      { label: 'Flower', cmd: 'flower' },
      { label: 'Tree', cmd: 'tree' },
      { label: 'Cyclone', cmd: 'cyclone' },
      { label: 'Cycloid', cmd: 'cycloid' },
      { label: 'Blackhole', cmd: 'blackhole' },
    ],
    physics: [
      { label: 'Explode', cmd: 'explode' },
      { label: 'Assemble', cmd: 'assemble' },
      { label: 'Reset', cmd: 'reset' },
      { label: 'Compress', cmd: 'compress' },
      { label: 'Attract', cmd: 'attract' },
      { label: 'Repel', cmd: 'repel' },
      { label: 'Stop Physics', cmd: 'stop attract' },
      { label: 'Vortex', cmd: 'vortex' },
      { label: 'Stop Vortex', cmd: 'stop vortex' },
    ],
    modes: [
      { label: 'Showcase', cmd: 'showcase' },
      { label: 'Stop Showcase', cmd: 'stop showcase' },
      { label: 'Toggle Gestures', cmd: 'toggle gesture' },
      { label: '⛔ Exit', cmd: 'exit' },
    ],
    rotation: [
      { label: 'Rotate Vertical', cmd: 'rotate vertical' },
      { label: 'Rotate Horizontal', cmd: 'rotate horizontal' },
      { label: 'Rotate 90°', cmd: 'rotate 90' },
      { label: 'Rotate 45°', cmd: 'rotate 45' },
      { label: 'Spin Fast', cmd: 'spin fast' },
      { label: 'Spin Slow', cmd: 'spin slow' },
      { label: 'Stop Spin', cmd: 'stop' },
    ],
    camera: [
      { label: 'Orbit Camera', cmd: 'orbit camera' },
      { label: 'Stop Orbit', cmd: 'stop orbit' },
      { label: 'Zoom In', cmd: 'zoom in' },
      { label: 'Zoom Out', cmd: 'zoom out' },
      { label: 'Reset Camera', cmd: 'reset camera' },
    ],
    particles: [
      { label: 'Size Small', cmd: 'size small' },
      { label: 'Size Medium', cmd: 'size medium' },
      { label: 'Size Large', cmd: 'size large' },
    ],
    colors: [
      { label: 'Space', cmd: 'space' },
      { label: 'Neon', cmd: 'neon' },
      { label: 'Gold', cmd: 'gold' },
      { label: 'Red', cmd: 'red' },
      { label: 'Green', cmd: 'green' },
      { label: 'Blue', cmd: 'blue' },
      { label: 'Violet', cmd: 'violet' },
      { label: 'Magenta', cmd: 'magenta' },
      { label: 'Random Shape', cmd: 'random shape' },
      { label: 'Random Color', cmd: 'random color' },
    ],
  };

  return (
    <div className="absolute top-4 right-4 z-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="hud-panel max-w-[240px] max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        {Object.entries(commands).map(([section, items]) => (
          <div key={section} className="mb-2">
            <button
              onClick={() => toggleSection(section)}
              className="flex items-center justify-between w-full text-xs font-bold tracking-[0.15em] text-primary uppercase mb-2 hover:text-primary/80 transition-colors"
            >
              <span>-- {section.toUpperCase()} --</span>
              {expandedSections[section] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {expandedSections[section] && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {items.map(({ label, cmd }) => (
                  <button
                    key={cmd}
                    onClick={() => onCommand(cmd)}
                    className="px-2 py-1 text-[10px] font-rajdhani text-muted-foreground border border-primary/20 rounded hover:border-primary/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
