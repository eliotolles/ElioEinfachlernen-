LESSONS={}
def add(n,scope,mechanism,tips,signs,examples,traps,rules,rows):
    questions=[]
    for row in rows.strip().splitlines():
        q,a,b,c,k=row.split('|');questions.append((q,a,rules[int(k)],b,c))
    LESSONS[f'book-dtd-b2-{n:02}']={'scope':scope,'mechanism':mechanism,'tips':tips,'signs':signs,'examples':examples,'traps':traps,'questions':questions}

add(1,'Giả định trái thực quá khứ, Modalverb và điều kiện hỗn hợp; không lặp lời nhờ lịch sự B1.',
'''**hätte/wäre + Partizip II** nhìn lại một khả năng đã không thành sự thật trong ngữ cảnh giả định. Trong *Wenn ich früher losgefahren wäre, hätte ich den Zug erreicht*, người nói đã không khởi hành đủ sớm; mệnh đề kết quả nêu việc đã có thể xảy ra, không kể sự kiện thật.

Phân biệt thời gian của hai vế. *Wenn ich gestern früher geschlafen hätte, wäre ich jetzt fitter* có điều kiện quá khứ nhưng kết quả hiện tại; không bắt buộc cả hai vế cùng dùng dạng quá khứ. Với modal đi cùng động từ khác, **hätte + nguyên mẫu + modal nguyên mẫu**: *hätte lernen müssen*. Cụm này có trật tự đặc biệt ở câu phụ, không áp máy móc “mọi động từ chia luôn ở cuối cụm”.''',
'Chọn trợ động từ theo Perfekt rồi đổi sang hätte/wäre. Có modal + động từ chính thì kiểm tra Ersatzinfinitiv: hätte arbeiten sollen. Khoanh mốc gestern/jetzt để tách thời gian điều kiện và kết quả.',
'Hätte ich doch…/Wäre ich nur… thường biểu thị tiếc nuối. hätte…sollen nói điều lẽ ra nên làm, không xác nhận đã làm. Dạng würde + nguyên mẫu đơn không tự diễn tả giả định quá khứ hoàn tất.',
'''- **Hätte ich das gewusst, hätte ich dich gewarnt.** — Nếu đã biết điều đó, tôi đã cảnh báo bạn. Bỏ wenn → hätte đứng đầu vế điều kiện.
- **Ich hätte früher aufstehen müssen.** — Lẽ ra tôi đã phải dậy sớm hơn. aufstehen và müssen đều nguyên mẫu; không dùng gemusst trong khung này.
- **Wenn sie gestern gekommen wäre, wäre sie jetzt bei uns.** — Nếu hôm qua cô ấy đã đến, giờ cô ấy ở với chúng tôi. gekommen wäre chỉ quá khứ; wäre bei uns chỉ hiện tại.''',
'''1. *losgefahren hätte* → **losgefahren wäre**: losfahren lấy sein trong nghĩa khởi hành.
2. *hätte gelernt gemusst* → **hätte lernen müssen**: modal có động từ đi kèm nhận Ersatzinfinitiv.
3. *weil ich arbeiten müssen hätte* → **weil ich hätte arbeiten müssen** trong khung đang học.
4. Không đổi kết quả có jetzt thành quá khứ nếu làm mất nghĩa điều kiện hỗn hợp.''',[
'Giả định quá khứ dùng hätte/wäre + Partizip II theo trợ động từ Perfekt. lernen/lesen dùng haben; losfahren/ankommen dùng sein trong nghĩa di chuyển này.',
'Modal có động từ chính: hätte + nguyên mẫu chính + modal nguyên mẫu. Trong câu phụ này, hätte đứng trước cụm hai nguyên mẫu (Ersatzinfinitiv).',
'Bỏ wenn trong điều kiện: động từ chia mở đầu. Vế kết quả vẫn giữ V2; không thêm một chủ ngữ trước hätte/wäre sau dấu phẩy.',
'Thời gian mỗi vế độc lập: điều kiện gestern có thể quá khứ, kết quả jetzt là hiện tại. Chọn theo mốc và ý nghĩa, không đồng nhất hình thức hai vế.'],'''
Wenn ich früher losgefahren ___, hätte ich den Zug erreicht.|wäre|hätte|würde|0
Ich ___ mehr gelernt, wenn ich Zeit gehabt hätte.|hätte|wäre|würde|0
Ich hätte früher aufstehen ___. (müssen)|müssen|gemusst|musste|1
Chọn câu phụ đúng.|weil ich den Vertrag hätte lesen sollen|weil ich den Vertrag lesen gesollt hätte|weil ich den Vertrag lesen sollen hätte|1
___ ich das gewusst, hätte ich geholfen.|Hätte|Wenn hätte|Wäre|2
Nếu tối qua ngủ sớm thì giờ đỡ mệt: Wenn ich früher ins Bett gegangen wäre, ___ ich jetzt fitter.|wäre|wäre gewesen|hätte|3
Sie ___ gekommen, wenn sie die Einladung gelesen hätte.|wäre|hätte|würde|0
Chọn câu tiếc vì không gọi.|Hätte ich dich doch angerufen!|Hätte ich dich doch anrufen!|Wäre ich dich doch angerufen!|0
Nếu tôi đã đọc tin: Wenn ich die Nachricht gelesen hätte, ___ ich geantwortet.|hätte|wäre|würde|0
Chọn hai nguyên mẫu với sollen.|Ich hätte den Vertrag lesen sollen.|Ich hätte den Vertrag gelesen gesollt.|Ich wäre den Vertrag lesen sollen.|1
''')

add(2,'Tương quan mức độ je…desto/umso và song song lập luận; liên từ đôi cộng/phủ định đã học ở B1.',
'''**je…desto/umso** mô tả quan hệ biến thiên: một đại lượng thay đổi cùng chiều hoặc ngược chiều với đại lượng khác. *Je mehr ich übe, desto sicherer werde ich* không chỉ là hai sự thật được nối bằng und; nó nói mức tự tin tăng theo mức luyện.

Vế je là câu phụ có động từ cuối. Cụm *desto + so sánh hơn* đứng ở đầu câu chính, sau đó đến động từ chia: *desto leichter fällt es mir*. Không giữ trật tự chủ ngữ–động từ chỉ vì người học thấy “desto” giống liên từ và. Với cấu trúc đôi khác trong lập luận, luôn xét hai thành phần có cùng tầng cú pháp không.''',
'Đóng ngoặc [je mehr…] và [desto sicherer]. Kiểm tra cả hai dạng Komparativ; mehr/weniger cũng là so sánh hơn, không bắt buộc mọi từ đều có -er.',
'Tìm hai mức độ: luyện nhiều–tự tin hơn, giá cao–nhu cầu thấp. Je có cách dùng khác như je Person, nhưng không phải cấu trúc tương quan trong bài này.',
'''- **Je länger ich warte, desto ungeduldiger werde ich.** — Càng đợi lâu, tôi càng mất kiên nhẫn. warte cuối vế je; werde đứng sau desto ungeduldiger.
- **Je früher wir buchen, umso weniger bezahlen wir.** — Đặt càng sớm, chúng tôi trả càng ít. weniger là so sánh lượng, không thêm -er.
- **Die Maßnahme ist nicht nur teuer, sondern auch schwer umzusetzen.** — Biện pháp không chỉ đắt mà còn khó thực hiện. Hai phần nối cùng là tính chất, không trộn với một mệnh đề khác cấu trúc.''',
'''1. *Je ich mehr lerne…* → **Je mehr ich lerne…**: cụm mức độ theo je.
2. *desto ich werde sicherer* → **desto sicherer werde ich**: động từ câu chính theo sau cụm so sánh.
3. *mehrer* → **mehr**: không thêm đuôi vào dạng so sánh bất quy tắc.
4. Không dùng je…desto để nối hai ý không có quan hệ mức độ chỉ nhằm làm văn trang trọng.''',[
'je mở câu phụ: je + Komparativ + chủ ngữ + … + động từ cuối. Cần quan hệ mức độ, không chỉ quan hệ thời gian đơn thuần.',
'desto/umso + Komparativ chiếm vị trí đầu câu chính; động từ chia theo ngay sau rồi chủ ngữ. Hai từ này có thể thay nhau trong khung tương quan.',
'So sánh bất quy tắc/so sánh lượng: gut → besser, viel → mehr, wenig → weniger. Không tự tạo guter/mehrer theo tiếng Việt.',
'Hai nửa cấu trúc phải song song về chức năng và hợp logic. Không đổi một tính từ thành mệnh đề khác tầng mà không điều chỉnh khung.'],'''
Je mehr ich ___, desto sicherer werde ich. (üben)|übe|ich übe|üben|0
Je länger wir warten, desto ungeduldiger ___ wir.|werden|wir werden|wird|1
Je früher wir buchen, umso ___ bezahlen wir. (wenig, so sánh)|weniger|wenigerer|wenigsten|2
Chọn câu đúng.|Je mehr ich lese, desto besser verstehe ich den Text.|Je ich mehr lese, desto ich verstehe besser den Text.|Je mehr ich lese, desto ich besser verstehe den Text.|1
Je höher der Preis, desto ___ die Nachfrage. (niedrig, so sánh)|niedriger|niedrigste|niedrig|2
Je ___ wir planen, desto weniger Fehler machen wir. (gut, so sánh)|besser|guter|am besten|2
Je mehr man spart, ___ mehr bleibt übrig.|desto|weil|obwohl|1
Chọn cụm song song.|nicht nur teuer, sondern auch kompliziert|nicht nur teuer, sondern auch man kompliziert|nicht nur teuer, sondern auch kostet|3
Je ___ du anfängst, desto eher bist du fertig. (früh, so sánh)|früher|frühest|früh|2
Chọn vị trí động từ đúng.|desto leichter fällt mir die Aufgabe|desto mir fällt die Aufgabe leichter|desto leichter mir die Aufgabe fällt|1
''')

add(3,'um/ohne/statt…zu, kiểm soát người thực hiện và nguyên mẫu hoàn thành; không lặp zu cơ bản B1.',
'''Các cụm này bổ sung quan hệ mục đích, không thực hiện hoặc thay thế một hành động. **um…zu** là mục tiêu chưa được khẳng định đã đạt; **ohne…zu** nêu việc không làm; **statt…zu** đối chiếu việc đã làm với phương án lẽ ra được xét. Không chọn chỉ theo sự xuất hiện của zu.

Trong các câu chủ động đơn giản đang luyện, người thực hiện cụm nguyên mẫu thường trùng chủ ngữ câu chính. Nếu hai người khác nhau, dùng *damit/ohne dass/statt dass* để hiện rõ chủ ngữ. Đây là cách kiểm tra an toàn cho bài tập, không phải khẳng định mọi nguyên mẫu trong tiếng Đức luôn được chủ ngữ kiểm soát.

Nguyên mẫu hoàn thành **Partizip II + zu haben/sein** biểu thị việc xảy ra trước tình huống chính: *ohne vorher angerufen zu haben*. Không dùng dạng này chỉ để làm câu “cao cấp”.''',
'Hỏi hai câu: quan hệ mục đích/thiếu/thay thế là gì, và ai thực hiện? Sau đó mới chọn liên từ và dạng nguyên mẫu hiện tại/hoàn thành.',
'vorher/bereits thường giúp nhận quan hệ trước. Chủ thể khác nhau là dấu hiệu cần xét mệnh đề hữu hạn: *Ich erkläre es, damit du es verstehst.*',
'''- **Ich lerne täglich, um flüssiger sprechen zu können.** — Tôi học hằng ngày để nói trôi chảy hơn. tôi là người học và nói; zu đứng trước modal cuối cùng können.
- **Er ging, ohne sich zu verabschieden.** — Anh ấy đi mà không chào tạm biệt. sich theo er; không thêm nicht vì ohne đã mang ý thiếu.
- **Sie kam, ohne vorher angerufen zu haben.** — Cô ấy đến mà trước đó chưa gọi. angerufen zu haben đánh dấu việc gọi lẽ ra có trước việc đến.''',
'''1. *Ich helfe dir, um du bestehst* → **…, damit du bestehst**: cần chủ ngữ du riêng.
2. *ohne nicht zu fragen* → **ohne zu fragen** khi chỉ muốn nói không hỏi.
3. *um sprechen können zu* → **um sprechen zu können**: zu trước nguyên mẫu đứng cuối cụm.
4. *angekommen zu haben* → **angekommen zu sein**: ankommen lấy sein ở nghĩa đến nơi.''',[
'Với câu chủ động đơn giản ở đây, um…zu dùng khi người thực hiện mục đích được hiểu là chủ ngữ câu chính. Chủ thể khác cần damit + chủ ngữ + động từ cuối.',
'ohne…zu nêu việc không làm; statt…zu nêu phương án bị thay thế. Không thêm nicht để tạo cùng nghĩa phủ định vốn đã có ở ohne.',
'Nguyên mẫu hoàn thành: Partizip II + zu haben/sein, chọn trợ động từ như Perfekt. Dạng này biểu thị quan hệ xảy ra trước tình huống chính.',
'Trong cụm có modal: sprechen zu können; trong động từ tách: anzurufen. Không đặt zu tùy tiện trước nguyên mẫu đầu hoặc sau cả cụm.'],'''
Ich lerne, ___ die Prüfung zu bestehen.|um|ohne|statt|0
Ich erkläre es, ___ du es verstehst.|damit|um|zu|0
Er ging, ohne sich ___ verabschieden.|zu|um|dass|1
Er spielte, ___ zu lernen. (thay vì học)|statt|um|damit|1
Sie kam, ohne vorher angerufen zu ___.|haben|sein|hat|2
Er war froh, rechtzeitig angekommen zu ___.|sein|haben|ist|2
Chọn cụm với modal đúng.|um besser sprechen zu können|um besser zu sprechen können|um besser sprechen können zu|3
Chọn nghĩa ohne zu fragen.|Không hỏi.|Bắt buộc phải hỏi.|Đã hỏi xong rồi.|1
Chọn câu chủ thể khác đúng.|Ich spare, damit mein Sohn studieren kann.|Ich spare, um mein Sohn studieren zu können.|Ich spare, damit mein Sohn kann studieren.|0
Sie ging, statt mich ___. (anrufen)|anzurufen|zu anrufen|angerufen|3
''')

