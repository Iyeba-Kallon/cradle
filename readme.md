# cradle

Interactive cat's cradle string art driven by webcam hand tracking. Bring both
hands into frame and glowing strings stretch between your fingertips, shifting
color and thickness as your hands move apart.

Built with MediaPipe Hands for landmark detection and p5.js for the canvas.

## Why I built this

I wanted to get hands-on with real-time computer vision in the browser, so I
started with something visual and playful. Underneath the art it's the same
hand-landmark tracking you'd use for gesture controls or sign-to-text, which is
where I'm taking this work next.

## How it works

MediaPipe returns 21 landmarks per hand every frame. The five fingertips sit at
fixed indices (thumb 4, index 8, middle 12, ring 16, pinky 20). Each frame I:

1. grab the webcam feed and mirror it as the background
2. run MediaPipe to get landmarks for up to two hands
3. draw a glowing dot on every joint
4. connect each left-hand fingertip to each right-hand fingertip with a string
5. vary string color and thickness by the distance between the hands

The glow comes from canvas `shadowBlur`; the strings run through a cyan to
magenta to yellow gradient.

## Run it

No build step. Open `index.html` in a browser and allow camera access when
prompted. Bring both hands into the frame to see the strings connect.

A webcam and a Chromium-based browser (Chrome, Edge) work best.

## Known limitations

- Needs decent lighting for reliable tracking
- Tracks a maximum of two hands
- Performance depends on your machine; older devices may drop frames

## Roadmap

- Gesture recognition (pinch, open palm) to trigger different effects
- Map hand distance to sound, not just visuals
- Try the same landmark pipeline for a simple sign-to-text demo
