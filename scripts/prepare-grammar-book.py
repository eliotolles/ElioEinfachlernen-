"""Prepare the user-supplied PDF as a reviewable grammar pack. Never calls AI."""
import json,re,hashlib,sys
from pathlib import Path
import fitz
source=Path(sys.argv[1]);doc=fitz.open(source)
starts=[5,7,16,26,33,41,46,58,73,81,87,94,98,124,140,152,167,183,187,198,213,218,223,229,239,244,254,260,267,292,319,330,346,359,367,381,392]
names=['Personalpronomen – Đại từ nhân xưng sơ nhập','Präsens – Chia động từ hiện tại','Artikel und Nomen – Quán từ và danh từ','Trennbare und untrennbare Verben – Động từ tách và không tách','Imperativ – Mệnh lệnh thức','Fragen – Câu hỏi','Artikelwörter – Các loại quán từ','Verben mit Nominativ, Akkusativ und Dativ','Negation – nicht và kein','Personalpronomen – Đại từ nhân xưng nâng cao','Modalverben – Động từ khuyết thiếu','Konjunktionen – Liên từ nối câu chính','Präpositionen – Giới từ','Adjektivdeklination – Chia đuôi tính từ','Komparativ und Superlativ – So sánh','Perfekt – Quá khứ hội thoại','Präteritum – Quá khứ đơn','Plusquamperfekt – Quá khứ trước','Nebensätze – Các loại câu phụ','Passiv – Thể bị động','Futur I – Thì tương lai','Passiversatzformen – Dạng thay thế bị động','Possessivpronomen – Đại từ sở hữu','Reflexivpronomen und reflexive Verben','Genitiv – Sở hữu cách','N-Deklination – Biến cách danh từ yếu','Relativsätze – Mệnh đề quan hệ','Doppelkonjunktionen – Liên từ đôi','Verben und Adjektive mit Präpositionen','Verwechselbare Wörter – Những từ dễ nhầm','Wortstellung – Trật tự từ','Konjunktiv II','Infinitiv mit zu – Cấu trúc nguyên mẫu','lassen, brauchen, werden','Partizip I und II','Konjunktiv I']
noise=['Jürgen Alexandre','deutschlernmaterialien','KHÔNG dùng cho mục đích kiếm tiền','NICHT für Monetarisierungszwecke','NOT used for monetization purposes']
def blocks(page):
 out=[]
 for b in page.get_text('blocks'):
  text=b[4].strip()
  if any(n in text for n in noise):continue
  if re.fullmatch(r'[~—–\-\s]*\d{1,3}[~—–\-\s]*',text) and (b[1]<30 or b[1]>page.rect.height-35):continue
  lines=[x.strip() for x in text.splitlines() if x.strip()]
  if not lines:continue
  if any(re.search(r'Ngữ pháp.*[ĐđDd]ức.*(hiểu|hiều)',x,re.I) for x in lines) and len(text)<160:continue
  if re.search(r'w\s*w\s*w\s*\.',text,re.I) and len(text)<120:continue
  out.append(lines)
 return out

def tablecells(lines):
 return 2<=len(lines)<=8 and all(len(x)<48 and len(x.split())<8 and not re.match(r'[*•★]|Bài\s|Chương\s',x) for x in lines)
def markdown(page):
 bs=blocks(page);out=[];i=0
 while i<len(bs):
  group=[];j=i
  while j<len(bs) and tablecells(bs[j]):group.append(bs[j]);j+=1
  lengths=[len(r) for r in group]
  if len(group)>=3 and len(set(lengths[1:]))==1 and abs(lengths[0]-lengths[1])<=1:
   width=max(lengths);rows=[(['']*(width-len(r))+r) for r in group]
   def row(r):return '| '+' | '.join(c.replace('|','\\|') for c in r)+' |'
   out.extend([row(rows[0]),'| '+' | '.join('---' for _ in range(width))+' |']+[row(r) for r in rows[1:]]);out.append('');i=j;continue
  lines=bs[i];text=' '.join(lines)
  if re.match(r'^[★☆]\s*',text):out.append('### '+re.sub(r'^[★☆]\s*','',text))
  elif re.match(r'^Bài\s*(tập|\d)',text,re.I) and len(text)<200:out.append('### '+text)
  else:
   paragraph=[]
   for line in lines:
    if re.match(r'^[*•]\s+',line):
     if paragraph:out.append(' '.join(paragraph));paragraph=[]
     paragraph.append('- '+re.sub(r'^[*•]\s+','',line))
    else:paragraph.append(line)
   if paragraph:out.append(' '.join(paragraph))
  out.append('');i+=1
 return '\n\n'.join(out).strip()
