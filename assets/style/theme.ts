export const lightTheme = {
  colors: {
    primary: '#34A853',
    secondary: '#EA4335',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: {
      primary: '#1F2024',
      secondary: '#666666',
    },
    border: '#F0F0F0',
    status: {
      empty: {
        background: '#E6F4EA',
        text: '#34A853',
      },
      full: {
        background: '#FCE8E6',
        text: '#EA4335',
      },
    },
    shadow: {
      color: '#000000',
      opacity: 0.1,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 12,
    lg: 20,
    xl: 24,
  },
  typography: {
    title: {
      fontSize: 18,
      fontWeight: '600',
    },
    subtitle: {
      fontSize: 13,
      fontWeight: 'normal',
    },
    body: {
      fontSize: 15,
      fontWeight: '500',
    },
    caption: {
      fontSize: 11,
      fontWeight: '600',
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#4CAF50',
    secondary: '#F44336',
    background: '#121212',
    surface: '#1E1E1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    border: '#2C2C2C',
    status: {
      empty: {
        background: '#1B3329',
        text: '#4CAF50',
      },
      full: {
        background: '#3B1F1F',
        text: '#F44336',
      },
    },
    shadow: {
      color: '#000000',
      opacity: 0.2,
    },
  },
};

export type Theme = typeof lightTheme; 