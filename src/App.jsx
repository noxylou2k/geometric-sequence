import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const LETTERS = [
  { char: 'W', color: '#ff6b6b', rot: '-7deg' },
  { char: 'e', color: '#ffe34d', rot: '5deg' },
  { char: 'l', color: '#2dd4bf', rot: '-4deg' },
  { char: 'c', color: '#c4b5fd', rot: '6deg' },
  { char: 'o', color: '#fffdf8', rot: '-5deg' },
  { char: 'm', color: '#ff8fab', rot: '4deg' },
  { char: 'e', color: '#7dd3fc', rot: '-2deg' },
]

const DOTS = ['#ff6b6b', '#8b5cf6', '#2dd4bf', '#ffe34d', '#f5b942', '#ff8fab']

function formatNum(value) {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs >= 1e9 || abs < 1e-4)) {
    return value.toExponential(3)
  }
  const rounded = Math.round((value + Number.EPSILON) * 1e6) / 1e6
  if (Object.is(rounded, -0)) return '0'
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 })
}

function buildSequence(first, ratio, count) {
  const terms = Array.from({ length: count }, (_, index) => first * ratio ** index)
  const sum =
    ratio === 1 ? first * count : (first * (1 - ratio ** count)) / (1 - ratio)
  return { terms, sum, nth: terms[count - 1], first, ratio, count }
}

function readSequence(firstRaw, ratioRaw, countRaw) {
  const firstText = firstRaw.trim()
  const ratioText = ratioRaw.trim()
  const countText = countRaw.trim()
  const first = Number(firstText)
  const ratio = Number(ratioText)
  const count = Number(countText)

  if (firstText === '' || ratioText === '' || countText === '') {
    return { error: 'Enter a first term, a common ratio, and how many terms you want.' }
  }
  if (!Number.isFinite(first) || !Number.isFinite(ratio) || !Number.isFinite(count)) {
    return { error: 'Use regular numbers only.' }
  }
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    return { error: 'Use a whole number of terms from 1 to 20 for this draft.' }
  }

  const sequence = buildSequence(first, ratio, count)
  const tooBig =
    sequence.terms.some((term) => !Number.isFinite(term)) || !Number.isFinite(sequence.sum)
  if (tooBig) {
    return { error: 'Those values get too large. Try a smaller ratio or fewer terms.' }
  }
  return { sequence }
}

function SparkMark() {
  return (
    <svg viewBox="0 0 64 64" className="spark-mark" aria-hidden="true">
      <path
        fill="currentColor"
        d="M32 6 36.2 24.6 54 28.2 36.2 33.4 32 52 27.8 33.4 10 28.2 27.8 24.6Z"
      />
      <path
        fill="currentColor"
        d="M50 8 51.6 14 57 15.4 51.6 17 50 23 48.4 17 43 15.4 48.4 14Z"
      />
      <path
        fill="currentColor"
        d="M15 36 16.3 41 21 42.2 16.3 43.5 15 48.5 13.7 43.5 9 42.2 13.7 41Z"
      />
    </svg>
  )
}

function Welcome({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onDone()
      return
    }
    setLeaving(true)
    window.setTimeout(onDone, 460)
  }, [onDone])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(finish, reduce ? 700 : 2700)
    return () => window.clearTimeout(timer)
  }, [finish])

  return (
    <div
      className={leaving ? 'welcome leaving' : 'welcome'}
      onClick={finish}
    >
      <p className="kicker">Geometric Sequence</p>
      <h1 className="welcome-word" aria-label="Welcome">
        {LETTERS.map((letter, index) => (
          <span
            key={`${letter.char}-${index}`}
            className="letter"
            style={{
              '--rot': letter.rot,
              '--d': `${index * 0.09}s`,
              background: letter.color,
            }}
          >
            {letter.char}
          </span>
        ))}
      </h1>
      <p className="welcome-sub">A flat, bold way to build the pattern.</p>
      <button
        type="button"
        className="skip"
        onClick={(event) => {
          event.stopPropagation()
          finish()
        }}
      >
        Skip
      </button>
    </div>
  )
}

