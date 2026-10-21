LESSONS={}
def add(n,scope,mechanism,tips,signs,examples,traps,rules,rows):
    questions=[]
    for row in rows.strip().splitlines():
        q,a,b,c,k=row.split('|');questions.append((q,a,rules[int(k)],b,c))
    LESSONS[f'book-dtd-b1-{n:02}']={'scope':scope,'mechanism':mechanism,'tips':tips,'signs':signs,'examples':examples,'traps':traps,'questions':questions}

add(1,'Danh từ yếu thông thường Student/Junge/Herr; nhóm Name/Herz được tách ở B2-17.',
'''Cách là quan hệ cú pháp; N-Deklination là cách một nhóm danh từ biểu thị quan hệ đó. Với Student, đổi der thành dem chưa đủ: **dem Studenten**. Đuôi danh từ và đuôi mạo từ phối hợp, không thay thế nhau. Tiếng Việt không đổi hình thức “sinh viên” sau “với”; tiếng Đức thay đổi cả mạo từ lẫn danh từ.

Đuôi -(e)n không tự có nghĩa số nhiều. **den Studenten** có thể là Akkusativ số ít hoặc Dativ số nhiều; phải đọc mạo từ, động từ và ngữ cảnh. Nhóm này chủ yếu là danh từ nam chỉ người/động vật, nhưng nghĩa “chỉ người” không đủ để kết luận: der Lehrer không chia như der Student.''',
'Học bộ ba: **der Student – des Studenten – die Studenten**. Ghi riêng Herr: Herrn ở số ít ngoài Nominativ, Herren ở số nhiều. Không học quy tắc “mọi danh từ nam thêm n”.',
'Nhận diện bằng từ điển và hậu tố thường gặp như -ant, -ent, -ist; sau đó kiểm tra cách do động từ/giới từ. dem, einem báo Dativ nhưng không thay bạn quyết định từ có thuộc nhóm yếu hay không.',
'''- **Ich antworte dem Kunden.** — Tôi trả lời khách hàng. antworten đòi Dativ; Kunde → Kunden, dem theo giống nam.
- **Der Journalist interviewt einen Experten.** — Nhà báo phỏng vấn một chuyên gia. Journalist ở Nominativ giữ dạng gốc; Experte là Akkusativ nên thêm -n.
- **Die Meinung des Studenten ist wichtig.** — Ý kiến của người sinh viên quan trọng. des Studenten là Genitiv số ít, không phải một nhóm sinh viên.''',
'''1. *mit dem Student* → **mit dem Studenten**: thiếu đuôi danh từ yếu.
2. *Der Studenten kommt* khi nói một người → **Der Student kommt**: Nominativ số ít không thêm -en.
3. *mit einem Herren* khi nói một quý ông → **mit einem Herrn**: không nhầm dạng số ít với Herren số nhiều.
4. *den Lehreren* → **den Lehrer** khi là Akkusativ số ít: Lehrer không thuộc mô hình Student.''',[
'Cách do động từ/giới từ quyết định; danh từ yếu phải thêm -(e)n ngoài Nominativ số ít. Đổi mạo từ mà giữ dạng gốc là chưa đủ.',
'Nominativ số ít của danh từ yếu giữ dạng từ điển. Không suy số nhiều chỉ từ hậu tố -en; đối chiếu mạo từ và chủ ngữ.',
'Herr có Herrn ở số ít ngoài Nominativ, nhưng Herren ở số nhiều. einem chỉ số ít; den có thể là Dativ số nhiều tùy câu.',
'Không phải mọi danh từ nam đều yếu. Lehrer/Tisch dùng mô hình thường; cần biết nhóm từ trước khi áp đuôi.'],'''
Ich helfe dem ___. (Student)|Studenten|Student|Students|0
Wir sprechen mit einem ___. (Kollege)|Kollegen|Kollege|Kolleges|0
Der ___ wartet draußen. (Kunde)|Kunde|Kunden|Kundes|1
Sie interviewt einen ___. (Journalist)|Journalisten|Journalist|Journalists|0
Ich danke diesem ___. (Herr, số ít)|Herrn|Herren|Herr|2
Ich danke den ___. (Herr, số nhiều)|Herren|Herrn|Herrs|2
Das Büro des ___ ist hier. (Experte)|Experten|Experte|Expertes|0
Ich sehe den ___. (Lehrer, số ít)|Lehrer|Lehrern|Lehreren|3
Chọn Nominativ số ít.|Der Junge spielt.|Der Jungen spielt.|Den Jungen spielt.|1
Wir kennen diesen ___. (Tourist)|Touristen|Tourist|Tourists|0
''')

add(2,'Đại từ quan hệ ở Nominativ/Akkusativ/Dativ; giới từ và Genitiv nâng cao ở B2-04.',
'''Mệnh đề quan hệ nhận diện hoặc bổ sung thông tin cho một danh từ. Đại từ quan hệ có hai nguồn thông tin: **giống/số từ danh từ được bổ nghĩa**, nhưng **cách từ vai trò bên trong mệnh đề quan hệ**. Trong *der Mann, den ich sehe*, Mann giống nam; bên trong câu phụ, ich là người nhìn, den là người được nhìn nên Akkusativ.

Không lấy cách của danh từ ở câu chính áp sang đại từ: **Ich helfe dem Mann, der hier wohnt.** dem Mann là Dativ do helfen, nhưng der là chủ ngữ của wohnt. Tiếng Việt dùng “người mà…” không biến đổi “mà”; tiếng Đức phải phân tích hai mệnh đề độc lập.''',
'Khôi phục câu phụ thành câu riêng: *Ich sehe den Mann* → den. *Der Mann wohnt hier* → der. Làm hai bước “danh từ nào?” rồi “vai trò gì?”, không chọn theo từ đứng ngay trước dấu phẩy.',
'Trong câu phụ, tìm chủ ngữ khác và động từ: nếu đã có ich làm chủ ngữ của sehen, đại từ người được thấy thường là Akkusativ. helfen/danken/gehören có thể buộc Dativ. Động từ chia đứng cuối; dấu phẩy đóng cả hai phía khi chen giữa.',
'''- **Das ist die Frau, der ich geholfen habe.** — Đây là người phụ nữ tôi đã giúp. Frau giống cái; helfen đòi Dativ → der; Perfekt kết thúc bằng geholfen habe.
- **Die Kinder, die im Garten spielen, sind meine Nachbarn.** — Những đứa trẻ chơi trong vườn là hàng xóm tôi. die làm chủ ngữ số nhiều → spielen.
- **Ich kaufe das Buch, das du empfohlen hast.** — Tôi mua cuốn sách bạn giới thiệu. das là Akkusativ trung; hast theo du, không theo Buch.''',
'''1. *der Mann, dem ich sehe* → **den ich sehe**: sehen đòi Akkusativ.
2. *die Frau, die ich helfe* → **der ich helfe**: helfen đòi Dativ.
3. *die Kinder, den ich danke* → **denen ich danke**: Dativ số nhiều có dạng riêng denen.
4. *…, der wohnt hier* → **…, der hier wohnt** trong mệnh đề quan hệ đang học: động từ cuối.''',[
'Giống/số theo danh từ được bổ nghĩa; cách theo chức năng trong mệnh đề quan hệ. Là chủ ngữ thì dùng Nominativ, dù danh từ câu chính ở cách khác.',
'sehen/kennen/besuchen nhận Akkusativ. Khi ich/du đã là chủ ngữ, đại từ chỉ đối tượng phải ở Akkusativ thích hợp.',
'helfen/danken nhận Dativ. Dativ số nhiều của đại từ quan hệ là denen, không phải den như mạo từ.',
'Mệnh đề quan hệ là câu phụ: động từ chia đứng cuối; chen giữa câu chính cần hai dấu phẩy.'],'''
Der Mann, ___ hier wohnt, ist Arzt.|der|den|dem|0
Die Frau, ___ ich besuche, ist krank.|die|der|denen|1
Das ist der Kollege, ___ ich helfe.|dem|den|der|2
Die Kinder, ___ ich danke, lächeln.|denen|den|die|2
Ich helfe dem Mann, ___ nebenan wohnt.|der|dem|den|0
Das Buch, ___ du liest, gehört mir.|das|dem|der|1
Die Frau, ___ mir hilft, heißt Mai.|die|der|denen|0
Der Film, ___ wir gestern gesehen haben, war lang.|den|der|dem|1
Chọn trật tự đúng.|Das ist der Mann, der hier arbeitet.|Das ist der Mann, der arbeitet hier.|Das ist der Mann der hier arbeitet.|3
Die Kolleginnen, ___ du kennst, kommen später.|die|denen|der|1
''')

