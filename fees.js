/* Shared fee status chart: the same labels and records in teacher and parent views. */
window.FeesUI=(()=>{
 const labels={paid:'Paid',unpaid:'Unpaid',waived:'Waived',unmarked:'Not recorded',before:'Before joining',future:'Upcoming'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 function status(student,month){if(student.joined&&month<student.joined.slice(0,7))return 'before';const r=(student.fees||[]).find(r=>r.month===month);return r&&['paid','unpaid','waived'].includes(r.status)?r.status:month>today().slice(0,7)?'future':'unmarked';}
 function years(student){const y=Number(today().slice(0,4));return [...new Set([y,y-1,...(student.fees||[]).map(r=>Number(r.month.slice(0,4)))])].filter(n=>n>=2000&&n<=2100).sort((a,b)=>b-a);}
 function chart(student,year){const months=Array.from({length:12},(_,i)=>String(year)+'-'+String(i+1).padStart(2,'0')),counts={paid:0,unpaid:0,waived:0,unmarked:0};months.forEach(m=>{const s=status(student,m);if(s in counts)counts[s]++;});return '<div class="fees-summary"><strong>'+counts.paid+' paid</strong><span>'+counts.unpaid+' unpaid · '+counts.waived+' waived · '+counts.unmarked+' not recorded</span></div><div class="fee-months" role="list" aria-label="Monthly fee status for '+year+'">'+months.map((m,i)=>{const s=status(student,m),name=new Date(m+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'short'});return '<div role="listitem" class="fee-month '+s+'"><span>'+name+'</span><b aria-hidden="true">'+({paid:'✓',unpaid:'!',waived:'−',unmarked:'·',before:'—',future:'◷'}[s])+'</b><small>'+labels[s]+'</small></div>';}).join('')+'</div><p class="fee-caption">Green = paid · Coral = unpaid · Blue = waived · Grey = not recorded. Missing records do not mean unpaid.</p>';}
 return {labels,esc,today,status,years,chart};
})();
