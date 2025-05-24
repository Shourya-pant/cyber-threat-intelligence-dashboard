import type { Threat, AlertSetting, UserProfile, ChartData, TimeSeriesData, SeverityLevel, ThreatCategory } from '@/types';
import { SEVERITY_LEVELS, THREAT_CATEGORIES } from '@/lib/constants';
import { subDays, formatISO } from 'date-fns';

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T>(arr: readonly T[], maxCount: number = 3): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (maxCount + 1)));
};


export const mockThreats: Threat[] = Array.from({ length: 25 }, (_, i) => {
  const date = subDays(new Date(), i * 2 + Math.floor(Math.random() * 5));
  const category = getRandomElement(THREAT_CATEGORIES);
  const severity = getRandomElement(SEVERITY_LEVELS);
  return {
    id: `threat-${i + 1}`,
    title: `${category} Variant ${String.fromCharCode(65 + (i % 26))}.${i+1} Detected`,
    severity,
    category,
    date: formatISO(date),
    description: `A new variant of ${category.toLowerCase()} has been identified, exhibiting advanced evasion techniques. Initial analysis suggests potential impact on unpatched systems.`,
    source: getRandomElement(['DarkNet Forums', 'Security Vendor X', 'Internal Honeypot', 'Government Agency']),
    detailsForSummary: `Threat ID ${i+1}: A new strain of ${category}, codenamed "${String.fromCharCode(65 + (i % 26))}-${i+1}", was discovered on ${date.toDateString()}. It targets ${getRandomElement(['financial institutions', 'healthcare providers', 'critical infrastructure', 'e-commerce platforms'])} using ${getRandomElement(['spear-phishing emails', 'exploit kits', 'compromised software updates', 'social engineering'])}. Key characteristics include ${getRandomElement(['polymorphic behavior', 'fileless execution', 'data exfiltration capabilities', 'anti-sandbox mechanisms'])}. The severity is rated ${severity} due to its potential for ${getRandomElement(['widespread disruption', 'significant data loss', 'financial damage', 'reputational harm'])}. Organizations are advised to update signatures, patch vulnerabilities, and educate users.`,
    tags: getRandomSubset(['APT', '0-day', 'SpearPhishing', 'Cloud', 'Mobile'], 3),
    status: getRandomElement(['New', 'Investigating', 'Resolved']),
    mitigation: `Apply latest security patches. Monitor network traffic for anomalies. Educate users on phishing. Current mitigation score: ${Math.floor(Math.random() * 100)}%`,
    affectedSystems: getRandomSubset(['Windows Servers', 'Linux Endpoints', 'iOS Devices', 'Cloud Storage', 'Databases'], 2)
  };
});

export const mockAlertSettings: AlertSetting[] = [
  {
    id: 'alert-1',
    name: 'Critical Ransomware Alert',
    riskLevels: ['Critical'],
    categories: ['Ransomware'],
    keywords: ['encrypt', 'payment'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 2)),
  },
  {
    id: 'alert-2',
    name: 'High Severity Phishing',
    riskLevels: ['High', 'Critical'],
    categories: ['Phishing'],
    keywords: ['credentials', 'login', 'urgent'],
    isEnabled: true,
  },
  {
    id: 'alert-3',
    name: 'All Malware Types (Medium+)',
    riskLevels: ['Medium', 'High', 'Critical'],
    categories: ['Malware'],
    keywords: [],
    isEnabled: false,
  },
];

export const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'profile user',
  preferences: {
    notifications: {
      email: true,
      inApp: true,
    }
  }
};


// Analytics Data
export const commonThreatsData: ChartData[] = THREAT_CATEGORIES.slice(0,5).map(category => ({
  name: category,
  value: Math.floor(Math.random() * 100) + 20,
}));

export const severityDistributionData: ChartData[] = SEVERITY_LEVELS.map(level => ({
  name: level,
  value: Math.floor(Math.random() * 50) + 10,
}));

export const threatTrendsData: TimeSeriesData[] = Array.from({ length: 12 }, (_, i) => ({
  date: formatISO(subDays(new Date(), (11-i) * 30), { representation: 'date' }), // monthly for past year
  count: Math.floor(Math.random() * 150) + 50,
}));
