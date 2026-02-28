'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  RiBarChartLine,
  RiDashboardLine,
  RiRefreshLine,
  RiLoader4Line,
  RiGroupLine,
  RiAlertLine,
  RiLightbulbLine,
  RiSparklingLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from 'react-icons/ri'

import InputSection from './sections/InputSection'
import SegmentsTab from './sections/SegmentsTab'
import ChurnRiskTab from './sections/ChurnRiskTab'
import StrategiesTab from './sections/StrategiesTab'

const AGENT_ID = '69a27b508e6d0e51fd5cd391'

interface Segment {
  segment_name?: string
  size_estimate?: string
  behavioral_traits?: string[]
  demographic_profile?: string
  avg_clv_range?: string
  characteristics?: string[]
  description?: string
}

interface RiskGroup {
  group_name?: string
  risk_score?: string
  risk_level?: string
  churn_indicators?: string[]
  warning_signs?: string[]
  engagement_decline?: string
  recommended_action?: string
}

interface Strategy {
  strategy_type?: string
  target_segment?: string
  risk_level?: string
  action_steps?: string[]
  expected_impact?: string
  detailed_tactics?: string
  priority?: string
}

interface ManagerResponse {
  segmentation?: {
    segments?: Segment[]
    summary?: string
  }
  churn_risk?: {
    risk_groups?: RiskGroup[]
    total_at_risk?: string
    average_risk_score?: string
    highest_risk_segment?: string
    summary?: string
  }
  retention_strategies?: {
    strategies?: Strategy[]
    summary?: string
  }
  executive_summary?: string
}

