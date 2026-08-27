import { act, render, screen } from '@testing-library/react'
import { CursorReadout } from '../CursorReadout'
import { HudLabel } from '../HudLabel'

/** jest.setup.ts installs no global mocks — each file wires its own matchMedia. */
function mockMatchMedia({ fine, reduced }: { fine: boolean; reduced: boolean }) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query.includes('pointer: fine') ? fine : reduced,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia
}

function moveMouse(clientX: number, clientY: number) {
  act(() => {
    window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }))
  })
}

/** The readout writes on rAF, so flush a frame before asserting. */
async function flushFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  })
}

describe('CursorReadout', () => {
  beforeEach(() => {
    window.innerWidth = 1000
    window.innerHeight = 500
    mockMatchMedia({ fine: true, reduced: false })
  })

  it('renders the resting value before any pointer movement', () => {
    render(<CursorReadout />)
    expect(screen.getByText('0.000, 0.000')).toBeInTheDocument()
  })

  it('renders the default prefix', () => {
    render(<CursorReadout />)
    expect(screen.getByText('TRACK //')).toBeInTheDocument()
  })

  it('omits the prefix when given an empty string', () => {
    render(<CursorReadout prefix="" />)
    expect(screen.queryByText('TRACK //')).not.toBeInTheDocument()
  })

  it('reports normalized viewport coordinates on mousemove', async () => {
    render(<CursorReadout />)
    moveMouse(250, 400)
    await flushFrame()
    expect(screen.getByText('0.250, 0.800')).toBeInTheDocument()
  })

  it('stays at rest on coarse pointers', async () => {
    mockMatchMedia({ fine: false, reduced: false })
    render(<CursorReadout />)
    moveMouse(250, 400)
    await flushFrame()
    expect(screen.getByText('0.000, 0.000')).toBeInTheDocument()
  })

  it('stays at rest under prefers-reduced-motion', async () => {
    mockMatchMedia({ fine: true, reduced: true })
    render(<CursorReadout />)
    moveMouse(250, 400)
    await flushFrame()
    expect(screen.getByText('0.000, 0.000')).toBeInTheDocument()
  })

  it('detaches its listener on unmount', async () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = render(<CursorReadout />)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    removeSpy.mockRestore()
  })
})

describe('HudLabel track mode', () => {
  beforeEach(() => {
    window.innerWidth = 1000
    window.innerHeight = 500
    mockMatchMedia({ fine: true, reduced: false })
  })

  it('renders no readout by default', () => {
    render(<HudLabel>SIGNAL</HudLabel>)
    expect(screen.getByText('SIGNAL')).toBeInTheDocument()
    expect(screen.queryByText('0.000, 0.000')).not.toBeInTheDocument()
  })

  it('appends a readout beside its children when tracking', () => {
    render(<HudLabel track>SIGNAL</HudLabel>)
    expect(screen.getByText('SIGNAL')).toBeInTheDocument()
    expect(screen.getByText('//')).toBeInTheDocument()
    expect(screen.getByText('0.000, 0.000')).toBeInTheDocument()
  })

  it('falls back to the standalone prefix with no children', () => {
    render(<HudLabel track />)
    expect(screen.getByText('TRACK //')).toBeInTheDocument()
  })
})
