// Public guarantee-card view. This is the target of the QR printed on Shiv
// Hardware guarantee cards: https://www.shivhardware.store/Gaurantee/GC-2026-XXXX
// It fetches the card from Convex and shows a clean, mobile-first summary
// (customer, Aadhaar, phone, guaranteed items). Rendered per-request so newly
// printed cards resolve immediately, with no rebuild.

export const dynamic = 'force-dynamic'

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://sensible-panther-176.convex.cloud'

// The QR is .../Gaurantee/<number>?k=<token>. Convex only opens a card when the
// number AND its secret token match (cards carry Aadhaar + mobile, and numbers
// are sequential), so the token must be passed through — without it every scan
// is "Card not found".
//
// Returns every card the QR opens -- usually one. Cards printed before
// 2026-10-02 in a two-card tray pass share one QR, so both come back.
async function getGuarantees(number, token) {
  if (!token) return []
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'documents:getGuaranteesForQr',
        args: { number, token },
        format: 'json',
      }),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = await res.json()
    if (json.status !== 'success' || !Array.isArray(json.value)) return []
    // Convex stores the full payload under `document`; flatten it up.
    return json.value.map(v => (v.document && typeof v.document === 'object' ? { ...v, ...v.document } : v))
  } catch {
    return []
  }
}

function fmtDim(d) {
  if (!d || (!d.inches && !d.soot)) return ''
  return d.soot > 0 ? `${d.inches || 0} ${d.soot}/8"` : `${d.inches}"`
}
function fmtSize(h, w) {
  const a = fmtDim(h)
  const b = fmtDim(w)
  return a && b ? `${a} × ${b}` : a || b || ''
}

export async function generateMetadata({ params }) {
  const { number } = await params
  return {
    title: `Guarantee Card ${number} — Shiv Hardware Store`,
    robots: { index: false, follow: false },
  }
}

const styles = `
  .gc-wrap { max-width: 620px; margin: 0 auto; padding: 14px; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #1c1917; }
  .gc-head { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 10px; margin: -14px -14px 14px; padding: 12px 16px; background: #0d6e3f; color: #fff; }
  .gc-head h1 { margin: 0; font-size: 16px; line-height: 1.2; flex: 1; font-weight: 700; }
  .gc-head h1 small { display: block; font-size: 11px; font-weight: 400; opacity: .85; }
  .gc-tag { background: #fff; color: #0d6e3f; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; white-space: nowrap; }
  .gc-card { background: #fff; border: 1px solid #eee7db; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,.06); padding: 14px 16px; margin-bottom: 12px; }
  .gc-card h2 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #0d6e3f; font-weight: 700; }
  .gc-name { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
  .gc-kv { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-top: 1px solid #f0ede7; }
  .gc-kv:first-of-type { border-top: 0; }
  .gc-kv .k { font-size: 12px; color: #78716c; width: 84px; flex-shrink: 0; text-transform: uppercase; letter-spacing: .03em; font-weight: 600; }
  .gc-kv .v { font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; word-break: break-word; }
  .gc-kv .v a { color: inherit; text-decoration: none; }
  .gc-item { display: flex; align-items: center; gap: 10px; padding: 11px 0; border-top: 1px solid #f0ede7; }
  .gc-item:first-of-type { border-top: 0; }
  .gc-item-info { flex: 1; min-width: 0; }
  .gc-item-info .brand { font-weight: 700; font-size: 15px; }
  .gc-item-info .sub { font-size: 13px; color: #78716c; margin-top: 2px; }
  .gc-item-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .gc-badge { background: #eaf3ee; color: #0d6e3f; font-weight: 700; font-size: 12px; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
  .gc-qty { font-size: 13px; color: #57534e; }
  .gc-amt { font-weight: 700; font-size: 14px; }
  .gc-total { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 2px solid #1c1917; font-weight: 700; font-size: 16px; }
  .gc-empty { color: #a8a29e; font-size: 14px; padding: 6px 0; }
  .gc-muted { text-align: center; color: #a8a29e; font-size: 11px; margin: 18px 0 24px; }
  .gc-miss { text-align: center; padding: 40px 20px; color: #57534e; }
  .gc-miss h2 { color: #1c1917; margin: 0 0 8px; }
`

export default async function GuaranteePage({ params, searchParams }) {
  const { number } = await params
  const { k } = (await searchParams) ?? {}
  const docs = await getGuarantees(number, typeof k === 'string' ? k.trim() : '')

  if (!docs.length) {
    return (
      <div className="gc-wrap">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="gc-head"><h1>Shiv Hardware<small>Online Guarantee Card</small></h1><span className="gc-tag">{number}</span></div>
        <div className="gc-miss">
          <h2>Card not found</h2>
          <p>No guarantee card matches <b>{number}</b>. It may have been printed from a different computer — please ask at the shop.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gc-wrap">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="gc-head">
        <h1>Shiv Hardware<small>Online Guarantee Card</small></h1>
        <span className="gc-tag">{docs[0].number || number}</span>
      </div>
      {docs.length > 1 ? <p className="gc-muted" style={{ margin: '0 0 12px' }}>This QR covers {docs.length} cards printed together.</p> : null}
      {docs.map((doc, i) => <CardView key={doc._id || i} doc={doc} />)}
    </div>
  )
}

function CardView({ doc }) {
  const cust = doc.customer || {}
  const items = Array.isArray(doc.items) ? doc.items : []
  const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0)
  const dateStr = doc.date ? new Date(doc.date).toLocaleDateString('en-GB') : ''

  return (
    <>
      <div className="gc-card">
        <div className="gc-name">{cust.name || '—'}</div>
        <div className="gc-kv"><span className="k">Aadhaar</span><span className="v">{cust.uid || 'N/A'}</span></div>
        <div className="gc-kv"><span className="k">Phone</span><span className="v">{cust.mobile ? <a href={`tel:${cust.mobile}`}>{cust.mobile}</a> : 'N/A'}</span></div>
        {dateStr ? <div className="gc-kv"><span className="k">Date</span><span className="v">{dateStr}</span></div> : null}
      </div>

      <div className="gc-card">
        <h2>Items</h2>
        {items.length ? items.map((it, i) => {
          const size = fmtSize(it.height, it.width)
          const gy = Number(it.guaranteeYears) || 0
          const sub = [it.thickness || '', size].filter(Boolean).join(' · ')
          return (
            <div className="gc-item" key={i}>
              <div className="gc-item-info">
                <div className="brand">{it.brandName || '—'}</div>
                {sub ? <div className="sub">{sub}</div> : null}
              </div>
              <div className="gc-item-meta">
                {gy > 0 ? <span className="gc-badge">{gy} yr</span> : null}
                {it.qty ? <span className="gc-qty">{it.qty} pc</span> : null}
                {Number(it.amount) ? <span className="gc-amt">₹{Math.round(Number(it.amount))}</span> : null}
              </div>
            </div>
          )
        }) : <div className="gc-empty">No items listed on this card.</div>}
        {total > 0 ? <div className="gc-total"><span>Total</span><span>₹{Math.round(total)}</span></div> : null}
      </div>
    </>
  )
}
