/**
 * Begins the render loop for the ball under the cursor
 *
 * @param ball The HTML element to load the ball into
 * @return A callback to remove all listeners. This is so that you can safely use this function inside of a useEffect.
 */

export function loadCursor(ball: HTMLDivElement) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  let ballX = x;
  let ballY = y;

  let hoveredElement: HTMLAnchorElement | undefined;
  let lastMouseMove: Date | undefined;

  const drawBall = () => {
    ballX += (x - ballX) * 0.1 - 1;
    ballY += (y - ballY) * 0.1 - 1;

    ball.style.top = `${ballY - window.scrollY}px`;
    ball.style.left = `${ballX - window.scrollX}px`;
  };

  const loop = () => {
    drawBall();
    requestAnimationFrame(loop);

    // If the mouse hasn't moved in 3 seconds, hide the ball
    if (
      lastMouseMove &&
      new Date() > new Date(lastMouseMove.getTime() + 3_000) &&
      ball.style.opacity !== "0" &&
      ball.getAttribute("data-hover-type") !== "link"
    ) {
      ball.style.opacity = "0";
    }
  };

  loop();

  const touch = (event: TouchEvent) => {
    x = event.touches[0].pageX;
    y = event.touches[0].pageY;
  };

  const getHoveredElement = (event: MouseEvent) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    
    if (!element) return null;
    
    // Check for various clickable elements including DOI links
    const clickableSelectors = [
      'a', 'button', '[role="button"]', '[onclick]', 
      '[data-href]', '[href]', 'input[type="button"]', 
      'input[type="submit"]', 'input[type="reset"]',
      '[data-clickable]', '.clickable', '.cursor-pointer',
      'a[href*="http"]', 'a[href*="https"]', 'a[href*="doi"]',
      'a[href*="hydroshare"]', 'a[href*="figshare"]',
      'a[href*="10."]', // DOI pattern
      '[data-doi]', '[data-url]'
    ];
    
    // Check if element or any parent matches clickable selectors
    let currentElement = element;
    while (currentElement && currentElement !== document.body) {
      for (const selector of clickableSelectors) {
        if (currentElement.matches && currentElement.matches(selector)) {
          return currentElement;
        }
      }
      currentElement = currentElement.parentElement;
    }
    
    return null;
  };

  const mouseMove = (event: MouseEvent) => {
    ball.style.opacity = "1";
    ball.style.background = "rgba(147, 51, 234, 0.35)";
    x = event.pageX;
    y = event.pageY;

    const hoveredClickableElement = getHoveredElement(event);
    
    if (hoveredClickableElement) {
      ball.style.transform = "scale(1.9)";
      ball.style.background = "rgba(147, 51, 234, 0.35)";
      ball.style.border = "none";
      ball.setAttribute("data-hover-type", "link");

      hoveredElement = hoveredClickableElement as HTMLAnchorElement;
    } else if (ball.style.transform === "scale(1.9)") {
      ball.style.transform = "scale(1)";
      ball.style.background = "rgba(147, 51, 234, 0.35)";
      ball.setAttribute("data-hover-type", "");

      hoveredElement = undefined;
    }

    lastMouseMove = new Date();
  };

  const mouseDown = () => {
    ball.style.transform = "scale(1.3)";
  };

  const mouseUp = () => {
    ball.style.transform = "scale(1)";

    if (hoveredElement) {
      ball.style.transform = "scale(1.9)";
    }
  };

  window.addEventListener("touchstart", touch);
  window.addEventListener("touchmove", touch);
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);

  return () => {
    window.removeEventListener("touchstart", touch);
    window.removeEventListener("touchmove", touch);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mousedown", mouseDown);
    window.removeEventListener("mouseup", mouseUp);
  };
}