function Home({ onStart, onSlope }) {
  return (
    <section className="home">
      <div className="decor" aria-hidden="true">
        <div className="stack">
          <div className="stack-btn red">
            <SparkMark />
            <span>a first term</span>
          </div>
          <div className="stack-btn purple">
            <span className="mini-ico">↗</span>
            <span>r common ratio</span>
          </div>
          <div className="stack-btn teal">
            <span className="mini-ico">✦</span>
            <span>n how many</span>
          </div>
        </div>

        <span className="float orange" />
        <span className="float diamond" />

        <article className="pattern-card">
          <div className="pattern-title">
            <span className="bolt">✦</span>
            Next term
          </div>
          <span className="skel" />
          <span className="skel short" />
        </article>

        <div className="pink" />
        <div className="success">
          <span className="check">✓</span>
          Sum ready
        </div>
        <div className="avatars">
          <span>2</span>
          <span>6</span>
          <span>18</span>
          <span>+n</span>
        </div>

        <div className="tabs">
          <span className="on">a</span>
          <span>ar</span>
          <span>ar²</span>
        </div>

        <aside className="panel-yellow">
          <div className="switch-list">
            <div>
              <span className="switch on" />
              <span>r &gt; 1</span>
            </div>
            <div>
              <span className="switch" />
              <span>r = 1</span>
            </div>
            <div>
              <span className="tick">✓</span>
              <span>Finite n</span>
            </div>
          </div>
          <div className="formula-bar">
            <span>
              a<sub>n</sub> = a · r<sup>n−1</sup>
            </span>
          </div>
        </aside>

        <div className="menu">
          <div className="menu-head">
            Terms <span>▾</span>
          </div>
          <div>a₁ First</div>
          <div>a₂ Second</div>
          <div>a₃ Third</div>
          <div>a₄ Fourth</div>
        </div>

        <div className="bars">
          <div className="bar">
            <span className="fill red" style={{ width: '78%' }} />
          </div>
          <div className="bar">
            <span className="fill purple" style={{ width: '58%' }} />
          </div>
          <div className="bar">
            <span className="fill teal" style={{ width: '88%' }} />
          </div>
        </div>
        <span className="float yellow-sq" />
      </div>

      <div className="hero">
        <div className="dots" aria-hidden="true">
          {DOTS.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
        <span className="tiny-star" aria-hidden="true">
          ✦
        </span>
        <div className="badge" aria-hidden="true">
          <SparkMark />
        </div>
        <h1>
          Geometric
          <br />
          Sequence
        </h1>
        <p className="lede">Each term multiplies the last by the same ratio.</p>
        <div className="pills">
          <span>First term</span>
          <span className="purple">Common ratio</span>
          <span className="teal">nth term</span>
          <span className="yellow">Finite sum</span>
        </div>
        <div className="home-actions">
          <button type="button" className="start" onClick={onStart}>
            Start
          </button>
          <button type="button" className="start slope" onClick={onSlope}>
            Slope Intercept
          </button>
        </div>
        <p className="tag">First term · Common ratio · Finite sum</p>
        <div className="mini-row" aria-hidden="true">
          <span>▶</span>
          <span>↓</span>
          <span>+</span>
          <span>♥</span>
        </div>
      </div>
    </section>
  )
}

const FIELD_LABEL = {
  a: 'first term',
  r: 'common ratio',
  n: 'number of terms',
}

function CalculatorDraft({ onBack }) {
  const [dark, setDark] = useState(false)
  const [field, setField] = useState('a')
  const [first, setFirst] = useState('2')
  const [ratio, setRatio] = useState('3')
  const [count, setCount] = useState('5')
  const [replaceNext, setReplaceNext] = useState(true)
  const [showSum, setShowSum] = useState(false)
  const [error, setError] = useState('')
  const [sequence, setSequence] = useState(() => buildSequence(2, 3, 5))

  const values = { a: first, r: ratio, n: count }
  const setters = { a: setFirst, r: setRatio, n: setCount }

  function dirty(name, value) {
    setters[name](value)
    setError('')
    setShowSum(false)
  }

  function chooseField(name) {
    setField(name)
    setReplaceNext(true)
    setError('')
  }

  function typeDigit(digit) {
    const current = values[field]
    let next
    if (replaceNext || current === '0' || current === '-0') {
      next = !replaceNext && current.startsWith('-') ? `-${digit}` : digit
    } else {
      next = `${current}${digit}`
    }
    const digits = next.replace('-', '').replace('.', '')
    if (digits.length > 8) return
    dirty(field, next)
    setReplaceNext(false)
  }

  function typeDot() {
    if (field === 'n') return
    const current = replaceNext ? '0' : values[field]
    if (current.includes('.')) return
    dirty(field, `${current}.`)
    setReplaceNext(false)
  }

  function toggleSign() {
    const current = values[field]
    if (current === '0' || current === '') return
    dirty(field, current.startsWith('-') ? current.slice(1) : `-${current}`)
    setReplaceNext(false)
  }

  function backspace() {
    const current = values[field]
    const next = current.length <= 1 ? '0' : current.slice(0, -1)
    dirty(field, next === '-' ? '0' : next)
    setReplaceNext(false)
  }

  function clearAll() {
    setFirst('0')
    setRatio('0')
    setCount('0')
    setField('a')
    setReplaceNext(true)
    setSequence(null)
    setError('')
    setShowSum(false)
  }

  function calculate() {
    const next = readSequence(first, ratio, count)
    if (next.error) {
      setError(next.error)
      setSequence(null)
      return
    }
    setError('')
    setSequence(next.sequence)
    setReplaceNext(true)
  }

  function press(key) {
    if (key.action === 'digit') typeDigit(key.label)
    if (key.action === 'dot') typeDot()
    if (key.action === 'sign') toggleSign()
    if (key.action === 'clear') clearAll()
    if (key.action === 'back') backspace()
    if (key.action === 'field') chooseField(key.field)
    if (key.action === 'sum') setShowSum((value) => !value)
    if (key.action === 'eq') calculate()
  }

  const actions = useRef({})
  actions.current = { typeDigit, typeDot, toggleSign, backspace, calculate }

  useEffect(() => {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!desktop.matches) return

    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof HTMLButtonElement && (event.key === 'Enter' || event.key === ' ')) {
        return
      }

      const { typeDigit: type, typeDot: dot, toggleSign: sign, backspace: erase, calculate: equals } =
        actions.current

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        type(event.key)
        return
      }
      if (event.key === '.' || event.key === ',') {
        event.preventDefault()
        dot()
        return
      }
      if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        sign()
        return
      }
      if (event.key === 'Backspace') {
        event.preventDefault()
        erase()
        return
      }
      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault()
        equals()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const keys = [
    { label: 'AC', tone: 'fn', action: 'clear' },
    { label: '±', tone: 'fn', action: 'sign' },
    { label: 'a', tone: 'fn', action: 'field', field: 'a' },
    { label: 'r', tone: 'op', action: 'field', field: 'r' },
    { label: '7', tone: 'num', action: 'digit' },
    { label: '8', tone: 'num', action: 'digit' },
    { label: '9', tone: 'num', action: 'digit' },
    { label: 'n', tone: 'op', action: 'field', field: 'n' },
    { label: '4', tone: 'num', action: 'digit' },
    { label: '5', tone: 'num', action: 'digit' },
    { label: '6', tone: 'num', action: 'digit' },
    { label: '⌫', tone: 'op', action: 'back' },
    { label: '1', tone: 'num', action: 'digit' },
    { label: '2', tone: 'num', action: 'digit' },
    { label: '3', tone: 'num', action: 'digit' },
    { label: '.', tone: 'op', action: 'dot' },
    { label: '0', tone: 'num', action: 'digit', wide: true },
    { label: 'S', tone: 'num', action: 'sum' },
    { label: '=', tone: 'op', action: 'eq' },
  ]

  const editing = !replaceNext
  const big =
    sequence && !editing
      ? formatNum(showSum ? sequence.sum : sequence.nth)
      : values[field] || '0'

  return (
    <section className="calc">
      <div className="calc-top">
        <button type="button" className="back" onClick={onBack}>
          ← Home
        </button>
        <p className="key-hint">Type 0–9 on your keyboard</p>
        <button type="button" className="theme" onClick={() => setDark((value) => !value)}>
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="phone-row">
        <Phone
          dark={dark}
          label={FIELD_LABEL[field]}
          expr={
            sequence && !editing ? (
              <>
                {formatNum(sequence.first)} × {formatNum(sequence.ratio)}
                <sup>{Math.max(sequence.count - 1, 0)}</sup>
                {showSum ? '  sum' : '  nth'}
              </>
            ) : null
          }
          error={error}
          big={big}
          keys={keys}
          field={field}
          showSum={showSum}
          onPress={press}
        />
        <AnswerSheet
          terms={sequence?.terms}
          nth={sequence ? sequence.nth : null}
          sum={sequence ? sequence.sum : null}
        />
      </div>
    </section>
  )
}

