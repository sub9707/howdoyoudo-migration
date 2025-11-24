import React, { forwardRef } from "react";

const Logo = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg 
      ref={ref} 
      {...props} 
      viewBox="0 0 900 200" 
      fill="none"
    >
      <text
        x="450"
        y="130"
        fontSize="120"
        fontWeight="700"
        fontFamily="sans-serif"
        letterSpacing="-8"
        fill="#ffffff"
        textAnchor="middle"
      >
        HOWDOYOUDO
      </text>
    </svg>
  )
);

Logo.displayName = "Logo";

export default Logo;