add(3,'Liên từ đôi nối các thành phần song song; tương quan mức độ je…desto học ở B2-02.',
'''Liên từ đôi tổ chức quan hệ giữa hai ý: thêm cả hai, loại cả hai, chọn một hoặc thừa nhận rồi đối lập. Quan hệ nghĩa phải được chọn trước hình thức. **weder…noch** phủ định cả hai; **entweder…oder** nêu phương án lựa chọn, không phải cộng gộp.

Hai vế cần cùng tầng cú pháp: danh từ với danh từ, cụm giới từ với cụm giới từ, hoặc hai mệnh đề đầy đủ. *sowohl mit dem Zug als auch mit dem Bus* rõ hơn một cấu trúc đặt sowohl trước động từ nhưng als auch trước một danh từ không tương ứng. Chúng không tự biến mọi vế thành câu phụ.''',
'Gạch ngoặc hai phần được nối: *[Deutsch] und [Englisch]*; *[mit dem Bus] als auch [mit dem Zug]*. Giữ cùng kiểu cấu trúc để tránh lỗi song song.',
'Sowohl chờ als auch; weder chờ noch; zwar chờ nhưng không nhất thiết đứng sát aber. Với hai câu chính đầy đủ, từng câu vẫn giữ động từ vị trí hai; không kéo động từ cuối chỉ vì có cặp nối.',
'''- **Sie spricht sowohl Deutsch als auch Englisch.** — Cô ấy nói được cả Đức và Anh. Hai tân ngữ được cộng gộp.
- **Ich trinke weder Kaffee noch Tee.** — Tôi không uống cà phê cũng không uống trà. weder đã mang phủ định; không thêm nicht chỉ để “đủ phủ định”.
- **Der Kurs ist zwar teuer, aber sehr hilfreich.** — Khóa học tuy đắt nhưng rất hữu ích. zwar thừa nhận giá cao, aber chuyển trọng tâm sang ích lợi.''',
'''1. *sowohl Deutsch und Englisch* → **sowohl Deutsch als auch Englisch**: sai cặp.
2. *weder nicht Kaffee noch Tee* → **weder Kaffee noch Tee** theo nghĩa phủ định cả hai; không phủ định chồng vô cớ.
3. *Zwar der Kurs ist teuer…* → **Zwar ist der Kurs teuer…** nếu zwar đứng ở vị trí đầu câu chính.
4. *nicht nur lernt sie, sondern auch sie arbeitet* → **Sie lernt nicht nur, sondern arbeitet auch.** Giữ song song và trật tự mệnh đề.''',[
'sowohl…als auch cộng cả hai thành phần. Chọn đúng nửa còn lại; weder phủ định, entweder lựa chọn nên không giữ nghĩa “cả hai”.',
'weder…noch phủ định cả hai; không cần thêm nicht để tạo cùng nghĩa. noch là nửa thứ hai, không dùng oder/aber thay nó.',
'entweder…oder nêu lựa chọn; zwar…aber thừa nhận rồi đối lập. Phải xét nghĩa câu, không chỉ ghép từ nhìn giống nhau.',
'zwar ở đầu câu chính chiếm Vorfeld nên động từ theo ngay sau. Liên từ đôi không yêu cầu khung động từ cuối của câu phụ.'],'''
Sie spricht sowohl Deutsch ___ auch Englisch.|als|und|oder|0
Ich trinke weder Kaffee ___ Tee.|noch|oder|aber|1
Entweder wir fahren heute, ___ wir bleiben bis Montag.|oder|noch|als auch|2
Der Weg ist zwar lang, ___ schön.|aber|noch|oder|2
Chọn cách phủ định cả hai thức uống.|Ich trinke weder Kaffee noch Tee.|Ich trinke sowohl Kaffee als auch Tee.|Ich trinke entweder Kaffee oder Tee.|1
Chọn khung câu chính đúng.|Zwar ist der Kurs teuer, aber er hilft mir.|Zwar der Kurs ist teuer, aber er hilft mir.|Zwar der Kurs teuer ist, aber er hilft mir.|3
Sie lernt nicht nur Deutsch, ___ auch Französisch.|sondern|aber|noch|0
Chọn hai cụm song song.|sowohl mit dem Bus als auch mit dem Zug|sowohl mit dem Bus als auch der Zug|sowohl der Bus als auch mit dem Zug|0
Điền nghĩa “không cả…lẫn…”: ___ Paul noch Anna kommt mit.|Weder|Sowohl|Entweder|1
Chọn nghĩa của zwar…aber.|Thừa nhận một ý rồi nêu ý đối lập.|Loại bỏ cả hai lựa chọn.|Nêu hai việc bắt buộc xảy ra cùng lúc.|2
''')

add(4,'Hỏi và thay thế bổ ngữ giới từ bằng wo(r)-/da(r)-; danh sách động từ/tính từ tách ở B1-15/16.',
'''Giới từ thuộc cấu trúc của từ gốc: *warten auf, denken an, zufrieden mit*. Khi hỏi hoặc thay thế, giữ giới từ đó. **Worauf wartest du? – Auf den Bus. – Ich warte darauf.** Không chọn womit chỉ vì tiếng Việt đều dịch “về/cái gì”.

Với sự vật, sự việc hoặc mệnh đề, dùng wo-/da- ghép giới từ; trước nguyên âm có r: *woran, daran*. Với người, dùng giới từ + đại từ hỏi/nhân xưng: *auf wen, auf ihn*. *darauf* còn có thể báo trước một mệnh đề nội dung; nó không tự thay cho chủ ngữ của mệnh đề đó.''',
'Viết cụm từ gốc trước: *sich freuen auf + Akkusativ* → *worauf/darauf* khi nói việc, *auf wen/auf ihn* khi nói người. Đừng học wo-/da- tách khỏi giới từ.',
'Nội dung sau dấu phẩy với dass thường cần một “cầu nối” như darauf/darüber theo từ gốc. Không phải mọi động từ có dass đều cần da-: *Ich weiß, dass…* không tự thêm darüber.',
'''- **Mit wem sprichst du? – Mit meiner Lehrerin.** — Bạn nói với ai? — Với cô giáo tôi. mit → Dativ nên wem, không wen.
- **Worüber ärgerst du dich? – Über die Verspätung.** — Bạn bực vì điều gì? — Vì sự chậm trễ. ärgern über giữ über → worüber.
- **Ich freue mich darauf, dich wiederzusehen.** — Tôi mong được gặp lại bạn. darauf báo trước cụm nguyên mẫu; người gặp là ich như chủ ngữ câu chính.''',
'''1. *Womit wartest du?* theo nghĩa chờ cái gì → **Worauf wartest du?**: warten auf.
2. *Ich warte darauf* khi rõ đang chờ một người → **Ich warte auf ihn/sie.** Không dùng da- làm lựa chọn thông thường thay người.
3. *mit wen* → **mit wem**: mit chi phối Dativ.
4. *woan/daan* → **woran/daran**: thêm r trước nguyên âm.''',[
'Giữ giới từ của từ gốc. warten auf → worauf/darauf; denken an → woran/daran. Không đổi giới từ theo bản dịch tiếng Việt.',
'Hỏi người dùng giới từ + wen/wem theo cách. mit dùng Dativ → wem; auf trong warten auf dùng Akkusativ → wen.',
'Sự vật/sự việc dùng wo-/da-. Trước nguyên âm thêm r: woran, daran, worüber, darüber; không viết woan/daüber.',
'da- có thể báo trước mệnh đề hoặc nguyên mẫu nhưng phải do cấu trúc từ gốc cho phép. Câu phụ dass vẫn có động từ chia cuối.'],'''
___ wartest du? – Auf den Bus.|Worauf|Womit|Woran|0
___ denkst du? – An meine Prüfung.|Woran|Worauf|Womit|0
Mit ___ sprichst du? – Mit meiner Ärztin.|wem|wen|wer|1
Auf ___ wartest du? – Auf meinen Bruder.|wen|wem|wer|1
Ich habe einen neuen Plan. Was hältst du ___? (von)|davon|daran|damit|2
Ich freue mich ___, dass du morgen kommst. (über)|darüber|darauf|damit|3
Chọn hỏi về người sau mit.|Mit wem arbeitest du?|Womit arbeitest du?|Mit wen arbeitest du?|1
Wofür interessierst du dich? – Für Kunst. Ich interessiere mich ___.|dafür|darauf|daran|2
Chọn dạng ghép đúng của da + an.|daran|daan|dan|2
Chọn câu có mệnh đề nội dung đúng.|Ich warte darauf, dass du antwortest.|Ich warte damit, dass du antwortest.|Ich warte darauf, dass du antwortest du.|3
''')

