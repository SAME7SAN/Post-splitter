# مقسّم المنشورات لـ Threads · Post Splitter for Threads

![icon](extension/icons/icon-128.png)

إضافة بسيطة لمتصفحات Chrome وFirefox وما يتوافق معها، تقسّم المقال الطويل إلى منشورات متتابعة ضمن حد **500 حرف** في Threads لتنسخها جزءًا بجزء وتنشرها كسلسلة.
A small browser extension that splits a long article into a chain of posts within Threads' **500-character** limit, so you can copy and post them one by one.

## الميزات · Features
- تقسيم ذكي: فاصل الفقرة ← علامات القطع التي تحددها ← أقرب مسافة، بلا قطع للكلمات أو الروابط.
- حدّ قابل للضبط (الافتراضي 480)، والإيموجي يُحسب 4 أحرف.
- ترقيم اختياري `(1/5)`، وتعديل كل جزء يدويًا مع عدّاد حي.
- زر «انسخ الجزء التالي» مع تتبّع ما نُسخ.
- اختصار لوحة المفاتيح: **Alt + C**
- لا بيانات، لا صلاحيات، لا اتصال بالإنترنت.

## التثبيت من المصدر · Install from source
**Chrome / Edge / Brave:** `chrome://extensions` ← فعّل Developer mode ← Load unpacked ← اختر مجلد `extension`.
**Firefox:** `about:debugging#/runtime/this-firefox` ← Load Temporary Add-on ← اختر `extension/manifest.json`.

## التطوير · Development
```bash
node test/splitter.test.js      # اختبار منطق التقسيم
python3 tools/make_icons.py     # إعادة توليد الأيقونات (يتطلب Pillow)
```

## الترخيص · License
MIT — انظر [LICENSE](LICENSE). غير تابعة لشركة Meta أو لمنصة Threads. / Not affiliated with Meta or Threads.
