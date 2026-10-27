"""Vietnamese teaching written from the user's 22-page grammar overview.
Original explanations and examples; no PDF pages or OCR copied into public assets.
"""
import json
from pathlib import Path

items=[]
def add(number,title,pages,group,topics,content,questions):
    assert len(questions)>=10
    exercises=[]
    for j,row in enumerate(questions,1):
        if len(row)==3:
            question,answer,explanation=row
            ex=dict(type='fill',question=question,answers=answer if isinstance(answer,list) else [answer])
        else:
            question,options,answer,explanation=row
            ex=dict(type='quiz',question=question,options=options,answers=[answer])
        ex.update(id=f'elio-c1-sicher-{number:02d}-q{j:02d}',explanation=explanation,origin='authored',answerSource='authored')
        exercises.append(ex)
    items.append(dict(id=f'elio-c1-sicher-{number:02d}',title=title,topic=title,level='C1',levels=['C1'],group=group,sourcePages=pages,sourceChapter=number,topics=topics,content='## '+title+'\n\n'+content.strip(),exercises=exercises,origin='elio-c1-pdf-rewrite',contentRevision='2026-10-27',sourceNote='Biên soạn tiếng Việt theo nhóm chủ điểm của PDF Sicher! C1 do chủ dự án cung cấp; ví dụ và bài tập mới. Số trang là trang PDF, không phải trang Kursbuch.'))

add(1,'Modalverben: suy đoán, lời đồn và tiền tố miss-/zer-/ent-/de-', [1,2], 'verbs', ['Subjektive Bedeutung der Modalverben','Wortbildung: miss-, zer-, ent-, de-'], r'''
### 1. Bản chất: nghĩa vụ hay nhận định?
**Müssen** có thể diễn đạt điều bắt buộc hoặc kết luận người nói rút ra. Trong **Sie muss heute arbeiten**, phải xem ngữ cảnh mới biết là “cô ấy phải làm” hay “chắc cô ấy đang làm”. Tiếng Việt dùng “phải/chắc”; tiếng Đức có thể dùng cùng một động từ.

### 2. Bảng suy đoán
| Dạng | Sắc thái | Ví dụ mới và nghĩa |
| --- | --- | --- |
| muss | kết luận rất chắc dựa trên dấu hiệu | Der Laden muss geschlossen sein. → Chắc cửa hàng đóng cửa rồi. |
| müsste | suy luận điều lẽ ra đúng theo thông tin hiện có | Der Bus müsste gleich kommen. → Theo lịch thì xe buýt sắp đến. |
| dürfte | có lẽ, tương đối có khả năng | Die Reparatur dürfte teuer werden. → Có lẽ việc sửa sẽ tốn kém. |
| könnte | một khả năng còn bỏ ngỏ | Der Fehler könnte am Kabel liegen. → Lỗi có thể ở dây cáp. |

Đây là thang sắc thái, **không phải phần trăm xác suất toán học**. Phủ định kết luận chắc có thể dùng **Das kann nicht stimmen.** → Chuyện đó không thể đúng được.

### 3. Quá khứ và nguồn thông tin
Suy đoán quá khứ: **Modalverb + Partizip II + haben/sein**. **Sie muss schon angekommen sein.** → Chắc cô ấy đã đến. Nghĩa vụ trong quá khứ: **Sie hat früher aufstehen müssen.** → Cô ấy đã phải dậy sớm hơn. Không trộn hai cấu trúc.

| Động từ | Ai đưa ra thông tin? | Ví dụ và nghĩa |
| --- | --- | --- |
| soll | người khác/nguồn tin bên ngoài | Der Zeuge soll abgereist sein. → Nghe nói nhân chứng đã đi. |
| will | chính chủ ngữ tự nhận | Der Zeuge will nichts gesehen haben. → Nhân chứng tự nhận không thấy gì. |

### 4. Tiền tố: nhận biết nhưng không đoán máy móc
| Tiền tố không tách | Hướng nghĩa thường gặp | Ví dụ |
| --- | --- | --- |
| miss- | sai, thất bại hoặc đánh giá tiêu cực | missverstehen: hiểu nhầm |
| zer- | vỡ, tách hoặc phá hỏng | zerbrechen: làm vỡ/bị vỡ |
| ent- | gỡ bỏ, thoát khỏi; tùy từ | entladen: dỡ hàng |
| de- | đảo ngược quá trình ở nhiều từ vay mượn | deaktivieren: vô hiệu hóa |

**Die Technikerin deaktiviert den Alarm.** → Kỹ thuật viên tắt chức năng báo động. Học cả từ và dạng chia: **entladen – entlud – hat entladen**; **deaktivieren – hat deaktiviert**. Không tự tạo từ bằng cách gắn tiền tố tùy ý.

### 5. Mẹo và dấu hiệu
Tìm dấu hiệu lập luận như **das Licht brennt**, tìm nguồn dẫn như **laut Bericht**, rồi mới chọn nghĩa. Với quá khứ, nhìn động từ cuối: **gearbeitet haben** là nguyên mẫu hoàn thành; **arbeiten müssen** là cấu trúc khác.

### 6. Cạm bẫy
- Sai: **Sie muss angekommen haben.** Đúng: **Sie muss angekommen sein.** Ankommen dùng sein.
- Sai: dùng **will** để dẫn lời đồn của người khác. Đúng: **Er soll reich sein.** Will tự nhận thông tin về chính chủ ngữ.
- Không biến muss/müsste/dürfte/könnte thành cam kết sự thật: đó vẫn là đánh giá của người nói.
''',[
('Alle Lichter sind aus. Die Familie ___ schon schlafen. (kết luận rất chắc)',['muss','darf','sollte'],'muss','Muss diễn đạt kết luận chắc từ dấu hiệu đèn tắt; không phải nghĩa vụ ngủ.'),
('Nach dem Fahrplan ___ der Zug in fünf Minuten eintreffen. (suy luận theo lịch)',['müsste','wollte','dürfte nicht'],'müsste','Müsste là điều dự kiến đúng theo căn cứ lịch chạy. Không phải báo lời tự nhận với wollte.'),
('Es ist möglich: Der Sensor ___ defekt sein.',['könnte','muss','will'],'könnte','Könnte mở một khả năng; muss mạnh hơn mức “có thể” trong đề.'),
('Laut Presse ___ die Firma verkauft worden sein. (lời đồn)',['soll','will','darf'],'soll','Soll dẫn thông tin từ báo chí. Verkauft worden sein là nguyên mẫu hoàn thành bị động.'),
('Der Fahrer behauptet, er habe nichts bemerkt. Er ___ nichts bemerkt haben.',['will','soll','muss'],'will','Chính tài xế tự nhận không nhận thấy gì: will + Partizip II + haben.'),
('Sie muss bereits nach Hause gefahren ___. (sein/haben)','sein','Fahren ở đây là di chuyển đến nhà nên nguyên mẫu hoàn thành là gefahren sein.'),
('Điền động từ cuối: Er hat gestern länger arbeiten ___. (nghĩa vụ; müssen)','müssen','Perfekt với modal + nguyên mẫu dùng Ersatzinfinitiv: hat arbeiten müssen, khác suy đoán muss gearbeitet haben.'),
('Ich habe die Anweisung falsch verstanden: Ich habe sie ___. (missverstehen)','missverstanden','Missverstehen có Partizip II missverstanden; không tách miss- và không thêm ge- vào trước toàn từ.'),
('Das Glas ist beim Transport ___. (zerbrechen)','zerbrochen','Zerbrechen ở nghĩa tự vỡ dùng sein; Partizip II zerbrochen, không phải gezerbrochen.'),
('Die IT hat das alte Konto ___. (deaktivieren)','deaktiviert','Động từ -ieren không có ge- trong Partizip II; deaktiviert nghĩa là vô hiệu hóa tài khoản.')])

