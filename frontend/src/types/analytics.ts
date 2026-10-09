import { Product, ScanEvent } from './product';

export interface DashboardData {
  totalProducts: number;
  publishedProducts: number;
  qrCodesGenerated: number;
  totalViews: number;
  recentProducts: Product[];
  recentScans: ScanEvent[];
  scansTrend: { date: string; scans: number }[];
}

export interface AnalyticsData {
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  dailyTrend: { date: string; scans: number }[];
  topProducts: (Product & { views: number })[];
  latestScans: ScanEvent[];
}
