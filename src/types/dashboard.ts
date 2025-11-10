// types/dashboard.ts

export interface User {
  username: string;
  password: string;
  name: string;
  recentLogin: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface VisitData {
  name: string;
  visits: number;
  users: number;
}

export interface MonthlyData {
  month: string;
  posts: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change?: number;
}

export interface LoginFormProps {
  loginForm: LoginFormData;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginFormData>>;
  loginError: string;
  onLogin: () => void;
}

export interface NavigationProps {
  selectedMenu: MenuType;
  setSelectedMenu: React.Dispatch<React.SetStateAction<MenuType>>;
  currentUser: User | null;
  onLogout: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface OverviewProps {
  visitData: VisitData[];
  monthlyData: MonthlyData[];
  statCards: Array<{ title: string; value: string; change: number }>;
  recentActivities: Array<{ label: string; value: string }>;
  popularContent: Array<{ title: string; views: string }>;
  serverStatus: Array<{ 
    label: string; 
    value: string; 
    status: 'good' | 'warning' | 'danger' 
  }>;
}

export interface AnalyticsProps {
  trafficSources?: Array<{ source: string; percentage: number }>;
  userAnalytics?: {
    newUsers: number;
    returningUsers: number;
    avgSessionTime: string;
    bounceRate: string;
  };
  pagePerformance?: Array<{ page: string; views: number }>;
  deviceInfo?: Array<{ device: string; percentage: number }>;
  regionInfo?: Array<{ region: string; percentage: number }>;
}

export type MenuType = 'overview' | 'posts' | 'analytics';