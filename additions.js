export const statuses=['未着手','進行中','完了'];
export function initialEvents(){return [
{id:'paper-prepare',category:'受験手続き',title:'実務経験証明書の記載内容を整理',date:'2026-11-17',end:'2026-11-22'},
{id:'paper-request',category:'受験手続き',title:'社長に証明書の記入・署名等を依頼',date:'2026-11-24',end:'2026-11-27'},
{id:'paper-check',category:'受験手続き',title:'証明書の完成・内容確認',date:'2026-11-30',end:'2026-11-30'},
{id:'paper-docs',category:'受験手続き',title:'申請書類の確認',date:'2026-12-01',end:'2026-12-10'},
{id:'paper-apply',category:'受験手続き',title:'受験申請（公式の受付期間を要確認）',date:'2026-12-11',end:'2026-12-20'},
{id:'fukuoka-jan',category:'対面講座',title:'福岡・対面ロールプレイ講座（1月・日付未定）',date:'',end:'',month:'2027-01'},
{id:'fukuoka-feb',category:'対面講座',title:'福岡・対面ロールプレイ講座（2月・日付未定）',date:'',end:'',month:'2027-02'}
].map(e=>({...e,status:'未着手',tentative:true,important:true,booking:'未予約',place:e.category==='対面講座'?'福岡（会場未定）':'',cost:'',feedback:'',memo:'',month:e.month||''}));}
export function eventsOn(events,d){return events.filter(e=>e.date&&e.date<=d&&(e.end||e.date)>=d)}
export function upcoming(events,d,addDays){return events.filter(e=>e.important&&e.status!=='完了'&&e.date&&e.date<=addDays(d,7)).sort((a,b)=>(a.end||a.date).localeCompare(b.end||b.date))}
export function procedureProgress(events){const p=events.filter(e=>e.category==='受験手続き');return p.length?Math.round(p.filter(e=>e.status==='完了').length/p.length*100):0}
