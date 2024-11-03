// File path: /Components/Footer.js

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                    <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                        Terms of Service
                    </a>
                    <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                        Privacy Policy
                    </a>
                    {/* Add more links as needed */}
                </div>
            </div>
        </footer>
    );
}
