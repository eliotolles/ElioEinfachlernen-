"""Independently authored revisions. Stable lesson IDs; no learner data."""
LESSONS={}
def lesson(n,scope,mechanism,tables,tips,signs,examples,traps,questions):
    LESSONS[f'book-dtd-a2-{n:02}']={'scope':scope,'sections':[mechanism,tables,tips,signs,examples,traps],'questions':questions}

lesson(6,'Quan hệ trước–sau giữa hai mốc quá khứ; không học lại toàn bộ Partizip II.',
'''**Plusquamperfekt là “quá khứ nhìn từ một mốc quá khứ”.** Người kể đứng tại một sự kiện đã qua rồi nhìn lùi về một việc hoàn tất trước đó. Nó không biểu thị việc “rất lâu trước đây”. Tiếng Việt thường dùng “đã… trước đó”; tiếng Anh có *had + past participle*, nhưng không nên chuyển từng từ máy móc.

Trong **Als ich ankam, hatte der Film schon begonnen**, có hai sự kiện: phim bắt đầu → tôi đến. *ankam* đặt mốc kể; *hatte begonnen* đánh dấu việc trước mốc. Đổi thứ tự hai mệnh đề không đổi thứ tự sự kiện: **Der Film hatte schon begonnen, als ich ankam.**

Trợ động từ được giữ như trong Perfekt; chỉ chuyển *hat/ist* thành *hatte/war*. Động từ chính vẫn là Partizip II. Không chọn *war* chỉ vì hành động nằm rất xa trong quá khứ.''',
'''### Chia trợ động từ
| Chủ ngữ | haben → Präteritum | sein → Präteritum |
|---|---|---|
| ich | hatte | war |
| du | hattest | warst |
| er/sie/es | hatte | war |
| wir | hatten | waren |
| ihr | hattet | wart |
| sie/Sie | hatten | waren |

### Khung câu
| Kiểu câu | Công thức | Ví dụ |
|---|---|---|
| Câu chính | chủ ngữ + hatte/war + … + Partizip II | Ich hatte den Schlüssel vergessen. |
| Câu phụ | nachdem/weil/als + chủ ngữ + … + Partizip II + hatte/war | … weil ich den Schlüssel vergessen hatte. |
| Việc trước + việc sau | nachdem + Plusquamperfekt, Präteritum/Perfekt | Nachdem sie angekommen war, rief sie mich an. |

*ankommen, gehen, aufstehen* thường lấy *sein*; *essen, lesen, vergessen* lấy *haben*. Đây là lựa chọn theo động từ/cách dùng, không phải chỉ theo dấu hiệu “có chuyển động”.''',
'''Khẩu quyết: **“Đứng ở quá khứ, nhìn lùi một bước.”** Vẽ hai mốc trước khi chia động từ. Nếu chỉ có một sự kiện “Tôi học tiếng Đức năm 2020”, thường dùng Präteritum/Perfekt, không tự thêm Plusquamperfekt.

Chuyển từ Perfekt: **hat gegessen → hatte gegessen; ist gefahren → war gefahren**. Giữ nguyên Partizip II; kiểm tra lại ngôi của trợ động từ.''',
'''Các từ *schon, vorher, bereits, noch nie* có thể làm rõ quan hệ thời gian nhưng không tự bắt buộc Plusquamperfekt. Quan trọng là có mốc quá khứ để đối chiếu.

*Nachdem* biểu thị việc trong mệnh đề phụ xảy ra trước việc ở mệnh đề chính. Với văn kể quá khứ, Plusquamperfekt thường giúp đánh dấu rõ thứ tự. *Als* chỉ đặt mốc một lần trong quá khứ; không phải mọi câu có *als* đều cần Plusquamperfekt.''',
'''- **Ich konnte nicht bezahlen, weil ich mein Portemonnaie zu Hause gelassen hatte.** — Tôi không thể thanh toán vì trước đó đã để ví ở nhà. *ich* là chủ ngữ; *hatte* chia theo *ich*, nằm cuối câu phụ; *zu Hause* chỉ nơi chốn.
- **Nachdem die Gäste gegangen waren, räumten wir auf.** — Sau khi khách đã về, chúng tôi dọn dẹp. *die Gäste* số nhiều → *waren*; *gehen* lấy *sein*.
- **Hattest du den Bericht gelesen, bevor die Sitzung begann?** — Bạn đã đọc báo cáo trước khi cuộc họp bắt đầu chưa? Câu hỏi có/không đưa *hattest* lên đầu.
- **Sie war schon eingeschlafen, als ich sie anrief.** — Cô ấy đã ngủ thiếp đi khi tôi gọi. *einschlafen* là chuyển trạng thái; không nhầm với *schlafen*, thường dùng *haben*.''',
'''1. **Sai:** *Ich war den Brief geschrieben.* → **Đúng:** *Ich hatte den Brief geschrieben.* *schreiben* dùng *haben*; không chọn *sein* theo ý nghĩa “đã xong”.
2. **Sai:** *Nachdem ich hatte gegessen, ging ich los.* → **Đúng:** *Nachdem ich gegessen hatte, ging ich los.* Trong câu phụ thông thường, động từ đã chia đứng cuối.
3. **Sai trong ngữ cảnh chỉ kể một việc:** *Gestern hatte ich einen Film gesehen.* → **Phù hợp hơn:** *Gestern habe ich einen Film gesehen.* Chỉ dùng bản Plusquamperfekt khi có mốc quá khứ khác đã nêu hoặc được hiểu từ ngữ cảnh.
4. **Sai:** *Nachdem die Gäste gegangen hatte…* → **Đúng:** *Nachdem die Gäste gegangen waren…* Phải kiểm tra cả trợ động từ lẫn chủ ngữ số nhiều.''',[
('Nachdem ich gegessen ___, ging ich zur Arbeit. Điền trợ động từ.','hatte','Mệnh đề nachdem diễn tả việc ăn trước việc đi làm; essen dùng haben. Chủ ngữ ich → hatte; trợ động từ đứng cuối câu phụ.','habe','war'),
('Als wir ankamen, ___ der Zug schon abgefahren.','war','Tàu khởi hành trước lúc chúng tôi đến. Chủ ngữ der Zug số ít; abfahren ở nghĩa khởi hành lấy sein → war abgefahren.','hatte','ist'),
('Nachdem ihr angekommen ___, begann die Führung.','wart','Chủ ngữ ihr → wart; ankommen dùng sein. Sau nachdem, angekommen đứng trước trợ động từ ở cuối mệnh đề.','waren','hattet'),
('Ich war müde, weil ich kaum ___ hatte. Điền Partizip II của schlafen.','geschlafen','schlafen → geschlafen và dùng haben. Mệnh đề weil: ich kaum geschlafen hatte; không dùng geschlaft.','geschlaft','schlafen'),
('Sie konnte nicht öffnen: Sie ___ den Schlüssel im Büro vergessen.','hatte','Việc quên chìa khóa có trước việc không mở được cửa. vergessen dùng haben; Partizip II cũng là vergessen.','war','wurde'),
('Chọn câu đúng về vị trí động từ: Sau khi đã đọc thư, tôi gọi cho cô ấy.','Nachdem ich den Brief gelesen hatte, rief ich sie an.','Mệnh đề nachdem có gelesen hatte ở cuối. Cả câu phụ chiếm vị trí đầu của câu chính nên rief đứng trước ich. Hai phương án còn lại sai vị trí động từ.','Nachdem ich hatte den Brief gelesen, rief ich sie an.','Nachdem ich den Brief gelesen hatte, ich rief sie an.'),
('Wir suchten das Restaurant, das du uns ___ hattest. Điền Partizip II của empfehlen.','empfohlen','Mệnh đề quan hệ nói việc giới thiệu xảy ra trước việc tìm nhà hàng. empfehlen → empfohlen, không có ge- vì tiền tố không tách em-.','geempfohlen','empfehlt'),
('Die Kinder ___ schon eingeschlafen, als ihre Mutter nach Hause kam.','waren','die Kinder số nhiều → waren; einschlafen lấy sein. schlafen và einschlafen khác cấu tạo trợ động từ trong cách dùng này.','hatten','war'),
('Điền hatte hoặc war: Ich ___ die ganze Nacht gearbeitet, bevor ich endlich schlief.','hatte','arbeiten dùng haben dù kéo dài cả đêm. Việc làm diễn ra trước mốc đi ngủ; ich hatte gearbeitet. Độ dài không quyết định trợ động từ.','war','wäre'),
('Chỉ kể một việc hôm qua, không có mốc quá khứ khác. Chọn cách kể tự nhiên.','Gestern habe ich meine Tante besucht.','Perfekt đủ để kể một sự kiện quá khứ độc lập. Plusquamperfekt cần điểm nhìn quá khứ để quan hệ trước–sau có ý nghĩa; Präsens ở phương án còn lại không khớp ngữ cảnh thông thường.','Gestern hatte ich meine Tante besucht.','Gestern besuche ich meine Tante.')])

