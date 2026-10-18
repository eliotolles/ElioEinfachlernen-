'use strict';
// Render a restricted Markdown subset. Source HTML is always escaped.
const LearningContent={
 inline(value){return esc(String(value??'')).replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_\n]+)__/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');},
 cells(line){let text=String(line).trim();if(text.startsWith('|'))text=text.slice(1);if(text.endsWith('|')&&!text.endsWith('\\|'))text=text.slice(0,-1);const cells=[];let cell='',escaped=false;for(const ch of text){if(ch==='|'&&!escaped){cells.push(cell.trim());cell='';}else{if(ch==='\\'&&!escaped){escaped=true;continue;}if(escaped&&ch!=='|'&&ch!=='\\')cell+='\\';cell+=ch;escaped=false;}}if(escaped)cell+='\\';cells.push(cell.trim());return cells;},
 row(line){return String(line||'').includes('|')&&this.cells(line).length>1;},
 divider(line){return this.row(line)&&this.cells(line).every(c=>/^:?-{3,}:?$/.test(c.replace(/\s/g,'')));},
 render(value){const lines=String(value??'').replace(/\r\n?/g,'\n').split('\n'),html=[];let i=0;const inline=v=>this.inline(v);
 while(i<lines.length){let line=lines[i];if(!line.trim()){i++;continue;}
 // Accept blank lines between PDF-extracted table rows.
 let next=i+1;while(next<lines.length&&!lines[next].trim())next++;
 if(this.row(line)&&(this.divider(lines[next])||this.row(lines[next])&&line.trim().startsWith('|'))){const rows=[this.cells(line)];let header=false;i++;while(i<lines.length){if(!lines[i].trim()){let j=i;while(j<lines.length&&!lines[j].trim())j++;if(this.row(lines[j])){i=j;continue;}break;}if(!this.row(lines[i]))break;if(this.divider(lines[i])){if(rows.length===1)header=true;}else rows.push(this.cells(lines[i]));i++;}const width=Math.max(...rows.map(r=>r.length)),row=(cells,tag)=>'<tr>'+Array.from({length:width},(_,n)=>'<'+tag+(tag==='th'?' scope="col"':'')+'>'+inline(cells[n]||'')+'</'+tag+'>').join('')+'</tr>';html.push('<div class="learning-table-wrap" tabindex="0" role="region" aria-label="Bảng / Table / Tabelle"><table class="learning-table">'+(header?'<thead>'+row(rows[0],'th')+'</thead>':'')+'<tbody>'+rows.slice(header?1:0).map(r=>row(r,'td')).join('')+'</tbody></table></div>');continue;}
 const heading=line.match(/^\s*(#{1,6})\s+(.+)$/);if(heading){const level=Math.min(heading[1].length+1,6);html.push('<h'+level+'>'+inline(heading[2])+'</h'+level+'>');i++;continue;}
 if(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)){html.push('<hr>');i++;continue;}
 if(/^\s*>\s?/.test(line)){const group=[];while(i<lines.length&&/^\s*>\s?/.test(lines[i]))group.push(lines[i++].replace(/^\s*>\s?/,''));html.push('<blockquote>'+group.map(inline).join('<br>')+'</blockquote>');continue;}
 const bullet=line.match(/^\s*(?:[-*•]\s+|\d+[.)]\s+)/);if(bullet){const ordered=/^\s*\d/.test(line),tag=ordered?'ol':'ul',items=[];while(i<lines.length){const match=lines[i].match(ordered?/^\s*(\d+)[.)]\s+(.+)$/:/^\s*[-*•]\s+(.+)$/);if(!match)break;items.push('<li'+(ordered?' value="'+Number(match[1])+'"':'')+'>'+inline(match[ordered?2:1])+'</li>');i++;}html.push('<'+tag+'>'+items.join('')+'</'+tag+'>');continue;}
 const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^\s*(?:#{1,6}\s|[-*•]\s|\d+[.)]\s|>)/.test(lines[i])&&!this.row(lines[i]))paragraph.push(lines[i++]);html.push('<p'+(/^(?:Ví dụ|Beispiel|Example)\s*:/i.test(line.trim())?' class="learning-example"':'')+'>'+paragraph.map(inline).join('<br>')+'</p>');
 }
 return html.join('');
 },
 set(node,value){if(!node)return;node.classList.add('formatted-content');node.innerHTML=this.render(value);}
};