const SLOPE_LABEL = {
  a: 'first term',
  d: 'common difference',
  n: 'term position',
}

function buildSlope(first, difference, count) {
  const intercept = first - difference
  const terms = Array.from({ length: count }, (_, index) => difference * (index + 1) + intercept)
  const nth = terms[count - 1]
  const sum = (count / 2) * (2 * first + (count - 1) * difference)
  return { terms, sum, nth, first, difference, intercept, count }
}

function readSlope(firstRaw, differenceRaw, countRaw) {
  const firstText = firstRaw.trim()
  const differenceText = differenceRaw.trim()
  const countText = countRaw.trim()
  const first = Number(firstText)
  const difference = Number(differenceText)
  const count = Number(countText)

  if (firstText === '' || differenceText === '' || countText === '') {
    return { error: 'Enter a first term, a common difference, and a term position.' }
  }
  if (!Number.isFinite(first) || !Number.isFinite(difference) || !Number.isFinite(count)) {
    return { error: 'Use regular numbers only.' }
  }
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return { error: 'Use a whole number of terms from 1 to 100.' }
  }

  const sequence = buildSlope(first, difference, count)
  const tooBig =
    sequence.terms.some((term) => !Number.isFinite(term)) || !Number.isFinite(sequence.sum)
  if (tooBig) {
    return { error: 'Those values get too large. Try a smaller difference or fewer terms.' }
  }
  return { sequence }
}

