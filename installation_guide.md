# دليل تشغيل موقع Manus

## المتطلبات الأساسية
1. Node.js (الإصدار 18 أو أحدث)
2. Python (الإصدار 3.8 أو أحدث)
3. متصفح ويب حديث

## خطوات تشغيل المشروع محلياً

### تشغيل الخلفية (Backend)
1. انتقل إلى مجلد `manus_backend`
```bash
cd manus_backend
```

2. قم بإنشاء بيئة افتراضية Python وتفعيلها
```bash
python -m venv venv
source venv/bin/activate  # على Linux/Mac
# أو
venv\Scripts\activate  # على Windows
```

3. قم بتثبيت المكتبات المطلوبة
```bash
pip install flask flask-cors openai
```

4. قم بتشغيل الخادم
```bash
python src/main.py
```
سيعمل الخادم على المنفذ 5000 (http://localhost:5000)

### تشغيل الواجهة الأمامية (Frontend)
1. في نافذة طرفية جديدة، انتقل إلى مجلد `manus_frontend`
```bash
cd manus_frontend
```

2. قم بتثبيت المكتبات المطلوبة
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

3. قم بتشغيل خادم التطوير
```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
```
ستعمل الواجهة الأمامية على المنفذ 5173 (http://localhost:5173)

4. افتح المتصفح وانتقل إلى http://localhost:5173

## رفع الموقع على منصة استضافة

### رفع الخلفية (Backend)
يمكن رفع الخلفية على منصات مثل Heroku أو Render أو Railway:

1. قم بإنشاء ملف `requirements.txt` في مجلد `manus_backend` يحتوي على:
```
flask==3.1.0
flask-cors==6.0.0
openai==1.82.0
```

2. قم بإنشاء ملف `Procfile` (بدون امتداد) في مجلد `manus_backend` يحتوي على:
```
web: gunicorn src.main:app
```

3. قم بتثبيت gunicorn:
```bash
pip install gunicorn
```

4. اتبع تعليمات منصة الاستضافة التي اخترتها لرفع التطبيق.

### رفع الواجهة الأمامية (Frontend)
يمكن رفع الواجهة الأمامية على منصات مثل Netlify أو Vercel أو GitHub Pages:

1. قم ببناء نسخة الإنتاج:
```bash
cd manus_frontend
npm run build
# أو
yarn build
# أو
pnpm build
```

2. سيتم إنشاء مجلد `dist` يحتوي على ملفات الموقع الثابتة.

3. قم برفع محتويات مجلد `dist` على منصة الاستضافة التي اخترتها.

4. تأكد من تحديث عنوان API الخلفية في ملف `App.tsx` ليشير إلى عنوان الخلفية المستضافة بدلاً من `localhost`.

## ملاحظات هامة
- تأكد من تكوين CORS بشكل صحيح في الخلفية للسماح بالاتصال من الواجهة الأمامية المستضافة.
- في بيئة الإنتاج، يجب استبدال مفتاح API المحاكي بمفتاح OpenAI حقيقي.
- تأكد من حماية مفتاح API باستخدام متغيرات البيئة وليس بتضمينه مباشرة في الكود.

## استكشاف الأخطاء وإصلاحها
- إذا واجهت مشكلة في الاتصال بين الواجهة الأمامية والخلفية، تأكد من أن الخلفية تعمل وأن عنوان API صحيح.
- إذا ظهرت أخطاء CORS، تأكد من تكوين CORS بشكل صحيح في الخلفية.
- للمزيد من المعلومات حول استخدام الموقع، راجع ملف `user_guide.md`.
