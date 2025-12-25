/**
 * Scroll position detection threshold in pixels.
 * Used to determine if scroll position is close enough to snap to a ticket.
 */
export const SCROLL_POSITION_THRESHOLD = 5

/**
 * Maximum number of frames to wait for scroll animation to complete.
 * Approximately 1 second at 60fps.
 */
export const MAX_SCROLL_ANIMATION_FRAMES = 60

/**
 * Scroll completion detection threshold in pixels.
 * If scroll position hasn't changed by more than this amount, consider scroll complete.
 */
export const SCROLL_COMPLETION_THRESHOLD = 1

/**
 * Delay in milliseconds before checking if scroll animation has completed.
 */
export const SCROLL_COMPLETION_CHECK_DELAY = 50

/**
 * Wheel scrolling timeout in milliseconds.
 * Prevents multiple wheel events from triggering rapid scrolling.
 */
export const WHEEL_SCROLL_TIMEOUT = 600

/**
 * Velocity threshold in pixels per second for fast swipe detection.
 * Swipes faster than this will trigger immediate navigation.
 */
export const FAST_SWIPE_VELOCITY_THRESHOLD = 400

/**
 * Drag distance threshold as a percentage of screen height.
 * Drags beyond this percentage will trigger navigation to next/previous ticket.
 */
export const DRAG_DISTANCE_THRESHOLD = 0.25
