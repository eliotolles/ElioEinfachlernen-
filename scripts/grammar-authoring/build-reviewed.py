import json
from pathlib import Path
lessons=[]
def fill(q,a,ex):return dict(type='fill',question=q,answers=a if isinstance(a,list) else [a],explanation=ex,origin='authored',answerSource='authored')
def quiz(q,options,answer,ex):return dict(type='quiz',question=q,options=options,answers=[options[answer]],explanation=ex,origin='authored',answerSource='authored')
def build(de,vi,ex):return dict(type='build',question='Tái tạo đúng câu mẫu này bằng các từ cho sẵn: '+vi,tokens=list(reversed(de.split())),answers=[de],explanation=de+' → '+vi+' '+ex,origin='authored',answerSource='authored')
akk=[
 quiz('Die Ärztin untersucht ___ Patienten.',['der','den','dem'],1,'Đúng: den. Untersuchen lấy người được khám ở Akkusativ; Patient là giống đực và thuộc nhóm yếu nên cả cụm là den Patienten. Der là Nominativ, dem là Dativ. Không chọn Dativ chỉ vì bệnh nhân là người.'),
 quiz('Ich bestelle ___ Hemd. (ein)',['einen','einem','ein'],2,'Đúng: ein. Hemd giống trung và là Akkusativ của bestellen. Einen dùng cho giống đực Akkusativ; einem là Dativ. Akkusativ không luôn được nhận diện bằng đuôi -en.'),
 quiz('Die Unterlagen sind für ___ Bruder.',['meinem','meinen','meiner'],1,'Đúng: meinen. Für yêu cầu Akkusativ; Bruder giống đực. Meinem là Dativ, meiner không phải dạng Akkusativ đực. Cách của cụm für meinen Bruder do giới từ quyết định, không phải do động từ sein.'),
 quiz('Câu nào nói cô ấy đặt giấy tờ lên bàn?',['Sie legt den Ausweis auf dem Schreibtisch.','Sie legt den Ausweis auf den Schreibtisch.','Sie liegt den Ausweis auf den Schreibtisch.'],1,'Đúng: câu 2. Legen tác động lên den Ausweis và cụm auf den Schreibtisch chỉ đích đặt vật. Câu 1 dùng Dativ cho vị trí, không hợp nghĩa đặt đến vị trí mới. Câu 3 nhầm liegen (ở trạng thái nằm) với legen (đặt nằm).'),
 quiz('Đâu là nhận xét đúng về “Sie läuft im Park”?',['Sai vì laufen có chuyển động nên phải in den Park.','Đúng: im Park là nơi cô ấy chạy.','Im Park là tân ngữ trực tiếp của laufen.'],1,'Đúng: nhận xét 2. Hoạt động chạy diễn ra trong công viên nên Dativ ở cụm địa điểm. Nhận xét 1 nhầm chuyển động với đích đến. Nhận xét 3 nhầm cụm giới từ chỉ nơi chốn với tân ngữ trực tiếp.'),
 quiz('Chọn câu đúng với “gọi điện cho anh ấy”.',['Ich rufe ihm an.','Ich anrufe ihn.','Ich rufe ihn an.'],2,'Đúng: câu 3. Anrufen lấy Akkusativ ihn, chia rufe ở V2 và tách an cuối câu. Câu 1 sai cách đại từ; câu 2 giữ liền anrufe trong câu chính sai khung của động từ tách.'),
 fill('Ich besuche ___ Onkel. (mein) نی'.replace(' نی',''),'meinen','Besuchen + Akkusativ. Onkel giống đực nên mein biến thành meinen. Meinem sẽ là Dativ, không theo rektion của besuchen ở đây.'),
 fill('Ich sehe den ___. (Kollege)',['Kollegen'],'Kollege là danh từ yếu: Nominativ der Kollege nhưng Akkusativ den Kollegen. Không chỉ đổi mạo từ mà quên biến đổi danh từ.'),
 fill('Kannst du ___ morgen anrufen? (ich)','mich','Anrufen + Akkusativ. Ich đổi thành mich khi làm người được gọi. Mir là Dativ và sẽ phù hợp với một động từ khác như helfen.'),
 fill('Wir kaufen ___ neue Jacke. (ein)','eine','Jacke giống cái; Akkusativ không xác định là eine. Einen chỉ dùng giống đực trong mẫu này; đuôi của tính từ mới cần kiểm tra riêng: eine neue Jacke.'),
 build('Den neuen Kollegen rufe ich heute an.','Người đồng nghiệp mới ấy, hôm nay tôi gọi.','Den neuen Kollegen đứng đầu nhưng vẫn là Akkusativ của anrufen. Ich là chủ ngữ, rufe V2, an cuối câu. Đây là bài tái tạo đúng câu mẫu, không phủ nhận mọi cách đặt trạng ngữ khác.'),
 build('Diese Unterlagen sind für meinen Bruder.','Những giấy tờ này dành cho anh/em trai tôi.','Chủ ngữ số nhiều dùng sind. Für chi phối meinen Bruder ở Akkusativ; nó không biến thành Nominativ chỉ vì trước đó là sein.')
]
dat=[
 quiz('Die Rezeptionistin gibt ___ Gast die Karte.',['den','dem','der'],1,'Đúng: dem. Gast là người nhận, Dativ trong mẫu jemandem etwas geben. Den là Akkusativ; der là Nominativ đực. Die Karte là vật được đưa, đã giữ vai trò Akkusativ.'),
 quiz('Chọn câu đúng: “Bạn có thể giúp tôi không?”',['Kannst du mich helfen?','Kannst du mir helfen?','Kannst du ich helfen?'],1,'Đúng: câu 2. Helfen + Dativ nên dùng mir. Mich là Akkusativ; ich là Nominativ và không thể đứng làm bổ ngữ như vậy. Dịch sang Việt có chữ tôi không quyết định dạng tiếng Đức.'),
 quiz('Wir fahren mit ___ Kollegen. (unser; số nhiều)',['unseren','unserem','unsere'],0,'Đúng: unseren. Mit + Dativ, danh từ số nhiều nên từ sở hữu nhận -en. Unserem dùng đực/trung số ít; unsere là Nominativ/Akkusativ số nhiều. Kollegen ở số nhiều đã có -n.'),
 quiz('Chọn Dativ số nhiều đúng.',['mit den Autos','mit den Autosn','mit dem Autos'],0,'Đúng: mit den Autos. Số nhiều tận cùng -s không thêm -n. Autosn là dạng bịa; dem là mạo từ số ít nên không đi với Autos số nhiều.'),
 quiz('Đâu là chủ ngữ của “Der Dienstplan gefällt der Mitarbeiterin”?',['der Mitarbeiterin','der Dienstplan','Không có chủ ngữ.'],1,'Đúng: der Dienstplan. Lịch làm việc là thứ được thấy là phù hợp/dễ chịu và chi phối gefällt số ít. Der Mitarbeiterin là người thấy thích ở Dativ, không phải chủ ngữ. Không xác định chủ ngữ chỉ bằng chủ thể của bản dịch Việt.'),
 quiz('Thay den Schlüssel bằng ihn và der Kollegin bằng ihr: Ich gebe ...',['ihr ihn.','ihn ihr.','ihm sie.'],1,'Đúng: ihn ihr. Hai đại từ không nhấn thường Akkusativ trước Dativ. Ihr ihn đảo thứ tự trung hòa. Ihm sie không thay đúng hai danh ngữ đã cho: người nhận là nữ (ihr), vật Schlüssel giống đực (ihn).'),
 fill('Ich danke ___ für deine Hilfe. (du)','dir','Danken lấy Dativ, du → dir. Dich là Akkusativ, không theo mẫu jemandem für etwas danken.'),
 fill('Mit ___ Bruder fahre ich nach Bonn. (mein)','meinem','Mit đòi Dativ; Bruder đực số ít nên meinem. Có chuyển động fahren không làm mit đổi sang Akkusativ.'),
 fill('Sie spielt mit den ___. (Kind; số nhiều)','Kindern','Kind → Kinder ở số nhiều, rồi Dativ số nhiều thường thêm -n: Kindern. Cần kiểm tra cả den và danh từ, không dừng ở mạo từ.'),
 fill('Die neuen Dienstpläne ___ ihr. (gefallen; Präsens)','gefallen','Chủ ngữ là Die neuen Dienstpläne, số nhiều nên gefallen. Ihr là Dativ người thấy thích; không chia động từ theo ngôi của ihr.'),
 build('Ich gebe ihn ihr.','Tôi đưa nó cho cô ấy.','Ihn là Akkusativ thay vật giống đực; ihr là Dativ thay người nhận nữ. Hai đại từ không nhấn theo thứ tự Akkusativ trước Dativ.'),
 build('Den neuen Mitarbeitern wird geholfen.','Các nhân viên mới được giúp đỡ.','Helfen giữ Dativ cả khi đổi sang bị động. Câu không có chủ ngữ Nominativ nên wird số ít; không phải werden theo số nhiều của Mitarbeitern.')
]
for slug,title,ex in [('akkusativ','Akkusativ — hiểu cấu trúc, chọn đúng cách',akk),('dativ','Dativ — vai trò, biến cách và lỗi thường gặp',dat)]:
 text=Path(f'content/grammar-reviewed/{slug}.vi.md').read_text()
 source=f'https://www.deutschakademie.de/online-deutschkurs/deutsche-grammatik/vier-faelle-deutsch/{slug}/'
 refs=[{'title':f'DeutschAkademie · {slug.title()} (bài tham khảo tiếng Đức)','url':source},{'title':'IDS grammis · Giới từ hai cách','url':'https://grammis.ids-mannheim.de/progr@mm/6858'},{'title':'Goethe-Institut · Deutsche Grammatik','url':'https://www.goethe.de/ins/de/de/prf/grm.html'},{'title':'LEO · Wortstellung der Objekte','url':'https://dict.leo.org/grammatik/deutsch/Satz/Wortstellung/Stellungsfeld/Mittelfeld/Objekt.xml?lang=de'}]
 lessons.append(dict(id=f'elio-reviewed-{slug}-v2',collectionId='elio-grammar-atlas-v1',title=title,level='A1',levels=['A1','A2','B1','B2','C1'],group='words',content=text,exercises=ex,reviewSources=refs,origin='elio-source-reviewed',reviewScope='Bài giải thích tiếng Việt biên soạn độc lập, đối chiếu nguồn; ví dụ và bài tập mới, không phải bản dịch chính thức của DeutschAkademie.'))
Path('public/js/grammar-atlas-data.js').write_text("'use strict';\n// Rejected 165-topic pack removed. Only substantive reviewed replacements are listed.\nconst ElioGrammarAtlasData="+json.dumps(lessons,ensure_ascii=False,indent=1)+';\n')
print(len(lessons),'lessons;',sum(len(l['exercises']) for l in lessons),'exercises')
