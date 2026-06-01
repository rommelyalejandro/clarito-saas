export interface SubstackRow {
  Email: string;
  Type?: string;
  Country?: string;
  'Start date'?: string;
  'Subscription source (free)'?: string;
  'Subscription source (paid)'?: string;
  Activity?: string;
  'Post views'?: string;
  'Post views (30d)'?: string;
  'Post views (7d)'?: string;
  'Shares'?: string;
  'Shares (30d)'?: string;
  'Comments'?: string;
  'Comments (30d)'?: string;
  'Unique posts seen'?: string;
  'Links clicked'?: string;
  'Emails received (6mo)'?: string;
  'Emails opened (6mo)'?: string;
  'Emails opened (30d)'?: string;
  Revenue?: string;
  [key: string]: any;
}

export interface Stats {
  label: string;
  n: number;
  byType: Record<string, number>;
  byCountry: Record<string, number>;
  byMonth: Record<string, number>;
  bySource: Record<string, number>;
  actDist: Record<number, number>;
  pvTotal: number;
  pv30d: number;
  pv7d: number;
  shrTotal: number;
  shr30d: number;
  cmtTotal: number;
  cmt30d: number;
  upsTotal: number;
  emailLinks: number;
  emailOpen30d: number;
  emailRec6mo: number;
  emailOpen6mo: number;
  withPostViews: number;
  withClicks: number;
  withShares: number;
  withComments: number;
  withActive: number;
  totalRev: number;
  paidCount: number;
  avgActivity: number;
  emailOpenRate: number;
  totalActivity: number;
}

export interface AnalysisResult {
  prevStats: Stats;
  actStats: Stats;
  churnStats: Stats;
  newStats: Stats;
  churnedRows: SubstackRow[];
  newRows: SubstackRow[];
  retainedActRows: SubstackRow[];
  retainedPrevRows: SubstackRow[];
  churnedEmails: string[];
  newEmails: string[];
  retainedEmails: string[];
  churnBySource: Record<string, number>;
  churnByType: Record<string, number>;
  churnByCountry: Record<string, number>;
  churnActDist: Record<number, number>;
  newBySource: Record<string, number>;
  prevBySource: Record<string, number>;
  sourceRetention: Record<string, { totalPrev: number; churned: number; retained: number; retRate: number }>;
  retPrevStats: Stats;
  retActStats: Stats;
  churnRate: number;
  retentionRate: number;
  growthRate: number;
  netChange: number;
  diffDays: number;
}

function computeStats(rows: SubstackRow[], label: string): Stats {
  const num = (r: SubstackRow, k: string) => parseFloat(r[k] as string) || 0;
  const rev = (v: any) => parseFloat((v || '').toString().replace(/[$,]/g, '')) || 0;
  
  const n = rows.length;
  const byType: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const byMonth: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const actDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  let pvTotal = 0, pv30d = 0, pv7d = 0;
  let shrTotal = 0, shr30d = 0;
  let cmtTotal = 0, cmt30d = 0;
  let upsTotal = 0;
  let emailLinks = 0, emailOpen30d = 0, emailRec6mo = 0, emailOpen6mo = 0;
  let withPostViews = 0, withClicks = 0, withShares = 0, withComments = 0, withActive = 0;
  let totalRev = 0, paidCount = 0;
  let totalActivity = 0;

  rows.forEach(r => {
    const type = r['Type'] || 'Free';
    byType[type] = (byType[type] || 0) + 1;
    const cc = r['Country'] || 'N/A';
    byCountry[cc] = (byCountry[cc] || 0) + 1;
    const sd = r['Start date'];
    if (sd) { 
      const m = sd.slice(0, 7); 
      byMonth[m] = (byMonth[m] || 0) + 1; 
    }
    const src = r['Subscription source (free)'] || r['Subscription source (paid)'] || 'direct';
    bySource[src] = (bySource[src] || 0) + 1;
    
    const act = Math.min(5, Math.round(num(r, 'Activity')));
    actDist[act] = (actDist[act] || 0) + 1;
    totalActivity += num(r, 'Activity');
    
    pvTotal += num(r, 'Post views');      
    pv30d += num(r, 'Post views (30d)'); 
    pv7d += num(r, 'Post views (7d)');
    shrTotal += num(r, 'Shares');         
    shr30d += num(r, 'Shares (30d)');
    cmtTotal += num(r, 'Comments');       
    cmt30d += num(r, 'Comments (30d)');
    upsTotal += num(r, 'Unique posts seen');
    emailLinks += num(r, 'Links clicked');
    emailRec6mo += num(r, 'Emails received (6mo)');
    emailOpen6mo += num(r, 'Emails opened (6mo)');
    emailOpen30d += num(r, 'Emails opened (30d)');
    
    if (num(r, 'Post views') > 0) withPostViews++;
    if (num(r, 'Links clicked') > 0) withClicks++;
    if (num(r, 'Shares') > 0) withShares++;
    if (num(r, 'Comments') > 0) withComments++;
    if (num(r, 'Activity') > 0) withActive++;
    totalRev += rev(r['Revenue']);
    
    if (type !== 'Free' && type !== 'Author') paidCount++;
  });

  const avgActivity = n > 0 ? totalActivity / n : 0;
  const emailOpenRate = emailRec6mo > 0 ? (emailOpen6mo / emailRec6mo * 100) : 0;

  return { 
    label, n, byType, byCountry, byMonth, bySource, actDist,
    pvTotal, pv30d, pv7d, shrTotal, shr30d, cmtTotal, cmt30d,
    upsTotal, emailLinks, emailOpen30d, emailRec6mo, emailOpen6mo,
    withPostViews, withClicks, withShares, withComments, withActive,
    totalRev, paidCount, avgActivity, emailOpenRate, totalActivity 
  };
}