lesson(7,'Khung câu phụ cơ bản với weil, dass, ob, wenn, als; các quan hệ nâng cao học riêng ở B2.',
'''**Mệnh đề phụ phụ thuộc vào một ý chính hoặc thành phần khác của câu.** Nó có chủ ngữ và động từ đã chia, nhưng không dùng cùng khung với câu chính. So với tiếng Việt “Tôi ở nhà vì tôi ốm”, tiếng Đức đánh dấu quan hệ phụ thuộc bằng liên từ và vị trí động từ: **Ich bleibe zu Hause, weil ich krank bin.**

Tách hai nhiệm vụ: **chọn liên từ theo nghĩa**, sau đó **xếp động từ theo khung**. *weil* trả lời “vì sao”; *dass* đưa nội dung được biết/nghĩ/nói; *ob* biểu thị câu hỏi có/không chưa được giải quyết. Không thể đổi *ob* thành *dass* chỉ vì hai từ đều mở mệnh đề phụ.

Khi đưa cả mệnh đề phụ lên trước, nó chiếm một vị trí trong câu chính: **Weil ich krank bin, bleibe ich zu Hause.** Không thêm một chủ ngữ trước *bleibe*.''',
'''| Liên từ | Chức năng | Ví dụ có dịch |
|---|---|---|
| weil | nguyên nhân | Ich bleibe, weil es regnet. — Tôi ở lại vì trời mưa. |
| dass | nội dung khẳng định | Ich weiß, dass er kommt. — Tôi biết anh ấy sẽ đến. |
| ob | nội dung câu hỏi có/không | Ich weiß nicht, ob er kommt. — Tôi không biết anh ấy có đến không. |
| wenn | điều kiện hoặc thời gian lặp lại | Wenn ich Zeit habe, lese ich. — Khi/nếu rảnh, tôi đọc. |
| als | một lần hoặc một giai đoạn trong quá khứ | Als ich ein Kind war, wohnte ich in Hue. — Khi còn nhỏ, tôi sống ở Huế. |

### Động từ trong câu phụ
| Cấu trúc | Câu phụ |
|---|---|
| Một động từ | weil er heute arbeitet |
| Perfekt | weil er heute gearbeitet hat |
| Modalverb + nguyên mẫu | weil er heute arbeiten muss |
| Động từ tách | weil er um sechs aufsteht |

Dùng dấu phẩy ngăn câu chính và câu phụ. Bảng này không bao quát ngoại lệ cụm nhiều động từ với Ersatzinfinitiv; phần đó học ở bài nâng cao.''',
'''Khẩu quyết: **“Nghĩa chọn từ nối; từ nối kéo động từ chia về cuối.”** Gạch chân động từ đã chia trước, không kéo cả cụm sai thứ tự. *muss arbeiten* → *arbeiten muss*; *hat gearbeitet* → *gearbeitet hat*.

Với *ob/dass*: tự hỏi “nội dung này được nêu như điều được biết hay như câu hỏi?”. “Không biết anh ấy có đến không” → *ob*; “biết anh ấy không đến” → *dass er nicht kommt*.''',
'''Tìm động từ dẫn nhập: *wissen, sagen, glauben, hoffen* có thể đi với *dass*, nhưng cũng có thể nhận câu hỏi gián tiếp tùy nghĩa. Đừng học rằng sau *wissen* luôn là *dass*.

*immer, jedes Mal, oft* giúp nhận ra quan hệ thời gian lặp với *wenn*. Một giai đoạn quá khứ như “khi tôi là sinh viên” dùng *als* dù giai đoạn kéo dài nhiều năm. *als* không có nghĩa “chỉ kéo dài một khoảnh khắc”.''',
'''- **Ich weiß nicht, ob der Kurs morgen stattfindet.** — Tôi không biết ngày mai khóa học có diễn ra không. *der Kurs* là chủ ngữ; *stattfindet* giữ liền tiền tố trong câu phụ.
- **Wenn ich früher Feierabend habe, koche ich selbst.** — Nếu tan làm sớm, tôi tự nấu ăn. Câu phụ đứng đầu → câu chính bắt đầu bằng *koche ich*.
- **Als ich in Hanoi wohnte, fuhr ich oft mit dem Bus.** — Khi sống ở Hà Nội, tôi thường đi xe buýt. Mốc là một giai đoạn quá khứ, không phải một lần đi xe buýt.
- **Ich freue mich, dass du die Prüfung bestanden hast.** — Tôi vui vì bạn đã thi đỗ. Trong Perfekt, *bestanden hast* ở cuối câu phụ.''',
'''1. **Sai:** *weil ich bin müde* → **Đúng:** *weil ich müde bin*. Trong văn viết chuẩn đang luyện, *weil* dùng khung động từ cuối.
2. **Sai:** *Wenn ich Zeit habe, ich lerne.* → **Đúng:** *Wenn ich Zeit habe, lerne ich.* Không chiếm hai lần vị trí trước động từ câu chính.
3. **Sai theo ý “không biết có…không”:** *Ich weiß nicht, dass er kommt.* → **Đúng:** *Ich weiß nicht, ob er kommt.* Bản *dass* có thể có cách hiểu khác, không diễn đạt đúng câu hỏi cần nói.
4. **Sai:** *Als ich Zeit habe, lese ich.* → **Đúng với thói quen hiện tại:** *Wenn ich Zeit habe, lese ich.* Chọn theo quan hệ thời gian trước khi chia động từ.''',[
('Ich bleibe zu Hause, ___ ich Fieber habe.','weil','Câu sau đưa nguyên nhân cho việc ở nhà. weil mở câu phụ; ich là chủ ngữ, habe đứng cuối. dass chỉ nội dung, ob biểu thị câu hỏi chưa biết.','dass','ob'),
('Weil ich morgen früh arbeiten muss, ___ ich jetzt ins Bett.','gehe','Cả câu phụ ở vị trí đầu; động từ chia gehe đứng ngay sau dấu phẩy, rồi đến ich. Điền gehen là sai chia ngôi; ich gehe làm lặp chủ ngữ.','gehen','ich gehe'),
('Ich weiß nicht, ___ die Bibliothek heute geöffnet ist.','ob','Người nói chưa biết thư viện có mở không: câu hỏi có/không → ob. dass trình bày nội dung, weil nêu nguyên nhân.','dass','weil'),
('___ ich ein Kind war, lebte ich auf dem Land.','Als','Đây là một giai đoạn đã kết thúc trong quá khứ → als. Không dùng wenn chỉ vì giai đoạn có nhiều ngày; wann dùng để hỏi thời điểm.','Wenn','Wann'),
('Immer ___ ich nervös bin, spreche ich zu schnell.','wenn','immer nhấn mạnh lặp lại: mỗi khi hồi hộp → wenn. als không dùng cho quy luật hiện tại; ob không diễn tả quan hệ thời gian này.','als','ob'),
('Chọn câu phụ đúng: Ich denke, …','dass er morgen kommen kann.','Modalverb kann là động từ đã chia nên đứng sau nguyên mẫu kommen. Hai phương án còn lại đặt kann hoặc động từ chính sai vị trí.','dass er kann morgen kommen.','dass er morgen kann kommen.'),
('Ich bin froh, dass du die Prüfung ___ hast. Điền bestehen ở Partizip II.','bestanden','Perfekt trong câu phụ: bestanden hast. bestehen có tiền tố không tách be-, không thêm ge-; không giữ nguyên bestehen.','gebestanden','bestehen'),
('Chọn câu đúng với aufstehen trong câu phụ.','Sie sagt, dass sie um sechs aufsteht.','Động từ tách được viết liền ở cuối mệnh đề dass: aufsteht. Câu chính mới tách steht … auf. Hai phương án còn lại giữ khung câu chính hoặc tách sai.','Sie sagt, dass sie steht um sechs auf.','Sie sagt, dass sie um sechs steht auf.'),
('Điền dass hoặc ob: Ich weiß sicher, ___ er morgen nicht kommt.','dass','sicher cho biết người nói khẳng định nội dung anh ấy không đến; phủ định nằm trong câu phụ. Không đồng nhất câu có nicht với câu hỏi ob.','ob','wenn'),
('Chọn cách viết đúng.','Ich komme später, weil ich noch arbeite.','Cần dấu phẩy ngăn hai mệnh đề và arbeite cuối câu phụ. Hai phương án còn lại thiếu dấu phẩy hoặc giữ động từ vị trí hai sau weil.','Ich komme später weil ich noch arbeite.','Ich komme später, weil ich arbeite noch.')])

