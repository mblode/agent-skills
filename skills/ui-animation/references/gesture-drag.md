# Gesture and Drag Animations

Drag, swipe, and gesture patterns where the user directly manipulates elements.

## Contents
- [Momentum-based dismissal](#momentum-based-dismissal)
- [Boundary damping](#boundary-damping)
- [Pointer capture](#pointer-capture)
- [Multi-touch protection](#multi-touch-protection)
- [Friction vs hard stops](#friction-vs-hard-stops)
- [Swipe-to-dismiss pattern](#swipe-to-dismiss-pattern)

## Momentum-based dismissal

Don't require dragging past a distance threshold; compute velocity at release so a quick flick dismisses.

```ts
function onPointerUp(e: PointerEvent) {
  const timeTaken = Date.now() - dragStartTime;
  const velocity = Math.abs(swipeAmount) / timeTaken;

  if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
    dismiss();
  } else {
    snapBack();
  }
}
```

Default threshold: velocity > 0.11. Combine with a minimum distance (e.g. 20px) to prevent accidental dismissals.

## Boundary damping

Past the natural boundary (e.g. pulling a drawer up when already at top), apply damping: the more they drag, the less it moves.

```ts
function applyDamping(offset: number, max: number): number {
  return max * (1 - Math.exp(-offset / max));
}

// Usage: as offset grows, movement diminishes
const dampedOffset = applyDamping(rawOffset, 200);
```

Real things slow before stopping; friction beats hard stops.

## Pointer capture

On drag start, capture all pointer events so the drag continues even if the pointer leaves the element.

```ts
function onPointerDown(e: PointerEvent) {
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
  isDragging = true;
}

function onPointerUp(e: PointerEvent) {
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  isDragging = false;
}
```

Always use `setPointerCapture`; without it, fast swipes escape the element and the drag breaks.

## Multi-touch protection

Ignore extra touch points after the drag begins; without this, switching fingers mid-drag makes the element jump.

```ts
let activeTouchId: number | null = null;

function onPointerDown(e: PointerEvent) {
  if (activeTouchId !== null) return; // Ignore additional touches
  activeTouchId = e.pointerId;
  // Start drag...
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== activeTouchId) return;
  activeTouchId = null;
  // End drag...
}
```

## Friction vs hard stops

Allow drag past a boundary, with increasing friction:

```ts
function applyFriction(delta: number, isAtBoundary: boolean): number {
  if (!isAtBoundary) return delta;
  return delta * 0.3; // 30% of movement at boundary
}
```

Hard stops feel broken; users expect physics. Apply friction for scroll containers, sliders, and drawers.

## Swipe-to-dismiss pattern

Combine velocity, distance, and direction for a complete swipe gesture:

```ts
function handleSwipeEnd(direction: "left" | "right", distance: number, velocity: number) {
  const shouldDismiss = distance > THRESHOLD || velocity > 0.11;

  if (shouldDismiss) {
    // Animate out in swipe direction with remaining momentum
    animateOut(direction, velocity);
  } else {
    // Spring back to origin
    springBack();
  }
}
```

The exit should continue in the swipe direction with momentum; snapping elsewhere feels wrong.
