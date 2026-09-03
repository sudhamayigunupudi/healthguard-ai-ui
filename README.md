# HealthGuard AI Dashboard

Create a polished, modern, responsive frontend UI/UX for a student hackathon project called "HealthGuard AI".

HealthGuard AI is a healthcare risk-assessment learning prototype. The frontend should focus ONLY on the user interface and user experience.

Do NOT create or modify backend code, APIs, databases, machine-learning code, or server logic.

==================================================

DESIGN GOAL

==================================================

Create a professional healthcare + AI dashboard suitable for a national-level hackathon presentation.

The design should be:

- Modern

- Clean

- Professional

- Trustworthy

- Easy to understand

- Visually impressive but not over-designed

- Responsive on desktop, tablet, and mobile

Avoid making it look like a generic hospital website.

==================================================

MAIN SCREEN

==================================================

Create one primary dashboard screen.

Header:

HealthGuard AI

Subtitle:

"AI-Powered Health Risk Assessment"

Add a small badge:

"DEMO • SYNTHETIC DATA"

Keep navigation minimal. Do not create unnecessary pages.

==================================================

PATIENT INFORMATION

==================================================

Create a prominent card titled:

"Patient Information"

Include these fields:

1. Age

   Number input

2. BMI

   Number input

3. Blood Pressure

   Number input

4. Glucose

   Number input

5. Cholesterol

   Number input

6. Smoking

   Toggle or dropdown:

   No / Yes

7. Physical Activity

   Toggle or dropdown:

   Inactive / Active

8. Medical History

   Toggle or dropdown:

   No / Yes

Organize the fields into a clean two-column layout on desktop.

On mobile, stack the fields vertically.

Use clear labels and helpful placeholder text.

==================================================

PREDICT BUTTON

==================================================

Create a prominent primary button:

"Predict Risk"

Include a suitable AI-related or health-related icon if appropriate.

Create a loading state:

"Analyzing..."

The button should feel like the main action on the page.

==================================================

RESULT SECTION

==================================================

Create a separate card titled:

"Risk Assessment"

Before any result is available, show:

"Enter patient information and click Predict Risk to generate an assessment."

After prediction, the result area should visually support:

Risk Level: LOW

Risk Level: MEDIUM

Risk Level: HIGH

Create three distinct visual states for these levels.

Also create a probability visualization with:

High

Medium

Low

Use clean horizontal progress bars or similar visual elements.

Example:

High       96.16%

Medium      3.84%

Low         0.00%

These are ONLY example values for the UI design.

Do not hard-code these values into the final frontend logic.

==================================================

UX REQUIREMENTS

==================================================

Design clear states for:

1. Empty state

2. Filled form

3. Loading state

4. Successful result

5. Validation error

6. General error

Validation messages should be friendly and understandable.

Examples:

"Please enter a valid age."

"Please complete all required fields."

"Something went wrong. Please try again."

Do not show technical error messages to normal users.

==================================================

VISUAL STYLE

==================================================

Use a sophisticated healthcare + artificial intelligence visual style.

Use:

- Strong typography hierarchy

- Spacious layout

- Clean cards

- Rounded corners

- Subtle shadows

- Professional icons

- Accessible contrast

- Consistent spacing

- Clear visual hierarchy

Avoid:

- Excessive gradients

- Excessive animations

- Cartoonish illustrations

- Clutter

- Too many colors

- Too many decorative elements

- Stock-photo-heavy layouts

The interface should look like a real modern software product created for a hackathon.

==================================================

RESPONSIVE DESIGN

==================================================

Make the interface responsive for:

- Desktop

- Laptop

- Tablet

- Mobile

Desktop:

Use a balanced two-column layout where appropriate.

Mobile:

Stack the content vertically and keep buttons easy to tap.

==================================================

DISCLAIMER

==================================================

Include a subtle but clearly readable footer disclaimer:

"HealthGuard AI is a student hackathon prototype using synthetic data. Results are for demonstration purposes only and should not be used for medical decisions."

==================================================

ACCESSIBILITY

==================================================

Make the UI accessible and easy to use.

Use:

- Clear labels

- Readable font sizes

- Good contrast

- Visible button states

- Clear error messages

- Logical input order

==================================================

IMPORTANT

==================================================

This task is ONLY for Member 4 — Frontend/UI/UX.

Do not generate:

- FastAPI

- Backend code

- Database code

- Machine-learning code

- Model-training code

- API/server implementation

Focus entirely on creating the frontend visual design, components, layouts, states, and user experience.

Make the final design polished enough for a live hackathon demonstration.                                       IMPLEMENTATION REQUIREMENT:

Actually build the complete frontend based on this design.

The frontend should be functional and ready to run locally.

Keep all frontend code organized and easy for a student team to understand.

Do not create or modify any backend, ML model, database, or API implementation.

For now, use mock/example prediction data only where necessary to demonstrate the UI states. The real backend integration will be handled separately later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0698fb6-cc55-436d-b596-5b1264b3c5e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
