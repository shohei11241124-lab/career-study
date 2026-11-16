export const START='2026-11-17', EXAM='2027-03-07';
export const dayNumber=d=>Math.round((Date.parse(d+'T00:00:00Z')-Date.parse(START+'T00:00:00Z'))/86400000);
export const addDays=(d,n)=>new Date(Date.parse(d+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
export const phases=[{name:'基礎学習',until:44,minutes:[35,20,5]},{name:'知識定着',until:74,minutes:[25,25,10]},{name:'実践演習',until:99,minutes:[10,40,10]},{name:'直前対策',until:110,minutes:[20,25,15]}];
const topics=['キャリアコンサルティングの役割','キャリア理論','カウンセリング理論','職業能力開発','労働市場と雇用','労働関係法令','社会保障と生活','相談過程とスキル','アセスメント','多様な相談者への支援','倫理と専門性'];
export function makePlan(){return Array.from({length:110},(_,i)=>{const phase=phases.find(p=>i<p.until), p=phases.indexOf(phase),topic=topics[Math.floor(i/4)%topics.length];let tasks;
if(p===0)tasks=[['学科',`テキストを順に学習（範囲は目次登録後に設定）`],['学科','対応する一問一答を解き、誤答を確認'],['学科',i===0?'学習の準備と理解したことを振り返る':'前日・3日前・7日前の学習を復習']];
if(p===1)tasks=[['学科',`2周目・重点復習：${topic}（仮テーマ）`],[i%3===0?'論述':'学科',i%3===0?'事例を読み、相談者の問題と支援方針を整理':'分野別過去問を解き、根拠を確認'],['学科','間違えた問題を解き直す']];
if(p===2)tasks=[['学科',`弱点確認：${topic}（仮テーマ）`],[i%3===0?'面接':i%3===1?'論述':'学科',i%3===0?'ロールプレイと自己評価':i%3===1?'論述答案を時間を計って作成':'学科過去問を時間を計って解く（分割演習）'],['学科','誤答・練習の改善点を振り返る']];
if(p===3)tasks=[['学科','総復習・苦手分野の最終確認'],[i%2===0?'論述':'面接',i%2===0?'論述の答案構成と時間配分を練習':'面接の導入・展開・振り返りを練習'],['学科',i===109?'持ち物・会場を確認し、軽い復習で終える':'間違えやすい事項を最終確認']];
const date=addDays(START,i), weekday=new Date(date+'T00:00:00Z').getUTCDay();
if(date>='2026-12-01'&&weekday===2) tasks[1]=['面接','ChatGPTで相談者役とロールプレイ（傾聴・応答の練習）'];
if(date>='2026-12-01'&&weekday===4) tasks[1]=['論述','論述の事例読解・問題把握・支援方針を答案にまとめる'];
if(date>='2027-02-01'&&weekday===6) tasks[1]=['面接','時間を計測した模擬面接＋口頭試問（受験団体の試験時間を確認）'];
if(date>='2027-02-20'&&tasks[1][0]==='面接') tasks[1]=['面接','時間を計測した模擬面接・口頭試問と改善点の確認'];
return {date:addDays(START,i),phase:p,tasks:tasks.map(([category,title],j)=>({id:`${i}-${j}`,category,title,minutes:phase.minutes[j]}))};});}
export const plan=makePlan();
