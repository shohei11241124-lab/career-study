import {units,reference} from './textbook.js';
export const START='2026-11-17', EXAM='2027-03-07';
export const dayNumber=d=>Math.round((Date.parse(d+'T00:00:00Z')-Date.parse(START+'T00:00:00Z'))/86400000);
export const addDays=(d,n)=>new Date(Date.parse(d+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
export const phases=[{name:'基礎学習',until:44,minutes:[35,20,5]},{name:'知識定着',until:74,minutes:[25,25,10]},{name:'実践演習',until:99,minutes:[10,40,10]},{name:'直前対策',until:110,minutes:[20,25,15]}];
export function makePlan(){let cursor=0,second=0,weekUnits=[],history=[];return Array.from({length:110},(_,i)=>{
const phase=phases.find(p=>i<p.until),p=phases.indexOf(phase),date=addDays(START,i),weekday=new Date(date+'T00:00:00Z').getUTCDay(),review=i%7===6;
let refs;if(p===0){refs=review?[...weekUnits]:[units[cursor++]];}else if(p===1){refs=review?[...weekUnits]:[units[second++%units.length],units[second++%units.length]];}else{refs=[units[(i-74)*2%units.length],units[((i-74)*2+1)%units.length]];if(review)refs=[...weekUnits,...refs];}
refs=[...new Map(refs.filter(Boolean).map(u=>[u.id+':'+u.start,u])).values()];
if(review)weekUnits=[];else weekUnits.push(...refs);
let titles=p===0?['テキスト学習','対応する一問一答を解き、誤答を確認',i===0?'今日の要点を振り返る':'前日・3日前・7日前の範囲を復習']:p===1?['テキスト2周目・苦手箇所の確認','対応する一問一答・分野別過去問','誤答の解き直し・要点復習']:p===2?['テキストで弱点確認','学科過去問の計時演習（分割）','誤答と関連するテキストを復習']:['テキスト総復習・苦手分野の最終確認','学科過去問・一問一答の誤答再演習','重要事項の最終確認'];
let categories=['学科','学科','学科'];
if(review){titles[0]='週ごとの総復習（今週の教材範囲）';titles[2]='今週の誤答を解き直し、理解が曖昧な点を整理';}
if(p===1&&i%3===0){categories[1]='論述';titles[1]='事例を読み、相談者の問題と支援方針を整理';}
if(p===2){if(i%3===0){categories[1]='面接';titles[1]='ロールプレイと自己評価';}else if(i%3===1){categories[1]='論述';titles[1]='論述答案を時間を計って作成';}}
if(p===3){categories[1]=i%2===0?'論述':'面接';titles[1]=i%2===0?'論述の答案構成と時間配分を練習':'面接の導入・展開・振り返りを練習';}
if(date>='2026-12-01'&&weekday===2){categories[1]='面接';titles[1]='ChatGPTで相談者役とロールプレイ（傾聴・応答の練習）';}
if(date>='2026-12-01'&&weekday===4){categories[1]='論述';titles[1]='論述の事例読解・問題把握・支援方針を答案にまとめる';}
if(date>='2027-02-01'&&weekday===6){categories[1]='面接';titles[1]='時間を計測した模擬面接＋口頭試問（受験団体の試験時間を確認）';}
if(date>='2027-02-20'&&categories[1]==='面接')titles[1]='時間を計測した模擬面接・口頭試問と改善点の確認';
if(i===109)titles[2]='教材の要点を軽く復習し、持ち物・会場を確認';
const prior=[1,3,7].flatMap(n=>history[i-n]?.refs||[]);const reviewRefs=review?refs:[...new Map(prior.map(u=>[u.id+':'+u.start,u])).values()];
const result={date,phase:p,review,refs,tasks:titles.map((title,j)=>({id:`${i}-${j}`,category:categories[j],title,minutes:phase.minutes[j],refs:categories[j]==='学科'?(j===2&&reviewRefs.length?reviewRefs:refs):[],kind:j===0?'text':j===1?'practice':'review'}))};history.push(result);return result;});}
export const plan=makePlan();
// Upgrade old placeholders for display without changing record IDs or user edits.
export function resolveTasks(date,edited){const day=plan.find(p=>p.date===date);if(!day)return edited||[];return (edited||day.tasks).map((t,i)=>{const replacement=day.tasks[i];const placeholder=/学習ブロック\s*\d+|範囲は目次登録後|仮テーマ|テキストを順に学習|対応する一問一答を解き、誤答を確認|前日・3日前・7日前の学習を復習/.test(t.title);const category=placeholder&&replacement?replacement.category:t.category;return {...t,...(placeholder&&replacement?{title:replacement.title,category}:{}),refs:category==='学科'?(replacement?.refs.length?replacement.refs:day.refs):[],kind:t.kind||replacement?.kind};});}
export {reference};