add(5,'Konjunktiv II hiện tại, mong muốn, lời khuyên và lịch sự; quá khứ giả định dành cho B2-01.',
'''Konjunktiv II tạo khoảng cách với thực tế hoặc với yêu cầu trực tiếp. **Wenn ich Zeit hätte, würde ich mitkommen** không xác nhận tôi có thời gian; đó là điều kiện giả định. **Könnten Sie mir helfen?** không nhất thiết hỏi khả năng thể chất: dạng giả định làm lời nhờ bớt áp đặt.

Chọn **hätte, wäre, könnte, müsste, sollte** hoặc **würde + nguyên mẫu** theo động từ và ý nghĩa. Không thêm würde trước một động từ đã chia Konjunktiv II. Thời gian do ngữ cảnh xác định; bài này tập trung hiện tại/tương lai chưa thực, không dùng hätte + Partizip II để kể quá khứ.''',
'Ưu tiên dạng ngắn thông dụng của sein/haben/modal: wäre, hätte, könnte. Với nhiều động từ khác dùng würde + nguyên mẫu. Kiểm tra “mỗi mệnh đề một động từ chia”.',
'wenn có thể đi với Indikativ hoặc Konjunktiv II: *Wenn ich Zeit habe* là điều kiện được xem có thể thực; *wenn ich Zeit hätte* tạo khoảng cách giả định. Đừng coi mọi wenn là giả định trái thực.',
'''- **An deiner Stelle würde ich früher schlafen gehen.** — Nếu là bạn, tôi sẽ đi ngủ sớm hơn. würde chia theo ich; schlafen gehen vẫn nguyên mẫu.
- **Wenn der Kurs günstiger wäre, könnte ich teilnehmen.** — Nếu khóa học rẻ hơn, tôi có thể tham gia. wäre nói trạng thái; könnte nói khả năng.
- **Ich hätte gern einen Kaffee.** — Tôi muốn một cà phê. hätte gern là yêu cầu lịch sự, không phải “tôi đã có một cà phê”.''',
'''1. *Ich würde hätte Zeit* → **Ich hätte Zeit**: không chia hai lần.
2. *Wenn ich Zeit hätte, ich würde kommen* → **…, würde ich kommen**: câu phụ chiếm vị trí đầu.
3. *Du müsstest ihn anrufen* và **Du solltest ihn anrufen** không hoàn toàn như nhau: một bên thiên về cần/phải, bên kia lời khuyên.
4. *Ich wäre mehr Geld* → **Ich hätte mehr Geld**: có tiền dùng haben, không sein.''',[
'haben → hätte theo ngôi; sein → wäre. Chọn theo động từ gốc: có tiền/thời gian là haben; trạng thái/tính chất là sein.',
'würde là động từ chia; động từ chính ở nguyên mẫu. Không dùng würde + hätte/könnte hoặc dạng chia hiện tại.',
'Câu phụ wenn đưa động từ chia cuối; nếu đứng đầu, câu chính bắt đầu bằng động từ chia rồi chủ ngữ.',
'könnte nêu khả năng/lời nhờ lịch sự; sollte là lời khuyên. Chọn theo chức năng giao tiếp đã nêu, không chỉ hình thức.'],'''
Wenn ich mehr Zeit ___, würde ich öfter kochen.|hätte|wäre|würde|0
Wenn das Zimmer größer ___, wäre es ideal.|wäre|hätte|würde|0
Ich würde gern nach Berlin ___.|fahren|fahre|gefahren|1
Chọn câu đúng.|Ich hätte gern mehr Zeit.|Ich würde hätte gern mehr Zeit.|Ich wäre gern mehr Zeit.|0
Nếu là bạn: An deiner Stelle ___ ich mehr üben.|würde|werde|wäre|1
Lời nhờ lịch sự: ___ Sie das bitte wiederholen?|Könnten|Könntest|Wären|3
Wenn ich frei hätte, ___ ich mitkommen.|würde|ich würde|würde ich|2
Chọn lời khuyên với sollte.|Du solltest früher ins Bett gehen.|Du solltest früher ins Bett gehst.|Du würde früher ins Bett gehen.|3
Wir ___ gern ein ruhigeres Zimmer. (haben, Konjunktiv II)|hätten|hätte|wären|0
Chọn câu phụ đúng.|Wenn du näher wohnen würdest, könnten wir uns öfter sehen.|Wenn du würdest näher wohnen, könnten wir uns öfter sehen.|Wenn du näher wohnst würdest, könnten wir uns öfter sehen.|2
''')

add(6,'Các cách dùng lassen, brauchen và werden; không học lại toàn bộ bị động hay tương lai.',
'''Cùng một động từ có thể nhận các cấu trúc khác nghĩa. **lassen + người/vật + nguyên mẫu** nói để/nhờ/cho phép: *Ich lasse den Techniker den Drucker prüfen*. **sich lassen + nguyên mẫu** nói khả năng: *Der Drucker lässt sich reparieren*. Đừng nhầm người sắp xếp với đối tượng được sửa.

**brauchen** là động từ thường trong *Ich brauche Hilfe*. Khi mang nghĩa “cần phải” ở mẫu phủ định/hạn định, dùng *nicht/nur + zu + nguyên mẫu* trong văn viết chuẩn đang luyện. **werden + tính từ/danh từ** là thay đổi trạng thái: *Er wird müde/Arzt*; không phải bị động nếu không có Partizip II.''',
'Đọc phần sau động từ: lassen + nguyên mẫu; brauchen + danh từ hoặc không cần phải + zu; werden + tính từ, nguyên mẫu hay Partizip II tạo ba cách hiểu khác nhau.',
'nicht/nur/kaum thường xuất hiện với brauchen theo nghĩa modal. *werden müde* không có hành động tác động lên người; *werden geprüft* có Partizip II và nghĩa bị động.',
'''- **Du brauchst heute nicht zu kommen.** — Hôm nay bạn không cần đến. Không đồng nghĩa với cấm đến như dürfen nicht.
- **Ich lasse meine Haare schneiden.** — Tôi đi cắt tóc/nhờ cắt tóc. Tôi là người sắp xếp, không nhất thiết tự cắt.
- **Es wird dunkel.** — Trời tối dần. dunkel là tính từ vị ngữ, không có nguyên mẫu hay Partizip II.''',
'''1. *Ich lasse das Auto zu reparieren* → **reparieren**: lassen không zu.
2. *Du brauchst nicht kommen* → **nicht zu kommen** trong chuẩn viết luyện ở đây; dạng không zu có trong khẩu ngữ, không gọi mọi cách dùng đó là vô nghĩa.
3. *nicht brauchen = nicht dürfen* là sai về nghĩa: không cần ≠ không được.
4. *Er wird müde werden* không cần nếu chỉ muốn nói hiện tại “anh ấy mệt dần”: **Er wird müde.**''',[
'lassen nhận nguyên mẫu không zu; chủ ngữ có thể sắp xếp hoặc cho phép người khác thực hiện hành động.',
'brauchen theo nghĩa không cần phải: nicht + zu + nguyên mẫu trong chuẩn viết. Không đồng nghĩa với nicht dürfen, là cấm.',
'werden + tính từ/danh từ diễn tả trở nên. werden + nguyên mẫu là Futur; werden + Partizip II là một khung bị động.',
'sich lassen nói khả năng của đối tượng; phải chia lassen theo chủ ngữ. Số nhiều die Türen → lassen sich.'],'''
Ich lasse mein Fahrrad ___. (reparieren)|reparieren|zu reparieren|repariert|0
Du brauchst heute nicht ___ kommen.|zu|um|dass|1
Es ___ langsam dunkel.|wird|hat|ist geworden wird|2
Die Türen ___ sich leicht öffnen.|lassen|lässt|lasst sich|3
Chọn nghĩa Du brauchst nicht zu warten.|Bạn không cần đợi.|Bạn bị cấm đợi.|Bạn đã đợi xong.|1
Ich ___ einen neuen Computer. (cần một vật)|brauche|brauche zu|lasse zu|1
Chọn câu nghĩa nhờ cắt tóc.|Ich lasse mir die Haare schneiden.|Ich lasse mir die Haare zu schneiden.|Ich werde mir die Haare geschnitten.|0
Er wird Arzt. werden ở đây có nghĩa gì?|Trở thành.|Được tác động trong bị động.|Đã hoàn tất trong quá khứ.|2
Chọn câu đúng trong chuẩn viết luyện tập.|Sie braucht nur anzurufen.|Sie braucht nur zu anrufen.|Sie braucht nur anrufen zu.|1
Das Problem ___ sich lösen. (số ít)|lässt|lassen|lasst|3
''')

