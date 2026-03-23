const features = ["Inscription gratuite", "Accès immédiat au dashboard", "Support communautaire"];

function Quote() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
      <p className="text-white text-sm leading-relaxed">
        Démarrez votre projet en moins de 5 minutes avec notre starter kit.
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
      <div className="bg-white rounded-2xl p-5 shadow-xl w-60">
        <p className="text-xs font-medium text-indigo-600 mb-2">Nouveau membre</p>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex
              items-center justify-center text-white text-sm font-bold"
          >
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Utilisateur</p>
            <p className="text-xs text-gray-400">Compte créé avec succès</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Actif maintenant</span>
        </div>
      </div>

      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-52 border border-white/20">
        <p className="text-white/80 text-xs font-medium mb-1">Comptes créés</p>
        <p className="text-white text-2xl font-bold">12 493</p>
        <p className="text-white/50 text-[10px] mt-1">+124 cette semaine</p>
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

export function SignUpDecoPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-linear-to-br from-indigo-600
        via-violet-600 to-purple-700"
    >
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative w-full flex flex-col justify-between p-12">
        <Quote />
        <StatCards />
        <FeatureList />
      </div>
    </div>
  );
}
