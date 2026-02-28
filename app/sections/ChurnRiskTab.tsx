'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RiAlertLine, RiShieldLine, RiErrorWarningLine } from 'react-icons/ri'

interface RiskGroup {
  group_name?: string
  risk_score?: string
  risk_level?: string
  churn_indicators?: string[]
  warning_signs?: string[]
  engagement_decline?: string
  recommended_action?: string
}

interface ChurnRiskTabProps {
  riskGroups: RiskGroup[]
  totalAtRisk: string
  averageRiskScore: string
  highestRiskSegment: string
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

function getRiskBadgeClasses(level?: string): string {
  const normalizedLevel = (level ?? '').toLowerCase()
  if (normalizedLevel === 'high') return 'bg-red-900/40 text-red-300 border-red-800/50'
  if (normalizedLevel === 'medium') return 'border-amber-800/50 text-amber-300 bg-amber-900/30'
  if (normalizedLevel === 'low') return 'bg-green-900/30 text-green-300 border-green-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getRiskIcon(level?: string) {
  const normalizedLevel = (level ?? '').toLowerCase()
  if (normalizedLevel === 'high') return <RiAlertLine className="h-5 w-5 text-red-400" />
  if (normalizedLevel === 'medium') return <RiErrorWarningLine className="h-5 w-5 text-amber-400" />
  return <RiShieldLine className="h-5 w-5 text-green-400" />
}

export default function ChurnRiskTab({
  riskGroups,
  totalAtRisk,
  averageRiskScore,
  highestRiskSegment,
  summary,
}: ChurnRiskTabProps) {
  const groups = Array.isArray(riskGroups) ? riskGroups : []

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {/* Summary stat blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total at Risk</p>
              <p className="text-2xl font-mono font-semibold text-foreground">{totalAtRisk || '--'}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg. Risk Score</p>
              <p className="text-2xl font-mono font-semibold text-foreground">{averageRiskScore || '--'}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Highest Risk</p>
              <p className="text-sm font-medium text-foreground mt-1">{highestRiskSegment || '--'}</p>
            </CardContent>
          </Card>
        </div>

        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiAlertLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <div className="text-sm text-foreground leading-relaxed">
                  {renderMarkdown(summary)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {groups.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <RiShieldLine className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No churn risk data available</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groups.map((group, idx) => (
            <Card key={idx} className="border-border bg-card hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(group?.risk_level)}
                    <CardTitle className="font-serif text-base font-semibold text-foreground">
                      {group?.group_name ?? 'Unnamed Group'}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={getRiskBadgeClasses(group?.risk_level)}>
                      {group?.risk_level ?? 'Unknown'}
                    </Badge>
                    {group?.risk_score && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {group.risk_score}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {group?.engagement_decline && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Engagement Decline</p>
                    <p className="text-sm text-foreground">{group.engagement_decline}</p>
                  </div>
                )}

                <Separator className="bg-border" />

                {Array.isArray(group?.churn_indicators) && group.churn_indicators.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Churn Indicators</p>
                    <ul className="space-y-1">
                      {group.churn_indicators.map((ind, iIdx) => (
                        <li key={iIdx} className="text-sm text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(group?.warning_signs) && group.warning_signs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Warning Signs</p>
                    <ul className="space-y-1">
                      {group.warning_signs.map((sign, sIdx) => (
                        <li key={sIdx} className="text-sm text-foreground flex items-start gap-2">
                          <RiErrorWarningLine className="h-3.5 w-3.5 mt-0.5 text-amber-400 flex-shrink-0" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {group?.recommended_action && (
                  <div className="space-y-1 p-3 rounded-md bg-secondary/50 border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recommended Action</p>
                    <p className="text-sm text-foreground">{group.recommended_action}</p>
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
