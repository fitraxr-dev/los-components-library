'use client';

import {
  MenuButtonAlignCenter,
  MenuButtonAlignJustify,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
} from 'mui-tiptap';


const HIGHLIGHT_SWATCHES = [
  { label: 'Dark grey', value: '#595959' },
  { label: 'Light grey', value: '#dddddd' },
  { label: 'Light red', value: '#ffa6a6' },
  { label: 'Light orange', value: '#ffd699' },
  { label: 'Yellow', value: '#ffff00' },
  { label: 'Light green', value: '#99cc99' },
  { label: 'Light blue', value: '#90c6ff' },
  { label: 'Light purple', value: '#8085e9' },
];

interface ToolbarProps {
  disabled?: boolean;
}

const Toolbar = ({ disabled }: ToolbarProps) => {
  return (
    <MenuControlsContainer>
      <MenuButtonUndo disabled={disabled} />
      <MenuButtonRedo disabled={disabled} />
      <MenuDivider />

      <MenuSelectHeading disabled={disabled} />
      <MenuDivider />

      <MenuButtonBulletedList disabled={disabled} />
      <MenuButtonOrderedList disabled={disabled} />
      <MenuSelectTextAlign disabled={disabled} />
      {/* <MenuButtonCodeBlock disabled={disabled} /> */}
      <MenuDivider />

      <MenuButtonBold disabled={disabled} />
      <MenuButtonItalic disabled={disabled} />
      <MenuButtonStrikethrough disabled={disabled} />
      {/* <MenuButtonCode disabled={disabled} /> */}
      <MenuButtonUnderline disabled={disabled} />
      <MenuButtonHighlightColor swatchColors={HIGHLIGHT_SWATCHES} disabled={disabled} />
      <MenuButtonEditLink disabled={disabled} />
      <MenuDivider />

      <MenuButtonSuperscript disabled={disabled} />
      <MenuButtonSubscript disabled={disabled} />
      <MenuDivider />

      <MenuButtonAlignLeft disabled={disabled} />
      <MenuButtonAlignCenter disabled={disabled} />
      <MenuButtonAlignRight disabled={disabled} />
      <MenuButtonAlignJustify disabled={disabled} />
    </MenuControlsContainer>
  );
};

export default Toolbar;