add(2,'Liên từ nhượng bộ, giới hạn và Nomen-Verb-Verbindungen', [3,4], 'sentences', ['Zweiteilige konzessive Konnektoren','Restriktive Konnektoren','Feste Nomen-Verb-Verbindungen'],r'''
### 1. Bản chất
Nhượng bộ: có một trở ngại nhưng kết quả trái dự đoán vẫn xảy ra. Giới hạn: phát biểu chỉ đúng nếu loại trừ một tình huống. **Obwohl** và **es sei denn** vì thế không thay nhau được.

### 2. Nhượng bộ: tách từng cấu trúc
| Cấu trúc | Vị trí động từ | Ví dụ và nghĩa |
| --- | --- | --- |
| wenn … auch, (so) … | động từ cuối mệnh đề wenn; câu chính V2 | Wenn der Weg auch weit ist, so lohnt sich die Reise. → Dù đường xa, chuyến đi vẫn đáng. |
| wie … auch | cuối mệnh đề mở đầu | Wie sorgfältig er auch plant, ein Risiko bleibt. → Dù anh ấy lên kế hoạch kỹ đến đâu, vẫn còn rủi ro. |
| zwar …, aber … | hai câu chính | Er ist zwar müde, aber er arbeitet konzentriert. → Anh ấy mệt nhưng vẫn làm tập trung. |

**Wie … auch** diễn đạt “dù … đến đâu”, không hỏi mức độ. Ở câu chính **Ein Risiko bleibt** sau mệnh đề mở đầu, **ein Risiko** vẫn là chủ ngữ; không tự thêm một chủ ngữ khác.

### 3. Giới hạn và ngoại lệ
| Dạng | Mẫu đúng | Ý nghĩa |
| --- | --- | --- |
| es sei denn + câu V2 | Wir öffnen, es sei denn, der Strom fällt aus. | mở cửa, trừ khi mất điện |
| es sei denn, dass + động từ cuối | …, es sei denn, dass der Strom ausfällt. | cùng ngoại lệ trên |
| außer wenn | …, außer wenn der Strom ausfällt. | trừ trường hợp mất điện |
| außer dass / nur dass | Beide Geräte sind gleich, nur dass dieses leiser ist. | chỉ khác ở chỗ máy này êm hơn |

**Nur dass** ở đây đứng sau phát biểu cần giới hạn. Phân biệt ngoại lệ của điều kiện và điểm khác nhau giữa hai vật.

### 4. Cụm danh từ–động từ cố định
| Cụm | Vai trò | Ví dụ mới và nghĩa |
| --- | --- | --- |
| zur Verfügung stellen | cung cấp cái gì | Wir stellen Ihnen einen Laptop zur Verfügung. → Chúng tôi cấp máy tính cho anh/chị. |
| zur Verfügung stehen | có sẵn cho ai | Ein Laptop steht Ihnen zur Verfügung. → Có sẵn máy tính cho anh/chị. |
| zur Sprache bringen | chủ động nêu ra | Sie bringt das Problem zur Sprache. → Cô ấy nêu vấn đề. |
| zur Sprache kommen | vấn đề được đề cập | Das Problem kommt zur Sprache. → Vấn đề được đề cập. |
| in Kauf nehmen | chấp nhận hệ quả bất lợi | Wir nehmen längere Wege in Kauf. → Chúng tôi chấp nhận đi xa hơn. |
| Kritik üben an + Dativ | phê bình | Sie übt Kritik an dem Verfahren. → Cô ấy phê bình quy trình. |

### 5. Mẹo chọn
Hỏi “ai thực hiện?” trước khi chọn **stellen/stehen**, **bringen/kommen**. Học cả giới từ: **jemandem etwas zur Verfügung stellen**, không chỉ học từ Verfügung.

### 6. Lỗi cần tránh
- Sai: **es sei denn, dass er kommt morgen**. Đúng: **…, dass er morgen kommt**.
- Sai: **Ein Zimmer stellt zur Verfügung.** Đúng: **Ein Zimmer steht zur Verfügung.** Nếu dùng stellen, cần người cung cấp và vật được cấp.
- **In Kauf nehmen** không mang nghĩa đi mua; đó là chấp nhận một mặt bất lợi.
''',[
('Wenn die Aufgabe auch schwierig ___, so versuchen wir sie. (sein)','ist','Trong mệnh đề wenn, động từ chia ist nằm cuối sau schwierig.'),
('___ sehr sie sich auch bemüht, sie kann nicht alle überzeugen.',['Wie','Weil','Ob'],'Wie','Wie sehr … auch diễn đạt dù cố gắng đến mức nào; không phải câu hỏi ob.'),
('Wir liefern morgen, es sei denn, der Kunde ___ den Auftrag. (stornieren)','storniert','Es sei denn không có dass được nối với câu chính: der Kunde storniert den Auftrag.'),
('Wir liefern morgen, es sei denn, dass der Kunde den Auftrag ___. (stornieren)','storniert','Có dass thì động từ chia đứng cuối mệnh đề phụ.'),
('Die Zimmer sind gleich, ___ dieses einen Balkon hat.',['nur dass','es sei denn','trotzdem'],'nur dass','Đang nêu điểm khác nhau giữa hai phòng, không nêu điều kiện ngoại lệ tương lai.'),
('Das Labor ___ uns neue Geräte zur Verfügung. (stellen/stehen)','stellt','Labor là bên cung cấp, neue Geräte là vật được cấp, uns là Dativ người nhận.'),
('Neue Geräte ___ uns zur Verfügung. (stellen/stehen)','stehen','Neue Geräte là chủ ngữ số nhiều; dùng stehen để diễn đạt có sẵn.'),
('Im Gespräch ___ sie das Problem zur Sprache. (bringen)','bringt','Cô ấy là người chủ động nêu vấn đề nên dùng zur Sprache bringen.'),
('Im Gespräch ___ das Problem zur Sprache. (kommen)','kommt','Chủ ngữ là das Problem: vấn đề được nhắc đến, dùng zur Sprache kommen.'),
('Für die neue Stelle nehme ich längere Fahrtzeiten in ___.','Kauf','In Kauf nehmen là chấp nhận bất lợi; danh từ Kauf viết hoa và không thêm mạo từ trong cụm.')])

add(3,'Thay Modalverben, hệ quả không xảy ra và đuôi tính từ nâng cao',[5,6],'verbs',['Alternativen zu Modalverben','Irreale Folgesätze','Adjektivendungen nach Artikelwörtern'],r'''
### 1. Bản chất và cách thay
Thay modal bằng một cụm trang trọng giúp viết linh hoạt, nhưng phải giữ đúng nghĩa: **khả năng**, **sự cho phép**, **nghĩa vụ**, **ý định** không giống nhau.

| Nghĩa | Cấu trúc thay | Ví dụ và nghĩa |
| --- | --- | --- |
| có khả năng | in der Lage sein, … zu | Sie ist in der Lage, den Fehler zu beheben. → Cô ấy có khả năng sửa lỗi. |
| được phép | die Erlaubnis haben, … zu | Wir haben die Erlaubnis, hier zu filmen. → Chúng tôi được phép quay ở đây. |
| buộc phải | verpflichtet/gezwungen sein, … zu | Er ist verpflichtet, den Schaden zu melden. → Anh ấy có nghĩa vụ báo thiệt hại. |
| dự định | beabsichtigen / vorhaben, … zu | Ich beabsichtige, den Vertrag zu verlängern. → Tôi định gia hạn hợp đồng. |
| lời khuyên | Es wäre ratsam, … zu | Es wäre ratsam, früher anzurufen. → Nên gọi sớm hơn. |

**Nicht müssen = không cần**, không phải cấm: **Du brauchst nicht zu warten.** → Bạn không cần đợi. Cấm: **Du darfst nicht eintreten.** → Bạn không được vào.

### 2. Zu …, als dass và zu …, um zu
| Cấu trúc | Ví dụ mới | Cách hiểu |
| --- | --- | --- |
| zu + tính từ, als dass + Konjunktiv II | Die Frist ist zu kurz, als dass wir alles prüfen könnten. | hạn quá ngắn nên không thể kiểm tra hết |
| zu + tính từ, um … zu | Ich bin zu müde, um noch zu fahren. | tôi quá mệt để lái tiếp |

**Als dass** có chủ ngữ riêng. Với **um … zu**, chủ thể của nguyên mẫu phải suy ra được. Có cả cấu trúc với tân ngữ được hiểu: **Der Text ist zu lang, um ihn vorzulesen.** → Bài quá dài để đọc thành tiếng. Không thay mọi mệnh đề bằng um zu một cách máy móc.

### 3. Đuôi tính từ: ba bảng nhỏ
| Sau từ xác định, số nhiều | Nominativ/Akkusativ | Dativ |
| --- | --- | --- |
| alle, sämtliche, keine | alle neuen Regeln | mit allen neuen Regeln |

| Sau lượng từ, số nhiều | Nominativ/Akkusativ | Dativ |
| --- | --- | --- |
| einige, mehrere, viele, wenige | mehrere neue Regeln | mit mehreren neuen Regeln |

| Có die đứng trước lượng từ | Nominativ/Akkusativ | Dativ |
| --- | --- | --- |
| die vielen / die wenigen | die vielen neuen Regeln | mit den vielen neuen Regeln |

Với **solche/welche**, cách chia có thể có biến thể theo cách dùng; mẫu bài này dùng **solche neuen Regeln**. Đừng suy ra mọi lượng từ đều giống alle. Số ít không đếm được: **viel neues Wissen**, **mit viel neuem Wissen**.

### 4. Dấu hiệu và mẹo
Tìm **die/alle/keine** trước khi chọn -e/-en. Gặp **mehrere/viele** mà không có mạo từ xác định: xét như một cụm cần tính từ biểu thị đuôi mạnh ở mẫu tương ứng.

### 5. Đặt câu
“Có đủ năng lực giải quyết” → **in der Lage sein** → đặt nguyên mẫu cuối: **Unser Team ist in der Lage, die Störung schnell zu beheben.** → Nhóm có thể khắc phục sự cố nhanh.

### 6. Cạm bẫy
- Sai: **nicht müssen = nicht dürfen**. Không cần làm khác với bị cấm làm.
- Sai: **mit mehreren neue Geräten**. Đúng: **mit mehreren neuen Geräten**; Dativ số nhiều.
- Sai: **alle neue Verträge**. Đúng: **alle neuen Verträge**.
''',[
('Sie ist in der ___, die Reparatur selbst auszuführen.','Lage','In der Lage sein, etwas zu tun tương đương có khả năng thực hiện một việc.'),
('Du musst nicht bleiben. Du ___ nicht zu bleiben. (brauchen)','brauchst','Nicht müssen được diễn đạt bằng nicht brauchen + zu; du chia brauchst.'),
('Du darfst nicht eintreten. Das Eintreten ist ___.',['verboten','freiwillig','unnötig'],'verboten','Darfst nicht là không được phép, nên verboten; unnötig chỉ nghĩa không cần thiết.'),
('Der Lärm ist zu laut, als dass man sich konzentrieren ___. (können; Konjunktiv II)','könnte','Zu … als dass diễn đạt hệ quả không thực hiện được; man số ít dùng könnte.'),
('Ich bin zu erschöpft, um heute noch ___.',['zu arbeiten','arbeite','gearbeitet'],'zu arbeiten','Um … zu cần nguyên mẫu có zu, chủ thể ngầm là ich.'),
('Alle ___ Geräte werden geprüft. (neu)','neuen','Alle xác định số nhiều; tính từ theo kiểu yếu nhận -en.'),
('Mehrere ___ Geräte fehlen. (neu)','neue','Mehrere ở Nominativ số nhiều đi với neue trong mẫu không có mạo từ xác định.'),
('Mit mehreren ___ Geräten arbeiten wir schneller. (neu)','neuen','Mit yêu cầu Dativ; số nhiều có mehreren neuen Geräten.'),
('Die vielen ___ Anfragen kosten Zeit. (zusätzlich)','zusätzlichen','Die đứng trước nhiều/anfragen làm cụm xác định: tính từ -en.'),
('Sie verfügt über viel ___ Wissen. (praktisch)','praktisches','Über trong verfügen über đòi Akkusativ; Wissen trung số ít, viel không có đuôi mạo từ nên praktisches.')])

