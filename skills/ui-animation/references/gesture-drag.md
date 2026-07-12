# Gesture and Drag Animations

Drag, swipe, and gesture patterns where the user directly manipulates elements.

## Contents
- [Momentum-based dismissal](#momentum-based-dismissal)
- [Velocity handoff](#velocity-handoff)
- [Momentum projection](#momentum-projection)
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

## Velocity handoff

When a gesture ends, the animation must continue at the finger's exact velocity so there is no visible seam between dragging and animating. This is the detail that most separates "fluid" from "fine". Pass the pointer's release velocity as the spring's initial velocity.

Motion and Framer Motion take absolute px/s velocity directly via the `velocity` option, so hand them the raw release velocity:

```ts
// releaseVelocity in px/s, measured over the last few pointermove events
animate(el, { y: target }, { type: "spring", velocity: releaseVelocity, bounce: 0, duration: 0.4 });
```

Some spring APIs want relative velocity: normalize by the remaining distance to the target.

```ts
const relativeVelocity = gestureVelocity / (targetValue - currentValue);
// element at y=50, target y=150 (100px to go), finger at 50px/s -> 50 / 100 = 0.5
```

To have velocity ready at release, track a short position and timestamp history (last few `pointermove` events), not just the current point.

## Momentum projection

Don't snap to the nearest boundary from the release point. Use velocity to project where the gesture is heading, then snap to the target nearest that projected point. This is what makes a flick feel like it throws the element, exactly like scroll deceleration. Good bottom sheets and carousels (Vaul, Embla) work this way.

```ts
// decelerationRate ~ 0.998 for a normal scroll feel; 0.99 for snappier
function project(initialVelocity: number, decelerationRate = 0.998): number {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEndpoint = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEndpoint); // choose target from the projection
animateSpringTo(target, { velocity: releaseVelocity }); // then hand off velocity (previous section)
```

Use this exponential-decay form, not the physics-textbook `v^2 / (2 * decel)`; the decay form is what Apple ships in the *Designing Fluid Interfaces* sample code.

## Boundary damping

Past the natural boundary (e.g. pulling a drawer up when already at top), apply damping: the more they drag, the less it moves.

```ts
function applyDamping(offset: number, max: number): number {
  return max * (1 - Math.exp(-offset / max));
}

// Usage: as offset grows, movement diminishes
const dampedOffset = applyDamping(rawOffset, 200);
```

Apple's canonical rubber-band function (from *Designing Fluid Interfaces*) is a good drop-in alternative, tuned to feel like iOS overscroll:

```ts
// the further past the bound, the less the element follows
function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
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
    // Animate out in swipe direction, handing off the release velocity (see Velocity handoff)
    animateOut(direction, velocity);
  } else {
    // Spring back to origin
    springBack();
  }
}
```

The exit should continue in the swipe direction with momentum; snapping elsewhere feels wrong. Feed `velocity` into the exit spring's `velocity` option so drag and animation share no seam.
