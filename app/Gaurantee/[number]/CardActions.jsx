'use client'

// The guarantee claim form for a card's page. The claim goes to
// Convex (guaranteeClaims in the Shiv Panel repo) with the card's number and QR secret,
// the same pair that opened the card. Sheets render in a portal so the page's
// fit-to-screen zoom does not shrink them.
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

const MAX_PHOTOS = 3
// Proof the claimant holds the originals, and that the door is this card's door.
const PROOFS = [
  { id: 'card', label: 'Guarantee card', hint: 'The original, front side' },
  { id: 'bill', label: 'Bill', hint: 'The original bill' },
  { id: 'door', label: 'Door with card', hint: 'This card held beside the damaged door' },
]
const CAMERA = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3z" /><circle cx="12" cy="13" r="3.5" /></svg>
const CROSS = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
const ISSUES = [
  { id: 'borer', label: 'Borer', hint: 'Small holes or wood powder' },
  { id: 'air', label: 'Air bubbles', hint: 'Hollow gaps or blistering' },
  { id: 'cracks', label: 'Cracks', hint: 'Splits in the surface or core' },
]

async function convex(url, kind, path, args) {
  const res = await fetch(`${url}/api/${kind}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  const json = await res.json().catch(() => null)
  if (json?.status === 'success') return json.value
  // ConvexError's message arrives in errorData; anything else is not for the customer.
  throw new Error(typeof json?.errorData === 'string' ? json.errorData : 'Something went wrong. Please try again.')
}

/** A phone photo shrunk to 1600px JPEG, so it uploads in seconds on mobile data. */
async function shrink(file) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.82))
    return blob || file
  } catch {
    return file
  }
}

function Sheet({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = before
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return createPortal(
    <div className="gc-sheet-backdrop" onClick={onClose}>
      <div className={`gc-sheet${wide ? ' is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="gc-sheet-head">
          <h3>{title}</h3>
          <button type="button" className="gc-sheet-x" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="gc-sheet-body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

const empty = { name: '', phone: '', email: '', address: '', itemIndex: '', doors: '', issue: '', description: '', agreed: false }

function validate(f, items) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Enter your full name.'
  const digits = f.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a 10-digit mobile number.'
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (f.address.trim().length < 8) e.address = 'Enter your full address.'
  const item = items[Number(f.itemIndex)]
  if (f.itemIndex === '' || !item) e.itemIndex = 'Choose the item.'
  const doors = Number(f.doors)
  if (!Number.isInteger(doors) || doors < 1 || (item?.qty && doors > item.qty)) {
    e.doors = item?.qty ? `Between 1 and ${item.qty}.` : 'Enter how many doors.'
  }
  if (!f.issue) e.issue = 'Choose the issue.'
  if (f.description.trim().length < 10) e.description = 'Describe the issue in a few words (at least 10 characters).'
  if (!f.agreed) e.agreed = 'Please confirm to continue.'
  return e
}

function ClaimForm({ convexUrl, number, token, items, onDone, seller }) {
  const [f, setF] = useState(empty)
  const [photos, setPhotos] = useState([]) // close-ups of the damage: { id, file, url }
  const [proof, setProof] = useState({}) // card | bill | door -> { file, url }
  const target = useRef('damage')
  const [errors, setErrors] = useState({})
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState('')
  const [failure, setFailure] = useState('')
  const pick = useRef(null)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const item = items[Number(f.itemIndex)]

  const latest = useRef({ photos, proof })
  latest.current = { photos, proof }
  useEffect(() => () => {
    latest.current.photos.forEach((p) => URL.revokeObjectURL(p.url))
    Object.values(latest.current.proof).forEach((p) => p && URL.revokeObjectURL(p.url))
  }, [])
  useEffect(() => { if (tried) setErrors(validate(f, items)) }, [f, tried, items])

  function choose(slot) {
    target.current = slot
    if (pick.current) {
      pick.current.multiple = slot === 'damage'
      pick.current.click()
    }
  }
  function picked(list) {
    const files = [...list].filter((file) => file.type.startsWith('image/'))
    if (!files.length) return
    if (target.current === 'damage') return addPhotos(files)
    const slot = target.current
    setProof((p) => {
      if (p[slot]) URL.revokeObjectURL(p[slot].url)
      return { ...p, [slot]: { file: files[0], url: URL.createObjectURL(files[0]) } }
    })
  }
  function removeProof(slot) {
    setProof((p) => {
      if (p[slot]) URL.revokeObjectURL(p[slot].url)
      const { [slot]: _gone, ...rest } = p
      return rest
    })
  }

  function addPhotos(list) {
    const room = MAX_PHOTOS - photos.length
    const next = [...list].filter((file) => file.type.startsWith('image/')).slice(0, room)
      .map((file) => ({ id: `${Date.now()}-${Math.random()}`, file, url: URL.createObjectURL(file) }))
    setPhotos((p) => [...p, ...next])
  }
  function removePhoto(id) {
    setPhotos((p) => {
      const gone = p.find((x) => x.id === id)
      if (gone) URL.revokeObjectURL(gone.url)
      return p.filter((x) => x.id !== id)
    })
  }

  async function submit(e) {
    e.preventDefault()
    setTried(true)
    const errs = validate(f, items)
    for (const p of PROOFS) if (!proof[p.id]) errs[`proof_${p.id}`] = 'Required.'
    if (!photos.length) errs.photos = 'Attach at least one close-up of the damage.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector('.gc-field.has-error, .gc-proof.has-error, .gc-photos.has-error, .gc-check.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setFailure('')
    try {
      const all = [proof.card.file, proof.bill.file, proof.door.file, ...photos.map((p) => p.file)]
      const ids = []
      for (let i = 0; i < all.length; i++) {
        setBusy(`Uploading photo ${i + 1} of ${all.length}`)
        const blob = await shrink(all[i])
        const url = await convex(convexUrl, 'mutation', 'guaranteeClaims:uploadUrl', { number, token })
        const up = await fetch(url, { method: 'POST', headers: { 'Content-Type': blob.type || 'image/jpeg' }, body: blob })
        if (!up.ok) throw new Error('A photo did not upload. Please check your connection and try again.')
        ids.push((await up.json()).storageId)
      }
      const [cardPhoto, billPhoto, doorPhoto, ...damage] = ids
      setBusy('Submitting your claim')
      const { ref } = await convex(convexUrl, 'mutation', 'guaranteeClaims:submit', {
        number, token,
        name: f.name, phone: f.phone, email: f.email, address: f.address,
        itemIndex: Number(f.itemIndex), doors: Number(f.doors), issue: f.issue,
        description: f.description, cardPhoto, billPhoto, doorPhoto, photos: damage, agreed: f.agreed,
      })
      onDone({ ref, phone: f.phone.replace(/\D/g, '').slice(-10) })
    } catch (err) {
      setFailure(err.message)
    } finally {
      setBusy('')
    }
  }

  const err = (k) => (tried && errors[k] ? <span className="gc-err">{errors[k]}</span> : null)
  const cls = (k) => `gc-field${tried && errors[k] ? ' has-error' : ''}`

  return (
    <form className="gc-form" onSubmit={submit} noValidate>
      <p className="gc-form-lead">For card <b>{number}</b>. All fields are required.</p>

      <fieldset>
        <legend><span>1</span>Your details</legend>
        <label className={cls('name')}><span>Full name</span>
          <input value={f.name} onChange={set('name')} autoComplete="name" autoCapitalize="words" enterKeyHint="next" maxLength={80} />{err('name')}</label>
        <div className="gc-row2">
          <label className={cls('phone')}><span>Mobile number</span>
            <input value={f.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel-national" enterKeyHint="next" maxLength={14} />{err('phone')}</label>
          <label className={cls('email')}><span>Email</span>
            <input value={f.email} onChange={set('email')} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" maxLength={120} />{err('email')}</label>
        </div>
        <label className={cls('address')}><span>Address</span>
          <textarea value={f.address} onChange={set('address')} rows={2} autoComplete="street-address" autoCapitalize="words" maxLength={300} />{err('address')}</label>
      </fieldset>

      <fieldset>
        <legend><span>2</span>The issue</legend>
        <div className="gc-row2">
          <label className={cls('itemIndex')}><span>Item</span>
            <select value={f.itemIndex} onChange={set('itemIndex')}>
              <option value="" />
              {items.map((it, i) => <option key={i} value={i}>{it.label}</option>)}
            </select>{err('itemIndex')}</label>
          <label className={cls('doors')}><span>Doors affected</span>
            <input value={f.doors} onChange={(e) => setF((x) => ({ ...x, doors: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
              type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" enterKeyHint="next" />{err('doors')}</label>
        </div>
        <div className={`gc-field${tried && errors.issue ? ' has-error' : ''}`}>
          <span>Type of issue</span>
          <div className="gc-issues" role="radiogroup" aria-label="Type of issue">
            {ISSUES.map((i) => (
              <button type="button" key={i.id} role="radio" aria-checked={f.issue === i.id}
                className={`gc-issue${f.issue === i.id ? ' is-on' : ''}`} onClick={() => setF((x) => ({ ...x, issue: i.id }))}>
                <b>{i.label}</b><small>{i.hint}</small>
              </button>
            ))}
          </div>
          <small className="gc-note">Termite damage is not covered.</small>
          {err('issue')}
        </div>
        <label className={cls('description')}><span>Describe the issue</span>
          <textarea value={f.description} onChange={set('description')} rows={3} maxLength={1000} autoCapitalize="sentences" />
          <small className="gc-count">{f.description.trim().length}/1000</small>{err('description')}</label>
      </fieldset>

      <fieldset>
        <legend><span>3</span>Proof &amp; photos</legend>
        <div className="gc-proofs">
          {PROOFS.map((p) => {
            const got = proof[p.id]
            const bad = tried && errors[`proof_${p.id}`]
            return (
              <div className={`gc-proof${bad ? ' has-error' : ''}`} key={p.id}>
                {got ? (
                  <div className="gc-photo">
                    <img src={got.url} alt={p.label} />
                    <button type="button" onClick={() => removeProof(p.id)} aria-label={`Remove ${p.label}`}>{CROSS}</button>
                  </div>
                ) : (
                  <button type="button" className="gc-photo-add" onClick={() => choose(p.id)}>{CAMERA}<span>Add</span></button>
                )}
                <b>{p.label}</b>
                <small>{p.hint}</small>
              </div>
            )
          })}
        </div>

        <div className="gc-field">
          <span>Close-ups of the damage</span>
          <div className={`gc-photos${tried && errors.photos ? ' has-error' : ''}`}>
            {photos.map((p, i) => (
              <div className="gc-photo" key={p.id}>
                <img src={p.url} alt={`Damage ${i + 1}`} />
                <button type="button" onClick={() => removePhoto(p.id)} aria-label={`Remove damage photo ${i + 1}`}>{CROSS}</button>
              </div>
            ))}
            {Array.from({ length: MAX_PHOTOS - photos.length }, (_, i) => (
              <button type="button" className="gc-photo-add" key={`add-${i}`} onClick={() => choose('damage')}>{CAMERA}<span>Add</span></button>
            ))}
          </div>
          {tried && errors.photos ? <span className="gc-err">{errors.photos}</span> : null}
        </div>
        <input ref={pick} type="file" accept="image/*" hidden onChange={(e) => { picked(e.target.files || []); e.target.value = '' }} />
      </fieldset>

      <label className={`gc-check${tried && errors.agreed ? ' has-error' : ''}`}>
        <input type="checkbox" checked={f.agreed} onChange={set('agreed')} />
        <span>I will present the <b>original guarantee card</b> and the <b>original bill</b> to {seller || 'the seller'} to claim the replacement, and I agree to the terms of this guarantee.</span>
      </label>
      {err('agreed')}

      <div className="gc-form-foot">
        {failure ? <div className="gc-fail" role="alert">{failure}</div> : null}
        <button type="submit" className="gc-submit" disabled={!!busy}>
          {busy ? <><span className="gc-spin" aria-hidden="true" />{busy}…</> : 'Submit claim'}
        </button>
      </div>
    </form>
  )
}

function Submitted({ refNo, phone, onClose, seller }) {
  return (
    <div className="gc-done">
      <svg className="gc-done-tick" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22.5" /><path d="M14.5 24.5 21 31 33.5 17.5" /></svg>
      <h4>Claim submitted</h4>
      <div className="gc-done-ref">{refNo}</div>
      <ol className="gc-next">
        <li>{seller || 'The seller'} will review your claim and contact you on <b>{phone}</b>.</li>
        <li>Present the <b>original guarantee card</b> and the <b>original bill</b> to {seller || 'the seller'}.</li>
        <li>The door is inspected, and the replacement is arranged once the claim is approved.</li>
      </ol>
      <div className="gc-done-ref-note">Keep this claim number for any follow-up.</div>
      <button type="button" className="gc-submit" onClick={onClose}>Done</button>
    </div>
  )
}

// `seller` is the shop's name while a card is in its first 20 days, else empty (neutral).
export default function CardActions({ convexUrl, number, token, items, seller = '' }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(null)
  const router = useRouter()
  const close = useMemo(() => () => {
    setOpen(false)
    if (done) {
      setDone(null)
      router.refresh() // shows the new claim's status on the card
    }
  }, [done, router])

  return (
    <>
      <button type="button" className="gc-btn is-primary gc-claim-btn" onClick={() => setOpen(true)}>Claim guarantee</button>
      {open ? (
        <Sheet title={done ? 'Guarantee claim' : 'Claim guarantee'} onClose={close} wide>
          {done
            ? <Submitted refNo={done.ref} phone={done.phone} onClose={close} seller={seller} />
            : <ClaimForm convexUrl={convexUrl} number={number} token={token} items={items} onDone={setDone} seller={seller} />}
        </Sheet>
      ) : null}
    </>
  )
}