lesson(8,'Vorgangspassiv ở Präsens và Präteritum; phân biệt người làm, đối tượng và quá trình.',
'''**Bị động đổi điểm nhìn, không chỉ đổi động từ.** Câu chủ động trả lời ai làm gì; câu bị động đưa đối tượng/quá trình lên trung tâm. **Die Technikerin repariert den Drucker** → **Der Drucker wird repariert.** *den Drucker* vốn là Akkusativ trở thành chủ ngữ Nominativ; *werden* chia theo chủ ngữ mới.

Trong tiếng Việt, “được/bị” thường gợi lợi–hại. *werden + Partizip II* không tự nói việc đó tốt hay xấu. *Das Haus wird abgerissen* chỉ mô tả việc phá nhà, không dịch từng chữ “được phá”.

Không phải tân ngữ nào cũng thành chủ ngữ. **Die Ärztin hilft dem Patienten** → **Dem Patienten wird geholfen.** *helfen* đòi Dativ, nên *dem Patienten* không đổi thành *der Patient*. Đây là ví dụ giới hạn quy tắc chuyển Akkusativ, không phải yêu cầu học toàn bộ bị động không chủ ngữ ở bài này.''',
'''### Hai thì cơ bản
| Thì | Công thức | Số ít | Số nhiều |
|---|---|---|---|
| Präsens | werden + Partizip II | Der Brief wird geschrieben. | Die Briefe werden geschrieben. |
| Präteritum | wurden theo ngôi + Partizip II | Der Brief wurde geschrieben. | Die Briefe wurden geschrieben. |

### Chia werden
| Chủ ngữ | Präsens | Präteritum |
|---|---|---|
| ich | werde | wurde |
| du | wirst | wurdest |
| er/sie/es | wird | wurde |
| wir | werden | wurden |
| ihr | werdet | wurdet |
| sie/Sie | werden | wurden |

### Vai trò trong câu
| Chủ động | Bị động |
|---|---|
| chủ ngữ người thực hiện | bỏ đi hoặc von + Dativ |
| tân ngữ Akkusativ | chủ ngữ Nominativ |
| tân ngữ Dativ | giữ Dativ |
| động từ chính | Partizip II, cuối câu chính |

*von* thường giới thiệu tác nhân; *durch* thường giới thiệu phương tiện/nguyên nhân trung gian. Không xem “người → von, vật → durch” là luật tuyệt đối.''',
'''Làm theo ba bước: **tìm Akkusativ → đổi thành Nominativ → chia werden theo chủ ngữ mới**. Ví dụ *die Briefe* số nhiều đòi *werden*, dù người gửi thư chỉ có một người.

Nhìn phần cuối: *wird repariert* = đang/được sửa theo quá trình; *ist repariert* thường là trạng thái đã sửa xong. Bài Zustandspassiv ở B2 giải thích sâu hơn; không coi hai dạng là cùng một thì.''',
'''Nhận ra trong thông báo, quy trình, nội quy: *Hier wird gebaut; Die Unterlagen werden geprüft.* Tác nhân thường không quan trọng hoặc chưa biết.

Phân biệt *werden* qua phần theo sau: *wird müde* là trở nên mệt; *wird arbeiten* là Futur I; *wird geprüft* là bị động quá trình. Không cứ thấy *wird* là dịch “sẽ”.''',
'''- **Die Anträge werden von einer Mitarbeiterin geprüft.** — Các đơn được một nhân viên kiểm tra. *die Anträge* số nhiều → *werden*; *von einer Mitarbeiterin* Dativ.
- **Gestern wurde die Straße gesperrt.** — Hôm qua đường đã bị phong tỏa. *wurde* chia quá khứ, không dùng *war* để biểu thị quá trình này.
- **Ich weiß, dass die Unterlagen heute geprüft werden.** — Tôi biết hồ sơ được kiểm tra hôm nay. Câu phụ: *geprüft werden* đứng cuối.
- **Die Tür wird geschlossen. / Die Tür ist geschlossen.** — Cửa đang được đóng / Cửa đang ở trạng thái đóng. Một bên là hành động, bên kia là trạng thái.''',
'''1. **Sai:** *Die Briefe wird geschickt.* → **Đúng:** *Die Briefe werden geschickt.* Trợ động từ theo chủ ngữ số nhiều, không theo tác nhân bị lược.
2. **Sai:** *Der Patient wird geholfen.* → **Đúng:** *Dem Patienten wird geholfen.* *helfen* giữ Dativ; không phải phép chuyển Akkusativ.
3. **Sai:** *Das Haus wird bauen.* → **Đúng:** *Das Haus wird gebaut.* Bị động cần Partizip II; nguyên mẫu *bauen* tạo cấu trúc khác.
4. **Sai trong câu phụ:** *… dass der Brief wird geschrieben.* → **Đúng:** *… dass der Brief geschrieben wird.* Động từ chia về cuối.''',[
('Hiện tại: Die Unterlagen ___ gerade geprüft.','werden','die Unterlagen là chủ ngữ số nhiều; bị động Präsens dùng werden + geprüft. wird chỉ số ít; wurden đổi sang quá khứ, không khớp gerade trong tình huống hiện tại này.','wird','wurden'),
('Gestern ___ die Brücke repariert. Điền werden ở Präteritum.','wurde','die Brücke số ít; quá trình sửa hôm qua dùng wurde repariert. war repariert tả trạng thái, không phải dạng Präteritum của Vorgangspassiv.','war','wurden'),
('Der Brief wird von ___ Kollegin geschrieben. Điền mạo từ của eine Kollegin.','einer','von chi phối Dativ; Kollegin giống cái → einer Kollegin. eine là Nominativ/Akkusativ; einen không phù hợp giống và cách.','eine','einen'),
('Chuyển sang bị động ở Präsens: Die Ärztin hilft dem Mann.','Dem Mann wird geholfen.','helfen dùng Dativ; dem Mann giữ nguyên. Câu bị động không có chủ ngữ Nominativ nên động từ dùng số ít wird. Hai phương án kia đổi sai cách hoặc chọn war.','Der Mann wird geholfen.','Dem Mann war geholfen.'),
('Điền Partizip II: Das Essen wird frisch ___. (zubereiten)','zubereitet','zubereiten → zubereitet. Đây là động từ với thành phần be- nên không tạo zugebereitet; zubereiten là nguyên mẫu, không dùng sau werden trong bị động này.','zugebereitet','zubereiten'),
('Chọn câu phụ đúng.','Ich hoffe, dass das Paket heute geliefert wird.','Trong dass-Satz, Partizip II geliefert đứng trước động từ chia wird ở cuối. Hai cách khác giữ cấu trúc câu chính hoặc dùng nguyên mẫu sai.','Ich hoffe, dass das Paket wird heute geliefert.','Ich hoffe, dass das Paket heute liefern wird.'),
('Ai thực hiện: Der Fehler wird ___ einer Technikerin behoben.','von','von + Dativ nêu người thực hiện sửa lỗi. einer Technikerin đã ở Dativ. durch đòi Akkusativ; mit chỉ công cụ/đồng hành, không nêu tác nhân theo cấu trúc cần dùng.','durch','mit'),
('Chọn câu mô tả quá trình đóng cửa đang diễn ra.','Die Tür wird gerade geschlossen.','wird geschlossen mô tả quá trình; ist geschlossen chỉ trạng thái. wird schließen dùng nguyên mẫu và không diễn đạt bị động cần chọn.','Die Tür ist geschlossen.','Die Tür wird schließen.'),
('Điền theo chủ ngữ mới: Ein Mitarbeiter kontrolliert die Ausweise. → Die Ausweise ___ kontrolliert.','werden','die Ausweise từ Akkusativ thành chủ ngữ số nhiều nên werden. Không chia theo ein Mitarbeiter; wurde là quá khứ số ít.','wird','wurde'),
('Ihr ___ am Eingang kontrolliert. Điền werden ở Präsens.','werdet','Chủ ngữ ihr → werdet. Partizip II kontrolliert không đổi theo ngôi. werden dùng wir/sie/Sie; wird dùng er/sie/es.','werden','wird')])