add(7,'Mittelfeld, vị trí đại từ và phủ định; Vorfeld/Nachfeld phức tạp dành cho B2-22.',
'''“Động từ đứng thứ hai” là vị trí thành phần, không phải từ thứ hai trên giấy. **Am frühen Montagmorgen beginnt der Kurs** có cả cụm thời gian trước beginnt. Trong thì ghép, động từ chia và phần không chia tạo khung bao quanh phần giữa câu.

Trật tự trong Mittelfeld chịu ảnh hưởng bởi thông tin đã biết/mới, đại từ/danh từ và trọng tâm. TeKaMoLo là định hướng trung tính cho trạng ngữ thời gian–nguyên nhân–cách thức–nơi chốn, không phải luật buộc mọi câu. Vị trí *nicht* phụ thuộc cái bị phủ định: **nicht heute** khác **heute nicht** về trọng tâm.''',
'Xác định khung động từ trước, rồi mới xếp các cụm. Đặt dấu ngoặc quanh cụm đầu để không đếm từ. Với nicht, nói rõ muốn phủ định thời gian, địa điểm hay cả sự việc.',
'Đại từ ngắn thường đứng sớm trong Mittelfeld. Cụm đã biết có xu hướng trước cụm mới. *nur, auch, nicht* đặt gần thành phần được nhấn hoặc phủ định; thay vị trí có thể đổi nghĩa.',
'''- **Heute habe ich den Bericht im Büro geschrieben.** — Hôm nay tôi viết báo cáo ở văn phòng. habe/geschrieben tạo khung; Heute là Vorfeld.
- **Ich fahre nicht heute, sondern morgen.** — Tôi không đi hôm nay mà ngày mai. nicht phủ định riêng heute.
- **Ich habe ihn gestern nicht gesehen.** — Hôm qua tôi không thấy anh ấy. ihn là đại từ đối tượng đứng sớm; gesehen nằm cuối khung.''',
'''1. *Heute ich lerne* → **Heute lerne ich**: thành phần đầu không cho phép giữ tiếp chủ ngữ trước động từ.
2. *Ich habe gesehen ihn* → **Ich habe ihn gesehen**: đối tượng ở giữa khung.
3. *nicht heute* và *heute nicht* không phải lúc nào cũng thay nhau được: phải giữ trọng tâm phủ định.
4. Không đánh sai mọi câu khác TeKaMoLo: trật tự có thể đổi vì trọng tâm thông tin.''',[
'Vorfeld chứa một thành phần; động từ chia theo ngay sau. Thành phần có thể nhiều từ, không đếm vị trí theo từng từ.',
'Trong thì ghép, phần không chia như Partizip II/nguyên mẫu kết thúc khung; đại từ và trạng ngữ thường ở Mittelfeld.',
'nicht đứng trước thành phần bị phủ định đối lập. nicht heute, sondern morgen phủ định thời gian, không khẳng định cả hành động bị hủy.',
'Trật tự trung tính chỉ là định hướng; đại từ/thông tin đã biết thường sớm. Không dùng TeKaMoLo để phủ nhận mọi biến thể có ngữ cảnh.'],'''
Heute ___ ich zu Hause. (arbeiten, Präsens)|arbeite|ich arbeite|arbeiten|0
Chọn khung Perfekt đúng.|Ich habe ihn gestern gesehen.|Ich habe gesehen ihn gestern.|Ich ihn habe gestern gesehen.|1
Không hôm nay mà ngày mai: Ich fahre ___, sondern morgen.|nicht heute|heute nicht morgen|nicht|2
Chọn thành phần Vorfeld trong Am Montag um acht beginnt der Kurs.|Am Montag um acht|Am|der Kurs|0
Ich möchte morgen nach Berlin ___.|fahren|fahre|gefahren|1
Chọn câu đúng với động từ tách.|Morgen stehe ich früh auf.|Morgen ich stehe früh auf.|Morgen stehe auf ich früh.|0
Chọn câu phụ đúng.|Weil ich ihn nicht kenne, frage ich nach.|Weil ich kenne ihn nicht, frage ich nach.|Weil ich ihn nicht kenne, ich frage nach.|1
Ich habe ___ gestern nicht gesehen. (er ở Akkusativ)|ihn|er|ihm|3
TeKaMoLo nên được hiểu thế nào?|Định hướng trật tự trung tính, có biến thể theo trọng tâm.|Luật cấm mọi trật tự khác.|Quy tắc chỉ chia động từ.|3
Chọn câu phủ định địa điểm: không ở Berlin mà ở Bonn.|Er wohnt nicht in Berlin, sondern in Bonn.|Er wohnt in Berlin, sondern nicht in Bonn.|Er nicht wohnt in Berlin, sondern in Bonn.|2
''')
add(8,'wissen/kennen và lernen/studieren theo nghĩa và kiểu bổ ngữ; không gom các cặp từ khác vào bài.',
'''Không chọn động từ bằng bản dịch chung “biết/học”. **wissen** nói nội dung tri thức: một sự thật, câu trả lời, thời điểm; **kennen** nói quen biết hoặc nhận diện người, nơi, tác phẩm. *Ich weiß, wo sie wohnt* khác *Ich kenne ihre Adresse*: một bên là mệnh đề nội dung, bên kia là cụm danh từ.

**lernen** là quá trình học kỹ năng/kiến thức; **studieren** thường là học một ngành ở đại học, hoặc nghiên cứu kỹ một đối tượng tùy ngữ cảnh. *Deutsch lernen* là học ngôn ngữ; *Germanistik studieren* là học ngành Đức ngữ. Không đồng nhất studieren với mọi hoạt động học trong ngày.''',
'Thử thay phần sau bằng một câu có dass/wo/wann: nội dung biết thường dùng wissen. Với người quen hoặc nơi đã biết, nghĩ đến kennen. Với học, hỏi “luyện kỹ năng hay theo học ngành?”.',
'wissen thường gặp với dass, ob, từ hỏi gián tiếp và các từ như Antwort. kennen thường nhận Akkusativ người/vật. studieren đi với ngành như Medizin; lernen đi với kỹ năng như schwimmen hoặc ngôn ngữ.',
'''- **Ich kenne die Stadt, aber ich weiß nicht, wo das Rathaus ist.** — Tôi biết thành phố nhưng không biết tòa thị chính ở đâu. kenne nhận danh từ; weiß nhận mệnh đề hỏi gián tiếp.
- **Sie studiert Medizin und lernt nebenbei Deutsch.** — Cô ấy học ngành y và học thêm tiếng Đức. Hai hoạt động khác phạm vi.
- **Ich habe gelernt, ruhig zu bleiben.** — Tôi đã học được cách giữ bình tĩnh. lernen nhận cụm nguyên mẫu, không phải đang học một ngành đại học.''',
'''1. *Ich kenne, dass er kommt* → **Ich weiß, dass er kommt**: wissen nhận nội dung mệnh đề.
2. *Ich weiß ihn gut* → **Ich kenne ihn gut**: quen biết người dùng kennen.
3. Không sửa mọi *ein Dokument studieren* thành lernen: studieren còn có nghĩa nghiên cứu kỹ tài liệu.
4. *ich wisst* → **ich weiß**: wissen là động từ biến đổi bất quy tắc.''',[
'wissen biểu thị nội dung tri thức và có thể nhận mệnh đề dass/từ hỏi. kennen nhận đối tượng quen biết, không dùng trực tiếp với dass theo khung này.',
'kennen dùng với người/nơi/tác phẩm được nhận biết. Đối tượng là Akkusativ; không đổi sang wissen chỉ vì tiếng Việt đều là biết.',
'lernen là học kiến thức/kỹ năng; studieren thường là theo học ngành ở đại học. Chọn theo ngữ cảnh nêu rõ, không theo độ khó môn học.',
'wissen chia ich/er weiß, du weißt, wir wissen, ihr wisst. Dạng động từ phải phù hợp chủ ngữ.'],'''
Ich ___ nicht, ob er morgen kommt.|weiß|kenne|lerne|0
___ du diese Frau persönlich?|Kennst|Weißt|Studierst|1
Sie ___ Medizin an der Universität.|studiert|kennt|weiß|2
Ich ___ gerade schwimmen.|lerne|studiere|weiß|2
Du ___ doch, wo der Bahnhof ist.|weißt|weiß|wisst|3
Wir ___ die Antwort noch nicht.|wissen|kennt|weiß|0
Ich ___ Berlin gut; ich habe dort gewohnt.|kenne|weiß|lerne|1
Chọn nghĩa Germanistik studieren.|Theo học ngành Đức ngữ.|Chỉ học một từ tiếng Đức.|Quen biết một người Đức.|2
Ihr ___ mehr als ich.|wisst|weiß|weißt|3
Chọn câu đúng.|Ich weiß, dass sie kommt.|Ich kenne, dass sie kommt.|Ich weiß sie persönlich.|0
''')