add(4,'Các chức năng của es và tăng mức độ tính từ',[7,8],'words',['Funktionen des Pronomens es','Graduierung von Adjektiven'],r'''
### 1. Bản chất: không phải es nào cũng là “nó”
**Es** có thể thay danh từ trung, thay một nhận xét, báo trước mệnh đề hoặc là thành phần bắt buộc của cấu trúc vô nhân xưng. Trước khi xóa es, phải xác định chức năng.

### 2. Bảng phân loại
| Chức năng | Ví dụ mới và nghĩa | Có bỏ được không? |
| --- | --- | --- |
| thay danh từ trung | Das Paket ist da. Ich öffne es. → Gói hàng đến rồi. Tôi mở nó. | không tự bỏ tân ngữ es |
| thay tính chất | Er ist geduldig; ich bin es nicht. → Anh ấy kiên nhẫn; tôi thì không. | es thay geduldig; không đặt es lên đầu ở nghĩa này |
| báo trước mệnh đề | Es ist unklar, ob sie kommt. → Chưa rõ cô ấy có đến không. | khi đưa mệnh đề lên đầu: Ob sie kommt, ist unklar. |
| giả chủ ngữ đầu câu | Es warten drei Gäste. → Có ba khách đang chờ. | Heute warten drei Gäste.; động từ hòa hợp với Gäste |
| thời tiết/vô nhân xưng | Es schneit. Heute schneit es. → Hôm nay có tuyết. | vẫn phải giữ es khi đổi vị trí |
| cụm cố định | Sie hat es eilig. → Cô ấy đang vội. | phải giữ es của cụm |

### 3. Đừng hiểu “không bắt buộc” là bỏ tùy ý
Trong **Ich finde es wichtig, pünktlich zu sein**, es báo trước bổ ngữ và thuộc mẫu **etwas wichtig finden**. Không bỏ thành **Ich finde wichtig …** trong mẫu chuẩn này. Với **Dass er hilft, ist wichtig**, cả mệnh đề đã làm chủ ngữ nên không thêm es giả chủ ngữ nữa. Mỗi cấu trúc có điều kiện riêng.

### 4. Tăng mức độ tính từ
| Kết hợp đã được dùng | Nghĩa và sắc thái | Ví dụ mới |
| --- | --- | --- |
| nagelneu / brandneu | hoàn toàn mới | Der Scanner ist nagelneu. → Máy quét mới tinh. |
| tiefblau | xanh thẫm | Das Wasser ist tiefblau. → Nước xanh thẫm. |
| todmüde | mệt rã rời; khẩu ngữ | Nach der Schicht war ich todmüde. → Hết ca tôi mệt rã rời. |
| vollautomatisch | hoàn toàn tự động | Die Anlage arbeitet vollautomatisch. → Dây chuyền vận hành tự động hoàn toàn. |
| topfit | rất khỏe/phong độ tốt | Nach der Pause ist sie wieder topfit. → Nghỉ xong cô ấy lại khỏe khoắn. |

Đây là kết hợp từ vựng, không phải phép nhân tự do. **Nagelneu** tự nhiên; không suy ra “nagelaktuell” bằng cùng quy tắc. Nhiều cách nói super-/mega- thuộc quảng cáo hoặc khẩu ngữ; bài viết trang trọng có thể dùng **äußerst, besonders, sehr** phù hợp ngữ cảnh.

### 5. Mẹo và ví dụ có phân tích
Đưa **heute** lên đầu để thử: **Es kommen zwei Busse → Heute kommen zwei Busse**. Es biến mất vì chỉ lấp vị trí đầu. Nhưng **Es regnet → Heute regnet es**: es vẫn thuộc cấu trúc thời tiết. Đây là hai chức năng khác nhau.

### 6. Cạm bẫy
- Sai: **Heute regnet.** Đúng: **Heute regnet es.**
- Sai: **Es wartet drei Gäste.** Đúng: **Es warten drei Gäste.** Gäste là chủ ngữ số nhiều.
- Sai: **Sie hat eilig.** Đúng: **Sie hat es eilig.** Học cả cụm.
''',[
('Das Formular liegt hier. Bitte unterschreiben Sie ___.','es','Formular là danh từ trung; es thay cho tân ngữ Akkusativ cần ký.'),
('Heute schneit ___.','es','Es của động từ thời tiết không chỉ lấp Vorfeld; dù Heute lên đầu vẫn cần es.'),
('Es ___ drei Besucher vor der Tür. (warten)','warten','Chủ ngữ thực là drei Besucher số nhiều, nên động từ warten; es ở đầu không quyết định số ít.'),
('Viết lại, điền phần còn thiếu: Es warten drei Besucher. → Heute ___ drei Besucher.','warten','Heute chiếm Vorfeld nên es lấp chỗ bị loại; chủ ngữ Besucher vẫn số nhiều.'),
('Ob der Antrag genehmigt wird, ___ noch unklar. (sein)','ist','Mệnh đề ob đóng vai chủ ngữ số ít. Không thêm một es giả chủ ngữ sau dấu phẩy.'),
('Ich finde ___ sinnvoll, zuerst anzurufen.','es','Trong finden + bổ ngữ đánh giá, es đại diện cho hành động nguyên mẫu được nêu sau.'),
('Wir haben ___ eilig und nehmen ein Taxi.','es','Es thuộc cụm cố định es eilig haben, không phải đại từ tùy ý bỏ.'),
('Er ist zuverlässig; ich bin ___ ebenfalls.','es','Es thay tính chất zuverlässig. Không cần lặp tính từ trong vế thứ hai.'),
('Der Laptop ist völlig neu. Er ist ___. (nagel- + neu)','nagelneu','Nagelneu là kết hợp cố định nghĩa mới tinh; viết liền, không tự ghép với mọi tính từ.'),
('Nach zwölf Stunden Arbeit bin ich ___. (tod- + müde)','todmüde','Todmüde là mệt rã rời; lựa chọn khẩu ngữ, không phải nghĩa chết theo nghĩa đen.')])
add(5,'Tiền tố be-/ver- và thuật lại câu hỏi, yêu cầu, nguồn tin',[9,10],'sentences',['Wortbildung: be-, ver-','Indirekte Fragen und Imperativ','nach, laut, zufolge, wie'],r'''
### 1. Bản chất
Tiền tố có thể đổi nghĩa và cách kết hợp bổ ngữ. **Antworten auf eine Frage** khác cấu trúc **eine Frage beantworten**. Trong dẫn lời, cần phân biệt **người kể xác nhận thông tin** và **người kể chỉ thuật lại lời người khác**.

### 2. Be- và ver-
| Mẫu | Ví dụ mới | Nghĩa/cơ chế |
| --- | --- | --- |
| arbeiten an + Dativ → bearbeiten + Akkusativ | Sie bearbeitet den Antrag. | xử lý hồ sơ; vật được xử lý làm tân ngữ |
| antworten auf + Akkusativ → beantworten + Akkusativ | Er beantwortet die Anfrage. | trả lời yêu cầu |
| sich ver-: hành động sai ở nhiều từ | Ich habe mich verrechnet. | tôi tính nhầm |
| ver-: biến đổi trạng thái | Die Firma vergrößert das Lager. | công ty mở rộng kho |
| ver-: nghĩa từ vựng riêng | Sie versteht den Hinweis. | cô ấy hiểu lời nhắc |

**Be- không có nghĩa mọi động từ bắt đầu bằng be- đều đòi Akkusativ.** Có ngoại lệ như **begegnen + Dativ**, **bedürfen + Genitiv**; **bestehen** có cách dùng riêng. Học cấu trúc của từng từ, không ghép quy tắc tuyệt đối. Be-/ver- không tách; **beantwortet**, **verstanden**, không thêm ge-.

### 3. Câu hỏi trong lời thuật lại
| Trực tiếp | Gián tiếp mới | Nghĩa |
| --- | --- | --- |
| Wann beginnt die Sitzung? | Sie fragt, wann die Sitzung beginne. | cô ấy hỏi cuộc họp bắt đầu khi nào |
| Ist der Raum frei? | Sie fragt, ob der Raum frei sei. | cô ấy hỏi phòng có trống không |
| Wurde der Antrag geprüft? | Sie fragt, ob der Antrag geprüft worden sei. | cô ấy hỏi hồ sơ đã được xét chưa |

Động từ xuống cuối. Konjunktiv I thường xuất hiện trong văn viết dẫn lời; **Indikativ cũng có thể đúng** tùy ngữ cảnh. Nếu Konjunktiv I trùng Indikativ, có thể dùng Konjunktiv II để rõ tính dẫn lời; không tự suy ra nội dung sai sự thật.

### 4. Thuật lại yêu cầu và nguồn dẫn
| Công cụ | Ví dụ mới và nghĩa |
| --- | --- |
| sollen | Die Chefin sagte, ich solle warten. → Sếp bảo tôi đợi. |
| mögen, trang trọng/lịch sự | Sie bat, ich möge leiser sprechen. → Cô ấy đề nghị tôi nói nhỏ hơn. |
| nach + Dativ | Nach dem Bericht ist die Lage stabil. → Theo báo cáo, tình hình ổn định. |
| laut + Dativ/Genitiv | Laut dem Bericht ist die Lage stabil. → Theo báo cáo… |
| zufolge đứng sau + Dativ | Dem Bericht zufolge ist die Lage stabil. → Theo báo cáo… |
| wie + mệnh đề | Wie die Sprecherin erklärte, bleibt das Büro offen. → Như phát ngôn viên giải thích, văn phòng vẫn mở. |

### 5. Mẹo và dấu hiệu
Câu hỏi có/không → **ob**; có từ hỏi → giữ từ hỏi. Sau đó sửa đại từ theo người kể, đưa động từ xuống cuối và chọn thức phù hợp. **Bitte warten Sie! → Sie bat mich, zu warten.** cũng là cách thuật tự nhiên bằng nguyên mẫu.

### 6. Cạm bẫy
- Sai: **Sie fragt, ist der Raum frei.** Đúng: **Sie fragt, ob der Raum frei ist/sei.**
- Sai: **zufolge dem Bericht** khi áp mẫu hậu giới từ. Đúng: **dem Bericht zufolge**.
- Đừng biến **möge** thành **möchte** máy móc: möge là Konjunktiv I của mögen dùng trong lời thỉnh cầu trang trọng.
''',[
('Die Sachbearbeiterin ___ den Antrag. (bearbeiten; Präsens)','bearbeitet','Bearbeiten là xử lý hồ sơ; be- không tách, die Sachbearbeiterin dùng bearbeitet.'),
('Ich habe mich bei der Summe ___. (verrechnen)','verrechnet','Sich verrechnen nghĩa tính nhầm; Partizip II không có ge- vì ver- không tách.'),
('Er begegnet ___ neuen Kollegin.',['der','die','den'],'der','Begegnen là ngoại lệ quan trọng với Dativ. Kollegin giống cái nên der neuen Kollegin.'),
('Sie fragt, ___ alle Unterlagen vollständig seien.',['ob','dass','weil'],'ob','Đây là câu hỏi có/không được thuật lại, nên mở bằng ob.'),
('Sie fragt, wann die Sitzung ___. (beginnen; Konjunktiv I)','beginne','Chủ ngữ Sitzung số ít; Konjunktiv I beginne ở cuối mệnh đề hỏi gián tiếp.'),
('Er wollte wissen, ob der Antrag geprüft worden ___. (sein; Konjunktiv I)','sei','Câu hỏi về bị động quá khứ: geprüft worden sei. Sein chia Konjunktiv I thành sei.'),
('Die Leiterin sagte, ich ___ die Datei sofort sichern. (sollen; Konjunktiv I)','solle','Thuật lại yêu cầu trung tính bằng sollen; Konjunktiv I với ich là solle.'),
('Sie bat höflich, ich ___ das Fenster schließen. (mögen; Konjunktiv I)','möge','Möge thể hiện lời đề nghị trang trọng; không phải möchte trong mẫu bài.'),
('___ Bericht zufolge bleibt die Straße gesperrt.',['Dem','Den','Der'],'Dem','Zufolge đứng sau cụm Dativ; Bericht giống đực nên dem Bericht.'),
('___ die Sprecherin erklärte, werde später entschieden.',['Wie','Als ob','Ob'],'Wie','Wie mở mệnh đề dẫn nguồn phát ngôn. Cả mệnh đề Wie … erklärte đứng ở đầu câu.')])

