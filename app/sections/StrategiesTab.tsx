'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { RiLightbulbLine, RiArrowDownSLine, RiArrowUpSLine, RiCheckLine, RiRocketLine } from 'react-icons/ri'

interface Strategy {
  strategy_type?: string
  target_segment?: string
  risk_level?: string
  action_steps?: string[]
  expected_impact?: string
  detailed_tactics?: string
  priority?: string
}

interface StrategiesTabProps {
  strategies: Strategy[]
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

function getTypeBadgeColor(type?: string): string {
  const t = (type ?? '').toLowerCase()
  if (t.includes('proactive')) return 'bg-blue-900/30 text-blue-300 border-blue-800/50'
  if (t.includes('win-back') || t.includes('win back')) return 'bg-purple-900/30 text-purple-300 border-purple-800/50'
  if (t.includes('early warning') || t.includes('warning')) return 'bg-amber-900/30 text-amber-300 border-amber-800/50'
  if (t.includes('benchmark')) return 'bg-teal-900/30 text-teal-300 border-teal-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getPriorityBadgeColor(priority?: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high') return 'bg-red-900/30 text-red-300 border-red-800/50'
  if (p === 'medium') return 'border-amber-800/50 text-amber-300 bg-amber-900/30'
  if (p === 'low') return 'bg-green-900/30 text-green-300 border-green-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

export default function StrategiesTab({ strategies, summary }: StrategiesTabProps) {
  const strategyList = Array.isArray(strategies) ? strategies : []
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})

  const toggleExpanded = (idx: number) => {
    setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiLightbulbLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div className="text-sm text-foreground leading-relaxed">
                  {renderMarkdown(summary)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {strat?.priority && (
                      <Badge variant="outline" className={getPriorityBadgeColor(strat.priority)}>
                        {strat.priority} Priority
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
              <CardContent className="space-y-4 pt-0">
                {strat?.target_segment && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Segment</p>
                    <p className="text-sm text-foreground">{strat.target_segment}</p>
                  </div>
                )}

                {strat?.expected_impact && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expected Impact</p>
                    <p className="text-sm text-foreground">{strat.expected_impact}</p>
                  </div>
                )}

                <Separator className="bg-border" />

                {Array.isArray(strat?.action_steps) && strat.action_steps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Action Steps</p>
                    <ul className="space-y-1.5">
                      {strat.action_steps.map((step, sIdx) => (
                        <li key={sIdx} className="text-sm text-foreground flex items-start gap-2">
                          <RiCheckLine className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {strat?.detailed_tactics && (
                  <Collapsible open={!!expandedCards[idx]} onOpenChange={() => toggleExpanded(idx)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground">
                        <span className="text-xs uppercase tracking-wider font-medium">Detailed Tactics</span>
                        {expandedCards[idx] ? (
                          <RiArrowUpSLine className="h-4 w-4" />
                        ) : (
                          <RiArrowDownSLine className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3 rounded-md bg-secondary/50 border border-border mt-2">
                        <div className="text-sm text-foreground leading-relaxed">
                          {renderMarkdown(strat.detailed_tactics)}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
