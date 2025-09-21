'use client'

import { Ticket } from '@/shared/components/Ticket'

export default function TestPage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Ticket Component Showcase
        </h1>

        {/* All variants showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center">
            <Ticket variant="bronze" size="md" />
            <p className="text-white mt-2 text-sm">Bronze</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="silver" size="md" />
            <p className="text-white mt-2 text-sm">Silver</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="gold" size="md" />
            <p className="text-white mt-2 text-sm">Gold</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="diamond" size="md" />
            <p className="text-white mt-2 text-sm">Diamond</p>
          </div>
        </div>

        {/* Size variations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Size Variations
          </h2>
          <div className="flex justify-center items-end gap-6">
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="sm" price={100} quality={1.5} />
              <p className="text-white mt-2 text-sm">Small</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="md" price={300} quality={3.2} />
              <p className="text-white mt-2 text-sm">Medium</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="lg" price={500} quality={5.0} />
              <p className="text-white mt-2 text-sm">Large</p>
            </div>
          </div>
        </div>

        {/* Custom examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Custom Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Ticket
                variant="diamond"
                size="lg"
                price={1000}
                quality={9.9}
                showCarrot={false}
              />
              <p className="text-white mt-2 text-sm">
                Premium Diamond (No Carrot)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="bronze" size="md" price={50} quality={0.8} />
              <p className="text-white mt-2 text-sm">Basic Bronze</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="silver" size="lg" price={750} quality={7.5} />
              <p className="text-white mt-2 text-sm">High Value Silver</p>
            </div>
          </div>
        </div>

        {/* Interactive demo */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Interactive Demo
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Hover over the tickets to see the interactive effects
          </p>
          <div className="flex justify-center">
            <Ticket
              variant="gold"
              size="lg"
              price={999}
              quality={9.99}
              className="hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