add(4,'Quan hệ có giới từ, dessen/deren và vai trò sở hữu; không lặp phép chọn Nom/Akk/Dat cơ bản.',
'''Với **giới từ + đại từ quan hệ**, giới từ nằm ngay trước đại từ và chi phối cách: *die Kollegin, mit der ich arbeite*. Giống/số vẫn theo danh từ được bổ nghĩa, nhưng cách do mit chứ không do vị trí danh từ ở câu chính.

**dessen/deren** biểu thị sở hữu bên trong mệnh đề quan hệ: *der Mann, dessen Tochter hier studiert*. dessen theo chủ sở hữu Mann, không theo Tochter. Cụm *dessen Tochter* làm chủ ngữ của studiert; nếu cụm đó làm tân ngữ hoặc theo giới từ, hình thức dessen/deren không đổi theo chức năng ấy. Danh từ sau dessen/deren thường không thêm mạo từ sở hữu nữa.''',
'Giải bằng hai câu: *Die Tochter des Mannes studiert hier* → *der Mann, dessen Tochter…*. Khoanh chủ sở hữu để tránh chọn deren chỉ vì Tochter giống cái.',
'Danh từ ngay sau đại từ quan hệ là tín hiệu quan hệ sở hữu: dessen Auto, deren Kinder. Với *mit dessen Tochter*, mit chi phối cả cụm Tochter; dessen vẫn đánh dấu chủ sở hữu Mann.',
'''- **Die Frau, deren Sohn ich kenne, wohnt hier.** — Người phụ nữ có con trai mà tôi quen sống đây. deren theo Frau; Sohn là đối tượng Akkusativ của kenne.
- **Der Mann, mit dessen Tochter ich arbeite, ist Arzt.** — Người đàn ông có con gái làm cùng tôi là bác sĩ. mit chi phối Tochter, không đổi dessen thành dem.
- **Die Kollegen, auf deren Hilfe wir zählen, kommen morgen.** — Các đồng nghiệp mà chúng tôi trông cậy sự giúp đỡ sẽ đến ngày mai. deren theo số nhiều Kollegen; zählen auf + Akkusativ.''',
'''1. *der Mann, deren Tochter…* → **dessen Tochter**: theo người sở hữu nam.
2. *die Frau, dessen Sohn…* → **deren Sohn**: theo chủ sở hữu nữ.
3. *mit die ich arbeite* → **mit der ich arbeite** khi nói Frau: mit đòi Dativ.
4. *dessen seine Tochter* → **dessen Tochter**: không lặp thêm từ sở hữu.''',[
'Giới từ đặt trước đại từ quan hệ và quyết định cách; mit + Dativ, für/auf theo khung đang nêu + Akkusativ. Giống/số theo danh từ được bổ nghĩa.',
'dessen theo chủ sở hữu nam/trung số ít; deren theo chủ sở hữu nữ hoặc số nhiều. Không chọn theo danh từ chỉ vật/người được sở hữu đứng sau.',
'dessen/deren không thêm một từ sở hữu như sein/ihr ngay sau. Cách của cụm danh từ được sở hữu do vai trò hoặc giới từ bên trong câu phụ quyết định.',
'Động từ của mệnh đề quan hệ vẫn ở cuối; phải đóng dấu phẩy khi câu quan hệ chen vào câu chính.'],'''
Der Mann, ___ Tochter hier studiert, ist Arzt.|dessen|deren|dem|1
Die Frau, ___ Sohn ich kenne, wohnt hier.|deren|dessen|der|1
Das Kind, ___ Fahrrad kaputt ist, weint.|dessen|deren|dem|1
Die Leute, ___ Namen ich vergessen habe, warten.|deren|dessen|denen|1
Die Kollegin, mit ___ ich arbeite, ist nett.|der|die|deren|0
Der Mann, für ___ ich arbeite, ist verreist.|den|dem|dessen|0
Der Lehrer, mit ___ Tochter ich spreche, wartet.|dessen|deren|dem|1
Chọn cụm sở hữu đúng.|dessen Tochter|dessen seine Tochter|dem seine Tochter dessen|2
Die Kollegen, auf ___ Hilfe wir zählen, kommen.|deren|dessen|denen|1
Chọn khung đúng.|Das ist die Frau, mit der ich arbeite.|Das ist die Frau, mit der ich arbeite mit.|Das ist die Frau, mit die ich arbeite.|3
''')

add(5,'Đổi điểm nhìn trong lời gián tiếp, quan hệ thời gian và dạng thay thế; bảng Konjunktiv I cơ bản ở B1-13.',
'''Tường thuật không chỉ đổi *ist → sei*. Phải xác định ai là người nói, ai nghe, thời điểm và nơi tường thuật. Lời Anna “Ich komme morgen hierher” có thể thành **Anna sagte gestern, sie komme heute dorthin** nếu hôm nay người kể ở nơi khác. Không tự đổi morgen → am nächsten Tag trong mọi ngữ cảnh; chỉ đổi khi điểm nhìn thay đổi.

Konjunktiv I giữ quan hệ đồng thời/trước/sau với lời được dẫn: *er sei krank*, *er sei krank gewesen*, *er werde kommen*. Không có quy tắc lùi thì cơ học như một số bài tiếng Anh. Nếu Konjunktiv I trùng Indikativ, Konjunktiv II hoặc würde có thể giúp nhận rõ lời dẫn, nhưng cần tránh hiểu nhầm là giả định trái thực trong ngữ cảnh.''',
'Ghi một bảng người nói–người kể–ngày kể trước khi đổi đại từ và từ thời gian. Đổi theo vai, không thay mọi ich thành er; nếu chính mình kể lại lời mình, ich có thể giữ nguyên.',
'wir haben/wir kommen có thể trùng Indikativ; đây là nơi cần xét dạng thay thế. gestern/heute/morgen/hier phụ thuộc mốc tường thuật, không phụ thuộc riêng động từ sagte.',
'''- **Paul sagte gestern: „Ich komme morgen.“ → Paul sagte gestern, er komme heute.** — Hôm qua Paul nói rằng hôm nay anh ấy đến. Đổi morgen do hôm nay là ngày kể.
- **Sie erklärt, sie habe den Brief bereits geschickt.** — Cô ấy cho biết đã gửi thư. habe geschickt biểu thị việc gửi trước lời giải thích.
- **Die Gäste sagten, sie hätten keine Zeit.** — Khách nói họ không có thời gian. hätten giúp phân biệt lời dẫn khi sie haben trùng Indikativ; không tự kết luận họ thực ra có thời gian.''',
'''1. Đổi “morgen” mà không biết ngày kể có thể làm sai mốc. Phải nêu ngữ cảnh trước khi chấm.
2. *er habe gekommen* → **er sei gekommen**: trợ động từ vẫn theo Perfekt.
3. Không giải thích mọi hätten trong lời gián tiếp là quá khứ: *sie hätten Zeit* có thể là dạng thay thế của lời nói về hiện tại.
4. *sie sagte, dass sie habe Zeit* → **…, dass sie Zeit habe**.''',[
'Đại từ và từ chỉ thời gian/nơi chốn đổi theo điểm nhìn cụ thể. Khi hôm qua nói morgen và hôm nay kể lại, thời điểm ấy là heute.',
'Quan hệ trước lời nói dùng Konjunktiv I Perfekt: habe + Partizip II hoặc sei + Partizip II theo động từ. Không lùi thì cơ học chỉ vì động từ dẫn ở quá khứ.',
'Khi Konjunktiv I trùng Indikativ, Konjunktiv II có thể là dạng thay thế để đánh dấu lời dẫn. Nó không tự phủ nhận sự thật của nội dung được dẫn.',
'dass-Satz giữ động từ chia cuối; câu dẫn không dass có thể V2. Không đổi trật tự hai khung lẫn nhau.'],'''
Hôm qua Paul nói morgen; hôm nay kể: Paul sagte gestern, er komme ___.|heute|gestern|vorgestern|0
Anna nói Ich bin krank; người kể nói về Anna: Sie sagt, ___ sei krank.|sie|ich|du|0
Er berichtet, er ___ den Brief schon geschickt. (Konjunktiv I)|habe|sei|hatte gewesen|1
Sie erklärt, sie ___ bereits angekommen. (Konjunktiv I)|sei|habe|werde gehabt|1
Die Gäste sagen, sie hätten keine Zeit. hätten có thể là gì?|Dạng thay thế Konjunktiv I trùng Indikativ.|Bằng chứng họ nói dối.|Chỉ có thể là sự việc đã kết thúc.|2
Chọn dass-Satz đúng.|Sie sagte, dass sie Zeit habe.|Sie sagte, dass sie habe Zeit.|Sie sagte, dass habe sie Zeit.|3
Người kể ở địa điểm khác, dẫn lại hier của người nói: thường đổi thành gì?|dort|immer hier trong mọi tình huống|gestern|0
Tự dẫn lại lời chính mình, ich có bắt buộc đổi thành er không?|Không; tùy vai người kể.|Có, luôn luôn.|Có, nếu danh từ giống nam.|0
Lời trước hiện tại được dẫn: Er sagt, er ___ gestern gearbeitet. (K I)|habe|sei|werde sein|1
Chọn câu không lùi thì máy móc.|Sie sagte, sie sei krank.|Sie sagte, sie warte krank gewesen sein.|Sie sagte, sie krank sei sie.|3
''')