lesson(9,'Futur I là trọng tâm; Futur II chỉ giới thiệu để đối chiếu, phân tích sâu ở B2-20.',
'''**Thời gian tương lai và thì Futur không phải một khái niệm.** **Morgen arbeite ich zu Hause** đã diễn tả tương lai nhờ *morgen*. Tiếng Đức thường dùng Präsens khi thời điểm rõ. Futur I giúp thể hiện dự đoán, lời hứa hoặc ý định được nhấn mạnh: **Ich werde dich morgen anrufen.**

*werden* là động từ đã chia; động từ chính giữ nguyên mẫu. **Er wird jetzt zu Hause sein** còn có thể là phỏng đoán về hiện tại: “Chắc giờ anh ấy đang ở nhà”. Vì vậy không dịch *wird* luôn thành “sẽ”.

Futur II thêm góc nhìn hoàn tất: **Bis Freitag werde ich den Bericht geschrieben haben.** Đứng ở mốc thứ Sáu và nhìn việc đã xong. Bài này chỉ nhận diện khung; cách phỏng đoán quá khứ và cụm động từ phức được học riêng ở B2.''',
'''### Futur I
| Chủ ngữ | werden | Động từ cuối |
|---|---|---|
| ich | werde | lernen |
| du | wirst | lernen |
| er/sie/es | wird | lernen |
| wir | werden | lernen |
| ihr | werdet | lernen |
| sie/Sie | werden | lernen |

### Phân biệt ba cấu trúc
| Dạng | Công thức | Ví dụ có dịch |
|---|---|---|
| Futur I | werden + nguyên mẫu | Ich werde anrufen. — Tôi sẽ gọi. |
| Futur II, nhận diện | werden + Partizip II + haben/sein | Ich werde angekommen sein. — Tôi sẽ đã đến nơi. |
| Vorgangspassiv | werden + Partizip II | Ich werde angerufen. — Tôi được gọi điện. |

### Trật tự
| Câu chính | Câu phụ |
|---|---|
| Er wird morgen kommen. | … dass er morgen kommen wird. |
| Sie wird früher aufstehen. | … dass sie früher aufstehen wird. |

Không thêm *zu* trong Futur I; động từ tách ở nguyên mẫu vẫn viết liền.''',
'''Nhớ **“werden chia, việc chính giữ nguyên”**: *du wirst lernen*, không phải *du wirst lernst*. Muốn chọn *haben/sein* trong Futur II, quay về Perfekt: *hat geschrieben → geschrieben haben; ist angekommen → angekommen sein*.

Đọc toàn bộ tình huống: *morgen* nghiêng về tương lai, *jetzt wohl* có thể là suy đoán hiện tại. Từ chỉ thời gian hỗ trợ nghĩa, không thay thế việc hiểu cấu trúc.''',
'''Lời hứa thường đi với *bestimmt, versprechen* hoặc ngữ cảnh cam kết; dự báo với *wahrscheinlich, vermutlich*. Trong một lịch trình đã rõ, Präsens thường tự nhiên hơn Futur I nhưng không phải vì Futur I “sai”.

Mốc *bis Freitag/bis dahin* thường đi với ý hoàn thành trước hạn. Chỉ có *morgen* không bắt buộc Futur II: cần xét người nói có nhấn việc đã hoàn tất tại mốc hay không.''',
'''- **Ich werde dir helfen, versprochen.** — Tôi sẽ giúp bạn, hứa đấy. *werde* chia theo *ich*; *dir* là Dativ do *helfen*.
- **Nächste Woche beginnt mein Kurs.** — Tuần tới khóa học của tôi bắt đầu. Präsens có thời gian tương lai rõ ràng.
- **Er wird wohl noch im Büro sein.** — Chắc anh ấy vẫn đang ở văn phòng. *sein* là động từ chính; *wird* thể hiện phỏng đoán, không phải bị động.
- **Bis morgen werde ich die Aufgabe erledigt haben.** — Đến ngày mai tôi sẽ làm xong bài. *erledigt haben* là nguyên mẫu hoàn thành; không phải *habe* ở cuối.''',
'''1. **Sai:** *Du wirst lernst.* → **Đúng:** *Du wirst lernen.* Chỉ werden nhận ngôi.
2. **Sai:** *Ich werde zu kommen.* → **Đúng:** *Ich werde kommen.* Futur I không dùng zu.
3. **Sai khi muốn nói “sẽ gọi”:** *Ich werde angerufen.* → **Đúng:** *Ich werde anrufen.* *angerufen* tạo bị động “được gọi”.
4. **Sai:** *… dass ich werde kommen.* → **Đúng:** *… dass ich kommen werde.* Câu phụ chuyển động từ chia về cuối.''',[
('Du ___ die Prüfung bestimmt bestehen. Điền werden ở Präsens.','wirst','du → wirst; bestehen là nguyên mẫu cuối câu. wird thuộc er/sie/es, werdet thuộc ihr. bestimmt nêu dự đoán, không đổi cách chia.','wird','werdet'),
('Ich werde dich morgen ___. (anrufen)','anrufen','Futur I dùng werden + nguyên mẫu; động từ tách anrufen viết liền khi là nguyên mẫu. angerufen tạo bị động, anzurufen có zu không dùng ở đây.','angerufen','anzurufen'),
('Chọn câu phụ đúng.','Sie sagt, dass sie später kommen wird.','kommen là nguyên mẫu trước wird; động từ chia của câu phụ đứng cuối. Hai phương án khác sai vị trí hoặc chia hai động từ.','Sie sagt, dass sie wird später kommen.','Sie sagt, dass sie später kommt wird.'),
('Er wird wohl gerade schlafen. Câu này chủ yếu diễn tả gì?','Phỏng đoán về hiện tại.','gerade và wohl đặt tình huống ở hiện tại: người nói đoán anh ấy đang ngủ. Futur I không chỉ biểu thị tương lai; không có Partizip II để là bị động.','Chắc chắn một việc đã xảy ra hôm qua.','Một hành động bị động.'),
('Điền nguyên mẫu: Ihr werdet bald besser Deutsch ___. (sprechen)','sprechen','werdet đã nhận ngôi ihr; sprechen phải ở nguyên mẫu. sprecht là dạng chia, gesprochen là Partizip II nên không đúng Futur I.','sprecht','gesprochen'),
('Chọn câu diễn tả tương lai đúng mà không cần Futur I.','Morgen beginnt der Unterricht um acht.','Morgen xác lập mốc tương lai; Präsens beginnt hoàn toàn phù hợp lịch học. Hai câu còn lại sai hòa hợp chủ ngữ hoặc trật tự nguyên mẫu.','Morgen beginnen der Unterricht um acht.','Morgen der Unterricht beginnen um acht.'),
('Giới thiệu Futur II: Bis Freitag werde ich den Bericht geschrieben ___.','haben','schreiben dùng haben ở Perfekt → geschrieben haben trong Futur II. haben ở nguyên mẫu vì werde đã chia; sein không phải trợ động từ của schreiben.','sein','habe'),
('Giới thiệu Futur II: Bis acht werden wir angekommen ___.','sein','ankommen dùng sein ở Perfekt nên nguyên mẫu hoàn thành là angekommen sein. werden nhận ngôi wir; sind là dạng chia không được đặt ở cuối khung này.','haben','sind'),
('Chọn câu nghĩa là “Tôi sẽ gọi điện”, không phải “Tôi được gọi điện”.','Ich werde anrufen.','anrufen là nguyên mẫu → Futur I chủ động. angerufen là Partizip II → bị động. werde anzurufen sai vì zu không thuộc khung Futur I.','Ich werde angerufen.','Ich werde anzurufen.'),
('Điền werden theo ngôi: Frau Müller, ___ Sie morgen teilnehmen?','werden','Sie xưng hô lịch sự nhận werden dù chỉ một người. Câu hỏi có/không đặt werden đầu câu; teilnehmen giữ nguyên mẫu cuối.','wird','werdet')])

