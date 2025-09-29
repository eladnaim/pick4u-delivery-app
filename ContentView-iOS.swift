import SwiftUI
import SafariServices

struct SafariWebView: UIViewControllerRepresentable {
    let url: URL
    
    func makeUIViewController(context: Context) -> SFSafariViewController {
        print("🦁 SafariWebView: Creating SFSafariViewController")
        let safariVC = SFSafariViewController(url: url)
        safariVC.preferredBarTintColor = UIColor.systemBackground
        safariVC.preferredControlTintColor = UIColor.systemBlue
        return safariVC
    }
    
    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {
        print("🦁 SafariWebView: Safari view controller ready")
    }
}

struct ContentView: View {
    var body: some View {
        SafariWebView(url: URL(string: "https://pick4u-app.vercel.app")!)
            .ignoresSafeArea()
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

/*
הוראות להוספת ATS ל-Info.plist:

1. פתח את Info.plist בפרויקט
2. הוסף את הקוד הבא:

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

זה יאפשר טעינה של HTTP (לא HTTPS) מהשרת המקומי שלך.
*/