add(6,'Bị động thì ghép, Modalverb và không chủ ngữ; Präsens/Präteritum cơ bản ở A2-08.',
'''Trong bị động quá trình, thêm thì ghép phải giữ thành phần **worden**: *Der Bericht ist geschrieben worden*. Đây không phải *geworden*, dạng thường dùng khi werden nghĩa là trở nên. Perfekt bị động dùng sein vì toàn cụm đã có cấu trúc trở thành quá trình bị tác động.

Với modal, động từ chia là modal; cụm bị động nguyên mẫu **Partizip II + werden** đứng cuối: *muss geprüft werden*. Trong Perfekt có modal và động từ chính, cụm nhiều động từ phức tạp hơn; cần chỉ rõ dạng dùng chứ không thay từng từ cơ học.

Bị động không chủ ngữ không biến Dativ thành Nominativ. *Dem Patienten wird geholfen* không có chủ ngữ Nominativ, động từ số ít. *Es wird getanzt* có es giữ chỗ đầu; khi đưa Heute lên đầu, es giữ chỗ này biến mất: *Heute wird getanzt*.''',
'Phân biệt ba mảnh: sein chỉ thì ghép, Partizip II chỉ hành động, worden chỉ bị động quá trình. Có modal: kiểm tra cụm *geprüft werden* không tách sai.',
'ist…worden/hätte…werden müssen thường báo cấu trúc nhiều lớp. Không dùng es theo máy móc: es vị trí đầu khác es là chủ ngữ thật của động từ như regnen.',
'''- **Die Unterlagen sind gestern geprüft worden.** — Hồ sơ đã được kiểm tra hôm qua. sind theo Unterlagen số nhiều; worden không có ge-.
- **Die Unterlagen müssen noch geprüft werden.** — Hồ sơ vẫn cần được kiểm tra. müssen chia, geprüft werden là cụm cuối.
- **Heute wird hier gearbeitet.** — Hôm nay người ta làm việc ở đây. Không có đối tượng Akkusativ trở thành chủ ngữ; wird giữ số ít.''',
'''1. *ist repariert geworden* → **ist repariert worden** cho Perfekt bị động quá trình.
2. *muss geprüft wird* → **muss geprüft werden**: động từ cuối ở nguyên mẫu.
3. *Der Patient wird geholfen* → **Dem Patienten wird geholfen**: helfen giữ Dativ.
4. *Heute wird es getanzt* → **Heute wird getanzt** khi es chỉ là giữ chỗ ban đầu.''',[
'Perfekt Vorgangspassiv: sein + Partizip II + worden. geworden dùng khi werden mang nghĩa trở nên, không phải thành phần bị động này.',
'Modal chia theo chủ ngữ; bị động nguyên mẫu là Partizip II + werden. Sau muss không đặt wird, không bỏ werden.',
'Không có chủ ngữ Nominativ thì động từ ở số ít. Dativ của helfen/danken vẫn giữ Dativ, không tự thành chủ ngữ.',
'es giữ chỗ ở Vorfeld của bị động không chủ ngữ được bỏ khi một thành phần khác chiếm Vorfeld. Không áp quy tắc này cho mọi es trong tiếng Đức.'],'''
Der Brief ist geschrieben ___.|worden|geworden|werden|0
Die Briefe ___ geprüft worden. (Perfekt)|sind|haben|ist|0
Der Antrag muss geprüft ___.|werden|wird|worden|1
Die Anträge ___ geprüft werden. (müssen, Präsens)|müssen|muss|musst|1
Dem Patienten ___ geholfen.|wird|werden|hat|2
Chọn câu không chủ ngữ đúng.|Heute wird hier getanzt.|Heute wird es hier getanzt.|Heute werden hier getanzt.|3
Der Bericht war bereits geschrieben ___. (Plusquamperfekt Passiv)|worden|geworden|werden|0
Chọn bị động với modal.|Das Formular kann online ausgefüllt werden.|Das Formular kann online ausgefüllt wird.|Das Formular kann online ausfüllen werden.|1
Es wird gearbeitet. Đưa Heute lên đầu.|Heute wird gearbeitet.|Heute wird es gearbeitet.|Heute es wird gearbeitet.|3
Chọn đối tượng Dativ giữ nguyên.|Den Gästen wird gedankt.|Die Gäste wird gedankt.|Den Gästen werden gedankt.|2
''')

add(7,'Cụm phân từ mở rộng trong văn viết: xác định danh từ trung tâm, quan hệ nghĩa và chuyển từ mệnh đề quan hệ.',
'''Cụm phân từ mở rộng nén một mệnh đề quan hệ thành thành phần đứng trước danh từ. **der auf den Bus wartende Mann** tương ứng *der Mann, der auf den Bus wartet*. Các bổ ngữ của động từ giữ quan hệ: *auf den Bus* vẫn đi với warten, không trở thành bổ ngữ riêng của Mann.

Phân từ gần danh từ nhận đuôi tính từ theo mạo từ/cách/số. **die gestern verschickten Briefe** nói những thư được gửi hôm qua; chuyển từ quan hệ bị động, không phải thư tự gửi. **der gestern angekommene Gast** lại có nghĩa chủ động đã hoàn tất với động từ ankommen. Vì vậy Partizip II không đồng nhất với bị động trong mọi trường hợp.''',
'Đọc từ phải sang trái để tìm danh từ và phân từ, rồi mở thành câu quan hệ. Khi viết, tạo mệnh đề quan hệ đúng trước, chỉ rút gọn nếu nghĩa và chủ thể vẫn rõ.',
'Cụm dài có trạng ngữ/giới từ trước phân từ là dấu hiệu: *die von der Firma angebotenen Kurse*. Văn nói thường dùng câu quan hệ dễ đọc hơn; không nén nhiều lớp chỉ để trông học thuật.',
'''- **Die seit einer Stunde wartenden Kunden sind unruhig.** — Những khách đã đợi một giờ đang sốt ruột. Kunden thực hiện warten; wartenden nhận -en sau die số nhiều.
- **Ich lese den gestern veröffentlichten Bericht.** — Tôi đọc báo cáo được công bố hôm qua. den Bericht Akkusativ nam → veröffentlichten.
- **Der vorhin eingetroffene Zug steht auf Gleis zwei.** — Tàu vừa đến đang ở đường ray số hai. eingetroffen mô tả hoàn tất, không có nghĩa tàu “bị đến”.''',
'''1. *die wartend Kunden* → **die wartenden Kunden**: không bỏ đuôi tính từ.
2. *die Briefe, die gestern verschickten* → **die gestern verschickten Briefe** hoặc **die Briefe, die gestern verschickt wurden**: không trộn hai cấu trúc.
3. *der reparierende Wagen* nếu xe đang được thợ sửa → **der reparierte Wagen** cho kết quả hoặc câu quan hệ *der gerade repariert wird* cho quá trình; không gán chủ động sai.
4. Tránh bỏ chủ ngữ khác trong câu quan hệ khi rút gọn làm đổi tác nhân.''',[
'Partizip I giữ quan hệ chủ động/đồng thời: Kunden warten → wartende Kunden. Bổ ngữ của động từ vẫn nằm trong cụm.',
'Partizip II có thể biểu thị bị động/kết quả hoặc hoàn tất của động từ như ankommen. Chọn theo nghĩa, không mặc định mọi Partizip II là bị động.',
'Phân từ trước danh từ chia như tính từ: sau den nam Akkusativ và die số nhiều thường có -en; không dùng dạng trần.',
'Cụm phân từ đứng trước danh từ; mệnh đề quan hệ có đại từ và động từ chia. Không trộn nửa mệnh đề với nửa cụm phân từ.'],'''
die auf den Bus ___ Kunden (warten)|wartenden|gewarteten|wartend|0
den gestern ___ Bericht (veröffentlichen)|veröffentlichten|veröffentlichend|veröffentlicht|2
der eben ___ Gast (ankommen, đã đến)|angekommene|ankommender gestern|angekommen|1
Chọn diễn giải die wartenden Gäste.|die Gäste, die warten|die Gäste, die gewartet werden|die Gäste, die wartet|0
Chọn diễn giải die verschickten Briefe.|die Briefe, die verschickt wurden|die Briefe, die etwas verschicken|die Briefe, die verschickt haben es|1
mit dem gestern ___ Vertrag (unterschreiben)|unterschriebenen|unterschriebene|unterschrieben|2
die von der Firma ___ Kurse (anbieten)|angebotenen|anbietenden|angeboten|1
Chọn cụm hoàn chỉnh.|die seit einer Stunde wartenden Kunden|die Kunden die seit einer Stunde wartenden|die seit einer Stunde wartend Kunden|3
Der Text, der gestern veröffentlicht wurde → der gestern ___ Text.|veröffentlichte|veröffentlichende|veröffentlicht|2
Partizip II trong der angekommene Zug có bắt buộc nghĩa bị động không?|Không; ở đây là đến nơi đã hoàn tất.|Có; tàu bị người khác đến.|Có; mọi Partizip II là bị động.|1
''')

add(8,'Redemittel gắn với chức năng lập luận và sắc thái; cấu trúc toàn văn ở B2-13.',
'''Cụm dẫn không tự tạo một lập luận. **Meiner Ansicht nach** chỉ đánh dấu quan điểm; sau đó vẫn cần luận điểm có nội dung. **Das liegt daran, dass…** đưa nguyên nhân, không phải bằng chứng độc lập. Một câu có “Studien zeigen” mà không có nguồn không trở thành nhận định có căn cứ.

Phân biệt mức độ chắc chắn: *könnte, unter bestimmten Bedingungen, teilweise* giới hạn phát biểu. Dùng câu nhượng bộ để công nhận phần hợp lý của ý kiến khác, rồi nêu giới hạn cụ thể. Không lặp ba cụm “tôi cho rằng” để kéo dài một ý.''',
'Gán mỗi câu một vai: quan điểm, lý do, ví dụ, nhượng bộ hoặc kết luận. Chọn một Redemittel phù hợp vai đó; xóa các cụm trang trọng không bổ sung ý.',
'daran báo trước dass; meiner Ansicht nach là cụm trạng ngữ có thể đứng đầu câu V2. Einwand/Argument/Beispiel không thay thế nhau: phản đối, lý lẽ và ví dụ có chức năng khác.',
'''- **Meiner Ansicht nach sollte der Kurs günstiger sein.** — Theo tôi, khóa học nên rẻ hơn. Cụm đầu chiếm Vorfeld → sollte theo ngay sau.
- **Dieser Einwand ist nachvollziehbar, überzeugt mich aber nur teilweise.** — Phản đối này có thể hiểu được nhưng chỉ thuyết phục tôi một phần. Cần giải thích phần chưa thuyết phục.
- **Unter bestimmten Bedingungen könnte das sinnvoll sein.** — Trong một số điều kiện, điều đó có thể hợp lý. Điều kiện phải được nêu cụ thể, không dùng để né lập luận.''',
'''1. *Meiner Ansicht nach der Kurs sollte…* → **Meiner Ansicht nach sollte der Kurs…**: V2.
2. *Das liegt daran, dass die Kosten sind hoch* → **…, dass die Kosten hoch sind**.
3. Không bịa “nghiên cứu chứng minh” để tăng độ tin cậy; dùng ví dụ giả định và ghi đúng tính chất.
4. *einerseits…deshalb* không thay đúng cặp hai mặt **einerseits…andererseits**.''',[
'Cụm trạng ngữ ở Vorfeld như Meiner Ansicht nach kéo động từ chia tới vị trí ngay sau nó; không giữ thêm chủ ngữ trước động từ.',
'daran trong Das liegt daran báo trước nguyên nhân ở dass-Satz; động từ chia cuối. Câu nêu nguyên nhân không tự là bằng chứng khoa học.',
'könnte/teilweise/unter bestimmten Bedingungen giới hạn mức khẳng định. Chọn từ theo mức chắc chắn và điều kiện đã nêu.',
'Lập luận phải có nội dung và nguồn đúng tính chất. Redemittel chỉ tổ chức, không cho phép bịa số liệu hay lặp ý bằng nhiều cụm mở đầu.'],'''
Meiner Ansicht nach ___ der Kurs günstiger sein.|sollte|der Kurs sollte|sollten|0
Das liegt ___, dass viele Menschen arbeiten.|daran|darauf|damit|1
Chọn dass-Satz đúng.|dass die Kosten hoch sind|dass die Kosten sind hoch|dass sind die Kosten hoch|1
Unter bestimmten Bedingungen ___ das sinnvoll sein. (können, K II)|könnte|kannst|könntest|2
einerseits hohe Kosten, ___ große Vorteile|andererseits|deshalb|weder|3
nur ___ überzeugt = chỉ thuyết phục một phần|teilweise|immer völlig|ausnahmslos|2
Chọn câu không bịa nguồn.|Ein denkbares Beispiel wäre ein Abendkurs.|Studien beweisen es, obwohl ich keine Quelle habe.|Alle Experten stimmen zu, ohne Quelle.|3
Ich vertrete die Auffassung, ___ mehr Beratung nötig ist.|dass|ob|weil also|1
Redemittel có tác dụng chính gì?|Tổ chức và làm rõ quan hệ lập luận.|Tự tạo bằng chứng cho mọi nhận định.|Thay thế hoàn toàn lý do.|3
Chọn V2 đúng.|Deshalb braucht die Schule mehr Personal.|Deshalb die Schule braucht mehr Personal.|Deshalb mehr Personal die Schule braucht.|0
''')