add(6,'Dativ trang trọng, hậu tố danh từ và từ quy chiếu',[11],'relations',['Präpositionen mit Dativ','Nomensuffixe','Verweiswörter'],r'''
### 1. Bản chất
Văn viết C1 dùng giới từ và từ quy chiếu để gắn ý chặt mà không lặp nguyên câu. Hình thức của **das/dem/daran** phụ thuộc cấu trúc câu sau, không chỉ nghĩa của ý trước.

### 2. Giới từ Dativ
| Giới từ | Vị trí và nghĩa | Ví dụ mới và dịch |
| --- | --- | --- |
| entsprechend | thường đứng trước, cũng có thể đứng sau | Entsprechend dem Plan beginnen wir um acht. → Theo kế hoạch, chúng tôi bắt đầu lúc tám giờ. |
| samt | cùng với | Die Tasche samt dem Inhalt wurde gefunden. → Túi cùng đồ bên trong đã được tìm thấy. |
| fern / fern von | cách xa; fern còn có cách dùng Genitiv | Fern von ihrer Familie arbeitet sie im Ausland. → Cô ấy làm ở nước ngoài, xa gia đình. |
| zuliebe | đứng sau cụm Dativ; vì muốn tốt cho ai | Seinem Sohn zuliebe zieht er um. → Vì con trai, anh ấy chuyển nhà. |

### 3. Hậu tố và giống: học kèm ngoại lệ
| Nhóm | Giống điển hình | Ví dụ và nghĩa |
| --- | --- | --- |
| -ismus, -asmus | der | der Realismus: chủ nghĩa hiện thực; der Sarkasmus: lối châm biếm |
| -ar/-är chỉ nghề nam | der | der Bibliothekar: thủ thư nam; der Sekretär: thư ký nam |
| từ trung có -ar | das | das Exemplar: bản/mẫu; das Vokabular: vốn từ |
| -ment | thường das ở nhiều từ vay mượn | das Experiment: thí nghiệm; **der Moment**: khoảnh khắc là ngoại lệ quan trọng |
| -anz/-enz | thường die | die Toleranz: lòng khoan dung; die Kompetenz: năng lực |

Không phải mọi đuôi âm giống nhau đều có cùng quy tắc. Ghi **mạo từ + từ + số nhiều**: **das Experiment, die Experimente**. Một số từ trông giống nhau nhưng nghĩa/giống khác: **der Moment** và **das Moment** không hoàn toàn đồng nghĩa.

### 4. Từ quy chiếu
| Quan hệ câu sau | Từ phù hợp | Ví dụ mới và nghĩa |
| --- | --- | --- |
| nhắc lại một ý như tân ngữ | das | Das verstehe ich. → Tôi hiểu điều đó. |
| đồng ý với một ý | dem | Dem stimme ich zu. → Tôi đồng ý với điều đó. |
| hệ quả từ ý trước | dadurch / infolgedessen | Die Leitung ist defekt. Dadurch fällt die Heizung aus. → Đường ống hỏng, vì vậy hệ thống sưởi ngừng. |
| thay cho phương án trước | stattdessen | Sie fährt nicht. Stattdessen nimmt sie den Zug. → Cô ấy không lái xe mà đi tàu. |
| một địa điểm | dort / da | Das Büro ist im Erdgeschoss. Dort wartet sie. → Văn phòng ở tầng trệt; cô ấy chờ ở đó. |

### 5. Mẹo đọc và viết
Gạch chân câu/nhóm từ mà đại từ trỏ tới. Sau đó kiểm tra động từ của câu mới: **zustimmen + Dativ → dem**. Trạng từ nối đứng đầu chiếm một vị trí: **Dadurch wird die Arbeit leichter**, không đặt thêm chủ ngữ trước động từ.

### 6. Cạm bẫy
- Sai: **Das stimme ich zu.** Đúng: **Dem stimme ich zu.**
- Sai: **zuliebe seinem Kind** trong mẫu hậu giới từ đang học. Đúng: **seinem Kind zuliebe**.
- Sai: **Dadurch die Arbeit wird leichter.** Đúng: **Dadurch wird die Arbeit leichter.**
''',[
('Entsprechend ___ neuen Regel wird der Antrag digital gestellt.',['der','die','den'],'der','Entsprechend yêu cầu Dativ; Regel giống cái số ít nên der neuen Regel.'),
('Das Handy samt ___ Zubehör ist versichert.',['dem','das','des'],'dem','Samt dùng Dativ; Zubehör trung nên dem Zubehör.'),
('Sein___ Eltern zuliebe bleibt er in der Stadt.','en','Eltern số nhiều Dativ: seinen Eltern. Zuliebe đứng sau cụm danh từ.'),
('Sie arbeitet fern ___ ihrer Heimat. (von/aus)','von','Mẫu fern von + Dativ diễn đạt xa quê. Fern cũng có cách dùng không von, nhưng câu có chỗ trống cần von.'),
('Welcher Artikel? ___ Experiment gelang.',['Das','Der','Die'],'Das','Experiment là danh từ trung, số nhiều Experimente.'),
('Welcher Artikel? ___ Sekretär ruft an.',['Der','Das','Die'],'Der','Sekretär ở đây là nghề nam nên der; nữ là die Sekretärin.'),
('Welcher Artikel? ___ Kompetenz ist entscheidend.',['Die','Der','Das'],'Die','Kompetenz là giống cái, thuộc nhóm hậu tố -enz thường có die.'),
('Dieser Vorschlag ist sinnvoll. ___ stimme ich zu.',['Dem','Das','Dessen'],'Dem','Zustimmen đòi Dativ, nên dem trỏ lại đề xuất/nhận định trước.'),
('Die Maschine ist kaputt. ___ müssen wir die Arbeit unterbrechen.',['Dadurch','Daran','Dafür'],'Dadurch','Dadurch nối hệ quả do máy hỏng; danach/daran không biểu thị đúng quan hệ yêu cầu.'),
('Sie kauft kein Auto. ___ nutzt sie den Bus.',['Stattdessen','Dessen','Obwohl'],'Stattdessen','Stattdessen nêu phương án thay thế; câu sau V2: Stattdessen nutzt sie …')])

