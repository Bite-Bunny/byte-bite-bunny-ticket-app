'use client'

import { Ticket } from '@/shared/components/Ticket'
import { useRawInitData } from '@telegram-apps/sdk-react'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { useRouter } from 'next/navigation'
import { Home, Copy, Check } from 'lucide-react'
import { useMemo, useState } from 'react'

interface TokenField {
  key: string
  value: string
  isJson: boolean
  jsonValue?: unknown
}

export default function TestPage() {
  const authToken = useRawInitData()
  const router = useRouter()
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set())

  // Helper function to check if a string is valid JSON
  const tryParseJson = (str: string): { isJson: boolean; parsed?: unknown } => {
    try {
      const parsed = JSON.parse(str)
      return { isJson: true, parsed }
    } catch {
      return { isJson: false }
    }
  }

  // Parse token into key-value pairs
  const tokenFields = useMemo((): TokenField[] => {
    if (!authToken) return []

    try {
      const params = new URLSearchParams(authToken)
      const fields: TokenField[] = []

      params.forEach((value, key) => {
        // Try to decode URL-encoded value first
        let decodedValue = value
        try {
          decodedValue = decodeURIComponent(value)
        } catch {
          // If decoding fails, use original value
          decodedValue = value
        }

        // Check if the decoded value is JSON
        const jsonCheck = tryParseJson(decodedValue)

        fields.push({
          key,
          value: decodedValue,
          isJson: jsonCheck.isJson,
          jsonValue: jsonCheck.parsed,
        })
      })

      return fields
    } catch (error) {
      // If parsing fails, return the raw token as a single field
      return [{ key: 'raw', value: authToken, isJson: false }]
    }
  }, [authToken])

  const handleCopyToken = () => {
    if (authToken) {
      navigator.clipboard.writeText(authToken)
    }
  }

  const handleCopyField = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedFields((prev) => new Set(prev).add(key))
    setTimeout(() => {
      setCopiedFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }, 2000)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            onClick={handleGoHome}
            className="px-4 py-2 text-sm flex items-center gap-2"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Button>
        </div>

        {/* Authorization Token Section */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold text-white/90 mb-4">
            Authorization Token
          </h2>
          <div className="space-y-4">
            {authToken ? (
              <>
                {/* Individual Token Fields */}
                <div className="space-y-3">
                  {tokenFields.map((field) => {
                    const isCopied = copiedFields.has(field.key)
                    return (
                      <Card key={field.key} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                              {field.key}
                            </div>
                            {field.isJson ? (
                              <Card className="p-3 bg-white/5">
                                <pre className="text-xs text-white/90 whitespace-pre-wrap break-all overflow-auto max-h-60 scrollbar-none">
                                  {JSON.stringify(field.jsonValue, null, 2)}
                                </pre>
                              </Card>
                            ) : (
                              <div className="text-sm text-white/90 break-all">
                                {field.value}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => {
                              const valueToCopy = field.isJson
                                ? JSON.stringify(field.jsonValue, null, 2)
                                : field.value
                              handleCopyField(field.key, valueToCopy)
                            }}
                            className="px-3 py-2 text-xs flex-shrink-0 flex items-center gap-1.5 min-w-[80px] justify-center"
                          >
                            {isCopied ? (
                              <>
                                <Check size={14} />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {/* Copy Full Token Button */}
                <Button
                  onClick={handleCopyToken}
                  className="w-full px-4 py-2 text-sm flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  <span>Copy Full Token</span>
                </Button>

                {/* Raw Token Display (Collapsible) */}
                <details className="mt-4">
                  <summary className="text-sm text-white/70 cursor-pointer hover:text-white/90 transition-colors mb-2">
                    Show Raw Token
                  </summary>
                  <Card className="p-4 mt-2">
                    <pre className="text-xs text-white/80 whitespace-pre-wrap break-all overflow-auto max-h-40 scrollbar-none">
                      {authToken}
                    </pre>
                  </Card>
                </details>
              </>
            ) : (
              <div className="text-white/70 text-sm">No token available</div>
            )}
            <p className="text-sm text-white/70">
              This is the Telegram init data used for authorization in API
              requests. You can copy individual fields or the entire token.
            </p>
          </div>
        </Card>

        <h1 className="text-3xl font-bold text-white/90 mb-8 text-center">
          Ticket Component Showcase
        </h1>

        {/* All variants showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center">
            <Ticket variant="bronze" size="md" />
            <p className="text-white/90 mt-2 text-sm">Bronze</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="silver" size="md" />
            <p className="text-white/90 mt-2 text-sm">Silver</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="gold" size="md" />
            <p className="text-white/90 mt-2 text-sm">Gold</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket variant="diamond" size="md" />
            <p className="text-white/90 mt-2 text-sm">Diamond</p>
          </div>
        </div>

        {/* Size variations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white/90 mb-6 text-center">
            Size Variations
          </h2>
          <div className="flex justify-center items-end gap-6">
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="sm" price={100} quality={1.5} />
              <p className="text-white/90 mt-2 text-sm">Small</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="md" price={300} quality={3.2} />
              <p className="text-white/90 mt-2 text-sm">Medium</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="gold" size="lg" price={500} quality={5.0} />
              <p className="text-white/90 mt-2 text-sm">Large</p>
            </div>
          </div>
        </div>

        {/* Custom examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white/90 mb-6 text-center">
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
              <p className="text-white/90 mt-2 text-sm">
                Premium Diamond (No Carrot)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="bronze" size="md" price={50} quality={0.8} />
              <p className="text-white/90 mt-2 text-sm">Basic Bronze</p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket variant="silver" size="lg" price={750} quality={7.5} />
              <p className="text-white/90 mt-2 text-sm">High Value Silver</p>
            </div>
          </div>
        </div>

        {/* Interactive demo */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white/90 mb-4 text-center">
            Interactive Demo
          </h2>
          <p className="text-white/70 text-center mb-6">
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
