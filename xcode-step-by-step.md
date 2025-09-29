# מדריך צעד אחר צעד - יצירת אפליקציית iOS עבור Pick4U

## שלב 1: יצירת פרויקט חדש ב-Xcode

1. פתח את Xcode במחשב Mac שלך
2. לחץ על "Create a new Xcode project"
3. בחר **iOS** → **App**
4. לחץ **Next**

### הגדרות הפרויקט:
```
Product Name: Pick4U
Bundle Identifier: com.yourname.pick4u
Language: Swift
Interface: SwiftUI
Use Core Data: ❌ (לא מסומן)
Include Tests: ❌ (לא מסומן)
```

5. לחץ **Next**
6. בחר מיקום לשמירה ולחץ **Create**

---

## שלב 2: החלפת קוד ContentView.swift

1. בניווט השמאלי, לחץ על **ContentView.swift**
2. **מחק את כל התוכן הקיים**
3. **העתק והדבק את הקוד הבא:**

```swift
import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebView(url: URL(string: "http://10.0.0.10:5173")!)
            .ignoresSafeArea(.all)
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        
        // הגדרות נוספות לביצועים טובים יותר
        webView.allowsBackForwardNavigationGestures = true
        webView.configuration.allowsInlineMediaPlayback = true
        webView.configuration.mediaTypesRequiringUserActionForPlayback = []
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("נכשל בטעינת הדף: \(error.localizedDescription)")
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("הדף נטען בהצלחה")
        }
    }
}

#Preview {
    ContentView()
}
```

4. שמור את הקובץ (⌘S)

---

## שלב 3: בדיקת Target Membership

1. עם ContentView.swift עדיין נבחר, פתח את **File Inspector** (⌥⌘1)
2. תחת "Target Membership", ודא שיש ✅ ליד **Pick4U** (שם הפרויקט שלך)
3. אם יש ✅ רק ליד Tests - הסר אותו ושים ✅ ליד הפרויקט הראשי

---

## שלב 4: הוספת הגדרות ATS ל-Info.plist

1. בניווט השמאלי, לחץ על **Info.plist**
2. לחץ על הסימן **+** ליד "Information Property List"
3. הוסף מפתח חדש: **NSAppTransportSecurity** (סוג: Dictionary)
4. לחץ על החץ ליד NSAppTransportSecurity להרחיב
5. לחץ על **+** ליד NSAppTransportSecurity
6. הוסף: **NSExceptionDomains** (סוג: Dictionary)
7. לחץ על החץ ליד NSExceptionDomains להרחיב

### הוסף את הדומיינים הבאים:

**דומיין ראשון:**
1. לחץ **+** ליד NSExceptionDomains
2. הוסף מפתח: **10.0.0.10** (סוג: Dictionary)
3. תחת 10.0.0.10 הוסף:
   - **NSExceptionAllowsInsecureHTTPLoads**: YES (Boolean)
   - **NSExceptionMinimumTLSVersion**: TLSv1.0 (String)

**דומיין שני:**
1. לחץ **+** ליד NSExceptionDomains
2. הוסף מפתח: **localhost** (סוג: Dictionary)
3. תחת localhost הוסף:
   - **NSExceptionAllowsInsecureHTTPLoads**: YES (Boolean)

### או העתק את הקוד XML הבא ישירות:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>10.0.0.10</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.0</string>
        </dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

---

## שלב 5: הוספת אייקונים

1. בניווט השמאלי, לחץ על **Assets.xcassets**
2. לחץ על **AppIcon**
3. גרור את הקבצים הבאים מהתיקייה `public/icons/` למקומות המתאימים:

### מיפוי אייקונים:
```
20pt (2x): icon-40x40.png
20pt (3x): icon-60x60.png
29pt (2x): icon-58x58.png
29pt (3x): icon-87x87.png
40pt (2x): icon-80x80.png
40pt (3x): icon-120x120.png
60pt (2x): icon-120x120.png
60pt (3x): icon-180x180.png
76pt (1x): icon-76x76.png
76pt (2x): icon-152x152.png
83.5pt (2x): icon-167x167.png
1024pt: icon-1024x1024.png
```

---

## שלב 6: בנייה ובדיקה

1. בחר **iPhone 15 Pro** מהסימולטור (למעלה ליד כפתור ה-Run)
2. לחץ על כפתור **▶️ Run** (או ⌘R)
3. האפליקציה תיבנה ותיפתח בסימולטור
4. האפליקציה תטען את האתר שלך מ-http://10.0.0.10:5173

---

## פתרון בעיות נפוצות:

### אם יש שגיאת קומפילציה:
1. **Product** → **Clean Build Folder** (⇧⌘K)
2. **Product** → **Build** (⌘B)

### אם האתר לא נטען:
1. ודא שהשרת רץ על http://10.0.0.10:5173
2. בדוק שהגדרות ATS נוספו נכון ל-Info.plist

### אם האייקונים לא מופיעים:
1. ודא שהקבצים נגררו למקומות הנכונים ב-AppIcon
2. ודא שהקבצים הם PNG ובגדלים הנכונים

---

**הצלחת? האפליקציה רצה בסימולטור?** 🚀