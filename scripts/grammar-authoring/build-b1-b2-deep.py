"""Build 39 independently authored B1/B2 revisions, preserving A1/A2 verbatim."""
import json,re,runpy,sys
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=Path(sys.argv[1]) if len(sys.argv)>1 else root/'public/data/grammar-book-a1-b2.json'
pack=json.loads(source.read_text());before=json.loads(source.read_text())
revisions={}
for name in ['b1-deep.py','b2-deep.py']:revisions.update(runpy.run_path(str(Path(__file__).with_name(name)))['LESSONS'])
reference_tables=json.loads(Path(__file__).with_name('tables-b1-b2.json').read_text())
extra_tables={
'book-dtd-b1-05':'''| Ngôi | haben | sein | können | würde + nguyên mẫu |
|---|---|---|---|---|
| ich | hätte | wäre | könnte | würde |
| du | hättest | wärst | könntest | würdest |
| er/sie/es | hätte | wäre | könnte | würde |
| wir | hätten | wären | könnten | würden |
| ihr | hättet | wärt | könntet | würdet |
| sie/Sie | hätten | wären | könnten | würden |''',
'book-dtd-b1-04':'''| Giới từ gốc | Hỏi sự việc | Thay sự việc | Hỏi người theo khung |
|---|---|---|---|
| an + Akkusativ | woran | daran | an wen |
| auf + Akkusativ | worauf | darauf | auf wen |
| über + Akkusativ | worüber | darüber | über wen |
| mit + Dativ | womit | damit | mit wem |
| von + Dativ | wovon | davon | von wem |
| für + Akkusativ | wofür | dafür | für wen |''',
'book-dtd-b1-09':'''| Động từ | Präteritum | Partizip II |
|---|---|---|
| bringen | brachte | gebracht |
| holen | holte | geholt |
| leihen | lieh | geliehen |
| ausleihen | lieh aus | ausgeliehen |''',
'book-dtd-b1-11':'''| Vị trí/tư thế | Präteritum | Partizip II | Đặt tới vị trí | Präteritum | Partizip II |
|---|---|---|---|---|---|
| liegen | lag | gelegen | legen | legte | gelegt |
| stehen | stand | gestanden | stellen | stellte | gestellt |
| sitzen | saß | gesessen | setzen | setzte | gesetzt |''',
'book-dtd-b1-15':'''| Khung bổ sung | Cách | Ví dụ Đức–Việt |
|---|---|---|
| sich kümmern um | Akkusativ | Sie kümmert sich um ihren Vater. — Cô ấy chăm lo cho cha. |
| abhängen von | Dativ | Es hängt vom Wetter ab. — Điều đó phụ thuộc thời tiết. |
| sich beschäftigen mit | Dativ | Wir beschäftigen uns mit dem Problem. — Chúng tôi giải quyết/tìm hiểu vấn đề này. |
| sich freuen auf | Akkusativ | Ich freue mich auf den Urlaub. — Tôi mong chờ kỳ nghỉ. |
| sich freuen über | Akkusativ | Ich freue mich über das Geschenk. — Tôi vui vì món quà. |
| sich bewerben bei | Dativ | Sie bewirbt sich bei einer Firma. — Cô ấy ứng tuyển tại một công ty. |''',
'book-dtd-b1-16':'''| Khung bổ sung | Cách | Ví dụ Đức–Việt |
|---|---|---|
| abhängig von | Dativ | Er ist von seinen Eltern abhängig. — Anh ấy phụ thuộc cha mẹ. |
| freundlich zu | Dativ | Sie ist freundlich zu den Gästen. — Cô ấy thân thiện với khách. |
| geeignet für | Akkusativ | Das ist für Anfänger geeignet. — Điều đó phù hợp người mới. |''',
'book-dtd-b2-04':'''| Chủ sở hữu được bổ nghĩa | Đại từ Genitiv | Ví dụ |
|---|---|---|
| Maskulin số ít | dessen | der Mann, dessen Tochter … |
| Feminin số ít | deren | die Frau, deren Sohn … |
| Neutrum số ít | dessen | das Kind, dessen Fahrrad … |
| Plural | deren | die Leute, deren Namen … |''',
'book-dtd-b2-09':'''| Cơ chế | Quy tắc giới hạn | Ví dụ Đức–Việt |
|---|---|---|
| ghép danh từ | thành phần cuối quyết định giống | das Schulbuch — sách học; die Sprachschule — trường ngôn ngữ |
| -ung | thường danh từ cái | die Entscheidung — quyết định |
| -heit/-keit | thường danh từ cái | die Freiheit — tự do; die Möglichkeit — khả năng |
| -bar | tính từ chỉ khả năng với từ có thực | lesbar — đọc được |
| un- | thường phủ định tính từ | unsicher — không chắc/không an toàn |
| -los | thiếu/vắng theo nghĩa từ vựng | arbeitslos — thất nghiệp |''',
'book-dtd-b2-10':'''| Câu có động từ | Cụm danh từ | Vai nghĩa cần giữ |
|---|---|---|
| weil die Kosten steigen | wegen des Anstiegs der Kosten | Kosten là thứ tăng |
| während ich lese | beim Lesen | người đọc suy từ chủ ngữ/ngữ cảnh |
| um besser lernen zu können | zum besseren Lernen | mục đích; không đổi thành nguyên nhân |
| die Behörde prüft die Unterlagen | die Prüfung der Unterlagen durch die Behörde | Unterlagen đối tượng, Behörde tác nhân |''',
'book-dtd-b2-11':'''| Quan hệ | Khung | Ví dụ Đức–Việt |
|---|---|---|
| nguyên nhân | weil + động từ cuối | Ich bleibe, weil ich krank bin. — Tôi ở lại vì bệnh. |
| nguyên nhân nối hai câu chính | denn + chủ ngữ + động từ | Ich bleibe, denn ich bin krank. — Tôi ở lại vì tôi bệnh. |
| kết quả | deshalb + động từ + chủ ngữ | Ich bin krank. Deshalb bleibe ich. — Tôi bệnh. Vì vậy tôi ở lại. |
| đồng thời | während + động từ cuối | Während ich koche, liest er. — Trong lúc tôi nấu, anh ấy đọc. |''',
'book-dtd-b2-13':'''| Vai trong văn bản | Cần trả lời | Lỗi cần tránh |
|---|---|---|
| Vấn đề | đang bàn quyết định gì? | giới thiệu quá xa chủ đề |
| Luận điểm | tôi bảo vệ điều gì? | chỉ nhắc lại đề bài |
| Lý do | cơ chế nào hỗ trợ? | lặp luận điểm như lý do |
| Ví dụ | trường hợp nào minh họa? | suy rộng một trường hợp thành mọi người |
| Phản biện | giới hạn/chi phí nào? | nhắc ý trái chiều rồi không đáp lại |
| Kết luận | đề xuất gì từ các lý do? | thêm số liệu/luận điểm chưa triển khai |''',
'book-dtd-b2-22':'''| Vorfeld | Khung trái | Mittelfeld | Khung phải | Nachfeld |
|---|---|---|---|---|
| Morgen | werde | ich dir | erklären, | warum das wichtig ist. |
| Dass er kommt, | habe | ich gestern | gehört. | — |
| Ich | habe | ihn gestern | gesehen. | — |'''
}

