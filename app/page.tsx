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
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiShieldCheckLine,
  RiFlashlightLine,
} from 'react-icons/ri'

import InputSection from './sections/InputSection'
import SegmentsTab from './sections/SegmentsTab'
import ChurnRiskTab from './sections/ChurnRiskTab'
import StrategiesTab from './sections/StrategiesTab'

const AGENT_ID = '69a27b508e6d0e51fd5cd391'

interface DimensionAnalyzed {
  dimension?: string
  finding?: string
}

interface KeyMetric {
  metric_name?: string
  value?: string
  insight?: string
}

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

interface QuickWin {
  action?: string
  target?: string
  expected_result?: string
  effort?: string
}

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

interface ManagerResponse {
  segmentation?: {
    segments?: Segment[]
    summary?: string
    dimensions_analyzed?: DimensionAnalyzed[]
    key_metrics?: KeyMetric[]
    cross_segment_comparison?: string
  }
  churn_risk?: {
    risk_groups?: RiskGroup[]
    total_at_risk?: string
    average_risk_score?: string
    highest_risk_segment?: string
    summary?: string
    revenue_at_risk?: string
    risk_factors?: RiskFactor[]
    risk_distribution?: RiskDistribution[]
    early_warnings?: EarlyWarning[]
  }
  retention_strategies?: {
    strategies?: Strategy[]
    summary?: string
    strategy_matrix?: string
    prioritized_roadmap?: string
    quick_wins?: QuickWin[]
  }
  executive_summary?: string
  data_quality?: {
    completeness?: string
    dimensions_covered?: number
    confidence_level?: string
    data_points_analyzed?: string
  }
  cross_cutting_insights?: string[]
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
        engagement_score: '92/100',
        channel_preferences: 'Email (45%), Mobile App (35%), In-Store (20%)',
        product_affinity: 'Premium categories, new launches, seasonal collections',
        lifecycle_stage: 'Active Loyal',
        key_differentiators: ['3.2x higher AOV than average', 'NPS score 78+', '85% email open rate', 'Multi-channel engagement'],
      },
      {
        segment_name: 'Price-Sensitive Browsers',
        size_estimate: '32% of base',
        behavioral_traits: ['Deal-driven purchases', 'High browse-to-buy ratio', 'Seasonal peaks', 'Single category focus'],
        demographic_profile: 'Mixed demographics, ages 22-40, suburban, moderate income',
        avg_clv_range: '$600 - $1,800',
        characteristics: ['Deal Seekers', 'Moderate Engagement', 'Medium Churn Risk'],
        description: 'Engaged during promotions but less active during regular pricing periods. Converting them to regular buyers requires targeted incentive programs.',
        engagement_score: '54/100',
        channel_preferences: 'Social Media (40%), Web (35%), Email (25%)',
        product_affinity: 'Sale items, bundles, clearance categories',
        lifecycle_stage: 'Active At-Risk',
        key_differentiators: ['4.8x browse-to-buy ratio', 'Peak activity during sales events', '68% coupon redemption rate'],
      },
      {
        segment_name: 'New & At-Risk Cohort',
        size_estimate: '25% of base',
        behavioral_traits: ['Recent first purchase', 'Low repeat rate', 'Limited product exploration', 'Mobile-first'],
        demographic_profile: 'Younger demographic, ages 18-30, digitally native',
        avg_clv_range: '$150 - $600',
        characteristics: ['New Customers', 'Onboarding Phase', 'High Churn Risk'],
        description: 'Recently acquired customers with limited engagement history. Critical window for establishing purchase habits and brand loyalty.',
        engagement_score: '28/100',
        channel_preferences: 'Mobile App (60%), Social Media (30%), Web (10%)',
        product_affinity: 'Entry-level products, trending items',
        lifecycle_stage: 'New Onboarding',
        key_differentiators: ['78% single-purchase customers', 'Average 1.2 sessions per week', 'High social referral rate'],
      },
    ],
    summary: 'Analysis across 12 dimensions reveals three distinct customer segments with varying CLV potential and engagement patterns. The High-Value Loyalist segment drives disproportionate revenue despite representing only 18% of the customer base.',
    dimensions_analyzed: [
      { dimension: 'Purchase Frequency', finding: 'Bimodal distribution with peaks at 1-2 and 8-12 purchases per quarter' },
      { dimension: 'Average Order Value', finding: 'Top 18% accounts for 52% of total revenue' },
      { dimension: 'Channel Engagement', finding: 'Mobile-first users show 2.3x higher browse rate but 40% lower conversion' },
      { dimension: 'Product Category Breadth', finding: 'Multi-category shoppers have 3.5x higher retention rates' },
      { dimension: 'Recency', finding: '25% of base has not purchased in 60+ days' },
      { dimension: 'Geographic Distribution', finding: 'Urban customers show 1.8x higher engagement scores' },
      { dimension: 'Seasonal Patterns', finding: 'Q4 drives 38% of annual revenue, Q1 sees highest churn' },
      { dimension: 'Price Sensitivity Index', finding: '32% of base purchases exclusively during promotional periods' },
    ],
    key_metrics: [
      { metric_name: 'Total Segments', value: '3', insight: 'Distinct behavioral clusters identified' },
      { metric_name: 'Avg. CLV', value: '$2,430', insight: 'Weighted across all segments' },
      { metric_name: 'Engagement Index', value: '58/100', insight: 'Below industry benchmark of 65' },
      { metric_name: 'Dimensions Analyzed', value: '12', insight: 'Comprehensive multi-dimensional clustering' },
    ],
    cross_segment_comparison: 'High-Value Loyalists generate 4.2x more revenue per customer than Price-Sensitive Browsers and 11.3x more than the New & At-Risk Cohort. However, the Price-Sensitive segment represents the largest growth opportunity with a 32% conversion potential to mid-tier through targeted nurturing. Channel preferences diverge significantly: loyalists prefer email, browsers engage via social, and new cohorts are mobile-dominant.',
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
        revenue_impact: '$1.2M annual revenue at risk',
        behavioral_velocity: 'Accelerating decline - 3x faster disengagement vs. prior quarter',
        contributing_factors: ['Product quality complaints', 'Pricing perception shift', 'Competitor promotional activity'],
      },
      {
        group_name: 'Lapsed Mid-Tier',
        risk_score: '6.5/10',
        risk_level: 'Medium',
        churn_indicators: ['30-day purchase gap exceeding historical average', 'Reduced email engagement', 'Cart abandonment increase'],
        warning_signs: ['Subscription downgrade inquiries', 'Reduced session duration'],
        engagement_decline: '38% decline over last 6 weeks',
        recommended_action: 'Deploy automated win-back campaign with personalized product recommendations based on prior purchase history.',
        revenue_impact: '$480K annual revenue at risk',
        behavioral_velocity: 'Steady decline - consistent 6% week-over-week reduction',
        contributing_factors: ['Promotional fatigue', 'Category saturation', 'Seasonal disengagement'],
      },
      {
        group_name: 'Stable Low-Value',
        risk_score: '3.1/10',
        risk_level: 'Low',
        churn_indicators: ['Flat engagement metrics', 'No upsell response'],
        warning_signs: ['Limited cross-category exploration'],
        engagement_decline: '12% decline -- within normal range',
        recommended_action: 'Focus on incremental engagement through content marketing and community building. Low urgency intervention.',
        revenue_impact: '$95K annual revenue at risk',
        behavioral_velocity: 'Stable - fluctuations within normal seasonal range',
        contributing_factors: ['Low product awareness', 'Single-category attachment'],
      },
    ],
    total_at_risk: '2,340 customers',
    average_risk_score: '5.9/10',
    highest_risk_segment: 'Disengaged High-Value',
    summary: 'Churn analysis across 10 risk dimensions identifies 2,340 customers at measurable risk, with the Disengaged High-Value group representing the greatest potential revenue loss of $1.2M annually. Immediate intervention is recommended for the high-risk cohort.',
    revenue_at_risk: '$1.78M',
    risk_factors: [
      { factor: 'Purchase Frequency Decline', impact: 'High', correlation: '0.87' },
      { factor: 'Email Engagement Drop', impact: 'High', correlation: '0.82' },
      { factor: 'Support Ticket Volume', impact: 'Medium', correlation: '0.71' },
      { factor: 'Session Duration Decrease', impact: 'Medium', correlation: '0.68' },
      { factor: 'Cart Abandonment Rate', impact: 'Medium', correlation: '0.64' },
      { factor: 'NPS Score Trajectory', impact: 'High', correlation: '0.79' },
    ],
    risk_distribution: [
      { dimension: 'By Revenue Tier', breakdown: 'High-value: 35% at risk, Mid-tier: 28% at risk, Low-value: 15% at risk' },
      { dimension: 'By Tenure', breakdown: '0-6 months: 42% at risk, 6-24 months: 22% at risk, 24+ months: 18% at risk' },
      { dimension: 'By Channel', breakdown: 'Web-only: 38% at risk, Mobile: 25% at risk, Multi-channel: 12% at risk' },
      { dimension: 'By Geography', breakdown: 'Suburban: 31% at risk, Urban: 19% at risk, Rural: 27% at risk' },
    ],
    early_warnings: [
      { signal: 'Login frequency drops below 1x per week', timeframe: '14-21 days before churn', reliability: 'High' },
      { signal: 'Email open rate falls below 10%', timeframe: '30 days before churn', reliability: 'High' },
      { signal: 'Cart abandonment exceeds 3 consecutive sessions', timeframe: '7-10 days before churn', reliability: 'Medium' },
      { signal: 'Support ticket sentiment shifts negative', timeframe: '21-30 days before churn', reliability: 'Medium' },
      { signal: 'Loyalty points stop accruing', timeframe: '45 days before churn', reliability: 'High' },
    ],
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
        timeline: 'Immediate -- first 48 hours critical',
        success_metrics: 'Re-engagement rate, revenue recovery %, NPS improvement',
        channel_recommendations: 'Direct phone, personal email, in-app notification',
        personalization_approach: 'Account history review, purchase pattern analysis, personalized product bundles based on past favorites',
        roi_projection: '8.5x return on retention investment, $1.02M potential recovery',
      },
      {
        strategy_type: 'Win-Back Campaign',
        target_segment: 'Lapsed Mid-Tier',
        risk_level: 'Medium',
        action_steps: ['Launch automated email sequence with dynamic content', 'Offer tiered discount structure (10/15/20%)', 'Retarget with social ads featuring viewed products', 'Provide free shipping on next order'],
        expected_impact: '20-30% conversion rate for win-back campaign',
        detailed_tactics: 'Implement a 21-day win-back journey: Week 1 - "We miss you" email with personalized product picks; Week 2 - increasing discount offer + social proof testimonials; Week 3 - final urgency message with best offer. A/B test subject lines and offer structures across cohorts.',
        priority: 'Medium',
        timeline: '21-day campaign cycle with weekly escalation',
        success_metrics: 'Win-back conversion rate, second purchase rate, campaign ROI',
        channel_recommendations: 'Email automation, social retargeting, SMS (opt-in)',
        personalization_approach: 'Viewed-product recommendations, browsing behavior matching, dynamic discount thresholds',
        roi_projection: '4.2x return, $144K potential recovery',
      },
      {
        strategy_type: 'Early Warning System',
        target_segment: 'New & At-Risk Cohort',
        risk_level: 'High',
        action_steps: ['Implement onboarding email nurture sequence', 'Trigger alerts when engagement drops below threshold', 'Offer new customer welcome bundle', 'Enable in-app guided product discovery'],
        expected_impact: '50-60% improvement in 90-day retention',
        detailed_tactics: 'Create a 30-day onboarding program with milestone rewards: First purchase celebration, second purchase discount, category exploration incentive, and loyalty program enrollment prompt. Monitor daily active usage and trigger intervention if engagement score drops below 40.',
        priority: 'High',
        timeline: '30-day onboarding program with ongoing monitoring',
        success_metrics: '90-day retention rate, second purchase rate, engagement score trajectory',
        channel_recommendations: 'Mobile push, in-app messaging, email onboarding sequence',
        personalization_approach: 'First-purchase category expansion suggestions, peer behavior benchmarking, progressive profiling',
        roi_projection: '6.1x return, estimated $210K in preserved CLV',
      },
    ],
    summary: 'Three targeted retention strategies address each identified risk tier with measurable ROI projections. Combined potential recovery is $1.37M with an average 6.3x return on retention investment.',
    strategy_matrix: 'Coverage spans all three risk tiers: High-risk (Proactive Outreach) targets 15% of at-risk base with highest per-customer ROI; Medium-risk (Win-Back) addresses 45% of at-risk volume; High-frequency (Early Warning) prevents 40% of new customer churn through systematic onboarding. No coverage gaps identified across the current segmentation model.',
    prioritized_roadmap: 'Week 1-2: Launch Proactive Outreach for Disengaged High-Value (immediate revenue impact)\nWeek 2-3: Deploy Early Warning System for New Cohort (prevent future churn)\nWeek 3-4: Activate Win-Back Campaign for Lapsed Mid-Tier (volume recovery)\nWeek 5-8: Measure, optimize, and iterate across all three programs\nWeek 9-12: Scale successful tactics and introduce cross-segment learnings',
    quick_wins: [
      { action: 'Send personalized re-engagement email to top 50 at-risk high-value customers', target: 'Disengaged High-Value', expected_result: '15-20% immediate response rate', effort: 'Low' },
      { action: 'Activate abandoned cart recovery sequence', target: 'Lapsed Mid-Tier', expected_result: '8-12% cart recovery rate', effort: 'Low' },
      { action: 'Push welcome discount to new customers with no second purchase after 14 days', target: 'New & At-Risk Cohort', expected_result: '25% second purchase conversion', effort: 'Minimal' },
      { action: 'Enable loyalty points expiration reminder notifications', target: 'All Segments', expected_result: '10% uplift in loyalty program engagement', effort: 'Low' },
    ],
  },
  executive_summary: 'Multi-dimensional customer analytics across 12 data dimensions reveals a base with strong polarization: 18% of customers drive the majority of revenue, while 25% of recently acquired customers are at significant churn risk. Total revenue at risk is $1.78M annually across 2,340 at-risk customers. Three targeted retention strategies with a combined ROI projection of 6.3x have been developed, with immediate priority on proactive outreach for the Disengaged High-Value segment ($1.2M at stake). Early warning systems for new customer retention and automated win-back campaigns complete the strategic framework.',
  data_quality: {
    completeness: '94%',
    dimensions_covered: 12,
    confidence_level: 'High',
    data_points_analyzed: '48,500+',
  },
  cross_cutting_insights: [
    'Multi-channel customers show 3.5x higher retention rates regardless of segment, suggesting channel diversification should be a universal strategy.',
    'Mobile-first users have the highest acquisition rate but lowest retention, indicating a mobile experience gap requiring immediate attention.',
    'Seasonal purchase patterns strongly correlate with churn timing -- Q1 post-holiday sees 2.4x higher churn than other quarters.',
    'Customers who engage with loyalty programs within their first 30 days have 68% higher 12-month retention.',
    'Support ticket volume is a leading indicator of churn with 0.71 correlation, suggesting proactive support outreach could reduce churn by 15-20%.',
  ],
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
        <aside
          className={`hidden md:flex flex-col border-r border-border bg-card flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-56' : 'w-16'
          }`}
        >
          {/* Logo / Brand */}
          <div className={`flex items-center ${sidebarOpen ? 'p-5 justify-between' : 'p-3 justify-center'}`}>
            {sidebarOpen ? (
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <RiBarChartLine className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
                  <h1 className="font-serif text-base font-semibold text-foreground tracking-wide truncate">Analytics</h1>
                </div>
                <p className="text-xs text-muted-foreground truncate">Retention Intelligence</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <RiBarChartLine className="h-5 w-5" style={{ color: 'hsl(36, 60%, 31%)' }} />
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <div className={`px-3 pb-2 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <RiMenuFoldLine className="h-4 w-4" />
              ) : (
                <RiMenuUnfoldLine className="h-4 w-4" />
              )}
            </button>
          </div>

          <Separator className="bg-border" />

          {/* Navigation */}
          <nav className="flex-1 p-3">
            <div
              className={`flex items-center rounded-md bg-secondary/60 text-foreground ${
                sidebarOpen ? 'gap-2.5 px-3 py-2' : 'justify-center p-2'
              }`}
              title="Dashboard"
            >
              <RiDashboardLine className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(36, 60%, 31%)' }} />
              {sidebarOpen && <span className="text-sm font-medium truncate">Dashboard</span>}
            </div>
          </nav>

          <Separator className="bg-border" />

          {/* Agent Status & Footer */}
          <div className={`space-y-3 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
            <div className="space-y-2">
              {sidebarOpen && (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent Status</p>
              )}
              <div className={`flex items-center ${sidebarOpen ? 'gap-2' : 'justify-center'}`} title={activeAgentId ? 'Processing...' : (displayData ? 'Complete' : 'Idle')}>
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${activeAgentId ? 'bg-amber-400 animate-pulse' : (displayData ? 'bg-green-400' : 'bg-muted-foreground/40')}`} />
                {sidebarOpen && (
                  <span className="text-xs text-muted-foreground">
                    {activeAgentId ? 'Processing...' : (displayData ? 'Complete' : 'Idle')}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <p className="text-xs text-muted-foreground truncate">Customer Analytics Manager</p>
              )}
            </div>
            <Separator className="bg-border" />
            <div className={`flex items-center ${sidebarOpen ? 'gap-1' : 'justify-center'}`} title="Powered by AI">
              <RiSparklingLine className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              {sidebarOpen && (
                <p className="text-xs text-muted-foreground">Powered by AI</p>
              )}
            </div>
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

              {/* Data Quality & Cross-Cutting Insights */}
              {displayData && (displayData.data_quality || (Array.isArray(displayData.cross_cutting_insights) && displayData.cross_cutting_insights.length > 0)) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Data Quality */}
                  {displayData.data_quality && (
                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <RiShieldCheckLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Quality Assessment</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {displayData.data_quality.completeness && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Completeness</p>
                              <p className="text-sm font-mono font-semibold text-foreground">{displayData.data_quality.completeness}</p>
                            </div>
                          )}
                          {displayData.data_quality.dimensions_covered != null && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Dimensions Covered</p>
                              <p className="text-sm font-mono font-semibold text-foreground">{displayData.data_quality.dimensions_covered}</p>
                            </div>
                          )}
                          {displayData.data_quality.confidence_level && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Confidence Level</p>
                              <p className="text-sm font-medium text-foreground">{displayData.data_quality.confidence_level}</p>
                            </div>
                          )}
                          {displayData.data_quality.data_points_analyzed && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Data Points</p>
                              <p className="text-sm font-mono font-semibold text-foreground">{displayData.data_quality.data_points_analyzed}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Cross-Cutting Insights */}
                  {Array.isArray(displayData.cross_cutting_insights) && displayData.cross_cutting_insights.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <RiFlashlightLine className="h-4 w-4" style={{ color: 'hsl(36, 60%, 31%)' }} />
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cross-Cutting Insights</p>
                        </div>
                        <ul className="space-y-2">
                          {displayData.cross_cutting_insights.map((insight, idx) => (
                            <li key={idx} className="text-xs text-foreground flex items-start gap-2 leading-relaxed">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(36, 60%, 31%)' }} />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
                      dimensionsAnalyzed={Array.isArray(displayData?.segmentation?.dimensions_analyzed) ? displayData.segmentation.dimensions_analyzed : []}
                      keyMetrics={Array.isArray(displayData?.segmentation?.key_metrics) ? displayData.segmentation.key_metrics : []}
                      crossSegmentComparison={displayData?.segmentation?.cross_segment_comparison}
                    />
                  </TabsContent>

                  <TabsContent value="churn" className="mt-4">
                    <ChurnRiskTab
                      riskGroups={Array.isArray(displayData?.churn_risk?.risk_groups) ? displayData.churn_risk.risk_groups : []}
                      totalAtRisk={displayData?.churn_risk?.total_at_risk ?? ''}
                      averageRiskScore={displayData?.churn_risk?.average_risk_score ?? ''}
                      highestRiskSegment={displayData?.churn_risk?.highest_risk_segment ?? ''}
                      summary={displayData?.churn_risk?.summary ?? ''}
                      revenueAtRisk={displayData?.churn_risk?.revenue_at_risk}
                      riskFactors={Array.isArray(displayData?.churn_risk?.risk_factors) ? displayData.churn_risk.risk_factors : []}
                      riskDistribution={Array.isArray(displayData?.churn_risk?.risk_distribution) ? displayData.churn_risk.risk_distribution : []}
                      earlyWarnings={Array.isArray(displayData?.churn_risk?.early_warnings) ? displayData.churn_risk.early_warnings : []}
                    />
                  </TabsContent>

                  <TabsContent value="strategies" className="mt-4">
                    <StrategiesTab
                      strategies={Array.isArray(displayData?.retention_strategies?.strategies) ? displayData.retention_strategies.strategies : []}
                      summary={displayData?.retention_strategies?.summary ?? ''}
                      strategyMatrix={displayData?.retention_strategies?.strategy_matrix}
                      prioritizedRoadmap={displayData?.retention_strategies?.prioritized_roadmap}
                      quickWins={Array.isArray(displayData?.retention_strategies?.quick_wins) ? displayData.retention_strategies.quick_wins : []}
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
