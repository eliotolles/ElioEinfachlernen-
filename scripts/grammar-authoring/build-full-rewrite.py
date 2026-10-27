"""Build a normalized catalogue: 165 topic entries, 42 openly shared teaching units.
Never restore withdrawn content; never access account or database data.
"""
import hashlib,json,runpy
from pathlib import Path

def compile_catalogue(cases):
    root=Path(__file__).resolve().parents[2]
    requested=json.loads((root/'scripts/grammar-authoring/requested-topics.json').read_text())
    levels={}
    for level,labels in requested.items():
        for topic in dict.fromkeys(labels.split('|')):levels.setdefault(topic,[]).append(level)
    groups=runpy.run_path(str(Path(__file__).with_name('rewrite-map.py')))['GROUPS']
    topic_group={t:str(n) for n,labels in groups.items() for t in labels.split('|')}
    expected=set(levels)-{'Akkusativ','Dativ'}
    assert set(topic_group)==expected, sorted(expected-set(topic_group))
    units={}
    for n,labels in groups.items():
        paths=list((root/'content/grammar-rewrite').glob(f'{n:02}-*.md'))
        assert len(paths)==1,n
        text=paths[0].read_text(); title,body=text.split('\n',1)
        assert len(body)>1700,(n,len(body))
        units[str(n)]={'title':title.removeprefix('## '),'content':body.strip(),'topics':labels.split('|')}
    def ex(key,q,answer,explanation):
        assert '___' in q and answer.strip() and len(explanation)>60,(key,q)
        return {'id':'elio-full-q-'+hashlib.sha1(key.encode()).hexdigest()[:12],'type':'fill','question':q,'answers':[answer],'explanation':explanation,'origin':'authored','answerSource':'authored'}
    practice={}; extras={str(n):[] for n in groups}
    for line in (root/'content/grammar-rewrite/practice.tsv').read_text().splitlines():
        topic,q,a,why=line.split('|');assert topic not in practice,topic
        practice[topic]=ex(topic,q,a,why)
    assert set(practice)==expected
    for i,line in enumerate((root/'content/grammar-rewrite/unit-practice.tsv').read_text().splitlines()):
        unit,q,a,why=line.split('|');extras[unit].append(ex(f'unit-{unit}-{i}',q,a,why))
    bank={u:[practice[t] for t in chapter['topics']]+extras[u] for u,chapter in units.items()}
    for u,qs in bank.items():assert len(qs)>=4,(u,len(qs))
    entries=[]
    for topic in levels:
        if topic not in expected:continue
        unit=topic_group[topic]
        # The explanatory focus and question are specific to this indexed topic.
        # Longer related teaching is intentionally shared and labelled as such.
        questions=[practice[topic]]+[q for q in bank[unit] if q['id']!=practice[topic]['id']]
        n=int(unit); group='words' if n<=6 or n in (19,20,34,35,40) else 'verbs' if n in (*range(7,8),10,11,12,13,14,15,26,27,30,31,32,33,36,37,38) else 'relations' if n in (16,17,18,21,22,23,24,25,39) else 'sentences'
        entries.append({'id':'elio-rewrite-'+hashlib.sha1(topic.encode()).hexdigest()[:12],'collectionId':'elio-grammar-atlas-v1','title':topic,'topic':topic,'level':levels[topic][0],'levels':levels[topic],'group':group,'chapterId':unit,'subtitle':units[unit]['title'],'focus':practice[topic]['explanation'],'exerciseIds':[q['id'] for q in questions[:4]],'origin':'elio-independent-rewrite','reviewScope':'Giải thích Việt–Đức biên soạn độc lập. Các mục liên quan dùng chung bài giảng được ghi rõ, không phải các bài riêng biệt hoàn toàn hoặc bản dịch khóa học bên ngoài.'})
    qbyid={q['id']:q for qs in bank.values() for q in qs}
    for case,topic in zip(cases,['Akkusativ','Dativ']):
        case['topic']=topic;case['levels']=levels[topic];case['chapterId']='case-'+topic.lower()
    sources=[{'title':'DeutschAkademie · Danh mục học theo cấp độ','url':'https://www.deutschakademie.de/online-deutschkurs/nach-level/'},{'title':'Goethe-Institut · Deutsche Grammatik','url':'https://www.goethe.de/ins/de/de/prf/grm.html'},{'title':'IDS grammis · Systematische Grammatik','url':'https://grammis.ids-mannheim.de/systematische-grammatik'}]
    special={
      '15':[{'title':'Duden · hängen: trạng thái','url':'https://www.duden.de/rechtschreibung/haengen_gehangen'},{'title':'Duden · hängen: hành động','url':'https://www.duden.de/rechtschreibung/haengen_gehaengt'}],
      '33':[{'title':'IDS grammis · Ersatzinfinitiv','url':'https://grammis.ids-mannheim.de/systematische-grammatik/1615'}],
      '36':[{'title':'LEO · Partizip I và Gerundiv','url':'https://dict.leo.org/grammatik/deutsch/Wort/Verb/Kategorien/Finit-Infinit/Part1.xml?lang=de'},{'title':'DeutschAkademie · Gerundiv','url':'https://www.deutschakademie.de/online-deutschkurs/deutsche-grammatik/wortarten/verben/gerundiv/'}],
      '38':[{'title':'IDS grammis · Gebrauch der Modalverben','url':'https://grammis.ids-mannheim.de/systematische-grammatik/1551'},{'title':'DeutschAkademie · Subjektive Bedeutung','url':'https://www.deutschakademie.de/online-deutschkurs/deutsche-grammatik/wortarten/verben/modalverben/subjektive-bedeutung/'}]
    }
    for item in entries:item['reviewSources']=sources+special.get(item['chapterId'],[])
    asset="'use strict';\n// Independently rewritten teaching; normalized shared units avoid repeated payload.\n"
    for name,value in [('ElioGrammarAtlasUnits',units),('ElioGrammarAtlasQuestions',qbyid),('ElioGrammarAtlasSources',sources)]:asset+='const '+name+'='+json.dumps(value,ensure_ascii=False,separators=(',',':'))+';\n'
    asset+='const ElioGrammarAtlasData='+json.dumps(cases,ensure_ascii=False,separators=(',',':'))+'.concat('+json.dumps(entries,ensure_ascii=False,separators=(',',':'))+'''.map(item=>({...item,content:'## '+item.title+'\\n\\n### Trọng tâm của mục này\\n'+item.focus+'\\n\\n**Bài giảng liên quan:** '+ElioGrammarAtlasUnits[item.chapterId].title+'. Các mục cùng bài giảng dùng chung phần giải thích và ôn tập để dễ đối chiếu.\\n\\n'+ElioGrammarAtlasUnits[item.chapterId].content,exercises:item.exerciseIds.map(id=>ElioGrammarAtlasQuestions[id]),reviewSources:item.reviewSources})));\n'''
    (root/'public/js/grammar-atlas-data.js').write_text(asset)
    unit_rows=[]
    for topic,ls in levels.items():
        unit=topic_group.get(topic,'case-'+topic.lower())
        unit_rows.append(f"| {topic} | {' · '.join(ls)} | {unit} | Có |")
    report='# Đối chiếu phạm vi viết lại ngữ pháp\n\n165 tên chủ điểm duy nhất; 385 vị trí theo cấp độ sau khi bỏ mục lặp trong cùng cấp. 42 bài giảng liên quan (40 bài mới và 2 bài về cách đã làm lại); không gọi đây là 165 bài giảng hoàn toàn khác nhau. Mỗi tên chủ điểm có mục truy cập, trọng tâm và câu luyện riêng. Các câu luyện ôn chung trong cùng bài giảng được dùng lại có chủ đích.\n\nTất cả bài có giải thích ngữ pháp/cách dùng, cấu tạo hoặc khung/bảng, ví dụ Đức–Việt có phân tích, hướng dẫn đặt câu và lưu ý/lỗi. Bài tập mới là biên soạn độc lập; không phải ngân hàng câu hỏi của bên thứ ba. Kiểm tra cấu trúc tự động không thay thế thẩm định sư phạm bởi giáo viên. Không sửa dữ liệu tài khoản.\n\n| Chủ điểm | Cấp trong danh sách người dùng | Bài giảng | Có nội dung và câu luyện |\n| --- | --- | --- | --- |\n'+'\n'.join(unit_rows)+'\n'
    (root/'docs/GRAMMAR-REWRITE-COVERAGE.md').write_text(report)
    print(json.dumps({'topics':len(levels),'levelEntries':sum(map(len,levels.values())),'teachingUnits':len(units)+2,'uniqueQuestions':len(qbyid)+sum(len(c['exercises']) for c in cases),'bytes':len(asset.encode()),'missing':[]},ensure_ascii=False))

if __name__=='__main__':runpy.run_path(str(Path(__file__).with_name('build-reviewed.py')),run_name='__main__')
