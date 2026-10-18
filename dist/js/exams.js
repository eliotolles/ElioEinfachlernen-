'use strict';
// Đối chiếu nguồn chính thức ngày 18.10.2026. Đề luyện tự biên soạn.
const EXAMS = {
  "Goethe-A1": {
    "exam": "Goethe",
    "level": "A1",
    "name": "Goethe-Zertifikat A1: Start Deutsch 1",
    "time": "Khoảng 20 phút cho Schreiben",
    "note": "Bản người lớn. Hai phần: điền biểu mẫu và viết tin nhắn ngắn.",
    "source": "https://bfu.goethe.de/a1_sd1/schreiben.php",
    "parts": [
      {
        "teil": 1,
        "name": "Formular ausfüllen",
        "rule": {
          "kind": "fields",
          "label": "Thông tin theo biểu mẫu; không tính số từ"
        },
        "target": null,
        "content": "Ihre Freundin Linh Nguyen wurde am 12. März 1999 geboren. Sie wohnt in der Gartenstraße 18, 10115 Berlin. Sie möchte einen Deutschkurs besuchen. Helfen Sie ihr und ergänzen Sie die Angaben im Formular.",
        "kind": "form",
        "minutes": null,
        "fields": [
          {
            "label": "Vorname",
            "answer": "Linh"
          },
          {
            "label": "Nachname",
            "answer": "Nguyen"
          },
          {
            "label": "Geburtsdatum",
            "answer": "12.03.1999"
          },
          {
            "label": "Straße und Hausnummer",
            "answer": "Gartenstraße 18"
          },
          {
            "label": "Postleitzahl",
            "answer": "10115"
          }
        ]
      },
      {
        "teil": 2,
        "name": "Kurze Nachricht / E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 30 từ"
        },
        "target": 30,
        "content": "Sie möchten im Mai Leipzig besuchen. Schreiben Sie an die Touristeninformation.\n• Nennen Sie den Grund Ihrer Nachricht.\n• Fragen Sie nach Stadtführungen.\n• Bitten Sie um Informationen zu günstigen Hotels.\nSchreiben Sie eine passende Anrede und einen Gruß.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Goethe-A2": {
    "exam": "Goethe",
    "level": "A2",
    "name": "Goethe-Zertifikat A2",
    "time": "30 phút cho cả 2 phần",
    "note": "Mỗi phần xử lý đủ 3 ý. SMS và E-Mail có độ dài khác nhau.",
    "source": "https://bfu.goethe.de/a2_mod_2MX5/schreiben.php",
    "parts": [
      {
        "teil": 1,
        "name": "SMS",
        "rule": {
          "kind": "range",
          "min": 20,
          "max": 30,
          "label": "20–30 từ"
        },
        "target": 25,
        "content": "Sie treffen Ihren Freund Jonas, kommen aber zu spät. Schreiben Sie eine SMS.\n• Entschuldigen Sie sich.\n• Erklären Sie den Grund.\n• Nennen Sie eine neue Uhrzeit und einen Treffpunkt.",
        "kind": "text",
        "minutes": null,
        "fields": []
      },
      {
        "teil": 2,
        "name": "E-Mail",
        "rule": {
          "kind": "range",
          "min": 30,
          "max": 40,
          "label": "30–40 từ"
        },
        "target": 35,
        "content": "Ihre Kollegin Frau Wagner lädt Sie zum Abendessen ein. Schreiben Sie eine E-Mail.\n• Bedanken Sie sich und sagen Sie zu.\n• Informieren Sie, dass Sie später kommen.\n• Fragen Sie, was Sie mitbringen können.\nSchreiben Sie zu allen drei Punkten.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Goethe-B1": {
    "exam": "Goethe",
    "level": "B1",
    "name": "Goethe-Zertifikat B1",
    "time": "60 phút · 20 / 25 / 15 phút",
    "note": "Ba Aufgaben; bài 1 và 3 là E-Mail, bài 2 là ý kiến thảo luận.",
    "source": "https://bfu.goethe.de/b1_mod/schreiben.php",
    "parts": [
      {
        "teil": 1,
        "name": "Informelle E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 80 từ"
        },
        "target": 80,
        "content": "Sie haben einen neuen Kochkurs besucht. Ihre Freundin war nicht dabei.\n• Beschreiben Sie den ersten Kurstag.\n• Begründen Sie, welches Gericht Ihnen besonders gefallen hat.\n• Schlagen Sie einen gemeinsamen Kursbesuch vor.\nSchreiben Sie zu allen drei Punkten. Achten Sie auf Anrede, Einleitung und Schluss.",
        "kind": "text",
        "minutes": 20,
        "fields": []
      },
      {
        "teil": 2,
        "name": "Diskussionsbeitrag",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 80 từ"
        },
        "target": 80,
        "content": "In einem Online-Forum lesen Sie: „Selbst kochen kostet zu viel Zeit. Fertiggerichte sind im Alltag die bessere Lösung.“\nSchreiben Sie Ihre Meinung dazu. Begründen Sie Ihren Standpunkt und schreiben Sie einen zusammenhängenden Diskussionsbeitrag.",
        "kind": "text",
        "minutes": 25,
        "fields": []
      },
      {
        "teil": 3,
        "name": "Formelle Entschuldigung",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 40 từ"
        },
        "target": 40,
        "content": "Ihre Kursleiterin Frau Weber möchte am Dienstag mit Ihnen über Ihren Lernplan sprechen. Sie können nicht kommen.\nSchreiben Sie Frau Weber. Entschuldigen Sie sich höflich und erklären Sie, warum Sie den Termin nicht wahrnehmen können. Vergessen Sie Anrede und Gruß nicht.",
        "kind": "text",
        "minutes": 15,
        "fields": []
      }
    ]
  },
  "Goethe-B2": {
    "exam": "Goethe",
    "level": "B2",
    "name": "Goethe-Zertifikat B2",
    "time": "75 phút cho cả 2 phần",
    "note": "Bài 1: diễn đàn; bài 2: tin nhắn trong bối cảnh trang trọng. Xử lý đủ 4 ý mỗi bài.",
    "source": "https://bfu.goethe.de/b2_mod_2MX6/schreiben.php",
    "parts": [
      {
        "teil": 1,
        "name": "Forumsbeitrag",
        "rule": {
          "kind": "min",
          "min": 150,
          "label": "Ít nhất 150 từ"
        },
        "target": 150,
        "content": "Sie schreiben in einem Forum über nachhaltiges Reisen.\n• Äußern Sie Ihre Meinung zu Flugreisen.\n• Nennen Sie Gründe für die Beliebtheit von Flugreisen.\n• Beschreiben Sie andere Reisemöglichkeiten.\n• Erläutern Sie deren Vorteile.\nDenken Sie an Einleitung und Schluss.",
        "kind": "text",
        "minutes": null,
        "fields": []
      },
      {
        "teil": 2,
        "name": "Formelle Nachricht",
        "rule": {
          "kind": "min",
          "min": 100,
          "label": "Ít nhất 100 từ"
        },
        "target": 100,
        "content": "Sie arbeiten in einer Firma und möchten Ihre Arbeitszeiten ändern. Schreiben Sie Ihrem Vorgesetzten Herrn Berger.\n• Beschreiben Sie Ihre aktuelle Situation.\n• Erklären Sie den Grund für Ihren Wunsch.\n• Zeigen Sie Verständnis für die Situation der Firma.\n• Machen Sie einen konkreten Lösungsvorschlag.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Telc-A1": {
    "exam": "Telc",
    "level": "A1",
    "name": "Start Deutsch 1 / telc Deutsch A1",
    "time": "Lesen + Schreiben: 45 phút dùng chung",
    "note": "Đề mẫu ghi khoảng 20 phút cho Schreiben trong khung Lesen + Schreiben. Không phải 45 phút riêng cho viết.",
    "source": "https://www.telc.net/sprachpruefungen/zertifikatspruefung/deutsch/start-deutsch-1-/-telc-deutsch-a1/",
    "parts": [
      {
        "teil": 1,
        "name": "Formular ausfüllen",
        "rule": {
          "kind": "fields",
          "label": "Thông tin theo biểu mẫu; không tính số từ"
        },
        "target": null,
        "content": "Ihre Freundin Linh Nguyen wurde am 12. März 1999 geboren. Sie wohnt in der Gartenstraße 18, 10115 Berlin. Sie möchte einen Deutschkurs besuchen. Helfen Sie ihr und ergänzen Sie die Angaben im Formular.",
        "kind": "form",
        "minutes": null,
        "fields": [
          {
            "label": "Vorname",
            "answer": "Linh"
          },
          {
            "label": "Nachname",
            "answer": "Nguyen"
          },
          {
            "label": "Geburtsdatum",
            "answer": "12.03.1999"
          },
          {
            "label": "Straße und Hausnummer",
            "answer": "Gartenstraße 18"
          },
          {
            "label": "Postleitzahl",
            "answer": "10115"
          }
        ]
      },
      {
        "teil": 2,
        "name": "Kurze Nachricht / E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 30 từ"
        },
        "target": 30,
        "content": "Sie möchten im Mai Leipzig besuchen. Schreiben Sie an die Touristeninformation.\n• Nennen Sie den Grund Ihrer Nachricht.\n• Fragen Sie nach Stadtführungen.\n• Bitten Sie um Informationen zu günstigen Hotels.\nSchreiben Sie eine passende Anrede und einen Gruß.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Telc-A2": {
    "exam": "Telc",
    "level": "A2",
    "name": "Start Deutsch 2 / telc Deutsch A2",
    "time": "Lesen + Schreiben: 50 phút dùng chung",
    "note": "Không nhầm với telc A2·B1. Phần viết có biểu mẫu và thư ngắn; đề mẫu chọn 3 trong 4 ý.",
    "source": "https://www.telc.net/sprachpruefungen/deutsch/start-deutsch-2-telc-deutsch-a2/",
    "parts": [
      {
        "teil": 1,
        "name": "Formular ausfüllen",
        "rule": {
          "kind": "fields",
          "label": "Thông tin theo biểu mẫu; không tính số từ"
        },
        "target": null,
        "content": "Ihre Freundin Linh Nguyen wurde am 12. März 1999 geboren. Sie wohnt in der Gartenstraße 18, 10115 Berlin. Sie möchte einen Deutschkurs besuchen. Helfen Sie ihr und ergänzen Sie die Angaben im Formular.",
        "kind": "form",
        "minutes": null,
        "fields": [
          {
            "label": "Vorname",
            "answer": "Linh"
          },
          {
            "label": "Nachname",
            "answer": "Nguyen"
          },
          {
            "label": "Geburtsdatum",
            "answer": "12.03.1999"
          },
          {
            "label": "Straße und Hausnummer",
            "answer": "Gartenstraße 18"
          },
          {
            "label": "Postleitzahl",
            "answer": "10115"
          }
        ]
      },
      {
        "teil": 2,
        "name": "Kurzer Brief",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 40 từ"
        },
        "target": 40,
        "content": "Ihr Freund Paul lädt Sie zu einer Feier in Hamburg ein. Antworten Sie ihm. Wählen Sie drei der vier Punkte. Schreiben Sie zu jedem gewählten Punkt ein bis zwei Sätze.\n• jemanden mitbringen\n• ein Geschenk\n• Anreise\n• Übernachtung\nSchreiben Sie circa 40 Wörter mit passendem Anfang und Gruß.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Telc-B1": {
    "exam": "Telc",
    "level": "B1",
    "name": "Zertifikat Deutsch / telc Deutsch B1",
    "time": "30 phút · 1 bài viết",
    "note": "Bản Allgemein, không phải DTZ hoặc telc A2·B1. Xử lý đủ 4 Leitpunkte; không áp số từ tối thiểu do ứng dụng tự đặt.",
    "source": "https://www.telc.net/sprachpruefungen/deutsch/zertifikat-deutsch-telc-deutsch-b1/",
    "parts": [
      {
        "teil": 1,
        "name": "Brief / E-Mail",
        "rule": {
          "kind": "guidance",
          "label": "Theo đề cụ thể; gợi ý luyện tập 100–150 từ, không phải giới hạn chính thức"
        },
        "target": 120,
        "content": "Ihre Freundin Lara schreibt Ihnen: „Ich bin in eine neue Stadt gezogen. Meine Wohnung ist schön, aber ich kenne noch niemanden. Wie kann ich neue Leute kennenlernen? Vielleicht kannst du mich bald besuchen?“\nAntworten Sie Lara und schreiben Sie zu allen vier Punkten.\n• Ihre Reaktion auf den Umzug\n• Tipps zum Kennenlernen neuer Leute\n• Ihre eigenen Erfahrungen\n• ein Vorschlag für einen Besuch\nAchten Sie auf einen passenden Anfang und Schluss.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "Telc-B2": {
    "exam": "Telc",
    "level": "B2",
    "name": "telc Deutsch B2 · Allgemein",
    "time": "30 phút · chọn 1 trong 2 đề A/B",
    "note": "Chỉ viết một bài. Xử lý 3 trong 4 ý, hoặc 2 ý và 1 khía cạnh riêng phù hợp tình huống. Không phải B2 Beruf.",
    "source": "https://www.telc.net/sprachpruefungen/zertifikatspruefung/deutsch/telc-deutsch-b2/",
    "parts": [
      {
        "teil": 1,
        "name": "Halbformelle E-Mail · Wahl A oder B",
        "rule": {
          "kind": "min",
          "min": 150,
          "label": "Ít nhất 150 từ"
        },
        "target": 150,
        "content": "Wählen Sie Aufgabe A ODER B und schreiben Sie nur eine E-Mail. Bearbeiten Sie drei der vier Leitpunkte oder zwei Leitpunkte und einen eigenen, passenden Aspekt.\n\nA · Bitte um Informationen\nEine Sprachschule wirbt mit flexiblen Abendkursen, kleinen Gruppen und Prüfungstraining. Sie möchten einen Kurs buchen.\n• Ihre bisherigen Deutschkenntnisse\n• Ihre Lernziele\n• Fragen zu Terminen und Gruppengröße\n• Fragen zu Kosten und Lernmaterial\n\nB · Beschwerde\nEin Kochkurs versprach kleine Gruppen, frische Zutaten und individuelle Betreuung. Tatsächlich waren 25 Personen dabei, viele Zutaten fehlten und niemand half Ihnen. Schreiben Sie dem Veranstalter.\n• Erwartungen aufgrund der Werbung\n• konkrete Probleme\n• Auswirkungen auf Ihre Teilnahme\n• gewünschte Lösung\n\nSchreiben Sie mindestens 150 Wörter. Denken Sie an Betreff, Anrede und Gruß.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "ÖSD-A1": {
    "exam": "ÖSD",
    "level": "A1",
    "name": "ÖSD Zertifikat A1 · ZA1",
    "time": "20 phút cho cả 2 phần",
    "note": "Điền biểu mẫu và trả lời E-Mail ngắn. Biểu mẫu luyện tập có thể khác số ô trong đề thật.",
    "source": "https://osd.at/portfolio-item/osd-zertifikat-a1-za1/",
    "parts": [
      {
        "teil": 1,
        "name": "Formular ausfüllen",
        "rule": {
          "kind": "fields",
          "label": "Thông tin theo biểu mẫu; không tính số từ"
        },
        "target": null,
        "content": "Ihre Freundin Linh Nguyen wurde am 12. März 1999 geboren. Sie wohnt in der Gartenstraße 18, 10115 Berlin. Sie möchte einen Deutschkurs besuchen. Helfen Sie ihr und ergänzen Sie die Angaben im Formular.",
        "kind": "form",
        "minutes": null,
        "fields": [
          {
            "label": "Vorname",
            "answer": "Linh"
          },
          {
            "label": "Nachname",
            "answer": "Nguyen"
          },
          {
            "label": "Geburtsdatum",
            "answer": "12.03.1999"
          },
          {
            "label": "Straße und Hausnummer",
            "answer": "Gartenstraße 18"
          },
          {
            "label": "Postleitzahl",
            "answer": "10115"
          }
        ]
      },
      {
        "teil": 2,
        "name": "Persönliches E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 30 từ"
        },
        "target": 30,
        "content": "Ihre Freundin Emma schreibt: „Ich freue mich auf deinen Besuch. Wann kommst du? Wie lange bleibst du? Kommst du allein?“\nAntworten Sie Emma. Beantworten Sie alle drei Fragen und schreiben Sie einen Gruß.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "ÖSD-A2": {
    "exam": "ÖSD",
    "level": "A2",
    "name": "ÖSD Zertifikat A2 · ZA2",
    "time": "30 phút · 1 E-Mail",
    "note": "Trả lời các câu hỏi từ thư đầu vào; không dùng cấu trúc SMS + E-Mail của Goethe A2.",
    "source": "https://osd.at/portfolio-item/osd-zertifikat-a2-za2/",
    "parts": [
      {
        "teil": 1,
        "name": "Persönliches Antwort-E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 50 từ"
        },
        "target": 50,
        "content": "Ihr Freund Ben schreibt: „Wie geht es dir? Ich lerne gerade kochen. Was machst du gern in deiner Freizeit? Hast du schon einmal einen Kurs besucht? Was gibt es Neues bei dir? Wann können wir uns treffen?“\nSchreiben Sie Ben circa 50 Wörter. Beantworten Sie alle Fragen und schreiben Sie einen Gruß am Ende.",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  },
  "ÖSD-B1": {
    "exam": "ÖSD",
    "level": "B1",
    "name": "ÖSD Zertifikat B1 · ZB1",
    "time": "60 phút · 20 / 25 / 15 phút",
    "note": "Bản ZB1 cùng định dạng Goethe B1. Không phải ÖSD Zertifikat Deutsch Österreich B1 (ZDÖ B1).",
    "source": "https://osd.at/portfolio-item/osd-zertifikat-b1-zb1/",
    "parts": [
      {
        "teil": 1,
        "name": "Informelle E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 80 từ"
        },
        "target": 80,
        "content": "Sie haben einen neuen Kochkurs besucht. Ihre Freundin war nicht dabei.\n• Beschreiben Sie den ersten Kurstag.\n• Begründen Sie, welches Gericht Ihnen besonders gefallen hat.\n• Schlagen Sie einen gemeinsamen Kursbesuch vor.\nSchreiben Sie zu allen drei Punkten. Achten Sie auf Anrede, Einleitung und Schluss.",
        "kind": "text",
        "minutes": 20,
        "fields": []
      },
      {
        "teil": 2,
        "name": "Diskussionsbeitrag",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 80 từ"
        },
        "target": 80,
        "content": "In einem Online-Forum lesen Sie: „Selbst kochen kostet zu viel Zeit. Fertiggerichte sind im Alltag die bessere Lösung.“\nSchreiben Sie Ihre Meinung dazu. Begründen Sie Ihren Standpunkt und schreiben Sie einen zusammenhängenden Diskussionsbeitrag.",
        "kind": "text",
        "minutes": 25,
        "fields": []
      },
      {
        "teil": 3,
        "name": "Formelle Entschuldigung",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 40 từ"
        },
        "target": 40,
        "content": "Ihre Kursleiterin Frau Weber möchte am Dienstag mit Ihnen über Ihren Lernplan sprechen. Sie können nicht kommen.\nSchreiben Sie Frau Weber. Entschuldigen Sie sich höflich und erklären Sie, warum Sie den Termin nicht wahrnehmen können. Vergessen Sie Anrede und Gruß nicht.",
        "kind": "text",
        "minutes": 15,
        "fields": []
      }
    ]
  },
  "ÖSD-B2": {
    "exam": "ÖSD",
    "level": "B2",
    "name": "ÖSD Zertifikat B2 · ZB2",
    "time": "90 phút cho cả 2 bài",
    "note": "Bài 1: E-Mail trang trọng; bài 2: lập luận/ý kiến, chọn A hoặc B. Độ dài theo Modellsatz đang liên kết.",
    "source": "https://osd.at/portfolio-item/osd-zertifikat-b2-zb2/",
    "parts": [
      {
        "teil": 1,
        "name": "Formelles Beschwerde-E-Mail",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 120 từ"
        },
        "target": 120,
        "content": "Sie haben einen Sprachurlaub gebucht. Die Anzeige versprach: kleine Gruppen, ruhige Unterkunft, täglich vier Stunden Deutsch und Freizeitprogramm. Ihre Notizen: 22 Personen im Kurs; lautes Zimmer; nur zwei Stunden Unterricht; kein Freizeitprogramm.\nSchreiben Sie eine Beschwerde an den Veranstalter. Gehen Sie auf alle Notizen ein, formulieren Sie mit eigenen Worten und beachten Sie Anrede und Gruß. Schreiben Sie circa 120 Wörter.",
        "kind": "text",
        "minutes": null,
        "fields": []
      },
      {
        "teil": 2,
        "name": "Argumentation / Meinungsäußerung · A oder B",
        "rule": {
          "kind": "approx",
          "label": "Khoảng 120 từ"
        },
        "target": 120,
        "content": "Wählen Sie A ODER B. Schreiben Sie circa 120 Wörter.\n\nA · Arbeiten von zu Hause\nAussagen: „Homeoffice spart Zeit.“ – „Ohne Büro fehlt der persönliche Austausch.“\n\nB · Öffentliche Verkehrsmittel\nSchlagzeilen: „Bus und Bahn sollen kostenlos werden.“ – „Wer bezahlt den Ausbau?“\n\nGehen Sie bei Ihrem gewählten Thema auf alle vier Punkte ein:\n• Reaktion auf die Aussagen / Schlagzeilen\n• Ihre Meinung mit Begründung\n• eigene Erfahrungen oder Erfahrungen von Bekannten\n• Situation in Ihrem Land",
        "kind": "text",
        "minutes": null,
        "fields": []
      }
    ]
  }
};
