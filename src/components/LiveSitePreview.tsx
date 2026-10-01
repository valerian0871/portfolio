import { useState } from 'react'

interface LiveSitePreviewProps {
  src: string
  alt: string
  url?: string
  title: string
  onOpenLightbox?: () => void
}

export function LiveSitePreview({
  src,
  alt,
  url,
  title,
  onOpenLightbox,
}: LiveSitePreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Extract clean domain for browser address bar (e.g. cakesnpastries.com.ng)
  const cleanDomain = url
    ? url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'live-preview.local'

  return (
    <div
      className="group/preview relative w-full rounded-[6px] overflow-hidden border border-[#E2E1DB] bg-[#FAFAF8] transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Browser Window Header Chrome */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#F0EFEA] border-b border-[#E2E1DB] select-none text-[11px]">
        {/* macOS style traffic dots */}
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/70 inline-block" />
        </div>

        {/* Address bar pill */}
        <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAFAF8] border border-[#E2E1DB] text-[#6B6A65] font-mono text-[10.5px] max-w-[210px] md:max-w-[280px] truncate shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          <svg
            className="w-3 h-3 text-[#6B6A65] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate">{cleanDomain}</span>
        </div>

        {/* Live Simulation Pulse Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#6B6A65] hidden sm:inline font-medium">
            Live
          </span>
        </div>
      </div>

      {/* Browser Viewport with Animated Live Screenshot */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F0EFEA] cursor-pointer">
        {/* Placeholder skeleton before decode */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#F0EFEA] animate-pulse" />
        )}

        {/* 
          Live animated scrolling wrapper:
          Simulates continuous browsing down the page and back up.
          Scales screenshot slightly so details are crisp and full width is preserved uncropped.
        */}
        <div
          className={`relative w-full live-site-scroll ${
            isHovered ? 'live-site-scroll-fast' : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-auto object-contain block select-none pointer-events-none transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Simulated Live User Cursor (creates the authentic GIF screen-recording effect) */}
        <div
          className="live-cursor-track absolute inset-0 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          <div className="live-cursor">
            {/* SVG Crisp Arrow Pointer */}
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            >
              <path
                d="M1 1L7 20L10.5 12.5L17 10L1 1Z"
                fill="#111111"
                stroke="#FAFAF8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {/* Click Ripple Indicator */}
            <span className="live-cursor-ripple" />
          </div>
        </div>

        {/* Live interaction overlay badge & external link */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-2 opacity-90 group-hover/preview:opacity-100 transition-opacity">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-pill-secondary btn-press inline-flex items-center gap-1.5 rounded-full bg-[#FAFAF8]/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#111111] border border-[#E2E1DB] hover:border-[#111111] shadow-xs transition-all"
              title={`Open ${title} in new tab`}
            >
              <span>Visit site</span>
              <span className="text-[12px]">↗</span>
            </a>
          )}
          {onOpenLightbox && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenLightbox()
              }}
              className="btn-press inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FAFAF8]/95 backdrop-blur-sm text-[#111111] border border-[#E2E1DB] hover:border-[#111111] text-[12px] shadow-xs cursor-pointer"
              title="Expand screenshot"
              aria-label={`Expand full image for ${title}`}
            >
              ⤢
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
