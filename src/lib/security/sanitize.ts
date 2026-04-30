/**
 * Security sanitization component for ChunaavAI
 */

/**
 * Strips HTML tags, trims whitespace, limits length, and removes 
 * residual special injection chars.
 * 
 * @param text - The raw user input string
 * @param maxLength - Maximum allowed length (default 500)
 * @returns Sanitized string
 */
export function sanitizeUserInput(text: string, maxLength: number = 500): string {
  if (!text) return '';
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>{}]/g, ''); // Remove potentially dangerous bracket characters
}

/**
 * Validates a user query for prompt injection patterns.
 * Returns false if blocked patterns are found.
 * 
 * @param query - The user's query
 * @returns boolean - True if the query is safe, false if it contains blocked patterns
 */
export function validateElectionQuery(query: string): boolean {
  if (!query) return false;
  
  const blockedPatterns = [
    'ignore previous',
    'system:',
    'jailbreak',
    'forget previous',
    'ignore all'
  ];
  
  const lowerQuery = query.toLowerCase();
  for (const pattern of blockedPatterns) {
    if (lowerQuery.includes(pattern)) {
      // In a real app, you would log this to security_logs/{timestamp} in Firestore
      console.warn(`[SECURITY] Blocked injection attempt detected: "${pattern}"`);
      return false;
    }
  }
  
  return true;
}

/**
 * Sanitizes an object before writing to Firestore.
 * Removes undefined values and prevents __proto__ pollution.
 * 
 * @param data - The raw object to be saved
 * @returns Sanitized object safe for Firestore
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeForFirestore(data: any): any {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data
      .map(item => sanitizeForFirestore(item))
      .filter(item => item !== undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      if (data[key] !== undefined) {
        sanitized[key] = sanitizeForFirestore(data[key]);
      }
    }
  }
  
  return sanitized;
}
