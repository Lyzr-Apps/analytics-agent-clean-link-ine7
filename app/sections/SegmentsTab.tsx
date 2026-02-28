'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  RiGroupLine,
  RiPulseLine,
  RiLineChartLine,
  RiCompass3Line,
  RiShoppingCartLine,
  RiUserHeartLine,
  RiStarLine,
  RiBarChartBoxLine,
  RiDatabaseLine,
} from 'react-icons/ri'

interface Segment {
  segment_name?: string
  size_estimate?: string
  behavioral_traits?: string[]
  demographic_profile?: string
  avg_clv_range?: string
  characteristics?: string[]
  description?: string
  engagement_score?: string
  channel_preferences?: string
  product_affinity?: string
  lifecycle_stage?: string
  key_differentiators?: string[]
}

interface DimensionAnalyzed {
  dimension?: string
  finding?: string
}

interface KeyMetric {
  metric_name?: string
  value?: string
  insight?: string
}

interface SegmentsTabProps {
  segments: Segment[]
  summary: string
  dimensionsAnalyzed?: DimensionAnalyzed[]
  keyMetrics?: KeyMetric[]
  crossSegmentComparison?: string
}

function getLifecycleColor(stage?: string): string {
  const s = (stage ?? '').toLowerCase()
  if (s.includes('active') || s.includes('loyal')) return 'bg-green-900/30 text-green-300 border-green-800/50'
  if (s.includes('new') || s.includes('onboard')) return 'bg-blue-900/30 text-blue-300 border-blue-800/50'
  if (s.includes('risk') || s.includes('declining')) return 'bg-red-900/30 text-red-300 border-red-800/50'
  if (s.includes('dormant') || s.includes('lapsed')) return 'bg-gray-700/40 text-gray-300 border-gray-600/50'
  return 'bg-amber-900/30 text-amber-300 border-amber-800/50'
}

export default function SegmentsTab({
  segments,
  summary,
  dimensionsAnalyzed,
  keyMetrics,
  crossSegmentComparison,
}: SegmentsTabProps) {
  const segmentList = Array.isArray(segments) ? segments : []
  const dims = Array.isArray(dimensionsAnalyzed) ? dimensionsAnalyzed : []
  const metrics = Array.isArray(keyMetrics) ? keyMetrics : []

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {/* Summary */}
        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiGroupLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-sm text-foreground leading-relaxed">{summary}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Row */}
        {metrics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RiBarChartBoxLine className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Metrics</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {metrics.map((m, idx) => (
                <Card key={idx} className="border-border bg-card">
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground truncate">{m.metric_name ?? 'Metric'}</p>
                    <p className="text-lg font-mono font-semibold text-foreground mt-0.5">{m.value ?? '--'}</p>
                    {m.insight && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.insight}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Segment Cards */}
        {segmentList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <RiGroupLine className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No segment data available</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {segmentList.map((seg, idx) => (
            <Card key={idx} className="border-border bg-card hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-serif text-base font-semibold text-foreground leading-tight">
                    {seg?.segment_name ?? 'Unnamed Segment'}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {seg?.lifecycle_stage && (
                      <Badge variant="outline" className={`text-xs ${getLifecycleColor(seg.lifecycle_stage)}`}>
                        {seg.lifecycle_stage}
                      </Badge>
                    )}
                    {seg?.size_estimate && (
                      <Badge variant="secondary" className="text-xs font-mono flex-shrink-0">
                        {seg.size_estimate}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {seg?.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{seg.description}</p>
                )}

                <Separator className="bg-border" />

                {/* Multi-dimension Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {seg?.demographic_profile && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiUserHeartLine className="h-3 w-3" /> Demographics
                      </p>
                      <p className="text-xs text-foreground">{seg.demographic_profile}</p>
                    </div>
                  )}
                  {seg?.avg_clv_range && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiLineChartLine className="h-3 w-3" /> CLV Range
                      </p>
                      <p className="text-xs font-mono text-foreground">{seg.avg_clv_range}</p>
                    </div>
                  )}
                  {seg?.engagement_score && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiPulseLine className="h-3 w-3" /> Engagement
                      </p>
                      <p className="text-xs text-foreground">{seg.engagement_score}</p>
                    </div>
                  )}
                  {seg?.channel_preferences && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiCompass3Line className="h-3 w-3" /> Channels
                      </p>
                      <p className="text-xs text-foreground">{seg.channel_preferences}</p>
                    </div>
                  )}
                  {seg?.product_affinity && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiShoppingCartLine className="h-3 w-3" /> Product Affinity
                      </p>
                      <p className="text-xs text-foreground">{seg.product_affinity}</p>
                    </div>
                  )}
                </div>

                {/* Behavioral Traits */}
                {Array.isArray(seg?.behavioral_traits) && seg.behavioral_traits.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Behavioral Traits</p>
                    <ul className="space-y-0.5">
                      {seg.behavioral_traits.map((trait, tIdx) => (
                        <li key={tIdx} className="text-xs text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(36, 60%, 31%)' }} />
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Differentiators */}
                {Array.isArray(seg?.key_differentiators) && seg.key_differentiators.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <RiStarLine className="h-3 w-3" /> Key Differentiators
                    </p>
                    <ul className="space-y-0.5">
                      {seg.key_differentiators.map((diff, dIdx) => (
                        <li key={dIdx} className="text-xs text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 flex-shrink-0" />
                          {diff}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Characteristics Badges */}
                {Array.isArray(seg?.characteristics) && seg.characteristics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {seg.characteristics.map((char, cIdx) => (
                      <Badge key={cIdx} variant="outline" className="text-xs border-border text-foreground">
                        {char}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cross-Segment Comparison */}
        {crossSegmentComparison && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiBarChartBoxLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cross-Segment Comparison</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{crossSegmentComparison}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dimensions Analyzed */}
        {dims.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiDatabaseLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Dimensions Analyzed ({dims.length})
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dims.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-secondary/30">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(36, 60%, 31%)' }} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{d.dimension ?? 'Dimension'}</p>
                      <p className="text-xs text-muted-foreground">{d.finding ?? ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}