def table_blocks(item):
    blocks=re.findall(r'(?:^\|.*\|\n?)+',reference_tables[item['id']],re.M)
    text='\n\n'.join(block.strip() for block in blocks)
    # Remove material assigned to a different lesson instead of repeating its table.
    drop={'book-dtd-b1-02':['| Genitiv |'],'book-dtd-b1-03':['| je … desto |'],'book-dtd-b1-14':['| mục đích cùng chủ thể |'],'book-dtd-b1-12':['| cụm mở rộng I |','| cụm mở rộng II |'],'book-dtd-b2-19':['| so sánh giả định |']}
    for prefix in drop.get(item['id'],[]):text='\n'.join(line for line in text.splitlines() if not line.startswith(prefix))
    if item['id']=='book-dtd-b1-12':text=text.replace('dạng Partizip II + đuôi','Partizip II; chỉ thêm đuôi khi làm định ngữ trước danh từ')
    if item['id']=='book-dtd-b2-17':
        text=''
        for noun,forms in [('Name',['der Name','den Namen','dem Namen','des Namens']),('Gedanke',['der Gedanke','den Gedanken','dem Gedanken','des Gedankens']),('Herz',['das Herz','das Herz','dem Herzen','des Herzens'])]:
            text+='#### '+noun+' · Số ít\n\n| Cách | Dạng |\n|---|---|\n'+'\n'.join('| '+case+' | '+form+' |' for case,form in zip(['Nominativ','Akkusativ','Dativ','Genitiv'],forms))+'\n\n'
    if item['id'] in extra_tables:text+='\n\n'+extra_tables[item['id']]
    return text

