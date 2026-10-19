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
pack.pop('sourceAnswerKey',None);pack['packVersion']=4;pack['name']='Elio · Ngữ pháp A1–B2';pack['warnings']=[];pack['description']='64 bài học được biên soạn theo chủ điểm; không phải bản chép toàn bộ sách hay Deutsch.vn.'
p.write_text(json.dumps(pack,ensure_ascii=False,indent=2));print(len(pack['items']),p.stat().st_size)