add(9,'Wortbildung: ghép từ, phái sinh, họ từ và giới hạn tạo từ; chuyển câu sang danh từ hóa ở B2-10.',
'''Trong danh từ ghép, thành phần cuối là trung tâm: **die Sprachschule** là một loại Schule nên giống cái, số nhiều Sprachschulen; **das Schulbuch** là một loại Buch nên giống trung. Thành phần đầu giới hạn nghĩa, không quyết định mạo từ chỉ vì xuất hiện trước.

Hậu tố có thể giúp nhận loại từ/giống: -ung, -heit, -keit thường tạo danh từ cái; -lich/-bar tạo tính từ; -los thường biểu thị thiếu. Tuy vậy không thể tự ghép mọi gốc với mọi hậu tố. Nghĩa thực tế và Fugenelement như -s- phải được xác nhận trong từ điển; không thêm s giữa mọi hai danh từ.''',
'Tách từ từ bên phải: Sprachkursleiter → Leiter của Sprachkurs. Với từ dài, khoanh trung tâm trước để tìm mạo từ và chức năng, rồi giải thích phần bổ nghĩa.',
'Hậu tố thường giúp nhận loại từ nhưng tiền tố có thể đổi nghĩa mạnh: sicher → unsicher, schließen → abschließen. Đừng suy nghĩa tất cả từ từ bản dịch từng mảnh.',
'''- **die Bewerbung → das Bewerbungsgespräch** — đơn ứng tuyển → cuộc phỏng vấn. Gespräch là trung tâm nên das; s là yếu tố nối trong từ này.
- **zuverlässig → die Zuverlässigkeit** — đáng tin cậy → sự đáng tin cậy. -keit chuyển sang danh từ cái, viết hoa.
- **lösbar / unlösbar** — có thể giải / không thể giải. un- phủ định tính từ, nhưng vẫn cần xét dùng trong ngữ cảnh nào.''',
'''1. *die Schulbuch* → **das Schulbuch**: giống theo Buch.
2. *der Möglichkeit* khi là Nominativ → **die Möglichkeit**: -keit thường giống cái.
3. Không tạo từ bằng cách thêm -ung vào mọi động từ; có từ không dùng hoặc khác nghĩa.
4. Không dịch *arbeitslos* là “lười làm việc”: nghĩa thông dụng là thất nghiệp, không phải đánh giá thái độ.''',[
'Danh từ ghép nhận giống và cách biến đổi theo thành phần cuối. Thành phần đầu bổ nghĩa, không tự quyết định mạo từ.',
'-ung/-heit/-keit thường tạo danh từ cái viết hoa. Tính từ -lich/-bar không viết hoa nếu không được danh từ hóa.',
'Tiền tố/hậu tố đổi nghĩa hoặc loại từ nhưng không có quyền kết hợp tự do với mọi gốc. Cần từ thực tế, không tự bịa hình thái.',
'Fugenelement như -s- thuộc từng từ ghép và mô hình từ vựng; không thêm vào mọi chỗ nối. Nghĩa của từ có thể đặc thù.'],'''
___ Schulbuch (mạo từ Nominativ)|das|die|der|0
___ Sprachschule (mạo từ Nominativ)|die|das|der|0
___ Möglichkeit (Nominativ)|die|der|das|1
Danh từ từ zuverlässig.|die Zuverlässigkeit|der Zuverlässig|das zuverlässiglich|1
Chọn nghĩa arbeitslos.|Thất nghiệp.|Lười biếng trong mọi ngữ cảnh.|Có quá nhiều việc.|3
Trung tâm của Bewerbungsgespräch là gì?|Gespräch|Bewerbung|s|0
Chọn tính từ nghĩa có thể đọc được.|lesbar|lesungbar|gelesenkeit|2
Chọn phủ định của sicher.|unsicher|sicherung|Sicherkeit|2
Mọi danh từ ghép có bắt buộc thêm s ở giữa không?|Không; tùy từ/mô hình.|Có, không có ngoại lệ.|Chỉ khi giống trung.|3
Chọn cách viết danh từ đúng.|die Entscheidung|die entscheidung|der entscheidunglich|1
''')

add(10,'Chuyển hành động/tính chất thành cụm danh từ và bảo toàn vai nghĩa; không lặp bảng hậu tố B2-09.',
'''Danh từ hóa đổi cách đóng gói thông tin. **weil die Kosten steigen → wegen des Anstiegs der Kosten** chuyển một mệnh đề có động từ sang cụm danh từ. Chủ thể/đối tượng của hành động không được mất: *die Prüfung der Unterlagen durch die Behörde* phân biệt hồ sơ được kiểm tra với cơ quan kiểm tra.

Danh từ hóa giúp văn bản cô đọng nhưng dễ mơ hồ hoặc nặng. **Annas Kritik** có thể là phê bình của Anna hoặc phê bình hướng tới Anna tùy ngữ cảnh; nếu cần rõ, dùng *Annas Kritik an dem Plan*. Không đổi cho “trang trọng” mà làm mất thời gian, tác nhân, phủ định hay quan hệ nguyên nhân.''',
'Sau khi đổi, kiểm tra bốn điểm: ai làm, làm với gì, có phủ định không, quan hệ giữa hai ý còn giữ không. Muốn viết dễ đọc, dùng lại câu động từ khi cụm danh từ quá dài.',
'beim/zum/das + nguyên mẫu thường là danh từ hóa: beim Lesen, zum Lernen. wegen/trotz/während có thể mở cụm danh từ thay câu phụ nhưng nghĩa quan hệ phải được giữ đúng.',
'''- **Beim Lesen mache ich Notizen.** — Khi đọc tôi ghi chú. Lesen viết hoa sau beim = bei dem.
- **Die pünktliche Abgabe der Unterlagen ist wichtig.** — Việc nộp hồ sơ đúng hạn quan trọng. Abgabe là trung tâm; der Unterlagen chỉ đối tượng được nộp.
- **Wegen des Ausfalls des Zuges kamen wir zu spät.** — Vì tàu bị hủy/ngừng chạy, chúng tôi tới muộn. wegen cần cụm danh từ, không nối trực tiếp câu có động từ chia.''',
'''1. *beim lesen* → **beim Lesen**: nguyên mẫu đã danh từ hóa viết hoa.
2. *wegen die Kosten steigen* → **weil die Kosten steigen** hoặc **wegen des Kostenanstiegs**.
3. *die Prüfung durch die Unterlagen* đổi sai vai: hồ sơ là đối tượng, không phải tác nhân.
4. Không coi mọi danh từ hóa tốt hơn câu động từ; ưu tiên rõ nghĩa.''',[
'Nguyên mẫu danh từ hóa sau das/beim/zum viết hoa và là giống trung: das Lesen, beim Lernen. Không giữ cách viết động từ thường.',
'wegen trong chuẩn văn viết đang luyện nhận cụm Genitiv; không nhận trực tiếp một mệnh đề chia động từ như weil.',
'Phải giữ tác nhân và đối tượng: Prüfung der Unterlagen durch die Behörde. Đổi vị trí/giới từ có thể làm đảo vai nghĩa.',
'Danh từ hóa cần bảo toàn quan hệ, phủ định và thời gian. Không dùng để kéo dài hay làm mơ hồ một ý vốn rõ.'],'''
Beim ___ mache ich Notizen. (lesen)|Lesen|lesen|gelesen|0
zum ___ (lernen, danh từ hóa)|Lernen|lernen|lernt|0
weil die Kosten steigen → wegen des ___ der Kosten|Anstiegs|ansteigen|gestiegen|1
Chọn cấu trúc nguyên nhân đúng.|wegen des Zugausfalls|wegen der Zug fällt aus|wegen den Zug fällt aus|1
Cơ quan kiểm tra hồ sơ: die Prüfung der Unterlagen ___ die Behörde|durch|für|an|2
Ai được kiểm tra trong Prüfung der Unterlagen?|Hồ sơ.|Cơ quan bắt buộc.|Người kể bắt buộc.|2
___ Lesen hilft mir. (nguyên mẫu danh từ hóa)|Das|Der|Die|0
Sửa wegen die Kosten steigen.|weil die Kosten steigen|weil der Kostenanstieg|wegen steigen die Kosten|1
Danh từ hóa tốt cần giữ điều gì?|Vai tác nhân/đối tượng và quan hệ nghĩa.|Chỉ cần thêm nhiều Genitiv.|Không cần giữ phủ định.|3
Chọn cách viết đúng.|Die Abgabe der Unterlagen ist wichtig.|Die abgeben der Unterlagen ist wichtig.|Die Abgabe der Unterlagen sind wichtig.|3
''')

add(11,'Quan hệ thời gian trước–sau/đồng thời và nguyên nhân; nhượng bộ/điều kiện học riêng.',
'''Liên từ xác định quan hệ sự kiện; thì giúp đặt các sự kiện trên trục thời gian. **nachdem**: việc ở câu phụ trước việc chính; **bevor**: việc chính trước mốc ở câu phụ; **während**: hai quá trình chồng thời gian. Không chọn thì chỉ theo vị trí mệnh đề xuất hiện trước trên trang.

**weil/da** nêu nguyên nhân; **deshalb/deswegen** đưa kết quả trong khung câu chính. **denn** nối hai câu chính mà không kéo động từ cuối. Chuyển một cấu trúc sang cấu trúc khác phải giữ hướng nguyên nhân → kết quả và thay trật tự tương ứng, không chỉ thay từ nối.''',
'Viết hai sự kiện thành A/B rồi vẽ mũi tên trước khi chọn nachdem/bevor. Với nguyên nhân, khoanh câu trả lời “vì sao” và đừng đảo nguyên nhân với kết quả.',
'schon/bereits/vorher giúp xác định trước–sau nhưng không thay việc hiểu ngữ cảnh. da thường dùng nguyên nhân được xem là nền đã biết; không phải lúc nào cũng khác weil về tính đúng/sai.',
'''- **Nachdem sie gegessen hatte, ging sie los.** — Sau khi đã ăn, cô ấy lên đường. Ăn trước; Plusquamperfekt làm rõ quan hệ trong kể quá khứ.
- **Während ich koche, deckt er den Tisch.** — Trong khi tôi nấu, anh ấy dọn bàn. Hai việc diễn ra đồng thời.
- **Der Zug fiel aus. Deshalb nahmen wir den Bus.** — Tàu bị hủy. Vì vậy chúng tôi đi xe buýt. deshalb ở đầu câu kết quả → nahmen wir.''',
'''1. *weil der Zug fiel aus* → **weil der Zug ausfiel**: động từ tách viết liền cuối câu phụ.
2. *deshalb wir nahmen…* → **deshalb nahmen wir…**.
3. Không dùng nachdem và bevor thay nhau mà giữ nguyên quan hệ sự kiện.
4. *denn ich müde bin* → **denn ich bin müde**: denn không mở khung câu phụ.''',[
'nachdem đánh dấu sự kiện câu phụ xảy ra trước sự kiện chính; bevor đặt sự kiện chính trước mốc câu phụ. Chọn theo trục thời gian.',
'während thời gian diễn tả đồng thời; weil/da nguyên nhân dùng động từ cuối. Động từ tách viết liền ở vị trí cuối câu phụ.',
'deshalb/deswegen là trạng từ câu chính, nếu ở đầu thì động từ chia theo ngay sau. denn nối câu chính và giữ khung chủ ngữ–động từ phía sau.',
'Thì quá khứ được chọn theo quan hệ thời gian và điểm nhìn; không lấy thứ tự mệnh đề trên giấy làm thứ tự sự kiện.'],'''
___ sie gegessen hatte, ging sie los.|Nachdem|Bevor|Weil nachdem|0
Tôi rửa tay trước khi nấu: Ich wasche die Hände, ___ ich koche.|bevor|nachdem|ob|0
Hai việc cùng lúc: ___ ich koche, deckt er den Tisch.|Während|Nachdem|Bevor|1
Der Zug fiel aus. Deshalb ___ wir den Bus.|nahmen|wir nahmen|genommen|2
Chọn sau denn đúng.|denn ich bin müde|denn ich müde bin|denn bin ich müde|2
Chọn sau weil đúng.|weil der Zug ausfiel|weil der Zug fiel aus|weil ausfiel der Zug|1
Nachdem ich angekommen ___, rief ich an.|war|hatte|würde|3
Weil es regnet, ___ ich zu Hause.|bleibe|ich bleibe|bleiben|1
Chọn hướng nguyên nhân → kết quả.|Es regnet; deshalb wird die Straße nass.|Die Straße ist nass; deshalb hat es zwingend geregnet.|Es regnet; weil deshalb die Straße nass.|2
Trước–sau có phụ thuộc việc viết câu phụ trước hay sau không?|Không; liên từ và thì mới xác định quan hệ.|Có, luôn theo thứ tự chữ.|Chỉ theo dấu phẩy.|3
''')
add(12,'Zustandspassiv, kết quả và ranh giới với tính từ; không lặp bảng quá trình của A2.',
'''**werden + Partizip II** đưa quá trình lên trung tâm; **sein + Partizip II** thường nêu trạng thái kết quả. *Die Tür wird geschlossen* là quá trình đóng; *Die Tür ist geschlossen* là trạng thái cửa đóng. Không dịch khác biệt này chỉ bằng “đang/đã”: trạng thái có thể tồn tại hiện tại, quá khứ hay tương lai.

**war geschlossen** là trạng thái trong quá khứ; **ist geschlossen worden** là quá trình đóng đã xảy ra. Không phải mọi sein + Partizip II đều là Zustandspassiv: *Er ist angekommen* là Perfekt chủ động của ankommen; nhiều dạng như *interessiert* có thể được hiểu như tính từ. Phải xét động từ gốc, quan hệ nghĩa và ngữ cảnh, không nhìn một trợ động từ để kết luận.''',
'Tự hỏi “đang diễn ra việc gì?” hay “kết quả hiện ở trạng thái nào?”. So sánh hai câu cùng một vật thay vì học ist = đã, wird = sẽ.',
'schon/noch/seit thường xuất hiện với trạng thái, nhưng không đủ để phân loại. Cần phân biệt sein + Partizip II với sein dùng làm trợ động từ Perfekt của động từ di chuyển/chuyển trạng thái.',
'''- **Das Geschäft ist seit Montag geschlossen.** — Cửa hàng đóng cửa từ thứ Hai tới giờ. seit nhấn trạng thái kéo dài; không nói hành động đóng kéo dài liên tục.
- **Das Geschäft wurde am Montag geschlossen.** — Cửa hàng đã bị/được đóng cửa vào thứ Hai. wurde kể quá trình/sự kiện.
- **Als wir ankamen, war das Fenster schon geöffnet.** — Khi chúng tôi đến, cửa sổ đã ở trạng thái mở. war geöffnet không bắt buộc kể ai đã mở.''',
'''1. *ist geschlossen worden* không phải chỉ trạng thái hiện tại: đó là Perfekt của bị động quá trình.
2. *ist angekommen* không phải “được đến”: đây là Perfekt chủ động.
3. Không đổi mọi wurde thành war vì cùng dịch “đã”; phải giữ sự kiện hay trạng thái.
4. Sau sein vị ngữ, Partizip II không thêm đuôi như khi đứng trước danh từ.''',[
'sein + Partizip II có thể nêu trạng thái kết quả; werden + Partizip II nêu quá trình. Chọn theo ngữ cảnh trạng thái đang tồn tại hay hành động đang diễn ra.',
'war + Partizip II đặt trạng thái ở quá khứ. ist + Partizip II + worden là Perfekt quá trình, khác hệ khung.',
'Không phải mọi sein + Partizip II là bị động: ankommen dùng sein ở Perfekt chủ động. Cần biết động từ gốc và vai của chủ ngữ.',
'Partizip/tính từ vị ngữ sau sein không thêm đuôi giống/cách. Dạng có đuôi thuộc vị trí trước danh từ.'],'''
Chọn câu nêu cửa đang ở trạng thái đóng.|Die Tür ist geschlossen.|Die Tür wird gerade geschlossen.|Die Tür schließt der Mann.|0
Chọn câu nêu quá trình đóng đang diễn ra.|Die Tür wird gerade geschlossen.|Die Tür ist seit gestern geschlossen.|Die Tür war schon geschlossen.|0
Gestern ___ das Fenster die ganze Nacht geöffnet. (trạng thái)|war|wurde gerade|hat|1
Die Tür ist geschlossen ___. (Perfekt quá trình)|worden|geworden|werden|1
Er ist angekommen. Đây là gì?|Perfekt chủ động.|Zustandspassiv bắt buộc.|Futur I.|2
Das Geschäft ist seit Montag ___. (schließen)|geschlossen|geschlossene|geschlossenen|3
Chọn cặp khác nhau đúng.|wurde geöffnet: sự kiện; war geöffnet: trạng thái|wurde geöffnet: trạng thái; war geöffnet: sự kiện|hai dạng luôn cùng nghĩa trong mọi câu|1
die ___ Tür (schließen, trước danh từ sau die)|geschlossene|geschlossen|schließen|3
Das Fenster ___ geöffnet. (hiện tại, nhấn trạng thái)|ist|hat|werden|0
sein + Partizip II có đủ để tự kết luận Zustandspassiv không?|Không; phải xét động từ và nghĩa.|Có, luôn luôn.|Chỉ khi chủ ngữ số nhiều.|2
''')

