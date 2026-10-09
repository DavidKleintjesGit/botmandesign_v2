export default function BasBotmanQuoteSection() {
  return (
    <section
      className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-6"
      style={{
        backgroundColor: "var(--color-cedar)",
        minHeight: "100vh",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center px-12 md:px-20 lg:px-28">
        <p
          className="text-sm md:text-base leading-relaxed uppercase"
          style={{
            color: "var(--color-champagne)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          COMING SOON
        </p>
        <h1 className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-center gap-x-3 md:gap-x-4 uppercase tracking-wider">
          <span
            className="text-3xl md:text-5xl lg:text-6xl font-light"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              letterSpacing: "0.04em",
              color: "var(--color-champagne)",
            }}
          >
            August
          </span>
          <span
            className="text-[1.65rem] md:text-[2.2rem] lg:text-[2.85rem] font-medium leading-none"
            style={{
              fontFamily: "var(--font-montserrat)",
              letterSpacing: "0.08em",
              color: "var(--color-champagne)",
            }}
          >
            2026
          </span>
        </h1>
      </div>
    </section>
  );
}
