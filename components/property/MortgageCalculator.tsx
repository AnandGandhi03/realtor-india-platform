'use client'

import { useState } from 'react'
import { Calculator, IndianRupee } from 'lucide-react'

interface MortgageCalculatorProps {
  propertyPrice: number
}

export default function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8) // 80% LTV
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const calculateEMI = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 12 / 100
    const months = tenure * 12

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1)

    const totalAmount = emi * months
    const totalInterest = totalAmount - principal

    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal)
    }
  }

  const result = calculateEMI()

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold">EMI Calculator</h2>
      </div>

      <div className="space-y-6">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <span className="text-sm font-semibold text-primary-600">
              {formatCurrency(loanAmount)}
            </span>
          </div>
          <input
            type="range"
            min={propertyPrice * 0.1}
            max={propertyPrice * 0.9}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Interest Rate</label>
            <span className="text-sm font-semibold text-primary-600">{interestRate}% p.a.</span>
          </div>
          <input
            type="range"
            min={6}
            max={15}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
            <span className="text-sm font-semibold text-primary-600">{tenure} years</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        {/* Results */}
        <div className="bg-primary-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Monthly EMI</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(result.emi)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Principal Amount</span>
            <span className="font-semibold">{formatCurrency(result.principal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Interest</span>
            <span className="font-semibold">{formatCurrency(result.totalInterest)}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold">{formatCurrency(result.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}