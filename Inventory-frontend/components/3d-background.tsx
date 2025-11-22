"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"

const Scene = dynamic(() => import("./3d-scene"), {
  ssr: false,
  // show a very-light placeholder while the heavy bundle loads
  loading: () => <Placeholder />,
})

function Placeholder() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#041025] to-[#02040a]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-10 h-10 text-white opacity-20 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.8" />
        </svg>
      </div>
    </div>
  )
}

export default function Background3D() {
  // start prefetching the scene bundle immediately
  useEffect(() => {
    import("./3d-scene")
  }, [])

  return <Scene />
}