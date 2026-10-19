"""Build independently authored, structured lessons; never expose raw OCR as a lesson."""
import json,re
from pathlib import Path
p=Path('public/data/grammar-book-a1-b2.json');pack=json.loads(p.read_text());guides=json.loads(Path('scripts/grammar-book-guides.json').read_text());extra=json.loads(Path('scripts/grammar-book-expanded.json').read_text());focus=json.loads(Path('scripts/grammar-book-focus.json').read_text())
for item in pack['items']:
 if item.get('origin')=='authored-supplement':continue
 body='## Mục tiêu bài học\n\nHiểu và sử dụng **'+item['title']+'** trong câu hoàn chỉnh. Học các quy tắc, xem ví dụ rồi làm câu luyện tập phía dưới.\n\n'
 if item['title'] in focus:body+='## '+item['title']+'\n\n'+focus[item['title']]+'\n\n'
 exercises=[]
 for ch in item['sourceChapters']:
  rule,note,examples=guides[str(ch)];section=extra[str(ch)]
  body+='## Quy tắc trọng tâm\n\n'+rule+'\n\n'+note+'\n\n'+section['content']+'\n\n## Ví dụ Đức–Việt\n\n'+'\n\n'.join('- '+line for line in examples.split('\n'))+'\n\n'
  exercises.append(section['exercise'])
  if ch==10:body+='## Bảng chia Modalverben ở Präsens\n\n| Động từ | ich / er / sie / es | du | ihr | wir / sie / Sie |\n| --- | --- | --- | --- | --- |\n| können | kann | kannst | könnt | können |\n| dürfen | darf | darfst | dürft | dürfen |\n| müssen | muss | musst | müsst | müssen |\n| sollen | soll | sollst | sollt | sollen |\n| wollen | will | willst | wollt | wollen |\n| mögen | mag | magst | mögt | mögen |\n| möchten | möchte | möchtest | möchtet | möchten |\n\n'
 body+='## Cách tự kiểm tra\n\n1. Xác định ý muốn diễn đạt và người thực hiện hành động.\n2. Đối chiếu cấu trúc trong bảng; kiểm tra dạng động từ, cách và đuôi nếu có.\n3. Đọc lại cả câu để chắc rằng nghĩa không đổi.\n4. Làm bài tập bên dưới rồi đọc giải thích, kể cả khi trả lời đúng.'
 body=body.replace('Phần nguồn còn có giới từ thời gian và Genitiv.','').replace('đối chiếu phần nâng cao trong nguồn.','phân biệt hai động từ nguyên mẫu.').replace('müssen học','cần học')
 item['content']=body;item['exercises']=exercises;item['origin']='authored-rebuild';item['reviewStatus']='structured-lesson';item.pop('sourceContent',None);item.pop('sourceAnswers',None);item.pop('sourceDocument',None)
overrides=json.loads(Path('scripts/grammar-lesson-overrides.json').read_text())
for item in pack['items']:
 if item['id'] in overrides:
  item.update(overrides[item['id']]);item['topic']=item['title']
  item['content']=item['content'].replace('## Mục tiêu và phạm vi','## Quy tắc trọng tâm').replace('auch quá khứ','cả quá khứ')
audit=json.loads(Path('scripts/grammar-audit-rules.json').read_text())
for item in pack['items']:
 chapters=item.get('sourceChapters',[])
 keys=audit['lessonSources'].get(item['id']) or list(dict.fromkeys(key for ch in chapters for key in audit['chapterSources'][str(ch)]))
 item['reviewSources']=[audit['sources'][key] for key in keys]
 item['reviewedOn']='2026-10-19'
 item['reviewScope']='Quy tắc, phạm vi bảng, ví dụ Đức–Việt và đáp án; cấp độ là lộ trình của Elio.'
 notes=list(dict.fromkeys(audit['chapterNotes'][str(ch)] for ch in chapters))
 if notes:item['content']+='\n\n## Phạm vi và điểm cần nhớ\n\n'+'\n\n'.join('- '+note for note in notes)
 # Spell out grammatical abbreviations instead of forcing learners to guess.
 for short,long in [('Akk','Akkusativ'),('Dat','Dativ'),('Nom','Nominativ'),('Gen','Genitiv')]:
  item['content']=re.sub(r'\b'+short+r'\b\.?',long,item['content'])
pack.pop('sourceAnswerKey',None);pack['packVersion']=5;pack['name']='Elio · Ngữ pháp A1–B2';pack['warnings']=[];pack['description']='64 bài học được biên soạn theo chủ điểm; không phải bản chép toàn bộ sách hay Deutsch.vn.'
p.write_text(json.dumps(pack,ensure_ascii=False,indent=2))
report=['# Rà soát nội dung ngữ pháp Elio — 19/10/2026','', 'Phạm vi: 64 bài trong gói giáo trình do Elio tạo. Không tự thay nội dung người dùng import hoặc bài đã chỉnh tay. Đây là rà soát nội dung bởi trợ lý, không phải chứng nhận của Goethe/IDS hay bảo đảm không còn lỗi.', '', '## Thay đổi', '', '- Tách đuôi tính từ thành ba bảng độc lập: yếu, hỗn hợp, mạnh. Mỗi bảng có bốn cách × bốn nhóm giống/số, kèm giải thích cách chọn bảng, ví dụ phân tích và bài tập.', '- Tách bảng quán từ xác định/không xác định; giải thích ein không có số nhiều.', '- Bổ sung đủ bảng mein trước danh từ, đại từ sở hữu độc lập; phân biệt hai loại.', '- Tách Student/Junge/Herr và số ít/số nhiều; phân biệt Herrn/Herren.', '- Viết rõ phạm vi ba cách của bảng đại từ nhân xưng thay vì trộn hai bảng lặp.', '- Nêu ngoại lệ hậu tố -ieren và Partizip I; không lấy một mẹo làm quy tắc tuyệt đối.', '- Nêu rõ mẫu bewerben um/auf theo Duden, khuyến nghị cách dùng cho thư xin việc.', '- Viết đầy đủ tên cách; bổ sung điểm cần nhớ theo nhóm kiến thức, liên kết nguồn đối chiếu theo bài.', '- Bảng có cột đủ rộng, cuộn ngang và chỉ dẫn; giữ nguyên màu giao diện.', '', '## Ma trận bài và nguồn', '', '| Bài | Chủ điểm | Nguồn đối chiếu |', '| --- | --- | --- |']
for item in pack['items']:report.append('| '+item['id']+' | '+item['title'].replace('|','/')+' | '+'; '.join('['+ref['title']+']('+ref['url']+')' for ref in item['reviewSources'])+' |')
Path('docs').mkdir(exist_ok=True);Path('docs/grammar-content-audit.md').write_text('\n'.join(report))
print(len(pack['items']),p.stat().st_size)
