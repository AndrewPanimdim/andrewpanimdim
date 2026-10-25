
export function initScrollDelay() {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let animationId = 0;
  
    // Adjust these values to customize scrolling
    const ease = 0.08;
    const scrollMultiplier = 0.6;
  
    function handleWheel(event: WheelEvent) {
      // Preserve browser zoom and modified scrolling gestures
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
  
      // Use our own scrolling animation
      event.preventDefault();
  
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;
  
      targetScroll += event.deltaY * scrollMultiplier;
  
      // Prevent scrolling beyond page boundaries
      targetScroll = Math.max(
        0,
        Math.min(targetScroll, maxScroll)
      );
    }
  
    function animateScroll() {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;
  
      // Recalculate the limit if the page height changes
      targetScroll = Math.max(
        0,
        Math.min(targetScroll, maxScroll)
      );
  
      currentScroll +=
        (targetScroll - currentScroll) * ease;
  
      // Finish cleanly when close to the target
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
      }
  
      window.scrollTo(0, currentScroll);
  
      animationId = requestAnimationFrame(animateScroll);
    }
  
    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });
  
    animationId = requestAnimationFrame(animateScroll);
  
    // Return a cleanup function so the listener can be removed
    return function destroyScrollDelay() {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationId);
    };
  }
  