lesson(10,'Phần mở rộng: chọn dạng diễn đạt thay bị động theo khả năng và nghĩa vụ; không coi tất cả là cấu trúc A2 cốt lõi.',
'''Các dạng thay thế bị động không đồng nghĩa hoàn toàn. **Die Datei kann geöffnet werden** nói khả năng; **Die Datei muss geöffnet werden** nói yêu cầu. Nếu đổi cả hai thành một câu không xét nghĩa, nội dung sẽ sai.

**sich lassen + nguyên mẫu** thường biểu thị khả năng: *Die Datei lässt sich öffnen.* Chủ ngữ là đối tượng được xử lý; *sich* đi với *lassen*, còn *öffnen* không có *zu*.

**sein + zu + nguyên mẫu** có thể biểu thị nghĩa vụ hoặc khả năng tùy ngữ cảnh: *Die Regeln sind zu beachten* thường là phải tuân thủ; *Der Fehler ist leicht zu beheben* thường là dễ khắc phục. Không tự gán nghĩa “phải” cho mọi sein + zu.

**man** vẫn là câu chủ động với tác nhân không xác định. *Man prüft die Unterlagen* không phải hình thái bị động, nhưng có thể dùng khi không muốn nêu người cụ thể.''',
'''| Dạng | Nghĩa điển hình | Ví dụ có dịch |
|---|---|---|
| sich lassen + Infinitiv | có thể được | Die Tür lässt sich öffnen. — Cửa có thể mở được. |
| sein + leicht/schwer + zu | khả năng/độ khó | Der Text ist schwer zu verstehen. — Bài khó hiểu. |
| sein + zu trong nội quy | điều phải làm | Die Frist ist einzuhalten. — Phải tuân thủ thời hạn. |
| tính từ -bar | có thể, với từ được dùng trong ngôn ngữ | Die Schrift ist lesbar. — Chữ đọc được. |
| man + chủ động | tác nhân chung | Man kontrolliert die Tickets. — Người ta kiểm tra vé. |

### Chia lassen trong cấu trúc khả năng
| Chủ ngữ đối tượng | Cấu trúc |
|---|---|
| die Datei | lässt sich öffnen |
| die Dateien | lassen sich öffnen |
| das Problem | lässt sich lösen |
| die Probleme | lassen sich lösen |

Với động từ tách: *einhalten → einzuhalten*. Với *-bar*, phải học từ thực tế (*lesbar, machbar, lösbar*); không gắn hậu tố tùy tiện vào mọi động từ.''',
'''Hỏi trước **“có thể hay bắt buộc?”** rồi mới đổi câu. “Có thể sửa” → *lässt sich reparieren*; “phải sửa” → *muss repariert werden* hoặc *ist zu reparieren* khi ngữ cảnh rõ nghĩa vụ.

Khẩu quyết hình thức: **“lassen không zu; sein cần zu.”** Đây là mẹo cho hai cấu trúc trong bài, không phải quy tắc cho mọi cách dùng của lassen/sein.''',
'''*leicht, schwer, kaum, problemlos* thường làm rõ khả năng: *kaum zu lesen, problemlos zu öffnen*. *bis Freitag, unbedingt* và văn bản nội quy thường làm nổi nghĩa vụ, nhưng vẫn phải hiểu toàn câu.

Đừng nhầm *sich lassen* với thuê/nhờ người khác làm: *Ich lasse mein Auto reparieren* = tôi đem xe đi sửa. Ở đây *ich* là người sắp xếp, không phải đối tượng được sửa.''',
'''- **Mit diesem Schlüssel lässt sich die Tür nicht öffnen.** — Không thể mở cửa bằng chìa này. *die Tür* là chủ ngữ số ít → *lässt*.
- **Die Unterlagen sind bis Montag einzureichen.** — Phải nộp hồ sơ trước thứ Hai. *einzureichen* đặt zu giữa tiền tố tách và gốc.
- **Die Hinweise sind gut lesbar.** — Các hướng dẫn dễ đọc. *lesbar* sau sein không thêm đuôi tính từ.
- **Man kann den Fehler schnell beheben.** — Có thể nhanh chóng khắc phục lỗi. *man* chia động từ ngôi ba số ít; *den Fehler* vẫn Akkusativ.''',
'''1. **Sai:** *Die Tür lässt sich zu öffnen.* → **Đúng:** *Die Tür lässt sich öffnen.* lassen nhận nguyên mẫu không zu.
2. **Sai:** *Die Regeln sind beachten.* → **Đúng:** *Die Regeln sind zu beachten.* sein + zu cần đủ zu.
3. **Sai:** *Die Dateien lässt sich öffnen.* → **Đúng:** *Die Dateien lassen sich öffnen.* Động từ theo đối tượng số nhiều.
4. **Sai về nghĩa:** đổi *muss bezahlt werden* thành *lässt sich bezahlen* rồi nói là tương đương. Bản đầu bắt buộc thanh toán; bản sau nói thanh toán được.''',[
('Die Tür lässt sich leicht ___. (öffnen)','öffnen','lassen đi với nguyên mẫu không zu. die Tür là chủ ngữ; sich là thành phần của cấu trúc khả năng. zu öffnen và geöffnet không khớp khung này.','zu öffnen','geöffnet'),
('Die Dateien ___ sich nicht öffnen.','lassen','die Dateien số nhiều → lassen. Không chia theo sich; lässt là số ít, lassen sich zu là thêm zu sai khung.','lässt','lassen sich zu'),
('Die Frist ist unbedingt ___. (einhalten)','einzuhalten','sein + zu nêu nghĩa vụ ở đây. einhalten là động từ tách → einzuhalten, không phải zu einhalten; eingehalten thuộc Partizip II.','zu einhalten','eingehalten'),
('“Có thể giải quyết vấn đề” tương đương câu nào?','Das Problem lässt sich lösen.','sich lassen + lösen biểu thị khả năng giải quyết. muss gelöst werden là nghĩa vụ; hat gelöst vừa đổi chủ thể vừa không diễn tả khả năng.','Das Problem muss gelöst werden.','Das Problem hat gelöst.'),
('Điền dạng tính từ: Die Schrift ist gut ___. (lesbar)','lesbar','Tính từ vị ngữ sau sein không thêm đuôi: lesbar. lesbare/lesbaren là các dạng có thể xuất hiện trước danh từ tùy cấu trúc, không đứng ở vị trí này.','lesbare','lesbaren'),
('Chọn câu đúng với man.','Man kann die Tickets online kaufen.','man là chủ ngữ ngôi ba số ít → kann; kaufen ở nguyên mẫu vì có modal. Hai phương án còn lại chia động từ số nhiều hoặc chia cả kaufen.','Man können die Tickets online kaufen.','Man kann die Tickets online kauft.'),
('Der Text ist kaum zu verstehen. Ý chính là gì?','Bài gần như không thể hiểu được.','kaum + zu verstehen làm rõ khả năng/độ khó. Không mang nghĩa người đọc bị cấm hiểu; cũng không kể một việc đã hiểu xong.','Bắt buộc không được hiểu bài.','Bài đã được hiểu xong hôm qua.'),
('Ich lasse mein Auto reparieren. Chọn nghĩa đúng.','Tôi đem/nhờ người sửa xe của mình.','lassen ở đây là sắp xếp người khác làm. Chủ ngữ ich không phải xe; không phải sich lassen biểu thị xe có thể sửa được.','Xe của tôi tự sửa.','Tôi chắc chắn tự tay sửa xe.'),
('Điền sein ở Präsens: Diese Regeln ___ zu beachten.','sind','Diese Regeln số nhiều → sind. zu beachten nêu điều cần tuân thủ trong nội quy; ist dùng số ít, werden sẽ làm thay đổi khung.','ist','werden'),
('Chọn câu giữ nghĩa “phải trả hóa đơn” trong thông báo yêu cầu thanh toán.','Die Rechnung ist zu bezahlen.','Trong ngữ cảnh thông báo yêu cầu, ist zu bezahlen tương đương nghĩa vụ. lässt sich bezahlen và ist bezahlbar thiên về khả năng chi trả, không giữ nghĩa phải trả.','Die Rechnung lässt sich bezahlen.','Die Rechnung ist bezahlbar.')])

