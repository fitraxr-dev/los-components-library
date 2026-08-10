import type { ComponentMetrics } from '@/types/Component';
import type CSS from 'csstype';


export type HStackProps = ComponentMetrics & React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /**
     * Align items
     */
  align?: CSS.Property.AlignItems;
  /**
     * Height
     */
  height?: CSS.Property.Height;
  /**
     * Justify content
     */
  justify?: CSS.Property.JustifyContent;
  /**
     * Width
     */
  width?: CSS.Property.Width;
  /**
     * Padding
     */
  padding?: CSS.Property.Padding;
}
