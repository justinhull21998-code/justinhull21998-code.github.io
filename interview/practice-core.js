'use strict';
// Kept independent of the UI so joined-source filters can be checked directly.
function matchingSources(card, notesById, filters) {
  return card.sources.filter(source => {
    const n=notesById.get(source.note_id);
    return n && (!filters.company || n.companies.includes(filters.company)) && (!filters.year || n.date.startsWith(filters.year));
  });
}
function filterPractice(cards, notesById, filters) {
  const term=filters.search.trim().toLocaleLowerCase();
  return cards.filter(c => !filters.category || c.category===filters.category)
    .map(card => ({card,sources:matchingSources(card,notesById,filters)}))
    .filter(({card,sources}) => sources.length && (!term || [card.question,card.topic||'',card.answer,...card.steps,...sources.flatMap(s=>[...notesById.get(s.note_id).companies,...s.questions])].join('\n').toLocaleLowerCase().includes(term)))
    .sort((a,b)=>filters.sort==='newest' ? latest(b).localeCompare(latest(a)) : filters.sort==='oldest' ? latest(a).localeCompare(latest(b)) : b.sources.length-a.sources.length || latest(b).localeCompare(latest(a)));
  function latest(row){return row.sources.map(s=>notesById.get(s.note_id).date).sort().at(-1);}
}
if(typeof module!=='undefined')module.exports={matchingSources,filterPractice};
