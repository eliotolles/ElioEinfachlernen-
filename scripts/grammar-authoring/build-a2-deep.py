"""Build the reviewed A2 batch without modifying the other 56 lesson objects."""
import json,runpy,sys
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=Path(sys.argv[1]) if len(sys.argv)>1 else root/'public/data/grammar-book-a1-b2.json'
pack=json.loads(source.read_text())
revisions=runpy.run_path(str(Path(__file__).with_name('a2-deep.py')))['LESSONS']
headings=['Bản chất & cơ chế vận hành','Bảng tổng hợp quy tắc','Tips học nhanh & mẹo ghi nhớ','Dấu hiệu nhận biết','Ví dụ thực tế & phân tích','Cạm bẫy thường gặp']
for item in pack['items']:
    revision=revisions.get(item['id'])
    if not revision:continue
    item['content']='## '+item['title']+'\n\n**Phạm vi:** '+revision['scope']+'\n\n'+'\n\n'.join('### '+str(i+1)+'. '+h+'\n\n'+s for i,(h,s) in enumerate(zip(headings,revision['sections'])))
    exercises=[]
    fill_count=0
    for index,(question,answer,explanation,wrong1,wrong2) in enumerate(revision['questions']):
        fill='___' in question and fill_count<5
        if fill:fill_count+=1
        ex={'id':item['id']+'-deep-'+str(index+1),'type':'fill' if fill else 'quiz','question':question,'answers':[answer],'explanation':explanation,'origin':'authored','answerSource':'authored'}
        if not fill:
            options=[answer,wrong1,wrong2]
            # Rotate correct answers so the first option is not always correct.
            shift=index%3;ex['options']=options[shift:]+options[:shift]
        exercises.append(ex)
    item['exercises']=exercises
    item['contentRevision']='a2-deep-2026-10-21'
    item['reviewStatus']='authored-detailed-batch'
    item['reviewedOn']='2026-10-21'
    item['reviewScope']='Biên soạn riêng, rà soát thủ công cấu trúc và đáp án. Không phải chứng nhận không có sai sót; phạm vi cấp độ theo lộ trình Elio.'
    item['origin']='authored-deep-revision'
    item.pop('sourceContent',None)
    # References are targeted aids, not a claim to reproduce or audit an entire source.
    refs={6:[('IDS · Plusquamperfekt','https://grammis.ids-mannheim.de/sgt/2228?termini=term')],7:[('IDS · Satzklammer','https://grammis.ids-mannheim.de/progr%40mm/5298')],8:[('IDS · Hilfsverben','https://grammis.ids-mannheim.de/sgt/2198?termini=both')],9:[('IDS · Tempus','https://grammis.ids-mannheim.de/progr%40mm/6905')],10:[('IDS · sein/haben mit zu','https://grammis.ids-mannheim.de/systematische-grammatik/1559')],11:[('IDS · Possessiv-Pronomen','https://grammis.ids-mannheim.de/systematische-grammatik/385')],12:[('LEO · Reflexivpronomen','https://dict.leo.org/grammatik/deutsch/Wort/Pronomen/FRegeln-P/Pron-Refl.xml?lang=de')],13:[('IDS · Kasus','https://grammis.ids-mannheim.de/sgt/2218?termini=term')]}
    item['reviewSources']=[{'title':t,'url':u} for t,u in refs[int(item['id'].split('-')[-1])]]
pack['packVersion']=6
pack['revisionTargets']=list(revisions)
pack['description']='64 chủ điểm; đợt 21/10/2026 cập nhật riêng A2 bài 6–13, mỗi bài 10 câu. Không thay A1, A2 bài 1–5 hoặc bài đã chỉnh tay.'
out=root/'public/data/grammar-book-a1-b2.json'
out.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
original=json.loads(source.read_text())
by_id={x['id']:x for x in original['items']}
for item in pack['items']:
    if item['id'] not in revisions:assert item==by_id[item['id']],item['id']
assert len(pack['items'])==64 and len(revisions)==8
for item in pack['items']:
    if item['id'] not in revisions:continue
    assert len(item['exercises'])>=10
    assert all('### '+str(i+1)+'. '+h in item['content'] for i,h in enumerate(headings))
    assert len({e['question'] for e in item['exercises']})==len(item['exercises'])
    assert all(e['answers'] and e['explanation'] for e in item['exercises'])
    assert all(e['answers'][0] in e['options'] for e in item['exercises'] if e['type']=='quiz')
print('8 revised lessons, 80 exercises; 56 other lesson objects unchanged.')
