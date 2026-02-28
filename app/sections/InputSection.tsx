'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RiSearchLine, RiLoader4Line } from 'react-icons/ri'

interface InputSectionProps {
  customerData: string
  setCustomerData: (val: string) => void
  analysisFocus: string
  setAnalysisFocus: (val: string) => void
  loading: boolean
  onRunAnalysis: () => void
}

export default function InputSection({
  customerData,
  setCustomerData,
  analysisFocus,
  setAnalysisFocus,
  loading,
  onRunAnalysis,
}: InputSectionProps) {
  return (
    <Card className="border-border bg-card shadow-lg">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="customer-data" className="text-sm font-medium text-foreground tracking-wide">
            Customer Data
          </Label>
          <Textarea
            id="customer-data"
            placeholder="Describe your customer data — include behavioral metrics (purchase frequency, recency, product preferences), CLV data, engagement metrics, geographic/demographic info, and customer journey stages..."
            value={customerData}
            onChange={(e) => setCustomerData(e.target.value)}
            rows={8}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none font-sans text-sm leading-relaxed"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="analysis-focus" className="text-sm font-medium text-foreground tracking-wide">
            Analysis Focus <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="analysis-focus"
            placeholder="e.g., Focus on high-CLV customers, Analyze Q4 cohort"
            value={analysisFocus}
            onChange={(e) => setAnalysisFocus(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground font-sans text-sm"
            disabled={loading}
          />
        </div>

        <Button
          onClick={onRunAnalysis}
          disabled={loading || !customerData.trim()}
          className="w-full h-11 font-medium text-sm tracking-wide transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: 'hsl(36, 60%, 31%)', color: 'white' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RiLoader4Line className="h-4 w-4 animate-spin" />
              Analyzing customer data...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RiSearchLine className="h-4 w-4" />
              Run Analysis
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