function SlopeIntercept({ onBack }) {
  const [dark, setDark] = useState(false)
  const [field, setField] = useState('a')
  const [first, setFirst] = useState('2')
  const [difference, setDifference] = useState('3')
  const [count, setCount] = useState('5')
  const [replaceNext, setReplaceNext] = useState(true)
  const [showSum, setShowSum] = useState(false)
  const [error, setError] = useState('')
  const [sequence, setSequence] = useState(() => buildSlope(2, 3, 5))

  const values = { a: first, d: difference, n: count }
  const setters = { a: setFirst, d: setDifference, n: setCount }

  function dirty(name, value) {
    setters[name](value)
    setError('')
    setShowSum(false)
  }

  function chooseField(name) {
    setField(name)
    setReplaceNext(true)
    setError('')
  }

  function typeDigit(digit) {
    const current = values[field]
    let next
    if (replaceNext || current === '0' || current === '-0') {
      next = !replaceNext && current.startsWith('-') ? `-${digit}` : digit
    } else {
      next = `${current}${digit}`
    }
    const digits = next.replace('-', '').replace('.', '')
    if (digits.length > 8) return
    dirty(field, next)
    setReplaceNext(false)
  }

  function typeDot() {
    if (field === 'n') return
    const current = replaceNext ? '0' : values[field]
    if (current.includes('.')) return
    dirty(field, `${current}.`)
    setReplaceNext(false)
  }

  function toggleSign() {
    const current = values[field]
    if (current === '0' || current === '') return
    dirty(field, current.startsWith('-') ? current.slice(1) : `-${current}`)
    setReplaceNext(false)
  }

  function backspace() {
    const current = values[field]
    const next = current.length <= 1 ? '0' : current.slice(0, -1)
    dirty(field, next === '-' ? '0' : next)
    setReplaceNext(false)
  }

  function clearAll() {
    setFirst('0')
    setDifference('0')
    setCount('0')
    setField('a')
    setReplaceNext(true)
    setSequence(null)
    setError('')
    setShowSum(false)
  }

  function calculate() {
    const next = readSlope(first, difference, count)
    if (next.error) {
      setError(next.error)
      setSequence(null)
      return
    }
    setError('')
    setSequence(next.sequence)
    setReplaceNext(true)
  }

  function press(key) {
    if (key.action === 'digit') typeDigit(key.label)
    if (key.action === 'dot') typeDot()
    if (key.action === 'sign') toggleSign()
    if (key.action === 'clear') clearAll()
    if (key.action === 'back') backspace()
    if (key.action === 'field') chooseField(key.field)
    if (key.action === 'sum') setShowSum((value) => !value)
    if (key.action === 'eq') calculate()
  }

  const actions = useRef({})
  actions.current = { typeDigit, typeDot, toggleSign, backspace, calculate }

  useEffect(() => {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!desktop.matches) return

    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof HTMLButtonElement && (event.key === 'Enter' || event.key === ' ')) {
        return
      }

      const { typeDigit: type, typeDot: dot, toggleSign: sign, backspace: erase, calculate: equals } =
        actions.current

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        type(event.key)
        return
      }
      if (event.key === '.' || event.key === ',') {
        event.preventDefault()
        dot()
        return
      }
      if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        sign()
        return
      }
      if (event.key === 'Backspace') {
        event.preventDefault()
        erase()
        return
      }
      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault()
        equals()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const keys = [
    { label: 'AC', tone: 'fn', action: 'clear' },
    { label: '±', tone: 'fn', action: 'sign' },
    { label: 'a', tone: 'fn', action: 'field', field: 'a' },
    { label: 'd', tone: 'op', action: 'field', field: 'd' },
    { label: '7', tone: 'num', action: 'digit' },
    { label: '8', tone: 'num', action: 'digit' },
    { label: '9', tone: 'num', action: 'digit' },
    { label: 'n', tone: 'op', action: 'field', field: 'n' },
    { label: '4', tone: 'num', action: 'digit' },
    { label: '5', tone: 'num', action: 'digit' },
    { label: '6', tone: 'num', action: 'digit' },
    { label: '⌫', tone: 'op', action: 'back' },
    { label: '1', tone: 'num', action: 'digit' },
    { label: '2', tone: 'num', action: 'digit' },
    { label: '3', tone: 'num', action: 'digit' },
    { label: '.', tone: 'op', action: 'dot' },
    { label: '0', tone: 'num', action: 'digit', wide: true },
    { label: 'S', tone: 'num', action: 'sum' },
    { label: '=', tone: 'op', action: 'eq' },
  ]

  const editing = !replaceNext
  const big =
    sequence && !editing
      ? formatNum(showSum ? sequence.sum : sequence.nth)
      : values[field] || '0'
  const interceptSign = sequence && sequence.intercept < 0 ? '−' : '+'

  return (
    <section className="calc slope">
      <div className="calc-top">
        <button type="button" className="back" onClick={onBack}>
          ← Home
        </button>
        <p className="key-hint">Type 0–9 on your keyboard</p>
        <button type="button" className="theme" onClick={() => setDark((value) => !value)}>
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="phone-row">
        <Phone
          dark={dark}
          label={SLOPE_LABEL[field]}
          expr={
            sequence && !editing ? (
              <>
                {formatNum(sequence.difference)}n {interceptSign}{' '}
                {formatNum(sequence ? Math.abs(sequence.intercept) : 0)}
                {showSum ? '  sum' : '  nth'}
              </>
            ) : null
          }
          error={error}
          big={big}
          keys={keys}
          field={field}
          showSum={showSum}
          onPress={press}
        />
        <AnswerSheet
          slots={100}
          terms={sequence?.terms}
          nth={sequence ? sequence.nth : null}
          sum={sequence ? sequence.sum : null}
        />
      </div>
    </section>
  )
}