add(9,'bringen/holen theo hướng di chuyển; leihen/ausleihen theo vai người cho và người mượn.',
'''**bringen** nhìn việc đưa vật/người tới một điểm đích. **holen** bao gồm đi tới nơi có đối tượng để lấy/đón; thường có bước quay lại theo ngữ cảnh. *Bring bitte Wasser mit* nhờ mang nước tới; *Hol bitte Wasser aus der Küche* nhờ đi lấy từ bếp. Không phải cứ dịch “lấy” là dùng cùng một động từ.

**leihen** có thể nói người cho mượn (*jemandem etwas leihen*) hoặc người mượn với cấu trúc thích hợp (*sich etwas von jemandem leihen*). **ausleihen** cũng có cả hai hướng nghĩa. Phải tìm Dativ chỉ người nhận, von chỉ nguồn và vật Akkusativ; không học leihen = cho mượn, ausleihen = mượn như một cặp tuyệt đối.''',
'Vẽ mũi tên nơi vật đang ở → nơi người nói muốn nó tới. Với vay mượn, ghi cả người cho, người nhận và vật; sau đó đọc từ Dativ/von để xác định vai.',
'aus der Küche/bibliothek gợi nơi đi lấy; zu mir/nach Hause chỉ đích mang tới. Trong vay mượn, *dir* và *mir* đổi vai; từ gốc không tự quyết định ai là người sở hữu.',
'''- **Kannst du mich vom Bahnhof abholen?** — Bạn đón tôi ở ga được không? abholen nhấn đi đón từ một điểm.
- **Ich leihe dir mein Fahrrad.** — Tôi cho bạn mượn xe đạp. dir là người nhận Dativ; mein Fahrrad là vật Akkusativ.
- **Ich leihe mir ein Buch von Anna.** — Tôi mượn một cuốn sách của Anna. mir là người nhận; von Anna chỉ nguồn cho mượn.''',
'''1. *Ich leihe dich mein Buch* → **Ich leihe dir mein Buch**: người nhận ở Dativ.
2. *Ich leihe mir Anna ein Buch* → **Ich leihe mir ein Buch von Anna** nếu Anna là nguồn cho mượn.
3. Không kết luận ausleihen luôn có nghĩa mượn về: *Die Bibliothek leiht Bücher aus* là thư viện cho mượn.
4. *Ich habe das Buch ausleihen* → **ausgeliehen** trong Perfekt thông thường, không có modal.''',[
'bringen nhấn đưa tới đích; holen nhấn đi lấy/đón từ nơi có đối tượng. Chọn theo tình huống chỉ rõ, không theo một từ dịch tiếng Việt.',
'jemandem etwas leihen: người nhận Dativ, vật Akkusativ. leihen không mặc định chỉ một chiều nghĩa khi thay cấu trúc.',
'sich etwas von jemandem leihen: người mượn nhận vật về; von + Dativ chỉ nguồn. ausleihen cũng có thể dùng cho bên cho mượn.',
'bringen → brachte/gebracht; holen → holte/geholt; leihen → lieh/geliehen; ausleihen → lieh aus/ausgeliehen.'],'''
Nhờ đi lấy từ bếp: ___ bitte Wasser aus der Küche.|Hol|Weiß|Leih|0
Nhờ mang tới đây: ___ mir bitte die Unterlagen mit.|Bring|Lerne|Leihe aus|0
Ich leihe ___ mein Fahrrad. (du)|dir|dich|du|1
Ich leihe mir ein Buch ___ Anna.|von|für|durch|2
Die Bibliothek leiht Bücher aus. Ai cho mượn?|Thư viện.|Người đọc bắt buộc là chủ ngữ.|Không thể xác định vì ausleihen chỉ nghĩa mượn về.|2
Ich habe die Kinder vom Bahnhof ___. (abholen)|abgeholt|abgeholen|geabholt|3
Sie hat mir das Buch ___. (leihen)|geliehen|geleihen|geleihte|3
Chọn câu người nói mượn sách của Paul.|Ich leihe mir ein Buch von Paul.|Ich leihe Paul mein Buch.|Ich leihe dich mein Buch.|2
Er hat mir die Tasche ___. (bringen)|gebracht|gebringt|bringen|3
Ich habe einen Roman ___. (ausleihen)|ausgeliehen|geausliehen|ausgeleihen|3
''')

add(10,'als/wenn trong thời gian; seit/vor theo quan hệ với hiện tại. Không lặp toàn bộ bảng câu phụ.',
'''Chọn **als/wenn** theo khung thời gian, không theo một từ “khi”. *Als ich Student war* là một giai đoạn quá khứ đã kết thúc dù kéo dài nhiều năm. *Immer wenn ich frei hatte* là những lần lặp lại trong quá khứ. wenn còn dùng cho điều kiện; nghĩa đó cần ngữ cảnh.

**seit + Dativ** thường nối điểm bắt đầu/độ dài tới mốc đang xét: *Ich wohne seit zwei Jahren hier* vẫn đang sống ở đây. **vor + Dativ** trong thời gian lùi từ mốc: *Ich bin vor zwei Jahren umgezogen* nói việc chuyển nhà xảy ra hai năm trước. Không dùng cùng một thì chỉ vì hai cụm đều có “hai năm”.''',
'Vẽ trục: seit là đoạn kéo tới hiện tại; vor là điểm lùi về trước. Với als/wenn, hỏi “một giai đoạn/lần quá khứ hay nhiều lần/điều kiện?”.',
'immer/jedes Mal hỗ trợ wenn lặp lại. Seit wann? hỏi điểm bắt đầu; wie lange? có thể hỏi độ dài với seit. Một Ereignis hoàn tất như Umzug thường được kể với vor + Perfekt/Präteritum.',
'''- **Als ich in Hue lebte, besuchte ich oft meine Großeltern.** — Khi sống ở Huế, tôi thường thăm ông bà. als giới thiệu giai đoạn; oft nằm bên trong giai đoạn đó, không tự buộc đổi als thành wenn.
- **Immer wenn ich sie besuchte, kochte sie Suppe.** — Mỗi lần tôi thăm bà, bà đều nấu súp.
- **Ich lerne seit einem Jahr Deutsch; angefangen habe ich vor einem Jahr.** — Tôi học tiếng Đức được một năm; tôi bắt đầu một năm trước. seit nói quá trình còn tiếp diễn, vor nói thời điểm bắt đầu.''',
'''1. *Seit zwei Jahren bin ich umgezogen* → **Vor zwei Jahren bin ich umgezogen** khi chỉ nói sự kiện chuyển nhà.
2. *Ich wohne vor zwei Jahren hier* → **Ich wohne seit zwei Jahren hier** khi vẫn sống ở đây.
3. *Als ich morgen Zeit habe…* → **Wenn ich morgen Zeit habe…**: als không mở điều kiện tương lai này.
4. *seit ein Jahr* → **seit einem Jahr**: Dativ.''',[
'als dùng cho một lần/giai đoạn quá khứ đã khép lại; wenn cho lặp lại hoặc điều kiện. Độ dài giai đoạn không quyết định chọn wenn.',
'seit + Dativ nói quá trình/trạng thái kéo từ mốc bắt đầu tới hiện tại đang xét; nếu còn tiếp diễn, Präsens thường phù hợp.',
'vor + Dativ xác định một điểm trước mốc hiện tại; với sự kiện hoàn tất, thường dùng Perfekt/Präteritum.',
'Cả seit và vor ở nghĩa thời gian đang học đòi Dativ: einem Jahr, zwei Jahren. Không áp quy tắc vị trí Akkusativ của vor vào cụm thời gian.'],'''
___ ich klein war, wohnte ich in Hue.|Als|Wenn|Wann|0
Immer ___ ich frei hatte, ging ich schwimmen.|wenn|als|wann|0
Tôi vẫn học: Ich lerne ___ einem Jahr Deutsch.|seit|vor|für|1
Tôi chuyển nhà hai năm trước: Ich bin ___ zwei Jahren umgezogen.|vor|seit|ab|2
seit ___ Monat (ein)|einem|einen|ein|3
vor zwei ___ (Jahr)|Jahren|Jahre|Jahres|3
___ du morgen Zeit hast, ruf mich an.|Wenn|Als|Wann|0
Chọn câu nêu trạng thái còn tiếp diễn.|Ich wohne seit 2024 hier.|Ich wohne vor 2024 hier.|Ich bin seit gestern einmal umgezogen.|1
Chọn hỏi điểm bắt đầu.|Seit wann arbeitest du hier?|Vor wann arbeitest du hier?|Als wann arbeitest du hier?|1
Chọn câu kể sự kiện đã hoàn tất.|Vor einer Stunde habe ich ihn angerufen.|Vor einer Stunde habe ich ihn angeruft.|Vor einer Stunde ich habe ihn angerufen.|2
''')

