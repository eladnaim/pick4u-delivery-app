//
//  ContentView.swift
//  pick4u
//
//  Created by eladnaim on 21/09/2025.
//

import SwiftUI
import SafariServices
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            let urlStr = webView.url?.absoluteString ?? "unknown"
            print("[pick4u] Loaded URL: " + urlStr)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let webview = WKWebView(frame: .zero)
        webview.navigationDelegate = context.coordinator
        webview.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        webview.configuration.allowsAirPlayForMediaPlayback = true
        webview.configuration.allowsInlineMediaPlayback = true
        webview.scrollView.bounces = false
        webview.customUserAgent = "pick4u-ios"

        // Clear all web data to avoid stale cache/service workers
        WKWebsiteDataStore.default().removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: Date(timeIntervalSince1970: 0)) {
            let request = URLRequest(url: self.url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 30)
            webview.load(request)
        }
        return webview
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

struct ContentView: View {
    var body: some View {
        // Production server for external access
        WebView(url: URL(string: "https://pick4u-app.vercel.app")!)
            .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
}