add(7,'Nominalstil, quan hệ nguyên nhân và tính từ từ trạng từ',[12,13],'sentences',['Verbalstil und Nominalstil','Kausale Zusammenhänge','Adjektive aus Adverbien'],r'''
### 1. Bản chất: đổi cách đóng gói thông tin
Verbalstil kể **ai làm gì**; Nominalstil biến sự việc thành cụm danh từ. Đây là thay đổi cấu trúc, không đơn thuần thay một động từ bằng từ có -ung. Phải giữ rõ người làm, đối tượng, thời gian và quan hệ nguyên nhân.

### 2. Biến đổi có kiểm soát
| Câu động từ mới | Cụm danh từ tương ứng | Phân tích |
| --- | --- | --- |
| Die Preise steigen stark. | der starke Anstieg der Preise | stark → starke; Preise thành Genitiv |
| Die Firma prüft den Antrag. | die Prüfung des Antrags durch die Firma | đối tượng ở Genitiv; người thực hiện có durch |
| Die Beraterin hilft dem Kunden. | die Hilfe für den Kunden | đổi cấu trúc Dativ thành für + Akkusativ theo danh từ Hilfe |
| Man liefert Waren. | die Lieferung von Waren | danh từ số nhiều không mạo từ thường dùng von + Dativ |

**Die Prüfung des Instituts** có thể mơ hồ: viện đi kiểm tra hay bị kiểm tra? Thêm **durch das Institut** khi cần nêu rõ người thực hiện. Không cố danh từ hóa mọi câu vì có thể làm văn nặng và khó hiểu.

### 3. Quan hệ nguyên nhân: ba bảng riêng
| Mệnh đề phụ | Cách dùng | Ví dụ và nghĩa |
| --- | --- | --- |
| weil / da | động từ cuối | Da der Server ausfällt, verschieben wir die Sitzung. → Vì máy chủ hỏng, chúng tôi hoãn họp. |
| zumal | bổ sung lý do đáng kể, “nhất là vì” | Ich bleibe zu Hause, zumal ich Fieber habe. → Tôi ở nhà, nhất là vì đang sốt. |

| Liên kết câu chính | Vị trí |
| --- | --- |
| deshalb / deswegen / daher | nếu đứng đầu thì động từ chia ngay sau |
| denn | không chiếm vị trí đầu câu trong mô hình V2 của vế sau |
| nämlich / eben | thường ở giữa câu; không đóng đinh “vị trí 3” cho mọi câu |

| Giới từ nguyên nhân | Cách | Ví dụ |
| --- | --- | --- |
| wegen / aufgrund / mangels / angesichts / kraft | Genitiv trong mẫu trang trọng | mangels ausreichender Belege: do thiếu chứng cứ đầy đủ |
| aus / vor | **Dativ** | aus persönlichem Interesse; vor großer Aufregung |
| dank | Dativ hoặc Genitiv tùy cấu trúc | dank Ihrer Hilfe: nhờ sự giúp đỡ của anh/chị |

**Hiệu đính nguồn:** PDF trang 13 ghi aus/vor + Genitiv; trong các mẫu nguyên nhân này phải là Dativ. **Aus** hay chỉ động cơ; **vor** hay chỉ phản ứng do trạng thái mạnh, nhưng kết hợp từ vẫn cần học theo ngữ cảnh.

### 4. Tính từ từ trạng từ
**heute → heutig**, **morgen → morgig**, **gestern → gestrig**, **hier → hiesig**, **dort → dortig**, **oben → obig**. Trước danh từ vẫn phải chia đuôi: **die heutige Sitzung**, **mit den hiesigen Behörden**. → cuộc họp hôm nay; với cơ quan địa phương ở đây.

### 5. Mẹo nhận biết
Muốn đổi **weil** sang giới từ: xác định danh từ trung tâm, rồi chọn cách, cuối cùng xử lý tác nhân. **Weil der Bus verspätet ist → wegen der Verspätung des Busses**: do xe buýt trễ. Đừng giữ nguyên động từ chia sau wegen.

### 6. Cạm bẫy
- Sai: **aus persönliches Interesse**. Đúng: **aus persönlichem Interesse**.
- Sai: **Deshalb wir warten.** Đúng: **Deshalb warten wir.**
- Sai: **die morgen Sitzung**. Đúng: **die morgige Sitzung**.
''',[
('Wegen ___ Ausfalls bleibt die Anlage stehen.',['des','dem','den'],'des','Mẫu văn viết dùng wegen + Genitiv; Ausfall giống đực nên des Ausfalls.'),
('Sie hilft aus persönlich___ Interesse. (đuôi tính từ)','em','Aus luôn đòi Dativ trong mẫu này; Interesse trung, không mạo từ nên persönlichem.'),
('Er zittert vor groß___ Aufregung. (đuôi tính từ)','er','Vor nguyên nhân dùng Dativ; Aufregung giống cái, không mạo từ nên großer.'),
('Die Straße ist gesperrt. Deshalb ___ wir einen Umweg. (nehmen)','nehmen','Deshalb chiếm Vorfeld, động từ đứng ngay sau; chủ ngữ wir đứng sau động từ.'),
('Ich sage ab, ___ ich morgen operiert werde. (thêm lý do nhấn mạnh)',['zumal','trotzdem','dadurch'],'zumal','Zumal mở mệnh đề phụ, bổ sung lý do đáng kể; werde cuối câu.'),
('Die Prüfung des Antrags ___ die Behörde dauert lange. (nêu tác nhân)',['durch','wegen','ohne'],'durch','Durch die Behörde nêu bên thực hiện kiểm tra; des Antrags là đối tượng được kiểm tra.'),
('Verbal → nominal: Die Preise steigen. → der ___ der Preise.','Anstieg','Steigen có danh từ der Anstieg; không tự tạo Steigung cho mọi nghĩa, vì Steigung còn chỉ độ dốc.'),
('Die Beratung hilft dem Kunden. → die Hilfe ___ den Kunden.','für','Hilfe thường có für + Akkusativ khi nêu người hưởng sự giúp đỡ; không giữ nguyên Dativ máy móc.'),
('Die ___ Sitzung beginnt um neun. (heute → tính từ)','heutige','Heute đổi thành heutig; sau die ở Nominativ cái, thêm -e.'),
('Wir arbeiten mit den ___ Behörden. (hier → tính từ)','hiesigen','Hier có tính từ hiesig. Mit den … Behörden là Dativ số nhiều, tính từ -en.')])

add(8,'Gerundiv, bekommen-Passiv và hậu tố tính từ',[14,15],'verbs',['Gerundiv','wollen und sollen im Passiv','bekommen-Passiv','Adjektivsuffixe'],r'''
### 1. Bản chất
Một danh từ có thể được mô tả bằng hành động **có thể/cần được làm**. Gerundiv nén quan hệ bị động có tính modal vào một thuộc ngữ: **die noch zu prüfenden Anträge** → các hồ sơ còn cần được xét.

### 2. Gerundiv từng bước
| Bước | Dạng |
| --- | --- |
| động từ gốc | prüfen |
| Partizip I | prüfend |
| thêm zu và đuôi thuộc ngữ | die zu prüfenden Anträge |
| diễn đạt lại | die Anträge, die geprüft werden müssen/sollen |

Với động từ tách: **durchführen → durchzuführend → ein durchzuführender Test**. Nghĩa có thể hay phải tùy ngữ cảnh: **leicht zu behebende Fehler** thường là lỗi dễ sửa; **dringend zu behebende Fehler** thường là lỗi cần sửa gấp.

### 3. Chuyển góc nhìn và bị động người nhận
| Cấu trúc | Ví dụ mới | Giải thích |
| --- | --- | --- |
| ý định của tác nhân | Die Leitung will die Gäste informieren. | ban quản lý muốn thông báo cho khách |
| kế hoạch nhìn từ đối tượng | Die Gäste sollen informiert werden. | theo kế hoạch khách cần được thông báo; chỉ tương đương khi ngữ cảnh giữ cùng ý định |
| werden-Passiv | Dem Gast wird der Weg erklärt. | đường đi được giải thích cho khách |
| bekommen-Passiv | Der Gast bekommt den Weg erklärt. | khách là người nhận lời giải thích |

**Hiệu đính thuật ngữ:** bekommen + Partizip II ở nghĩa này là **Rezipientenpassiv/bekommen-Passiv**, không phải câu chủ động thông thường. Dativ **dem Gast** chuyển thành chủ ngữ **der Gast**; Akkusativ **den Weg** vẫn là tân ngữ. Không áp dụng được tự do cho mọi động từ và mọi Dativ.

### 4. Hậu tố tính từ: phân biệt bằng nghĩa
| Cặp/nhóm | Nghĩa | Ví dụ và dịch |
| --- | --- | --- |
| real / reell | có thực / thực chất, có triển vọng, ngay thẳng tùy ngữ cảnh | reale Kosten: chi phí thực; reelle Chancen: cơ hội thực sự |
| ideal / ideell | lý tưởng / thuộc tinh thần, phi vật chất | ideelle Unterstützung: hỗ trợ tinh thần |
| rational / rationell | dựa lý trí / hiệu quả, tiết kiệm nguồn lực | rationale Entscheidung; rationelle Arbeitsweise |
| -abel/-ibel | nhiều từ diễn đạt khả năng, nhưng có ngoại lệ nghĩa | reparabel: sửa được; sensibel: nhạy cảm |
| -ös/-iös | nghĩa từ vựng phải học cả từ | nervös: lo lắng; seriös: đáng tin/nghiêm túc |

Không diễn giải **sensibel** thành “có thể bị cảm nhận” chỉ vì đuôi -ibel. Tiền/hậu tố là gợi ý, không thay từ điển.

### 5. Mẹo nhận biết
Gặp **zu + dạng có -d- + đuôi** trước danh từ, thử bung thành mệnh đề quan hệ có **werden + modal**. Gặp **bekommt … erklärt**, hỏi ai nhận việc giải thích thay vì dịch bekommt thành “nhận được một món đồ”.

### 6. Cạm bẫy
- Sai: **die zu prüfen Anträge**. Đúng: **die zu prüfenden Anträge**.
- Sai: **Der Gast bekommt der Weg erklärt.** Đúng: **… den Weg erklärt**.
- Không đổi mọi **wollen** thành **sollen** mà bỏ tác nhân hoặc thay nội dung dự định.
''',[
('die noch zu ___ Anträge (prüfen; Gerundiv)','prüfenden','Prüfen → prüfend; sau die số nhiều là prüfenden. Zu giữ riêng vì prüfen không tách.'),
('ein leicht zu ___ Fehler (beheben; Gerundiv)','behebender','Fehler giống đực Nominativ sau ein cần -er: behebend + er.'),
('der heute ___ Test (durchführen; Gerundiv)',['durchzuführende','zu durchführen','durchgeführt'],'durchzuführende','Động từ tách đưa zu vào trong: durchzuführen; Gerundiv durchzuführend, sau der thêm -e.'),
('Bung nghĩa: eine leicht zu öffnende Tür → eine Tür, die leicht geöffnet werden ___.','kann','Leicht cho thấy khả năng mở được; không phải lúc nào Gerundiv cũng mang nghĩa phải.'),
('Die Gäste sollen rechtzeitig informiert ___.','werden','Bị động với modal dùng Partizip II + werden, không dùng sein nếu đang nói hành động thông báo.'),
('Dem Gast wird der Plan erklärt. → Der Gast bekommt ___ Plan erklärt.',['den','der','dem'],'den','Người nhận thành chủ ngữ, nhưng vật được giải thích vẫn Akkusativ: den Plan.'),
('Bekommen + Partizip II ở nghĩa người nhận được gọi là gì?',['Rezipientenpassiv','Futur II','Zustandspassiv'],'Rezipientenpassiv','Đây là một loại bị động lấy người nhận làm chủ ngữ, không phải chủ động chỉ vì có bekommen.'),
('Materielle und ___ Werte sind verschieden. (ideal/ideell)','ideelle','Ideell nghĩa thuộc tinh thần, đối lập vật chất; ở số nhiều không mạo từ là ideelle Werte.'),
('Eine vernunftgeleitete Entscheidung ist ___. (rational/rationell)','rational','Rational nhấn mạnh lý trí; rationell nhấn hiệu quả sử dụng công sức/nguồn lực.'),
('Der Schaden kann repariert werden. Er ist ___. (Adjektiv auf -abel)','reparabel','Reparabel là có thể sửa được; học trọn từ, không suy ra mọi từ -abel đều cùng một cấu trúc nghĩa.')])


