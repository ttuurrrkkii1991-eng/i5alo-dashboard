const fs = require('fs');
const path = require('path');
const dirs = ['commands', 'colors', 'claimable-roles', 'starboard', 'statistics', 'moderation'];

dirs.forEach(d => {
  const file = path.join(__dirname, 'src/app', d, 'page.tsx');
  if (!fs.existsSync(file)) return;
  
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('globalEnabled') && code.includes('useState(true)')) {
    code = code.replace(/import React, { useState } from 'react';/, "import React, { useState, useEffect } from 'react';");
    
    code = code.replace(/const \[globalEnabled, setGlobalEnabled\] = useState\(true\);/, `const [guildId, setGuildId] = useState<string | null>(null);
    const [globalEnabled, setGlobalEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                }
            });
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(\`/api/features?guildId=\${guildId}\`)
            .then(res => res.json())
            .then(data => {
                if (data.features) {
                    setGlobalEnabled(data.features['${d}'] ?? false);
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const handleToggle = async (enabled: boolean) => {
        setGlobalEnabled(enabled);
        if (!guildId) return;
        try {
            await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, featureId: '${d}', enabled })
            });
        } catch (e) {
            console.error(e);
        }
    };`);
    
    code = code.replace(/<ToggleSwitch enabled={globalEnabled} onChange={setGlobalEnabled} \/>/, "<ToggleSwitch enabled={globalEnabled} onChange={handleToggle} />");
    
    fs.writeFileSync(file, code);
    console.log('Fixed', d);
  }
});