export function runAnalysis(prevRows: SubstackRow[], actRows: SubstackRow[]): AnalysisResult {
  const prevEmails = new Set(prevRows.map(r => r['Email']));
  const actEmails = new Set(actRows.map(r => r['Email']));

  const churnedEmails = [...prevEmails].filter(e => !actEmails.has(e));
  const churnedRows = prevRows.filter(r => churnedEmails.includes(r['Email']));

  const newEmails = [...actEmails].filter(e => !prevEmails.has(e));
  const newRows = actRows.filter(r => newEmails.includes(r['Email']));

  const retainedEmails = [...actEmails].filter(e => prevEmails.has(e));
  const retainedActRows = actRows.filter(r => retainedEmails.includes(r['Email']));
  const retainedPrevRows = prevRows.filter(r => retainedEmails.includes(r['Email']));

  const prevStats = computeStats(prevRows, 'Período Anterior');
  const actStats = computeStats(actRows, 'Período Actual');

  const churnStats = computeStats(churnedRows, 'Desertores');
  const newStats = computeStats(newRows, 'Nuevos');

  const churnBySource: Record<string, number> = {};
  churnedRows.forEach(r => {
    const src = r['Subscription source (free)'] || r['Subscription source (paid)'] || 'direct';
    churnBySource[src] = (churnBySource[src] || 0) + 1;
  });

  const churnByType: Record<string, number> = {};
  churnedRows.forEach(r => {
    const t = r['Type'] || 'Free';
    churnByType[t] = (churnByType[t] || 0) + 1;
  });

  const churnByCountry: Record<string, number> = {};
  churnedRows.forEach(r => {
    const cc = r['Country'] || 'N/A';
    churnByCountry[cc] = (churnByCountry[cc] || 0) + 1;
  });

  const churnActDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  churnedRows.forEach(r => {
    const act = Math.min(5, Math.round(parseFloat(r['Activity'] as string) || 0));
    churnActDist[act] = (churnActDist[act] || 0) + 1;
  });

  const newBySource: Record<string, number> = {};
  newRows.forEach(r => {
    const src = r['Subscription source (free)'] || r['Subscription source (paid)'] || 'direct';
    newBySource[src] = (newBySource[src] || 0) + 1;
  });

  const retPrevStats = computeStats(retainedPrevRows, 'Retenidos (Antes)');
  const retActStats = computeStats(retainedActRows, 'Retenidos (Ahora)');

  const prevBySource: Record<string, number> = {};
  prevRows.forEach(r => {
    const src = r['Subscription source (free)'] || r['Subscription source (paid)'] || 'direct';
    prevBySource[src] = (prevBySource[src] || 0) + 1;
  });

  const sourceRetention: Record<string, any> = {};
  Object.keys(prevBySource).forEach(src => {
    const totalPrev = prevBySource[src];
    const churned = churnBySource[src] || 0;
    const retained = totalPrev - churned;
    const retRate = totalPrev > 0 ? (retained / totalPrev * 100) : 0;
    sourceRetention[src] = { totalPrev, churned, retained, retRate };
  });

  // Calculate days difference
  const getLastDate = (rows: SubstackRow[]) => {
    let latest: Date | null = null;
    rows.forEach(r => {
      const sd = r['Start date'];
      if(sd) {
        const d = new Date(sd);
        if(!isNaN(d.getTime()) && (!latest || d > latest)) latest = d;
      }
    });
    return latest;
  };
  
  const prevDate = getLastDate(prevRows);
  const actDate = getLastDate(actRows);
  let diffDays = 0;
  if(prevDate && actDate) {
    diffDays = Math.round(Math.abs(actDate.getTime() - prevDate.getTime()) / (1000*60*60*24));
  }

  return {
    prevStats, actStats, churnStats, newStats,
    churnedRows, newRows, retainedActRows, retainedPrevRows,
    churnedEmails, newEmails, retainedEmails,
    churnBySource, churnByType, churnByCountry, churnActDist,
    newBySource, prevBySource, sourceRetention,
    retPrevStats, retActStats,
    churnRate: prevEmails.size > 0 ? (churnedEmails.length / prevEmails.size * 100) : 0,
    retentionRate: prevEmails.size > 0 ? (retainedEmails.length / prevEmails.size * 100) : 0,
    growthRate: prevEmails.size > 0 ? ((actEmails.size - prevEmails.size) / prevEmails.size * 100) : 0,
    netChange: actEmails.size - prevEmails.size,
    diffDays
  };
}