add(9,'Điều kiện, nhượng bộ, tính từ kèm giới từ và làm rõ ý',[16,17],'sentences',['Konditionale Zusammenhänge','Konzessive Zusammenhänge','Adjektive mit Präpositionen','Präzisierende Verbindungsadverbien'],r'''
### 1. Bản chất: điều kiện khác nhượng bộ
**Nếu được tài trợ thì mua máy** là điều kiện. **Dù chưa được tài trợ vẫn mua máy** là nhượng bộ. Trước khi chọn liên từ, viết lại quan hệ bằng tiếng Việt để không lẫn ý.

### 2. Điều kiện: câu và cụm danh từ
| Cấu trúc | Vị trí | Ví dụ mới và nghĩa |
| --- | --- | --- |
| falls / sofern / unter der Bedingung, dass | động từ cuối mệnh đề | Sofern die Mittel reichen, kaufen wir neue Geräte. → Nếu kinh phí đủ, chúng tôi mua thiết bị mới. |
| vorausgesetzt, (dass) | có dass: động từ cuối; không dass có thể là câu V2 | Wir starten, vorausgesetzt, alle sind bereit. → Chúng tôi bắt đầu với điều kiện mọi người sẵn sàng. |
| sonst / andernfalls | nối câu chính V2 | Bezahlen Sie bis Freitag, andernfalls verfällt die Reservierung. → Trả trước hết thứ Sáu, nếu không đặt chỗ mất hiệu lực. |
| bei + Dativ / im Falle + Genitiv | giới từ + danh từ | Bei starkem Regen bleiben wir drinnen. → Nếu mưa to, chúng tôi ở trong nhà. |
| je nach + Dativ | tùy theo | Je nach Ergebnis ändern wir den Plan. → Tùy kết quả, chúng tôi đổi kế hoạch. |

**Je nachdem, ob/wie …** là câu phụ; **je nach** đi với cụm danh từ. **Ohne Ihre Zustimmung** diễn đạt thiếu điều kiện chấp thuận, nhưng không phải mọi ohne đều có nghĩa điều kiện.

### 3. Nhượng bộ
| Dạng | Ví dụ mới và nghĩa |
| --- | --- |
| obwohl / obgleich / obschon | Obwohl er gut vorbereitet ist, bleibt er nervös. → Dù chuẩn bị kỹ, anh ấy vẫn lo. |
| auch wenn / selbst wenn | Auch wenn es regnet, fahren wir. → Dù có mưa, chúng tôi vẫn đi. |
| trotzdem / dennoch / allerdings | Es regnet. Dennoch fahren wir. → Trời mưa. Tuy vậy chúng tôi vẫn đi. |
| trotz / ungeachtet + Genitiv; selbst bei + Dativ | Trotz des Regens fahren wir. → Bất chấp trời mưa, chúng tôi vẫn đi. |

**Obwohl** thường coi sự việc là đã biết; **selbst wenn** có thể nêu giả định cực đoan. Chúng không luôn tương đương hoàn toàn. **Allerdings** còn có nghĩa xác nhận/giới hạn nhận định, không thay trotzdem ở mọi câu.

### 4. Tính từ và giới từ: hai bảng
| Akkusativ | Ví dụ |
| --- | --- |
| angewiesen auf, bemüht um, dankbar für, entscheidend für | Wir sind auf Ihre Hilfe angewiesen. → Chúng tôi cần sự giúp đỡ của anh/chị. |
| erfreut über, gespannt auf, glücklich über, verwundert über | Ich bin gespannt auf den Bericht. → Tôi đang mong xem báo cáo. |

| Dativ | Ví dụ |
| --- | --- |
| aufgeschlossen gegenüber, erfahren in, überzeugt von, zufrieden mit | Sie ist mit dem Ergebnis zufrieden. → Cô ấy hài lòng với kết quả. |

### 5. Làm rõ và sửa ý
**Und zwar** bổ sung chính xác: **Wir treffen uns morgen, und zwar um acht.** → Chúng ta gặp ngày mai, cụ thể lúc tám giờ. **Vielmehr** sửa cách hiểu: **Es ist kein Verbot, vielmehr ist es eine Empfehlung.** → Đó không phải lệnh cấm mà là lời khuyên. **Beziehungsweise/respektive** tùy ngữ cảnh có thể nối tương ứng hoặc diễn đạt chính xác hơn; không luôn bằng “hoặc”.

### 6. Mẹo và cạm bẫy
- Nhớ cặp: **je nach + danh từ**, **je nachdem + mệnh đề**.
- Sai: **Trotz dem Regens**. Mẫu văn viết: **trotz des Regens**; không trộn đuôi Dativ và Genitiv.
- Sai: **zufrieden über dem Ergebnis**. Đúng: **zufrieden mit dem Ergebnis**.
''',[
('___ die Finanzierung steht, können wir beginnen. (điều kiện)',['Sofern','Obwohl','Dennoch'],'Sofern','Sofern nghĩa với điều kiện là; động từ steht nằm cuối mệnh đề phụ.'),
('Zahlen Sie fristgerecht, ___ verlieren Sie den Anspruch.',['andernfalls','obgleich','sofern'],'andernfalls','Andernfalls mở câu chính biểu thị nếu không thì; động từ verlieren theo ngay sau.'),
('Bei stark___ Regen fällt das Konzert aus.','em','Bei yêu cầu Dativ; Regen giống đực không mạo từ nên starkem.'),
('Je ___ Ergebnis wird neu entschieden.',['nach','nachdem','obwohl'],'nach','Sau chỗ trống là danh từ Ergebnis, nên je nach + Dativ, không phải je nachdem mở mệnh đề.'),
('Je nachdem, ___ viele Gäste kommen, öffnen wir einen zweiten Raum.',['wie','nach','trotz'],'wie','Je nachdem, wie … diễn đạt tùy vào số lượng khách; kommen cuối mệnh đề.'),
('___ des Regens findet das Training statt.',['Trotz','Wegen','Mangels'],'Trotz','Trời mưa nhưng vẫn tập là quan hệ nhượng bộ; des Regens là Genitiv.'),
('Wir sind auf Ihr___ Rat angewiesen.','en','Angewiesen auf + Akkusativ; Rat giống đực nên Ihren Rat.'),
('Sie ist mit d___ Ergebnis zufrieden.','em','Zufrieden mit + Dativ; Ergebnis trung nên dem Ergebnis.'),
('Wir reisen am Montag, ___ um sechs Uhr.',['und zwar','vielmehr nicht','sofern'],'und zwar','Und zwar bổ sung giờ chính xác cho thời điểm thứ Hai; không mở mệnh đề điều kiện.'),
('Es ist keine Pflicht; ___ ist es eine Empfehlung.',['vielmehr','obwohl','außer wenn'],'vielmehr','Vielmehr đính chính cách hiểu “nghĩa vụ” bằng “lời khuyên”; câu theo trật tự V2.')])

