export type ButtonDinamisPKProps = {
  title: string;
  variant: 'contained' | 'outlined' | 'text' ;
  color?: 'primary' | 'info' | 'lightYellow' | 'success';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  action?: string;
}
