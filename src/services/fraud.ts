import type { ImpactRecord } from '../types';
const sensitivePatterns = [/\b\d{3,}\b/g, /\b(?:phone|mobile|address|passport|emirates id|رقم|عنوان|جواز|هوية)\b/i];
export function calculateFraudScore(input: Pick<ImpactRecord, 'title' | 'details' | 'city' | 'category'>): { score: number; auditRequired: boolean; flags: string[] } {
  const flags: string[] = [];
  let score = 8;
  if (input.details.trim().length < 30) { score += 20; flags.push('short_details'); }
  if (sensitivePatterns.some((p) => p.test(input.details))) { score += 35; flags.push('possible_sensitive_data'); }
  if (!input.city.trim()) { score += 12; flags.push('missing_city'); }
  if (/(money|cash|crypto|investment|عملة|مال|استثمار)/i.test(input.details)) { score += 25; flags.push('financial_language'); }
  return { score: Math.min(100, score), auditRequired: score >= 35, flags };
}
export function buildGroupingKey(userId: string, category: string, city: string, occurredAt: string) { return `${userId}_${category}_${city.toLowerCase()}_${occurredAt.slice(0,10)}`; }