heads=['Bản chất & cơ chế vận hành','Bảng tổng hợp quy tắc','Tips học nhanh & mẹo ghi nhớ','Dấu hiệu nhận biết','Ví dụ thực tế & phân tích','Cạm bẫy thường gặp']
for item in pack['items']:
    rev=revisions.get(item['id'])
    if not rev:continue
    parts=[rev['mechanism'],table_blocks(item),rev['tips'],rev['signs'],rev['examples'],rev['traps']]
    item['content']='## '+item['title']+'\n\n**Phạm vi:** '+rev['scope']+'\n\n'+'\n\n'.join('### '+str(i+1)+'. '+h+'\n\n'+s for i,(h,s) in enumerate(zip(heads,parts)))
    item['exercises']=[];fill_count=0
    for index,(q,a,why,b,c) in enumerate(rev['questions']):
        fill='___' in q and fill_count<5
        if fill:fill_count+=1
        sentence=q.replace('___',a) if '___' in q else a
        explanation='Đáp án: '+a+'.\n\nPhân tích: '+why+'\n\nÁp dụng: '+sentence
        if not fill:
            if '___' in q:explanation+='\n\nĐối chiếu theo quy tắc trên:\n• Với “'+b+'”: '+q.replace('___',b)+'\n• Với “'+c+'”: '+q.replace('___',c)
            else:explanation+='\n\nPhương án cần loại theo phân tích trên: “'+b+'”; “'+c+'”.'
        ex={'id':item['id']+'-deep-'+str(index+1),'type':'fill' if fill else 'quiz','question':q,'answers':[a],'explanation':explanation,'origin':'authored','answerSource':'authored'}
        if not fill:
            options=[a,b,c];shift=index%3;ex['options']=options[shift:]+options[:shift]
        item['exercises'].append(ex)
    item['contentRevision']='b1-b2-deep-2026-10-21';item['reviewedOn']='2026-10-21';item['reviewStatus']='authored-detailed-batch';item['origin']='authored-deep-revision'
    item['reviewScope']='Biên soạn theo chủ điểm, kiểm tra phạm vi, bảng và đáp án; cấp độ là lộ trình Elio, không phải ranh giới CEFR tuyệt đối hoặc chứng nhận không có sai sót.'
    item.pop('sourceContent',None)
    if item['id']=='book-dtd-b1-14':
        item['content']+='\n\n#### Dấu phẩy với cụm nguyên mẫu\n\nTrong chuẩn chính tả mới, cụm nguyên mẫu có tính mệnh đề được ngăn bằng dấu phẩy; cụm chen giữa có hai dấu phẩy. Ví dụ: **Ich versuche, früher aufzustehen.** — Tôi cố dậy sớm hơn. Tuy nhiên cấu trúc động từ gắn chặt như **Du brauchst nicht zu warten** không được tách tùy tiện bằng dấu phẩy. Phải phân biệt cụm mệnh đề với bộ phận của cụm động từ, không dùng một mẹo cho mọi chữ zu.'
        item['reviewSources'].append({'title':'Duden · Infinitivgruppen und Komma','url':'https://www.duden.de/sprachwissen/sprachratgeber/Das-Komma-bei-Infinitivgruppen'})
    if item['id']=='book-dtd-b2-07':
        item['content']+='\n\n#### zu + Partizip I: định ngữ mang nghĩa bị động có tính tình thái\n\n**die noch zu prüfenden Unterlagen** — những hồ sơ còn cần/phải được kiểm tra. Dạng **zu prüfend + đuôi tính từ** không có nghĩa hồ sơ tự kiểm tra: nó có thể tương ứng với *die Unterlagen, die noch geprüft werden müssen/sollen*, hoặc nghĩa khả năng tùy từ/ngữ cảnh. Phân biệt **die prüfenden Mitarbeiter** (nhân viên thực hiện kiểm tra), **die geprüften Unterlagen** (hồ sơ đã được kiểm tra) và **die zu prüfenden Unterlagen** (hồ sơ cần/có thể được kiểm tra). Chỉ cụm cuối có dấu hiệu zu và quan hệ tình thái; không lấy riêng đuôi -end để suy ra nghĩa chủ động.'
    if item['id']=='book-dtd-b2-06':
        item['content']+='\n\n#### Perfekt với Modalverb: cấu trúc nhiều động từ\n\n**Der Antrag hat geprüft werden müssen.** — Lá đơn đã phải được kiểm tra. Ở đây *hat* tạo Perfekt cho cụm có modal; cuối câu là **geprüft werden müssen**. Vì müssen đi với động từ khác, nó nhận Ersatzinfinitiv, không dùng *gemusst*. Trong câu phụ: **…, weil der Antrag hat geprüft werden müssen**. Khung này dài và ít thuận tiện hơn cách kể **Der Antrag musste geprüft werden**; trong thực hành thường ưu tiên Präteritum nếu không cần Perfekt. Không dùng *ist* chỉ vì thấy một cụm bị động, và không đảo *hat* về sau nhóm hai nguyên mẫu theo mẹo câu phụ đơn giản.'
    if item['id']=='book-dtd-b2-01':item['reviewSources'].append({'title':'IDS · Ersatzinfinitiv','url':'https://grammis.ids-mannheim.de/systematische-grammatik/1615'})
    item['reviewSources']=list({ref['url']:ref for ref in item['reviewSources']}.values())

