interface TranscriptDisplayProps {
  transcript: string;
}

export const TranscriptDisplay = ({ transcript }: TranscriptDisplayProps) => {
  if (!transcript) return null;

  return (
    <div className="absolute bottom-44 left-0 right-0 z-20 pointer-events-none">
      <p className="text-center text-2xl font-bold text-foreground text-glow tracking-[0.15em] uppercase animate-pulse">
        {transcript}
      </p>
    </div>
  );
};
