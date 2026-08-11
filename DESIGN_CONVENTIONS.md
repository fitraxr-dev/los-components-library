# Design Conventions

This document outlines the core design conventions, theming strategies, and standardized component usages for the frontend components library.

## 1. Theming & Styling Engine

The application uses **Material UI (MUI)** as its foundational styling engine, but it heavily augments the default MUI theme to support a completely custom, viewport-based responsive design.

### Viewport-Based Scaling (vw)
Unlike traditional applications that use `rem` or `px`, this app heavily relies on `vw` (viewport width) units for sizing, spacing, border radii, and shadows. This ensures that the application scales proportionally across different screen sizes.

*   **Spacing**: Controlled via `theme.spacing(factor)`, which returns a `vw` value based on a 1920px reference screen.
*   **Border Radius**: Controlled via `theme.radius(factor)`, which also scales proportionally.
*   **Shadows**: Defined using `vw` units for offsets and blur radii.

## 2. Typography

The application uses the local **Poppins** font family. Typography is strictly controlled through custom variants defined in `generalTheme.ts`.

### Text Variants
You must use the `TextStyle` component (or pass a `textVariant` prop to components that support it) rather than raw HTML tags or standard MUI `Typography` variants.

Available variants include:
*   **Displays**: `display1`, `display2`
*   **Titles**: `title1`, `title2`
*   **Bodies**: `body1`, `body2`, `body3`, `body4`, `body5`, `body6`, `body7`
*   **Buttons**: `button`, `buttonLarge`
*   **Miscellaneous**: `caption`

**Example Usage:**
```tsx
import TextStyle from '@/components/shared/TextStyle';

<TextStyle variant="body1">This is standard body text.</TextStyle>
<TextStyle variant="title1" weight={600}>This is a bold title.</TextStyle>
```

## 3. Layout Standards

To maintain consistency and reduce boilerplate CSS/styling, the application provides specialized wrapper components for common layout patterns. You should avoid writing raw flexbox CSS whenever possible and use these instead:

*   **ColumnWrapper**: A flexible column layout component.
*   **RowWrapper**: A flexible row layout component.
*   **VStack / HStack**: Strict vertical and horizontal stacks for structured spacing.
*   **BaseContainer**: A standardized container for holding sections or cards of content.

**Example Usage:**
```tsx
import RowWrapper from '@/components/shared/RowWrapper';
import ColumnWrapper from '@/components/shared/ColumnWrapper';

<ColumnWrapper sx={{ gap: 2 }}>
  <TextStyle variant="title1">Section Heading</TextStyle>
  <RowWrapper sx={{ justifyContent: 'space-between' }}>
     <div>Left Content</div>
     <div>Right Content</div>
  </RowWrapper>
</ColumnWrapper>
```

## 4. Components & Color Palette

### Custom Colors
The MUI palette has been augmented to include custom brand colors and state colors. These can be used directly in components that support the `color` prop (like `Button`), or via `theme.palette`.
*   Extended colors include: `orange`, `darkBlue`, `errorOtp`, `white`, `lightYellow`, `blueRefina`, and a comprehensive `custom` color scale (e.g., `pc10`, `pc80`, `gray10-60`, `blue90-100`).

### Buttons
Buttons wrap the MUI Button but enforce custom text variants and dynamic viewport-based padding.
*   Use the `textVariant` prop to change the typography inside the button.
*   Icons can be easily added using `startIcon` or `endIcon` props.

**Example:**
```tsx
import Button from '@/components/shared/Button';

<Button 
  variant="contained" 
  color="darkBlue" 
  textVariant="buttonLarge"
  startIcon="home"
>
  Dashboard
</Button>
```

## 5. Summary of Best Practices
1.  **Do not use absolute pixels (`px`) or relative `rem` units** for structural layouts if `theme.spacing()` or `theme.radius()` can be used. Rely on the theme's dynamic `vw` calculations.
2.  **Always use `TextStyle`** for rendering text. Do not use `<p>`, `<span>`, or `<h1>` directly unless required for specific SEO/accessibility hierarchies not covered by the components.
3.  **Use provided Layout components** (`RowWrapper`, `ColumnWrapper`, `HStack`, `VStack`) instead of inline flex styles.
4.  **Reference Type Definition Files** (`Mui.d.ts`, `TextVariant.d.ts`) when in doubt about available prop values for custom theme augments.
