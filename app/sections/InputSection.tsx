'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  RiSearchLine,
  RiLoader4Line,
  RiUploadCloud2Line,
  RiFileTextLine,
  RiCloseLine,
  RiTableLine,
  RiInformationLine,
} from 'react-icons/ri'

interface InputSectionProps {
  customerData: string
  setCustomerData: (val: string) => void
  analysisFocus: string
  setAnalysisFocus: (val: string) => void
  loading: boolean
  onRunAnalysis: () => void
}

interface CsvPreview {
  fileName: string
  fileSize: string
  headers: string[]
  rowCount: number
  previewRows: string[][]
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
  if (lines.length === 0) return { headers: [], rows: [] }

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"'
          i++
        } else if (ch === '"') {
          inQuotes = false
        } else {
          current += ch
        }
      } else {
        if (ch === '"') {
          inQuotes = true
        } else if (ch === ',') {
          result.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map(parseLine)
  return { headers, rows }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function csvToSummaryText(headers: string[], rows: string[][]): string {
  const colCount = headers.length
  const rowCount = rows.length

  let text = `Customer Dataset: ${rowCount} records with ${colCount} columns.\n`
  text += `Columns: ${headers.join(', ')}\n\n`

  // Include all rows (up to a reasonable limit for the agent) as structured data
  const maxRows = Math.min(rows.length, 100)
  text += `Data (${maxRows} of ${rowCount} rows):\n`
  for (let i = 0; i < maxRows; i++) {
    const row = rows[i]
    const pairs = headers.map((h, idx) => `${h}: ${row[idx] ?? 'N/A'}`)
    text += `Row ${i + 1}: ${pairs.join(' | ')}\n`
  }

  if (rowCount > maxRows) {
    text += `\n... and ${rowCount - maxRows} more rows not shown.\n`
  }

  return text
}

export default function InputSection({
  customerData,
  setCustomerData,
  analysisFocus,
  setAnalysisFocus,
  loading,
  onRunAnalysis,
}: InputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvPreview, setCsvPreview] = useState<CsvPreview | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setFileError(null)

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Please upload a CSV file (.csv)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text || text.trim().length === 0) {
        setFileError('The file appears to be empty')
        return
      }

      const { headers, rows } = parseCSV(text)

      if (headers.length === 0) {
        setFileError('Could not parse CSV headers')
        return
      }

      const preview: CsvPreview = {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        headers,
        rowCount: rows.length,
        previewRows: rows.slice(0, 5),
      }

      setCsvPreview(preview)
      const summaryText = csvToSummaryText(headers, rows)
      setCustomerData(summaryText)
    }

    reader.onerror = () => {
      setFileError('Failed to read file')
    }

    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveFile = () => {
    setCsvPreview(null)
    setCustomerData('')
    setFileError(null)
  }

  return (
    <Card className="border-border bg-card shadow-lg">
      <CardContent className="p-6 space-y-5">
        {/* CSV Upload Area */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground tracking-wide">
            Customer Data
          </Label>

          {!csvPreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${dragActive
                  ? 'border-[hsl(36,60%,31%)] bg-[hsl(36,60%,31%)]/10'
                  : 'border-border hover:border-muted-foreground/40 bg-input/30 hover:bg-input/50'
                }
                ${loading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={loading}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <RiUploadCloud2Line className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {dragActive ? 'Drop your CSV file here' : 'Upload CSV file'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag and drop or click to browse -- .csv up to 10 MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-border text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  disabled={loading}
                >
                  <RiFileTextLine className="h-3.5 w-3.5 mr-1.5" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* File Info Bar */}
              <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md flex items-center justify-center" style={{ backgroundColor: 'hsl(36, 60%, 31%, 0.15)' }}>
                    <RiFileTextLine className="h-4.5 w-4.5" style={{ color: 'hsl(36, 60%, 31%)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{csvPreview.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{csvPreview.fileSize}</span>
                      <span className="text-xs text-muted-foreground">--</span>
                      <span className="text-xs text-muted-foreground">{csvPreview.rowCount} rows</span>
                      <span className="text-xs text-muted-foreground">--</span>
                      <span className="text-xs text-muted-foreground">{csvPreview.headers.length} columns</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={loading}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <RiCloseLine className="h-4 w-4" />
                </Button>
              </div>

              {/* Column Headers */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <RiTableLine className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Detected Columns</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {csvPreview.headers.map((header, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-secondary text-secondary-foreground border-border font-normal"
                    >
                      {header}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Data Preview Table */}
              {csvPreview.previewRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <RiInformationLine className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Preview (first {csvPreview.previewRows.length} rows)
                    </p>
                  </div>
                  <ScrollArea className="w-full">
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/70">
                            {csvPreview.headers.map((header, idx) => (
                              <th
                                key={idx}
                                className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap border-b border-border"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.previewRows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                              {csvPreview.headers.map((_, colIdx) => (
                                <td
                                  key={colIdx}
                                  className="px-3 py-2 text-foreground whitespace-nowrap max-w-[200px] truncate"
                                >
                                  {row[colIdx] ?? ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          {/* File Error */}
          {fileError && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5">
              <RiInformationLine className="h-3.5 w-3.5" />
              {fileError}
            </p>
          )}
        </div>

        <Separator className="bg-border" />

        {/* Analysis Focus */}
        <div className="space-y-2">
          <Label htmlFor="analysis-focus" className="text-sm font-medium text-foreground tracking-wide">
            Analysis Focus <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="analysis-focus"
            placeholder="e.g., Focus on high-CLV customers, Analyze Q4 cohort, Identify churn patterns"
            value={analysisFocus}
            onChange={(e) => setAnalysisFocus(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground font-sans text-sm"
            disabled={loading}
          />
        </div>

        {/* Run Analysis Button */}
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

        {/* Help hint */}
        {!csvPreview && !customerData && (
          <p className="text-xs text-muted-foreground text-center">
            Upload a CSV with customer data including behavioral metrics, demographics, CLV, and engagement info
          </p>
        )}
      </CardContent>
    </Card>
  )
}
