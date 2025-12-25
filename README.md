<!-- # Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->
# מערכת Helpdesk לניהול קריאות שירות

מערכת מלאה לניהול פניות ותקלות (Ticketing System) שנכתבה ב-React.
המערכת מאפשרת ללקוחות לפתוח קריאות, לסוכנים לטפל בהן, ולמנהלים לקבל תמונת מצב מלאה ונתונים סטטיסטיים.

---

## 🚀 הוראות התקנה והרצה

### דרישות קדם
* **Node.js**: גרסה 14 ומעלה.
* **Backend Server**: יש לוודא ששרת ה-API רץ ברקע על פורט **4000**.
  (שרת ה-API זמין בכתובת: https://github.com/sarataber/helpdesk-api)

### צעדים להרצה
1. פתח את הטרמינל בתיקיית הפרויקט.
2. התקן את הספריות הנדרשות:
   ```bash
   npm install
הרץ את הפרויקט:

Bash

npm start
פתח את הדפדפן בכתובת: http://localhost:3000

👥 תפקידים והרשאות (Role-Based Access Control)
המערכת מנהלת גישה חכמה המבוססת על תפקיד המשתמש (JWT Claims):

1. לקוח (Customer)
הרשמה עצמית: יכול ליצור חשבון חדש במערכת.

פתיחת קריאות: טופס ייעודי לפתיחת קריאה עם נושא, דחיפות ותיאור.

צפייה בפרטי: רואה אך ורק את הקריאות שהוא פתח.

מעקב: יכול להיכנס לפרטי קריאה ולראות סטטוס ותגובות.

תגובות: יכול להוסיף תגובות לקריאות פתוחות.

2. סוכן תמיכה (Agent)
ניהול משימות: רואה אך ורק את הקריאות שהוקצו לטיפולו (או קריאות ללא שיוך, בהתאם להגדרה).

עדכון סטטוס: יכול לשנות סטטוס קריאה (Open -> In Progress -> Resolved).

תקשורת: יכול להוסיף תגובות פנימיות או תשובות ללקוח בתוך הטיקט.

3. מנהל מערכת (Admin)
שליטה מלאה: גישה לכל הקריאות במערכת ללא סינון.

ניהול משתמשים:

צפייה ברשימת לקוחות וסוכנים.

הוספת סוכנים ומנהלים חדשים למערכת.

ניהול הגדרות: הוספת סטטוסים ורמות דחיפות דינמית.

דאשבורד ניהולי (Analytics):

צפייה בנתוני SLA (חריגות זמנים).

גרפים וסטטיסטיקות ביצועי סוכנים.

ייצוא דוחות ל-PDF ול-CSV.

הקצאת משימות: יכול לשייך קריאות לסוכנים ספציפיים.

🛠 טכנולוגיות וספריות
הפרויקט נבנה באמצעות הטכנולוגיות המודרניות ביותר בעולם ה-React:

React 18: שימוש ב-Functional Components ו-Hooks בלבד (useState, useEffect, useMemo).

Redux Toolkit: ניהול State גלובלי מתקדם (Store, Slices) לניהול משתמשים (authSlice) וטיקטים (ticketSlice).

React Router DOM v6: ניהול ניווט צד-לקוח, כולל Protected Routes למניעת גישה לדפים ללא הרשאה מתאימה.

Axios + Interceptors: ניהול קריאות לשרת עם הזרקה אוטומטית של טוקן ה-JWT בכל בקשה (axiosInstance).

jsPDF / jspdf-autotable: מחולל דוחות PDF בצד הלקוח (עבור דוחות מנהל).

CSS Modules / Inline Styles: עיצוב רספונסיבי ונקי.

📂 מבנה הפרויקט
src/
├── api/              # הגדרות Axios וכתובת שרת
├── components/       # רכיבים לשימוש חוזר (אם יש)
├── pages/            # מסכי המערכת המרכזיים
│   ├── Login.js      # התחברות
│   ├── Dashboard.js  # לוח בקרה ראשי
│   ├── TicketList.js # טבלאות סינון ומיון מתקדמות
│   ├── TicketDetails.js # מסך טיפול בקריאה
│   └── Admin...      # מסכי ניהול
├── store/            # ניהול Redux (Slices)
└── App.js            # הגדרת ראוטים ו-Guards
✨ פיצ'רים מיוחדים
סינון חכם: מנגנון סינון כפול (Client-side) ב-TicketList המבטיח שלקוח לא יראה מידע של אחרים.

התראות: אינדיקציה ויזואלית לקריאות שחורגות מ-48 שעות ללא מענה.

ייצוא נתונים: המנהל יכול להוריד נתוני ביצועים בלחיצת כפתור.

ממשק אדפטיבי: התפריטים והכפתורים משתנים אוטומטית לפי תפקיד המשתמש המחובר.