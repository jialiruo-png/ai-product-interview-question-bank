export type Frequency = 'S' | 'A' | 'B' | 'C'
export type CompanySpecific = 'yes' | 'no' | 'partial'

export interface QuestionTags {
  company: string[]
  companyStyle: string[]
  interviewStage: string[]
  frequency: Frequency
  companySpecific: CompanySpecific
}

export interface QuestionSource {
  document: string
  reference: string
}

export interface Question {
  id: string
  title: string
  mainCategory: string
  businessCategories: string[]
  corePoints: string[]
  tags: QuestionTags
  similarQuestions: string[]
  sources: QuestionSource[]
  updatedAt: string
}

export interface QuestionBank {
  version: string
  updatedAt: string
  originalQuestionCount: number
  questions: Question[]
}

export type FilterKey = 'categories' | 'businesses' | 'corePoints' | 'companies' | 'stages' | 'frequencies'
export interface Filters {
  query: string
  categories: string[]
  businesses: string[]
  corePoints: string[]
  companies: string[]
  stages: string[]
  frequencies: string[]
  companySpecific: 'all' | CompanySpecific
}