lesson(11,'Đại từ sở hữu đứng độc lập ở Nominativ/Akkusativ/Dativ; phân biệt với từ sở hữu trước danh từ.',
'''**Possessivartikel đi kèm danh từ; Possessivpronomen thay cho cả cụm danh từ.** So sánh *Das ist mein Stift* và *Das ist meiner*. Khi bỏ *Stift*, đại từ phải tự mang dấu hiệu giống/cách; vì vậy không thể chỉ xóa danh từ và giữ *mein* trong mọi trường hợp.

Có hai quyết định độc lập: **gốc sở hữu theo người sở hữu** (*mein, dein, sein, ihr…*), **đuôi theo vật/người được nói đến và chức năng trong câu**. Trong *Ich nehme deinen; meiner ist leer*, người sở hữu thay đổi nhưng cả hai đều thay *der Stift*.

Đại từ không nhất thiết làm chủ ngữ. *Ich nehme deinen* là Akkusativ; *Mit meinem geht es besser* là Dativ do mit. “Đứng một mình” không có nghĩa luôn dùng Nominativ.''',
'''### Gốc sở hữu
| Người sở hữu | Gốc |
|---|---|
| ich / du | mein- / dein- |
| er hoặc es / sie số ít | sein- / ihr- |
| wir / ihr | unser- / euer- |
| sie số nhiều / Sie lịch sự | ihr- / Ihr- |

### Đại từ độc lập: mẫu mein-
| Cách | Maskulin | Feminin | Neutrum | Plural |
|---|---|---|---|---|
| Nominativ | meiner | meine | meins / meines | meine |
| Akkusativ | meinen | meine | meins / meines | meine |
| Dativ | meinem | meiner | meinem | meinen |

### Không trộn với Possessivartikel
| Trước danh từ | Đứng độc lập |
|---|---|
| mein Stift | meiner |
| mein Buch | meins / meines |
| mit meinem Stift | mit meinem |

Genitiv độc lập hiếm dùng trong giao tiếp, không dùng làm bảng sản xuất câu ở bài này. Dạng **Das ist meins** khác cấu trúc **Das ist mein Buch**, dù chỉ cùng một vật.''',
'''Khẩu quyết: **“Ai sở hữu chọn gốc; vật và vai chọn đuôi.”** Viết danh từ bị lược trong ngoặc: *Ist das deiner (der Koffer)?* → nam, Nominativ. *Ich nehme deinen (den Koffer)* → nam, Akkusativ.

Với *euer*: thường bỏ e trước đuôi: *eurer, eure, eures*. Đừng viết *euere* như một quy tắc bắt buộc hay tự tạo dạng *eur* đứng một mình.''',
'''Dấu hiệu là danh từ đã được nói trước, sau đó chỉ còn từ sở hữu: *Mein Handy ist kaputt. Kann ich deins benutzen?* Tìm danh từ trong câu trước để xác định giống/số.

Các giới từ *mit, von, bei* kéo đại từ sang Dativ; *für, ohne* kéo sang Akkusativ. Sau *sein*, cụm nhận diện thường ở Nominativ: *Der hier ist meiner*.''',
'''- **Dein Koffer ist schwer; meiner ist leicht.** — Va li của bạn nặng; của tôi nhẹ. *meiner* thay *der Koffer*, làm chủ ngữ.
- **Ich habe mein Handy vergessen. Darf ich deins benutzen?** — Tôi quên điện thoại. Tôi dùng của bạn được không? *deins* thay *das Handy* ở Akkusativ.
- **Mit meinem kann man bessere Fotos machen.** — Dùng cái của tôi thì có thể chụp ảnh tốt hơn. *mit* → Dativ; danh từ được hiểu là *Handy*.
- **Ist das Ihre Tasche? – Ja, das ist meine.** — Đó là túi của bà phải không? — Đúng, đó là của tôi. Người trả lời đổi gốc từ Ihr- sang mein-.''',
'''1. **Sai:** *Der Stift ist mein.* → **Đúng theo cách dùng đại từ đang học:** *Der Stift ist meiner.* Không giữ dạng không đuôi của từ đứng trước danh từ.
2. **Sai:** *Ich nehme deiner.* → **Đúng khi thay der Stift:** *Ich nehme deinen.* nehmen cần Akkusativ.
3. **Sai:** *Mit meins geht es besser.* → **Đúng:** *Mit meinem geht es besser.* mit đòi Dativ.
4. **Sai:** chọn *seiner* vì vật sở hữu là danh từ nam dù người sở hữu là nữ. **Đúng:** *ihrer* khi chủ sở hữu là sie; đuôi mới theo vật được sở hữu.''',[
('Mein Koffer ist alt. ___ ist neu. (dein, làm chủ ngữ)','Deiner','Thay der Koffer giống nam và làm chủ ngữ → deiner. dein là từ trước danh từ; deinen là Akkusativ nam, không làm chủ ngữ ở đây.','Dein','Deinen'),
('Mein Stift ist leer. Ich nehme ___. (dein)','deinen','nehmen cần đối tượng Akkusativ; thay den Stift → deinen. Gốc dein chỉ người sở hữu là du; đuôi -en theo giống nam Akkusativ.','deiner','dein'),
('Ist das dein Handy? – Ja, das ist ___. Chọn dạng ngắn.','meins','Người trả lời ich → mein-; thay das Handy ở Nominativ → meins. meiner thuộc nam, meinem là Dativ. Dạng meines cũng đúng nhưng câu yêu cầu dạng ngắn.','meiner','meinem'),
('Mit deinem Fahrrad geht es schnell, mit ___ auch. (mein)','meinem','mit đòi Dativ; Fahrrad giống trung → meinem. Đại từ độc lập vẫn nhận cách từ giới từ; meins là Nominativ/Akkusativ trung.','meins','meiner'),
('Ihre Tasche ist rot; ___ ist schwarz. (mein)','meine','Tasche giống cái; đại từ làm chủ ngữ → meine. meiner là Dativ cái hoặc Nominativ nam, không đúng vai trò trong câu này.','meiner','meins'),
('Sind das eure Bücher? – Ja, das sind ___. (unser)','unsere','Người trả lời wir → unser-; Bücher số nhiều Nominativ → unsere. Không chọn theo giống trung của Buch số ít; số nhiều là thông tin quyết định ở đây.','unseres','unser'),
('Er hat einen Hund. Sie hat auch einen. ___ ist größer. (Hund của cô ấy)','Ihrer','Chủ sở hữu là sie → ihr-, Hund nam Nominativ → ihrer. seiner đổi thành người sở hữu nam; ihre không mang đuôi nam Nominativ độc lập.','Seiner','Ihre'),
('Ich suche meine Schlüssel. Hast du ___ gesehen? (mein)','meine','Schlüssel ở đây số nhiều, tân ngữ Akkusativ của sehen → meine. Không dùng meinen vì -en không phải Akkusativ số nhiều của đại từ này.','meinen','meiner'),
('Chọn cặp đúng cho der Stift.','Das ist mein Stift. Das ist meiner.','Possessivartikel trước Stift là mein; đại từ độc lập thay der Stift là meiner. Hai cặp khác đảo sai chức năng hoặc dùng Dativ không có lý do.','Das ist meiner Stift. Das ist mein.','Das ist meinem Stift. Das ist meinen.'),
('Mein Drucker ist kaputt. Kann ich mit ___ drucken? (euer)','eurem','mit + Dativ; Drucker nam → eurem. euer thường mất e bên trong khi thêm đuôi; eurer không phải Dativ nam.','eurer','eures')])

