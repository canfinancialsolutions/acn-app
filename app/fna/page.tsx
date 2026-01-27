return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/can-logo.png" alt="CAN Financial Solutions" className="h-10 w-auto" />
              <div>
                <div className="text-xl font-bold text-blue-800">{pageTitle}</div>
                <div className="text-sm font-semibold text-yellow-500">Protecting Your Tomorrow</div>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors border border-slate-300 bg-transparent text-slate-700"
              onClick={logout}
            >
              Logout ➜]
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {notice && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
            </div>
          )}
        </div>