add(10,'Vorfeld–Nachfeld, hậu tố danh từ và quan hệ thời gian–mục đích',[18,19],'sentences',['Variationen der Satzstellung','Nomensuffixe','Temporale Zusammenhänge','Finale Zusammenhänge'],r'''
### 1. Bản chất: thay điểm nhấn, giữ khung câu
Tiếng Đức cho phép đưa một thành phần lên đầu để nhấn mạnh, nhưng động từ chia trong câu trần thuật vẫn giữ vị trí thứ hai. “Vị trí” là thành phần câu, không phải số từ.

### 2. Vorfeld và Nachfeld tách riêng
| Dạng thường | Đưa lên Vorfeld | Ý nghĩa |
| --- | --- | --- |
| Ich habe den Bericht gelesen. | Gelesen habe ich den Bericht. | nhấn mạnh hành động đã đọc |
| Man kann die Frist verlängern. | Verlängern kann man die Frist. | nhấn mạnh khả năng gia hạn |

| Trong Satzklammer | Ra Nachfeld | Ý nghĩa |
| --- | --- | --- |
| Er ist größer als ich gewesen. | Er ist größer gewesen als ich. | cụm so sánh được đặt sau phần động từ cuối |
| Sie hat zu arbeiten begonnen. | Sie hat begonnen zu arbeiten. | cụm nguyên mẫu ra sau |

Không đưa tự do mọi bổ ngữ ra sau mà vẫn mặc định tự nhiên như nhau. Nachfeld thường hợp với thành phần dài, so sánh, mệnh đề hoặc phần bổ sung; câu trang trọng vẫn cần cân bằng.

### 3. Hậu tố danh từ
| Giống thường gặp | Đuôi | Ví dụ và nghĩa |
| --- | --- | --- |
| die | -(a)tion, -ie, -ität, -ur | die Organisation: tổ chức; die Harmonie: hòa hợp; die Stabilität: ổn định; die Struktur: cấu trúc |
| das | nhiều từ -tum; -ium | das Eigentum: tài sản; das Studium: việc học đại học |
| ngoại lệ cần học | -tum | **der Reichtum**, **der Irrtum**; không áp das cho mọi từ -tum |

### 4. Thời gian
| Quan hệ | Công cụ | Ví dụ mới và nghĩa |
| --- | --- | --- |
| một lần quá khứ | als | Als der Kurs endete, bekam sie ein Zertifikat. → Khi khóa học kết thúc, cô ấy nhận chứng chỉ. |
| trước/sau | bevor/ehe; nachdem | Nachdem sie gegessen hatte, ging sie los. → Ăn xong cô ấy đi. |
| xảy ra ngay sau | sobald | Sobald die Prüfung beendet ist, rufe ich an. → Thi xong là tôi gọi. |
| đồng thời | während; währenddessen | Während sie liest, macht er Notizen. → Trong khi cô ấy đọc, anh ấy ghi chú. |
| sự việc dẫn tiếp diễn biến | woraufhin; daraufhin | Die Tür fiel zu, woraufhin er zurücklief. → Cửa sập lại, sau đó anh ấy chạy quay lại. |

**Woraufhin** nối mệnh đề phụ có động từ cuối; **daraufhin** là trạng từ của câu chính V2. **Beim Lesen** = khi đọc; **im Sitzen** = trong tư thế ngồi. **Am Arbeiten sein** thuộc cách diễn đạt tiến hành thường gặp ở khẩu ngữ, không mặc định dùng cho mọi bài viết trang trọng.

### 5. Mục đích
**Um … zu** dùng với chủ thể ngầm xác định được; **damit** có chủ ngữ riêng. **Sie spricht leise, damit das Kind nicht aufwacht.** → Cô ấy nói nhỏ để đứa trẻ không tỉnh. Dạng danh từ: **für + Akkusativ**, **zu + Dativ**, **zwecks / zum Zwecke + Genitiv**. **Zur Vorbereitung liest sie den Bericht.** → Để chuẩn bị, cô ấy đọc báo cáo. **Wofür/wozu** có thể hỏi mục đích hoặc nối tới một hành động trước đó; **dafür/dazu** ở câu chính.

### 6. Cạm bẫy và mẹo
- Sai: **Gelesen ich habe …**. Đúng: **Gelesen habe ich …**.
- Sai: **woraufhin er lief zurück**. Đúng: **woraufhin er zurücklief**.
- Đừng biến nachdem thành quy tắc “luôn Plusquamperfekt”: thì phụ thuộc mốc kể. Quá khứ kể thường dùng Plusquamperfekt trước Präteritum; hiện tại/tương lai có thể dùng Perfekt trước Präsens.
''',[
('___ habe ich den Vertrag, unterschrieben aber noch nicht. (lesen; Partizip II)','Gelesen','Gelesen đưa lên Vorfeld để nhấn; habe vẫn là động từ chia vị trí hai.'),
('Verlängern ___ man die Frist nur einmal. (können)','kann','Nguyên mẫu Verlängern chiếm đầu câu; man dùng kann ngay sau.'),
('Đuôi -tum không luôn trung. Chọn mạo từ: ___ Irrtum.',['der','das','die'],'der','Der Irrtum là ngoại lệ; không suy ra das chỉ từ hình thức -tum.'),
('Welcher Artikel? ___ Stabilität ist wichtig.',['Die','Der','Das'],'Die','Stabilität là giống cái; -ität là dấu hiệu mạnh cho die.'),
('___ sie gestern ankam, war das Büro geschlossen.',['Als','Wenn','Sobald dass'],'Als','Một lần đến hôm qua trong quá khứ dùng als, không dùng wenn như mẫu lặp lại.'),
('Nachdem er gegessen ___, fuhr er los. (haben; quá khứ trước mốc fuhr)','hatte','Hành động ăn xảy ra trước fuhr; Plusquamperfekt hatte gegessen nêu rõ trình tự.'),
('Die Tür fiel zu, woraufhin er sofort ___. (zurücklaufen; Präteritum)','zurücklief','Woraufhin mở mệnh đề phụ; động từ tách được ghép lại và đưa xuống cuối: zurücklief.'),
('Die Tür fiel zu. Daraufhin ___ er zurück. (laufen; Präteritum)','lief','Daraufhin là trạng từ chiếm Vorfeld của câu chính; động từ chia lief đứng sau.'),
('Sie spricht leise, ___ das Kind nicht aufwacht.',['damit','um zu','zwecks'],'damit','Chủ thể cô ấy nói và đứa trẻ tỉnh khác nhau; damit mở câu phụ có chủ ngữ riêng.'),
('Zwecks d___ Vorbereitung werden Unterlagen verschickt.','er','Zwecks đi với Genitiv; Vorbereitung giống cái nên der Vorbereitung.')])

add(11,'Hệ quả, phương thức, so sánh ngầm và tiền tố er-/re-',[20,21],'sentences',['Konsekutive Zusammenhänge','Modale Zusammenhänge','Implizite Vergleiche und relativer Superlativ','Wortbildung: er-, re-'],r'''
### 1. Bản chất: kết quả hay cách thực hiện?
**Vì vậy khách hài lòng** là hệ quả. **Bằng cách giải thích rõ, cô ấy giúp khách hiểu** là phương thức. Một từ như **damit** có thể biểu đạt mục đích trong câu phụ hoặc “bằng việc đó” trong câu chính: cần xem cấu trúc.

### 2. Hệ quả
| Cấu trúc | Ví dụ mới và nghĩa |
| --- | --- |
| so …, dass | Die Anleitung ist so klar, dass jeder sie versteht. → Hướng dẫn rõ đến mức ai cũng hiểu. |
| solch ein / ein solcher …, dass | Es war ein solcher Lärm, dass wir gehen mussten. → Ồn đến mức chúng tôi phải đi. |
| sodass / so dass | Es regnete, sodass die Straße überflutet wurde. → Mưa khiến đường ngập. |
| weshalb / weswegen | Der Zug fiel aus, weshalb sie ein Taxi nahm. → Tàu bị hủy nên cô ấy đi taxi. |
| folglich / demnach / demzufolge / infolgedessen | Die Nachfrage steigt. Folglich brauchen wir mehr Personal. → Nhu cầu tăng, vì vậy cần thêm nhân sự. |
| infolge + Genitiv; infolge von + Dativ | Infolge eines Defekts stand die Anlage still. → Do trục trặc, dây chuyền dừng. |

### 3. Phương thức
| Cấu trúc | Ví dụ mới và nghĩa |
| --- | --- |
| indem / dadurch, dass | Sie spart Zeit, indem sie Vorlagen nutzt. → Cô ấy tiết kiệm thời gian bằng cách dùng mẫu. |
| wodurch / womit | Er automatisiert den Ablauf, wodurch Fehler seltener werden. → Anh ấy tự động hóa quy trình, nhờ vậy lỗi giảm. |
| dadurch / damit / auf diese Weise | Sie nutzt Vorlagen. Dadurch spart sie Zeit. → Cô ấy dùng mẫu, nhờ đó tiết kiệm thời gian. |
| durch + Akkusativ; mittels/mithilfe + Genitiv | Mittels eines Sensors wird die Temperatur überwacht. → Nhiệt độ được theo dõi bằng cảm biến. |

**Indem** thường nêu cách thực hiện; **wodurch** có thể nêu hệ quả do việc trước gây ra. Không cho rằng mọi câu có chúng đều thay nhau hoàn toàn.

### 4. So sánh ngầm: hai lớp đuôi
**Wir brauchen einen größeren Raum.** → Chúng ta cần phòng rộng hơn. Chuẩn so sánh được hiểu theo ngữ cảnh, không bắt buộc có **als**. **Größ-er-en** có -er của so sánh và -en của biến cách; không cắt mất lớp nào.

| Danh từ được chọn | Mẫu tương đối | Dịch |
| --- | --- | --- |
| đực | einer der besten Vorschläge | một trong những đề xuất tốt nhất |
| trung | eines der besten Ergebnisse | một trong những kết quả tốt nhất |
| cái | eine der besten Lösungen | một trong những giải pháp tốt nhất |

**Einer/eines/eine** còn đổi theo vai trò trong câu: **mit einem der besten Vorschläge**. Danh từ sau **der besten** là số nhiều, ở Genitiv.

### 5. Tiền tố và mẹo
**Er-** thường gặp ở kết quả hoặc thay đổi trạng thái: **erröten** đỏ mặt, **erarbeiten** làm ra thông qua công sức. **Re-** ở nhiều từ vay mượn liên quan trở lại/làm lại: **reimportieren**, **reaktivieren**. Nghĩa của **reagieren** phải học như một từ riêng, không suy ra tự động “làm lại một hành động”. Không tách er-/re- trong các từ này; từ -ieren như reaktivieren không thêm ge-.

### 6. Cạm bẫy
- Sai: **einer der beste Vorschlag**. Đúng: **einer der besten Vorschläge**.
- Sai: **mittels einen Sensor**. Đúng: **mittels eines Sensors**.
- Sai: **Dadurch sie spart Zeit.** Đúng: **Dadurch spart sie Zeit.**
''',[
('Die Datei war so groß, ___ sie nicht versendet werden konnte.',['dass','denn','damit'],'dass','So … dass diễn đạt mức độ dẫn đến hệ quả; konnte đứng cuối mệnh đề.'),
('Der Zug fiel aus, ___ wir ein Taxi nahmen.',['weshalb','deshalb','folglich'],'weshalb','Weshalb mở mệnh đề phụ nên nahmen nằm cuối; deshalb/folglich sẽ cần cấu trúc câu chính V2.'),
('Infolge ein___ Defekts blieb das Gerät stehen.','es','Infolge trực tiếp với Genitiv; Defekt giống đực dùng eines Defekts.'),
('Infolge von stark___ Regenfällen fiel die Verbindung aus.','en','Infolge von dùng Dativ; số nhiều starken Regenfällen có -en ở tính từ và -n ở danh từ.'),
('Sie spart Zeit, ___ sie eine Vorlage verwendet.',['indem','obwohl','dennoch'],'indem','Indem mô tả cách thức tiết kiệm thời gian; không phải nhượng bộ.'),
('Mittels ein___ Sensors wird die Temperatur gemessen.','es','Mittels theo mẫu trang trọng đòi Genitiv: eines Sensors.'),
('Wir brauchen einen größer___ Raum. (đuôi biến cách)','en','So sánh größer đã có -er; sau einen ở Akkusativ đực thêm -en thành größeren.'),
('Das ist ___ der besten Ergebnisse.',['eines','einer','eine'],'eines','Ergebnis là trung; chọn một kết quả trong nhóm dùng eines der besten Ergebnisse.'),
('Mit ___ der besten Vorschläge gewann sie.',['einem','einer','eines'],'einem','Mit yêu cầu Dativ; đại từ thay Vorschlag giống đực là einem. Der besten Vorschläge vẫn là nhóm Genitiv số nhiều.'),
('Die IT hat das Konto wieder ___. (reaktivieren)','reaktiviert','Reaktivieren nghĩa kích hoạt lại; -ieren tạo Partizip II không có ge-.')])