lesson(12,'Đại từ phản thân Akkusativ/Dativ, vị trí và khác biệt giữa phản thân thật với cách dùng phản thân tùy nghĩa.',
'''**Phản thân nghĩa là một thành phần của hành động quy chiếu trở lại chủ ngữ.** Trong *Ich wasche mich*, người rửa và người được rửa là cùng một người. Nhưng không phải cấu trúc phản thân nào cũng dịch “tự”: *Ich erinnere mich an den Termin* chỉ là “Tôi nhớ cuộc hẹn”. Phải học cả cấu trúc động từ.

Phân biệt hai nhóm: *sich beeilen* thường cần đại từ trong nghĩa “vội”; *waschen* có thể có tân ngữ khác: *Ich wasche das Auto*. Khi nói *Ich wasche mir die Hände*, *die Hände* đã là đối tượng Akkusativ; *mir* là Dativ chỉ người có bộ phận cơ thể đó.

Không áp dụng máy móc “cứ thấy một Akkusativ ở đâu đó là đổi mọi phản thân sang Dativ”. Phải xét cấu trúc của chính động từ: *Ich freue mich auf den Urlaub* vẫn dùng *mich*; *den Urlaub* là bổ ngữ giới từ *auf*, không phải tân ngữ trực tiếp thay chỗ của mich.''',
'''### Bảng đại từ
| Chủ ngữ | Akkusativ | Dativ |
|---|---|---|
| ich | mich | mir |
| du | dich | dir |
| er/sie/es | sich | sich |
| wir | uns | uns |
| ihr | euch | euch |
| sie/Sie | sich | sich |

### Học động từ cùng khung
| Khung | Ví dụ có dịch |
|---|---|
| sich beeilen | Ich beeile mich. — Tôi vội lên. |
| sich interessieren für + Akkusativ | Sie interessiert sich für Kunst. — Cô ấy quan tâm nghệ thuật. |
| sich erinnern an + Akkusativ | Ich erinnere mich an dich. — Tôi nhớ bạn. |
| sich etwas merken, Dativ + Akkusativ | Ich merke mir die Nummer. — Tôi ghi nhớ số đó. |
| sich die Hände waschen, Dativ + Akkusativ | Du wäschst dir die Hände. — Bạn rửa tay. |

### Vị trí thường gặp
| Câu chính | Câu phụ |
|---|---|
| Heute beeile ich mich. | … weil ich mich beeile. |
| Heute beeilt sich der Mann. | … weil sich der Mann beeilt. |

Với chủ ngữ đại từ, đại từ chủ ngữ thường trước phản thân. Với chủ ngữ danh từ, sich thường đứng sớm; trật tự có thể biến đổi theo trọng tâm.''',
'''Học **mich/dich** đối chiếu **mir/dir** vì đây là nơi thấy khác biệt rõ nhất. *uns/euch/sich* giống hình thức ở hai cách nên không dùng chúng để suy ra cấu trúc.

Ghi từ vựng theo mẫu: **sich (Akkusativ) interessieren für + Akkusativ**, **sich (Dativ) etwas merken**. Đừng ghi mỗi “interessieren = quan tâm” rồi bỏ mất phần khung.''',
'''Tìm đối tượng trực tiếp: “rửa ai?” → *mich*; “rửa cái gì?” → *die Hände*, người có tay là *mir*. Với giới từ cố định, kiểm tra riêng đại từ và bổ ngữ giới từ.

Trong Perfekt, các cách dùng phản thân đang học thường dùng haben: *Ich habe mich beeilt*. Đại từ theo chủ ngữ thực tế, không theo danh từ đứng gần nhất.''',
'''- **Ich ziehe mich an. / Ich ziehe mir eine Jacke an.** — Tôi mặc quần áo / Tôi mặc một chiếc áo khoác. Câu sau có *eine Jacke* Akkusativ nên người mặc ở Dativ *mir*.
- **Interessierst du dich für Medizin?** — Bạn có quan tâm y học không? *du → dich*; *für Medizin* là bổ ngữ giới từ.
- **Ich kann mir diese Regel nicht merken.** — Tôi không ghi nhớ được quy tắc này. *mir* Dativ, *diese Regel* Akkusativ; *merken* cuối câu sau modal.
- **Wir haben uns über die Nachricht gefreut.** — Chúng tôi vui vì tin đó. *uns* quy chiếu wir; *über* chỉ điều làm vui đã có.''',
'''1. **Sai:** *Ich wasche mich die Hände.* → **Đúng:** *Ich wasche mir die Hände.* *die Hände* giữ vị trí Akkusativ; người sở hữu dùng Dativ.
2. **Sai:** *Du interessierst sich für Musik.* → **Đúng:** *Du interessierst dich für Musik.* Đại từ phải theo du.
3. **Sai:** *Ich erinnere mir an den Termin.* → **Đúng:** *Ich erinnere mich an den Termin.* *an den Termin* không biến mich thành Dativ.
4. **Sai:** *Ich bin mich beeilt.* → **Đúng:** *Ich habe mich beeilt.* Cấu trúc này tạo Perfekt với haben.''',[
('Ich wasche ___ die Hände.','mir','die Hände là tân ngữ Akkusativ; người có tay là ich nên phản thân Dativ mir. mich làm xuất hiện hai đối tượng trực tiếp sai khung; sich không theo ich.','mich','sich'),
('Du interessierst ___ für Politik.','dich','sich interessieren có phản thân Akkusativ; du → dich. für Politik là bổ ngữ giới từ, không khiến dich đổi thành dir.','dir','sich'),
('Ich erinnere ___ an unser erstes Treffen.','mich','Cấu trúc sich an etwas erinnern dùng phản thân Akkusativ: ich → mich. an unser Treffen là bổ ngữ giới từ, không phải lý do để chọn mir.','mir','sich'),
('Kannst du ___ die Nummer merken?','dir','sich etwas merken: die Nummer là Akkusativ, người ghi nhớ ở Dativ → dir. dich là Akkusativ; sich không theo chủ ngữ du.','dich','sich'),
('Wir haben ___ sehr beeilt.','uns','wir → uns. beeilen dùng phản thân và Perfekt với haben; euch theo ihr, sich theo ngôi ba/Sie.','euch','sich'),
('Ihr müsst ___ jetzt anziehen. (không có tân ngữ quần áo)','euch','ihr → euch; sich anziehen ở đây dùng Akkusativ vì không có tân ngữ quần áo riêng. Hình thức euch giống Dativ nhưng vai trò ở đây là Akkusativ.','uns','sich'),
('Ich ziehe ___ einen warmen Mantel an.','mir','einen warmen Mantel là Akkusativ của anziehen, nên người mặc dùng Dativ mir. mich không phù hợp khung có vật được mặc; mein là từ sở hữu, không phải đại từ phản thân.','mich','mein'),
('Chọn câu Perfekt đúng.','Sie hat sich über das Geschenk gefreut.','sich freuen tạo Perfekt với haben; Partizip II gefreut. sein không dùng cho cấu trúc này; gefreuen không phải dạng Partizip II.','Sie ist sich über das Geschenk gefreut.','Sie hat sich über das Geschenk gefreuen.'),
('Chọn câu phụ đúng với chủ ngữ đại từ.','Er sagt, dass er sich ausruhen muss.','er đứng trước sich; muss là động từ chia cuối câu phụ, ausruhen là nguyên mẫu. Hai phương án khác đều đặt muss sai vị trí trong mệnh đề dass.','Er sagt, dass er muss sich ausruhen.','Er sagt, dass er sich muss ausruhen.'),
('Frau Müller, freuen Sie ___ auf den Urlaub?','sich','Sie lịch sự dùng sich; freuen Sie sich là câu hỏi. mich chỉ ich, euch chỉ ihr. auf den Urlaub diễn tả mong chờ việc sắp tới.','mich','euch')])