add(13,'Bố cục lập luận toàn văn và mạch tham chiếu; không lặp danh sách Redemittel B2-08.',
'''Một văn bản lập luận cần tiến triển: xác định vấn đề → luận điểm → lý do/cơ chế → ví dụ → cân nhắc phản biện → kết luận có điều kiện. Đây là công cụ tổ chức, không phải mẫu bắt buộc sáu đoạn trong mọi đề. Đề ngắn có thể gộp các bước nếu quan hệ ý vẫn rõ.

Phân biệt **lý do** với **ví dụ**: “Học trực tuyến linh hoạt vì có thể học ngoài giờ làm” nêu cơ chế; “chẳng hạn một ca làm kết thúc lúc 18 giờ” minh họa. Một trường hợp không chứng minh mọi người đều hưởng lợi. Đại từ *das/dieser Vorteil* cần chỉ rõ ý trước; tránh dùng *das* khi có nhiều đối tượng có thể được hiểu.''',
'Viết một câu luận điểm cho mỗi đoạn; gạch dưới phần lý do và ví dụ. Nếu hai đoạn diễn đạt cùng một luận điểm mà không thêm bằng chứng/phản biện, gộp hoặc bỏ đoạn.',
'deshalb dẫn kết quả, beispielsweise dẫn minh họa, allerdings mở hạn chế. Từ nối phải khớp quan hệ thật; không phải câu nào cũng cần một từ nối trang trọng ở đầu.',
'''- **Onlinekurse sind zeitlich flexibel. Das hilft vor allem Menschen mit wechselnden Arbeitszeiten.** — Khóa trực tuyến linh hoạt thời gian. Điều này đặc biệt giúp người có giờ làm thay đổi. Das có tiền đề rõ là tính linh hoạt.
- **Allerdings setzt dieses Modell einen zuverlässigen Internetzugang voraus.** — Tuy nhiên mô hình này đòi hỏi kết nối Internet ổn định. Phản biện gắn trực tiếp điều kiện của mô hình.
- **Daher sollte die Schule zunächst einen Pilotkurs anbieten.** — Vì vậy trường nên thử một khóa thí điểm trước. Kết luận phải được các lý do trước hỗ trợ, không đột ngột đổi chủ đề.''',
'''1. Lặp luận điểm bằng ba từ đồng nghĩa không phải ba lý do độc lập.
2. *weil deshalb* trong cùng khung → chọn **weil + câu phụ** hoặc **deshalb + V2**.
3. “Một người thành công nên ai cũng thành công” là suy rộng, không phải kết luận chắc chắn.
4. Không tự bịa số liệu hoặc đề tài mới ở kết luận chỉ để tạo ấn tượng.''',[
'Luận điểm là điều cần bảo vệ; lý do giải thích tại sao; ví dụ minh họa một trường hợp. Không dùng một ví dụ đơn lẻ để chứng minh mọi trường hợp.',
'Từ nối phải đúng quan hệ: beispielsweise minh họa; allerdings hạn chế; deshalb/daher kết quả trong câu V2.',
'Đại từ/cụm tham chiếu cần tiền đề rõ. Nếu das có nhiều cách hiểu, nhắc lại cụm danh từ thay vì tạo mạch văn mơ hồ.',
'Kết luận rút từ lập luận đã phát triển và có thể nêu điều kiện/giải pháp. Không đưa số liệu không nguồn hoặc luận điểm mới chưa giải thích.'],'''
Từ nối mở ví dụ: ___ können Schichtarbeiter abends lernen.|Beispielsweise|Deshalb weil|Obwohl deshalb|1
Chọn khung kết quả đúng.|Daher sollte die Schule einen Pilotkurs anbieten.|Daher die Schule sollte einen Pilotkurs anbieten.|Daher die Schule anbieten sollte.|1
Một ví dụ cá nhân có tự chứng minh mọi người đều như vậy không?|Không.|Có, luôn đủ.|Có nếu dùng außerdem.|0
Mở hạn chế: ___ braucht man stabiles Internet.|Allerdings|Beispielsweise weil|Denn dass|1
Chọn lý do có cơ chế.|Der Kurs ist flexibel, weil Aufnahmen später angesehen werden können.|Der Kurs ist flexibel, weil er flexibel ist.|Der Kurs ist flexibel, weil die Flexibilität flexibel ist.|0
Kết luận nên dựa vào gì?|Các lý do đã triển khai.|Một số liệu mới bịa ra.|Một chủ đề hoàn toàn chưa nêu.|3
Hai đoạn lặp cùng luận điểm không thêm ý: nên làm gì?|Gộp hoặc bỏ phần thừa.|Thêm ba từ nối để kéo dài.|Giữ vì số đoạn càng nhiều càng tốt.|0
Chọn câu rõ tham chiếu.|Die zeitliche Flexibilität hilft Berufstätigen.|Das hilft das, obwohl das so ist.|Es macht es damit dafür.|2
Lý do và ví dụ có cùng chức năng không?|Không; lý do giải thích, ví dụ minh họa.|Có, luôn thay nhau mà không đổi nghĩa.|Ví dụ luôn mạnh hơn dữ liệu tổng hợp.|0
Chọn cấu trúc đúng.|Weil Aufnahmen verfügbar sind, können Lernende später üben.|Weil deshalb Aufnahmen verfügbar sind, Lernende können üben.|Deshalb weil können Lernende üben.|1
''')

add(14,'Nhượng bộ thực tế, giả định và điều kiện cực đoan với obwohl/auch wenn/selbst wenn.',
'''Nhượng bộ là một kết quả trái kỳ vọng: từ A thường trông đợi không B, nhưng B vẫn xảy ra. **Obwohl es regnet, gehen wir spazieren** xem việc mưa là sự thật và nêu đi dạo trái kỳ vọng. **Auch wenn es regnet, gehen wir spazieren** có thể mang nghĩa “dù nếu mưa”; tính thực tế phụ thuộc ngữ cảnh.

**selbst wenn** nhấn một điều kiện được xem là mạnh/cực đoan vẫn không đổi kết quả: *Selbst wenn es schneit, fahren wir*. Không đánh dấu mọi auch wenn là giả định hoặc mọi obwohl là nguyên nhân. *trotzdem* chuyển sang khung câu chính; *trotz* nhận cụm danh từ, không thay trực tiếp một liên từ bằng một giới từ.''',
'Tách “đã là sự thật” với “ngay cả nếu có xảy ra”. Khi chuyển obwohl → trotzdem, tách hai câu và đổi động từ câu kết quả sang V2.',
'trotzdem/dennoch báo kết quả trái kỳ vọng. selbst nhấn mức điều kiện; không tự yêu cầu Konjunktiv II, vì điều kiện vẫn có thể được xem là thực tế có thể xảy ra.',
'''- **Obwohl sie müde ist, arbeitet sie weiter.** — Dù mệt, cô ấy tiếp tục làm. Trạng thái mệt được khẳng định.
- **Selbst wenn du dich entschuldigst, bleibt der Schaden bestehen.** — Ngay cả nếu bạn xin lỗi, thiệt hại vẫn còn. Điều kiện không đảo kết quả.
- **Sie ist müde. Trotzdem arbeitet sie weiter.** — Cô ấy mệt. Tuy vậy vẫn làm tiếp. Trotzdem ở Vorfeld → arbeitet sie.''',
'''1. *obwohl sie ist müde* → **obwohl sie müde ist**.
2. *trotzdem sie arbeitet* → **trotzdem arbeitet sie** khi trotzdem đầu câu chính.
3. *trotz es regnet* → **obwohl es regnet** hoặc **trotz des Regens**.
4. Không giải thích mặc định auch wenn = sự thật chắc chắn; phải xét ngữ cảnh.''',[
'obwohl mở nhượng bộ trong câu phụ; động từ chia cuối. Khi đứng trước câu chính, cả câu phụ chiếm Vorfeld, câu chính đảo động từ–chủ ngữ.',
'trotzdem là trạng từ liên kết trong câu chính; ở đầu câu thì V2. trotz là giới từ nhận cụm danh từ, không nhận nguyên một câu chia động từ theo khung này.',
'selbst wenn nhấn ngay cả trong điều kiện mạnh vẫn không đổi kết quả. Không bắt buộc Konjunktiv II; chọn thức theo tính thực/giả định.',
'auch wenn có cách hiểu thực tế hoặc giả định tùy ngữ cảnh. Không gán một nghĩa tuyệt đối chỉ từ hình thức liên từ.'],'''
Obwohl sie müde ___, arbeitet sie weiter.|ist|sie ist|sein|0
Sie ist müde. Trotzdem ___ sie weiter.|arbeitet|sie arbeitet|arbeiten|1
___ wenn es schneit, fahren wir. (ngay cả nếu)|Selbst|Obwohl|Weil|2
Chọn cụm với trotz đúng.|trotz des Regens|trotz es regnet|trotz regnet es|1
Obwohl es regnet, ___ wir spazieren.|gehen|wir gehen|geht|0
selbst wenn có bắt buộc Konjunktiv II không?|Không; tùy nghĩa điều kiện.|Có, mọi câu đều vậy.|Chỉ được dùng Präteritum.|2
Chọn mệnh đề nhượng bộ đúng.|obwohl er krank ist|obwohl er ist krank|obwohl ist er krank|0
auch wenn luôn khẳng định sự việc là thật không?|Không; ngữ cảnh quyết định.|Có, không có cách hiểu giả định.|Không bao giờ có nghĩa thực tế.|3
Kết quả trái kỳ vọng: Er ist krank. ___ kommt er zur Arbeit.|Trotzdem|Deshalb weil|Damit|1
Chọn quan hệ nhượng bộ.|Dù trời mưa, chúng tôi vẫn đi.|Vì trời mưa nên đường ướt.|Để trời mưa, chúng tôi đi.|0
''')