chapters=[]
for ch in range(36):
 pages=[{'pdfPage':i+1,'bookPage':i,'content':markdown(doc[i])} for i in range(starts[ch],starts[ch+1])]
 chapters.append({'chapter':ch,'title':names[ch],'bookPages':[starts[ch],starts[ch+1]-1],'pdfPages':[starts[ch]+1,starts[ch+1]],'pages':pages})
# OCR answer headings vary; collect the raw source by chapter, never invent keys.
answers={};current=None
for idx in range(392,416):
 text='\n'.join(' '.join(b) for b in blocks(doc[idx]))
 for line in text.splitlines():
  m=re.search(r'(?:Ch[ưuư].*?|Chirwng)\s+(\d{1,2})\b',line,re.I)
  if m and (line.strip().startswith('★') or len(line)<45):current=int(m.group(1))
  if current is not None:answers.setdefault(current,[]).append(line)
for ch in chapters:ch['answerText']='\n'.join(answers.get(ch['chapter'],[]));ch['answerExtraction']='OCR; không dùng làm đáp án chấm tự động'
# Catalog topics observed in the public level menus, not copied lesson articles.
levels={
'A1':[(names[1],[1]),(names[2],[2]),('W-Fragen und Ja/Nein-Fragen',[5]),('Kasus – Nominativ, Akkusativ, Dativ',[7]),(names[10],[10]),(names[3],[3]),(names[4],[4]),(names[12],[12]),(names[8],[8]),(names[11],[11]),(names[6],[6]),('Personalpronomen – Đại từ nhân xưng',[0,9])],
'A2':[(names[15],[15]),(names[13],[13]),(names[14],[14]),('Perfekt – Ôn tập chi tiết',[15]),(names[16],[16]),(names[17],[17]),(names[18],[18]),(names[19],[19]),('Futur I und II – Tương lai',[20]),(names[21],[21]),(names[22],[22]),(names[23],[23]),(names[24],[24])],
'B1':[(names[25],[25]),(names[26],[26]),(names[27],[27]),(names[28],[28]),(names[31],[31]),(names[33],[33]),(names[30],[30]),('Verwechselbare Wörter – Phần 1',[29]),('Verwechselbare Wörter – Phần 2',[29]),('Verwechselbare Wörter – Phần 3',[29]),('Verwechselbare Wörter – Phần 4',[29]),(names[34],[34]),(names[35],[35]),(names[32],[32]),('Verben mit festen Präpositionen',[28]),('Adjektive mit Präpositionen',[28]),('Verben mit zwei Objekten',[7])],
'B2':[('Konjunktiv II – Hiện tại và quá khứ',[31]),('Doppelkonnektoren',[27]),('Infinitivkonstruktionen mit zu',[32]),('Relativsätze mit Präpositionen',[26]),('Indirekte Rede',[35]),('Passiv – Cơ bản và nâng cao',[19,21]),('Partizipien als Adjektive',[34]),('Redemittel für Argumentationen',[]),('Wortbildung',[]),('Nominalisierung',[]),('Temporale und kausale Konnektoren',[18]),('Zustandspassiv und erweitertes Passiv',[19]),('Argumentative Texte',[]),('Konzessive Nebensätze',[18]),('Konditionale Nebensätze',[18]),('Präpositionen mit Genitiv',[12]),('N-Deklination – Ôn tập nâng cao',[25]),('Konsekutive Nebensätze',[18]),('Modale Nebensätze',[18]),('Futur I und II – Tương lai và phỏng đoán',[20]),('Subjekt- und Objektsätze',[18]),('Satzstellung – Vorfeld, Mittelfeld, Nachfeld',[30])]
}
notes={20:'Chương nguồn có tiêu đề Futur I. Không tự coi chương này là giáo trình đầy đủ về Futur II; phần Futur II cần bổ sung riêng.'}
items=[];missing=[]
for level,topics in levels.items():
 for n,(title,chs) in enumerate(topics,1):
  if not chs:missing.append({'level':level,'title':title,'reason':'Không có chương tương ứng riêng trong mục lục PDF; chưa tạo bài từ nguồn này.'});continue
  chosen=[]
  for num in chs:
   pages=chapters[num]['pages']
   if num==29 and 'Phần ' in title:
    part=int(title[-1]);lo=(len(pages)*(part-1))//4;hi=(len(pages)*part)//4;pages=pages[lo:hi]
   chosen.extend(pages)
  content=f'## Hướng dẫn đọc\n\nChủ điểm **{title}** được xếp ở **{level}** theo danh mục Deutsch.vn. Đây là cách sắp xếp của website tham khảo, không phải chứng nhận CEFR cho từng đoạn trong sách.\n\nNội dung phía dưới chuyển từ PDF người dùng cung cấp, giữ dấu trang để đối chiếu. Một chương có thể chứa cả kiến thức nền và phần mở rộng. Lỗi OCR có thể làm sai dấu hoặc ô bảng; nội dung chưa được duyệt toàn bộ.\n\n'
  for ch in chs:
   if ch in notes:content+='> '+notes[ch]+'\n\n'
  for page in chosen:content+=f"## Trang sách {page['bookPage']} · PDF {page['pdfPage']}\n\n{page['content']}\n\n"
  # Correct one verified OCR error using the rendered source, not guesswork.
  content=content.replace('| müssen | muss | musst | musst | müssen |','| müssen | muss | musst | müsst | müssen |')
  items.append({'id':f'book-dtd-{level.lower()}-{n:02d}','title':title,'topic':title,'level':level,'content':content.strip(),'exercises':[],'sourceChapters':chs,'sourcePage':chosen[0]['pdfPage'],'sourcePages':[p['pdfPage'] for p in chosen],'sourceDocument':'Ngữ pháp tiếng Đức theo cách dễ hiểu – Trần Khắc Đạt','levelSource':f'https://deutsch.vn/{level.lower()}niveau','reviewStatus':'needs-ocr-review','sourceAnswers':'\n\n'.join(chapters[c]['answerText'] for c in chs),'tag':f'book-{level.lower()}-{n:02d}'})
