import React from 'react';


interface DraggableSectionProps {
  children: React.ReactNode;
  index: number;
  disabled?: boolean;
  onReorder?: (data: {
    draggedIndex: number;
    targetIndex: number;
    draggedItem: any;
    newData: any[];
  }) => void;
  dataArray: any[];
  setDataArray: (data: any[]) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  children,
  index,
  disabled = false,
  onReorder,
  dataArray,
  setDataArray,
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('sectionIndex', index.toString());
    event.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('sectionIndex'));

    // Reset opacity
    event.currentTarget.style.opacity = '1';

    if (draggedIndex !== targetIndex && !isNaN(draggedIndex)) {
      const newData = [...dataArray];
      const draggedSection = newData[draggedIndex];

      // Remove from old position
      newData.splice(draggedIndex, 1);
      // Insert at new position
      newData.splice(targetIndex, 0, draggedSection);

      // Update sequences
      const previousItem = targetIndex > 0 ? newData[targetIndex - 1] : null;
      const nextItem = targetIndex < newData.length - 1 ? newData[targetIndex + 1] : null;

      if (previousItem === null) {
        draggedSection.sequence = nextItem?.sequence - 512;
      } else if (nextItem === null) {
        draggedSection.sequence = previousItem?.sequence + 512;
      } else {
        draggedSection.sequence = (previousItem?.sequence + nextItem?.sequence) / 2;
      }

      setDataArray(newData);

      // Call optional callback with reorder info
      if (onReorder) {
        onReorder({
          draggedIndex,
          draggedItem: draggedSection,
          newData,
          targetIndex,
        });
      }
    }
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      style={{
        cursor: disabled ? 'default' : 'move',
        transition: 'opacity 0.2s ease',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableSection;
