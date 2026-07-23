const fs = require('fs');
const path = require('path');
const dirs = ['commands', 'colors', 'starboard', 'moderation'];

dirs.forEach(d => {
  const file = path.join(__dirname, 'src/app', d, 'page.tsx');
  if (!fs.existsSync(file)) return;
  
  let code = fs.readFileSync(file, 'utf8');

  // Replace CommandRow definition
  const oldCommandRow = `const CommandRow = ({ name, description, defaultEnabled = true }: any) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#2b2d31]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <ToggleSwitch enabled={enabled} onChange={setEnabled} />
                <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                    تعديل
                </button>
            </div>
            <div className="text-left flex flex-col items-end">
                <h3 className="text-white font-bold text-lg mb-1">{name}/</h3>
                <p className="text-gray-400 text-sm text-right" dir="rtl">{description}</p>
            </div>
        </div>
    );
};`;

  const newCommandRow = `const CommandRow = ({ name, description, guildId, initialFeatures }: any) => {
    const featureKey = \`cmd_\${name.replace(/ /g, '_')}\`;
    const [enabled, setEnabled] = useState(initialFeatures[featureKey] ?? true);

    const handleToggle = async (newVal: boolean) => {
        setEnabled(newVal);
        if (!guildId) return;
        try {
            await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, featureId: featureKey, enabled: newVal })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-[#2b2d31]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <ToggleSwitch enabled={enabled} onChange={handleToggle} />
                <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                    تعديل
                </button>
            </div>
            <div className="text-left flex flex-col items-end">
                <h3 className="text-white font-bold text-lg mb-1">{name}/</h3>
                <p className="text-gray-400 text-sm text-right" dir="rtl">{description}</p>
            </div>
        </div>
    );
};`;

  if (code.includes('const CommandRow = ({ name, description, defaultEnabled = true }: any) => {')) {
    code = code.replace(oldCommandRow, newCommandRow);
    
    // Add featuresData state
    code = code.replace(/const \[loading, setLoading\] = useState\(true\);/, `const [loading, setLoading] = useState(true);
    const [featuresData, setFeaturesData] = useState<any>({});`);

    // Update fetch inside useEffect
    code = code.replace(
      `setGlobalEnabled(data.features['${d}'] ?? false);`,
      `setGlobalEnabled(data.features['${d}'] ?? false);
                    setFeaturesData(data.features);`
    );

    // Update all <CommandRow ... /> calls to include guildId and initialFeatures
    code = code.replace(/<CommandRow name="([^"]+)" description="([^"]+)" \/>/g, 
      '<CommandRow name="$1" description="$2" guildId={guildId} initialFeatures={featuresData} />');

    fs.writeFileSync(file, code);
    console.log('Fixed CommandRows in', d);
  } else {
    console.log('Could not find CommandRow signature in', d);
  }
});