guides=json.loads(Path('scripts/grammar-book-guides.json').read_text());focus=json.loads(Path('scripts/grammar-book-focus.json').read_text())
for item in items:
 raw=item['content'];item['sourceContent']=raw
 body='## Chủ điểm và cấp độ\n\n**'+item['title']+' · '+item['level']+'**. Cấp độ theo danh mục Deutsch.vn; nội dung biên soạn từ các chủ điểm của PDF người dùng cung cấp.\n\n'
 if item['title'] in focus:body+='## Nội dung chuyên đề\n\n'+focus[item['title']]+'\n\n'
 for ch in item['sourceChapters']:
  rule,note,examples=guides[str(ch)]
  body+='## '+chapters[ch]['title']+'\n\n### Quy tắc trọng tâm\n\n'+rule+'\n\n### Điểm cần phân biệt\n\n'+note+'\n\n### Ví dụ Đức–Việt\n\n'+'\n\n'.join('- '+line for line in examples.split('\n'))+'\n\n'
 if 10 in item['sourceChapters']:
  body+='## Bảng Modalverben ở Präsens\n\n| Động từ | ich / er / sie / es | du | ihr | wir / sie / Sie |\n| --- | --- | --- | --- | --- |\n| können | kann | kannst | könnt | können |\n| dürfen | darf | darfst | dürft | dürfen |\n| müssen | muss | musst | müsst | müssen |\n| sollen | soll | sollst | sollt | sollen |\n| wollen | will | willst | wollt | wollen |\n| mögen | mag | magst | mögt | mögen |\n| möchten | möchte | möchtest | möchtet | möchten |\n\n'
 body+='## Đọc tiếp trong sách\n\nBản chuyển chữ theo từng trang và lời giải nguồn nằm trong phần mở rộng phía dưới. Bản OCR còn lỗi; không dùng lời giải chưa kiểm tra để chấm điểm tự động.\n\n'
 if 20 in item['sourceChapters']:body+='> '+notes[20]+'\n'
 item['content']=body.strip();item['reviewStatus']='guide-with-unverified-source-ocr';item.pop('sourceAnswers',None)
pack={'id':'elio-user-grammar-book-v1','name':'Ngữ pháp từ PDF · A1–B2','type':'grammar','source':{'filename':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'author':'Trần Khắc Đạt','title':'Ngữ pháp tiếng Đức theo cách dễ hiểu','pdfPages':len(doc),'originalFileStored':False},'warnings':['Lớp chữ OCR chứa lỗi. Đây là bản chuyển đổi cần rà soát, không phải bản sách đã hiệu đính.','Bài tập và lời giải nguồn giữ dạng đọc; không tự sinh đáp án chấm điểm.','Cấp độ theo danh mục Deutsch.vn; một chương tham khảo có thể bao gồm nhiều mức.'],'missingTopics':missing,'sourceAnswerKey':'\n\n'.join('## PDF '+str(i+1)+' · Trang sách '+str(i)+'\n\n'+markdown(doc[i]) for i in range(392,416)),'items':items}
items.extend(json.loads(Path('scripts/grammar-book-supplements.json').read_text()))
items.sort(key=lambda item:item['id'])
pack['packVersion']=2
pack['missingTopics']=[]
Path('public/data/grammar-book-a1-b2.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2))
Path('/tmp/grammar-book-chapters.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2))
print(json.dumps({'lessons':len(items),'levels':{l:sum(i['level']==l for i in items) for l in levels},'chaptersCovered':sorted(set(c for i in items for c in i['sourceChapters'])),'missing':missing,'bytes':Path('public/data/grammar-book-a1-b2.json').stat().st_size},ensure_ascii=False))
