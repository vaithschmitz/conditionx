
export default function OverviewPage() {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-text">Training Cockpit</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Activity by Type</h2>
            <p className="text-sm text-text-muted">Distribution across training categories.</p>
          </div>
  
          <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">RPE vs Fatigue</h2>
            <p className="text-sm text-text-muted">Compare perceived exertion to fatigue trends.</p>
          </div>
  
          <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Time Breakdown</h2>
            <p className="text-sm text-text-muted">How you're spending your training time.</p>
          </div>
        </div>
      </div>
    );
  }
  