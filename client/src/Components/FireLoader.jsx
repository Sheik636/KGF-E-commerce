const FireLoader = ({ size = "md", text, fullScreen = false }) => {
  const sizes = {
    sm: "fire-loader--sm",
    md: "fire-loader--md",
    lg: "fire-loader--lg",
  };

  const content = (
    <div className={`fire-loader ${sizes[size] || sizes.md}`}>
      <div className="fire-loader__ring">
        <div className="fire-loader__core" />
        <div className="fire-loader__spark fire-loader__spark--1" />
        <div className="fire-loader__spark fire-loader__spark--2" />
        <div className="fire-loader__spark fire-loader__spark--3" />
      </div>
      {text && <p className="fire-loader__text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fire-loader-screen">
        <div className="fire-loader-screen__glow" />
        {content}
      </div>
    );
  }

  return content;
};

export const FireSkeleton = ({ className = "", style }) => (
  <div className={`fire-skeleton ${className}`} style={style}>
    <div className="fire-skeleton__shimmer" />
    <div className="fire-skeleton__ember" />
  </div>
);

export const FireSkeletonGrid = ({ count = 8, className = "h-96" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <FireSkeleton
        key={i}
        className={className}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

export default FireLoader;
