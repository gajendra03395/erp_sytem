export interface Account {
  id: string
  accountCode: string
  accountName: string
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: number
  currency: string
  isActive: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  entryNumber: string
  date: string
  description: string
  lines: JournalEntryLine[]
  totalDebit: number
  totalCredit: number
  status: 'draft' | 'posted' | 'reversed'
  createdBy: string
  createdAt: string
  postedAt?: string
}

export interface JournalEntryLine {
  id: string
  accountId: string
  accountName: string
  debit: number
  credit: number
  description: string
}

export interface TrialBalance {
  accountCode: string
  accountName: string
  accountType: string
  debitBalance: number
  creditBalance: number
}

export interface FinancialReport {
  id: string
  reportType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'trial-balance'
  title: string
  period: string
  generatedAt: string
  data: any
}

export interface Invoice {
  id: string
  invoiceNumber: string
  type: 'payable' | 'receivable'
  vendorId?: string
  customerId?: string
  date: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  lineItems: InvoiceLineItem[]
  currency: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalAmount: number
  taxRate: number
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  taxId: string
  paymentTerms: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  taxId: string
  creditLimit: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  departmentId: string
  departmentName: string
  fiscalYear: number
  category: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
  period: string
  status: 'active' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  expenseNumber: string
  description: string
  amount: number
  currency: string
  date: string
  category: string
  costCenter: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  submittedBy: string
  approvedBy?: string
  approvedAt?: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export interface BankAccount {
  id: string
  accountName: string
  accountNumber: string
  bankName: string
  accountType: 'checking' | 'savings' | 'credit'
  currency: string
  balance: number
  lastReconciledDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BankReconciliation {
  id: string
  bankAccountId: string
  statementDate: string
  statementBalance: number
  bookBalance: number
  reconciledItems: ReconciledItem[]
  unreconciledItems: UnreconciledItem[]
  status: 'in-progress' | 'completed' | 'discrepancy'
  reconciledBy: string
  reconciledAt?: string
  createdAt: string
}

export interface ReconciledItem {
  id: string
  transactionId: string
  amount: number
  date: string
  description: string
  matchType: 'exact' | 'partial'
}

export interface UnreconciledItem {
  id: string
  transactionId: string
  amount: number
  date: string
  description: string
  reason: string
}

export interface TaxConfiguration {
  id: string
  name: string
  rate: number
  type: 'sales' | 'purchase' | 'income' | 'other'
  jurisdiction: string
  isActive: boolean
  effectiveFrom: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
}

export interface TaxReport {
  id: string
  reportType: 'sales-tax' | 'income-tax' | 'vat' | 'other'
  period: string
  totalTax: number
  taxableAmount: number
  details: TaxReportDetail[]
  generatedAt: string
}

export interface TaxReportDetail {
  accountName: string
  taxableAmount: number
  taxAmount: number
  rate: number
}
