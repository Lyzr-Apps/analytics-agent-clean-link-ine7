'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  RiLightbulbLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckLine,
  RiRocketLine,
  RiTimeLine,
  RiLineChartLine,
  RiCompass3Line,
  RiUserHeartLine,
  RiMoneyDollarCircleLine,
  RiFlashlightLine,
  RiRoadMapLine,
} from 'react-icons/ri'

interface Strategy {
  strategy_type?: string
  target_segment?: string
  risk_level?: string
  action_steps?: string[]
  expected_impact?: string
  detailed_tactics?: string
  priority?: string
  timeline?: string
  success_metrics?: string
  channel_recommendations?: string
  personalization_approach?: string
  roi_projection?: string
}

interface QuickWin {
  action?: string
  target?: string
  expected_result?: string
  effort?: string
}

interface StrategiesTabProps {
  strategies: Strategy[]
  summary: string
  strategyMatrix?: string
  prioritizedRoadmap?: string
  quickWins?: QuickWin[]
}

function getTypeBadgeColor(type?: string): string {
  const t = (type ?? '').toLowerCase()
  if (t.includes('proactive')) return 'bg-blue-900/30 text-blue-300 border-blue-800/50'
  if (t.includes('win-back') || t.includes('win back')) return 'bg-purple-900/30 text-purple-300 border-purple-800/50'
  if (t.includes('early warning') || t.includes('warning')) return 'bg-amber-900/30 text-amber-300 border-amber-800/50'
  if (t.includes('benchmark')) return 'bg-teal-900/30 text-teal-300 border-teal-800/50'
  if (t.includes('loyalty')) return 'bg-green-900/30 text-green-300 border-green-800/50'
  if (t.includes('cross-sell') || t.includes('cross sell')) return 'bg-indigo-900/30 text-indigo-300 border-indigo-800/50'
  if (t.includes('re-engage') || t.includes('re engage')) return 'bg-pink-900/30 text-pink-300 border-pink-800/50'
  if (t.includes('lifecycle')) return 'bg-cyan-900/30 text-cyan-300 border-cyan-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getPriorityBadgeColor(priority?: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high' || p === 'critical') return 'bg-red-900/30 text-red-300 border-red-800/50'
  if (p === 'medium') return 'border-amber-800/50 text-amber-300 bg-amber-900/30'
  if (p === 'low') return 'bg-green-900/30 text-green-300 border-green-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getEffortColor(e?: string): string {
  const v = (e ?? '').toLowerCase()
  if (v.includes('low') || v.includes('minimal')) return 'text-green-400'
  if (v.includes('medium') || v.includes('moderate')) return 'text-amber-400'
  return 'text-red-400'
}

export default function StrategiesTab({
  strategies,
  summary,
  strategyMatrix,
  prioritizedRoadmap,
  quickWins,
}: StrategiesTabProps) {
  const strategyList = Array.isArray(strategies) ? strategies : []
  const wins = Array.isArray(quickWins) ? quickWins : []
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})

  const toggleExpanded = (idx: number) => {
    setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {/* Summary */}
        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiLightbulbLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-sm text-foreground leading-relaxed">{summary}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Wins */}
        {wins.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiFlashlightLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quick Wins -- Immediate Impact
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {wins.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-secondary/30 border border-border space-y-1.5">
                    <p className="text-xs font-medium text-foreground">{w.action ?? 'Action'}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {w.target && <span className="text-xs text-muted-foreground">Target: <span className="text-foreground">{w.target}</span></span>}
                      {w.effort && (
                        <Badge variant="outline" className="text-xs border-border">
                          <span className={getEffortColor(w.effort)}>{w.effort}</span>
                        </Badge>
                      )}
                    </div>
                    {w.expected_result && <p className="text-xs text-muted-foreground">{w.expected_result}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategy Cards */}
        {strategyList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <RiRocketLine className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No retention strategies available</p>
          </div>
        )}

        <div className="space-y-4">
          {strategyList.map((strat, idx) => (
            <Card key={idx} className="border-border bg-card hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <RiRocketLine className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                    <CardTitle className="font-serif text-base font-semibold text-foreground">
                      {strat?.strategy_type ?? 'Strategy'}
                    </CardTitle>
                    {strat?.strategy_type && (
                      <Badge variant="outline" className={getTypeBadgeColor(strat.strategy_type)}>
                        {strat.strategy_type}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {strat?.priority && (
                      <Badge variant="outline" className={getPriorityBadgeColor(strat.priority)}>
                        {strat.priority}
                      </Badge>
                    )}
                    {strat?.risk_level && (
                      <Badge variant="secondary" className="text-xs">
                        {strat.risk_level} Risk
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {strat?.target_segment && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiUserHeartLine className="h-3 w-3" /> Target
                      </p>
                      <p className="text-xs text-foreground">{strat.target_segment}</p>
                    </div>
                  )}
                  {strat?.timeline && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiTimeLine className="h-3 w-3" /> Timeline
                      </p>
                      <p className="text-xs text-foreground">{strat.timeline}</p>
                    </div>
                  )}
                  {strat?.expected_impact && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiLineChartLine className="h-3 w-3" /> Expected Impact
                      </p>
                      <p className="text-xs text-foreground">{strat.expected_impact}</p>
                    </div>
                  )}
                  {strat?.roi_projection && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiMoneyDollarCircleLine className="h-3 w-3" /> ROI Projection
                      </p>
                      <p className="text-xs text-foreground">{strat.roi_projection}</p>
                    </div>
                  )}
                  {strat?.channel_recommendations && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiCompass3Line className="h-3 w-3" /> Channels
                      </p>
                      <p className="text-xs text-foreground">{strat.channel_recommendations}</p>
                    </div>
                  )}
                  {strat?.success_metrics && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiCheckLine className="h-3 w-3" /> Success Metrics
                      </p>
                      <p className="text-xs text-foreground">{strat.success_metrics}</p>
                    </div>
                  )}
                </div>

                {/* Personalization */}
                {strat?.personalization_approach && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Personalization Approach</p>
                    <p className="text-xs text-foreground">{strat.personalization_approach}</p>
                  </div>
                )}

                <Separator className="bg-border" />

                {/* Action Steps */}
                {Array.isArray(strat?.action_steps) && strat.action_steps.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Action Steps</p>
                    <ul className="space-y-1">
                      {strat.action_steps.map((step, sIdx) => (
                        <li key={sIdx} className="text-xs text-foreground flex items-start gap-2">
                          <RiCheckLine className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Tactics (Collapsible) */}
                {strat?.detailed_tactics && (
                  <Collapsible open={!!expandedCards[idx]} onOpenChange={() => toggleExpanded(idx)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground">
                        <span className="text-xs uppercase tracking-wider font-medium">Detailed Tactics</span>
                        {expandedCards[idx] ? <RiArrowUpSLine className="h-4 w-4" /> : <RiArrowDownSLine className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3 rounded-md bg-secondary/50 border border-border mt-2">
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{strat.detailed_tactics}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Strategy Matrix */}
        {strategyMatrix && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiRoadMapLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Strategy Coverage Matrix</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{strategyMatrix}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prioritized Roadmap */}
        {prioritizedRoadmap && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiTimeLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Prioritized Implementation Roadmap</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{prioritizedRoadmap}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}
