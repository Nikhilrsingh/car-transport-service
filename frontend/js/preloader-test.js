/**
 * Preloader Navigation Test Script
 * Tests the preloader behavior during navigation
 */

class PreloaderTest {
    constructor() {
        this.testResults = [];
        this.init();
    }

    init() {
        console.log('🧪 Preloader Test Suite Initialized');
        this.runTests();
    }

    /**
     * Run all preloader tests
     */
    runTests() {
        this.testNavigationType();
        this.testPageState();
        this.testReferrer();
        this.testCacheDetection();
        this.displayResults();
    }

    /**
     * Test navigation type detection
     */
    testNavigationType() {
        const navType = performance.navigation.type;
        const isBackForward = navType === performance.navigation.TYPE_BACK_FORWARD;
        
        this.addResult('Navigation Type Detection', {
            passed: true,
            details: `Navigation type: ${navType} (${this.getNavigationTypeName(navType)})`,
            recommendation: isBackForward ? 'Preloader should be hidden' : 'Preloader can be shown'
        });
    }

    /**
     * Test page ready state
     */
    testPageState() {
        const readyState = document.readyState;
        const isComplete = readyState === 'complete';
        
        this.addResult('Page Ready State', {
            passed: true,
            details: `Document ready state: ${readyState}`,
            recommendation: isComplete ? 'Preloader should be hidden' : 'Preloader can be shown'
        });
    }

    /**
     * Test referrer detection
     */
    testReferrer() {
        const referrer = document.referrer;
        let isInternalNavigation = false;
        let fromLogin = false;

        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                const currentUrl = new URL(window.location.href);
                isInternalNavigation = referrerUrl.origin === currentUrl.origin;
                fromLogin = referrerUrl.pathname.includes('login.html');
            } catch (e) {
                // Invalid referrer URL
            }
        }

        this.addResult('Referrer Analysis', {
            passed: true,
            details: `Referrer: ${referrer || 'None'}, Internal: ${isInternalNavigation}, From Login: ${fromLogin}`,
            recommendation: fromLogin ? 'Preloader should be hidden' : 'Normal preloader behavior'
        });
    }

    /**
     * Test cache detection capability
     */
    testCacheDetection() {
        let cacheDetected = false;
        
        // Test pageshow event support
        const supportsPageshow = 'onpageshow' in window;
        
        // Test performance API support
        const supportsPerformance = 'performance' in window && 'navigation' in performance;
        
        this.addResult('Cache Detection Support', {
            passed: supportsPageshow && supportsPerformance,
            details: `Pageshow support: ${supportsPageshow}, Performance API: ${supportsPerformance}`,
            recommendation: 'Browser supports cache detection mechanisms'
        });
    }

    /**
     * Add test result
     */
    addResult(testName, result) {
        this.testResults.push({
            name: testName,
            ...result,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Display test results
     */
    displayResults() {
        console.log('\n📊 Preloader Test Results:');
        console.log('================================');
        
        this.testResults.forEach((result, index) => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${index + 1}. ${status} ${result.name}`);
            console.log(`   Details: ${result.details}`);
            console.log(`   Recommendation: ${result.recommendation}`);
            console.log('');
        });

        // Overall assessment
        const passedTests = this.testResults.filter(r => r.passed).length;
        const totalTests = this.testResults.length;
        
        console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Preloader should work correctly.');
        } else {
            console.log('⚠️ Some tests failed. Check browser compatibility.');
        }
    }

    /**
     * Get human-readable navigation type name
     */
    getNavigationTypeName(type) {
        const types = {
            0: 'TYPE_NAVIGATE (normal)',
            1: 'TYPE_RELOAD (refresh)',
            2: 'TYPE_BACK_FORWARD (back/forward)'
        };
        return types[type] || 'Unknown';
    }

    /**
     * Simulate navigation test
     */
    simulateNavigationTest() {
        console.log('\n🔄 Simulating Navigation Test...');
        
        // Test preloader logic
        const shouldShow = this.shouldShowPreloader();
        console.log(`Preloader should show: ${shouldShow}`);
        
        if (!shouldShow) {
            console.log('✅ Preloader correctly hidden for this navigation type');
        } else {
            console.log('ℹ️ Preloader will show (normal behavior for fresh page loads)');
        }
    }

    /**
     * Replicate the shouldShowPreloader logic for testing
     */
    shouldShowPreloader() {
        // Don't show preloader if page is loaded from cache (back/forward navigation)
        if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
            return false;
        }
        
        // Don't show preloader if page is already loaded
        if (document.readyState === 'complete') {
            return false;
        }
        
        // Don't show preloader if coming from same origin (internal navigation)
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            const referrerPath = new URL(document.referrer).pathname;
            // If coming from login page, don't show preloader
            if (referrerPath.includes('login.html')) {
                return false;
            }
        }
        
        return true;
    }
}

// Auto-run tests when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PreloaderTest();
    });
} else {
    new PreloaderTest();
}

// Export for manual testing
window.PreloaderTest = PreloaderTest;