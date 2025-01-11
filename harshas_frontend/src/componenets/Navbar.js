'use client'

import { useState } from 'react'

export default function Navbar() {
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">MEDSCAN</span>
            <span className="text-lg font-bold">
              ME<span className="text-red-600">D</span>SCAN
            </span>
          </a>
        </div>
      </nav>
    </header>
  )
}
