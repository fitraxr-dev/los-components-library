export const styCellContainer = (theme, options) => ({
  borderBottom: '0.5px',
  borderColor: options.bottomBorderColor,
  borderLeft: 0,
  borderRight: 0,
  borderStyle: options.bottomBorder,
  borderTop: 0,
  justifyContent: 'space-between',
  minHeight: `calc(${theme.typography.button.fontSize} + ${theme.spacing(
    2,
  )})`,
  ...options,
});

export const styTitle = (theme) => ({
  alignItems: 'center',
  display: 'flex',
  px: theme.spacing(1),
  width: '12vw',
});

export const styText = (type) => ({
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '1',
  display: '-webkit-box',
  ml: 1,
  overflow: 'hidden',
  textDecoration: type === 'link' ? 'underline' : undefined,
  whiteSpace: type === 'buttons' ? 'normal' : null,
  wordBreak: type === 'buttons' ? 'break-word' : null,
});


export const styButtons = (theme) => ({
  marginLeft: theme.spacing(2),
  minWidth: 0,
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
});