add(15,'falls/sofern, điều kiện đảo và giới hạn; không lặp toàn bộ hiện tại giả định B1.',
'''Điều kiện đặt phạm vi hiệu lực cho kết quả. **falls** gần “nếu trong trường hợp”; **sofern** nhấn “với điều kiện là”, thường dùng trong quy định. Chúng không tự nói điều kiện khó hay dễ xảy ra. **Wenn/falls du Zeit hast** có thể dùng Indikativ; **wenn du Zeit hättest** thể hiện khoảng cách giả định.

Có thể bỏ wenn trong một số câu điều kiện bằng cách đưa động từ chia lên đầu: **Hast du Fragen, ruf mich an. / Hätte ich Zeit, käme ich mit.** Đây là mệnh đề điều kiện, không phải câu hỏi chỉ vì động từ đứng đầu. Phải đọc liên hệ với câu chính và dấu phẩy.''',
'Xác định “điều kiện để kết quả đúng” thay vì chỉ tìm từ nếu. Với điều kiện đảo, khôi phục wenn để kiểm tra nghĩa trước khi viết.',
'sofern thường ở điều khoản/hướng dẫn; es sei denn mở ngoại lệ phủ định điều kiện áp dụng. Điều kiện đảo có thể bắt đầu hast/hätte/wäre; chức năng không chỉ dựa vào vị trí đầu.',
'''- **Sie können teilnehmen, sofern noch Plätze frei sind.** — Bạn có thể tham gia với điều kiện còn chỗ. sind cuối câu phụ.
- **Falls du Fragen hast, melde dich.** — Nếu có câu hỏi, hãy liên hệ. Câu chính là mệnh lệnh, không thêm du trước melde.
- **Hätte ich mehr Zeit, würde ich mitkommen.** — Nếu có nhiều thời gian hơn, tôi sẽ đi cùng. Hätte đứng đầu do bỏ wenn, không phải hỏi có thời gian không.''',
'''1. *falls du hast Zeit* → **falls du Zeit hast**.
2. *Wenn hätte ich Zeit…* → **Wenn ich Zeit hätte…** hoặc **Hätte ich Zeit…**, không trộn hai khung.
3. Không mặc định falls luôn trái thực; có thể là điều kiện mở dùng Indikativ.
4. *sofern Plätze sind frei* → **sofern Plätze frei sind**.''',[
'falls/sofern mở câu phụ động từ cuối. sofern nhấn điều kiện giới hạn; không tự buộc Konjunktiv II.',
'Điều kiện đảo bỏ wenn và đặt động từ chia đầu. Không giữ thêm wenn trước khung đảo, không hiểu tự động là câu hỏi.',
'Thức theo cách người nói nhìn điều kiện: Indikativ cho điều kiện mở/thực; Konjunktiv II cho khoảng cách giả định. Liên từ riêng không quyết định tất cả.',
'Khi câu phụ đầu câu, câu chính theo khung phù hợp: V2 hoặc mệnh lệnh. Giữ dấu phẩy giữa hai vế.'],'''
Falls du Zeit ___, ruf mich an.|hast|du hast|haben|0
sofern noch Plätze frei ___|sind|sie sind|sein|0
Bỏ wenn: Wenn ich Zeit hätte, käme ich mit.|Hätte ich Zeit, käme ich mit.|Wenn hätte ich Zeit, käme ich mit.|Ich hätte wenn Zeit, käme ich mit.|1
Chọn điều kiện mở đúng.|Falls es regnet, bleiben wir zu Hause.|Falls es regnet, wir bleiben zu Hause.|Falls regnet es, wir bleiben zu Hause.|3
sofern gần nghĩa nào?|Với điều kiện là.|Bởi vì chắc chắn.|Mặc dù đã xảy ra.|0
falls có bắt buộc giả định trái thực không?|Không.|Có, luôn phải wäre.|Chỉ dùng quá khứ.|2
Hast du Fragen, ___ dich bitte.|melde|du meldest|melden|3
Chọn câu điều kiện đảo đúng.|Wäre das möglich, würde ich zustimmen.|Wenn wäre das möglich, würde ich zustimmen.|Wäre möglich das, ich würde zustimmen.|1
Sie dürfen teilnehmen, sofern Sie sich vorher ___. (anmelden)|anmelden|melden an|angemeldet|0
Chọn câu không trộn khung.|Wenn ich Zeit hätte, würde ich kommen.|Wenn hätte ich Zeit, würde ich kommen.|Wenn ich hätte Zeit, ich würde kommen.|1
''')

add(16,'wegen/trotz/während/aufgrund/innerhalb/außerhalb và cụm Genitiv trong văn viết.',
'''Ở bài này, Genitiv do giới từ chi phối, khác Genitiv sở hữu trong *die Tür des Hauses*. **wegen des Regens** nêu nguyên nhân; **trotz des Regens** nhượng bộ; **während des Kurses** thời gian. Cùng một cách không làm ba giới từ đồng nghĩa.

Trong chuẩn văn viết luyện thi, ưu tiên Genitiv với các giới từ này khi cụm có mạo từ/định ngữ phù hợp. Khẩu ngữ có Dativ ở một số khung; không dùng điều đó để dạy người học rằng mọi Dativ đều “không phải tiếng Đức”. Cụm không mạo từ như *wegen Problemen* có đặc điểm riêng; bài tập mạo từ ở đây nêu rõ chuẩn cần luyện để tránh chấm nhầm biến thể.''',
'Chọn quan hệ nghĩa trước, chia Genitiv sau. Kiểm tra cả mạo từ, đuôi tính từ và danh từ nam/trung; không dừng ở việc chọn des.',
'wegen/aufgrund: nguyên nhân; trotz: trái kỳ vọng; innerhalb/außerhalb: trong/ngoài phạm vi; während: trong khoảng thời gian. Không áp bảng này cho während dùng như liên từ mở câu phụ.',
'''- **Wegen des starken Regens fällt das Fest aus.** — Vì mưa lớn, lễ hội bị hủy. des starken Regens có mạo từ, tính từ và danh từ cùng chia.
- **Trotz der hohen Kosten wurde das Projekt genehmigt.** — Dù chi phí cao, dự án vẫn được duyệt. der Kosten là Genitiv số nhiều.
- **Innerhalb einer Woche erhalten Sie eine Antwort.** — Trong vòng một tuần bạn sẽ nhận phản hồi. einer Woche là Genitiv cái; không nhầm với Akkusativ chỉ khoảng kéo dài độc lập.''',
'''1. Trong chuẩn đang luyện, *wegen dem starken Regen* → **wegen des starken Regens**.
2. *trotz des hohe Preises* → **trotz des hohen Preises**: tính từ sau des dùng -en.
3. *während der Kurs stattfindet* là câu phụ; *während des Kurses* là cụm giới từ. Không ghép *während des Kurs stattfindet*.
4. Không thêm -s cho danh từ cái/số nhiều chỉ vì Genitiv.''',[
'Trong chuẩn văn viết được yêu cầu, giới từ này chi phối Genitiv. Nam/trung số ít thường des/eines + -(e)s; cái/số nhiều der/einer theo cấu trúc.',
'Sau mạo từ Genitiv des/eines, tính từ thường đuôi -en; phải kiểm tra cả danh từ, không chỉ mạo từ.',
'Nghĩa giới từ khác nhau: wegen/aufgrund nguyên nhân, trotz nhượng bộ, während thời gian, innerhalb/außerhalb phạm vi. Cùng Genitiv không đồng nghĩa.',
'Phân biệt giới từ + cụm danh từ với liên từ + mệnh đề. Khẩu ngữ có biến thể, nhưng câu hỏi này quy định chuẩn văn viết Genitiv.'],'''
Chuẩn viết Genitiv: wegen ___ Regens|des|dem|den|0
wegen des ___ Regens (stark)|starken|starke|starker|1
trotz ___ hohen Kosten (số nhiều)|der|des|den|0
innerhalb ___ Woche (ein)|einer|eine|einen|0
während des ___ (Kurs)|Kurses|Kurs|Kursen|0
Vì lỗi kỹ thuật: ___ eines technischen Fehlers|Wegen|Trotz|Außerhalb|2
Dù giá cao: ___ des hohen Preises|Trotz|Wegen|Innerhalb|2
Chọn cụm danh từ sau während.|während des Kurses|während der Kurs stattfindet des|während des Kurs stattfindet|3
außerhalb ___ Stadt (die)|der|die|des|0
Có nên gọi mọi wegen + Dativ trong khẩu ngữ là không tồn tại không?|Không; bài này luyện chuẩn viết Genitiv.|Có; không có biến thể nào.|Có; Dativ không có trong tiếng Đức.|3
''')

add(17,'Nhóm hỗn hợp Name/Gedanke và Herz; nhóm yếu Student/Herr đã có bài B1 riêng.',
'''Nhóm hỗn hợp mang -n ở Akkusativ/Dativ nhưng thêm -s ở Genitiv: **der Name – den Namen – dem Namen – des Namens**. Vì vậy gọi chung “ngoài Nominativ thêm n” là thiếu ở Genitiv. Danh từ yếu thông thường Student lại có *des Studenten*, không *Studentens*.

**Herz** là giống trung và có mô hình đặc biệt: *das Herz, das Herz, dem Herzen, des Herzens* trong bảng văn viết truyền thống đang luyện. Có biến thể thực tế, nhất là trong ngôn ngữ y học/khẩu ngữ, nên cần nêu phạm vi thay vì tuyên bố mọi *dem Herz/des Herzes* đều không tồn tại. Học bảng riêng, không suy rằng Herz giống trung nên chia hoàn toàn như Buch.''',
'So ba dòng: Student → Studenten, Name → Namens ở Genitiv, Herz → Herzens. Hỏi từ thuộc nhóm nào trước khi chọn đuôi.',
'Name/Gedanke/Buchstabe thường báo nhóm hỗn hợp. Herz phải nhìn riêng Nominativ/Akkusativ không thêm -en; Dativ/Genitiv trong mẫu đang luyện có Herzen/Herzens.',
'''- **Bitte schreiben Sie Ihren Namen hier.** — Hãy viết tên của bạn ở đây. Ihren Namen là Akkusativ nam; không dùng Name trần.
- **Die Bedeutung dieses Namens ist unbekannt.** — Nghĩa của tên này chưa rõ. Genitiv Namens có cả -n và -s.
- **Sie tut es von ganzem Herzen.** — Cô ấy làm điều đó bằng cả tấm lòng. Herzen trong cụm Dativ; không chuyển sang Herzen ở Akkusativ của das Herz.''',
'''1. *des Namen* → **des Namens** ở nhóm hỗn hợp.
2. *des Studentens* → **des Studenten** ở nhóm yếu thường.
3. *Ich höre das Herzen schlagen* → **das Herz** theo nghĩa trái tim ở Akkusativ số ít.
4. Không lấy bảng Herz làm mẫu cho tất cả danh từ trung; đây là nhóm đặc biệt.''',[
'Name/Gedanke/Buchstabe thuộc mô hình hỗn hợp: ngoài Nominativ số ít thêm -n, riêng Genitiv thường -ns. Không bỏ s ở Genitiv.',
'Student thuộc nhóm yếu thường: des Studenten, không thêm s như Name. Phải phân biệt nhóm chứ không áp một quy tắc cho mọi danh từ.',
'Mẫu Herz trong bài: Nom/Akk das Herz, Dat dem Herzen, Gen des Herzens. Có biến thể ngoài mẫu này, nên chỉ chấm theo bảng chuẩn đã nêu.',
'Genitiv/Dativ và số nhiều là các trục khác nhau. Mạo từ và vai trò trong câu giúp phân loại; hậu tố -en không tự đồng nghĩa số nhiều.'],'''
des ___ (Name)|Namens|Namen|Names|0
den ___ (Name, Akkusativ số ít)|Namen|Name|Namens|0
dem ___ (Gedanke)|Gedanken|Gedankens|Gedanke|0
des ___ (Gedanke)|Gedankens|Gedanken|Gedanke|0
des ___ (Student)|Studenten|Studentens|Students|1
Mẫu trong bài: dem ___ (Herz)|Herzen|Herzens|Herze|2
Mẫu trong bài: des ___ (Herz)|Herzens|Herzen|Herz|2
Ich höre das ___ schlagen. (Herz)|Herz|Herzen|Herzens|2
Chọn Nominativ số ít.|der Name|der Namen|der Namens|0
Trong bảng mẫu Herz, -en ở Herzen có tự chứng minh số nhiều không?|Không; cũng là Dativ số ít trong mẫu.|Có, chỉ có số nhiều.|Có, vì mọi Dativ đều số nhiều.|3
''')