function AnswerSheet({ terms, nth, sum, slots: slotCount = 20 }) {
  const slots = Array.from({ length: slotCount }, (_, index) => {
    const term = terms && index < terms.length ? terms[index] : null
    return { index: index + 1, term }
  })

  return (
    <aside className="answers" aria-live="polite">
      <h2>Answers</h2>
      <ol>
        {slots.map((slot) => (
          <li key={slot.index} className={slot.term === null ? 'empty' : ''}>
            <span>
              a<sub>{slot.index}</sub>
            </span>
            <strong>{slot.term === null ? '—' : formatNum(slot.term)}</strong>
          </li>
        ))}
      </ol>
      <div className="answer-stats">
        <p>
          <span>nth term</span>
          <strong>{nth == null ? '—' : formatNum(nth)}</strong>
        </p>
        <p>
          <span>Sum</span>
          <strong>{sum == null ? '—' : formatNum(sum)}</strong>
        </p>
      </div>
    </aside>
  )
}

function Phone({ dark, label, expr, error, big, keys, field, showSum, onPress }) {
  return (
    <div className="phone">
      <div className={dark ? 'shell dark' : 'shell'}>
        <div className="notch" aria-hidden="true" />
        <div className="lcd" aria-live="polite">
          <p className={error ? 'lcd-expr is-error' : 'lcd-expr'}>
            {error || expr || label}
          </p>
          <p className="lcd-value">{big}</p>
        </div>
        <div className="keys">
          {keys.map((key) => {
            const selected = key.field === field || (key.action === 'sum' && showSum)
            return (
              <button
                key={key.label}
                type="button"
                className={`key ${key.tone}${key.wide ? ' wide' : ''}${selected ? ' is-on' : ''}`}
                onClick={() => onPress(key)}
              >
                {key.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('intro')
  const goHome = useCallback(() => setScreen('home'), [])
  const goCalculator = useCallback(() => setScreen('calculator'), [])
  const goSlope = useCallback(() => setScreen('slope'), [])

  return (
    <div className="stage">
      <main className="board">
        {screen === 'intro' && <Welcome onDone={goHome} />}
        {screen === 'home' && <Home onStart={goCalculator} onSlope={goSlope} />}
        {screen === 'calculator' && <CalculatorDraft onBack={goHome} />}
        {screen === 'slope' && <SlopeIntercept onBack={goHome} />}
      </main>
    </div>
  )
}