add(12,'Genitiv chuyên sâu, Partizipialsätze và tiền tố tách/không tách',[22],'relations',['Präpositionen mit Genitiv','Partizipialsätze','durch-, über-, um-, unter-'],r'''
### 1. Bản chất
Văn viết có thể nén cả một mệnh đề thành cụm giới từ hoặc cụm phân từ. Câu ngắn hơn chưa chắc rõ hơn: phải giữ đúng quan hệ nghĩa và chủ thể của hành động.

### 2. Giới từ Genitiv theo nghĩa
| Giới từ | Quan hệ | Ví dụ mới và nghĩa |
| --- | --- | --- |
| angesichts | xét tình hình/đối mặt với | angesichts der hohen Kosten: trước chi phí cao |
| anlässlich | nhân dịp/sự kiện | anlässlich des Jubiläums: nhân dịp kỷ niệm |
| hinsichtlich | xét về, liên quan đến | hinsichtlich der Sicherheit: về mặt an toàn |
| mithilfe / mittels | công cụ, phương tiện | mithilfe eines Programms: nhờ một chương trình |
| oberhalb | ở phía trên một mốc | oberhalb der Grenze: phía trên giới hạn |
| ungeachtet | bất chấp, không xét đến | ungeachtet der Risiken: bất chấp rủi ro |
| unweit | không xa | unweit des Bahnhofs: gần ga |

Mẫu đang học là Genitiv trang trọng; **mithilfe von + Dativ** là biến thể khác. Kiểm tra cả danh từ: **mittels eines neuen Verfahrens**, không chỉ sửa ein thành eines.

### 3. Partizipialsätze: tách hai dạng
| Dạng | Câu mới | Diễn đạt đầy đủ và nghĩa |
| --- | --- | --- |
| Partizip I: chủ động, thường đồng thời | Leise sprechend, erklärte sie den Ablauf. | Während/indem sie leise sprach, erklärte sie den Ablauf. → Vừa nói nhỏ, cô ấy giải thích quy trình. |
| Partizip II: thường bị động/kết quả; có thể là trạng thái sau hành động | Vom Ergebnis enttäuscht, verließ er den Raum. | Weil er vom Ergebnis enttäuscht war, verließ er den Raum. → Thất vọng về kết quả, anh ấy rời phòng. |
| phân từ trong phần chen | Der Plan, obwohl gut vorbereitet, scheiterte. | … obwohl er gut vorbereitet war … → Kế hoạch dù chuẩn bị tốt vẫn thất bại. |

Không có chủ ngữ riêng trong cụm phân từ: chủ thể phải nối được với thành phần thích hợp, thường là chủ ngữ câu chính. **Im Büro angekommen, schaltete sie den Computer ein.** → Đến văn phòng, cô ấy bật máy. Angekommen là Partizip II của động từ nội động nên **không tự động là bị động**.

### 4. Tiền tố tách và trọng âm
| Cặp | Tách, trọng âm ở tiền tố | Không tách, trọng âm ở thân |
| --- | --- | --- |
| umfahren | Er fährt den Pfosten um. → Anh ấy tông đổ cột. Perfekt: hat umgefahren. | Er umfährt die Baustelle. → Anh ấy lái vòng tránh công trường. Perfekt: hat umfahren. |
| überziehen | Sie zieht eine Jacke über. → Cô ấy khoác thêm áo. Perfekt: hat übergezogen. | Sie überzieht ihr Konto. → Cô ấy thấu chi. Perfekt: hat überzogen. |
| unterstellen | Wir stellen uns unter. → Chúng tôi trú vào chỗ che. | Er unterstellt mir Absicht. → Anh ấy quy cho tôi có chủ ý. |
| durch- | Sie schaut durch das Rohr durch. → Cô ấy nhìn xuyên ống. | Sie durchschaut den Trick. → Cô ấy nhìn thấu mẹo đó. |

Đây là các cặp từ cụ thể; không suy ra cứ nghĩa trừu tượng là luôn không tách. Với nguyên mẫu có zu: **umzufahren** ở nghĩa tông đổ, **zu umfahren** ở nghĩa đi vòng.

### 5. Mẹo tự kiểm tra
Bung cụm phân từ thành **weil/während/obwohl + chủ ngữ**. Nếu không tìm được ai thực hiện, câu có thể gắn sai chủ thể. Với tiền tố, kiểm tra đồng thời **nghĩa → trọng âm → tách → Partizip II**, không chỉ nhìn mặt chữ.

### 6. Cạm bẫy
- Sai: **Leise sprechend, wurde die Tür geöffnet** nếu muốn nói một người vừa nói vừa mở cửa nhưng không nêu ai. Viết rõ: **Leise sprechend, öffnete sie die Tür.**
- Sai: **unweit dem Bahnhof** trong mẫu Genitiv này. Đúng: **unweit des Bahnhofs**.
- Nhầm **umgefahren/umfahren** có thể đổi “tông đổ” thành “đi vòng tránh”, không chỉ sai đuôi động từ.
''',[
('Hinsichtlich d___ Sicherheit gibt es Fragen.','er','Hinsichtlich theo mẫu trang trọng dùng Genitiv; Sicherheit giống cái nên der Sicherheit.'),
('Anlässlich d___ Jubiläums bleibt das Museum länger offen.','es','Anlässlich + Genitiv; Jubiläum trung, Genitiv des Jubiläums.'),
('Unweit ___ Bahnhofs liegt das Hotel.',['des','dem','den'],'des','Unweit theo mẫu Genitiv: des Bahnhofs; không lấy Dativ chỉ vì đây là nơi chốn.'),
('Mithilfe von ___ neuen Programm sparen wir Zeit.',['einem','eines','einen'],'einem','Mithilfe von dùng Dativ do von; khác mithilfe eines Programms khi không có von.'),
('Leise ___, erklärte sie den Ablauf. (sprechen; Partizip I)','sprechend','Partizip I sprechend diễn đạt hành động đồng thời của cùng chủ thể sie, không thêm đuôi thuộc ngữ.'),
('Vom Ergebnis ___, verließ er die Sitzung. (enttäuschen; Partizip II)','enttäuscht','Enttäuscht nêu trạng thái của er; cụm có thể bung thành weil er enttäuscht war.'),
('Im Büro angekommen, schaltete ___ den Computer ein.',['sie','der Computer','das Licht'],'sie','Chủ thể ngầm của angekommen là người đến văn phòng; sie là lựa chọn nối chủ thể hợp nghĩa.'),
('Er hat den Pfosten ___. (umfahren = tông đổ)','umgefahren','Ở nghĩa tông đổ, umfahren tách và thêm ge- bên trong: umgefahren.'),
('Er hat die Baustelle ___. (umfahren = đi vòng tránh)','umfahren','Ở nghĩa lái vòng tránh, umfahren không tách; Partizip II không có ge-.'),
('Sie hat ihr Konto ___. (überziehen = thấu chi)','überzogen','Überziehen nghĩa thấu chi không tách, nên überzogen; khoác thêm áo mới là übergezogen.')])

assert len(items)==12
assert len({x['id'] for x in items})==12
assert set(p for x in items for p in x['sourcePages'])==set(range(1,23))
pack=dict(id='elio-c1-sicher-v1',name='Elio · Grammatik C1',type='grammar',level='C1',packVersion=1,sourceTitle='Sicher! C1 – Grammatikübersicht',sourceAttribution='Hueber Verlag; Michaela Perlmann-Balme, Susanne Schwalb, Magdalena Matussek. Tài liệu người dùng cung cấp, 22 trang.',sourceCorrections=['aus/vor nguyên nhân + Dativ, không phải Genitiv ở PDF trang 13','bekommen + Partizip II là Rezipientenpassiv, không phân loại là chủ động thông thường','be- không bảo đảm mọi động từ có Akkusativ','mức chắc chắn của modal không phải phần trăm tuyệt đối','nämlich/eben không luôn cố định ở vị trí thứ ba'],items=sorted(items,key=lambda x:x['sourceChapter']))
Path('public/data/grammar-c1-sicher.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
Path('public/js/grammar-c1-data.js').write_text("'use strict';\n// Original Vietnamese teaching based on the user-provided C1 topic overview.\nconst ElioGrammarC1Pack="+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n')
print(f"C1: {len(items)} chapters, {sum(len(x['exercises']) for x in items)} exercises, 22 source pages covered")