lesson(13,'Genitiv trong cụm sở hữu; tách khỏi bài B2 về các giới từ chi phối Genitiv.',
'''**Genitiv biểu thị quan hệ giữa hai cụm danh từ**, thường là sở hữu, nguồn gốc hoặc liên hệ. Trong *die Tür des Hauses*, danh từ trung tâm là *die Tür*; *des Hauses* xác định cửa của cái gì. Cả cụm có thể làm chủ ngữ hoặc tân ngữ, nhưng phần phụ vẫn ở Genitiv.

Tiếng Việt thường đặt “của” giữa hai danh từ. Tiếng Đức dùng hình thức của mạo từ và đôi khi của danh từ: **das Auto des Mannes**. Không biến danh từ trung tâm thành Genitiv chỉ vì trong cụm có quan hệ sở hữu.

Với giống nam/trung số ít, thường có *des/eines* và đuôi *-(e)s* trên danh từ. Giống cái và số nhiều dùng *der/einer* theo cấu trúc nhưng không tự thêm s. Danh từ yếu như *Student* là nhóm riêng: *des Studenten*, không *des Students*.''',
'''### Mạo từ và danh từ
| Nhóm | Xác định | Không xác định |
|---|---|---|
| Maskulin | des Mannes | eines Mannes |
| Feminin | der Frau | einer Frau |
| Neutrum | des Kindes | eines Kindes |
| Plural | der Kinder | không có ein số nhiều; ví dụ einiger Kinder |

### Đuôi danh từ
| Loại | Ví dụ |
|---|---|
| Nam/trung thường | des Autos, des Buches |
| Cái | der Schule, không Schules |
| Số nhiều | der Autos, der Bücher; không thêm đuôi sở hữu riêng |
| Danh từ yếu | des Studenten, des Jungen |

### Tên riêng
| Tên | Sở hữu |
|---|---|
| Anna, Peter | Annas Tasche; Peters Auto |
| tên tận cùng âm s như Max | Max’ Tasche |

Với từ nam/trung, -s/-es có biến thể theo từ và phong cách; nên học cùng từ điển. Không có luật “mọi từ một âm tiết bắt buộc -es”.''',
'''Khẩu quyết: **“Nam–trung: des và đuôi; cái–nhiều: der, không tự thêm s.”** Khi phân tích, khoanh danh từ trung tâm trước: *die Farbe [des Autos]*. Chỉ phần trong ngoặc là Genitiv sở hữu.

Tách ba câu hỏi: **của ai/cái gì? → Genitiv; giống/số nào? → mạo từ; nhóm danh từ nào? → đuôi**. Gặp *Student* phải nhớ nhóm yếu thay vì gắn s.''',
'''Câu hỏi *Wessen?* giúp tìm quan hệ sở hữu: *Wessen Tasche ist das?* Không đồng nhất *der* với Nominativ nam: trong *die Tasche der Frau*, *der* là Genitiv cái.

*von + Dativ* cũng biểu thị sở hữu và phổ biến trong khẩu ngữ, nhất là với tên hoặc cụm dài. Đó là cấu trúc khác: *das Auto von meinem Bruder*. Không trộn *von* với Genitiv. Giới từ như *wegen/trotz* được học riêng để tránh nhầm Genitiv bổ nghĩa danh từ với Genitiv do giới từ.''',
'''- **Die Farbe des neuen Autos gefällt mir.** — Tôi thích màu của chiếc xe mới. *die Farbe* chủ ngữ; *des neuen Autos* Genitiv trung; *mir* Dativ do gefallen.
- **Ich kenne den Bruder meiner Kollegin.** — Tôi biết anh/em trai của đồng nghiệp nữ tôi. *den Bruder* Akkusativ do kennen; *meiner Kollegin* Genitiv cái vẫn giữ nguyên.
- **Die Zimmer der Kinder sind klein.** — Phòng của bọn trẻ nhỏ. *der Kinder* Genitiv số nhiều; không thêm -n chỉ vì thấy der.
- **Das ist Annas Fahrrad.** — Đó là xe đạp của Anna. Tên riêng thêm s, không dùng dấu nháy kiểu tiếng Anh *Anna’s*.''',
'''1. **Sai:** *das Auto des Mann* → **Đúng:** *das Auto des Mannes*. Với danh từ thường nam số ít, chỉ đổi mạo từ là chưa đủ.
2. **Sai:** *die Tasche der Fraus* → **Đúng:** *die Tasche der Frau*. Giống cái không nhận s ở đây.
3. **Sai:** *der Name des Students* → **Đúng:** *der Name des Studenten*. Student thuộc danh từ yếu.
4. **Sai:** *das Auto von meines Bruders* → **Đúng:** *das Auto meines Bruders* hoặc *das Auto von meinem Bruder*. Không ghép hai cơ chế cách vào một cấu trúc.''',[
('Die Tür ___ Hauses ist offen. Điền mạo từ xác định.','des','Haus giống trung; phần sở hữu ở Genitiv → des Hauses. dem là Dativ; das là Nominativ/Akkusativ trung.','dem','das'),
('Das ist die Tasche ___ Frau. (mạo từ xác định)','der','Frau giống cái Genitiv → der Frau, danh từ không thêm s. die là Nominativ/Akkusativ; des dành cho nam/trung số ít.','die','des'),
('Ich kenne den Namen des ___. (Student)','Studenten','Student là danh từ yếu: Genitiv số ít des Studenten. Không dùng Students theo đuôi -s của danh từ thường; Studenten cũng xuất hiện ở các cách khác ngoài Nominativ.','Students','Student'),
('Die Farbe meines ___ gefällt mir. (Auto)','Autos','Auto giống trung thường nhận -s ở Genitiv: meines Autos. Auto chưa có đuôi cần thiết; Auton là đuôi không tồn tại trong cấu trúc này.','Auto','Auton'),
('Chọn cách sở hữu tên Anna trong tiếng Đức.','Annas Fahrrad','Tên Anna nhận -s không có dấu nháy. Anna’s là kiểu thường bị chuyển từ tiếng Anh; Annas Fahrrads làm danh từ trung tâm sai cách trong cụm nhận diện đang hỏi.','Anna’s Fahrrad','Annas Fahrrads'),
('Das ist das Zimmer ___ Kinder.','der','Kinder số nhiều Genitiv → der Kinder. des dùng nam/trung số ít; den thường Dativ số nhiều chứ không biểu thị sở hữu ở đây.','des','den'),
('Chọn câu đúng với von.','Das ist das Auto von meinem Bruder.','von chi phối Dativ → meinem Bruder. meines Bruders là Genitiv không đi sau von; mein Bruder chưa ở Dativ.','Das ist das Auto von meines Bruders.','Das ist das Auto von mein Bruder.'),
('Ich besuche den Vater meiner Freundin. “den Vater” ở cách nào?','Akkusativ','besuchen cần đối tượng Akkusativ nên den Vater. meiner Freundin mới là Genitiv sở hữu; không để quan hệ sở hữu kéo cả cụm trung tâm sang Genitiv.','Genitiv','Dativ'),
('Điền đại từ nghi vấn sở hữu: ___ Tasche ist das?','Wessen','Wessen hỏi của ai và phù hợp cụm sở hữu. Wem hỏi Dativ; Wen hỏi Akkusativ người, không xác định chủ sở hữu của Tasche trong khung này.','Wem','Wen'),
('Chọn cấu trúc đúng với danh từ cái Schule.','der Name der Schule','Genitiv cái dùng der Schule, không thêm -s. des Schule sai giống; der Schules tự thêm đuôi sở hữu sai.','der Name des Schule','der Name der Schules')])
