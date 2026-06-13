/* Tweaks island for index.html.
   Drives CSS variables on :root that the static HTML's silkworm line reads.
   The panel only appears when the user turns Tweaks on (host protocol lives
   in tweaks-panel.jsx). */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "weavesColor": "#6BBFBE",
  "cradleColor": "#C49A5A"
}/*EDITMODE-END*/;

function applySilkTweaks(t) {
  const r = document.documentElement;
  r.style.setProperty('--silk-weaves', t.weavesColor);
  r.style.setProperty('--silk-cradle', t.cradleColor);
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applySilkTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Silkworm line" />
      <TweakColor
        label="Weaves"
        value={t.weavesColor}
        options={['#6BBFBE', '#84d4d3', '#C49A5A']}
        onChange={(v) => setTweak('weavesColor', v)}
      />
      <TweakColor
        label="Cradle"
        value={t.cradleColor}
        options={['#C49A5A', '#E0B870', '#6BBFBE']}
        onChange={(v) => setTweak('cradleColor', v)}
      />
    </TweaksPanel>
  );
}

// Apply defaults immediately so the styling is correct before the panel opens.
applySilkTweaks(TWEAK_DEFAULTS);

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
