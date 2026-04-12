# خطوات نقل المشروع إلى GitHub 🚀

لرفع هذا المشروع إلى حسابك على GitHub، اتبع الخطوات التالية بدقة:

### 1. إنشاء مستودع على GitHub
- اذهب إلى [GitHub](https://github.com/new).
- قم بتسمية المستودع (مثلاً: `deebdata-trading`).
- اجعله **Public** أو **Private** حسب رغبتك.
- **لا** تقم بإضافة ملف README أو .gitignore أو License.
- اضغط على **Create repository**.

### 2. تهيئة Git في المشروع
افتح الـ Terminal في المجلد الخاص بالمشروع وقم بتشغيل الأوامر التالية:

```bash
# تهيئة مستودع محلي
git init

# إضافة جميع الملفات
git add .

# تسجيل التغييرات (Commit)
git commit -m "Initial commit: Institutional Trading Platform Final Build"

# تعيين الفرع الرئيسي
git branch -M main

# ربط المستودع المحلي بمستودع GitHub (استبدل الرابط برابط مستودعك)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# رفع الملفات
git push -u origin main
```

### 3. ملاحظة هامة حول مفاتيح البيئة (Env Vars)
- تأكد من عدم رفع ملف `.env` إلى GitHub.
- قم بإضافة مفاتيحك (مثل `GEMINI_API_KEY` و `RESEND_API_KEY`) يدوياً في إعدادات GitHub (Secrets) أو في منصة الاستضافة.

---
تم إعداد هذا الدليل بواسطة Hassan Deeb AI Assistant لضمان انتقال سلس للمشروع.
