import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-200 dark:bg-dark-bg p-6 text-center">
          <div className="max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-romantic border border-maroon-300 dark:border-dark-border">
            <span className="text-4xl block mb-4">💔</span>
            <h2 className="font-dancing text-3xl text-maroon-500 dark:text-dark-gold mb-2">Ada Sedikit Kendala</h2>
            <p className="font-lato text-sm text-maroon-700 dark:text-dark-subtext mb-6">
              Terjadi kesalahan kecil pada halaman. Coba muat ulang halaman ya sayang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-maroon-500 hover:bg-maroon-600 text-cream-100 rounded-full font-lato text-sm font-semibold transition-transform hover:scale-105 shadow-md"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