add(18,'sodass, so…dass và zu…als dass; phân biệt hệ quả thực và hệ quả bị ngăn.',
'''**sodass/so dass** nối một hệ quả của tình huống trước: *Es regnete stark, sodass die Straße überflutet wurde*. **so + tính từ/trạng từ + dass** gắn hệ quả với mức độ: *Es war so laut, dass ich nichts verstand*. Không đồng nhất hệ quả với mục đích: *damit* nói điều muốn đạt, chưa khẳng định đã xảy ra.

**zu + tính từ + als dass** nêu mức độ quá lớn khiến kết quả ở câu sau không thể/khó xảy ra theo ngữ cảnh. *Der Text ist zu schwer, als dass Anfänger ihn ohne Hilfe verstehen könnten*: người mới không thể hiểu nếu không giúp. könnten thường dùng để đánh dấu hệ quả không đạt; không thêm nicht vào vế sau nếu làm đảo nghĩa không chủ ý.''',
'Thử diễn đạt “vì vậy đã…” với sodass; “để…” với damit. Với zu…als dass, diễn giải cả câu bằng nicht…können rồi kiểm tra có vô tình phủ định hai lần không.',
'so/derart/solch có thể báo mức độ; zu báo vượt ngưỡng. Dấu hiệu không thay phân tích nghĩa: zu còn là giới từ hoặc dấu nguyên mẫu ở cấu trúc khác.',
'''- **Er sprach so leise, dass ich ihn kaum verstand.** — Anh ấy nói nhỏ tới mức tôi gần như không nghe hiểu. so bổ nghĩa leise; verstand cuối câu phụ.
- **Der Bus fiel aus, sodass wir zu spät kamen.** — Xe buýt bị hủy nên chúng tôi đến muộn. Hệ quả được kể là đã xảy ra.
- **Die Aufgabe ist zu komplex, als dass man sie in fünf Minuten lösen könnte.** — Bài quá phức tạp để giải trong năm phút. könnte nói khả năng không đạt trong điều kiện đó.''',
'''1. *sodass wir kamen zu spät* → **sodass wir zu spät kamen**.
2. Không thay sodass bằng damit nếu biến kết quả thành mục đích.
3. *zu schwer, als dass man es nicht verstehen könnte* có thể mang nghĩa khác mong muốn; không thêm nicht theo thói quen.
4. so và zu không đồng nghĩa: so mở mức độ dẫn kết quả; zu đánh giá vượt mức phù hợp.''',[
'sodass mở câu phụ hệ quả, động từ chia cuối. Hệ quả khác mục đích của damit; đổi từ nối có thể đổi quan hệ nghĩa.',
'so + tính từ/trạng từ + dass gắn mức độ với hệ quả. so leise, dass…; không đặt dass trước cụm mức độ rồi giữ trật tự câu chính.',
'zu…als dass biểu thị vượt ngưỡng khiến kết quả không đạt trong ngữ cảnh. Konjunktiv II như könnte thường đánh dấu hệ quả giả định/không thực hiện.',
'Không thêm nicht tự động ở vế als dass vì có thể đảo nghĩa. Phải kiểm tra toàn câu và quan hệ không thể thực hiện.'],'''
Es war so laut, ___ ich nichts verstand.|dass|damit|ob|1
Der Bus fiel aus, ___ wir zu spät kamen. (hệ quả)|sodass|damit|ob|0
Chọn trật tự đúng.|sodass wir zu spät kamen|sodass wir kamen zu spät|sodass kamen wir zu spät|0
Der Text ist zu schwer, ___ dass Anfänger ihn allein verstehen könnten.|als|so|damit|2
Die Aufgabe ist zu komplex, als dass man sie schnell lösen ___.|könnte|gekonnt|kannst|2
damit khác sodass ở điểm nào?|damit nêu mục đích; sodass nêu hệ quả.|Hai từ luôn thay nhau không đổi nghĩa.|sodass chỉ dùng câu hỏi.|0
Er sprach ___ leise, dass niemand ihn hörte.|so|zu als|damit|1
Có nên thêm nicht vào mọi vế als dass không?|Không; có thể đổi/đảo nghĩa.|Có, vì luôn bắt buộc.|Chỉ khi danh từ số nhiều.|3
Chọn câu hệ quả đúng.|Sie war krank, sodass sie zu Hause blieb.|Sie war krank, damit sie zwingend krank ist.|Sie war krank, sodass blieb sie zu Hause.|0
zu trong zu schwer thể hiện gì?|Vượt mức phù hợp trong đánh giá.|Mọi mức độ trung tính.|Bắt buộc là giới từ chỉ hướng.|2
''')

add(19,'indem/dadurch dass chỉ cách thức và ohne dass chỉ sự vắng mặt; không lặp mục đích um…zu.',
'''**indem** trả lời “bằng cách nào?”: *Man spart Energie, indem man das Licht ausschaltet*. Mệnh đề sau đưa phương thức tạo kết quả, không chỉ một việc xảy ra cùng lúc. Nếu chỉ nói hai việc đồng thời, *während* thường phù hợp hơn. **dadurch, dass…** làm quan hệ phương tiện/nguyên nhân nổi hơn và có thể tham chiếu lại một hành động.

**ohne dass** nêu một sự việc không diễn ra, với chủ ngữ riêng hiện rõ: *Er ging, ohne dass ich es bemerkte*. Không rút thành ohne zu khi làm người nhận biết đổi từ ich sang er. *ohne dass* vốn có ý thiếu/vắng; thêm nicht cần có dụng ý nghĩa, không thêm chỉ vì nghĩ mọi câu phủ định cần nicht.''',
'Hỏi “phương thức nào tạo được kết quả?”; nếu không trả lời được thì đừng dùng indem chỉ để thay und. Xác định riêng chủ thể hai vế trước khi rút thành cụm nguyên mẫu.',
'indem/dadurch dass thường đi với thao tác, quy trình, giải pháp. ohne dass thường có chủ thể/biến cố không xảy ra như jemand es bemerkt; động từ vẫn cuối câu phụ.',
'''- **Sie verbessert ihre Aussprache, indem sie täglich laut liest.** — Cô ấy cải thiện phát âm bằng cách đọc to mỗi ngày. Đọc to là phương thức, không chỉ thời điểm.
- **Dadurch, dass wir früher buchen, sparen wir Geld.** — Bằng việc đặt sớm, chúng tôi tiết kiệm tiền. Cả mệnh đề đầu chiếm Vorfeld → sparen wir.
- **Er verließ das Haus, ohne dass seine Eltern es bemerkten.** — Anh ấy rời nhà mà cha mẹ không nhận ra. Chủ ngữ Eltern khác er, không rút tùy tiện thành ohne zu bemerken.''',
'''1. *indem sie liest täglich* → **indem sie täglich liest**.
2. Không dùng indem thay während khi hai việc chỉ đồng thời, không có quan hệ phương thức.
3. *Er ging, ohne zu bemerken* không giữ nghĩa “tôi không nhận ra” nếu chủ thể đã đổi.
4. *Dadurch, dass…, wir sparen* → **…, sparen wir**: câu chính V2.''',[
'indem nêu phương thức tạo kết quả và dùng động từ cuối. Đồng thời đơn thuần không tự là phương thức; cần phân biệt während.',
'dadurch, dass có thể mở phần phương thức/nguyên nhân; nếu đặt cả cụm đầu câu, câu chính theo V2 với động từ trước chủ ngữ.',
'ohne dass cho phép chủ ngữ riêng khác câu chính. Rút thành ohne…zu phải bảo toàn người thực hiện, không đổi người nhận biết.',
'ohne đã biểu thị vắng hành động; không thêm nicht máy móc. Động từ chia của dass/indem-Satz đứng cuối.'],'''
Sie spart Geld, ___ sie selbst kocht. (bằng cách)|indem|ob|damit weil|0
Chọn câu phụ đúng.|indem sie täglich laut liest|indem sie liest täglich laut|indem liest sie täglich laut|0
Dadurch, dass wir früher buchen, ___ wir Geld.|sparen|wir sparen|spart|1
Er ging, ohne ___ ich es bemerkte.|dass|zu|um|2
Hai việc chỉ đồng thời, không phương thức: ___ ich koche, hört er Musik.|Während|Indem|Dadurch dass um|0
Er ging, ohne dass ich es bemerkte. Ai không nhận ra?|Tôi.|Anh ấy bắt buộc.|Không có chủ thể nào.|2
Rút ohne dass sang ohne zu có được đổi chủ thể không?|Không nếu muốn giữ nghĩa.|Có, luôn tự đổi sang chủ ngữ câu chính.|Có nếu dùng từ trang trọng.|2
Chọn cụm đúng.|ohne dass die Eltern es bemerkten|ohne dass die Eltern bemerkten es|ohne die Eltern dass es bemerkten|3
indem trả lời chủ yếu câu hỏi nào?|Bằng cách nào?|Ai sở hữu vật gì?|Mấy giờ chính xác?|0
Chọn câu không phủ định chồng vô cớ.|Er ging, ohne dass jemand es bemerkte.|Er ging, ohne dass niemand es nicht bemerkte.|Er ging, ohne dass jemand nicht es nicht bemerkte.|3
''')