add(11,'Các cặp tư thế/vị trí và đặt vật: liegen/legen, stehen/stellen, sitzen/setzen.',
'''**liegen/stehen/sitzen** mô tả vị trí hoặc tư thế đang có. **legen/stellen/setzen** mô tả làm cho người/vật tới một vị trí/tư thế, thường có tân ngữ Akkusativ. Tiếng Việt dùng “để/đặt/ngồi” linh hoạt hơn, nên phải xác định câu đang nói trạng thái hay hành động bố trí.

Với giới từ hai cách ở nghĩa không gian, **Dativ** biểu thị vị trí trong một vùng; **Akkusativ** biểu thị đích hướng vào vùng đó. Không dùng mẹo “có chuyển động là Akkusativ”: *Ich laufe im Park* có chuyển động nhưng vẫn ở trong công viên. Cặp động từ hỗ trợ hiểu nghĩa, còn cách do cả quan hệ không gian quyết định.''',
'Đặt câu hỏi hai tầng: vật đang ở đâu/tư thế nào hay ai đặt vật tới đâu? Phân biệt *ich sitze* với *ich setze mich*: ngồi sẵn và ngồi xuống.',
'Dạng không cần đối tượng là dấu hiệu vị trí: *Das Buch liegt…*. Dạng có người tác động và vật được đặt: *Ich lege das Buch…*. Với người tự đổi tư thế, dùng phản thân: *sich setzen*.',
'''- **Das Buch liegt auf dem Tisch. / Ich lege das Buch auf den Tisch.** — Sách nằm trên bàn / Tôi đặt sách nằm lên bàn. dem vị trí, den đích.
- **Die Flasche steht im Kühlschrank. / Ich stelle sie in den Kühlschrank.** — Chai ở trong tủ lạnh / Tôi đặt chai vào tủ lạnh. sie thay Flasche ở Akkusativ.
- **Er sitzt neben mir. / Er setzt sich neben mich.** — Anh ấy ngồi cạnh tôi / Anh ấy ngồi xuống cạnh tôi. mir là vị trí, mich là đích của tư thế mới.''',
'''1. *Ich liege das Buch…* → **Ich lege das Buch…**: legen có tân ngữ được đặt.
2. *Das Buch legt auf dem Tisch* → **liegt**: trạng thái của sách không phải hành động nó đặt vật khác.
3. *Ich setze auf den Stuhl* → **Ich setze mich auf den Stuhl** theo nghĩa tự ngồi xuống.
4. Quá khứ: *lag* thuộc liegen, *legte* thuộc legen; không trộn hai bảng.''',[
'liegen/stehen/sitzen mô tả vị trí, không dùng làm động từ đặt một tân ngữ như sách/chai/người trong khung này.',
'legen/stellen/setzen diễn tả đặt tới tư thế/vị trí; thường có vật/người Akkusativ. Tự ngồi xuống dùng sich setzen.',
'Giới từ hai cách: vị trí trong vùng → Dativ; đích vào vùng → Akkusativ. Chuyển động tự nó không đủ để chọn cách.',
'liegen–lag–gelegen; legen–legte–gelegt; stehen–stand–gestanden; stellen–stellte–gestellt; sitzen–saß–gesessen; setzen–setzte–gesetzt.'],'''
Das Buch ___ auf dem Tisch. (đang nằm)|liegt|legt|setzt|0
Ich ___ das Buch auf den Tisch. (đặt nằm)|lege|liege|sitze|1
Die Flasche ___ im Schrank. (đặt đứng sẵn)|steht|stellt|setzt|0
Ich ___ die Flasche in den Schrank.|stelle|stehe|sitze|1
Er setzt ___ auf den Stuhl.|sich|ihm|sein|1
Das Buch liegt auf ___ Tisch.|dem|den|des|2
Ich lege es auf ___ Tisch.|den|dem|des|2
Gestern ___ das Buch hier. (liegen, Präteritum)|lag|legte|liegt|3
Sie hat die Tasche auf das Bett ___. (legen)|gelegt|gelegen|geliegt|3
Ich laufe im Park. Vì sao im + Dativ?|Hoạt động diễn ra trong công viên, không nêu đích vào đó.|Vì laufen không có chuyển động.|Vì mọi giới từ đều dùng Dativ.|2
''')

add(12,'Tạo và hiểu Partizip I/II cơ bản; cụm phân từ mở rộng học riêng ở B2-07.',
'''Partizip là dạng động từ có thể tham gia cấu trúc động từ hoặc dùng như tính từ. **Partizip I** thường có quan hệ chủ động, diễn tiến so với tình huống đang xét: *ein wartender Kunde* = khách đang đợi. **Partizip II** không đơn giản là “mọi hành động quá khứ”: *ein geöffnetes Fenster* nhấn trạng thái kết quả, *der angekommene Zug* nói đoàn tàu đã đến.

Khi đứng trước danh từ, phân từ nhận đuôi tính từ. Trong Perfekt/bị động, nó là thành phần động từ nên không nhận đuôi giống/cách: *Die Briefe wurden geschrieben*, không *geschriebenen*. Cần xác định chức năng trước khi thêm đuôi.''',
'Tách hai bước: tạo dạng *wartend/geschrieben*, rồi nếu dùng trước danh từ mới chia đuôi *der wartende Kunde*. Đừng kéo đuôi tính từ sang cuối Perfekt.',
'Partizip I thường kết thúc -d trước đuôi tính từ. ge- giúp nhận nhiều Partizip II nhưng không phải tất cả: *studiert, verstanden*. Tiền tố không tách và -ieren thường không có ge-.',
'''- **Die wartenden Kunden werden ungeduldig.** — Những khách đang đợi trở nên sốt ruột. wartend + -en sau die số nhiều; Kunden là người thực hiện đợi.
- **Die unterschriebenen Verträge liegen hier.** — Những hợp đồng đã ký nằm đây. unterschrieben nhận -en khi bổ nghĩa Verträge.
- **Sie hat die Verträge unterschrieben.** — Cô ấy đã ký hợp đồng. Partizip II trong Perfekt không nhận -en do số nhiều của tân ngữ.''',
'''1. *der warten Kunde* → **der wartende Kunde**: cần Partizip I và đuôi tính từ.
2. *hat geschriebenen* → **hat geschrieben**: Partizip động từ không chia đuôi theo danh từ.
3. *gestudiert* → **studiert**: động từ -ieren không thêm ge- trong trường hợp này.
4. Không tạo *der geschlafene Mann* để nói người đang ngủ: dùng **der schlafende Mann**.''',[
'Partizip I thường hình thành từ nguyên mẫu + d: warten → wartend. Khi trước danh từ, thêm đuôi tính từ theo mạo từ/cách/số.',
'Partizip II làm thành phần động từ trong Perfekt/bị động không nhận đuôi tính từ. Trước danh từ thì phải chia đuôi.',
'Partizip II không luôn có ge-: -ieren và tiền tố không tách thường không thêm ge-. Cần học dạng bất quy tắc của từng động từ.',
'Chọn theo quan hệ nghĩa: chủ thể đang làm → Partizip I; đối tượng chịu tác động/kết quả thích hợp → Partizip II. Không quy đồng mọi Partizip II với quá khứ lịch.'],'''
der ___ Kunde (warten, đang đợi)|wartende|gewartete|warten|0
die ___ Briefe (schreiben, đã được viết)|geschriebenen|schreibenden|geschrieben|1
Sie hat den Brief ___. (schreiben)|geschrieben|geschriebenen|schreibend|1
Er hat Medizin ___. (studieren)|studiert|gestudiert|studieren|2
das ___ Kind (schlafen, đang ngủ)|schlafende|geschlafene|schlafen|3
die ___ Gäste (ankommen, đã tới)|angekommenen|ankommenden gestern|angekommen|1
Partizip I của lernen, chưa chia đuôi.|lernend|gelernt|lernte|0
Chọn Partizip II đúng của verstehen.|verstanden|geverstanden|versteht|2
Der Vertrag wird ___. (unterschreiben)|unterschrieben|unterschriebene|unterschreiben|1
Chọn nghĩa ein geöffnetes Fenster.|Một cửa sổ đã được mở/ở trạng thái mở.|Một cửa sổ đang tự mở cái khác.|Một cửa sổ chưa bao giờ mở.|3
''')

add(13,'Hình thức Konjunktiv I và tường thuật trung lập cơ bản; đổi điểm nhìn và dạng thay thế dành cho B2-05.',
'''Konjunktiv I thường đánh dấu rằng thông tin được dẫn từ lời người khác. **Er sagt, er sei krank** báo lại lời anh ấy; người tường thuật không tự xác nhận cũng không tự phủ nhận bệnh. Vì thế không dịch dạng này thành “anh ấy nói dối” hoặc “giả sử”.

Khác Konjunktiv II, gốc Konjunktiv I cơ bản dựa trên gốc Präsens; ngôi ba số ít thường có -e: *er habe, komme, könne*. sein có bảng riêng *sei*. Trong khẩu ngữ, Indikativ vẫn xuất hiện trong lời gián tiếp; bài này luyện hình thức tường thuật thường gặp ở văn bản/báo chí, không khẳng định Indikativ luôn sai.''',
'Nhìn “người dẫn lời nói gì?” và “người tường thuật có tự nhận đó là sự thật không?”. Học trước er/sie sei/habe/komme; không biến mỗi dạng thành Konjunktiv II vì nghe trang trọng hơn.',
'Động từ dẫn như sagen, erklären, berichten và văn phong tin tức là tín hiệu. Nếu dạng Konjunktiv I trùng Indikativ, có thể cần dạng thay thế; phần lựa chọn và đổi ngôi được giải thích kỹ ở B2.',
'''- **Die Sprecherin erklärt, der Zug komme später.** — Người phát ngôn nói tàu sẽ đến muộn. komme theo Konjunktiv I, không có nghĩa tàu chỉ “có lẽ” đến vì bản thân dạng động từ.
- **Er sagt, er habe keine Zeit.** — Anh ấy nói mình không có thời gian. habe khác hat ở Indikativ.
- **Sie berichtet, dass sie krank sei.** — Cô ấy cho biết mình bị bệnh. dass cho phép động từ cuối; không cần bỏ Konjunktiv I khi có dass.''',
'''1. *er seie* → **er sei**: sein có bảng riêng.
2. *er habet* → **er habe**: không lấy đuôi ngôi số nhiều gắn vào er.
3. Không giải thích **er sei krank** là chứng minh anh ấy không bệnh: hình thức chỉ dẫn nguồn lời nói.
4. *dass er sei krank* → **dass er krank sei**: động từ cuối sau dass.''',[
'Konjunktiv I cơ bản ở ngôi ba số ít thường có -e: habe, komme, könne; không dùng dạng Indikativ hat/kommt khi đề yêu cầu rõ Konjunktiv I.',
'sein có dạng riêng: ich sei, du seiest, er sei, wir seien, ihr seiet, sie seien. Không tạo seie theo khuôn động từ đều.',
'Lời gián tiếp đánh dấu nguồn phát biểu, không tự kết luận người được dẫn nói thật hay nói dối. Indikativ cũng có thể dùng trong khẩu ngữ nhưng không phải dạng yêu cầu ở bài hình thái này.',
'Với dass, động từ chia đứng cuối. Không có dass, câu được dẫn có thể giữ khung V2: er sei krank.'],'''
Er sagt, er ___ krank. (sein, Konjunktiv I)|sei|seie|ist|1
Sie erklärt, sie ___ keine Zeit. (haben, Konjunktiv I)|habe|hat|hätte gewesen|0
Der Sprecher berichtet, der Zug ___ später. (kommen, Konjunktiv I)|komme|kommt|kam|0
Er sagt, er ___ helfen. (können, Konjunktiv I)|könne|kann|konnte|0
Chọn câu với dass đúng.|Er sagt, dass er müde sei.|Er sagt, dass er sei müde.|Er sagt, dass sei er müde.|3
Wir ___ bereit. (sein, Konjunktiv I)|seien|sei|seiest|1
Ihr ___ willkommen. (sein, Konjunktiv I)|seiet|seien|sei|1
Er sei krank. Dạng sei cho biết gì?|Thông tin đang được dẫn lại.|Người nói chắc chắn đang nói dối.|Bệnh chắc chắn đã kết thúc.|2
Sie sagt, ihr Bruder ___ in Bonn. (wohnen, Konjunktiv I)|wohne|wohnt|wohnte|0
Chọn dạng er/sie/es Konjunktiv I của werden.|werde|wird|würde geworden|0
''')