pack['packVersion']=7
# Include the preceding A2 revision targets so users can apply both batches once.
pack['revisionTargets']=list(dict.fromkeys(pack.get('revisionTargets',[])+list(revisions)))
pack['description']='64 chủ điểm; đã biên soạn chi tiết A2 bài 6–13 và toàn bộ B1/B2. 47 bài được cập nhật có 470 câu bài tập; giữ nguyên A1, A2 bài 1–5 và nội dung đã chỉnh tay.'
out=root/'public/data/grammar-book-a1-b2.json';out.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
old={i['id']:i for i in before['items']}
for item in pack['items']:
    if item['id'] not in revisions:assert item==old[item['id']],item['id']
    else:
        assert len(item['exercises'])==10,item['id']
        assert len({e['question'] for e in item['exercises']})==10,item['id']
        assert all('### '+str(n+1)+'. '+h in item['content'] for n,h in enumerate(heads))
        assert all(len(e['answers']) and len(e['explanation'])>100 for e in item['exercises'])
        for block in re.findall(r'(?:^\|.*\|\n?)+',item['content'],re.M):
            widths={len(line.split('|')) for line in block.strip().splitlines()};assert len(widths)==1,(item['id'],block)
print('39 B1/B2 lessons, 390 exercises; all 25 A1/A2 lesson objects unchanged.')