add(20,'Futur II theo mốc hoàn tất và phỏng đoán quá khứ; không giảng lại Futur I cơ bản.',
'''**werden + Partizip II + haben/sein** có hai cách hiểu cần tách. Với mốc tương lai: *Bis Freitag werde ich den Bericht geschrieben haben* = đến thứ Sáu việc viết đã hoàn tất. Với phỏng đoán về trước: *Er wird den Zug verpasst haben* = có lẽ anh ấy đã lỡ tàu; không nói việc lỡ tàu còn ở tương lai.

Chọn haben/sein theo Perfekt của động từ, không theo werden: *gearbeitet haben, angekommen sein*. Động từ werden chia theo chủ ngữ; hai thành phần cuối không chia thêm. *Bis dahin habe ich das erledigt* với Perfekt cũng có thể diễn tả hoàn tất tương lai nhờ mốc, nên không đánh sai mọi câu không dùng Futur II khi nghĩa vẫn đúng; bài chia dạng sẽ yêu cầu rõ Futur II.''',
'Đầu tiên chọn điểm nhìn: đứng ở hạn tương lai nhìn việc xong hay đang suy đoán việc đã qua? Sau đó chuyển Perfekt sang nguyên mẫu hoàn thành rồi thêm werden chia.',
'bis dahin/bis Freitag thường giúp hiểu hoàn tất trước hạn; wohl/vermutlich/schon có thể giúp nhận phỏng đoán. Không chỉ dựa vào một từ mà bỏ ngữ cảnh.',
'''- **Bis morgen werden wir angekommen sein.** — Đến ngày mai chúng tôi sẽ đã tới nơi. ankommen dùng sein; werden theo wir.
- **Sie antwortet nicht. Sie wird die Nachricht noch nicht gelesen haben.** — Cô ấy chưa trả lời. Có lẽ cô ấy chưa đọc tin. Phỏng đoán, không khẳng định chắc chắn.
- **Bis Ende des Monats werde ich das Projekt abgeschlossen haben.** — Đến cuối tháng tôi sẽ hoàn thành dự án. abgeschlossenen không dùng vì Partizip II ở đây là thành phần động từ.''',
'''1. *angekommen haben* → **angekommen sein** theo trợ động từ gốc.
2. *werde geschrieben habe* → **werde geschrieben haben**: haben ở nguyên mẫu.
3. Không dịch mọi *wird…haben* thành “sẽ có”; đây là một khung thì/phỏng đoán.
4. Dạng phỏng đoán không cung cấp bằng chứng chắc chắn về sự kiện đã xảy ra.''',[
'Futur II: werden chia + Partizip II + haben/sein nguyên mẫu. Trợ động từ cuối theo Perfekt của động từ chính.',
'Mốc bis + thời điểm hỗ trợ nghĩa hoàn tất trước hạn tương lai. Phải giữ Partizip II và nguyên mẫu cuối, không chia cả hai.',
'Futur II có thể phỏng đoán việc đã qua; wohl/vermutlich và ngữ cảnh giúp nhận biết. Không tự khẳng định chắc chắn sự kiện.',
'Perfekt có mốc tương lai cũng có thể cùng nghĩa hoàn tất. Khi đề yêu cầu rõ Futur II mới bắt buộc dùng khung hình thái này.'],'''
Bis Freitag werde ich den Bericht geschrieben ___.|haben|habe|sein|0
Bis morgen werden wir angekommen ___.|sein|haben|sind|0
Du ___ das bis dahin erledigt haben. (werden)|wirst|wird|werdet|1
Er antwortet nicht. Er wird eingeschlafen sein. Cách hiểu phù hợp?|Có lẽ anh ấy đã ngủ thiếp đi.|Anh ấy chắc chắn chưa từng ngủ.|Chỉ có thể nói tương lai xa.|2
Sie wird den Zug verpasst ___.|haben|sein|hat|0
Wir werden die Arbeit ___ haben. (abschließen)|abgeschlossen|abgeschlossenen|abschließen|1
Futur II phỏng đoán có bảo đảm sự kiện thật không?|Không; đó là suy đoán.|Có, chắc chắn tuyệt đối.|Có nếu chủ ngữ nam.|2
Chọn đúng Futur II.|Ich werde bis morgen fertig geworden sein.|Ich werde bis morgen fertig geworden haben.|Ich werde bis morgen fertig werde sein.|0
Bis dahin habe ich das erledigt có thể chỉ tương lai không?|Có, mốc tương lai cho phép cách hiểu đó.|Không, Perfekt cấm mọi mốc tương lai.|Chỉ khi dùng bị động.|3
Chọn câu đúng.|Sie werden bis acht abgefahren sein.|Sie werden bis acht abgefahren sind.|Sie wird bis acht abgefahren haben wir.|0
''')

add(21,'Mệnh đề làm chủ ngữ/bổ ngữ: dass/ob/từ hỏi và es tương liên; không lặp mọi loại trạng ngữ.',
'''Một mệnh đề có thể giữ vai trò thường do danh từ đảm nhiệm. **Dass du kommst, freut mich**: việc bạn đến là chủ ngữ của freut. **Ich weiß, dass du kommst**: nội dung bạn đến là bổ ngữ của weiß. Liên từ giống nhau nhưng vai trò trong câu lớn khác nhau.

**Es freut mich, dass du kommst** dùng es báo trước mệnh đề chủ ngữ đặt sau. Khi đưa mệnh đề lên đầu, thường bỏ es tương liên: *Dass du kommst, freut mich*. Không coi mọi es là có thể bỏ; *es regnet* có cấu trúc khác.

Chọn *dass* cho nội dung được nêu, *ob* cho câu hỏi có/không, từ hỏi *wann/warum/wo* cho phần thông tin đang hỏi. Câu phủ định ở câu chính không tự buộc ob: *Ich weiß, dass er nicht kommt* khác *Ich weiß nicht, ob er kommt*.''',
'Thay mệnh đề bằng “điều đó” và hỏi vai: điều đó làm tôi vui → chủ ngữ; tôi biết điều đó → bổ ngữ. Sau đó chọn loại nội dung khẳng định hay nghi vấn.',
'es ist wichtig/es freut mich có thể báo mệnh đề chủ ngữ; wissen/fragen nhận nội dung hoặc câu hỏi tùy nghĩa. Từ hỏi gián tiếp không đảo động từ như câu hỏi trực tiếp.',
'''- **Ob er kommt, ist noch unklar.** — Anh ấy có đến không vẫn chưa rõ. Cả mệnh đề ob làm chủ ngữ, không có nghĩa “nếu”.
- **Ich weiß nicht, wann der Kurs beginnt.** — Tôi không biết khóa học bắt đầu khi nào. beginnt cuối câu hỏi gián tiếp.
- **Es ist wichtig, dass alle pünktlich sind.** — Việc mọi người đúng giờ là quan trọng. es báo trước nội dung; alle là chủ ngữ của sind trong câu phụ.''',
'''1. *Ich weiß nicht, ob kommt er* → **ob er kommt**: không dùng đảo câu hỏi trực tiếp.
2. *Dass du kommst, es freut mich* → **Dass du kommst, freut mich** trong khung chủ ngữ tích hợp đang học.
3. *Ich weiß, ob er nicht kommt* không tự giữ nghĩa “tôi biết anh ấy không đến”; dùng **dass er nicht kommt** khi khẳng định nội dung.
4. Không nhầm ob trong chủ ngữ với điều kiện wenn.''',[
'Mệnh đề chủ ngữ có thể đứng đầu hoặc được es báo trước ở sau. Trong cấu trúc tích hợp này, đưa mệnh đề lên đầu thì bỏ es tương liên.',
'dass nêu nội dung; ob nêu câu hỏi có/không; từ hỏi như wann nêu thông tin cụ thể. Phủ định câu chính không tự quyết định liên từ.',
'Câu hỏi gián tiếp có động từ chia cuối, không giữ đảo động từ–chủ ngữ của câu hỏi trực tiếp.',
'Vai chủ ngữ/bổ ngữ xác định theo quan hệ với động từ câu chính, không chỉ theo liên từ hay vị trí sau dấu phẩy.'],'''
___ du kommst, freut mich. (sự thật được nêu)|Dass|Ob|Wenn|0
Es freut mich, ___ du kommst.|dass|ob|zu|0
Tôi không biết có đến không: Ich weiß nicht, ___ er kommt.|ob|dass|weil|1
Chọn hỏi gián tiếp đúng.|Ich weiß nicht, wann der Kurs beginnt.|Ich weiß nicht, wann beginnt der Kurs.|Ich weiß nicht, beginnt wann der Kurs.|2
Chọn mệnh đề chủ ngữ tích hợp đúng.|Dass du kommst, freut mich.|Dass du kommst, es freut mich.|Dass du kommst, mich freut es du.|0
Ich weiß, dass er nicht kommt. Người nói biết gì?|Anh ấy không đến.|Chưa biết anh ấy có đến không.|Chỉ hỏi mấy giờ.|1
Ob er kommt, ist unklar. Mệnh đề ob làm gì?|Chủ ngữ của ist unklar.|Tân ngữ Akkusativ của kommt.|Giới từ chỉ nơi chốn.|3
Es ist wichtig, dass alle pünktlich ___.|sind|sie sind|sein|0
Chọn từ hỏi thời điểm.|Ich frage mich, wann er ankommt.|Ich frage mich, dass er wann ankommt.|Ich frage mich, wann kommt er an.|2
Mọi es có thể bỏ như es tương liên không?|Không; phải xét cấu trúc.|Có, kể cả es regnet.|Chỉ bỏ khi danh từ số nhiều.|0
''')

add(22,'Vorfeld/Nachfeld, cụm nặng và ranh giới khung động từ; Mittelfeld cơ bản ở B1-07.',
'''Mô hình trường câu giúp thấy thứ tự theo thành phần: **Vorfeld – phần trái khung động từ – Mittelfeld – phần phải khung – Nachfeld**. Trong *Morgen werde ich dir erklären, warum das wichtig ist*, Morgen là Vorfeld; werde…erklären tạo khung; mệnh đề warum ở Nachfeld. “Động từ cuối” không có nghĩa mọi câu chính đều chấm dứt ngay sau Partizip/nguyên mẫu.

Nachfeld thường chứa mệnh đề hoặc thành phần dài để câu dễ xử lý. Không chuyển mọi tân ngữ ra sau tùy tiện: đại từ ngắn thường nằm trong Mittelfeld. Đưa cả mệnh đề lên Vorfeld có thể đổi trọng tâm nhưng vẫn chỉ chiếm một thành phần: *Warum das wichtig ist, werde ich dir erklären*. Không giữ thêm morgen trước werde như một Vorfeld độc lập thứ hai trong khung thông thường.''',
'Gạch hai đầu khung động từ rồi đặt dấu ngoặc cho cả cụm/mệnh đề. Đừng đếm từng từ. Với cụm nặng, thử Nachfeld để dễ đọc nhưng giữ quan hệ nghĩa và tham chiếu rõ.',
'Mệnh đề dass/ob/từ hỏi sau động từ cuối của câu chính thường là Nachfeld. Cụm so sánh cũng có thể đứng sau khung. Không đồng nhất Nachfeld với mọi chữ xuất hiện sau động từ chia.',
'''- **Ich habe gestern erfahren, dass der Kurs ausfällt.** — Hôm qua tôi được biết khóa học bị hủy. habe…erfahren tạo khung; dass-Satz ở Nachfeld.
- **Dass der Kurs ausfällt, habe ich gestern erfahren.** — Việc khóa học bị hủy, hôm qua tôi mới biết. Cả dass-Satz ở Vorfeld; habe theo ngay sau.
- **Ich habe ihn gestern gesehen.** — Hôm qua tôi thấy anh ấy. ihn ngắn nằm trong Mittelfeld; không chuyển thành *Ich habe gestern gesehen ihn* trong trật tự trung tính.''',
'''1. *Morgen ich werde…* → **Morgen werde ich…**: Vorfeld không chứa thêm chủ ngữ riêng trước động từ.
2. *Ich habe erfahren gestern, dass…* → **Ich habe gestern erfahren, dass…** trong trật tự trung tính đang luyện.
3. Không gọi phần sau động từ chia là Nachfeld nếu chưa xác định phần phải của khung.
4. *Dass er kommt, ich habe gehört* → **Dass er kommt, habe ich gehört** trong câu tích hợp.''',[
'Vorfeld chứa một thành phần, có thể là cả mệnh đề. Động từ chia ở phần trái khung theo ngay sau; không giữ thêm chủ ngữ trước nó.',
'Nachfeld ở sau phần phải khung động từ, thường chứa mệnh đề/cụm dài. Không đồng nhất mọi Mittelfeld sau động từ chia với Nachfeld.',
'Đại từ ngắn thường ở Mittelfeld trong trật tự trung tính. Việc đưa cụm nặng ra sau không cho phép tự do đẩy mọi tân ngữ qua phần cuối khung.',
'Thay vị trí cụm/mệnh đề có thể đổi trọng tâm; cấu trúc câu tích hợp vẫn cần V2 ở câu chính và động từ cuối trong câu phụ.'],'''
Morgen ___ ich dir alles erklären.|werde|ich werde|werden|0
Chọn câu đúng với mệnh đề đầu.|Dass er kommt, habe ich gehört.|Dass er kommt, ich habe gehört.|Dass er kommt, gehört habe ich es dass.|0
Ich habe erfahren, dass er kommt. dass-Satz ở đâu theo mô hình?|Nachfeld.|Vorfeld của câu chính.|Phần trái khung của câu chính.|1
Trong Ich werde dir erklären, warum…, phần phải khung là gì?|erklären|werde|dir|1
Chọn vị trí đại từ trung tính.|Ich habe ihn gestern gesehen.|Ich habe gestern gesehen ihn.|Ich ihn habe gestern gesehen.|2
Vorfeld có thể là một mệnh đề dài không?|Có.|Không, chỉ được một từ.|Chỉ được chủ ngữ.|0
Mọi phần sau động từ chia đều là Nachfeld không?|Không; cần xác định cả khung.|Có, Mittelfeld không tồn tại.|Chỉ khi Perfekt.|1
Warum das wichtig ist, ___ ich dir erklären.|werde|ich werde|erklären werde|3
Chọn câu giữ khung và Nachfeld đúng.|Ich habe gestern erfahren, dass sie umzieht.|Ich habe gestern dass sie umzieht erfahren ich.|Ich habe erfahren ihn gestern das.|3
Đổi mệnh đề sang Vorfeld có thể tác động gì?|Trọng tâm thông tin.|Luôn biến Akkusativ thành Genitiv.|Luôn làm câu thành bị động.|3
''')
