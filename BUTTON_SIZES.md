# Button Size Conversions (vw to px)

This document provides the exact pixel conversions for button dimensions across all defined theme breakpoints.
Since the application uses viewport-based scaling (`vw`), button sizes change dynamically based on screen width.

## Breakpoints Table

| Breakpoint | Width (px) | Std Font Size | Std Height | Std Padding (Y/X) | Lrg Font Size | Lrg Height | Lrg Padding (Y/X) | Radius |
|---|---|---|---|---|---|---|---|---|
| **xs** | 250px | 2.3px | 6.5px | 2.1px / 4.2px | 2.6px | 7.3px | 2.1px / 4.2px | 1.3px |
| **sm** | 600px | 5.6px | 15.6px | 5.0px / 10.0px | 6.3px | 17.5px | 5.0px / 10.0px | 3.1px |
| **md** | 900px | 8.4px | 23.4px | 7.5px / 15.0px | 9.4px | 26.3px | 7.5px / 15.0px | 4.7px |
| **desktopS** | 1024px | 9.6px | 26.7px | 8.5px / 17.1px | 10.7px | 29.9px | 8.5px / 17.1px | 5.3px |
| **lg** | 1200px | 11.2px | 31.2px | 10.0px / 20.0px | 12.5px | 35.0px | 10.0px / 20.0px | 6.2px |
| **desktopM** | 1360px | 12.8px | 35.4px | 11.3px / 22.7px | 14.2px | 39.7px | 11.3px / 22.7px | 7.1px |
| **xl** | 1536px | 14.4px | 40.0px | 12.8px / 25.6px | 16.0px | 44.8px | 12.8px / 25.6px | 8.0px |
| **desktopL** | 1920px | 18.0px | 50.0px | 16.0px / 32.0px | 20.0px | 56.0px | 16.0px / 32.0px | 10.0px |
| **desktopXL** | 2560px | 24.0px | 66.7px | 21.3px / 42.7px | 26.7px | 74.7px | 21.3px / 42.7px | 13.3px |
| **desktopXXL** | 3840px | 36.0px | 100.0px | 32.0px / 64.0px | 40.0px | 112.0px | 32.0px / 64.0px | 20.0px |

### Calculation Details

*   **Standard Font Size**: `0.9375vw` (Line height: 1)
*   **Large Font Size**: `1.0417vw` (Line height: 1.2)
*   **Padding Y (Top/Bottom)**: `theme.spacing(2)` = `0.833vw`
*   **Padding X (Left/Right)**: `theme.spacing(4)` = `1.667vw`
*   **Border Radius**: `theme.radius(1)` = `0.52vw`
