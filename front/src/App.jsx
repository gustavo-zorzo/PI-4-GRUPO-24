import HydroSaveSite from "./hydro_save_frontendsite.jsx";

export default function App() {
  return (
    <div>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', padding:12, fontFamily:'system-ui', fontSize:13 }}>
        ✅ App montou — se continuar branco, veja o Console do navegador (Cmd+Opt+I → Console).
      </div>
      <HydroSaveSite />
    </div>
  );
}
