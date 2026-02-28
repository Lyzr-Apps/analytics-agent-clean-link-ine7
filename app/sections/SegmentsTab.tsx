'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RiGroupLine, RiUserLine } from 'react-icons/ri'

interface Segment {
  segment_name?: string
  size_estimate?: string
  behavioral_traits?: string[]
  demographic_profile?: string
  avg_clv_range?: string
  characteristics?: string[]
  description?: string
}

interface SegmentsTabProps {
  segments: Segment[]
  summary: string
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

export default function SegmentsTab({ segments, summary }: SegmentsTabProps) {
  const segmentList = Array.isArray(segments) ? segments : []

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiGroupLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div className="text-sm text-foreground leading-relaxed">
                  {renderMarkdown(summary)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {segmentList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <RiGroupLine className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No segment data available</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {segmentList.map((seg, idx) => (
            <Card key={idx} className="border-border bg-card hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-serif text-base font-semibold text-foreground leading-tight">
                    {seg?.segment_name ?? 'Unnamed Segment'}
                  </CardTitle>
                  {seg?.size_estimate && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0 font-mono">
                      {seg.size_estimate}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {seg?.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {seg.description}
                  </p>
                )}

                <Separator className="bg-border" />

                {seg?.demographic_profile && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Demographics</p>
                    <p className="text-sm text-foreground">{seg.demographic_profile}</p>
                  </div>
                )}

                {seg?.avg_clv_range && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg. CLV Range</p>
                    <p className="text-sm font-mono text-foreground">{seg.avg_clv_range}</p>
                  </div>
                )}

                {Array.isArray(seg?.behavioral_traits) && seg.behavioral_traits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Behavioral Traits</p>
                    <ul className="space-y-1">
                      {seg.behavioral_traits.map((trait, tIdx) => (
                        <li key={tIdx} className="text-sm text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(36, 60%, 31%)' }} />
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(seg?.characteristics) && seg.characteristics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Characteristics</p>
                    <div className="flex flex-wrap gap-1.5">
                      {seg.characteristics.map((char, cIdx) => (
                        <Badge key={cIdx} variant="outline" className="text-xs border-border text-foreground">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
