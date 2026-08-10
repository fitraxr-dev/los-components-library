export type NotificationItemProps = {
  id: number;
  title: string;
  time: string | Date;
  description: string;
  date: string | Date;
  isNew?: boolean;
  handleHover?: (index: number) => void;
};
