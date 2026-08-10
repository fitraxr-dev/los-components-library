import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

import Icon from '../Icon';
import RowWrapper from '../RowWrapper';
import SectionTitle from '../SectionTitle';

import type { SectionTitleProps } from '../SectionTitle/types';


interface SortableSectionProps extends SectionTitleProps {
  id: string | number;
  disabled?: boolean;
}

const SortableSection = ({
  id,
  title,
  disabled,
  sx,
  ...props
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ disabled, id: String(id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <SectionTitle
        sx={{ backgroundColor: 'white.main', ...sx }}
        {...props}
        title={
          <RowWrapper alignItems="center" gap={2}>
            {!disabled && (
              <Box
                {...listeners}
                {...attributes}
                sx={{
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  cursor: 'grab',
                }}
              >
                <Icon
                  iconName="drag-and-drop"
                  textVariant="title2"
                />
              </Box>
            )}
            {title}
          </RowWrapper>
        }
      />
    </Box>
  );
};

export default SortableSection;