add(14,'zu-Infinitiv làm bổ ngữ và xác định người thực hiện; um/ohne/statt và nguyên mẫu hoàn thành ở B2-03.',
'''Cụm nguyên mẫu không có chủ ngữ Nominativ hiện ra riêng; người thực hiện phải suy ra từ cấu trúc. **Ich versuche, früher aufzustehen**: người cố và người dậy đều là ich. **Ich bitte dich, leiser zu sprechen**: người nói nhỏ là dich, không phải ich. Vì vậy “cứ hai chủ ngữ giống nhau thì dùng zu” không đủ để giải thích mọi trường hợp.

Động từ/tính từ/danh từ dẫn nhập quyết định có thể dùng cụm nguyên mẫu hay không: *versuchen, planen, Zeit haben, wichtig sein*. Sau modal như können thường không dùng zu. Cụm với chủ ngữ riêng khác, như “tôi hy vọng anh ấy đến”, thường cần **dass er kommt**, không rút thành “ich hoffe, er zu kommen”.''',
'Hỏi “ai làm hành động cuối?” rồi kiểm tra từ dẫn có nhận zu-Infinitiv không. Với động từ tách, zu chèn vào: aufstehen → aufzustehen; không tách: verstehen → zu verstehen.',
'versuchen/vergessen/vorhaben và es ist wichtig gợi zu-Infinitiv. Động từ modal, lassen trong khung đã học và nhiều động từ tri giác lại nhận nguyên mẫu không zu; không suy từ chữ “muốn/cần” tiếng Việt.',
'''- **Ich habe vergessen, die Tür abzuschließen.** — Tôi quên khóa cửa. ab + zu + schließen → abzuschließen; người quên và khóa là ich.
- **Es ist wichtig, regelmäßig zu üben.** — Luyện đều đặn là quan trọng. es là vị trí báo trước nội dung cụm nguyên mẫu.
- **Sie bittet mich, pünktlich zu kommen.** — Cô ấy nhờ tôi đến đúng giờ. mich là người được yêu cầu và là người đến.''',
'''1. *zu aufstehen* → **aufzustehen**: zu nằm giữa tiền tố tách và gốc.
2. *Ich kann zu schwimmen* → **Ich kann schwimmen**: modal không zu.
3. *Ich hoffe, du zu kommen* → **Ich hoffe, dass du kommst**: cần mệnh đề có chủ ngữ riêng.
4. Với cụm phụ thuộc danh từ như **die Zeit, zu lernen**, hoặc có từ báo trước, dùng dấu phẩy theo cấu trúc; không học mẹo mọi zu đều bắt buộc có phẩy trong mọi trường hợp.''',[
'Sau versuchen/vergessen/planen trong các khung này dùng zu-Infinitiv; động từ ở dạng nguyên mẫu, không chia theo chủ ngữ riêng.',
'Động từ tách chèn zu: aufzustehen, anzurufen, abzuschließen. Tiền tố không tách giữ zu riêng: zu verstehen.',
'Modal như können/müssen và lassen trong khung đang học nhận nguyên mẫu không zu. Không thêm zu tự động sau mọi động từ.',
'Người thực hiện được suy từ cấu trúc: versuchen thường theo chủ ngữ; bitten + Akkusativ thường theo người được nhờ. Nếu cần chủ ngữ riêng, dùng dass-Satz phù hợp.'],'''
Ich versuche, früher ___. (aufstehen)|aufzustehen|zu aufstehen|aufzusteht|1
Sie hat vergessen, mich ___. (anrufen)|anzurufen|zu anrufen|angerufen|1
Ich kann gut ___. (schwimmen)|schwimmen|zu schwimmen|schwimme|2
Es ist wichtig, regelmäßig ___ üben.|zu|um|dass|0
Sie bittet mich, leiser zu sprechen. Ai nói nhỏ?|Tôi, người được nhờ.|Cô ấy, bắt buộc vì là chủ ngữ câu chính.|Không ai vì nguyên mẫu không có người thực hiện.|3
Ich hoffe, ___ du morgen kommst.|dass|zu|um|3
Das ist schwer ___. (verstehen)|zu verstehen|verzustehen|zu verstanden|1
Er lässt das Auto ___.|reparieren|zu reparieren|repariert|2
Ich habe keine Zeit, lange ___ warten.|zu|dass|damit|0
Chọn câu đúng.|Ich plane, im Sommer umzuziehen.|Ich plane, im Sommer zu umziehen.|Ich plane, im Sommer umzuzieht.|1
''')

add(15,'Động từ với giới từ cố định và đổi nghĩa theo giới từ; cơ chế wo-/da- không giảng lại.',
'''Giới từ trong bổ ngữ không gian có thể chọn theo vị trí/đích, nhưng giới từ cố định đi với động từ được học như một đơn vị từ vựng. **auf den Bus warten** không có nghĩa người đứng trên xe; auf do cấu trúc warten auf quy định. Cách cũng phải ghi cùng: warten auf + Akkusativ.

Một động từ có nhiều khung nghĩa: **sich freuen auf** mong chờ điều sắp tới; **sich freuen über** vui vì điều được xem là nguyên nhân. **sich bewerben um eine Stelle / bei einer Firma** tách vị trí ứng tuyển với đơn vị nhận hồ sơ. Không mang giới từ của danh từ/tính từ gần nghĩa sang động từ mà không kiểm tra.''',
'Ghi thẻ theo bộ **động từ + phản thân nếu có + giới từ + cách + một câu**. Với động từ nhiều khung, ghi khác dòng theo nghĩa, không gom thành danh sách giới từ không giải thích.',
'warten auf, teilnehmen an, sich kümmern um, abhängen von thường xuất hiện trong ngữ cảnh học/việc. Với an/auf trong các khung cố định, không dùng câu hỏi wo/wohin để tự đổi cách.',
'''- **Ich nehme an einem Sprachkurs teil.** — Tôi tham gia khóa ngôn ngữ. an + Dativ; teilnehmen tách thành nehme…teil ở câu chính.
- **Sie bewirbt sich bei einer Klinik um eine Stelle.** — Cô ấy ứng tuyển một vị trí ở phòng khám. bei + Dativ là đơn vị; um + Akkusativ là vị trí.
- **Das hängt von deiner Entscheidung ab.** — Điều đó phụ thuộc quyết định của bạn. von + Dativ; abhängen tách tiền tố cuối câu.''',
'''1. *teilnehmen in einen Kurs* → **an einem Kurs teilnehmen**: sai cả giới từ và cách.
2. *warten für* → **warten auf** trong nghĩa chờ ai/việc gì.
3. *sich kümmern für* → **sich kümmern um** trong nghĩa chăm lo.
4. Không dùng “an luôn Dativ” làm luật chung: ở đây Dativ do teilnehmen an; động từ khác có thể khác.''',[
'warten auf, denken an, sich kümmern um trong các nghĩa đang học dùng Akkusativ. Giới từ không suy từ bản dịch Việt.',
'teilnehmen an, sich beschäftigen mit, abhängen von dùng Dativ. Chia mạo từ theo danh từ đi sau, không theo chủ ngữ.',
'sich freuen auf nêu mong chờ; über nêu nguyên nhân niềm vui. Khi đề ghi sẵn khung/ngữ cảnh, giữ đúng quan hệ đó.',
'sich bewerben bei + Dativ là đơn vị; um + Akkusativ là vị trí. teilnehmen/abhängen còn cần tách tiền tố trong câu chính.'],'''
Ich warte ___ den Bus.|auf|für|mit|0
Wir nehmen ___ einem Kurs teil.|an|in|für|1
Sie kümmert sich ___ ihren Vater.|um|für|mit|0
Das hängt ___ deiner Entscheidung ab.|von|auf|über|1
Wir beschäftigen uns ___ diesem Problem.|mit|für|auf|1
Tôi mong chờ kỳ nghỉ sắp tới: Ich freue mich ___ den kommenden Urlaub.|auf|mit|bei|2
Điền khung freuen über: Ich freue mich ___ dein Geschenk.|über|an|für|2
Sie bewirbt sich ___ eine Stelle.|um|bei|mit|3
Sie bewirbt sich ___ einer Klinik.|bei|um|auf|3
Ich nehme an ___ Kurs teil. (ein)|einem|einen|ein|1
''')

