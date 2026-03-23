const features = ["Authentification sécurisée", "Dashboard temps réel", "Gestion des rôles"];

function Quote() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
      <p className="text-white text-sm leading-relaxed">
        La plateforme la plus rapide pour lancer votre prochain projet.
      </p>
      <div className="flex items-center gap-2.5 mt-4">
        <div
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white
            text-xs font-bold"
        >
          K
        </div>
        <div>
          <p className="text-white text-xs font-medium">Kickstart Team</p>
          <p className="text-white/50 text-[10px]">Next.js Starter Kit</p>
        </div>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 shadow-xl w-56">
        <p className="text-xs font-medium text-emerald-600 mb-1">Sessions actives</p>
        <p className="text-2xl font-bold text-gray-900">2 847</p>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full" />
        </div>
      </div>

      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-48 border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-white/80 text-xs font-medium">Système opérationnel</span>
        </div>
        <p className="text-xs text-white/60">Tous les services fonctionnent</p>
      </div>
    </div>
  );
}

function FeatureList() {
  return (
    <div className="space-y-2.5">
      {features.map((f) => (
        <div key={f} className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0"
          >
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-white/70 text-sm">{f}</span>
        </div>
      ))}
    </div>
  );
}

export function AuthDecoPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-linear-to-br from-emerald-600
        via-teal-600 to-cyan-700"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative w-full flex flex-col justify-between p-12">
        <Quote />
        <StatCards />
        <FeatureList />
      </div>
    </div>
  );
}
