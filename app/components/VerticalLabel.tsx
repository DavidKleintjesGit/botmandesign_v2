export default function VerticalLabel() {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
      <div 
        className="text-white uppercase text-xs font-light"
        style={{ 
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '0.5em',
          writingMode: 'vertical-rl',
          textOrientation: 'upright'
        }}
      >
        <div className="opacity-80 mb-8">LUXURY</div>
        <div className="opacity-60 mb-8">INTERIOR</div>
        <div className="opacity-40">DESIGN</div>
      </div>
    </div>
  );
}