add(16,'Tính từ với giới từ và bổ ngữ; phân biệt chủ thể cảm nhận, đối tượng và nguyên nhân.',
'''Tính từ cũng có khung bổ ngữ như động từ: **zufrieden mit + Dativ**, **stolz auf + Akkusativ**, **abhängig von + Dativ**. sein chỉ nối chủ ngữ với tính từ; không làm mọi bổ ngữ sau nó thành Nominativ. Trong *Ich bin mit dem Ergebnis zufrieden*, dem Ergebnis vẫn Dativ do mit.

Giới từ không được suy bằng phép dịch. **freundlich zu einer Person** là thân thiện với người; **gut für die Gesundheit** là tốt cho sức khỏe. Có các cách diễn đạt khác hợp lệ theo nghĩa, nên bài tập phải nêu tính từ/khung cần luyện, không đánh sai mọi cách nói khác.''',
'Học tính từ cùng vai trò: ai hài lòng, hài lòng với gì? ai tự hào về gì? Gắn một danh từ có mạo từ rõ để nhìn được cách: mit dem Ergebnis, auf den Erfolg.',
'Trong câu có sein/werden/bleiben + tính từ, tìm bổ ngữ do tính từ yêu cầu. Tính từ vị ngữ không thêm đuôi: *zufrieden*, còn mạo từ sau giới từ vẫn biến đổi.',
'''- **Sie ist stolz auf ihren Sohn.** — Cô ấy tự hào về con trai. auf + Akkusativ; ihren Sohn là đối tượng tự hào.
- **Ich bin mit meiner Leistung nicht zufrieden.** — Tôi chưa hài lòng với thành tích mình. mit + Dativ cái → meiner Leistung.
- **Diese Lösung ist für kleine Betriebe geeignet.** — Giải pháp này phù hợp doanh nghiệp nhỏ. geeignet für + Akkusativ; không lấy giới từ mit từ zufrieden.''',
'''1. *zufrieden auf* → **zufrieden mit** trong khung đang học.
2. *stolz mit dem Sohn* → **stolz auf den Sohn** theo khung tự hào về người con.
3. *mit meinen Ergebnis* → **mit meinem Ergebnis**: Ergebnis giống trung Dativ.
4. *Sie ist zufriedene* → **Sie ist zufrieden**: tính từ vị ngữ không đuôi.''',[
'zufrieden mit, abhängig von, freundlich zu dùng Dativ trong các khung này. Dativ theo danh từ và giới từ; sein không xóa sự chi phối đó.',
'stolz auf, interessiert an, geeignet für là các khung khác nhau: stolz auf + Akkusativ; interessiert an + Dativ; geeignet für + Akkusativ.',
'Tính từ sau sein dùng vị ngữ, không nhận đuôi giống/cách. Danh từ trong bổ ngữ giới từ vẫn phải chia mạo từ đúng.',
'Chọn giới từ theo tính từ và nghĩa đã chỉ định, không dùng một giới từ chung cho mọi bản dịch có chữ “với/về”.'],'''
Ich bin zufrieden ___ dem Ergebnis.|mit|auf|für|0
Sie ist stolz ___ ihren Sohn.|auf|mit|von|1
Er ist abhängig ___ seiner Familie.|von|für|auf|0
Wir sind interessiert ___ diesem Angebot.|an|für|mit|1
Die Übung ist geeignet ___ Anfänger.|für|mit|von|1
Sie ist freundlich ___ den Gästen.|zu|auf|für um|0
Ich bin mit ___ Ergebnis zufrieden. (mein)|meinem|meinen|mein|0
Chọn dạng tính từ đúng.|Sie ist zufrieden.|Sie ist zufriedene.|Sie ist zufriedenen.|2
stolz auf ___ Erfolg (der)|den|dem|des|1
interessiert an ___ Kurs (ein)|einem|einen|ein|1
''')

add(17,'Thứ tự Dativ/Akkusativ khi có hai tân ngữ; giới hạn mô hình trung tính và vai trò đại từ.',
'''Trong *Ich gebe dem Kind das Buch*, người nhận ở Dativ, vật được trao ở Akkusativ. Hai vai trò không đổi khi đổi trật tự. Dạng trung tính thường là **hai danh từ: Dativ trước Akkusativ; hai đại từ không nhấn: Akkusativ trước Dativ; một đại từ và một danh từ: đại từ trước**.

Đây là định hướng trật tự không nhấn mạnh, không phải lời cấm mọi cấu trúc khác. Trọng tâm đối lập có thể thay đổi vị trí. Trong bài điền/chọn, xác định rõ câu yêu cầu trật tự trung tính; không chấm sai một biến thể chỉ vì người nói nhấn người nhận.''',
'Xác định vai trước: “cho ai?” Dativ, “cho cái gì?” Akkusativ. Sau đó phân loại mỗi tân ngữ là đại từ hay danh từ; không chọn thứ tự bằng độ dài từ.',
'geben, schenken, zeigen, schicken thường có hai đối tượng theo khung này. Đại từ *es/ihn/sie* cần xác định vật thay thế; *ihm/ihr/ihnen* thường thay người nhận Dativ.',
'''- **Ich schenke meiner Schwester ein Buch.** — Tôi tặng chị một cuốn sách. Hai danh từ: Dativ trước Akkusativ trong trật tự trung tính.
- **Ich schenke es ihr.** — Tôi tặng nó cho chị ấy. es Akkusativ đứng trước ihr Dativ.
- **Ich schenke ihr ein Buch. / Ich schenke es meiner Schwester.** — Tôi tặng chị ấy sách / Tôi tặng nó cho chị tôi. Mỗi câu có một đại từ nên đại từ đứng sớm.''',
'''1. *Ich gebe ihn das Buch* khi ihn chỉ người nhận → **Ich gebe ihm das Buch**: sai cách.
2. *Ich gebe ihm es* trong trật tự trung tính → **Ich gebe es ihm**: hai đại từ không nhấn.
3. *Ich zeige dem Kind er* → **Ich zeige ihn dem Kind** khi thay der Plan: cần Akkusativ ihn.
4. Không biến quy tắc trung tính thành nhận định mọi Dativ sau Akkusativ đều sai.''',[
'Người nhận Dativ, vật được chuyển Akkusativ; vai trò do khung động từ quyết định, không đổi chỉ vì vị trí thay đổi.',
'Hai đại từ không nhấn trong trật tự trung tính: Akkusativ trước Dativ, ví dụ es ihm. Không dùng ihm es làm đáp án trung tính.',
'Một đại từ và một cụm danh từ: đại từ thường đứng trước. Chọn dạng Akkusativ/Dativ đúng theo vai người/vật.',
'Hai cụm danh từ thường theo Dativ–Akkusativ trong trật tự trung tính. Đây là định hướng, có biến thể theo trọng tâm.'],'''
Ich gebe ___ das Buch. (er, người nhận)|ihm|ihn|er|0
Tặng quyển sách cho cô ấy, hai đại từ trung tính.|Ich schenke es ihr.|Ich schenke ihr es.|Ich schenke sie es.|1
Gửi lá thư cho anh ấy, hai đại từ trung tính.|Ich schicke ihn ihm.|Ich schicke ihm ihn.|Ich schicke er ihm.|1
Ich zeige ___ den Plan. (sie số ít, người nhận)|ihr|sie|ihren|0
Ich zeige ___ dem Kind. (der Plan)|ihn|ihm|er|2
Chọn thứ tự trung tính với hai danh từ.|Ich gebe dem Kind das Buch.|Ich gebe das Kind dem Buch.|Ich gebe der Kind den Buch.|3
Ich schenke ___ ein Buch. (du)|dir|dich|du|2
Ich gebe es ___. (die Kinder, người nhận)|ihnen|sie|ihre|0
Hai đại từ không nhấn, chuyển das Paket cho Paul.|Ich schicke es ihm.|Ich schicke ihm es.|Ich schicke er es.|1
Chọn nhận định chính xác.|Trật tự trung tính có thể thay đổi theo trọng tâm.|Mọi Akkusativ đứng trước Dativ đều sai.|Dativ luôn chỉ vật được chuyển.|3
''')