const SAMPLE_DATA: ManagerResponse = {
  segmentation: {
    segments: [
      {
        segment_name: 'High-Value Loyalists',
        size_estimate: '18% of base',
        behavioral_traits: ['Frequent repeat purchases', 'High basket value', 'Multi-category shoppers', 'Low price sensitivity'],
        demographic_profile: 'Professionals aged 35-55, urban, household income $120K+',
        avg_clv_range: '$4,200 - $8,500',
        characteristics: ['Brand Advocates', 'Premium Tier', 'Low Churn Risk'],
        description: 'Core revenue drivers who consistently engage across channels and product lines. They respond well to exclusivity and early access programs.',
      },
      {
        segment_name: 'Price-Sensitive Browsers',
        size_estimate: '32% of base',
        behavioral_traits: ['Deal-driven purchases', 'High browse-to-buy ratio', 'Seasonal peaks', 'Single category focus'],
        demographic_profile: 'Mixed demographics, ages 22-40, suburban, moderate income',
        avg_clv_range: '$600 - $1,800',
        characteristics: ['Deal Seekers', 'Moderate Engagement', 'Medium Churn Risk'],
        description: 'Engaged during promotions but less active during regular pricing periods. Converting them to regular buyers requires targeted incentive programs.',
      },
      {
        segment_name: 'New & At-Risk Cohort',
        size_estimate: '25% of base',
        behavioral_traits: ['Recent first purchase', 'Low repeat rate', 'Limited product exploration', 'Mobile-first'],
        demographic_profile: 'Younger demographic, ages 18-30, digitally native',
        avg_clv_range: '$150 - $600',
        characteristics: ['New Customers', 'Onboarding Phase', 'High Churn Risk'],
        description: 'Recently acquired customers with limited engagement history. Critical window for establishing purchase habits and brand loyalty.',
      },
    ],
    summary: 'Analysis reveals three distinct customer segments with varying CLV potential and engagement patterns. The High-Value Loyalist segment drives disproportionate revenue despite representing only 18% of the customer base.',
  },
  churn_risk: {
    risk_groups: [
      {
        group_name: 'Disengaged High-Value',
        risk_score: '8.2/10',
        risk_level: 'High',
        churn_indicators: ['60% drop in purchase frequency', 'No login in 45+ days', 'Abandoned loyalty program activity'],
        warning_signs: ['Support ticket escalation pattern', 'Competitor product research detected', 'Declining NPS scores'],
        engagement_decline: '62% decline over the last quarter',
        recommended_action: 'Immediate executive outreach with personalized retention offer. Schedule account review within 48 hours.',
      },
      {
        group_name: 'Lapsed Mid-Tier',
        risk_score: '6.5/10',
        risk_level: 'Medium',
        churn_indicators: ['30-day purchase gap exceeding historical average', 'Reduced email engagement', 'Cart abandonment increase'],
        warning_signs: ['Subscription downgrade inquiries', 'Reduced session duration'],
        engagement_decline: '38% decline over last 6 weeks',
        recommended_action: 'Deploy automated win-back campaign with personalized product recommendations based on prior purchase history.',
      },
      {
        group_name: 'Stable Low-Value',
        risk_score: '3.1/10',
        risk_level: 'Low',
        churn_indicators: ['Flat engagement metrics', 'No upsell response'],
        warning_signs: ['Limited cross-category exploration'],
        engagement_decline: '12% decline — within normal range',
        recommended_action: 'Focus on incremental engagement through content marketing and community building. Low urgency intervention.',
      },
    ],
    total_at_risk: '2,340 customers',
    average_risk_score: '5.9/10',
    highest_risk_segment: 'Disengaged High-Value',
    summary: 'Churn analysis identifies 2,340 customers at measurable risk, with the Disengaged High-Value group representing the greatest potential revenue loss. Immediate intervention is recommended for the high-risk cohort.',
  },
  retention_strategies: {
    strategies: [
      {
        strategy_type: 'Proactive Outreach',
        target_segment: 'Disengaged High-Value',
        risk_level: 'High',
        action_steps: ['Assign dedicated account manager', 'Schedule personalized video call within 48 hours', 'Offer exclusive renewal incentive package', 'Create custom product bundle based on purchase history'],
        expected_impact: '35-45% re-engagement rate within 30 days',
        detailed_tactics: 'Deploy a three-touch outreach sequence: Day 1 - personal email from VP of Customer Success acknowledging their loyalty; Day 3 - phone call with tailored offer; Day 7 - exclusive access to new product launch. Track engagement at each touchpoint and escalate if no response by Day 10.',
        priority: 'High',
      },
      {
        strategy_type: 'Win-Back',
        target_segment: 'Lapsed Mid-Tier',
        risk_level: 'Medium',
        action_steps: ['Launch automated email sequence with dynamic content', 'Offer tiered discount structure (10/15/20%)', 'Retarget with social ads featuring viewed products', 'Provide free shipping on next order'],
        expected_impact: '20-30% conversion rate for win-back campaign',
        detailed_tactics: 'Implement a 21-day win-back journey: Week 1 - "We miss you" email with personalized product picks; Week 2 - increasing discount offer + social proof testimonials; Week 3 - final urgency message with best offer. A/B test subject lines and offer structures across cohorts.',
        priority: 'Medium',
      },
      {
        strategy_type: 'Early Warning',
        target_segment: 'New & At-Risk Cohort',
        risk_level: 'High',
        action_steps: ['Implement onboarding email nurture sequence', 'Trigger alerts when engagement drops below threshold', 'Offer new customer welcome bundle', 'Enable in-app guided product discovery'],
        expected_impact: '50-60% improvement in 90-day retention',
        detailed_tactics: 'Create a 30-day onboarding program with milestone rewards: First purchase celebration, second purchase discount, category exploration incentive, and loyalty program enrollment prompt. Monitor daily active usage and trigger intervention if engagement score drops below 40.',
        priority: 'High',
      },
    ],
    summary: 'Three targeted retention strategies address each identified risk tier. Priority should be given to the Proactive Outreach strategy for disengaged high-value customers, followed by the Early Warning system for new customer retention.',
  },
  executive_summary: 'Customer analytics reveals a base with strong polarization: 18% of customers drive the majority of revenue, while 25% of recently acquired customers are at significant churn risk. Immediate action is recommended for the 2,340 at-risk customers, with particular focus on the Disengaged High-Value segment where potential revenue loss is highest. Three targeted retention strategies have been developed, prioritizing proactive outreach for high-value customers and early intervention for new cohorts.',
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <RiLoader4Line className="h-4 w-4 animate-spin" />
        <p className="text-sm">Analyzing customer data...</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  const [customerData, setCustomerData] = useState('')
  const [analysisFocus, setAnalysisFocus] = useState('')
  const [analysisData, setAnalysisData] = useState<ManagerResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('segments')
  const [showSample, setShowSample] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  const displayData = showSample ? SAMPLE_DATA : analysisData

  const handleRunAnalysis = async () => {
    if (!customerData.trim()) return
    setLoading(true)
    setError(null)
    setAnalysisData(null)
    setActiveAgentId(AGENT_ID)
    setActiveTab('segments')

    try {
      const message = analysisFocus.trim()
        ? `${customerData.trim()}\n\nAnalysis Focus: ${analysisFocus.trim()}`
        : customerData.trim()

      const result = await callAIAgent(message, AGENT_ID)

      if (result.success) {
        const raw = result?.response?.result
        let parsedData: ManagerResponse
        if (typeof raw === 'string') {
          try {
            parsedData = JSON.parse(raw)
          } catch {
            parsedData = {}
          }
        } else {
          parsedData = (raw as ManagerResponse) ?? {}
        }
        setAnalysisData(parsedData)
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Analysis failed. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  const handleReset = () => {
    setCustomerData('')
    setAnalysisFocus('')
    setAnalysisData(null)
    setError(null)
    setActiveTab('segments')
    setShowSample(false)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card flex-shrink-0">
          <div className="p-5 space-y-1">
            <div className="flex items-center gap-2">
              <RiBarChartLine className="h-5 w-5" style={{ color: 'hsl(36, 60%, 31%)' }} />
              <h1 className="font-serif text-base font-semibold text-foreground tracking-wide">Analytics</h1>
            </div>
            <p className="text-xs text-muted-foreground">Retention Intelligence</p>
          </div>
          <Separator className="bg-border" />
          <nav className="flex-1 p-3">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-secondary/60 text-foreground">
              <RiDashboardLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </nav>
          <Separator className="bg-border" />
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent Status</p>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${activeAgentId ? 'bg-amber-400 animate-pulse' : (displayData ? 'bg-green-400' : 'bg-muted-foreground/40')}`} />
                <span className="text-xs text-muted-foreground">
                  {activeAgentId ? 'Processing...' : (displayData ? 'Complete' : 'Idle')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">Customer Analytics Manager</p>
            </div>
            <Separator className="bg-border" />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RiSparklingLine className="h-3 w-3" />
              Powered by AI
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-xl font-semibold text-foreground tracking-wide">Customer Analytics Hub</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Retention Intelligence Platform</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="sample-toggle"
                    checked={showSample}
                    onCheckedChange={setShowSample}
                  />
                  <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">
                    Sample Data
                  </Label>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs border-border text-muted-foreground hover:text-foreground">
                  <RiRefreshLine className="h-3.5 w-3.5 mr-1" />
                  New Analysis
                </Button>
              </div>
            </div>
          </header>

          {/* Body */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
              {/* Executive Summary */}
              {displayData?.executive_summary && (
                <Card className="border-border bg-card shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RiCheckboxCircleLine className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Executive Summary</p>
                        <p className="text-sm text-foreground leading-relaxed">{displayData.executive_summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Input Section */}
              <InputSection
                customerData={customerData}
                setCustomerData={setCustomerData}
                analysisFocus={analysisFocus}
                setAnalysisFocus={setAnalysisFocus}
                loading={loading}
                onRunAnalysis={handleRunAnalysis}
              />

              {/* Error Display */}
              {error && (
                <Card className="border-red-800/50 bg-red-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RiErrorWarningLine className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="text-sm text-red-300">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRunAnalysis}
                          className="text-xs border-red-800/50 text-red-300 hover:bg-red-900/30"
                        >
                          Retry Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Tabs */}
              {loading ? (
                <LoadingSkeleton />
              ) : displayData ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-muted border border-border w-full sm:w-auto">
                    <TabsTrigger value="segments" className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-sm gap-1.5">
                      <RiGroupLine className="h-3.5 w-3.5" />
                      Segments
                    </TabsTrigger>
                    <TabsTrigger value="churn" className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-sm gap-1.5">
                      <RiAlertLine className="h-3.5 w-3.5" />
                      Churn Risk
                    </TabsTrigger>
                    <TabsTrigger value="strategies" className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-sm gap-1.5">
                      <RiLightbulbLine className="h-3.5 w-3.5" />
                      Strategies
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="segments" className="mt-4">
                    <SegmentsTab
                      segments={Array.isArray(displayData?.segmentation?.segments) ? displayData.segmentation.segments : []}
                      summary={displayData?.segmentation?.summary ?? ''}
                    />
                  </TabsContent>

                  <TabsContent value="churn" className="mt-4">
                    <ChurnRiskTab
                      riskGroups={Array.isArray(displayData?.churn_risk?.risk_groups) ? displayData.churn_risk.risk_groups : []}
                      totalAtRisk={displayData?.churn_risk?.total_at_risk ?? ''}
                      averageRiskScore={displayData?.churn_risk?.average_risk_score ?? ''}
                      highestRiskSegment={displayData?.churn_risk?.highest_risk_segment ?? ''}
                      summary={displayData?.churn_risk?.summary ?? ''}
                    />
                  </TabsContent>

                  <TabsContent value="strategies" className="mt-4">
                    <StrategiesTab
                      strategies={Array.isArray(displayData?.retention_strategies?.strategies) ? displayData.retention_strategies.strategies : []}
                      summary={displayData?.retention_strategies?.summary ?? ''}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="border-border bg-card">
                  <CardContent className="py-16">
                    <div className="text-center space-y-3">
                      <RiBarChartLine className="h-12 w-12 mx-auto text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        Upload a CSV file above and run analysis to see insights
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Or toggle <span className="font-medium text-foreground">Sample Data</span> to explore the dashboard
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agent Info */}
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <RiSparklingLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                      <div>
                        <p className="text-xs font-medium text-foreground">Customer Analytics Manager</p>
                        <p className="text-xs text-muted-foreground">Coordinates Segmentation, Churn Analysis, and Retention Strategy agents</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-border">
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${activeAgentId ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                      {activeAgentId ? 'Active' : 'Ready'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </main>
      </div>
    </ErrorBoundary>
  )
}
