'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  RiAlertLine,
  RiShieldLine,
  RiErrorWarningLine,
  RiMoneyDollarCircleLine,
  RiSpeedLine,
  RiRadarLine,
  RiTimeLine,
  RiPieChartLine,
  RiArrowUpLine,
} from 'react-icons/ri'

interface RiskGroup {
  group_name?: string
  risk_score?: string
  risk_level?: string
  churn_indicators?: string[]
  warning_signs?: string[]
  engagement_decline?: string
  recommended_action?: string
  revenue_impact?: string
  behavioral_velocity?: string
  contributing_factors?: string[]
}

interface RiskFactor {
  factor?: string
  impact?: string
  correlation?: string
}

interface RiskDistribution {
  dimension?: string
  breakdown?: string
}

interface EarlyWarning {
  signal?: string
  timeframe?: string
  reliability?: string
}

interface ChurnRiskTabProps {
  riskGroups: RiskGroup[]
  totalAtRisk: string
  averageRiskScore: string
  highestRiskSegment: string
  summary: string
  revenueAtRisk?: string
  riskFactors?: RiskFactor[]
  riskDistribution?: RiskDistribution[]
  earlyWarnings?: EarlyWarning[]
}

function getRiskBadgeClasses(level?: string): string {
  const l = (level ?? '').toLowerCase()
  if (l === 'critical' || l === 'high') return 'bg-red-900/40 text-red-300 border-red-800/50'
  if (l === 'medium') return 'border-amber-800/50 text-amber-300 bg-amber-900/30'
  if (l === 'low') return 'bg-green-900/30 text-green-300 border-green-800/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getRiskIcon(level?: string) {
  const l = (level ?? '').toLowerCase()
  if (l === 'critical' || l === 'high') return <RiAlertLine className="h-5 w-5 text-red-400" />
  if (l === 'medium') return <RiErrorWarningLine className="h-5 w-5 text-amber-400" />
  return <RiShieldLine className="h-5 w-5 text-green-400" />
}

function getReliabilityColor(r?: string): string {
  const v = (r ?? '').toLowerCase()
  if (v.includes('high') || v.includes('strong')) return 'text-green-400'
  if (v.includes('medium') || v.includes('moderate')) return 'text-amber-400'
  return 'text-muted-foreground'
}

export default function ChurnRiskTab({
  riskGroups,
  totalAtRisk,
  averageRiskScore,
  highestRiskSegment,
  summary,
  revenueAtRisk,
  riskFactors,
  riskDistribution,
  earlyWarnings,
}: ChurnRiskTabProps) {
  const groups = Array.isArray(riskGroups) ? riskGroups : []
  const factors = Array.isArray(riskFactors) ? riskFactors : []
  const distribution = Array.isArray(riskDistribution) ? riskDistribution : []
  const warnings = Array.isArray(earlyWarnings) ? earlyWarnings : []

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-4">
        {/* Summary Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total at Risk</p>
              <p className="text-xl font-mono font-semibold text-foreground">{totalAtRisk || '--'}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg. Risk Score</p>
              <p className="text-xl font-mono font-semibold text-foreground">{averageRiskScore || '--'}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Revenue at Risk</p>
              <p className="text-xl font-mono font-semibold text-red-400">{revenueAtRisk || '--'}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Highest Risk</p>
              <p className="text-sm font-medium text-foreground mt-1">{highestRiskSegment || '--'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        {summary && (
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RiAlertLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-sm text-foreground leading-relaxed">{summary}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Group Cards */}
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
                  <div className="flex items-center gap-2 min-w-0">
                    {getRiskIcon(group?.risk_level)}
                    <CardTitle className="font-serif text-base font-semibold text-foreground truncate">
                      {group?.group_name ?? 'Unnamed Group'}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
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
              <CardContent className="space-y-3 pt-0">
                {/* Multi-dimension metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {group?.engagement_decline && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiArrowUpLine className="h-3 w-3 rotate-180" /> Engagement Decline
                      </p>
                      <p className="text-xs text-foreground">{group.engagement_decline}</p>
                    </div>
                  )}
                  {group?.revenue_impact && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiMoneyDollarCircleLine className="h-3 w-3" /> Revenue Impact
                      </p>
                      <p className="text-xs text-red-400 font-medium">{group.revenue_impact}</p>
                    </div>
                  )}
                  {group?.behavioral_velocity && (
                    <div className="col-span-2 space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <RiSpeedLine className="h-3 w-3" /> Behavioral Velocity
                      </p>
                      <p className="text-xs text-foreground">{group.behavioral_velocity}</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-border" />

                {/* Churn Indicators */}
                {Array.isArray(group?.churn_indicators) && group.churn_indicators.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Churn Indicators</p>
                    <ul className="space-y-0.5">
                      {group.churn_indicators.map((ind, iIdx) => (
                        <li key={iIdx} className="text-xs text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-red-400 flex-shrink-0" />
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warning Signs */}
                {Array.isArray(group?.warning_signs) && group.warning_signs.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Warning Signs</p>
                    <ul className="space-y-0.5">
                      {group.warning_signs.map((sign, sIdx) => (
                        <li key={sIdx} className="text-xs text-foreground flex items-start gap-2">
                          <RiErrorWarningLine className="h-3 w-3 mt-0.5 text-amber-400 flex-shrink-0" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contributing Factors */}
                {Array.isArray(group?.contributing_factors) && group.contributing_factors.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contributing Factors</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.contributing_factors.map((f, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-border text-foreground">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                {group?.recommended_action && (
                  <div className="p-2.5 rounded-md bg-secondary/50 border border-border space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recommended Action</p>
                    <p className="text-xs text-foreground">{group.recommended_action}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Factors Analysis */}
        {factors.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiRadarLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Risk Factor Analysis ({factors.length} factors)
                </p>
              </div>
              <div className="space-y-2">
                {factors.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-md bg-secondary/30">
                    <span className="text-xs font-mono text-muted-foreground w-5 flex-shrink-0 mt-0.5">{idx + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{f.factor ?? 'Factor'}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">Impact: <span className="text-foreground">{f.impact ?? '--'}</span></span>
                        <span className="text-xs text-muted-foreground">Correlation: <span className="text-foreground">{f.correlation ?? '--'}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Distribution Across Dimensions */}
        {distribution.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiPieChartLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Risk Distribution by Dimension
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {distribution.map((d, idx) => (
                  <div key={idx} className="p-2 rounded-md bg-secondary/30">
                    <p className="text-xs font-medium text-foreground">{d.dimension ?? 'Dimension'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.breakdown ?? ''}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Early Warning Signals */}
        {warnings.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiTimeLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Early Warning Signals
                </p>
              </div>
              <div className="space-y-2">
                {warnings.map((w, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-2 rounded-md bg-secondary/30">
                    <div className="flex items-start gap-2 min-w-0">
                      <RiErrorWarningLine className="h-3.5 w-3.5 mt-0.5 text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-foreground">{w.signal ?? 'Signal'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {w.timeframe && (
                        <Badge variant="secondary" className="text-xs font-mono">{w.timeframe}</Badge>
                      )}
                      {w.reliability && (
                        <span className={`text-xs font-medium ${getReliabilityColor(w.reliability)}`}>
                          {w.reliability}
                        </span>
                      )}
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
